<?php
// app/Mail/ConfigPagoCambioMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfigPagoCambioMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $metodo;
    public array  $cambios;
    public string $usuario;

    public function __construct(string $metodo, array $cambios, string $usuario)
    {
        $this->metodo  = $metodo;
        $this->cambios = $cambios;
        $this->usuario = $usuario;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "⚠️ Datos de pago modificados — {$this->metodo}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.config-pago-cambio',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
