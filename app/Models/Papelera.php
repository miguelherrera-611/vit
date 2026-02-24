<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Papelera extends Model
{
    protected $table = 'papelera';

    protected $fillable = [
        'tipo',
        'modelo_id',
        'datos',
        'nombre_display',
        'eliminado_por',
        'eliminado_at',
        'purgar_at',
    ];

    protected $casts = [
        'datos'       => 'array',
        'eliminado_at' => 'datetime',
        'purgar_at'    => 'datetime',
    ];

    // ── Scopes ──────────────────────────────────────────────────

    public function scopeVencidos($query)
    {
        return $query->where('purgar_at', '<=', now());
    }

    public function scopePorTipo($query, string $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    // ── Helpers ──────────────────────────────────────────────────

    /**
     * Días restantes antes de purga automática.
     */
    public function getDiasRestantesAttribute(): int
    {
        return max(0, (int) now()->diffInDays($this->purgar_at, false));
    }

    /**
     * Guarda un registro en papelera con snapshot completo.
     */
    public static function archivar(
        string $tipo,
        Model  $modelo,
        string $nombreDisplay,
        ?string $eliminadoPor = null
    ): self {
        return self::create([
            'tipo'          => $tipo,
            'modelo_id'     => $modelo->id,
            'datos'         => $modelo->toArray(),
            'nombre_display' => $nombreDisplay,
            'eliminado_por' => $eliminadoPor,
            'eliminado_at'  => now(),
            'purgar_at'     => now()->addDays(30),
        ]);
    }
}
