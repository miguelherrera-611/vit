<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'descripcion',
        'codigo_barras',
        'categoria',
        'precio',
        'stock',
        'stock_minimo',
        'imagen',
        'activo',
    ];

    protected $casts = [
        'precio'       => 'decimal:2',
        'activo'       => 'boolean',
        'stock'        => 'integer',
        'stock_minimo' => 'integer',
    ];

    // ── Scopes ──────────────────────────────────────────────────

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeConStock($query)
    {
        return $query->where('stock', '>', 0);
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
