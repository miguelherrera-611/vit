<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

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
        $productos = Producto::activos()->where('stock', '>', 0)->orderBy('nombre')->get();
        $clientes  = Cliente::activos()->orderBy('nombre')->get();

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
            'clientes'  => $clientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id'  => 'nullable|exists:clientes,id',
            'tipo_venta'  => 'required|in:Contado,Separado,Crédito',
            'metodo_pago' => 'required|in:Efectivo,Tarjeta,Transferencia,Mixto',
            'pagado'      => 'required|numeric|min:0',
            'descuento'   => 'nullable|numeric|min:0',
            'notas'       => 'nullable|string',
            'items'       => 'required|array|min:1',
            'items.*.producto_id'     => 'required|exists:productos,id',
            'items.*.cantidad'        => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $subtotal  = 0;
            $descuento = $validated['descuento'] ?? 0;

            foreach ($validated['items'] as $item) {
                $subtotal += $item['cantidad'] * $item['precio_unitario'];
            }

            $total           = $subtotal - $descuento;
            $pagado          = $validated['pagado'];
            $saldoPendiente  = max(0, $total - $pagado);

            // Determinar estado
            $estado = 'Completada';
            if ($saldoPendiente > 0) {
                $estado = $pagado > 0 ? 'Pendiente' : 'Pendiente';
            }

            // Generar número de venta
            $ultimo = Venta::orderBy('id', 'desc')->first();
            $numero = 'V-' . str_pad(($ultimo ? $ultimo->id + 1 : 1), 6, '0', STR_PAD_LEFT);

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
            ]);

            foreach ($validated['items'] as $item) {
                VentaDetalle::create([
                    'venta_id'        => $venta->id,
                    'producto_id'     => $item['producto_id'],
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal'        => $item['cantidad'] * $item['precio_unitario'],
                ]);

                // Descontar stock
                $producto = Producto::find($item['producto_id']);
                $producto->decrement('stock', $item['cantidad']);
            }

            // Si hay abono inicial en separado/crédito
            if ($pagado > 0 && in_array($validated['tipo_venta'], ['Separado', 'Crédito'])) {
                $venta->abonos()->create([
                    'monto'       => $pagado,
                    'forma_pago'  => $validated['metodo_pago'],
                    'empleado_id' => auth()->id(),
                    'observaciones' => 'Pago inicial',
                ]);
            }

            DB::commit();

            return redirect()->route('ventas.index')
                ->with('success', 'Venta registrada exitosamente. Número: ' . $numero);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar la venta: ' . $e->getMessage()]);
        }
    }
}
