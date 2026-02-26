<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoCategoria extends Model
{
    use SoftDeletes;

    protected $table = 'grupos_categoria';

    protected $fillable = [
        'nombre',
        'imagen',
        'descripcion',
        'color',
        'orden',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'orden'  => 'integer',
    ];

    // ── Relación: subcategorías ──────────────────────────────────

    public function subcategorias()
    {
        return $this->hasMany(Categoria::class, 'grupo_id')->orderBy('nombre');
    }

    // ── Helper: total productos en el grupo ──────────────────────

    public function totalProductos(): int
    {
        return $this->subcategorias()
            ->get()
            ->sum(fn($c) => $c->contarProductos());
    }
}
