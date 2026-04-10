<?php
// app/Http/Controllers/CatalogoController.php

namespace App\Http\Controllers;

use App\Models\GrupoCategoria;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\ProductoFoto;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoController extends Controller
{
    /**
     * Convierte una ruta de storage en URL pública completa.
     * Si ya es una URL completa la devuelve tal cual.
     * Si es null devuelve null.
     */
    private function storageUrl(?string $ruta): ?string
    {
        if (!$ruta) return null;
        if (str_starts_with($ruta, 'http')) return $ruta;
        return asset('storage/' . $ruta);
    }

    /**
     * Página principal del catálogo — grupos de categorías.
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
                // imagen con URL completa para que el cliente la vea
                'imagen'          => $this->storageUrl($g->imagen),
                'descripcion'     => $g->descripcion,
                'color'           => $g->color,
                'total_productos' => $g->totalProductos(),
                'subcategorias'   => $g->subcategorias->map(fn($s) => [
                    'id'              => $s->id,
                    'nombre'          => $s->nombre,
                    // imagen con URL completa
                    'imagen'          => $this->storageUrl($s->imagen),
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
                'imagen'          => $this->storageUrl($s->imagen),
                'descripcion'     => $s->descripcion,
                'label_completo'  => $s->label_completo,
                'total_productos' => $s->contarProductos(),
            ]);

        return Inertia::render('Catalogo/Grupo', [
            'grupo' => [
                'id'          => $grupo->id,
                'nombre'      => $grupo->nombre,
                'imagen'      => $this->storageUrl($grupo->imagen),
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
            ->with(['fotos', 'tallas'])
            ->get()
            ->map(fn($p) => [
                'id'           => $p->id,
                'nombre'       => $p->nombre,
                'descripcion'  => $p->descripcion,
                'precio'       => $p->precio,
                'imagen'       => $this->storageUrl($p->imagen),
                'fotos'        => $p->fotos->map(fn($f) => $this->storageUrl($f->ruta)),
                'maneja_tallas'=> $p->maneja_tallas,
                'stock'        => $p->stock_total ?? $p->stock,
                'disponible'   => ($p->stock_total ?? $p->stock) > 0,
                'tallas'       => $p->maneja_tallas
                    ? $p->tallas->where('stock', '>', 0)
                        ->map(fn($t) => ['talla' => $t->talla, 'stock' => $t->stock])
                        ->values()
                    : [],
                'categoria'    => $p->categoria,
            ]);

        return Inertia::render('Catalogo/Subcategoria', [
            'grupo' => [
                'id'     => $grupo->id,
                'nombre' => $grupo->nombre,
                'color'  => $grupo->color,
            ],
            'subcat' => [
                'id'             => $subcat->id,
                'nombre'         => $subcat->nombre,
                'imagen'         => $this->storageUrl($subcat->imagen),
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
            ->with(['fotos', 'tallas'])
            ->findOrFail($productoId);

        return Inertia::render('Catalogo/Producto', [
            'producto' => [
                'id'           => $producto->id,
                'nombre'       => $producto->nombre,
                'descripcion'  => $producto->descripcion,
                'precio'       => $producto->precio,
                'imagen'       => $this->storageUrl($producto->imagen),
                'fotos'        => $producto->fotos->map(fn($f) => $this->storageUrl($f->ruta)),
                'maneja_tallas'=> $producto->maneja_tallas,
                'stock'        => $producto->stock_total ?? $producto->stock,
                'disponible'   => ($producto->stock_total ?? $producto->stock) > 0,
                'tallas'       => $producto->maneja_tallas
                    ? $producto->tallas->where('stock', '>', 0)
                        ->map(fn($t) => ['talla' => $t->talla, 'stock' => $t->stock])
                        ->values()
                    : [],
                'categoria'    => $producto->categoria,
            ],
        ]);
    }
}
