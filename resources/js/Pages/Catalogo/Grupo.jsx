// resources/js/Pages/Catalogo/Grupo.jsx
import { Head, Link } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function CatalogoGrupo({ grupo, subcategorias }) {
    return (
        <ClienteLayout>
            <Head title={`${grupo.nombre} — VitaliStore`} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

                .subcat-card {
                    background:rgba(255,255,255,0.04); backdrop-filter:blur(22px) saturate(150%);
                    -webkit-backdrop-filter:blur(22px) saturate(150%); border-radius:24px;
                    border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 12px 40px rgba(180,90,20,0.07),0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    overflow:hidden; transition:all 0.32s cubic-bezier(0.16,1,0.3,1);
                    text-decoration:none; display:block; position:relative;
                }
                .subcat-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }
                .subcat-card:hover {
                    transform:translateY(-5px) scale(1.01);
                    box-shadow:0 24px 60px rgba(180,90,20,0.12),0 8px 24px rgba(180,90,20,0.07);
                    border-color:rgba(255,255,255,0.85);
                }
                .subcat-img { width:100%; height:200px; object-fit:cover; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
                .subcat-card:hover .subcat-img { transform:scale(1.05); }
                .subcat-placeholder { width:100%; height:200px; display:flex; align-items:center; justify-content:center; font-size:3.5rem; background:rgba(255,255,255,0.04); }

                .breadcrumb-link {
                    display:inline-flex; align-items:center; gap:0.3rem;
                    font-size:0.82rem; color:rgba(150,80,20,0.65); text-decoration:none;
                    padding:0.3rem 0.6rem; border-radius:8px; transition:all 0.15s;
                }
                .breadcrumb-link:hover { color:rgba(120,50,10,0.9); background:rgba(255,255,255,0.2); }
                .breadcrumb-sep { color:rgba(150,80,20,0.3); font-size:0.8rem; }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.11s both; }
                .anim-3 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.17s both; }
                .anim-4 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.23s both; }
                .anim-5 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.29s both; }
                .anim-6 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
            `}</style>

            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:'0.25rem',marginBottom:'2.5rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="breadcrumb-link">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                        Catálogo
                    </Link>
                    <span className="breadcrumb-sep">›</span>
                    <span style={{fontSize:'0.82rem',fontWeight:'600',color:'rgba(120,55,10,0.85)'}}>{grupo.nombre}</span>
                </div>

                {/* Encabezado */}
                <div style={{marginBottom:'3rem'}}>
                    <h1 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.5rem'}}>
                        {grupo.nombre}
                    </h1>
                    {grupo.descripcion && (
                        <p style={{fontSize:'0.95rem',color:'rgba(150,80,20,0.65)',maxWidth:'480px',lineHeight:'1.6'}}>
                            {grupo.descripcion}
                        </p>
                    )}
                </div>

                {/* Grid */}
                {subcategorias.length === 0 ? (
                    <div style={{textAlign:'center',padding:'4rem 0'}}>
                        <p style={{fontSize:'1rem',color:'rgba(150,80,20,0.5)'}}>No hay subcategorías disponibles.</p>
                        <Link href="/catalogo" style={{display:'inline-block',marginTop:'1rem',color:'rgba(185,28,28,0.8)',textDecoration:'none',fontWeight:'500'}}>
                            ← Volver al catálogo
                        </Link>
                    </div>
                ) : (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.25rem'}}>
                        {subcategorias.map((subcat, idx) => {
                            const animClass = `anim-${Math.min(idx + 1, 6)}`;
                            return (
                                <div key={subcat.id} className={animClass}>
                                    <Link href={`/catalogo/${grupo.id}/${subcat.id}`} className="subcat-card">
                                        <div style={{overflow:'hidden',position:'relative'}}>
                                            {/* ✅ imagen ya viene como URL completa desde el controller */}
                                            {subcat.imagen ? (
                                                <img src={subcat.imagen} alt={subcat.nombre} className="subcat-img" />
                                            ) : (
                                                <div className="subcat-placeholder">👗</div>
                                            )}
                                            <div style={{
                                                position:'absolute',top:'0.75rem',right:'0.75rem',
                                                padding:'0.25rem 0.6rem',background:'rgba(255,255,255,0.88)',
                                                backdropFilter:'blur(8px)',borderRadius:'20px',
                                                fontSize:'0.7rem',fontWeight:'600',color:'rgba(120,55,10,0.8)',
                                            }}>
                                                {subcat.total_productos} prendas
                                            </div>
                                        </div>
                                        <div style={{padding:'1.25rem'}}>
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                                                <div>
                                                    <h3 style={{fontSize:'1.05rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em',marginBottom:'0.15rem'}}>
                                                        {subcat.nombre}
                                                    </h3>
                                                    {subcat.descripcion && (
                                                        <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.6)',lineHeight:'1.4'}}>
                                                            {subcat.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                                <svg width="18" height="18" fill="none" stroke="rgba(150,80,20,0.5)" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                                </svg>
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
