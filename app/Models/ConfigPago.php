<?php
// ============================================================
// INSTRUCCIONES: Crear cada clase en su propio archivo dentro de app/Models/
// ============================================================

// ── app/Models/ConfigPago.php ────────────────────────────────
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigPago extends Model
{
    protected $table = 'config_pagos';

    protected $fillable = [
        'metodo',
        'numero',
        'qr_imagen',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function getQrUrlAttribute(): ?string
    {
        return $this->qr_imagen
            ? asset('storage/' . $this->qr_imagen)
            : null;
    }
}
