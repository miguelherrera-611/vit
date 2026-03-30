<?php
// app/Mail/AdminEntregaConfirmadaMail.php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminEntregaConfirmadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;

    public function __construct(Pedido $pedido)
    {
        $this->pedido = $pedido;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "📦 Entrega confirmada — {$this->pedido->numero_pedido}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-entrega-confirmada',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
