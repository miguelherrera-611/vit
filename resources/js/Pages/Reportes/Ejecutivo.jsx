// resources/js/Pages/Reportes/Ejecutivo.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Mini gráfica de barras inline */
function MiniBar({ data, valueKey }) {
    const maxVal = Math.max(...data.map(d => d[valueKey] || 0), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '64px' }}>
            {data.map((d, i) => {
                const h       = maxVal > 0 ? Math.max(3, (d[valueKey] / maxVal) * 60) : 3;
                const isLast  = i === data.length - 1;
                return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}
                         className="ej-bar-wrap">
                        <div style={{
                            width: '100%', borderRadius: '3px 3px 0 0',
                            height: `${h}px`,
                            background: isLast
                                ? 'linear-gradient(180deg, rgba(16,185,129,0.9), rgba(4,120,87,0.75))'
                                : 'rgba(180,90,20,0.15)',
                            transition: 'background 0.15s',
                        }} className="ej-bar" />
                        <div style={{
                            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                            marginBottom: '4px',
                            background: 'rgba(45,26,8,0.92)', color: 'white',
                            fontSize: '0.65rem', fontWeight: '600',
                            padding: '3px 7px', borderRadius: '7px',
                            whiteSpace: 'nowrap', pointerEvents: 'none',
                            opacity: 0, transition: 'opacity 0.15s',
                            zIndex: 10,
                        }} className="ej-tooltip">
                            {d.fecha}: {fmt(d[valueKey])}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* Fila de ranking */
function RankRow({ rank, nombre, sub, value, accentColor }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            padding: '0.7rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.28)',
        }}>
            <span style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: '700',
                background: rank === 1 ? 'rgba(245,158,11,0.15)' : 'rgba(180,90,20,0.08)',
                color: rank === 1 ? 'rgba(180,100,0,0.9)' : 'rgba(150,80,20,0.55)',
                border: rank === 1 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(180,90,20,0.12)',
            }}>
                {rank}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nombre}
                </p>
                {sub && <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.1rem' }}>{sub}</p>}
            </div>
            <span style={{ fontSize: '0.87rem', fontWeight: '700', color: accentColor ?? '#2d1a08', flexShrink: 0 }}>
                {value}
            </span>
        </div>
    );
}

export default function Ejecutivo({ kpis = {}, ultimos30 = [], topProductos = [], topClientes = [] }) {

    const GLASS_BG = `
        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 15% 85%, rgba(255,205,155,0.17) 0%, transparent 55%),
        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
    `;

    const statCards = [
        { label: 'Ventas hoy',      value: fmt(kpis.ventas_hoy),     sub: `${kpis.num_ventas_hoy ?? 0} transacciones`,     accent: 'rgba(16,185,129,0.9)',  accentBg: 'rgba(16,185,129,0.07)',  accentBorder: 'rgba(16,185,129,0.2)',  anim: 'ej-a1' },
        { label: 'Esta semana',     value: fmt(kpis.ventas_semana),   sub: 'Ingresos de los últimos 7 días',                accent: 'rgba(59,130,246,0.9)',  accentBg: 'rgba(59,130,246,0.07)',  accentBorder: 'rgba(59,130,246,0.2)',  anim: 'ej-a2' },
        { label: 'Este mes',        value: fmt(kpis.ventas_mes),      sub: `${kpis.num_ventas_mes ?? 0} ventas registradas`, accent: 'rgba(139,92,246,0.9)', accentBg: 'rgba(139,92,246,0.07)',  accentBorder: 'rgba(139,92,246,0.2)', anim: 'ej-a3' },
        { label: 'Ticket promedio', value: fmt(kpis.ticket_promedio), sub: 'Promedio por venta este mes',                  accent: 'rgba(245,158,11,0.9)',  accentBg: 'rgba(245,158,11,0.07)',  accentBorder: 'rgba(245,158,11,0.2)',  anim: 'ej-a4' },
    ];

    const alertCards = [
        { label: 'Bajo stock',       value: kpis.bajo_stock ?? 0,        href: '/inventario', warn: (kpis.bajo_stock ?? 0) > 0 },
        { label: 'Agotados',         value: kpis.agotados ?? 0,          href: '/inventario', warn: (kpis.agotados ?? 0) > 0,  critical: true },
        { label: 'Saldo por cobrar', value: fmt(kpis.saldo_pendiente),    href: '/ventas',     warn: (kpis.saldo_pendiente ?? 0) > 0 },
        { label: 'Clientes activos', value: kpis.clientes_activos ?? 0,  href: '/clientes',   info: true },
    ];

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .ej-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }

                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes dropdownIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }

                .ej-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .ej-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .ej-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .ej-a4 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .ej-a5 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .ej-a6 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

                .ej-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
                }
                .ej-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }

                .ej-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }

                .ej-bar-wrap:hover .ej-bar { background: rgba(180,90,20,0.28) !important; }
                .ej-bar-wrap:hover .ej-tooltip { opacity: 1 !important; }

                .ej-alert-link {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.75rem 1rem;
                    border-radius: 14px;
                    font-size: 0.85rem; font-weight: 600;
                    text-decoration: none;
                    transition: all 0.18s;
                    border: 1px solid;
                }

                .ej-nav-link {
                    display: flex; align-items: center; justify-content: center;
                    padding: 0.65rem 1rem;
                    border-radius: 14px;
                    font-size: 0.82rem; font-weight: 500;
                    text-decoration: none;
                    transition: all 0.18s;
                    border: 1px solid rgba(255,255,255,0.55);
                    background: rgba(255,255,255,0.06);
                    color: rgba(120,60,10,0.75);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    text-align: center;
                }
                .ej-nav-link:hover {
                    background: rgba(220,38,38,0.07);
                    border-color: rgba(220,38,38,0.25);
                    color: rgba(185,28,28,0.9);
                    transform: translateY(-1px);
                }

                /* Responsive */
                .ej-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.1rem;
                }
                .ej-mid-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.25rem;
                }
                .ej-bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .ej-nav-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.75rem;
                }

                @media (max-width: 900px) {
                    .ej-kpi-grid  { grid-template-columns: repeat(2, 1fr); }
                    .ej-mid-grid  { grid-template-columns: 1fr; }
                    .ej-bottom-grid { grid-template-columns: 1fr; }
                    .ej-nav-grid  { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 520px) {
                    .ej-kpi-grid  { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .ej-nav-grid  { grid-template-columns: 1fr 1fr; }
                }
            `}</style>

            <div className="ej-bg">

                {/* ── Header ── */}
                <div className="ej-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/reportes" style={{
                                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)',
                                borderRadius: '10px', color: 'rgba(150,80,20,0.6)',
                                textDecoration: 'none', transition: 'all 0.18s',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    Dashboard Ejecutivo
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Visión general del negocio en tiempo real
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── KPIs ── */}
                    <div className="ej-kpi-grid">
                        {statCards.map(({ label, value, sub, accent, accentBg, accentBorder, anim }) => (
                            <div key={label} className={`ej-glass ${anim}`} style={{ padding: '1.4rem' }}>
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
                                <p style={{ fontSize: '1.55rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>
                                    {value}
                                </p>
                                <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', marginTop: '0.25rem' }}>{label}</p>
                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.15rem' }}>{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Gráfica 30 días + Alertas ── */}
                    <div className="ej-mid-grid ej-a5">

                        {/* Gráfica */}
                        <div className="ej-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                Ventas — últimos 30 días
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                                Ingresos diarios acumulados
                            </p>
                            <MiniBar data={ultimos30} valueKey="total" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.35)' }}>{ultimos30[0]?.fecha}</span>
                                <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.35)' }}>{ultimos30[ultimos30.length - 1]?.fecha}</span>
                            </div>
                        </div>

                        {/* Alertas */}
                        <div className="ej-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', marginBottom: '1.1rem' }}>
                                Alertas del sistema
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {alertCards.map(({ label, value, href, warn, critical, info }) => {
                                    let bg, border, color, hoverBg;
                                    if (critical && warn)  { bg = 'rgba(220,38,38,0.07)'; border = 'rgba(220,38,38,0.25)'; color = 'rgba(185,28,28,0.9)'; hoverBg = 'rgba(220,38,38,0.12)'; }
                                    else if (warn)         { bg = 'rgba(245,158,11,0.07)'; border = 'rgba(245,158,11,0.3)'; color = 'rgba(146,64,14,0.9)'; hoverBg = 'rgba(245,158,11,0.12)'; }
                                    else if (info)         { bg = 'rgba(59,130,246,0.06)'; border = 'rgba(59,130,246,0.2)'; color = 'rgba(30,64,175,0.85)'; hoverBg = 'rgba(59,130,246,0.1)'; }
                                    else                   { bg = 'rgba(255,255,255,0.06)'; border = 'rgba(255,255,255,0.55)'; color = 'rgba(120,60,10,0.7)'; hoverBg = 'rgba(255,255,255,0.12)'; }
                                    return (
                                        <Link key={label} href={href} className="ej-alert-link"
                                              style={{ background: bg, borderColor: border, color }}
                                              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
                                              onMouseLeave={e => e.currentTarget.style.background = bg}>
                                            <span>{label}</span>
                                            <span style={{ fontWeight: '700' }}>{value}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Top productos + clientes ── */}
                    <div className="ej-bottom-grid ej-a6">

                        {/* Top productos */}
                        <div className="ej-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                Top productos del mes
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                                Por ingresos generados
                            </p>
                            {topProductos.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', textAlign: 'center', padding: '2rem 0' }}>
                                    Sin ventas registradas este mes
                                </p>
                            ) : topProductos.map((p, i) => (
                                <RankRow
                                    key={i}
                                    rank={i + 1}
                                    nombre={p.nombre}
                                    sub={`${p.categoria} · ${p.qty} uds vendidas`}
                                    value={fmt(p.revenue)}
                                    accentColor="rgba(16,185,129,0.85)"
                                />
                            ))}
                        </div>

                        {/* Top clientes */}
                        <div className="ej-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                Top clientes del mes
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                                Por total comprado
                            </p>
                            {topClientes.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', textAlign: 'center', padding: '2rem 0' }}>
                                    Sin ventas registradas este mes
                                </p>
                            ) : topClientes.map((c, i) => (
                                <RankRow
                                    key={i}
                                    rank={i + 1}
                                    nombre={c.nombre}
                                    sub={`${c.count} compra${c.count !== 1 ? 's' : ''} este mes`}
                                    value={fmt(c.total)}
                                    accentColor="rgba(139,92,246,0.85)"
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Navegación a otros reportes ── */}
                    <div className="ej-nav-grid ej-a6">
                        {[
                            { href: '/reportes/ventas',          label: 'Reporte de Ventas'      },
                            { href: '/reportes/inventario',      label: 'Reporte de Inventario'  },
                            { href: '/reportes/clientes',        label: 'Reporte de Clientes'    },
                            { href: '/reportes/financiero',      label: 'Reporte Financiero'     },
                        ].map(({ href, label }) => (
                            <Link key={href} href={href} className="ej-nav-link">{label}</Link>
                        ))}
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
