import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Mini gráfica de barras inline */
function MiniBar({ data, valueKey, max }) {
    const maxVal = max ?? Math.max(...data.map(d => d[valueKey] || 0), 1);
    return (
        <div className="flex items-end gap-px h-16">
            {data.map((d, i) => {
                const h = maxVal > 0 ? Math.max(2, (d[valueKey] / maxVal) * 64) : 2;
                const isLast = i === data.length - 1;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                        <div
                            className={`w-full rounded-t transition-all ${isLast ? 'bg-emerald-500' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                            style={{ height: `${h}px` }}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {d.fecha}: {fmt(d[valueKey])}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* Fila de ranking */
function RankRow({ rank, nombre, sub, value, color }) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
            <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${rank === 1 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                {rank}
            </span>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{nombre}</p>
                {sub && <p className="text-xs text-gray-400">{sub}</p>}
            </div>
            <span className={`text-sm font-semibold ${color || 'text-gray-700'}`}>{value}</span>
        </div>
    );
}

export default function Ejecutivo({ kpis = {}, ultimos30 = [], topProductos = [], topClientes = [] }) {
    const statCards = [
        { label: 'Ventas hoy',      value: fmt(kpis.ventas_hoy),      sub: `${kpis.num_ventas_hoy ?? 0} transacciones`,      color: 'from-emerald-500 to-teal-600',   text: 'text-emerald-700' },
        { label: 'Esta semana',     value: fmt(kpis.ventas_semana),    sub: 'Ingresos de los últimos 7 días',                  color: 'from-blue-500 to-indigo-600',    text: 'text-blue-700'    },
        { label: 'Este mes',        value: fmt(kpis.ventas_mes),       sub: `${kpis.num_ventas_mes ?? 0} ventas registradas`,  color: 'from-violet-500 to-purple-600',  text: 'text-violet-700'  },
        { label: 'Ticket promedio', value: fmt(kpis.ticket_promedio),  sub: 'Promedio por venta este mes',                    color: 'from-amber-400 to-orange-500',   text: 'text-amber-700'   },
    ];

    const alertCards = [
        { label: 'Bajo stock',       value: kpis.bajo_stock ?? 0,      href: '/inventario', color: kpis.bajo_stock > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-gray-50 border-gray-200 text-gray-500' },
        { label: 'Agotados',         value: kpis.agotados ?? 0,        href: '/inventario', color: kpis.agotados > 0 ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200 text-gray-500'         },
        { label: 'Saldo por cobrar', value: fmt(kpis.saldo_pendiente), href: '/ventas',     color: kpis.saldo_pendiente > 0 ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-gray-50 border-gray-200 text-gray-500' },
        { label: 'Clientes activos', value: kpis.clientes_activos ?? 0, href: '/clientes',  color: 'bg-blue-50 border-blue-200 text-blue-800' },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/reportes" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Dashboard Ejecutivo</h1>
                                <p className="mt-1 text-sm text-gray-500">Visión general del negocio en tiempo real</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {statCards.map(({ label, value, sub, color, text }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className={`h-1.5 bg-gradient-to-r ${color}`} />
                                <div className="p-6">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                    <p className={`text-xl font-bold mt-2 ${text}`}>{value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gráfica 30 días + alertas */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Gráfica */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Ventas — últimos 30 días</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Ingresos diarios acumulados</p>
                                </div>
                            </div>
                            <MiniBar data={ultimos30} valueKey="total" />
                            {/* Eje X simplificado */}
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-300">{ultimos30[0]?.fecha}</span>
                                <span className="text-xs text-gray-300">{ultimos30[ultimos30.length - 1]?.fecha}</span>
                            </div>
                        </div>

                        {/* Alertas rápidas */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-4">Alertas del sistema</h2>
                            <div className="space-y-3">
                                {alertCards.map(({ label, value, href, color }) => (
                                    <Link key={label} href={href}
                                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition hover:opacity-80 ${color}`}>
                                        <span>{label}</span>
                                        <span className="font-bold">{value}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top productos + top clientes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top productos */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Top productos del mes</h2>
                            <p className="text-xs text-gray-400 mb-5">Por ingresos generados</p>
                            {topProductos.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">Sin ventas registradas este mes</p>
                            ) : topProductos.map((p, i) => (
                                <RankRow
                                    key={i}
                                    rank={i + 1}
                                    nombre={p.nombre}
                                    sub={`${p.categoria} · ${p.qty} uds vendidas`}
                                    value={fmt(p.revenue)}
                                    color="text-emerald-600"
                                />
                            ))}
                        </div>

                        {/* Top clientes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Top clientes del mes</h2>
                            <p className="text-xs text-gray-400 mb-5">Por total comprado</p>
                            {topClientes.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">Sin ventas registradas este mes</p>
                            ) : topClientes.map((c, i) => (
                                <RankRow
                                    key={i}
                                    rank={i + 1}
                                    nombre={c.nombre}
                                    sub={`${c.count} compra${c.count !== 1 ? 's' : ''} este mes`}
                                    value={fmt(c.total)}
                                    color="text-violet-600"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navegación a otros reportes */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { href: '/reportes/ventas',     label: 'Reporte Ventas',      color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                            { href: '/reportes/inventario', label: 'Reporte Inventario',  color: 'bg-amber-50 text-amber-700 hover:bg-amber-100'       },
                            { href: '/reportes/clientes',   label: 'Reporte Clientes',    color: 'bg-pink-50 text-pink-700 hover:bg-pink-100'           },
                            { href: '/reportes/financiero', label: 'Reporte Financiero',  color: 'bg-violet-50 text-violet-700 hover:bg-violet-100'     },
                        ].map(({ href, label, color }) => (
                            <Link key={href} href={href}
                                  className={`text-center py-3 px-4 rounded-xl text-sm font-medium transition ${color}`}>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
