// resources/js/Pages/Cliente/Dashboard.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const ESTADO_STYLES = {
    revision:    { bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)', color:'rgba(146,64,14,0.85)', label:'En revisión',    emoji:'🕐' },
    aprobado:    { bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.28)', color:'rgba(29,78,216,0.85)', label:'Aprobado',       emoji:'✅' },
    envio_curso: { bg:'rgba(139,92,246,0.09)', border:'rgba(139,92,246,0.28)', color:'rgba(109,40,217,0.85)',label:'Envío en curso', emoji:'🚚' },
    entregado:   { bg:'rgba(16,185,129,0.09)', border:'rgba(16,185,129,0.28)', color:'rgba(4,120,87,0.85)',  label:'Entregado',      emoji:'📦' },
    rechazado:   { bg:'rgba(220,38,38,0.08)',  border:'rgba(220,38,38,0.25)',  color:'rgba(185,28,28,0.85)', label:'Rechazado',      emoji:'❌' },
    cancelado:   { bg:'rgba(200,140,80,0.07)', border:'rgba(200,140,80,0.22)', color:'rgba(150,80,20,0.65)', label:'Cancelado',      emoji:'🚫' },
};

export default function ClienteDashboard({ stats, ultimosPedidos }) {
    const { auth } = usePage().props;

    return (
        <ClienteLayout>
            <Head title="Mi cuenta — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

                .cli-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.08), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                }
                .cli-glass::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }
                .cli-glass:hover {
                    transform:translateY(-3px);
                    box-shadow:0 24px 60px rgba(180,90,20,0.12),0 6px 20px rgba(180,90,20,0.07);
                    border-color:rgba(255,255,255,0.82);
                    transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
                }

                .action-link {
                    display:flex; align-items:center; gap:0.6rem;
                    padding:0.875rem 1.25rem; border-radius:16px;
                    text-decoration:none; transition:all 0.2s ease;
                    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 4px 14px rgba(180,90,20,0.05),inset 0 1px 0 rgba(255,255,255,0.8);
                    font-family:'Inter',sans-serif;
                }
                .action-link:hover {
                    background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.85);
                    transform:translateY(-2px);
                    box-shadow:0 8px 24px rgba(180,90,20,0.08);
                }

                .anim-1  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .anim-6  { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
            `}</style>

            <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                {/* Header de bienvenida */}
                <div style={{marginBottom:'2.5rem'}}>
                    <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.4rem'}}>
                        Mi cuenta
                    </p>
                    <h1 style={{fontSize:'2rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.4rem'}}>
                        Hola, {auth.user.name.split(' ')[0]} 👋
                    </h1>
                    <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.6)'}}>
                        Bienvenid@ a tu espacio en VitaliStore
                    </p>
                </div>

                {/* Stats */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'2.5rem'}}>
                    {[
                        { label:'Total pedidos',  value:stats.total_pedidos, icon:'📦', accent:'rgba(59,130,246,0.8)',  accentBg:'rgba(59,130,246,0.08)',  anim:'anim-1' },
                        { label:'En revisión',    value:stats.en_revision,   icon:'🕐', accent:'rgba(245,158,11,0.85)', accentBg:'rgba(245,158,11,0.08)',  anim:'anim-2' },
                        { label:'En camino',      value:stats.en_camino,     icon:'🚚', accent:'rgba(139,92,246,0.8)',  accentBg:'rgba(139,92,246,0.08)',  anim:'anim-3' },
                        { label:'Entregados',     value:stats.entregados,    icon:'✅', accent:'rgba(16,185,129,0.8)', accentBg:'rgba(16,185,129,0.08)',  anim:'anim-4' },
                    ].map((s, i) => (
                        <div key={i} className={`cli-glass ${s.anim}`} style={{padding:'1.5rem'}}>
                            <div style={{
                                width:'44px',height:'44px',borderRadius:'14px',
                                background:s.accentBg,border:`1px solid ${s.accent.replace(/[\d.]+\)$/, '0.2)')}`,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:'1.3rem',marginBottom:'1rem',
                            }}>
                                {s.icon}
                            </div>
                            <p style={{fontSize:'1.8rem',fontWeight:'700',color:'#2d1a08',letterSpacing:'-0.03em',lineHeight:1,margin:'0 0 0.3rem'}}>
                                {s.value}
                            </p>
                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.6)',margin:0}}>{s.label}</p>
                        </div>
                    ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'1.5rem',alignItems:'start'}}>

                    {/* Últimos pedidos */}
                    <div className="anim-5">
                        <div className="cli-glass" style={{padding:'1.75rem'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.5rem'}}>
                                <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#2d1a08',margin:0,letterSpacing:'-0.02em'}}>
                                    Últimos pedidos
                                </h2>
                                <Link href="/cliente/mis-pedidos" style={{fontSize:'0.8rem',color:'rgba(185,28,28,0.75)',textDecoration:'none',fontWeight:'500'}}>
                                    Ver todos →
                                </Link>
                            </div>

                            {ultimosPedidos.length === 0 ? (
                                <div style={{textAlign:'center',padding:'3rem 0'}}>
                                    <div style={{fontSize:'3rem',marginBottom:'0.75rem'}}>🛍️</div>
                                    <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.25rem'}}>
                                        Aún no has realizado ningún pedido
                                    </p>
                                    <Link href="/catalogo" style={{
                                        padding:'0.6rem 1.25rem',borderRadius:'12px',
                                        background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.3)',
                                        color:'rgba(185,28,28,0.85)',textDecoration:'none',
                                        fontSize:'0.85rem',fontWeight:'600',
                                    }}>
                                        Explorar catálogo →
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    {ultimosPedidos.map((p, idx) => {
                                        const st = ESTADO_STYLES[p.estado] || ESTADO_STYLES.revision;
                                        return (
                                            <div key={p.id} style={{
                                                display:'flex',alignItems:'center',justifyContent:'space-between',
                                                padding:'1rem 0',
                                                borderBottom: idx < ultimosPedidos.length - 1 ? '1px solid rgba(200,140,80,0.1)' : 'none',
                                                gap:'1rem',flexWrap:'wrap',
                                            }}>
                                                <div>
                                                    <p style={{fontSize:'0.88rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.2rem'}}>
                                                        {p.numero_pedido}
                                                    </p>
                                                    <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                                        {p.created_at} · {p.items_count} artículo{p.items_count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                                    <span style={{
                                                        padding:'0.3rem 0.75rem',borderRadius:'20px',
                                                        fontSize:'0.72rem',fontWeight:'700',
                                                        background:st.bg,border:`1px solid ${st.border}`,color:st.color,
                                                        whiteSpace:'nowrap',
                                                    }}>
                                                        {st.emoji} {st.label}
                                                    </span>
                                                    <span style={{fontSize:'0.9rem',fontWeight:'700',color:'#2d1a08',whiteSpace:'nowrap'}}>
                                                        {formatCOP(p.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="anim-6" style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
                        <Link href="/catalogo" className="action-link">
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
                                🛍️
                            </div>
                            <div>
                                <p style={{fontSize:'0.88rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem'}}>Ver catálogo</p>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>Explorar productos</p>
                            </div>
                        </Link>

                        <Link href="/cliente/mis-pedidos" className="action-link">
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
                                📋
                            </div>
                            <div>
                                <p style={{fontSize:'0.88rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem'}}>Mis pedidos</p>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>Historial completo</p>
                            </div>
                        </Link>

                        {/* ── NUEVO: botón Servicio al cliente ── */}
                        <Link href="/cliente/servicio-cliente" className="action-link">
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(245,158,11,0.08)',border:'1px solid rgba(245,158,11,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
                                🆘
                            </div>
                            <div>
                                <p style={{fontSize:'0.88rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem'}}>Servicio al cliente</p>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>Reclamos y soporte</p>
                            </div>
                        </Link>

                        <Link href="/profile" className="action-link">
                            <div style={{width:'36px',height:'36px',borderRadius:'10px',background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
                                👤
                            </div>
                            <div>
                                <p style={{fontSize:'0.88rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem'}}>Mi perfil</p>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>Editar datos</p>
                            </div>
                        </Link>

                        {/* Info de cuenta */}
                        <div style={{
                            padding:'1rem',borderRadius:'16px',marginTop:'0.5rem',
                            background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.12)',
                        }}>
                            <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.5rem'}}>
                                Mi cuenta
                            </p>
                            <p style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.15rem'}}>{auth.user.name}</p>
                            <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.55)',margin:0}}>{auth.user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
