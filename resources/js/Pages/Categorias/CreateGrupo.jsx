import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

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

export default function CreateGrupo() {
    const { data, setData, post, processing, errors } = useForm({
        nombre:      '',
        descripcion: '',
        imagen:      null,
        color:       'violet',
        orden:       0,
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
        post('/categorias', { forceFormData: true });
    };

    // Preview de la tarjeta en tiempo real
    const gradient = GRADIENTS[data.color] || GRADIENTS.violet;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/categorias"
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Nueva Categoría</h1>
                                <p className="text-sm text-gray-500 mt-0.5">Crea una categoría principal como Dama, Caballero, Niños, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* ── Formulario ── */}
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">

                            {/* Nombre */}
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
                                        placeholder="Ej: Dama, Caballero, Niños, Sport..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50 text-lg font-medium"
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Breve descripción..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Color (solo si no hay imagen) */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-1">Color de fondo</h2>
                                <p className="text-xs text-gray-400 mb-4">Si subes una imagen, esta se usará como fondo en lugar del color</p>
                                <div className="grid grid-cols-7 gap-2">
                                    {COLORES.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setData('color', c.value)}
                                            className={`relative h-10 rounded-xl ${c.bg} transition-all ${
                                                data.color === c.value
                                                    ? 'ring-3 ring-offset-2 ring-gray-800 scale-110'
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
                                <p className="text-xs text-gray-400 mb-4">Se mostrará como fondo de la tarjeta (reemplaza el color)</p>
                                <label className="cursor-pointer block">
                                    {preview ? (
                                        <div className="relative">
                                            <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                                <span className="text-white text-sm font-medium">Cambiar imagen</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); setPreview(null); setData('imagen', null); }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-400 hover:bg-violet-50 transition">
                                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">Clic para subir imagen</p>
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
                                    {processing ? 'Creando...' : 'Crear Categoría'}
                                </button>
                            </div>
                        </form>

                        {/* ── Preview en tiempo real ── */}
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-gray-500 mb-4">Vista previa de la tarjeta:</p>
                            <div className="relative rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: '280px' }}>
                                {preview ? (
                                    <img src={preview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
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
                                        {data.nombre || 'Nombre'}
                                    </h2>
                                    <p className="text-white/70 text-sm">
                                        {data.descripcion || '0 subcategorías · 0 productos'}
                                    </p>
                                    <div className="absolute bottom-6 right-6 w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">Así se verá la tarjeta en la lista de categorías</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
