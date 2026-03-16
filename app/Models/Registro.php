<?php
// app/Models/Registro.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    protected $table = 'registros';

    protected $fillable = [
        'user_id',
        'user_name',
        'user_rol',
        'accion',
        'modulo',
        'descripcion',
        'modelo_tipo',
        'modelo_id',
        'datos_anteriores',
        'datos_nuevos',
        'ip',
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos'     => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ──────────────────────────────────────────────────

    public function scopePorModulo($query, string $modulo)
    {
        return $query->where('modulo', $modulo);
    }

    public function scopePorAccion($query, string $accion)
    {
        return $query->where('accion', $accion);
    }

    // ── Helper estático para registrar desde cualquier lugar ──

    public static function registrar(
        string  $accion,
        string  $modulo,
        string  $descripcion,
        ?Model  $modelo        = null,
        ?array  $datosAnteriores = null,
        ?array  $datosNuevos   = null
    ): self {
        $user = auth()->user();

        return self::create([
            'user_id'          => $user?->id,
            'user_name'        => $user?->name ?? 'Sistema',
            'user_rol'         => $user?->roles->first()?->name ?? 'desconocido',
            'accion'           => $accion,
            'modulo'           => $modulo,
            'descripcion'      => $descripcion,
            'modelo_tipo'      => $modelo ? class_basename($modelo) : null,
            'modelo_id'        => $modelo?->id,
            'datos_anteriores' => $datosAnteriores,
            'datos_nuevos'     => $datosNuevos,
            'ip'               => request()->ip(),
        ]);
    }
}
