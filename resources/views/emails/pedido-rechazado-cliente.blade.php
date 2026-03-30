<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido rechazado — VitaliStore</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">
<table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">
                <!-- LOGO -->
                <tr><td align="center" style="padding-bottom:28px;">
                        <table cellpadding="0" cellspacing="0"><tr>
                                <td style="background:linear-gradient(145deg,#ef4444,#b91c1c);border-radius:16px;width:52px;height:52px;text-align:center;vertical-align:middle;">
                                    <span style="font-size:24px;line-height:52px;">🛒</span>
                                </td>
                                <td style="padding-left:12px;"><span style="font-size:1.4rem;font-weight:600;color:#2d1a08;letter-spacing:-0.03em;">VitaliStore</span></td>
                            </tr></table>
                    </td></tr>

                <!-- CARD -->
                <tr><td style="background:rgba(255,255,255,0.82);border:1px solid rgba(255,255,255,0.85);border-radius:28px;padding:40px 36px;box-shadow:0 16px 48px rgba(180,90,20,0.10);">
                        <!-- Ícono -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                            <tr><td align="center"><div style="display:inline-block;width:72px;height:72px;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.22);border-radius:50%;text-align:center;line-height:72px;font-size:32px;">❌</div></td></tr>
                        </table>

                        <h1 style="margin:0 0 8px;font-size:1.4rem;font-weight:300;color:#2d1a08;letter-spacing:-0.04em;text-align:center;">Tu pedido fue rechazado</h1>
                        <p style="margin:0 0 6px;font-size:0.88rem;color:rgba(150,80,20,0.65);text-align:center;">Hola, <strong style="color:#2d1a08;">{{ $pedido->nombre_receptor }}</strong></p>
                        <p style="margin:0 0 24px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;line-height:1.6;">Lamentamos informarte que tu pedido <strong style="color:#dc2626;">{{ $pedido->numero_pedido }}</strong> no pudo ser procesado.</p>

                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.25) 30%,rgba(200,140,80,0.25) 70%,transparent);margin-bottom:24px;"></div>

                        @if($pedido->motivo_rechazo)
                            <div style="background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.18);border-radius:14px;padding:14px 18px;margin-bottom:16px;">
                                <p style="margin:0 0 6px;font-size:0.72rem;font-weight:700;color:rgba(185,28,28,0.7);text-transform:uppercase;letter-spacing:0.08em;">Motivo</p>
                                <p style="margin:0;font-size:0.9rem;color:#2d1a08;font-weight:600;">{{ $pedido->motivo_rechazo }}</p>
                            </div>
                        @endif

                        @if($pedido->mensaje_rechazo)
                            <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:14px 18px;margin-bottom:16px;">
                                <p style="margin:0 0 6px;font-size:0.72rem;font-weight:700;color:rgba(146,64,14,0.7);text-transform:uppercase;letter-spacing:0.08em;">Mensaje del equipo</p>
                                <p style="margin:0;font-size:0.85rem;color:#2d1a08;line-height:1.6;">{{ $pedido->mensaje_rechazo }}</p>
                            </div>
                        @endif

                        <!-- Datos de contacto -->
                        <div style="background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.18);border-radius:14px;padding:14px 18px;margin-top:16px;">
                            <p style="margin:0 0 8px;font-size:0.82rem;font-weight:600;color:rgba(29,78,216,0.85);">¿Tienes dudas? Contáctanos:</p>
                            @if(!empty($contacto['telefono1']))<p style="margin:0 0 4px;font-size:0.82rem;color:#2d1a08;">📞 {{ $contacto['telefono1'] }}</p>@endif
                            @if(!empty($contacto['telefono2']))<p style="margin:0 0 4px;font-size:0.82rem;color:#2d1a08;">📞 {{ $contacto['telefono2'] }}</p>@endif
                            @if(!empty($contacto['correo1']))<p style="margin:0 0 4px;font-size:0.82rem;color:#2d1a08;">✉️ {{ $contacto['correo1'] }}</p>@endif
                            @if(!empty($contacto['correo2']))<p style="margin:0;font-size:0.82rem;color:#2d1a08;">✉️ {{ $contacto['correo2'] }}</p>@endif
                            <p style="margin:8px 0 0;font-size:0.78rem;color:rgba(150,80,20,0.6);">También puedes acercarte a nuestro punto físico.</p>
                        </div>

                        <div style="margin-top:24px;text-align:center;">
                            <a href="{{ url('/cliente/mis-pedidos') }}" style="display:inline-block;padding:12px 32px;background:linear-gradient(145deg,rgba(220,38,38,0.88),rgba(185,28,28,0.95));color:#fff;font-size:0.88rem;font-weight:600;text-decoration:none;border-radius:14px;box-shadow:0 8px 24px rgba(220,38,38,0.22);">Ver mis pedidos →</a>
                        </div>
                    </td></tr>

                <tr><td align="center" style="padding-top:24px;"><p style="margin:0;font-size:0.72rem;color:rgba(150,80,20,0.42);">© {{ date('Y') }} VitaliStore · Todos los derechos reservados</p></td></tr>
            </table>
        </td></tr>
</table>
</body>
</html>
