<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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
        'delete_code',
        'delete_code_expires_at',
    ];

    // Dejar que Eloquent maneje created_at/updated_at como Carbon normalmente
    // NO castear datos_anteriores/datos_nuevos aquí — los decodificamos manualmente en el controller
    protected $casts = [
        'delete_code_expires_at' => 'datetime',
    ];

    /**
     * Helper estático para registrar acciones fácilmente desde cualquier controller.
     */
    public static function registrar(
        string $accion,
        string $modulo,
        string $descripcion,
               $modelo = null,
               $datosAnteriores = null,
               $datosNuevos = null
    ): self {
        $user = Auth::user();

        return self::create([
            'user_id'          => $user?->id,
            'user_name'        => $user?->name ?? 'Sistema',
            'user_rol'         => $user?->getRoleNames()->first() ?? 'sin rol',
            'accion'           => $accion,
            'modulo'           => $modulo,
            'descripcion'      => $descripcion,
            'modelo_tipo'      => $modelo ? class_basename($modelo) : null,
            'modelo_id'        => $modelo?->id,
            'datos_anteriores' => $datosAnteriores ? json_encode($datosAnteriores, JSON_UNESCAPED_UNICODE) : null,
            'datos_nuevos'     => $datosNuevos     ? json_encode($datosNuevos,     JSON_UNESCAPED_UNICODE) : null,
            'ip'               => request()->ip(),
        ]);
    }
}
