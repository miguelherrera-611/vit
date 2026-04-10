<?php
// app/Models/Producto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo_barras',
        'categoria',
        'precio',
        'precio_compra',
        'stock',
        'stock_minimo',
        'imagen',
        'activo',
        'maneja_tallas',
    ];

    protected $casts = [
        'precio'        => 'decimal:2',
        'precio_compra' => 'decimal:2',
        'activo'        => 'boolean',
        'stock'         => 'integer',
        'stock_minimo'  => 'integer',
        'maneja_tallas' => 'boolean',
    ];

    // ── Helper privado: convierte ruta relativa a URL completa ────
    private static function buildStorageUrl(?string $ruta): ?string
    {
        if (!$ruta) return null;
        if (str_starts_with($ruta, 'http')) return $ruta;
        return asset('storage/' . $ruta);
    }

    // ── Accessor: $producto->imagen_url → URL completa ────────────
    // Úsalo en los controllers en lugar de $producto->imagen directamente
    public function getImagenUrlAttribute(): ?string
    {
        return self::buildStorageUrl($this->imagen);
    }

    public function getMargenAttribute(): float
    {
        if (!$this->precio_compra || $this->precio_compra == 0) return 0;
        return round((($this->precio - $this->precio_compra) / $this->precio_compra) * 100, 2);
    }

    public function getGananciaUnitariaAttribute(): float
    {
        return (float) ($this->precio - ($this->precio_compra ?? 0));
    }

    // ── Accessors ────────────────────────────────────────────────

    public function getStockTotalAttribute(): int
    {
        if ($this->maneja_tallas) {
            if ($this->relationLoaded('tallas')) return $this->tallas->sum('stock');
            return $this->tallas()->sum('stock');
        }
        return $this->stock;
    }

    // ── Helpers de tallas ────────────────────────────────────────

    public function stockTalla(string $talla): int
    {
        return $this->tallas()->where('talla', $talla)->value('stock') ?? 0;
    }

    public function hayStockTalla(string $talla, int $cantidad = 1): bool
    {
        return $this->stockTalla($talla) >= $cantidad;
    }

    // ── Relaciones ───────────────────────────────────────────────

    public function proveedores()
    {
        return $this->belongsToMany(Proveedor::class, 'producto_proveedor');
    }

    // Fotos adicionales del producto
    public function fotos()
    {
        return $this->hasMany(ProductoFoto::class)->orderBy('orden');
    }

    // Tallas del producto
    public function tallas()
    {
        return $this->hasMany(ProductoTalla::class)->orderBy('orden')->orderBy('talla');
    }

    // ── Scopes ──────────────────────────────────────────────────

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeConStock($query)
    {
        return $query->where(function ($q) {
            $q->where('maneja_tallas', false)->where('stock', '>', 0);
        })->orWhere(function ($q) {
            $q->where('maneja_tallas', true)
              ->whereHas('tallas', fn($t) => $t->where('stock', '>', 0));
        });
    }

    public function scopeBajoStock($query)
    {
        return $query->whereColumn('stock', '<=', 'stock_minimo')
            ->where('stock', '>', 0);
    }

    public function scopeAgotados($query)
    {
        return $query->where('stock', 0);
    }
}
