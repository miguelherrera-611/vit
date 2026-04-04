// resources/js/Pages/Auth/ForgotPassword.jsx
import { useForm, Link, Head } from '@inertiajs/react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 65% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

    @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
    @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(12px) rotate(-4deg)} }
    @keyframes floatC   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.02)} }

    .auth-bg {
        min-height:100vh; display:flex; align-items:center; justify-content:center;
        padding:2rem 1rem; font-family:'Inter',-apple-system,sans-serif;
        position:relative; overflow:hidden; background:${BG};
    }
    .gdeco {
        position:absolute; pointer-events:none;
        background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.58);
        backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
    }
    .gd1{width:120px;height:120px;border-radius:28px;top:7%;right:8%;animation:floatA 14s ease-in-out infinite;transform:rotate(10deg);}
    .gd2{width:72px;height:72px;border-radius:50%;top:65%;left:4%;animation:floatC 10s ease-in-out infinite 2s;}
    .gd3{width:180px;height:50px;border-radius:38px;bottom:10%;right:5%;animation:floatA 12s ease-in-out infinite 1s;}
    .gd4{width:50px;height:130px;border-radius:38px;top:22%;left:3%;animation:floatB 13s ease-in-out infinite 3s;transform:rotate(-5deg);}

    .auth-wrap { width:100%; max-width:420px; position:relative; z-index:10; animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

    .logo-area { text-align:center; margin-bottom:1.75rem; }
    .logo-icon {
        display:inline-flex; align-items:center; justify-content:center;
        width:52px; height:52px; border-radius:14px; margin-bottom:0.875rem;
        background:rgba(255,255,255,0.52); border:1.5px solid rgba(185,28,28,0.32);
        box-shadow:0 4px 20px rgba(185,28,28,0.08),inset 0 1px 0 rgba(255,255,255,0.92);
    }
    .logo-title { font-size:1.35rem; font-weight:300; color:#2d1a08; letter-spacing:-0.03em; display:block; margin-bottom:0.2rem; }
    .logo-sub   { font-size:0.74rem; color:rgba(150,80,20,0.5); display:block; }

    .glass-card {
        background:rgba(255,255,255,0.48);
        backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%);
        border:1px solid rgba(200,140,80,0.14); border-radius:18px; padding:2.25rem 2rem;
        box-shadow:0 12px 40px rgba(180,90,20,0.08),inset 0 1px 0 rgba(255,255,255,0.95);
    }
    .card-title  { font-size:1rem; font-weight:600; color:#2d1a08; text-align:center; margin-bottom:0.4rem; letter-spacing:-0.02em; }
    .card-sub    { font-size:0.78rem; color:rgba(150,80,20,0.55); text-align:center; margin-bottom:1.5rem; line-height:1.6; }

    .alert-success {
        padding:0.7rem 0.875rem; border-radius:9px; margin-bottom:1.1rem;
        background:rgba(16,185,129,0.07); border:1px solid rgba(16,185,129,0.2);
        font-size:0.78rem; color:rgba(4,120,87,0.88);
    }

    .form-group  { margin-bottom:1.25rem; }
    .form-label  { display:block; font-size:0.65rem; font-weight:600; color:rgba(150,80,20,0.55); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.42rem; }
    .glass-input {
        width:100%; padding:0.78rem 0.95rem;
        background:rgba(255,255,255,0.55); border:1px solid rgba(200,140,80,0.22);
        border-radius:10px; font-size:0.88rem; color:#2d1a08; font-family:'Inter',sans-serif;
        outline:none; transition:all 0.18s; box-shadow:inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .glass-input::placeholder { color:rgba(180,100,30,0.35); }
    .glass-input:focus {
        background:rgba(255,255,255,0.72); border-color:rgba(200,140,80,0.45);
        box-shadow:0 0 0 3px rgba(185,28,28,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
    }
    .field-error { margin-top:0.3rem; font-size:0.72rem; color:rgba(185,28,28,0.85); font-weight:500; }

    .glass-btn {
        width:100%; padding:0.78rem; border-radius:10px; margin-bottom:0.875rem;
        font-family:'Inter',sans-serif; font-size:0.88rem; font-weight:500;
        letter-spacing:-0.01em; cursor:pointer; transition:all 0.2s cubic-bezier(0.16,1,0.3,1);
        background:rgba(185,28,28,0.08); color:rgba(185,28,28,0.92);
        border:1px solid rgba(185,28,28,0.22); box-shadow:0 2px 10px rgba(185,28,28,0.08);
    }
    .glass-btn:hover:not(:disabled) { background:rgba(185,28,28,0.14); transform:translateY(-1px); border-color:rgba(185,28,28,0.35); }
    .glass-btn:disabled { opacity:0.4; cursor:not-allowed; }

    .divider { height:1px; margin:1.25rem 0; background:linear-gradient(90deg,transparent,rgba(200,140,80,0.18) 30%,rgba(200,140,80,0.18) 70%,transparent); }
    .back-link { display:block; text-align:center; font-size:0.78rem; color:rgba(150,80,20,0.55); text-decoration:none; transition:color 0.12s; }
    .back-link:hover { color:rgba(120,55,10,0.8); }
    .footer-text { text-align:center; margin-top:1.5rem; font-size:0.68rem; color:rgba(150,80,20,0.38); }
`;

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post('/forgot-password'); };

    return (
        <>
            <Head title="Recuperar contraseña — VitaliStore" />
            <style>{STYLES}</style>
            <div className="auth-bg">
                <div className="gdeco gd1"/><div className="gdeco gd2"/>
                <div className="gdeco gd3"/><div className="gdeco gd4"/>

                <div className="auth-wrap">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                            </svg>
                        </div>
                        <span className="logo-title">VitaliStore</span>
                        <span className="logo-sub">Recuperar acceso</span>
                    </div>

                    <div className="glass-card">
                        <h1 className="card-title">¿Olvidaste tu contraseña?</h1>
                        <p className="card-sub">Ingresa tu correo y te enviamos un enlace para restablecerla.</p>

                        {status && <div className="alert-success">{status}</div>}

                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-label">Correo electrónico</label>
                                <input type="email" className="glass-input" placeholder="tu@email.com"
                                       value={data.email} onChange={e => setData('email', e.target.value)}
                                       autoFocus autoComplete="username" />
                                {errors.email && <p className="field-error">{errors.email}</p>}
                            </div>
                            <button type="submit" className="glass-btn" disabled={processing}>
                                {processing ? 'Enviando...' : 'Enviar enlace'}
                            </button>
                        </form>

                        <div className="divider" />
                        <Link href="/login" className="back-link">Volver al inicio de sesión</Link>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
