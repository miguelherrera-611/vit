import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const GRADIENTS = {
    pink:   'from-pink-500 via-rose-500 to-red-400',
    blue:   'from-blue-500 via-indigo-500 to-violet-500',
    violet: 'from-violet-500 via-purple-500 to-fuchsia-500',
    green:  'from-emerald-500 via-teal-500 to-cyan-500',
    orange: 'from-orange-400 via-amber-500 to-yellow-400',
    teal:   'from-teal-500 via-cyan-500 to-sky-500',
    red:    'from-red-500 via-rose-500 to-pink-400',
};

const SOFT_COLORS = {
    pink:   { bg: 'bg-pink-50',    border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700',   ring: 'hover:ring-pink-300',   icon: 'text-pink-400'   },
    blue:   { bg: 'bg-blue-50',    border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700',   ring: 'hover:ring-blue-300',   icon: 'text-blue-400'   },
    violet: { bg: 'bg-violet-50',  border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', ring: 'hover:ring-violet-300', icon: 'text-violet-400' },
    green:  { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', ring: 'hover:ring-emerald-300', icon: 'text-emerald-400' },
    orange: { bg: 'bg-orange-50',  border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', ring: 'hover:ring-orange-300', icon: 'text-orange-400' },
    teal:   { bg: 'bg-teal-50',    border: 'border-teal-200',  badge: 'bg-teal-100 text-teal-700',   ring: 'hover:ring-teal-300',   icon: 'text-teal-400'   },
    red:    { bg: 'bg-red-50',     border: 'border-red-200',   badge: 'bg-red-100 text-red-700',     ring: 'hover:ring-red-300',    icon: 'text-red-400'    },
};

export default function CategoriasShow({ grupo, subcategorias = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing,   setProcessing]   = useState(false);
    const [pwdError,     setPwdError]     = useState(null);

    const gradient = GRADIENTS[grupo.color] || GRADIENTS.violet;
    const soft     = SOFT_COLORS[grupo.color] || SOFT_COLORS.violet;
    const hasImg   = !!grupo.imagen;

    const totalProductos = subcategorias.reduce((s, c) => s + (c.total_productos || 0), 0);

    const handleDelete = (password) => {
        setProcessing(true);
        router.delete(`/categorias/${grupo.id}/subcategorias/${deleteTarget.id}`, {
            data: { password },
            onSuccess: () => { setDeleteTarget(null); setProcessing(false); setPwdError(null); },
            onError:   (errs) => { setPwdError(errs.password || 'Contraseña incorrecta.'); setProcessing(false); },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                {/* ── Banner del grupo ── */}
                <div className="relative overflow-hidden" style={{ minHeight: '220px' }}>
                    {hasImg ? (
                        <img src={`/storage/${grupo.imagen}`} alt={grupo.nombre}
                             className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    )}
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="relative max-w-7xl mx-auto px-6 py-10 flex items-end justify-between" style={{ minHeight: '220px' }}>
                        <div>
                            <Link href="/categorias"
                                  className="inline-flex items-center space-x-2 text-white/80 hover:text-white text-sm mb-4 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span>Categorías</span>
                            </Link>
                            <h1 className="text-5xl font-black text-white capitalize tracking-tight drop-shadow-lg">
                                {grupo.nombre}
                            </h1>
                            <p className="text-white/70 mt-2 text-sm">
                                {subcategorias.length} subcategorías · {totalProductos} productos
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/categorias/${grupo.id}/edit`}
                                className="flex items-center space-x-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition border border-white/30"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Editar categoría</span>
                            </Link>
                            <Link
                                href={`/categorias/${grupo.id}/subcategorias/crear`}
                                className="flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-semibold transition shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nueva subcategoría</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Lista de subcategorías ── */}
                <div className="max-w-7xl mx-auto px-6 py-10">
                    {subcategorias.length === 0 ? (
                        <div className="text-center py-20">
                            <div className={`w-16 h-16 ${soft.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                <svg className={`w-8 h-8 ${soft.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 font-medium">No hay subcategorías todavía</p>
                            <p className="text-gray-400 text-sm mt-1">Agrega la primera subcategoría</p>
                            <Link
                                href={`/categorias/${grupo.id}/subcategorias/crear`}
                                className="inline-flex items-center space-x-2 mt-4 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Agregar subcategoría</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {subcategorias.map((sub) => (
                                <div key={sub.id}
                                     className={`group bg-white rounded-2xl shadow-sm border ${soft.border} overflow-hidden hover:shadow-md hover:ring-2 ${soft.ring} transition-all`}>

                                    {/* Imagen o placeholder */}
                                    <div className={`h-32 ${soft.bg} flex items-center justify-center overflow-hidden`}>
                                        {sub.imagen ? (
                                            <img src={`/storage/${sub.imagen}`} alt={sub.nombre}
                                                 className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className={`w-10 h-10 ${soft.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-base">{sub.nombre}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${soft.badge}`}>
                                                {sub.total_productos} prod.
                                            </span>
                                        </div>
                                        {sub.descripcion && (
                                            <p className="text-xs text-gray-400 mt-1 truncate">{sub.descripcion}</p>
                                        )}

                                        {/* Acciones */}
                                        <div className="flex items-center space-x-2 mt-3">
                                            <Link
                                                href={`/categorias/${grupo.id}/subcategorias/${sub.id}/edit`}
                                                className={`flex-1 text-center text-xs py-2 ${soft.bg} ${soft.icon} rounded-lg hover:opacity-80 transition font-medium`}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => { setDeleteTarget(sub); setPwdError(null); }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PasswordConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                processing={processing}
                error={pwdError}
                title={`¿Eliminar "${deleteTarget?.nombre}"?`}
                description="Los productos de esta subcategoría se moverán a la papelera. Podrás recuperarlos en 30 días."
                confirmLabel="Sí, eliminar"
            />
        </AppLayout>
    );
}
