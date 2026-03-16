<?php
// app/Http/Controllers/ProductoController.php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\GrupoCategoria;
use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    /**
     * Genera la lista de categorías agrupadas dinámicamente desde la DB.
     */
    private function getCategorias(): array
    {
        return GrupoCategoria::where('activo', true)
            ->whereNull('deleted_at')
            ->orderBy('orden')
            ->orderBy('nombre')
            ->with(['subcategorias' => fn($q) => $q->where('activo', true)->orderBy('nombre')])
            ->get()
            ->map(fn($grupo) => [
                'grupo'   => $grupo->nombre,
                'opciones' => $grupo->subcategorias
                    ->map(fn($sub) => $grupo->nombre . ' - ' . $sub->nombre)
                    ->values()
                    ->toArray(),
            ])
            ->filter(fn($g) => count($g['opciones']) > 0)
            ->values()
            ->toArray();
    }

    public function index(): Response
    {
        $productos = Producto::with('proveedores')->orderBy('nombre')->get();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
        ]);
    }

    public function create(): Response
    {
        $proveedores = Proveedor::activos()->orderBy('nombre')->get();

        return Inertia::render('Productos/Create', [
            'categorias'  => $this->getCategorias(),
            'proveedores' => $proveedores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'precio_compra'  => 'nullable|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'stock_minimo'   => 'required|integer|min:0',
            'categoria'      => 'required|string',
            'codigo_barras'  => 'nullable|string|unique:productos',
            'imagen'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'         => 'boolean',

            // proveedores
            'proveedores'   => 'required|array|min:1',
            'proveedores.*' => 'exists:proveedores,id',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        $producto = Producto::create($validated);

        // guardar proveedores
        $producto->proveedores()->sync($validated['proveedores']);

        // ── Auditoría ────────────────────────────────────────────
        Registro::registrar(
            'crear',
            'productos',
            "Producto \"{$producto->nombre}\" creado por " . auth()->user()->name,
            $producto
        );

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function show(string $id): Response
    {
        $producto = Producto::with('proveedores')->findOrFail($id);

        return Inertia::render('Productos/Show', [
            'producto' => $producto,
        ]);
    }

    public function edit(string $id): Response
    {
        $producto    = Producto::with('proveedores')->findOrFail($id);
        $proveedores = Proveedor::activos()->orderBy('nombre')->get();

        return Inertia::render('Productos/Edit', [
            'producto'    => $producto,
            'categorias'  => $this->getCategorias(),
            'proveedores' => $proveedores,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $producto  = Producto::findOrFail($id);
        $anterior  = $producto->toArray(); // snapshot antes de editar

        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'precio_compra'  => 'nullable|numeric|min:0',
            'stock'          => 'required|integer|min:0',
            'stock_minimo'   => 'required|integer|min:0',
            'categoria'      => 'required|string',
            'codigo_barras'  => 'nullable|string|unique:productos,codigo_barras,' . $id,
            'imagen'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'         => 'boolean',

            // proveedores
            'proveedores'   => 'required|array|min:1',
            'proveedores.*' => 'exists:proveedores,id',
        ]);

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        $producto->update($validated);

        // actualizar proveedores
        $producto->proveedores()->sync($validated['proveedores']);

        // ── Auditoría ────────────────────────────────────────────
        Registro::registrar(
            'editar',
            'productos',
            "Producto \"{$producto->nombre}\" editado por " . auth()->user()->name,
            $producto,
            $anterior,
            $producto->fresh()->toArray()
        );

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! \Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $producto = Producto::findOrFail($id);

        \App\Models\Papelera::archivar(
            'producto',
            $producto,
            $producto->nombre,
            auth()->user()->name
        );

        // ── Auditoría ────────────────────────────────────────────
        Registro::registrar(
            'eliminar',
            'productos',
            "Producto \"{$producto->nombre}\" movido a papelera por " . auth()->user()->name,
            $producto
        );

        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', "Producto \"{$producto->nombre}\" movido a la papelera.");
    }
}
