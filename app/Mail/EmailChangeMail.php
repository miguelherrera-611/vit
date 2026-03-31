<?php
// app/Mail/EmailChangeMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailChangeMail extends Mailable
{
    use Queueable, SerializesModels;

    public int    $code;
    public string $nuevoEmail;

    public function __construct(int $code, string $nuevoEmail)
    {
        $this->code       = $code;
        $this->nuevoEmail = $nuevoEmail;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Código de verificación — Cambio de correo VitaliStore',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.email-change',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
