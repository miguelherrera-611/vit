import { useForm, Link, Head, router } from '@inertiajs/react';

const BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.28) 0%, transparent 55%),
    radial-gradient(ellipse 65% 55% at 100% 100%, rgba(255,195,145,0.24) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Inter',sans-serif; background:${BG}; min-height:100vh; }

    .top-nav { position:fixed; top:0; left:0; right:0; z-index:100; height:56px; background:rgba(255,255,255,0.08); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.5); display:flex; align-items:center; padding:0 2rem; gap:1rem; }
    .nav-logo { display:flex; align-items:center; gap:0.6rem; text-decoration:none; }
    .nav-logo-icon { width:32px; height:32px; background:linear-gradient(145deg,#ef4444,#b91c1c); border-radius:10px; display:flex; align-items:center; justify-content:center; }
    .nav-logo-text { font-size:1rem; font-weight:600; color:#2d1a08; letter-spacing:-0.03em; }
    .nav-spacer { flex:1; }
    .nav-link { font-size:0.82rem; font-weight:500; color:rgba(185,28,28,0.75); text-decoration:none; padding:0.4rem 0.9rem; border-radius:10px; border:1px solid rgba(220,38,38,0.28); transition:all 0.2s; }
    .nav-link:hover { background:rgba(220,38,38,0.08); color:rgba(185,28,28,1); }

    .page-wrap { max-width:680px; margin:0 auto; padding:5rem 1.5rem 3rem; }
    .page-title { font-size:1.5rem; font-weight:300; color:#2d1a08; letter-spacing:-0.04em; margin-bottom:0.3rem; }
    .page-sub { font-size:0.82rem; color:rgba(150,80,20,0.55); margin-bottom:2rem; }

    .glass-card { background:rgba(255,255,255,0.06); backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%); border:1px solid rgba(255,255,255,0.68); border-radius:24px; padding:2rem; margin-bottom:1.5rem; position:relative; overflow:hidden; box-shadow:0 12px 40px rgba(180,90,20,0.10),inset 0 1.5px 0 rgba(255,255,255,0.92); }
    .glass-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.96) 25%,rgba(255,255,255,0.96) 75%,transparent); pointer-events:none; }

    .pending-card { background:rgba(245,158,11,0.04); backdrop-filter:blur(28px) saturate(160%); -webkit-backdrop-filter:blur(28px) saturate(160%); border:1px solid rgba(245,158,11,0.35); border-radius:24px; padding:2rem; margin-bottom:1.5rem; position:relative; overflow:hidden; box-shadow:0 12px 40px rgba(180,90,20,0.08),inset 0 1.5px 0 rgba(255,255,255,0.85); }
    .pending-card::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.96) 25%,rgba(255,255,255,0.96) 75%,transparent); pointer-events:none; }

    .card-title { font-size:0.9rem; font-weight:700; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:0.3rem; }
    .card-desc { font-size:0.78rem; color:rgba(120,60,10,0.6); margin-bottom:1.5rem; line-height:1.5; }

    .field { margin-bottom:1.1rem; }
    .field-label { display:block; font-size:0.7rem; font-weight:700; color:rgba(150,80,20,0.65); text-transform:uppercase; letter-spacing:0.09em; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.8rem 1rem; background:rgba(255,255,255,0.07); border:1px solid rgba(200,140,80,0.38); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s; box-shadow:inset 0 1px 0 rgba(255,255,255,0.78); }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.14); border-color:rgba(200,140,80,0.62); box-shadow:0 0 0 3px rgba(220,38,38,0.06),inset 0 1px 0 rgba(255,255,255,0.88); }
    .code-input { width:100%; padding:1rem; background:rgba(255,255,255,0.07); border:2px solid rgba(245,158,11,0.38); border-radius:14px; font-size:1.6rem; font-weight:700; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s; letter-spacing:0.25em; text-align:center; }
    .code-input:focus { background:rgba(255,255,255,0.14); border-color:rgba(245,158,11,0.65); box-shadow:0 0 0 3px rgba(245,158,11,0.08); }
    .field-error { margin-top:0.35rem; font-size:0.76rem; color:rgba(185,28,28,0.88); font-weight:500; }

    .alert-success { padding:0.65rem 1rem; border-radius:12px; font-size:0.8rem; font-weight:500; margin-bottom:1rem; background:rgba(16,185,129,0.09); border:1px solid rgba(16,185,129,0.24); color:rgba(4,120,87,0.9); }
    .alert-amber   { padding:0.65rem 1rem; border-radius:12px; font-size:0.8rem; font-weight:500; margin-bottom:1rem; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.28); color:rgba(146,64,14,0.9); }
    .alert-info    { padding:0.65rem 1rem; border-radius:12px; font-size:0.8rem; font-weight:500; margin-bottom:1rem; background:rgba(59,130,246,0.07); border:1px solid rgba(59,130,246,0.22); color:rgba(29,78,216,0.9); }

    .btn-primary { padding:0.75rem 1.5rem; background:rgba(220,38,38,0.12); border:1px solid rgba(220,38,38,0.42); border-radius:12px; font-size:0.85rem; font-weight:600; color:rgba(185,28,28,0.95); cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
    .btn-primary:hover { background:rgba(220,38,38,0.18); transform:translateY(-1px); }
    .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .btn-amber { padding:0.75rem 1.5rem; background:rgba(245,158,11,0.10); border:1px solid rgba(245,158,11,0.40); border-radius:12px; font-size:0.85rem; font-weight:600; color:rgba(146,64,14,0.95); cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
    .btn-amber:hover { background:rgba(245,158,11,0.18); transform:translateY(-1px); }
    .btn-amber:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
    .btn-ghost { padding:0.75rem 1.5rem; background:rgba(255,255,255,0.05); border:1px solid rgba(200,140,80,0.25); border-radius:12px; font-size:0.82rem; font-weight:500; color:rgba(120,60,10,0.65); cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif; }
    .btn-ghost:hover { background:rgba(255,255,255,0.1); }
    .btn-ghost:disabled { opacity:0.5; cursor:not-allowed; }
    .btn-row { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }

    @keyframes slideUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
`;

export default function ProfileEdit({ user, status }) {
    const infoForm     = useForm({ name: user.name, email: user.email });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });
    const codeForm     = useForm({ code: '' });
    const cancelForm   = useForm({});

    const submitInfo     = (e) => { e.preventDefault(); infoForm.patch('/profile'); };
    const submitPassword = (e) => { e.preventDefault(); passwordForm.put('/password'); };
    const submitCode = (e) => { e.preventDefault(); codeForm.post('/profile/verify-email-change', { onSuccess: () => router.visit('/profile') }); };
    const cancelChange = () => cancelForm.post('/profile/cancel-email-change', { onSuccess: () => router.visit('/profile') });

    const hasPendingEmail = !!user.pending_email;

    return (
        <>
            <Head title="Mi Perfil" />
            <style>{STYLES}</style>

            {/* NAV */}
            <nav className="top-nav">
                <Link href="/" className="nav-logo">
                    <div className="nav-logo-icon">
                        <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                    </div>
                    <span className="nav-logo-text">VitaliStore</span>
                </Link>
                <div className="nav-spacer" />
                <Link href="/dashboard" className="nav-link">← Dashboard</Link>
            </nav>

            <div className="page-wrap">
                <h1 className="page-title">Mi Perfil</h1>
                <p className="page-sub">Administra tu información personal y seguridad de la cuenta.</p>

                {/* ── INFORMACIÓN ─────────────────────────────────── */}
                <div className="glass-card" style={{animation:'slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p className="card-title">Información de la cuenta</p>
                    <p className="card-desc">
                        {hasPendingEmail
                            ? 'Tienes un cambio de correo pendiente de verificar. Cancélalo primero si quieres usar un correo diferente.'
                            : 'Actualiza tu nombre y dirección de correo electrónico.'}
                    </p>

                    {status === 'profile-updated'        && <div className="alert-success">✓ Nombre actualizado correctamente.</div>}
                    {status === 'email-code-sent'        && <div className="alert-amber">📨 Código enviado a tu nuevo correo. Ingrésalo abajo para confirmar el cambio.</div>}
                    {status === 'email-updated'          && <div className="alert-success">✓ Correo actualizado correctamente.</div>}
                    {status === 'email-change-cancelled' && <div className="alert-info">Cambio de correo cancelado.</div>}

                    <form onSubmit={submitInfo}>
                        <div className="field">
                            <label className="field-label">Nombre</label>
                            <input type="text" className="glass-input" value={infoForm.data.name}
                                   onChange={e => infoForm.setData('name', e.target.value)} autoComplete="name" />
                            {infoForm.errors.name && <p className="field-error">{infoForm.errors.name}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">
                                Correo electrónico
                                {hasPendingEmail && (
                                    <span style={{marginLeft:'0.5rem',fontSize:'0.68rem',fontWeight:'600',color:'rgba(245,158,11,0.85)',background:'rgba(245,158,11,0.1)',padding:'0.15rem 0.5rem',borderRadius:'8px',border:'1px solid rgba(245,158,11,0.28)'}}>
                                        Pendiente verificación
                                    </span>
                                )}
                            </label>
                            <input type="email" className="glass-input" value={infoForm.data.email}
                                   onChange={e => infoForm.setData('email', e.target.value)}
                                   disabled={hasPendingEmail}
                                   style={hasPendingEmail ? {opacity:0.5,cursor:'not-allowed'} : {}}
                                   autoComplete="username" />
                            {infoForm.errors.email && <p className="field-error">{infoForm.errors.email}</p>}
                            {hasPendingEmail && (
                                <p style={{fontSize:'0.74rem',color:'rgba(146,64,14,0.7)',marginTop:'0.35rem'}}>
                                    Correo nuevo pendiente: <strong>{user.pending_email}</strong>
                                </p>
                            )}
                        </div>
                        <div className="btn-row">
                            <button type="submit" className="btn-primary" disabled={infoForm.processing || hasPendingEmail}>
                                {infoForm.processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            {hasPendingEmail && (
                                <button type="button" className="btn-ghost" disabled={cancelForm.processing} onClick={cancelChange}>
                                    {cancelForm.processing ? 'Cancelando...' : 'Cancelar cambio de correo'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ── VERIFICACIÓN CÓDIGO EMAIL ────────────────────── */}
                {hasPendingEmail && (
                    <div className="pending-card" style={{animation:'slideUp 0.50s cubic-bezier(0.16,1,0.3,1) both'}}>
                        <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1.25rem'}}>
                            <div style={{flexShrink:0,width:'44px',height:'44px',borderRadius:'14px',background:'rgba(245,158,11,0.10)',border:'1px solid rgba(245,158,11,0.30)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <svg width="22" height="22" fill="none" stroke="rgba(146,64,14,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="card-title">Confirma tu nuevo correo</p>
                                <p style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',lineHeight:1.5,margin:0}}>
                                    Enviamos un código de 6 dígitos a <strong>{user.pending_email}</strong>. Ingrésalo aquí para confirmar el cambio. Expira en 10 minutos.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submitCode}>
                            <div className="field">
                                <label className="field-label">Código de verificación</label>
                                <input type="text" className="code-input" value={codeForm.data.code}
                                       onChange={e => codeForm.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                       placeholder="000000" maxLength={6} inputMode="numeric" />
                                {codeForm.errors.code && <p className="field-error">{codeForm.errors.code}</p>}
                            </div>
                            <div className="btn-row">
                                <button type="submit" className="btn-amber" disabled={codeForm.processing || codeForm.data.code.length < 6}>
                                    {codeForm.processing ? 'Verificando...' : 'Confirmar nuevo correo'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ── CONTRASEÑA ───────────────────────────────────── */}
                <div className="glass-card" style={{animation:'slideUp 0.55s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p className="card-title">Cambiar contraseña</p>
                    <p className="card-desc">Usa una contraseña larga y segura para proteger tu cuenta.</p>
                    {status === 'password-updated' && <div className="alert-success">✓ Contraseña actualizada.</div>}
                    <form onSubmit={submitPassword}>
                        <div className="field">
                            <label className="field-label">Contraseña actual</label>
                            <input type="password" className="glass-input" placeholder="••••••••"
                                   value={passwordForm.data.current_password}
                                   onChange={e => passwordForm.setData('current_password', e.target.value)}
                                   autoComplete="current-password" />
                            {passwordForm.errors.current_password && <p className="field-error">{passwordForm.errors.current_password}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Nueva contraseña</label>
                            <input type="password" className="glass-input" placeholder="••••••••"
                                   value={passwordForm.data.password}
                                   onChange={e => passwordForm.setData('password', e.target.value)}
                                   autoComplete="new-password" />
                            {passwordForm.errors.password && <p className="field-error">{passwordForm.errors.password}</p>}
                        </div>
                        <div className="field">
                            <label className="field-label">Confirmar nueva contraseña</label>
                            <input type="password" className="glass-input" placeholder="••••••••"
                                   value={passwordForm.data.password_confirmation}
                                   onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                   autoComplete="new-password" />
                            {passwordForm.errors.password_confirmation && <p className="field-error">{passwordForm.errors.password_confirmation}</p>}
                        </div>
                        <div className="btn-row">
                            <button type="submit" className="btn-primary" disabled={passwordForm.processing}>
                                {passwordForm.processing ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
