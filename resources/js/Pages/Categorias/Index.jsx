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

function GrupoCard({ grupo, onEdit, onDelete }) {
    const gradient = GRADIENTS[grupo.color] || GRADIENTS.violet;
    const hasImg   = !!grupo.imagen;

    return (
        <div className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
             style={{ minHeight: '280px' }}>

            {/* Fondo: imagen o degradado */}
            {hasImg ? (
                <img
                    src={`/storage/${grupo.imagen}`}
                    alt={grupo.nombre}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-all duration-300" />

            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                     backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                     backgroundSize: '40px 40px'
                 }} />

            {/* Botones editar / eliminar */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(grupo); }}
                    className="p-2.5 bg-white/95 hover:bg-white rounded-2xl shadow-lg text-gray-700 hover:text-violet-600 transition-all"
                    title="Editar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(grupo); }}
                    className="p-2.5 bg-white/95 hover:bg-white rounded-2xl shadow-lg text-gray-700 hover:text-red-600 transition-all"
                    title="Eliminar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Área clickeable → subcategorías */}
            <Link
                href={`/categorias/${grupo.id}`}
                className="absolute inset-0 flex flex-col justify-end p-8 z-10"
            >
                <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                        Categoría Principal
                    </span>
                </div>

                <div>
                    <h2 className="text-5xl font-black text-white capitalize tracking-tight drop-shadow-lg leading-none mb-2">
                        {grupo.nombre}
                    </h2>
                    <div className="flex items-center space-x-3 text-white/80 text-sm">
                        <span>{grupo.total_subcat} subcategorías</span>
                        <span className="opacity-50">·</span>
                        <span>{grupo.total_productos} productos</span>
                    </div>
                    {grupo.descripcion && (
                        <p className="text-white/60 text-xs mt-1">{grupo.descripcion}</p>
                    )}
                </div>

                {/* Flecha */}
                <div className="absolute bottom-6 right-6 w-11 h-11 bg-white/20 group-hover:bg-white/40 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </div>
    );
}

export default function CategoriasIndex({ grupos = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing,   setProcessing]   = useState(false);
    const [pwdError,     setPwdError]     = useState(null);

    const handleDelete = (password) => {
        setProcessing(true);
        router.delete(`/categorias/${deleteTarget.id}`, {
            data: { password },
            onSuccess: () => { setDeleteTarget(null); setProcessing(false); setPwdError(null); },
            onError:   (errs) => { setPwdError(errs.password || 'Contraseña incorrecta.'); setProcessing(false); },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Haz clic en una categoría para ver sus subcategorías y productos
                                </p>
                            </div>
                            <Link
                                href="/categorias/crear"
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nueva Categoría</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {grupos.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-gray-400">No hay categorías todavía</p>
                            <p className="text-sm text-gray-400 mt-1">Crea tu primera categoría con el botón de arriba</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {grupos.map((grupo) => (
                                <GrupoCard
                                    key={grupo.id}
                                    grupo={grupo}
                                    onEdit={(g) => { window.location.href = `/categorias/${g.id}/edit`; }}
                                    onDelete={(g) => { setDeleteTarget(g); setPwdError(null); }}
                                />
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
                description={
                    <span>
                        Se eliminarán todas las <strong>subcategorías y productos</strong> de esta categoría.<br /><br />
                        <strong>Podrás recuperarlos desde la papelera durante 30 días.</strong>
                    </span>
                }
                confirmLabel="Sí, eliminar"
            />
        </AppLayout>
    );
}
