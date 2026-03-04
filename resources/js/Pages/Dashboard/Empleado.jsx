import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';

// Mapa completo: permiso → módulo
const MODULOS = [
    {
        permiso:     'gestionar_ventas',
        title:       'Nueva Venta',
        description: 'Registrar una nueva venta',
        href:        '/ventas/crear',
        color:       'from-green-500 to-green-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
    },
    {
        permiso:     'gestionar_ventas',
        title:       'Historial Ventas',
        description: 'Ver todas las ventas registradas',
        href:        '/ventas',
        color:       'from-emerald-500 to-emerald-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    },
    {
        permiso:     'ver_productos',
        title:       'Productos',
        description: 'Consultar catálogo de productos',
        href:        '/productos',
        color:       'from-blue-500 to-blue-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
    },
    {
        permiso:     'crear_productos',
        title:       'Nuevo Producto',
        description: 'Agregar productos al catálogo',
        href:        '/productos/crear',
        color:       'from-sky-500 to-sky-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />,
    },
    {
        permiso:     'gestionar_inventario',
        title:       'Inventario',
        description: 'Consultar y ajustar stock',
        href:        '/inventario',
        color:       'from-orange-500 to-orange-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
    },
    {
        permiso:     'gestionar_clientes',
        title:       'Clientes',
        description: 'Gestionar base de clientes',
        href:        '/clientes',
        color:       'from-pink-500 to-pink-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    },
    {
        permiso:     'gestionar_proveedores',
        title:       'Proveedores',
        description: 'Gestionar proveedores',
        href:        '/proveedores',
        color:       'from-indigo-500 to-indigo-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    },
    {
        permiso:     'gestionar_categorias',
        title:       'Categorías',
        description: 'Gestionar categorías de productos',
        href:        '/categorias',
        color:       'from-violet-500 to-violet-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />,
    },
    {
        permiso:     'ver_reportes',
        title:       'Reportes',
        description: 'Ver estadísticas y analíticas',
        href:        '/reportes',
        color:       'from-amber-500 to-amber-600',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    },
    {
        permiso:     'gestionar_papelera',
        title:       'Papelera',
        description: 'Elementos eliminados y restauración',
        href:        '/papelera',
        color:       'from-red-400 to-red-500',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    },
];

export default function Empleado() {
    const { auth } = usePage().props;
    const permisos = auth.user.permissions ?? [];

    // Deduplicar por href para que "gestionar_ventas" no aparezca dos veces con el mismo link
    const vistos = new Set();
    const modulosVisibles = MODULOS.filter(m => {
        if (!permisos.includes(m.permiso)) return false;
        if (vistos.has(m.href)) return false;
        vistos.add(m.href);
        return true;
    });

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900">Mi Panel</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Bienvenido, <strong>{auth.user.name}</strong>
                            </p>
                        </div>
                        <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-full shadow-sm">
                            Empleado
                        </span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* Sin permisos */}
                    {modulosVisibles.length === 0 && (
                        <div className="bg-white rounded-2xl p-16 shadow-sm text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin módulos asignados</h3>
                            <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                Tu cuenta aún no tiene permisos configurados. Contacta al administrador.
                            </p>
                        </div>
                    )}

                    {/* Grid de módulos según permisos */}
                    {modulosVisibles.length > 0 && (
                        <>
                            <p className="text-sm font-medium text-gray-500 mb-6">
                                Módulos disponibles
                                <span className="ml-2 text-gray-400 font-normal">
                                    ({modulosVisibles.length})
                                </span>
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {modulosVisibles.map((modulo) => (
                                    <Link
                                        key={modulo.href}
                                        href={modulo.href}
                                        className={`bg-gradient-to-br ${modulo.color} rounded-2xl p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group block`}
                                    >
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {modulo.icon}
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-1">{modulo.title}</h3>
                                        <p className="text-white/75 text-sm leading-relaxed">{modulo.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
