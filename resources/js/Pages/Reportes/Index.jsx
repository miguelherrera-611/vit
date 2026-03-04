import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const fmtNum = (v) => new Intl.NumberFormat('es-CO').format(v ?? 0);

export default function ReportesIndex({ kpis = {} }) {
    const modulos = [
        {
            href:        '/reportes/ejecutivo',
            titulo:      'Dashboard Ejecutivo',
            descripcion: 'Vista gerencial con KPIs, tendencias de 30 días y tops de productos y clientes.',
            color:       'from-slate-700 to-slate-900',
            accent:      'bg-slate-100 text-slate-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/ventas',
            titulo:      'Reporte de Ventas',
            descripcion: 'Analiza ventas por rango de fechas, método de pago, estado y productos más vendidos.',
            color:       'from-emerald-500 to-teal-600',
            accent:      'bg-emerald-50 text-emerald-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/inventario',
            titulo:      'Reporte de Inventario',
            descripcion: 'Estado del stock por categoría, productos críticos y valor total del inventario.',
            color:       'from-orange-400 to-amber-500',
            accent:      'bg-orange-50 text-orange-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            href:        '/reportes/clientes',
            titulo:      'Reporte de Clientes',
            descripcion: 'Ranking de mejores clientes, frecuencia de compra y saldos pendientes.',
            color:       'from-pink-500 to-rose-600',
            accent:      'bg-pink-50 text-pink-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/financiero',
            titulo:      'Reporte Financiero',
            descripcion: 'Ingresos mensuales de los últimos 6 meses, descuentos y distribución de métodos de pago.',
            color:       'from-violet-500 to-purple-700',
            accent:      'bg-violet-50 text-violet-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            href:        '/reportes/rentabilidad',
            titulo:      'Rentabilidad',
            descripcion: 'Ganancia bruta, margen por producto y por categoría. Requiere precio de compra configurado.',
            color:       'from-emerald-600 to-teal-700',
            accent:      'bg-emerald-50 text-emerald-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            href:        '/reportes/ventas-categoria',
            titulo:      'Ventas por Categoría',
            descripcion: 'Rendimiento por subcategoría con comparativa Dama vs Caballero y gráfica de distribución.',
            color:       'from-pink-500 to-rose-600',
            accent:      'bg-pink-50 text-pink-700',
            icono: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
        },
    ];

    const statCards = [
        { label: 'Ventas hoy',       value: fmt(kpis.ventas_hoy),      sub: `${fmtNum(kpis.num_ventas_mes)} ventas este mes`, color: 'text-emerald-600' },
        { label: 'Ingresos del mes', value: fmt(kpis.ventas_mes),       sub: `Ticket promedio ${fmt(kpis.ticket_promedio)}`,   color: 'text-violet-600' },
        { label: 'Saldo pendiente',  value: fmt(kpis.saldo_pendiente),  sub: 'Por cobrar a clientes',                          color: 'text-rose-600'   },
        { label: 'Bajo stock',       value: fmtNum(kpis.bajo_stock),    sub: `${fmtNum(kpis.total_productos)} productos totales`, color: 'text-amber-600' },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <h1 className="text-3xl font-light text-gray-900">Reportes y Analíticas</h1>
                        <p className="mt-1 text-sm text-gray-500">Selecciona un reporte para ver el análisis detallado</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10">
                    {/* KPIs rápidos */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {statCards.map(({ label, value, sub, color }) => (
                            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">{label}</p>
                                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                <p className="text-xs text-gray-400 mt-1">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Módulos de reportes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modulos.map((m) => (
                            <Link
                                key={m.href}
                                href={m.href}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {/* Banda de color superior */}
                                <div className={`h-2 bg-gradient-to-r ${m.color}`} />
                                <div className="p-7">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 ${m.accent} rounded-xl mb-5`}>
                                        {m.icono}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{m.titulo}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{m.descripcion}</p>
                                    <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                                        <span>Ver reporte</span>
                                        <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
