<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'user_id',
        'numero_venta',
        'tipo_venta',
        'forma_pago',
        'subtotal',
        'impuesto',
        'descuento',
        'total',
        'pagado',
        'saldo_pendiente',
        'estado',
        'metodo_pago',
        'notas',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'impuesto' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total' => 'decimal:2',
        'pagado' => 'decimal:2',
        'saldo_pendiente' => 'decimal:2',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(VentaDetalle::class);
    }

    public function abonos()
    {
        return $this->hasMany(Abono::class);
    }

    public function scopeCompletadas($query)
    {
        return $query->where('estado', 'Completada');
    }

    public function scopeHoy($query)
    {
        return $query->whereDate('created_at', today());
    }

    public function scopeEsteMes($query)
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }
}
