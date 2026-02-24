<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'nombre',
        'tipo',
        'imagen',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // ── Scopes ──────────────────────────────────────────────────

    public function scopeDama($query)
    {
        return $query->where('tipo', 'dama');
    }

    public function scopeCaballero($query)
    {
        return $query->where('tipo', 'caballero');
    }

    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    // ── Relaciones ──────────────────────────────────────────────

    /**
     * Productos que pertenecen a esta categoría.
     * La columna 'categoria' en productos guarda "tipo - nombre" (ej: "Dama - Blusas").
     */
    public function productos()
    {
        $prefijo = ucfirst($this->tipo) . ' - ' . $this->nombre;
        return Producto::where('categoria', $prefijo);
    }

    // ── Helpers ──────────────────────────────────────────────────

    /**
     * Retorna el label completo: "Dama - Blusas"
     */
    public function getLabelCompletoAttribute(): string
    {
        return ucfirst($this->tipo) . ' - ' . $this->nombre;
    }

    /**
     * Cuenta productos asociados a esta categoría.
     */
    public function contarProductos(): int
    {
        return Producto::where('categoria', $this->label_completo)->count();
    }
}
