<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'user_id',
        'numero_pedido',
        'nombre_receptor',
        'telefono_receptor',
        'ciudad',
        'direccion',
        'indicaciones',
        'metodo_pago',
        'comprobante_pago',
        'subtotal',
        'total',
        'estado',
        'notas_admin',
        'motivo_rechazo',
        'mensaje_rechazo',
        'stock_descontado',
        'email_cliente',
    ];

    protected $casts = [
        'subtotal'          => 'decimal:2',
        'total'             => 'decimal:2',
        'stock_descontado'  => 'boolean',
    ];

    // ── Relaciones ───────────────────────────────────────────────

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(PedidoItem::class);
    }

    // ── Scopes ───────────────────────────────────────────────────

    public function scopeEnRevision($query)
    {
        return $query->where('estado', 'revision');
    }

    public function scopePorEstado($query, string $estado)
    {
        return $query->where('estado', $estado);
    }

    // ── Accessors ────────────────────────────────────────────────

    public function getEstadoLabelAttribute(): string
    {
        return match ($this->estado) {
            'revision'    => 'En Revisión',
            'aprobado'    => 'Aprobado',
            'envio_curso' => 'Envío en Curso',
            'entregado'   => 'Entregado',
            'rechazado'   => 'Rechazado',
            'cancelado'   => 'Cancelado',
            default       => ucfirst($this->estado),
        };
    }

    public function getEstadoColorAttribute(): string
    {
        return match ($this->estado) {
            'revision'    => 'yellow',
            'aprobado'    => 'blue',
            'envio_curso' => 'purple',
            'entregado'   => 'green',
            'rechazado'   => 'red',
            'cancelado'   => 'gray',
            default       => 'gray',
        };
    }

    public function getNombreClienteAttribute(): string
    {
        return $this->user?->name ?? $this->nombre_receptor;
    }

    public function getEmailAttribute(): string
    {
        return $this->user?->email ?? ($this->email_cliente ?? '');
    }
}
