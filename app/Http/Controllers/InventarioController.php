<?php
// app/Http/Controllers/InventarioController.php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Inventario/Index', [
            'productos' => Producto::orderBy('nombre')->get(),
        ]);
    }

    public function ajustar(): Response
    {
        return Inertia::render('Inventario/Ajustar', [
            'productos' => Producto::activos()->orderBy('nombre')->get(),
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
        ], [
            'observaciones.required' => 'Las observaciones son obligatorias para los ajustes de inventario.',
            'observaciones.min'      => 'Las observaciones deben tener al menos 5 caracteres.',
        ]);

        $producto    = Producto::findOrFail($validated['producto_id']);
        $stockAntes  = $producto->stock;

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

        $stockDespues = $producto->fresh()->stock;

        Registro::registrar(
            'ajuste_inventario',
            'inventario',
            "Ajuste de inventario en \"{$producto->nombre}\": {$validated['tipo_ajuste']} de {$validated['cantidad']} unidades. Motivo: {$validated['motivo']}. Stock: {$stockAntes} → {$stockDespues}. Por " . auth()->user()->name,
            $producto
        );

        return redirect()->route('inventario.index')
            ->with('success', 'Stock ajustado. Nuevo stock: ' . $stockDespues . ' unidades.');
    }
}
