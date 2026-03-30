// resources/js/Pages/Catalogo/Index.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const COLOR_MAP = {
    pink:   { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', text: 'rgba(190,24,93,0.85)', glow: 'rgba(236,72,153,0.15)' },
    blue:   { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: 'rgba(29,78,216,0.85)',  glow: 'rgba(59,130,246,0.15)' },
    violet: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', text: 'rgba(109,40,217,0.85)', glow: 'rgba(139,92,246,0.15)' },
    green:  { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: 'rgba(4,120,87,0.85)',   glow: 'rgba(16,185,129,0.15)' },
    orange: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', text: 'rgba(194,65,12,0.85)',  glow: 'rgba(249,115,22,0.15)' },
    red:    { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)',  text: 'rgba(185,28,28,0.85)',  glow: 'rgba(220,38,38,0.15)'  },
};

export default function CatalogoIndex({ grupos }) {
    return (
        <ClienteLayout>
            <Head title="Catálogo — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

                .cat-hero { position:relative; padding:4rem 1.5rem 3rem; text-align:center; overflow:hidden; }
                .cat-hero-blob { position:absolute; pointer-events:none; border-radius:50%; filter:blur(60px); opacity:0.35; }

                .grupo-card {
                    background:rgba(255,255,255,0.04); backdrop-filter:blur(22px) saturate(150%);
                    -webkit-backdrop-filter:blur(22px) saturate(150%); border-radius:28px;
                    border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 16px 48px rgba(180,90,20,0.08),0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88),inset 0 -1px 0 rgba(180,90,20,0.04);
                    overflow:hidden; transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
                    text-decoration:none; display:block; position:relative;
                }
                .grupo-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }
                .grupo-card:hover {
                    transform:translateY(-6px) scale(1.01);
                    box-shadow:0 28px 64px rgba(180,90,20,0.13),0 8px 24px rgba(180,90,20,0.08),
                        inset 0 1.5px 0 rgba(255,255,255,0.95);
                    border-color:rgba(255,255,255,0.85);
                }
                .grupo-img { width:100%; height:220px; object-fit:cover; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
                .grupo-card:hover .grupo-img { transform:scale(1.04); }
                .grupo-img-placeholder { width:100%; height:220px; display:flex; align-items:center; justify-content:center; font-size:4rem; }
                .subcat-pill {
                    display:inline-flex; align-items:center; padding:0.2rem 0.65rem; border-radius:20px;
                    font-size:0.72rem; font-weight:500; background:rgba(255,255,255,0.2);
                    border:1px solid rgba(255,255,255,0.5); color:rgba(120,55,10,0.7); white-space:nowrap;
                }
                .glass-btn-catalogo {
                    display:inline-flex; align-items:center; gap:0.4rem;
                    padding:0.6rem 1.2rem; border-radius:14px; font-size:0.85rem; font-weight:500;
                    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65);
                    color:rgba(120,60,10,0.85); text-decoration:none; transition:all 0.2s ease;
                    box-shadow:inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .glass-btn-catalogo:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); transform:translateY(-1px); }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .anim-3 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
                .anim-4 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
                .anim-5 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.33s both; }
                .anim-6 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.40s both; }
            `}</style>

            {/* Hero */}
            <div className="cat-hero">
                <div className="cat-hero-blob" style={{width:'400px',height:'400px',background:'rgba(255,190,120,0.4)',top:'-100px',left:'-80px'}} />
                <div className="cat-hero-blob" style={{width:'300px',height:'300px',background:'rgba(255,160,100,0.3)',top:'-60px',right:'-60px'}} />
                <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.55)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Colección</p>
                <h1 style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:'1.1',marginBottom:'1rem'}}>
                    Todo lo que buscas,<br/>en un solo lugar
                </h1>
                <p style={{fontSize:'1rem',color:'rgba(150,80,20,0.65)',maxWidth:'480px',margin:'0 auto 2rem',lineHeight:'1.7'}}>
                    Explora nuestra colección de ropa y accesorios para cada estilo y ocasión.
                </p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="glass-btn-catalogo">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Inicio
                    </Link>
                </div>
            </div>

            {/* Grid */}
            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 1.5rem 4rem'}}>
                {grupos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'4rem 0'}}>
                        <p style={{fontSize:'1rem',color:'rgba(150,80,20,0.5)'}}>No hay categorías disponibles por el momento.</p>
                    </div>
                ) : (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:'1.5rem'}}>
                        {grupos.map((grupo, idx) => {
                            const colors    = COLOR_MAP[grupo.color] || COLOR_MAP.violet;
                            const animClass = `anim-${Math.min(idx + 1, 6)}`;
                            return (
                                <div key={grupo.id} className={animClass}>
                                    <Link href={`/catalogo/${grupo.id}`} className="grupo-card">
                                        <div style={{overflow:'hidden',position:'relative'}}>
                                            {/* ✅ imagen ya viene como URL completa desde el controller */}
                                            {grupo.imagen ? (
                                                <img src={grupo.imagen} alt={grupo.nombre} className="grupo-img" />
                                            ) : (
                                                <div className="grupo-img-placeholder" style={{background:colors.bg}}>🛍️</div>
                                            )}
                                            <div style={{
                                                position:'absolute',top:'1rem',right:'1rem',
                                                padding:'0.3rem 0.7rem',background:'rgba(255,255,255,0.85)',
                                                backdropFilter:'blur(8px)',borderRadius:'20px',
                                                fontSize:'0.72rem',fontWeight:'600',color:'rgba(120,55,10,0.8)',
                                                boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
                                            }}>
                                                {grupo.total_productos} productos
                                            </div>
                                        </div>
                                        <div style={{padding:'1.5rem'}}>
                                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'0.75rem'}}>
                                                <div>
                                                    <h2 style={{fontSize:'1.3rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em',marginBottom:'0.2rem'}}>
                                                        {grupo.nombre}
                                                    </h2>
                                                    {grupo.descripcion && (
                                                        <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',lineHeight:'1.5'}}>{grupo.descripcion}</p>
                                                    )}
                                                </div>
                                                <div style={{
                                                    width:'40px',height:'40px',borderRadius:'12px',flexShrink:0,
                                                    background:colors.bg,border:`1px solid ${colors.border}`,
                                                    display:'flex',alignItems:'center',justifyContent:'center',
                                                    boxShadow:`0 4px 14px ${colors.glow}`,
                                                }}>
                                                    <svg width="20" height="20" fill="none" stroke={colors.text} strokeWidth="1.8" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            {grupo.subcategorias?.length > 0 && (
                                                <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'1.25rem'}}>
                                                    {grupo.subcategorias.slice(0, 4).map(s => (
                                                        <span key={s.id} className="subcat-pill">{s.nombre}</span>
                                                    ))}
                                                    {grupo.subcategorias.length > 4 && (
                                                        <span className="subcat-pill">+{grupo.subcategorias.length - 4} más</span>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'1rem',borderTop:'1px solid rgba(200,140,80,0.12)'}}>
                                                <span style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)'}}>
                                                    {grupo.subcategorias?.length || 0} subcategoría{grupo.subcategorias?.length !== 1 ? 's' : ''}
                                                </span>
                                                <span style={{fontSize:'0.82rem',fontWeight:'600',color:colors.text,display:'flex',alignItems:'center',gap:'0.3rem'}}>
                                                    Ver colección
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ClienteLayout>
    );
}
