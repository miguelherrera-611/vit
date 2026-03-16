<?php
// app/Mail/DeleteConfirmationMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DeleteConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public int $code;
    public int $cantidad;

    public function __construct(int $code, int $cantidad)
    {
        $this->code     = $code;
        $this->cantidad = $cantidad;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmación de eliminación — VitaliStore',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.delete-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
