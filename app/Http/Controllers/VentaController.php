<?php
// app/Http/Controllers/VentaController.php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\ProductoTalla;
use App\Models\Cliente;
use App\Models\Abono;
use App\Models\Registro;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class VentaController extends Controller
{
    public function index(): Response
    {
        $ventas = Venta::with([
            'cliente',
            'detalles.producto',
            'abonos',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Ventas/Index', [
            'ventas' => $ventas,
        ]);
    }

    public function create(): Response
    {
        $productos = Producto::with('tallas')->activos()->orderBy('nombre')->get()
            ->filter(fn($p) => $p->stock_total > 0)
            ->map(fn($p) => [
                'id'            => $p->id,
                'nombre'        => $p->nombre,
                'precio'        => $p->precio,
                'stock'         => $p->stock,
                'stock_total'   => $p->stock_total,
                'maneja_tallas' => $p->maneja_tallas,
                'imagen'        => $p->imagen,
                'tallas'        => $p->maneja_tallas
                    ? $p->tallas->where('stock', '>', 0)->map(fn($t) => [
                        'id'    => $t->id,
                        'talla' => $t->talla,
                        'stock' => $t->stock,
                    ])->values()
                    : [],
            ])->values();

        $clientes = Cliente::activos()->orderBy('nombre')->get();

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
            'clientes'  => $clientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id'              => 'nullable|exists:clientes,id',
            'tipo_venta'              => 'required|in:Contado,Separado,Crédito',
            'metodo_pago'             => 'required|in:Efectivo,Tarjeta,Transferencia,Mixto',
            'pagado'                  => 'required|numeric|min:0',
            'descuento'               => 'nullable|numeric|min:0',
            'notas'                   => 'nullable|string',
            'fecha_limite'            => 'nullable|date|after:today',
            'items'                   => 'required|array|min:1',
            'items.*.producto_id'     => 'required|exists:productos,id',
            'items.*.cantidad'        => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
            'items.*.talla'           => 'nullable|string|max:20',
        ], [
            'fecha_limite.after' => 'La fecha límite debe ser posterior a hoy.',
        ]);

        if (in_array($validated['tipo_venta'], ['Separado', 'Crédito']) && empty($validated['cliente_id'])) {
            return back()->withErrors(['cliente_id' => 'Las ventas a crédito o separado requieren un cliente registrado.']);
        }

        $subtotal  = 0;
        $descuento = $validated['descuento'] ?? 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['cantidad'] * $item['precio_unitario'];
        }
        $total          = $subtotal - $descuento;
        $pagado         = $validated['pagado'];
        $saldoPendiente = max(0, $total - $pagado);

        // NUEVO: contado no permite saldo pendiente (aplica para cualquier cliente)
        if ($validated['tipo_venta'] === 'Contado' && $saldoPendiente > 0) {
            return back()->withErrors([
                'pagado' => 'Esta venta no puede registrarse como Contado porque el pago es menor al total. Selecciona Separado o Crédito, o completa el pago total (' . number_format($total, 0, ',', '.') . ').',
            ]);
        }

        DB::beginTransaction();

        try {
            // Verificar stock suficiente with lockForUpdate
            $erroresStock          = [];
            $productosEnTransaccion = [];

            foreach ($validated['items'] as $item) {
                $producto = Producto::with('tallas')->lockForUpdate()->find($item['producto_id']);

                if (!$producto) {
                    $erroresStock[] = "Uno de los productos ya no existe en el sistema.";
                    continue;
                }

                $talla = isset($item['talla']) ? strtoupper(trim($item['talla'])) : null;

                if ($producto->maneja_tallas && $talla) {
                    $tallaModel = $producto->tallas->firstWhere('talla', $talla);
                    $stockDisp  = $tallaModel ? $tallaModel->stock : 0;
                    if ($stockDisp < $item['cantidad']) {
                        $erroresStock[] = "Stock insuficiente para \"{$producto->nombre}\" talla {$talla}: "
                            . "disponible {$stockDisp}, solicitado {$item['cantidad']}.";
                    }
                } elseif (!$producto->maneja_tallas) {
                    if ($producto->stock < $item['cantidad']) {
                        $erroresStock[] = "Stock insuficiente para \"{$producto->nombre}\": "
                            . "disponible {$producto->stock}, solicitado {$item['cantidad']}.";
                    }
                }

                $productosEnTransaccion[$item['producto_id']] = $producto;
            }

            if (!empty($erroresStock)) {
                DB::rollBack();
                return back()->withErrors(['items' => implode(' | ', $erroresStock)]);
            }

            $estado = $saldoPendiente > 0 ? 'Pendiente' : 'Completada';

            $fechaLimite = $validated['fecha_limite'] ?? null;
            if (!$fechaLimite && $validated['tipo_venta'] === 'Separado') {
                $fechaLimite = Carbon::now()->addDays(30)->toDateString();
            } elseif (!$fechaLimite && $validated['tipo_venta'] === 'Crédito') {
                $fechaLimite = Carbon::now()->addDays(60)->toDateString();
            }

            $maxId  = DB::table('ventas')->lockForUpdate()->max('id') ?? 0;
            $numero = 'V-' . str_pad($maxId + 1, 6, '0', STR_PAD_LEFT);

            $venta = Venta::create([
                'cliente_id'      => $validated['cliente_id'],
                'user_id'         => auth()->id(),
                'numero_venta'    => $numero,
                'tipo_venta'      => $validated['tipo_venta'],
                'metodo_pago'     => $validated['metodo_pago'],
                'forma_pago'      => $validated['metodo_pago'],
                'subtotal'        => $subtotal,
                'impuesto'        => 0,
                'descuento'       => $descuento,
                'total'           => $total,
                'pagado'          => $pagado,
                'saldo_pendiente' => $saldoPendiente,
                'estado'          => $estado,
                'notas'           => $validated['notas'] ?? null,
                'fecha_limite'    => $fechaLimite,
            ]);

            $productosVendidos = [];
            foreach ($validated['items'] as $item) {
                $producto = $productosEnTransaccion[$item['producto_id']];
                $talla    = isset($item['talla']) ? strtoupper(trim($item['talla'])) : null;

                VentaDetalle::create([
                    'venta_id'        => $venta->id,
                    'producto_id'     => $item['producto_id'],
                    'talla'           => $producto->maneja_tallas ? $talla : null,
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal'        => $item['cantidad'] * $item['precio_unitario'],
                ]);

                if ($producto->maneja_tallas && $talla) {
                    $tallaModel        = $producto->tallas->firstWhere('talla', $talla);
                    $stockAnteriorTotal = $producto->stock_total;
                    ProductoTalla::where('id', $tallaModel->id)->decrement('stock', $item['cantidad']);
                    $stockTotalNuevo = $stockAnteriorTotal - $item['cantidad'];
                    MovimientoInventario::registrar(
                        producto:      $producto,
                        stockAnterior: $stockAnteriorTotal,
                        stockNuevo:    $stockTotalNuevo,
                        tipo:          'venta',
                        motivo:        "Venta {$numero} | Talla: {$talla}",
                        observaciones: null,
                        referencia:    $venta,
                    );
                } else {
                    $stockAnterior = $producto->stock;
                    $producto->decrement('stock', $item['cantidad']);
                    $stockNuevo = $producto->fresh()->stock;
                    MovimientoInventario::registrar(
                        producto:      $producto,
                        stockAnterior: $stockAnterior,
                        stockNuevo:    $stockNuevo,
                        tipo:          'venta',
                        motivo:        "Venta {$numero}",
                        observaciones: null,
                        referencia:    $venta,
                    );
                }

                $productosVendidos[] = [
                    'nombre'          => $producto->nombre,
                    'talla'           => $talla,
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal'        => $item['cantidad'] * $item['precio_unitario'],
                ];
            }

            if ($pagado > 0) {
                $venta->abonos()->create([
                    'monto'         => $pagado,
                    'forma_pago'    => $validated['metodo_pago'],
                    'empleado_id'   => auth()->id(),
                    'observaciones' => 'Pago inicial',
                ]);
            }

            DB::commit();

            $cliente = $validated['cliente_id']
                ? Cliente::find($validated['cliente_id'])?->nombre ?? 'Desconocido'
                : 'Cliente general';

            $descripcion = "Venta {$numero} registrada por " . auth()->user()->name
                . " | Cliente: {$cliente}"
                . " | Tipo: {$validated['tipo_venta']}"
                . " | Método de pago: {$validated['metodo_pago']}"
                . " | Subtotal: $" . number_format($subtotal, 0, ',', '.')
                . ($descuento > 0 ? " | Descuento: $" . number_format($descuento, 0, ',', '.') : '')
                . " | Total: $" . number_format($total, 0, ',', '.')
                . " | Pagado: $" . number_format($pagado, 0, ',', '.')
                . ($saldoPendiente > 0 ? " | Saldo pendiente: $" . number_format($saldoPendiente, 0, ',', '.') : '')
                . ($fechaLimite ? " | Fecha límite: {$fechaLimite}" : '')
                . " | Estado: {$estado}"
                . (! empty($validated['notas']) ? " | Notas: {$validated['notas']}" : '');

            Registro::registrar(
                'crear',
                'ventas',
                $descripcion,
                $venta,
                null,
                [
                    'numero_venta'    => $numero,
                    'cliente'         => $cliente,
                    'tipo_venta'      => $validated['tipo_venta'],
                    'metodo_pago'     => $validated['metodo_pago'],
                    'subtotal'        => $subtotal,
                    'descuento'       => $descuento,
                    'total'           => $total,
                    'pagado'          => $pagado,
                    'saldo_pendiente' => $saldoPendiente,
                    'estado'          => $estado,
                    'fecha_limite'    => $fechaLimite,
                    'notas'           => $validated['notas'] ?? null,
                    'productos'       => $productosVendidos,
                ]
            );

            return back()->with('success', 'Venta registrada. Número: ' . $numero)
                ->with('numero_venta', $numero)
                ->with('tipo_venta', $validated['tipo_venta'])
                ->with('total_venta', $total);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar la venta: ' . $e->getMessage()]);
        }
    }

    // ── ANULAR VENTA ─────────────────────────────────────────────

    public function anular(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! \Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $venta = Venta::with('detalles.producto', 'cliente')->findOrFail($id);

        if ($venta->estado === 'Cancelada') {
            return back()->withErrors(['error' => 'Esta venta ya está anulada.']);
        }

        DB::beginTransaction();
        try {
            $productosRestaurados = [];
            foreach ($venta->detalles as $detalle) {
                $producto = Producto::with('tallas')->find($detalle->producto_id);
                if ($producto) {
                    $talla = $detalle->talla;
                    if ($producto->maneja_tallas && $talla) {
                        $tallaModel = ProductoTalla::where('producto_id', $producto->id)
                            ->where('talla', $talla)->first();
                        if ($tallaModel) {
                            $stockAnteriorTotal = $producto->stock_total;
                            $tallaModel->increment('stock', $detalle->cantidad);
                            MovimientoInventario::registrar(
                                producto:      $producto,
                                stockAnterior: $stockAnteriorTotal,
                                stockNuevo:    $stockAnteriorTotal + $detalle->cantidad,
                                tipo:          'anulacion',
                                motivo:        "Anulación venta {$venta->numero_venta} | Talla: {$talla}",
                                observaciones: null,
                                referencia:    $venta,
                            );
                        }
                    } else {
                        $stockAnterior = $producto->stock;
                        $producto->increment('stock', $detalle->cantidad);
                        $stockNuevo = $producto->fresh()->stock;
                        MovimientoInventario::registrar(
                            producto:      $producto,
                            stockAnterior: $stockAnterior,
                            stockNuevo:    $stockNuevo,
                            tipo:          'anulacion',
                            motivo:        "Anulación venta {$venta->numero_venta}",
                            observaciones: null,
                            referencia:    $venta,
                        );
                    }

                    $productosRestaurados[] = [
                        'nombre'   => $producto->nombre,
                        'talla'    => $talla,
                        'cantidad' => $detalle->cantidad,
                    ];
                }
            }

            $estadoAnterior = $venta->estado;
            $venta->update(['estado' => 'Cancelada']);

            DB::commit();

            $descripcion = "Venta {$venta->numero_venta} ANULADA por " . auth()->user()->name
                . " | Cliente: " . ($venta->cliente?->nombre ?? 'Cliente general')
                . " | Estado anterior: {$estadoAnterior}"
                . " | Total: $" . number_format($venta->total, 0, ',', '.')
                . " | Stock restaurado para " . count($productosRestaurados) . " producto(s)";

            Registro::registrar(
                'anular',
                'ventas',
                $descripcion,
                $venta,
                ['estado' => $estadoAnterior],
                [
                    'estado'                => 'Cancelada',
                    'productos_restaurados' => $productosRestaurados,
                ]
            );

            return back()->with('success', "Venta {$venta->numero_venta} anulada. Stock restaurado.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al anular: ' . $e->getMessage()]);
        }
    }

    // ── CARTERA ───────────────────────────────────────────────────

    public function cartera(): Response
    {
        $ventas = Venta::with(['cliente', 'abonos'])
            ->whereIn('estado', ['Pendiente'])
            ->orderBy('fecha_limite')
            ->get()
            ->map(function ($v) {
                $fechaLimite = $v->fecha_limite ? Carbon::parse($v->fecha_limite) : null;
                $vencida  = $fechaLimite && $fechaLimite->isPast();
                $diasMora = $fechaLimite
                    ? max(0, (int) $fechaLimite->diffInDays(now(), false))
                    : 0;

                return [
                    'id'              => $v->id,
                    'numero_venta'    => $v->numero_venta,
                    'tipo_venta'      => $v->tipo_venta,
                    'cliente'         => $v->cliente?->nombre ?? 'Sin cliente',
                    'cliente_tel'     => $v->cliente?->telefono,
                    'total'           => $v->total,
                    'pagado'          => $v->pagado,
                    'saldo_pendiente' => $v->saldo_pendiente,
                    'fecha_limite'    => $fechaLimite ? $fechaLimite->format('d/m/Y') : null,
                    'estado'          => $v->estado,
                    'vencida'         => $vencida,
                    'dias_mora'       => $diasMora,
                    'created_at'      => $v->created_at->format('d/m/Y'),
                ];
            });

        $kpis = [
            'total_cartera'   => $ventas->sum('saldo_pendiente'),
            'clientes_deuda'  => $ventas->unique('cliente')->count(),
            'deudas_vencidas' => $ventas->where('vencida', true)->count(),
            'num_pendientes'  => $ventas->count(),
        ];

        return Inertia::render('Ventas/Cartera', [
            'ventas' => $ventas,
            'kpis'   => $kpis,
        ]);
    }
}
