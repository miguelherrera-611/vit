import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 15% 85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .inv-bg  { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .inv-hdr {
        background:rgba(255,255,255,0.08); backdrop-filter:blur(40px) saturate(180%);
        -webkit-backdrop-filter:blur(40px) saturate(180%);
        border-bottom:1px solid rgba(255,255,255,0.68);
        box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85);
        position:relative; z-index:2;
    }
    .inv-glass {
        background:rgba(255,255,255,0.04); backdrop-filter:blur(22px) saturate(150%);
        -webkit-backdrop-filter:blur(22px) saturate(150%);
        border:1px solid rgba(255,255,255,0.65); border-radius:24px;
        box-shadow:0 16px 48px rgba(180,90,20,0.1),0 4px 14px rgba(180,90,20,0.06),
            inset 0 1.5px 0 rgba(255,255,255,0.88);
        position:relative; overflow:hidden;
    }
    .inv-glass::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.95) 70%,transparent);
        pointer-events:none; z-index:1;
    }
    .inv-search {
        width:100%; padding:0.72rem 1rem 0.72rem 2.8rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.88rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        transition:all 0.2s; backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); box-sizing:border-box;
    }
    .inv-search::placeholder { color:rgba(180,100,30,0.38); }
    .inv-search:focus { border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.8); }
    .inv-btn-primary {
        display:inline-flex; align-items:center; gap:0.45rem;
        padding:0.65rem 1.3rem;
        background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.4); border-radius:14px;
        font-size:0.85rem; font-weight:600; color:rgba(185,28,28,0.95);
        text-decoration:none; transition:all 0.18s; white-space:nowrap;
        box-shadow:0 3px 12px rgba(220,38,38,0.08),inset 0 1px 0 rgba(255,120,120,0.2);
        font-family:'Inter',sans-serif;
    }
    .inv-btn-primary:hover { background:rgba(220,38,38,0.16); transform:translateY(-1px); }
    .inv-tr { border-bottom:1px solid rgba(255,255,255,0.3); transition:background 0.13s; }
    .inv-tr:hover { background:rgba(255,255,255,0.14); }
    .inv-tr:last-child { border-bottom:none; }
    @keyframes invUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
    }
    .inv-a1 { animation:invUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
    .inv-a2 { animation:invUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.11s both; }
    .inv-a3 { animation:invUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.17s both; }
    .inv-a4 { animation:invUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.23s both; }
`;

export default function InventarioIndex({ productos = [] }) {
    const [searchTerm,       setSearchTerm]       = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage,      setCurrentPage]      = useState(1);

    const stats = useMemo(() => {
        const activos = productos.filter(p => p.activo);
        return {
            total:     activos.length,
            enStock:   activos.filter(p => p.stock > p.stock_minimo).length,
            bajoStock: productos.filter(p => p.stock <= p.stock_minimo && p.stock > 0).length,
            agotados:  productos.filter(p => p.stock === 0).length,
        };
    }, [productos]);

    const categorias = useMemo(() => [...new Set(productos.map(p => p.categoria))].sort(), [productos]);

    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            const q = searchTerm.toLowerCase();
            return (
                (!q || p.nombre.toLowerCase().includes(q) || (p.codigo_barras || '').toLowerCase().includes(q)) &&
                (!selectedCategory || p.categoria === selectedCategory)
            );
        });
    }, [productos, searchTerm, selectedCategory]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

    const productosPaginados = useMemo(
        () => productosFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [productosFiltrados, currentPage]
    );

    const STAT_CARDS = [
        { label: 'Productos totales', value: stats.total,     accent: 'rgba(180,90,20,0.8)',  bg: 'rgba(180,90,20,0.07)',  path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { label: 'En stock',          value: stats.enStock,   accent: 'rgba(16,185,129,0.8)', bg: 'rgba(16,185,129,0.07)', path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Stock bajo',        value: stats.bajoStock, accent: 'rgba(245,158,11,0.8)', bg: 'rgba(245,158,11,0.07)', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
        { label: 'Agotados',          value: stats.agotados,  accent: 'rgba(220,38,38,0.8)',  bg: 'rgba(220,38,38,0.07)',  path: 'M6 18L18 6M6 6l12 12' },
    ];

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="inv-bg">

                {/* ── Header ── */}
                <div className="inv-hdr">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    Control de Inventario
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Monitorea y ajusta el stock de tus productos
                                </p>
                            </div>
                            <Link href="/inventario/ajustar" className="inv-btn-primary">
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Ajustar Stock
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ── KPI Cards ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }} className="inv-a1">
                        {STAT_CARDS.map(({ label, value, accent, bg, path }) => (
                            <div key={label} className="inv-glass" style={{ padding: '1.4rem' }}>
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '12px',
                                    background: bg, border: `1px solid ${accent.replace(/[\d.]+\)$/, '0.2)')}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem',
                                }}>
                                    <svg width="18" height="18" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={path} />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.7rem', fontWeight: '600', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.3rem' }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Filtros ── */}
                    <div className="inv-glass inv-a2" style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                            {/* Buscador */}
                            <div style={{ flex: '2 1 220px', position: 'relative' }}>
                                <svg style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                     width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder="Buscar productos en inventario..."
                                       value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                       className="inv-search" />
                            </div>

                            {/* Select categoría */}
                            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                                    style={{
                                        flex: '1 1 180px', padding: '0.72rem 1rem',
                                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.4)',
                                        borderRadius: '14px', fontSize: '0.88rem', color: '#2d1a08',
                                        fontFamily: 'Inter,sans-serif', outline: 'none', cursor: 'pointer',
                                        backdropFilter: 'blur(10px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                                    }}>
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>

                            {/* Limpiar */}
                            {(searchTerm || selectedCategory) && (
                                <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                                        style={{
                                            padding: '0.65rem 1rem', background: 'rgba(255,255,255,0.06)',
                                            border: '1px solid rgba(200,140,80,0.3)', borderRadius: '14px',
                                            fontSize: '0.82rem', color: 'rgba(150,80,20,0.7)', cursor: 'pointer',
                                            fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                                        }}>
                                    Limpiar
                                </button>
                            )}
                        </div>
                        {(searchTerm || selectedCategory) && (
                            <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'rgba(150,80,20,0.55)' }}>
                                <span style={{ fontWeight: '600', color: '#2d1a08' }}>{productosFiltrados.length}</span> producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* ── Tabla ── */}
                    {productosFiltrados.length > 0 ? (
                        <div className="inv-glass inv-a3" style={{ overflow: 'hidden' }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                        {['Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Estado', ''].map(h => (
                                            <th key={h} style={{
                                                padding: '0.85rem 1.25rem', textAlign: h === '' ? 'right' : 'left',
                                                fontSize: '0.67rem', fontWeight: '600',
                                                color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productosPaginados.map((p) => {
                                        const stockOk  = p.stock > p.stock_minimo;
                                        const agotado  = p.stock === 0;
                                        const badge = agotado
                                            ? { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', color: 'rgba(185,28,28,0.9)', label: 'Agotado' }
                                            : !stockOk
                                                ? { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', color: 'rgba(146,64,14,0.9)', label: 'Stock bajo' }
                                                : { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', color: 'rgba(4,120,87,0.9)', label: 'En stock' };
                                        return (
                                            <tr key={p.id} className="inv-tr">
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                        <div style={{
                                                            width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
                                                            background: 'rgba(220,38,38,0.09)', border: '1px solid rgba(220,38,38,0.2)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '1rem', fontWeight: '600', color: 'rgba(185,28,28,0.8)',
                                                        }}>
                                                            {p.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d1a08' }}>{p.nombre}</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.1rem' }}>{p.codigo_barras || 'Sin código'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <span style={{
                                                        fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.65rem',
                                                        background: 'rgba(180,90,20,0.07)', border: '1px solid rgba(180,90,20,0.18)',
                                                        color: 'rgba(120,60,10,0.8)', borderRadius: '20px',
                                                    }}>{p.categoria}</span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.9rem', fontWeight: '700', color: '#2d1a08' }}>
                                                    {p.stock} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'rgba(150,80,20,0.5)' }}>uds</span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', fontSize: '0.87rem', color: 'rgba(120,60,10,0.65)' }}>
                                                    {p.stock_minimo} uds
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem' }}>
                                                    <span style={{
                                                        fontSize: '0.72rem', fontWeight: '600', padding: '0.22rem 0.7rem',
                                                        background: badge.bg, border: `1px solid ${badge.border}`,
                                                        color: badge.color, borderRadius: '20px',
                                                    }}>{badge.label}</span>
                                                </td>
                                                <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                                                    <Link href={`/inventario/${p.id}/kardex`}
                                                          style={{
                                                              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                                                              padding: '0.35rem 0.85rem',
                                                              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.3)',
                                                              borderRadius: '10px', fontSize: '0.76rem', fontWeight: '600',
                                                              color: 'rgba(120,60,10,0.75)', textDecoration: 'none', transition: 'all 0.15s',
                                                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                                                          }}>
                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        Kardex
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={productosFiltrados.length}
                                    perPage={PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor="orange"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="inv-glass inv-a3" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '18px', margin: '0 auto 1.25rem',
                                background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="26" height="26" fill="none" stroke="rgba(185,28,28,0.6)" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.5rem' }}>No hay productos en inventario</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)', marginBottom: '1.5rem' }}>Primero agrega productos desde el módulo de Productos</p>
                            <Link href="/productos/crear" className="inv-btn-primary">Ir a Productos</Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
