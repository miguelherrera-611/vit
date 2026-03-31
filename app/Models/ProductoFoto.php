<?php
// app/Models/ProductoFoto.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoFoto extends Model
{
    protected $table = 'producto_fotos';
    protected $fillable = ['producto_id', 'ruta', 'orden'];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    // Siempre devuelve URL completa, sin importar si la ruta ya lo es
    public function getUrlAttribute(): string
    {
        if (!$this->ruta) return '';
        if (str_starts_with($this->ruta, 'http')) return $this->ruta;
        return asset('storage/' . $this->ruta);
    }
}
