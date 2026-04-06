import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function ClienteDetalleModal({ cliente, open, onClose }) {
    const [mobileTopPad, setMobileTopPad] = useState(12);

    useEffect(() => {
        if (!open) return;
        const recalcTop = () => {
            const nav = document.querySelector('.app-nav');
            const navH = nav ? nav.getBoundingClientRect().height : 56;
            setMobileTopPad(navH + 8);
        };
        recalcTop();
        window.addEventListener('resize', recalcTop);
        return () => window.removeEventListener('resize', recalcTop);
    }, [open]);

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
                <style>{`
                    .cdm-panel{
                        width:100%;
                        max-width:980px;
                        max-height:90vh;
                        overflow:hidden;
                        border-radius:22px;
                        background:rgba(255,255,255,.92);
                        border:1px solid rgba(255,255,255,.72);
                        box-shadow:0 24px 64px rgba(180,90,20,.16),0 8px 24px rgba(180,90,20,.08);
                        display:flex;
                        flex-direction:column;
                    }
                    .cdm-head{padding:1.1rem 1.2rem;border-bottom:1px solid rgba(200,140,80,.12);display:flex;justify-content:space-between;gap:.8rem}
                    .cdm-body{padding:1rem 1.2rem;overflow:auto}
                    .cdm-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.7rem;margin-bottom:1rem}
                    .cdm-stat{background:rgba(255,255,255,.65);border:1px solid rgba(200,140,80,.14);border-radius:12px;padding:.75rem}
                    .cdm-list{display:flex;flex-direction:column;gap:.55rem}
                    .cdm-item{background:rgba(255,255,255,.66);border:1px solid rgba(200,140,80,.12);border-radius:12px;padding:.8rem}
                    .cdm-sale-head{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.65rem;flex-wrap:wrap}
                    .cdm-sale-meta{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap}
                    .cdm-sale-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.65rem}
                    .cdm-footer{padding:.9rem 1.2rem;border-top:1px solid rgba(200,140,80,.12);display:flex;justify-content:flex-end}

                    @media (max-width:900px){
                        .cdm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
                        .cdm-sale-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
                    }

                    @media (max-width:640px){
                        .cdm-panel{
                            width:calc(100vw - 1rem);
                            max-width:calc(100vw - 1rem);
                            max-height:78vh; /* más compacto verticalmente */
                            border-radius:16px;
                        }
                        .cdm-head,.cdm-body,.cdm-footer{padding:.82rem}
                        .cdm-grid{grid-template-columns:1fr}
                        .cdm-sale-grid{grid-template-columns:1fr}
                        .cdm-item{padding:.68rem}
                    }
                `}</style>

                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px]" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div
                        className="flex min-h-full items-start sm:items-center justify-center p-2 sm:p-4"
                        style={{ paddingTop: `max(${mobileTopPad}px, 0.75rem)` }}
                    >
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="cdm-panel">
                                <div className="cdm-head">
                                    <div className="flex items-center min-w-0">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3"
                                             style={{background:'rgba(220,38,38,.09)',border:'1px solid rgba(220,38,38,.2)'}}>
                                            <span className="font-bold text-xl" style={{color:'rgba(185,28,28,.85)'}}>
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <Dialog.Title className="text-xl font-semibold text-gray-900 truncate">{cliente.nombre}</Dialog.Title>
                                            <p className="text-xs text-gray-500 truncate">{cliente.documento || 'Sin documento'} · {cliente.telefono || 'Sin teléfono'}</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="cdm-body">
                                    <div className="cdm-grid">
                                        <div className="cdm-stat">
                                            <p className="text-sm text-gray-500 font-medium">Total Compras</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCompras}</p>
                                        </div>
                                        <div className="cdm-stat">
                                            <p className="text-sm text-gray-500 font-medium">Total Gastado</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalGastado)}</p>
                                        </div>
                                        <div className="cdm-stat">
                                            <p className="text-sm text-gray-500 font-medium">Separados</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{comprasSeparado}</p>
                                        </div>
                                        <div className="cdm-stat">
                                            <p className="text-sm text-gray-500 font-medium">Saldo Pendiente</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(saldoPendiente)}</p>
                                        </div>
                                    </div>

                                    <div className="cdm-list">
                                        {cliente.ventas && cliente.ventas.length > 0 ? (
                                            cliente.ventas.map((venta) => (
                                                <div key={venta.id} className="cdm-item">
                                                    <div className="cdm-sale-head">
                                                        <div className="cdm-sale-meta">
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
                                                        <span className="text-xs sm:text-sm text-gray-500">
                                                            {formatDate(venta.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="cdm-sale-grid text-sm">
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
                                            ))
                                        ) : (
                                            <div className="text-center py-10">
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
                                </div>

                                <div className="cdm-footer">
                                    <button onClick={onClose}
                                            style={{padding:'.6rem 1rem',borderRadius:'10px',background:'rgba(255,255,255,.7)',border:'1px solid rgba(200,140,80,.18)',color:'rgba(120,60,10,.78)'}}>
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
