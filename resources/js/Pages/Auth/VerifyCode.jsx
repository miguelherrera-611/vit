import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function VerifyCode({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        email: email,
    });

    const codeInputRef = useRef(null);

    useEffect(() => {
        if (codeInputRef.current) {
            codeInputRef.current.focus();
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/verify-2fa');
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

                .verify-bg {
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

                /* floating bg deco shapes */
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

                .verify-wrapper {
                    width: 100%;
                    max-width: 420px;
                    animation: fadeUp 0.85s cubic-bezier(0.16,1,0.3,1) both;
                    position: relative;
                    z-index: 10;
                }

                /* logo */
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
                .logo-title { font-size: 2rem; font-weight: 300; color: #2d1a08; letter-spacing: -0.03em; line-height: 1; margin-bottom: 0.3rem; }
                .logo-sub   { font-size: 0.85rem; color: rgba(150,80,20,0.65); font-weight: 400; letter-spacing: 0.04em; }

                /* water drop card */
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
                .glass-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.95) 75%, transparent 100%);
                    pointer-events: none; z-index: 1;
                }
                .glass-card::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 52%; height: 58%;
                    background: radial-gradient(ellipse at 28% 18%, rgba(255,255,255,0.12) 0%, transparent 65%);
                    pointer-events: none; z-index: 1;
                }

                /* email pill */
                .email-pill {
                    display: inline-block;
                    padding: 0.35rem 0.9rem;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.65);
                    border-radius: 40px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: #2d1a08;
                    backdrop-filter: blur(8px);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
                }

                /* alert */
                .alert-error {
                    margin-bottom: 1.25rem; padding: 0.85rem 1rem;
                    background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.18);
                    border-radius: 16px; color: #dc2626; font-size: 0.85rem;
                }

                /* label */
                .form-label {
                    display: block; font-size: 0.7rem; font-weight: 600;
                    color: rgba(150,80,20,0.75); letter-spacing: 0.09em;
                    text-transform: uppercase; margin-bottom: 0.5rem; text-align: center;
                }

                /* code input — water drop */
                .code-input {
                    width: 100%;
                    padding: 1rem 1.1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(200,140,80,0.45);
                    border-radius: 16px;
                    font-size: 1.6rem;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-weight: 500;
                    color: #2d1a08;
                    text-align: center;
                    letter-spacing: 0.6rem;
                    outline: none;
                    transition: all 0.25s ease;
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    box-shadow:
                        0 4px 16px rgba(160,80,10,0.1),
                        0 1px 4px rgba(160,80,10,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.8),
                        inset 0 -1px 0 rgba(180,90,20,0.03);
                }
                .code-input::placeholder { color: rgba(180,100,30,0.3); letter-spacing: 0.6rem; }
                .code-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(200,140,80,0.7);
                    box-shadow:
                        0 0 0 4px rgba(220,38,38,0.06),
                        0 4px 14px rgba(160,80,10,0.1),
                        inset 0 1px 0 rgba(255,255,255,0.9),
                        inset 0 -1px 0 rgba(180,90,20,0.03);
                }

                /* submit button — water drop red */
                .glass-btn {
                    width: 100%;
                    padding: 0.95rem;
                    border-radius: 16px;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem; font-weight: 500;
                    letter-spacing: -0.01em;
                    cursor: pointer;
                    transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
                    position: relative; overflow: hidden;
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
                .glass-btn::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,150,150,0.8) 40%, rgba(255,150,150,0.8) 60%, transparent);
                    pointer-events: none;
                }
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
                .glass-btn:disabled { opacity: 0.35; cursor: not-allowed; }

                /* divider */
                .glass-divider {
                    border: none;
                    border-top: 1px solid rgba(200,140,80,0.15);
                    margin: 1.5rem 0 1.25rem;
                }

                .back-link {
                    display: block; text-align: center;
                    font-size: 0.85rem; color: rgba(150,80,20,0.6);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .back-link:hover { color: rgba(150,80,20,0.9); }

                .footer-text { text-align: center; margin-top: 1.5rem; font-size: 0.78rem; color: rgba(180,100,30,0.4); }
            `}</style>

            <div className="verify-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />
                <div className="gdeco gd5" /><div className="gdeco gd6" />

                <div className="verify-wrapper">
                    {/* Logo */}
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="logo-title">Verificación 2FA</h1>
                        <p className="logo-sub">Ingresa el código de verificación</p>
                    </div>

                    {/* Card */}
                    <div className="glass-card">
                        {/* Email info */}
                        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                            <div style={{
                                display:'inline-flex', alignItems:'center', justifyContent:'center',
                                width:'52px', height:'52px', borderRadius:'50%',
                                background:'rgba(220,38,38,0.07)',
                                border:'1px solid rgba(220,38,38,0.15)',
                                marginBottom:'1rem',
                            }}>
                                <svg width="24" height="24" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p style={{ fontSize:'0.82rem', color:'rgba(150,80,20,0.65)', marginBottom:'0.6rem' }}>
                                Te hemos enviado un código de 6 dígitos a:
                            </p>
                            <span className="email-pill">{email}</span>
                            <p style={{ fontSize:'0.75rem', color:'rgba(150,80,20,0.45)', marginTop:'0.6rem' }}>
                                Revisa tu bandeja de entrada y spam
                            </p>
                        </div>

                        {errors.code && <div className="alert-error">{errors.code}</div>}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom:'1.25rem' }}>
                                <label className="form-label">Código de Verificación</label>
                                <input
                                    ref={codeInputRef}
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength="6"
                                    required
                                    autoComplete="off"
                                    className="code-input"
                                    placeholder="000000"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || data.code.length !== 6}
                                className="glass-btn"
                            >
                                {processing ? 'Verificando...' : 'Verificar Código'}
                            </button>

                            <hr className="glass-divider" />

                            <a href="/login" className="back-link">← Volver al inicio de sesión</a>
                        </form>

                        <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
                            <p style={{ fontSize:'0.75rem', color:'rgba(150,80,20,0.4)' }}>
                                El código expira en 10 minutos
                            </p>
                        </div>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
