import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px) scale(0.97); }
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
                @keyframes pulseGlow {
                    0%,100% { box-shadow: 0 12px 40px rgba(220,38,38,0.28), 0 4px 12px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.25); }
                    50%     { box-shadow: 0 16px 52px rgba(220,38,38,0.38), 0 6px 18px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.25); }
                }

                /* ── Background — same warm orange as Admin ── */
                .login-bg {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    font-family: 'Inter', -apple-system, sans-serif;
                    position: relative;
                    overflow: hidden;
                    background:
                        radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 40% at 50%  50%,  rgba(255,225,190,0.12) 0%, transparent 65%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                }

                /* ── Floating bg deco shapes ── */
                .gdeco {
                    position: absolute;
                    pointer-events: none;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    box-shadow: 0 8px 32px rgba(200,100,30,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
                }
                .gd1 { width:130px; height:130px; border-radius:30px; top:8%;    right:10%; animation: floatA 17s ease-in-out infinite 1s;   transform: rotate(12deg); }
                .gd2 { width: 88px; height: 88px; border-radius:50%;  top:68%;   left: 5%;  animation: floatC 12s ease-in-out infinite 3.5s; }
                .gd3 { width:210px; height: 62px; border-radius:44px; bottom:12%;right: 7%; animation: floatB 14s ease-in-out infinite 0.5s; }
                .gd4 { width: 62px; height:165px; border-radius:44px; top:25%;   left: 4%;  animation: floatA 16s ease-in-out infinite 4.5s; transform: rotate(-6deg); }
                .gd5 { width: 52px; height: 52px; border-radius:18px; bottom:25%;left:15%;  animation: floatC 9s  ease-in-out infinite 1.5s; transform: rotate(20deg); }
                .gd6 { width:155px; height: 48px; border-radius:40px; top: 4%;   left:28%;  animation: floatB 11s ease-in-out infinite 2s; }

                /* ── Wrapper ── */
                .login-wrapper {
                    width: 100%;
                    max-width: 420px;
                    animation: fadeUp 0.85s cubic-bezier(0.16,1,0.3,1) both;
                    position: relative;
                    z-index: 10;
                }

                /* ── Logo ── */
                .logo-area { text-align: center; margin-bottom: 1.75rem; }
                .logo-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 72px; height: 72px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius: 22px;
                    margin-bottom: 1rem;
                    animation: pulseGlow 3s ease-in-out infinite;
                    position: relative;
                }
                .logo-icon::after {
                    content: '';
                    position: absolute; inset: 0;
                    border-radius: 22px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 60%);
                }
                .logo-title { font-size: 2rem; font-weight: 300; color: '#2d1a08'; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.3rem; color: #1a0f04; }
                .logo-sub   { font-size: 0.85rem; color: rgba(120,55,10,0.75); font-weight: 400; letter-spacing: 0.04em; }

                /* ── WATER DROP CARD ── */
                .glass-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 32px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow:
                        0 16px 48px rgba(180,90,20,0.1),
                        0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88),
                        inset 0 -1px 0 rgba(180,90,20,0.04),
                        inset 1px 0 0 rgba(255,255,255,0.32),
                        inset -1px 0 0 rgba(255,255,255,0.1);
                    padding: 2.5rem 2.25rem 2.25rem;
                    position: relative;
                    overflow: hidden;
                }
                /* top edge highlight */
                .glass-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.95) 75%, transparent 100%);
                    pointer-events: none;
                    z-index: 1;
                }
                /* top-left refraction shine */
                .glass-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 52%; height: 58%;
                    background: radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.12) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 1;
                }

                .card-title {
                    font-size: 1.25rem; font-weight: 500; color: #1a0f04;
                    text-align: center; margin-bottom: 2rem; letter-spacing: -0.02em;
                }

                /* ── Alerts ── */
                .alert-success {
                    margin-bottom: 1.25rem; padding: 0.85rem 1rem;
                    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.22);
                    border-radius: 16px; color: #059669; font-size: 0.85rem;
                }
                .alert-error {
                    margin-bottom: 1.25rem; padding: 0.85rem 1rem;
                    background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.18);
                    border-radius: 16px; color: #dc2626; font-size: 0.85rem;
                }

                /* ── Form ── */
                .form-group { margin-bottom: 1.1rem; }
                .form-label {
                    display: block; font-size: 0.7rem; font-weight: 600;
                    color: rgba(120,55,10,0.85); letter-spacing: 0.09em;
                    text-transform: uppercase; margin-bottom: 0.5rem;
                }

                /* ── WATER DROP INPUT ── */
                .glass-input {
                    width: 100%;
                    padding: 0.9rem 1.1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(200,140,80,0.45);
                    border-radius: 16px;
                    font-size: 0.95rem; color: #1a0f04;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: all 0.25s ease;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow:
                        0 4px 16px rgba(160,80,10,0.13),
                        0 1px 4px rgba(160,80,10,0.08),
                        inset 0 1px 0 rgba(255,255,255,0.8),
                        inset 0 -1px 0 rgba(180,90,20,0.03);
                    position: relative;
                }
                .glass-input::placeholder { color: rgba(130,65,10,0.55); }
                .glass-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(200,140,80,0.7);
                    box-shadow:
                        0 0 0 4px rgba(220,38,38,0.06),
                        0 4px 14px rgba(180,90,20,0.07),
                        inset 0 1px 0 rgba(255,255,255,0.9),
                        inset 0 -1px 0 rgba(180,90,20,0.03);
                }

                .input-wrap { position: relative; }
                .eye-btn {
                    position: absolute; right: 1rem; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: rgba(140,70,15,0.6); display: flex; padding: 0;
                    transition: color 0.15s;
                }
                .eye-btn:hover { color: rgba(150,70,10,0.75); }

                /* Remember */
                .remember-row { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 1.5rem; margin-top: 0.25rem; }
                .remember-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #dc2626; cursor: pointer; }
                .remember-row label { font-size: 0.875rem; color: rgba(120,55,10,0.85); cursor: pointer; user-select: none; }

                /* ── WATER DROP SUBMIT BUTTON ── */
                .glass-btn {
                    width: 100%;
                    padding: 0.95rem;
                    border-radius: 16px;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem; font-weight: 500;
                    letter-spacing: -0.01em;
                    cursor: pointer;
                    transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
                    position: relative;
                    overflow: hidden;
                    /* Water drop red — transparent inside, border carries the form */
                    background: rgba(220,38,38,0.08);
                    color: rgba(185,28,28,0.95);
                    border: 1px solid rgba(220,38,38,0.45);
                    box-shadow:
                        0 8px 28px rgba(220,38,38,0.12),
                        0 2px 8px rgba(220,38,38,0.08),
                        inset 0 1.5px 0 rgba(255,120,120,0.35),
                        inset 0 -1px 0 rgba(180,20,20,0.06);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                /* top shine */
                .glass-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,150,150,0.8) 40%, rgba(255,150,150,0.8) 60%, transparent);
                    pointer-events: none;
                }
                /* shimmer on hover */
                .glass-btn::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -120%; width: 80%; height: 100%;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
                    transition: left 0.55s ease;
                    pointer-events: none;
                }
                .glass-btn:hover::after { left: 130%; }
                .glass-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    background: rgba(220,38,38,0.13);
                    border-color: rgba(220,38,38,0.6);
                    box-shadow:
                        0 14px 40px rgba(220,38,38,0.16),
                        0 4px 14px rgba(220,38,38,0.1),
                        inset 0 1.5px 0 rgba(255,120,120,0.4),
                        inset 0 -1px 0 rgba(180,20,20,0.07);
                    color: rgba(160,20,20,1);
                }
                .glass-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
                .glass-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                .footer-text { text-align: center; margin-top: 1.5rem; font-size: 0.78rem; color: rgba(130,65,10,0.55); }
            `}</style>

            <div className="login-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />
                <div className="gdeco gd5" /><div className="gdeco gd6" />

                <div className="login-wrapper">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="logo-title">VitaliStore</h1>
                        <p className="logo-sub">Sistema de Gestión</p>
                    </div>

                    <div className="glass-card">
                        <h2 className="card-title">Iniciar Sesión</h2>

                        {status && <div className="alert-success">{status}</div>}
                        {errors.email && <div className="alert-error">{errors.email}</div>}

                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-label">Correo Electrónico</label>
                                <input
                                    className="glass-input"
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <div className="input-wrap">
                                    <input
                                        className="glass-input"
                                        style={{ paddingRight: '3rem' }}
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p style={{ marginTop:'0.4rem', fontSize:'0.8rem', color:'#dc2626' }}>{errors.password}</p>}
                            </div>

                            <div className="remember-row">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember">Recordarme</label>
                            </div>

                            <button type="submit" className="glass-btn" disabled={processing}>
                                {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
