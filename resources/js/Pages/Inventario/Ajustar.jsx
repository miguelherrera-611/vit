import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';

const MOTIVOS = {
    incremento: [
        { value: 'Ingreso mercancía', label: 'Ingreso de mercancía',   icon: '📦' },
        { value: 'Devolución',        label: 'Devolución de cliente',  icon: '↩️' },
        { value: 'Error conteo',      label: 'Error de conteo',        icon: '🔢' },
        { value: 'Otro',              label: 'Otro',                   icon: '📝' },
    ],
    decremento: [
        { value: 'Daño',         label: 'Daño',                   icon: '💔' },
        { value: 'Robo',         label: 'Robo',                   icon: '🚨' },
        { value: 'Devolución',   label: 'Devolución a proveedor', icon: '↩️' },
        { value: 'Error conteo', label: 'Error de conteo',        icon: '🔢' },
        { value: 'Otro',         label: 'Otro',                   icon: '📝' },
    ],
};

const PRODUCTOS_POR_PAGINA = 6;

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ── Dropdown de motivo (simple) ──────────────────────────────────────────────
function MotivoSelect({ value, onChange, options, placeholder, error }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = options.find(o => o.value === value);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-gray-50 transition text-left
                    ${error ? 'border-red-400' : open ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <span className={`text-sm flex items-center gap-2 ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {selected ? <><span>{selected.icon}</span><span>{selected.label}</span></> : placeholder}
                </span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-dropdown">
                    {options.map((opt, i) => {
                        const sel = opt.value === value;
                        return (
                            <button key={opt.value} type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition
                                    ${sel ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                    ${i < options.length - 1 ? 'border-b border-gray-50' : ''}`}
                            >
                                <span className="text-lg">{opt.icon}</span>
                                <span className={`text-sm font-medium flex-1 ${sel ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
                                {sel && (
                                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// ── Dropdown de producto con buscador + paginación ───────────────────────────
function ProductoSelect({ productos, value, onChange, error }) {
    const [open, setOpen]         = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina]     = useState(1);
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

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        return q
            ? productos.filter(p => normalize(p.nombre).includes(q) || normalize(p.categoria).includes(q))
            : productos;
    }, [productos, busqueda]);

    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    const productosPag = productosFiltrados.slice(
        (pagina - 1) * PRODUCTOS_POR_PAGINA,
        pagina * PRODUCTOS_POR_PAGINA
    );
    const seleccionado = productos.find(p => String(p.id) === String(value));

    const badgeStock = (stock) => {
        if (stock === 0) return 'bg-red-100 text-red-700';
        if (stock <= 5)  return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    return (
        <div ref={ref} className="relative">
            {/* ── Trigger ── */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-gray-50 transition text-left
                    ${error ? 'border-red-400' : open ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
            >
                {seleccionado ? (
                    <span className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-800 truncate">{seleccionado.nombre}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${badgeStock(seleccionado.stock)}`}>
                            {seleccionado.stock} uds
                        </span>
                    </span>
                ) : (
                    <span className="text-sm text-gray-400">Selecciona un producto...</span>
                )}
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* ── Panel ── */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-dropdown">

                    {/* Buscador */}
                    <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por nombre o categoría..."
                                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                            />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 px-1">
                            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
                            {busqueda && ` para "${busqueda}"`}
                        </p>
                    </div>

                    {/* Lista de productos */}
                    <div>
                        {productosPag.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-400">Sin resultados para <strong>"{busqueda}"</strong></p>
                                <button type="button" onClick={() => setBusqueda('')}
                                        className="mt-2 text-xs text-blue-600 hover:underline">
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : (
                            productosPag.map((p, i) => {
                                const sel = String(p.id) === String(value);
                                return (
                                    <button key={p.id} type="button"
                                            onClick={() => { onChange(String(p.id)); setOpen(false); }}
                                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition
                                            ${sel ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                            ${i < productosPag.length - 1 ? 'border-b border-gray-50' : ''}`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium truncate ${sel ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {p.nombre}
                                            </p>
                                            {p.categoria && (
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{p.categoria}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badgeStock(p.stock)}`}>
                                                {p.stock} uds
                                            </span>
                                            {sel && (
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* ── Paginación ── */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                            <button type="button"
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Anterior
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" onClick={() => setPagina(n)}
                                            className={`w-7 h-7 rounded-lg text-xs font-semibold transition
                                            ${n === pagina ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-white'}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>

                            <button type="button"
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={pagina === totalPaginas}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Siguiente
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default function InventarioAjustar({ productos = [] }) {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        producto_id:   '',
        tipo_ajuste:   'incremento',
        cantidad:      '1',
        motivo:        '',
        observaciones: '',
    });

    const handleProductoChange = (id) => {
        setData('producto_id', id);
        setProductoSeleccionado(productos.find(p => String(p.id) === id) || null);
    };

    const handleTipoChange = (tipo) => {
        setData(prev => ({ ...prev, tipo_ajuste: tipo, motivo: '' }));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/inventario/ajustar');
    };

    const resultado = useMemo(() => {
        if (!productoSeleccionado || !data.cantidad) return null;
        const cant = parseInt(data.cantidad) || 0;
        return data.tipo_ajuste === 'incremento'
            ? productoSeleccionado.stock + cant
            : Math.max(0, productoSeleccionado.stock - cant);
    }, [productoSeleccionado, data.cantidad, data.tipo_ajuste]);

    const motivosActuales = MOTIVOS[data.tipo_ajuste];

    return (
        <AppLayout>
            <style>{`
                @keyframes dropdownIn {
                    from { opacity:0; transform:translateY(-8px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1);   }
                }
                .animate-dropdown { animation: dropdownIn 0.18s cubic-bezier(0.16,1,0.3,1); }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* ── Header ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/inventario" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Ajuste de Stock</h1>
                                <p className="mt-0.5 text-sm text-gray-500">Modifica el inventario con justificación obligatoria</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    <form onSubmit={submit}>
                        <div className="space-y-5">

                            {/* ── Paso 1: Producto ── */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8">
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Producto a Ajustar</h2>
                                </div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Producto <span className="text-red-500">*</span>
                                </label>

                                <ProductoSelect
                                    productos={productos}
                                    value={data.producto_id}
                                    onChange={handleProductoChange}
                                    error={errors.producto_id}
                                />
                                {errors.producto_id && (
                                    <p className="mt-1.5 text-sm text-red-600">{errors.producto_id}</p>
                                )}

                                {productoSeleccionado && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-blue-900 truncate">{productoSeleccionado.nombre}</p>
                                            <p className="text-xs text-blue-500 mt-0.5">{productoSeleccionado.categoria || 'Sin categoría'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-2xl font-bold text-blue-700">{productoSeleccionado.stock}</p>
                                            <p className="text-xs text-blue-500">Stock actual</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Paso 2: Tipo + Cantidad + Motivo ── */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8">
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Tipo de Ajuste</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <button type="button" onClick={() => handleTipoChange('incremento')}
                                            className={`p-4 rounded-xl border-2 transition text-center
                                            ${data.tipo_ajuste === 'incremento'
                                                ? 'border-green-500 bg-green-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition
                                            ${data.tipo_ajuste === 'incremento' ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className={`font-semibold text-sm sm:text-base ${data.tipo_ajuste === 'incremento' ? 'text-green-700' : 'text-gray-600'}`}>Incremento</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Aumentar stock</p>
                                    </button>

                                    <button type="button" onClick={() => handleTipoChange('decremento')}
                                            className={`p-4 rounded-xl border-2 transition text-center
                                            ${data.tipo_ajuste === 'decremento'
                                                ? 'border-red-500 bg-red-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition
                                            ${data.tipo_ajuste === 'decremento' ? 'bg-red-500' : 'bg-gray-200'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </div>
                                        <p className={`font-semibold text-sm sm:text-base ${data.tipo_ajuste === 'decremento' ? 'text-red-700' : 'text-gray-600'}`}>Decremento</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Reducir stock</p>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Cantidad con botones +/- */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                                            <button type="button"
                                                    onClick={() => setData('cantidad', String(Math.max(1, parseInt(data.cantidad || 1) - 1)))}
                                                    className="px-4 py-3 text-gray-500 hover:bg-gray-100 transition text-lg font-bold flex-shrink-0">−</button>
                                            <input type="number" value={data.cantidad}
                                                   onChange={(e) => setData('cantidad', e.target.value)}
                                                   className="flex-1 text-center py-3 bg-transparent focus:outline-none text-gray-800 font-semibold text-lg w-0"
                                                   min="1" />
                                            <button type="button"
                                                    onClick={() => setData('cantidad', String(parseInt(data.cantidad || 0) + 1))}
                                                    className="px-4 py-3 text-gray-500 hover:bg-gray-100 transition text-lg font-bold flex-shrink-0">+</button>
                                        </div>
                                        {errors.cantidad && <p className="mt-1.5 text-sm text-red-600">{errors.cantidad}</p>}
                                    </div>

                                    {/* Motivo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Motivo <span className="text-red-500">*</span>
                                        </label>
                                        <MotivoSelect
                                            value={data.motivo}
                                            onChange={(v) => setData('motivo', v)}
                                            placeholder="Selecciona un motivo..."
                                            error={errors.motivo}
                                            options={motivosActuales}
                                        />
                                        {errors.motivo && <p className="mt-1.5 text-sm text-red-600">{errors.motivo}</p>}
                                    </div>
                                </div>

                                {/* Preview stock resultante */}
                                {productoSeleccionado && resultado !== null && (
                                    <div className={`mt-5 p-4 rounded-xl flex items-center justify-between
                                        ${data.tipo_ajuste === 'incremento'
                                        ? 'bg-green-50 border border-green-100'
                                        : 'bg-red-50 border border-red-100'}`}>
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5
                                                ${data.tipo_ajuste === 'incremento' ? 'text-green-600' : 'text-red-600'}`}>
                                                Stock resultante
                                            </p>
                                            <p className="text-xs text-gray-500">Después de aplicar el ajuste</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Actual</p>
                                                <p className="text-xl font-bold text-gray-600">{productoSeleccionado.stock}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Nuevo</p>
                                                <p className={`text-2xl font-bold ${data.tipo_ajuste === 'incremento' ? 'text-green-700' : 'text-red-700'}`}>
                                                    {resultado}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Paso 3: Observaciones ── */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">Observaciones</h2>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 ml-9">Obligatorio: describe el motivo detallado del ajuste</p>
                                <textarea
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none text-sm"
                                    placeholder="Describe el motivo del ajuste con detalle suficiente..."
                                />
                                <div className="flex justify-between mt-1.5">
                                    {errors.observaciones
                                        ? <p className="text-sm text-red-600">{errors.observaciones}</p>
                                        : <p className="text-xs text-gray-400">Mínimo 5 caracteres</p>
                                    }
                                    <span className={`text-xs font-medium ${data.observaciones.length >= 5 ? 'text-green-600' : 'text-gray-400'}`}>
                                        {data.observaciones.length} caracteres
                                    </span>
                                </div>
                            </div>

                            {/* ── Botones ── */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="submit" disabled={processing}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base">
                                    {processing ? 'Aplicando ajuste...' : 'Aplicar Ajuste'}
                                </button>
                                <Link href="/inventario"
                                      className="flex-1 text-center bg-gray-100 text-gray-700 py-3.5 px-6 rounded-xl font-semibold hover:bg-gray-200 transition text-sm sm:text-base">
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
