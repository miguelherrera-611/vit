import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const PER_PAGE = 15;

// ── Dropdown custom de ordenamiento ──────────────────────────────────────────
function OrdenDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef(null);

    const opciones = [
        { value: 'total_compras',   label: 'Total comprado',   icon: '💰' },
        { value: 'num_compras',     label: 'Nº de compras',    icon: '🛍️' },
        { value: 'saldo_total',     label: 'Deuda activa',     icon: '⚠️' },
        { value: 'ticket_promedio', label: 'Ticket promedio',  icon: '📊' },
    ];

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = opciones.find(o => o.value === value);

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(o => !o)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 0.9rem',
                        background: 'rgba(255,255,255,0.08)',
                        border: open ? '1px solid rgba(220,38,38,0.45)' : '1px solid rgba(255,255,255,0.65)',
                        borderRadius: '12px',
                        fontSize: '0.82rem', fontWeight: '500',
                        color: 'rgba(120,60,10,0.85)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 2px 10px rgba(180,90,20,0.08), inset 0 1px 0 rgba(255,255,255,0.82)',
                        transition: 'all 0.18s ease',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Inter, sans-serif',
                    }}>
                <span>{selected?.icon}</span>
                <span>Ordenar: {selected?.label}</span>
                <svg style={{ width: '13px', height: '13px', color: 'rgba(150,80,20,0.5)', transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    minWidth: '200px',
                    background: 'rgba(255,250,245,0.96)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.72)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(180,90,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                    overflow: 'hidden', zIndex: 50,
                    animation: 'dropdownIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    {opciones.map((opt, i) => {
                        const sel = opt.value === value;
                        return (
                            <button key={opt.value} type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        gap: '0.75rem', padding: '0.65rem 1rem',
                                        fontSize: '0.83rem', fontWeight: sel ? '600' : '500',
                                        color: sel ? 'rgba(185,28,28,0.9)' : 'rgba(120,55,10,0.78)',
                                        background: sel ? 'rgba(220,38,38,0.05)' : 'none',
                                        border: 'none',
                                        borderBottom: i < opciones.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                                        cursor: 'pointer', textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif',
                                        transition: 'background 0.12s',
                                    }}
                                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
                                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'none'; }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '14px' }}>{opt.icon}</span>
                                    {opt.label}
                                </span>
                                {sel && (
                                    <svg style={{ width: '13px', height: '13px', color: 'rgba(185,28,28,0.8)', flexShrink: 0 }}
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── Paginador ─────────────────────────────────────────────────────────────────
function Paginador({ pagina, total, porPagina, onChange }) {
    const totalPags = Math.ceil(total / porPagina);
    if (totalPags <= 1) return null;
    const desde = (pagina - 1) * porPagina + 1;
    const hasta  = Math.min(pagina * porPagina, total);

    const rango = () => {
        if (totalPags <= 5) return Array.from({ length: totalPags }, (_, i) => i + 1);
        if (pagina <= 3)    return [1, 2, 3, 4, '...', totalPags];
        if (pagina >= totalPags - 2) return [1, '...', totalPags - 3, totalPags - 2, totalPags - 1, totalPags];
        return [1, '...', pagina - 1, pagina, pagina + 1, '...', totalPags];
    };

    const btnBase = {
        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '10px', fontSize: '0.78rem', fontWeight: '600', border: 'none',
        cursor: 'pointer', transition: 'all 0.15s',
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.03)',
        }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.55)' }}>
                Mostrando <span style={{ fontWeight: '600', color: '#2d1a08' }}>{desde}–{hasta}</span> de{' '}
                <span style={{ fontWeight: '600', color: '#2d1a08' }}>{total}</span> clientes
            </p>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button onClick={() => onChange(pagina - 1)} disabled={pagina === 1}
                        style={{ ...btnBase, background: 'rgba(255,255,255,0.1)', color: 'rgba(150,80,20,0.6)', opacity: pagina === 1 ? 0.3 : 1 }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {rango().map((n, i) => n === '...'
                    ? <span key={`e${i}`} style={{ width: '32px', textAlign: 'center', fontSize: '0.78rem', color: 'rgba(150,80,20,0.4)' }}>…</span>
                    : <button key={n} onClick={() => onChange(n)}
                              style={{
                                  ...btnBase,
                                  background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)',
                                  color: n === pagina ? 'rgba(185,28,28,0.9)' : 'rgba(150,80,20,0.65)',
                                  border: n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.4)',
                              }}>
                        {n}
                    </button>
                )}
                <button onClick={() => onChange(pagina + 1)} disabled={pagina === totalPags}
                        style={{ ...btnBase, background: 'rgba(255,255,255,0.1)', color: 'rgba(150,80,20,0.6)', opacity: pagina === totalPags ? 0.3 : 1 }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ReporteClientes({ clientes = [], kpis = {}, frecuencia = [] }) {
    const [busqueda,     setBusqueda]     = useState('');
    const [orden,        setOrden]        = useState('total_compras');
    const [currentPage,  setCurrentPage]  = useState(1);

    const clientesFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        return clientes
            .filter(c => !q || normalize(c.nombre).includes(q) || normalize(c.email || '').includes(q))
            .sort((a, b) => (b[orden] ?? 0) - (a[orden] ?? 0));
    }, [clientes, busqueda, orden]);

    useEffect(() => { setCurrentPage(1); }, [busqueda, orden]);

    const clientesPaginados = useMemo(
        () => clientesFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [clientesFiltrados, currentPage]
    );

    const maxCompras = Math.max(...clientes.map(c => c.total_compras || 0), 1);

    const GLASS_BG = `
        radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
    `;

    const glassCard = {
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(22px) saturate(150%)',
        WebkitBackdropFilter: 'blur(22px) saturate(150%)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.65)',
        boxShadow: '0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06), inset 0 1.5px 0 rgba(255,255,255,0.88)',
        position: 'relative',
        overflow: 'hidden',
    };

    const glassCardInner = {
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
    };

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .rc-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                    position: relative;
                }

                @keyframes dropdownIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                .rc-anim-1  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .rc-anim-2  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .rc-anim-3  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .rc-anim-4  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .rc-anim-5  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .rc-anim-6  { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

                .rc-glass-card {
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
                .rc-glass-card::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }

                .rc-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }

                .rc-table-row:hover { background: rgba(255,255,255,0.12); }
                .rc-table-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.3); }
                .rc-table-row:last-child { border-bottom: none; }

                .rc-search {
                    padding: 0.5rem 0.9rem 0.5rem 2.4rem;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.55);
                    border-radius: 12px;
                    font-size: 0.82rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none;
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    box-shadow: 0 2px 8px rgba(160,80,10,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
                    transition: all 0.18s;
                    width: 200px;
                }
                .rc-search::placeholder { color: rgba(180,100,30,0.38); }
                .rc-search:focus {
                    border-color: rgba(220,38,38,0.4);
                    box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
                    background: rgba(255,255,255,0.1);
                }

                .rc-badge-active   { background: rgba(16,185,129,0.1);  border: 1px solid rgba(16,185,129,0.25);  color: rgba(4,120,87,0.85);   padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
                .rc-badge-inactive { background: rgba(180,90,20,0.07);  border: 1px solid rgba(180,90,20,0.15);  color: rgba(150,80,20,0.6);   padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
                .rc-badge-debt     { background: rgba(220,38,38,0.08);  border: 1px solid rgba(220,38,38,0.2);   color: rgba(185,28,28,0.85);  padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
            `}</style>

            <div className="rc-bg">

                {/* ── Header ── */}
                <div className="rc-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/reportes"
                                  style={{
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
                                    Reporte de Clientes
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Análisis de comportamiento y valor de clientes · {clientes.length} registros
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>

                    {/* ── KPIs ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.1rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Total clientes',   value: kpis.total_clientes,    color: '#2d1a08',            accent: 'rgba(100,60,10,0.8)',    accentBg: 'rgba(100,60,10,0.07)',    anim: 'rc-anim-1' },
                            { label: 'Activos',          value: kpis.clientes_activos,  color: 'rgba(4,120,87,0.9)', accent: 'rgba(16,185,129,0.8)',   accentBg: 'rgba(16,185,129,0.07)',   anim: 'rc-anim-2' },
                            { label: 'Con deuda',        value: kpis.con_deuda,         color: 'rgba(185,28,28,0.9)',accent: 'rgba(220,38,38,0.8)',    accentBg: 'rgba(220,38,38,0.07)',    anim: 'rc-anim-3' },
                            { label: 'Total deuda',      value: fmt(kpis.total_deuda),  color: 'rgba(185,28,28,0.9)',accent: 'rgba(220,38,38,0.8)',    accentBg: 'rgba(220,38,38,0.07)',    anim: 'rc-anim-4' },
                            { label: 'Ingresos totales', value: fmt(kpis.ingreso_total),color: 'rgba(109,40,217,0.9)',accent: 'rgba(139,92,246,0.8)',  accentBg: 'rgba(139,92,246,0.07)',   anim: 'rc-anim-5' },
                            { label: 'Mejor cliente',    value: kpis.mejor_cliente,     color: 'rgba(219,39,119,0.9)',accent:'rgba(236,72,153,0.8)',   accentBg: 'rgba(236,72,153,0.07)',   anim: 'rc-anim-6', small: true },
                        ].map(({ label, value, color, accent, accentBg, anim, small }) => (
                            <div key={label} className={`rc-glass-card ${anim}`} style={{ padding: '1.4rem' }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '12px',
                                    background: accentBg, border: `1px solid ${accent.replace(/[\d.]+\)$/, '0.18)')}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.9rem',
                                }}>
                                    <svg width="18" height="18" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: small ? '1rem' : '1.6rem', fontWeight: '600', color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                                    {value}
                                </p>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.3rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Frecuencia + Top 5 ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '2rem' }}
                         className="rc-anim-1">

                        {/* Frecuencia de compra */}
                        <div className="rc-glass-card" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.3rem' }}>
                                Frecuencia de compra
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginBottom: '1.4rem' }}>
                                Distribución por número de pedidos
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {frecuencia.map(f => {
                                    const maxF = Math.max(...frecuencia.map(x => x.count), 1);
                                    const pct  = (f.count / maxF) * 100;
                                    return (
                                        <div key={f.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                                <span style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08' }}>{f.label}</span>
                                                <span style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.55)' }}>{f.count} clientes</span>
                                            </div>
                                            <div style={{ width: '100%', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '7px' }}>
                                                <div style={{
                                                    width: `${pct}%`, height: '7px', borderRadius: '99px',
                                                    background: 'linear-gradient(90deg, rgba(236,72,153,0.7), rgba(220,38,38,0.7))',
                                                    transition: 'width 0.4s ease',
                                                }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top 5 clientes */}
                        <div className="rc-glass-card" style={{ padding: '1.5rem' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.3rem' }}>
                                Top 5 mejores clientes
                            </h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginBottom: '1.4rem' }}>
                                Por total histórico comprado
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {clientes.slice(0, 5).map((c, i) => {
                                    const pct      = (c.total_compras / maxCompras) * 100;
                                    const iniciales = c.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                                    return (
                                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            {/* Posición */}
                                            <span style={{
                                                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.72rem', fontWeight: '700',
                                                background: i === 0 ? 'rgba(245,158,11,0.15)' : 'rgba(180,90,20,0.08)',
                                                color: i === 0 ? 'rgba(180,100,0,0.9)' : 'rgba(150,80,20,0.55)',
                                                border: i === 0 ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(180,90,20,0.12)',
                                            }}>
                                                {i + 1}
                                            </span>
                                            {/* Avatar iniciales */}
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                                                background: 'linear-gradient(135deg, rgba(236,72,153,0.7), rgba(220,38,38,0.7))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.72rem', fontWeight: '700', color: 'white',
                                            }}>
                                                {iniciales}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {c.nombre}
                                                    </p>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'rgba(185,28,28,0.85)', flexShrink: 0, marginLeft: '0.5rem' }}>
                                                        {fmt(c.total_compras)}
                                                    </p>
                                                </div>
                                                <div style={{ width: '100%', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '5px' }}>
                                                    <div style={{
                                                        width: `${pct}%`, height: '5px', borderRadius: '99px',
                                                        background: 'linear-gradient(90deg, rgba(236,72,153,0.65), rgba(220,38,38,0.65))',
                                                    }} />
                                                </div>
                                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.25rem' }}>
                                                    {c.num_compras} compra{c.num_compras !== 1 ? 's' : ''} · Última: {fmtDate(c.ultima_compra)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── Tabla completa ── */}
                    <div className="rc-glass-card rc-anim-2">
                        {/* Toolbar */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: '0.75rem',
                            padding: '1.25rem 1.5rem',
                            borderBottom: '1px solid rgba(255,255,255,0.38)',
                        }}>
                            <div>
                                <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>
                                    Todos los clientes
                                </h2>
                                {busqueda && (
                                    <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.2rem' }}>
                                        <span style={{ fontWeight: '600', color: '#2d1a08' }}>{clientesFiltrados.length}</span> de {clientes.length} clientes
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {/* Buscador */}
                                <div style={{ position: 'relative' }}>
                                    <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                         width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input type="text" placeholder="Buscar cliente..." value={busqueda}
                                           onChange={(e) => setBusqueda(e.target.value)}
                                           className="rc-search" />
                                    {busqueda && (
                                        <button onClick={() => setBusqueda('')}
                                                style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown ordenar — custom */}
                                <OrdenDropdown value={orden} onChange={setOrden} />
                            </div>
                        </div>

                        {/* Tabla */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['Cliente', 'Compras', 'Total comprado', 'Ticket promedio', 'Deuda activa', 'Última compra', 'Estado'].map(h => (
                                        <th key={h} style={{
                                            padding: '0.75rem 1.25rem', textAlign: 'left',
                                            fontSize: '0.67rem', fontWeight: '600',
                                            color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {clientesPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(150,80,20,0.4)', fontSize: '0.88rem' }}>
                                            Sin resultados para "{busqueda}"
                                        </td>
                                    </tr>
                                ) : (
                                    clientesPaginados.map((c) => {
                                        const iniciales = c.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                                        return (
                                            <tr key={c.id} className="rc-table-row">
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                                            background: 'linear-gradient(135deg, rgba(236,72,153,0.65), rgba(220,38,38,0.65))',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '0.72rem', fontWeight: '700', color: 'white',
                                                        }}>
                                                            {iniciales}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>{c.nombre}</p>
                                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', margin: '0.1rem 0 0' }}>{c.email || c.telefono || '—'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08' }}>
                                                    {c.num_compras}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(185,28,28,0.85)' }}>
                                                    {fmt(c.total_compras)}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.85rem', color: 'rgba(120,60,10,0.7)' }}>
                                                    {fmt(c.ticket_promedio)}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    {c.saldo_total > 0
                                                        ? <span className="rc-badge-debt">{fmt(c.saldo_total)}</span>
                                                        : <span style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.3)' }}>Sin deuda</span>}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)' }}>
                                                    {fmtDate(c.ultima_compra)}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <span className={c.activo ? 'rc-badge-active' : 'rc-badge-inactive'}>
                                                        {c.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Paginador
                            pagina={currentPage}
                            total={clientesFiltrados.length}
                            porPagina={PER_PAGE}
                            onChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
