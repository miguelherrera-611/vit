import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';
import Pagination from '@/Components/Pagination';

const normalize = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler();
        };
        document.addEventListener('mousedown', listener);
        return () => document.removeEventListener('mousedown', listener);
    }, [ref, handler]);
}

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const PAGE_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background: ${GLASS_BG}; }

    /* page header */
    .pg-header {
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(32px) saturate(180%);
        -webkit-backdrop-filter: blur(32px) saturate(180%);
        border-bottom: 1px solid rgba(255,255,255,0.68);
        box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
        position: relative;
        z-index: 20;
    }

    /* glass panel (replaces white bg-white cards) */
    .glass-panel {
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(20px) saturate(150%);
        -webkit-backdrop-filter: blur(20px) saturate(150%);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius: 20px;
        box-shadow:
            0 12px 40px rgba(180,90,20,0.08),
            0 3px 12px rgba(180,90,20,0.05),
            inset 0 1.5px 0 rgba(255,255,255,0.85),
            inset 0 -1px 0 rgba(180,90,20,0.03);
        position: relative;
        z-index: 1;
    }
    .glass-panel::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent);
        pointer-events:none; z-index:1;
    }

    /* glass input */
    .glass-input {
        width:100%; padding:0.75rem 1rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(200,140,80,0.4);
        border-radius: 14px;
        font-size:0.9rem; color:#2d1a08;
        font-family:'Inter',sans-serif; outline:none;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 3px 12px rgba(160,80,10,0.07), inset 0 1px 0 rgba(255,255,255,0.75);
    }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus {
        background: rgba(255,255,255,0.12);
        border-color: rgba(200,140,80,0.65);
        box-shadow: 0 0 0 3px rgba(220,38,38,0.05), 0 3px 12px rgba(160,80,10,0.08), inset 0 1px 0 rgba(255,255,255,0.85);
    }

    /* glass select */
    .glass-select {
        width:100%; padding:0.75rem 1rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(200,140,80,0.4);
        border-radius: 14px;
        font-size:0.9rem; color:#2d1a08;
        font-family:'Inter',sans-serif; outline:none;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: 0 3px 12px rgba(160,80,10,0.07), inset 0 1px 0 rgba(255,255,255,0.75);
        cursor: pointer;
    }
    .glass-select:focus {
        border-color: rgba(200,140,80,0.65);
        box-shadow: 0 0 0 3px rgba(220,38,38,0.05), inset 0 1px 0 rgba(255,255,255,0.85);
    }

    /* ghost btn */
    .btn-ghost {
        display:inline-flex; align-items:center; gap:0.4rem;
        padding:0.65rem 1.1rem;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius: 14px;
        font-size:0.85rem; font-weight:500;
        color:rgba(120,60,10,0.8);
        text-decoration:none; cursor:pointer;
        transition: all 0.2s ease;
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow: 0 2px 8px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.78);
        font-family:'Inter',sans-serif;
        white-space:nowrap;
    }
    .btn-ghost:hover {
        background: rgba(255,255,255,0.14);
        border-color: rgba(255,255,255,0.85);
        color: rgba(90,40,5,0.95);
        transform:translateY(-1px);
    }

    /* primary btn */
    .btn-primary {
        display:inline-flex; align-items:center; gap:0.4rem;
        padding:0.65rem 1.25rem;
        background: rgba(220,38,38,0.1);
        border: 1px solid rgba(220,38,38,0.45);
        border-radius: 14px;
        font-size:0.85rem; font-weight:500;
        color:rgba(185,28,28,0.95);
        text-decoration:none; cursor:pointer;
        transition: all 0.2s ease;
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow: 0 4px 16px rgba(220,38,38,0.1), inset 0 1px 0 rgba(255,120,120,0.28);
        font-family:'Inter',sans-serif;
        white-space:nowrap; position:relative; overflow:hidden;
    }
    .btn-primary::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent);
        pointer-events:none;
    }
    .btn-primary:hover {
        background: rgba(220,38,38,0.15);
        border-color: rgba(220,38,38,0.6);
        transform:translateY(-1px);
        box-shadow: 0 8px 24px rgba(220,38,38,0.14), inset 0 1px 0 rgba(255,120,120,0.35);
    }

    /* table */
    .glass-table { width:100%; border-collapse:collapse; }
    .glass-table thead tr {
        border-bottom: 1px solid rgba(200,140,80,0.18);
    }
    .glass-table th {
        padding:0.85rem 1.25rem;
        font-size:0.68rem; font-weight:600;
        color:rgba(150,80,20,0.55);
        letter-spacing:0.08em; text-transform:uppercase;
        text-align:left;
    }
    .glass-table tbody tr {
        border-bottom: 1px solid rgba(255,255,255,0.35);
        transition: background 0.15s;
    }
    .glass-table tbody tr:last-child { border-bottom:none; }
    .glass-table tbody tr:hover { background: rgba(255,255,255,0.12); }
    .glass-table td { padding:0.95rem 1.25rem; }

    /* back btn */
    .btn-back {
        width:34px; height:34px;
        display:flex; align-items:center; justify-content:center;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius:10px; cursor:pointer; text-decoration:none;
        color:rgba(150,80,20,0.6);
        transition: all 0.18s; flex-shrink:0;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.72);
    }
    .btn-back:hover {
        background: rgba(255,255,255,0.2);
        color:rgba(120,50,10,0.9);
    }

    /* filter dropdown */
    .filter-dropdown {
        position:absolute; top:calc(100% + 8px); left:0;
        min-width:220px;
        background: rgba(255,250,245,0.92);
        backdrop-filter:blur(32px) saturate(180%);
        -webkit-backdrop-filter:blur(32px) saturate(180%);
        border:1px solid rgba(255,255,255,0.72);
        border-radius:18px;
        box-shadow: 0 16px 48px rgba(180,90,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
        overflow:hidden; z-index:9999;
        animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1);
    }
    @keyframes dropIn { from{opacity:0;transform:translateY(-6px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    .filter-item {
        width:100%; display:flex; align-items:center; gap:0.75rem;
        padding:0.65rem 1rem; font-size:0.83rem; font-weight:500;
        color:rgba(120,55,10,0.78); background:none; border:none;
        cursor:pointer; text-align:left; font-family:'Inter',sans-serif;
        transition: background 0.12s;
    }
    .filter-item:hover { background:rgba(255,255,255,0.55); color:rgba(90,35,5,0.95); }
    .filter-item.active { color:rgba(185,28,28,0.9); font-weight:600; }

    /* badge chips */
    .badge-red    { background:rgba(220,38,38,0.08);  border:1px solid rgba(220,38,38,0.22);  color:rgba(185,28,28,0.85);  padding:0.2rem 0.65rem; border-radius:20px; font-size:0.72rem; font-weight:600; }
    .badge-yellow { background:rgba(245,158,11,0.1);  border:1px solid rgba(245,158,11,0.28);  color:rgba(180,100,0,0.9);   padding:0.2rem 0.65rem; border-radius:20px; font-size:0.72rem; font-weight:600; }
    .badge-green  { background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.22); color:rgba(4,120,87,0.85);   padding:0.2rem 0.65rem; border-radius:20px; font-size:0.72rem; font-weight:600; }
    .badge-gray   { background:rgba(180,90,20,0.06);  border:1px solid rgba(180,90,20,0.15);  color:rgba(150,80,20,0.65);  padding:0.2rem 0.65rem; border-radius:20px; font-size:0.72rem; font-weight:600; }

    /* icon action btn */
    .icon-btn {
        width:32px; height:32px; display:flex; align-items:center; justify-content:center;
        background:none; border:none; cursor:pointer; border-radius:9px;
        color:rgba(150,80,20,0.45); transition:all 0.15s;
    }
    .icon-btn:hover { background:rgba(255,255,255,0.3); color:rgba(120,50,10,0.85); }
    .icon-btn.danger:hover { background:rgba(220,38,38,0.08); color:rgba(185,28,28,0.85); }
    .icon-btn.blue:hover   { background:rgba(59,130,246,0.08); color:rgba(29,78,216,0.85); }

    /* img placeholder */
    .img-placeholder {
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.55);
        border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        flex-shrink:0;
    }

    /* proveedor tag en tabla */
    .prov-tag-table {
        display:inline-block; padding:0.15rem 0.55rem; border-radius:20px;
        background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.18);
        font-size:0.74rem; font-weight:500; color:rgba(185,28,28,0.82);
        white-space:nowrap;
    }

    @media (max-width: 900px) {
        .pg-header > div, .pg-bg > div { padding-left: 1rem !important; padding-right: 1rem !important; }
    }
    @media (max-width: 760px) {
        .glass-table th:nth-child(3), .glass-table td:nth-child(3) { display: none; } /* proveedor */
        .glass-table th:nth-child(6), .glass-table td:nth-child(6) { display: none; } /* estado */
    }
`;

// ─── Filter Dropdown ────────────────────────────────────────────────────────
function FilterDropdown({ label, icon, value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setOpen(false));
    const activeOption = options.find(o => o.value === value);
    const isActive = value !== '';

    const accentStyle = isActive ? {
        background: 'rgba(255,255,255,0.14)',
        border: '1px solid rgba(200,140,80,0.5)',
        color: 'rgba(120,50,10,0.9)',
    } : {};

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button onClick={() => setOpen(!open)} className="btn-ghost" style={accentStyle}>
                {isActive && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(194,105,42,0.8)', flexShrink: 0 }} />}
                {icon}
                <span>{isActive ? activeOption?.label : label}</span>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="filter-dropdown">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`filter-item${value === opt.value ? ' active' : ''}`}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                        >
                            {opt.dot && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dotColor || 'rgba(150,80,20,0.4)', flexShrink: 0 }} />}
                            <span style={{ flex: 1 }}>{opt.label}</span>
                            {value === opt.value && (
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function ProductosIndex({ productos = [] }) {
    const [busqueda, setBusqueda]               = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroStock, setFiltroStock]         = useState('');
    const [confirmDelete, setConfirmDelete]     = useState(null);
    const [delProcessing, setDelProcessing]     = useState(false);
    const [delError, setDelError]               = useState(null);
    const [currentPage, setCurrentPage]         = useState(1);
    const PER_PAGE = 15;

    const opcionesCategorias = useMemo(() => {
        const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
        return [
            { value: '', label: 'Todas las categorías' },
            ...cats.map(c => ({ value: c, label: c })),
        ];
    }, [productos]);

    const opcionesStock = [
        { value: '',           label: 'Todo el stock' },
        { value: 'disponible', label: 'Con stock',   dot: true, dotColor: 'rgba(16,185,129,0.8)' },
        { value: 'bajo',       label: 'Bajo stock',  dot: true, dotColor: 'rgba(245,158,11,0.8)' },
        { value: 'agotado',    label: 'Agotado',     dot: true, dotColor: 'rgba(220,38,38,0.8)'  },
    ];

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        return productos.filter((p) => {
            if (q) {
                const match = normalize(p.nombre).includes(q) || normalize(p.codigo_barras).includes(q) || normalize(p.categoria).includes(q);
                if (!match) return false;
            }
            if (filtroCategoria && p.categoria !== filtroCategoria) return false;
            const minimo = p.stock_minimo || 5;
            if (filtroStock === 'disponible' && p.stock <= 0) return false;
            if (filtroStock === 'bajo'       && !(p.stock > 0 && p.stock <= minimo)) return false;
            if (filtroStock === 'agotado'    && p.stock > 0) return false;
            return true;
        });
    }, [productos, busqueda, filtroCategoria, filtroStock]);

    useEffect(() => { setCurrentPage(1); }, [busqueda, filtroCategoria, filtroStock]);

    const hayFiltros = busqueda || filtroCategoria || filtroStock;

    const productosPaginados = useMemo(
        () => productosFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [productosFiltrados, currentPage]
    );

    const handleDelete = (password) => {
        if (!confirmDelete) return;
        setDelProcessing(true);
        router.delete(`/productos/${confirmDelete.id}`, {
            data: { password },
            onSuccess: () => { setConfirmDelete(null); setDelProcessing(false); setDelError(null); },
            onError: (errs) => { setDelError(errs.password || 'Error al eliminar.'); setDelProcessing(false); },
        });
    };

    const formatCurrency = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

    const stats = useMemo(() => ({
        total:   productos.length,
        bajo:    productos.filter(p => p.stock > 0 && p.stock <= (p.stock_minimo || 5)).length,
        agotado: productos.filter(p => p.stock === 0).length,
    }), [productos]);

    return (
        <AppLayout>
            <style>{PAGE_STYLES}</style>
            <div className="pg-bg">

                {/* Header */}
                <div className="pg-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.75rem 1.5rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                            <div>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>Productos</h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)' }}>{productos.length} productos en total</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                                <Link href="/categorias" className="btn-ghost">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    Categorías
                                </Link>
                                <Link href="/productos/crear" className="btn-primary">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo Producto
                                </Link>
                            </div>
                        </div>

                        {/* Stock alerts */}
                        {(stats.bajo > 0 || stats.agotado > 0) && (
                            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                                {stats.agotado > 0 && (
                                    <button onClick={() => setFiltroStock('agotado')} className="badge-red" style={{ cursor: 'pointer', border: 'none' }}>
                                        {stats.agotado} agotado{stats.agotado > 1 ? 's' : ''} — ver
                                    </button>
                                )}
                                {stats.bajo > 0 && (
                                    <button onClick={() => setFiltroStock('bajo')} className="badge-yellow" style={{ cursor: 'pointer', border: 'none' }}>
                                        {stats.bajo} bajo stock — ver
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Search + filters */}
                        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                     width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar por nombre, código o categoría..."
                                    className="glass-input"
                                    style={{ paddingLeft: '2.5rem', paddingRight: busqueda ? '2.5rem' : '1rem' }}
                                />
                                {busqueda && (
                                    <button onClick={() => setBusqueda('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <FilterDropdown
                                label="Categoría"
                                icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                                value={filtroCategoria} options={opcionesCategorias} onChange={setFiltroCategoria}
                            />
                            <FilterDropdown
                                label="Stock"
                                icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                                value={filtroStock} options={opcionesStock} onChange={setFiltroStock}
                            />
                            {hayFiltros && (
                                <button onClick={() => { setBusqueda(''); setFiltroCategoria(''); setFiltroStock(''); }} className="btn-ghost" style={{ color: 'rgba(150,80,20,0.55)' }}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Limpiar
                                </button>
                            )}
                        </div>

                        {hayFiltros && (
                            <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'rgba(150,80,20,0.55)' }}>
                                Mostrando <span style={{ fontWeight: '600', color: '#2d1a08' }}>{productosFiltrados.length}</span> de {productos.length} productos
                            </p>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <div className="glass-panel">
                        {productosFiltrados.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                                <div className="img-placeholder" style={{ width: '56px', height: '56px', margin: '0 auto 1rem' }}>
                                    <svg width="24" height="24" fill="none" stroke="rgba(180,100,30,0.35)" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p style={{ fontWeight: '500', color: '#2d1a08', marginBottom: '0.3rem' }}>
                                    {hayFiltros ? 'Sin resultados para estos filtros' : 'No hay productos registrados'}
                                </p>
                                <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)' }}>
                                    {hayFiltros ? 'Prueba ajustando o limpiando los filtros' : 'Comienza agregando tu primer producto'}
                                </p>
                                {hayFiltros && (
                                    <button onClick={() => { setBusqueda(''); setFiltroCategoria(''); setFiltroStock(''); }} className="btn-ghost" style={{ marginTop: '1rem' }}>Limpiar filtros</button>
                                )}
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="glass-table">
                                    <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Proveedor</th>
                                        <th style={{ textAlign: 'right' }}>Precio</th>
                                        <th style={{ textAlign: 'right' }}>Stock</th>
                                        <th style={{ textAlign: 'center' }}>Estado</th>
                                        <th />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {productosPaginados.map((producto) => {
                                        const minimo        = producto.stock_minimo || 5;
                                        const stockEfectivo = producto.stock_total ?? producto.stock;
                                        const agotado       = stockEfectivo === 0;
                                        const bajo          = stockEfectivo > 0 && stockEfectivo <= minimo;

                                        return (
                                            <tr
                                                key={producto.id}
                                                onClick={() => router.visit(`/productos/${producto.id}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                        {producto.imagen ? (
                                                            <img src={`/storage/${producto.imagen}`} alt={producto.nombre}
                                                                 style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.6)', flexShrink: 0 }} />
                                                        ) : (
                                                            <div className="img-placeholder" style={{ width: '44px', height: '44px' }}>
                                                                <svg width="18" height="18" fill="none" stroke="rgba(180,100,30,0.32)" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p style={{ fontWeight: '500', color: '#2d1a08', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                                                {producto.nombre}
                                                                {producto.maneja_tallas && (
                                                                    <span style={{
                                                                        fontSize: '0.62rem', fontWeight: '600',
                                                                        padding: '0.1rem 0.4rem', borderRadius: '4px',
                                                                        background: 'rgba(139,92,246,0.08)',
                                                                        border: '1px solid rgba(139,92,246,0.22)',
                                                                        color: 'rgba(109,40,217,0.8)',
                                                                    }}>Tallas</span>
                                                                )}
                                                            </p>
                                                            {producto.codigo_barras && <p style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.15rem' }}>{producto.codigo_barras}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.85rem', color: 'rgba(120,60,10,0.72)' }}>{producto.categoria || '—'}</span>
                                                </td>
                                                {/* ── PROVEEDORES ── */}
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                        {(producto.proveedores ?? []).length === 0
                                                            ? <span style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.4)' }}>—</span>
                                                            : producto.proveedores.map(p => (
                                                                <span key={p.id} className="prov-tag-table">
                                                                    {p.empresa || p.nombre}
                                                                </span>
                                                            ))
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <span style={{ fontWeight: '600', color: '#2d1a08', fontSize: '0.9rem' }}>{formatCurrency(producto.precio)}</span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                                                        <span style={{ fontWeight: '600', color: agotado ? 'rgba(185,28,28,0.85)' : bajo ? 'rgba(180,100,0,0.85)' : '#2d1a08' }}>
                                                            {stockEfectivo}
                                                        </span>
                                                        {agotado && <span className="badge-red">Agotado</span>}
                                                        {bajo    && <span className="badge-yellow">Bajo</span>}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <span className={producto.activo ? 'badge-green' : 'badge-gray'}>
                                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                                                        <Link href={`/productos/${producto.id}/edit`} className="icon-btn blue" title="Editar" onClick={e => e.stopPropagation()}>
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(producto); }} className="icon-btn danger" title="Eliminar">
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {productosFiltrados.length > PER_PAGE && (
                        <Pagination
                            currentPage={currentPage}
                            totalItems={productosFiltrados.length}
                            perPage={PER_PAGE}
                            onPageChange={setCurrentPage}
                            accentColor="red"
                        />
                    )}
                </div>
            </div>

            <PasswordConfirmModal
                open={!!confirmDelete}
                onClose={() => { setConfirmDelete(null); setDelError(null); }}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar "${confirmDelete?.nombre}"?`}
                description="El producto se moverá a la papelera. Podrás recuperarlo en los próximos 30 días."
                confirmLabel="Eliminar"
            />
        </AppLayout>
    );
}
