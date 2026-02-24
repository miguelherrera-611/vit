import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

export default function CategoriasEdit({ categoria }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:      categoria.nombre || '',
        tipo:        categoria.tipo   || 'dama',
        descripcion: categoria.descripcion || '',
        imagen:      null,
        activo:      categoria.activo ?? true,
        _method:     'PUT',
    });

    const [preview, setPreview]         = useState(null);
    const [showDelete, setShowDelete]   = useState(false);
    const [delProcessing, setDelProcessing] = useState(false);
    const [delError, setDelError]       = useState(null);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('imagen', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/categorias/${categoria.id}`, { forceFormData: true });
    };

    const handleDelete = (password) => {
        setDelProcessing(true);
        router.delete(`/categorias/${categoria.id}`, {
            data: { password },
            onSuccess: () => {
                setShowDelete(false);
                setDelProcessing(false);
            },
            onError: (errs) => {
                setDelError(errs.password || 'Error al eliminar.');
                setDelProcessing(false);
            },
        });
    };

    const imagenActual = preview
        ? preview
        : (categoria.imagen ? `/storage/${categoria.imagen}` : null);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-2xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/categorias"
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-light text-gray-900">Editar Categoría</h1>
                                    <p className="text-sm text-gray-500 mt-0.5">{categoria.nombre}</p>
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

                {/* Form */}
                <div className="max-w-2xl mx-auto px-6 py-10">
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">

                        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
                            <h2 className="text-lg font-semibold text-gray-900">Información</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'dama',      label: 'Dama',      emoji: '👗' },
                                        { value: 'caballero', label: 'Caballero', emoji: '👔' },
                                        { value: 'custom',    label: 'Otro',      emoji: '🏷️' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setData('tipo', opt.value)}
                                            className={`flex flex-col items-center py-4 px-3 rounded-xl border-2 transition font-medium text-sm ${
                                                data.tipo === opt.value
                                                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-2xl mb-1">{opt.emoji}</span>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
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

                        {/* Imagen */}
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagen</h2>
                            <label className="cursor-pointer block">
                                {imagenActual ? (
                                    <div className="relative group">
                                        <img
                                            src={imagenActual}
                                            alt="Categoría"
                                            className="w-full h-48 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <span className="text-white text-sm font-medium">Cambiar imagen</span>
                                        </div>
                                        {preview && (
                                            <span className="absolute top-2 right-2 bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                Nueva imagen
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-violet-400 hover:bg-violet-50 transition">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Subir imagen</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP hasta 2MB</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
                            </label>
                            {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
                        </div>

                        {/* Estado */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <label className="flex items-center cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => setData('activo', !data.activo)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        data.activo ? 'bg-violet-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                        data.activo ? 'translate-x-5' : 'translate-x-0.5'
                                    }`} />
                                </button>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    {data.activo ? 'Categoría activa' : 'Categoría inactiva'}
                                </span>
                            </label>
                        </div>

                        {/* Botones */}
                        <div className="flex space-x-3">
                            <Link
                                href="/categorias"
                                className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <PasswordConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar "${categoria.nombre}"?`}
                description="Se moverán a la papelera esta categoría y todos sus productos. Podrás recuperarlos en los próximos 30 días."
                confirmLabel="Eliminar"
            />
        </AppLayout>
    );
}
