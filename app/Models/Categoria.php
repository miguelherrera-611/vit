<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'grupo_id',
        'nombre',
        'tipo',
        'imagen',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // ── Relación: pertenece a un grupo ───────────────────────────

    public function grupo()
    {
        return $this->belongsTo(GrupoCategoria::class, 'grupo_id');
    }

    // ── Scopes ───────────────────────────────────────────────────

    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    // ── Helpers ──────────────────────────────────────────────────

    public function getLabelCompletoAttribute(): string
    {
        if ($this->grupo) {
            return $this->grupo->nombre . ' - ' . $this->nombre;
        }
        return ucfirst($this->tipo ?? 'custom') . ' - ' . $this->nombre;
    }

    public function contarProductos(): int
    {
        return Producto::where('categoria', $this->label_completo)->count();
    }
}
