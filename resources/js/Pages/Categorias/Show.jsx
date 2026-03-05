import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const GRADIENTS = {
    pink:   'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f87171 100%)',
    blue:   'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
    violet: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
    green:  'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
    orange: 'linear-gradient(135deg, #fb923c 0%, #f59e0b 50%, #eab308 100%)',
    teal:   'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0ea5e9 100%)',
    red:    'linear-gradient(135deg, #ef4444 0%, #f43f5e 50%, #ec4899 100%)',
};

const SOFT = {
    pink:   { border: 'rgba(236,72,153,0.25)',  bg: 'rgba(236,72,153,0.07)',  text: 'rgba(190,24,93,0.85)',  badge: 'rgba(236,72,153,0.12)', badgeText: 'rgba(157,23,77,0.9)'  },
    blue:   { border: 'rgba(59,130,246,0.25)',  bg: 'rgba(59,130,246,0.07)',  text: 'rgba(29,78,216,0.85)',  badge: 'rgba(59,130,246,0.12)', badgeText: 'rgba(29,78,216,0.9)'  },
    violet: { border: 'rgba(139,92,246,0.25)',  bg: 'rgba(139,92,246,0.07)',  text: 'rgba(109,40,217,0.85)', badge: 'rgba(139,92,246,0.12)', badgeText: 'rgba(109,40,217,0.9)' },
    green:  { border: 'rgba(16,185,129,0.25)',  bg: 'rgba(16,185,129,0.07)',  text: 'rgba(4,120,87,0.85)',   badge: 'rgba(16,185,129,0.12)', badgeText: 'rgba(4,120,87,0.9)'   },
    orange: { border: 'rgba(249,115,22,0.25)',  bg: 'rgba(249,115,22,0.07)',  text: 'rgba(194,65,12,0.85)',  badge: 'rgba(249,115,22,0.12)', badgeText: 'rgba(154,52,18,0.9)'  },
    teal:   { border: 'rgba(20,184,166,0.25)',  bg: 'rgba(20,184,166,0.07)',  text: 'rgba(15,118,110,0.85)', badge: 'rgba(20,184,166,0.12)', badgeText: 'rgba(15,118,110,0.9)' },
    red:    { border: 'rgba(220,38,38,0.25)',   bg: 'rgba(220,38,38,0.07)',   text: 'rgba(185,28,28,0.85)',  badge: 'rgba(220,38,38,0.12)', badgeText: 'rgba(153,27,27,0.9)'  },
};

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const PAGE_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;900&display=swap');
    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }

    /* Banner */
    .cat-banner {
        position:relative; overflow:hidden; min-height:220px;
    }
    .cat-banner::after {
        content:''; position:absolute; inset:0;
        background:rgba(0,0,0,0.28); pointer-events:none;
    }
    .banner-dot-pattern {
        position:absolute; inset:0; opacity:0.09;
        background-image:radial-gradient(circle, white 1px, transparent 1px);
        background-size:32px 32px; pointer-events:none; z-index:1;
    }

    /* Banner glass btns */
    .banner-btn-ghost {
        display:inline-flex; align-items:center; gap:0.5rem;
        padding:0.55rem 1.1rem;
        background:rgba(255,255,255,0.16);
        backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.32); border-radius:14px;
        font-size:0.82rem; font-weight:500; color:rgba(255,255,255,0.88);
        text-decoration:none; transition:all 0.18s; cursor:pointer;
    }
    .banner-btn-ghost:hover { background:rgba(255,255,255,0.26); border-color:rgba(255,255,255,0.5); }
    .banner-btn-white {
        display:inline-flex; align-items:center; gap:0.5rem;
        padding:0.55rem 1.1rem;
        background:rgba(255,255,255,0.9);
        backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
        border:1px solid rgba(255,255,255,0.7); border-radius:14px;
        font-size:0.82rem; font-weight:600; color:#2d1a08;
        text-decoration:none; transition:all 0.18s; cursor:pointer;
        box-shadow:0 4px 16px rgba(0,0,0,0.14);
    }
    .banner-btn-white:hover { background:white; box-shadow:0 6px 22px rgba(0,0,0,0.18); }

    /* Subcat card */
    .subcat-card {
        background:rgba(255,255,255,0.06);
        backdrop-filter:blur(18px) saturate(150%);
        -webkit-backdrop-filter:blur(18px) saturate(150%);
        border-radius:20px; overflow:hidden;
        transition:transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s;
        position:relative;
    }
    .subcat-card::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.88) 30%,rgba(255,255,255,0.88) 70%,transparent);
        pointer-events:none; z-index:2;
    }
    .subcat-card:hover { transform:translateY(-3px); }

    /* icon-btn */
    .icon-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:none; border:none; cursor:pointer; border-radius:9px; color:rgba(150,80,20,0.45); transition:all 0.15s; }
    .icon-btn:hover { background:rgba(255,255,255,0.3); color:rgba(120,50,10,0.85); }
    .icon-btn.danger:hover { background:rgba(220,38,38,0.08); color:rgba(185,28,28,0.85); }

    /* btn-primary */
    .btn-primary {
        display:inline-flex; align-items:center; gap:0.4rem;
        padding:0.65rem 1.25rem;
        background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:14px;
        font-size:0.85rem; font-weight:500; color:rgba(185,28,28,0.95);
        text-decoration:none; cursor:pointer; transition:all 0.2s ease;
        backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.28);
        font-family:'Inter',sans-serif; white-space:nowrap; position:relative; overflow:hidden;
    }
    .btn-primary::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent); }
    .btn-primary:hover { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.6); transform:translateY(-1px); }

    /* empty state box */
    .empty-box {
        background:rgba(255,255,255,0.08);
        border:1px solid rgba(255,255,255,0.55); border-radius:20px;
        width:64px; height:64px; display:flex; align-items:center; justify-content:center;
        margin:0 auto 1.25rem; backdrop-filter:blur(12px);
    }

    @keyframes staggerUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
    .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.04s both; }
    .anim-2 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
    .anim-3 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
    .anim-4 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s both; }
    .anim-5 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
    .anim-6 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
    .anim-7 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
    .anim-8 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
`;

export default function CategoriasShow({ grupo, subcategorias = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing,   setProcessing]   = useState(false);
    const [pwdError,     setPwdError]     = useState(null);

    const gradient = GRADIENTS[grupo.color] || GRADIENTS.violet;
    const soft     = SOFT[grupo.color]     || SOFT.violet;
    const hasImg   = !!grupo.imagen;

    const totalProductos = subcategorias.reduce((s, c) => s + (c.total_productos || 0), 0);

    const ANIM = ['anim-1','anim-2','anim-3','anim-4','anim-5','anim-6','anim-7','anim-8'];

    const handleDelete = (password) => {
        setProcessing(true);
        router.delete(`/categorias/${grupo.id}/subcategorias/${deleteTarget.id}`, {
            data: { password },
            onSuccess: () => { setDeleteTarget(null); setProcessing(false); setPwdError(null); },
            onError:   (errs) => { setPwdError(errs.password || 'Contraseña incorrecta.'); setProcessing(false); },
        });
    };

    return (
        <AppLayout>
            <style>{PAGE_STYLES}</style>
            <div className="pg-bg">

                {/* ── Banner ── */}
                <div className="cat-banner">
                    {hasImg ? (
                        <img src={`/storage/${grupo.imagen}`} alt={grupo.nombre}
                             style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                    ) : (
                        <div style={{ position:'absolute', inset:0, background: gradient }} />
                    )}
                    <div className="banner-dot-pattern" />

                    <div style={{ position:'relative', zIndex:2, maxWidth:'1280px', margin:'0 auto', padding:'2.5rem 1.5rem', display:'flex', flexDirection:'column', justifyContent:'flex-end', minHeight:'220px' }}>
                        {/* Breadcrumb */}
                        <Link
                            href="/categorias"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.7rem',
                                color: '#ffffff',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                textDecoration: 'none',
                                transition: 'color 0.15s'
                            }}
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Categorías
                        </Link>

                        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
                            <div>
                                <h1 style={{ fontSize:'3.5rem', fontWeight:'900', color:'white', textTransform:'capitalize', letterSpacing:'-0.04em', lineHeight:1, textShadow:'0 2px 16px rgba(0,0,0,0.28)', marginBottom:'0.4rem' }}>
                                    {grupo.nombre}
                                </h1>
                                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.82rem' }}>
                                    {subcategorias.length} subcategorías · {totalProductos} productos
                                </p>
                            </div>
                            <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
                                <Link href={`/categorias/${grupo.id}/subcategorias/crear`} className="banner-btn-white">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nueva subcategoría
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Subcategorías ── */}
                <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'2rem 1.5rem' }}>
                    {subcategorias.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
                            <div className="empty-box">
                                <svg width="26" height="26" fill="none" stroke={soft.text} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <p style={{ fontWeight:'500', color:'#2d1a08', marginBottom:'0.3rem' }}>No hay subcategorías todavía</p>
                            <p style={{ fontSize:'0.82rem', color:'rgba(150,80,20,0.55)', marginBottom:'1.25rem' }}>Agrega la primera subcategoría</p>
                            <Link href={`/categorias/${grupo.id}/subcategorias/crear`} className="btn-primary">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Agregar subcategoría
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.25rem' }}>
                            {subcategorias.map((sub, i) => (
                                <div key={sub.id}
                                     className={`subcat-card ${ANIM[i % 8]}`}
                                     style={{
                                         border:`1px solid ${soft.border}`,
                                         boxShadow:`0 8px 28px ${soft.bg}, 0 2px 8px rgba(180,90,20,0.05), inset 0 -1px 0 rgba(180,90,20,0.03)`,
                                     }}
                                >
                                    {/* Image area */}
                                    <div style={{ height:'120px', overflow:'hidden', position:'relative' }}>
                                        {sub.imagen ? (
                                            <img src={`/storage/${sub.imagen}`} alt={sub.nombre}
                                                 style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
                                                 onMouseOver={e => e.currentTarget.style.transform='scale(1.05)'}
                                                 onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
                                            />
                                        ) : (
                                            <div style={{ width:'100%', height:'100%', background:`${soft.bg}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                <svg width="32" height="32" fill="none" stroke={soft.text} style={{ opacity:0.5 }} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding:'1rem' }}>
                                        <h3 style={{ fontWeight:'600', color:'#2d1a08', fontSize:'0.92rem', marginBottom:'0.5rem' }}>{sub.nombre}</h3>
                                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.35rem' }}>
                                            <span style={{
                                                fontSize:'0.72rem', fontWeight:'600', padding:'0.2rem 0.65rem', borderRadius:'20px',
                                                background: soft.badge, color: soft.badgeText,
                                                border:`1px solid ${soft.border}`,
                                            }}>
                                                {sub.total_productos} prod.
                                            </span>
                                        </div>
                                        {sub.descripcion && (
                                            <p style={{ fontSize:'0.74rem', color:'rgba(150,80,20,0.5)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                {sub.descripcion}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'0.85rem', paddingTop:'0.75rem', borderTop:`1px solid rgba(200,140,80,0.12)` }}>
                                            <Link
                                                href={`/categorias/${grupo.id}/subcategorias/${sub.id}/edit`}
                                                style={{
                                                    flex:1, textAlign:'center', fontSize:'0.78rem', fontWeight:'500',
                                                    padding:'0.4rem 0', borderRadius:'10px',
                                                    background: soft.bg, color: soft.text,
                                                    textDecoration:'none', transition:'all 0.15s',
                                                    border:`1px solid ${soft.border}`,
                                                }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                className="icon-btn danger"
                                                onClick={() => { setDeleteTarget(sub); setPwdError(null); }}
                                                style={{ marginLeft:'0.5rem', flexShrink:0 }}
                                                title="Eliminar"
                                            >
                                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PasswordConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                processing={processing}
                error={pwdError}
                title={`¿Eliminar "${deleteTarget?.nombre}"?`}
                description="Los productos de esta subcategoría se moverán a la papelera. Podrás recuperarlos en 30 días."
                confirmLabel="Sí, eliminar"
            />
        </AppLayout>
    );
}
