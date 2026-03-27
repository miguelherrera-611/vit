import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function VentasCreate({ productos = [], clientes = [] }) {
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [items, setItems]                       = useState([]);
    const [avisoClienteGeneral, setAvisoClienteGeneral] = useState(false);
    const [ventaExitosa, setVentaExitosa]               = useState(null);

    // Guardamos tipo y total ANTES del post porque reset() los borra
    const pendingMeta = useRef(null);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        cliente_id:   '',
        tipo_venta:   'Contado',
        metodo_pago:  'Efectivo',
        pagado:       '',
        descuento:    '0',
        notas:        '',
        fecha_limite: '',
        items:        [],
    });

    useEffect(() => {
        if (errors.items) clearErrors('items');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(busquedaProducto.toLowerCase()))
    );

    const agregarProducto = (producto) => {
        const existe = items.find(i => i.producto_id === producto.id);
        if (existe) {
            const nuevosItems = items.map(i =>
                i.producto_id === producto.id
                    ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) }
                    : i
            );
            setItems(nuevosItems);
            setData('items', nuevosItems);
        } else {
            const nuevosItems = [...items, {
                producto_id:     producto.id,
                nombre:          producto.nombre,
                precio_unitario: producto.precio,
                cantidad:        1,
                stock_max:       producto.stock,
            }];
            setItems(nuevosItems);
            setData('items', nuevosItems);
        }
        setBusquedaProducto('');
    };

    const actualizarCantidad = (idx, cantidad) => {
        const nuevosItems = items.map((item, i) => {
            if (i === idx) {
                const cant = Math.max(1, Math.min(parseInt(cantidad) || 1, item.stock_max));
                return { ...item, cantidad: cant };
            }
            return item;
        });
        setItems(nuevosItems);
        setData('items', nuevosItems);
    };

    const actualizarPrecio = (idx, precio) => {
        const nuevosItems = items.map((item, i) =>
            i === idx ? { ...item, precio_unitario: parseFloat(precio) || 0 } : item
        );
        setItems(nuevosItems);
        setData('items', nuevosItems);
    };

    const eliminarItem = (idx) => {
        const nuevosItems = items.filter((_, i) => i !== idx);
        setItems(nuevosItems);
        setData('items', nuevosItems);
    };

    const cambiarTipoVenta = (tipo) => {
        setAvisoClienteGeneral(false);
        if (tipo === 'Contado') {
            setData(prev => ({ ...prev, tipo_venta: tipo, fecha_limite: '' }));
        } else {
            setData(prev => ({ ...prev, tipo_venta: tipo, fecha_limite: fechaSugerida(tipo) }));
        }
    };

    const subtotal       = items.reduce((acc, i) => acc + (i.cantidad * i.precio_unitario), 0);
    const descuento      = parseFloat(data.descuento) || 0;
    const total          = subtotal - descuento;
    const pagado         = parseFloat(data.pagado) || 0;
    const saldoPendiente = Math.max(0, total - pagado);

    const esClienteGeneral  = !data.cliente_id;
    const esContado         = data.tipo_venta === 'Contado';
    const pagoInsuficiente  = data.pagado !== '' && pagado < total && total > 0;
    const mostrarAvisoDeuda = esClienteGeneral && esContado && pagoInsuficiente && items.length > 0;

    const hayErrorStock   = !!errors.items;
    const submitBloqueado = mostrarAvisoDeuda || hayErrorStock;

    const formatCurrency = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

    const fechaMinima = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const fechaSugerida = (tipo) => {
        const d = new Date();
        d.setDate(d.getDate() + (tipo === 'Separado' ? 30 : 60));
        return d.toISOString().split('T')[0];
    };

    const cambiarASeparado = () => {
        setData(prev => ({ ...prev, tipo_venta: 'Separado', fecha_limite: fechaSugerida('Separado') }));
        setAvisoClienteGeneral(false);
    };

    const submit = (e) => {
        e.preventDefault();

        if (esClienteGeneral && esContado && pagado < total && total > 0) {
            setAvisoClienteGeneral(true);
            setTimeout(() => {
                document.getElementById('aviso-cliente-general')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            return;
        }

        // Guardamos meta ANTES del post
        pendingMeta.current = { tipo_venta: data.tipo_venta, total };

        post('/ventas', {
            preserveState: true,   // <-- evita que Inertia desmonte el componente
            preserveScroll: true,
            onSuccess: () => {
                const meta = pendingMeta.current;
                // Reset completo
                setItems([]);
                setBusquedaProducto('');
                setAvisoClienteGeneral(false);
                reset();
                // Mostrar modal
                setVentaExitosa(meta);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: () => {
                setTimeout(() => {
                    document.getElementById('aviso-stock')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
            },
        });
    };

    const esCreditoOSeparado = data.tipo_venta === 'Crédito' || data.tipo_venta === 'Separado';

    const modalConfig = {
        Contado:  { bg: 'bg-green-100', text: 'text-green-700', label: 'Venta de contado', path: 'M5 13l4 4L19 7' },
        Separado: { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Venta separada',   path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        Credito:  { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Venta a crédito',  path: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    };
    const cfgKey = ventaExitosa?.tipo_venta === 'Crédito' ? 'Credito' : (ventaExitosa?.tipo_venta ?? 'Contado');
    const cfg    = modalConfig[cfgKey] ?? modalConfig.Contado;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center space-x-4">
                            <Link href="/ventas" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-light text-gray-900">Nueva Venta</h1>
                                <p className="text-sm text-gray-500">Punto de venta</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                            {/* ── Panel izquierdo ── */}
                            <div className="lg:col-span-3 space-y-6">

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Productos</h2>
                                    <div className="relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={busquedaProducto}
                                            onChange={(e) => setBusquedaProducto(e.target.value)}
                                            placeholder="Buscar producto por nombre o código..."
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50"
                                        />
                                    </div>

                                    {busquedaProducto.length > 0 && (
                                        <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                                            {productosFiltrados.length === 0 ? (
                                                <p className="text-sm text-gray-500 p-4">Sin resultados</p>
                                            ) : (
                                                productosFiltrados.map(p => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => agregarProducto(p)}
                                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-800 text-sm">{p.nombre}</p>
                                                            <p className="text-xs text-gray-400">{p.categoria}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-blue-700 text-sm">{formatCurrency(p.precio)}</p>
                                                            <p className="text-xs text-gray-400">Stock: {p.stock}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className={
                                    'bg-white rounded-2xl shadow-sm overflow-hidden transition ' +
                                    (hayErrorStock ? 'ring-2 ring-red-400' : '')
                                }>
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900">Artículos</h2>
                                        <span className="text-sm text-gray-500">{items.length} items</span>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 text-sm">Busca y agrega productos a la venta</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-50">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="px-6 py-4 flex items-center space-x-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">{item.nombre}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">Stock disponible: {item.stock_max}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button type="button" onClick={() => actualizarCantidad(idx, item.cantidad - 1)} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                        </button>
                                                        <input type="number" value={item.cantidad} onChange={(e) => actualizarCantidad(idx, e.target.value)} className="w-14 text-center border border-gray-200 rounded-lg py-1.5 text-sm focus:outline-none focus:border-blue-500" min="1" max={item.stock_max} />
                                                        <button type="button" onClick={() => actualizarCantidad(idx, item.cantidad + 1)} className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        </button>
                                                    </div>
                                                    <div className="w-32">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                            <input type="number" value={item.precio_unitario} onChange={(e) => actualizarPrecio(idx, e.target.value)} className="w-full pl-5 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" min="0" />
                                                        </div>
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.cantidad * item.precio_unitario)}</p>
                                                    </div>
                                                    <button type="button" onClick={() => eliminarItem(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {hayErrorStock && (
                                    <div className="flex items-start gap-2 px-1">
                                        <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                        <p className="text-sm text-red-600 font-medium">Hay productos sin stock suficiente. Revisa el aviso en el panel de pago.</p>
                                    </div>
                                )}
                            </div>

                            {/* ── Panel derecho ── */}
                            <div className="lg:col-span-2 space-y-6">

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h2>
                                    <select
                                        value={data.cliente_id}
                                        onChange={(e) => { setData('cliente_id', e.target.value); setAvisoClienteGeneral(false); }}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 text-sm"
                                    >
                                        <option value="">Cliente general (sin cuenta)</option>
                                        {clientes.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre} {c.apellido || ''}</option>
                                        ))}
                                    </select>
                                    {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Venta</h2>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {['Contado', 'Separado', 'Crédito'].map(tipo => (
                                            <button key={tipo} type="button" onClick={() => cambiarTipoVenta(tipo)}
                                                    className={'py-2.5 rounded-xl text-sm font-medium transition ' + (data.tipo_venta === tipo ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                                                {tipo}
                                            </button>
                                        ))}
                                    </div>

                                    {esCreditoOSeparado && (
                                        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <label className="text-sm font-medium text-amber-800">
                                                    Fecha límite de pago {data.tipo_venta === 'Separado' ? '(separado)' : '(crédito)'}
                                                </label>
                                            </div>
                                            <input
                                                type="date"
                                                value={data.fecha_limite}
                                                onChange={(e) => setData('fecha_limite', e.target.value)}
                                                min={fechaMinima()}
                                                className="w-full px-4 py-2.5 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-sm"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button type="button" onClick={() => setData('fecha_limite', fechaSugerida(data.tipo_venta))} className="text-xs text-amber-700 underline hover:text-amber-900">
                                                    {data.tipo_venta === 'Separado' ? 'Sugerir 30 días' : 'Sugerir 60 días'}
                                                </button>
                                            </div>
                                            {errors.fecha_limite && <p className="mt-1 text-xs text-red-600">{errors.fecha_limite}</p>}
                                            <p className="mt-2 text-xs text-amber-600">
                                                {data.tipo_venta === 'Separado'
                                                    ? 'El producto quedará reservado hasta esta fecha.'
                                                    : 'El producto se entrega ahora. El cliente tiene hasta esta fecha para pagar.'}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                                        <select value={data.metodo_pago} onChange={(e) => setData('metodo_pago', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 text-sm">
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Mixto">Mixto</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal</span>
                                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Descuento</span>
                                            <div className="relative w-32">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                <input type="number" value={data.descuento} onChange={(e) => setData('descuento', e.target.value)} className="w-full pl-5 pr-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500" min="0" />
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-3 flex justify-between">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="font-bold text-xl text-blue-700">{formatCurrency(total)}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Monto Recibido <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                            <input
                                                type="number"
                                                value={data.pagado}
                                                onChange={(e) => { setData('pagado', e.target.value); if (avisoClienteGeneral) setAvisoClienteGeneral(false); }}
                                                className={'w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-gray-50 text-lg font-semibold ' + (mostrarAvisoDeuda ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100')}
                                                placeholder="0" min="0"
                                            />
                                        </div>

                                        {data.pagado !== '' && pagado >= total && total > 0 && (
                                            <div className="mt-2 p-2 bg-green-50 rounded-lg flex justify-between">
                                                <span className="text-sm text-green-700">Cambio:</span>
                                                <span className="text-sm font-semibold text-green-700">{formatCurrency(pagado - total)}</span>
                                            </div>
                                        )}
                                        {data.pagado !== '' && pagado < total && total > 0 && !mostrarAvisoDeuda && (
                                            <div className="mt-2 p-2 bg-amber-50 rounded-lg flex justify-between">
                                                <span className="text-sm text-amber-700">Saldo pendiente:</span>
                                                <span className="text-sm font-semibold text-amber-700">{formatCurrency(saldoPendiente)}</span>
                                            </div>
                                        )}
                                        {errors.pagado && <p className="mt-1 text-sm text-red-600">{errors.pagado}</p>}
                                    </div>
                                </div>

                                {hayErrorStock && (
                                    <div id="aviso-stock" className="bg-red-50 border border-red-300 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-red-800 text-sm mb-2">Stock insuficiente</p>
                                                {errors.items.split(' | ').map((msg, i) => (
                                                    <p key={i} className="text-red-700 text-sm leading-relaxed">• {msg}</p>
                                                ))}
                                                <p className="text-red-600 text-xs mt-3">Reduce las cantidades o elimina los productos afectados.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {mostrarAvisoDeuda && (
                                    <div id="aviso-cliente-general" className="bg-red-50 border border-red-300 rounded-2xl p-5 shadow-sm">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-800 text-sm">¿A quién le cobras la deuda?</p>
                                                <p className="text-red-700 text-sm mt-1">
                                                    El cliente general no tiene cuenta. Si queda un saldo de{' '}
                                                    <span className="font-bold">{formatCurrency(saldoPendiente)}</span> pendiente, no habrá a quién cobrarle.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mt-4">
                                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">¿Qué deseas hacer?</p>
                                            <button type="button" onClick={() => { setData('pagado', total.toString()); setAvisoClienteGeneral(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition text-left">
                                                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Completar el pago ahora</p>
                                                    <p className="text-xs text-gray-500">Ajustar a {formatCurrency(total)} y continuar</p>
                                                </div>
                                            </button>
                                            <button type="button" onClick={cambiarASeparado}
                                                    className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition text-left">
                                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Cambiar a Separado</p>
                                                    <p className="text-xs text-gray-500">El producto se reserva con abono parcial</p>
                                                </div>
                                            </button>
                                            <Link href="/clientes/crear"
                                                  className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition text-left">
                                                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">Registrar al cliente</p>
                                                    <p className="text-xs text-gray-500">Crear cuenta y volver a registrar la venta</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                                    <textarea value={data.notas} onChange={(e) => setData('notas', e.target.value)} rows={2}
                                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none text-sm"
                                              placeholder="Observaciones de la venta..." />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || items.length === 0 || submitBloqueado}
                                    className={
                                        'w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 ' +
                                        (submitBloqueado
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none')
                                    }
                                >
                                    {processing ? 'Procesando...' : 'Registrar Venta • ' + formatCurrency(total)}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ── Modal éxito ── */}
            {ventaExitosa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
                        <div className={'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ' + cfg.bg}>
                            <svg className={'w-10 h-10 ' + cfg.text} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cfg.path} />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">¡Venta registrada!</h2>
                        <p className="text-gray-500 text-sm mb-6">La venta fue creada exitosamente</p>
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tipo</span>
                                <span className={'font-semibold ' + cfg.text}>{cfg.label}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total</span>
                                <span className="font-bold text-gray-900">{formatCurrency(ventaExitosa.total)}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setVentaExitosa(null)}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition text-sm">
                                Nueva venta
                            </button>
                            <button onClick={() => router.visit('/ventas')}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
                                Ver ventas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
