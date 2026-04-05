import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';

const formatCurrency = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const formatDate = (s) =>
    new Date(s).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

const TIPO_STYLES = {
    Contado:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)',  color: 'rgba(4,120,87,0.85)'   },
    Separado: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  color: 'rgba(146,64,14,0.85)'  },
    Crédito:  { bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.2)',   color: 'rgba(29,78,216,0.85)'  },
};

const ESTADO_STYLES = {
    Pagada:     { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)',  color: 'rgba(4,120,87,0.85)'   },
    Completada: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.22)',  color: 'rgba(4,120,87,0.85)'   },
    Pendiente:  { bg: 'rgba(220,38,38,0.06)',   border: 'rgba(220,38,38,0.18)',   color: 'rgba(185,28,28,0.85)'  },
    Abonada:    { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  color: 'rgba(146,64,14,0.85)'  },
    Cancelada:  { bg: 'rgba(200,140,80,0.06)',  border: 'rgba(200,140,80,0.18)', color: 'rgba(150,80,20,0.65)'  },
};

export default function VentaDetalleModal({ venta, open, onClose }) {
    const [confirmandoAnular, setConfirmandoAnular] = useState(false);
    const [password, setPassword]                   = useState('');
    const [errorPassword, setErrorPassword]         = useState('');
    const [procesando, setProcesando]               = useState(false);

    if (!venta) return null;

    const tipoStyle   = TIPO_STYLES[venta.tipo_venta]  ?? TIPO_STYLES.Contado;
    const estadoStyle = ESTADO_STYLES[venta.estado]    ?? ESTADO_STYLES.Cancelada;
    const yaAnulada   = venta.estado === 'Cancelada';

    const handleAnular = () => {
        if (!password.trim()) { setErrorPassword('Ingresa tu contraseña para confirmar.'); return; }
        setProcesando(true); setErrorPassword('');
        router.post(`/ventas/${venta.id}/anular`, { password }, {
            preserveScroll: true,
            onSuccess: () => { setProcesando(false); setConfirmandoAnular(false); setPassword(''); onClose(); },
            onError: (errs) => { setProcesando(false); setErrorPassword(errs.password || errs.error || 'Error al anular la venta.'); },
        });
    };

    const cerrarConfirmacion = () => { setConfirmandoAnular(false); setPassword(''); setErrorPassword(''); };

    return (
        <Transition appear show={open} as={Fragment}>
            {/* z-index 1100 > 1000 del navbar para que el overlay tape el nav */}
            <Dialog as="div" style={{ position: 'relative', zIndex: 1100 }} onClose={onClose}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                    .vdm-overlay {
                        position: fixed; inset: 0;
                        background: rgba(20,8,0,0.22); backdrop-filter: blur(6px);
                    }

                    /*
                     * CORRECCIÓN 1 — Espaciado del contenedor:
                     * align-items: flex-start + padding-top: 80px evita que el panel
                     * quede oculto bajo el navbar sticky (altura ~64px).
                     * En pantallas grandes el panel se ve con aire natural arriba.
                     */
                    .vdm-wrap {
                        position: fixed; inset: 0;
                        overflow-y: auto;
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        padding: 80px 1rem 2rem;
                    }

                    @media (min-width: 768px) {
                        .vdm-wrap {
                            padding: 88px 1.5rem 2rem;
                        }
                    }

                    .vdm-panel {
                        width: 100%; max-width: 760px;
                        background: rgba(253,248,244,0.98); backdrop-filter: blur(40px);
                        border: 1px solid rgba(200,140,80,0.18); border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(180,90,20,0.14);
                        overflow: hidden; font-family: 'Inter',-apple-system,sans-serif;
                        margin-bottom: 1rem;
                    }

                    /* Header */
                    .vdm-header {
                        padding: 1.5rem 1.75rem 1.25rem;
                        border-bottom: 1px solid rgba(200,140,80,0.1);
                        display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
                        background: rgba(255,255,255,0.35);
                    }
                    .vdm-close {
                        width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0;
                        background: rgba(200,140,80,0.07); border: 1px solid rgba(200,140,80,0.15);
                        display: flex; align-items: center; justify-content: center;
                        cursor: pointer; transition: all 0.13s;
                    }
                    .vdm-close:hover { background: rgba(200,140,80,0.15); border-color: rgba(200,140,80,0.3); }

                    /* Body */
                    .vdm-body { padding: 1.5rem 1.75rem; }

                    /* Info grid */
                    .vdm-info-grid {
                        display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;
                        margin-bottom: 1.25rem;
                    }
                    .vdm-info-box {
                        padding: 1rem 1.1rem; border-radius: 12px;
                        background: rgba(255,255,255,0.5); border: 1px solid rgba(200,140,80,0.1);
                    }
                    .vdm-info-label {
                        font-size: 0.63rem; font-weight: 600; color: rgba(150,80,20,0.45);
                        text-transform: uppercase; letter-spacing: 0.09em; margin: 0 0 0.35rem;
                    }

                    /* Financial summary */
                    .vdm-fin {
                        display: grid; grid-template-columns: repeat(4,1fr); gap: 0.75rem;
                        padding: 1.1rem 1.25rem; border-radius: 12px;
                        background: rgba(255,255,255,0.45); border: 1px solid rgba(200,140,80,0.1);
                        margin-bottom: 1.25rem;
                    }
                    .vdm-fin-label {
                        font-size: 0.63rem; font-weight: 600; color: rgba(150,80,20,0.45);
                        text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.25rem;
                    }
                    .vdm-fin-val {
                        font-size: 1.15rem; font-weight: 600; color: #2d1a08;
                        letter-spacing: -0.03em; margin: 0;
                    }

                    /* Section label */
                    .vdm-section-label {
                        font-size: 0.64rem; font-weight: 600; color: rgba(150,80,20,0.45);
                        text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.65rem;
                    }

                    /*
                     * CORRECCIÓN 2 — Tabla con scroll horizontal:
                     * overflow-x: auto + min-width en la tabla permiten deslizar
                     * lateralmente en móvil sin romper el layout.
                     */
                    .vdm-table-wrap {
                        border: 1px solid rgba(200,140,80,0.1); border-radius: 11px;
                        overflow-x: auto;
                        overflow-y: visible;
                        -webkit-overflow-scrolling: touch;
                        margin-bottom: 1.25rem;
                        /* Scrollbar delgada y sutil */
                        scrollbar-width: thin;
                        scrollbar-color: rgba(200,140,80,0.3) transparent;
                    }
                    .vdm-table-wrap::-webkit-scrollbar { height: 3px; }
                    .vdm-table-wrap::-webkit-scrollbar-track { background: transparent; }
                    .vdm-table-wrap::-webkit-scrollbar-thumb {
                        background: rgba(200,140,80,0.3); border-radius: 3px;
                    }

                    .vdm-table {
                        width: 100%;
                        min-width: 440px; /* evita que las columnas se aplasten */
                        border-collapse: collapse;
                    }
                    .vdm-table thead tr {
                        border-bottom: 1px solid rgba(200,140,80,0.1);
                        background: rgba(255,255,255,0.5);
                    }
                    .vdm-table th {
                        padding: 0.65rem 0.875rem; font-size: 0.63rem; font-weight: 600;
                        color: rgba(150,80,20,0.5); text-transform: uppercase;
                        letter-spacing: 0.08em; white-space: nowrap;
                    }
                    .vdm-table td {
                        padding: 0.75rem 0.875rem; font-size: 0.82rem; color: #2d1a08;
                        border-bottom: 1px solid rgba(200,140,80,0.07); vertical-align: middle;
                    }
                    .vdm-table tbody tr:last-child td { border-bottom: none; }
                    .vdm-table tbody tr { background: rgba(255,255,255,0.3); transition: background 0.12s; }
                    .vdm-table tbody tr:hover { background: rgba(255,255,255,0.65); }

                    /* Badge */
                    .vdm-badge {
                        display: inline-flex; padding: 0.2rem 0.6rem; border-radius: 5px;
                        font-size: 0.71rem; font-weight: 500; letter-spacing: 0.01em;
                    }

                    /* Alert */
                    .vdm-alert-red {
                        padding: 1rem 1.1rem; border-radius: 11px;
                        background: rgba(220,38,38,0.04); border: 1px solid rgba(220,38,38,0.15);
                        margin-bottom: 1.25rem;
                    }
                    .vdm-pw-input {
                        width: 100%; padding: 0.65rem 0.875rem;
                        background: rgba(255,255,255,0.7); border: 1px solid rgba(185,28,28,0.25);
                        border-radius: 9px; font-size: 0.84rem; color: #2d1a08;
                        font-family: 'Inter',sans-serif; outline: none; transition: all 0.15s;
                        letter-spacing: 0.05em; box-sizing: border-box;
                    }
                    .vdm-pw-input:focus {
                        border-color: rgba(185,28,28,0.45);
                        box-shadow: 0 0 0 3px rgba(185,28,28,0.06);
                    }

                    /* Footer */
                    .vdm-footer {
                        display: flex; align-items: center; justify-content: space-between;
                        gap: 1rem; flex-wrap: wrap;
                        padding: 1rem 1.75rem 1.5rem;
                        border-top: 1px solid rgba(200,140,80,0.1);
                    }
                    .vdm-btn {
                        display: inline-flex; align-items: center; gap: 0.4rem;
                        padding: 0.6rem 1.1rem; border-radius: 9px;
                        font-size: 0.8rem; font-weight: 500; font-family: 'Inter',sans-serif;
                        cursor: pointer; transition: all 0.14s; letter-spacing: -0.01em;
                        border: none; white-space: nowrap;
                    }
                    .vdm-btn-ghost {
                        background: rgba(255,255,255,0.5); border: 1px solid rgba(200,140,80,0.18);
                        color: rgba(120,60,10,0.7);
                    }
                    .vdm-btn-ghost:hover { background: rgba(255,255,255,0.85); border-color: rgba(200,140,80,0.3); }
                    .vdm-btn-danger {
                        background: rgba(220,38,38,0.05); border: 1px solid rgba(220,38,38,0.2);
                        color: rgba(185,28,28,0.85);
                    }
                    .vdm-btn-danger:hover { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.35); }
                    .vdm-btn-danger-solid {
                        background: rgba(185,28,28,0.88); color: white; border: 1px solid rgba(185,28,28,0.7);
                    }
                    .vdm-btn-danger-solid:hover:not(:disabled) { background: rgba(185,28,28,1); }
                    .vdm-btn-danger-solid:disabled { opacity: 0.45; cursor: not-allowed; }
                    .vdm-btn-primary {
                        background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                        color: rgba(185,28,28,0.9);
                    }
                    .vdm-btn-primary:hover { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }
                    .vdm-btn-disabled { opacity: 0.5; cursor: default; pointer-events: none; }

                    /* Divider */
                    .vdm-divider { border: none; border-top: 1px solid rgba(200,140,80,0.1); margin: 1.1rem 0; }

                    /* Hint de scroll — oculto en desktop, visible en móvil */
                    .vdm-scroll-hint { display: none; }

                    /* ── RESPONSIVE MÓVIL ── */
                    @media (max-width: 600px) {
                        .vdm-panel { border-radius: 16px; }

                        .vdm-header { padding: 1.1rem 1.25rem 1rem; }
                        .vdm-body   { padding: 1.1rem 1.25rem; }

                        /* Una columna en info */
                        .vdm-info-grid { grid-template-columns: 1fr; }

                        /* Dos columnas en financiero */
                        .vdm-fin {
                            grid-template-columns: 1fr 1fr;
                            gap: 0.65rem; padding: 0.875rem 1rem;
                        }
                        .vdm-fin-val { font-size: 0.95rem; }

                        /* Mostrar hint de scroll */
                        .vdm-scroll-hint { display: flex; }

                        /* Padding menor en celdas */
                        .vdm-table th { padding: 0.55rem 0.7rem; font-size: 0.6rem; }
                        .vdm-table td { padding: 0.65rem 0.7rem; font-size: 0.79rem; }

                        /* Footer apilado */
                        .vdm-footer {
                            padding: 0.875rem 1.25rem 1.25rem;
                            flex-direction: column-reverse; align-items: stretch;
                        }
                        .vdm-footer > * { width: 100%; justify-content: center; }
                        .vdm-footer-left { display: flex; gap: 0.5rem; }
                        .vdm-footer-left .vdm-btn { flex: 1; justify-content: center; }
                    }

                    /* ── ESTILOS DE IMPRESIÓN ── */
                    @media print {
                        body * { visibility: hidden; }
                        .vdm-printable, .vdm-printable * { visibility: visible; }
                        .vdm-printable {
                            position: fixed; inset: 0;
                            padding: 2.5rem 3rem;
                            background: white !important;
                            font-family: 'Inter', sans-serif;
                        }
                        .vdm-no-print  { display: none !important; }
                        .vdm-scroll-hint { display: none !important; }
                        .vdm-panel {
                            border: none !important; box-shadow: none !important;
                            background: white !important; border-radius: 0 !important;
                        }
                        .vdm-header {
                            border-bottom: 1.5px solid #d4a062 !important;
                            background: transparent !important;
                            padding: 0 0 1rem !important; margin-bottom: 1.5rem;
                        }
                        .vdm-info-box, .vdm-fin, .vdm-table-wrap {
                            border: 1px solid #e8d5b8 !important; background: transparent !important;
                        }
                        .vdm-table-wrap { overflow: visible !important; }
                        .vdm-table     { min-width: unset !important; }
                        .vdm-table thead tr { background: #fdf6f0 !important; }
                        .vdm-table tbody tr:hover { background: transparent !important; }
                        .vdm-footer    { display: none !important; }
                        .vdm-alert-red { display: none !important; }
                        .vdm-badge     { border: 1px solid currentColor !important; }
                    }
                `}</style>

                {/* Backdrop */}
                <Transition.Child as={Fragment}
                                  enter="ease-out duration-250" enterFrom="opacity-0" enterTo="opacity-100"
                                  leave="ease-in duration-180"  leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="vdm-overlay"/>
                </Transition.Child>

                <div className="vdm-wrap">
                    <Transition.Child as={Fragment}
                                      enter="ease-out duration-280" enterFrom="opacity-0 scale-[0.97]" enterTo="opacity-100 scale-100"
                                      leave="ease-in duration-180"  leaveFrom="opacity-100 scale-100"  leaveTo="opacity-0 scale-[0.97]">

                        <Dialog.Panel className="vdm-panel vdm-printable">

                            {/* ── Header ── */}
                            <div className="vdm-header">
                                <div>
                                    <p style={{fontSize:'0.63rem',fontWeight:'600',color:'rgba(150,80,20,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',margin:'0 0 0.3rem'}}>
                                        Comprobante de venta
                                    </p>
                                    <Dialog.Title style={{fontSize:'clamp(1rem,3vw,1.3rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',margin:'0 0 0.25rem',lineHeight:1.1}}>
                                        {venta.numero_venta}
                                    </Dialog.Title>
                                    <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                        {formatDate(venta.created_at)}
                                    </p>
                                </div>
                                <button onClick={onClose} className="vdm-close vdm-no-print">
                                    <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.5)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>

                            {/* ── Body ── */}
                            <div className="vdm-body">

                                {/* Info general */}
                                <div className="vdm-info-grid">
                                    {/* Cliente */}
                                    <div className="vdm-info-box">
                                        <p className="vdm-info-label">Cliente</p>
                                        <p style={{fontSize:'0.92rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.3rem',letterSpacing:'-0.02em'}}>
                                            {venta.cliente?.nombre || 'Cliente general'}
                                        </p>
                                        {venta.cliente?.telefono && (
                                            <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.6)',margin:'0 0 0.1rem'}}>
                                                Tel: {venta.cliente.telefono}
                                            </p>
                                        )}
                                        {venta.cliente?.documento && (
                                            <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.6)',margin:0}}>
                                                Doc: {venta.cliente.documento}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tipo y estado */}
                                    <div className="vdm-info-box">
                                        <p className="vdm-info-label">Tipo de venta</p>
                                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap'}}>
                                            <span className="vdm-badge" style={{
                                                background: tipoStyle.bg,
                                                border: `1px solid ${tipoStyle.border}`,
                                                color: tipoStyle.color,
                                                fontSize:'0.78rem',padding:'0.25rem 0.7rem',
                                            }}>
                                                {venta.tipo_venta || 'Contado'}
                                            </span>
                                            <span className="vdm-badge" style={{
                                                background: estadoStyle.bg,
                                                border: `1px solid ${estadoStyle.border}`,
                                                color: estadoStyle.color,
                                            }}>
                                                {venta.estado}
                                            </span>
                                        </div>
                                        {venta.fecha_limite && (
                                            <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:'0.5rem 0 0'}}>
                                                Fecha límite: {venta.fecha_limite}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Resumen financiero */}
                                <div className="vdm-fin">
                                    <div className="vdm-fin-item">
                                        <p className="vdm-fin-label">Total</p>
                                        <p className="vdm-fin-val">{formatCurrency(venta.total)}</p>
                                    </div>
                                    <div className="vdm-fin-item">
                                        <p className="vdm-fin-label" style={{color:'rgba(4,120,87,0.6)'}}>Pagado</p>
                                        <p className="vdm-fin-val" style={{color:'rgba(4,120,87,0.85)'}}>{formatCurrency(venta.pagado)}</p>
                                    </div>
                                    <div className="vdm-fin-item">
                                        <p className="vdm-fin-label" style={{color:'rgba(185,28,28,0.55)'}}>Saldo pendiente</p>
                                        <p className="vdm-fin-val" style={{color:'rgba(185,28,28,0.85)'}}>{formatCurrency(venta.saldo_pendiente || 0)}</p>
                                    </div>
                                    <div className="vdm-fin-item">
                                        <p className="vdm-fin-label">Forma de pago</p>
                                        <p className="vdm-fin-val" style={{fontSize:'0.88rem'}}>
                                            {venta.tipo_venta === 'Contado'
                                                ? (venta.metodo_pago || venta.forma_pago || 'Efectivo')
                                                : venta.tipo_venta}
                                        </p>
                                    </div>
                                </div>

                                {/* Productos */}
                                <p className="vdm-section-label">Productos</p>

                                {/* Hint de scroll (solo visible en móvil) */}
                                <div
                                    className="vdm-scroll-hint"
                                    style={{
                                        alignItems: 'center', gap: '0.35rem',
                                        marginBottom: '0.45rem',
                                        fontSize: '0.65rem', fontWeight: 500,
                                        color: 'rgba(150,80,20,0.45)',
                                    }}
                                >
                                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m-12 0l4 4m-4-4l4-4"/>
                                    </svg>
                                    Desliza para ver la tabla completa
                                </div>

                                <div className="vdm-table-wrap">
                                    <table className="vdm-table">
                                        <thead>
                                        <tr>
                                            <th style={{textAlign:'left'}}>Descripción</th>
                                            <th style={{textAlign:'center'}}>Cant.</th>
                                            <th style={{textAlign:'right'}}>Precio unit.</th>
                                            <th style={{textAlign:'right'}}>Subtotal</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {venta.detalles && venta.detalles.length > 0 ? (
                                            venta.detalles.map((d, i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <p style={{fontWeight:'500',color:'#2d1a08',margin:'0 0 0.1rem',letterSpacing:'-0.01em'}}>
                                                            {d.producto?.nombre || 'Producto'}
                                                        </p>
                                                        {d.producto?.codigo_barras && (
                                                            <p style={{fontSize:'0.68rem',color:'rgba(150,80,20,0.45)',margin:0}}>
                                                                Ref: {d.producto.codigo_barras}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td style={{textAlign:'center',fontWeight:'600'}}>{d.cantidad}</td>
                                                    <td style={{textAlign:'right',color:'rgba(100,50,10,0.75)',whiteSpace:'nowrap'}}>{formatCurrency(d.precio_unitario)}</td>
                                                    <td style={{textAlign:'right',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.01em',whiteSpace:'nowrap'}}>{formatCurrency(d.subtotal)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} style={{textAlign:'center',padding:'2rem',color:'rgba(150,80,20,0.45)',fontSize:'0.8rem'}}>
                                                    Sin productos registrados
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totales al pie de tabla */}
                                <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'1.25rem'}}>
                                    <div style={{width:'240px'}}>
                                        {parseFloat(venta.descuento || 0) > 0 && (
                                            <div style={{display:'flex',justifyContent:'space-between',padding:'0.3rem 0',fontSize:'0.78rem',color:'rgba(150,80,20,0.55)'}}>
                                                <span>Descuento</span>
                                                <span>- {formatCurrency(venta.descuento)}</span>
                                            </div>
                                        )}
                                        <div style={{
                                            display:'flex',justifyContent:'space-between',alignItems:'center',
                                            padding:'0.55rem 0',borderTop:'1px solid rgba(200,140,80,0.12)',
                                            marginTop:'0.2rem',
                                        }}>
                                            <span style={{fontSize:'0.8rem',fontWeight:'600',color:'rgba(120,60,10,0.7)',textTransform:'uppercase',letterSpacing:'0.04em'}}>Total</span>
                                            <span style={{fontSize:'1.15rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.03em'}}>{formatCurrency(venta.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Historial de abonos */}
                                {(venta.tipo_venta === 'Separado' || venta.tipo_venta === 'Crédito') && venta.abonos && venta.abonos.length > 0 && (
                                    <>
                                        <hr className="vdm-divider"/>
                                        <p className="vdm-section-label">Historial de abonos</p>
                                        <div className="vdm-table-wrap">
                                            <table className="vdm-table" style={{minWidth:'380px'}}>
                                                <thead>
                                                <tr>
                                                    <th style={{textAlign:'left'}}>Fecha</th>
                                                    <th style={{textAlign:'left'}}>Forma de pago</th>
                                                    <th style={{textAlign:'right'}}>Monto</th>
                                                    <th style={{textAlign:'left'}}>Registrado por</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {venta.abonos.map((a, i) => (
                                                    <tr key={i}>
                                                        <td style={{color:'rgba(100,50,10,0.7)',whiteSpace:'nowrap'}}>{formatDate(a.created_at)}</td>
                                                        <td>{a.forma_pago}</td>
                                                        <td style={{textAlign:'right',fontWeight:'600',color:'rgba(4,120,87,0.85)',letterSpacing:'-0.01em',whiteSpace:'nowrap'}}>{formatCurrency(a.monto)}</td>
                                                        <td style={{color:'rgba(150,80,20,0.6)'}}>{a.empleado?.name || '—'}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {/* Notas */}
                                {venta.notas && (
                                    <>
                                        <hr className="vdm-divider"/>
                                        <p className="vdm-section-label">Observaciones</p>
                                        <p style={{fontSize:'0.8rem',color:'rgba(120,60,10,0.65)',lineHeight:'1.6',margin:0,padding:'0.5rem 0.75rem',background:'rgba(255,255,255,0.45)',border:'1px solid rgba(200,140,80,0.1)',borderRadius:'8px'}}>
                                            {venta.notas}
                                        </p>
                                    </>
                                )}

                                {/* Panel de confirmación de anulación */}
                                {confirmandoAnular && (
                                    <div className="vdm-alert-red vdm-no-print" style={{marginTop:'1.25rem'}}>
                                        <p style={{fontSize:'0.8rem',fontWeight:'500',color:'rgba(185,28,28,0.9)',margin:'0 0 0.25rem',letterSpacing:'-0.01em'}}>
                                            Confirmar anulación de {venta.numero_venta}
                                        </p>
                                        <p style={{fontSize:'0.75rem',color:'rgba(185,28,28,0.7)',margin:'0 0 0.875rem',lineHeight:'1.5'}}>
                                            El estado cambiará a <strong>Cancelada</strong> y se restaurará el stock de {venta.detalles?.length ?? 0} producto(s). Esta acción no se puede deshacer.
                                        </p>
                                        <label style={{display:'block',fontSize:'0.63rem',fontWeight:'600',color:'rgba(185,28,28,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.4rem'}}>
                                            Confirma con tu contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setErrorPassword(''); }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAnular()}
                                            placeholder="••••••••"
                                            autoFocus
                                            className="vdm-pw-input"
                                            style={{marginBottom:'0.4rem'}}
                                        />
                                        {errorPassword && (
                                            <p style={{fontSize:'0.72rem',color:'rgba(185,28,28,0.85)',margin:'0.25rem 0 0.75rem',fontWeight:'500'}}>
                                                {errorPassword}
                                            </p>
                                        )}
                                        <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem'}}>
                                            <button type="button" onClick={cerrarConfirmacion} disabled={procesando}
                                                    className="vdm-btn vdm-btn-ghost" style={{flex:1,justifyContent:'center'}}>
                                                Cancelar
                                            </button>
                                            <button type="button" onClick={handleAnular}
                                                    disabled={procesando || !password.trim()}
                                                    className="vdm-btn vdm-btn-danger-solid" style={{flex:1,justifyContent:'center'}}>
                                                {procesando ? (
                                                    <>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{animation:'spin 0.8s linear infinite',flexShrink:0}}>
                                                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                                                            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                                                        </svg>
                                                        Anulando...
                                                    </>
                                                ) : 'Confirmar anulación'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Footer ── */}
                            <div className="vdm-footer vdm-no-print">
                                <div className="vdm-footer-left" style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                                    {/* Imprimir */}
                                    <button onClick={() => window.print()} className="vdm-btn vdm-btn-ghost">
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                                        </svg>
                                        Imprimir
                                    </button>

                                    {/* Anular */}
                                    {!yaAnulada ? (
                                        <button
                                            onClick={() => confirmandoAnular ? cerrarConfirmacion() : setConfirmandoAnular(true)}
                                            className={`vdm-btn ${confirmandoAnular ? 'vdm-btn-ghost' : 'vdm-btn-danger'}`}>
                                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                            </svg>
                                            {confirmandoAnular ? 'Cancelar acción' : 'Anular venta'}
                                        </button>
                                    ) : (
                                        <span className="vdm-btn vdm-btn-disabled vdm-btn-ghost" style={{color:'rgba(150,80,20,0.35)'}}>
                                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                            </svg>
                                            Venta anulada
                                        </span>
                                    )}
                                </div>

                                <button onClick={onClose} className="vdm-btn vdm-btn-primary">
                                    Cerrar
                                </button>
                            </div>

                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
