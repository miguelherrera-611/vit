import AppLayout from '@/Layouts/AppLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import GlassSelect    from '@/Components/GlassSelect';
import GlassDateInput from '@/Components/GlassDateInput';

const ACCION_COLORES = {
    crear:             { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  color: 'rgba(4,120,87,0.9)'    },
    editar:            { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)',  color: 'rgba(29,78,216,0.9)'   },
    eliminar:          { bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.22)',   color: 'rgba(185,28,28,0.9)'   },
    anular:            { bg: 'rgba(234,88,12,0.07)',   border: 'rgba(234,88,12,0.22)',   color: 'rgba(194,65,12,0.9)'   },
    abonar:            { bg: 'rgba(139,92,246,0.07)',  border: 'rgba(139,92,246,0.22)',  color: 'rgba(109,40,217,0.9)'  },
    ajuste_inventario: { bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.22)',  color: 'rgba(146,64,14,0.9)'   },
    activado:          { bg: 'rgba(20,184,166,0.07)',  border: 'rgba(20,184,166,0.22)',  color: 'rgba(15,118,110,0.9)'  },
    desactivado:       { bg: 'rgba(200,140,80,0.06)',  border: 'rgba(200,140,80,0.2)',   color: 'rgba(150,80,20,0.75)'  },
    extender_plazo:    { bg: 'rgba(99,102,241,0.07)',  border: 'rgba(99,102,241,0.22)',  color: 'rgba(67,56,202,0.9)'   },
    restore:           { bg: 'rgba(6,182,212,0.07)',   border: 'rgba(6,182,212,0.22)',   color: 'rgba(8,145,178,0.9)'   },
};

const MODULO_LABELS = {
    ventas:      'Ventas',
    productos:   'Productos',
    clientes:    'Clientes',
    proveedores: 'Proveedores',
    inventario:  'Inventario',
    usuarios:    'Usuarios',
    categorias:  'Categorías',
    abonos:      'Abonos',
    papelera:    'Papelera',
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

// Opciones para GlassSelect con íconos reutilizando ModuloIcon
const opcionesModulo = Object.entries(MODULO_LABELS).map(([val, label]) => ({
    value: val,
    label,
    icon: <ModuloIcon modulo={val} />,
}));

const formatFecha = (str) => {
    if (!str) return '—';
    const yaFormateado = /^\d{2}\/\d{2}\/\d{4}/.test(str);
    if (yaFormateado) {
        return str.replace(/(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}):\d{2}$/, '$1');
    }
    const date = new Date(str);
    if (isNaN(date.getTime())) return str;
    return date.toLocaleString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
    }).replace(',', '');
};

function AccionBadge({ accion }) {
    const estilo = ACCION_COLORES[accion] ?? { bg: 'rgba(200,140,80,0.06)', border: 'rgba(200,140,80,0.2)', color: 'rgba(150,80,20,0.75)' };
    return (
        <span style={{
            padding: '0.18rem 0.55rem', borderRadius: '5px',
            fontSize: '0.69rem', fontWeight: '500',
            background: estilo.bg, border: `1px solid ${estilo.border}`, color: estilo.color,
            whiteSpace: 'nowrap', letterSpacing: '0.01em',
        }}>
            {accion}
        </span>
    );
}

function renderValor(clave, valor) {
    if (valor === null || valor === undefined || valor === '') {
        return <span style={{ color: 'rgba(150,80,20,0.35)', fontSize: '0.82rem', fontStyle: 'italic' }}>—</span>;
    }
    if (typeof valor === 'boolean') {
        return (
            <span style={{
                padding: '0.16rem 0.55rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '500',
                background: valor ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.07)',
                border: `1px solid ${valor ? 'rgba(16,185,129,0.22)' : 'rgba(220,38,38,0.2)'}`,
                color: valor ? 'rgba(4,120,87,0.9)' : 'rgba(185,28,28,0.9)',
            }}>
                {valor ? 'Sí' : 'No'}
            </span>
        );
    }
    if (CAMPOS_MONEDA.has(clave) && !isNaN(parseFloat(valor))) {
        return <span style={{ fontWeight: '600', color: '#2d1a08', fontSize: '0.84rem' }}>{fmt(parseFloat(valor))}</span>;
    }
    if (clave === 'estado') {
        const map = {
            Completada: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.22)', color: 'rgba(4,120,87,0.9)' },
            Pendiente:  { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  color: 'rgba(146,64,14,0.9)' },
            Cancelada:  { bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.2)',    color: 'rgba(185,28,28,0.9)' },
        };
        const s = map[valor] ?? { bg: 'rgba(200,140,80,0.06)', border: 'rgba(200,140,80,0.2)', color: 'rgba(150,80,20,0.75)' };
        return (
            <span style={{ padding: '0.16rem 0.55rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '500', background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                {valor}
            </span>
        );
    }
    if (clave === 'activo') {
        return (
            <span style={{
                padding: '0.16rem 0.55rem', borderRadius: '5px', fontSize: '0.7rem', fontWeight: '500',
                background: valor ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.07)',
                border: `1px solid ${valor ? 'rgba(16,185,129,0.22)' : 'rgba(220,38,38,0.2)'}`,
                color: valor ? 'rgba(4,120,87,0.9)' : 'rgba(185,28,28,0.9)',
            }}>
                {valor ? 'Activo' : 'Inactivo'}
            </span>
        );
    }
    if (clave === 'productos' && Array.isArray(valor)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem', width: '100%' }}>
                {valor.map((p, i) => (
                    <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,140,80,0.1)',
                        borderRadius: '8px', padding: '0.5rem 0.75rem',
                    }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.1rem', letterSpacing: '-0.01em' }}>{p.nombre}</p>
                            <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.55)', margin: 0 }}>{p.cantidad} × {fmt(p.precio_unitario)}</p>
                        </div>
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#2d1a08', letterSpacing: '-0.02em' }}>{fmt(p.subtotal)}</p>
                    </div>
                ))}
            </div>
        );
    }
    if (clave === 'productos_restaurados' && Array.isArray(valor)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem', width: '100%' }}>
                {valor.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(16,185,129,0.7)', flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ color: '#2d1a08' }}>{p.nombre}</span>
                        <span style={{ color: 'rgba(150,80,20,0.5)' }}>— {p.cantidad} unidad{p.cantidad !== 1 ? 'es' : ''}</span>
                    </div>
                ))}
            </div>
        );
    }
    if (Array.isArray(valor)) return <span style={{ color: '#2d1a08', fontSize: '0.82rem' }}>{valor.join(', ')}</span>;
    return <span style={{ color: '#2d1a08', fontSize: '0.82rem' }}>{String(valor)}</span>;
}

function DatosPanel({ datos, titulo, accentColor, accentBg, accentBorder }) {
    if (!datos) return null;
    const entradas = Object.entries(datos).filter(([, v]) => v !== null && v !== undefined && v !== '');
    if (entradas.length === 0) return null;
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accentColor, flexShrink: 0, display: 'inline-block' }} />
                <p style={{ fontSize: '0.76rem', fontWeight: '500', color: '#2d1a08', margin: 0, letterSpacing: '-0.01em' }}>{titulo}</p>
            </div>
            <div style={{ borderRadius: '10px', border: `1px solid ${accentBorder}`, background: accentBg, overflow: 'hidden' }}>
                {entradas.map(([clave, valor], i) => (
                    <div key={clave} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '1rem',
                        padding: '0.65rem 0.9rem',
                        borderBottom: i < entradas.length - 1 ? '1px solid rgba(200,140,80,0.08)' : 'none',
                        flexWrap: 'wrap',
                    }}>
                        <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.55)', fontWeight: '500', flexShrink: 0, margin: 0, minWidth: '120px', paddingTop: '0.1rem' }}>
                            {LABELS[clave] ?? clave.replace(/_/g, ' ')}
                        </p>
                        <div style={{ flex: 1, textAlign: 'right' }}>{renderValor(clave, valor)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Icono SVG para módulos (sin emojis)
function ModuloIcon({ modulo }) {
    const paths = {
        ventas:      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>,
        productos:   <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>,
        clientes:    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>,
        proveedores: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"/>,
        inventario:  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>,
        usuarios:    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>,
        categorias:  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z"/>,
        abonos:      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>,
        papelera:    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>,
    };
    return (
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            {paths[modulo] ?? <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"/>}
        </svg>
    );
}

function GlassCheck({ checked, onChange, indeterminate = false }) {
    return (
        <span
            onClick={(e) => { e.stopPropagation(); onChange(); }}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '16px', height: '16px', flexShrink: 0,
                borderRadius: '5px', cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: checked
                    ? 'rgba(185,28,28,0.12)'
                    : 'rgba(255,255,255,0.7)',
                border: checked
                    ? '1.5px solid rgba(185,28,28,0.45)'
                    : '1.5px solid rgba(200,130,60,0.35)',
                boxShadow: checked
                    ? '0 0 0 3px rgba(185,28,28,0.07), inset 0 1px 0 rgba(255,255,255,0.5)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
        >
            {checked && !indeterminate && (
                <svg width="9" height="9" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="rgba(185,28,28,0.85)" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
            {indeterminate && (
                <svg width="8" height="8" fill="none" viewBox="0 0 10 10">
                    <path d="M2 5h6"
                          stroke="rgba(185,28,28,0.85)" strokeWidth="1.8"
                          strokeLinecap="round"/>
                </svg>
            )}
        </span>
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
    const [usuarioInput, setUsuarioInput] = useState(filtros.usuario ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (usuarioInput !== filtros.usuario) {
                aplicarFiltro('usuario', usuarioInput);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [usuarioInput]);

    useEffect(() => {
        if (esperando2FA) {
            setDeleteCount(delete_count ?? 0);
            setModal2FA(true);
            setModalEliminar(false);
        }
    }, [esperando2FA, delete_count]);

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
            password: password,
            ids:      seleccionados,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const f      = page.props.flash ?? {};
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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .rg-wrap {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem 1.25rem 4rem;
                    font-family: 'Inter', sans-serif;
                }

                /* ── HEADER ── */
                .rg-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                    flex-wrap: wrap;
                }
                .rg-title {
                    font-size: clamp(1.35rem, 3vw, 1.7rem);
                    font-weight: 300;
                    color: #2d1a08;
                    letter-spacing: -0.04em;
                    margin: 0 0 0.2rem;
                }
                .rg-subtitle {
                    font-size: 0.78rem;
                    color: rgba(150,80,20,0.52);
                    margin: 0;
                }
                .rg-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    flex-wrap: wrap;
                }

                /* ── BUTTONS ── */
                .btn-danger {
                    display: flex; align-items: center; gap: 0.4rem;
                    padding: 0.6rem 1.1rem;
                    border-radius: 9px; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 500;
                    background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.22);
                    color: rgba(185,28,28,0.9); transition: all 0.15s; letter-spacing: -0.01em;
                    white-space: nowrap;
                }
                .btn-danger:hover { background: rgba(220,38,38,0.13); border-color: rgba(220,38,38,0.32); }

                .btn-ghost {
                    padding: 0.6rem 1rem;
                    border-radius: 9px; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.8rem; font-weight: 400;
                    background: rgba(255,255,255,0.45); border: 1px solid rgba(200,140,80,0.2);
                    color: rgba(120,60,10,0.7); transition: all 0.15s; letter-spacing: -0.01em;
                    white-space: nowrap;
                }
                .btn-ghost:hover { background: rgba(255,255,255,0.7); }

                .btn-primary {
                    padding: 0.72rem 1.4rem;
                    border-radius: 9px; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 500;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); transition: all 0.15s; letter-spacing: -0.01em;
                }
                .btn-primary:hover:not(:disabled) { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.32); }
                .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

                .btn-confirm-red {
                    padding: 0.72rem 1.4rem; border-radius: 9px; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 500;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); transition: all 0.15s; letter-spacing: -0.01em;
                    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
                }
                .btn-confirm-red:hover:not(:disabled) { background: rgba(185,28,28,0.14); }
                .btn-confirm-red:disabled { opacity: 0.45; cursor: not-allowed; }

                /* ── FILTROS ── */
                .rg-filters {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; padding: 1.35rem;
                    margin-bottom: 1.25rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both;
                }
                .rg-filters-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 0.75rem;
                }
                .rg-label {
                    display: block; font-size: 0.67rem; font-weight: 500;
                    color: rgba(150,80,20,0.5); text-transform: uppercase;
                    letter-spacing: 0.07em; margin-bottom: 0.35rem;
                }
                .rg-input {
                    width: 100%; padding: 0.6rem 0.8rem;
                    background: rgba(255,255,255,0.6); border: 1px solid rgba(200,140,80,0.18);
                    border-radius: 8px; font-size: 0.82rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none; transition: all 0.13s;
                    letter-spacing: -0.01em;
                }
                .rg-input::placeholder { color: rgba(180,100,30,0.3); }
                .rg-input:focus { background: rgba(255,255,255,0.85); border-color: rgba(200,140,80,0.35); box-shadow: 0 0 0 3px rgba(200,140,80,0.07); }

                /* ── TABLA ── */
                .rg-table-wrap {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; overflow: hidden;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s both;
                }
                .rg-table-hint {
                    padding: 0.7rem 1.25rem;
                    border-bottom: 1px solid rgba(200,140,80,0.08);
                    display: flex; align-items: center; justify-content: space-between;
                    background: rgba(255,255,255,0.25);
                }
                .rg-table { width: 100%; border-collapse: collapse; }
                .rg-th {
                    padding: 0.7rem 1rem; text-align: left;
                    font-size: 0.65rem; font-weight: 500; color: rgba(150,80,20,0.5);
                    text-transform: uppercase; letter-spacing: 0.07em;
                    background: rgba(255,255,255,0.2);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    white-space: nowrap;
                }
                .rg-td {
                    padding: 0.7rem 1rem;
                    border-bottom: 1px solid rgba(200,140,80,0.06);
                    font-size: 0.81rem; color: #2d1a08;
                    vertical-align: middle;
                }
                .rg-tr { transition: background 0.12s; }
                .rg-tr:hover { background: rgba(255,255,255,0.35); }
                .rg-tr.selected { background: rgba(220,38,38,0.04); }
                .rg-tr:last-child .rg-td { border-bottom: none; }
                .rg-tr-link { cursor: pointer; }

                /* Módulo chip */
                .modulo-chip {
                    display: inline-flex; align-items: center; gap: 0.35rem;
                    padding: 0.16rem 0.5rem; border-radius: 5px;
                    font-size: 0.69rem; font-weight: 500;
                    background: rgba(200,140,80,0.06); border: 1px solid rgba(200,140,80,0.16);
                    color: rgba(120,60,10,0.75); white-space: nowrap;
                }

                /* Rol badge */
                .rol-admin {
                    padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500;
                    background: rgba(185,28,28,0.07); border: 1px solid rgba(185,28,28,0.2);
                    color: rgba(185,28,28,0.9);
                }
                .rol-other {
                    padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500;
                    background: rgba(59,130,246,0.07); border: 1px solid rgba(59,130,246,0.2);
                    color: rgba(29,78,216,0.9);
                }

                /* Empty state */
                .rg-empty {
                    text-align: center; padding: 4rem 1rem;
                }
                .rg-empty-icon {
                    width: 40px; height: 40px; border-radius: 10px; margin: 0 auto 1rem;
                    background: rgba(200,140,80,0.06); border: 1px solid rgba(200,140,80,0.15);
                    display: flex; align-items: center; justify-content: center;
                }

                /* Paginación */
                .rg-pagination {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.875rem 1.25rem;
                    border-top: 1px solid rgba(200,140,80,0.1);
                    flex-wrap: wrap; gap: 0.6rem;
                }
                .rg-page-btn {
                    padding: 0.35rem 0.7rem; border-radius: 7px; font-size: 0.78rem;
                    border: 1px solid transparent; cursor: pointer; font-family: 'Inter', sans-serif;
                    transition: all 0.12s;
                }
                .rg-page-btn.active {
                    background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); font-weight: 500;
                }
                .rg-page-btn:not(.active):not(:disabled) {
                    background: rgba(255,255,255,0.4); border-color: rgba(200,140,80,0.15);
                    color: rgba(120,60,10,0.7);
                }
                .rg-page-btn:not(.active):not(:disabled):hover {
                    background: rgba(255,255,255,0.7); border-color: rgba(200,140,80,0.25);
                }
                .rg-page-btn:disabled { color: rgba(150,80,20,0.25); cursor: not-allowed; background: transparent; border-color: transparent; }

                /* Flash */
                .rg-flash-ok {
                    display: flex; align-items: center; gap: 0.6rem;
                    padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1.25rem;
                    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2);
                    font-size: 0.8rem; color: rgba(4,120,87,0.9); font-weight: 500;
                }

                /* ── MODAL ── */
                .modal-overlay {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(20,8,0,0.25); backdrop-filter: blur(5px);
                    display: flex; align-items: center; justify-content: center; padding: 1rem;
                }
                .modal-card {
                    width: 100%; max-width: 420px;
                    background: rgba(253,248,244,0.97); backdrop-filter: blur(40px);
                    border: 1px solid rgba(200,140,80,0.18); border-radius: 18px; padding: 0;
                    box-shadow: 0 20px 60px rgba(180,90,20,0.14);
                    overflow: hidden;
                    animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
                }
                .modal-header {
                    padding: 1.35rem 1.5rem 1rem;
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; gap: 0.75rem;
                }
                .modal-icon {
                    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                }
                .modal-body { padding: 1.25rem 1.5rem 1.5rem; }
                .modal-title { font-size: 0.92rem; font-weight: 500; color: #2d1a08; margin: 0 0 0.12rem; letter-spacing: -0.02em; }
                .modal-step  { font-size: 0.71rem; color: rgba(150,80,20,0.5); margin: 0; }

                .modal-warning {
                    padding: 0.75rem 0.9rem; border-radius: 9px; margin-bottom: 1.1rem;
                    font-size: 0.79rem; line-height: 1.55;
                }
                .modal-warning.red   { background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.16); color: rgba(185,28,28,0.85); }
                .modal-warning.amber { background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.2);  color: rgba(146,64,14,0.9);  }

                .modal-input {
                    width: 100%; padding: 0.7rem 0.9rem;
                    background: rgba(255,255,255,0.6); border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 9px; font-size: 0.85rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none; transition: all 0.13s;
                    letter-spacing: -0.01em;
                }
                .modal-input:focus { background: rgba(255,255,255,0.9); border-color: rgba(185,28,28,0.3); box-shadow: 0 0 0 3px rgba(185,28,28,0.06); }
                .modal-input.code-input {
                    text-align: center; font-size: 1.6rem; font-weight: 600;
                    letter-spacing: 0.4em; padding: 0.9rem;
                }
                .modal-error { margin-top: 0.3rem; font-size: 0.73rem; color: rgba(185,28,28,0.8); display: flex; align-items: center; gap: 0.35rem; }
                .modal-hint  { font-size: 0.71rem; color: rgba(150,80,20,0.45); margin-top: 0.5rem; line-height: 1.5; }

                .modal-actions { display: flex; gap: 0.6rem; margin-top: 1.1rem; }

                /* Detalle modal */
                .detail-modal {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(20,8,0,0.25); backdrop-filter: blur(5px);
                    display: flex; align-items: center; justify-content: center; padding: 1rem;
                }
                .detail-card {
                    background: rgba(253,248,244,0.97); backdrop-filter: blur(40px);
                    border: 1px solid rgba(200,140,80,0.18); border-radius: 18px;
                    width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(180,90,20,0.14);
                    animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
                }
                .detail-header {
                    padding: 1.35rem 1.5rem 1rem;
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: space-between;
                    position: sticky; top: 0;
                    background: rgba(253,248,244,0.95); backdrop-filter: blur(20px);
                    z-index: 1;
                }
                .detail-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;
                    margin-bottom: 1rem;
                }
                .detail-item {
                    padding: 0.75rem 0.9rem; border-radius: 10px;
                    background: rgba(255,255,255,0.4); border: 1px solid rgba(200,140,80,0.1);
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .rg-filters-grid { grid-template-columns: repeat(3, 1fr); }
                    /* Ocultar columnas secundarias en tablet */
                    .col-ip, .col-rol { display: none; }
                }
                @media (max-width: 640px) {
                    .rg-wrap { padding: 1.25rem 0.875rem 3rem; }
                    .rg-filters { padding: 1rem; }
                    .rg-filters-grid { grid-template-columns: 1fr 1fr; }
                    .rg-th, .rg-td { padding: 0.6rem 0.75rem; }
                    .col-ip, .col-rol, .col-desc { display: none; }
                    .detail-grid { grid-template-columns: 1fr; }
                    .modal-card { border-radius: 14px; }
                    .detail-card { border-radius: 14px; max-height: 95vh; }
                }
                @media (max-width: 420px) {
                    .rg-filters-grid { grid-template-columns: 1fr; }
                    .col-modulo { display: none; }
                }
            `}</style>

            <div className="rg-wrap">

                {/* ── HEADER ── */}
                <div className="rg-header">
                    <div>
                        <p style={{ fontSize: '0.67rem', fontWeight: '500', color: 'rgba(150,80,20,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                            Sistema
                        </p>
                        <h1 className="rg-title">Registros de actividad</h1>
                        <p className="rg-subtitle">Historial completo de acciones realizadas en el sistema</p>
                    </div>
                    <div className="rg-header-actions">
                        {algunoSeleccionado && (
                            <button onClick={abrirModalEliminar} className="btn-danger">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Eliminar {seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}
                            </button>
                        )}
                        {hayFiltros && (
                            <button onClick={limpiarFiltros} className="btn-ghost">
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* ── FLASH ── */}
                {flash.success && (
                    <div className="rg-flash-ok">
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        {flash.success}
                    </div>
                )}

                {/* ── FILTROS ── */}
                <div className="rg-filters-grid">
                    <div>
                        <label className="rg-label">Usuario</label>
                        <input
                            type="text"
                            value={usuarioInput}
                            onChange={(e) => setUsuarioInput(e.target.value)}
                            placeholder="Buscar usuario..."
                            className="rg-input"
                        />
                    </div>

                    <GlassSelect
                        label="Módulo"
                        value={filtros.modulo}
                        onChange={(val) => aplicarFiltro('modulo', val)}
                        options={opcionesModulo}
                        allLabel="Todos los módulos"
                        placeholder="Módulo..."
                        searchable
                    />

                    <GlassSelect
                        label="Acción"
                        value={filtros.accion}
                        onChange={(val) => aplicarFiltro('accion', val)}
                        options={acciones.map(a => ({ value: a, label: a }))}
                        allLabel="Todas las acciones"
                        placeholder="Acción..."
                    />

                    <GlassDateInput
                        label="Desde"
                        value={filtros.desde}
                        onChange={(val) => aplicarFiltro('desde', val)}
                        placeholder="dd/mm/aaaa"
                    />

                    <GlassDateInput
                        label="Hasta"
                        value={filtros.hasta}
                        onChange={(val) => aplicarFiltro('hasta', val)}
                        placeholder="dd/mm/aaaa"
                    />
                </div>

                {/* ── TABLA ── */}
                <div className="rg-table-wrap">
                    {registros.data.length === 0 ? (
                        <div className="rg-empty">
                            <div className="rg-empty-icon">
                                <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: 'rgba(150,80,20,0.45)', margin: 0 }}>No hay registros con los filtros aplicados</p>
                        </div>
                    ) : (
                        <>
                            <div className="rg-table-hint">
                                <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.45)', margin: 0 }}>
                                    Clic en una fila para ver el detalle · Checkbox para seleccionar y eliminar
                                </p>
                                {algunoSeleccionado && (
                                    <p style={{ fontSize: '0.71rem', fontWeight: '500', color: 'rgba(185,28,28,0.8)', margin: 0 }}>
                                        {seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table className="rg-table">
                                    <thead>
                                    <tr>
                                        <th className="rg-th" style={{ width: '36px' }}>
                                            <GlassCheck
                                                checked={todosSeleccionados}
                                                indeterminate={algunoSeleccionado && !todosSeleccionados}
                                                onChange={toggleTodos}
                                            />
                                        </th>
                                        <th className="rg-th">Fecha / Hora</th>
                                        <th className="rg-th">Usuario</th>
                                        <th className="rg-th col-rol">Rol</th>
                                        <th className="rg-th col-modulo">Módulo</th>
                                        <th className="rg-th">Acción</th>
                                        <th className="rg-th col-desc">Descripción</th>
                                        <th className="rg-th col-ip">IP</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {registros.data.map((r) => (
                                        <tr key={r.id} className={`rg-tr${seleccionados.includes(r.id) ? ' selected' : ''}`}>
                                            <td className="rg-td" onClick={(e) => e.stopPropagation()}>
                                                <GlassCheck
                                                    checked={seleccionados.includes(r.id)}
                                                    onChange={() => toggleSeleccion(r.id)}
                                                />
                                            </td>
                                            <td className="rg-td rg-tr-link" style={{ whiteSpace: 'nowrap', color: 'rgba(120,60,10,0.65)', fontSize: '0.76rem' }}
                                                onClick={() => setDetalle(r)}>
                                                {formatFecha(r.created_at)}
                                            </td>
                                            <td className="rg-td rg-tr-link" onClick={() => setDetalle(r)}>
                                                <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', margin: 0, letterSpacing: '-0.01em' }}>{r.user_name}</p>
                                            </td>
                                            <td className="rg-td rg-tr-link col-rol" onClick={() => setDetalle(r)}>
                                                <span className={r.user_rol === 'admin' ? 'rol-admin' : 'rol-other'}>{r.user_rol}</span>
                                            </td>
                                            <td className="rg-td rg-tr-link col-modulo" onClick={() => setDetalle(r)}>
                                                <span className="modulo-chip" style={{ color: 'rgba(120,60,10,0.72)' }}>
                                                    <ModuloIcon modulo={r.modulo}/>
                                                    {MODULO_LABELS[r.modulo] ?? r.modulo}
                                                </span>
                                            </td>
                                            <td className="rg-td rg-tr-link" onClick={() => setDetalle(r)}>
                                                <AccionBadge accion={r.accion}/>
                                            </td>
                                            <td className="rg-td rg-tr-link col-desc" onClick={() => setDetalle(r)}
                                                style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(120,60,10,0.7)', fontSize: '0.78rem' }}>
                                                {r.descripcion}
                                            </td>
                                            <td className="rg-td rg-tr-link col-ip" onClick={() => setDetalle(r)}
                                                style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', whiteSpace: 'nowrap' }}>
                                                {r.ip}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {registros.last_page > 1 && (
                                <div className="rg-pagination">
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>
                                        Mostrando {registros.from}–{registros.to} de {registros.total} registros
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                        {registros.links.map((link, i) => (
                                            <button key={i}
                                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                                    disabled={!link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`rg-page-btn${link.active ? ' active' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
                MODAL DETALLE
            ══════════════════════════════════════════════════════ */}
            {detalle && (
                <div className="detail-modal" onClick={() => setDetalle(null)}>
                    <div className="detail-card" onClick={(e) => e.stopPropagation()}>
                        <div className="detail-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: 'rgba(200,140,80,0.07)', border: '1px solid rgba(200,140,80,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(120,60,10,0.6)', flexShrink: 0,
                                }}>
                                    <ModuloIcon modulo={detalle.modulo}/>
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '0.9rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.12rem', letterSpacing: '-0.02em' }}>
                                        Detalle del registro
                                    </h2>
                                    <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>
                                        #{detalle.id} — {formatFecha(detalle.created_at)}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setDetalle(null)} style={{
                                width: '28px', height: '28px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                                background: 'rgba(200,140,80,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(150,80,20,0.6)', flexShrink: 0, transition: 'all 0.12s',
                            }}>
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            <div className="detail-grid">
                                {[
                                    { label: 'Usuario',     value: detalle.user_name },
                                    { label: 'Rol',         value: <span className={detalle.user_rol === 'admin' ? 'rol-admin' : 'rol-other'}>{detalle.user_rol}</span> },
                                    { label: 'Módulo',      value: <span className="modulo-chip"><ModuloIcon modulo={detalle.modulo}/>{MODULO_LABELS[detalle.modulo] ?? detalle.modulo}</span> },
                                    { label: 'Acción',      value: <AccionBadge accion={detalle.accion}/> },
                                    { label: 'Fecha y hora',value: formatFecha(detalle.created_at) },
                                    { label: 'Dirección IP',value: detalle.ip ?? '—' },
                                ].map((item, i) => (
                                    <div key={i} className="detail-item">
                                        <p style={{ fontSize: '0.65rem', fontWeight: '500', color: 'rgba(150,80,20,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.28rem' }}>
                                            {item.label}
                                        </p>
                                        {typeof item.value === 'string'
                                            ? <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', margin: 0, letterSpacing: '-0.01em' }}>{item.value}</p>
                                            : item.value
                                        }
                                    </div>
                                ))}
                            </div>

                            {detalle.modelo_tipo && (
                                <div className="detail-item">
                                    <p style={{ fontSize: '0.65rem', fontWeight: '500', color: 'rgba(150,80,20,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.28rem' }}>
                                        Registro afectado
                                    </p>
                                    <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', margin: 0, letterSpacing: '-0.01em' }}>
                                        {detalle.modelo_tipo} #{detalle.modelo_id}
                                    </p>
                                </div>
                            )}

                            <div className="detail-item">
                                <p style={{ fontSize: '0.65rem', fontWeight: '500', color: 'rgba(150,80,20,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.4rem' }}>
                                    Descripción completa
                                </p>
                                <p style={{ fontSize: '0.81rem', color: 'rgba(120,60,10,0.75)', margin: 0, lineHeight: '1.6' }}>{detalle.descripcion}</p>
                            </div>

                            <DatosPanel datos={detalle.datos_anteriores} titulo="Estado anterior"
                                        accentColor="rgba(220,38,38,0.6)" accentBg="rgba(220,38,38,0.03)" accentBorder="rgba(220,38,38,0.12)"/>
                            <DatosPanel datos={detalle.datos_nuevos} titulo="Datos registrados"
                                        accentColor="rgba(16,185,129,0.7)" accentBg="rgba(16,185,129,0.03)" accentBorder="rgba(16,185,129,0.12)"/>

                            {!detalle.datos_anteriores && !detalle.datos_nuevos && (
                                <div style={{ textAlign: 'center', padding: '1rem', color: 'rgba(150,80,20,0.4)', fontSize: '0.8rem' }}>
                                    No hay datos adicionales para este registro
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                                <button onClick={() => setDetalle(null)} className="btn-ghost" style={{ padding: '0.6rem 1.2rem' }}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                MODAL PASO 1 — CONTRASEÑA
            ══════════════════════════════════════════════════════ */}
            {modalEliminar && (
                <div className="modal-overlay">
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.18)' }}>
                                <svg width="14" height="14" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="modal-title">Eliminar registros</h2>
                                <p className="modal-step">Paso 1 de 2 — Confirmar identidad</p>
                            </div>
                        </div>
                        <form onSubmit={enviarSolicitud} className="modal-body">
                            <div className="modal-warning red">
                                Estás a punto de eliminar permanentemente <strong>{seleccionados.length}</strong> registro{seleccionados.length !== 1 ? 's' : ''}. Esta acción <strong>no se puede deshacer</strong>.
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label className="rg-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Contraseña actual</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                       className="modal-input" placeholder="Ingresa tu contraseña" autoFocus/>
                                {errorPassword && (
                                    <p className="modal-error">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {errorPassword}
                                    </p>
                                )}
                            </div>
                            <p className="modal-hint">Tras confirmar tu contraseña, recibirás un código de verificación en tu correo.</p>
                            <div className="modal-actions">
                                <button type="button" onClick={() => { setModalEliminar(false); setPassword(''); setErrorPassword(''); }} className="btn-ghost" style={{ flex: 1 }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={processing || !password} className="btn-confirm-red">
                                    {processing ? (
                                        <>
                                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                                            </svg>
                                            Verificando...
                                        </>
                                    ) : 'Continuar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                MODAL PASO 2 — CÓDIGO 2FA
            ══════════════════════════════════════════════════════ */}
            {modal2FA && (
                <div className="modal-overlay">
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <svg width="14" height="14" fill="none" stroke="rgba(146,64,14,0.8)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="modal-title">Verificación en dos pasos</h2>
                                <p className="modal-step">Paso 2 de 2 — Código de confirmación</p>
                            </div>
                        </div>
                        <form onSubmit={enviarCodigo2FA} className="modal-body">
                            <div className="modal-warning amber">
                                Hemos enviado un código de <strong>6 dígitos</strong> a tu correo. Ingrésalo para confirmar la eliminación de <strong>{deleteCount}</strong> registro{deleteCount !== 1 ? 's' : ''}.
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <label className="rg-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Código de verificación</label>
                                <input
                                    type="text" inputMode="numeric"
                                    value={form2FA.data.code}
                                    onChange={(e) => form2FA.setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="modal-input code-input"
                                    placeholder="——————" maxLength={6} autoFocus
                                />
                                {form2FA.errors.code && (
                                    <p className="modal-error">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {form2FA.errors.code}
                                    </p>
                                )}
                            </div>
                            <p className="modal-hint">El código expira en <strong>10 minutos</strong>. Si no lo recibes, cancela e inicia el proceso nuevamente.</p>
                            <div className="modal-actions">
                                <button type="button" onClick={cancelar2FA} className="btn-ghost" style={{ flex: 1 }}>
                                    Cancelar
                                </button>
                                <button type="submit" disabled={form2FA.processing || form2FA.data.code.length !== 6} className="btn-confirm-red">
                                    {form2FA.processing ? (
                                        <>
                                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                                            </svg>
                                            Eliminando...
                                        </>
                                    ) : 'Confirmar eliminación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </AppLayout>
    );
}
