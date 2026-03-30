<?php

// ── app/Models/Reclamo.php ───────────────────────────────────
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reclamo extends Model
{
    protected $table = 'reclamos';

    protected $fillable = [
        'user_id',
        'tipo',
        'descripcion',
        'telefono_contacto',
        'estado',
        'notas_admin'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getTipoLabelAttribute(): string
    {
        return match ($this->tipo) {
            'problema_pago'       => 'Problema con el pago',
            'problema_prenda'     => 'Problema con la prenda',
            'retraso_entrega'     => 'Retraso en la entrega',
            'producto_incorrecto' => 'Producto incorrecto',
            'otro'                => 'Otro',
            default               => ucfirst($this->tipo),
        };
    }

    public function getEstadoColorAttribute(): string
    {
        return match ($this->estado) {
            'pendiente'   => 'yellow',
            'en_revision' => 'blue',
            'resuelto'    => 'green',
            'cerrado'     => 'gray',
            default       => 'gray',
        };
    }
}
