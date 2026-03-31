<?php
// app/Mail/HistorialLimpiadoMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HistorialLimpiadoMail extends Mailable
{
    use Queueable, SerializesModels;

    public int    $total;
    public string $usuario;

    public function __construct(int $total, string $usuario)
    {
        $this->total   = $total;
        $this->usuario = $usuario;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🗑️ Historial de pedidos limpiado — VitaliStore',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.historial-limpiado',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
