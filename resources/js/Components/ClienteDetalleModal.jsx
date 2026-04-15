import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const PER_PAGE = 8;

const GLASS_BG = [
    'radial-gradient(ellipse 75% 60% at 0% 0%,   rgba(255,210,170,0.22) 0%, transparent 55%)',
    'radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%, transparent 55%)',
    'radial-gradient(ellipse 55% 50% at 75% 10%,  rgba(255,215,175,0.16) 0%, transparent 55%)',
    'linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)',
].join(',');

export default function ClienteDetalleModal({ cliente, open, onClose }) {
    const [mobileTopPad, setMobileTopPad] = useState(12);
    const [ventaPage, setVentaPage]       = useState(1);

    // Reiniciar página cuando cambia el cliente o se abre el modal
    useEffect(() => { setVentaPage(1); }, [cliente?.id, open]);

    useEffect(() => {
        if (!open) return;
        const recalcTop = () => {
            const nav  = document.querySelector('.app-nav');
            const navH = nav ? nav.getBoundingClientRect().height : 56;
            setMobileTopPad(navH + 8);
        };
        recalcTop();
        window.addEventListener('resize', recalcTop);
        return () => window.removeEventListener('resize', recalcTop);
    }, [open]);

    if (!cliente) return null;

    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });

    // KPIs globales (todos los datos ya cargados)
    const ventas         = cliente.ventas ?? [];
    const totalCompras   = ventas.length;
    const totalGastado   = ventas.reduce((s, v) => s + parseFloat(v.total), 0);
    const saldoPendiente = ventas.reduce((s, v) => s + parseFloat(v.saldo_pendiente || 0), 0);
    const comprasSeparado = ventas.filter(v => v.tipo_venta === 'Separado').length;

    // Paginación cliente-side
    const totalPages   = Math.max(1, Math.ceil(ventas.length / PER_PAGE));
    const ventasPagina = ventas.slice((ventaPage - 1) * PER_PAGE, ventaPage * PER_PAGE);

    const TIPO_BADGE = {
        Contado:  { bg: 'rgba(16,185,129,0.09)',  border: 'rgba(16,185,129,0.28)',  color: 'rgba(4,120,87,0.9)'   },
        Separado: { bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.3)',   color: 'rgba(146,64,14,0.9)'  },
        Crédito:  { bg: 'rgba(59,130,246,0.09)',  border: 'rgba(59,130,246,0.28)',  color: 'rgba(30,64,175,0.9)'  },
        default:  { bg: 'rgba(180,90,20,0.07)',   border: 'rgba(180,90,20,0.2)',    color: 'rgba(120,60,10,0.75)' },
    };
    const ESTADO_BADGE = {
        Pagada:      { bg: 'rgba(16,185,129,0.09)',  border: 'rgba(16,185,129,0.28)',  color: 'rgba(4,120,87,0.9)'   },
        Completada:  { bg: 'rgba(16,185,129,0.09)',  border: 'rgba(16,185,129,0.28)',  color: 'rgba(4,120,87,0.9)'   },
        Pendiente:   { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)',   color: 'rgba(185,28,28,0.9)'  },
        Abonada:     { bg: 'rgba(245,158,11,0.09)',  border: 'rgba(245,158,11,0.3)',   color: 'rgba(146,64,14,0.9)'  },
        default:     { bg: 'rgba(180,90,20,0.07)',   border: 'rgba(180,90,20,0.2)',    color: 'rgba(120,60,10,0.75)' },
    };
    const tipoBadge   = (t) => TIPO_BADGE[t]   ?? TIPO_BADGE.default;
    const estadoBadge = (e) => ESTADO_BADGE[e]  ?? ESTADO_BADGE.default;

    const badge = (b) => ({
        display: 'inline-flex', alignItems: 'center',
        padding: '0.18rem 0.6rem', borderRadius: '20px',
        fontSize: '0.7rem', fontWeight: '600',
        background: b.bg, border: `1px solid ${b.border}`, color: b.color,
    });

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <style>{`
                    .cdm-panel {
                        width: 100%; max-width: 980px;
                        max-height: 90vh; overflow: hidden;
                        border-radius: 22px;
                        background: ${GLASS_BG};
                        border: 1px solid rgba(255,255,255,0.72);
                        box-shadow: 0 24px 64px rgba(180,90,20,.18), 0 8px 24px rgba(180,90,20,.09),
                                    inset 0 1.5px 0 rgba(255,255,255,0.9);
                        display: flex; flex-direction: column;
                    }
                    .cdm-head {
                        padding: 1.1rem 1.2rem;
                        border-bottom: 1px solid rgba(200,140,80,0.18);
                        display: flex; justify-content: space-between; gap: .8rem;
                        background: rgba(255,255,255,0.08);
                        backdrop-filter: blur(20px);
                    }
                    .cdm-body { padding: 1rem 1.2rem; overflow-y: auto; flex: 1; }
                    .cdm-grid {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0,1fr));
                        gap: .7rem; margin-bottom: 1rem;
                    }
                    .cdm-stat {
                        background: rgba(255,255,255,0.55);
                        border: 1px solid rgba(200,140,80,0.18);
                        border-radius: 14px; padding: .8rem;
                        box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
                    }
                    .cdm-list { display: flex; flex-direction: column; gap: .6rem; }
                    .cdm-item {
                        background: rgba(255,255,255,0.55);
                        border: 1px solid rgba(200,140,80,0.16);
                        border-radius: 14px; padding: .9rem;
                        box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
                    }
                    .cdm-sale-head {
                        display: flex; align-items: center;
                        justify-content: space-between; gap: .6rem;
                        margin-bottom: .7rem; flex-wrap: wrap;
                    }
                    .cdm-sale-meta { display: flex; align-items: center; gap: .45rem; flex-wrap: wrap; }
                    .cdm-sale-grid {
                        display: grid;
                        grid-template-columns: repeat(4, minmax(0,1fr));
                        gap: .65rem;
                    }
                    .cdm-footer {
                        padding: .85rem 1.2rem;
                        border-top: 1px solid rgba(200,140,80,0.16);
                        display: flex; align-items: center; justify-content: space-between;
                        background: rgba(255,255,255,0.06);
                        backdrop-filter: blur(10px);
                    }
                    .cdm-page-btn {
                        padding: .3rem .7rem; border-radius: 9px; font-size: .78rem; font-weight: 500;
                        cursor: pointer; border: 1px solid rgba(200,140,80,0.3);
                        background: rgba(255,255,255,0.55); color: rgba(120,60,10,0.75);
                        font-family: inherit; transition: all .13s;
                    }
                    .cdm-page-btn:hover:not(.active):not(:disabled) { background: rgba(180,90,20,0.09); }
                    .cdm-page-btn.active {
                        background: rgba(180,90,20,0.13); border-color: rgba(180,90,20,0.4);
                        color: rgba(120,60,10,0.9); font-weight: 600;
                    }
                    .cdm-page-btn:disabled { opacity: .38; cursor: default; }

                    @media (max-width: 900px) {
                        .cdm-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
                        .cdm-sale-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
                    }
                    @media (max-width: 640px) {
                        .cdm-panel { width: calc(100vw - 1rem); max-width: calc(100vw - 1rem); max-height: 78vh; border-radius: 16px; }
                        .cdm-head, .cdm-body, .cdm-footer { padding: .82rem; }
                        .cdm-grid { grid-template-columns: 1fr; }
                        .cdm-sale-grid { grid-template-columns: 1fr; }
                        .cdm-item { padding: .72rem; }
                    }
                `}</style>

                <Transition.Child as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200"  leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/35 backdrop-blur-[2px]" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-start sm:items-center justify-center p-2 sm:p-4"
                         style={{ paddingTop: `max(${mobileTopPad}px, 0.75rem)` }}>
                        <Transition.Child as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"  leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="cdm-panel">

                                {/* ── Cabecera ── */}
                                <div className="cdm-head">
                                    <div className="flex items-center min-w-0">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3"
                                             style={{ background:'rgba(180,90,20,0.1)', border:'1px solid rgba(200,140,80,0.25)' }}>
                                            <span className="font-bold text-xl" style={{ color:'rgba(150,70,10,0.85)' }}>
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <Dialog.Title style={{ fontSize:'1.15rem', fontWeight:'600', color:'#2d1a08', margin:0 }}>
                                                {cliente.nombre}
                                            </Dialog.Title>
                                            <p style={{ fontSize:'0.78rem', color:'rgba(150,80,20,0.55)', marginTop:'0.2rem' }}>
                                                {cliente.documento || 'Sin documento'} · {cliente.telefono || 'Sin teléfono'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} style={{ color:'rgba(150,80,20,0.5)', background:'none', border:'none', cursor:'pointer', padding:'4px' }}>
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* ── Cuerpo ── */}
                                <div className="cdm-body">

                                    {/* KPIs */}
                                    <div className="cdm-grid">
                                        {[
                                            { label: 'Total compras',    value: totalCompras,              isNum: true  },
                                            { label: 'Total gastado',    value: formatCurrency(totalGastado),isNum: false },
                                            { label: 'Separados',        value: comprasSeparado,           isNum: true  },
                                            { label: 'Saldo pendiente',  value: formatCurrency(saldoPendiente),isNum:false },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="cdm-stat">
                                                <p style={{ fontSize:'0.74rem', color:'rgba(150,80,20,0.55)', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
                                                <p style={{ fontSize:'1.45rem', fontWeight:'700', color:'#2d1a08', marginTop:'0.3rem', letterSpacing:'-0.03em' }}>{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Lista de ventas paginada */}
                                    <div className="cdm-list">
                                        {ventas.length > 0 ? (
                                            ventasPagina.map((venta) => (
                                                <div key={venta.id} className="cdm-item">
                                                    <div className="cdm-sale-head">
                                                        <div className="cdm-sale-meta">
                                                            <span style={{ fontSize:'0.85rem', fontWeight:'600', color:'#2d1a08' }}>
                                                                Venta #{venta.numero_venta}
                                                            </span>
                                                            <span style={badge(tipoBadge(venta.tipo_venta))}>{venta.tipo_venta}</span>
                                                            <span style={badge(estadoBadge(venta.estado))}>{venta.estado}</span>
                                                        </div>
                                                        <span style={{ fontSize:'0.75rem', color:'rgba(150,80,20,0.5)', whiteSpace:'nowrap' }}>
                                                            {formatDate(venta.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="cdm-sale-grid" style={{ fontSize:'0.83rem' }}>
                                                        <div>
                                                            <p style={{ color:'rgba(150,80,20,0.5)', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Total</p>
                                                            <p style={{ fontWeight:'600', color:'#2d1a08' }}>{formatCurrency(venta.total)}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ color:'rgba(150,80,20,0.5)', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Pagado</p>
                                                            <p style={{ fontWeight:'600', color:'rgba(4,120,87,0.85)' }}>{formatCurrency(venta.pagado)}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ color:'rgba(150,80,20,0.5)', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Saldo</p>
                                                            <p style={{ fontWeight:'600', color:'rgba(185,28,28,0.85)' }}>{formatCurrency(venta.saldo_pendiente || 0)}</p>
                                                        </div>
                                                        <div>
                                                            <p style={{ color:'rgba(150,80,20,0.5)', fontSize:'0.72rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>Forma de pago</p>
                                                            <p style={{ fontWeight:'600', color:'#2d1a08' }}>{venta.metodo_pago || venta.forma_pago || 'N/A'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Productos */}
                                                    {venta.detalles?.length > 0 && (
                                                        <div style={{ marginTop:'0.75rem', paddingTop:'0.65rem', borderTop:'1px solid rgba(200,140,80,0.14)' }}>
                                                            <p style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.4rem' }}>Productos</p>
                                                            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
                                                                {venta.detalles.map((d, i) => (
                                                                    <span key={i} style={{
                                                                        fontSize:'0.72rem', padding:'0.2rem 0.6rem', borderRadius:'8px',
                                                                        background:'rgba(255,255,255,0.7)', border:'1px solid rgba(200,140,80,0.2)',
                                                                        color:'rgba(80,40,8,0.78)',
                                                                    }}>
                                                                        {d.producto?.nombre || 'Producto'} ({d.cantidad})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Abonos */}
                                                    {venta.abonos?.length > 0 && (
                                                        <div style={{ marginTop:'0.65rem', paddingTop:'0.65rem', borderTop:'1px solid rgba(200,140,80,0.14)' }}>
                                                            <p style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.45)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.4rem' }}>Historial de abonos</p>
                                                            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
                                                                {venta.abonos.map((a, i) => (
                                                                    <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem' }}>
                                                                        <span style={{ color:'rgba(120,60,10,0.6)' }}>{formatDate(a.created_at)}</span>
                                                                        <span style={{ fontWeight:'600', color:'rgba(4,120,87,0.85)' }}>{formatCurrency(a.monto)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
                                                <div style={{
                                                    width:'52px', height:'52px', borderRadius:'16px', margin:'0 auto 1rem',
                                                    background:'rgba(180,90,20,0.07)', border:'1px solid rgba(180,90,20,0.15)',
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                }}>
                                                    <svg width="22" height="22" fill="none" stroke="rgba(150,80,20,0.4)" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <p style={{ fontSize:'0.92rem', fontWeight:'600', color:'#2d1a08' }}>Sin historial de compras</p>
                                                <p style={{ fontSize:'0.8rem', color:'rgba(150,80,20,0.5)', marginTop:'0.3rem' }}>Este cliente aún no ha realizado ninguna compra</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Footer con paginación ── */}
                                <div className="cdm-footer">
                                    {totalPages > 1 ? (
                                        <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', flexWrap:'wrap' }}>
                                            <button className="cdm-page-btn" disabled={ventaPage === 1}
                                                    onClick={() => setVentaPage(p => p - 1)}>← Ant</button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                                <button key={p}
                                                        className={`cdm-page-btn${p === ventaPage ? ' active' : ''}`}
                                                        onClick={() => setVentaPage(p)}>
                                                    {p}
                                                </button>
                                            ))}

                                            <button className="cdm-page-btn" disabled={ventaPage === totalPages}
                                                    onClick={() => setVentaPage(p => p + 1)}>Sig →</button>

                                            <span style={{ fontSize:'0.75rem', color:'rgba(150,80,20,0.5)', marginLeft:'0.5rem' }}>
                                                {(ventaPage - 1) * PER_PAGE + 1}–{Math.min(ventaPage * PER_PAGE, ventas.length)} de {ventas.length}
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize:'0.78rem', color:'rgba(150,80,20,0.45)' }}>
                                            {ventas.length} factura{ventas.length !== 1 ? 's' : ''}
                                        </span>
                                    )}

                                    <button onClick={onClose} style={{
                                        padding:'.55rem 1.1rem', borderRadius:'10px',
                                        background:'rgba(255,255,255,0.65)', border:'1px solid rgba(200,140,80,0.25)',
                                        color:'rgba(120,60,10,0.8)', cursor:'pointer', fontSize:'0.85rem', fontWeight:'500',
                                    }}>
                                        Cerrar
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
