<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #7c3aed; padding: 28px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 28px 32px; color: #333; }
        .body p { line-height: 1.6; margin: 0 0 14px; }
        .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .info-box p { margin: 6px 0; font-size: 14px; }
        .desc-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px 20px; margin: 18px 0; font-size: 14px; color: #6b21a8; line-height: 1.6; }
        .whatsapp-btn { display: inline-block; background: #16a34a; color: #fff; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 8px; }
        .footer { background: #f9fafb; padding: 18px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🆘 Nuevo reclamo de cliente</h1>
    </div>
    <div class="body">
        <p>Se ha recibido un nuevo reclamo que requiere atención.</p>

        <div class="info-box">
            <p><strong>Cliente:</strong> {{ $reclamo->user?->name ?? 'Anónimo' }}</p>
            <p><strong>Email:</strong> {{ $reclamo->user?->email ?? 'No registrado' }}</p>
            <p><strong>Tipo:</strong> {{ $reclamo->tipo_label }}</p>
            <p><strong>Teléfono WhatsApp:</strong> {{ $reclamo->telefono_contacto }}</p>
            <p><strong>Fecha:</strong> {{ $reclamo->created_at->format('d/m/Y H:i') }}</p>
        </div>

        @if($reclamo->descripcion)
            <p><strong>Descripción del cliente:</strong></p>
            <div class="desc-box">
                {{ $reclamo->descripcion }}
            </div>
        @endif

        <p>Puedes contactar al cliente directamente por WhatsApp:</p>
        <a href="https://wa.me/57{{ $reclamo->telefono_contacto }}" class="whatsapp-btn">
            💬 Abrir WhatsApp
        </a>
    </div>
    <div class="footer">
        VitaliStore — Panel de administración
    </div>
</div>
</body>
</html>
