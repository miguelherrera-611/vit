import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

// Normaliza texto quitando tildes para búsqueda
const normalize = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Hook para cerrar dropdown al hacer clic fuera
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

// ─── Dropdown genérico ──────────────────────────────────────────────────────
function FilterDropdown({ label, icon, value, options, onChange, accentColor = 'blue' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setOpen(false));

    const activeOption = options.find(o => o.value === value);
    const isActive = value !== '';

    const colors = {
        blue:   { btn: 'border-blue-400 bg-blue-50 text-blue-700',   dot: 'bg-blue-500',   item: 'bg-blue-50 text-blue-700' },
        orange: { btn: 'border-orange-400 bg-orange-50 text-orange-700', dot: 'bg-orange-500', item: 'bg-orange-50 text-orange-700' },
    };
    const c = colors[accentColor];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isActive
                        ? `${c.btn} shadow-sm`
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
                {isActive && <span className={`w-2 h-2 rounded-full ${c.dot}`} />}
                {icon}
                <span>{isActive ? activeOption?.label : label}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm text-left transition hover:bg-gray-50 ${
                                value === opt.value ? `${c.item} font-medium` : 'text-gray-700'
                            }`}
                        >
                            {opt.dot && (
                                <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                            )}
                            <span className="flex-1">{opt.label}</span>
                            {value === opt.value && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

// ─── Componente principal ───────────────────────────────────────────────────
export default function ProductosIndex({ productos = [] }) {
    const [busqueda, setBusqueda]             = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroStock, setFiltroStock]       = useState('');
    const [confirmDelete, setConfirmDelete]   = useState(null);
    const [delProcessing, setDelProcessing]   = useState(false);
    const [delError, setDelError]             = useState(null);

    // Extraer categorías únicas de los productos
    const opcionesCategorias = useMemo(() => {
        const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
        return [
            { value: '', label: 'Todas las categorías' },
            ...cats.map(c => ({ value: c, label: c })),
        ];
    }, [productos]);

    const opcionesStock = [
        { value: '',        label: 'Todo el stock' },
        { value: 'disponible', label: 'Con stock',    dot: 'bg-green-500' },
        { value: 'bajo',    label: 'Bajo stock',      dot: 'bg-yellow-400' },
        { value: 'agotado', label: 'Agotado',         dot: 'bg-red-500' },
    ];

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        return productos.filter((p) => {
            // Texto
            if (q) {
                const match =
                    normalize(p.nombre).includes(q) ||
                    normalize(p.codigo_barras).includes(q) ||
                    normalize(p.categoria).includes(q);
                if (!match) return false;
            }
            // Categoría
            if (filtroCategoria && p.categoria !== filtroCategoria) return false;
            // Stock
            const minimo = p.stock_minimo || 5;
            if (filtroStock === 'disponible' && p.stock <= 0) return false;
            if (filtroStock === 'bajo'       && !(p.stock > 0 && p.stock <= minimo)) return false;
            if (filtroStock === 'agotado'    && p.stock > 0) return false;
            return true;
        });
    }, [productos, busqueda, filtroCategoria, filtroStock]);

    const hayFiltros = busqueda || filtroCategoria || filtroStock;

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
        new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', minimumFractionDigits: 0,
        }).format(v);

    // Stats rápidas
    const stats = useMemo(() => ({
        total:    productos.length,
        bajo:     productos.filter(p => p.stock > 0 && p.stock <= (p.stock_minimo || 5)).length,
        agotado:  productos.filter(p => p.stock === 0).length,
    }), [productos]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* ── Header ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Productos</h1>
                                <p className="mt-1 text-sm text-gray-500">{productos.length} productos en total</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/categorias"
                                    className="flex items-center space-x-2 px-5 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition"
                                >
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span>Categorías</span>
                                </Link>
                                <Link
                                    href="/productos/crear"
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Nuevo Producto</span>
                                </Link>
                            </div>
                        </div>

                        {/* Alertas rápidas de stock */}
                        {(stats.bajo > 0 || stats.agotado > 0) && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {stats.agotado > 0 && (
                                    <button
                                        onClick={() => setFiltroStock('agotado')}
                                        className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition"
                                    >
                                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                                        <span>{stats.agotado} agotado{stats.agotado > 1 ? 's' : ''} — ver</span>
                                    </button>
                                )}
                                {stats.bajo > 0 && (
                                    <button
                                        onClick={() => setFiltroStock('bajo')}
                                        className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-medium rounded-lg hover:bg-yellow-100 transition"
                                    >
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                                        <span>{stats.bajo} bajo stock — ver</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Barra de búsqueda + filtros ── */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            {/* Búsqueda */}
                            <div className="relative flex-1">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar por nombre, código o categoría..."
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition bg-gray-50"
                                />
                                {busqueda && (
                                    <button
                                        onClick={() => setBusqueda('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Filtro categoría */}
                            <FilterDropdown
                                label="Categoría"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                }
                                value={filtroCategoria}
                                options={opcionesCategorias}
                                onChange={setFiltroCategoria}
                                accentColor="blue"
                            />

                            {/* Filtro stock */}
                            <FilterDropdown
                                label="Stock"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                }
                                value={filtroStock}
                                options={opcionesStock}
                                onChange={setFiltroStock}
                                accentColor="orange"
                            />

                            {/* Limpiar filtros */}
                            {hayFiltros && (
                                <button
                                    onClick={() => { setBusqueda(''); setFiltroCategoria(''); setFiltroStock(''); }}
                                    className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition flex items-center space-x-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>Limpiar</span>
                                </button>
                            )}
                        </div>

                        {/* Contador resultados cuando hay filtro */}
                        {hayFiltros && (
                            <p className="mt-3 text-sm text-gray-500">
                                Mostrando <span className="font-medium text-gray-900">{productosFiltrados.length}</span> de {productos.length} productos
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Tabla ── */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {productosFiltrados.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p className="font-medium text-gray-700 mb-1">
                                    {hayFiltros ? 'Sin resultados para estos filtros' : 'No hay productos registrados'}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {hayFiltros ? 'Prueba ajustando o limpiando los filtros' : 'Comienza agregando tu primer producto'}
                                </p>
                                {hayFiltros && (
                                    <button
                                        onClick={() => { setBusqueda(''); setFiltroCategoria(''); setFiltroStock(''); }}
                                        className="mt-4 px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4" />
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {productosFiltrados.map((producto) => {
                                    const minimo = producto.stock_minimo || 5;
                                    const agotado = producto.stock === 0;
                                    const bajo    = producto.stock > 0 && producto.stock <= minimo;

                                    return (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    {producto.imagen ? (
                                                        <img
                                                            src={`/storage/${producto.imagen}`}
                                                            alt={producto.nombre}
                                                            className="w-12 h-12 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                                                        {producto.codigo_barras && (
                                                            <p className="text-xs text-gray-400 mt-0.5">{producto.codigo_barras}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">{producto.categoria || '—'}</span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-gray-900">{formatCurrency(producto.precio)}</span>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                        <span className={`font-semibold ${agotado ? 'text-red-600' : bajo ? 'text-yellow-600' : 'text-gray-900'}`}>
                                                            {producto.stock}
                                                        </span>
                                                    {agotado && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Agotado</span>
                                                    )}
                                                    {bajo && (
                                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Bajo</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${producto.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/productos/${producto.id}/edit`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => setConfirmDelete(producto)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modal eliminar con contraseña ── */}
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
