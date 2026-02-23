import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function VentaDetalleModal({ venta, open, onClose }) {
    if (!venta) return null;

    // Formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener badge de tipo de venta
    const getTipoVentaBadge = (tipo) => {
        const badges = {
            'Contado': { bg: 'bg-green-100', text: 'text-green-800', icon: '💵' },
            'Separado': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🔒' },
            'Crédito': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '📋' }
        };
        return badges[tipo] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📄' };
    };

    // Obtener badge de estado
    const getEstadoBadge = (estado) => {
        const badges = {
            'Pagada': { bg: 'bg-green-100', text: 'text-green-800' },
            'Completada': { bg: 'bg-green-100', text: 'text-green-800' },
            'Pendiente': { bg: 'bg-red-100', text: 'text-red-800' },
            'Abonada': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            'Cancelada': { bg: 'bg-gray-100', text: 'text-gray-800' }
        };
        return badges[estado] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    const tipoVentaBadge = getTipoVentaBadge(venta.tipo_venta || 'Contado');
    const estadoBadge = getEstadoBadge(venta.estado);

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header con degradado */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Dialog.Title className="text-2xl font-bold text-white mb-2">
                                                Venta #{venta.numero_venta}
                                            </Dialog.Title>
                                            <p className="text-blue-100 text-sm">
                                                {formatDate(venta.created_at)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="text-white hover:text-blue-200 transition"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8">
                                    {/* Información General */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {/* Cliente */}
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Cliente</h3>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900 mb-1">
                                                {venta.cliente?.nombre || 'Cliente General'}
                                            </p>
                                            {venta.cliente?.telefono && (
                                                <p className="text-sm text-gray-600">
                                                    📱 {venta.cliente.telefono}
                                                </p>
                                            )}
                                            {venta.cliente?.documento && (
                                                <p className="text-sm text-gray-600">
                                                    🆔 {venta.cliente.documento}
                                                </p>
                                            )}
                                        </div>

                                        {/* Tipo de Venta */}
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                                            <div className="flex items-center mb-4">
                                                <span className="text-2xl mr-2">{tipoVentaBadge.icon}</span>
                                                <h3 className="text-sm font-semibold text-gray-700 uppercase">Tipo de Venta</h3>
                                            </div>
                                            <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${tipoVentaBadge.bg} ${tipoVentaBadge.text}`}>
                                                {venta.tipo_venta || 'Contado'}
                                            </span>
                                            <div className="mt-3">
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${estadoBadge.bg} ${estadoBadge.text}`}>
                                                    {venta.estado}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resumen Financiero */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4">💰 Resumen Financiero</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-blue-600 mb-1">Total</p>
                                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(venta.total)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-green-600 mb-1">Pagado</p>
                                                <p className="text-2xl font-bold text-green-700">{formatCurrency(venta.pagado)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-red-600 mb-1">Saldo Pendiente</p>
                                                <p className="text-2xl font-bold text-red-700">{formatCurrency(venta.saldo_pendiente || 0)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Forma de Pago</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {venta.tipo_venta === 'Contado' ? (venta.metodo_pago || venta.forma_pago || 'Efectivo') : venta.tipo_venta}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Productos</h3>
                                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cant.</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Precio Unit.</th>
                                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Subtotal</th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                {venta.detalles && venta.detalles.length > 0 ? (
                                                    venta.detalles.map((detalle, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3">
                                                                <p className="font-medium text-gray-900">
                                                                    {detalle.producto?.nombre || 'Producto'}
                                                                </p>
                                                                {detalle.producto?.codigo_barras && (
                                                                    <p className="text-xs text-gray-500">
                                                                        SKU: {detalle.producto.codigo_barras}
                                                                    </p>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-center font-semibold text-gray-900">
                                                                {detalle.cantidad}
                                                            </td>
                                                            <td className="px-4 py-3 text-right text-gray-900">
                                                                {formatCurrency(detalle.precio_unitario)}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                                                {formatCurrency(detalle.subtotal)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                            No hay productos en esta venta
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Historial de Abonos (para Separado/Crédito) */}
                                    {(venta.tipo_venta === 'Separado' || venta.tipo_venta === 'Crédito') && venta.abonos && venta.abonos.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">💳 Historial de Abonos</h3>
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Forma de Pago</th>
                                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Monto</th>
                                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Empleado</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                    {venta.abonos.map((abono, idx) => (
                                                        <tr key={idx} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {formatDate(abono.created_at)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {abono.forma_pago}
                                                            </td>
                                                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                                                                {formatCurrency(abono.monto)}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {abono.empleado?.name || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer Actions */}
                                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => window.print()}
                                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                            </svg>
                                            Imprimir
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
