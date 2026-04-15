import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 15% 85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .kx-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .kx-hdr {
        background:rgba(255,255,255,0.08); backdrop-filter:blur(40px) saturate(180%);
        -webkit-backdrop-filter:blur(40px) saturate(180%);
        border-bottom:1px solid rgba(255,255,255,0.68);
        box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85);
        position:relative; z-index:2;
    }
    .kx-glass {
        background:rgba(255,255,255,0.04); backdrop-filter:blur(22px) saturate(150%);
        -webkit-backdrop-filter:blur(22px) saturate(150%);
        border:1px solid rgba(255,255,255,0.65); border-radius:24px;
        box-shadow:0 16px 48px rgba(180,90,20,0.1),0 4px 14px rgba(180,90,20,0.06),
            inset 0 1.5px 0 rgba(255,255,255,0.88);
        position:relative; overflow:hidden;
    }
    .kx-glass::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.95) 70%,transparent);
        pointer-events:none; z-index:1;
    }
    .kx-tr { border-bottom:1px solid rgba(255,255,255,0.3); transition:background 0.13s; }
    .kx-tr:hover { background:rgba(255,255,255,0.14); }
    .kx-tr:last-child { border-bottom:none; }
    @keyframes kxUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
    }
    .kx-a1 { animation:kxUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
    .kx-a2 { animation:kxUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.11s both; }
    .kx-a3 { animation:kxUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both; }

    .kx-head-row{ display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .kx-content-wrap{ max-width:1280px; margin:0 auto; padding:2rem 1.5rem; display:flex; flex-direction:column; gap:1.5rem; }
    .kx-kpi-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:1rem; }
    .kx-table-scroll{ overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .kx-table{ width:100%; min-width:980px; border-collapse:collapse; }
    .kx-pagination{ display:flex; align-items:center; justify-content:center; gap:0.4rem; padding:1.25rem 1.5rem; flex-wrap:wrap; }
    .kx-page-btn{ padding:0.35rem 0.75rem; border-radius:9px; font-size:0.8rem; font-weight:500; cursor:pointer; border:1px solid rgba(200,140,80,0.3); background:rgba(255,255,255,0.06); color:rgba(120,60,10,0.75); font-family:Inter,sans-serif; transition:all 0.13s; }
    .kx-page-btn:hover:not(.active):not(.disabled){ background:rgba(180,90,20,0.09); }
    .kx-page-btn.active{ background:rgba(180,90,20,0.13); border-color:rgba(180,90,20,0.4); color:rgba(120,60,10,0.9); font-weight:600; }
    .kx-page-btn.disabled{ opacity:0.38; cursor:default; pointer-events:none; }

    @media (max-width: 900px){
        .kx-content-wrap{ padding:1.5rem 1rem; gap:1rem; }
    }
    @media (max-width: 768px){
        .kx-hdr h1{ font-size:1.25rem !important; }
        .kx-kpi-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
    }
    @media (max-width: 560px){
        .kx-kpi-grid{ grid-template-columns:1fr; }
        .kx-glass{ border-radius:16px; }
    }
`;

const TIPO_BADGE = {
    venta:          { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)',   color: 'rgba(185,28,28,0.9)'  },
    anulacion:      { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  color: 'rgba(4,120,87,0.9)'   },
    ajuste_entrada: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  color: 'rgba(4,120,87,0.9)'   },
    ajuste_salida:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.28)',  color: 'rgba(146,64,14,0.9)'  },
    inicial:        { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  color: 'rgba(30,64,175,0.9)'  },
    default:        { bg: 'rgba(180,90,20,0.07)',   border: 'rgba(180,90,20,0.2)',    color: 'rgba(120,60,10,0.75)' },
};

const tipoBadge = (tipo) => TIPO_BADGE[tipo] ?? TIPO_BADGE.default;

export default function Kardex({ producto, movimientos, totales }) {
    const [modalObs, setModalObs] = useState(null);

    // movimientos es un paginador de Laravel (formato plano):
    // { data, total, last_page, current_page, links (array), prev_page_url, next_page_url }
    const lista      = movimientos.data ?? [];
    const totalItems = movimientos.total ?? 0;
    const lastPage   = movimientos.last_page ?? 1;
    const pageLinks  = movimientos.links ?? [];   // array de {url, label, active}
    const prevUrl    = movimientos.prev_page_url ?? null;
    const nextUrl    = movimientos.next_page_url ?? null;

    const goToPage = (url) => { if (url) router.get(url, {}, { preserveScroll: true }); };

    const stockColor = (s) =>
        s === 0 ? 'rgba(185,28,28,0.85)' : s <= 5 ? 'rgba(146,64,14,0.85)' : 'rgba(4,120,87,0.85)';

    const RESUMEN = [
        { label: 'Total movimientos',  value: totales.total,           accent: 'rgba(180,90,20,0.8)',  bg: 'rgba(180,90,20,0.07)'  },
        { label: 'Ventas registradas', value: totales.ventas,          accent: 'rgba(220,38,38,0.8)',  bg: 'rgba(220,38,38,0.07)'  },
        { label: 'Ajustes entrada',    value: totales.ajustes_entrada, accent: 'rgba(16,185,129,0.8)', bg: 'rgba(16,185,129,0.07)' },
        { label: 'Ajustes salida',     value: totales.ajustes_salida,  accent: 'rgba(245,158,11,0.8)', bg: 'rgba(245,158,11,0.07)' },
    ];

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="kx-bg">

                {/* ── Header ── */}
                <div className="kx-hdr">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div className="kx-head-row">
                            <Link href="/inventario" style={{
                                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)',
                                borderRadius: '10px', color: 'rgba(150,80,20,0.6)', textDecoration: 'none', flexShrink: 0,
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h1 style={{ fontSize: '1.55rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    Kardex — <span style={{ fontWeight: '500' }}>{producto.nombre}</span>
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.83rem', color: 'rgba(150,80,20,0.6)' }}>
                                    {producto.categoria} · Historial de movimientos de inventario
                                </p>
                            </div>

                            {/* Stock actual en header */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ fontSize: '0.67rem', fontWeight: '600', letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(150,80,20,0.5)' }}>
                                    Stock actual
                                </p>
                                <p style={{ fontSize: '2.2rem', fontWeight: '700', color: stockColor(producto.stock_total ?? producto.stock), letterSpacing: '-0.04em', lineHeight: 1 }}>
                                    {producto.stock_total ?? producto.stock}
                                </p>
                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)' }}>unidades</p>
                                {producto.maneja_tallas && producto.tallas?.length > 0 && (
                                    <div style={{ marginTop: '0.75rem', textAlign: 'left' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: '600', color: 'rgba(150,80,20,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                                            Stock por talla
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                            {producto.tallas.map(t => (
                                                <div key={t.talla} style={{
                                                    padding: '0.25rem 0.6rem', borderRadius: '7px', fontSize: '0.75rem', fontWeight: '600',
                                                    background: t.stock > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.06)',
                                                    border: `1px solid ${t.stock > 0 ? 'rgba(16,185,129,0.22)' : 'rgba(220,38,38,0.18)'}`,
                                                    color: t.stock > 0 ? 'rgba(4,120,87,0.85)' : 'rgba(185,28,28,0.7)',
                                                }}>
                                                    {t.talla}: {t.stock}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="kx-content-wrap">
                    {/* ── Resumen KPIs ── */}
                    <div className="kx-kpi-grid kx-a1">
                        {RESUMEN.map(({ label, value, accent, bg }) => (
                            <div key={label} className="kx-glass" style={{ padding: '1.3rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '11px', marginBottom: '0.85rem',
                                    background: bg, border: `1px solid ${accent.replace(/[\d.]+\)$/, '0.2)')}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="16" height="16" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.7rem', fontWeight: '600', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.77rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.3rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Tabla movimientos ── */}
                    <div className="kx-glass kx-a2" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '0.97rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Historial de movimientos</h2>
                            <span style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.55)' }}>{totalItems} registro{totalItems !== 1 ? 's' : ''}</span>
                        </div>

                        {totalItems === 0 ? (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '16px', margin: '0 auto 1rem',
                                    background: 'rgba(180,90,20,0.07)', border: '1px solid rgba(180,90,20,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="22" height="22" fill="none" stroke="rgba(150,80,20,0.45)" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(150,80,20,0.6)' }}>No hay movimientos registrados para este producto</p>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.4)', marginTop: '0.3rem' }}>Los movimientos se registran al vender, anular o ajustar el inventario</p>
                            </div>
                        ) : (
                            <>
                            <div className="kx-table-scroll">
                                <table className="kx-table">
                                    <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                        {['Fecha', 'Tipo', 'Motivo', 'Cantidad', 'Stock anterior', 'Stock nuevo', 'Usuario'].map((h) => (
                                            <th key={h} style={{
                                                padding: '0.85rem 1.25rem',
                                                textAlign: ['Cantidad', 'Stock anterior', 'Stock nuevo'].includes(h) ? 'center' : 'left',
                                                fontSize: '0.67rem', fontWeight: '600',
                                                color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {lista.map(m => {
                                        const badge = tipoBadge(m.tipo);
                                        const cantPositivo = m.es_entrada;
                                        return (
                                            <tr key={m.id} className="kx-tr">
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'rgba(120,60,10,0.65)', whiteSpace: 'nowrap' }}>
                                                    {m.created_at}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <span style={{
                                                        fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem',
                                                        borderRadius: '20px', background: badge.bg,
                                                        border: `1px solid ${badge.border}`, color: badge.color,
                                                    }}>
                                                        {m.tipo_label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '0.85rem', color: 'rgba(80,40,8,0.78)' }}>{m.motivo ?? '—'}</span>
                                                        {m.observaciones && (
                                                            <button type="button" onClick={() => setModalObs(m)}
                                                                    style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                                        padding: '0.15rem 0.55rem', fontSize: '0.7rem', fontWeight: '600',
                                                                        background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.22)',
                                                                        color: 'rgba(30,64,175,0.85)', borderRadius: '20px', cursor: 'pointer',
                                                                        fontFamily: 'Inter,sans-serif', transition: 'background 0.13s',
                                                                    }}>
                                                                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Ver nota
                                                            </button>
                                                        )}
                                                    </div>
                                                    {m.referencia_tipo && m.referencia_id && (
                                                        <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.4)', marginTop: '0.2rem' }}>
                                                            Ref: {m.referencia_tipo} #{m.referencia_id}
                                                        </p>
                                                    )}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700', color: cantPositivo ? 'rgba(4,120,87,0.85)' : 'rgba(185,28,28,0.85)' }}>
                                                    {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center', fontSize: '0.87rem', color: 'rgba(120,60,10,0.65)' }}>
                                                    {m.stock_anterior}
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', textAlign: 'center' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: stockColor(m.stock_nuevo) }}>
                                                        {m.stock_nuevo}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.82rem', color: 'rgba(120,60,10,0.6)' }}>
                                                    {m.usuario}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* ── Paginación ── */}
                            {lastPage > 1 && (
                                <div className="kx-pagination">
                                    <button
                                        className={`kx-page-btn${!prevUrl ? ' disabled' : ''}`}
                                        onClick={() => goToPage(prevUrl)}
                                    >← Ant</button>

                                    {pageLinks.slice(1, -1).map((link, i) => (
                                        <button
                                            key={i}
                                            className={`kx-page-btn${link.active ? ' active' : ''}${!link.url ? ' disabled' : ''}`}
                                            onClick={() => goToPage(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}

                                    <button
                                        className={`kx-page-btn${!nextUrl ? ' disabled' : ''}`}
                                        onClick={() => goToPage(nextUrl)}
                                    >Sig →</button>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modal observaciones ── */}
            {modalObs && (
                <div onClick={() => setModalObs(null)}
                     style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(20,10,2,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div onClick={e => e.stopPropagation()}
                         style={{
                             background: 'rgba(255,248,240,0.98)', backdropFilter: 'blur(32px)',
                             border: '1px solid rgba(255,255,255,0.72)', borderRadius: '24px',
                             boxShadow: '0 32px 80px rgba(180,90,20,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
                             width: '100%', maxWidth: '420px', padding: '1.75rem',
                             fontFamily: 'Inter,-apple-system,sans-serif',
                         }}>
                        {/* Cabecera modal */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Observaciones del ajuste</h3>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.25rem' }}>
                                    {modalObs.created_at} · {modalObs.usuario}
                                </p>
                            </div>
                            <button onClick={() => setModalObs(null)}
                                    style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(180,90,20,0.07)', border: '1px solid rgba(200,140,80,0.25)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(150,80,20,0.6)', flexShrink: 0 }}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tipo + motivo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {(() => { const b = tipoBadge(modalObs.tipo); return (
                                <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem', borderRadius: '20px', background: b.bg, border: `1px solid ${b.border}`, color: b.color }}>
                                    {modalObs.tipo_label}
                                </span>
                            ); })()}
                            {modalObs.motivo && (
                                <span style={{ fontSize: '0.87rem', fontWeight: '600', color: 'rgba(80,40,8,0.8)' }}>{modalObs.motivo}</span>
                            )}
                        </div>

                        {/* Nota */}
                        <div style={{
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.3)',
                            borderRadius: '16px', padding: '1rem 1.1rem', minHeight: '80px',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                        }}>
                            <p style={{ fontSize: '0.87rem', color: 'rgba(80,40,8,0.82)', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }}>
                                {modalObs.observaciones}
                            </p>
                        </div>

                        <button onClick={() => setModalObs(null)}
                                style={{
                                    marginTop: '1rem', width: '100%', padding: '0.7rem',
                                    background: 'rgba(180,90,20,0.07)', border: '1px solid rgba(200,140,80,0.3)',
                                    borderRadius: '14px', fontSize: '0.87rem', fontWeight: '500',
                                    color: 'rgba(120,60,10,0.8)', cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                                    transition: 'all 0.15s',
                                }}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
