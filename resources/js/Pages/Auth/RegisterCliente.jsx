// resources/js/Pages/Auth/RegisterCliente.jsx
import { useForm, Link, Head } from '@inertiajs/react';
import { useState } from 'react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.12) 0%, transparent 55%),
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

    .reg-bg {
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
    }
    .gd1 { width:130px; height:130px; border-radius:30px; top:8%;    right:10%; animation: floatA 17s ease-in-out infinite 1s;   transform: rotate(12deg); }
    .gd2 { width: 88px; height: 88px; border-radius:50%;  top:68%;   left: 5%;  animation: floatC 12s ease-in-out infinite 3.5s; }
    .gd3 { width:200px; height: 60px; border-radius:44px; bottom:12%;right: 7%; animation: floatB 14s ease-in-out infinite 0.5s; }
    .gd4 { width: 60px; height:160px; border-radius:44px; top:25%;   left: 4%;  animation: floatA 16s ease-in-out infinite 4.5s; transform: rotate(-6deg); }

    .reg-wrapper {
        width: 100%; max-width: 460px;
        position: relative; z-index: 10;
        animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
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
        position: relative; overflow: hidden;
    }

    .card-title {
        font-size: 1rem; font-weight: 600; color: #2d1a08;
        text-align: center; margin-bottom: 0.4rem; letter-spacing: -0.02em;
    }
    .card-sub {
        font-size: 0.78rem; color: rgba(150,80,20,0.55);
        text-align: center; margin-bottom: 1.25rem; line-height: 1.6;
    }

    /* Beneficios */
    .benefits-row { display: flex; justify-content: center; gap: 1.25rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .benefit-item { display: flex; align-items: center; gap: 0.32rem; }

    /* Alertas */
    .alert-success {
        padding: 0.7rem 0.875rem; border-radius: 9px; margin-bottom: 1.1rem;
        background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2);
        font-size: 0.78rem; color: rgba(4,120,87,0.88); text-align: center;
    }

    /* Campos */
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
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
    .glass-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Divisor */
    .divider {
        height: 1px; margin: 1.25rem 0;
        background: linear-gradient(90deg, transparent, rgba(200,140,80,0.18) 30%, rgba(200,140,80,0.18) 70%, transparent);
    }

    .footer-text { text-align: center; margin-top: 1.5rem; font-size: 0.68rem; color: rgba(150,80,20,0.38); }

    @media (max-width: 480px) {
        .form-row { grid-template-columns: 1fr; }
        .glass-card { padding: 1.75rem 1.25rem; }
    }
`;

export default function RegisterCliente({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        telefono:              '',
    });
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/registro');
    };

    return (
        <>
            <Head title="Crear cuenta — VitaliStore" />
            <style>{STYLES}</style>

            <div className="reg-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />

                <div className="reg-wrapper">
                    {/* Logo */}
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                        </div>
                        <span className="logo-title">VitaliStore</span>
                        <span className="logo-sub">Crea tu cuenta y empieza a comprar</span>
                    </div>

                    <div className="glass-card">
                        <h1 className="card-title">Crear cuenta</h1>
                        <p className="card-sub">Regístrate gratis y accede a tu historial de pedidos, seguimiento y más.</p>

                        {/* Beneficios */}
                        <div className="benefits-row">
                            {['Seguimiento de pedidos', 'Historial de compras', 'Notificaciones'].map(b => (
                                <div key={b} className="benefit-item">
                                    <svg width="12" height="12" fill="none" stroke="rgba(16,185,129,0.75)" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span style={{ fontSize:'0.7rem', color:'rgba(120,60,10,0.58)' }}>{b}</span>
                                </div>
                            ))}
                        </div>

                        {status && <div className="alert-success">{status}</div>}

                        <form onSubmit={submit}>
                            {/* Nombre + Teléfono */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Nombre completo</label>
                                    <input className="glass-input" type="text" placeholder="Tu nombre"
                                           value={data.name} onChange={e => setData('name', e.target.value)}
                                           autoFocus autoComplete="name" />
                                    {errors.name && <p className="field-error">{errors.name}</p>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Teléfono</label>
                                    <input className="glass-input" type="tel" placeholder="3001234567"
                                           value={data.telefono} onChange={e => setData('telefono', e.target.value)}
                                           autoComplete="tel" />
                                    {errors.telefono && <p className="field-error">{errors.telefono}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label">Correo electrónico</label>
                                <input className="glass-input" type="email" placeholder="tu@email.com"
                                       value={data.email} onChange={e => setData('email', e.target.value)}
                                       autoComplete="username" />
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>

                            {/* Contraseña */}
                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <div className="input-wrap">
                                    <input className="glass-input" style={{ paddingRight:'2.75rem' }}
                                           type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                                           value={data.password} onChange={e => setData('password', e.target.value)}
                                           autoComplete="new-password" />
                                    <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                                        {showPass
                                            ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                            : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        }
                                    </button>
                                </div>
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="form-group" style={{ marginBottom:'1.5rem' }}>
                                <label className="form-label">Confirmar contraseña</label>
                                <div className="input-wrap">
                                    <input className="glass-input" style={{ paddingRight:'2.75rem' }}
                                           type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña"
                                           value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                           autoComplete="new-password" />
                                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm
                                            ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                            : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        }
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="field-error">{errors.password_confirmation}</p>}
                            </div>

                            <button type="submit" className="glass-btn" disabled={processing}>
                                {processing ? 'Creando cuenta...' : 'Crear mi cuenta'}
                            </button>
                        </form>

                        <div className="divider" />
                        <p style={{ textAlign:'center', fontSize:'0.78rem', color:'rgba(150,80,20,0.55)' }}>
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" style={{ color:'rgba(185,28,28,0.72)', fontWeight:'500', textDecoration:'none' }}>
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
