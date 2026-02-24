<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Papelera;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CategoriaController extends Controller
{
    // ─────────────────────────────────────────────────────────────
    // INDEX — muestra las dos categorías raíz + resumen
    // ─────────────────────────────────────────────────────────────

    public function index(): Response
    {
        $dama = Categoria::dama()
            ->activas()
            ->withCount(['productos as total_productos' => function ($q) {
                // Conteo usando la columna categoria de productos
            }])
            ->orderBy('nombre')
            ->get()
            ->map(fn($c) => $this->enriquecerCategoria($c));

        $caballero = Categoria::caballero()
            ->activas()
            ->orderBy('nombre')
            ->get()
            ->map(fn($c) => $this->enriquecerCategoria($c));

        $custom = Categoria::where('tipo', 'custom')
            ->activas()
            ->orderBy('nombre')
            ->get()
            ->map(fn($c) => $this->enriquecerCategoria($c));

        return Inertia::render('Categorias/Index', [
            'categorias_dama'      => $dama,
            'categorias_caballero' => $caballero,
            'categorias_custom'    => $custom,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // SHOW — subcategorías / productos de una categoría
    // ─────────────────────────────────────────────────────────────

    public function show(string $id): Response
    {
        $categoria = Categoria::findOrFail($id);
        $label     = $categoria->label_completo;

        $productos = Producto::where('categoria', $label)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Categorias/Show', [
            'categoria' => array_merge($categoria->toArray(), [
                'total_productos' => $productos->count(),
                'label_completo'  => $label,
            ]),
            'productos' => $productos,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE / STORE
    // ─────────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('Categorias/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'tipo'        => 'required|in:dama,caballero,custom',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')
                ->store('categorias', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        Categoria::create($validated);

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    // ─────────────────────────────────────────────────────────────
    // EDIT / UPDATE
    // ─────────────────────────────────────────────────────────────

    public function edit(string $id): Response
    {
        $categoria = Categoria::findOrFail($id);

        return Inertia::render('Categorias/Edit', [
            'categoria' => $categoria,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $categoria = Categoria::findOrFail($id);

        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'tipo'        => 'required|in:dama,caballero,custom',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($categoria->imagen) {
                Storage::disk('public')->delete($categoria->imagen);
            }
            $validated['imagen'] = $request->file('imagen')
                ->store('categorias', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);

        // Actualizar la columna 'categoria' en productos si cambió el nombre
        $labelAnterior = $categoria->label_completo;
        $categoria->update($validated);
        $labelNuevo    = $categoria->fresh()->label_completo;

        if ($labelAnterior !== $labelNuevo) {
            Producto::where('categoria', $labelAnterior)
                ->update(['categoria' => $labelNuevo]);
        }

        return redirect()->route('categorias.index')
            ->with('success', 'Categoría actualizada.');
    }

    // ─────────────────────────────────────────────────────────────
    // DESTROY — requiere contraseña + guarda en papelera
    // ─────────────────────────────────────────────────────────────

    public function destroy(Request $request, string $id)
    {
        // Verificar contraseña
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $categoria = Categoria::findOrFail($id);
        $label     = $categoria->label_completo;

        // Mover productos asociados a papelera
        $productos = Producto::where('categoria', $label)->get();
        foreach ($productos as $producto) {
            Papelera::archivar(
                'producto',
                $producto,
                $producto->nombre,
                auth()->user()->name
            );
            $producto->delete();
        }

        // Guardar categoría en papelera
        Papelera::archivar(
            'categoria',
            $categoria,
            $categoria->nombre . ' (' . ucfirst($categoria->tipo) . ')',
            auth()->user()->name
        );

        // Soft delete de la categoría
        $categoria->delete();

        return redirect()->route('categorias.index')
            ->with('success', "Categoría \"{$categoria->nombre}\" eliminada. Los productos asociados se movieron a la papelera.");
    }

    // ─────────────────────────────────────────────────────────────
    // Helper privado
    // ─────────────────────────────────────────────────────────────

    private function enriquecerCategoria(Categoria $c): array
    {
        $data              = $c->toArray();
        $data['total_productos'] = $c->contarProductos();
        $data['label_completo']  = $c->label_completo;
        return $data;
    }
}
