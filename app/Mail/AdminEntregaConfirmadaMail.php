<?php

// ── app/Mail/AdminEntregaConfirmadaMail.php ──────────────────
class AdminEntregaConfirmadaMail extends Mailable {
    use Queueable, SerializesModels;
    public Pedido $pedido;
    public function __construct(Pedido $pedido) { $this->pedido = $pedido; }
    public function envelope(): Envelope {
        return new Envelope(subject: "📦 Entrega confirmada — {$this->pedido->numero_pedido}");
    }
    public function content(): Content { return new Content(view: 'emails.admin-entrega-confirmada'); }
    public function attachments(): array { return []; }
}
