import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function ClienteDetalleModal({ cliente, open, onClose }) {
    if (!cliente) return null;

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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener badge de tipo de venta
    const getTipoVentaBadge = (tipo) => {
        const badges = {
            'Contado': 'bg-green-100 text-green-800',
            'Separado': 'bg-yellow-100 text-yellow-800',
            'Crédito': 'bg-blue-100 text-blue-800'
        };
        return badges[tipo] || 'bg-gray-100 text-gray-800';
    };

    // Obtener badge de estado
    const getEstadoBadge = (estado) => {
        const badges = {
            'Pagada': 'bg-green-100 text-green-800',
            'Completada': 'bg-green-100 text-green-800',
            'Pendiente': 'bg-red-100 text-red-800',
            'Abonada': 'bg-yellow-100 text-yellow-800'
        };
        return badges[estado] || 'bg-gray-100 text-gray-800';
    };

    // Calcular estadísticas
    const totalCompras = cliente.ventas?.length || 0;
    const totalGastado = cliente.ventas?.reduce((sum, v) => sum + parseFloat(v.total), 0) || 0;
    const saldoPendiente = cliente.ventas?.reduce((sum, v) => sum + parseFloat(v.saldo_pendiente || 0), 0) || 0;
    const comprasContado = cliente.ventas?.filter(v => v.tipo_venta === 'Contado').length || 0;
    const comprasSeparado = cliente.ventas?.filter(v => v.tipo_venta === 'Separado').length || 0;
    const comprasCredito = cliente.ventas?.filter(v => v.tipo_venta === 'Crédito').length || 0;

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
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                                            <span className="text-white font-bold text-2xl">
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-2xl font-semibold text-gray-900">
                                                {cliente.nombre}
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {cliente.documento} • {cliente.telefono}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Estadísticas */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                                        <p className="text-sm text-blue-600 font-medium">Total Compras</p>
                                        <p className="text-2xl font-bold text-blue-900 mt-1">{totalCompras}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                                        <p className="text-sm text-green-600 font-medium">Total Gastado</p>
                                        <p className="text-2xl font-bold text-green-900 mt-1">{formatCurrency(totalGastado)}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
                                        <p className="text-sm text-yellow-600 font-medium">Separados</p>
                                        <p className="text-2xl font-bold text-yellow-900 mt-1">{comprasSeparado}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
                                        <p className="text-sm text-red-600 font-medium">Saldo Pendiente</p>
                                        <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(saldoPendiente)}</p>
                                    </div>
                                </div>

                                {/* Tabs de tipo de compra */}
                                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                                    <div className="pb-3 border-b-2 border-blue-600">
                                        <span className="text-sm font-medium text-blue-600">Todas ({totalCompras})</span>
                                    </div>
                                    <div className="pb-3">
                                        <span className="text-sm text-gray-500">Contado ({comprasContado})</span>
                                    </div>
                                    <div className="pb-3">
                                        <span className="text-sm text-gray-500">Separado ({comprasSeparado})</span>
                                    </div>
                                    <div className="pb-3">
                                        <span className="text-sm text-gray-500">Crédito ({comprasCredito})</span>
                                    </div>
                                </div>

                                {/* Historial de compras */}
                                <div className="max-h-96 overflow-y-auto">
                                    {cliente.ventas && cliente.ventas.length > 0 ? (
                                        <div className="space-y-3">
                                            {cliente.ventas.map((venta) => (
                                                <div key={venta.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Venta #{venta.numero_venta}
                                                            </span>
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoVentaBadge(venta.tipo_venta)}`}>
                                                                {venta.tipo_venta}
                                                            </span>
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(venta.estado)}`}>
                                                                {venta.estado}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(venta.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <p className="text-gray-500">Total</p>
                                                            <p className="font-semibold text-gray-900">{formatCurrency(venta.total)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Pagado</p>
                                                            <p className="font-semibold text-green-600">{formatCurrency(venta.pagado)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Saldo</p>
                                                            <p className="font-semibold text-red-600">{formatCurrency(venta.saldo_pendiente || 0)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500">Forma de Pago</p>
                                                            <p className="font-semibold text-gray-900">{venta.metodo_pago || venta.forma_pago || 'N/A'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Productos de la venta */}
                                                    {venta.detalles && venta.detalles.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-2">Productos:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {venta.detalles.map((detalle, idx) => (
                                                                    <span key={idx} className="text-xs bg-white px-2 py-1 rounded-lg text-gray-700">
                                                                        {detalle.producto?.nombre || 'Producto'} ({detalle.cantidad})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Abonos si existen */}
                                                    {venta.abonos && venta.abonos.length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                                            <p className="text-xs text-gray-500 mb-2">Historial de Abonos:</p>
                                                            <div className="space-y-1">
                                                                {venta.abonos.map((abono, idx) => (
                                                                    <div key={idx} className="flex justify-between text-xs">
                                                                        <span className="text-gray-600">{formatDate(abono.created_at)}</span>
                                                                        <span className="font-semibold text-green-600">{formatCurrency(abono.monto)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sin historial de compras</h3>
                                            <p className="text-gray-500">Este cliente aún no ha realizado ninguna compra</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
