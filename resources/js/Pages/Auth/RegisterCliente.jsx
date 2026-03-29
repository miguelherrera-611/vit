// resources/js/Pages/Auth/RegisterCliente.jsx
import { useForm, Link, Head } from '@inertiajs/react';
import { useState } from 'react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.28) 0%, transparent 55%),
    radial-gradient(ellipse 65% 55% at 100% 100%, rgba(255,195,145,0.24) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes fadeUp {
        from { opacity:0; transform:translateY(24px) scale(0.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes floatA {
        0%,100% { transform:translateY(0) translateX(0) rotate(0deg); }
        33%     { transform:translateY(-22px) translateX(14px) rotate(4deg); }
        66%     { transform:translateY(14px) translateX(-10px) rotate(-3deg); }
    }
    @keyframes floatB {
        0%,100% { transform:translateY(0) translateX(0) rotate(0deg); }
        33%     { transform:translateY(18px) translateX(-14px) rotate(-4deg); }
        66%     { transform:translateY(-14px) translateX(10px) rotate(5deg); }
    }
    @keyframes floatC {
        0%,100% { transform:translateY(0) scale(1); }
        50%     { transform:translateY(-16px) scale(1.03); }
    }
    @keyframes pulseGlow {
        0%,100% { box-shadow:0 12px 40px rgba(220,38,38,0.28),0 4px 12px rgba(220,38,38,0.15),inset 0 1px 0 rgba(255,255,255,0.25); }
        50%     { box-shadow:0 16px 52px rgba(220,38,38,0.38),0 6px 18px rgba(220,38,38,0.22),inset 0 1px 0 rgba(255,255,255,0.25); }
    }

    .reg-bg {
        min-height:100vh; display:flex; align-items:center; justify-content:center;
        padding:2rem 1rem; font-family:'Inter',-apple-system,sans-serif;
        position:relative; overflow:hidden; background:${BG};
    }
    .gdeco {
        position:absolute; pointer-events:none;
        background:rgba(255,255,255,0.14);
        border:1px solid rgba(255,255,255,0.65);
        backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        box-shadow:0 8px 32px rgba(200,100,30,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
    }
    .gd1{width:130px;height:130px;border-radius:30px;top:8%;right:10%;animation:floatA 17s ease-in-out infinite 1s;transform:rotate(12deg);}
    .gd2{width:88px;height:88px;border-radius:50%;top:68%;left:5%;animation:floatC 12s ease-in-out infinite 3.5s;}
    .gd3{width:200px;height:60px;border-radius:44px;bottom:12%;right:7%;animation:floatB 14s ease-in-out infinite 0.5s;}
    .gd4{width:60px;height:160px;border-radius:44px;top:25%;left:4%;animation:floatA 16s ease-in-out infinite 4.5s;transform:rotate(-6deg);}

    .reg-wrapper {
        width:100%; max-width:460px; position:relative; z-index:10;
        animation:fadeUp 0.85s cubic-bezier(0.16,1,0.3,1) both;
    }
    .logo-area { text-align:center; margin-bottom:1.75rem; }
    .logo-icon {
        display:inline-flex; align-items:center; justify-content:center;
        width:72px; height:72px;
        background:linear-gradient(145deg,#ef4444 0%,#b91c1c 100%);
        border-radius:22px; margin-bottom:1rem;
        animation:pulseGlow 3s ease-in-out infinite; position:relative;
    }
    .logo-icon::after {
        content:''; position:absolute; inset:0; border-radius:22px;
        background:linear-gradient(145deg,rgba(255,255,255,0.22) 0%,transparent 60%);
    }
    .logo-title { font-size:2rem; font-weight:300; color:#1a0f04; letter-spacing:-0.03em; line-height:1; margin-bottom:0.3rem; }
    .logo-sub   { font-size:0.85rem; color:rgba(120,55,10,0.75); font-weight:400; letter-spacing:0.04em; }

    .glass-card {
        background:rgba(255,255,255,0.04);
        backdrop-filter:blur(22px) saturate(150%); -webkit-backdrop-filter:blur(22px) saturate(150%);
        border-radius:32px; border:1px solid rgba(255,255,255,0.65);
        box-shadow:0 16px 48px rgba(180,90,20,0.1),0 4px 14px rgba(180,90,20,0.06),
            inset 0 1.5px 0 rgba(255,255,255,0.88),inset 0 -1px 0 rgba(180,90,20,0.04);
        padding:2.25rem 2.25rem 2rem; position:relative; overflow:hidden;
    }
    .glass-card::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent 100%);
        pointer-events:none; z-index:1;
    }
    .glass-card::after {
        content:''; position:absolute; top:0; left:0; width:52%; height:58%;
        background:radial-gradient(ellipse at 28% 18%,rgba(255,255,255,0.12) 0%,transparent 65%);
        pointer-events:none; z-index:1;
    }
    .card-title { font-size:1.2rem; font-weight:500; color:#1a0f04; text-align:center; margin-bottom:1.75rem; letter-spacing:-0.02em; }

    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; }
    .form-group { margin-bottom:1rem; }
    .form-label { display:block; font-size:0.7rem; font-weight:600; color:rgba(120,55,10,0.85); letter-spacing:0.09em; text-transform:uppercase; margin-bottom:0.45rem; }

    .glass-input {
        width:100%; padding:0.85rem 1rem;
        background:rgba(255,255,255,0.05); border:1px solid rgba(200,140,80,0.45);
        border-radius:14px; font-size:0.9rem; color:#1a0f04;
        font-family:'Inter',sans-serif; outline:none; transition:all 0.25s ease;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .glass-input::placeholder { color:rgba(130,65,10,0.4); }
    .glass-input:focus {
        background:rgba(255,255,255,0.1); border-color:rgba(200,140,80,0.7);
        box-shadow:0 0 0 3px rgba(220,38,38,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .input-wrap { position:relative; }
    .eye-btn {
        position:absolute; right:0.9rem; top:50%; transform:translateY(-50%);
        background:none; border:none; cursor:pointer; color:rgba(140,70,15,0.6);
        display:flex; padding:0; transition:color 0.15s;
    }
    .eye-btn:hover { color:rgba(150,70,10,0.8); }
    .field-error { margin-top:0.35rem; font-size:0.75rem; color:rgba(185,28,28,0.88); font-weight:500; }

    .alert-success {
        margin-bottom:1.25rem; padding:0.85rem 1rem;
        background:rgba(16,185,129,0.07); border:1px solid rgba(16,185,129,0.22);
        border-radius:14px; color:#059669; font-size:0.84rem; text-align:center;
    }

    .glass-btn {
        width:100%; padding:0.9rem; border-radius:14px;
        font-family:'Inter',sans-serif; font-size:0.92rem; font-weight:500;
        letter-spacing:-0.01em; cursor:pointer;
        transition:all 0.28s cubic-bezier(0.16,1,0.3,1); position:relative; overflow:hidden;
        background:rgba(220,38,38,0.08); color:rgba(185,28,28,0.95);
        border:1px solid rgba(220,38,38,0.45);
        box-shadow:0 8px 28px rgba(220,38,38,0.12),0 2px 8px rgba(220,38,38,0.08),
            inset 0 1.5px 0 rgba(255,120,120,0.35),inset 0 -1px 0 rgba(180,20,20,0.06);
    }
    .glass-btn::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,150,150,0.8) 40%,rgba(255,150,150,0.8) 60%,transparent);
        pointer-events:none;
    }
    .glass-btn::after {
        content:''; position:absolute; top:0; left:-120%; width:80%; height:100%;
        background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.18) 50%,transparent 80%);
        transition:left 0.55s ease; pointer-events:none;
    }
    .glass-btn:hover::after { left:130%; }
    .glass-btn:hover:not(:disabled) {
        transform:translateY(-2px); background:rgba(220,38,38,0.13);
        border-color:rgba(220,38,38,0.6);
        box-shadow:0 14px 40px rgba(220,38,38,0.16),0 4px 14px rgba(220,38,38,0.1),
            inset 0 1.5px 0 rgba(255,120,120,0.4);
        color:rgba(160,20,20,1);
    }
    .glass-btn:disabled { opacity:0.4; cursor:not-allowed; }

    .divider { height:1px; margin:1.5rem 0; background:linear-gradient(90deg,transparent,rgba(200,140,80,0.18) 30%,rgba(200,140,80,0.18) 70%,transparent); }
    .login-link { display:block; text-align:center; font-size:0.84rem; color:rgba(120,60,10,0.65); }
    .login-link a { color:rgba(185,28,28,0.8); font-weight:500; text-decoration:none; }
    .login-link a:hover { color:rgba(185,28,28,1); }
    .footer-text { text-align:center; margin-top:1.5rem; font-size:0.78rem; color:rgba(130,65,10,0.5); }

    .benefits-row { display:flex; justify-content:center; gap:1.5rem; margin-bottom:1.5rem; }
    .benefit-item { display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:rgba(120,60,10,0.65); }
`;

export default function RegisterCliente({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        telefono:              '',
    });
    const [showPass, setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post('/registro');
    };

    return (
        <>
            <Head title="Crear cuenta" />
            <style>{STYLES}</style>
            <div className="reg-bg">
                <div className="gdeco gd1" /><div className="gdeco gd2" />
                <div className="gdeco gd3" /><div className="gdeco gd4" />

                <div className="reg-wrapper">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{position:'relative',zIndex:1}}>
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h1 className="logo-title">Vitali Store</h1>
                        <p className="logo-sub">Crea tu cuenta y empieza a comprar</p>
                    </div>

                    <div className="glass-card">
                        <h2 className="card-title">Crear cuenta gratis</h2>

                        {/* Beneficios */}
                        <div className="benefits-row">
                            <div className="benefit-item">
                                <svg width="14" height="14" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                <span>Seguimiento de pedidos</span>
                            </div>
                            <div className="benefit-item">
                                <svg width="14" height="14" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                <span>Historial de compras</span>
                            </div>
                            <div className="benefit-item">
                                <svg width="14" height="14" fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                <span>Ofertas exclusivas</span>
                            </div>
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
                                    <input className="glass-input" style={{paddingRight:'3rem'}}
                                           type={showPass ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                                           value={data.password} onChange={e => setData('password', e.target.value)}
                                           autoComplete="new-password" />
                                    <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                                        {showPass
                                            ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                            : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        }
                                    </button>
                                </div>
                                {errors.password && <p className="field-error">{errors.password}</p>}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="form-group" style={{marginBottom:'1.5rem'}}>
                                <label className="form-label">Confirmar contraseña</label>
                                <div className="input-wrap">
                                    <input className="glass-input" style={{paddingRight:'3rem'}}
                                           type={showConfirm ? 'text' : 'password'} placeholder="Repite tu contraseña"
                                           value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                           autoComplete="new-password" />
                                    <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm
                                            ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                            : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
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
                        <p className="login-link">
                            ¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link>
                        </p>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
