import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function ClientesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento: '',
        direccion: '',
        fecha_nacimiento: '',
        activo: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-3xl mx-auto px-6 py-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/clientes" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Nuevo Cliente</h1>
                                <p className="mt-1 text-sm text-gray-500">Registra la información del cliente</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-6 py-10">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Datos Personales</h2>
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
                                            placeholder="Nombre"
                                        />
                                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                        <input
                                            type="text"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            placeholder="Apellido"
                                        />
                                        {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            placeholder="300 000 0000"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">El teléfono debe ser único</p>
                                        {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            placeholder="correo@ejemplo.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                                        <input
                                            type="text"
                                            value={data.documento}
                                            onChange={(e) => setData('documento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            placeholder="Cédula o documento"
                                        />
                                        {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            value={data.fecha_nacimiento}
                                            onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                        {errors.fecha_nacimiento && <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                        <input
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                            placeholder="Dirección completa"
                                        />
                                        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Estado del Cliente</h2>
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
                                    {processing ? 'Guardando...' : 'Crear Cliente'}
                                </button>
                                <Link href="/clientes" className="flex-1 text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition">
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
