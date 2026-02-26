import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateSubcat({ grupo }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre:      '',
        descripcion: '',
        imagen:      null,
        activo:      true,
    });

    const [preview, setPreview] = useState(null);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('imagen', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/categorias/${grupo.id}/subcategorias`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-2xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href={`/categorias/${grupo.id}`}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{grupo.nombre}</p>
                                <h1 className="text-2xl font-bold text-gray-900">Nueva Subcategoría</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-6 py-10">
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
                                    placeholder={`Ej: Blusas, Vestidos, Camisas...`}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                                <input
                                    type="text"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Opcional..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Imagen</h2>
                            <label className="cursor-pointer block">
                                {preview ? (
                                    <div className="relative">
                                        <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                                        <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                            <span className="text-white text-sm font-medium">Cambiar imagen</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50 transition">
                                        <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-500">Clic para subir imagen</p>
                                        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP hasta 2MB</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
                            </label>
                            {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
                        </div>

                        {/* Label que se asignará a productos */}
                        {data.nombre && (
                            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                                <p className="text-xs text-violet-600 font-medium">Los productos de esta subcategoría usarán el label:</p>
                                <p className="text-sm font-bold text-violet-800 mt-1">
                                    {grupo.nombre} - {data.nombre}
                                </p>
                            </div>
                        )}

                        <div className="flex space-x-3">
                            <Link href={`/categorias/${grupo.id}`}
                                  className="flex-1 text-center py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={processing}
                                    className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
                                {processing ? 'Guardando...' : 'Crear Subcategoría'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
