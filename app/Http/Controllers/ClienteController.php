<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClienteController extends Controller
{
    public function index(): Response
    {
        $clientes = Cliente::with([
            'ventas' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'ventas.detalles.producto',
            'ventas.abonos',
        ])
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Clientes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'required|string|max:50|unique:clientes,telefono',
            'email'     => 'nullable|email|max:255',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'activo'    => 'boolean',
        ], [
            'telefono.unique' => 'Ya existe un cliente con este número de teléfono.',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        Cliente::create($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente creado exitosamente.');
    }

    public function edit(string $id): Response
    {
        $cliente = Cliente::findOrFail($id);

        return Inertia::render('Clientes/Edit', [
            'cliente' => $cliente,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $cliente = Cliente::findOrFail($id);

        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'telefono'  => 'required|string|max:50|unique:clientes,telefono,' . $id,
            'email'     => 'nullable|email|max:255',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'activo'    => 'boolean',
        ], [
            'telefono.unique' => 'Ya existe un cliente con este número de teléfono.',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        $cliente->update($validated);

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente actualizado exitosamente.');
    }

    public function destroy(string $id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();

        return redirect()->route('clientes.index')
            ->with('success', 'Cliente eliminado exitosamente.');
    }
}
