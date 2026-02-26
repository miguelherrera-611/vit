<?php

namespace App\Http\Controllers;

use App\Models\GrupoCategoria;
use App\Models\Categoria;
use App\Models\Papelera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GrupoCategoriaController extends Controller
{
    // ─────────────────────────────────────────────────────────────
    // INDEX — lista de grupos como tarjetas grandes
    // ─────────────────────────────────────────────────────────────

    public function index(): Response
    {
        $grupos = GrupoCategoria::orderBy('orden')->orderBy('nombre')->get()
            ->map(fn($g) => [
                'id'              => $g->id,
                'nombre'          => $g->nombre,
                'imagen'          => $g->imagen,
                'descripcion'     => $g->descripcion,
                'color'           => $g->color,
                'orden'           => $g->orden,
                'total_subcat'    => $g->subcategorias()->count(),
                'total_productos' => $g->totalProductos(),
            ]);

        return Inertia::render('Categorias/Index', [
            'grupos' => $grupos,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // SHOW — subcategorías de un grupo
    // ─────────────────────────────────────────────────────────────

    public function show(string $id): Response
    {
        $grupo = GrupoCategoria::findOrFail($id);

        $subcategorias = $grupo->subcategorias()
            ->activas()
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'nombre'          => $c->nombre,
                'imagen'          => $c->imagen,
                'descripcion'     => $c->descripcion,
                'total_productos' => $c->contarProductos(),
                'label_completo'  => $c->label_completo,
            ]);

        return Inertia::render('Categorias/Show', [
            'grupo'         => [
                'id'          => $grupo->id,
                'nombre'      => $grupo->nombre,
                'imagen'      => $grupo->imagen,
                'descripcion' => $grupo->descripcion,
                'color'       => $grupo->color,
            ],
            'subcategorias' => $subcategorias,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE / STORE — crear nuevo grupo
    // ─────────────────────────────────────────────────────────────

    public function create(): Response
    {
        return Inertia::render('Categorias/CreateGrupo');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'color'       => 'nullable|string|max:30',
            'orden'       => 'nullable|integer|min:0',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')
                ->store('grupos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', true);
        $validated['color']  = $validated['color'] ?? 'violet';

        GrupoCategoria::create($validated);

        return redirect()->route('categorias.index')
            ->with('success', "Categoría \"{$validated['nombre']}\" creada exitosamente.");
    }

    // ─────────────────────────────────────────────────────────────
    // EDIT / UPDATE — editar grupo
    // ─────────────────────────────────────────────────────────────

    public function edit(string $id): Response
    {
        $grupo = GrupoCategoria::findOrFail($id);

        return Inertia::render('Categorias/EditGrupo', [
            'grupo' => $grupo,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $grupo = GrupoCategoria::findOrFail($id);

        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'color'       => 'nullable|string|max:30',
            'orden'       => 'nullable|integer|min:0',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            // Borrar imagen anterior
            if ($grupo->imagen) {
                Storage::disk('public')->delete($grupo->imagen);
            }
            $validated['imagen'] = $request->file('imagen')
                ->store('grupos', 'public');
        }

        $validated['activo'] = $request->boolean('activo', $grupo->activo);
        $validated['color']  = $validated['color'] ?? $grupo->color;

        $nombreAnterior = $grupo->nombre;
        $grupo->update($validated);

        // Si cambió el nombre, actualizar la columna 'categoria' en productos
        if ($nombreAnterior !== $grupo->nombre) {
            foreach ($grupo->subcategorias as $sub) {
                $labelAnterior = $nombreAnterior . ' - ' . $sub->nombre;
                $labelNuevo    = $grupo->nombre   . ' - ' . $sub->nombre;
                \App\Models\Producto::where('categoria', $labelAnterior)
                    ->update(['categoria' => $labelNuevo]);
            }
        }

        return redirect()->route('categorias.index')
            ->with('success', "Categoría \"{$grupo->nombre}\" actualizada.");
    }

    // ─────────────────────────────────────────────────────────────
    // DESTROY — eliminar grupo (requiere contraseña)
    // ─────────────────────────────────────────────────────────────

    public function destroy(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $grupo = GrupoCategoria::findOrFail($id);

        // Eliminar subcategorías y sus productos → papelera
        foreach ($grupo->subcategorias as $sub) {
            $productos = \App\Models\Producto::where('categoria', $sub->label_completo)->get();
            foreach ($productos as $prod) {
                Papelera::archivar('producto', $prod, $prod->nombre, auth()->user()->name);
                $prod->delete();
            }
            Papelera::archivar('categoria', $sub, $sub->label_completo, auth()->user()->name);
            $sub->delete();
        }

        Papelera::archivar('grupo_categoria', $grupo, $grupo->nombre, auth()->user()->name);
        $grupo->delete();

        return redirect()->route('categorias.index')
            ->with('success', "Categoría \"{$grupo->nombre}\" eliminada.");
    }

    // ─────────────────────────────────────────────────────────────
    // SUBCATEGORÍAS: crear / editar dentro de un grupo
    // ─────────────────────────────────────────────────────────────

    public function createSubcat(string $grupoId): Response
    {
        $grupo = GrupoCategoria::findOrFail($grupoId);

        return Inertia::render('Categorias/CreateSubcat', [
            'grupo' => $grupo,
        ]);
    }

    public function storeSubcat(Request $request, string $grupoId)
    {
        $grupo = GrupoCategoria::findOrFail($grupoId);

        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            $validated['imagen'] = $request->file('imagen')
                ->store('categorias', 'public');
        }

        $validated['activo']   = $request->boolean('activo', true);
        $validated['grupo_id'] = $grupo->id;
        $validated['tipo']     = 'custom'; // tipo legacy

        Categoria::create($validated);

        return redirect()->route('categorias.show', $grupoId)
            ->with('success', "Subcategoría \"{$validated['nombre']}\" creada.");
    }

    public function editSubcat(string $grupoId, string $subcatId): Response
    {
        $grupo  = GrupoCategoria::findOrFail($grupoId);
        $subcat = Categoria::where('grupo_id', $grupoId)->findOrFail($subcatId);

        return Inertia::render('Categorias/EditSubcat', [
            'grupo'  => $grupo,
            'subcat' => $subcat,
        ]);
    }

    public function updateSubcat(Request $request, string $grupoId, string $subcatId)
    {
        $grupo  = GrupoCategoria::findOrFail($grupoId);
        $subcat = Categoria::where('grupo_id', $grupoId)->findOrFail($subcatId);

        $validated = $request->validate([
            'nombre'      => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:255',
            'imagen'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'activo'      => 'boolean',
        ]);

        if ($request->hasFile('imagen')) {
            if ($subcat->imagen) Storage::disk('public')->delete($subcat->imagen);
            $validated['imagen'] = $request->file('imagen')->store('categorias', 'public');
        }

        $labelAnterior = $subcat->label_completo;
        $validated['activo'] = $request->boolean('activo', $subcat->activo);
        $subcat->update($validated);
        $labelNuevo = $subcat->fresh()->label_completo;

        if ($labelAnterior !== $labelNuevo) {
            \App\Models\Producto::where('categoria', $labelAnterior)
                ->update(['categoria' => $labelNuevo]);
        }

        return redirect()->route('categorias.show', $grupoId)
            ->with('success', "Subcategoría actualizada.");
    }

    public function destroySubcat(Request $request, string $grupoId, string $subcatId)
    {
        $request->validate(['password' => 'required|string']);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $subcat = Categoria::where('grupo_id', $grupoId)->findOrFail($subcatId);

        $productos = \App\Models\Producto::where('categoria', $subcat->label_completo)->get();
        foreach ($productos as $prod) {
            Papelera::archivar('producto', $prod, $prod->nombre, auth()->user()->name);
            $prod->delete();
        }

        Papelera::archivar('categoria', $subcat, $subcat->label_completo, auth()->user()->name);
        $subcat->delete();

        return redirect()->route('categorias.show', $grupoId)
            ->with('success', "Subcategoría eliminada.");
    }
}
