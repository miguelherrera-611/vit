import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Kardex({ producto, movimientos }) {
    const [modalObs, setModalObs] = useState(null); // guarda el movimiento completo

    const formatCantidad = (cantidad) => {
        if (cantidad > 0) return `+${cantidad}`;
        return `${cantidad}`;
    };

    const colorTipo = (tipo) => {
        switch (tipo) {
            case 'venta':          return 'bg-red-100 text-red-700';
            case 'anulacion':      return 'bg-green-100 text-green-700';
            case 'ajuste_entrada': return 'bg-green-100 text-green-700';
            case 'ajuste_salida':  return 'bg-orange-100 text-orange-700';
            case 'inicial':        return 'bg-blue-100 text-blue-700';
            default:               return 'bg-gray-100 text-gray-700';
        }
    };

    const colorCantidad = (esEntrada) =>
        esEntrada ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">

                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/inventario"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="flex-1">
                                <h1 className="text-2xl font-light text-gray-900">
                                    Kardex — {producto.nombre}
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {producto.categoria} · Historial de movimientos de inventario
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Stock actual</p>
                                <p className={
                                    'text-3xl font-bold ' +
                                    (producto.stock === 0
                                        ? 'text-red-600'
                                        : producto.stock <= 5
                                            ? 'text-amber-600'
                                            : 'text-green-600')
                                }>
                                    {producto.stock}
                                </p>
                                <p className="text-xs text-gray-400">unidades</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* Resumen rápido */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total movimientos',  value: movimientos.length,                                                                   color: 'text-gray-900'   },
                            { label: 'Ventas registradas', value: movimientos.filter(m => m.tipo === 'venta').length,                                   color: 'text-red-600'    },
                            { label: 'Ajustes de entrada', value: movimientos.filter(m => m.tipo === 'ajuste_entrada' || m.tipo === 'anulacion').length, color: 'text-green-600'  },
                            { label: 'Ajustes de salida',  value: movimientos.filter(m => m.tipo === 'ajuste_salida').length,                           color: 'text-orange-600' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabla */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Historial de movimientos</h2>
                            <span className="text-sm text-gray-500">{movimientos.length} registro(s)</span>
                        </div>

                        {movimientos.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No hay movimientos registrados para este producto.</p>
                                <p className="text-gray-300 text-xs mt-1">Los movimientos se registran automáticamente al vender, anular o ajustar el inventario.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Motivo</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Cantidad</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock anterior</th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock nuevo</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                    {movimientos.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {m.created_at}
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorTipo(m.tipo)}`}>
                                                        {m.tipo_label}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-gray-700">{m.motivo ?? '—'}</p>

                                                    {/* Botón "Ver nota" — solo aparece si hay observaciones */}
                                                    {m.observaciones && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setModalObs(m)}
                                                            title="Ver observaciones completas"
                                                            className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Ver nota
                                                        </button>
                                                    )}
                                                </div>

                                                {m.referencia_tipo && m.referencia_id && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        Ref: {m.referencia_tipo} #{m.referencia_id}
                                                    </p>
                                                )}
                                            </td>
                                            <td className={`px-6 py-4 text-center text-sm ${colorCantidad(m.es_entrada)}`}>
                                                {formatCantidad(m.cantidad)}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-600">
                                                {m.stock_anterior}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                    <span className={
                                                        'text-sm font-semibold ' +
                                                        (m.stock_nuevo === 0
                                                            ? 'text-red-600'
                                                            : m.stock_nuevo <= 5
                                                                ? 'text-amber-600'
                                                                : 'text-gray-900')
                                                    }>
                                                        {m.stock_nuevo}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {m.usuario}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modal observaciones ── */}
            {modalObs && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
                    onClick={() => setModalObs(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cabecera */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Observaciones del ajuste</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {modalObs.created_at} · {modalObs.usuario}
                                </p>
                            </div>
                            <button
                                onClick={() => setModalObs(null)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tipo + motivo */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorTipo(modalObs.tipo)}`}>
                                {modalObs.tipo_label}
                            </span>
                            {modalObs.motivo && (
                                <span className="text-sm text-gray-600 font-medium">{modalObs.motivo}</span>
                            )}
                        </div>

                        {/* Cuerpo de la nota */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-[80px]">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {modalObs.observaciones}
                            </p>
                        </div>

                        <button
                            onClick={() => setModalObs(null)}
                            className="mt-4 w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
