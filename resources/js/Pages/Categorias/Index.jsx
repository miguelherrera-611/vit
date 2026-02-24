import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

// ── Íconos ──────────────────────────────────────────────────────────────────
const IconTag = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

// ── Tarjeta de categoría raíz (Dama / Caballero) ────────────────────────────
function RootCard({ tipo, categorias, color }) {
    const palette = {
        pink: {
            bg:      'from-pink-500 to-rose-500',
            soft:    'bg-pink-50',
            border:  'border-pink-200',
            badge:   'bg-pink-100 text-pink-700',
            btn:     'bg-pink-600 hover:bg-pink-700',
            icon:    'text-pink-500',
            ring:    'ring-pink-200',
        },
        blue: {
            bg:      'from-blue-500 to-indigo-600',
            soft:    'bg-blue-50',
            border:  'border-blue-200',
            badge:   'bg-blue-100 text-blue-700',
            btn:     'bg-blue-600 hover:bg-blue-700',
            icon:    'text-blue-500',
            ring:    'ring-blue-200',
        },
    };
    const c = palette[color];
    const totalProductos = categorias.reduce((s, cat) => s + (cat.total_productos || 0), 0);

    return (
        <div className={`bg-white rounded-3xl shadow-sm border ${c.border} overflow-hidden`}>
            {/* Header degradado */}
            <div className={`bg-gradient-to-r ${c.bg} px-8 py-10 text-white`}>
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">
                            Categoría Principal
                        </p>
                        <h2 className="text-4xl font-bold capitalize">{tipo}</h2>
                        <p className="mt-2 opacity-80 text-sm">
                            {categorias.length} subcategoría{categorias.length !== 1 ? 's' : ''} · {totalProductos} producto{totalProductos !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                        {tipo === 'dama' ? '👗' : '👔'}
                    </div>
                </div>
            </div>

            {/* Lista de subcategorías */}
            <div className="p-6">
                {categorias.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Sin subcategorías</p>
                ) : (
                    <div className="space-y-2">
                        {categorias.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categorias/${cat.id}`}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl ${c.soft} hover:ring-2 ${c.ring} transition group`}
                            >
                                <div className="flex items-center space-x-3">
                                    {cat.imagen ? (
                                        <img
                                            src={`/storage/${cat.imagen}`}
                                            alt={cat.nombre}
                                            className="w-9 h-9 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center ${c.icon}`}>
                                            <IconTag />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                                        {cat.nombre}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                                        {cat.total_productos} prod.
                                    </span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <Link
                    href={`/categorias/crear?tipo=${tipo}`}
                    className={`mt-4 flex items-center justify-center space-x-2 w-full py-2.5 border-2 border-dashed ${c.border} rounded-xl text-sm ${c.icon} hover:${c.soft} transition`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">Agregar subcategoría</span>
                </Link>
            </div>
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function CategoriasIndex({
                                            categorias_dama      = [],
                                            categorias_caballero = [],
                                            categorias_custom    = [],
                                        }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing, setProcessing]    = useState(false);
    const [pwdError, setPwdError]        = useState(null);

    const handleDelete = (password) => {
        if (!deleteTarget) return;
        setProcessing(true);
        router.delete(`/categorias/${deleteTarget.id}`, {
            data: { password },
            onSuccess: () => {
                setDeleteTarget(null);
                setProcessing(false);
                setPwdError(null);
            },
            onError: (errors) => {
                setPwdError(errors.password || 'Error al eliminar.');
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* ── Header ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Categorías</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Gestiona las categorías y subcategorías de productos
                                </p>
                            </div>
                            <Link
                                href="/categorias/crear"
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nueva Categoría</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

                    {/* ── Dama y Caballero ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <RootCard tipo="dama"      categorias={categorias_dama}      color="pink" />
                        <RootCard tipo="caballero" categorias={categorias_caballero} color="blue" />
                    </div>

                    {/* ── Categorías personalizadas ── */}
                    {(categorias_custom.length > 0) && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                                <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Otras Categorías</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {categorias_custom.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden group"
                                    >
                                        {/* Imagen o placeholder */}
                                        <div className="h-28 bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center overflow-hidden">
                                            {cat.imagen ? (
                                                <img
                                                    src={`/storage/${cat.imagen}`}
                                                    alt={cat.nombre}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-4xl">🏷️</span>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900">{cat.nombre}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {cat.total_productos} producto{cat.total_productos !== 1 ? 's' : ''}
                                            </p>

                                            <div className="flex items-center space-x-2 mt-3">
                                                <Link
                                                    href={`/categorias/${cat.id}`}
                                                    className="flex-1 text-center text-xs py-2 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition font-medium"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={`/categorias/${cat.id}/edit`}
                                                    className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => { setDeleteTarget(cat); setPwdError(null); }}
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
                        </div>
                    )}

                    {/* ── Acceso rápido papelera ── */}
                    <div className="flex justify-end">
                        <Link
                            href="/papelera"
                            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-600 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Ver papelera</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Modal eliminar con contraseña ── */}
            <PasswordConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                processing={processing}
                error={pwdError}
                title={`¿Eliminar "${deleteTarget?.nombre}"?`}
                description={
                    <span>
                        Se moverán a la papelera esta categoría y todos sus productos asociados.
                        <br /><br />
                        <strong>Esta acción se puede revertir desde la papelera durante 30 días.</strong>
                    </span>
                }
                confirmLabel="Sí, eliminar"
            />
        </AppLayout>
    );
}
