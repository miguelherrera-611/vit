<?php
// app/Mail/config-contacto-cambio-mail.blade.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ConfigContactoCambioMail extends Mailable
{
    use Queueable, SerializesModels;

    public array  $cambios;
    public string $usuario;

    public function __construct(array $cambios, string $usuario)
    {
        $this->cambios = $cambios;
        $this->usuario = $usuario;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '📞 Datos de contacto modificados — VitaliStore',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.config-contacto-cambio-mail',
            with: [
                'cambios' => $this->cambios,
                'usuario' => $this->usuario,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    // Opcional: puedes eliminar este método para no duplicar definición de vista.
    public function build()
    {
        return $this->subject('Datos de contacto modificados')
            ->view('emails.config-contacto-cambio-mail')
            ->with([
                'cambios' => $this->cambios,
                'usuario' => $this->usuario,
            ]);
    }
}
