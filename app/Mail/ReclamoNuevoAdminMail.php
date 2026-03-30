<?php
// app/Mail/ReclamoNuevoAdminMail.php

namespace App\Mail;

use App\Models\Reclamo;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReclamoNuevoAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public Reclamo $reclamo;

    public function __construct(Reclamo $reclamo)
    {
        $this->reclamo = $reclamo;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🆘 Nuevo reclamo de cliente — VitaliStore",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reclamo-nuevo-admin',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
