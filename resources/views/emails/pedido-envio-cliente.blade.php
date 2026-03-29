<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu pedido está en camino - VitaliStore</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">

<table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

                <!-- LOGO -->
                <tr>
                    <td align="center" style="padding-bottom:28px;">
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="background:linear-gradient(145deg,#ef4444,#b91c1c);border-radius:16px;width:52px;height:52px;text-align:center;vertical-align:middle;">
                                    <span style="font-size:24px;line-height:52px;">🛒</span>
                                </td>
                                <td style="padding-left:12px;">
                                    <span style="font-size:1.4rem;font-weight:600;color:#2d1a08;letter-spacing:-0.03em;">VitaliStore</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- CARD -->
                <tr>
                    <td style="background:rgba(255,255,255,0.82);border:1px solid rgba(255,255,255,0.85);border-radius:28px;padding:40px 36px;box-shadow:0 16px 48px rgba(180,90,20,0.10);">

                        <!-- Ícono -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;width:72px;height:72px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.22);border-radius:50%;text-align:center;line-height:72px;font-size:32px;">
                                        🚚
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <h1 style="margin:0 0 8px;font-size:1.5rem;font-weight:300;color:#2d1a08;letter-spacing:-0.04em;text-align:center;">
                            ¡Tu pedido está en camino!
                        </h1>
                        <p style="margin:0 0 6px;font-size:0.88rem;color:rgba(150,80,20,0.65);text-align:center;">
                            Hola, <strong style="color:#2d1a08;">{{ $pedido->nombre_receptor }}</strong>
                        </p>
                        <p style="margin:0 0 28px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;line-height:1.6;">
                            Hemos verificado tu pago y tu pedido ha sido enviado. ¡Pronto estará en tus manos!
                        </p>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.25) 30%,rgba(200,140,80,0.25) 70%,transparent);margin-bottom:24px;"></div>

                        <!-- Info del pedido -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                            <tr>
                                <td width="50%" style="padding:8px 8px 8px 0;vertical-align:top;">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Pedido</span><br>
                                    <span style="font-size:0.9rem;font-weight:600;color:#dc2626;">{{ $pedido->numero_pedido }}</span>
                                </td>
                                <td width="50%" style="padding:8px 0 8px 8px;vertical-align:top;">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Total Pagado</span><br>
                                    <span style="font-size:0.9rem;font-weight:600;color:#2d1a08;">${{ number_format($pedido->total, 0, ',', '.') }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding:12px 0 4px;">
                                    <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Dirección de Entrega</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $pedido->direccion }}, {{ $pedido->ciudad }}</span>
                                </td>
                            </tr>
                            @if($pedido->indicaciones)
                                <tr>
                                    <td colspan="2" style="padding:8px 0 4px;">
                                        <span style="font-size:0.72rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Indicaciones</span><br>
                                        <span style="font-size:0.85rem;color:rgba(120,60,10,0.75);">{{ $pedido->indicaciones }}</span>
                                    </td>
                                </tr>
                            @endif
                        </table>

                        <!-- Alert de seguimiento -->
                        <div style="background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.22);border-radius:14px;padding:14px 18px;margin-bottom:24px;text-align:center;">
                            <p style="margin:0;font-size:0.82rem;color:rgba(4,120,87,0.9);line-height:1.6;font-weight:500;">
                                📦 Cuando recibas tu pedido, ingresa a tu cuenta y confírmalo<br>
                                para que podamos marcarlo como entregado.
                            </p>
                        </div>

                        <!-- CTA -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center">
                                    <a href="{{ url('/cliente/mis-pedidos') }}"
                                       style="display:inline-block;padding:13px 36px;background:linear-gradient(145deg,rgba(16,185,129,0.85),rgba(4,120,87,0.95));color:#fff;font-size:0.9rem;font-weight:600;text-decoration:none;border-radius:14px;box-shadow:0 8px 24px rgba(16,185,129,0.25);">
                                        Ver mis pedidos →
                                    </a>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center" style="padding-top:24px;">
                        <p style="margin:0;font-size:0.72rem;color:rgba(150,80,20,0.42);">
                            © {{ date('Y') }} VitaliStore · Todos los derechos reservados
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
</table>

</body>
</html>
