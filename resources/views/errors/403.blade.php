<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Denegado — VitaliStore</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            position: relative;
            overflow: hidden;
            background:
                radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
                radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
                radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
                linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
        }

        @keyframes floatA {
            0%,100% { transform: translateY(0) translateX(0) rotate(0deg); }
            33%      { transform: translateY(-22px) translateX(14px) rotate(4deg); }
            66%      { transform: translateY(14px) translateX(-10px) rotate(-3deg); }
        }
        @keyframes floatB {
            0%,100% { transform: translateY(0) translateX(0) rotate(0deg); }
            33%      { transform: translateY(18px) translateX(-14px) rotate(-4deg); }
            66%      { transform: translateY(-14px) translateX(10px) rotate(5deg); }
        }
        @keyframes floatC {
            0%,100% { transform: translateY(0) scale(1); }
            50%      { transform: translateY(-16px) scale(1.03); }
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(28px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseRed {
            0%,100% { box-shadow: 0 12px 40px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.25); }
            50%      { box-shadow: 0 18px 52px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.25); }
        }

        .gdeco {
            position: absolute; pointer-events: none;
            background: rgba(255,255,255,0.14);
            border: 1px solid rgba(255,255,255,0.65);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 8px 32px rgba(200,100,30,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
        }
        .gd1 { width:130px; height:130px; border-radius:30px; top:7%;    right:8%;  animation:floatA 17s ease-in-out infinite 1s;   transform:rotate(12deg); }
        .gd2 { width: 88px; height: 88px; border-radius:50%;  top:65%;   left:4%;   animation:floatC 12s ease-in-out infinite 3.5s; }
        .gd3 { width:200px; height: 60px; border-radius:44px; bottom:10%;right:5%;  animation:floatB 14s ease-in-out infinite 0.5s; }
        .gd4 { width: 58px; height:160px; border-radius:44px; top:22%;   left:3%;   animation:floatA 16s ease-in-out infinite 4.5s; transform:rotate(-6deg); }
        .gd5 { width: 52px; height: 52px; border-radius:18px; bottom:22%;left:14%;  animation:floatC 9s  ease-in-out infinite 1.5s; transform:rotate(20deg); }
        .gd6 { width:155px; height: 46px; border-radius:40px; top:3%;    left:26%;  animation:floatB 11s ease-in-out infinite 2s; }

        .card {
            position: relative; z-index: 10;
            width: 100%; max-width: 460px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%);
            border: 1px solid rgba(255,255,255,0.68);
            border-radius: 32px;
            padding: 3rem 2.5rem;
            box-shadow: 0 20px 60px rgba(180,90,20,0.12), inset 0 1.5px 0 rgba(255,255,255,0.92);
            text-align: center;
            animation: slideUp 0.75s cubic-bezier(0.16,1,0.3,1) both;
        }
        .card::before {
            content: '';
            position: absolute; top: 0; left: 0; right: 0; height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.96) 25%, rgba(255,255,255,0.96) 75%, transparent);
            pointer-events: none; border-radius: 32px 32px 0 0;
        }

        .icon-wrap {
            display: inline-flex; align-items: center; justify-content: center;
            width: 80px; height: 80px;
            background: linear-gradient(145deg, rgba(220,38,38,0.12), rgba(185,28,28,0.08));
            border: 1px solid rgba(220,38,38,0.22);
            border-radius: 24px;
            margin-bottom: 1.75rem;
            animation: pulseRed 3s ease-in-out infinite;
        }

        .code-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: rgba(220,38,38,0.08);
            border: 1px solid rgba(220,38,38,0.2);
            border-radius: 20px;
            font-size: 0.72rem;
            font-weight: 700;
            color: rgba(185,28,28,0.75);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 2rem; font-weight: 300; color: #2d1a08;
            letter-spacing: -0.04em; margin-bottom: 0.75rem; line-height: 1.1;
        }

        p {
            font-size: 0.85rem; color: rgba(120,60,10,0.65);
            line-height: 1.65; margin-bottom: 2rem;
        }

        .divider {
            height: 1px; margin: 0 0 1.75rem;
            background: linear-gradient(90deg, transparent, rgba(200,140,80,0.2) 30%, rgba(200,140,80,0.2) 70%, transparent);
        }

        .btn {
            display: block; width: 100%; padding: 0.85rem 1.5rem;
            border-radius: 14px; font-size: 0.88rem; font-weight: 600;
            text-decoration: none; transition: all 0.22s ease;
            font-family: 'Inter', sans-serif; margin-bottom: 0.75rem;
            position: relative; overflow: hidden; cursor: pointer; border: none;
        }
        .btn::after {
            content: '';
            position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
            background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
            transition: left 0.5s ease; pointer-events: none;
        }
        .btn:hover::after { left: 130%; }

        .btn-primary {
            background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.40);
            color: rgba(185,28,28,0.95);
            box-shadow: 0 4px 16px rgba(220,38,38,0.10), inset 0 1px 0 rgba(255,120,120,0.2);
        }
        .btn-primary:hover {
            background: rgba(220,38,38,0.18); transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(220,38,38,0.15);
        }

        .btn-ghost {
            background: rgba(255,255,255,0.06); border: 1px solid rgba(200,140,80,0.28);
            color: rgba(120,60,10,0.7);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
        }
        .btn-ghost:hover {
            background: rgba(255,255,255,0.14); transform: translateY(-1px);
        }

        /* Logo arriba */
        .logo-row {
            display: flex; align-items: center; justify-content: center;
            gap: 0.6rem; margin-bottom: 2rem;
        }
        .logo-icon {
            width: 34px; height: 34px;
            background: linear-gradient(145deg,#ef4444,#b91c1c);
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
        }
        .logo-text { font-size: 1rem; font-weight: 600; color: #2d1a08; letter-spacing: -0.03em; }
    </style>
</head>
<body>

<div class="gdeco gd1"></div>
<div class="gdeco gd2"></div>
<div class="gdeco gd3"></div>
<div class="gdeco gd4"></div>
<div class="gdeco gd5"></div>
<div class="gdeco gd6"></div>

<div class="card">

    <!-- Logo -->
    <div class="logo-row">
        <div class="logo-icon">
            <svg width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
        </div>
        <span class="logo-text">VitaliStore</span>
    </div>

    <!-- Ícono de error -->
    <div class="icon-wrap">
        <svg width="38" height="38" fill="none" stroke="rgba(185,28,28,0.85)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
    </div>

    <div class="code-badge">Error 403</div>

    <h1>Acceso denegado</h1>

    <p>No tienes permisos para acceder a esta sección. Esta acción está restringida a usuarios con roles específicos.</p>

    <div class="divider"></div>

    <a href="{{ route('dashboard') }}" class="btn btn-primary">
        Ir al Dashboard
    </a>
    <a href="{{ url()->previous() }}" class="btn btn-ghost">
        ← Volver atrás
    </a>

</div>

</body>
</html>
