// resources/js/Pages/Reportes/Financiero.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Gráfica de barras dobles verticales */
function DoubleBar({ data }) {
    if (!data || data.length === 0) return (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', padding: '2rem 0' }}>Sin datos</p>
    );
    const maxVal = Math.max(...data.map(d => d.ingresos || 0), 1);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
                {data.map((d, i) => {
                    const hIng  = Math.max(4, (d.ingresos / maxVal) * 150);
                    const hDesc = d.ingresos > 0 ? Math.max(3, (d.descuentos / d.ingresos) * hIng) : 3;
                    const isLast = i === data.length - 1;
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', position: 'relative' }}
                             className="fi-bar-wrap">
                            {/* Tooltip */}
                            <div className="fi-tooltip" style={{
                                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                                marginBottom: '6px',
                                background: 'rgba(45,26,8,0.92)', color: 'white',
                                fontSize: '0.65rem', fontWeight: '500',
                                padding: '5px 9px', borderRadius: '9px',
                                whiteSpace: 'nowrap', pointerEvents: 'none',
                                opacity: 0, transition: 'opacity 0.15s', zIndex: 10,
                                lineHeight: 1.5,
                            }}>
                                <p style={{ fontWeight: '700', margin: 0 }}>{d.mes}</p>
                                <p style={{ margin: 0 }}>Ingresos: {fmt(d.ingresos)}</p>
                                <p style={{ margin: 0 }}>Descuentos: {fmt(d.descuentos)}</p>
                            </div>
                            {/* Barra descuentos */}
                            <div style={{
                                width: '100%', borderRadius: '3px 3px 0 0',
                                height: `${hDesc}px`,
                                background: 'rgba(220,38,38,0.35)',
                            }} />
                            {/* Barra ingresos */}
                            <div style={{
                                width: '100%', borderRadius: '0',
                                height: `${hIng}px`,
                                background: isLast
                                    ? 'linear-gradient(180deg, rgba(139,92,246,0.9), rgba(109,40,217,0.75))'
                                    : 'rgba(139,92,246,0.25)',
                                transition: 'background 0.15s',
                            }} className="fi-bar" />
                        </div>
                    );
                })}
            </div>
            {/* Eje X */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                {data.map(d => (
                    <div key={d.mes} style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {d.mes.split(' ')[0]}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const COLORES_METODO = {
    Efectivo:      { bar: 'rgba(16,185,129,0.75)',  bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.2)',  text: 'rgba(4,120,87,0.9)'    },
    Tarjeta:       { bar: 'rgba(59,130,246,0.75)',  bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.2)',  text: 'rgba(30,64,175,0.9)'   },
    Transferencia: { bar: 'rgba(139,92,246,0.75)',  bg: 'rgba(139,92,246,0.07)',  border: 'rgba(139,92,246,0.2)',  text: 'rgba(109,40,217,0.9)'  },
    Mixto:         { bar: 'rgba(245,158,11,0.75)',  bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.2)',  text: 'rgba(146,64,14,0.9)'   },
};

export default function ReporteFinanciero({ porMes = [], metodosPago = [], kpis = {} }) {
    const totalMetodos = metodosPago.reduce((s, m) => s + parseFloat(m.total || 0), 0);

    const GLASS_BG = `
        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 15% 85%, rgba(255,205,155,0.17) 0%, transparent 55%),
        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
    `;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .fi-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .fi-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .fi-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .fi-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
                .fi-a4 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }

                .fi-glass {
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
                .fi-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }
                .fi-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }
                .fi-bar-wrap:hover .fi-bar    { background: rgba(139,92,246,0.55) !important; }
                .fi-bar-wrap:hover .fi-tooltip { opacity: 1 !important; }

                .fi-table-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.3); }
                .fi-table-row:hover { background: rgba(255,255,255,0.12); }
                .fi-table-row:last-child { border-bottom: none; }

                /* Responsive */
                .fi-kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem; }
                .fi-metodos-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }

                @media (max-width: 900px) {
                    .fi-kpi-grid     { grid-template-columns: repeat(2, 1fr); }
                    .fi-metodos-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 520px) {
                    .fi-kpi-grid     { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .fi-metodos-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                }
            `}</style>

            <div className="fi-bg">

                {/* ── Header ── */}
                <div className="fi-header">
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
                                    Reporte Financiero
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Ingresos, descuentos y distribución de pagos — últimos 6 meses
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── KPIs ── */}
                    <div className="fi-kpi-grid fi-a1">
                        {[
                            { label: 'Ingresos este mes',       value: fmt(kpis.ingresos_mes),       accent: 'rgba(139,92,246,0.9)', accentBg: 'rgba(139,92,246,0.07)', accentBorder: 'rgba(139,92,246,0.2)', sub: kpis.crecimiento !== undefined ? `${kpis.crecimiento >= 0 ? '+' : ''}${kpis.crecimiento}% vs mes anterior` : null, subUp: kpis.crecimiento >= 0 },
                            { label: 'Mes anterior',            value: fmt(kpis.ingresos_mes_ant),   accent: 'rgba(120,60,10,0.8)',  accentBg: 'rgba(120,60,10,0.07)', accentBorder: 'rgba(120,60,10,0.18)', sub: 'Base de comparación' },
                            { label: 'Descuentos este mes',     value: fmt(kpis.total_descuentos),   accent: 'rgba(245,158,11,0.9)', accentBg: 'rgba(245,158,11,0.07)', accentBorder: 'rgba(245,158,11,0.2)', sub: 'Descuentos aplicados' },
                            { label: 'Saldo por cobrar',        value: fmt(kpis.total_pendiente),    accent: 'rgba(220,38,38,0.9)',  accentBg: 'rgba(220,38,38,0.07)', accentBorder: 'rgba(220,38,38,0.2)',  sub: 'Ventas en Pendiente' },
                            { label: 'Ingresos totales históricos', value: fmt(kpis.ingresos_totales), accent: 'rgba(16,185,129,0.9)', accentBg: 'rgba(16,185,129,0.07)', accentBorder: 'rgba(16,185,129,0.2)', sub: 'Todas las ventas', wide: true },
                        ].map(({ label, value, accent, accentBg, accentBorder, sub, subUp, wide }) => (
                            <div key={label} className="fi-glass" style={{ padding: '1.4rem', gridColumn: wide ? 'span 2' : undefined }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '11px',
                                    background: accentBg, border: `1px solid ${accentBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.9rem',
                                }}>
                                    <svg width="17" height="17" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.55rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', marginTop: '0.25rem' }}>{label}</p>
                                {sub && (
                                    <p style={{ fontSize: '0.72rem', marginTop: '0.15rem', color: subUp === true ? 'rgba(16,185,129,0.8)' : subUp === false ? 'rgba(220,38,38,0.75)' : 'rgba(150,80,20,0.5)' }}>
                                        {sub}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── Gráfica 6 meses ── */}
                    <div className="fi-glass fi-a2" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                    Ingresos últimos 6 meses
                                </h2>
                                <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem' }}>
                                    Las barras superiores representan los descuentos aplicados
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'rgba(120,60,10,0.7)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(139,92,246,0.6)', display: 'inline-block' }} />
                                    Ingresos
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(220,38,38,0.35)', display: 'inline-block' }} />
                                    Descuentos
                                </span>
                            </div>
                        </div>

                        <DoubleBar data={porMes} />

                        {/* Tabla resumen */}
                        <div style={{ marginTop: '2rem', overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['Mes', 'Ingresos', 'Descuentos', 'Neto', 'Ventas'].map(h => (
                                        <th key={h} style={{
                                            padding: '0.6rem 1rem', textAlign: 'left',
                                            fontSize: '0.67rem', fontWeight: '600',
                                            color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {[...porMes].reverse().map(d => (
                                    <tr key={d.mes} className="fi-table-row">
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08' }}>{d.mes}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(139,92,246,0.85)' }}>{fmt(d.ingresos)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'rgba(220,38,38,0.7)' }}>{fmt(d.descuentos)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(16,185,129,0.85)' }}>{fmt(d.ingresos - d.descuentos)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.55)' }}>{d.num_ventas}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Métodos de pago ── */}
                    <div className="fi-glass fi-a3" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                            Distribución por método de pago
                        </h2>
                        <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                            Histórico de todos los tiempos
                        </p>

                        <div className="fi-metodos-grid">
                            {metodosPago.map(m => {
                                const pct = totalMetodos > 0 ? ((m.total / totalMetodos) * 100).toFixed(1) : 0;
                                const c   = COLORES_METODO[m.metodo_pago] ?? { bg: 'rgba(180,90,20,0.07)', border: 'rgba(180,90,20,0.18)', text: 'rgba(120,60,10,0.8)' };
                                return (
                                    <div key={m.metodo_pago} style={{
                                        padding: '1.25rem',
                                        background: c.bg,
                                        border: `1px solid ${c.border}`,
                                        borderRadius: '16px',
                                    }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: c.text, margin: 0 }}>{m.metodo_pago}</p>
                                        <p style={{ fontSize: '1.9rem', fontWeight: '700', color: c.text, margin: '0.3rem 0 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                            {pct}%
                                        </p>
                                        <p style={{ fontSize: '0.78rem', color: c.text, marginTop: '0.3rem', opacity: 0.75 }}>{fmt(m.total)}</p>
                                        <p style={{ fontSize: '0.72rem', color: c.text, marginTop: '0.1rem', opacity: 0.55 }}>{m.count} transacciones</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Barras horizontales */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                            {metodosPago.map(m => {
                                const pct = totalMetodos > 0 ? (m.total / totalMetodos) * 100 : 0;
                                const c   = COLORES_METODO[m.metodo_pago] ?? { bar: 'rgba(180,90,20,0.5)' };
                                return (
                                    <div key={m.metodo_pago}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#2d1a08' }}>{m.metodo_pago}</span>
                                            <span style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)' }}>{fmt(m.total)}</span>
                                        </div>
                                        <div style={{ width: '100%', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '8px' }}>
                                            <div style={{ width: `${pct}%`, height: '8px', borderRadius: '99px', background: c.bar, transition: 'width 0.4s ease' }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {metodosPago.length === 0 && (
                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', padding: '1rem 0' }}>
                                    Sin datos de ventas
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
