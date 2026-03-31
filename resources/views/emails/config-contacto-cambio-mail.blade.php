<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Inter,sans-serif;background:#fdf6f0;padding:2rem;">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:2rem;border:1px solid rgba(200,140,80,0.2);">
    <h2 style="color:#2d1a08;font-size:1.1rem;margin:0 0 1rem;">📞 Datos de contacto modificados</h2>
    <p style="color:rgba(120,60,10,0.8);font-size:0.9rem;">
        El administrador <strong>{{ $usuario }}</strong> modificó los datos de contacto de la tienda.
    </p>
    <div style="background:rgba(255,245,235,0.8);border-radius:10px;padding:1rem;margin:1rem 0;">
        <p style="font-size:0.8rem;font-weight:700;color:rgba(150,80,20,0.6);text-transform:uppercase;margin:0 0 0.5rem;">Cambios realizados</p>
        @foreach($cambios as $cambio)
            <p style="font-size:0.88rem;color:#2d1a08;margin:0.25rem 0;">• {{ $cambio }}</p>
        @endforeach
    </div>
    <p style="font-size:0.78rem;color:rgba(150,80,20,0.5);margin-top:1.5rem;">VitaliStore — Notificación automática</p>
</div>
</body>
</html>
