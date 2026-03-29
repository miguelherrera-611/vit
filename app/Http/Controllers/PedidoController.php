<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use App\Models\Registro;
use App\Mail\PedidoRecibidoAdminMail;
use App\Mail\PedidoEnvioClienteMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PedidoController extends Controller
{
    // ── CHECKOUT: mostrar formulario ──────────────────────────────

    public function checkout(): Response
    {
        return Inertia::render('Cliente/Checkout');
    }

    // ── STORE: crear pedido con comprobante ───────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_receptor'   => 'required|string|max:255',
            'telefono_receptor' => 'required|string|max:50',
            'ciudad'            => 'required|string|max:100',
            'direccion'         => 'required|string|max:500',
            'indicaciones'      => 'nullable|string|max:500',
            'metodo_pago'       => 'required|in:Nequi,Daviplata,Bancolombia,Davivienda',
            'comprobante_pago'  => 'required|file|mimes:jpg,jpeg,png,webp,pdf|max:5120',
            'email_cliente'     => 'nullable|email|max:255',
            'items'             => 'required|array|min:1',
            'items.*.producto_id'    => 'required|exists:productos,id',
            'items.*.cantidad'       => 'required|integer|min:1',
            'items.*.precio_unitario'=> 'required|numeric|min:0',
        ], [
            'comprobante_pago.required' => 'Debes adjuntar el comprobante de pago.',
            'comprobante_pago.mimes'    => 'El comprobante debe ser una imagen (JPG, PNG, WEBP) o PDF.',
            'items.required'            => 'El carrito no puede estar vacío.',
        ]);

        DB::beginTransaction();
        try {
            // Calcular totales
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['cantidad'] * $item['precio_unitario'];
            }

            // Generar número de pedido
            $maxId  = DB::table('pedidos')->lockForUpdate()->max('id') ?? 0;
            $numero = 'PED-' . str_pad($maxId + 1, 6, '0', STR_PAD_LEFT);

            // Guardar comprobante
            $rutaComprobante = $request->file('comprobante_pago')
                ->store('comprobantes', 'public');

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
                'email_cliente'     => $validated['email_cliente'] ?? auth()->user()?->email,
            ]);

            foreach ($validated['items'] as $item) {
                $producto = Producto::find($item['producto_id']);
                PedidoItem::create([
                    'pedido_id'        => $pedido->id,
                    'producto_id'      => $item['producto_id'],
                    'nombre_producto'  => $producto?->nombre ?? 'Producto',
                    'cantidad'         => $item['cantidad'],
                    'precio_unitario'  => $item['precio_unitario'],
                    'subtotal'         => $item['cantidad'] * $item['precio_unitario'],
                    'imagen_producto'  => $producto?->imagen,
                ]);
            }

            DB::commit();

            // Notificar al admin por correo
            $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
            if (!empty($adminEmails)) {
                Mail::to($adminEmails)->send(new PedidoRecibidoAdminMail($pedido));
            }

            // Registro de auditoría
            Registro::registrar(
                'crear',
                'pedidos',
                "Nuevo pedido {$numero} creado por " . (auth()->user()?->name ?? $validated['nombre_receptor'])
                . " | Total: $" . number_format($subtotal, 0, ',', '.')
                . " | Método: {$validated['metodo_pago']}",
                $pedido
            );

            return redirect()->route('cliente.pedido.confirmacion', $pedido->id);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al procesar el pedido: ' . $e->getMessage()]);
        }
    }

    // ── CONFIRMACIÓN: página de éxito ─────────────────────────────

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

    // ── MIS PEDIDOS: historial del cliente ────────────────────────

    public function misPedidos(): Response
    {
        $pedidos = Pedido::with('items')
            ->where('user_id', auth()->id())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'numero_pedido' => $p->numero_pedido,
                'estado'        => $p->estado,
                'estado_label'  => $p->estado_label,
                'estado_color'  => $p->estado_color,
                'total'         => $p->total,
                'metodo_pago'   => $p->metodo_pago,
                'ciudad'        => $p->ciudad,
                'created_at'    => $p->created_at->format('d/m/Y H:i'),
                'items_count'   => $p->items->count(),
                'items'         => $p->items->map(fn($i) => [
                    'nombre'          => $i->nombre_producto,
                    'cantidad'        => $i->cantidad,
                    'precio_unitario' => $i->precio_unitario,
                    'imagen'          => $i->imagen_producto,
                ]),
            ]);

        return Inertia::render('Cliente/MisPedidos', [
            'pedidos' => $pedidos,
        ]);
    }

    // ── CONFIRMAR ENTREGA: cliente dice que recibió ───────────────

    public function confirmarEntrega(string $pedidoId)
    {
        $pedido = Pedido::where('user_id', auth()->id())
            ->where('estado', 'envio_curso')
            ->findOrFail($pedidoId);

        $pedido->update(['estado' => 'entregado']);

        Registro::registrar(
            'confirmar_entrega',
            'pedidos',
            "Pedido {$pedido->numero_pedido} confirmado como entregado por el cliente " . auth()->user()->name,
            $pedido
        );

        return back()->with('success', '¡Gracias! Has confirmado la recepción de tu pedido.');
    }

    // ── ADMIN: listar todos los pedidos ──────────────────────────

    public function adminIndex(Request $request): Response
    {
        $query = Pedido::with(['items', 'user'])->orderByDesc('created_at');

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $pedidos = $query->get()->map(fn($p) => [
            'id'             => $p->id,
            'numero_pedido'  => $p->numero_pedido,
            'estado'         => $p->estado,
            'estado_label'   => $p->estado_label,
            'estado_color'   => $p->estado_color,
            'nombre_cliente' => $p->nombre_cliente,
            'email_cliente'  => $p->email,
            'telefono'       => $p->telefono_receptor,
            'ciudad'         => $p->ciudad,
            'direccion'      => $p->direccion,
            'indicaciones'   => $p->indicaciones,
            'metodo_pago'    => $p->metodo_pago,
            'comprobante'    => $p->comprobante_pago
                ? asset('storage/' . $p->comprobante_pago)
                : null,
            'total'          => $p->total,
            'notas_admin'    => $p->notas_admin,
            'created_at'     => $p->created_at->format('d/m/Y H:i'),
            'items'          => $p->items->map(fn($i) => [
                'nombre'          => $i->nombre_producto,
                'cantidad'        => $i->cantidad,
                'precio_unitario' => $i->precio_unitario,
                'subtotal'        => $i->subtotal,
                'imagen'          => $i->imagen_producto,
            ]),
        ]);

        $conteos = [
            'revision'    => Pedido::where('estado', 'revision')->count(),
            'aprobado'    => Pedido::where('estado', 'aprobado')->count(),
            'envio_curso' => Pedido::where('estado', 'envio_curso')->count(),
            'entregado'   => Pedido::where('estado', 'entregado')->count(),
            'rechazado'   => Pedido::where('estado', 'rechazado')->count(),
        ];

        return Inertia::render('Admin/Pedidos', [
            'pedidos' => $pedidos,
            'conteos' => $conteos,
            'filtro'  => $request->estado ?? '',
        ]);
    }

    // ── ADMIN: cambiar estado de un pedido ───────────────────────

    public function adminCambiarEstado(Request $request, string $pedidoId)
    {
        $request->validate([
            'estado'      => 'required|in:aprobado,envio_curso,entregado,rechazado,cancelado',
            'notas_admin' => 'nullable|string|max:500',
        ]);

        $pedido         = Pedido::with('user')->findOrFail($pedidoId);
        $estadoAnterior = $pedido->estado;

        $pedido->update([
            'estado'      => $request->estado,
            'notas_admin' => $request->notas_admin ?? $pedido->notas_admin,
        ]);

        // Enviar correo al cliente cuando pasa a "envío en curso"
        if ($request->estado === 'envio_curso') {
            $emailDestino = $pedido->email;
            if ($emailDestino) {
                Mail::to($emailDestino)->send(new PedidoEnvioClienteMail($pedido));
            }
        }

        Registro::registrar(
            'cambiar_estado_pedido',
            'pedidos',
            "Pedido {$pedido->numero_pedido}: estado cambiado de '{$estadoAnterior}' a '{$request->estado}' por " . auth()->user()->name,
            $pedido,
            ['estado' => $estadoAnterior],
            ['estado' => $request->estado]
        );

        return back()->with('success', "Pedido {$pedido->numero_pedido} actualizado a: " . $pedido->fresh()->estado_label);
    }
}
