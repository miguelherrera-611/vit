// resources/js/Pages/Reportes/Ventas.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Pagination from '@/Components/Pagination';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Barra horizontal */
function HBar({ label, value, max, color, sub }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div style={{ marginBottom: '0.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{label}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.5)', flexShrink: 0 }}>{sub}</span>
            </div>
            <div style={{ width: '100%', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '7px' }}>
                <div style={{ width: `${pct}%`, height: '7px', borderRadius: '99px', background: color, transition: 'width 0.4s ease' }} />
            </div>
            <p style={{ fontSize: '0.78rem', fontWeight: '700', color: 'rgba(185,28,28,0.8)', textAlign: 'right', marginTop: '0.25rem' }}>{fmt(value)}</p>
        </div>
    );
}

/* Gráfica barras verticales */
function BarChart({ data }) {
    if (!data || data.length === 0) return (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', padding: '2rem 0' }}>Sin datos para el período</p>
    );
    const max = Math.max(...data.map(d => d.total || 0), 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '112px' }}>
            {data.map((d, i) => {
                const h = Math.max(3, (d.total / max) * 108);
                return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}
                         className="vt-bar-wrap">
                        <div className="vt-tooltip" style={{
                            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                            marginBottom: '4px',
                            background: 'rgba(45,26,8,0.92)', color: 'white',
                            fontSize: '0.65rem', fontWeight: '600', padding: '3px 7px', borderRadius: '7px',
                            whiteSpace: 'nowrap', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.15s', zIndex: 10,
                        }}>
                            {d.fecha}: {fmt(d.total)}
                        </div>
                        <div className="vt-bar" style={{
                            width: '100%', borderRadius: '3px 3px 0 0', height: `${h}px`,
                            background: 'rgba(16,185,129,0.5)', transition: 'background 0.15s',
                        }} />
                    </div>
                );
            })}
        </div>
    );
}

const COLORES_METODO = {
    Efectivo:      'linear-gradient(90deg, rgba(16,185,129,0.8), rgba(4,120,87,0.6))',
    Tarjeta:       'linear-gradient(90deg, rgba(59,130,246,0.8), rgba(30,64,175,0.6))',
    Transferencia: 'linear-gradient(90deg, rgba(139,92,246,0.8), rgba(109,40,217,0.6))',
    Mixto:         'linear-gradient(90deg, rgba(245,158,11,0.8), rgba(146,64,14,0.6))',
};
const COLORES_ESTADO = {
    Completada: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)',  color: 'rgba(4,120,87,0.9)'   },
    Pendiente:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  color: 'rgba(146,64,14,0.9)'  },
    Cancelada:  { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.22)',   color: 'rgba(185,28,28,0.9)'  },
};

export default function ReporteVentas({
                                          ventas = [], ventasPorDia = [], porMetodoPago = [], porEstado = [],
                                          productosTop = [], kpis = {}, filtros = {}
                                      }) {
    const [desde, setDesde]     = useState(filtros.desde ?? '');
    const [hasta, setHasta]     = useState(filtros.hasta ?? '');
    const [estado, setEstado]   = useState(filtros.estado ?? '');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    const aplicarFiltros = () => { setCurrentPage(1); router.get('/reportes/ventas', { desde, hasta, estado }, { preserveState: true }); };
    const maxMetodo = Math.max(...porMetodoPago.map(m => m.total || 0), 1);

    const ventasPaginadas = useMemo(
        () => ventas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [ventas, currentPage]
    );

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
                .vt-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .vt-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .vt-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .vt-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
                .vt-a4 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
                .vt-a5 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.33s both; }

                .vt-glass {
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
                .vt-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }
                .vt-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }
                .vt-bar-wrap:hover .vt-bar    { background: rgba(16,185,129,0.75) !important; }
                .vt-bar-wrap:hover .vt-tooltip { opacity: 1 !important; }
                .vt-table-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.3); }
                .vt-table-row:hover { background: rgba(255,255,255,0.12); }
                .vt-table-row:last-child { border-bottom: none; }

                .vt-input {
                    width: 100%; padding: 0.55rem 0.85rem;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.55);
                    border-radius: 12px;
                    font-size: 0.82rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none;
                    backdrop-filter: blur(10px);
                    transition: all 0.18s;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
                    box-sizing: border-box;
                }
                .vt-input:focus {
                    border-color: rgba(220,38,38,0.4);
                    box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
                    background: rgba(255,255,255,0.1);
                }
                .vt-input option { background: #fdf6f0; color: #2d1a08; }

                /* Responsive */
                .vt-kpi-grid  { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.1rem; }
                .vt-mid-grid  { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; }
                .vt-bot-grid  { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; }
                .vt-fil-grid  { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.85rem; align-items: flex-end; }

                @media (max-width: 1024px) {
                    .vt-kpi-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .vt-mid-grid { grid-template-columns: 1fr; }
                    .vt-bot-grid { grid-template-columns: 1fr; }
                    .vt-fil-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 600px) {
                    .vt-kpi-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .vt-fil-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="vt-bg">

                {/* ── Header ── */}
                <div className="vt-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/reportes" style={{
                                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)',
                                borderRadius: '10px', color: 'rgba(150,80,20,0.6)',
                                textDecoration: 'none', transition: 'all 0.18s',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    Reporte de Ventas
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Período: {filtros.desde} al {filtros.hasta}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── Filtros ── */}
                    <div className="vt-glass vt-a1" style={{ padding: '1.4rem 1.5rem' }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                            Filtrar período
                        </p>
                        <div className="vt-fil-grid">
                            <div>
                                <label style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Desde</label>
                                <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="vt-input" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Hasta</label>
                                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="vt-input" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Estado</label>
                                <select value={estado} onChange={e => setEstado(e.target.value)} className="vt-input">
                                    <option value="">Todos</option>
                                    <option value="Completada">Completada</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                            <button onClick={aplicarFiltros} style={{
                                padding: '0.55rem 1.4rem',
                                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.35)',
                                borderRadius: '12px', fontSize: '0.82rem', fontWeight: '600',
                                color: 'rgba(185,28,28,0.9)', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif', transition: 'all 0.18s',
                                whiteSpace: 'nowrap',
                            }}>
                                Aplicar
                            </button>
                        </div>
                    </div>

                    {/* ── KPIs ── */}
                    <div className="vt-kpi-grid vt-a2">
                        {[
                            { label: 'Total ingresos',   value: fmt(kpis.total_ingresos),  accent: 'rgba(16,185,129,0.9)',  accentBg: 'rgba(16,185,129,0.07)',  accentBorder: 'rgba(16,185,129,0.2)'  },
                            { label: 'Número de ventas', value: kpis.num_ventas ?? 0,       accent: 'rgba(59,130,246,0.9)',  accentBg: 'rgba(59,130,246,0.07)',  accentBorder: 'rgba(59,130,246,0.2)'  },
                            { label: 'Ticket promedio',  value: fmt(kpis.ticket_promedio),  accent: 'rgba(139,92,246,0.9)', accentBg: 'rgba(139,92,246,0.07)',  accentBorder: 'rgba(139,92,246,0.2)' },
                            { label: 'Descuentos dados', value: fmt(kpis.total_descuentos), accent: 'rgba(245,158,11,0.9)', accentBg: 'rgba(245,158,11,0.07)',  accentBorder: 'rgba(245,158,11,0.2)' },
                            { label: 'Por cobrar',       value: fmt(kpis.total_pendiente),  accent: 'rgba(220,38,38,0.85)', accentBg: 'rgba(220,38,38,0.07)',   accentBorder: 'rgba(220,38,38,0.2)'  },
                        ].map(({ label, value, accent, accentBg, accentBorder }) => (
                            <div key={label} className="vt-glass" style={{ padding: '1.35rem' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: accentBg, border: `1px solid ${accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                                    <svg width="16" height="16" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.45rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#2d1a08', marginTop: '0.25rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Gráfica días + métodos de pago ── */}
                    <div className="vt-mid-grid vt-a3">
                        <div className="vt-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Ventas por día</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Ingresos diarios en el período</p>
                            <BarChart data={ventasPorDia} />
                        </div>

                        <div className="vt-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Por método de pago</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Distribución de ingresos</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {porMetodoPago.map(m => (
                                    <HBar key={m.metodo}
                                          label={m.metodo}
                                          value={m.total} max={maxMetodo}
                                          color={COLORES_METODO[m.metodo] || 'rgba(180,90,20,0.5)'}
                                          sub={`${m.count} venta${m.count !== 1 ? 's' : ''}`} />
                                ))}
                                {porMetodoPago.length === 0 && <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', textAlign: 'center', padding: '1rem 0' }}>Sin datos</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Top productos + estados ── */}
                    <div className="vt-bot-grid vt-a4">
                        {/* Top productos */}
                        <div className="vt-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Productos más vendidos</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Ranking por unidades vendidas</p>
                            {productosTop.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', textAlign: 'center', padding: '2rem 0' }}>Sin datos para el período</p>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                                        <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                            {['#', 'Producto', 'Uds', 'Ingresos'].map(h => (
                                                <th key={h} style={{ padding: '0.55rem 0.85rem', textAlign: 'left', fontSize: '0.67rem', fontWeight: '600', color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {productosTop.map((p, i) => (
                                            <tr key={i} className="vt-table-row">
                                                <td style={{ padding: '0.7rem 0.85rem', fontSize: '0.78rem', color: 'rgba(150,80,20,0.45)', fontWeight: '600' }}>{i + 1}</td>
                                                <td style={{ padding: '0.7rem 0.85rem' }}>
                                                    <p style={{ fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>{p.nombre}</p>
                                                    <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', margin: '0.1rem 0 0' }}>{p.categoria}</p>
                                                </td>
                                                <td style={{ padding: '0.7rem 0.85rem', fontSize: '0.87rem', fontWeight: '700', color: '#2d1a08' }}>{p.total_cantidad}</td>
                                                <td style={{ padding: '0.7rem 0.85rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(16,185,129,0.85)' }}>{fmt(p.total_ingresos)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Estados */}
                        <div className="vt-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Por estado</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>Distribución de ventas</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {porEstado.map(e => {
                                    const col = COLORES_ESTADO[e.estado] ?? { bg: 'rgba(180,90,20,0.07)', border: 'rgba(180,90,20,0.15)', color: 'rgba(120,60,10,0.8)' };
                                    return (
                                        <div key={e.estado} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '14px', background: col.bg, border: `1px solid ${col.border}` }}>
                                            <div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: col.color }}>{e.estado}</span>
                                                <p style={{ fontSize: '0.72rem', color: col.color, opacity: 0.65, marginTop: '0.1rem' }}>{e.count} ventas</p>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: '700', color: col.color }}>{fmt(e.total)}</p>
                                        </div>
                                    );
                                })}
                                {porEstado.length === 0 && <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', textAlign: 'center', padding: '1rem 0' }}>Sin datos</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Tabla de ventas ── */}
                    <div className="vt-glass vt-a5" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.38)' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                Detalle de ventas
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', fontWeight: '400', color: 'rgba(150,80,20,0.5)' }}>({ventas.length} registros)</span>
                            </h2>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['Nº Venta', 'Cliente', 'Fecha', 'Total', 'Método', 'Estado'].map(h => (
                                        <th key={h} style={{ padding: '0.7rem 1.25rem', textAlign: 'left', fontSize: '0.67rem', fontWeight: '600', color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {ventasPaginadas.map(v => {
                                    const col = COLORES_ESTADO[v.estado] ?? { bg: 'rgba(180,90,20,0.07)', border: 'rgba(180,90,20,0.15)', color: 'rgba(120,60,10,0.8)' };
                                    return (
                                        <tr key={v.id} className="vt-table-row">
                                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08' }}>{v.numero_venta}</td>
                                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', color: 'rgba(120,60,10,0.7)' }}>{v.cliente?.nombre ?? 'General'}</td>
                                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)' }}>
                                                {new Date(v.created_at).toLocaleDateString('es-CO')}
                                            </td>
                                            <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(16,185,129,0.85)' }}>{fmt(v.total)}</td>
                                            <td style={{ padding: '0.9rem 1.25rem' }}>
                                                <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem', borderRadius: '20px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(30,64,175,0.85)' }}>
                                                    {v.metodo_pago}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.9rem 1.25rem' }}>
                                                <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem', borderRadius: '20px', background: col.bg, border: `1px solid ${col.border}`, color: col.color }}>
                                                    {v.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {ventas.length === 0 && (
                                    <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', fontSize: '0.87rem', color: 'rgba(150,80,20,0.4)' }}>Sin ventas en el período seleccionado</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '1rem 1.5rem' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={ventas.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="green"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
