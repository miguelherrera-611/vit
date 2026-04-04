// resources/js/Pages/Cliente/Dashboard.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const ESTADO_STYLES = {
    revision:    { bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.22)',  color:'rgba(146,64,14,0.85)',  label:'En revisión'    },
    aprobado:    { bg:'rgba(59,130,246,0.07)',  border:'rgba(59,130,246,0.2)',   color:'rgba(29,78,216,0.85)',  label:'Aprobado'       },
    envio_curso: { bg:'rgba(139,92,246,0.07)',  border:'rgba(139,92,246,0.2)',   color:'rgba(109,40,217,0.85)', label:'Envío en curso' },
    entregado:   { bg:'rgba(16,185,129,0.07)',  border:'rgba(16,185,129,0.2)',   color:'rgba(4,120,87,0.85)',   label:'Entregado'      },
    rechazado:   { bg:'rgba(220,38,38,0.06)',   border:'rgba(220,38,38,0.18)',   color:'rgba(185,28,28,0.85)',  label:'Rechazado'      },
    cancelado:   { bg:'rgba(200,140,80,0.06)',  border:'rgba(200,140,80,0.18)', color:'rgba(150,80,20,0.65)',  label:'Cancelado'      },
};

export default function ClienteDashboard({ stats, ultimosPedidos }) {
    const { auth } = usePage().props;

    return (
        <ClienteLayout>
            <Head title="Mi cuenta — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .dash-wrap { max-width:1100px; margin:0 auto; padding:2rem 1.25rem 4rem; }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.75rem;
                    margin-bottom: 1.75rem;
                }
                .stat-card {
                    padding: 1.25rem;
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px;
                    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
                }

                .dash-main {
                    display: grid;
                    grid-template-columns: 1fr 260px;
                    gap: 1rem;
                    align-items: start;
                }

                .pedidos-card {
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; padding: 1.35rem;
                    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                }
                .pedido-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.8rem 0; gap: 0.75rem; flex-wrap: wrap;
                }
                .pedido-row + .pedido-row { border-top: 1px solid rgba(200,140,80,0.08); }

                .acciones-col {
                    display: flex; flex-direction: column; gap: 0.45rem;
                    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both;
                }
                .dash-link {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.8rem 1rem; border-radius: 10px; text-decoration: none;
                    background: rgba(255,255,255,0.45); border: 1px solid rgba(200,140,80,0.12);
                    transition: all 0.13s ease;
                }
                .dash-link:hover {
                    background: rgba(255,255,255,0.7); border-color: rgba(200,140,80,0.22);
                }

                @media (max-width: 900px) {
                    .dash-main { grid-template-columns: 1fr; }
                    .acciones-col {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.45rem;
                    }
                }
                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .dash-wrap { padding: 1.5rem 1rem 3rem; }
                }
                @media (max-width: 380px) {
                    .acciones-col { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dash-wrap">

                {/* Header */}
                <div style={{marginBottom:'1.75rem',animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',
                        letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.35rem'}}>
                        Mi cuenta
                    </p>
                    <h1 style={{fontSize:'clamp(1.4rem,3vw,1.75rem)',fontWeight:'300',color:'#2d1a08',
                        letterSpacing:'-0.04em',marginBottom:'0.25rem'}}>
                        Bienvenido, {auth.user.name.split(' ')[0]}
                    </h1>
                    <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.5)',fontWeight:'400'}}>
                        {auth.user.email}
                    </p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    {[
                        { label:'Total pedidos', value:stats.total_pedidos, delay:'0.05s' },
                        { label:'En revisión',   value:stats.en_revision,   delay:'0.1s'  },
                        { label:'En camino',     value:stats.en_camino,     delay:'0.15s' },
                        { label:'Entregados',    value:stats.entregados,    delay:'0.2s'  },
                    ].map((s) => (
                        <div key={s.label} className="stat-card" style={{animationDelay:s.delay}}>
                            <p style={{fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:'300',color:'#2d1a08',
                                letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 0.25rem'}}>
                                {s.value}
                            </p>
                            <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Main */}
                <div className="dash-main">

                    {/* Últimos pedidos */}
                    <div className="pedidos-card">
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
                            <h2 style={{fontSize:'0.85rem',fontWeight:'500',color:'#2d1a08',margin:0,letterSpacing:'-0.01em'}}>
                                Últimos pedidos
                            </h2>
                            <Link href="/cliente/mis-pedidos" style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.5)',textDecoration:'none'}}>
                                Ver todos
                            </Link>
                        </div>

                        {ultimosPedidos.length === 0 ? (
                            <div style={{padding:'2.5rem 0',textAlign:'center'}}>
                                <p style={{fontSize:'0.84rem',color:'rgba(150,80,20,0.45)',marginBottom:'1rem'}}>
                                    Aún no has realizado ningún pedido
                                </p>
                                <Link href="/catalogo" style={{
                                    display:'inline-block',padding:'0.5rem 1rem',borderRadius:'8px',
                                    background:'rgba(185,28,28,0.06)',border:'1px solid rgba(185,28,28,0.18)',
                                    color:'rgba(185,28,28,0.8)',textDecoration:'none',fontSize:'0.8rem',fontWeight:'500',
                                }}>
                                    Explorar catálogo
                                </Link>
                            </div>
                        ) : ultimosPedidos.map((p) => {
                            const st = ESTADO_STYLES[p.estado] || ESTADO_STYLES.revision;
                            return (
                                <div key={p.id} className="pedido-row">
                                    <div style={{minWidth:0,flex:1}}>
                                        <p style={{fontSize:'0.84rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.18rem',letterSpacing:'-0.01em'}}>
                                            {p.numero_pedido}
                                        </p>
                                        <p style={{fontSize:'0.71rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                            {p.created_at} · {p.items_count} {p.items_count===1?'artículo':'artículos'}
                                        </p>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center',gap:'0.6rem',flexShrink:0}}>
                                        <span style={{
                                            padding:'0.18rem 0.55rem',borderRadius:'5px',
                                            fontSize:'0.69rem',fontWeight:'500',
                                            background:st.bg,border:`1px solid ${st.border}`,color:st.color,
                                            whiteSpace:'nowrap',
                                        }}>
                                            {st.label}
                                        </span>
                                        <span style={{fontSize:'0.86rem',fontWeight:'600',color:'#2d1a08',whiteSpace:'nowrap',letterSpacing:'-0.02em'}}>
                                            {formatCOP(p.total)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Acciones */}
                    <div className="acciones-col">
                        {[
                            { href:'/catalogo',                 label:'Catálogo',   sub:'Ver productos'      },
                            { href:'/cliente/mis-pedidos',      label:'Pedidos',    sub:'Historial completo' },
                            { href:'/cliente/servicio-cliente', label:'Soporte',    sub:'Reclamos y ayuda'   },
                            { href:'/profile',                  label:'Perfil',     sub:'Editar datos'       },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="dash-link">
                                <div>
                                    <p style={{fontSize:'0.82rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.08rem',letterSpacing:'-0.01em'}}>
                                        {item.label}
                                    </p>
                                    <p style={{fontSize:'0.71rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                        {item.sub}
                                    </p>
                                </div>
                                <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.28)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
