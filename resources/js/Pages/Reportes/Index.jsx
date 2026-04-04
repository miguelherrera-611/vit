// resources/js/Pages/Reportes/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt    = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);
const fmtNum = (v) => new Intl.NumberFormat('es-CO').format(v ?? 0);

export default function ReportesIndex({ kpis = {} }) {

    const GLASS_BG = `
        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 15% 85%, rgba(255,205,155,0.17) 0%, transparent 55%),
        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
    `;

    const modulos = [
        {
            href:        '/reportes/ejecutivo',
            titulo:      'Dashboard Ejecutivo',
            descripcion: 'Vista gerencial con KPIs, tendencias de 30 días y tops de productos y clientes.',
            accent:      'rgba(120,60,10,0.85)',
            accentBg:    'rgba(120,60,10,0.07)',
            accentBorder:'rgba(120,60,10,0.18)',
            anim: 'ri-a1',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/ventas',
            titulo:      'Reporte de Ventas',
            descripcion: 'Analiza ventas por rango de fechas, método de pago, estado y productos más vendidos.',
            accent:      'rgba(16,185,129,0.9)',
            accentBg:    'rgba(16,185,129,0.07)',
            accentBorder:'rgba(16,185,129,0.2)',
            anim: 'ri-a2',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/inventario',
            titulo:      'Reporte de Inventario',
            descripcion: 'Estado del stock por categoría, productos críticos y valor total del inventario.',
            accent:      'rgba(245,158,11,0.9)',
            accentBg:    'rgba(245,158,11,0.07)',
            accentBorder:'rgba(245,158,11,0.2)',
            anim: 'ri-a3',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            href:        '/reportes/clientes',
            titulo:      'Reporte de Clientes',
            descripcion: 'Ranking de mejores clientes, frecuencia de compra y saldos pendientes.',
            accent:      'rgba(236,72,153,0.85)',
            accentBg:    'rgba(236,72,153,0.07)',
            accentBorder:'rgba(236,72,153,0.2)',
            anim: 'ri-a4',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/financiero',
            titulo:      'Reporte Financiero',
            descripcion: 'Ingresos mensuales de los últimos 6 meses, descuentos y distribución de métodos de pago.',
            accent:      'rgba(139,92,246,0.85)',
            accentBg:    'rgba(139,92,246,0.07)',
            accentBorder:'rgba(139,92,246,0.2)',
            anim: 'ri-a1',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/rentabilidad',
            titulo:      'Rentabilidad',
            descripcion: 'Ganancia bruta, margen por producto y por categoría. Requiere precio de compra configurado.',
            accent:      'rgba(16,185,129,0.9)',
            accentBg:    'rgba(16,185,129,0.07)',
            accentBorder:'rgba(16,185,129,0.2)',
            anim: 'ri-a2',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            href:        '/reportes/ventas-categoria',
            titulo:      'Ventas por Categoría',
            descripcion: 'Rendimiento por subcategoría con comparativa de grupos y gráfica de distribución.',
            accent:      'rgba(220,38,38,0.85)',
            accentBg:    'rgba(220,38,38,0.07)',
            accentBorder:'rgba(220,38,38,0.2)',
            anim: 'ri-a3',
            icono: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
        },
    ];

    const statCards = [
        { label: 'Ventas hoy',       value: fmt(kpis.ventas_hoy),     sub: `${fmtNum(kpis.num_ventas_mes)} ventas este mes`, accent: 'rgba(16,185,129,0.9)',  accentBg: 'rgba(16,185,129,0.07)',  accentBorder: 'rgba(16,185,129,0.2)'  },
        { label: 'Ingresos del mes', value: fmt(kpis.ventas_mes),      sub: `Ticket promedio ${fmt(kpis.ticket_promedio)}`,   accent: 'rgba(139,92,246,0.9)', accentBg: 'rgba(139,92,246,0.07)',  accentBorder: 'rgba(139,92,246,0.2)' },
        { label: 'Saldo pendiente',  value: fmt(kpis.saldo_pendiente), sub: 'Por cobrar a clientes',                          accent: 'rgba(220,38,38,0.85)',  accentBg: 'rgba(220,38,38,0.07)',   accentBorder: 'rgba(220,38,38,0.2)'   },
        { label: 'Bajo stock',       value: fmtNum(kpis.bajo_stock),   sub: `${fmtNum(kpis.total_productos)} productos totales`, accent: 'rgba(245,158,11,0.9)', accentBg: 'rgba(245,158,11,0.07)', accentBorder: 'rgba(245,158,11,0.2)' },
    ];

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .ri-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .ri-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .ri-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .ri-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
                .ri-a4 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }

                .ri-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                    transition: box-shadow 0.25s, transform 0.25s;
                }
                .ri-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }
                .ri-glass-link {
                    text-decoration: none; display: block;
                }
                .ri-glass-link:hover .ri-glass {
                    box-shadow: 0 24px 64px rgba(180,90,20,0.14), 0 8px 20px rgba(180,90,20,0.09),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    transform: translateY(-2px);
                }
                .ri-glass-link:hover .ri-arrow { transform: translateX(3px); }
                .ri-arrow { transition: transform 0.2s; }

                .ri-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }

                /* Responsive */
                .ri-kpi-grid    { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.1rem; }
                .ri-modulos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }

                @media (max-width: 1024px) {
                    .ri-modulos-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 900px) {
                    .ri-kpi-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .ri-kpi-grid    { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .ri-modulos-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="ri-bg">

                {/* ── Header ── */}
                <div className="ri-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            Reportes y Analíticas
                        </h1>
                        <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                            Selecciona un reporte para ver el análisis detallado
                        </p>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── KPIs rápidos ── */}
                    <div className="ri-kpi-grid ri-a1">
                        {statCards.map(({ label, value, sub, accent, accentBg, accentBorder }) => (
                            <div key={label} className="ri-glass" style={{ padding: '1.4rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '11px',
                                    background: accentBg, border: `1px solid ${accentBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.9rem',
                                }}>
                                    <svg width="17" height="17" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.55rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', marginTop: '0.25rem' }}>{label}</p>
                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.15rem' }}>{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Módulos ── */}
                    <div className="ri-modulos-grid ri-a2">
                        {modulos.map((m) => (
                            <Link key={m.href} href={m.href} className="ri-glass-link">
                                <div className={`ri-glass ${m.anim}`} style={{ padding: '1.75rem', height: '100%', boxSizing: 'border-box' }}>
                                    {/* Ícono */}
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '14px',
                                        background: m.accentBg, border: `1px solid ${m.accentBorder}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '1.25rem', color: m.accent,
                                    }}>
                                        {m.icono}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.5rem' }}>
                                        {m.titulo}
                                    </h3>
                                    <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
                                        {m.descripcion}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: '500', color: m.accent }}>
                                        <span>Ver reporte</span>
                                        <svg className="ri-arrow" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
