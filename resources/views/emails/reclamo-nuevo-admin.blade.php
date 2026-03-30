<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Nuevo reclamo — Admin</title></head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#fdf6f0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <tr><td align="center" style="padding-bottom:24px;">
                        <span style="font-size:1.4rem;font-weight:600;color:#2d1a08;">VitaliStore — Nuevo Reclamo</span>
                    </td></tr>
                <tr><td style="background:rgba(255,255,255,0.9);border-radius:24px;padding:36px;">
                        <div style="text-align:center;font-size:3rem;margin-bottom:16px;">🆘</div>
                        <h2 style="text-align:center;color:#2d1a08;font-weight:300;margin:0 0 20px;">Nuevo reclamo recibido</h2>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">Tipo</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $reclamo->tipo_label }}</span>
                                </td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">Cliente</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $reclamo->user?->name ?? 'Anónimo' }}</span>
                                </td></tr>
                            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">WhatsApp para contacto</span><br>
                                    <span style="font-size:1rem;font-weight:700;color:#dc2626;">{{ $reclamo->telefono_contacto }}</span>
                                </td></tr>
                            @if($reclamo->descripcion)
                                <tr><td style="padding:8px 0;">
                                        <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">Descripción</span><br>
                                        <span style="font-size:0.85rem;color:#2d1a08;line-height:1.5;">{{ $reclamo->descripcion }}</span>
                                    </td></tr>
                            @endif
                        </table>
                        <div style="margin-top:20px;text-align:center;">
                            <a href="https://wa.me/57{{ $reclamo->telefono_contacto }}" style="display:inline-block;padding:12px 28px;background:linear-gradient(145deg,#25d366,#128c7e);color:#fff;font-size:0.88rem;font-weight:600;text-decoration:none;border-radius:14px;">Contactar por WhatsApp →</a>
                        </div>
                        <div style="margin-top:12px;text-align:center;">
                            <a href="{{ url('/admin/reclamos') }}" style="display:inline-block;padding:10px 24px;background:rgba(220,38,38,0.09);border:1px solid rgba(220,38,38,0.35);color:rgba(185,28,28,0.95);font-size:0.85rem;font-weight:600;text-decoration:none;border-radius:12px;">Ver en el panel →</a>
                        </div>
                    </td></tr>
            </table>
        </td></tr>
</table>
</body>
</html>
