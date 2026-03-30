<?php

// ── app/Models/ConfigContacto.php ───────────────────────────
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigContacto extends Model
{
    protected $table = 'config_contacto';
    protected $fillable = ['clave', 'valor'];
}
