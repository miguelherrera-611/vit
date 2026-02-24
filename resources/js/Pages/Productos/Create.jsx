import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function ProductosCreate({ categorias = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        codigo_barras: '',
        categoria: '',
        precio: '',
        stock: '0',
        stock_minimo: '5',
        imagen: null,
        activo: true,
    });

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/productos', { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/productos" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Nuevo Producto</h1>
                                <p className="mt-1 text-sm text-gray-500">Completa la información del producto</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm p-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Básica</h2>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre del Producto <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                                placeholder="Ej: Blusa Manga Larga Satín"
                                            />
                                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                            <textarea
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none"
                                                placeholder="Descripción del producto..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Categoría <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={data.categoria}
                                                onChange={(e) => setData('categoria', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50"
                                            >
                                                <option value="">Selecciona una categoría...</option>
                                                <optgroup label="Dama">
                                                    {categorias.filter(c => c.startsWith('Dama')).map(c => (
                                                        <option key={c} value={c}>{c.replace('Dama - ', '')}</option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="Caballero">
                                                    {categorias.filter(c => c.startsWith('Caballero')).map(c => (
                                                        <option key={c} value={c}>{c.replace('Caballero - ', '')}</option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                            {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Código / SKU</label>
                                            <input
                                                type="text"
                                                value={data.codigo_barras}
                                                onChange={(e) => setData('codigo_barras', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                                placeholder="Ej: ROD12345 (opcional)"
                                            />
                                            {errors.codigo_barras && <p className="mt-1 text-sm text-red-600">{errors.codigo_barras}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Precio e Inventario</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Precio de Venta <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                                <input
                                                    type="number"
                                                    value={data.precio}
                                                    onChange={(e) => setData('precio', e.target.value)}
                                                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                                    placeholder="0"
                                                    min="0"
                                                    step="100"
                                                />
                                            </div>
                                            {data.precio && <p className="mt-1 text-xs text-gray-500">{formatCurrency(data.precio)}</p>}
                                            {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock Inicial <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.stock}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                                min="0"
                                            />
                                            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock Mínimo <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={data.stock_minimo}
                                                onChange={(e) => setData('stock_minimo', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                                min="0"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">Alerta cuando el stock llegue a este valor</p>
                                            {errors.stock_minimo && <p className="mt-1 text-sm text-red-600">{errors.stock_minimo}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado</h2>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="sr-only" />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${data.activo ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${data.activo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">
                                            {data.activo ? 'Producto Activo' : 'Producto Inactivo'}
                                        </span>
                                    </label>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Imagen</h2>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition">
                                        {data.imagen ? (
                                            <div>
                                                <img src={URL.createObjectURL(data.imagen)} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-3" />
                                                <button type="button" onClick={() => setData('imagen', null)} className="text-sm text-red-600 hover:text-red-800">
                                                    Eliminar imagen
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-1">Haz clic para subir</p>
                                                <p className="text-xs text-gray-400">JPG, PNG, WEBP hasta 2MB</p>
                                                <input type="file" accept="image/*" onChange={(e) => setData('imagen', e.target.files[0])} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                    {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50"
                                    >
                                        {processing ? 'Guardando...' : 'Crear Producto'}
                                    </button>
                                    <Link href="/productos" className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition">
                                        Cancelar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
