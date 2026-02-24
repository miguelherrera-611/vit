import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const formatCurrency = (v) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0,
    }).format(v);

export default function CategoriasShow({ categoria, productos = [] }) {
    const [busqueda, setBusqueda]     = useState('');
    const [showDelete, setShowDelete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [pwdError, setPwdError]     = useState(null);

    const tipo  = categoria.tipo || 'custom';
    const isPink = tipo === 'dama';

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        if (!q) return productos;
        return productos.filter(
            (p) => normalize(p.nombre).includes(q) || normalize(p.codigo_barras).includes(q)
        );
    }, [productos, busqueda]);

    const stats = useMemo(() => ({
        total:   productos.length,
        activos: productos.filter((p) => p.activo).length,
        bajo:    productos.filter((p) => p.stock > 0 && p.stock <= (p.stock_minimo || 5)).length,
        agotado: productos.filter((p) => p.stock === 0).length,
    }), [productos]);

    const handleDelete = (password) => {
        setProcessing(true);
        router.delete(`/categorias/${categoria.id}`, {
            data: { password },
            onSuccess: () => { setShowDelete(false); setProcessing(false); },
            onError: (errs) => { setPwdError(errs.password || 'Error.'); setProcessing(false); },
        });
    };

    const colorBadge   = isPink ? 'bg-pink-100 text-pink-700'   : 'bg-blue-100 text-blue-700';
    const colorGradient = isPink ? 'from-pink-500 to-rose-500'   : 'from-blue-500 to-indigo-600';
    const colorBtn     = isPink ? 'from-pink-600 to-rose-600'    : 'from-blue-600 to-indigo-700';

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* Header */}
                <div className={`bg-gradient-to-r ${colorGradient} text-white`}>
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/categorias"
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <p className="text-sm opacity-75 uppercase tracking-widest mb-0.5">
                                        {tipo === 'dama' ? 'Dama' : tipo === 'caballero' ? 'Caballero' : 'Personalizada'} · Subcategoría
                                    </p>
                                    <h1 className="text-3xl font-bold">{categoria.nombre}</h1>
                                    {categoria.descripcion && (
                                        <p className="text-sm opacity-75 mt-1">{categoria.descripcion}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link
                                    href={`/categorias/${categoria.id}/edit`}
                                    className="flex items-center space-x-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Editar</span>
                                </Link>
                                <button
                                    onClick={() => { setShowDelete(true); setPwdError(null); }}
                                    className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/80 hover:bg-red-600 rounded-xl text-sm font-medium transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>

                        {/* Mini stats */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total productos',  value: stats.total },
                                { label: 'Activos',          value: stats.activos },
                                { label: 'Bajo stock',       value: stats.bajo   },
                                { label: 'Agotados',         value: stats.agotado },
                            ].map((s) => (
                                <div key={s.label} className="bg-white/15 rounded-2xl px-4 py-3">
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Barra buscador + botón nuevo */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar productos en esta categoría..."
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white transition text-sm"
                            />
                        </div>
                        <Link
                            href={`/productos/crear?categoria=${encodeURIComponent(categoria.label_completo)}`}
                            className={`flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r ${colorBtn} text-white rounded-xl text-sm font-medium hover:shadow-md transition`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nuevo Producto</span>
                        </Link>
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {productosFiltrados.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p className="font-medium text-gray-700">
                                    {busqueda ? 'Sin resultados' : 'No hay productos en esta categoría'}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {busqueda ? 'Prueba otro término' : 'Agrega el primer producto'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4" />
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {productosFiltrados.map((p) => {
                                    const minimo  = p.stock_minimo || 5;
                                    const agotado = p.stock === 0;
                                    const bajo    = p.stock > 0 && p.stock <= minimo;

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    {p.imagen ? (
                                                        <img src={`/storage/${p.imagen}`} alt={p.nombre}
                                                             className="w-10 h-10 rounded-xl object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{p.nombre}</p>
                                                        {p.codigo_barras && (
                                                            <p className="text-xs text-gray-400">{p.codigo_barras}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-gray-900 text-sm">{formatCurrency(p.precio)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-1.5">
                                                        <span className={`font-semibold text-sm ${agotado ? 'text-red-600' : bajo ? 'text-yellow-600' : 'text-gray-900'}`}>
                                                            {p.stock}
                                                        </span>
                                                    {agotado && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Agotado</span>}
                                                    {bajo    && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Bajo</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {p.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/productos/${p.id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition block"
                                                    title="Editar"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
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

            <PasswordConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={processing}
                error={pwdError}
                title={`¿Eliminar "${categoria.nombre}"?`}
                description={`Se eliminarán esta categoría y sus ${stats.total} producto(s). Podrás recuperarlos desde la papelera durante 30 días.`}
                confirmLabel="Eliminar"
            />
        </AppLayout>
    );
}
