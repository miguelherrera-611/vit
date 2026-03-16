{{-- resources/views/emails/delete-confirmation.blade.php --}}
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Eliminación - VitaliStore</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,Arial,sans-serif;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);min-height:100vh;">

<table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background:linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);">
    <tr><td align="center" style="padding:48px 16px;">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

                <!-- HEADER -->
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

                        <!-- Ícono -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;width:68px;height:68px;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.22);border-radius:50%;text-align:center;line-height:68px;font-size:30px;">
                                        🗑️
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Título -->
                        <h1 style="margin:0 0 8px;font-size:1.5rem;font-weight:300;color:#2d1a08;letter-spacing:-0.04em;text-align:center;">
                            Confirmación de eliminación
                        </h1>
                        <p style="margin:0 0 28px;font-size:0.85rem;color:rgba(150,80,20,0.65);text-align:center;line-height:1.5;">
                            Se ha solicitado eliminar <strong style="color:#dc2626;">{{ $cantidad }} registro{{ $cantidad !== 1 ? 's' : '' }}</strong> del sistema de actividad.
                        </p>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.25) 30%,rgba(200,140,80,0.25) 70%,transparent);margin-bottom:28px;"></div>

                        <!-- Etiqueta -->
                        <p style="margin:0 0 12px;font-size:0.7rem;font-weight:700;color:rgba(150,80,20,0.55);letter-spacing:0.1em;text-transform:uppercase;text-align:center;">
                            Código de confirmación
                        </p>

                        <!-- CODE BOX -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block;background:rgba(255,255,255,0.6);border:1.5px dashed rgba(220,38,38,0.45);border-radius:18px;padding:20px 40px;min-width:220px;">
                                    <span style="font-size:2.6rem;font-weight:700;color:#dc2626;letter-spacing:0.55rem;font-family:'SF Mono','Fira Code','Courier New',monospace;">
                                        {{ $code }}
                                    </span>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Expira -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                                <td align="center">
                                    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.28);border-radius:20px;padding:6px 14px;">
                                        <span style="font-size:0.78rem;font-weight:600;color:rgba(146,64,14,0.9);">⏱ Este código expira en 10 minutos</span>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Divider -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(200,140,80,0.2) 30%,rgba(200,140,80,0.2) 70%,transparent);margin-bottom:24px;"></div>

                        <!-- Alerta seguridad -->
                        <div style="background:rgba(220,38,38,0.06);border:1px solid rgba(220,38,38,0.18);border-radius:12px;padding:12px 16px;text-align:center;">
                            <p style="margin:0;font-size:0.78rem;color:rgba(185,28,28,0.8);line-height:1.6;">
                                ⚠️ Si no solicitaste esta eliminación, ignora este correo.<br>
                                Los registros <strong>no serán eliminados</strong> sin el código.
                            </p>
                        </div>

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
