// resources/js/Pages/Dashboard/Empleado.jsx
import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';

const MODULOS = [
    { permiso:'crear_ventas',            title:'Nueva Venta',          desc:'Registrar una nueva venta',              href:'/ventas/crear',         icon:'cart-plus',  accent:'rgba(16,185,129,0.8)'  },
    { permiso:'ver_ventas',              title:'Historial de Ventas',   desc:'Consultar todas las ventas',             href:'/ventas',               icon:'cart',       accent:'rgba(4,120,87,0.8)'    },
    { permiso:'ver_productos',           title:'Productos',             desc:'Consultar catálogo de productos',        href:'/productos',            icon:'box',        accent:'rgba(59,130,246,0.8)'  },
    { permiso:'crear_productos',         title:'Nuevo Producto',        desc:'Agregar productos al catálogo',          href:'/productos/crear',      icon:'box-plus',   accent:'rgba(37,99,235,0.8)'   },
    { permiso:'ver_inventario',          title:'Inventario',            desc:'Consultar stock actual',                 href:'/inventario',           icon:'warehouse',  accent:'rgba(249,115,22,0.8)'  },
    { permiso:'ajustar_inventario',      title:'Ajustar Stock',         desc:'Realizar ajustes de inventario',        href:'/inventario/ajustar',   icon:'edit',       accent:'rgba(245,158,11,0.85)' },
    { permiso:'gestionar_clientes',      title:'Clientes',              desc:'Gestionar base de clientes',            href:'/clientes',             icon:'users',      accent:'rgba(236,72,153,0.8)'  },
    { permiso:'ver_proveedores',         title:'Proveedores',           desc:'Consultar proveedores',                 href:'/proveedores',          icon:'building',   accent:'rgba(99,102,241,0.8)'  },
    { permiso:'ver_reportes_ventas',     title:'Reportes de Ventas',    desc:'Ver estadísticas de ventas',            href:'/reportes/ventas',      icon:'chart',      accent:'rgba(139,92,246,0.8)'  },
    { permiso:'ver_reportes_inventario', title:'Reportes Inventario',   desc:'Ver estado del inventario',             href:'/reportes/inventario',  icon:'chart-bar',  accent:'rgba(20,184,166,0.8)'  },
    { permiso:'ver_reportes_financieros',title:'Reportes Financieros',  desc:'Ver reportes financieros',              href:'/reportes/financiero',  icon:'money',      accent:'rgba(16,185,129,0.8)'  },
    { permiso:'gestionar_categorias',    title:'Categorías',            desc:'Gestionar categorías de productos',     href:'/categorias',           icon:'tag',        accent:'rgba(168,85,247,0.8)'  },
    { permiso:'gestionar_papelera',      title:'Papelera',              desc:'Restaurar elementos eliminados',        href:'/papelera',             icon:'trash',      accent:'rgba(185,28,28,0.8)'   },
];

const ICONS = {
    'cart-plus': <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v4m2-2H10"/></>,
    cart:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
    box:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    'box-plus': <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 10v4m2-2h-4"/></>,
    warehouse:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
    edit:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    users:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
    building:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    chart:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    'chart-bar':<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    money:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />,
    tag:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    trash:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
};

export default function Empleado() {
    const { auth } = usePage().props;
    const permisos = auth.user?.permissions ?? [];

    const vistos = new Set();
    const modulosVisibles = MODULOS.filter(m => {
        if (!permisos.includes(m.permiso)) return false;
        if (vistos.has(m.href)) return false;
        vistos.add(m.href);
        return true;
    });

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .e-root {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.2) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.15) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%);
                }

                .e-header {
                    background: rgba(253,246,240,0.72);
                    backdrop-filter: blur(32px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.12);
                    box-shadow: 0 1px 0 rgba(255,255,255,0.8);
                }
                .e-header-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 1.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 0.75rem;
                }

                .e-content {
                    max-width: 1280px; margin: 0 auto;
                    padding: 2rem 1.5rem 3rem;
                }

                .e-section-label {
                    font-size: 0.68rem; font-weight: 600;
                    color: rgba(150,80,20,0.45);
                    letter-spacing: 0.1em; text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                .e-grid {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 1rem;
                }

                .e-card {
                    background: rgba(255,255,255,0.45);
                    backdrop-filter: blur(20px) saturate(150%);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
                    padding: 1.5rem;
                    transition: all 0.22s cubic-bezier(0.16,1,0.3,1);
                    text-decoration: none; display: block; height: 100%;
                }
                .e-card:hover {
                    transform: translateY(-2px);
                    background: rgba(255,255,255,0.6);
                    border-color: rgba(200,140,80,0.22);
                    box-shadow: 0 8px 32px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.95);
                }

                .e-btn {
                    display: block; width: 100%; text-align: center;
                    padding: 0.6rem 1rem; border-radius: 9px;
                    font-size: 0.78rem; font-weight: 500;
                    color: rgba(120,60,10,0.8);
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.18);
                    transition: all 0.14s; text-decoration: none;
                    letter-spacing: -0.01em; font-family: 'Inter', sans-serif;
                    margin-top: 1.1rem;
                }
                .e-btn:hover {
                    background: rgba(255,255,255,0.85);
                    border-color: rgba(200,140,80,0.3);
                    color: rgba(90,40,5,0.95);
                }

                .e-empty {
                    background: rgba(255,255,255,0.45);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    padding: 3.5rem 2rem;
                    text-align: center;
                    box-shadow: 0 4px 24px rgba(180,90,20,0.06);
                }

                .e-role-badge {
                    padding: 0.32rem 0.85rem;
                    background: rgba(16,185,129,0.08);
                    border: 1px solid rgba(16,185,129,0.22);
                    border-radius: 40px;
                    font-size: 0.74rem; font-weight: 500;
                    color: rgba(4,120,87,0.85);
                    white-space: nowrap;
                }

                .en1  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s  both; }
                .en2  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s  both; }
                .en3  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s  both; }
                .en4  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s  both; }
                .en5  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s  both; }
                .en6  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.24s  both; }
                .en7  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.28s  both; }
                .en8  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s  both; }
                .en9  { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.36s  both; }
                .en10 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.40s  both; }
                .en11 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.44s  both; }
                .en12 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.48s  both; }
                .en13 { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.52s  both; }

                @media (max-width: 1200px) {
                    .e-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (max-width: 900px) {
                    .e-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                    .e-content { padding: 1.5rem 1rem 2.5rem; }
                    .e-header-inner { padding: 1.2rem 1rem; }
                }
                @media (max-width: 640px) {
                    .e-header-inner {
                        align-items: flex-start;
                        justify-content: flex-start;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    .e-content { padding: 1.25rem 0.875rem 2.25rem; }
                    .e-card { padding: 1rem; border-radius: 14px; }
                    .e-btn { margin-top: 0.8rem; padding: 0.56rem 0.9rem; font-size: 0.76rem; }
                    .e-section-label { margin-bottom: 0.8rem; }
                }
                @media (max-width: 480px) {
                    .e-grid { grid-template-columns: 1fr; gap: 0.75rem; }
                    .e-empty { padding: 2.25rem 1rem; }
                }
            `}</style>

            <div className="e-root">
                <div className="e-header">
                    <div className="e-header-inner">
                        <div>
                            <h1 style={{fontSize:'clamp(1.2rem,3vw,1.6rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1,margin:0}}>
                                Mi Panel
                            </h1>
                            <p style={{marginTop:'0.28rem',fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',margin:'0.28rem 0 0'}}>
                                Bienvenid@, {auth.user.name}
                            </p>
                        </div>
                        <span className="e-role-badge">Empleado</span>
                    </div>
                </div>

                {/* Contenido */}
                <div className="e-content">

                    {/* Sin permisos */}
                    {modulosVisibles.length === 0 && (
                        <div className="e-empty">
                            <div style={{
                                width:'44px',height:'44px',margin:'0 auto 1rem',borderRadius:'12px',
                                background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.22)',
                                display:'flex',alignItems:'center',justifyContent:'center',
                            }}>
                                <svg width="20" height="20" fill="none" stroke="rgba(180,100,20,0.55)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <h3 style={{fontSize:'0.92rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.4rem'}}>
                                Sin módulos asignados
                            </h3>
                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',maxWidth:'280px',margin:'0 auto',lineHeight:'1.6'}}>
                                Tu cuenta aún no tiene permisos configurados. Contacta al administrador.
                            </p>
                        </div>
                    )}

                    {/* Módulos */}
                    {modulosVisibles.length > 0 && (
                        <>
                            <p className="e-section-label">
                                Módulos disponibles
                                <span style={{marginLeft:'0.5rem',fontWeight:'400',opacity:0.7,textTransform:'none',letterSpacing:0}}>
                                    ({modulosVisibles.length})
                                </span>
                            </p>
                            <div className="e-grid">
                                {modulosVisibles.map((m, i) => {
                                    const accentBg     = m.accent.replace(/[\d.]+\)$/, '0.08)');
                                    const accentBorder = m.accent.replace(/[\d.]+\)$/, '0.18)');
                                    return (
                                        <div key={m.href} className={`en${Math.min(i+1,13)}`}>
                                            <div className="e-card">
                                                <div style={{
                                                    width:'42px',height:'42px',borderRadius:'11px',
                                                    background:accentBg,border:`1px solid ${accentBorder}`,
                                                    display:'flex',alignItems:'center',justifyContent:'center',
                                                    marginBottom:'1rem',
                                                }}>
                                                    <svg width="20" height="20" fill="none" stroke={m.accent} viewBox="0 0 24 24">
                                                        {ICONS[m.icon]}
                                                    </svg>
                                                </div>
                                                <h3 style={{fontSize:'0.86rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.25rem',letterSpacing:'-0.02em'}}>
                                                    {m.title}
                                                </h3>
                                                <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',lineHeight:'1.5',margin:0}}>
                                                    {m.desc}
                                                </p>
                                                <Link href={m.href} className="e-btn">Acceder</Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
