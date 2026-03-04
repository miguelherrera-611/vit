import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Gráfica de barras verticales con dos series */
function DoubleBar({ data }) {
    if (!data || data.length === 0) return null;
    const maxVal = Math.max(...data.map(d => d.ingresos || 0), 1);

    return (
        <div>
            <div className="flex items-end gap-2 h-40">
                {data.map((d, i) => {
                    const hIng  = Math.max(3, (d.ingresos  / maxVal) * 160);
                    const hDesc = d.ingresos > 0 ? Math.max(2, (d.descuentos / d.ingresos) * hIng) : 2;
                    const isLast = i === data.length - 1;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2
                                            opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                <p className="font-semibold">{d.mes}</p>
                                <p>Ingresos: {fmt(d.ingresos)}</p>
                                <p>Descuentos: {fmt(d.descuentos)}</p>
                                <p>Ventas: {d.num_ventas}</p>
                            </div>
                            {/* Barra descuentos encima de ingresos */}
                            <div className="w-full rounded-t bg-rose-300 opacity-70"
                                 style={{ height: `${hDesc}px` }} />
                            <div className={`w-full rounded-b transition-all ${isLast ? 'bg-violet-500' : 'bg-violet-200 group-hover:bg-violet-300'}`}
                                 style={{ height: `${hIng}px` }} />
                        </div>
                    );
                })}
            </div>
            {/* Eje X */}
            <div className="flex gap-2 mt-2">
                {data.map(d => (
                    <div key={d.mes} className="flex-1 text-center">
                        <p className="text-xs text-gray-400 truncate">{d.mes.split(' ')[0]}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const COLORES_METODO = {
    Efectivo:      { bg: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700' },
    Tarjeta:       { bg: 'bg-blue-500',    light: 'bg-blue-50 text-blue-700'       },
    Transferencia: { bg: 'bg-violet-500',  light: 'bg-violet-50 text-violet-700'   },
    Mixto:         { bg: 'bg-amber-500',   light: 'bg-amber-50 text-amber-700'     },
};

export default function ReporteFinanciero({ porMes = [], metodosPago = [], kpis = {} }) {
    const totalMetodos = metodosPago.reduce((s, m) => s + parseFloat(m.total || 0), 0);

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
                                <h1 className="text-3xl font-light text-gray-900">Reporte Financiero</h1>
                                <p className="mt-1 text-sm text-gray-500">Ingresos, descuentos y distribución de pagos — últimos 6 meses</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ingresos este mes</p>
                            <p className="text-2xl font-bold text-violet-600 mt-2">{fmt(kpis.ingresos_mes)}</p>
                            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${kpis.crecimiento >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                <svg className={`w-4 h-4 ${kpis.crecimiento < 0 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span>{kpis.crecimiento >= 0 ? '+' : ''}{kpis.crecimiento}% vs mes anterior</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Mes anterior</p>
                            <p className="text-2xl font-bold text-gray-700 mt-2">{fmt(kpis.ingresos_mes_ant)}</p>
                            <p className="text-xs text-gray-400 mt-2">Base de comparación</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Descuentos este mes</p>
                            <p className="text-2xl font-bold text-amber-600 mt-2">{fmt(kpis.total_descuentos)}</p>
                            <p className="text-xs text-gray-400 mt-2">Descuentos aplicados en ventas</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Saldo por cobrar</p>
                            <p className="text-2xl font-bold text-rose-600 mt-2">{fmt(kpis.total_pendiente)}</p>
                            <p className="text-xs text-gray-400 mt-2">Ventas en estado Pendiente</p>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ingresos totales históricos</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-2">{fmt(kpis.ingresos_totales)}</p>
                            <p className="text-xs text-gray-400 mt-2">Suma de todas las ventas registradas en el sistema</p>
                        </div>
                    </div>

                    {/* Gráfica 6 meses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Ingresos últimos 6 meses</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Las barras superiores (rosa) representan los descuentos</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-400 inline-block"/> Ingresos</span>
                                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-300 inline-block"/> Descuentos</span>
                            </div>
                        </div>
                        <DoubleBar data={porMes} />

                        {/* Tabla resumen por mes */}
                        <div className="mt-8 overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-100">
                                <tr>
                                    {['Mes', 'Ingresos', 'Descuentos', 'Neto', 'Ventas'].map(h => (
                                        <th key={h} className="pb-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider pr-6">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {[...porMes].reverse().map(d => (
                                    <tr key={d.mes} className="hover:bg-gray-50">
                                        <td className="py-3 pr-6 text-sm font-medium text-gray-900">{d.mes}</td>
                                        <td className="py-3 pr-6 text-sm font-semibold text-violet-600">{fmt(d.ingresos)}</td>
                                        <td className="py-3 pr-6 text-sm text-rose-500">{fmt(d.descuentos)}</td>
                                        <td className="py-3 pr-6 text-sm font-semibold text-emerald-600">{fmt(d.ingresos - d.descuentos)}</td>
                                        <td className="py-3 text-sm text-gray-500">{d.num_ventas}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Métodos de pago */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Distribución por método de pago</h2>
                        <p className="text-xs text-gray-400 mb-6">Histórico de todos los tiempos</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {metodosPago.map(m => {
                                const pct = totalMetodos > 0 ? ((m.total / totalMetodos) * 100).toFixed(1) : 0;
                                const c = COLORES_METODO[m.metodo_pago] || { bg: 'bg-gray-400', light: 'bg-gray-50 text-gray-700' };
                                return (
                                    <div key={m.metodo_pago} className={`rounded-xl p-5 ${c.light}`}>
                                        <p className="text-sm font-semibold">{m.metodo_pago}</p>
                                        <p className="text-2xl font-bold mt-2">{pct}%</p>
                                        <p className="text-sm mt-1 opacity-75">{fmt(m.total)}</p>
                                        <p className="text-xs mt-0.5 opacity-60">{m.count} transacciones</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Barras horizontales */}
                        <div className="space-y-4">
                            {metodosPago.map(m => {
                                const pct = totalMetodos > 0 ? (m.total / totalMetodos) * 100 : 0;
                                const c = COLORES_METODO[m.metodo_pago] || { bg: 'bg-gray-400' };
                                return (
                                    <div key={m.metodo_pago}>
                                        <div className="flex justify-between text-sm mb-1.5">
                                            <span className="font-medium text-gray-700">{m.metodo_pago}</span>
                                            <span className="text-gray-400">{fmt(m.total)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div className={`h-3 ${c.bg} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                            {metodosPago.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin datos de ventas</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
