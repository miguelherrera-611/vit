// resources/js/Pages/Auth/Login.jsx
import { useForm, Link, Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes floatA {
        0%,100% { transform: translateY(0) translateX(0) rotate(0deg); }
        33%     { transform: translateY(-22px) translateX(14px) rotate(4deg); }
        66%     { transform: translateY(14px) translateX(-10px) rotate(-3deg); }
    }
    @keyframes floatB {
        0%,100% { transform: translateY(0) translateX(0) rotate(0deg); }
        33%     { transform: translateY(18px) translateX(-14px) rotate(-4deg); }
        66%     { transform: translateY(-14px) translateX(10px) rotate(5deg); }
    }
    @keyframes floatC {
        0%,100% { transform: translateY(0) scale(1); }
        50%     { transform: translateY(-16px) scale(1.03); }
    }

    .login-bg {
        min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        padding: 2rem 1rem;
        font-family: 'Inter', -apple-system, sans-serif;
        position: relative; overflow: hidden;
        background: ${BG};
    }

    .gdeco {
        position: absolute; pointer-events: none;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.58);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 8px 32px rgba(200,100,30,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .gd1 { width:130px; height:130px; border-radius:30px; top:8%;    right:10%; animation: floatA 17s ease-in-out infinite 1s;   transform: rotate(12deg); }
    .gd2 { width: 88px; height: 88px; border-radius:50%;  top:68%;   left: 5%;  animation: floatC 12s ease-in-out infinite 3.5s; }
    .gd3 { width:210px; height: 62px; border-radius:44px; bottom:12%;right: 7%; animation: floatB 14s ease-in-out infinite 0.5s; }
    .gd4 { width: 62px; height:165px; border-radius:44px; top:25%;   left: 4%;  animation: floatA 16s ease-in-out infinite 4.5s; transform: rotate(-6deg); }
    .gd5 { width: 52px; height: 52px; border-radius:18px; bottom:25%;left:15%;  animation: floatC 9s  ease-in-out infinite 1.5s; transform: rotate(20deg); }
    .gd6 { width:155px; height: 48px; border-radius:40px; top: 4%;   left:28%;  animation: floatB 11s ease-in-out infinite 2s; }

    .login-wrapper {
        width: 100%; max-width: 420px;
        animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
        position: relative; z-index: 10;
    }

    /* Logo */
    .logo-area { text-align: center; margin-bottom: 1.75rem; }
    .logo-icon {
        display: inline-flex; align-items: center; justify-content: center;
        width: 52px; height: 52px; border-radius: 14px; margin-bottom: 0.875rem;
        background: rgba(255,255,255,0.52);
        border: 1.5px solid rgba(185,28,28,0.32);
        box-shadow: 0 4px 20px rgba(185,28,28,0.08), inset 0 1px 0 rgba(255,255,255,0.92);
    }
    .logo-title { font-size: 1.35rem; font-weight: 300; color: #2d1a08; letter-spacing: -0.03em; display: block; margin-bottom: 0.2rem; }
    .logo-sub   { font-size: 0.74rem; color: rgba(150,80,20,0.5); display: block; }

    /* Card */
    .glass-card {
        background: rgba(255,255,255,0.48);
        backdrop-filter: blur(28px) saturate(160%); -webkit-backdrop-filter: blur(28px) saturate(160%);
        border: 1px solid rgba(200,140,80,0.14);
        border-radius: 18px;
        padding: 2.25rem 2rem;
        box-shadow: 0 12px 40px rgba(180,90,20,0.08), 0 2px 8px rgba(180,90,20,0.04),
            inset 0 1px 0 rgba(255,255,255,0.95);
        position: relative; overflow: hidden;
    }

    .card-title {
        font-size: 1rem; font-weight: 600; color: #2d1a08;
        text-align: center; margin-bottom: 0.4rem; letter-spacing: -0.02em;
    }
    .card-sub {
        font-size: 0.78rem; color: rgba(150,80,20,0.55);
        text-align: center; margin-bottom: 1.5rem; line-height: 1.6;
    }

    /* Alertas */
    .alert-success {
        margin-bottom: 1.1rem; padding: 0.7rem 0.875rem;
        background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2);
        border-radius: 9px; color: rgba(4,120,87,0.88); font-size: 0.78rem;
    }
    .alert-error {
        margin-bottom: 1.1rem; padding: 0.7rem 0.875rem;
        background: rgba(185,28,28,0.05); border: 1px solid rgba(185,28,28,0.16);
        border-radius: 9px; color: rgba(185,28,28,0.88); font-size: 0.78rem;
    }

    /* Campos */
    .form-group { margin-bottom: 1rem; }
    .form-label {
        display: block; font-size: 0.65rem; font-weight: 600;
        color: rgba(150,80,20,0.55); text-transform: uppercase;
        letter-spacing: 0.08em; margin-bottom: 0.42rem;
    }
    .glass-input {
        width: 100%; padding: 0.78rem 0.95rem;
        background: rgba(255,255,255,0.55);
        border: 1px solid rgba(200,140,80,0.22);
        border-radius: 10px; font-size: 0.88rem;
        color: #2d1a08; font-family: 'Inter', sans-serif;
        outline: none; transition: all 0.18s;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .glass-input::placeholder { color: rgba(180,100,30,0.35); }
    .glass-input:focus {
        background: rgba(255,255,255,0.72);
        border-color: rgba(200,140,80,0.45);
        box-shadow: 0 0 0 3px rgba(185,28,28,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .input-wrap { position: relative; }
    .eye-btn {
        position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer;
        color: rgba(140,70,15,0.5); display: flex; padding: 0; transition: color 0.12s;
    }
    .eye-btn:hover { color: rgba(140,70,15,0.75); }
    .field-error { margin-top: 0.3rem; font-size: 0.72rem; color: rgba(185,28,28,0.85); font-weight: 500; }

    /* Remember / forgot */
    .bottom-row {
        display: flex; align-items: center; justify-content: space-between;
        margin-bottom: 1.25rem; margin-top: 0.15rem; flex-wrap: wrap; gap: 0.4rem;
    }
    .remember-wrap { display: flex; align-items: center; gap: 0.45rem; }
    .remember-wrap input[type="checkbox"] { width: 14px; height: 14px; accent-color: rgba(185,28,28,0.8); cursor: pointer; }
    .remember-wrap label { font-size: 0.78rem; color: rgba(120,60,10,0.75); cursor: pointer; user-select: none; }
    .forgot-link {
        font-size: 0.78rem; color: rgba(185,28,28,0.72); text-decoration: none;
        font-weight: 500; transition: color 0.12s;
    }
    .forgot-link:hover { color: rgba(185,28,28,1); }

    /* Botón */
    .glass-btn {
        width: 100%; padding: 0.78rem; border-radius: 10px;
        font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 500;
        letter-spacing: -0.01em; cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        background: rgba(185,28,28,0.08); color: rgba(185,28,28,0.92);
        border: 1px solid rgba(185,28,28,0.22);
        box-shadow: 0 2px 10px rgba(185,28,28,0.08);
    }
    .glass-btn:hover:not(:disabled) {
        background: rgba(185,28,28,0.14); transform: translateY(-1px);
        border-color: rgba(185,28,28,0.35);
    }
    .glass-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
    .glass-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Divisor */
    .divider {
        height: 1px; margin: 1.25rem 0;
        background: linear-gradient(90deg, transparent, rgba(200,140,80,0.18) 30%, rgba(200,140,80,0.18) 70%, transparent);
    }

    .footer-text { text-align: center; margin-top: 1.5rem; font-size: 0.68rem; color: rgba(150,80,20,0.38); }

    /* Modal rate-limit */
    @keyframes rlFadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes rlSlideUp { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .rl-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(20,8,0,0.45); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center; padding: 1.25rem;
        animation: rlFadeIn 0.2s ease both;
    }
    .rl-card {
        width: 100%; max-width: 360px;
        background: rgba(253,246,240,0.98);
        border: 1px solid rgba(220,38,38,0.18);
        border-radius: 20px; padding: 2rem 1.75rem;
        box-shadow: 0 24px 64px rgba(180,30,10,0.18), inset 0 1px 0 rgba(255,255,255,0.92);
        animation: rlSlideUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
        text-align: center;
    }
    .rl-icon {
        width: 52px; height: 52px; border-radius: 16px; margin: 0 auto 1.1rem;
        background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2);
        display: flex; align-items: center; justify-content: center;
    }
    .rl-countdown {
        font-size: 2.4rem; font-weight: 700; color: rgba(185,28,28,0.85);
        letter-spacing: -0.05em; line-height: 1; margin: 0.75rem 0 0.4rem;
    }
    .rl-btn {
        margin-top: 1.25rem; width: 100%; padding: 0.72rem;
        border-radius: 10px; font-family: 'Inter', sans-serif;
        font-size: 0.85rem; font-weight: 500; cursor: pointer;
        background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.22);
        color: rgba(185,28,28,0.85); transition: all 0.15s;
    }
    .rl-btn:hover:not(:disabled) { background: rgba(220,38,38,0.14); }
    .rl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const COOLDOWN = 60;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rateLimited,  setRateLimited]  = useState(false);
    const [countdown,    setCountdown]    = useState(COOLDOWN);
    const timerRef = useRef(null);

    // Detecta throttle vía errors.email (ValidationException → 422)
    useEffect(() => {
        if (!errors.email) return;
        const match = errors.email.match(/(\d+)\s*second/i);
        if (match || /too many|demasiados/i.test(errors.email)) {
            const secs = match ? parseInt(match[1], 10) : COOLDOWN;
            openRateLimit(secs);
        }
    }, [errors.email]);

    // Detecta throttle vía respuesta HTTP 429 (middleware de ruta)
    useEffect(() => {
        const unsubscribe = router.on('invalid', (e) => {
            if (e.detail.response?.status === 429) {
                e.preventDefault();
                openRateLimit(COOLDOWN);
            }
        });
        return unsubscribe;
    }, []);

    const openRateLimit = (secs = COOLDOWN) => {
        setRateLimited(true);
        setCountdown(secs);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const closeRateLimit = () => {
        setRateLimited(false);
        clearInterval(timerRef.current);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Iniciar sesión — VitaliStore" />
            <style>{STYLES}</style>

            <div className="login-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />
                <div className="gdeco gd5" /><div className="gdeco gd6" />

                <div className="login-wrapper">
                    {/* Logo */}
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                        </div>
                        <span className="logo-title">VitaliStore</span>
                        <span className="logo-sub">Bienvenida de nuevo</span>
                    </div>

                    <div className="glass-card">
                        <h1 className="card-title">Iniciar sesión</h1>
                        <p className="card-sub">Accede a tu cuenta para ver tus pedidos y continuar comprando.</p>

                        {status && <div className="alert-success">{status}</div>}
                        {errors.email && !/too many|demasiados/i.test(errors.email) && (
                            <div className="alert-error">{errors.email}</div>
                        )}

                        <form onSubmit={submit}>
                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label">Correo electrónico</label>
                                <input
                                    className="glass-input"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required autoFocus autoComplete="username"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <div className="input-wrap">
                                    <input
                                        className="glass-input"
                                        style={{ paddingRight: '2.75rem' }}
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        required autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>

                            {/* Remember / forgot */}
                            <div className="bottom-row">
                                <div className="remember-wrap">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                    />
                                    <label htmlFor="remember">Recordarme</label>
                                </div>
                                {canResetPassword && (
                                    <Link href="/forgot-password" className="forgot-link">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            <button type="submit" className="glass-btn" disabled={processing}>
                                {processing ? 'Ingresando...' : 'Iniciar sesión'}
                            </button>
                        </form>

                        <div className="divider" />
                        <p style={{ textAlign:'center', fontSize:'0.78rem', color:'rgba(150,80,20,0.55)' }}>
                            ¿Sin cuenta?{' '}
                            <Link href="/registro" style={{ color:'rgba(185,28,28,0.72)', fontWeight:'500', textDecoration:'none' }}>
                                Crear una gratis
                            </Link>
                        </p>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>

            {/* ── Modal demasiadas solicitudes ── */}
            {rateLimited && (
                <div className="rl-overlay" onClick={countdown === 0 ? closeRateLimit : undefined}>
                    <div className="rl-card" onClick={e => e.stopPropagation()}>
                        <div className="rl-icon">
                            <svg width="22" height="22" fill="none" stroke="rgba(185,28,28,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 6v6l4 2"/>
                            </svg>
                        </div>

                        <h2 style={{ fontSize:'1rem', fontWeight:'600', color:'#2d1a08', letterSpacing:'-0.02em', marginBottom:'0.35rem' }}>
                            Demasiados intentos
                        </h2>
                        <p style={{ fontSize:'0.8rem', color:'rgba(150,80,20,0.6)', lineHeight:'1.6' }}>
                            Has realizado demasiados intentos de inicio de sesión. Por favor espera antes de volver a intentarlo.
                        </p>

                        <div className="rl-countdown">{countdown}s</div>
                        <p style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.45)' }}>
                            {countdown > 0 ? 'Podrás intentarlo nuevamente en...' : '¡Ya puedes volver a intentarlo!'}
                        </p>

                        <button
                            className="rl-btn"
                            onClick={closeRateLimit}
                            disabled={countdown > 0}
                        >
                            {countdown > 0 ? `Espera ${countdown}s` : 'Cerrar e intentar de nuevo'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
