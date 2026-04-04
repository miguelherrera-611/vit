// resources/js/Pages/Auth/VerifyCode.jsx
import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

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

    .verify-bg {
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

    .verify-wrapper {
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
        box-shadow: 0 12px 40px rgba(180,90,20,0.08), inset 0 1px 0 rgba(255,255,255,0.95);
    }

    .card-title {
        font-size: 1rem; font-weight: 600; color: #2d1a08;
        text-align: center; margin-bottom: 1.5rem; letter-spacing: -0.02em;
    }

    /* Email pill */
    .email-pill {
        display: inline-block; padding: 0.28rem 0.8rem;
        background: rgba(255,255,255,0.55); border: 1px solid rgba(200,140,80,0.18);
        border-radius: 40px; font-size: 0.78rem; font-weight: 500; color: #2d1a08;
    }

    /* Alertas */
    .alert-error {
        margin-bottom: 1.1rem; padding: 0.7rem 0.875rem;
        background: rgba(185,28,28,0.05); border: 1px solid rgba(185,28,28,0.16);
        border-radius: 9px; color: rgba(185,28,28,0.88); font-size: 0.78rem;
    }

    /* Label */
    .form-label {
        display: block; font-size: 0.65rem; font-weight: 600;
        color: rgba(150,80,20,0.55); text-transform: uppercase;
        letter-spacing: 0.08em; margin-bottom: 0.42rem; text-align: center;
    }

    /* Code input */
    .code-input {
        width: 100%; padding: 0.95rem 1rem;
        background: rgba(255,255,255,0.55);
        border: 1px solid rgba(200,140,80,0.22);
        border-radius: 10px;
        font-size: 1.5rem; font-family: 'SF Mono', 'Fira Code', monospace;
        font-weight: 500; color: #2d1a08;
        text-align: center; letter-spacing: 0.55rem;
        outline: none; transition: all 0.18s;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .code-input::placeholder { color: rgba(180,100,30,0.28); letter-spacing: 0.55rem; }
    .code-input:focus {
        background: rgba(255,255,255,0.72);
        border-color: rgba(200,140,80,0.45);
        box-shadow: 0 0 0 3px rgba(185,28,28,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
    }

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
    .glass-divider {
        border: none; border-top: 1px solid rgba(200,140,80,0.15); margin: 1.25rem 0;
    }

    .back-link {
        display: block; text-align: center;
        font-size: 0.78rem; color: rgba(150,80,20,0.55);
        text-decoration: none; transition: color 0.12s;
    }
    .back-link:hover { color: rgba(120,55,10,0.8); }

    .footer-text { text-align: center; margin-top: 1.5rem; font-size: 0.68rem; color: rgba(150,80,20,0.38); }
`;

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
            <style>{STYLES}</style>

            <div className="verify-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />
                <div className="gdeco gd5" /><div className="gdeco gd6" />

                <div className="verify-wrapper">
                    {/* Logo */}
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="logo-title">VitaliStore</span>
                        <span className="logo-sub">Verificación en dos pasos</span>
                    </div>

                    {/* Card */}
                    <div className="glass-card">
                        <h1 className="card-title">Código de verificación</h1>

                        {/* Info email */}
                        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                            <div style={{
                                width:'44px', height:'44px', borderRadius:'11px', margin:'0 auto 0.875rem',
                                background:'rgba(185,28,28,0.06)', border:'1px solid rgba(185,28,28,0.14)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                            }}>
                                <svg width="18" height="18" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p style={{ fontSize:'0.76rem', color:'rgba(150,80,20,0.55)', marginBottom:'0.5rem' }}>
                                Enviamos un código de 6 dígitos a
                            </p>
                            <span className="email-pill">{email}</span>
                            <p style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.4)', marginTop:'0.5rem' }}>
                                Revisa también tu carpeta de spam
                            </p>
                        </div>

                        {errors.code && <div className="alert-error">{errors.code}</div>}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom:'1.25rem' }}>
                                <label className="form-label">Código</label>
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
                                {processing ? 'Verificando...' : 'Verificar código'}
                            </button>

                            <hr className="glass-divider" />
                            <a href="/login" className="back-link">Volver al inicio de sesión</a>
                        </form>

                        <div style={{ marginTop:'1rem', textAlign:'center' }}>
                            <p style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.38)' }}>
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
