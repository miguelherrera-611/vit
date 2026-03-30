<?php
// app/Mail/PedidoRechazadoClienteMail.php

namespace App\Mail;

use App\Models\Pedido;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PedidoRechazadoClienteMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;
    public $contacto;

    public function __construct(Pedido $pedido, $contacto)
    {
        $this->pedido   = $pedido;
        $this->contacto = $contacto;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "❌ Tu pedido {$this->pedido->numero_pedido} fue rechazado — VitaliStore",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pedido-rechazado-cliente',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
