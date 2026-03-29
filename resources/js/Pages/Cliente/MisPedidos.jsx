// resources/js/Pages/Cliente/MisPedidos.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const ESTADO_STYLES = {
    revision:    { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)',  color:'rgba(146,64,14,0.9)',  label:'En Revisión',   emoji:'🕐' },
    aprobado:    { bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.28)', color:'rgba(29,78,216,0.9)',  label:'Aprobado',      emoji:'✅' },
    envio_curso: { bg:'rgba(139,92,246,0.09)', border:'rgba(139,92,246,0.28)', color:'rgba(109,40,217,0.9)', label:'Envío en Curso',emoji:'🚚' },
    entregado:   { bg:'rgba(16,185,129,0.09)', border:'rgba(16,185,129,0.28)', color:'rgba(4,120,87,0.9)',   label:'Entregado',     emoji:'📦' },
    rechazado:   { bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.25)',  color:'rgba(185,28,28,0.9)',  label:'Rechazado',     emoji:'❌' },
    cancelado:   { bg:'rgba(200,140,80,0.07)', border:'rgba(200,140,80,0.22)', color:'rgba(150,80,20,0.7)',  label:'Cancelado',     emoji:'🚫' },
};

export default function MisPedidos({ pedidos }) {
    const { flash } = usePage().props;
    const [confirmando, setConfirmando] = useState(null);
    const [processing, setProcessing]  = useState(false);
    const [expandido, setExpandido]    = useState(null);

    const confirmarEntrega = (pedidoId) => {
        setProcessing(true);
        router.patch(`/cliente/pedidos/${pedidoId}/confirmar-entrega`, {}, {
            preserveScroll: true,
            onFinish: () => { setProcessing(false); setConfirmando(null); },
        });
    };

    return (
        <ClienteLayout>
            <Head title="Mis pedidos — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideDown { from{opacity:0;height:0} to{opacity:1;height:auto} }

                .pedido-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 20px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 12px 40px rgba(180,90,20,0.07), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    overflow: hidden; margin-bottom: 1rem;
                    transition: all 0.25s ease;
                }
                .pedido-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none;
                }
                .pedido-header {
                    display:flex; align-items:center; justify-content:space-between;
                    padding:1.25rem 1.5rem; cursor:pointer; flex-wrap:wrap; gap:0.75rem;
                    position:relative;
                }
                .pedido-header:hover { background:rgba(255,255,255,0.04); }

                .btn-confirm {
                    padding:0.7rem 1.25rem; border-radius:12px; border:none; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.84rem; font-weight:600;
                    transition:all 0.2s ease; display:inline-flex; align-items:center; gap:0.4rem;
                    background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35);
                    color:rgba(4,120,87,0.9);
                    box-shadow:0 4px 14px rgba(16,185,129,0.1);
                }
                .btn-confirm:hover:not(:disabled) {
                    background:rgba(16,185,129,0.18); transform:translateY(-1px);
                    box-shadow:0 8px 20px rgba(16,185,129,0.15);
                }
                .btn-confirm:disabled { opacity:0.5; cursor:not-allowed; }

                .modal-overlay {
                    position:fixed; inset:0; z-index:200;
                    background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
                    display:flex; align-items:center; justify-content:center; padding:1rem;
                }
                .modal-card {
                    width:100%; max-width:400px;
                    background:rgba(255,250,245,0.95);
                    backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
                    border:1px solid rgba(255,255,255,0.8); border-radius:24px; padding:2rem;
                    box-shadow:0 24px 64px rgba(180,90,20,0.16),inset 0 1px 0 rgba(255,255,255,0.95);
                    animation:staggerUp 0.25s cubic-bezier(0.16,1,0.3,1) both;
                }

                .alert-success {
                    padding:0.875rem 1rem; border-radius:14px; margin-bottom:1.5rem;
                    background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25);
                    font-size:0.84rem; color:rgba(4,120,87,0.9); font-weight:500;
                    display:flex; align-items:center; gap:0.5rem;
                }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
            `}</style>

            <div style={{maxWidth:'900px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>
                <div style={{marginBottom:'2rem'}}>
                    <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.4rem'}}>
                        Mi cuenta
                    </p>
                    <h1 style={{fontSize:'1.9rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.4rem'}}>
                        Mis pedidos
                    </h1>
                    <p style={{fontSize:'0.85rem',color:'rgba(150,80,20,0.6)'}}>
                        {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} en total
                    </p>
                </div>

                {/* Flash success */}
                {flash?.success && (
                    <div className="alert-success">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        {flash.success}
                    </div>
                )}

                {pedidos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'5rem 0',
                        background:'rgba(255,255,255,0.04)',borderRadius:'24px',border:'1px solid rgba(255,255,255,0.65)'}}>
                        <div style={{fontSize:'3.5rem',marginBottom:'1rem'}}>📦</div>
                        <p style={{fontSize:'1rem',color:'rgba(150,80,20,0.6)',marginBottom:'1.5rem'}}>No tienes pedidos aún</p>
                        <a href="/catalogo" style={{
                            padding:'0.75rem 1.75rem',borderRadius:'14px',
                            background:'rgba(220,38,38,0.09)',border:'1px solid rgba(220,38,38,0.32)',
                            color:'rgba(185,28,28,0.9)',textDecoration:'none',
                            fontSize:'0.9rem',fontWeight:'600',display:'inline-block',
                        }}>
                            Ir al catálogo →
                        </a>
                    </div>
                ) : (
                    pedidos.map((pedido, idx) => {
                        const st = ESTADO_STYLES[pedido.estado] || ESTADO_STYLES.revision;
                        const abierto = expandido === pedido.id;
                        const animClass = `anim-${Math.min(idx + 1, 5)}`;

                        return (
                            <div key={pedido.id} className={`pedido-card ${animClass}`} style={{position:'relative'}}>
                                {/* Header */}
                                <div className="pedido-header" onClick={() => setExpandido(abierto ? null : pedido.id)}>
                                    <div style={{display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
                                        <div>
                                            <p style={{fontSize:'0.95rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.2rem'}}>
                                                {pedido.numero_pedido}
                                            </p>
                                            <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                                {pedido.created_at} · {pedido.metodo_pago} · {pedido.ciudad}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding:'0.3rem 0.75rem',borderRadius:'20px',
                                            background:st.bg,border:`1px solid ${st.border}`,
                                            fontSize:'0.74rem',fontWeight:'700',color:st.color,
                                            whiteSpace:'nowrap',
                                        }}>
                                            {st.emoji} {st.label}
                                        </div>
                                    </div>

                                    <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                                        <span style={{fontSize:'1.05rem',fontWeight:'700',color:'#2d1a08'}}>
                                            {formatCOP(pedido.total)}
                                        </span>
                                        <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.5)" strokeWidth="2" viewBox="0 0 24 24"
                                             style={{transition:'transform 0.2s', transform:abierto ? 'rotate(180deg)' : 'rotate(0)'}}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Detalle expandido */}
                                {abierto && (
                                    <div style={{padding:'0 1.5rem 1.5rem',borderTop:'1px solid rgba(200,140,80,0.1)'}}>
                                        {/* Productos */}
                                        <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'1.25rem 0 0.875rem'}}>
                                            Productos
                                        </p>
                                        <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'1.25rem'}}>
                                            {pedido.items.map((item, i) => (
                                                <div key={i} style={{
                                                    display:'flex',alignItems:'center',gap:'0.75rem',
                                                    padding:'0.75rem',borderRadius:'12px',
                                                    background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.1)',
                                                }}>
                                                    {item.imagen
                                                        ? <img src={`/storage/${item.imagen}`} alt={item.nombre}
                                                               style={{width:'44px',height:'44px',borderRadius:'8px',objectFit:'cover',flexShrink:0}} />
                                                        : <div style={{width:'44px',height:'44px',borderRadius:'8px',background:'rgba(255,255,255,0.08)',
                                                            display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>👔</div>
                                                    }
                                                    <div style={{flex:1,minWidth:0}}>
                                                        <p style={{fontSize:'0.85rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.15rem',
                                                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                                            {item.nombre}
                                                        </p>
                                                        <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                                            {item.cantidad} × {formatCOP(item.precio_unitario)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Botón confirmar entrega */}
                                        {pedido.estado === 'envio_curso' && (
                                            <div style={{
                                                padding:'1rem 1.25rem',borderRadius:'14px',
                                                background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.22)',
                                                display:'flex',alignItems:'center',justifyContent:'space-between',
                                                gap:'1rem',flexWrap:'wrap',
                                            }}>
                                                <div>
                                                    <p style={{fontSize:'0.85rem',fontWeight:'600',color:'rgba(4,120,87,0.85)',margin:'0 0 0.2rem'}}>
                                                        🚚 Tu pedido está en camino
                                                    </p>
                                                    <p style={{fontSize:'0.75rem',color:'rgba(4,120,87,0.65)',margin:0}}>
                                                        ¿Ya lo recibiste? Confírmalo aquí.
                                                    </p>
                                                </div>
                                                <button className="btn-confirm" onClick={() => setConfirmando(pedido.id)}>
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                                    Sí, lo recibí
                                                </button>
                                            </div>
                                        )}

                                        {/* Estado rechazado */}
                                        {pedido.estado === 'rechazado' && (
                                            <div style={{
                                                padding:'1rem 1.25rem',borderRadius:'14px',
                                                background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)',
                                            }}>
                                                <p style={{fontSize:'0.84rem',fontWeight:'600',color:'rgba(185,28,28,0.85)',margin:'0 0 0.2rem'}}>
                                                    ❌ Pedido rechazado
                                                </p>
                                                <p style={{fontSize:'0.76rem',color:'rgba(185,28,28,0.65)',margin:0}}>
                                                    El comprobante no pudo ser verificado. Contacta a la tienda para más información.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal de confirmación de entrega */}
            {confirmando && (
                <div className="modal-overlay" onClick={() => setConfirmando(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
                            <div style={{
                                width:'60px',height:'60px',borderRadius:'50%',margin:'0 auto 1rem',
                                background:'rgba(16,185,129,0.1)',border:'2px solid rgba(16,185,129,0.3)',
                                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',
                            }}>📦</div>
                            <h3 style={{fontSize:'1.1rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.4rem',letterSpacing:'-0.02em'}}>
                                ¿Confirmar entrega?
                            </h3>
                            <p style={{fontSize:'0.84rem',color:'rgba(150,80,20,0.65)',margin:0,lineHeight:'1.6'}}>
                                Al confirmar, el pedido quedará marcado como <strong>Entregado</strong>. Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div style={{display:'flex',gap:'0.75rem'}}>
                            <button onClick={() => setConfirmando(null)} style={{
                                flex:1,padding:'0.8rem',borderRadius:'12px',border:'1px solid rgba(200,140,80,0.28)',
                                background:'rgba(255,255,255,0.06)',color:'rgba(120,60,10,0.75)',
                                fontSize:'0.88rem',fontWeight:'500',cursor:'pointer',fontFamily:'Inter,sans-serif',
                            }}>
                                Cancelar
                            </button>
                            <button className="btn-confirm" style={{flex:1,justifyContent:'center'}}
                                    onClick={() => confirmarEntrega(confirmando)}
                                    disabled={processing}>
                                {processing ? 'Confirmando...' : '✓ Sí, lo recibí'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ClienteLayout>
    );
}
