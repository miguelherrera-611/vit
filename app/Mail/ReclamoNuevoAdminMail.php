<?php

// ── app/Mail/ReclamoNuevoAdminMail.php ───────────────────────
use App\Models\Reclamo;
class ReclamoNuevoAdminMail extends Mailable {
    use Queueable, SerializesModels;
    public Reclamo $reclamo;
    public function __construct(Reclamo $reclamo) { $this->reclamo = $reclamo; }
    public function envelope(): Envelope {
        return new Envelope(subject: "🆘 Nuevo reclamo de cliente — VitaliStore");
    }
    public function content(): Content { return new Content(view: 'emails.reclamo-nuevo-admin'); }
    public function attachments(): array { return []; }
}
