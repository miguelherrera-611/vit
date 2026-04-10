<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoTalla extends Model
{
    protected $table = 'producto_tallas';

    protected $fillable = ['producto_id', 'talla', 'stock', 'orden'];

    protected $casts = [
        'stock' => 'integer',
        'orden' => 'integer',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function scopeConStock($q)
    {
        return $q->where('stock', '>', 0);
    }

    public function scopeOrdenadas($q)
    {
        return $q->orderBy('orden')->orderBy('talla');
    }

    public function getDisponibleAttribute(): bool
    {
        return $this->stock > 0;
    }
}
