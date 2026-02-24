<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProveedorController extends Controller
{
    public function index(): Response
    {
        $proveedores = Proveedor::orderBy('nombre')->get();

        return Inertia::render('Proveedores/Index', [
            'proveedores' => $proveedores,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Proveedores/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'empresa'   => 'nullable|string|max:255',
            'email'     => 'nullable|email|max:255',
            'telefono'  => 'nullable|string|max:50',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'sitio_web' => 'nullable|string|max:255',
            'activo'    => 'boolean',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        Proveedor::create($validated);

        return redirect()->route('proveedores.index')
            ->with('success', 'Proveedor creado exitosamente.');
    }

    public function edit(string $id): Response
    {
        $proveedor = Proveedor::findOrFail($id);

        return Inertia::render('Proveedores/Edit', [
            'proveedor' => $proveedor,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $proveedor = Proveedor::findOrFail($id);

        $validated = $request->validate([
            'nombre'    => 'required|string|max:255',
            'empresa'   => 'nullable|string|max:255',
            'email'     => 'nullable|email|max:255',
            'telefono'  => 'nullable|string|max:50',
            'documento' => 'nullable|string|max:50',
            'direccion' => 'nullable|string',
            'sitio_web' => 'nullable|string|max:255',
            'activo'    => 'boolean',
        ]);

        $validated['activo'] = $request->boolean('activo', true);

        $proveedor->update($validated);

        return redirect()->route('proveedores.index')
            ->with('success', 'Proveedor actualizado exitosamente.');
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! \Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $proveedor = Proveedor::findOrFail($id);

        \App\Models\Papelera::archivar(
            'proveedor',
            $proveedor,
            $proveedor->nombre . ($proveedor->empresa ? " ({$proveedor->empresa})" : ''),
            auth()->user()->name
        );

        $proveedor->delete();

        return redirect()->route('proveedores.index')
            ->with('success', "Proveedor \"{$proveedor->nombre}\" movido a la papelera.");
    }
}
