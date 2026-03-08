<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu correo - VitaliStore</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">

<table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);">
    <tr><td align="center" style="padding:48px 16px;">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

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
                    <td style="background:rgba(255,255,255,0.72);border:1px solid rgba(255,255,255,0.85);border-radius:28px;padding:40px 36px;box-shadow:0 16px 48px rgba(180,90,20,0.10);">

                        <!-- Ícono sobre -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;width:68px;height:68px;background:rgba(220,38,38,0.07);border:1px solid rgba(220,38,38,0.15);border-radius:50%;text-align:center;line-height:68px;font-size:30px;">
                                        ✉️
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Título -->
                        <h1 style="margin:0 0 8px;font-size:1.5rem;font-weight:300;color:#2d1a08;letter-spacing:-0.04em;text-align:center;">
                            Verifica tu dirección de correo
                        </h1>
                        <p style="margin:0 0 28px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;line-height:1.6;">
                            Haz clic en el botón de abajo para confirmar tu correo electrónico y activar tu acceso a VitaliStore.
                        </p>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.25) 30%,rgba(200,140,80,0.25) 70%,transparent);margin-bottom:28px;"></div>

                        <!-- BOTÓN -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <a href="{{ $url }}"
                                       style="display:inline-block;padding:14px 44px;background:linear-gradient(145deg,rgba(220,38,38,0.88),rgba(185,28,28,0.95));color:#ffffff;font-size:0.95rem;font-weight:600;text-decoration:none;border-radius:14px;letter-spacing:-0.01em;box-shadow:0 8px 24px rgba(220,38,38,0.22);">
                                        Verificar mi correo electrónico
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <!-- Badge seguridad -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.22);border-radius:12px;padding:10px 18px;">
                                <span style="font-size:0.78rem;color:rgba(4,120,87,0.85);font-weight:500;">
                                    ✓ Si no creaste esta cuenta, no se requiere ninguna acción
                                </span>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.2) 30%,rgba(200,140,80,0.2) 70%,transparent);margin-bottom:22px;"></div>

                        <!-- URL fallback -->
                        <p style="margin:0 0 6px;font-size:0.75rem;color:rgba(120,60,10,0.5);text-align:center;">
                            ¿Problemas con el botón? Copia y pega este enlace en tu navegador:
                        </p>
                        <p style="margin:0;font-size:0.72rem;color:rgba(185,28,28,0.65);text-align:center;word-break:break-all;line-height:1.6;">
                            {{ $url }}
                        </p>

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
