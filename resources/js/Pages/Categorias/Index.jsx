import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const GRADIENTS = {
    pink:   'from-pink-500 via-rose-500 to-red-400',
    blue:   'from-blue-500 via-indigo-500 to-violet-500',
    violet: 'from-violet-500 via-purple-500 to-fuchsia-500',
    green:  'from-emerald-500 via-teal-500 to-cyan-500',
    orange: 'from-orange-400 via-amber-500 to-yellow-400',
    teal:   'from-teal-500 via-cyan-500 to-sky-500',
    red:    'from-red-500 via-rose-500 to-pink-400',
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
    .pg-header { background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); border-bottom:1px solid rgba(255,255,255,0.68); box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85); }
    .btn-ghost { display:inline-flex; align-items:center; gap:0.4rem; padding:0.65rem 1.1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8); text-decoration:none; cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78); font-family:'Inter',sans-serif; white-space:nowrap; }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary { display:inline-flex; align-items:center; gap:0.4rem; padding:0.65rem 1.25rem; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(185,28,28,0.95); text-decoration:none; cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.28); font-family:'Inter',sans-serif; white-space:nowrap; position:relative; overflow:hidden; }
    .btn-primary::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent); }
    .btn-primary:hover { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.6); transform:translateY(-1px); }
    /* grupo card overlay */
    .grupo-card { position:relative; border-radius:28px; overflow:hidden; min-height:280px; cursor:pointer; transition:transform 0.3s ease, box-shadow 0.3s ease; }
    .grupo-card:hover { transform:translateY(-4px); box-shadow:0 24px 64px rgba(0,0,0,0.22) !important; }
    .grupo-actions { position:absolute; top:1rem; right:1rem; display:flex; gap:0.5rem; opacity:0; transition:opacity 0.2s; z-index:20; }
    .grupo-card:hover .grupo-actions { opacity:1; }
    .group-action-btn { width:36px; height:36px; background:rgba(255,255,255,0.92); border:none; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#555; transition:all 0.15s; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
    .group-action-btn:hover { background:white; }
    .group-action-btn.edit:hover  { color:rgba(109,40,217,0.9); }
    .group-action-btn.del:hover   { color:rgba(185,28,28,0.9); }
`;

function GrupoCard({ grupo, onEdit, onDelete }) {
    const gradient = GRADIENTS[grupo.color] || GRADIENTS.violet;
    const hasImg   = !!grupo.imagen;

    return (
        <div className="grupo-card" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.14)' }}>
            {hasImg ? (
                <img src={`/storage/${grupo.imagen}`} alt={grupo.nombre}
                     style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} style={{ position: 'absolute', inset: 0 }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.26)' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Edit/delete buttons */}
            <div className="grupo-actions">
                <button className="group-action-btn edit" onClick={(e) => { e.preventDefault(); onEdit(grupo); }} title="Editar">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button className="group-action-btn del" onClick={(e) => { e.preventDefault(); onDelete(grupo); }} title="Eliminar">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <Link href={`/categorias/${grupo.id}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem', zIndex: 10, textDecoration: 'none' }}>
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.7rem', fontWeight: '600', padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
                        Categoría Principal
                    </span>
                </div>
                <div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', textTransform: 'capitalize', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.4rem', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                        {grupo.nombre}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.78)', fontSize: '0.82rem' }}>
                        <span>{grupo.total_subcat} subcategorías</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>{grupo.total_productos} productos</span>
                    </div>
                    {grupo.descripcion && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{grupo.descripcion}</p>}
                </div>
                {/* Arrow */}
                <div style={{ position: 'absolute', bottom: '1.25rem', right: '1.25rem', width: '40px', height: '40px', background: 'rgba(255,255,255,0.18)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.28)' }}>
                    <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </div>
    );
}

export default function CategoriasIndex({ grupos = [] }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [processing,   setProcessing]   = useState(false);
    const [pwdError,     setPwdError]     = useState(null);
    const [currentPage,  setCurrentPage]  = useState(1);
    const PER_PAGE = 12;

    const gruposPaginados = useMemo(
        () => grupos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [grupos, currentPage]
    );

    const handleDelete = (password) => {
        setProcessing(true);
        router.delete(`/categorias/${deleteTarget.id}`, {
            data: { password },
            onSuccess: () => { setDeleteTarget(null); setProcessing(false); setPwdError(null); },
            onError:   (errs) => { setPwdError(errs.password || 'Contraseña incorrecta.'); setProcessing(false); },
        });
    };

    return (
        <AppLayout>
            <style>{PAGE_STYLES}</style>
            <div className="pg-bg">
                <div className="pg-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: '1.6rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em' }}>Categorías</h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Haz clic en una categoría para ver sus subcategorías y productos
                                </p>
                            </div>
                            <Link href="/categorias/crear" className="btn-primary">
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Nueva Categoría
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    {grupos.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', backdropFilter: 'blur(12px)' }}>
                                <svg width="28" height="28" fill="none" stroke="rgba(180,100,30,0.4)" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <p style={{ fontSize: '1rem', fontWeight: '500', color: '#2d1a08', marginBottom: '0.4rem' }}>No hay categorías todavía</p>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)' }}>Crea tu primera categoría con el botón de arriba</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {gruposPaginados.map((grupo) => (
                                <GrupoCard
                                    key={grupo.id}
                                    grupo={grupo}
                                    onEdit={(g) => { window.location.href = `/categorias/${g.id}/edit`; }}
                                    onDelete={(g) => { setDeleteTarget(g); setPwdError(null); }}
                                />
                            ))}
                        </div>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalItems={grupos.length}
                        perPage={PER_PAGE}
                        onPageChange={setCurrentPage}
                        accentColor="violet"
                    />
                </div>
            </div>

            <PasswordConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                processing={processing}
                error={pwdError}
                title={`¿Eliminar "${deleteTarget?.nombre}"?`}
                description={<span>Se eliminarán todas las <strong>subcategorías y productos</strong>.<br /><strong>Podrás recuperarlos desde la papelera durante 30 días.</strong></span>}
                confirmLabel="Sí, eliminar"
            />
        </AppLayout>
    );
}
