<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo pedido en revisión - VitaliStore</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">

<table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

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
                                    <div style="display:inline-block;width:68px;height:68px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);border-radius:50%;text-align:center;line-height:68px;font-size:30px;">
                                        📋
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <h1 style="margin:0 0 8px;font-size:1.4rem;font-weight:300;color:#2d1a08;letter-spacing:-0.03em;text-align:center;">
                            Nuevo pedido en revisión
                        </h1>
                        <p style="margin:0 0 24px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;">
                            Se ha recibido un nuevo pedido con comprobante de pago adjunto.
                        </p>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.25) 30%,rgba(200,140,80,0.25) 70%,transparent);margin-bottom:24px;"></div>

                        <!-- Info del pedido -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Número de Pedido</span><br>
                                    <span style="font-size:1rem;font-weight:600;color:#dc2626;">{{ $pedido->numero_pedido }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Cliente</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $pedido->nombre_receptor }}</span>
                                    @if($pedido->email)
                                        <span style="font-size:0.8rem;color:rgba(150,80,20,0.6);"> · {{ $pedido->email }}</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Teléfono</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $pedido->telefono_receptor }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Dirección de Envío</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $pedido->direccion }}, {{ $pedido->ciudad }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;border-bottom:1px solid rgba(200,140,80,0.1);">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Método de Pago</span><br>
                                    <span style="font-size:0.9rem;color:#2d1a08;">{{ $pedido->metodo_pago }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;">
                                    <span style="font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Total del Pedido</span><br>
                                    <span style="font-size:1.1rem;font-weight:700;color:#dc2626;">${{ number_format($pedido->total, 0, ',', '.') }}</span>
                                </td>
                            </tr>
                        </table>

                        <!-- Productos -->
                        <p style="margin:0 0 10px;font-size:0.75rem;font-weight:700;color:rgba(150,80,20,0.55);text-transform:uppercase;letter-spacing:0.08em;">Productos Solicitados</p>
                        @foreach($pedido->items as $item)
                            <div style="background:rgba(255,250,245,0.8);border:1px solid rgba(200,140,80,0.15);border-radius:12px;padding:10px 14px;margin-bottom:8px;display:flex;justify-content:space-between;">
                                <span style="font-size:0.85rem;color:#2d1a08;">{{ $item->nombre_producto }} × {{ $item->cantidad }}</span>
                                <span style="font-size:0.85rem;font-weight:600;color:#2d1a08;">${{ number_format($item->subtotal, 0, ',', '.') }}</span>
                            </div>
                        @endforeach

                        <!-- CTA -->
                        <div style="margin-top:24px;text-align:center;">
                            <p style="margin:0 0 14px;font-size:0.82rem;color:rgba(150,80,20,0.6);">
                                Ingresa al panel de administración para revisar el comprobante y gestionar este pedido.
                            </p>
                            <a href="{{ url('/admin/pedidos') }}"
                               style="display:inline-block;padding:13px 36px;background:linear-gradient(145deg,rgba(220,38,38,0.88),rgba(185,28,28,0.95));color:#fff;font-size:0.9rem;font-weight:600;text-decoration:none;border-radius:14px;box-shadow:0 8px 24px rgba(220,38,38,0.22);">
                                Ver pedido en el panel →
                            </a>
                        </div>

                    </td>
                </tr>

                <!-- FOOTER -->
                <tr>
                    <td align="center" style="padding-top:24px;">
                        <p style="margin:0;font-size:0.72rem;color:rgba(150,80,20,0.42);">
                            © {{ date('Y') }} VitaliStore · Notificación automática del sistema
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
</table>

</body>
</html>
