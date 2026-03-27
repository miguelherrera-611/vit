<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class MovimientoInventario extends Model
{
    protected $table = 'movimientos_inventario';

    protected $fillable = [
        'producto_id',
        'user_id',
        'tipo',
        'cantidad',
        'stock_anterior',
        'stock_nuevo',
        'referencia_tipo',
        'referencia_id',
        'motivo',
        'observaciones',
    ];

    protected $casts = [
        'cantidad'       => 'integer',
        'stock_anterior' => 'integer',
        'stock_nuevo'    => 'integer',
    ];

    // ── Relaciones ───────────────────────────────────────────────

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Helper estático para registrar movimientos ───────────────

    /**
     * Registra un movimiento de inventario.
     *
     * @param  Producto  $producto      Producto afectado
     * @param  int       $stockAnterior Stock antes del movimiento
     * @param  int       $stockNuevo    Stock después del movimiento
     * @param  string    $tipo          Tipo: venta|anulacion|ajuste_entrada|ajuste_salida|inicial
     * @param  string|null $motivo      Motivo del movimiento
     * @param  string|null $observaciones Observaciones adicionales
     * @param  Model|null  $referencia  Modelo de referencia (ej: Venta)
     */
    public static function registrar(
        Producto $producto,
        int      $stockAnterior,
        int      $stockNuevo,
        string   $tipo,
        ?string  $motivo = null,
        ?string  $observaciones = null,
        ?Model   $referencia = null
    ): self {
        $cantidad = $stockNuevo - $stockAnterior; // positivo=entrada, negativo=salida

        return self::create([
            'producto_id'     => $producto->id,
            'user_id'         => Auth::id(),
            'tipo'            => $tipo,
            'cantidad'        => $cantidad,
            'stock_anterior'  => $stockAnterior,
            'stock_nuevo'     => $stockNuevo,
            'referencia_tipo' => $referencia ? class_basename($referencia) : null,
            'referencia_id'   => $referencia?->id,
            'motivo'          => $motivo,
            'observaciones'   => $observaciones,
        ]);
    }

    // ── Helpers de presentación ──────────────────────────────────

    public function getTipoLabelAttribute(): string
    {
        return match($this->tipo) {
            'venta'          => 'Venta',
            'anulacion'      => 'Anulación de venta',
            'ajuste_entrada' => 'Ajuste — Entrada',
            'ajuste_salida'  => 'Ajuste — Salida',
            'inicial'        => 'Stock inicial',
            default          => ucfirst($this->tipo),
        };
    }

    public function getTipoColorAttribute(): string
    {
        return match($this->tipo) {
            'venta'          => 'red',
            'anulacion'      => 'green',
            'ajuste_entrada' => 'green',
            'ajuste_salida'  => 'red',
            'inicial'        => 'blue',
            default          => 'gray',
        };
    }

    public function getEsEntradaAttribute(): bool
    {
        return $this->cantidad > 0;
    }
}
