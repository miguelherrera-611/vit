import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const COLORES = [
    { value: 'pink',   label: 'Rosa',    bg: 'bg-gradient-to-br from-pink-500 to-rose-500' },
    { value: 'blue',   label: 'Azul',    bg: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { value: 'violet', label: 'Violeta', bg: 'bg-gradient-to-br from-violet-500 to-purple-600' },
    { value: 'green',  label: 'Verde',   bg: 'bg-gradient-to-br from-emerald-500 to-teal-500' },
    { value: 'orange', label: 'Naranja', bg: 'bg-gradient-to-br from-orange-400 to-amber-500' },
    { value: 'teal',   label: 'Cyan',    bg: 'bg-gradient-to-br from-teal-500 to-cyan-500' },
    { value: 'red',    label: 'Rojo',    bg: 'bg-gradient-to-br from-red-500 to-rose-500' },
];

const GRADIENTS = {
    pink:   'from-pink-500 via-rose-500 to-red-400',
    blue:   'from-blue-500 via-indigo-500 to-violet-500',
    violet: 'from-violet-500 via-purple-500 to-fuchsia-500',
    green:  'from-emerald-500 via-teal-500 to-cyan-500',
    orange: 'from-orange-400 via-amber-500 to-yellow-400',
    teal:   'from-teal-500 via-cyan-500 to-sky-500',
    red:    'from-red-500 via-rose-500 to-pink-400',
};

export default function EditGrupo({ grupo }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:      grupo.nombre || '',
        descripcion: grupo.descripcion || '',
        imagen:      null,
        color:       grupo.color || 'violet',
        orden:       grupo.orden || 0,
        activo:      grupo.activo ?? true,
        _method:     'PUT',
    });

    const [preview,       setPreview]       = useState(null);
    const [showDelete,    setShowDelete]     = useState(false);
    const [delProcessing, setDelProcessing] = useState(false);
    const [delError,      setDelError]      = useState(null);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('imagen', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/categorias/${grupo.id}`, { forceFormData: true });
    };

    const handleDelete = (password) => {
        setDelProcessing(true);
        router.delete(`/categorias/${grupo.id}`, {
            data: { password },
            onSuccess: () => { setShowDelete(false); setDelProcessing(false); },
            onError: (errs) => { setDelError(errs.password || 'Contraseña incorrecta.'); setDelProcessing(false); },
        });
    };

    const imagenActual = preview
        ? preview
        : (grupo.imagen ? `/storage/${grupo.imagen}` : null);

    const gradient = GRADIENTS[data.color] || GRADIENTS.violet;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/categorias"
                                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Editar Categoría</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">Cambia el nombre, imagen o color de «{grupo.nombre}»</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setShowDelete(true); setDelError(null); }}
                                className="flex items-center space-x-1.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ── Formulario ── */}
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">

                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
                                <h2 className="text-base font-semibold text-gray-900">Información</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50 text-lg font-medium"
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                                    <input
                                        type="text"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Color */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Color de fondo</h2>
                                <p className="text-xs text-gray-400 mb-4">Solo aplica cuando no hay imagen</p>
                                <div className="grid grid-cols-7 gap-2">
                                    {COLORES.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setData('color', c.value)}
                                            className={`relative h-10 rounded-xl ${c.bg} transition-all ${
                                                data.color === c.value
                                                    ? 'ring-2 ring-offset-2 ring-gray-800 scale-110'
                                                    : 'opacity-70 hover:opacity-100 hover:scale-105'
                                            }`}
                                            title={c.label}
                                        >
                                            {data.color === c.value && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Imagen */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Imagen de portada</h2>
                                <p className="text-xs text-gray-400 mb-4">Se mostrará como fondo de la tarjeta</p>
                                <label className="cursor-pointer block">
                                    {imagenActual ? (
                                        <div className="relative group">
                                            <img src={imagenActual} alt="Categoría" className="w-full h-40 object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <span className="text-white text-sm font-medium">Cambiar imagen</span>
                                            </div>
                                            {preview && (
                                                <span className="absolute top-2 left-2 bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">Nueva</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50 transition">
                                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">Subir imagen</p>
                                            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP hasta 4MB</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
                                </label>
                                {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
                            </div>

                            {/* Botones */}
                            <div className="flex space-x-3">
                                <Link href="/categorias"
                                      className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>

                        {/* ── Preview ── */}
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-gray-500 mb-4">Vista previa:</p>
                            <div className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: '280px' }}>
                                {imagenActual ? (
                                    <img src={imagenActual} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                                )}
                                <div className="absolute inset-0 bg-black/25" />
                                <div className="absolute inset-0 flex flex-col justify-end p-8">
                                    <div className="absolute top-5 left-5">
                                        <span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30">
                                            Categoría Principal
                                        </span>
                                    </div>
                                    <h2 className="text-5xl font-black text-white capitalize tracking-tight drop-shadow-lg leading-none mb-2">
                                        {data.nombre || grupo.nombre}
                                    </h2>
                                    <p className="text-white/70 text-sm">
                                        {data.descripcion || grupo.descripcion || 'Sin descripción'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PasswordConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar "${grupo.nombre}"?`}
                description="Se eliminarán todas sus subcategorías y productos. Podrás recuperarlos desde la papelera durante 30 días."
                confirmLabel="Eliminar"
            />
        </AppLayout>
    );
}
