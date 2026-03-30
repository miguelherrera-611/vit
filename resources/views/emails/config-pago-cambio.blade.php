<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #dc2626; padding: 28px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 28px 32px; color: #333; }
        .body p { line-height: 1.6; margin: 0 0 14px; }
        .info-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .info-box p { margin: 6px 0; font-size: 14px; }
        .cambio-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px; margin: 8px 0; font-size: 14px; color: #374151; }
        .footer { background: #f9fafb; padding: 18px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>⚠️ Datos de pago modificados</h1>
    </div>
    <div class="body">
        <p>Se han realizado cambios en los datos del método de pago <strong>{{ $metodo }}</strong>.</p>

        <div class="info-box">
            <p><strong>Método:</strong> {{ $metodo }}</p>
            <p><strong>Modificado por:</strong> {{ $usuario }}</p>
            <p><strong>Fecha:</strong> {{ now()->format('d/m/Y H:i') }}</p>
        </div>

        <p><strong>Cambios realizados:</strong></p>
        @foreach($cambios as $cambio)
            <div class="cambio-item">• {{ $cambio }}</div>
        @endforeach

        <p style="margin-top: 18px; color: #6b7280; font-size: 13px;">
            Si no reconoces esta acción, verifica el acceso a tu panel de administración.
        </p>
    </div>
    <div class="footer">
        VitaliStore — Notificación de seguridad
    </div>
</div>
</body>
</html>
