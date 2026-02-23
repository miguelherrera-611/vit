<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Abono extends Model
{
    use HasFactory;

    protected $fillable = [
        'venta_id',
        'monto',
        'forma_pago',
        'empleado_id',
        'observaciones',
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function empleado()
    {
        return $this->belongsTo(User::class, 'empleado_id');
    }
}
