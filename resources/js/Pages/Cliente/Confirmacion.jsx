// resources/js/Pages/Cliente/Confirmacion.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function Confirmacion({ pedido }) {
    return (
        <ClienteLayout>
            <Head title="Pedido recibido — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; }
                @keyframes slideUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes scaleIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }

                .conf-wrap { max-width:540px; margin:0 auto; padding:2.5rem 1.25rem 4rem; text-align:center; }
                .conf-card {
                    background:rgba(255,255,255,0.5); border:1px solid rgba(200,140,80,0.12);
                    border-radius:14px; padding:1.25rem; margin-bottom:0.75rem;
                    animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                    text-align:left;
                }
                .summary-grid {
                    display:grid; grid-template-columns:1fr 1fr; gap:0.65rem;
                }
                .summary-item {
                    padding:0.6rem 0.8rem; border-radius:9px;
                    background:rgba(255,255,255,0.45); border:1px solid rgba(200,140,80,0.08);
                }
                .step-row { display:flex; gap:0.875rem; padding:0.8rem 0; align-items:flex-start; }
                .step-row + .step-row { border-top:1px solid rgba(200,140,80,0.08); }
                .step-icon {
                    width:32px; height:32px; border-radius:8px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                }

                @media (max-width:640px) {
                    .conf-wrap { padding:1.75rem 1rem 3rem; }
                    .summary-grid { grid-template-columns:1fr 1fr; }
                }
                @media (max-width:360px) {
                    .summary-grid { grid-template-columns:1fr; }
                }
            `}</style>

            <div className="conf-wrap">

                {/* Check */}
                <div style={{
                    width:'50px',height:'50px',borderRadius:'13px',margin:'0 auto 1.5rem',
                    background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    animation:'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
                }}>
                    <svg width="20" height="20" fill="none" stroke="rgba(4,120,87,0.85)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                </div>

                <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(4,120,87,0.7)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.45rem'}}>
                    Pedido recibido
                </p>
                <h1 style={{fontSize:'clamp(1.4rem,4vw,1.75rem)',fontWeight:'300',color:'#2d1a08',
                    letterSpacing:'-0.04em',marginBottom:'0.45rem',lineHeight:'1.2'}}>
                    En revisión
                </h1>
                <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',marginBottom:'0.35rem',lineHeight:'1.6'}}>
                    Hemos recibido tu comprobante y lo estamos verificando.
                </p>
                <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.5)',marginBottom:'2rem'}}>
                    Pedido: <strong style={{color:'rgba(185,28,28,0.8)',fontWeight:'500'}}>{pedido.numero_pedido}</strong>
                </p>

                {/* Resumen */}
                <div className="conf-card">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.9rem'}}>
                        <p style={{fontSize:'0.8rem',fontWeight:'500',color:'#2d1a08',margin:0,letterSpacing:'-0.01em'}}>Resumen</p>
                        <span style={{padding:'0.16rem 0.55rem',borderRadius:'5px',fontSize:'0.7rem',fontWeight:'500',
                            background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.22)',
                            color:'rgba(146,64,14,0.85)'}}>
                            En revisión
                        </span>
                    </div>
                    <div className="summary-grid">
                        {[
                            { label:'Total',  value:formatCOP(pedido.total)  },
                            { label:'Método', value:pedido.metodo_pago       },
                            { label:'Fecha',  value:pedido.created_at        },
                            { label:'Estado', value:pedido.estado_label      },
                        ].map((item, i) => (
                            <div key={i} className="summary-item">
                                <p style={{fontSize:'0.64rem',fontWeight:'500',color:'rgba(150,80,20,0.42)',
                                    textTransform:'uppercase',letterSpacing:'0.06em',margin:'0 0 0.12rem'}}>
                                    {item.label}
                                </p>
                                <p style={{fontSize:'0.82rem',fontWeight:'500',color:'#2d1a08',margin:0,letterSpacing:'-0.01em'}}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proceso */}
                <div className="conf-card">
                    <p style={{fontSize:'0.8rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.2rem',letterSpacing:'-0.01em'}}>
                        Qué sigue
                    </p>
                    <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.48)',marginBottom:'0.875rem'}}>
                        Proceso de máximo 24 horas.
                    </p>

                    {[
                        { label:'Revisión del comprobante', desc:'Verificamos que el pago fue recibido.', active:true },
                        { label:'Aprobación del pedido',    desc:'Una vez confirmado, preparamos tu pedido.' },
                        { label:'Envío',                    desc:'Te notificaremos por correo cuando esté en camino.' },
                        { label:'Entrega y confirmación',   desc:'Confirma la recepción desde "Mis pedidos".' },
                    ].map((step, i) => (
                        <div key={i} className="step-row">
                            <div className="step-icon" style={{
                                background:step.active?'rgba(245,158,11,0.08)':'rgba(200,140,80,0.04)',
                                border:step.active?'1px solid rgba(245,158,11,0.2)':'1px solid rgba(200,140,80,0.1)',
                            }}>
                                {step.active ? (
                                    <svg width="14" height="14" fill="none" stroke="rgba(146,64,14,0.7)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4l2 2"/>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.25)" strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10"/>
                                    </svg>
                                )}
                            </div>
                            <div style={{flex:1}}>
                                <p style={{fontSize:'0.8rem',fontWeight:'500',
                                    color:step.active?'#2d1a08':'rgba(120,60,10,0.45)',
                                    margin:'0 0 0.15rem',letterSpacing:'-0.01em'}}>
                                    {step.label}
                                    {step.active && <span style={{marginLeft:'0.35rem',fontSize:'0.66rem',color:'rgba(245,158,11,0.8)',fontWeight:'500'}}>— aquí estás</span>}
                                </p>
                                <p style={{fontSize:'0.73rem',color:'rgba(150,80,20,0.48)',margin:0,lineHeight:'1.5'}}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',alignItems:'center',marginTop:'0.5rem'}}>
                    <Link href="/cliente/mis-pedidos" style={{
                        display:'inline-block',padding:'0.78rem 1.75rem',borderRadius:'9px',
                        background:'rgba(185,28,28,0.07)',border:'1px solid rgba(185,28,28,0.2)',
                        color:'rgba(185,28,28,0.85)',textDecoration:'none',fontSize:'0.84rem',
                        fontWeight:'500',letterSpacing:'-0.01em',
                    }}>
                        Ver mis pedidos
                    </Link>
                    <Link href="/catalogo" style={{
                        fontSize:'0.8rem',color:'rgba(150,80,20,0.5)',textDecoration:'none',letterSpacing:'-0.01em',
                    }}>
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </ClienteLayout>
    );
}
