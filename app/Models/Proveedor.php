<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proveedor extends Model
{
    use SoftDeletes;

    // ← Esto corrige el error: Laravel usaba 'proveedors' por defecto
    protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'empresa',
        'email',
        'telefono',
        'documento',
        'direccion',
        'sitio_web',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
