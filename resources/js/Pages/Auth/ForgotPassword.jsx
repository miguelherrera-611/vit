import { useForm, Link, Head } from '@inertiajs/react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.28) 0%, transparent 55%),
    radial-gradient(ellipse 65% 55% at 100% 100%, rgba(255,195,145,0.24) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    .auth-bg { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem 1rem; font-family:'Inter',sans-serif; background:${BG}; }
    .auth-card { width:100%; max-width:420px; background:rgba(255,255,255,0.06); backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%); border:1px solid rgba(255,255,255,0.68); border-radius:28px; padding:2.5rem 2.25rem; box-shadow:0 20px 60px rgba(180,90,20,0.12),inset 0 1.5px 0 rgba(255,255,255,0.92); position:relative; overflow:hidden; animation:slideUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
    .auth-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.96) 25%,rgba(255,255,255,0.96) 75%,transparent); pointer-events:none; }
    .logo-wrap { display:flex; flex-direction:column; align-items:center; margin-bottom:2rem; }
    .logo-icon { width:64px; height:64px; background:linear-gradient(145deg,#ef4444 0%,#b91c1c 100%); border-radius:20px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 28px rgba(220,38,38,0.32),inset 0 1px 0 rgba(255,255,255,0.25); margin-bottom:1rem; position:relative; overflow:hidden; }
    .logo-icon::before { content:''; position:absolute; top:0; left:0; right:0; height:50%; background:linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 100%); }
    .logo-icon svg { position:relative; z-index:1; }
    .logo-title { font-size:1.65rem; font-weight:300; color:#2d1a08; letter-spacing:-0.04em; }
    .logo-sub { font-size:0.78rem; color:rgba(150,80,20,0.55); margin-top:0.2rem; }
    .form-heading { font-size:1rem; font-weight:600; color:#2d1a08; margin-bottom:0.5rem; text-align:center; }
    .form-desc { font-size:0.82rem; color:rgba(120,60,10,0.65); text-align:center; margin-bottom:1.5rem; line-height:1.5; }
    .alert-success { padding:0.75rem 1rem; border-radius:14px; font-size:0.82rem; font-weight:500; margin-bottom:1.2rem; background:rgba(16,185,129,0.09); border:1px solid rgba(16,185,129,0.24); color:rgba(4,120,87,0.9); }
    .field { margin-bottom:1.1rem; }
    .field-label { display:block; font-size:0.7rem; font-weight:700; color:rgba(150,80,20,0.65); text-transform:uppercase; letter-spacing:0.09em; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.8rem 1rem; background:rgba(255,255,255,0.07); border:1px solid rgba(200,140,80,0.38); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s; box-shadow:inset 0 1px 0 rgba(255,255,255,0.78); }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.14); border-color:rgba(200,140,80,0.62); box-shadow:0 0 0 3px rgba(220,38,38,0.06),inset 0 1px 0 rgba(255,255,255,0.88); }
    .field-error { margin-top:0.35rem; font-size:0.76rem; color:rgba(185,28,28,0.88); font-weight:500; }
    .btn-submit { width:100%; padding:0.82rem 1.5rem; background:rgba(220,38,38,0.12); border:1px solid rgba(220,38,38,0.42); border-radius:14px; font-size:0.9rem; font-weight:600; color:rgba(185,28,28,0.95); cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; box-shadow:0 4px 16px rgba(220,38,38,0.12); margin-bottom:1rem; }
    .btn-submit:hover { background:rgba(220,38,38,0.18); transform:translateY(-1px); }
    .btn-submit:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .back-link { display:block; text-align:center; font-size:0.82rem; color:rgba(185,28,28,0.75); text-decoration:none; font-weight:500; }
    .back-link:hover { color:rgba(185,28,28,1); }
    .card-footer { text-align:center; margin-top:1.5rem; font-size:0.72rem; color:rgba(150,80,20,0.42); }
    @keyframes slideUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
`;

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const submit = (e) => { e.preventDefault(); post('/forgot-password'); };

    return (
        <>
            <Head title="Recuperar Contraseña" />
            <style>{STYLES}</style>
            <div className="auth-bg">
                <div className="auth-card">
                    <div className="logo-wrap">
                        <div className="logo-icon">
                            <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                            </svg>
                        </div>
                        <h1 className="logo-title">VitaliStore</h1>
                        <p className="logo-sub">Recuperar acceso</p>
                    </div>
                    <p className="form-heading">¿Olvidaste tu contraseña?</p>
                    <p className="form-desc">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>
                    {status && <div className="alert-success">{status}</div>}
                    <form onSubmit={submit}>
                        <div className="field">
                            <label className="field-label">Correo electrónico</label>
                            <input type="email" className="glass-input" placeholder="tu@email.com"
                                   value={data.email} onChange={e => setData('email', e.target.value)}
                                   autoFocus autoComplete="username" />
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </div>
                        <button type="submit" className="btn-submit" disabled={processing}>
                            {processing ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </form>
                    <Link href="/login" className="back-link">← Volver al inicio de sesión</Link>
                    <p className="card-footer">© {new Date().getFullYear()} VitaliStore · Todos los derechos reservados</p>
                </div>
            </div>
        </>
    );
}
