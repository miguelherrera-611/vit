// resources/js/Pages/Catalogo/Index.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function CatalogoIndex({ grupos }) {
    return (
        <ClienteLayout>
            <Head title="Catálogo — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

                .cat-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                }
                .grupo-card {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    overflow: hidden;
                    text-decoration: none;
                    display: block;
                    transition: all 0.22s ease;
                    position: relative;
                }
                .grupo-card:hover {
                    background: rgba(255,255,255,0.65);
                    border-color: rgba(200,140,80,0.25);
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(180,90,20,0.08);
                }
                .grupo-img {
                    width: 100%; height: 200px; object-fit: cover;
                    transition: transform 0.35s ease;
                    display: block;
                }
                .grupo-card:hover .grupo-img { transform: scale(1.03); }
                .grupo-placeholder {
                    width: 100%; height: 200px;
                    background: rgba(200,140,80,0.06);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: center;
                }
                .subcat-pill {
                    display: inline-block; padding: 0.18rem 0.55rem; border-radius: 20px;
                    font-size: 0.7rem; font-weight: 400;
                    background: rgba(200,140,80,0.06);
                    border: 1px solid rgba(200,140,80,0.15);
                    color: rgba(120,60,10,0.6);
                    white-space: nowrap;
                    letter-spacing: -0.01em;
                }
                .anim-1 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .anim-6 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

                @media (max-width: 640px) {
                    .cat-grid { grid-template-columns: 1fr; }
                    .grupo-img { height: 180px; }
                    .grupo-placeholder { height: 180px; }
                    .cat-hero-title { font-size: 1.6rem !important; }
                }
            `}</style>

            {/* Hero */}
            <div style={{
                padding: 'clamp(2.5rem,6vw,4rem) 1.5rem clamp(1.5rem,4vw,2.5rem)',
                maxWidth: '1280px', margin: '0 auto',
            }}>
                <div style={{animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',
                        letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.5rem'}}>
                        Colección
                    </p>
                    <h1 className="cat-hero-title" style={{
                        fontSize:'clamp(1.75rem,4vw,2.75rem)',fontWeight:'300',
                        color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:'1.15',marginBottom:'0.75rem',
                    }}>
                        Todo lo que buscas,<br/>en un solo lugar
                    </h1>
                    <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.55)',maxWidth:'420px',lineHeight:'1.7',marginBottom:0}}>
                        Explora nuestra colección de ropa y accesorios para cada estilo y ocasión.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 1.5rem 4rem'}}>
                {grupos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'4rem 0'}}>
                        <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.5)'}}>
                            No hay categorías disponibles por el momento.
                        </p>
                    </div>
                ) : (
                    <div className="cat-grid">
                        {grupos.map((grupo, idx) => {
                            const animClass = `anim-${Math.min(idx + 1, 6)}`;
                            return (
                                <div key={grupo.id} className={animClass}>
                                    <Link href={`/catalogo/${grupo.id}`} className="grupo-card">
                                        <div style={{overflow:'hidden',position:'relative'}}>
                                            {grupo.imagen ? (
                                                <img src={grupo.imagen} alt={grupo.nombre} className="grupo-img"/>
                                            ) : (
                                                <div className="grupo-placeholder">
                                                    <svg width="32" height="32" fill="none" stroke="rgba(150,80,20,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                            )}
                                            <div style={{
                                                position:'absolute',top:'0.75rem',right:'0.75rem',
                                                padding:'0.22rem 0.6rem',
                                                background:'rgba(253,248,244,0.88)',
                                                backdropFilter:'blur(8px)',borderRadius:'20px',
                                                fontSize:'0.7rem',fontWeight:'500',color:'rgba(120,55,10,0.75)',
                                            }}>
                                                {grupo.total_productos} productos
                                            </div>
                                        </div>
                                        <div style={{padding:'1.25rem'}}>
                                            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'0.6rem'}}>
                                                <div style={{flex:1,minWidth:0,marginRight:'0.75rem'}}>
                                                    <h2 style={{fontSize:'1rem',fontWeight:'500',color:'#2d1a08',
                                                        letterSpacing:'-0.02em',marginBottom:'0.2rem'}}>
                                                        {grupo.nombre}
                                                    </h2>
                                                    {grupo.descripcion && (
                                                        <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',lineHeight:'1.5',margin:0}}>
                                                            {grupo.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                                <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.8" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:'0.2rem'}}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </div>
                                            {grupo.subcategorias?.length > 0 && (
                                                <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',marginBottom:'0.875rem'}}>
                                                    {grupo.subcategorias.slice(0, 4).map(s => (
                                                        <span key={s.id} className="subcat-pill">{s.nombre}</span>
                                                    ))}
                                                    {grupo.subcategorias.length > 4 && (
                                                        <span className="subcat-pill">+{grupo.subcategorias.length - 4} más</span>
                                                    )}
                                                </div>
                                            )}
                                            <div style={{
                                                display:'flex',alignItems:'center',justifyContent:'space-between',
                                                paddingTop:'0.875rem',borderTop:'1px solid rgba(200,140,80,0.08)',
                                            }}>
                                                <span style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.5)'}}>
                                                    {grupo.subcategorias?.length || 0} {grupo.subcategorias?.length === 1 ? 'subcategoría' : 'subcategorías'}
                                                </span>
                                                <span style={{fontSize:'0.78rem',fontWeight:'500',color:'rgba(185,28,28,0.75)',letterSpacing:'-0.01em'}}>
                                                    Ver colección
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
