import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .pg-header { background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); border-bottom:1px solid rgba(255,255,255,0.68); box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-panel { background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(150%); -webkit-backdrop-filter:blur(20px) saturate(150%); border:1px solid rgba(255,255,255,0.65); border-radius:20px; box-shadow:0 12px 40px rgba(180,90,20,0.08),inset 0 1.5px 0 rgba(255,255,255,0.85); position:relative; overflow:hidden; padding:1.75rem; }
    .glass-panel::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent); pointer-events:none; z-index:1; }
    .panel-title { font-size:0.95rem; font-weight:600; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:1.1rem; }
    .form-label  { display:block; font-size:0.7rem; font-weight:600; color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); box-sizing:border-box; }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.85); }
    .error-text { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .upload-area { border:1.5px dashed rgba(200,140,80,0.35); border-radius:16px; padding:1.5rem 1rem; text-align:center; cursor:pointer; transition:all 0.2s; background:rgba(255,255,255,0.04); }
    .upload-area:hover { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.08); }
    .btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.7rem 1.1rem; width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8); text-decoration:none; cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78); font-family:'Inter',sans-serif; }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary-violet { display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.7rem 1.25rem; width:100%; background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.45); border-radius:14px; font-size:0.88rem; font-weight:600; color:rgba(109,40,217,0.95); cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(139,92,246,0.12),inset 0 1px 0 rgba(200,180,255,0.35); font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
    .btn-primary-violet::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(200,180,255,0.8) 40%,rgba(200,180,255,0.8) 60%,transparent); }
    .btn-primary-violet:hover { background:rgba(139,92,246,0.18); border-color:rgba(139,92,246,0.65); transform:translateY(-1px); }
    .btn-primary-violet:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .btn-delete { display:inline-flex; align-items:center; gap:0.4rem; padding:0.55rem 1rem; background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.3); border-radius:12px; font-size:0.82rem; font-weight:500; color:rgba(185,28,28,0.85); cursor:pointer; transition:all 0.18s; font-family:'Inter',sans-serif; }
    .btn-delete:hover { background:rgba(220,38,38,0.13); border-color:rgba(220,38,38,0.5); }
    .btn-back { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.65); border-radius:10px; cursor:pointer; text-decoration:none; color:rgba(150,80,20,0.6); transition:all 0.18s; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.72); }
    .btn-back:hover { background:rgba(255,255,255,0.2); color:rgba(120,50,10,0.9); }
    .label-pill { background:rgba(180,90,20,0.05); border:1px solid rgba(200,140,80,0.2); border-radius:14px; padding:0.75rem 1rem; }
`;

export default function EditSubcat({ grupo, subcat }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: subcat.nombre || '', descripcion: subcat.descripcion || '',
        imagen: null, activo: subcat.activo ?? true, _method: 'PUT',
    });

    const [preview,       setPreview]       = useState(null);
    const [showDelete,    setShowDelete]     = useState(false);
    const [delProcessing, setDelProcessing] = useState(false);
    const [delError,      setDelError]      = useState(null);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('imagen', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/categorias/${grupo.id}/subcategorias/${subcat.id}`, { forceFormData: true });
    };

    const handleDelete = (password) => {
        setDelProcessing(true);
        router.delete(`/categorias/${grupo.id}/subcategorias/${subcat.id}`, {
            data: { password },
            onSuccess: () => { setShowDelete(false); setDelProcessing(false); },
            onError: (errs) => { setDelError(errs.password || 'Contraseña incorrecta.'); setDelProcessing(false); },
        });
    };

    const imagenActual = preview ? preview : (subcat.imagen ? `/storage/${subcat.imagen}` : null);

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="pg-bg">
                <div className="pg-header">
                    <div style={{ maxWidth:'680px', margin:'0 auto', padding:'1.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
                                <Link href={`/categorias/${grupo.id}`} className="btn-back">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <p style={{ fontSize:'0.7rem', fontWeight:'600', color:'rgba(150,80,20,0.5)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                                        {grupo.nombre}
                                    </p>
                                    <h1 style={{ fontSize:'1.45rem', fontWeight:'300', color:'#2d1a08', letterSpacing:'-0.03em', lineHeight:1.1 }}>Editar Subcategoría</h1>
                                </div>
                            </div>
                            <button onClick={() => { setShowDelete(true); setDelError(null); }} className="btn-delete">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth:'680px', margin:'0 auto', padding:'2rem 1.5rem' }}>
                    <form onSubmit={submit} encType="multipart/form-data" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                        <div className="glass-panel">
                            <p className="panel-title">Información</p>
                            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                <div>
                                    <label className="form-label">Nombre <span style={{ color:'rgba(185,28,28,0.8)' }}>*</span></label>
                                    <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)} className="glass-input" />
                                    {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="form-label">Descripción</label>
                                    <input type="text" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} className="glass-input" />
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel">
                            <p className="panel-title">Imagen</p>
                            <label style={{ display:'block' }}>
                                {imagenActual ? (
                                    <div style={{ position:'relative' }}>
                                        <img src={imagenActual} alt="Subcategoría"
                                             style={{ width:'100%', height:'150px', objectFit:'cover', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.55)' }} />
                                        <div style={{ position:'absolute', inset:0, borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0)', fontSize:'0.8rem', color:'white', fontWeight:'500', transition:'background 0.18s' }}
                                             onMouseOver={e => e.currentTarget.style.background='rgba(0,0,0,0.3)'}
                                             onMouseOut={e => e.currentTarget.style.background='rgba(0,0,0,0)'}>
                                            Cambiar imagen
                                        </div>
                                    </div>
                                ) : (
                                    <div className="upload-area">
                                        <svg width="28" height="28" fill="none" stroke="rgba(180,100,30,0.35)" viewBox="0 0 24 24" style={{ margin:'0 auto 0.4rem', display:'block' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p style={{ fontSize:'0.82rem', color:'rgba(150,80,20,0.6)', marginBottom:'0.15rem' }}>Subir imagen</p>
                                        <p style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.4)' }}>JPG, PNG, WEBP hasta 2MB</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImagen} style={{ display:'none' }} />
                            </label>
                            {errors.imagen && <p className="error-text">{errors.imagen}</p>}
                        </div>

                        {/* Label pill */}
                        <div className="label-pill">
                            <p style={{ fontSize:'0.72rem', fontWeight:'600', color:'rgba(150,80,20,0.6)', letterSpacing:'0.04em', marginBottom:'0.2rem' }}>Label en productos:</p>
                            <p style={{ fontSize:'0.9rem', fontWeight:'700', color:'#2d1a08' }}>
                                {grupo.nombre} – {data.nombre || subcat.nombre}
                            </p>
                        </div>

                        <div style={{ display:'flex', gap:'0.65rem' }}>
                            <Link href={`/categorias/${grupo.id}`} className="btn-ghost">Cancelar</Link>
                            <button type="submit" disabled={processing} className="btn-primary-violet">
                                {processing ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <PasswordConfirmModal
                open={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar "${subcat.nombre}"?`}
                description="Los productos de esta subcategoría se moverán a la papelera. Podrás recuperarlos en 30 días."
                confirmLabel="Eliminar"
            />
        </AppLayout>
    );
}
