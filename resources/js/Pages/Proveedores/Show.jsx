import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function ProveedoresShow({ proveedor, totalProductos = 0 }) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* HEADER */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href="/proveedores"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <span className="text-sm text-gray-400">Proveedores</span>
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-sm text-gray-600 font-medium">{proveedor.nombre}</span>
                        </div>

                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                {/* Avatar grande */}
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                                    <span className="text-white font-bold text-2xl">
                                        {proveedor.nombre.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-light text-gray-900">{proveedor.nombre}</h1>
                                    {proveedor.empresa && (
                                        <p className="text-gray-500 mt-1">{proveedor.empresa}</p>
                                    )}
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${proveedor.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${proveedor.activo ? 'bg-green-500' : 'bg-red-500'}`} />
                                            {proveedor.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/proveedores/${proveedor.id}/edit`}
                                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CONTENIDO */}
                <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

                    {/* STATS RÁPIDAS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatMini
                            icon={
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                            value={totalProductos}
                            label="Productos"
                        />
                        <StatMini
                            icon={
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            value={proveedor.activo ? 'Activo' : 'Inactivo'}
                            label="Estado"
                        />
                        <StatMini
                            icon={
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            value={proveedor.created_at ? new Date(proveedor.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            label="Registrado"
                        />
                        <StatMini
                            icon={
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                            }
                            value={proveedor.documento || '—'}
                            label="NIT / Doc."
                        />
                    </div>

                    {/* INFORMACIÓN DE CONTACTO */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Información de Contacto
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoField
                                label="Correo electrónico"
                                value={proveedor.email}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                                isLink={proveedor.email ? `mailto:${proveedor.email}` : null}
                            />
                            <InfoField
                                label="Teléfono"
                                value={proveedor.telefono}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                }
                                isLink={proveedor.telefono ? `tel:${proveedor.telefono}` : null}
                            />
                            <InfoField
                                label="Empresa"
                                value={proveedor.empresa}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                }
                            />
                            <InfoField
                                label="Sitio web"
                                value={proveedor.sitio_web}
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                }
                                isLink={proveedor.sitio_web || null}
                                external
                            />
                        </div>

                        {proveedor.direccion && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Dirección</p>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{proveedor.direccion}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ACCIONES RÁPIDAS */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h2>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={`/proveedores/${proveedor.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-100 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar proveedor
                            </Link>
                            <Link
                                href="/proveedores"
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                Ver todos los proveedores
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Componentes auxiliares ── */

function StatMini({ icon, value, label }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
            </div>
        </div>
    );
}

function InfoField({ label, value, icon, isLink = null, external = false }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                {value ? (
                    isLink ? (
                        <a
                            href={isLink}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noopener noreferrer' : undefined}
                            className="text-indigo-600 hover:underline text-sm break-all"
                        >
                            {value}
                        </a>
                    ) : (
                        <p className="text-gray-800 text-sm break-all">{value}</p>
                    )
                ) : (
                    <p className="text-gray-400 text-sm italic">No especificado</p>
                )}
            </div>
        </div>
    );
}
