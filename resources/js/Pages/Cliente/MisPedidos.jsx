// resources/js/Pages/Cliente/MisPedidos.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const imgSrc = (imagen) => {
    if (!imagen) return null;
    if (imagen.startsWith('http')) return imagen;
    return `/storage/${imagen}`;
};

const ESTADO_STYLES = {
    revision:    { bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.22)',  color:'rgba(146,64,14,0.9)',  label:'En revisión'    },
    aprobado:    { bg:'rgba(59,130,246,0.07)',  border:'rgba(59,130,246,0.2)',   color:'rgba(29,78,216,0.9)',  label:'Aprobado'       },
    envio_curso: { bg:'rgba(139,92,246,0.07)',  border:'rgba(139,92,246,0.2)',   color:'rgba(109,40,217,0.9)', label:'Envío en curso' },
    entregado:   { bg:'rgba(16,185,129,0.07)',  border:'rgba(16,185,129,0.2)',   color:'rgba(4,120,87,0.9)',   label:'Entregado'      },
    rechazado:   { bg:'rgba(220,38,38,0.06)',   border:'rgba(220,38,38,0.18)',   color:'rgba(185,28,28,0.9)',  label:'Rechazado'      },
    cancelado:   { bg:'rgba(200,140,80,0.06)',  border:'rgba(200,140,80,0.18)', color:'rgba(150,80,20,0.7)',  label:'Cancelado'      },
};

export default function MisPedidos({ pedidos, contacto }) {
    const { flash } = usePage().props;
    const [confirmando, setConfirmando] = useState(null);
    const [processing, setProcessing]  = useState(false);
    const [expandido, setExpandido]    = useState(null);

    // El paginador de Laravel envía formato plano: { data, total, last_page, prev_page_url, next_page_url, links[] }
    const lista        = pedidos.data ?? [];
    const totalPedidos = pedidos.total ?? lista.length;
    const lastPage     = pedidos.last_page ?? 1;
    const prevUrl      = pedidos.prev_page_url ?? null;
    const nextUrl      = pedidos.next_page_url ?? null;
    const pageLinks    = pedidos.links ?? [];   // array de {url, label, active}

    const goToPage = (url) => {
        if (url) router.get(url, {}, { preserveScroll: false });
    };

    const telefonos = [contacto?.telefono1, contacto?.telefono2].filter(Boolean);
    const correos   = [contacto?.correo1,   contacto?.correo2].filter(Boolean);

    const confirmarEntrega = (pedidoId) => {
        setProcessing(true);
        router.patch(`/cliente/pedidos/${pedidoId}/confirmar-entrega`, {}, {
            preserveScroll: true,
            onFinish: () => { setProcessing(false); setConfirmando(null); },
        });
    };

    return (
        <ClienteLayout>
            <Head title="Mis pedidos — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .mp-wrap { max-width:860px; margin:0 auto; padding:2rem 1.25rem 4rem; }

                .pedido-card {
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px; overflow: hidden; margin-bottom: 0.65rem;
                    transition: border-color 0.13s;
                }
                .pedido-card:hover { border-color: rgba(200,140,80,0.22); }
                .pedido-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1rem 1.1rem; cursor: pointer; gap: 0.75rem;
                }
                .pedido-header:hover { background: rgba(255,255,255,0.3); }

                .pedido-left {
                    display: flex; align-items: center; gap: 0.75rem;
                    flex: 1; min-width: 0; flex-wrap: wrap;
                }
                .pedido-right {
                    display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;
                }

                .btn-confirm {
                    padding: 0.55rem 1rem; border-radius: 8px; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 500;
                    transition: all 0.15s; white-space: nowrap;
                    background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.22);
                    color: rgba(4,120,87,0.9); letter-spacing: -0.01em;
                }
                .btn-confirm:hover:not(:disabled) { background: rgba(16,185,129,0.14); }
                .btn-confirm:disabled { opacity:0.5; cursor:not-allowed; }

                .modal-overlay {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(20,8,0,0.2); backdrop-filter: blur(4px);
                    display: flex; align-items: center; justify-content: center; padding: 1rem;
                }
                .modal-card {
                    width: 100%; max-width: 360px;
                    background: rgba(253,248,244,0.98); backdrop-filter: blur(40px);
                    border: 1px solid rgba(200,140,80,0.18); border-radius: 18px; padding: 1.75rem;
                    box-shadow: 0 16px 48px rgba(180,90,20,0.12);
                }
                .alert-ok {
                    padding: 0.7rem 0.9rem; border-radius: 9px; margin-bottom: 1.25rem;
                    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2);
                    font-size: 0.8rem; color: rgba(4,120,87,0.9);
                }

                @media (max-width: 640px) {
                    .mp-wrap { padding: 1.5rem 1rem 3rem; }
                    .pedido-header { padding: 0.875rem 1rem; }
                    .pedido-right .precio { display: none; }
                }
                @media (max-width: 420px) {
                    .pedido-left { flex-direction: column; align-items: flex-start; gap: 0.4rem; }
                }
                .mp-pagination { display:flex; align-items:center; justify-content:center; gap:0.35rem; flex-wrap:wrap; margin-top:1.75rem; }
                .mp-page-btn {
                    min-width:2.2rem; height:2.2rem; padding:0 0.6rem;
                    border-radius:8px; border:1px solid rgba(200,140,80,0.2);
                    background:rgba(255,255,255,0.5); color:rgba(100,50,10,0.7);
                    font-size:0.78rem; font-weight:500; cursor:pointer;
                    display:inline-flex; align-items:center; justify-content:center;
                    font-family:'Inter',sans-serif; transition:all 0.15s; white-space:nowrap;
                }
                .mp-page-btn:hover:not(:disabled) { background:rgba(255,255,255,0.8); border-color:rgba(200,140,80,0.4); color:#2d1a08; }
                .mp-page-btn.active { background:rgba(180,90,20,0.85); border-color:transparent; color:#fff; cursor:default; }
                .mp-page-btn:disabled { opacity:0.35; cursor:default; }
            `}</style>

            <div className="mp-wrap">

                <div style={{marginBottom:'1.75rem',animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',
                        letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.35rem'}}>
                        Mi cuenta
                    </p>
                    <h1 style={{fontSize:'clamp(1.4rem,3vw,1.75rem)',fontWeight:'300',color:'#2d1a08',
                        letterSpacing:'-0.04em',marginBottom:'0.25rem'}}>
                        Mis pedidos
                    </h1>
                    <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.5)'}}>
                        {totalPedidos} {totalPedidos===1?'pedido':'pedidos'} en total
                    </p>
                </div>

                {flash?.success && <div className="alert-ok">{flash.success}</div>}

                {lista.length === 0 ? (
                    <div style={{
                        textAlign:'center',padding:'3.5rem 0',
                        background:'rgba(255,255,255,0.45)',borderRadius:'14px',
                        border:'1px solid rgba(200,140,80,0.12)',
                    }}>
                        <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.45)',marginBottom:'1.1rem'}}>
                            No tienes pedidos aún
                        </p>
                        <a href="/catalogo" style={{
                            display:'inline-block',padding:'0.6rem 1.1rem',borderRadius:'8px',
                            background:'rgba(185,28,28,0.07)',border:'1px solid rgba(185,28,28,0.18)',
                            color:'rgba(185,28,28,0.85)',textDecoration:'none',fontSize:'0.82rem',fontWeight:'500',
                        }}>
                            Ir al catálogo
                        </a>
                    </div>
                ) : lista.map((pedido, idx) => {
                    const st      = ESTADO_STYLES[pedido.estado] || ESTADO_STYLES.revision;
                    const abierto = expandido === pedido.id;
                    return (
                        <div key={pedido.id} className="pedido-card"
                             style={{animation:`slideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${Math.min(idx*0.05,0.2)}s both`}}>

                            <div className="pedido-header" onClick={() => setExpandido(abierto ? null : pedido.id)}>
                                <div className="pedido-left">
                                    <div>
                                        <p style={{fontSize:'0.85rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.15rem',letterSpacing:'-0.01em'}}>
                                            {pedido.numero_pedido}
                                        </p>
                                        <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                            {pedido.created_at} · {pedido.metodo_pago}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding:'0.18rem 0.55rem',borderRadius:'5px',
                                        fontSize:'0.69rem',fontWeight:'500',
                                        background:st.bg,border:`1px solid ${st.border}`,color:st.color,
                                        whiteSpace:'nowrap',flexShrink:0,
                                    }}>
                                        {st.label}
                                    </span>
                                </div>
                                <div className="pedido-right">
                                    <span className="precio" style={{fontSize:'0.9rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em'}}>
                                        {formatCOP(pedido.total)}
                                    </span>
                                    <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.38)" strokeWidth="1.8" viewBox="0 0 24 24"
                                         style={{transition:'transform 0.18s',transform:abierto?'rotate(180deg)':'rotate(0)',flexShrink:0}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            {abierto && (
                                <div style={{padding:'0 1.1rem 1.1rem',borderTop:'1px solid rgba(200,140,80,0.08)'}}>

                                    {/* Total en móvil */}
                                    <div style={{padding:'0.6rem 0',borderBottom:'1px solid rgba(200,140,80,0.08)',marginBottom:'0.875rem',
                                        display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                        <span style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.5)'}}>Total</span>
                                        <span style={{fontSize:'0.95rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em'}}>
                                            {formatCOP(pedido.total)}
                                        </span>
                                    </div>

                                    <p style={{fontSize:'0.66rem',fontWeight:'600',color:'rgba(150,80,20,0.4)',
                                        textTransform:'uppercase',letterSpacing:'0.07em',margin:'0 0 0.65rem'}}>
                                        Productos
                                    </p>
                                    <div style={{display:'flex',flexDirection:'column',gap:'0.45rem',marginBottom:'1rem'}}>
                                        {pedido.items.map((item, i) => (
                                            <div key={i} style={{
                                                display:'flex',alignItems:'center',gap:'0.65rem',
                                                padding:'0.6rem',borderRadius:'9px',
                                                background:'rgba(255,255,255,0.4)',border:'1px solid rgba(200,140,80,0.08)',
                                            }}>
                                                {imgSrc(item.imagen)
                                                    ? <img src={imgSrc(item.imagen)} alt={item.nombre}
                                                           style={{width:'38px',height:'38px',borderRadius:'7px',objectFit:'cover',flexShrink:0}}/>
                                                    : <div style={{width:'38px',height:'38px',borderRadius:'7px',
                                                        background:'rgba(200,140,80,0.06)',border:'1px solid rgba(200,140,80,0.1)',
                                                        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                                        <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.28)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                            <rect x="3" y="3" width="18" height="18" rx="3"/><path strokeLinecap="round" d="M3 9h18"/>
                                                        </svg>
                                                    </div>
                                                }
                                                <div style={{flex:1,minWidth:0}}>
                                                    <p style={{fontSize:'0.8rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.1rem',
                                                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',letterSpacing:'-0.01em'}}>
                                                        {item.nombre}
                                                    </p>
                                                    <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                                        {item.talla && <span style={{fontWeight:'500',color:'rgba(120,60,10,0.7)'}}>Talla {item.talla} · </span>}
                                                        {item.cantidad} × {formatCOP(item.precio_unitario)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {pedido.estado === 'envio_curso' && (
                                        <div style={{
                                            padding:'0.8rem',borderRadius:'9px',
                                            background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.16)',
                                            display:'flex',alignItems:'center',justifyContent:'space-between',
                                            gap:'0.75rem',flexWrap:'wrap',marginBottom:'0.65rem',
                                        }}>
                                            <div>
                                                <p style={{fontSize:'0.8rem',fontWeight:'500',color:'rgba(4,120,87,0.85)',margin:'0 0 0.15rem',letterSpacing:'-0.01em'}}>
                                                    Tu pedido está en camino
                                                </p>
                                                <p style={{fontSize:'0.7rem',color:'rgba(4,120,87,0.6)',margin:0}}>
                                                    ¿Ya lo recibiste? Confírmalo aquí.
                                                </p>
                                            </div>
                                            <button className="btn-confirm" onClick={() => setConfirmando(pedido.id)}>
                                                Confirmar recepción
                                            </button>
                                        </div>
                                    )}

                                    {pedido.estado === 'rechazado' && (
                                        <div style={{
                                            padding:'0.8rem',borderRadius:'9px',
                                            background:'rgba(220,38,38,0.04)',border:'1px solid rgba(220,38,38,0.13)',
                                        }}>
                                            <p style={{fontSize:'0.78rem',fontWeight:'500',color:'rgba(185,28,28,0.85)',margin:'0 0 0.35rem',letterSpacing:'-0.01em'}}>
                                                Pedido rechazado
                                            </p>
                                            {pedido.motivo_rechazo && (
                                                <p style={{fontSize:'0.76rem',color:'rgba(185,28,28,0.75)',margin:'0 0 0.25rem'}}>
                                                    {pedido.motivo_rechazo}
                                                </p>
                                            )}
                                            {pedido.mensaje_rechazo && (
                                                <p style={{fontSize:'0.76rem',color:'rgba(120,30,10,0.65)',margin:'0 0 0.65rem',lineHeight:'1.5'}}>
                                                    {pedido.mensaje_rechazo}
                                                </p>
                                            )}
                                            {(telefonos.length > 0 || correos.length > 0) && (
                                                <div style={{paddingTop:'0.65rem',borderTop:'1px solid rgba(220,38,38,0.1)'}}>
                                                    <p style={{fontSize:'0.66rem',fontWeight:'600',color:'rgba(185,28,28,0.5)',
                                                        textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 0.35rem'}}>
                                                        Contáctanos
                                                    </p>
                                                    {telefonos.map(t => <p key={t} style={{fontSize:'0.76rem',color:'rgba(120,30,10,0.7)',margin:'0 0 0.15rem'}}>{t}</p>)}
                                                    {correos.map(c => <p key={c} style={{fontSize:'0.76rem',color:'rgba(120,30,10,0.7)',margin:'0 0 0.15rem'}}>{c}</p>)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                {/* Paginación */}
                {lastPage > 1 && (
                    <div className="mp-pagination">
                        <button
                            className="mp-page-btn"
                            onClick={() => goToPage(prevUrl)}
                            disabled={!prevUrl}
                        >
                            ‹ Anterior
                        </button>

                        {pageLinks
                            .filter(l => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;')
                            .map((link, i) => (
                                <button
                                    key={i}
                                    className={`mp-page-btn${link.active ? ' active' : ''}`}
                                    onClick={() => goToPage(link.url)}
                                    disabled={link.active || link.label === '...'}
                                >
                                    {link.label === '...' ? '…' : link.label}
                                </button>
                            ))
                        }

                        <button
                            className="mp-page-btn"
                            onClick={() => goToPage(nextUrl)}
                            disabled={!nextUrl}
                        >
                            Siguiente ›
                        </button>
                    </div>
                )}

            </div>

            {confirmando && (
                <div className="modal-overlay" onClick={() => setConfirmando(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3 style={{fontSize:'0.95rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.45rem',letterSpacing:'-0.02em'}}>
                            Confirmar recepción
                        </h3>
                        <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.62)',margin:'0 0 1.4rem',lineHeight:'1.6'}}>
                            Al confirmar, el pedido quedará marcado como entregado. Esta acción no se puede deshacer.
                        </p>
                        <div style={{display:'flex',gap:'0.6rem'}}>
                            <button onClick={() => setConfirmando(null)} style={{
                                flex:1,padding:'0.7rem',borderRadius:'9px',
                                border:'1px solid rgba(200,140,80,0.2)',background:'rgba(255,255,255,0.5)',
                                color:'rgba(120,60,10,0.7)',fontSize:'0.82rem',cursor:'pointer',fontFamily:'Inter,sans-serif',
                            }}>
                                Cancelar
                            </button>
                            <button className="btn-confirm" style={{flex:1}}
                                    onClick={() => confirmarEntrega(confirmando)} disabled={processing}>
                                {processing ? 'Confirmando...' : 'Sí, confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
}
