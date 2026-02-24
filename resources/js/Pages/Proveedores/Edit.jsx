import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function ProveedoresEdit({ proveedor }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: proveedor.nombre || '',
        empresa: proveedor.empresa || '',
        email: proveedor.email || '',
        telefono: proveedor.telefono || '',
        documento: proveedor.documento || '',
        direccion: proveedor.direccion || '',
        sitio_web: proveedor.sitio_web || '',
        activo: proveedor.activo ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/proveedores/${proveedor.id}`);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-3xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/proveedores" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Editar Proveedor</h1>
                                <p className="mt-1 text-sm text-gray-500">{proveedor.nombre}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-10">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Información del Proveedor</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                                        <input
                                            type="text"
                                            value={data.empresa}
                                            onChange={(e) => setData('empresa', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.empresa && <p className="mt-1 text-sm text-red-600">{errors.empresa}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">NIT / Documento</label>
                                        <input
                                            type="text"
                                            value={data.documento}
                                            onChange={(e) => setData('documento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
                                        <input
                                            type="url"
                                            value={data.sitio_web}
                                            onChange={(e) => setData('sitio_web', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.sitio_web && <p className="mt-1 text-sm text-red-600">{errors.sitio_web}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                        <input
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Estado</h2>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="sr-only" />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${data.activo ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${data.activo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">{data.activo ? 'Activo' : 'Inactivo'}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <Link href="/proveedores" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition">
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
