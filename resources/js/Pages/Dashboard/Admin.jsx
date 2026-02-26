import AppLayout from '@/Layouts/AppLayout';
import { usePage, Link } from '@inertiajs/react';

export default function Admin() {
    const { auth } = usePage().props;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Panel Administrativo</h1>
                                <p className="mt-1 text-sm text-gray-500">Bienvenido, {auth.user.name}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-full shadow-sm">
                                    Administrador
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <StatsCard icon="box"   value="0"  label="Productos Activos" color="blue"   />
                        <StatsCard icon="cart"  value="0"  label="Ventas del Día"    color="green"  />
                        <StatsCard icon="alert" value="0"  label="Stock Bajo"        color="yellow" />
                        <StatsCard icon="money" value="$0" label="Ventas del Mes"    color="purple" />
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ActionCard title="Productos"   description="Gestionar catálogo e inventario"            icon="box"      color="blue"   href="/productos"  />
                        <ActionCard title="Ventas"      description="Registrar y consultar ventas"               icon="cart"     color="green"  href="/ventas"     />
                        <ActionCard title="Reportes"    description="Analíticas y estadísticas"                  icon="chart"    color="purple" href="/reportes"   />
                        <ActionCard title="Inventario"  description="Control de stock y almacén"                 icon="warehouse" color="orange" href="/inventario" />
                        <ActionCard title="Clientes"    description="Gestionar base de clientes"                 icon="users"    color="pink"   href="/clientes"   />
                        <ActionCard title="Proveedores" description="Administrar proveedores"                    icon="building" color="indigo" href="/proveedores" />
                        <ActionCard title="Categorías"  description="Gestionar categorías Dama y Caballero"      icon="tag"      color="cyan"   href="/categorias" />
                        <ActionCard title="Papelera"    description="Elementos eliminados · se purgan en 30 días" icon="trash"   color="red"    href="/papelera"   />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Stats Card ──────────────────────────────────────────────────────── */
function StatsCard({ icon, value, label, color }) {
    const colors = {
        blue:   'bg-blue-50 text-blue-600',
        green:  'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    const icons = {
        box:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
        cart:  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />,
        alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {icons[icon]}
                    </svg>
                </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    );
}

/* ── Action Card ─────────────────────────────────────────────────────── */
function ActionCard({ title, description, icon, color, href }) {
    const gradients = {
        blue:   'from-blue-500 to-blue-600',
        green:  'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        pink:   'from-pink-500 to-pink-600',
        indigo: 'from-indigo-500 to-indigo-600',
        cyan:   'from-cyan-500 to-cyan-600',
        red:    'from-red-400 to-red-500',
    };

    const icons = {
        box: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        ),
        cart: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        ),
        chart: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        ),
        warehouse: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        ),
        users: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        ),
        building: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        ),
        tag: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        ),
        trash: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        ),
    };

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-200 border border-gray-100">
            <div className={`w-14 h-14 bg-gradient-to-br ${gradients[color]} rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[icon]}
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-6">{description}</p>
            <Link
                href={href}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition duration-200 text-center"
            >
                Gestionar
            </Link>
        </div>
    );
}
