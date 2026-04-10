<?php
// app/Http/Controllers/InventarioController.php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\ProductoTalla;
use App\Models\Registro;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(): Response
    {
        $productos = Producto::with('tallas')->orderBy('nombre')->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'stock_total'   => $p->stock_total,
                'maneja_tallas' => $p->maneja_tallas,
            ]));

        return Inertia::render('Inventario/Index', [
            'productos' => $productos,
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

        $producto = Producto::with('tallas')->findOrFail($validated['producto_id']);
        $talla    = $validated['talla'] ?? null;

        if ($producto->maneja_tallas) {
            if (!$talla) {
                return back()->withErrors(['talla' => 'Este producto maneja tallas. Debes seleccionar la talla a ajustar.']);
            }
            $tallaModel = $producto->tallas->firstWhere('talla', strtoupper(trim($talla)));
            if (!$tallaModel) {
                return back()->withErrors(['talla' => "La talla \"{$talla}\" no existe en este producto."]);
            }
            $stockAntesTalla = $tallaModel->stock;
            $stockAntesTotal = $producto->stock_total;

            if ($validated['tipo_ajuste'] === 'incremento') {
                $tallaModel->increment('stock', $validated['cantidad']);
            } else {
                if ($tallaModel->stock - $validated['cantidad'] < 0) {
                    return back()->withErrors([
                        'cantidad' => "No se puede reducir el stock de la talla \"{$talla}\" por debajo de 0. Stock actual: {$tallaModel->stock}",
                    ]);
                }
                $tallaModel->decrement('stock', $validated['cantidad']);
            }

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
                "Ajuste en \"{$producto->nombre}\" talla {$talla}: {$validated['tipo_ajuste']} de {$validated['cantidad']} unidades. Stock talla: {$stockAntesTalla} → {$tallaModel->fresh()->stock}. Por " . auth()->user()->name,
                $producto
            );

            return redirect()->route('inventario.index')
                ->with('success', "Stock ajustado. Talla {$talla}: {$tallaModel->fresh()->stock} unidades.");
        }

        // Producto sin tallas — comportamiento original
        $stockAntes = $producto->stock;

        if ($validated['tipo_ajuste'] === 'incremento') {
            $producto->increment('stock', $validated['cantidad']);
        } else {
            if ($producto->stock - $validated['cantidad'] < 0) {
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

        return redirect()->route('inventario.index')
            ->with('success', 'Stock ajustado. Nuevo stock: ' . $stockDespues . ' unidades.');
    }

    // NUEVO — ver kardex de un producto específico
    public function kardex(string $productoId): Response
    {
        $producto = Producto::with('tallas')->findOrFail($productoId);

        $movimientos = MovimientoInventario::where('producto_id', $productoId)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($m) => [
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
        ]);
    }
}
