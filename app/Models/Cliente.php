<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'documento',
        'direccion',
        'activo',
        'saldo_total',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'saldo_total' => 'decimal:2',
    ];

    public function ventas()
    {
        return $this->hasMany(Venta::class, 'cliente_id');
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }
}
