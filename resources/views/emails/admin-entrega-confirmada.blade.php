<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #16a34a; padding: 28px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 28px 32px; color: #333; }
        .body p { line-height: 1.6; margin: 0 0 14px; }
        .badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; }
        .info-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin: 18px 0; }
        .info-box p { margin: 6px 0; font-size: 14px; }
        .footer { background: #f9fafb; padding: 18px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f0f0f0; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>📦 Entrega confirmada</h1>
    </div>
    <div class="body">
        <p>El cliente ha confirmado que recibió su pedido.</p>
        <span class="badge">✅ Entregado</span>
        <div class="info-box">
            <p><strong>Pedido:</strong> {{ $pedido->numero_pedido }}</p>
            <p><strong>Cliente:</strong> {{ $pedido->nombre_cliente }}</p>
            <p><strong>Email:</strong> {{ $pedido->email }}</p>
            <p><strong>Total:</strong> ${{ number_format($pedido->total, 0, ',', '.') }}</p>
            <p><strong>Fecha confirmación:</strong> {{ now()->format('d/m/Y H:i') }}</p>
        </div>
        <p>Este pedido ya puede marcarse como completado en el sistema.</p>
    </div>
    <div class="footer">
        VitaliStore — Panel de administración
    </div>
</div>
</body>
</html>
