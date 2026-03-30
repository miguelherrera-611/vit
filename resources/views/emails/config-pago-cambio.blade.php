<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Datos de pago modificados</title></head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#fdf6f0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <tr><td align="center" style="padding-bottom:24px;">
                        <span style="font-size:1.4rem;font-weight:600;color:#2d1a08;">VitaliStore — Alerta de Seguridad</span>
                    </td></tr>
                <tr><td style="background:rgba(255,255,255,0.9);border-radius:24px;padding:36px;">
                        <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:14px;padding:16px 20px;margin-bottom:20px;">
                            <p style="margin:0;font-size:0.9rem;font-weight:600;color:rgba(146,64,14,0.9);">⚠️ Se modificaron los datos de pago de: <strong>{{ $metodo }}</strong></p>
                        </div>
                        <p style="font-size:0.85rem;color:rgba(150,80,20,0.7);margin:0 0 16px;">Usuario: <strong>{{ $usuario }}</strong> — {{ now()->format('d/m/Y H:i') }}</p>
                        <p style="font-size:0.82rem;font-weight:700;color:rgba(150,80,20,0.6);text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Cambios realizados:</p>
                        @foreach($cambios as $cambio)
                            <div style="background:rgba(255,255,255,0.6);border:1px solid rgba(200,140,80,0.15);border-radius:10px;padding:8px 14px;margin-bottom:6px;">
                                <p style="margin:0;font-size:0.85rem;color:#2d1a08;">• {{ $cambio }}</p>
                            </div>
                        @endforeach
                        <p style="font-size:0.78rem;color:rgba(150,80,20,0.55);margin-top:16px;">Si no realizaste este cambio, revisa el acceso al sistema inmediatamente.</p>
                    </td></tr>
            </table>
        </td></tr>
</table>
</body>
</html>
--}}
