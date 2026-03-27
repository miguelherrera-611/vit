import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const PERMISOS_INFO = {
    // Productos
    ver_productos:              { icon: '👁',  desc: 'Ver el catálogo de productos' },
    crear_productos:            { icon: '➕', desc: 'Crear nuevos productos' },
    editar_productos:           { icon: '✏️', desc: 'Editar productos existentes' },
    eliminar_productos:         { icon: '🗑',  desc: 'Eliminar productos' },

    // Inventario
    ver_inventario:             { icon: '📦', desc: 'Consultar stock actual' },
    ajustar_inventario:         { icon: '🔧', desc: 'Realizar ajustes de inventario' },
    ver_kardex:                 { icon: '📋', desc: 'Ver historial de movimientos por producto' },

    // Ventas
    ver_ventas:                 { icon: '🧾', desc: 'Ver historial de ventas' },
    crear_ventas:               { icon: '💰', desc: 'Registrar nuevas ventas' },
    anular_ventas:              { icon: '❌', desc: 'Anular ventas registradas' },
    ver_cartera:                { icon: '📂', desc: 'Ver deudas y cartera activa' },

    // Abonos
    ver_abonos:                 { icon: '🔍', desc: 'Consultar historial de abonos' },
    crear_abonos:               { icon: '💳', desc: 'Registrar abonos y pagos parciales' },

    // Clientes
    gestionar_clientes:         { icon: '👥', desc: 'Gestionar base de clientes' },

    // Proveedores
    ver_proveedores:            { icon: '🏭', desc: 'Ver listado de proveedores' },
    crear_proveedores:          { icon: '🏗',  desc: 'Agregar nuevos proveedores' },
    editar_proveedores:         { icon: '📝', desc: 'Editar proveedores existentes' },

    // Reportes
    ver_reportes_ventas:        { icon: '📊', desc: 'Ver reportes de ventas por período' },
    ver_reportes_inventario:    { icon: '📈', desc: 'Ver reportes de inventario y stock' },
    ver_reportes_financieros:   { icon: '💹', desc: 'Ver reportes financieros' },
    ver_reportes_clientes:      { icon: '👤', desc: 'Ver reportes de comportamiento de clientes' },
    ver_reportes_rentabilidad:  { icon: '📉', desc: 'Ver márgenes y rentabilidad por producto' },
    ver_reportes_categorias:    { icon: '🏷',  desc: 'Ver ventas por categoría' },
    ver_reportes_ejecutivo:     { icon: '🎯', desc: 'Ver dashboard gerencial ejecutivo' },

    // Administración
    gestionar_categorias:       { icon: '🗂',  desc: 'Gestionar grupos y subcategorías' },
    gestionar_papelera:         { icon: '♻️', desc: 'Restaurar elementos eliminados' },
    ver_registros:              { icon: '📝', desc: 'Ver registros de auditoría y actividad' },
};

// Permisos predeterminados para empleado/vendedor
// Basados en RF-03, RF-04, RF-05 del documento de requisitos
const PERMISOS_DEFAULT_EMPLEADO = [
    'ver_productos',       // RF-04.1 — el empleado busca y consulta el catálogo
    'ver_inventario',      // RF-03   — consulta de inventario solo lectura
    'ver_ventas',          // RF-04.4 — ver historial de ventas propias
    'crear_ventas',        // RF-04.1 — función principal del vendedor
    'gestionar_clientes',  // RF-05.1 — registrar/consultar clientes
    'ver_abonos',          // RF-05.2 — consultar abonos registrados
    'crear_abonos',        // RF-05.2 — registrar pagos parciales
    'ver_cartera',         // RF-05.3 — ver deudas activas al gestionar abonos
    'ver_reportes_ventas', // RF-04.4 — ver reporte de ventas del día
];

export default function UsuariosCreate({ permisos_disponibles, permisos_default }) {
    // Usar permisos_default del backend si está disponible, si no usar la constante local
    const defaultPermisos = permisos_default ?? PERMISOS_DEFAULT_EMPLEADO;

    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        rol:                   'empleado',
        permisos:              [],
    });

    const togglePermiso = (key) => {
        setData('permisos', data.permisos.includes(key)
            ? data.permisos.filter(p => p !== key)
            : [...data.permisos, key]
        );
    };

    const aplicarPredeterminados = () => {
        setData('permisos', defaultPermisos);
    };

    const seleccionarTodos = () => {
        setData('permisos', permisos_disponibles.map(p => p.key));
    };

    const quitarTodos = () => {
        setData('permisos', []);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/usuarios');
    };

    const esAdmin = data.rol === 'admin';

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/usuarios" className="text-gray-400 hover:text-gray-600 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Nuevo Usuario</h1>
                                <p className="mt-1 text-sm text-gray-500">Crea un usuario y configura sus permisos</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    <form onSubmit={submit} className="space-y-8">

                        {/* ── Paso 1: Datos básicos ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
                                Datos del Usuario
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                                    <input type="text" value={data.name}
                                           onChange={e => setData('name', e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-gray-50"
                                           placeholder="Ej: María González" />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico *</label>
                                    <input type="email" value={data.email}
                                           onChange={e => setData('email', e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-gray-50"
                                           placeholder="correo@ejemplo.com" />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                                    <input type="password" value={data.password}
                                           onChange={e => setData('password', e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-gray-50"
                                           placeholder="Mínimo 8 caracteres" />
                                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña *</label>
                                    <input type="password" value={data.password_confirmation}
                                           onChange={e => setData('password_confirmation', e.target.value)}
                                           className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-gray-50"
                                           placeholder="Repite la contraseña" />
                                </div>
                            </div>
                        </div>

                        {/* ── Paso 2: Rol ── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
                                Rol del Usuario
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Admin */}
                                <button type="button"
                                        onClick={() => { setData('rol', 'admin'); setData('permisos', []); }}
                                        className={`p-6 rounded-xl border-2 text-left transition ${data.rol === 'admin' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Administrador</p>
                                            {data.rol === 'admin' && <span className="text-xs text-red-600 font-medium">✓ Seleccionado</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Acceso total al sistema. Puede gestionar usuarios, inventario, reportes y configuración.</p>
                                </button>

                                {/* Empleado */}
                                <button type="button"
                                        onClick={() => setData('rol', 'empleado')}
                                        className={`p-6 rounded-xl border-2 text-left transition ${data.rol === 'empleado' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Empleado / Vendedor</p>
                                            {data.rol === 'empleado' && <span className="text-xs text-blue-600 font-medium">✓ Seleccionado</span>}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">Acceso limitado. Los permisos se configuran en el paso 3.</p>
                                </button>
                            </div>
                            {errors.rol && <p className="mt-2 text-xs text-red-600">{errors.rol}</p>}
                        </div>

                        {/* ── Paso 3: Permisos (solo empleados) ── */}
                        {!esAdmin && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
                                        Permisos del Empleado
                                    </h2>
                                    <div className="flex gap-2 flex-wrap">
                                        {/* ── BOTÓN PREDETERMINADOS ── */}
                                        <button
                                            type="button"
                                            onClick={aplicarPredeterminados}
                                            title="Aplica los permisos estándar para un empleado/vendedor según los requisitos del sistema"
                                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-semibold border border-emerald-200"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3l1.5 4.5L10 9l-3.5 1.5L5 15l-1.5-4.5L0 9l3.5-1.5L5 3zM19 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
                                            </svg>
                                            Predeterminados
                                        </button>

                                        <button
                                            type="button"
                                            onClick={seleccionarTodos}
                                            className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
                                        >
                                            Seleccionar todos
                                        </button>
                                        <button
                                            type="button"
                                            onClick={quitarTodos}
                                            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
                                        >
                                            Quitar todos
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 ml-10">
                                    Selecciona qué secciones puede ver y usar este empleado.
                                    El botón <strong className="text-emerald-700">Predeterminados</strong> marca los permisos esenciales de un vendedor.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {permisos_disponibles.map(({ key, label }) => {
                                        const info   = PERMISOS_INFO[key] || { icon: '🔑', desc: '' };
                                        const activo = data.permisos.includes(key);
                                        const esDefault = defaultPermisos.includes(key);
                                        return (
                                            <button key={key} type="button" onClick={() => togglePermiso(key)}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${activo ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${activo ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                    {info.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-900">{label}</p>
                                                        {esDefault && (
                                                            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold leading-none">
                                                                predeterminado
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">{info.desc}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${activo ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                                    {activo && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {data.permisos.length > 0 && (
                                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                                        <p className="text-sm text-green-700 font-medium">
                                            ✓ {data.permisos.length} permiso(s) seleccionado(s)
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {esAdmin && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm text-red-700">
                                        <strong>Administrador:</strong> Este rol tiene acceso total. No requiere configuración de permisos.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-4">
                            <Link href="/usuarios"
                                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium text-center">
                                Cancelar
                            </Link>
                            <button type="submit" disabled={processing}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition disabled:opacity-50">
                                {processing ? 'Creando...' : 'Crear Usuario'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
