<?php
// app/Http/Controllers/InventarioController.php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\ProductoTalla;
use App\Models\Registro;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $query = Producto::with('tallas')->orderBy('nombre');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre',        'like', "%{$search}%")
                  ->orWhere('codigo_barras','like', "%{$search}%");
            });
        }

        $paginated = $query->paginate(20)->withQueryString();

        $paginated->getCollection()->transform(fn($p) => array_merge($p->toArray(), [
            'stock_total'   => $p->stock_total,
            'maneja_tallas' => $p->maneja_tallas,
        ]));

        return Inertia::render('Inventario/Index', [
            'productos' => $paginated,
            'filters'   => ['search' => $search],
        ]);
    }

    public function ajustar(): Response
    {
        $productos = Producto::with('tallas')->activos()->orderBy('nombre')->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'nombre'        => $p->nombre,
                'stock'         => $p->stock,
                'stock_total'   => $p->stock_total,
                'maneja_tallas' => $p->maneja_tallas,
                'tallas'        => $p->maneja_tallas
                    ? $p->tallas->map(fn($t) => ['id' => $t->id, 'talla' => $t->talla, 'stock' => $t->stock])->values()
                    : [],
            ]);

        return Inertia::render('Inventario/Ajustar', [
            'productos' => $productos,
        ]);
    }

    public function procesarAjuste(Request $request)
    {
        $validated = $request->validate([
            'producto_id'   => 'required|exists:productos,id',
            'tipo_ajuste'   => 'required|in:incremento,decremento',
            'cantidad'      => 'required|integer|min:1',
            'motivo'        => 'required|in:Daño,Robo,Devolución,Error conteo,Ingreso mercancía,Otro',
            'observaciones' => 'required|string|min:5',
            'talla'         => 'nullable|string|max:20',
        ], [
            'observaciones.required' => 'Las observaciones son obligatorias para los ajustes de inventario.',
            'observaciones.min'      => 'Las observaciones deben tener al menos 5 caracteres.',
        ]);

        $talla = $validated['talla'] ?? null;

        // Verificación previa sin lock (respuesta rápida para errores de validación básica)
        if ($talla) {
            $talla = strtoupper(trim($talla));
        }

        DB::beginTransaction();
        try {
            $producto = Producto::lockForUpdate()->findOrFail($validated['producto_id']);

            if ($producto->maneja_tallas) {
                if (!$talla) {
                    DB::rollBack();
                    return back()->withErrors(['talla' => 'Este producto maneja tallas. Debes seleccionar la talla a ajustar.']);
                }

                $tallaModel = ProductoTalla::where('producto_id', $producto->id)
                    ->where('talla', $talla)
                    ->lockForUpdate()
                    ->first();

                if (!$tallaModel) {
                    DB::rollBack();
                    return back()->withErrors(['talla' => "La talla \"{$talla}\" no existe en este producto."]);
                }

                $stockAntesTalla = $tallaModel->stock;
                $stockAntesTotal = $producto->stock_total;

                if ($validated['tipo_ajuste'] === 'incremento') {
                    $tallaModel->increment('stock', $validated['cantidad']);
                } else {
                    if ($tallaModel->stock < $validated['cantidad']) {
                        DB::rollBack();
                        return back()->withErrors([
                            'cantidad' => "No se puede reducir el stock de la talla \"{$talla}\" por debajo de 0. Stock actual: {$tallaModel->stock}",
                        ]);
                    }
                    $tallaModel->decrement('stock', $validated['cantidad']);
                }

                $stockDespuesTalla = $tallaModel->fresh()->stock;
                $stockDespuesTotal = $producto->fresh()->stock_total;
                $tipoMovimiento    = $validated['tipo_ajuste'] === 'incremento' ? 'ajuste_entrada' : 'ajuste_salida';

                MovimientoInventario::registrar(
                    producto:      $producto,
                    stockAnterior: $stockAntesTotal,
                    stockNuevo:    $stockDespuesTotal,
                    tipo:          $tipoMovimiento,
                    motivo:        $validated['motivo'] . " | Talla: {$talla}",
                    observaciones: $validated['observaciones'],
                );

                Registro::registrar(
                    'ajuste_inventario', 'inventario',
                    "Ajuste en \"{$producto->nombre}\" talla {$talla}: {$validated['tipo_ajuste']} de {$validated['cantidad']} unidades. Stock talla: {$stockAntesTalla} → {$stockDespuesTalla}. Por " . auth()->user()->name,
                    $producto
                );

                DB::commit();

                return redirect()->route('inventario.index')
                    ->with('success', "Stock ajustado. Talla {$talla}: {$stockDespuesTalla} unidades.");
            }

            // Producto sin tallas
            $stockAntes = $producto->stock;

            if ($validated['tipo_ajuste'] === 'incremento') {
                $producto->increment('stock', $validated['cantidad']);
            } else {
                if ($producto->stock < $validated['cantidad']) {
                    DB::rollBack();
                    return back()->withErrors([
                        'cantidad' => 'No se puede reducir el stock por debajo de 0. Stock actual: ' . $producto->stock,
                    ]);
                }
                $producto->decrement('stock', $validated['cantidad']);
            }

            $stockDespues   = $producto->fresh()->stock;
            $tipoMovimiento = $validated['tipo_ajuste'] === 'incremento' ? 'ajuste_entrada' : 'ajuste_salida';

            MovimientoInventario::registrar(
                producto:      $producto,
                stockAnterior: $stockAntes,
                stockNuevo:    $stockDespues,
                tipo:          $tipoMovimiento,
                motivo:        $validated['motivo'],
                observaciones: $validated['observaciones'],
            );

            Registro::registrar(
                'ajuste_inventario', 'inventario',
                "Ajuste de inventario en \"{$producto->nombre}\": {$validated['tipo_ajuste']} de {$validated['cantidad']} unidades. Motivo: {$validated['motivo']}. Stock: {$stockAntes} → {$stockDespues}. Por " . auth()->user()->name,
                $producto
            );

            DB::commit();

            return redirect()->route('inventario.index')
                ->with('success', 'Stock ajustado. Nuevo stock: ' . $stockDespues . ' unidades.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al ajustar el inventario: ' . $e->getMessage()]);
        }
    }

    // NUEVO — ver kardex de un producto específico
    public function kardex(string $productoId): Response
    {
        $producto = Producto::with('tallas')->findOrFail($productoId);

        // KPIs como agregados SQL para no cargar todos los registros en memoria
        $totalesRaw = MovimientoInventario::where('producto_id', $productoId)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN tipo = "venta" THEN 1 ELSE 0 END) as ventas,
                SUM(CASE WHEN tipo IN ("ajuste_entrada","anulacion") THEN 1 ELSE 0 END) as ajustes_entrada,
                SUM(CASE WHEN tipo = "ajuste_salida" THEN 1 ELSE 0 END) as ajustes_salida
            ')
            ->first();

        $movimientos = MovimientoInventario::where('producto_id', $productoId)
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn($m) => [
                'id'              => $m->id,
                'tipo'            => $m->tipo,
                'tipo_label'      => $m->tipo_label,
                'tipo_color'      => $m->tipo_color,
                'es_entrada'      => $m->es_entrada,
                'cantidad'        => $m->cantidad,
                'stock_anterior'  => $m->stock_anterior,
                'stock_nuevo'     => $m->stock_nuevo,
                'motivo'          => $m->motivo,
                'observaciones'   => $m->observaciones,
                'referencia_tipo' => $m->referencia_tipo,
                'referencia_id'   => $m->referencia_id,
                'usuario'         => $m->user?->name ?? 'Sistema',
                'created_at'      => $m->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Inventario/Kardex', [
            'producto' => [
                'id'            => $producto->id,
                'nombre'        => $producto->nombre,
                'categoria'     => $producto->categoria,
                'stock'         => $producto->stock,
                'stock_total'   => $producto->stock_total,
                'maneja_tallas' => $producto->maneja_tallas,
                'imagen'        => $producto->imagen,
                'tallas'        => $producto->maneja_tallas
                    ? $producto->tallas->map(fn($t) => ['talla' => $t->talla, 'stock' => $t->stock])->values()
                    : [],
            ],
            'movimientos' => $movimientos,
            'totales'     => [
                'total'           => (int) ($totalesRaw->total           ?? 0),
                'ventas'          => (int) ($totalesRaw->ventas          ?? 0),
                'ajustes_entrada' => (int) ($totalesRaw->ajustes_entrada ?? 0),
                'ajustes_salida'  => (int) ($totalesRaw->ajustes_salida  ?? 0),
            ],
        ]);
    }
}
