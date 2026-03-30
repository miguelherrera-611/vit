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
        .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .info-box p { margin: 6px 0; font-size: 14px; }
        .rechazo-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .rechazo-box p { margin: 6px 0; font-size: 14px; color: #991b1b; }
        .contacto-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .contacto-box p { margin: 6px 0; font-size: 14px; color: #1d4ed8; }
        .footer { background: #f9fafb; padding: 18px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>❌ Pedido rechazado</h1>
    </div>
    <div class="body">
        <p>Hola <strong>{{ $pedido->nombre_cliente }}</strong>,</p>
        <p>Lamentamos informarte que tu pedido no pudo ser procesado.</p>

        <div class="info-box">
            <p><strong>Pedido:</strong> {{ $pedido->numero_pedido }}</p>
            <p><strong>Total:</strong> ${{ number_format($pedido->total, 0, ',', '.') }}</p>
            <p><strong>Método de pago:</strong> {{ $pedido->metodo_pago }}</p>
            <p><strong>Fecha:</strong> {{ $pedido->created_at->format('d/m/Y') }}</p>
        </div>

        @if($pedido->motivo_rechazo)
            <div class="rechazo-box">
                <p><strong>Motivo:</strong></p>
                <p>{{ $pedido->motivo_rechazo }}</p>
                @if($pedido->mensaje_rechazo)
                    <p style="margin-top: 10px;">{{ $pedido->mensaje_rechazo }}</p>
                @endif
            </div>
        @endif

        <p>Si tienes alguna duda o quieres volver a intentarlo, comunícate con nosotros:</p>

        <div class="contacto-box">
            @if(!empty($contacto['telefono1']))
                <p>📞 {{ $contacto['telefono1'] }}</p>
            @endif
            @if(!empty($contacto['telefono2']))
                <p>📞 {{ $contacto['telefono2'] }}</p>
            @endif
            @if(!empty($contacto['correo1']))
                <p>✉️ {{ $contacto['correo1'] }}</p>
            @endif
            @if(!empty($contacto['correo2']))
                <p>✉️ {{ $contacto['correo2'] }}</p>
            @endif
            <p>🏪 También puedes acercarte a nuestro punto físico.</p>
        </div>
    </div>
    <div class="footer">
        VitaliStore — Tienda de ropa
    </div>
</div>
</body>
</html>
