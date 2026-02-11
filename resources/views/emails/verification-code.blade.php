<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Código de Verificación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px 30px;
        }
        .code-box {
            background-color: #F3F4F6;
            border: 2px dashed #4F46E5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 36px;
            font-weight: bold;
            color: #4F46E5;
            letter-spacing: 8px;
        }
        .footer {
            background-color: #F9FAFB;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6B7280;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🔐 VitaliStore</h1>
    </div>

    <div class="content">
        <h2>Hola, {{ $userName }}</h2>
        <p>Has solicitado iniciar sesión en VitaliStore. Usa el siguiente código de verificación:</p>

        <div class="code-box">
            <div class="code">{{ $code }}</div>
        </div>

        <p><strong>Este código expira en 10 minutos.</strong></p>

        <p>Si no solicitaste este código, puedes ignorar este mensaje.</p>

        <p>Saludos,<br>El equipo de VitaliStore</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} VitaliStore. Todos los derechos reservados.</p>
    </div>
</div>
</body>
</html>
