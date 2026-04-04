// resources/js/Pages/Auth/VerifyEmail.jsx
import { useForm, Head } from '@inertiajs/react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
    radial-gradient(ellipse 65% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes floatA  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
    @keyframes floatB  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(12px) rotate(-4deg)} }
    @keyframes floatC  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.02)} }

    .auth-bg { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem 1rem; font-family:'Inter',-apple-system,sans-serif; position:relative; overflow:hidden; background:${BG}; }
    .gdeco { position:absolute; pointer-events:none; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.58); backdrop-filter:blur(14px); }
    .gd1{width:120px;height:120px;border-radius:28px;top:7%;right:8%;animation:floatA 14s ease-in-out infinite;transform:rotate(10deg);}
    .gd2{width:72px;height:72px;border-radius:50%;top:65%;left:4%;animation:floatC 10s ease-in-out infinite 2s;}
    .gd3{width:180px;height:50px;border-radius:38px;bottom:10%;right:5%;animation:floatA 12s ease-in-out infinite 1s;}
    .gd4{width:50px;height:130px;border-radius:38px;top:22%;left:3%;animation:floatB 13s ease-in-out infinite 3s;transform:rotate(-5deg);}

    .auth-wrap { width:100%; max-width:420px; position:relative; z-index:10; animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
    .logo-area { text-align:center; margin-bottom:1.75rem; }
    .logo-icon { display:inline-flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:14px; margin-bottom:0.875rem; background:rgba(255,255,255,0.52); border:1.5px solid rgba(185,28,28,0.32); box-shadow:0 4px 20px rgba(185,28,28,0.08),inset 0 1px 0 rgba(255,255,255,0.92); }
    .logo-title { font-size:1.35rem; font-weight:300; color:#2d1a08; letter-spacing:-0.03em; display:block; margin-bottom:0.2rem; }
    .logo-sub   { font-size:0.74rem; color:rgba(150,80,20,0.5); display:block; }

    .glass-card { background:rgba(255,255,255,0.48); backdrop-filter:blur(28px) saturate(160%); border:1px solid rgba(200,140,80,0.14); border-radius:18px; padding:2.25rem 2rem; box-shadow:0 12px 40px rgba(180,90,20,0.08),inset 0 1px 0 rgba(255,255,255,0.95); }
    .card-title { font-size:1rem; font-weight:600; color:#2d1a08; text-align:center; margin-bottom:0.4rem; letter-spacing:-0.02em; }
    .card-sub   { font-size:0.78rem; color:rgba(150,80,20,0.55); text-align:center; margin-bottom:1.1rem; line-height:1.6; }

    .alert-success { padding:0.7rem 0.875rem; border-radius:9px; margin-bottom:1.1rem; background:rgba(16,185,129,0.07); border:1px solid rgba(16,185,129,0.2); font-size:0.78rem; color:rgba(4,120,87,0.88); }

    .glass-btn { width:100%; padding:0.78rem; border-radius:10px; font-family:'Inter',sans-serif; font-size:0.88rem; font-weight:500; letter-spacing:-0.01em; cursor:pointer; transition:all 0.2s; background:rgba(185,28,28,0.08); color:rgba(185,28,28,0.92); border:1px solid rgba(185,28,28,0.22); box-shadow:0 2px 10px rgba(185,28,28,0.08); margin-bottom:0.625rem; }
    .glass-btn:hover:not(:disabled) { background:rgba(185,28,28,0.14); transform:translateY(-1px); }
    .glass-btn:disabled { opacity:0.4; cursor:not-allowed; }

    .glass-btn-sec { width:100%; padding:0.72rem; border-radius:10px; font-family:'Inter',sans-serif; font-size:0.84rem; font-weight:400; cursor:pointer; transition:all 0.14s; background:rgba(255,255,255,0.55); color:rgba(120,60,10,0.7); border:1px solid rgba(200,140,80,0.18); }
    .glass-btn-sec:hover:not(:disabled) { background:rgba(255,255,255,0.82); }
    .glass-btn-sec:disabled { opacity:0.4; cursor:not-allowed; }

    .footer-text { text-align:center; margin-top:1.5rem; font-size:0.68rem; color:rgba(150,80,20,0.38); }
`;

export default function VerifyEmail({ status }) {
    const { post: postVerify, processing: processingVerify } = useForm({});
    const { post: postLogout, processing: processingLogout } = useForm({});

    return (
        <>
            <Head title="Verificar correo — VitaliStore" />
            <style>{STYLES}</style>
            <div className="auth-bg">
                <div className="gdeco gd1"/><div className="gdeco gd2"/>
                <div className="gdeco gd3"/><div className="gdeco gd4"/>

                <div className="auth-wrap">
                    <div className="logo-area">
                        <div className="logo-icon">
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <span className="logo-title">VitaliStore</span>
                        <span className="logo-sub">Verificar correo electrónico</span>
                    </div>

                    <div className="glass-card">
                        <h1 className="card-title">Verifica tu correo</h1>
                        <p className="card-sub">
                            Te enviamos un enlace de verificación. Revísalo para activar tu cuenta y comenzar a comprar.
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="alert-success">
                                Nuevo enlace enviado. Revisa tu bandeja de entrada.
                            </div>
                        )}

                        <p style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.45)', textAlign:'center', marginBottom:'1.25rem' }}>
                            ¿No lo encuentras? Revisa tu carpeta de spam o correo no deseado.
                        </p>

                        <button className="glass-btn" disabled={processingVerify}
                                onClick={() => postVerify('/email/verification-notification')}>
                            {processingVerify ? 'Enviando...' : 'Reenviar enlace de verificación'}
                        </button>

                        <button className="glass-btn-sec" disabled={processingLogout}
                                onClick={() => postLogout('/logout')}>
                            {processingLogout ? 'Cerrando sesión...' : 'Cerrar sesión'}
                        </button>
                    </div>

                    <p className="footer-text">© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </>
    );
}
