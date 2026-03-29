// resources/js/Pages/Cliente/Confirmacion.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function Confirmacion({ pedido }) {
    return (
        <ClienteLayout>
            <Head title="Pedido recibido — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
                @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

                .conf-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 28px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 20px 60px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.05),
                        inset 0 1.5px 0 rgba(255,255,255,0.9);
                    overflow: hidden; position: relative;
                    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                }
                .conf-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none;
                }

                .timeline-item {
                    display:flex; gap:1rem; padding:1rem 0;
                    border-bottom:1px solid rgba(200,140,80,0.08);
                }
                .timeline-item:last-child { border-bottom:none; }
                .timeline-icon {
                    width:40px; height:40px; border-radius:12px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center; font-size:1.2rem;
                }

                .btn-primary {
                    display:inline-block; padding:0.85rem 2rem; border-radius:14px;
                    font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600;
                    text-decoration:none; transition:all 0.22s ease;
                    background:rgba(220,38,38,0.09); border:1px solid rgba(220,38,38,0.35);
                    color:rgba(185,28,28,0.95);
                    box-shadow:0 6px 20px rgba(220,38,38,0.12),inset 0 1px 0 rgba(255,120,120,0.2);
                }
                .btn-primary:hover { background:rgba(220,38,38,0.15); transform:translateY(-1px); }

                .btn-ghost {
                    display:inline-block; padding:0.85rem 1.75rem; border-radius:14px;
                    font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:500;
                    text-decoration:none; transition:all 0.2s ease;
                    background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.28);
                    color:rgba(120,60,10,0.75);
                }
                .btn-ghost:hover { background:rgba(255,255,255,0.14); color:rgba(90,40,5,0.9); }
            `}</style>

            <div style={{maxWidth:'620px',margin:'0 auto',padding:'3rem 1.5rem 5rem',textAlign:'center'}}>

                {/* Icono de éxito */}
                <div style={{
                    width:'90px',height:'90px',borderRadius:'50%',margin:'0 auto 1.75rem',
                    background:'rgba(16,185,129,0.1)',border:'2px solid rgba(16,185,129,0.3)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    animation:'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both, pulse 2.5s ease-in-out 0.6s infinite',
                    boxShadow:'0 12px 36px rgba(16,185,129,0.15)',
                }}>
                    <svg width="40" height="40" fill="none" stroke="rgba(4,120,87,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                </div>

                <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(4,120,87,0.7)',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'0.6rem'}}>
                    ¡Pedido recibido!
                </p>
                <h1 style={{fontSize:'2rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.6rem',lineHeight:'1.1'}}>
                    Tu pedido está en revisión
                </h1>
                <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.65)',marginBottom:'0.5rem',lineHeight:'1.6'}}>
                    Hemos recibido tu comprobante y lo estamos verificando.
                </p>
                <p style={{fontSize:'0.85rem',color:'rgba(150,80,20,0.5)',marginBottom:'2.5rem'}}>
                    Número de pedido: <strong style={{color:'rgba(185,28,28,0.8)'}}>{pedido.numero_pedido}</strong>
                </p>

                {/* Card de detalles */}
                <div className="conf-card" style={{padding:'1.75rem',marginBottom:'2rem',textAlign:'left'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                        <h3 style={{fontSize:'0.9rem',fontWeight:'700',color:'#2d1a08',margin:0}}>Resumen</h3>
                        <div style={{
                            padding:'0.3rem 0.8rem',borderRadius:'20px',
                            background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',
                            fontSize:'0.75rem',fontWeight:'700',color:'rgba(146,64,14,0.85)',
                        }}>
                            🕐 En revisión
                        </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.875rem'}}>
                        {[
                            { label:'Total pagado',    value: formatCOP(pedido.total)     },
                            { label:'Método de pago',  value: pedido.metodo_pago          },
                            { label:'Fecha del pedido',value: pedido.created_at           },
                            { label:'Estado actual',   value: pedido.estado_label         },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding:'0.75rem',borderRadius:'12px',
                                background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.1)',
                            }}>
                                <p style={{fontSize:'0.68rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 0.2rem'}}>
                                    {item.label}
                                </p>
                                <p style={{fontSize:'0.88rem',fontWeight:'600',color:'#2d1a08',margin:0}}>
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline de qué sigue */}
                <div className="conf-card" style={{padding:'1.5rem',marginBottom:'2.5rem',textAlign:'left'}}>
                    <h3 style={{fontSize:'0.88rem',fontWeight:'700',color:'#2d1a08',marginBottom:'0.25rem'}}>¿Qué sigue?</h3>
                    <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.25rem'}}>
                        Este proceso puede tardar máximo 24 horas.
                    </p>

                    {[
                        { icon:'📋', color:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.25)',
                            title:'Revisión del comprobante', desc:'Nuestro equipo verifica que el pago fue recibido correctamente.', done:true },
                        { icon:'✅', color:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.2)',
                            title:'Aprobación del pedido', desc:'Una vez confirmado, preparamos tu pedido para el envío.', done:false },
                        { icon:'🚚', color:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.2)',
                            title:'Envío en curso', desc:'Te notificaremos por correo cuando tu pedido esté en camino.', done:false },
                        { icon:'📦', color:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.2)',
                            title:'Entrega y confirmación', desc:'Cuando recibas tu pedido, confírmalo desde "Mis pedidos".', done:false },
                    ].map((step, i) => (
                        <div key={i} className="timeline-item">
                            <div className="timeline-icon" style={{background:step.color,border:`1px solid ${step.border}`}}>
                                {step.icon}
                            </div>
                            <div style={{flex:1}}>
                                <p style={{fontSize:'0.85rem',fontWeight:'600',color: step.done ? '#2d1a08' : 'rgba(120,60,10,0.55)',margin:'0 0 0.2rem'}}>
                                    {step.title}
                                    {step.done && <span style={{marginLeft:'0.4rem',fontSize:'0.7rem',color:'rgba(245,158,11,0.85)',fontWeight:'700'}}>← Aquí estás</span>}
                                </p>
                                <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',margin:0,lineHeight:'1.5'}}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTAs */}
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',alignItems:'center'}}>
                    <Link href="/cliente/mis-pedidos" className="btn-primary">
                        Ver mis pedidos →
                    </Link>
                    <Link href="/catalogo" className="btn-ghost">
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </ClienteLayout>
    );
}
