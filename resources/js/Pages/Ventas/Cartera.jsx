import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Cartera({ ventas = [], kpis = {} }) {
    const [filtroTipo, setFiltroTipo]     = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda]         = useState('');

    const fmt = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

    const ventasFiltradas = useMemo(() => {
        const q = busqueda.toLowerCase();
        return ventas.filter((v) => {
            const matchBusqueda = !q || v.cliente.toLowerCase().includes(q) || v.numero_venta.toLowerCase().includes(q);
            const matchTipo     = !filtroTipo   || v.tipo_venta === filtroTipo;
            const matchEstado   = !filtroEstado || (filtroEstado === 'vencida' ? v.vencida : !v.vencida);
            return matchBusqueda && matchTipo && matchEstado;
        });
    }, [ventas, busqueda, filtroTipo, filtroEstado]);

    const hayFiltros = busqueda || filtroTipo || filtroEstado;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/ventas" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Cartera de Clientes</h1>
                                <p className="mt-1 text-sm text-gray-500">Deudas activas, créditos y separados pendientes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm p-5">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{fmt(kpis.total_cartera)}</p>
                            <p className="text-xs text-gray-500 mt-1">Total cartera</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-5">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpis.clientes_deuda}</p>
                            <p className="text-xs text-gray-500 mt-1">Clientes con deuda</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-5">
                            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpis.num_pendientes}</p>
                            <p className="text-xs text-gray-500 mt-1">Deudas activas</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-5">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpis.deudas_vencidas}</p>
                            <p className="text-xs text-gray-500 mt-1">Deudas vencidas</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar cliente o número..."
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="Crédito">Crédito</option>
                                <option value="Separado">Separado</option>
                            </select>
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="">Todas</option>
                                <option value="al_dia">Al día</option>
                                <option value="vencida">Vencidas</option>
                            </select>
                        </div>
                        {hayFiltros && (
                            <div className="mt-3 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{ventasFiltradas.length}</span> resultado{ventasFiltradas.length !== 1 ? 's' : ''}
                                </p>
                                <button
                                    onClick={() => { setBusqueda(''); setFiltroTipo(''); setFiltroEstado(''); }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {ventas.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin deudas activas</h3>
                            <p className="text-gray-400 text-sm">Todos los clientes están al día</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venta</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abonado</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha límite</th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {ventasFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">
                                                No hay resultados para los filtros aplicados
                                            </td>
                                        </tr>
                                    ) : (
                                        ventasFiltradas.map((v) => (
                                            <tr key={v.id} className={'hover:bg-gray-50 transition ' + (v.vencida ? 'bg-red-50' : '')}>
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-medium text-gray-800">{v.cliente}</p>
                                                    {v.cliente_tel && <p className="text-xs text-gray-400">{v.cliente_tel}</p>}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{v.numero_venta}</td>
                                                <td className="px-5 py-4">
                                                        <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (v.tipo_venta === 'Crédito' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700')}>
                                                            {v.tipo_venta}
                                                        </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{fmt(v.total)}</td>
                                                <td className="px-5 py-4 text-sm text-green-700 font-medium whitespace-nowrap">{fmt(v.pagado)}</td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                        <span className={'text-sm font-bold ' + (v.vencida ? 'text-red-600' : 'text-orange-600')}>
                                                            {fmt(v.saldo_pendiente)}
                                                        </span>
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap">
                                                    {v.fecha_limite ? (
                                                        <div>
                                                            <p className={'text-sm ' + (v.vencida ? 'text-red-600 font-medium' : 'text-gray-600')}>
                                                                {v.fecha_limite}
                                                            </p>
                                                            {v.vencida && v.dias_mora > 0 && (
                                                                <p className="text-xs text-red-500">{v.dias_mora} día{v.dias_mora !== 1 ? 's' : ''} de mora</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin fecha</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {v.vencida ? (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Vencida</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Al día</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a href={'/abonos/' + v.id + '/historial'} className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition">
                                                            Ver abonos
                                                        </a>
                                                        <span className="text-gray-300">|</span>
                                                        <a href={'/abonos?cliente=' + encodeURIComponent(v.cliente)} className="text-xs text-green-600 hover:text-green-800 hover:underline transition">
                                                            Abonar
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {ventasFiltradas.length > 0 && (
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        {ventasFiltradas.length} deuda{ventasFiltradas.length !== 1 ? 's' : ''} — Total pendiente: <span className="font-semibold text-gray-700">{fmt(ventasFiltradas.reduce((s, v) => s + parseFloat(v.saldo_pendiente), 0))}</span>
                                    </p>
                                    <Link href="/abonos" className="px-4 py-2 bg-blue-600 text-white text-xs rounded-xl hover:bg-blue-700 transition font-medium">
                                        Ir a gestionar abonos
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
