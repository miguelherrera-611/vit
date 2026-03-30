<?php

// ── app/Models/ProductoFoto.php ──────────────────────────────
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductoFoto extends Model
{
     protected $table = 'producto_fotos';
     protected $fillable = ['producto_id', 'ruta', 'orden'];

     public function producto() { return $this->belongsTo(Producto::class); }
     public function getUrlAttribute(): string { return asset('storage/' . $this->ruta); }
}
