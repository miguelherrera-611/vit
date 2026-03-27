import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo } from 'react';

const CLIENTES_POR_PAGINA = 6;

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ── Dropdown custom de clientes con buscador + paginación ────────────────────
function ClienteSelect({ clientes, value, onChange, error }) {
    const [open, setOpen]         = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina]     = useState(1);
    const ref                     = useRef(null);
    const inputRef                = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (open) {
            setPagina(1);
            setTimeout(() => inputRef.current?.focus(), 60);
        } else {
            setBusqueda('');
        }
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    // Opción "Cliente general" siempre primera
    const opcionGeneral = { id: '', nombre: 'Cliente general (sin cuenta)', telefono: null };

    const clientesFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        if (!q) return clientes;
        return clientes.filter(c =>
            normalize(c.nombre).includes(q) ||
            normalize(c.telefono).includes(q) ||
            normalize(c.documento).includes(q)
        );
    }, [clientes, busqueda]);

    const totalPaginas  = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const clientesPag   = clientesFiltrados.slice(
        (pagina - 1) * CLIENTES_POR_PAGINA,
        pagina * CLIENTES_POR_PAGINA
    );

    const seleccionado = value
        ? clientes.find(c => String(c.id) === String(value))
        : null;

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition text-sm bg-gray-50
                    ${error ? 'border-red-400' :
                    open  ? 'border-blue-500 ring-2 ring-blue-100 bg-white' :
                        'border-gray-200 hover:border-gray-300'}`}
            >
                <span className={seleccionado ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                    {seleccionado ? seleccionado.nombre : 'Cliente general (sin cuenta)'}
                </span>
                <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Panel */}
            {open && (
                <div className="absolute z-50 mt-1.5 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                     style={{ animation: 'dropdownIn 0.16s cubic-bezier(0.16,1,0.3,1)' }}>

                    {/* Buscador */}
                    <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar por nombre, teléfono o documento..."
                                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                            />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5 px-1">
                            {busqueda
                                ? `${clientesFiltrados.length} resultado${clientesFiltrados.length !== 1 ? 's' : ''} para "${busqueda}"`
                                : `${clientes.length} clientes registrados`}
                        </p>
                    </div>

                    {/* Opción cliente general — siempre visible */}
                    {!busqueda && (
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 transition
                                ${!value ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className={`text-sm font-medium ${!value ? 'text-blue-700' : 'text-gray-700'}`}>
                                Cliente general (sin cuenta)
                            </span>
                            {!value && (
                                <svg className="w-4 h-4 text-blue-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Lista de clientes */}
                    <div>
                        {clientesPag.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm text-gray-400">Sin resultados para <strong>"{busqueda}"</strong></p>
                                <button type="button" onClick={() => setBusqueda('')}
                                        className="mt-2 text-xs text-blue-600 hover:underline">
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : (
                            clientesPag.map((c, i) => {
                                const sel = String(c.id) === String(value);
                                const iniciales = c.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                                return (
                                    <button key={c.id} type="button"
                                            onClick={() => { onChange(String(c.id)); setOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition
                                            ${sel ? 'bg-blue-50' : 'hover:bg-gray-50'}
                                            ${i < clientesPag.length - 1 ? 'border-b border-gray-50' : ''}`}
                                    >
                                        {/* Avatar con iniciales */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                                            ${sel ? 'bg-blue-200 text-blue-800' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {iniciales}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium truncate ${sel ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {c.nombre}
                                            </p>
                                            {c.telefono && (
                                                <p className="text-xs text-gray-400 truncate">{c.telefono}</p>
                                            )}
                                        </div>
                                        {sel && (
                                            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                            <button type="button"
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    disabled={pagina === 1}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Anterior
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" onClick={() => setPagina(n)}
                                            className={`w-7 h-7 rounded-lg text-xs font-semibold transition
                                            ${n === pagina ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-white'}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button"
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    disabled={pagina === totalPaginas}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Siguiente
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Acceso rápido a crear cliente */}
                    <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                        <Link href="/clientes/crear"
                              className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Registrar nuevo cliente
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function VentasCreate({ productos = [], clientes = [] }) {
    const [busquedaProducto, setBusquedaProducto]           = useState('');
    const [items, setItems]                                 = useState([]);
    const [avisoClienteGeneral, setAvisoClienteGeneral]     = useState(false);
    const [ventaExitosa, setVentaExitosa]                   = useState(null);
    const pendingMeta                                        = useRef(null);

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
    }, [items]);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(busquedaProducto.toLowerCase()))
    );

    const agregarProducto = (producto) => {
        const existe = items.find(i => i.producto_id === producto.id);
        if (existe) {
            const nuevos = items.map(i =>
                i.producto_id === producto.id
                    ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) }
                    : i
            );
            setItems(nuevos); setData('items', nuevos);
        } else {
            const nuevos = [...items, {
                producto_id:     producto.id,
                nombre:          producto.nombre,
                precio_unitario: producto.precio,
                cantidad:        1,
                stock_max:       producto.stock,
            }];
            setItems(nuevos); setData('items', nuevos);
        }
        setBusquedaProducto('');
    };

    const actualizarCantidad = (idx, cantidad) => {
        const nuevos = items.map((item, i) => {
            if (i !== idx) return item;
            const cant = Math.max(1, Math.min(parseInt(cantidad) || 1, item.stock_max));
            return { ...item, cantidad: cant };
        });
        setItems(nuevos); setData('items', nuevos);
    };

    const eliminarItem = (idx) => {
        const nuevos = items.filter((_, i) => i !== idx);
        setItems(nuevos); setData('items', nuevos);
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
    const hayErrorStock     = !!errors.items;
    const submitBloqueado   = mostrarAvisoDeuda || hayErrorStock;

    const formatCurrency = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

    const fechaMinima = () => {
        const d = new Date(); d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const fechaSugerida = (tipo) => {
        const d = new Date(); d.setDate(d.getDate() + (tipo === 'Separado' ? 30 : 60));
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
            setTimeout(() => document.getElementById('aviso-cliente-general')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
            return;
        }
        pendingMeta.current = { tipo_venta: data.tipo_venta, total };
        post('/ventas', {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const meta = pendingMeta.current;
                setItems([]); setBusquedaProducto(''); setAvisoClienteGeneral(false); reset();
                setVentaExitosa(meta);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: () => {
                setTimeout(() => document.getElementById('aviso-stock')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
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
            <style>{`
                @keyframes dropdownIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.98); }
                    to   { opacity:1; transform:translateY(0)     scale(1);   }
                }
            `}</style>

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

                                {/* Buscar producto */}
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
                                                    <button key={p.id} type="button" onClick={() => agregarProducto(p)}
                                                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition text-left border-b border-gray-50 last:border-0">
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

                                {/* Carrito de artículos */}
                                <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transition ${hayErrorStock ? 'ring-2 ring-red-400' : ''}`}>
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900">Artículos</h2>
                                        <span className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
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
                                                <div key={idx} className="px-6 py-4 flex items-center gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">{item.nombre}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Stock: {item.stock_max} · {formatCurrency(item.precio_unitario)} c/u
                                                        </p>
                                                    </div>

                                                    {/* Controles de cantidad */}
                                                    <div className="flex items-center gap-1.5">
                                                        <button type="button" onClick={() => actualizarCantidad(idx, item.cantidad - 1)}
                                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                                                        </button>
                                                        <input type="number" value={item.cantidad}
                                                               onChange={(e) => actualizarCantidad(idx, e.target.value)}
                                                               className="w-12 text-center border border-gray-200 rounded-lg py-1.5 text-sm focus:outline-none focus:border-blue-500"
                                                               min="1" max={item.stock_max} />
                                                        <button type="button" onClick={() => actualizarCantidad(idx, item.cantidad + 1)}
                                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                        </button>
                                                    </div>

                                                    {/* Subtotal — solo lectura, sin input de precio */}
                                                    <div className="w-24 text-right">
                                                        <p className="font-semibold text-gray-900 text-sm">
                                                            {formatCurrency(item.cantidad * item.precio_unitario)}
                                                        </p>
                                                    </div>

                                                    <button type="button" onClick={() => eliminarItem(idx)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
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

                                {/* Cliente — dropdown custom */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h2>
                                    <ClienteSelect
                                        clientes={clientes}
                                        value={data.cliente_id}
                                        onChange={(id) => { setData('cliente_id', id); setAvisoClienteGeneral(false); }}
                                        error={errors.cliente_id}
                                    />
                                    {errors.cliente_id && <p className="mt-1.5 text-sm text-red-600">{errors.cliente_id}</p>}
                                </div>

                                {/* Tipo de venta */}
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
                                                    Fecha límite {data.tipo_venta === 'Separado' ? '(separado)' : '(crédito)'}
                                                </label>
                                            </div>
                                            <input type="date" value={data.fecha_limite}
                                                   onChange={(e) => setData('fecha_limite', e.target.value)}
                                                   min={fechaMinima()}
                                                   className="w-full px-4 py-2.5 border border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-sm" />
                                            <button type="button" onClick={() => setData('fecha_limite', fechaSugerida(data.tipo_venta))}
                                                    className="text-xs text-amber-700 underline hover:text-amber-900 mt-2">
                                                {data.tipo_venta === 'Separado' ? 'Sugerir 30 días' : 'Sugerir 60 días'}
                                            </button>
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

                                {/* Resumen financiero */}
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
                                                <input type="number" value={data.descuento}
                                                       onChange={(e) => setData('descuento', e.target.value)}
                                                       className="w-full pl-5 pr-2 py-1 border border-gray-200 rounded-lg text-sm text-right focus:outline-none focus:border-blue-500"
                                                       min="0" />
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
                                            <input type="number" value={data.pagado}
                                                   onChange={(e) => { setData('pagado', e.target.value); if (avisoClienteGeneral) setAvisoClienteGeneral(false); }}
                                                   className={'w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition bg-gray-50 text-lg font-semibold ' +
                                                       (mostrarAvisoDeuda ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100')}
                                                   placeholder="0" min="0" />
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

                                {/* Aviso stock */}
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

                                {/* Aviso cliente general */}
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
                                            <button type="button"
                                                    onClick={() => { setData('pagado', total.toString()); setAvisoClienteGeneral(false); }}
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

                                {/* Notas */}
                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                                    <textarea value={data.notas} onChange={(e) => setData('notas', e.target.value)} rows={2}
                                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-gray-50 resize-none text-sm"
                                              placeholder="Observaciones de la venta..." />
                                </div>

                                <button type="submit" disabled={processing || items.length === 0 || submitBloqueado}
                                        className={'w-full py-4 px-6 rounded-xl font-semibold text-lg transition duration-200 ' +
                                            (submitBloqueado
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none')}>
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
