<?php
// app/Http/Controllers/ProductoController.php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\ProductoFoto;
use App\Models\ProductoTalla;
use App\Models\Proveedor;
use App\Models\GrupoCategoria;
use App\Models\Registro;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
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

    private function serializarTallas(Producto $producto): array
    {
        if (!$producto->maneja_tallas) return [];
        return $producto->tallas->map(fn($t) => [
            'id'    => $t->id,
            'talla' => $t->talla,
            'stock' => $t->stock,
            'orden' => $t->orden,
        ])->toArray();
    }

    public function index(): Response
    {
        $productos = Producto::with(['proveedores', 'fotos', 'tallas'])->orderBy('nombre')->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'stock_total'   => $p->stock_total,
                'maneja_tallas' => $p->maneja_tallas,
            ]));

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
            'nombre'           => 'required|string|max:255',
            'descripcion'      => 'nullable|string',
            'precio'           => 'required|numeric|min:0',
            'precio_compra'    => 'nullable|numeric|min:0',
            'stock'            => 'required_if:maneja_tallas,false|nullable|integer|min:0',
            'stock_minimo'     => 'required|integer|min:0',
            'categoria'        => 'required|string',
            'codigo_barras'    => 'nullable|string|unique:productos',
            'imagen'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
            'activo'           => 'boolean',
            'proveedores'      => 'required|array|min:1',
            'proveedores.*'    => 'exists:proveedores,id',
            'fotos'            => 'nullable|array',
            'fotos.*'          => 'image|mimes:jpg,jpeg,png,webp|max:20480',
            'maneja_tallas'    => 'boolean',
            'tallas'           => 'nullable|array',
            'tallas.*.talla'   => 'required_with:tallas|string|max:20',
            'tallas.*.stock'   => 'required_with:tallas|integer|min:0',
            'tallas.*.orden'   => 'nullable|integer|min:0',
        ]);

        $manejaTallas = $request->boolean('maneja_tallas', false);
        if ($manejaTallas) {
            $validated['stock'] = 0;
        }
        $validated['maneja_tallas'] = $manejaTallas;

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        DB::beginTransaction();
        try {
            $producto = Producto::create($validated);
            $producto->proveedores()->sync($validated['proveedores']);

            // Guardar fotos adicionales
            if ($request->hasFile('fotos')) {
                foreach ($request->file('fotos') as $orden => $foto) {
                    $ruta = $foto->store('productos/fotos', 'public');
                    ProductoFoto::create([
                        'producto_id' => $producto->id,
                        'ruta'        => $ruta,
                        'orden'       => $orden,
                    ]);
                }
            }

            // Guardar tallas
            if ($manejaTallas && !empty($validated['tallas'])) {
                foreach ($validated['tallas'] as $idx => $t) {
                    ProductoTalla::create([
                        'producto_id' => $producto->id,
                        'talla'       => strtoupper(trim($t['talla'])),
                        'stock'       => $t['stock'],
                        'orden'       => $t['orden'] ?? $idx,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al crear el producto: ' . $e->getMessage()]);
        }

        Registro::registrar(
            'crear', 'productos',
            "Producto \"{$producto->nombre}\" creado por " . auth()->user()->name,
            $producto
        );

        return redirect()->route('productos.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function show(string $id): Response
    {
        $producto = Producto::with(['proveedores', 'fotos', 'tallas'])->findOrFail($id);

        return Inertia::render('Productos/Show', [
            'producto' => array_merge($producto->toArray(), [
                'tallas'      => $this->serializarTallas($producto),
                'stock_total' => $producto->stock_total,
            ]),
        ]);
    }

    public function edit(string $id): Response
    {
        $producto    = Producto::with(['proveedores', 'fotos', 'tallas'])->findOrFail($id);
        $proveedores = Proveedor::activos()->orderBy('nombre')->get();

        return Inertia::render('Productos/Edit', [
            'producto'    => array_merge($producto->toArray(), [
                'tallas'      => $this->serializarTallas($producto),
                'stock_total' => $producto->stock_total,
            ]),
            'categorias'  => $this->getCategorias(),
            'proveedores' => $proveedores,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $producto = Producto::with('tallas')->findOrFail($id);
        $anterior = $producto->toArray();

        $validated = $request->validate([
            'nombre'            => 'required|string|max:255',
            'descripcion'       => 'nullable|string',
            'precio'            => 'required|numeric|min:0',
            'precio_compra'     => 'nullable|numeric|min:0',
            'stock'             => 'required_if:maneja_tallas,false|nullable|integer|min:0',
            'stock_minimo'      => 'required|integer|min:0',
            'categoria'         => 'required|string',
            'codigo_barras'     => 'nullable|string|unique:productos,codigo_barras,' . $id,
            'imagen'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
            'activo'            => 'boolean',
            'proveedores'       => 'required|array|min:1',
            'proveedores.*'     => 'exists:proveedores,id',
            'fotos'             => 'nullable|array',
            'fotos.*'           => 'image|mimes:jpg,jpeg,png,webp|max:20480',
            'fotos_eliminar'    => 'nullable|array',
            'fotos_eliminar.*'  => 'integer|exists:producto_fotos,id',
            'maneja_tallas'     => 'boolean',
            'tallas'            => 'nullable|array',
            'tallas.*.id'       => 'nullable|integer|exists:producto_tallas,id',
            'tallas.*.talla'    => 'required_with:tallas|string|max:20',
            'tallas.*.stock'    => 'required_with:tallas|integer|min:0',
            'tallas.*.orden'    => 'nullable|integer|min:0',
            'tallas_eliminar'   => 'nullable|array',
            'tallas_eliminar.*' => 'integer|exists:producto_tallas,id',
        ]);

        $manejaTallas = $request->boolean('maneja_tallas', false);
        if ($manejaTallas) {
            $validated['stock'] = 0;
        }
        $validated['maneja_tallas'] = $manejaTallas;

        if ($request->hasFile('imagen')) {
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }
            $validated['imagen'] = $request->file('imagen')->store('productos', 'public');
        } else {
            unset($validated['imagen']);
        }

        $validated['activo'] = $request->boolean('activo', true);

        DB::beginTransaction();
        try {
            $producto->update($validated);
            $producto->proveedores()->sync($validated['proveedores']);

            // Eliminar fotos marcadas para borrar
            if (!empty($validated['fotos_eliminar'])) {
                $fotosAEliminar = ProductoFoto::whereIn('id', $validated['fotos_eliminar'])
                    ->where('producto_id', $producto->id)
                    ->get();
                foreach ($fotosAEliminar as $foto) {
                    Storage::disk('public')->delete($foto->ruta);
                    $foto->delete();
                }
            }

            // Agregar fotos nuevas
            if ($request->hasFile('fotos')) {
                $ordenActual = ProductoFoto::where('producto_id', $producto->id)->max('orden') ?? -1;
                foreach ($request->file('fotos') as $foto) {
                    $ordenActual++;
                    $ruta = $foto->store('productos/fotos', 'public');
                    ProductoFoto::create([
                        'producto_id' => $producto->id,
                        'ruta'        => $ruta,
                        'orden'       => $ordenActual,
                    ]);
                }
            }

            // Gestionar tallas
            if ($manejaTallas) {
                // Eliminar tallas marcadas
                if (!empty($validated['tallas_eliminar'])) {
                    ProductoTalla::whereIn('id', $validated['tallas_eliminar'])
                        ->where('producto_id', $producto->id)
                        ->delete();
                }
                // Upsert de tallas
                foreach ($validated['tallas'] ?? [] as $idx => $t) {
                    $talla = strtoupper(trim($t['talla']));
                    if (!empty($t['id'])) {
                        ProductoTalla::where('id', $t['id'])
                            ->where('producto_id', $producto->id)
                            ->update(['talla' => $talla, 'stock' => $t['stock'], 'orden' => $t['orden'] ?? $idx]);
                    } else {
                        ProductoTalla::updateOrCreate(
                            ['producto_id' => $producto->id, 'talla' => $talla],
                            ['stock' => $t['stock'], 'orden' => $t['orden'] ?? $idx]
                        );
                    }
                }
            } else {
                // Si desactiva tallas, eliminar todas
                $producto->tallas()->delete();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar el producto: ' . $e->getMessage()]);
        }

        Registro::registrar(
            'editar', 'productos',
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

        if (!\Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $producto = Producto::with('fotos')->findOrFail($id);

        // Eliminar fotos adicionales del storage
        foreach ($producto->fotos as $foto) {
            Storage::disk('public')->delete($foto->ruta);
        }

        \App\Models\Papelera::archivar(
            'producto', $producto, $producto->nombre, auth()->user()->name
        );

        Registro::registrar(
            'eliminar', 'productos',
            "Producto \"{$producto->nombre}\" movido a papelera por " . auth()->user()->name,
            $producto
        );

        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', "Producto \"{$producto->nombre}\" movido a la papelera.");
    }

    // ── Eliminar una talla individual ────────────────────────────

    public function eliminarTalla(Request $request, string $productoId, string $tallaId)
    {
        $talla = ProductoTalla::where('id', $tallaId)
            ->where('producto_id', $productoId)
            ->firstOrFail();

        if ($talla->stock > 0) {
            return back()->withErrors(['talla' => "No puedes eliminar la talla \"{$talla->talla}\" porque tiene {$talla->stock} unidad(es) en stock."]);
        }

        $talla->delete();

        return back()->with('success', "Talla \"{$talla->talla}\" eliminada.");
    }

    // ── Eliminar una foto individual (llamada desde el frontend) ──

    public function eliminarFoto(Request $request, string $productoId, string $fotoId)
    {
        $foto = ProductoFoto::where('id', $fotoId)
            ->where('producto_id', $productoId)
            ->firstOrFail();

        Storage::disk('public')->delete($foto->ruta);
        $foto->delete();

        return back()->with('success', 'Foto eliminada.');
    }
}
