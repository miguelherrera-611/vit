import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;
const CATS_POR_PAG = 8;

const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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
    /* Trigger del dropdown de categoría */
    .inv-cat-trigger {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.72rem 1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.88rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); text-align:left; white-space:nowrap;
    }
    .inv-cat-trigger.open   { border-color:rgba(200,140,80,0.65); background:rgba(255,255,255,0.12); }
    .inv-cat-trigger.active { border-color:rgba(220,38,38,0.4); background:rgba(220,38,38,0.05); }
    /* Panel del dropdown — portal con position:fixed */
    @keyframes invDrop {
        from { opacity:0; transform:translateY(-6px) scale(0.98); }
        to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .inv-cat-panel {
        position:fixed; z-index:999999;
        background:rgba(255,248,240,0.99);
        backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%);
        border:1px solid rgba(255,255,255,0.72); border-radius:18px;
        box-shadow:0 24px 64px rgba(180,90,20,0.2),0 8px 24px rgba(180,90,20,0.1),
                   inset 0 1px 0 rgba(255,255,255,0.9);
        overflow:hidden; animation:invDrop 0.17s cubic-bezier(0.16,1,0.3,1);
        font-family:'Inter',-apple-system,sans-serif; min-width:220px;
    }
    .inv-cat-search {
        width:100%; padding:0.5rem 0.85rem 0.5rem 2.1rem;
        background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.35); border-radius:11px;
        font-size:0.82rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); transition:all 0.17s; box-sizing:border-box;
    }
    .inv-cat-search:focus { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.18); }
    .inv-cat-search::placeholder { color:rgba(180,100,30,0.38); }
    .inv-cat-opt {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.6rem 1rem; cursor:pointer; border:none; background:none;
        width:100%; text-align:left; font-family:'Inter',sans-serif; transition:background 0.12s;
        font-size:0.86rem; color:rgba(80,40,8,0.82);
    }
    .inv-cat-opt:hover  { background:rgba(255,255,255,0.55); }
    .inv-cat-opt.active { background:rgba(220,38,38,0.06); color:rgba(185,28,28,0.9); font-weight:600; }
    .inv-cat-pager {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.4rem 0.75rem; border-top:1px solid rgba(200,140,80,0.12);
    }
    .inv-cat-pager-btn {
        display:flex; align-items:center; gap:0.3rem; padding:0.25rem 0.55rem;
        border-radius:8px; cursor:pointer; font-size:0.72rem; font-weight:500;
        color:rgba(120,60,10,0.7); background:none; border:none;
        font-family:'Inter',sans-serif; transition:background 0.12s;
    }
    .inv-cat-pager-btn:hover:not(:disabled) { background:rgba(255,255,255,0.65); }
    .inv-cat-pager-btn:disabled { opacity:0.28; cursor:not-allowed; }
    .inv-cat-pager-dot {
        width:22px; height:22px; border-radius:7px; cursor:pointer;
        font-size:0.7rem; font-weight:600; border:none; font-family:'Inter',sans-serif; transition:all 0.12s;
    }
    .inv-btn-primary {
        display:inline-flex; align-items:center; gap:0.45rem; padding:0.65rem 1.3rem;
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
`;

// ── Hook: posición fixed que se recalcula en cada scroll/resize ───────────────
function useAnchoredPanel(trigRef, open) {
    const [pos, setPos] = useState({ top: -9999, left: 0, width: 0 });

    useEffect(() => {
        if (!open) return;
        function update() {
            if (!trigRef.current) return;
            const r = trigRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 6, left: r.left, width: r.width });
        }
        update();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open]);

    return pos;
}

// ── Dropdown de categoría con buscador y paginador ───────────────────────────
function CategoriaDropdown({ categorias, value, onChange }) {
    const [open,     setOpen]     = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina,   setPagina]   = useState(1);
    const trigRef                 = useRef(null);
    const panelRef                = useRef(null);
    const inputRef                = useRef(null);
    const pos                     = useAnchoredPanel(trigRef, open);

    // Cerrar al click fuera
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (!trigRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    useEffect(() => {
        if (open) {
            setPagina(1);
            setTimeout(() => inputRef.current?.focus(), 60);
        } else {
            setBusqueda('');
        }
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    const filtradas = useMemo(() => {
        const q = normalize(busqueda);
        return q ? categorias.filter(c => normalize(c).includes(q)) : categorias;
    }, [categorias, busqueda]);

    const totalPags = Math.ceil(filtradas.length / CATS_POR_PAG);
    const pagActual = filtradas.slice((pagina - 1) * CATS_POR_PAG, pagina * CATS_POR_PAG);

    const hayFiltro = !!value;

    return (
        <>
            <button
                type="button"
                ref={trigRef}
                onClick={() => setOpen(o => !o)}
                className={`inv-cat-trigger${open ? ' open' : ''}${hayFiltro ? ' active' : ''}`}
                style={{ minWidth: '200px' }}
            >
                <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                    color: hayFiltro ? 'rgba(185,28,28,0.9)' : 'rgba(120,60,10,0.55)',
                    fontWeight: hayFiltro ? '600' : '400', fontSize: '0.85rem',
                }}>
                    {value || 'Todas las categorías'}
                </span>
                <svg style={{ width: '13px', height: '13px', color: hayFiltro ? 'rgba(185,28,28,0.6)' : 'rgba(150,80,20,0.4)', flexShrink: 0, marginLeft: '0.5rem', transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && createPortal(
                <div ref={panelRef} className="inv-cat-panel" style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 240) }}>

                    {/* Buscador */}
                    <div style={{ padding: '0.6rem 0.75rem 0.45rem', borderBottom: '1px solid rgba(200,140,80,0.14)' }}>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '0.62rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                 width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={e => setBusqueda(e.target.value)}
                                   placeholder="Buscar categoría..."
                                   className="inv-cat-search" />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.25rem', paddingLeft: '0.2rem' }}>
                            {filtradas.length} categoría{filtradas.length !== 1 ? 's' : ''}
                            {busqueda && ` · "${busqueda}"`}
                        </p>
                    </div>

                    {/* Opción "Todas" */}
                    <button type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className={`inv-cat-opt${!value ? ' active' : ''}`}
                            style={{ borderBottom: '1px solid rgba(200,140,80,0.09)', fontStyle: 'italic' }}>
                        <span>Todas las categorías</span>
                        {!value && (
                            <svg style={{ width: '12px', height: '12px', color: 'rgba(185,28,28,0.8)', flexShrink: 0 }}
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    {/* Lista paginada */}
                    <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                        {pagActual.length === 0 ? (
                            <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.83rem', color: 'rgba(150,80,20,0.5)' }}>Sin resultados para <strong>"{busqueda}"</strong></p>
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : pagActual.map((cat, i) => {
                            const sel = cat === value;
                            return (
                                <button key={cat} type="button"
                                        onClick={() => { onChange(cat); setOpen(false); }}
                                        className={`inv-cat-opt${sel ? ' active' : ''}`}
                                        style={{ borderBottom: i < pagActual.length - 1 ? '1px solid rgba(200,140,80,0.08)' : 'none' }}>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
                                    {sel && (
                                        <svg style={{ width: '12px', height: '12px', color: 'rgba(185,28,28,0.8)', flexShrink: 0, marginLeft: '0.5rem' }}
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Paginador */}
                    {totalPags > 1 && (
                        <div className="inv-cat-pager">
                            <button type="button" className="inv-cat-pager-btn"
                                    disabled={pagina === 1}
                                    onClick={() => setPagina(p => p - 1)}>
                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Ant.
                            </button>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" className="inv-cat-pager-dot"
                                            onClick={() => setPagina(n)}
                                            style={{
                                                background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)',
                                                color:      n === pagina ? 'rgba(185,28,28,0.9)'  : 'rgba(120,60,10,0.6)',
                                                border:     n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(200,140,80,0.2)',
                                            }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="inv-cat-pager-btn"
                                    disabled={pagina === totalPags}
                                    onClick={() => setPagina(p => p + 1)}>
                                Sig.
                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

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

    const categorias = useMemo(() =>
            [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort(),
        [productos]
    );

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

                    {/* ── KPIs ── */}
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
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm('')}
                                            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Dropdown categoría */}
                            <div style={{ flex: '1 1 200px' }}>
                                <CategoriaDropdown
                                    categorias={categorias}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                />
                            </div>

                            {/* Limpiar todo */}
                            {(searchTerm || selectedCategory) && (
                                <button type="button"
                                        onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                                        style={{
                                            padding: '0.65rem 1rem',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.3)',
                                            borderRadius: '14px', fontSize: '0.82rem', color: 'rgba(150,80,20,0.7)',
                                            cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s',
                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                                        }}>
                                    Limpiar
                                </button>
                            )}
                        </div>

                        {(searchTerm || selectedCategory) && (
                            <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'rgba(150,80,20,0.55)' }}>
                                <span style={{ fontWeight: '600', color: '#2d1a08' }}>{productosFiltrados.length}</span>{' '}
                                producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
                                {selectedCategory && (
                                    <span> en <span style={{ fontWeight: '600', color: 'rgba(185,28,28,0.8)' }}>{selectedCategory}</span></span>
                                )}
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
                                                padding: '0.85rem 1.25rem',
                                                textAlign: h === '' ? 'right' : 'left',
                                                fontSize: '0.67rem', fontWeight: '600',
                                                color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productosPaginados.map((p) => {
                                        const agotado = p.stock === 0;
                                        const bajo    = !agotado && p.stock <= p.stock_minimo;
                                        const badge   = agotado
                                            ? { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', color: 'rgba(185,28,28,0.9)', label: 'Agotado' }
                                            : bajo
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
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.5rem' }}>
                                {searchTerm || selectedCategory ? 'Sin resultados' : 'No hay productos en inventario'}
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)', marginBottom: '1.5rem' }}>
                                {searchTerm || selectedCategory
                                    ? 'Intenta con otros filtros o limpia la búsqueda'
                                    : 'Primero agrega productos desde el módulo de Productos'}
                            </p>
                            {searchTerm || selectedCategory
                                ? <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                                          style={{ padding: '0.65rem 1.25rem', background: 'rgba(220,38,38,0.09)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '600', color: 'rgba(185,28,28,0.9)', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                                    Limpiar filtros
                                </button>
                                : <Link href="/productos/crear" className="inv-btn-primary">Ir a Productos</Link>
                            }
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
