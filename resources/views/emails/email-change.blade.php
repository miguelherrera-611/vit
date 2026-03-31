<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">

<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                <!-- LOGO -->
                <tr>
                    <td align="center" style="padding-bottom:28px;">
                        <table cellpadding="0" cellspacing="0"><tr>
                                <td style="background:linear-gradient(145deg,#ef4444,#b91c1c);border-radius:16px;width:52px;height:52px;text-align:center;vertical-align:middle;">
                                    <span style="font-size:24px;line-height:52px;">🛒</span>
                                </td>
                                <td style="padding-left:12px;">
                                    <span style="font-size:1.4rem;font-weight:600;color:#2d1a08;letter-spacing:-0.03em;">VitaliStore</span>
                                </td>
                            </tr></table>
                    </td>
                </tr>

                <!-- CARD -->
                <tr>
                    <td style="background:rgba(255,255,255,0.92);border:1px solid rgba(255,255,255,0.85);border-radius:28px;padding:40px 36px;box-shadow:0 16px 48px rgba(180,90,20,0.10);">

                        <!-- Ícono -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr><td align="center">
                                    <div style="display:inline-block;width:68px;height:68px;background:rgba(220,38,38,0.07);border:1px solid rgba(220,38,38,0.15);border-radius:50%;text-align:center;line-height:68px;font-size:30px;">
                                        ✉️
                                    </div>
                                </td></tr>
                        </table>

                        <!-- Título -->
                        <h1 style="margin:0 0 8px;font-size:1.4rem;font-weight:300;color:#2d1a08;letter-spacing:-0.04em;text-align:center;">
                            Verifica tu nuevo correo
                        </h1>
                        <p style="margin:0 0 6px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;line-height:1.6;">
                            Solicitaste cambiar tu correo a <strong style="color:#2d1a08;">{{ $nuevoEmail }}</strong>
                        </p>
                        <p style="margin:0 0 28px;font-size:0.82rem;color:rgba(150,80,20,0.55);text-align:center;">
                            Ingresa este código en tu perfil para confirmar el cambio:
                        </p>

                        <!-- Código -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr><td align="center">
                                    <div style="display:inline-block;background:rgba(220,38,38,0.06);border:2px solid rgba(220,38,38,0.22);border-radius:18px;padding:20px 40px;">
                                        <span style="font-size:2.4rem;font-weight:700;color:#b91c1c;letter-spacing:0.18em;">{{ $code }}</span>
                                    </div>
                                </td></tr>
                        </table>

                        <!-- Aviso expiración -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr><td align="center">
                                    <div style="display:inline-block;background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.28);border-radius:12px;padding:10px 18px;">
                                <span style="font-size:0.78rem;color:rgba(146,64,14,0.85);font-weight:500;">
                                    ⏱ Este código expira en 10 minutos
                                </span>
                                    </div>
                                </td></tr>
                        </table>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.2) 30%,rgba(200,140,80,0.2) 70%,transparent);margin-bottom:20px;"></div>

                        <p style="margin:0;font-size:0.76rem;color:rgba(120,60,10,0.5);text-align:center;line-height:1.6;">
                            Si no solicitaste este cambio, ignora este correo. Tu correo actual no será modificado.
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
