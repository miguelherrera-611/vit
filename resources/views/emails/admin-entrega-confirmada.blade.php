<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Entrega confirmada — Admin</title></head>
<body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#fdf6f0;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <tr><td align="center" style="padding-bottom:24px;">
                        <span style="font-size:1.4rem;font-weight:600;color:#2d1a08;">VitaliStore — Admin</span>
                    </td></tr>
                <tr><td style="background:rgba(255,255,255,0.9);border-radius:24px;padding:36px;">
                        <div style="text-align:center;font-size:3rem;margin-bottom:16px;">📦</div>
                        <h2 style="text-align:center;color:#2d1a08;font-weight:300;margin:0 0 8px;">¡Entrega confirmada!</h2>
                        <p style="text-align:center;color:rgba(150,80,20,0.7);font-size:0.85rem;margin:0 0 20px;">
                            El cliente <strong>{{ $pedido->nombre_cliente }}</strong> confirmó la recepción del pedido <strong style="color:#dc2626;">{{ $pedido->numero_pedido }}</strong>.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">Total</span><br>
                                    <span style="font-size:1rem;font-weight:700;color:#dc2626;">${{ number_format($pedido->total, 0, ',', '.') }}</span>
                                </td></tr>
                            <tr><td style="padding:8px 0;">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;">Confirmado en</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ now()->format('d/m/Y H:i') }}</span>
                                </td></tr>
                        </table>
                    </td></tr>
            </table>
        </td></tr>
</table>
</body>
</html>
--}}
