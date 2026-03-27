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
        'tipo_movimiento',   // 'abono_normal' | 'ajuste'
    ];

    protected $casts = [
        'monto' => 'decimal:2',
    ];

    // ── Relaciones ────────────────────────────────────────────────

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function empleado()
    {
        return $this->belongsTo(User::class, 'empleado_id');
    }

    // ── Accessors ─────────────────────────────────────────────────

    /** Etiqueta legible para mostrar en UI */
    public function getTipoMovimientoLabelAttribute(): string
    {
        return match ($this->tipo_movimiento) {
            'ajuste'       => 'Ajuste',
            default        => 'Abono',
        };
    }

    /** True si fue registrado como ajuste auditado */
    public function getEsAjusteAttribute(): bool
    {
        return $this->tipo_movimiento === 'ajuste';
    }
}
