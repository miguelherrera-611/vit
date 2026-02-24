<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    private $categorias = [
        'Dama - Blusas',
        'Dama - Vestidos',
        'Dama - Pantalones',
        'Dama - Faldas',
        'Dama - Chaquetas',
        'Dama - Ropa Interior',
        'Dama - Accesorios',
        'Caballero - Camisas',
        'Caballero - Pantalones',
        'Caballero - Chaquetas',
        'Caballero - Ropa Interior',
        'Caballero - Accesorios',
        'Caballero - Camisetas',
    ];

    public function index(): Response
    {
        $productos = Producto::orderBy('nombre')->get();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
        ]);
    }

    public function create(): Response
    {
        $proveedores = Proveedor::activos()->orderBy('nombre')->get();

        return Inertia::render('Productos/Create', [
            'categorias'  => $this->categorias,
            'proveedores' => $proveedores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'        => 'required|string|max:255',
            'descripcion'   => 'nullable|string',
            'precio'        => 'required|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'stock_minimo'  => 'required|integer|min:0',
            'categoria'     => 'required|string',
            'codigo_barras' => 'nullable|string|unique:productos',
            'imagen'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'        => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        Producto::create($validated);

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function show(string $id): Response
    {
        $producto = Producto::findOrFail($id);

        return Inertia::render('Productos/Show', [
            'producto' => $producto,
        ]);
    }

    public function edit(string $id): Response
    {
        $producto   = Producto::findOrFail($id);
        $proveedores = Proveedor::activos()->orderBy('nombre')->get();

        return Inertia::render('Productos/Edit', [
            'producto'    => $producto,
            'categorias'  => $this->categorias,
            'proveedores' => $proveedores,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre'        => 'required|string|max:255',
            'descripcion'   => 'nullable|string',
            'precio'        => 'required|numeric|min:0',
            'stock'         => 'required|integer|min:0',
            'stock_minimo'  => 'required|integer|min:0',
            'categoria'     => 'required|string',
            'codigo_barras' => 'nullable|string|unique:productos,codigo_barras,' . $id,
            'imagen'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'        => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        $producto->update($validated);

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(string $id)
    {
        $producto = Producto::findOrFail($id);

        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }
}
