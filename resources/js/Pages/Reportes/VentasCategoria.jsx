// resources/js/Pages/Reportes/VentasCategoria.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const PALETTE = [
    { bar: 'rgba(236,72,153,0.75)',  bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.25)',  text: 'rgba(157,23,77,0.9)'  },
    { bar: 'rgba(99,102,241,0.75)',  bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  text: 'rgba(55,48,163,0.9)'  },
    { bar: 'rgba(16,185,129,0.75)',  bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  text: 'rgba(4,120,87,0.9)'   },
    { bar: 'rgba(245,158,11,0.75)',  bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  text: 'rgba(146,64,14,0.9)'  },
    { bar: 'rgba(59,130,246,0.75)',  bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  text: 'rgba(30,64,175,0.9)'  },
    { bar: 'rgba(168,85,247,0.75)',  bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.25)',  text: 'rgba(88,28,135,0.9)'  },
    { bar: 'rgba(249,115,22,0.75)',  bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)',  text: 'rgba(154,52,18,0.9)'  },
    { bar: 'rgba(71,85,105,0.75)',   bg: 'rgba(71,85,105,0.08)',   border: 'rgba(71,85,105,0.25)',   text: 'rgba(30,41,59,0.9)'   },
];
const getColor = (i) => PALETTE[i % PALETTE.length];

function HBarChart({ data, valueKey, grupoColorMap }) {
    const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
    if (data.length === 0) return (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.45)', padding: '2rem 0' }}>Sin datos para el período</p>
    );
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {data.map(d => {
                const pct   = (d[valueKey] / max) * 100;
                const color = grupoColorMap[d.grupo]?.bar ?? 'rgba(180,90,20,0.5)';
                const val   = d[valueKey];
                return (
                    <div key={d.categoria}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                                {d.categoria}
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#2d1a08', flexShrink: 0 }}>
                                {typeof val === 'number' && val > 1000 ? fmt(val) : val}
                            </span>
                        </div>
                        <div style={{ width: '100%', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '8px' }}>
                            <div style={{ width: `${pct}%`, height: '8px', borderRadius: '99px', background: color, transition: 'width 0.4s ease' }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function DonaChart({ comparativa, grupoColorMap }) {
    const total = comparativa.reduce((s, c) => s + (c.ingresos || 0), 0);
    if (total === 0) return (
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.45)', padding: '2rem 0' }}>Sin datos</p>
    );
    const r = 42, cx = 60, cy = 60, strokeW = 22;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const segments = comparativa.map((c, i) => {
        const pct  = c.ingresos / total;
        const dash = pct * circ;
        const seg  = { pct, dash, offset, color: grupoColorMap[c.grupo]?.bar ?? 'rgba(180,90,20,0.5)', grupo: c.grupo };
        offset += dash;
        return seg;
    });
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(180,90,20,0.1)" strokeWidth={strokeW} />
                {segments.map((s, i) => (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                            stroke={s.color} strokeWidth={strokeW}
                            strokeDasharray={`${s.dash} ${circ - s.dash}`}
                            strokeDashoffset={-s.offset}
                            transform={`rotate(-90 ${cx} ${cy})`} />
                ))}
                <text x={cx} y={cy - 5} textAnchor="middle" fontSize="9" fill="rgba(150,80,20,0.6)">Total</text>
                <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fill="#2d1a08" fontWeight="600">
                    {comparativa.length} grupos
                </text>
            </svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                {segments.map((s, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'rgba(120,60,10,0.8)' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                        {s.grupo} <span style={{ color: 'rgba(150,80,20,0.5)' }}>({(s.pct * 100).toFixed(0)}%)</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function VentasCategoria({ porCategoria = [], comparativa = [], kpis = {}, filtros = {} }) {
    const [desde, setDesde] = useState(filtros.desde ?? '');
    const [hasta, setHasta] = useState(filtros.hasta ?? '');
    const [vista, setVista] = useState('ingresos');

    const aplicar = () => router.get('/reportes/ventas-categoria', { desde, hasta }, { preserveState: true });

    const grupoColorMap = {};
    comparativa.forEach((c, i) => { grupoColorMap[c.grupo] = getColor(i); });

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
                .vc-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                .vc-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .vc-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .vc-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
                .vc-a4 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
                .vc-a5 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.33s both; }

                .vc-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                }
                .vc-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }
                .vc-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }
                .vc-date-input {
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
                .vc-date-input:focus {
                    border-color: rgba(220,38,38,0.4);
                    box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .vc-btn-apply {
                    padding: 0.55rem 1.4rem;
                    background: rgba(220,38,38,0.1);
                    border: 1px solid rgba(220,38,38,0.35);
                    border-radius: 12px;
                    font-size: 0.82rem; font-weight: 600;
                    color: rgba(185,28,28,0.9);
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.18s;
                    white-space: nowrap;
                }
                .vc-btn-apply:hover {
                    background: rgba(220,38,38,0.16);
                    transform: translateY(-1px);
                }
                .vc-toggle-btn {
                    padding: 0.4rem 0.85rem;
                    font-size: 0.78rem; font-weight: 500;
                    border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: all 0.15s;
                }
                .vc-table-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.3); }
                .vc-table-row:hover { background: rgba(255,255,255,0.12); }
                .vc-table-row:last-child { border-bottom: none; }

                /* Responsive */
                .vc-kpi-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
                .vc-bars-grid  { display: grid; grid-template-columns: 2fr 1fr; gap: 1.25rem; }
                .vc-fil-grid   { display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: flex-end; }
                .vc-fil-item   { flex: 1; min-width: 130px; }

                @media (max-width: 900px) {
                    .vc-bars-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 520px) {
                    .vc-kpi-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                }
            `}</style>

            <div className="vc-bg">

                {/* ── Header ── */}
                <div className="vc-header">
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
                                    Ventas por Categoría
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Rendimiento por subcategoría · {comparativa.length} grupo{comparativa.length !== 1 ? 's' : ''} activo{comparativa.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── Filtro fechas ── */}
                    <div className="vc-glass vc-a1" style={{ padding: '1.4rem 1.5rem' }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                            Filtrar período
                        </p>
                        <div className="vc-fil-grid">
                            <div className="vc-fil-item">
                                <label style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Desde</label>
                                <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className="vc-date-input" />
                            </div>
                            <div className="vc-fil-item">
                                <label style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Hasta</label>
                                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className="vc-date-input" />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button onClick={aplicar} className="vc-btn-apply">Aplicar filtro</button>
                            </div>
                        </div>
                    </div>

                    {/* ── KPIs ── */}
                    <div className="vc-kpi-grid vc-a2">
                        {[
                            { label: 'Total ingresos',    value: fmt(kpis.total_ingresos), accent: 'rgba(120,60,10,0.8)',  accentBg: 'rgba(120,60,10,0.07)',  accentBorder: 'rgba(120,60,10,0.18)'  },
                            { label: 'Unidades vendidas', value: kpis.total_unidades ?? 0, accent: 'rgba(59,130,246,0.9)', accentBg: 'rgba(59,130,246,0.07)', accentBorder: 'rgba(59,130,246,0.2)'  },
                            { label: 'Subcategoría top',  value: kpis.categoria_top,       accent: 'rgba(157,23,77,0.9)',  accentBg: 'rgba(236,72,153,0.07)', accentBorder: 'rgba(236,72,153,0.2)',  small: true },
                            ...(kpis.por_grupo ?? []).map((g, i) => ({
                                label:       `Ingresos ${g.grupo}`,
                                value:       fmt(g.ingresos),
                                accent:      grupoColorMap[g.grupo]?.text   ?? '#2d1a08',
                                accentBg:    grupoColorMap[g.grupo]?.bg     ?? 'rgba(180,90,20,0.07)',
                                accentBorder:grupoColorMap[g.grupo]?.border ?? 'rgba(180,90,20,0.18)',
                            })),
                        ].map(({ label, value, accent, accentBg, accentBorder, small }) => (
                            <div key={label} className="vc-glass" style={{ padding: '1.3rem' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: accentBg, border: `1px solid ${accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
                                    <svg width="16" height="16" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: small ? '0.95rem' : '1.45rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {value}
                                </p>
                                <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.3rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Barras + Dona ── */}
                    <div className="vc-bars-grid vc-a3">

                        {/* Barras horizontales */}
                        <div className="vc-glass" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Ranking de subcategorías</h2>
                                    <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.2rem' }}>Ordenado de mayor a menor</p>
                                </div>
                                {/* Toggle Ingresos / Unidades */}
                                <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.55)' }}>
                                    {[['ingresos', 'Ingresos'], ['unidades', 'Unidades']].map(([k, l]) => (
                                        <button key={k} onClick={() => setVista(k)} className="vc-toggle-btn"
                                                style={{
                                                    background: vista === k ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.06)',
                                                    color: vista === k ? 'rgba(185,28,28,0.9)' : 'rgba(120,60,10,0.7)',
                                                    fontWeight: vista === k ? '600' : '500',
                                                    borderRight: k === 'ingresos' ? '1px solid rgba(255,255,255,0.45)' : 'none',
                                                }}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <HBarChart data={porCategoria} valueKey={vista} grupoColorMap={grupoColorMap} />
                        </div>

                        {/* Dona + bloques por grupo */}
                        <div className="vc-glass" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Comparativa por grupo</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>
                                Distribución de ingresos · {comparativa.length} grupo{comparativa.length !== 1 ? 's' : ''}
                            </p>
                            <DonaChart comparativa={comparativa} grupoColorMap={grupoColorMap} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.25rem' }}>
                                {comparativa.map((c, i) => {
                                    const col = getColor(i);
                                    return (
                                        <div key={c.grupo} style={{ padding: '0.9rem 1rem', background: col.bg, border: `1px solid ${col.border}`, borderRadius: '14px' }}>
                                            <p style={{ fontSize: '0.82rem', fontWeight: '600', color: col.text, margin: 0 }}>{c.grupo}</p>
                                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: col.text, margin: '0.2rem 0 0', letterSpacing: '-0.02em' }}>
                                                {fmt(c.ingresos)}
                                            </p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(120,60,10,0.55)', marginTop: '0.15rem' }}>
                                                {c.unidades} unidades vendidas
                                            </p>
                                        </div>
                                    );
                                })}
                                {comparativa.length === 0 && (
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(150,80,20,0.4)', padding: '1rem 0' }}>Sin ventas en el período</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Tabla detallada ── */}
                    <div className="vc-glass vc-a4" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.38)' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                Tabla completa por subcategoría
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.2rem' }}>
                                {porCategoria.length} subcategoría{porCategoria.length !== 1 ? 's' : ''} con ventas en el período
                            </p>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '540px' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['#', 'Subcategoría', 'Grupo', 'Productos', 'Unidades', 'Ingresos'].map(h => (
                                        <th key={h} style={{ padding: '0.7rem 1.25rem', textAlign: 'left', fontSize: '0.67rem', fontWeight: '600', color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {porCategoria.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', fontSize: '0.88rem', color: 'rgba(150,80,20,0.4)' }}>
                                            Sin ventas en el período seleccionado
                                        </td>
                                    </tr>
                                ) : porCategoria.map((cat, i) => {
                                    const col = grupoColorMap[cat.grupo] ?? { bg: 'rgba(180,90,20,0.06)', border: 'rgba(180,90,20,0.15)', text: 'rgba(120,60,10,0.7)' };
                                    return (
                                        <tr key={cat.categoria} className="vc-table-row">
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.45)', fontWeight: '600' }}>{i + 1}</td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08' }}>{cat.categoria}</td>
                                            <td style={{ padding: '0.85rem 1.25rem' }}>
                                                <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem', borderRadius: '20px', background: col.bg, border: `1px solid ${col.border}`, color: col.text }}>
                                                    {cat.grupo}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'rgba(120,60,10,0.7)' }}>{cat.productos}</td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.87rem', fontWeight: '700', color: '#2d1a08' }}>{cat.unidades}</td>
                                            <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.87rem', fontWeight: '700', color: col.text }}>{fmt(cat.ingresos)}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
