<?php
// app/Http/Controllers/PedidoController.php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use App\Models\ConfigPago;
use App\Models\ConfigContacto;
use App\Models\Papelera;
use App\Models\Registro;
use App\Mail\PedidoRecibidoAdminMail;
use App\Mail\PedidoEnvioClienteMail;
use App\Mail\PedidoRechazadoClienteMail;
use App\Mail\AdminEntregaConfirmadaMail;
use App\Mail\ConfigPagoCambioMail;
use App\Mail\ConfigContactoCambioMail;
use App\Mail\HistorialLimpiadoMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class PedidoController extends Controller
{
    // ── Helper: convierte ruta relativa a URL completa ────────────
    private function storageUrl(?string $ruta): ?string
    {
        if (!$ruta) return null;
        if (str_starts_with($ruta, 'http')) return $ruta;
        return asset('storage/' . $ruta);
    }

    // ── CHECKOUT ─────────────────────────────────────────────────

    public function checkout(): Response
    {
        $metodosPago = ConfigPago::where('activo', true)->get()->map(fn($m) => [
            'id'     => $m->metodo,
            'label'  => $m->metodo,
            'numero' => $m->numero,
            'qr_url' => $m->qr_url,
        ]);

        $contactoRaw = ConfigContacto::all()->pluck('valor', 'clave');
        $contacto = [
            'telefono1' => $contactoRaw['telefono1'] ?? '',
            'telefono2' => $contactoRaw['telefono2'] ?? '',
            'correo1'   => $contactoRaw['correo1']   ?? '',
            'correo2'   => $contactoRaw['correo2']   ?? '',
        ];

        return Inertia::render('Cliente/Checkout', [
            'metodosPago' => $metodosPago,
            'contacto'    => $contacto,
        ]);
    }

    // ── STORE: crear pedido y bajar stock inmediatamente ─────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_receptor'         => 'required|string|max:255',
            'telefono_receptor'       => 'required|string|max:50',
            'ciudad'                  => 'required|string|max:100',
            'direccion'               => 'required|string|max:500',
            'indicaciones'            => 'nullable|string|max:500',
            'metodo_pago'             => 'required|in:Nequi,Daviplata,Bancolombia,Davivienda',
            'comprobante_pago'        => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'email_cliente'           => 'nullable|email|max:255',
            'items'                   => 'required|array|min:1',
            'items.*.producto_id'     => 'required|exists:productos,id',
            'items.*.cantidad'        => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
            'items.*.talla'           => 'nullable|string|max:20',
        ]);

        DB::beginTransaction();
        try {
            $subtotal = collect($validated['items'])->sum(fn($i) => $i['cantidad'] * $i['precio_unitario']);
            $maxId    = DB::table('pedidos')->lockForUpdate()->max('id') ?? 0;
            $numero   = 'PED-' . str_pad($maxId + 1, 6, '0', STR_PAD_LEFT);

            $rutaComprobante = $request->file('comprobante_pago')->store('comprobantes', 'public');

            $pedido = Pedido::create([
                'user_id'           => auth()->id(),
                'numero_pedido'     => $numero,
                'nombre_receptor'   => $validated['nombre_receptor'],
                'telefono_receptor' => $validated['telefono_receptor'],
                'ciudad'            => $validated['ciudad'],
                'direccion'         => $validated['direccion'],
                'indicaciones'      => $validated['indicaciones'] ?? null,
                'metodo_pago'       => $validated['metodo_pago'],
                'comprobante_pago'  => $rutaComprobante,
                'subtotal'          => $subtotal,
                'total'             => $subtotal,
                'estado'            => 'revision',
                'stock_descontado'  => true,
                'email_cliente'     => $validated['email_cliente'] ?? auth()->user()?->email,
            ]);

            foreach ($validated['items'] as $item) {
                $producto = Producto::with('tallas')->lockForUpdate()->find($item['producto_id']);
                $talla    = isset($item['talla']) ? strtoupper(trim($item['talla'])) : null;

                PedidoItem::create([
                    'pedido_id'       => $pedido->id,
                    'producto_id'     => $item['producto_id'],
                    'talla'           => $producto?->maneja_tallas ? $talla : null,
                    'nombre_producto' => $producto?->nombre ?? 'Producto',
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal'        => $item['cantidad'] * $item['precio_unitario'],
                    'imagen_producto' => $producto?->imagen,
                ]);

                if ($producto) {
                    if ($producto->maneja_tallas && $talla) {
                        $tallaModel = $producto->tallas->firstWhere('talla', $talla);
                        if ($tallaModel) {
                            $nuevoStock = max(0, $tallaModel->stock - $item['cantidad']);
                            $tallaModel->update(['stock' => $nuevoStock]);
                        }
                    } else {
                        $nuevoStock = max(0, $producto->stock - $item['cantidad']);
                        $producto->update(['stock' => $nuevoStock]);
                    }
                }
            }

            DB::commit();

            $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->send(new PedidoRecibidoAdminMail($pedido));
            }

            Registro::registrar('crear', 'pedidos',
                "Nuevo pedido {$numero} — Total: $" . number_format($subtotal, 0, ',', '.') .
                " | Método: {$validated['metodo_pago']} | Por: " . auth()->user()?->name,
                $pedido
            );

            return redirect()->route('cliente.pedido.confirmacion', $pedido->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al procesar el pedido: ' . $e->getMessage()]);
        }
    }

    // ── CONFIRMACIÓN ─────────────────────────────────────────────

    public function confirmacion(string $pedidoId): Response
    {
        $pedido = Pedido::with('items')->findOrFail($pedidoId);

        return Inertia::render('Cliente/Confirmacion', [
            'pedido' => [
                'id'            => $pedido->id,
                'numero_pedido' => $pedido->numero_pedido,
                'estado'        => $pedido->estado,
                'estado_label'  => $pedido->estado_label,
                'total'         => $pedido->total,
                'metodo_pago'   => $pedido->metodo_pago,
                'created_at'    => $pedido->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }

    // ── MIS PEDIDOS ───────────────────────────────────────────────

    public function misPedidos(): Response
    {
        $pedidos = Pedido::with('items')
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($p) => [
                'id'              => $p->id,
                'numero_pedido'   => $p->numero_pedido,
                'estado'          => $p->estado,
                'estado_label'    => $p->estado_label,
                'estado_color'    => $p->estado_color,
                'total'           => $p->total,
                'metodo_pago'     => $p->metodo_pago,
                'ciudad'          => $p->ciudad,
                'created_at'      => $p->created_at->format('d/m/Y H:i'),
                'items_count'     => $p->items->count(),
                'items'           => $p->items->map(fn($i) => [
                    'nombre'          => $i->nombre_producto,
                    'talla'           => $i->talla,
                    'cantidad'        => $i->cantidad,
                    'precio_unitario' => $i->precio_unitario,
                    'imagen'          => $this->storageUrl($i->imagen_producto),
                ]),
                'motivo_rechazo'  => $p->motivo_rechazo,
                'mensaje_rechazo' => $p->mensaje_rechazo,
            ]);

        $contactoRaw = ConfigContacto::all()->pluck('valor', 'clave');

        return Inertia::render('Cliente/MisPedidos', [
            'pedidos'  => $pedidos,
            'contacto' => $contactoRaw,
        ]);
    }

    // ── CONFIRMAR ENTREGA (cliente) ───────────────────────────────

    public function confirmarEntrega(string $pedidoId)
    {
        $pedido = Pedido::where('user_id', auth()->id())
            ->where('estado', 'envio_curso')
            ->findOrFail($pedidoId);

        $pedido->update(['estado' => 'entregado']);

        $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
        if (!empty($adminEmails)) {
            Mail::to($adminEmails)->send(new AdminEntregaConfirmadaMail($pedido));
        }

        Registro::registrar('confirmar_entrega', 'pedidos',
            "Pedido {$pedido->numero_pedido} confirmado como entregado por " . auth()->user()->name,
            $pedido
        );

        return back()->with('success', '¡Gracias! Has confirmado la recepción de tu pedido.');
    }

    // ── ADMIN: listar pedidos ─────────────────────────────────────

    public function adminIndex(Request $request): Response
    {
        $query = Pedido::with(['items', 'user'])->orderByDesc('created_at');

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }
        if ($request->filled('buscar')) {
            $b = $request->buscar;
            $query->where(function ($q) use ($b) {
                $q->where('numero_pedido', 'like', "%{$b}%")
                    ->orWhere('nombre_receptor', 'like', "%{$b}%")
                    ->orWhere('telefono_receptor', 'like', "%{$b}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$b}%"));
            });
        }

        $pedidosPaginados = $query->paginate(20)->withQueryString();

        $pedidos = $pedidosPaginados->through(fn($p) => [
            'id'              => $p->id,
            'numero_pedido'   => $p->numero_pedido,
            'estado'          => $p->estado,
            'estado_label'    => $p->estado_label,
            'estado_color'    => $p->estado_color,
            'nombre_cliente'  => $p->nombre_cliente,
            'email_cliente'   => $p->email,
            'telefono'        => $p->telefono_receptor,
            'ciudad'          => $p->ciudad,
            'direccion'       => $p->direccion,
            'indicaciones'    => $p->indicaciones,
            'metodo_pago'     => $p->metodo_pago,
            'comprobante'     => $this->storageUrl($p->comprobante_pago),
            'total'           => $p->total,
            'notas_admin'     => $p->notas_admin,
            'motivo_rechazo'  => $p->motivo_rechazo,
            'mensaje_rechazo' => $p->mensaje_rechazo,
            'created_at'      => $p->created_at->format('d/m/Y H:i'),
            'items'           => $p->items->map(fn($i) => [
                'nombre'          => $i->nombre_producto,
                'talla'           => $i->talla,
                'cantidad'        => $i->cantidad,
                'precio_unitario' => $i->precio_unitario,
                'subtotal'        => $i->subtotal,
                'imagen'          => $this->storageUrl($i->imagen_producto),
            ]),
        ]);

        $conteos = [
            'revision'    => Pedido::where('estado', 'revision')->count(),
            'aprobado'    => Pedido::where('estado', 'aprobado')->count(),
            'envio_curso' => Pedido::where('estado', 'envio_curso')->count(),
            'entregado'   => Pedido::where('estado', 'entregado')->count(),
            'rechazado'   => Pedido::where('estado', 'rechazado')->count(),
        ];

        $metodosPago = ConfigPago::all()->map(fn($m) => [
            'id'     => $m->id,
            'metodo' => $m->metodo,
            'numero' => $m->numero,
            'qr_url' => $this->storageUrl($m->qr_imagen), // <- consistente para Admin
            'activo' => $m->activo,
        ]);

        $contacto = ConfigContacto::all()->pluck('valor', 'clave');

        return Inertia::render('Admin/Pedidos', [
            'pedidos'     => $pedidos,
            'conteos'     => $conteos,
            'filtro'      => $request->estado ?? '',
            'buscar'      => $request->buscar ?? '',
            'metodosPago' => $metodosPago,
            'contacto'    => $contacto,
        ]);
    }

    // ── ADMIN: cambiar estado con contraseña obligatoria ─────────

    public function adminCambiarEstado(Request $request, string $pedidoId)
    {
        $request->validate([
            'estado'          => 'required|in:aprobado,envio_curso,entregado,rechazado,cancelado',
            'password'        => 'required|string',
            'notas_admin'     => 'nullable|string|max:500',
            'motivo_rechazo'  => 'nullable|string|max:255',
            'mensaje_rechazo' => 'nullable|string|max:1000',
        ]);

        if (!Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $pedido         = Pedido::with(['user', 'items'])->findOrFail($pedidoId);
        $estadoAnterior = $pedido->estado;

        $datosActualizar = [
            'estado'      => $request->estado,
            'notas_admin' => $request->notas_admin ?? $pedido->notas_admin,
        ];

        if ($request->estado === 'rechazado') {
            $datosActualizar['motivo_rechazo']  = $request->motivo_rechazo;
            $datosActualizar['mensaje_rechazo'] = $request->mensaje_rechazo;
        }

        if ($request->estado === 'rechazado' && $pedido->stock_descontado) {
            DB::beginTransaction();
            try {
                foreach ($pedido->items as $item) {
                    $producto = Producto::with('tallas')->find($item->producto_id);
                    if (!$producto) continue;
                    $talla = $item->talla;
                    if ($producto->maneja_tallas && $talla) {
                        $tallaModel = $producto->tallas->firstWhere('talla', $talla);
                        if ($tallaModel) $tallaModel->increment('stock', $item->cantidad);
                    } else {
                        $producto->increment('stock', $item->cantidad);
                    }
                }
                $datosActualizar['stock_descontado'] = false;
                $pedido->update($datosActualizar);
                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                return back()->withErrors(['error' => 'Error al devolver stock: ' . $e->getMessage()]);
            }
        } else {
            $pedido->update($datosActualizar);
        }

        $emailCliente = $pedido->email;

        if ($request->estado === 'envio_curso' && $emailCliente) {
            Mail::to($emailCliente)->send(new PedidoEnvioClienteMail($pedido->fresh()));
        }

        if ($request->estado === 'rechazado' && $emailCliente) {
            $contacto = ConfigContacto::all()->pluck('valor', 'clave');
            Mail::to($emailCliente)->send(new PedidoRechazadoClienteMail($pedido->fresh(), $contacto));
        }

        Registro::registrar('cambiar_estado_pedido', 'pedidos',
            "Pedido {$pedido->numero_pedido}: '{$estadoAnterior}' → '{$request->estado}' por " . auth()->user()->name,
            $pedido,
            ['estado' => $estadoAnterior],
            ['estado' => $request->estado]
        );

        return back()->with('success', "Pedido {$pedido->numero_pedido} actualizado.");
    }

    // ── ADMIN: actualizar datos de pago ───────────────────────────

    public function actualizarPago(Request $request, string $pagoId)
    {
        $request->validate([
            'numero'      => 'nullable|string|max:100',
            'qr_imagen'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
            'eliminar_qr' => 'nullable|boolean',
        ]);

        $configPago = ConfigPago::findOrFail($pagoId);
        $cambios    = [];

        if ($request->filled('numero') && $request->numero !== $configPago->numero) {
            $cambios[] = "Número cambiado: '{$configPago->numero}' → '{$request->numero}'";
            $configPago->numero = $request->numero;
        }

        if ($request->boolean('eliminar_qr') && $configPago->qr_imagen) {
            Storage::disk('public')->delete($configPago->qr_imagen);
            $cambios[] = "QR eliminado";
            $configPago->qr_imagen = null;
        }

        if ($request->hasFile('qr_imagen')) {
            if ($configPago->qr_imagen) {
                Storage::disk('public')->delete($configPago->qr_imagen);
            }
            $ruta = $request->file('qr_imagen')->store('pagos_qr', 'public');
            $configPago->qr_imagen = $ruta;
            $cambios[] = "QR actualizado";
        }

        $configPago->save();

        if (!empty($cambios)) {
            $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->send(new ConfigPagoCambioMail(
                    $configPago->metodo,
                    $cambios,
                    auth()->user()->name
                ));
            }
        }

        return back()->with('success', "Datos de {$configPago->metodo} actualizados.");
    }

    // ── ADMIN: actualizar datos de contacto ───────────────────────

    public function actualizarContacto(Request $request)
    {
        $request->validate([
            'telefono1' => 'nullable|string|max:20',
            'telefono2' => 'nullable|string|max:20',
            'correo1'   => 'nullable|email|max:100',
            'correo2'   => 'nullable|email|max:100',
        ]);

        $campos  = ['telefono1', 'telefono2', 'correo1', 'correo2'];
        $cambios = [];

        foreach ($campos as $campo) {
            $valorAnterior = ConfigContacto::where('clave', $campo)->value('valor') ?? '';
            $valorNuevo    = $request->input($campo, '');

            if ($valorAnterior !== $valorNuevo) {
                $cambios[] = "{$campo}: '{$valorAnterior}' → '{$valorNuevo}'";
            }

            ConfigContacto::updateOrCreate(
                ['clave' => $campo],
                ['valor' => $valorNuevo]
            );
        }

        if (!empty($cambios)) {
            $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->send(new ConfigContactoCambioMail(
                    $cambios,
                    auth()->user()->name
                ));
            }
        }

        return back()->with('success', 'Datos de contacto actualizados.');
    }

    // ── ADMIN: eliminar historial >1 mes a papelera ───────────────

    public function eliminarHistorial(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $unMesAtras = Carbon::now()->subMonth();

        $pedidos = Pedido::whereIn('estado', ['entregado', 'rechazado', 'cancelado'])
            ->where('created_at', '<', $unMesAtras)
            ->get();

        $total = $pedidos->count();

        foreach ($pedidos as $pedido) {
            Papelera::archivar('pedido', $pedido, $pedido->numero_pedido, auth()->user()->name);
            $pedido->delete();
        }

        if ($total > 0) {
            $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->send(new HistorialLimpiadoMail(
                    $total,
                    auth()->user()->name
                ));
            }
        }

        Registro::registrar('eliminar_historial', 'pedidos',
            "{$total} pedidos históricos movidos a papelera por " . auth()->user()->name
        );

        return back()->with('success', "{$total} pedido(s) movidos a la papelera.");
    }
}
