// resources/js/Pages/Reportes/Rentabilidad.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import GlassDateInput from '@/Components/GlassDateInput';

const fmt    = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);
const fmtPct = (v) => `${Number(v ?? 0).toFixed(1)}%`;

function MargenBadge({ margen }) {
    if (margen >= 40) return <span style={{ fontSize:'0.72rem', fontWeight:'600', padding:'0.2rem 0.6rem', borderRadius:'20px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'rgba(4,120,87,0.85)' }}>{fmtPct(margen)}</span>;
    if (margen >= 20) return <span style={{ fontSize:'0.72rem', fontWeight:'600', padding:'0.2rem 0.6rem', borderRadius:'20px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', color:'rgba(146,64,14,0.9)' }}>{fmtPct(margen)}</span>;
    return               <span style={{ fontSize:'0.72rem', fontWeight:'600', padding:'0.2rem 0.6rem', borderRadius:'20px', background:'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.2)', color:'rgba(185,28,28,0.85)' }}>{fmtPct(margen)}</span>;
}

export default function Rentabilidad({ productos = [], porCategoria = [], kpis = {}, filtros = {} }) {
    const [desde, setDesde]   = useState(filtros.desde ?? '');
    const [hasta, setHasta]   = useState(filtros.hasta ?? '');
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden]   = useState('ganancia_bruta');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    const aplicar = () => { setCurrentPage(1); router.get('/reportes/rentabilidad', { desde, hasta }, { preserveState: true }); };

    const productosFiltrados = useMemo(() => {
        const q = busqueda.toLowerCase();
        return productos
            .filter(p => !q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
            .sort((a, b) => (b[orden] ?? 0) - (a[orden] ?? 0));
    }, [productos, busqueda, orden]);

    useEffect(() => setCurrentPage(1), [busqueda, orden]);

    const productosPaginados = useMemo(
        () => productosFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [productosFiltrados, currentPage]
    );

    const maxGanancia = Math.max(...porCategoria.map(c => c.ganancia || 0), 1);

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
                .ren-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; overflow-x:hidden; }
                @keyframes staggerUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .ren-a1{animation:staggerUp .55s cubic-bezier(.16,1,.3,1) .05s both}
                .ren-a2{animation:staggerUp .55s cubic-bezier(.16,1,.3,1) .12s both}
                .ren-a3{animation:staggerUp .55s cubic-bezier(.16,1,.3,1) .19s both}
                .ren-a4{animation:staggerUp .55s cubic-bezier(.16,1,.3,1) .26s both}
                .ren-a5{animation:staggerUp .55s cubic-bezier(.16,1,.3,1) .33s both}

                .ren-glass {
                    background:rgba(255,255,255,0.04);
                    backdrop-filter:blur(22px) saturate(150%); -webkit-backdrop-filter:blur(22px) saturate(150%);
                    border-radius:24px; border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 16px 48px rgba(180,90,20,0.1),0 4px 14px rgba(180,90,20,0.06),inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position:relative;
                }
                .ren-glass::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.95) 70%,transparent);
                    pointer-events:none; z-index:1;
                }
                .ren-header {
                    background:rgba(255,255,255,0.08);
                    backdrop-filter:blur(40px) saturate(180%); -webkit-backdrop-filter:blur(40px) saturate(180%);
                    border-bottom:1px solid rgba(255,255,255,0.68);
                    box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85);
                    position:relative; z-index:2;
                }
                .ren-table-row { transition:background .15s; border-bottom:1px solid rgba(255,255,255,0.3); }
                .ren-table-row:hover { background:rgba(255,255,255,0.12); }
                .ren-table-row:last-child { border-bottom:none; }

                /* Select glass */
                .ren-select {
                    padding:0.6rem 2rem 0.6rem 0.9rem;
                    background:rgba(255,255,255,0.55); border:1px solid rgba(200,140,80,0.22);
                    border-radius:12px; font-size:0.82rem; color:#2d1a08;
                    font-family:'Inter',sans-serif; outline:none;
                    box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.75);
                    cursor:pointer; appearance:none; -webkit-appearance:none;
                    transition:all .18s;
                }
                .ren-select:focus { border-color:rgba(185,28,28,0.35); background:rgba(255,255,255,0.75); }
                .ren-select option { background:#fdf6f0; color:#2d1a08; }

                /* Input texto glass */
                .ren-search {
                    padding:0.6rem 0.9rem;
                    background:rgba(255,255,255,0.55); border:1px solid rgba(200,140,80,0.22);
                    border-radius:12px; font-size:0.82rem; color:#2d1a08;
                    font-family:'Inter',sans-serif; outline:none;
                    box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.75);
                    transition:all .18s; width:100%; box-sizing:border-box;
                }
                .ren-search:focus { border-color:rgba(185,28,28,0.35); background:rgba(255,255,255,0.75); }
                .ren-search::placeholder { color:rgba(180,100,30,0.38); }

                /* Botón aplicar */
                .ren-btn-apply {
                    padding:0.6rem 1.4rem;
                    background:rgba(185,28,28,0.08); border:1px solid rgba(185,28,28,0.28);
                    border-radius:12px; font-size:0.82rem; font-weight:600;
                    color:rgba(185,28,28,0.9); cursor:pointer;
                    font-family:'Inter',sans-serif; transition:all .18s; white-space:nowrap;
                }
                .ren-btn-apply:hover { background:rgba(185,28,28,0.14); transform:translateY(-1px); }

                /* Filtro fechas responsive */
                .ren-fil-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; align-items:flex-end; }
                .ren-btn-wrap { grid-column:1 / -1; display:flex; justify-content:flex-end; }

                /* Grids */
                .ren-kpi-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:1.1rem; }
                @media(max-width:1000px){ .ren-kpi-grid { grid-template-columns:repeat(3,1fr); } }
                @media(max-width:640px) { .ren-kpi-grid { grid-template-columns:1fr 1fr; gap:0.75rem; } }
                @media(max-width:400px) { .ren-fil-grid { grid-template-columns:1fr; } .ren-btn-wrap { justify-content:stretch; } .ren-btn-apply { width:100%; box-sizing:border-box; } }

                input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity:0; width:100%; height:100%; position:absolute; top:0; left:0; cursor:pointer;
                }
            `}</style>

            <div className="ren-bg">

                <div className="ren-header">
                    <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'1.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                            <Link href="/reportes" style={{ width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.65)', borderRadius:'10px', color:'rgba(150,80,20,0.6)', textDecoration:'none', transition:'all .18s' }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize:'clamp(1.2rem,4vw,1.65rem)', fontWeight:'300', color:'#2d1a08', letterSpacing:'-0.03em', lineHeight:1 }}>Reporte de Rentabilidad</h1>
                                <p style={{ marginTop:'0.3rem', fontSize:'0.85rem', color:'rgba(150,80,20,0.6)' }}>Análisis de ganancias por producto y categoría</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'1.5rem 1rem 3rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                    {/* ── Filtro fechas ── */}
                    <div className="ren-glass ren-a1" style={{ padding:'1.25rem', overflow:'visible' }}>
                        <p style={{ fontSize:'0.75rem', fontWeight:'600', color:'rgba(150,80,20,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem' }}>
                            Filtrar período
                        </p>
                        <div className="ren-fil-grid">
                            <GlassDateInput label="Desde" value={desde} onChange={val => setDesde(val)} />
                            <GlassDateInput label="Hasta" value={hasta} onChange={val => setHasta(val)} />
                            <div className="ren-btn-wrap">
                                <button onClick={aplicar} className="ren-btn-apply">Aplicar</button>
                            </div>
                        </div>
                    </div>

                    {/* ── KPIs ── */}
                    <div className="ren-kpi-grid ren-a2">
                        {[
                            { label:'Ingreso total',      value:fmt(kpis.ingreso_total),      accent:'rgba(59,130,246,0.9)',  accentBg:'rgba(59,130,246,0.07)',  accentBorder:'rgba(59,130,246,0.2)'  },
                            { label:'Costo total',        value:fmt(kpis.costo_total),        accent:'rgba(120,60,10,0.8)',  accentBg:'rgba(120,60,10,0.07)',  accentBorder:'rgba(120,60,10,0.18)'  },
                            { label:'Ganancia bruta',     value:fmt(kpis.ganancia_total),     accent:'rgba(16,185,129,0.9)', accentBg:'rgba(16,185,129,0.07)', accentBorder:'rgba(16,185,129,0.2)' },
                            { label:'Margen promedio',    value:fmtPct(kpis.margen_promedio), accent:'rgba(139,92,246,0.9)', accentBg:'rgba(139,92,246,0.07)', accentBorder:'rgba(139,92,246,0.2)' },
                            { label:'Productos vendidos', value:kpis.productos_count ?? 0,    accent:'rgba(120,60,10,0.8)',  accentBg:'rgba(120,60,10,0.07)',  accentBorder:'rgba(120,60,10,0.18)'  },
                        ].map(({ label, value, accent, accentBg, accentBorder }) => (
                            <div key={label} className="ren-glass" style={{ padding:'1.35rem' }}>
                                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:accentBg, border:`1px solid ${accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.85rem' }}>
                                    <svg width="16" height="16" fill="none" stroke={accent} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <p style={{ fontSize:'1.45rem', fontWeight:'600', color:accent, letterSpacing:'-0.02em', lineHeight:1 }}>{value}</p>
                                <p style={{ fontSize:'0.8rem', fontWeight:'500', color:'#2d1a08', marginTop:'0.25rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Por categoría ── */}
                    <div className="ren-glass ren-a3" style={{ padding:'1.5rem' }}>
                        <h2 style={{ fontSize:'0.95rem', fontWeight:'600', color:'#2d1a08', margin:0 }}>Rentabilidad por categoría</h2>
                        <p style={{ fontSize:'0.76rem', color:'rgba(150,80,20,0.55)', marginTop:'0.25rem', marginBottom:'1.5rem' }}>Ganancia bruta acumulada por línea de producto</p>
                        <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
                            {porCategoria.map(cat => {
                                const pct = maxGanancia > 0 ? (cat.ganancia / maxGanancia) * 100 : 0;
                                return (
                                    <div key={cat.categoria}>
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem', flexWrap:'wrap', gap:'0.5rem' }}>
                                            <div>
                                                <span style={{ fontSize:'0.87rem', fontWeight:'600', color:'#2d1a08' }}>{cat.categoria}</span>
                                                <span style={{ marginLeft:'0.6rem', fontSize:'0.75rem', color:'rgba(150,80,20,0.5)' }}>{cat.unidades} uds · margen {fmtPct(cat.margen_promedio)}</span>
                                            </div>
                                            <span style={{ fontSize:'0.9rem', fontWeight:'700', color:'rgba(16,185,129,0.85)' }}>{fmt(cat.ganancia)}</span>
                                        </div>
                                        <div style={{ width:'100%', background:'rgba(180,90,20,0.1)', borderRadius:'99px', height:'7px' }}>
                                            <div style={{ width:`${pct}%`, height:'7px', borderRadius:'99px', background:'linear-gradient(90deg,rgba(16,185,129,0.7),rgba(4,120,87,0.55))', transition:'width 0.4s ease' }} />
                                        </div>
                                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'0.25rem' }}>
                                            <span style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.5)' }}>Ingresos: {fmt(cat.ingresos)}</span>
                                            <span style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.5)' }}>Costos: {fmt(cat.costos)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {porCategoria.length === 0 && <p style={{ textAlign:'center', fontSize:'0.85rem', color:'rgba(150,80,20,0.4)', padding:'1.5rem 0' }}>Sin datos para el período</p>}
                        </div>
                    </div>

                    {/* ── Tabla de productos ── */}
                    <div className="ren-glass ren-a4" style={{ overflow:'hidden' }}>
                        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.38)', display:'flex', flexWrap:'wrap', gap:'0.75rem', alignItems:'center', justifyContent:'space-between' }}>
                            <h2 style={{ fontSize:'0.95rem', fontWeight:'600', color:'#2d1a08', margin:0 }}>
                                Detalle por producto
                                <span style={{ marginLeft:'0.5rem', fontSize:'0.82rem', fontWeight:'400', color:'rgba(150,80,20,0.5)' }}>({productosFiltrados.length})</span>
                            </h2>
                            <div style={{ display:'flex', gap:'0.65rem', flexWrap:'wrap' }}>
                                <input type="text" placeholder="Buscar producto..." value={busqueda}
                                       onChange={e => setBusqueda(e.target.value)}
                                       className="ren-search" style={{ width:'160px' }} />
                                <div style={{ position:'relative' }}>
                                    <select value={orden} onChange={e => setOrden(e.target.value)} className="ren-select">
                                        <option value="ganancia_bruta">Ordenar: Ganancia</option>
                                        <option value="ingreso_total">Ordenar: Ingresos</option>
                                        <option value="margen">Ordenar: Margen %</option>
                                        <option value="unidades_vendidas">Ordenar: Unidades</option>
                                    </select>
                                    <svg style={{ position:'absolute', right:'0.6rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'rgba(150,80,20,0.45)' }}
                                         width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                                <thead>
                                <tr style={{ borderBottom:'1px solid rgba(180,90,20,0.12)' }}>
                                    {['Producto','Categoría','P. Compra','P. Venta','Uds','Ingresos','Costos','Ganancia','Margen'].map(h => (
                                        <th key={h} style={{ padding:'0.7rem 1.1rem', textAlign:'left', fontSize:'0.67rem', fontWeight:'600', color:'rgba(150,80,20,0.5)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {productosPaginados.map((p, i) => (
                                    <tr key={p.id ?? i} className="ren-table-row">
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.87rem', fontWeight:'600', color:'#2d1a08', maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.nombre}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.78rem', color:'rgba(120,60,10,0.65)' }}>{p.categoria}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.82rem', color:'rgba(59,130,246,0.8)' }}>{p.precio_compra > 0 ? fmt(p.precio_compra) : <span style={{ color:'rgba(180,90,20,0.25)' }}>—</span>}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.85rem', color:'#2d1a08' }}>{fmt(p.precio_venta)}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.87rem', fontWeight:'700', color:'#2d1a08' }}>{p.unidades_vendidas}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.87rem', fontWeight:'700', color:'rgba(59,130,246,0.85)' }}>{fmt(p.ingreso_total)}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.82rem', color:'rgba(120,60,10,0.65)' }}>{p.precio_compra > 0 ? fmt(p.costo_total) : <span style={{ color:'rgba(180,90,20,0.25)' }}>—</span>}</td>
                                        <td style={{ padding:'0.85rem 1.1rem', fontSize:'0.87rem', fontWeight:'700', color:'rgba(16,185,129,0.85)' }}>{p.precio_compra > 0 ? fmt(p.ganancia_bruta) : <span style={{ color:'rgba(180,90,20,0.25)' }}>—</span>}</td>
                                        <td style={{ padding:'0.85rem 1.1rem' }}>{p.precio_compra > 0 ? <MargenBadge margen={p.margen} /> : <span style={{ fontSize:'0.72rem', color:'rgba(180,90,20,0.35)' }}>Sin costo</span>}</td>
                                    </tr>
                                ))}
                                {productosFiltrados.length === 0 && (
                                    <tr><td colSpan="9" style={{ padding:'3rem', textAlign:'center', fontSize:'0.87rem', color:'rgba(150,80,20,0.4)' }}>Sin datos para el período o búsqueda</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding:'1rem 1.5rem' }}>
                            <Pagination currentPage={currentPage} totalItems={productosFiltrados.length} perPage={PER_PAGE} onPageChange={setCurrentPage} accentColor="green" />
                        </div>
                    </div>

                    {/* ── Aviso precio compra ── */}
                    {productos.some(p => !p.precio_compra || p.precio_compra === 0) && (
                        <div className="ren-glass ren-a5" style={{ padding:'1.25rem 1.5rem', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.25)' }}>
                            <div style={{ display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
                                <svg style={{ flexShrink:0, marginTop:'1px' }} width="18" height="18" fill="none" stroke="rgba(146,64,14,0.8)" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p style={{ fontSize:'0.87rem', fontWeight:'600', color:'rgba(146,64,14,0.9)', margin:0 }}>Algunos productos no tienen precio de compra</p>
                                    <p style={{ fontSize:'0.78rem', color:'rgba(146,64,14,0.7)', marginTop:'0.3rem' }}>Los productos sin precio de compra muestran "—" en costos y ganancia. Edítalos en el módulo de Productos para ver datos completos.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
