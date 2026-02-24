import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function VentasCreate({ productos = [], clientes = [] }) {
    const [busquedaProducto, setBusquedaProducto] = useState('');
    const [items, setItems] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: '',
        tipo_venta: 'Contado',
        metodo_pago: 'Efectivo',
        pagado: '',
        descuento: '0',
        notas: '',
        items: [],
    });

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
                producto_id: producto.id,
                nombre: producto.nombre,
                precio_unitario: producto.precio,
                cantidad: 1,
                stock_max: producto.stock,
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

    const subtotal = items.reduce((acc, i) => acc + (i.cantidad * i.precio_unitario), 0);
    const descuento = parseFloat(data.descuento) || 0;
    const total = subtotal - descuento;

    const formatCurrency = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

    const submit = (e) => {
        e.preventDefault();
        post('/ventas');
    };

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
                            {/* Panel izquierdo: productos */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Buscador de productos */}
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

                                {/* Lista de items */}
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => actualizarCantidad(idx, item.cantidad - 1)}
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={item.cantidad}
                                                            onChange={(e) => actualizarCantidad(idx, e.target.value)}
                                                            className="w-14 text-center border border-gray-200 rounded-lg py-1.5 text-sm focus:outline-none focus:border-blue-500"
                                                            min="1"
                                                            max={item.stock_max}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => actualizarCantidad(idx, item.cantidad + 1)}
                                                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="w-32">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                                            <input
                                                                type="number"
                                                                value={item.precio_unitario}
                                                                onChange={(e) => actualizarPrecio(idx, e.target.value)}
                                                                className="w-full pl-5 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(item.cantidad * item.precio_unitario)}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarItem(idx)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {errors.items && (
                                    <p className="text-sm text-red-600 px-2">{errors.items}</p>
                                )}
                            </div>

                            {/* Panel derecho: resumen y pago */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Cliente */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h2>
                                    <select
                                        value={data.cliente_id}
                                        onChange={(e) => setData('cliente_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 text-sm"
                                    >
                                        <option value="">Cliente general (sin cuenta)</option>
                                        {clientes.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre} {c.apellido || ''}</option>
                                        ))}
                                    </select>
                                    {errors.cliente_id && <p className="mt-1 text-sm text-red-600">{errors.cliente_id}</p>}
                                </div>

                                {/* Tipo de venta */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Venta</h2>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {['Contado', 'Separado', 'Crédito'].map(tipo => (
                                            <button
                                                key={tipo}
                                                type="button"
                                                onClick={() => setData('tipo_venta', tipo)}
                                                className={`py-2.5 rounded-xl text-sm font-medium transition ${data.tipo_venta === tipo ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {tipo}
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                                        <select
                                            value={data.metodo_pago}
                                            onChange={(e) => setData('metodo_pago', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-gray-50 text-sm"
                                        >
                                            <option value="Efectivo">Efectivo</option>
                                            <option value="Tarjeta">Tarjeta</option>
                                            <option value="Transferencia">Transferencia</option>
                                            <option value="Mixto">Mixto</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Totales y pago */}
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
                                                <input
                                                    type="number"
                                                    value={data.descuento}
                                                    onChange={(e) => setData('descuento', e.target.value)}
                                                    className="w-full pl-5 pr-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500"
                                                    min="0"
                                                />
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
                                                onChange={(e) => setData('pagado', e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 text-lg font-semibold"
                                                placeholder="0"
                                                min="0"
                                            />
                                        </div>
                                        {data.pagado && parseFloat(data.pagado) >= total && (
                                            <div className="mt-2 p-2 bg-green-50 rounded-lg flex justify-between">
                                                <span className="text-sm text-green-700">Cambio:</span>
                                                <span className="text-sm font-semibold text-green-700">{formatCurrency(parseFloat(data.pagado) - total)}</span>
                                            </div>
                                        )}
                                        {data.pagado && parseFloat(data.pagado) < total && (
                                            <div className="mt-2 p-2 bg-amber-50 rounded-lg flex justify-between">
                                                <span className="text-sm text-amber-700">Saldo pendiente:</span>
                                                <span className="text-sm font-semibold text-amber-700">{formatCurrency(total - parseFloat(data.pagado))}</span>
                                            </div>
                                        )}
                                        {errors.pagado && <p className="mt-1 text-sm text-red-600">{errors.pagado}</p>}
                                    </div>
                                </div>

                                {/* Notas */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                                    <textarea
                                        value={data.notas}
                                        onChange={(e) => setData('notas', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none text-sm"
                                        placeholder="Observaciones de la venta..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || items.length === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? 'Procesando...' : `Registrar Venta • ${formatCurrency(total)}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
