<?php
// app/Http/Controllers/AbonoController.php

namespace App\Http\Controllers;

use App\Models\Abono;
use App\Models\Venta;
use App\Models\Cliente;
use App\Models\Registro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AbonoController extends Controller
{
    // ── INDEX: buscar cliente y ver sus deudas ────────────────────

    public function index(Request $request): Response
    {
        $busqueda = $request->get('cliente', '');
        $clientes = collect();

        if ($busqueda) {
            $clientes = Cliente::where('nombre', 'like', "%{$busqueda}%")
                ->orWhere('telefono', 'like', "%{$busqueda}%")
                ->orWhere('documento', 'like', "%{$busqueda}%")
                ->with([
                    'ventas' => fn($q) => $q->whereIn('estado', ['Pendiente'])->with('abonos'),
                ])
                ->get()
                ->map(fn($c) => [
                    'id'       => $c->id,
                    'nombre'   => $c->nombre,
                    'telefono' => $c->telefono,
                    'ventas'   => $c->ventas->map(fn($v) => [
                        'id'              => $v->id,
                        'numero_venta'    => $v->numero_venta,
                        'tipo_venta'      => $v->tipo_venta,
                        'total'           => $v->total,
                        'pagado'          => $v->pagado,
                        'saldo_pendiente' => $v->saldo_pendiente,
                        'fecha_limite'    => $v->fecha_limite,
                        'estado'          => $v->estado,
                        'created_at'      => $v->created_at->format('d/m/Y'),
                        'abonos'          => $v->abonos->map(fn($a) => [
                            'id'              => $a->id,
                            'monto'           => $a->monto,
                            'forma_pago'      => $a->forma_pago,
                            'observaciones'   => $a->observaciones,
                            'tipo_movimiento' => $a->tipo_movimiento,
                            'tipo_label'      => $a->tipo_movimiento_label,
                            'created_at'      => $a->created_at->format('d/m/Y H:i'),
                        ]),
                    ]),
                ]);
        }

        return Inertia::render('Abonos/Index', [
            'clientes' => $clientes,
            'busqueda' => $busqueda,
        ]);
    }

    // ── STORE: registrar un abono ─────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'venta_id'        => 'required|exists:ventas,id',
            'monto'           => 'required|numeric|min:0.01',
            'forma_pago'      => 'required|in:Efectivo,Tarjeta,Transferencia,Mixto',
            'observaciones'   => 'nullable|string|max:255',
            'tipo_movimiento' => 'nullable|in:abono_normal,ajuste',
        ]);

        // Solo admin puede registrar ajustes; cualquier otro intento se trata como abono normal
        $tipoMovimiento = 'abono_normal';
        if (($validated['tipo_movimiento'] ?? 'abono_normal') === 'ajuste' && auth()->user()->hasRole('admin')) {
            $tipoMovimiento = 'ajuste';
        }

        $venta = Venta::with('cliente')->findOrFail($validated['venta_id']);

        if ($venta->estado === 'Cancelada') {
            return back()->withErrors(['monto' => 'No se pueden registrar abonos en una venta cancelada.']);
        }

        if ($validated['monto'] > $venta->saldo_pendiente && $validated['monto'] > 0) {
            return back()->withErrors(['monto' => "El abono ($" . number_format($validated['monto'], 0, ',', '.') . ") supera el saldo pendiente ($" . number_format($venta->saldo_pendiente, 0, ',', '.') . ")."]);
        }

        DB::beginTransaction();
        try {
            $abono = $venta->abonos()->create([
                'monto'           => $validated['monto'],
                'forma_pago'      => $validated['forma_pago'],
                'empleado_id'     => auth()->id(),
                'observaciones'   => $validated['observaciones'],
                'tipo_movimiento' => $tipoMovimiento,
            ]);

            $saldoAnterior  = $venta->saldo_pendiente;
            $pagadoAnterior = $venta->pagado;
            $nuevoPagado    = $venta->pagado + $validated['monto'];
            $nuevoSaldo     = max(0, $venta->total - $nuevoPagado);
            $nuevoEstado    = $nuevoSaldo <= 0 ? 'Completada' : 'Pendiente';

            $venta->update([
                'pagado'          => $nuevoPagado,
                'saldo_pendiente' => $nuevoSaldo,
                'estado'          => $nuevoEstado,
            ]);

            DB::commit();

            // ── Registro de auditoría ────────────────────────────
            $cliente   = $venta->cliente?->nombre ?? 'Cliente general';
            $tipoLabel = $tipoMovimiento === 'ajuste' ? 'Ajuste' : 'Abono';

            $descripcion = "{$tipoLabel} de $" . number_format($validated['monto'], 0, ',', '.')
                . " en venta {$venta->numero_venta}"
                . " | Cliente: {$cliente}"
                . " | Forma de pago: {$validated['forma_pago']}"
                . " | Tipo: {$tipoLabel}"
                . " | Saldo anterior: $" . number_format($saldoAnterior, 0, ',', '.')
                . " | Nuevo saldo: $" . number_format($nuevoSaldo, 0, ',', '.')
                . " | Estado: {$nuevoEstado}"
                . " | Registrado por: " . auth()->user()->name
                . (! empty($validated['observaciones']) ? " | Observaciones: {$validated['observaciones']}" : '');

            Registro::registrar(
                'abonar',
                'abonos',
                $descripcion,
                $venta,
                [
                    'pagado'          => $pagadoAnterior,
                    'saldo_pendiente' => $saldoAnterior,
                    'estado'          => $venta->getOriginal('estado') ?? 'Pendiente',
                ],
                [
                    'monto_abonado'   => $validated['monto'],
                    'forma_pago'      => $validated['forma_pago'],
                    'tipo_movimiento' => $tipoMovimiento,
                    'observaciones'   => $validated['observaciones'] ?? null,
                    'pagado_total'    => $nuevoPagado,
                    'saldo_pendiente' => $nuevoSaldo,
                    'estado'          => $nuevoEstado,
                    'venta'           => $venta->numero_venta,
                    'cliente'         => $cliente,
                ]
            );

            $msg = $nuevoEstado === 'Completada'
                ? "¡Venta {$venta->numero_venta} pagada en su totalidad!"
                : "{$tipoLabel} registrado. Saldo pendiente: $" . number_format($nuevoSaldo, 0, ',', '.');

            return back()->with('success', $msg);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al registrar abono: ' . $e->getMessage()]);
        }
    }

    // ── EXTENDER PLAZO (solo admin) ───────────────────────────────

    public function extenderPlazo(Request $request, string $ventaId)
    {
        $request->validate([
            'fecha_limite' => 'required|date|after:today',
        ]);

        $venta = Venta::with('cliente')->findOrFail($ventaId);
        $fechaAnterior = $venta->fecha_limite;
        $venta->update(['fecha_limite' => $request->fecha_limite]);

        $descripcion = "Plazo extendido en venta {$venta->numero_venta}"
            . " | Cliente: " . ($venta->cliente?->nombre ?? 'Sin cliente')
            . " | Fecha anterior: {$fechaAnterior}"
            . " | Nueva fecha: {$request->fecha_limite}"
            . " | Por: " . auth()->user()->name;

        Registro::registrar(
            'extender_plazo',
            'ventas',
            $descripcion,
            $venta,
            ['fecha_limite' => $fechaAnterior],
            ['fecha_limite' => $request->fecha_limite]
        );

        return back()->with('success', 'Plazo extendido hasta ' . \Carbon\Carbon::parse($request->fecha_limite)->format('d/m/Y') . '.');
    }

    // ── HISTORIAL de abonos de una venta ─────────────────────────

    public function historial(string $ventaId): Response
    {
        $venta = Venta::with([
            'cliente',
            'abonos' => fn($q) => $q->orderByDesc('created_at'),
            'abonos.empleado',
            'detalles.producto',
        ])->findOrFail($ventaId);

        return Inertia::render('Abonos/Historial', [
            'venta' => [
                'id'              => $venta->id,
                'numero_venta'    => $venta->numero_venta,
                'tipo_venta'      => $venta->tipo_venta,
                'cliente'         => $venta->cliente?->nombre ?? 'Sin cliente',
                'total'           => $venta->total,
                'pagado'          => $venta->pagado,
                'saldo_pendiente' => $venta->saldo_pendiente,
                'estado'          => $venta->estado,
                'fecha_limite'    => $venta->fecha_limite,
                'created_at'      => $venta->created_at->format('d/m/Y H:i'),
                'detalles'        => $venta->detalles->map(fn($d) => [
                    'nombre'          => $d->producto?->nombre ?? 'Eliminado',
                    'cantidad'        => $d->cantidad,
                    'precio_unitario' => $d->precio_unitario,
                    'subtotal'        => $d->subtotal,
                ]),
                'abonos'          => $venta->abonos->map(fn($a) => [
                    'id'              => $a->id,
                    'monto'           => $a->monto,
                    'forma_pago'      => $a->forma_pago,
                    'empleado'        => $a->empleado?->name ?? 'Sistema',
                    'observaciones'   => $a->observaciones,
                    'tipo_movimiento' => $a->tipo_movimiento,
                    'tipo_label'      => $a->tipo_movimiento_label,
                    'es_ajuste'       => $a->es_ajuste,
                    'created_at'      => $a->created_at->format('d/m/Y H:i'),
                ]),
            ],
        ]);
    }
}
