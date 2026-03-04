import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function ReporteClientes({ clientes = [], kpis = {}, frecuencia = [] }) {
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState('total_compras');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    const clientesFiltrados = useMemo(() => {
        const q = busqueda.toLowerCase();
        return clientes
            .filter(c => !q || c.nombre.toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q))
            .sort((a, b) => (b[orden] ?? 0) - (a[orden] ?? 0));
    }, [clientes, busqueda, orden]);

    useEffect(() => { setCurrentPage(1); }, [busqueda, orden]);

    const clientesPaginados = useMemo(
        () => clientesFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [clientesFiltrados, currentPage]
    );

    const maxCompras = Math.max(...clientes.map(c => c.total_compras || 0), 1);

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
                                <h1 className="text-3xl font-light text-gray-900">Reporte de Clientes</h1>
                                <p className="mt-1 text-sm text-gray-500">Análisis de comportamiento y valor de clientes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { label: 'Total clientes',     value: kpis.total_clientes,   color: 'text-gray-900'    },
                            { label: 'Clientes activos',   value: kpis.clientes_activos, color: 'text-emerald-600' },
                            { label: 'Con deuda activa',   value: kpis.con_deuda,        color: 'text-rose-600'    },
                            { label: 'Total deuda',        value: fmt(kpis.total_deuda), color: 'text-rose-600'    },
                            { label: 'Ingresos totales',   value: fmt(kpis.ingreso_total), color: 'text-violet-600' },
                            { label: 'Mejor cliente',      value: kpis.mejor_cliente,    color: 'text-pink-600', small: true },
                        ].map(({ label, value, color, small }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`${small ? 'text-base' : 'text-xl'} font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Frecuencia de compra + top 5 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Frecuencia */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Frecuencia de compra</h2>
                            <p className="text-xs text-gray-400 mb-5">Distribución por número de pedidos</p>
                            <div className="space-y-4">
                                {frecuencia.map(f => {
                                    const maxF = Math.max(...frecuencia.map(x => x.count), 1);
                                    const pct = (f.count / maxF) * 100;
                                    return (
                                        <div key={f.label}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700 font-medium">{f.label}</span>
                                                <span className="text-gray-400">{f.count} clientes</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="h-2 bg-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top 5 clientes */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Top 5 mejores clientes</h2>
                            <p className="text-xs text-gray-400 mb-5">Por total histórico comprado</p>
                            <div className="space-y-3">
                                {clientes.slice(0, 5).map((c, i) => {
                                    const pct = (c.total_compras / maxCompras) * 100;
                                    return (
                                        <div key={c.id} className="flex items-center gap-4">
                                            <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {i + 1}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{c.nombre}</p>
                                                    <p className="text-sm font-bold text-pink-600 ml-3 flex-shrink-0">{fmt(c.total_compras)}</p>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                    <div className="h-1.5 bg-pink-400 rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">{c.num_compras} compra{c.num_compras !== 1 ? 's' : ''} · Última: {fmtDate(c.ultima_compra)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tabla completa */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-gray-900">Todos los clientes</h2>
                            <div className="flex gap-3">
                                <input type="text" placeholder="Buscar…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                                       className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 w-48" />
                                <select value={orden} onChange={e => setOrden(e.target.value)}
                                        className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-400">
                                    <option value="total_compras">Ordenar: Total comprado</option>
                                    <option value="num_compras">Ordenar: Nº compras</option>
                                    <option value="saldo_total">Ordenar: Deuda</option>
                                    <option value="ticket_promedio">Ordenar: Ticket promedio</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Cliente', 'Nº compras', 'Total comprado', 'Ticket promedio', 'Deuda', 'Última compra', 'Estado'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {clientesPaginados.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">{c.nombre.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{c.nombre}</p>
                                                    <p className="text-xs text-gray-400">{c.email || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">{c.num_compras}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-pink-600">{fmt(c.total_compras)}</td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{fmt(c.ticket_promedio)}</td>
                                        <td className="px-6 py-3">
                                            {c.saldo_total > 0
                                                ? <span className="text-xs font-semibold text-rose-700">{fmt(c.saldo_total)}</span>
                                                : <span className="text-xs text-gray-300">Sin deuda</span>}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-400">{fmtDate(c.ultima_compra)}</td>
                                        <td className="px-6 py-3">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {c.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                {clientesFiltrados.length === 0 && (
                                    <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">Sin resultados</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 pb-6">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={clientesFiltrados.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="pink"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
