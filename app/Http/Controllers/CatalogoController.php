<?php

namespace App\Http\Controllers;

use App\Models\GrupoCategoria;
use App\Models\Categoria;
use App\Models\Producto;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoController extends Controller
{
    /**
     * Página principal del catálogo — muestra los grupos de categorías.
     * Acceso PÚBLICO (sin autenticación).
     */
    public function index(): Response
    {
        $grupos = GrupoCategoria::where('activo', true)
            ->whereNull('deleted_at')
            ->orderBy('orden')
            ->orderBy('nombre')
            ->with(['subcategorias' => fn($q) => $q->where('activo', true)->orderBy('nombre')])
            ->get()
            ->map(fn($g) => [
                'id'              => $g->id,
                'nombre'          => $g->nombre,
                'imagen'          => $g->imagen,
                'descripcion'     => $g->descripcion,
                'color'           => $g->color,
                'total_productos' => $g->totalProductos(),
                'subcategorias'   => $g->subcategorias->map(fn($s) => [
                    'id'              => $s->id,
                    'nombre'          => $s->nombre,
                    'imagen'          => $s->imagen,
                    'label_completo'  => $s->label_completo,
                    'total_productos' => $s->contarProductos(),
                ]),
            ]);

        return Inertia::render('Catalogo/Index', [
            'grupos' => $grupos,
        ]);
    }

    /**
     * Subcategorías de un grupo específico.
     */
    public function grupo(string $grupoId): Response
    {
        $grupo = GrupoCategoria::where('activo', true)
            ->whereNull('deleted_at')
            ->findOrFail($grupoId);

        $subcategorias = $grupo->subcategorias()
            ->where('activo', true)
            ->get()
            ->map(fn($s) => [
                'id'              => $s->id,
                'nombre'          => $s->nombre,
                'imagen'          => $s->imagen,
                'descripcion'     => $s->descripcion,
                'label_completo'  => $s->label_completo,
                'total_productos' => $s->contarProductos(),
            ]);

        return Inertia::render('Catalogo/Grupo', [
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

    /**
     * Productos de una subcategoría específica.
     */
    public function subcategoria(string $grupoId, string $subcatId): Response
    {
        $grupo  = GrupoCategoria::where('activo', true)->whereNull('deleted_at')->findOrFail($grupoId);
        $subcat = Categoria::where('grupo_id', $grupoId)->where('activo', true)->findOrFail($subcatId);

        $productos = Producto::where('categoria', $subcat->label_completo)
            ->where('activo', true)
            ->whereNull('deleted_at')
            ->orderBy('nombre')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'nombre'      => $p->nombre,
                'descripcion' => $p->descripcion,
                'precio'      => $p->precio,
                'imagen'      => $p->imagen,
                'stock'       => $p->stock,
                'disponible'  => $p->stock > 0,
                'categoria'   => $p->categoria,
            ]);

        return Inertia::render('Catalogo/Subcategoria', [
            'grupo'    => [
                'id'     => $grupo->id,
                'nombre' => $grupo->nombre,
                'color'  => $grupo->color,
            ],
            'subcat'   => [
                'id'             => $subcat->id,
                'nombre'         => $subcat->nombre,
                'label_completo' => $subcat->label_completo,
            ],
            'productos' => $productos,
        ]);
    }

    /**
     * Detalle de un producto individual.
     */
    public function producto(string $productoId): Response
    {
        $producto = Producto::where('activo', true)
            ->whereNull('deleted_at')
            ->findOrFail($productoId);

        return Inertia::render('Catalogo/Producto', [
            'producto' => [
                'id'          => $producto->id,
                'nombre'      => $producto->nombre,
                'descripcion' => $producto->descripcion,
                'precio'      => $producto->precio,
                'imagen'      => $producto->imagen,
                'stock'       => $producto->stock,
                'disponible'  => $producto->stock > 0,
                'categoria'   => $producto->categoria,
            ],
        ]);
    }
}
