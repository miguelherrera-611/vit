// resources/js/Pages/Welcome.jsx
import { Link } from '@inertiajs/react';

export default function Welcome({ canLogin }) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
                @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-4deg)} }
                @keyframes stagger1 { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

                .w-root {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    display: flex; flex-direction: column;
                    position: relative; overflow-x: hidden;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 45% at 70% 5%, rgba(255,215,175,0.12) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                }

                /* Decoraciones flotantes */
                .w-deco {
                    position: absolute; pointer-events: none; z-index: 0;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.55);
                    backdrop-filter: blur(14px);
                }
                .wd1 { width:130px;height:130px;border-radius:28px;top:5%;right:4%;animation:floatA 15s ease-in-out infinite;transform:rotate(12deg); }
                .wd2 { width:75px;height:75px;border-radius:50%;top:55%;left:1%;animation:floatB 11s ease-in-out infinite 2s; }
                .wd3 { width:190px;height:52px;border-radius:40px;bottom:10%;right:3%;animation:floatA 13s ease-in-out infinite 1s; }
                .wd4 { width:52px;height:140px;border-radius:40px;top:28%;left:0.5%;animation:floatB 14s ease-in-out infinite 3s;transform:rotate(-6deg); }

                /* Header */
                .w-header {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(253,246,240,0.75);
                    backdrop-filter: blur(32px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.12);
                    box-shadow: 0 1px 0 rgba(255,255,255,0.85);
                }
                .w-header-inner {
                    max-width: 1180px; margin: 0 auto;
                    padding: 0 1.5rem; height: 60px;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 1rem;
                }
                .w-logo {
                    display: flex; align-items: center; gap: 0.55rem;
                    text-decoration: none; flex-shrink: 0;
                }
                .w-logo-mark {
                    width: 30px; height: 30px; border-radius: 8px;
                    border: 1.5px solid rgba(185,28,28,0.45);
                    display: flex; align-items: center; justify-content: center;
                }
                .w-logo-text {
                    font-size: 0.92rem; font-weight: 500;
                    color: #2d1a08; letter-spacing: -0.02em;
                }
                .w-nav { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }
                .w-nav-link {
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,60,10,0.62); text-decoration: none;
                    padding: 0.32rem 0.65rem; border-radius: 7px;
                    transition: all 0.12s; white-space: nowrap;
                }
                .w-nav-link:hover { color: rgba(90,40,5,0.9); background: rgba(200,140,80,0.08); }
                .w-nav-ghost {
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,60,10,0.65); text-decoration: none;
                    padding: 0.32rem 0.72rem; border-radius: 7px;
                    border: 1px solid rgba(200,140,80,0.2);
                    background: rgba(255,255,255,0.5);
                    transition: all 0.12s; white-space: nowrap;
                }
                .w-nav-ghost:hover { background: rgba(255,255,255,0.82); border-color: rgba(200,140,80,0.32); }
                .w-nav-primary {
                    font-size: 0.8rem; font-weight: 500;
                    color: rgba(185,28,28,0.88); text-decoration: none;
                    padding: 0.32rem 0.72rem; border-radius: 7px;
                    border: 1px solid rgba(185,28,28,0.22);
                    background: rgba(185,28,28,0.05);
                    transition: all 0.12s; white-space: nowrap;
                }
                .w-nav-primary:hover { background: rgba(185,28,28,0.1); border-color: rgba(185,28,28,0.35); }

                /* Hero */
                .w-hero {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    padding: 5rem 1.5rem 4rem;
                    position: relative; z-index: 2;
                }
                .w-hero-inner {
                    max-width: 680px; width: 100%; text-align: center;
                    animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both;
                }

                /* Eyebrow */
                .w-eyebrow {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.28rem 0.85rem; border-radius: 40px; margin-bottom: 2rem;
                    background: rgba(185,28,28,0.06);
                    border: 1px solid rgba(185,28,28,0.16);
                }
                .w-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:rgba(185,28,28,0.7); flex-shrink:0; }
                .w-eyebrow-text { font-size:0.68rem; font-weight:500; color:rgba(185,28,28,0.78); letter-spacing:0.06em; text-transform:uppercase; }

                .w-title {
                    font-size: clamp(2.4rem, 7vw, 3.8rem);
                    font-weight: 300; color: #2d1a08;
                    letter-spacing: -0.04em; line-height: 1.08;
                    margin-bottom: 1.25rem;
                }
                .w-title strong { font-weight: 500; }

                .w-subtitle {
                    font-size: clamp(0.9rem, 2.5vw, 1.05rem);
                    color: rgba(150,80,20,0.62); font-weight: 400;
                    line-height: 1.75; margin-bottom: 2.75rem;
                    max-width: 520px; margin-left: auto; margin-right: auto;
                }

                /* CTA */
                .w-cta { display:flex; align-items:center; justify-content:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:4rem; }
                .w-btn-primary {
                    padding:0.82rem 1.75rem; border-radius:10px;
                    font-family:inherit; font-size:0.86rem; font-weight:500;
                    text-decoration:none; display:inline-block;
                    background:rgba(185,28,28,0.08); color:rgba(185,28,28,0.92);
                    border:1px solid rgba(185,28,28,0.25);
                    transition:all 0.2s; letter-spacing:-0.01em;
                }
                .w-btn-primary:hover { background:rgba(185,28,28,0.14); transform:translateY(-1px); border-color:rgba(185,28,28,0.38); }
                .w-btn-ghost {
                    padding:0.82rem 1.5rem; border-radius:10px;
                    font-family:inherit; font-size:0.86rem; font-weight:400;
                    text-decoration:none; display:inline-block;
                    background:rgba(255,255,255,0.5); color:rgba(120,60,10,0.72);
                    border:1px solid rgba(200,140,80,0.2);
                    transition:all 0.2s; letter-spacing:-0.01em;
                }
                .w-btn-ghost:hover { background:rgba(255,255,255,0.82); color:rgba(90,40,5,0.9); }

                /* Feature cards */
                .w-features { display:grid; grid-template-columns:repeat(3,1fr); gap:0.875rem; }
                .w-feat {
                    background:rgba(255,255,255,0.45); border:1px solid rgba(200,140,80,0.12);
                    border-radius:14px; padding:1.5rem 1.25rem; text-align:left;
                    box-shadow:0 2px 16px rgba(180,90,20,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
                    transition:all 0.22s cubic-bezier(0.16,1,0.3,1);
                }
                .w-feat:hover { transform:translateY(-2px); background:rgba(255,255,255,0.6); border-color:rgba(200,140,80,0.2); }
                .w-feat.s1 { animation:stagger1 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .w-feat.s2 { animation:stagger1 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both; }
                .w-feat.s3 { animation:stagger1 0.5s cubic-bezier(0.16,1,0.3,1) 0.26s both; }

                .w-divider { width:40px; height:1px; margin:0 auto 2.5rem; background:rgba(200,140,80,0.22); }

                /* Footer */
                .w-footer {
                    position:relative; z-index:2;
                    border-top:1px solid rgba(200,140,80,0.1);
                    padding:1.25rem 1.5rem;
                    display:flex; align-items:center; justify-content:space-between;
                    flex-wrap:wrap; gap:0.5rem;
                }
                .w-footer p { font-size:0.72rem; color:rgba(150,80,20,0.42); }
                .w-footer-links { display:flex; gap:1.25rem; }
                .w-footer-links a { font-size:0.72rem; color:rgba(150,80,20,0.42); text-decoration:none; transition:color 0.12s; }
                .w-footer-links a:hover { color:rgba(120,55,10,0.7); }

                /* ── RESPONSIVE ── */

                /* Tablet / móvil grande: achicamos padding del header */
                @media (max-width: 640px) {
                    .w-header-inner {
                        padding: 0 1rem;
                        height: 56px;
                        gap: 0.5rem;
                    }
                    /* Ocultamos el enlace "Catálogo" del nav en móvil para dar espacio a los botones */
                    .w-nav-text { display: none; }

                    /* Botones del header más compactos */
                    .w-nav-ghost,
                    .w-nav-primary {
                        font-size: 0.74rem;
                        padding: 0.28rem 0.55rem;
                    }

                    .w-features { grid-template-columns: 1fr; }
                    .w-hero { padding: 3rem 1.25rem 2.5rem; }
                    .w-footer { justify-content: center; text-align: center; }
                    .w-footer-links { justify-content: center; }
                }

                /* Móvil pequeño: botones del hero en columna */
                @media (max-width: 420px) {
                    .w-header-inner { padding: 0 0.875rem; }

                    /* En pantallas muy pequeñas, apilar botones del header verticalmente
                       usando un segundo row bajo el logo */
                    .w-header-inner {
                        flex-wrap: wrap;
                        height: auto;
                        padding-top: 0.6rem;
                        padding-bottom: 0.6rem;
                    }
                    .w-logo { flex: 1; }
                    .w-nav {
                        width: 100%;
                        justify-content: flex-end;
                        gap: 0.35rem;
                    }
                    .w-nav-ghost,
                    .w-nav-primary {
                        flex: 1;
                        text-align: center;
                        font-size: 0.76rem;
                        padding: 0.38rem 0.5rem;
                    }

                    .w-cta { flex-direction: column; align-items: stretch; }
                    .w-btn-primary, .w-btn-ghost { text-align: center; }
                }
            `}</style>

            <div className="w-root">
                <div className="w-deco wd1"/><div className="w-deco wd2"/>
                <div className="w-deco wd3"/><div className="w-deco wd4"/>

                {/* Header */}
                <header className="w-header">
                    <div className="w-header-inner">
                        <Link href="/" className="w-logo">
                            <div className="w-logo-mark">
                                <svg width="13" height="13" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                </svg>
                            </div>
                            <span className="w-logo-text">VitaliStore</span>
                        </Link>

                        <nav className="w-nav">
                            <Link href="/catalogo" className="w-nav-link w-nav-text">Catálogo</Link>
                            {canLogin && (
                                <>
                                    <Link href="/login" className="w-nav-ghost">Iniciar sesión</Link>
                                    <Link href="/registro" className="w-nav-primary">Crear cuenta</Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <main className="w-hero">
                    <div className="w-hero-inner">

                        <div className="w-eyebrow">
                            <div className="w-eyebrow-dot"/>
                            <span className="w-eyebrow-text">Envío a todo Colombia</span>
                        </div>

                        <h1 className="w-title">
                            <strong>Vitali Store</strong>
                        </h1>

                        <p className="w-subtitle">
                            Descubre nuestra colección de productos seleccionados con cuidado.
                            Compra con confianza, paga por transferencia y recibe en la puerta de tu casa.
                        </p>

                        <div className="w-cta">
                            <Link href="/catalogo" className="w-btn-primary">
                                Ver catálogo
                            </Link>
                            {canLogin && (
                                <Link href="/registro" className="w-btn-ghost">
                                    Crear cuenta gratis
                                </Link>
                            )}
                        </div>

                        <div className="w-divider"/>

                        <div className="w-features">
                            <div className="w-feat s1">
                                <div style={{width:'36px',height:'36px',borderRadius:'9px',marginBottom:'0.875rem',
                                    background:'rgba(185,28,28,0.06)',border:'1px solid rgba(185,28,28,0.14)',
                                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <svg width="16" height="16" fill="none" stroke="rgba(185,28,28,0.7)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                                    </svg>
                                </div>
                                <h3 style={{fontSize:'0.86rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.02em'}}>Envío nacional</h3>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.58)',lineHeight:'1.6'}}>Entregamos en todo el país de forma rápida y segura.</p>
                            </div>

                            <div className="w-feat s2">
                                <div style={{width:'36px',height:'36px',borderRadius:'9px',marginBottom:'0.875rem',
                                    background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.14)',
                                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <svg width="16" height="16" fill="none" stroke="rgba(59,130,246,0.7)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                    </svg>
                                </div>
                                <h3 style={{fontSize:'0.86rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.02em'}}>Compra segura</h3>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.58)',lineHeight:'1.6'}}>Verificamos cada pago y te notificamos en cada paso.</p>
                            </div>

                            <div className="w-feat s3">
                                <div style={{width:'36px',height:'36px',borderRadius:'9px',marginBottom:'0.875rem',
                                    background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.14)',
                                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                                    <svg width="16" height="16" fill="none" stroke="rgba(16,185,129,0.7)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                    </svg>
                                </div>
                                <h3 style={{fontSize:'0.86rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.02em'}}>Seguimiento</h3>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.58)',lineHeight:'1.6'}}>Consulta el estado de tu pedido en todo momento.</p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-footer">
                    <p>© {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.</p>
                    <div className="w-footer-links">
                        <Link href="/catalogo">Catálogo</Link>
                        <Link href="/login">Acceso</Link>
                    </div>
                </footer>
            </div>
        </>
    );
}
