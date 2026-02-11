<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $code;
    public $userName;

    // CAMBIA ESTO: Ahora acepta solo el código
    public function __construct($code)
    {
        $this->code = $code;
        $this->userName = 'Usuario'; // Valor por defecto
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Código de Verificación - VitaliStore',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.verification-code',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
