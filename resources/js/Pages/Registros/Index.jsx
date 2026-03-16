import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const ACCION_COLORES = {
    crear:             'bg-green-100 text-green-800',
    editar:            'bg-blue-100 text-blue-800',
    eliminar:          'bg-red-100 text-red-800',
    anular:            'bg-orange-100 text-orange-800',
    abonar:            'bg-purple-100 text-purple-800',
    ajuste_inventario: 'bg-yellow-100 text-yellow-800',
    activado:          'bg-teal-100 text-teal-800',
    desactivado:       'bg-gray-100 text-gray-800',
    extender_plazo:    'bg-indigo-100 text-indigo-800',
    restore:           'bg-cyan-100 text-cyan-800',
};

const MODULO_ICONOS = {
    ventas:      '🛍️',
    productos:   '📦',
    clientes:    '👥',
    proveedores: '🏭',
    inventario:  '📊',
    usuarios:    '👤',
    categorias:  '🏷️',
    abonos:      '💳',
    papelera:    '🗑️',
};

const LABELS = {
    numero_venta:          'Número de venta',
    cliente:               'Cliente',
    tipo_venta:            'Tipo de venta',
    metodo_pago:           'Método de pago',
    forma_pago:            'Forma de pago',
    subtotal:              'Subtotal',
    descuento:             'Descuento',
    total:                 'Total',
    pagado:                'Pagado',
    pagado_total:          'Total pagado',
    saldo_pendiente:       'Saldo pendiente',
    estado:                'Estado',
    fecha_limite:          'Fecha límite',
    notas:                 'Notas',
    monto_abonado:         'Monto abonado',
    observaciones:         'Observaciones',
    venta:                 'Venta',
    nombre:                'Nombre',
    email:                 'Correo',
    rol:                   'Rol',
    activo:                'Activo',
    cantidad:              'Cantidad',
    precio_unitario:       'Precio unitario',
    precio:                'Precio de venta',
    precio_compra:         'Precio de compra',
    categoria:             'Categoría',
    stock:                 'Stock',
    stock_minimo:          'Stock mínimo',
    codigo_barras:         'Código de barras',
    descripcion:           'Descripción',
    tipo_ajuste:           'Tipo de ajuste',
    motivo:                'Motivo',
    telefono:              'Teléfono',
    documento:             'Documento',
    direccion:             'Dirección',
    empresa:               'Empresa',
    sitio_web:             'Sitio web',
    productos_restaurados: 'Productos restaurados',
};

const CAMPOS_MONEDA = new Set([
    'subtotal', 'descuento', 'total', 'pagado', 'pagado_total',
    'saldo_pendiente', 'monto_abonado', 'precio', 'precio_unitario', 'precio_compra',
]);

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

function renderValor(clave, valor) {
    if (valor === null || valor === undefined || valor === '') {
        return <span className="text-gray-400 italic text-sm">—</span>;
    }
    if (typeof valor === 'boolean') {
        return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (valor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>{valor ? 'Sí' : 'No'}</span>;
    }
    if (CAMPOS_MONEDA.has(clave) && !isNaN(parseFloat(valor))) {
        return <span className="font-semibold text-gray-800 text-sm">{fmt(parseFloat(valor))}</span>;
    }
    if (clave === 'estado') {
        const colores = { Completada: 'bg-green-100 text-green-700', Pendiente: 'bg-yellow-100 text-yellow-700', Cancelada: 'bg-red-100 text-red-700' };
        return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (colores[valor] ?? 'bg-gray-100 text-gray-700')}>{valor}</span>;
    }
    if (clave === 'activo') {
        return <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (valor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>{valor ? 'Activo' : 'Inactivo'}</span>;
    }
    if (clave === 'productos' && Array.isArray(valor)) {
        return (
            <div className="space-y-2 mt-1 w-full">
                {valor.map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-3 py-2">
                        <div>
                            <p className="text-sm font-medium text-gray-800">{p.nombre}</p>
                            <p className="text-xs text-gray-400">{p.cantidad} × {fmt(p.precio_unitario)}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">{fmt(p.subtotal)}</p>
                    </div>
                ))}
            </div>
        );
    }
    if (clave === 'productos_restaurados' && Array.isArray(valor)) {
        return (
            <div className="space-y-1 mt-1 w-full">
                {valor.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                        <span className="text-gray-700">{p.nombre}</span>
                        <span className="text-gray-400">— {p.cantidad} unidad{p.cantidad !== 1 ? 'es' : ''}</span>
                    </div>
                ))}
            </div>
        );
    }
    if (Array.isArray(valor)) return <span className="text-gray-600 text-sm">{valor.join(', ')}</span>;
    return <span className="text-gray-800 text-sm">{String(valor)}</span>;
}

function DatosPanel({ datos, colorClase, borderClase, dotColor, titulo }) {
    if (!datos) return null;
    const entradas = Object.entries(datos).filter(([, v]) => v !== null && v !== undefined && v !== '');
    if (entradas.length === 0) return null;
    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className={'w-3 h-3 rounded-full ' + dotColor}></div>
                <p className="text-sm font-medium text-gray-700">{titulo}</p>
            </div>
            <div className={'rounded-xl border ' + borderClase + ' ' + colorClase + ' overflow-hidden'}>
                {entradas.map(([clave, valor], i) => (
                    <div key={clave} className={'flex items-start gap-4 px-4 py-3 ' + (i < entradas.length - 1 ? 'border-b border-white/60' : '')}>
                        <p className="text-xs text-gray-500 font-medium flex-shrink-0 pt-0.5 min-w-32">
                            {LABELS[clave] ?? clave.replace(/_/g, ' ')}
                        </p>
                        <div className="flex-1 text-right">{renderValor(clave, valor)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegistrosIndex({ registros, modulos, acciones, filtros, esperando2FA, delete_count }) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const [detalle, setDetalle]             = useState(null);
    const [seleccionados, setSeleccionados] = useState([]);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modal2FA, setModal2FA]           = useState(false);
    const [deleteCount, setDeleteCount]     = useState(delete_count ?? 0);
    const [password, setPassword]           = useState('');
    const [processing, setProcessing]       = useState(false);
    const [errorPassword, setErrorPassword] = useState('');

    const form2FA = useForm({ code: '' });

    // ── Si el servidor dice que hay un proceso 2FA pendiente, abrir modal automáticamente ──
    useEffect(() => {
        if (esperando2FA) {
            setDeleteCount(delete_count ?? 0);
            setModal2FA(true);
            setModalEliminar(false);
        }
    }, [esperando2FA, delete_count]);

    // ── Flash fallback (por si acaso) ──
    useEffect(() => {
        if (flash.delete_code_sent) {
            setDeleteCount(flash.delete_count ?? seleccionados.length);
            setModalEliminar(false);
            setModal2FA(true);
            setPassword('');
        }
    }, [flash.delete_code_sent]);

    const aplicarFiltro = (campo, valor) => {
        router.get('/registros', { ...filtros, [campo]: valor, page: 1 }, { preserveState: true });
    };

    const limpiarFiltros = () => router.get('/registros', {});
    const hayFiltros = Object.values(filtros).some((v) => v);

    const toggleSeleccion = (id) => {
        setSeleccionados(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleTodos = () => {
        const todosIds = registros.data.map(r => r.id);
        setSeleccionados(seleccionados.length === todosIds.length ? [] : todosIds);
    };

    const abrirModalEliminar = () => {
        if (seleccionados.length === 0) return;
        setPassword('');
        setErrorPassword('');
        setModalEliminar(true);
    };

    const enviarSolicitud = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrorPassword('');

        router.post('/registros/solicitar-eliminacion', {
            password:  password,
            ids:       seleccionados,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const f = page.props.flash ?? {};
                const espera = page.props.esperando2FA ?? false;

                if (f.delete_code_sent || espera) {
                    setDeleteCount(f.delete_count ?? page.props.delete_count ?? seleccionados.length);
                    setModalEliminar(false);
                    setModal2FA(true);
                    setPassword('');
                }
                setProcessing(false);
            },
            onError: (errs) => {
                setErrorPassword(errs.password || errs.ids || 'Error al procesar la solicitud.');
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const enviarCodigo2FA = (e) => {
        e.preventDefault();
        form2FA.post('/registros/confirmar-eliminacion', {
            onSuccess: () => {
                setModal2FA(false);
                setSeleccionados([]);
                form2FA.reset();
            },
            onError: () => {
                // errores se muestran automáticamente via form2FA.errors
            },
        });
    };

    const cancelar2FA = () => {
        router.post('/registros/cancelar-eliminacion', {}, {
            onSuccess: () => {
                setModal2FA(false);
                setModalEliminar(false);
                setSeleccionados([]);
                form2FA.reset();
                setPassword('');
                setErrorPassword('');
            },
        });
    };

    const todosSeleccionados = registros.data.length > 0 && seleccionados.length === registros.data.length;
    const algunoSeleccionado = seleccionados.length > 0;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* ── HEADER ─────────────────────────────────────────── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Registros de Actividad</h1>
                                <p className="mt-1 text-sm text-gray-500">Historial completo de acciones realizadas en el sistema</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {algunoSeleccionado && (
                                    <button
                                        onClick={abrirModalEliminar}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-xl hover:bg-red-700 transition font-medium shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar {seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}
                                    </button>
                                )}
                                {hayFiltros && (
                                    <button onClick={limpiarFiltros} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* ── FLASH SUCCESS ───────────────────────────────── */}
                    {flash.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-sm text-green-700 font-medium">{flash.success}</p>
                        </div>
                    )}

                    {/* ── FILTROS ─────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Usuario</label>
                                <input type="text" value={filtros.usuario} onChange={(e) => aplicarFiltro('usuario', e.target.value)} placeholder="Buscar usuario..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Módulo</label>
                                <select value={filtros.modulo} onChange={(e) => aplicarFiltro('modulo', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white">
                                    <option value="">Todos</option>
                                    {modulos.map((m) => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Acción</label>
                                <select value={filtros.accion} onChange={(e) => aplicarFiltro('accion', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white">
                                    <option value="">Todas</option>
                                    {acciones.map((a) => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
                                <input type="date" value={filtros.desde} onChange={(e) => aplicarFiltro('desde', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
                                <input type="date" value={filtros.hasta} onChange={(e) => aplicarFiltro('hasta', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* ── TABLA ───────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {registros.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-3">📋</div>
                                <p className="text-gray-400">No hay registros con los filtros aplicados</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                    <p className="text-xs text-gray-400">Haz clic en una fila para ver el detalle · Usa el checkbox para seleccionar y eliminar</p>
                                    {algunoSeleccionado && (
                                        <p className="text-xs font-medium text-red-600">{seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}</p>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 w-10">
                                                <input
                                                    type="checkbox"
                                                    checked={todosSeleccionados}
                                                    onChange={toggleTodos}
                                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                                />
                                            </th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Módulo</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                        {registros.data.map((r) => (
                                            <tr key={r.id} className={'transition ' + (seleccionados.includes(r.id) ? 'bg-red-50' : 'hover:bg-blue-50')}>
                                                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={seleccionados.includes(r.id)}
                                                        onChange={() => toggleSeleccion(r.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap cursor-pointer" onClick={() => setDetalle(r)}>{r.created_at}</td>
                                                <td className="px-5 py-3 cursor-pointer" onClick={() => setDetalle(r)}>
                                                    <p className="text-sm font-medium text-gray-800">{r.user_name}</p>
                                                </td>
                                                <td className="px-5 py-3 cursor-pointer" onClick={() => setDetalle(r)}>
                                                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (r.user_rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{r.user_rol}</span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap cursor-pointer" onClick={() => setDetalle(r)}>
                                                    {MODULO_ICONOS[r.modulo] ?? '📌'} {r.modulo}
                                                </td>
                                                <td className="px-5 py-3 cursor-pointer" onClick={() => setDetalle(r)}>
                                                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (ACCION_COLORES[r.accion] ?? 'bg-gray-100 text-gray-700')}>{r.accion}</span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-600 max-w-xs truncate cursor-pointer" onClick={() => setDetalle(r)}>{r.descripcion}</td>
                                                <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap cursor-pointer" onClick={() => setDetalle(r)}>{r.ip}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* ── PAGINACIÓN ───────────────────────────────── */}
                        {registros.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">Mostrando {registros.from}–{registros.to} de {registros.total} registros</p>
                                <div className="flex gap-1">
                                    {registros.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={'px-3 py-1.5 rounded-lg text-sm transition ' + (link.active ? 'bg-blue-600 text-white' : link.url ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed')}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MODAL DETALLE
            ══════════════════════════════════════════════════════════ */}
            {detalle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setDetalle(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{MODULO_ICONOS[detalle.modulo] ?? '📌'}</div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Detalle del registro</h2>
                                    <p className="text-sm text-gray-500">#{detalle.id} — {detalle.created_at}</p>
                                </div>
                            </div>
                            <button onClick={() => setDetalle(null)} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Usuario</p><p className="text-sm font-semibold text-gray-800">{detalle.user_name}</p></div>
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Rol</p><span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (detalle.user_rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>{detalle.user_rol}</span></div>
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Módulo</p><p className="text-sm font-semibold text-gray-800">{MODULO_ICONOS[detalle.modulo] ?? '📌'} {detalle.modulo}</p></div>
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Acción</p><span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (ACCION_COLORES[detalle.accion] ?? 'bg-gray-100 text-gray-700')}>{detalle.accion}</span></div>
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Fecha y hora</p><p className="text-sm font-semibold text-gray-800">{detalle.created_at}</p></div>
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Dirección IP</p><p className="text-sm font-semibold text-gray-800">{detalle.ip ?? '—'}</p></div>
                            </div>
                            {detalle.modelo_tipo && (
                                <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Registro afectado</p><p className="text-sm font-semibold text-gray-800">{detalle.modelo_tipo} #{detalle.modelo_id}</p></div>
                            )}
                            <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-2">Descripción completa</p><p className="text-sm text-gray-700 leading-relaxed">{detalle.descripcion}</p></div>
                            <DatosPanel datos={detalle.datos_anteriores} titulo="Estado anterior" dotColor="bg-red-400" colorClase="bg-red-50" borderClase="border-red-100" />
                            <DatosPanel datos={detalle.datos_nuevos} titulo="Datos registrados" dotColor="bg-green-400" colorClase="bg-green-50" borderClase="border-green-100" />
                            {!detalle.datos_anteriores && !detalle.datos_nuevos && (
                                <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm text-gray-400">No hay datos adicionales para este registro</p></div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setDetalle(null)} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODAL PASO 1 — CONTRASEÑA
            ══════════════════════════════════════════════════════════ */}
            {modalEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Eliminar registros</h2>
                                    <p className="text-sm text-gray-500">Paso 1 de 2 — Confirmar identidad</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={enviarSolicitud} className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                <p className="text-sm text-red-700">
                                    Vas a eliminar permanentemente <strong>{seleccionados.length}</strong> registro{seleccionados.length !== 1 ? 's' : ''}. Esta acción <strong>no se puede deshacer</strong>.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ingresa tu contraseña para continuar
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition bg-gray-50"
                                    placeholder="Tu contraseña actual"
                                    autoFocus
                                />
                                {errorPassword && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errorPassword}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-gray-400">
                                Tras confirmar tu contraseña, recibirás un código de verificación en tu correo electrónico.
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setModalEliminar(false); setPassword(''); setErrorPassword(''); }}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !password}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Verificando...
                                        </>
                                    ) : 'Continuar →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                MODAL PASO 2 — CÓDIGO 2FA
            ══════════════════════════════════════════════════════════ */}
            {modal2FA && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Verificación en dos pasos</h2>
                                    <p className="text-sm text-gray-500">Paso 2 de 2 — Código de confirmación</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={enviarCodigo2FA} className="p-6 space-y-4">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                <p className="text-sm text-amber-800">
                                    📧 Hemos enviado un código de <strong>6 dígitos</strong> a tu correo. Ingresa el código para confirmar la eliminación de <strong>{deleteCount}</strong> registro{deleteCount !== 1 ? 's' : ''}.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código de verificación
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={form2FA.data.code}
                                    onChange={(e) => form2FA.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition bg-gray-50 text-center text-3xl font-bold tracking-[0.5em]"
                                    placeholder="──────"
                                    maxLength={6}
                                    autoFocus
                                />
                                {form2FA.errors.code && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {form2FA.errors.code}
                                    </p>
                                )}
                            </div>

                            <p className="text-xs text-gray-400">
                                ⏱ El código expira en <strong>10 minutos</strong>. Si no lo recibes, cancela e inicia el proceso nuevamente.
                            </p>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={cancelar2FA}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={form2FA.processing || form2FA.data.code.length !== 6}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {form2FA.processing ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : '🗑️ Confirmar eliminación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
