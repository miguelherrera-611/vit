import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AbonosIndex({ clientes = [], busqueda = '' }) {
    const { auth } = usePage().props;
    const esAdmin = auth?.user?.roles?.some(r => r.name === 'admin') ?? false;

    const [busquedaLocal, setBusquedaLocal]         = useState(busqueda);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        venta_id:         '',
        monto:            '',
        forma_pago:       'Efectivo',
        observaciones:    '',
        tipo_movimiento:  'abono_normal',
    });

    const buscar = (e) => {
        e.preventDefault();
        window.location.href = '/abonos?cliente=' + encodeURIComponent(busquedaLocal);
    };

    const seleccionarVenta = (venta, cliente) => {
        setVentaSeleccionada(venta);
        setClienteSeleccionado(cliente);
        setData({ venta_id: venta.id, monto: '', forma_pago: 'Efectivo', observaciones: '', tipo_movimiento: 'abono_normal' });
    };

    const registrarAbono = (e) => {
        e.preventDefault();
        post('/abonos', {
            onSuccess: () => {
                reset();
                setVentaSeleccionada(null);
                window.location.reload();
            },
        });
    };

    const fmt = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

    const estadoColor = (e) =>
        ({ Completada: 'bg-green-100 text-green-800', Pendiente: 'bg-yellow-100 text-yellow-800', Cancelada: 'bg-red-100 text-red-800' }[e] ?? 'bg-gray-100 text-gray-700');

    // Badge para la lista de abonos previos de cada venta
    const tipoBadgeMini = (a) => a.es_ajuste
        ? <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Ajuste</span>
        : <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Abono</span>;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <h1 className="text-3xl font-light text-gray-900">Gestión de Abonos</h1>
                        <p className="mt-1 text-sm text-gray-500">Registra abonos en ventas a crédito o separado</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* ── Panel izquierdo: búsqueda y lista ── */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Cliente</h2>
                                <form onSubmit={buscar} className="flex gap-3">
                                    <div className="relative flex-1">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={busquedaLocal}
                                            onChange={(e) => setBusquedaLocal(e.target.value)}
                                            placeholder="Nombre, teléfono o documento..."
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                    </div>
                                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
                                        Buscar
                                    </button>
                                </form>
                            </div>

                            {!busqueda && (
                                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Busca un cliente por nombre, teléfono o documento</p>
                                </div>
                            )}

                            {busqueda && clientes.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                                    <p className="text-gray-500 text-sm">No se encontraron clientes con deudas activas para <strong>"{busqueda}"</strong></p>
                                </div>
                            )}

                            {clientes.map((cliente) => (
                                <div key={cliente.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                                            <p className="text-sm text-gray-500">{cliente.telefono}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{cliente.ventas.length} deuda{cliente.ventas.length !== 1 ? 's' : ''} activa{cliente.ventas.length !== 1 ? 's' : ''}</span>
                                    </div>

                                    {cliente.ventas.length === 0 ? (
                                        <div className="px-6 py-4 text-sm text-gray-400">Sin deudas activas</div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {cliente.ventas.map((venta) => (
                                                <div key={venta.id} className={'px-6 py-4 transition ' + (ventaSeleccionada?.id === venta.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50')}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium text-gray-800">{venta.numero_venta}</span>
                                                            <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoColor(venta.estado)}>{venta.estado}</span>
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{venta.tipo_venta}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{venta.created_at}</span>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-gray-400">Total</p>
                                                            <p className="text-sm font-medium text-gray-700">{fmt(venta.total)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Abonado</p>
                                                            <p className="text-sm font-medium text-green-700">{fmt(venta.pagado)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Saldo</p>
                                                            <p className="text-sm font-bold text-red-600">{fmt(venta.saldo_pendiente)}</p>
                                                        </div>
                                                    </div>

                                                    {venta.fecha_limite && (
                                                        <p className="text-xs text-gray-400 mb-3">Fecha límite: <span className="font-medium text-gray-600">{venta.fecha_limite}</span></p>
                                                    )}

                                                    {/* Lista de abonos previos con badge */}
                                                    {venta.abonos && venta.abonos.length > 0 && (
                                                        <div className="mb-3 bg-gray-50 rounded-xl p-3">
                                                            <p className="text-xs font-medium text-gray-500 mb-2">Movimientos registrados</p>
                                                            <div className="space-y-1">
                                                                {venta.abonos.map((a) => (
                                                                    <div key={a.id} className="flex items-center justify-between text-xs gap-2">
                                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                                            {tipoBadgeMini(a)}
                                                                            <span className="text-gray-500 truncate">{a.created_at} — {a.forma_pago}</span>
                                                                        </div>
                                                                        <span className="font-medium text-green-700 flex-shrink-0">+{fmt(a.monto)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => seleccionarVenta(venta, cliente)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition font-medium">Registrar abono</button>
                                                        <a href={'/abonos/' + venta.id + '/historial'} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition">Ver historial</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ── Panel derecho: formulario ── */}
                        <div className="lg:col-span-2">
                            {!ventaSeleccionada ? (
                                <div className="bg-white rounded-2xl shadow-sm p-8 text-center sticky top-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Selecciona una deuda para registrar un abono</p>
                                </div>
                            ) : (
                                <form onSubmit={registrarAbono} className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Registrar Abono</h2>
                                    <p className="text-sm text-gray-500 mb-5">{clienteSeleccionado?.nombre} — {ventaSeleccionada.numero_venta}</p>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Total venta</span>
                                            <span className="font-medium">{fmt(ventaSeleccionada.total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Ya abonado</span>
                                            <span className="font-medium text-green-700">{fmt(ventaSeleccionada.pagado)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2">
                                            <span className="text-gray-800">Saldo pendiente</span>
                                            <span className="text-red-600">{fmt(ventaSeleccionada.saldo_pendiente)}</span>
                                        </div>
                                    </div>

                                    {/* Tipo de movimiento — solo admin */}
                                    {esAdmin && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de movimiento</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('tipo_movimiento', 'abono_normal')}
                                                    className={'py-2 rounded-xl text-sm font-medium transition ' + (data.tipo_movimiento === 'abono_normal' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                                                >
                                                    Abono normal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('tipo_movimiento', 'ajuste')}
                                                    className={'py-2 rounded-xl text-sm font-medium transition ' + (data.tipo_movimiento === 'ajuste' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
                                                >
                                                    Ajuste
                                                </button>
                                            </div>
                                            {data.tipo_movimiento === 'ajuste' && (
                                                <p className="mt-1.5 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-1.5">
                                                    Los ajustes quedan registrados con auditoría completa.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Monto del abono <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                            <input
                                                type="number"
                                                value={data.monto}
                                                onChange={(e) => setData('monto', e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 text-lg font-semibold"
                                                placeholder="0"
                                                min="0.01"
                                                step="0.01"
                                            />
                                        </div>
                                        {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto}</p>}
                                        {data.monto && parseFloat(data.monto) > 0 && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-700">Saldo restante: <strong>{fmt(Math.max(0, ventaSeleccionada.saldo_pendiente - parseFloat(data.monto)))}</strong></p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Forma de pago</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'].map((fp) => (
                                                <button key={fp} type="button" onClick={() => setData('forma_pago', fp)} className={'py-2 rounded-xl text-sm font-medium transition ' + (data.forma_pago === fp ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                                                    {fp}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Observaciones {data.tipo_movimiento === 'ajuste' ? <span className="text-red-500">*</span> : <span className="text-gray-400">(opcional)</span>}
                                        </label>
                                        <textarea
                                            value={data.observaciones}
                                            onChange={(e) => setData('observaciones', e.target.value)}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 resize-none text-sm"
                                            placeholder={data.tipo_movimiento === 'ajuste' ? 'Describe el motivo del ajuste...' : 'Nota sobre el abono...'}
                                        />
                                    </div>

                                    {errors.error && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{errors.error}</p>}

                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => { setVentaSeleccionada(null); reset(); }} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.monto}
                                            className={'flex-1 py-3 text-white rounded-xl font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ' + (data.tipo_movimiento === 'ajuste' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700')}
                                        >
                                            {processing ? 'Guardando...' : data.tipo_movimiento === 'ajuste' ? 'Confirmar Ajuste' : 'Confirmar Abono'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
