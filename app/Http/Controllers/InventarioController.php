<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventarioController extends Controller
{
    public function index(): Response
    {
        $productos = Producto::orderBy('nombre')->get();

        return Inertia::render('Inventario/Index', [
            'productos' => $productos,
        ]);
    }

    public function ajustar(): Response
    {
        $productos = Producto::activos()->orderBy('nombre')->get();

        return Inertia::render('Inventario/Ajustar', [
            'productos' => $productos,
        ]);
    }

    public function procesarAjuste(Request $request)
    {
        $validated = $request->validate([
            'producto_id'  => 'required|exists:productos,id',
            'tipo_ajuste'  => 'required|in:incremento,decremento',
            'cantidad'     => 'required|integer|min:1',
            'motivo'       => 'required|in:Daño,Robo,Devolución,Error conteo,Ingreso mercancía,Otro',
            'observaciones' => 'required|string|min:5',
        ], [
            'observaciones.required' => 'Las observaciones son obligatorias para los ajustes de inventario.',
            'observaciones.min'      => 'Las observaciones deben tener al menos 5 caracteres.',
        ]);

        $producto = Producto::findOrFail($validated['producto_id']);

        if ($validated['tipo_ajuste'] === 'incremento') {
            $producto->increment('stock', $validated['cantidad']);
        } else {
            // No permitir stock negativo (RF-03.2)
            if ($producto->stock - $validated['cantidad'] < 0) {
                return back()->withErrors([
                    'cantidad' => 'No se puede reducir el stock por debajo de 0. Stock actual: ' . $producto->stock,
                ]);
            }
            $producto->decrement('stock', $validated['cantidad']);
        }

        return redirect()->route('inventario.index')
            ->with('success', 'Stock ajustado exitosamente. Nuevo stock: ' . $producto->fresh()->stock . ' unidades.');
    }
}
