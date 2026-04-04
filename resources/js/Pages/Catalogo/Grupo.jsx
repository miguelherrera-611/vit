// resources/js/Pages/Catalogo/Grupo.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function CatalogoGrupo({ grupo, subcategorias }) {
    return (
        <ClienteLayout>
            <Head title={`${grupo.nombre} — VitaliStore`}/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

                .subcat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1rem;
                }
                .subcat-card {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px; overflow: hidden;
                    text-decoration: none; display: block;
                    transition: all 0.2s ease;
                }
                .subcat-card:hover {
                    background: rgba(255,255,255,0.65);
                    border-color: rgba(200,140,80,0.25);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 28px rgba(180,90,20,0.07);
                }
                .subcat-img {
                    width: 100%; height: 180px; object-fit: cover;
                    transition: transform 0.32s ease; display: block;
                }
                .subcat-card:hover .subcat-img { transform: scale(1.04); }
                .subcat-placeholder {
                    width: 100%; height: 180px;
                    background: rgba(200,140,80,0.06);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: center;
                }
                .breadcrumb-link {
                    font-size: 0.78rem; color: rgba(150,80,20,0.55);
                    text-decoration: none; padding: 0.25rem 0.5rem;
                    border-radius: 6px; transition: all 0.12s;
                    letter-spacing: -0.01em;
                }
                .breadcrumb-link:hover { color: rgba(120,50,10,0.85); background: rgba(200,140,80,0.07); }
                .anim-1 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .anim-6 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

                @media (max-width: 640px) {
                    .subcat-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                    .subcat-img { height: 140px; }
                    .subcat-placeholder { height: 140px; }
                }
                @media (max-width: 380px) {
                    .subcat-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2rem 1.5rem 4rem'}}>

                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:'0.25rem',marginBottom:'2rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="breadcrumb-link">Catálogo</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.75rem'}}>›</span>
                    <span style={{fontSize:'0.78rem',fontWeight:'500',color:'rgba(120,55,10,0.75)',letterSpacing:'-0.01em'}}>
                        {grupo.nombre}
                    </span>
                </div>

                {/* Header */}
                <div style={{marginBottom:'2rem',animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <h1 style={{
                        fontSize:'clamp(1.5rem,3.5vw,2.25rem)',fontWeight:'300',
                        color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.4rem',
                    }}>
                        {grupo.nombre}
                    </h1>
                    {grupo.descripcion && (
                        <p style={{fontSize:'0.85rem',color:'rgba(150,80,20,0.55)',maxWidth:'420px',lineHeight:'1.6'}}>
                            {grupo.descripcion}
                        </p>
                    )}
                </div>

                {/* Grid */}
                {subcategorias.length === 0 ? (
                    <div style={{textAlign:'center',padding:'4rem 0',
                        background:'rgba(255,255,255,0.4)',borderRadius:'14px',
                        border:'1px solid rgba(200,140,80,0.1)'}}>
                        <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.5)',marginBottom:'1rem'}}>
                            No hay subcategorías disponibles.
                        </p>
                        <Link href="/catalogo" style={{
                            fontSize:'0.82rem',color:'rgba(185,28,28,0.75)',
                            textDecoration:'none',fontWeight:'500',
                        }}>
                            Volver al catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="subcat-grid">
                        {subcategorias.map((subcat, idx) => (
                            <div key={subcat.id} className={`anim-${Math.min(idx + 1, 6)}`}>
                                <Link href={`/catalogo/${grupo.id}/${subcat.id}`} className="subcat-card">
                                    <div style={{overflow:'hidden',position:'relative'}}>
                                        {subcat.imagen ? (
                                            <img src={subcat.imagen} alt={subcat.nombre} className="subcat-img"/>
                                        ) : (
                                            <div className="subcat-placeholder">
                                                <svg width="28" height="28" fill="none" stroke="rgba(150,80,20,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                            </div>
                                        )}
                                        <div style={{
                                            position:'absolute',top:'0.6rem',right:'0.6rem',
                                            padding:'0.18rem 0.5rem',
                                            background:'rgba(253,248,244,0.88)',
                                            backdropFilter:'blur(8px)',borderRadius:'20px',
                                            fontSize:'0.68rem',fontWeight:'500',color:'rgba(120,55,10,0.7)',
                                        }}>
                                            {subcat.total_productos} prendas
                                        </div>
                                    </div>
                                    <div style={{padding:'1rem'}}>
                                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                            <div style={{flex:1,minWidth:0,marginRight:'0.5rem'}}>
                                                <h3 style={{fontSize:'0.9rem',fontWeight:'500',color:'#2d1a08',
                                                    letterSpacing:'-0.01em',marginBottom:subcat.descripcion?'0.18rem':0}}>
                                                    {subcat.nombre}
                                                </h3>
                                                {subcat.descripcion && (
                                                    <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',lineHeight:'1.4',margin:0,
                                                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                                        {subcat.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                            <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.8" viewBox="0 0 24 24" style={{flexShrink:0}}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ClienteLayout>
    );
}
