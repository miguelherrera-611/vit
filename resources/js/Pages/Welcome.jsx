import { Link } from '@inertiajs/react';

export default function Welcome({ canLogin }) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes floatA { 0%,100%{transform:translateY(0) translateX(0) rotate(0deg)} 33%{transform:translateY(-22px) translateX(14px) rotate(4deg)} 66%{transform:translateY(14px) translateX(-10px) rotate(-3deg)} }
                @keyframes floatB { 0%,100%{transform:translateY(0) translateX(0) rotate(0deg)} 33%{transform:translateY(18px) translateX(-14px) rotate(-4deg)} 66%{transform:translateY(-14px) translateX(10px) rotate(5deg)} }
                @keyframes floatC { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.03)} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes pulseGlow {
                    0%,100% { box-shadow: 0 12px 40px rgba(220,38,38,0.28), 0 4px 12px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.25); }
                    50%     { box-shadow: 0 16px 52px rgba(220,38,38,0.38), 0 6px 18px rgba(220,38,38,0.22), inset 0 1px 0 rgba(255,255,255,0.25); }
                }
                @keyframes staggerUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

                .welcome-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                    background:
                        radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 40% at 50%  50%,  rgba(255,225,190,0.12) 0%, transparent 65%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                }

                .bg-deco {
                    position: absolute;
                    pointer-events: none;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    box-shadow: 0 8px 32px rgba(200,100,30,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
                    z-index: 0;
                }
                .bd1 { width:140px; height:140px; border-radius:32px;  top:5%;    right:5%;   animation:floatA 16s ease-in-out infinite 1s;   transform:rotate(14deg); }
                .bd2 { width: 88px; height: 88px; border-radius:50%;   top:58%;   left:1.5%;  animation:floatC 11s ease-in-out infinite 3s; }
                .bd3 { width:210px; height: 60px; border-radius:44px;  bottom:9%; right:4%;   animation:floatB 13s ease-in-out infinite 0.5s; }
                .bd4 { width: 60px; height:155px; border-radius:44px;  top:28%;   left:0.8%;  animation:floatA 15s ease-in-out infinite 4s;   transform:rotate(-7deg); }
                .bd5 { width: 52px; height: 52px; border-radius:18px;  bottom:24%;left:16%;   animation:floatC 9s  ease-in-out infinite 1.5s; transform:rotate(22deg); }
                .bd6 { width:165px; height: 48px; border-radius:40px;  top:2.5%;  left:30%;   animation:floatB 10s ease-in-out infinite 2s; }

                /* HEADER */
                .glass-header {
                    position: relative; z-index: 2;
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    padding: 1.25rem 2rem;
                }
                .header-inner { max-width:1280px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; }
                .logo-wrap { display:flex; align-items:center; gap:0.75rem; text-decoration:none; }
                .logo-icon {
                    width:42px; height:42px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius:14px;
                    display:flex; align-items:center; justify-content:center;
                    animation: pulseGlow 3s ease-in-out infinite;
                    position:relative;
                }
                .logo-icon::after { content:''; position:absolute; inset:0; border-radius:14px; background:linear-gradient(145deg,rgba(255,255,255,0.22) 0%,transparent 60%); }
                .logo-text { font-size:1.4rem; font-weight:300; color:#2d1a08; letter-spacing:-0.03em; }

                /* login button — water drop */
                .glass-login-btn {
                    padding: 0.6rem 1.4rem;
                    border-radius: 14px;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.875rem; font-weight: 500;
                    cursor: pointer;
                    transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
                    position: relative; overflow: hidden;
                    background: rgba(220,38,38,0.08);
                    color: rgba(185,28,28,0.95);
                    border: 1px solid rgba(220,38,38,0.45);
                    box-shadow: 0 4px 16px rgba(220,38,38,0.1), inset 0 1.5px 0 rgba(255,120,120,0.3);
                    backdrop-filter: blur(12px);
                    text-decoration: none;
                    display: inline-block;
                    letter-spacing: -0.01em;
                }
                .glass-login-btn::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,150,150,0.8) 40%,rgba(255,150,150,0.8) 60%,transparent);
                    pointer-events:none;
                }
                .glass-login-btn::after {
                    content:''; position:absolute; top:0; left:-120%; width:80%; height:100%;
                    background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.18) 50%,transparent 80%);
                    transition:left 0.55s ease; pointer-events:none;
                }
                .glass-login-btn:hover::after { left:130%; }
                .glass-login-btn:hover {
                    transform:translateY(-2px);
                    background:rgba(220,38,38,0.13);
                    border-color:rgba(220,38,38,0.6);
                    box-shadow:0 8px 28px rgba(220,38,38,0.15),inset 0 1.5px 0 rgba(255,120,120,0.4);
                    color:rgba(160,20,20,1);
                }

                /* MAIN */
                .welcome-main { flex:1; display:flex; align-items:center; justify-content:center; padding:4rem 2rem; position:relative; z-index:2; }
                .hero-inner { max-width:900px; width:100%; text-align:center; animation:fadeUp 0.85s cubic-bezier(0.16,1,0.3,1) both; }

                .hero-icon {
                    width:96px; height:96px;
                    background:linear-gradient(145deg,#ef4444 0%,#b91c1c 100%);
                    border-radius:28px;
                    display:inline-flex; align-items:center; justify-content:center;
                    margin-bottom:1.75rem;
                    animation:pulseGlow 3s ease-in-out infinite;
                    position:relative;
                    box-shadow:0 12px 40px rgba(220,38,38,0.28),inset 0 1px 0 rgba(255,255,255,0.25);
                }
                .hero-icon::after { content:''; position:absolute; inset:0; border-radius:28px; background:linear-gradient(145deg,rgba(255,255,255,0.22) 0%,transparent 60%); }

                .hero-title { font-size:4rem; font-weight:300; color:#2d1a08; letter-spacing:-0.04em; line-height:1; margin-bottom:1.25rem; }
                .hero-sub { font-size:1.1rem; color:rgba(150,80,20,0.65); font-weight:400; line-height:1.7; margin-bottom:3.5rem; }

                /* GLASS CARD — same as admin */
                .glass-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow:
                        0 16px 48px rgba(180,90,20,0.1),
                        0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88),
                        inset 0 -1px 0 rgba(180,90,20,0.04),
                        inset 1px 0 0 rgba(255,255,255,0.32),
                        inset -1px 0 0 rgba(255,255,255,0.1);
                    position: relative; overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
                    padding: 2rem;
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
                .glass-card:hover {
                    transform:translateY(-3px);
                    background:rgba(255,255,255,0.08);
                    border-color:rgba(255,255,255,0.82);
                    box-shadow:0 24px 64px rgba(180,90,20,0.13),0 6px 20px rgba(180,90,20,0.07),inset 0 1.5px 0 rgba(255,255,255,0.95);
                }

                .features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.25rem; }
                .anim-1 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .anim-2 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
                .anim-3 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }

                /* FOOTER */
                .glass-footer {
                    position:relative; z-index:2;
                    background:rgba(255,255,255,0.06);
                    backdrop-filter:blur(20px);
                    border-top:1px solid rgba(255,255,255,0.55);
                    padding:1.25rem 2rem;
                    text-align:center;
                    font-size:0.78rem;
                    color:rgba(150,80,20,0.45);
                }
            `}</style>

            <div className="welcome-bg">
                {/* Floating deco */}
                <div className="bg-deco bd1"/><div className="bg-deco bd2"/>
                <div className="bg-deco bd3"/><div className="bg-deco bd4"/>
                <div className="bg-deco bd5"/><div className="bg-deco bd6"/>

                {/* Header */}
                <header className="glass-header">
                    <div className="header-inner">
                        <div className="logo-wrap">
                            <div className="logo-icon">
                                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{position:'relative',zIndex:1}}>
                                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                </svg>
                            </div>
                            <span className="logo-text">Vitali Store</span>
                        </div>
                        {canLogin && (
                            <Link href="/login" className="glass-login-btn">
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </header>

                {/* Main */}
                <main className="welcome-main">
                    <div className="hero-inner">
                        <div className="hero-icon">
                            <svg width="48" height="48" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{position:'relative',zIndex:1}}>
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                        </div>

                        <h1 className="hero-title">Vitali Store</h1>
                        <p className="hero-sub">
                            Sistema integral de gestión para control de inventario,<br/>
                            ventas y administración de tu negocio.
                        </p>

                        <div className="features-grid">
                            <div className="anim-1">
                                <FeatureCard
                                    accent="rgba(220,38,38,0.75)"
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>}
                                    title="Seguro"
                                    description="Autenticación 2FA para máxima seguridad"
                                />
                            </div>
                            <div className="anim-2">
                                <FeatureCard
                                    accent="rgba(59,130,246,0.75)"
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/>}
                                    title="Rápido"
                                    description="Gestión eficiente de tu negocio"
                                />
                            </div>
                            <div className="anim-3">
                                <FeatureCard
                                    accent="rgba(16,185,129,0.75)"
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>}
                                    title="Completo"
                                    description="Control total de inventario y ventas"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="glass-footer">
                    © {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ accent, icon, title, description }) {
    return (
        <div className="glass-card" style={{textAlign:'left'}}>
            <div style={{
                width:'52px', height:'52px', borderRadius:'18px',
                display:'flex', alignItems:'center', justifyContent:'center',
                marginBottom:'1.25rem',
                background: accent.replace(/[\d.]+\)$/, '0.1)'),
                border: `1px solid ${accent.replace(/[\d.]+\)$/, '0.2)')}`,
                boxShadow: `0 4px 14px ${accent.replace(/[\d.]+\)$/, '0.1)')}`,
            }}>
                <svg width="26" height="26" fill="none" stroke={accent} viewBox="0 0 24 24">{icon}</svg>
            </div>
            <h3 style={{fontSize:'1rem', fontWeight:'600', color:'#2d1a08', marginBottom:'0.35rem', letterSpacing:'-0.02em'}}>{title}</h3>
            <p style={{fontSize:'0.8rem', color:'rgba(150,80,20,0.6)', lineHeight:'1.5'}}>{description}</p>
        </div>
    );
}
