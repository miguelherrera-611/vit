import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function InventarioAjustar({ productos = [] }) {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        producto_id: '',
        tipo_ajuste: 'incremento',
        cantidad: '1',
        motivo: '',
        observaciones: '',
    });

    const handleProductoChange = (id) => {
        setData('producto_id', id);
        const p = productos.find(p => p.id == id);
        setProductoSeleccionado(p || null);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/inventario/ajustar');
    };

    const stockResultado = () => {
        if (!productoSeleccionado || !data.cantidad) return null;
        const cant = parseInt(data.cantidad) || 0;
        const actual = productoSeleccionado.stock;
        if (data.tipo_ajuste === 'incremento') return actual + cant;
        return Math.max(0, actual - cant);
    };

    const resultado = stockResultado();

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-3xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/inventario" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Ajuste de Stock</h1>
                                <p className="mt-1 text-sm text-gray-500">Modifica el inventario con justificación obligatoria</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-10">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Seleccionar producto */}
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Producto a Ajustar</h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Producto <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.producto_id}
                                        onChange={(e) => handleProductoChange(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50"
                                    >
                                        <option value="">Selecciona un producto...</option>
                                        {productos.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.nombre} — Stock actual: {p.stock}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.producto_id && <p className="mt-1 text-sm text-red-600">{errors.producto_id}</p>}
                                </div>

                                {productoSeleccionado && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">{productoSeleccionado.nombre}</p>
                                            <p className="text-xs text-blue-600 mt-0.5">Categoría: {productoSeleccionado.categoria || 'Sin categoría'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-700">{productoSeleccionado.stock}</p>
                                            <p className="text-xs text-blue-500">Stock actual</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tipo de ajuste */}
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Tipo de Ajuste</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setData('tipo_ajuste', 'incremento')}
                                        className={`p-4 rounded-xl border-2 transition text-center ${data.tipo_ajuste === 'incremento' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${data.tipo_ajuste === 'incremento' ? 'bg-green-500' : 'bg-gray-200'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <p className={`font-semibold ${data.tipo_ajuste === 'incremento' ? 'text-green-700' : 'text-gray-600'}`}>Incremento</p>
                                        <p className="text-xs text-gray-400 mt-1">Aumentar stock</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('tipo_ajuste', 'decremento')}
                                        className={`p-4 rounded-xl border-2 transition text-center ${data.tipo_ajuste === 'decremento' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${data.tipo_ajuste === 'decremento' ? 'bg-red-500' : 'bg-gray-200'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </div>
                                        <p className={`font-semibold ${data.tipo_ajuste === 'decremento' ? 'text-red-700' : 'text-gray-600'}`}>Decremento</p>
                                        <p className="text-xs text-gray-400 mt-1">Reducir stock</p>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cantidad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.cantidad}
                                            onChange={(e) => setData('cantidad', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            min="1"
                                        />
                                        {errors.cantidad && <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Motivo <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.motivo}
                                            onChange={(e) => setData('motivo', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50"
                                        >
                                            <option value="">Selecciona un motivo...</option>
                                            <option value="Daño">Daño</option>
                                            <option value="Robo">Robo</option>
                                            <option value="Devolución">Devolución</option>
                                            <option value="Error conteo">Error de conteo</option>
                                            <option value="Ingreso mercancía">Ingreso de mercancía</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                        {errors.motivo && <p className="mt-1 text-sm text-red-600">{errors.motivo}</p>}
                                    </div>
                                </div>

                                {/* Preview stock resultante */}
                                {productoSeleccionado && resultado !== null && (
                                    <div className={`mt-4 p-4 rounded-xl flex items-center justify-between ${data.tipo_ajuste === 'incremento' ? 'bg-green-50' : 'bg-red-50'}`}>
                                        <p className={`text-sm font-medium ${data.tipo_ajuste === 'incremento' ? 'text-green-700' : 'text-red-700'}`}>
                                            Stock resultante
                                        </p>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg font-bold text-gray-600">{productoSeleccionado.stock}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className={`text-2xl font-bold ${data.tipo_ajuste === 'incremento' ? 'text-green-700' : 'text-red-700'}`}>{resultado}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Observaciones */}
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Observaciones</h2>
                                <p className="text-sm text-gray-500 mb-4">Obligatorio: describe el motivo detallado del ajuste</p>
                                <textarea
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none"
                                    placeholder="Describe el motivo del ajuste con detalle suficiente..."
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.observaciones ? (
                                        <p className="text-sm text-red-600">{errors.observaciones}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">Mínimo 5 caracteres</p>
                                    )}
                                    <span className={`text-xs ${data.observaciones.length >= 5 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {data.observaciones.length} caracteres
                                    </span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Aplicando ajuste...' : 'Aplicar Ajuste'}
                                </button>
                                <Link href="/inventario" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition">
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
