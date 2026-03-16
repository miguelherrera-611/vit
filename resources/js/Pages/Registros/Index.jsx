import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';

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
        return (
            <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (valor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                {valor ? 'Sí' : 'No'}
            </span>
        );
    }

    if (CAMPOS_MONEDA.has(clave) && !isNaN(parseFloat(valor))) {
        return <span className="font-semibold text-gray-800 text-sm">{fmt(parseFloat(valor))}</span>;
    }

    if (clave === 'estado') {
        const colores = {
            Completada: 'bg-green-100 text-green-700',
            Pendiente:  'bg-yellow-100 text-yellow-700',
            Cancelada:  'bg-red-100 text-red-700',
        };
        return (
            <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (colores[valor] ?? 'bg-gray-100 text-gray-700')}>
                {valor}
            </span>
        );
    }

    if (clave === 'activo') {
        return (
            <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (valor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                {valor ? 'Activo' : 'Inactivo'}
            </span>
        );
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

    if (Array.isArray(valor)) {
        return <span className="text-gray-600 text-sm">{valor.join(', ')}</span>;
    }

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
                    <div
                        key={clave}
                        className={'flex items-start gap-4 px-4 py-3 ' + (i < entradas.length - 1 ? 'border-b border-white/60' : '')}
                    >
                        <p className="text-xs text-gray-500 font-medium flex-shrink-0 pt-0.5 min-w-32">
                            {LABELS[clave] ?? clave.replace(/_/g, ' ')}
                        </p>
                        <div className="flex-1 text-right">
                            {renderValor(clave, valor)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function RegistrosIndex({ registros, modulos, acciones, filtros }) {
    const [detalle, setDetalle] = useState(null);

    const aplicarFiltro = (campo, valor) => {
        router.get('/registros', { ...filtros, [campo]: valor, page: 1 }, { preserveState: true });
    };

    const limpiarFiltros = () => {
        router.get('/registros', {});
    };

    const hayFiltros = Object.values(filtros).some((v) => v);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Registros de Actividad</h1>
                                <p className="mt-1 text-sm text-gray-500">Historial completo de acciones realizadas en el sistema</p>
                            </div>
                            {hayFiltros && (
                                <button onClick={limpiarFiltros} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Usuario</label>
                                <input
                                    type="text"
                                    value={filtros.usuario}
                                    onChange={(e) => aplicarFiltro('usuario', e.target.value)}
                                    placeholder="Buscar usuario..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Módulo</label>
                                <select
                                    value={filtros.modulo}
                                    onChange={(e) => aplicarFiltro('modulo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="">Todos</option>
                                    {modulos.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Acción</label>
                                <select
                                    value={filtros.accion}
                                    onChange={(e) => aplicarFiltro('accion', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
                                >
                                    <option value="">Todas</option>
                                    {acciones.map((a) => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
                                <input
                                    type="date"
                                    value={filtros.desde}
                                    onChange={(e) => aplicarFiltro('desde', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
                                <input
                                    type="date"
                                    value={filtros.hasta}
                                    onChange={(e) => aplicarFiltro('hasta', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {registros.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="text-4xl mb-3">📋</div>
                                <p className="text-gray-400">No hay registros con los filtros aplicados</p>
                            </div>
                        ) : (
                            <>
                                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                                    <p className="text-xs text-gray-400">Haz clic en cualquier fila para ver el detalle completo</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
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
                                            <tr key={r.id} onClick={() => setDetalle(r)} className="hover:bg-blue-50 transition cursor-pointer">
                                                <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{r.created_at}</td>
                                                <td className="px-5 py-3">
                                                    <p className="text-sm font-medium text-gray-800">{r.user_name}</p>
                                                </td>
                                                <td className="px-5 py-3">
                                                        <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (r.user_rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>
                                                            {r.user_rol}
                                                        </span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                                                    {MODULO_ICONOS[r.modulo] ?? '📌'} {r.modulo}
                                                </td>
                                                <td className="px-5 py-3">
                                                        <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (ACCION_COLORES[r.accion] ?? 'bg-gray-100 text-gray-700')}>
                                                            {r.accion}
                                                        </span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-600 max-w-xs truncate">{r.descripcion}</td>
                                                <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{r.ip}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {registros.last_page > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Mostrando {registros.from}–{registros.to} de {registros.total} registros
                                </p>
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

            {detalle && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setDetalle(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{MODULO_ICONOS[detalle.modulo] ?? '📌'}</div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Detalle del registro</h2>
                                    <p className="text-sm text-gray-500">#{detalle.id} — {detalle.created_at}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetalle(null)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-5">

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Usuario</p>
                                    <p className="text-sm font-semibold text-gray-800">{detalle.user_name}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Rol</p>
                                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (detalle.user_rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700')}>
                                        {detalle.user_rol}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Módulo</p>
                                    <p className="text-sm font-semibold text-gray-800">{MODULO_ICONOS[detalle.modulo] ?? '📌'} {detalle.modulo}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Acción</p>
                                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (ACCION_COLORES[detalle.accion] ?? 'bg-gray-100 text-gray-700')}>
                                        {detalle.accion}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Fecha y hora</p>
                                    <p className="text-sm font-semibold text-gray-800">{detalle.created_at}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Dirección IP</p>
                                    <p className="text-sm font-semibold text-gray-800">{detalle.ip ?? '—'}</p>
                                </div>
                            </div>

                            {detalle.modelo_tipo && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Registro afectado</p>
                                    <p className="text-sm font-semibold text-gray-800">{detalle.modelo_tipo} #{detalle.modelo_id}</p>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-2">Descripción completa</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{detalle.descripcion}</p>
                            </div>

                            <DatosPanel
                                datos={detalle.datos_anteriores}
                                titulo="Estado anterior"
                                dotColor="bg-red-400"
                                colorClase="bg-red-50"
                                borderClase="border-red-100"
                            />

                            <DatosPanel
                                datos={detalle.datos_nuevos}
                                titulo="Datos registrados"
                                dotColor="bg-green-400"
                                colorClase="bg-green-50"
                                borderClase="border-green-100"
                            />

                            {!detalle.datos_anteriores && !detalle.datos_nuevos && (
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <p className="text-sm text-gray-400">No hay datos adicionales para este registro</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setDetalle(null)}
                                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
