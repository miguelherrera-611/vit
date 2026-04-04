// resources/js/Pages/Dashboard/Admin.jsx
import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';

export default function Admin() {
    const { auth, stats } = usePage().props;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }

                @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatA   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
                @keyframes floatB   { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(14px) rotate(-4deg)} }

                .a-root {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                    position: relative; overflow-x: hidden;
                }

                /* Decoraciones flotantes de fondo */
                .a-deco {
                    position: absolute; pointer-events: none; z-index: 0;
                    background: rgba(255,255,255,0.12);
                    border: 1px solid rgba(255,255,255,0.6);
                    backdrop-filter: blur(12px);
                }
                .ad1 { width:120px;height:120px;border-radius:28px;top:4%;right:4%;animation:floatA 14s ease-in-out infinite;transform:rotate(12deg); }
                .ad2 { width:80px;height:80px;border-radius:50%;top:55%;left:1%;animation:floatB 11s ease-in-out infinite 2s; }
                .ad3 { width:180px;height:50px;border-radius:40px;bottom:8%;right:3%;animation:floatA 13s ease-in-out infinite 1s; }
                .ad4 { width:50px;height:140px;border-radius:40px;top:25%;left:0.5%;animation:floatB 15s ease-in-out infinite 3s;transform:rotate(-6deg); }

                /* Header */
                .a-header {
                    position: relative; z-index: 2;
                    background: rgba(253,246,240,0.72);
                    backdrop-filter: blur(32px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.12);
                    box-shadow: 0 1px 0 rgba(255,255,255,0.8);
                }
                .a-header-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 1.5rem 1.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }

                /* Contenido */
                .a-content {
                    position: relative; z-index: 2;
                    max-width: 1280px; margin: 0 auto;
                    padding: 2rem 1.5rem 3rem;
                }

                /* Sección label */
                .a-section-label {
                    font-size: 0.68rem; font-weight: 600;
                    color: rgba(150,80,20,0.45);
                    letter-spacing: 0.1em; text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                /* Stats grid */
                .a-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }

                /* Módulos grid */
                .a-modules {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1rem;
                }

                /* Glass card base */
                .a-card {
                    background: rgba(255,255,255,0.45);
                    backdrop-filter: blur(20px) saturate(150%);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
                    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
                    position: relative; overflow: hidden;
                }
                .a-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255,255,255,0.58);
                    border-color: rgba(200,140,80,0.2);
                    box-shadow: 0 8px 32px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.95);
                }

                /* Botón acción */
                .a-action-btn {
                    display: block; width: 100%; text-align: center;
                    padding: 0.62rem 1rem; border-radius: 9px;
                    font-size: 0.78rem; font-weight: 500;
                    color: rgba(120,60,10,0.8);
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.18);
                    transition: all 0.15s ease; text-decoration: none;
                    letter-spacing: -0.01em; font-family: 'Inter', sans-serif;
                }
                .a-action-btn:hover {
                    background: rgba(255,255,255,0.85);
                    border-color: rgba(200,140,80,0.3);
                    color: rgba(90,40,5,0.95);
                }

                /* Badge de notificación */
                .a-badge {
                    position: absolute; top: 0.9rem; right: 0.9rem;
                    width: 22px; height: 22px;
                    background: rgba(220,38,38,0.88);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.65rem; font-weight: 700; color: white;
                    box-shadow: 0 2px 6px rgba(220,38,38,0.3);
                    z-index: 2;
                }

                /* Animaciones escalonadas */
                .an1  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s  both; }
                .an2  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s  both; }
                .an3  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s  both; }
                .an4  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s  both; }
                .an5  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s  both; }
                .an6  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.24s  both; }
                .an7  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.28s  both; }
                .an8  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s  both; }
                .an9  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.36s  both; }
                .an10 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.40s  both; }
                .an11 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.44s  both; }
                .an12 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.48s  both; }
                .an13 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.52s  both; }
                .an14 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.56s  both; }

                /* Responsive */
                @media (max-width: 900px) {
                    .a-stats { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 520px) {
                    .a-stats { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .a-content { padding: 1.25rem 0.875rem 2.5rem; }
                    .a-header-inner { padding: 1.1rem 0.875rem; }
                    .a-modules { grid-template-columns: 1fr; }
                }
                @media (max-width: 360px) {
                    .a-stats { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="a-root">
                {/* Decoraciones */}
                <div className="a-deco ad1"/><div className="a-deco ad2"/>
                <div className="a-deco ad3"/><div className="a-deco ad4"/>

                {/* Header */}
                <div className="a-header">
                    <div className="a-header-inner">
                        <div>
                            <h1 style={{fontSize:'clamp(1.2rem,3vw,1.6rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1,margin:0}}>
                                Panel Administrativo
                            </h1>
                            <p style={{marginTop:'0.28rem',fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',margin:'0.28rem 0 0'}}>
                                Bienvenid@, {auth.user.name}
                            </p>
                        </div>
                        {stats?.pedidos_revision > 0 && (
                            <Link href="/admin/pedidos?estado=revision" style={{textDecoration:'none'}}>
                                <div style={{
                                    display:'flex',alignItems:'center',gap:'0.45rem',
                                    padding:'0.42rem 0.875rem',
                                    background:'rgba(245,158,11,0.08)',
                                    border:'1px solid rgba(245,158,11,0.28)',
                                    borderRadius:'40px',
                                }}>
                                    <span style={{
                                        display:'inline-flex',alignItems:'center',justifyContent:'center',
                                        width:'20px',height:'20px',
                                        background:'rgba(220,38,38,0.88)',
                                        borderRadius:'50%',
                                        fontSize:'0.62rem',fontWeight:'700',color:'white',
                                    }}>
                                        {stats.pedidos_revision}
                                    </span>
                                    <span style={{fontSize:'0.78rem',fontWeight:'500',color:'rgba(146,64,14,0.85)',whiteSpace:'nowrap'}}>
                                        pedido{stats.pedidos_revision !== 1 ? 's' : ''} en revisión
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Contenido */}
                <div className="a-content">

                    {/* Stats */}
                    <p className="a-section-label">Resumen</p>
                    <div className="a-stats" style={{marginBottom:'2.5rem'}}>
                        <div className="an1"><StatCard icon="box"   value={stats?.productos_activos ?? 0} label="Productos activos"  accent="rgba(59,130,246,0.8)"  /></div>
                        <div className="an2"><StatCard icon="cart"  value={stats?.ventas_hoy ?? 0}        label="Ventas del día"     accent="rgba(16,185,129,0.8)"  /></div>
                        <div className="an3"><StatCard icon="alert" value={stats?.stock_bajo ?? 0}        label="Stock bajo"         accent="rgba(245,158,11,0.85)" /></div>
                        <div className="an4"><StatCard icon="money" value={stats?.ventas_mes ?? 0}        label="Ventas del mes"     accent="rgba(185,28,28,0.8)"   /></div>
                    </div>

                    {/* Módulos */}
                    <p className="a-section-label">Módulos</p>
                    <div className="a-modules">
                        <div className="an1"> <ModCard title="Productos"   desc="Gestionar catálogo e inventario"             icon="box"       accent="rgba(59,130,246,0.75)"  href="/productos"        /></div>
                        <div className="an2"> <ModCard title="Ventas"      desc="Registrar y consultar ventas"                icon="cart"      accent="rgba(16,185,129,0.75)"  href="/ventas"           /></div>
                        <div className="an3"> <ModCard title="Pedidos"     desc="Pedidos de clientes · revisar comprobantes" icon="package"   accent="rgba(245,158,11,0.85)"  href="/admin/pedidos"    badge={stats?.pedidos_revision}    /></div>
                        <div className="an4"> <ModCard title="Reclamos"    desc="Quejas y reclamos de clientes"              icon="support"   accent="rgba(185,28,28,0.75)"   href="/admin/reclamos"   badge={stats?.reclamos_pendientes} /></div>
                        <div className="an5"> <ModCard title="Abonos"      desc="Gestionar abonos de créditos y separados"  icon="credit"    accent="rgba(168,85,247,0.75)"  href="/abonos"           /></div>
                        <div className="an6"> <ModCard title="Cartera"     desc="Deudas activas y clientes con saldo"       icon="wallet"    accent="rgba(245,158,11,0.8)"   href="/ventas/cartera"   /></div>
                        <div className="an7"> <ModCard title="Reportes"    desc="Analíticas y estadísticas"                 icon="chart"     accent="rgba(139,92,246,0.75)"  href="/reportes"         /></div>
                        <div className="an8"> <ModCard title="Inventario"  desc="Control de stock y almacén"               icon="warehouse" accent="rgba(249,115,22,0.8)"   href="/inventario"       /></div>
                        <div className="an9"> <ModCard title="Clientes"    desc="Gestionar base de clientes"               icon="users"     accent="rgba(236,72,153,0.75)"  href="/clientes"         /></div>
                        <div className="an10"><ModCard title="Proveedores" desc="Administrar proveedores"                   icon="building"  accent="rgba(99,102,241,0.75)"  href="/proveedores"      /></div>
                        <div className="an11"><ModCard title="Categorías"  desc="Grupos y subcategorías de productos"       icon="tag"       accent="rgba(20,184,166,0.75)"  href="/categorias"       /></div>
                        <div className="an12"><ModCard title="Papelera"    desc="Elementos eliminados · se purgan en 30 días" icon="trash"   accent="rgba(185,28,28,0.75)"   href="/papelera"         /></div>
                        <div className="an13"><ModCard title="Usuarios"    desc="Crear usuarios, asignar roles y permisos"  icon="users-cog" accent="rgba(185,28,28,0.75)"  href="/usuarios"         /></div>
                        <div className="an14"><ModCard title="Registros"   desc="Historial de actividad del sistema"        icon="log"       accent="rgba(71,85,105,0.8)"    href="/registros"        /></div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Iconos compartidos ── */
const ICONS = {
    box:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    cart:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    alert:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    money:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    package:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4M12 11l8-4M12 11L4 7M12 11v10" />,
    support:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
    credit:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    wallet:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    chart:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    warehouse: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
    users:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    building:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    tag:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    trash:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    'users-cog':<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    log:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
};

function StatCard({ icon, value, label, accent }) {
    const accentBg = accent.replace(/[\d.]+\)$/, '0.08)');
    const accentBorder = accent.replace(/[\d.]+\)$/, '0.18)');
    return (
        <div className="a-card" style={{padding:'1.25rem'}}>
            <div style={{
                width:'38px',height:'38px',borderRadius:'10px',
                background:accentBg, border:`1px solid ${accentBorder}`,
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:'0.875rem',
            }}>
                <svg width="18" height="18" fill="none" stroke={accent} viewBox="0 0 24 24">{ICONS[icon]}</svg>
            </div>
            <p style={{fontSize:'clamp(1.4rem,3vw,1.75rem)',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1,margin:0}}>
                {value}
            </p>
            <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.6)',marginTop:'0.28rem',margin:'0.28rem 0 0'}}>
                {label}
            </p>
        </div>
    );
}

function ModCard({ title, desc, icon, accent, href, badge }) {
    const accentBg = accent.replace(/[\d.]+\)$/, '0.08)');
    const accentBorder = accent.replace(/[\d.]+\)$/, '0.18)');
    return (
        <div className="a-card" style={{padding:'1.5rem'}}>
            {badge > 0 && <div className="a-badge">{badge}</div>}
            <div style={{
                width:'46px',height:'46px',borderRadius:'13px',
                background:accentBg, border:`1px solid ${accentBorder}`,
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:'1.1rem',
            }}>
                <svg width="22" height="22" fill="none" stroke={accent} viewBox="0 0 24 24">{ICONS[icon]}</svg>
            </div>
            <h3 style={{fontSize:'0.9rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.3rem',letterSpacing:'-0.02em'}}>
                {title}
            </h3>
            <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.58)',marginBottom:'1.25rem',lineHeight:'1.55',margin:'0 0 1.25rem'}}>
                {desc}
            </p>
            <Link href={href} className="a-action-btn">Gestionar</Link>
        </div>
    );
}
