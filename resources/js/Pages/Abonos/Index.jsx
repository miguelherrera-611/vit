import AppLayout from '@/Layouts/AppLayout';
import { useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function AbonosIndex({ clientes = [], busqueda = '' }) {
    const { auth } = usePage().props;
    const esAdmin = auth?.user?.roles?.some(r => r.name === 'admin') ?? false;

    const [busquedaLocal, setBusquedaLocal]         = useState(busqueda ?? '');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const debounceRef = useRef(null);
    const primeraRender = useRef(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        venta_id:         '',
        monto:            '',
        forma_pago:       'Efectivo',
        observaciones:    '',
        tipo_movimiento:  'abono_normal',
    });

    useEffect(() => {
        if (primeraRender.current) {
            primeraRender.current = false;
            return;
        }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get('/abonos', { cliente: busquedaLocal }, { preserveScroll: false, replace: true });
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [busquedaLocal]);

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
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                .ab-bg{
                    min-height:100vh;font-family:'Inter',sans-serif;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.14) 0%, transparent 55%),
                        linear-gradient(145deg,#fdf7f2 0%,#fdf5ef 35%,#fef7f2 70%,#fef9f6 100%);
                }
                .ab-header{
                    background:rgba(255,255,255,.08);
                    backdrop-filter:blur(40px) saturate(180%);
                    border-bottom:1px solid rgba(255,255,255,.68);
                }
                .ab-shell{max-width:1280px;margin:0 auto;padding:1.5rem 1rem 2.5rem}
                .ab-grid{display:grid;grid-template-columns:1fr;gap:1rem}
                .ab-glass{
                    background:rgba(255,255,255,.04);
                    backdrop-filter:blur(22px) saturate(150%);
                    border:1px solid rgba(255,255,255,.65);
                    border-radius:18px;
                    box-shadow:0 12px 40px rgba(180,90,20,.07), inset 0 1.5px 0 rgba(255,255,255,.88);
                }
                .ab-btn-main{
                    padding:.75rem 1rem;border-radius:11px;border:1px solid rgba(220,38,38,.38);
                    background:rgba(220,38,38,.1);color:rgba(185,28,28,.92);
                    font-size:.83rem;font-weight:600;cursor:pointer;
                    text-align:center;display:inline-flex;align-items:center;justify-content:center;
                    min-height:42px;
                }
                .ab-btn-main:hover{background:rgba(220,38,38,.16)}

                .ab-btn-soft{
                    padding:.75rem 1rem;border-radius:11px;border:1px solid rgba(200,140,80,.22);
                    background:rgba(255,255,255,.08);color:rgba(120,60,10,.78);
                    font-size:.82rem;font-weight:500;cursor:pointer;
                    text-decoration:none;
                    text-align:center;display:inline-flex;align-items:center;justify-content:center;
                    min-height:42px;
                    transition:all .15s ease;
                }
                .ab-btn-soft:hover{
                    background:rgba(255,255,255,.2);
                    border-color:rgba(200,140,80,.35);
                    color:rgba(120,60,10,.9);
                }

                .ab-input{
                    width:100%;padding:.76rem .95rem;border-radius:11px;
                    border:1px solid rgba(200,140,80,.28);background:rgba(255,255,255,.55);
                    color:#2d1a08;outline:none;
                }
                .ab-input:focus{border-color:rgba(200,140,80,.45);box-shadow:0 0 0 3px rgba(200,140,80,.08)}
                .ab-input.has-icon{
                    padding-left:3rem !important; /* más espacio para que no quede pegado a la lupa */
                }
                .ab-search-icon{
                    left:1rem !important;
                    opacity:.78;
                    pointer-events:none;
                }
                .ab-sticky{position:sticky;top:1rem}

                /* Stats de venta — CSS puro sin Tailwind */
                .ab-sale-grid{
                    display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:0.75rem;
                    margin-bottom:0.75rem;
                }

                /* Fila de badges + fecha en cada venta */
                .ab-venta-header{
                    display:flex;align-items:flex-start;justify-content:space-between;
                    gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;
                }
                .ab-venta-badges{
                    display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;min-width:0;
                }
                .ab-venta-fecha{
                    font-size:0.72rem;color:rgba(150,80,20,0.45);white-space:nowrap;flex-shrink:0;
                    padding-top:0.1rem;
                }

                @media (min-width:1024px){
                    .ab-grid{grid-template-columns:3fr 2fr;gap:1.25rem}
                    .ab-shell{padding:2rem 1.5rem 3rem}
                }
                @media (max-width:1023px){
                    /* En móvil/tablet ocultar el panel derecho si no hay venta seleccionada */
                    .ab-right-empty{display:none}
                }
                @media (max-width:768px){
                    .ab-sticky{position:static}
                    .ab-actions{display:grid;grid-template-columns:1fr;gap:.55rem}
                    .ab-actions > *{width:100%}
                    .ab-sale-grid{grid-template-columns:1fr}
                    .ab-form-grid-2{grid-template-columns:1fr !important}
                }

                .ab-money-wrap { position: relative; }
                .ab-money-symbol{
                    position:absolute;
                    left:0.95rem;
                    top:50%;
                    transform:translateY(-50%);
                    font-weight:600;
                    font-size:0.95rem;
                    color:rgba(120,60,10,0.62);
                    pointer-events:none;
                    line-height:1;
                }
                .ab-money-input{
                    padding-left:2.1rem !important;
                    letter-spacing:0;
                    line-height:1.2;
                    -moz-appearance:textfield;
                }
                .ab-money-input::-webkit-outer-spin-button,
                .ab-money-input::-webkit-inner-spin-button{
                    -webkit-appearance:none;
                    margin:0;
                }

                @media (max-width:768px){
                    .ab-money-symbol{ left:0.9rem; font-size:0.9rem; }
                    .ab-money-input{
                        font-size:1rem !important;
                        padding-left:2rem !important;
                    }
                }
            `}</style>

            <div className="ab-bg">
                <div className="ab-header">
                    <div className="ab-shell" style={{paddingBottom:'1rem'}}>
                        <h1 style={{fontSize:'clamp(1.45rem,3.3vw,2rem)',fontWeight:300,color:'#2d1a08',letterSpacing:'-0.03em'}}>Gestión de Abonos</h1>
                        <p style={{marginTop:'.25rem',fontSize:'.82rem',color:'rgba(150,80,20,.56)'}}>Registra abonos en ventas a crédito o separado</p>
                    </div>
                </div>

                <div className="ab-shell">
                    <div className="ab-grid">

                        <div className="space-y-4">
                            <div className="ab-glass p-4 sm:p-5">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Cliente</h2>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ab-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={busquedaLocal}
                                        onChange={(e) => setBusquedaLocal(e.target.value)}
                                        placeholder="Nombre, teléfono o documento..."
                                        className="ab-input has-icon"
                                    />
                                </div>
                            </div>

                            {!busqueda && (
                                <div className="ab-glass p-8 text-center">
                                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Busca un cliente por nombre, teléfono o documento</p>
                                </div>
                            )}

                            {busqueda && clientes.length === 0 && (
                                <div className="ab-glass p-8 text-center">
                                    <p className="text-gray-500 text-sm">No se encontraron clientes con deudas activas para <strong>"{busqueda}"</strong></p>
                                </div>
                            )}

                            {clientes.map((cliente) => (
                                <div key={cliente.id} className="ab-glass overflow-hidden">
                                    <div className="px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-2" style={{background:'rgba(255,255,255,.18)',borderBottom:'1px solid rgba(200,140,80,.12)'}}>
                                        <div>
                                            <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                                            <p className="text-sm text-gray-500">{cliente.telefono}</p>
                                        </div>
                                        <span className="text-sm text-gray-500">{cliente.ventas.length} deuda{cliente.ventas.length !== 1 ? 's' : ''} activa{cliente.ventas.length !== 1 ? 's' : ''}</span>
                                    </div>

                                    {cliente.ventas.length === 0 ? (
                                        <div className="px-6 py-4 text-sm text-gray-400">Sin deudas activas</div>
                                    ) : (
                                        <div className="divide-y" style={{borderColor:'rgba(200,140,80,.08)'}}>
                                            {cliente.ventas.map((venta) => (
                                                <div key={venta.id} className={'px-4 sm:px-6 py-4 transition ' + (ventaSeleccionada?.id === venta.id ? 'bg-blue-50/60 border-l-4 border-blue-500' : 'hover:bg-white/30')}>
                                                    <div className="ab-venta-header">
                                                        <div className="ab-venta-badges">
                                                            <span style={{fontSize:'0.83rem',fontWeight:500,color:'#2d1a08'}}>{venta.numero_venta}</span>
                                                            <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + estadoColor(venta.estado)}>{venta.estado}</span>
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{venta.tipo_venta}</span>
                                                        </div>
                                                        <span className="ab-venta-fecha">{venta.created_at}</span>
                                                    </div>

                                                    <div className="ab-sale-grid">
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

                                                    <div className="flex flex-col sm:flex-row gap-2 ab-actions">
                                                        <button type="button" onClick={() => seleccionarVenta(venta, cliente)} className="ab-btn-main">Registrar abono</button>
                                                        <a href={'/abonos/' + venta.id + '/historial'} className="ab-btn-soft text-center">Ver historial</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            {!ventaSeleccionada ? (
                                <div className="ab-glass p-6 sm:p-8 text-center ab-sticky ab-right-empty">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm">Selecciona una deuda para registrar un abono</p>
                                </div>
                            ) : (
                                <form onSubmit={registrarAbono} className="ab-glass p-4 sm:p-6 ab-sticky">
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
                                                    className={`ab-choice ${data.tipo_movimiento === 'abono_normal' ? 'active' : ''}`}
                                                >
                                                    Abono normal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('tipo_movimiento', 'ajuste')}
                                                    className={`ab-choice ${data.tipo_movimiento === 'ajuste' ? 'active' : ''}`}
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
                                        <div className="ab-money-wrap">
                                            <span className="ab-money-symbol">$</span>
                                            <input
                                                type="number"
                                                value={data.monto}
                                                onChange={(e) => setData('monto', e.target.value)}
                                                className="ab-input ab-money-input text-lg font-semibold"
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
                                                <button
                                                    key={fp}
                                                    type="button"
                                                    onClick={() => setData('forma_pago', fp)}
                                                    className={`ab-choice ${data.forma_pago === fp ? 'active' : ''}`}
                                                >
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
                                            className="ab-input resize-none text-sm"
                                            placeholder={data.tipo_movimiento === 'ajuste' ? 'Describe el motivo del ajuste...' : 'Nota sobre el abono...'}
                                        />
                                    </div>

                                    {errors.error && <p className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{errors.error}</p>}

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button type="button" onClick={() => { setVentaSeleccionada(null); reset(); }} className="ab-btn-soft flex-1">Cancelar</button>
                                        <button
                                            type="submit"
                                            disabled={processing || !data.monto}
                                            className="flex-1 py-3 rounded-xl font-medium transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ab-btn-confirm"
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
