import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const CAT_POR_PAG        = 8;
const PROD_POR_PAG       = 12;
const OPCIONES_POR_PAG   = 7; // máx opciones visibles en el dropdown de categorías

// ── Badge de estado ───────────────────────────────────────────────────────────
function EstadoBadge({ stock, minimo }) {
    if (stock === 0)     return <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">● Agotado</span>;
    if (stock <= minimo) return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">● Bajo stock</span>;
    return                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">● En stock</span>;
}

// ── Paginador de tabla ────────────────────────────────────────────────────────
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

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
                Mostrando <span className="font-semibold text-gray-700">{desde}–{hasta}</span> de{' '}
                <span className="font-semibold text-gray-700">{total}</span> registros
            </p>
            <div className="flex items-center gap-1">
                <button onClick={() => onChange(pagina - 1)} disabled={pagina === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                {rango().map((n, i) => n === '...'
                    ? <span key={`e${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                    : <button key={n} onClick={() => onChange(n)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition
                            ${n === pagina ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-white border border-transparent hover:border-gray-200'}`}>
                        {n}
                    </button>
                )}
                <button onClick={() => onChange(pagina + 1)} disabled={pagina === totalPags}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white transition disabled:opacity-30 disabled:cursor-not-allowed border border-transparent hover:border-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}

// ── Dropdown de estado (simple, pocas opciones) ───────────────────────────────
function EstadoDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef(null);

    const options = [
        { value: '',        label: 'Todos los estados' },
        { value: 'ok',      label: 'En stock',    dot: 'bg-emerald-500' },
        { value: 'bajo',    label: 'Bajo stock',  dot: 'bg-amber-500'   },
        { value: 'agotado', label: 'Agotados',    dot: 'bg-red-500'     },
    ];

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected  = options.find(o => o.value === value);
    const isActive  = value !== '';

    return (
        <div ref={ref} className="relative">
            <button type="button" onClick={() => setOpen(o => !o)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition
                    ${isActive
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{isActive ? selected?.label : 'Estado de stock'}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-1.5 min-w-[180px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                     style={{ animation: 'dropdownIn 0.16s cubic-bezier(0.16,1,0.3,1)' }}>
                    {options.map((opt, i) => {
                        const sel = opt.value === value;
                        return (
                            <button key={opt.value} type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition
                                    ${sel ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                                    ${i < options.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                <span className="flex items-center gap-2">
                                    {opt.dot && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`} />}
                                    {opt.label}
                                </span>
                                {sel && (
                                    <svg className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// ── Dropdown de categorías con buscador + paginación interna ──────────────────
function CategoriaDropdown({ value, onChange, categorias }) {
    const [open,     setOpen]     = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina,   setPagina]   = useState(1);
    const ref                     = useRef(null);
    const inputRef                = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

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

    const totalPags  = Math.ceil(filtradas.length / OPCIONES_POR_PAG);
    const paginadas  = filtradas.slice((pagina - 1) * OPCIONES_POR_PAG, pagina * OPCIONES_POR_PAG);
    const isActive   = value !== '';

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button type="button" onClick={() => setOpen(o => !o)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition
                    ${isActive
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="max-w-[160px] truncate">{isActive ? value : 'Categoría'}</span>
                <svg className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Panel */}
            {open && (
                <div className="absolute z-50 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                     style={{ animation: 'dropdownIn 0.16s cubic-bezier(0.16,1,0.3,1)' }}>

                    {/* Buscador */}
                    <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={(e) => setBusqueda(e.target.value)}
                                   placeholder="Buscar categoría..."
                                   className="w-full pl-8 pr-7 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100 bg-gray-50" />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 px-0.5">
                            {filtradas.length} categoría{filtradas.length !== 1 ? 's' : ''}
                            {busqueda && ` para "${busqueda}"`}
                        </p>
                    </div>

                    {/* Opción "Todas" */}
                    {!busqueda && (
                        <button type="button"
                                onClick={() => { onChange(''); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm border-b border-gray-50 transition
                                ${!value ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span>Todas las categorías</span>
                            {!value && (
                                <svg className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Lista paginada */}
                    {paginadas.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-xs text-gray-400">Sin resultados para <strong>"{busqueda}"</strong></p>
                            <button type="button" onClick={() => setBusqueda('')}
                                    className="mt-1.5 text-xs text-orange-600 hover:underline">
                                Limpiar búsqueda
                            </button>
                        </div>
                    ) : (
                        paginadas.map((cat, i) => {
                            const sel = cat === value;
                            return (
                                <button key={cat} type="button"
                                        onClick={() => { onChange(cat); setOpen(false); }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition
                                        ${sel ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}
                                        ${i < paginadas.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                    <span className="truncate">{cat}</span>
                                    {sel && (
                                        <svg className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })
                    )}

                    {/* Paginación interna del dropdown */}
                    {totalPags > 1 && (
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
                            <button type="button"
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina === 1}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Ant.
                            </button>

                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" onClick={() => setPagina(n)}
                                            className={`w-6 h-6 rounded-md text-xs font-semibold transition
                                            ${n === pagina ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-white'}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>

                            <button type="button"
                                    onClick={() => setPagina(p => Math.min(totalPags, p + 1))}
                                    disabled={pagina === totalPags}
                                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                                Sig.
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ReporteInventario({ productos = [], porCategoria = [], criticos = [], kpis = {} }) {
    const [vistaProductos, setVistaProductos] = useState('criticos');
    const [busqueda,        setBusqueda]       = useState('');
    const [filtroCat,       setFiltroCat]      = useState('');
    const [filtroEstado,    setFiltroEstado]   = useState('');
    const [paginaCat,       setPaginaCat]      = useState(1);
    const [paginaProd,      setPaginaProd]     = useState(1);

    const cambiarBusqueda = (v) => { setBusqueda(v);     setPaginaProd(1); };
    const cambiarCat      = (v) => { setFiltroCat(v);    setPaginaProd(1); };
    const cambiarEstado   = (v) => { setFiltroEstado(v); setPaginaProd(1); };
    const cambiarVista    = (v) => {
        setVistaProductos(v); setPaginaProd(1);
        setBusqueda(''); setFiltroCat(''); setFiltroEstado('');
    };

    const catPaginadas = useMemo(
        () => porCategoria.slice((paginaCat - 1) * CAT_POR_PAG, paginaCat * CAT_POR_PAG),
        [porCategoria, paginaCat]
    );
    const maxStock = Math.max(...porCategoria.map(c => c.total_stock || 0), 1);

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        let lista = vistaProductos === 'criticos' ? criticos : productos;
        if (q)                          lista = lista.filter(p => normalize(p.nombre).includes(q) || normalize(p.categoria).includes(q));
        if (filtroCat)                  lista = lista.filter(p => p.categoria === filtroCat);
        if (filtroEstado === 'agotado') lista = lista.filter(p => p.stock === 0);
        if (filtroEstado === 'bajo')    lista = lista.filter(p => p.stock > 0 && p.stock <= p.stock_minimo);
        if (filtroEstado === 'ok')      lista = lista.filter(p => p.stock > p.stock_minimo);
        return lista;
    }, [productos, criticos, vistaProductos, busqueda, filtroCat, filtroEstado]);

    const prodPaginados = useMemo(
        () => productosFiltrados.slice((paginaProd - 1) * PROD_POR_PAG, paginaProd * PROD_POR_PAG),
        [productosFiltrados, paginaProd]
    );

    const categorias = useMemo(
        () => [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort(),
        [productos]
    );

    const hayFiltros = busqueda || filtroCat || filtroEstado;

    return (
        <AppLayout>
            <style>{`
                @keyframes dropdownIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1);   }
                }
            `}</style>

            <div className="min-h-screen bg-gray-50">

                {/* ── Header ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/reportes"
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Reporte de Inventario</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Estado actual del stock — {productos.length} productos · {porCategoria.length} categorías
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                    {/* ── KPIs ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                        {[
                            { label: 'Productos activos',     value: kpis.total_productos,              color: 'text-gray-900',    icon: '📦', tip: null },
                            { label: 'Valor total en venta',  value: fmt(kpis.valor_inventario_venta),  color: 'text-emerald-600', icon: '💰', tip: 'Suma de precio de venta × stock de cada producto' },
                            { label: 'Valor total en compra', value: fmt(kpis.valor_inventario_compra), color: 'text-blue-600',    icon: '🧾', tip: 'Suma de costo de compra × stock de cada producto' },
                            { label: 'Ganancia potencial',    value: fmt(kpis.ganancia_potencial),      color: 'text-violet-600',  icon: '📈', tip: 'Valor en venta − Valor en compra' },
                            { label: 'Bajo stock',            value: kpis.bajo_stock,                   color: 'text-amber-600',   icon: '⚠️', tip: 'Stock actual ≤ stock mínimo configurado' },
                            { label: 'Agotados',              value: kpis.agotados,                     color: 'text-red-600',     icon: '🚨', tip: 'Stock = 0' },
                        ].map(({ label, value, color, icon, tip }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 group relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xl">{icon}</span>
                                    {tip && (
                                        <div className="relative">
                                            <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 cursor-help"
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="absolute right-0 top-5 w-52 bg-gray-800 text-white text-xs rounded-xl p-2.5 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 shadow-lg">
                                                {tip}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ── Resumen por categoría ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900">Resumen por categoría</h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Distribución de unidades, costos y ganancias agrupadas por categoría
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {[
                                        { h: 'Categoría',          align: 'left'   },
                                        { h: 'Productos',          align: 'right'  },
                                        { h: 'Unidades en stock',  align: 'right'  },
                                        { h: 'Valor en venta',     align: 'right'  },
                                        { h: 'Costo de compra',    align: 'right'  },
                                        { h: 'Ganancia potencial', align: 'right'  },
                                        { h: 'Bajo stock',         align: 'center' },
                                        { h: 'Agotados',           align: 'center' },
                                    ].map(({ h, align }) => (
                                        <th key={h} className={`px-6 py-3 text-${align} text-xs font-semibold text-gray-500 uppercase tracking-wider`}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {catPaginadas.map(cat => (
                                    <tr key={cat.categoria} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900">{cat.categoria}</p>
                                            <div className="mt-1.5 w-28 bg-gray-100 rounded-full h-1.5">
                                                <div className="h-1.5 bg-orange-400 rounded-full transition-all"
                                                     style={{ width: `${Math.min(100, (cat.total_stock / maxStock) * 100)}%` }} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-600">{cat.total_productos}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-bold text-gray-900">{cat.total_stock}</span>
                                            <span className="text-xs text-gray-400 ml-1">uds</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-semibold text-emerald-600">{fmt(cat.valor_venta)}</td>
                                        <td className="px-6 py-4 text-right text-sm text-blue-600">
                                            {cat.valor_compra > 0 ? fmt(cat.valor_compra) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-semibold text-violet-600">
                                            {cat.ganancia_potencial > 0 ? fmt(cat.ganancia_potencial) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {cat.bajo_stock > 0
                                                ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{cat.bajo_stock}</span>
                                                : <span className="text-xs text-gray-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {cat.agotados > 0
                                                ? <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{cat.agotados}</span>
                                                : <span className="text-xs text-gray-300">—</span>}
                                        </td>
                                    </tr>
                                ))}
                                {porCategoria.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-400 text-sm">No hay categorías registradas</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <Paginador pagina={paginaCat} total={porCategoria.length} porPagina={CAT_POR_PAG} onChange={setPaginaCat} />
                    </div>

                    {/* ── Tabla de productos ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Tabs */}
                        <div className="border-b border-gray-100">
                            <div className="flex items-center gap-1 px-6 pt-4">
                                <button onClick={() => cambiarVista('criticos')}
                                        className={`px-4 py-2 rounded-t-xl text-sm font-medium transition border-b-2 -mb-px
                                        ${vistaProductos === 'criticos'
                                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    ⚠️ Productos críticos
                                    {criticos.length > 0 && (
                                        <span className="ml-2 bg-orange-100 text-orange-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {criticos.length}
                                        </span>
                                    )}
                                </button>
                                <button onClick={() => cambiarVista('todos')}
                                        className={`px-4 py-2 rounded-t-xl text-sm font-medium transition border-b-2 -mb-px
                                        ${vistaProductos === 'todos'
                                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    📦 Todos los productos
                                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {productos.length}
                                    </span>
                                </button>
                            </div>
                            <div className="px-6 pb-3 pt-1">
                                <p className="text-xs text-gray-400">
                                    {vistaProductos === 'criticos'
                                        ? 'Productos con stock agotado o por debajo del mínimo configurado. Requieren atención inmediata.'
                                        : 'Listado completo del inventario. Usa los filtros para encontrar productos específicos.'}
                                </p>
                            </div>
                        </div>

                        {/* Filtros — solo en "todos" */}
                        {vistaProductos === 'todos' && (
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                                <div className="flex flex-wrap gap-2.5 items-center">

                                    {/* Buscador */}
                                    <div className="relative flex-1 min-w-48">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input type="text" placeholder="Buscar por nombre o categoría..."
                                               value={busqueda} onChange={(e) => cambiarBusqueda(e.target.value)}
                                               className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white" />
                                        {busqueda && (
                                            <button onClick={() => cambiarBusqueda('')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown categoría — con paginador interno */}
                                    <CategoriaDropdown
                                        value={filtroCat}
                                        onChange={cambiarCat}
                                        categorias={categorias}
                                    />

                                    {/* Dropdown estado */}
                                    <EstadoDropdown value={filtroEstado} onChange={cambiarEstado} />

                                    {/* Limpiar */}
                                    {hayFiltros && (
                                        <button onClick={() => { cambiarBusqueda(''); cambiarCat(''); cambiarEstado(''); }}
                                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Limpiar filtros
                                        </button>
                                    )}
                                </div>
                                {hayFiltros && (
                                    <p className="text-xs text-gray-500 mt-2.5">
                                        <span className="font-semibold text-gray-700">{productosFiltrados.length}</span> de {productos.length} productos
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tabla productos */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left   text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left   text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="px-6 py-3 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock actual</th>
                                    <th className="px-6 py-3 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock mínimo</th>
                                    <th className="px-6 py-3 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio de compra</th>
                                    <th className="px-6 py-3 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio de venta</th>
                                    <th className="px-6 py-3 text-right  text-xs font-semibold text-gray-500 uppercase tracking-wider">Margen por unidad</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {prodPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-14 text-center">
                                            <div className="text-3xl mb-2">{vistaProductos === 'criticos' ? '✅' : '🔍'}</div>
                                            <p className="text-sm font-medium text-gray-600">
                                                {vistaProductos === 'criticos' ? 'No hay productos críticos' : 'Sin resultados para los filtros aplicados'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {vistaProductos === 'criticos' ? 'Todos los productos tienen stock suficiente' : 'Prueba ajustando o limpiando los filtros'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    prodPaginados.map(p => {
                                        const margen = p.precio_compra > 0 ? p.precio - p.precio_compra : null;
                                        return (
                                            <tr key={p.id} className={`hover:bg-gray-50 transition
                                                ${p.stock === 0             ? 'bg-red-50/30'   :
                                                p.stock <= p.stock_minimo ? 'bg-amber-50/30' : ''}`}>
                                                <td className="px-6 py-3.5">
                                                    <p className="text-sm font-semibold text-gray-900">{p.nombre}</p>
                                                    {p.codigo_barras && <p className="text-xs text-gray-400 mt-0.5">{p.codigo_barras}</p>}
                                                </td>
                                                <td className="px-6 py-3.5 text-sm text-gray-500">{p.categoria}</td>
                                                <td className="px-6 py-3.5 text-right">
                                                    <span className="text-sm font-bold text-gray-900">{p.stock}</span>
                                                    <span className="text-xs text-gray-400 ml-1">uds</span>
                                                </td>
                                                <td className="px-6 py-3.5 text-right text-sm text-gray-400">{p.stock_minimo} uds</td>
                                                <td className="px-6 py-3.5 text-right text-sm text-blue-600">
                                                    {p.precio_compra > 0 ? fmt(p.precio_compra) : <span className="text-gray-300 text-xs">No registrado</span>}
                                                </td>
                                                <td className="px-6 py-3.5 text-right text-sm font-semibold text-gray-800">{fmt(p.precio)}</td>
                                                <td className="px-6 py-3.5 text-right text-sm">
                                                    {margen !== null
                                                        ? <span className={`font-semibold ${margen >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {margen >= 0 ? '+' : ''}{fmt(margen)}
                                                          </span>
                                                        : <span className="text-gray-300">—</span>}
                                                </td>
                                                <td className="px-6 py-3.5 text-center">
                                                    <EstadoBadge stock={p.stock} minimo={p.stock_minimo} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Paginador pagina={paginaProd} total={productosFiltrados.length} porPagina={PROD_POR_PAG} onChange={setPaginaProd} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
