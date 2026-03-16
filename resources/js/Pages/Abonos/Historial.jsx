import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function AbonosHistorial({ venta }) {
    const fmt = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

    const estadoColor = (e) =>
        ({ Completada: 'bg-green-100 text-green-800', Pendiente: 'bg-yellow-100 text-yellow-800', Cancelada: 'bg-red-100 text-red-800' }[e] ?? 'bg-gray-100 text-gray-700');

    const porcentajePagado = venta.total > 0 ? Math.min(100, Math.round((venta.pagado / venta.total) * 100)) : 0;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        <div className="flex items-center gap-4">
                            <Link href="/abonos" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-light text-gray-900">Historial de Abonos</h1>
                                <p className="text-sm text-gray-500">Venta {venta.numero_venta} — {venta.cliente}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Venta</p>
                                <p className="text-xl font-semibold text-gray-900">{venta.numero_venta}</p>
                                <p className="text-sm text-gray-500 mt-1">{venta.created_at}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={'px-3 py-1 rounded-full text-xs font-medium ' + estadoColor(venta.estado)}>
                                    {venta.estado}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    {venta.tipo_venta}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Total venta</p>
                                <p className="text-lg font-semibold text-gray-800">{fmt(venta.total)}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Total abonado</p>
                                <p className="text-lg font-semibold text-green-700">{fmt(venta.pagado)}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Saldo pendiente</p>
                                <p className="text-lg font-semibold text-red-600">{fmt(venta.saldo_pendiente)}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progreso de pago</span>
                                <span>{porcentajePagado}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={'h-2 rounded-full transition-all ' + (porcentajePagado >= 100 ? 'bg-green-500' : 'bg-blue-500')}
                                    style={{ width: porcentajePagado + '%' }}
                                />
                            </div>
                        </div>

                        {venta.fecha_limite && (
                            <p className="mt-3 text-sm text-gray-500">
                                Fecha límite: <span className="font-medium text-gray-700">{venta.fecha_limite}</span>
                            </p>
                        )}
                    </div>

                    {venta.detalles && venta.detalles.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {venta.detalles.map((d, i) => (
                                    <div key={i} className="px-6 py-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{d.nombre}</p>
                                            <p className="text-xs text-gray-400">{d.cantidad} x {fmt(d.precio_unitario)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">{fmt(d.subtotal)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Abonos registrados</h2>
                            <span className="text-sm text-gray-500">{venta.abonos.length} abono{venta.abonos.length !== 1 ? 's' : ''}</span>
                        </div>

                        {venta.abonos.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No hay abonos registrados</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {venta.abonos.map((abono, i) => (
                                    <div key={abono.id} className="px-6 py-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-semibold text-green-700">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{fmt(abono.monto)}</p>
                                                    <p className="text-xs text-gray-400">{abono.created_at}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {abono.forma_pago}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">{abono.empleado}</p>
                                            </div>
                                        </div>
                                        {abono.observaciones && (
                                            <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 ml-11">
                                                {abono.observaciones}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {venta.estado === 'Pendiente' && (
                        <div className="flex justify-end">
                            <Link href="/abonos" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm">
                                Registrar nuevo abono
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
