<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'activo',
        'verification_code',
        'code_expires_at',
        // Campos de seguridad de login
        'intentos_fallidos',
        'bloqueado_hasta',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'code_expires_at'   => 'datetime',
            'activo'            => 'boolean',
            // Nuevos casts
            'intentos_fallidos' => 'integer',
            'bloqueado_hasta'   => 'datetime',
        ];
    }

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    // ── Helpers de bloqueo ───────────────────────────────────────

    /**
     * Indica si la cuenta está bloqueada en este momento.
     */
    public function estaBloqueado(): bool
    {
        return $this->bloqueado_hasta !== null
            && $this->bloqueado_hasta->isFuture();
    }

    /**
     * Minutos restantes de bloqueo (redondeado hacia arriba).
     */
    public function minutosRestantesBloqueo(): int
    {
        if (!$this->estaBloqueado()) return 0;
        return (int) ceil(now()->diffInSeconds($this->bloqueado_hasta) / 60);
    }

    /**
     * Registra un intento fallido. Al llegar a 5 bloquea por 30 minutos.
     */
    public function registrarIntentoFallido(): void
    {
        $nuevosIntentos = $this->intentos_fallidos + 1;

        if ($nuevosIntentos >= 5) {
            $this->intentos_fallidos = $nuevosIntentos;
            $this->bloqueado_hasta   = now()->addMinutes(30);
        } else {
            $this->intentos_fallidos = $nuevosIntentos;
        }

        $this->save();
    }

    /**
     * Limpia el contador de intentos tras un login exitoso.
     */
    public function limpiarIntentosFallidos(): void
    {
        if ($this->intentos_fallidos > 0) {
            $this->intentos_fallidos = 0;
            $this->bloqueado_hasta   = null;
            $this->save();
        }
    }

    /**
     * Desbloquea manualmente la cuenta (usado por el admin).
     */
    public function desbloquear(): void
    {
        $this->intentos_fallidos = 0;
        $this->bloqueado_hasta   = null;
        $this->save();
    }
}
