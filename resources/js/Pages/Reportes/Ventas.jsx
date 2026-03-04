import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Barra horizontal proporcional */
function HBar({ label, value, max, color, sub }) {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 truncate max-w-[60%]">{label}</span>
                <span className="text-gray-500 text-xs">{sub}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-right text-gray-400">{fmt(value)}</p>
        </div>
    );
}

/* Mini gráfica de barras verticales */
function BarChart({ data }) {
    if (!data || data.length === 0) return <p className="text-sm text-gray-400 text-center py-8">Sin datos para el período</p>;
    const max = Math.max(...data.map(d => d.total || 0), 1);
    return (
        <div className="flex items-end gap-1 h-28">
            {data.map((d, i) => {
                const h = Math.max(3, (d.total / max) * 112);
                return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1
                                        opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {d.fecha}: {fmt(d.total)}
                        </div>
                        <div className="w-full bg-emerald-400 hover:bg-emerald-500 rounded-t transition-colors cursor-default"
                             style={{ height: `${h}px` }} />
                    </div>
                );
            })}
        </div>
    );
}

export default function ReporteVentas({
                                          ventas = [], ventasPorDia = [], porMetodoPago = [], porEstado = [],
                                          productosTop = [], kpis = {}, filtros = {}
                                      }) {
    const [desde, setDesde] = useState(filtros.desde ?? '');
    const [hasta, setHasta] = useState(filtros.hasta ?? '');
    const [estado, setEstado] = useState(filtros.estado ?? '');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    const aplicarFiltros = () => {
        setCurrentPage(1);
        router.get('/reportes/ventas', { desde, hasta, estado }, { preserveState: true });
    };

    const ventasPaginadas = useMemo(
        () => ventas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [ventas, currentPage]
    );

    const maxMetodo = Math.max(...porMetodoPago.map(m => m.total || 0), 1);

    const coloresMetodo = { Efectivo: 'bg-emerald-400', Tarjeta: 'bg-blue-400', Transferencia: 'bg-violet-400', Mixto: 'bg-amber-400' };
    const coloresEstado = { Completada: 'bg-green-100 text-green-800', Pendiente: 'bg-yellow-100 text-yellow-800', Cancelada: 'bg-red-100 text-red-800' };

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
                                <h1 className="text-3xl font-light text-gray-900">Reporte de Ventas</h1>
                                <p className="mt-1 text-sm text-gray-500">Período: {filtros.desde} al {filtros.hasta}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* Filtros */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">Filtrar período</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Desde</label>
                                <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Hasta</label>
                                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Estado</label>
                                <select value={estado} onChange={e => setEstado(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500">
                                    <option value="">Todos</option>
                                    <option value="Completada">Completada</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button onClick={aplicarFiltros}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Total ingresos',   value: fmt(kpis.total_ingresos),   color: 'text-emerald-600' },
                            { label: 'Nº de ventas',     value: kpis.num_ventas ?? 0,        color: 'text-blue-600'    },
                            { label: 'Ticket promedio',  value: fmt(kpis.ticket_promedio),   color: 'text-violet-600'  },
                            { label: 'Descuentos dados', value: fmt(kpis.total_descuentos),  color: 'text-amber-600'   },
                            { label: 'Por cobrar',       value: fmt(kpis.total_pendiente),   color: 'text-rose-600'    },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`text-xl font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Gráfica por día + métodos de pago */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Ventas por día</h2>
                            <p className="text-xs text-gray-400 mb-5">Ingresos diarios en el período</p>
                            <BarChart data={ventasPorDia} />
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Por método de pago</h2>
                            <p className="text-xs text-gray-400 mb-5">Distribución de ingresos</p>
                            <div className="space-y-4">
                                {porMetodoPago.map(m => (
                                    <HBar key={m.metodo} label={m.metodo}
                                          value={m.total} max={maxMetodo}
                                          color={coloresMetodo[m.metodo] || 'bg-gray-400'}
                                          sub={`${m.count} venta${m.count !== 1 ? 's' : ''}`} />
                                ))}
                                {porMetodoPago.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>}
                            </div>
                        </div>
                    </div>

                    {/* Top productos + estados */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top productos */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Productos más vendidos</h2>
                            <p className="text-xs text-gray-400 mb-5">Ranking por unidades vendidas en el período</p>
                            {productosTop.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">Sin datos para el período</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">#</th>
                                            <th className="pb-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                                            <th className="pb-3 text-right text-xs font-medium text-gray-400 uppercase">Uds</th>
                                            <th className="pb-3 text-right text-xs font-medium text-gray-400 uppercase">Ingresos</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                        {productosTop.map((p, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="py-3 text-sm text-gray-400 font-medium">{i + 1}</td>
                                                <td className="py-3">
                                                    <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
                                                    <p className="text-xs text-gray-400">{p.categoria}</p>
                                                </td>
                                                <td className="py-3 text-sm text-right font-semibold text-gray-900">{p.total_cantidad}</td>
                                                <td className="py-3 text-sm text-right font-semibold text-emerald-600">{fmt(p.total_ingresos)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Estados */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Por estado</h2>
                            <p className="text-xs text-gray-400 mb-5">Distribución de ventas</p>
                            <div className="space-y-3">
                                {porEstado.map(e => (
                                    <div key={e.estado} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                                        <div>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${coloresEstado[e.estado] || 'bg-gray-100 text-gray-700'}`}>
                                                {e.estado}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">{e.count} ventas</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{fmt(e.total)}</p>
                                    </div>
                                ))}
                                {porEstado.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>}
                            </div>
                        </div>
                    </div>

                    {/* Tabla de ventas */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900">
                                Detalle de ventas
                                <span className="ml-2 text-sm font-normal text-gray-400">({ventas.length} registros)</span>
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Nº Venta', 'Cliente', 'Fecha', 'Total', 'Método', 'Estado'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {ventasPaginadas.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{v.numero_venta}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{v.cliente?.nombre ?? 'General'}</td>
                                        <td className="px-6 py-3 text-sm text-gray-400">
                                            {new Date(v.created_at).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-semibold text-emerald-600">{fmt(v.total)}</td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{v.metodo_pago}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${coloresEstado[v.estado] || 'bg-gray-100 text-gray-700'}`}>
                                                    {v.estado}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                {ventas.length === 0 && (
                                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Sin ventas en el período seleccionado</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 pb-6">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={ventas.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="green"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
