import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';

export default function Admin() {
    const { auth, stats } = usePage().props;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .admin-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    background:
                        radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 40% at 50%  50%,  rgba(255,225,190,0.12) 0%, transparent 65%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                }

                @keyframes floatA { 0%,100%{transform:translateY(0) translateX(0) rotate(0deg)} 33%{transform:translateY(-22px) translateX(14px) rotate(4deg)} 66%{transform:translateY(14px) translateX(-10px) rotate(-3deg)} }
                @keyframes floatB { 0%,100%{transform:translateY(0) translateX(0) rotate(0deg)} 33%{transform:translateY(18px) translateX(-14px) rotate(-4deg)} 66%{transform:translateY(-14px) translateX(10px) rotate(5deg)} }
                @keyframes floatC { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.03)} }
                @keyframes staggerUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

                .bg-deco {
                    position: absolute; pointer-events: none;
                    background: rgba(255,255,255,0.14);
                    border: 1px solid rgba(255,255,255,0.65);
                    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
                    box-shadow: 0 8px 32px rgba(200,100,30,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
                    z-index: 0;
                }
                .bd1 { width:140px; height:140px; border-radius:32px;  top:5%;    right:5%;   animation:floatA 16s ease-in-out infinite 1s;   transform:rotate(14deg); }
                .bd2 { width: 88px; height: 88px; border-radius:50%;   top:58%;   left:1.5%;  animation:floatC 11s ease-in-out infinite 3s; }
                .bd3 { width:210px; height: 60px; border-radius:44px;  bottom:9%; right:4%;   animation:floatB 13s ease-in-out infinite 0.5s; }
                .bd4 { width: 60px; height:155px; border-radius:44px;  top:28%;   left:0.8%;  animation:floatA 15s ease-in-out infinite 4s;   transform:rotate(-7deg); }
                .bd5 { width: 52px; height: 52px; border-radius:18px;  bottom:24%;left:16%;   animation:floatC 9s  ease-in-out infinite 1.5s; transform:rotate(22deg); }
                .bd6 { width:165px; height: 48px; border-radius:40px;  top:2.5%;  left:30%;   animation:floatB 10s ease-in-out infinite 2s; }

                .admin-content { position: relative; z-index: 2; }

                .glass-header {
                    position: relative; z-index: 2;
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                }

                .glass-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%); -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88), inset 0 -1px 0 rgba(180,90,20,0.04),
                        inset 1px 0 0 rgba(255,255,255,0.32), inset -1px 0 0 rgba(255,255,255,0.1);
                    position: relative; overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
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
                    transform:translateY(-3px); background:rgba(255,255,255,0.08);
                    border-color:rgba(255,255,255,0.82);
                    box-shadow:0 24px 64px rgba(180,90,20,0.13),0 6px 20px rgba(180,90,20,0.07),
                        inset 0 1.5px 0 rgba(255,255,255,0.95),inset 0 -1px 0 rgba(180,90,20,0.05),
                        inset 1px 0 0 rgba(255,255,255,0.42),inset -1px 0 0 rgba(255,255,255,0.18);
                }

                .glass-action-btn {
                    display:block; width:100%; text-align:center;
                    padding:0.7rem 1rem; border-radius:14px;
                    font-size:0.875rem; font-weight:500; color:rgba(120,60,10,0.85);
                    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 2px 10px rgba(180,90,20,0.08),inset 0 1px 0 rgba(255,255,255,0.82),inset 0 -1px 0 rgba(180,90,20,0.04);
                    backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
                    transition:all 0.22s ease; text-decoration:none; letter-spacing:-0.01em;
                    font-family:'Inter',sans-serif; position:relative; overflow:hidden;
                }
                .glass-action-btn::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 40%,rgba(255,255,255,0.92) 60%,transparent);
                    pointer-events:none;
                }
                .glass-action-btn:hover {
                    background:rgba(255,255,255,0.09); border-color:rgba(255,255,255,0.82);
                    box-shadow:0 4px 16px rgba(180,90,20,0.1),inset 0 1px 0 rgba(255,255,255,0.9),inset 0 -1px 0 rgba(180,90,20,0.05);
                    transform:translateY(-1px); color:rgba(100,45,5,0.95);
                }

                .anim-1 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .anim-6 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
                .anim-7 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
                .anim-8 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.40s both; }
                .anim-9 { animation:staggerUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
            `}</style>

            <div className="admin-bg">
                <div className="bg-deco bd1"/><div className="bg-deco bd2"/>
                <div className="bg-deco bd3"/><div className="bg-deco bd4"/>
                <div className="bg-deco bd5"/><div className="bg-deco bd6"/>

                <div className="admin-content">
                    <div className="glass-header">
                        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'1.5rem'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                <div>
                                    <h1 style={{fontSize:'1.65rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1}}>
                                        Panel Administrativo
                                    </h1>
                                    <p style={{marginTop:'0.3rem',fontSize:'0.85rem',color:'rgba(150,80,20,0.65)'}}>
                                        Bienvenid@, {auth.user.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 1.5rem'}}>

                        {/* Stats */}
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.25rem',marginBottom:'2.5rem'}}>
                            <div className="anim-1">
                                <StatsCard icon="box"   value={stats.productos_activos} label="Productos Activos" accent="rgba(59,130,246,0.8)"  accentBg="rgba(59,130,246,0.07)" />
                            </div>
                            <div className="anim-2">
                                <StatsCard icon="cart"  value={stats.ventas_hoy}        label="Ventas del Día"    accent="rgba(16,185,129,0.8)"  accentBg="rgba(16,185,129,0.07)" />
                            </div>
                            <div className="anim-3">
                                <StatsCard icon="alert" value={stats.stock_bajo}        label="Stock Bajo"        accent="rgba(245,158,11,0.85)" accentBg="rgba(245,158,11,0.07)" />
                            </div>
                            <div className="anim-4">
                                <StatsCard icon="money" value={stats.ventas_mes}        label="Ventas del Mes"    accent="rgba(220,38,38,0.8)"   accentBg="rgba(220,38,38,0.07)" />
                            </div>
                        </div>

                        <p style={{fontSize:'0.72rem',fontWeight:'600',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1.25rem'}}>
                            Módulos
                        </p>

                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
                            <div className="anim-1"><ActionCard title="Productos"   description="Gestionar catálogo e inventario"             icon="box"       accent="rgba(59,130,246,0.75)"  href="/productos"  /></div>
                            <div className="anim-2"><ActionCard title="Ventas"      description="Registrar y consultar ventas"                icon="cart"      accent="rgba(16,185,129,0.75)"  href="/ventas"     /></div>
                            <div className="anim-3"><ActionCard title="Reportes"    description="Analíticas y estadísticas"                   icon="chart"     accent="rgba(139,92,246,0.75)"  href="/reportes"   /></div>
                            <div className="anim-4"><ActionCard title="Inventario"  description="Control de stock y almacén"                  icon="warehouse" accent="rgba(249,115,22,0.8)"   href="/inventario" /></div>
                            <div className="anim-5"><ActionCard title="Clientes"    description="Gestionar base de clientes"                  icon="users"     accent="rgba(236,72,153,0.75)"  href="/clientes"   /></div>
                            <div className="anim-6"><ActionCard title="Proveedores" description="Administrar proveedores"                     icon="building"  accent="rgba(99,102,241,0.75)"  href="/proveedores"/></div>
                            <div className="anim-8"><ActionCard title="Papelera"    description="Elementos eliminados · se purgan en 30 días" icon="trash"     accent="rgba(220,38,38,0.75)"   href="/papelera"   /></div>
                            <div className="anim-9"><ActionCard title="Usuarios"    description="Crear usuarios, asignar roles y permisos"    icon="users-cog" accent="rgba(220,38,38,0.75)"   href="/usuarios"   /></div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatsCard({ icon, value, label, accent, accentBg }) {
    const icons = {
        box:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
        cart:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
        alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    };
    return (
        <div className="glass-card" style={{padding:'1.5rem'}}>
            <div style={{marginBottom:'1.1rem'}}>
                <div style={{
                    width:'44px',height:'44px',background:accentBg,borderRadius:'14px',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    border:`1px solid ${accent.replace(/[\d.]+\)$/, '0.15)')}`,
                }}>
                    <svg width="22" height="22" fill="none" stroke={accent} viewBox="0 0 24 24">{icons[icon]}</svg>
                </div>
            </div>
            <p style={{fontSize:'1.75rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1}}>{value}</p>
            <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.65)',marginTop:'0.35rem'}}>{label}</p>
        </div>
    );
}

function ActionCard({ title, description, icon, accent, href }) {
    const icons = {
        box:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
        cart:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
        chart:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        warehouse: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
        users:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
        building:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
        trash:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
        'users-cog': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    };
    return (
        <div className="glass-card" style={{padding:'1.75rem'}}>
            <div style={{
                width:'52px',height:'52px',borderRadius:'18px',
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:'1.25rem',
                background:accent.replace(/[\d.]+\)$/, '0.1)'),
                border:`1px solid ${accent.replace(/[\d.]+\)$/, '0.2)')}`,
                boxShadow:`0 4px 14px ${accent.replace(/[\d.]+\)$/, '0.1)')}`,
            }}>
                <svg width="26" height="26" fill="none" stroke={accent} viewBox="0 0 24 24">{icons[icon]}</svg>
            </div>
            <h3 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.35rem',letterSpacing:'-0.02em'}}>{title}</h3>
            <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.6)',marginBottom:'1.4rem',lineHeight:'1.5'}}>{description}</p>
            <Link href={href} className="glass-action-btn">Gestionar →</Link>
        </div>
    );
}
