import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const COLORES = [
    { value: 'pink',   label: 'Rosa',    grad: 'linear-gradient(135deg,#ec4899,#f43f5e)' },
    { value: 'blue',   label: 'Azul',    grad: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
    { value: 'violet', label: 'Violeta', grad: 'linear-gradient(135deg,#8b5cf6,#a855f7)' },
    { value: 'green',  label: 'Verde',   grad: 'linear-gradient(135deg,#10b981,#14b8a6)' },
    { value: 'orange', label: 'Naranja', grad: 'linear-gradient(135deg,#fb923c,#f59e0b)' },
    { value: 'teal',   label: 'Cyan',    grad: 'linear-gradient(135deg,#14b8a6,#06b6d4)' },
    { value: 'red',    label: 'Rojo',    grad: 'linear-gradient(135deg,#ef4444,#f43f5e)' },
];

const GRADIENTS = {
    pink:   'linear-gradient(135deg,#ec4899 0%,#f43f5e 50%,#f87171 100%)',
    blue:   'linear-gradient(135deg,#3b82f6 0%,#6366f1 50%,#8b5cf6 100%)',
    violet: 'linear-gradient(135deg,#8b5cf6 0%,#a855f7 50%,#d946ef 100%)',
    green:  'linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#06b6d4 100%)',
    orange: 'linear-gradient(135deg,#fb923c 0%,#f59e0b 50%,#eab308 100%)',
    teal:   'linear-gradient(135deg,#14b8a6 0%,#06b6d4 50%,#0ea5e9 100%)',
    red:    'linear-gradient(135deg,#ef4444 0%,#f43f5e 50%,#ec4899 100%)',
};

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;900&display=swap');
    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .pg-header { background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); border-bottom:1px solid rgba(255,255,255,0.68); box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-panel { background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(150%); -webkit-backdrop-filter:blur(20px) saturate(150%); border:1px solid rgba(255,255,255,0.65); border-radius:20px; box-shadow:0 12px 40px rgba(180,90,20,0.08),inset 0 1.5px 0 rgba(255,255,255,0.85); position:relative; overflow:hidden; padding:1.75rem; }
    .glass-panel::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent); pointer-events:none; z-index:1; }
    .panel-title { font-size:0.95rem; font-weight:600; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:0.25rem; }
    .panel-sub   { font-size:0.74rem; color:rgba(150,80,20,0.5); margin-bottom:1.1rem; }
    .form-label  { display:block; font-size:0.7rem; font-weight:600; color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); box-sizing:border-box; }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.85); }
    .error-text  { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .hint-text   { margin-top:0.3rem; font-size:0.74rem; color:rgba(150,80,20,0.5); }
    /* color swatch */
    .color-swatch { width:100%; height:38px; border-radius:12px; cursor:pointer; border:2px solid transparent; transition:all 0.18s; position:relative; overflow:hidden; }
    .color-swatch.active { border-color:rgba(45,26,8,0.6); transform:scale(1.1); box-shadow:0 4px 14px rgba(0,0,0,0.18); }
    .color-swatch:not(.active) { opacity:0.72; }
    .color-swatch:not(.active):hover { opacity:1; transform:scale(1.06); }
    /* upload */
    .upload-area { border:1.5px dashed rgba(200,140,80,0.35); border-radius:16px; padding:1.5rem 1rem; text-align:center; cursor:pointer; transition:all 0.2s; background:rgba(255,255,255,0.04); }
    .upload-area:hover { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.08); }
    /* btns */
    .btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.7rem 1.1rem; width:100%; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8); text-decoration:none; cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78); font-family:'Inter',sans-serif; }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary-violet { display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; padding:0.7rem 1.25rem; width:100%; background:rgba(139,92,246,0.12); border:1px solid rgba(139,92,246,0.45); border-radius:14px; font-size:0.88rem; font-weight:600; color:rgba(109,40,217,0.95); cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(139,92,246,0.12),inset 0 1px 0 rgba(200,180,255,0.35); font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
    .btn-primary-violet::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(200,180,255,0.8) 40%,rgba(200,180,255,0.8) 60%,transparent); }
    .btn-primary-violet:hover { background:rgba(139,92,246,0.18); border-color:rgba(139,92,246,0.65); transform:translateY(-1px); }
    .btn-primary-violet:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .btn-back { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.65); border-radius:10px; cursor:pointer; text-decoration:none; color:rgba(150,80,20,0.6); transition:all 0.18s; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.72); }
    .btn-back:hover { background:rgba(255,255,255,0.2); color:rgba(120,50,10,0.9); }
    /* preview card */
    .preview-card { border-radius:28px; overflow:hidden; position:relative; min-height:280px; box-shadow:0 16px 48px rgba(0,0,0,0.18); }
    .preview-label-badge { display:inline-flex; align-items:center; background:rgba(255,255,255,0.18); backdrop-filter:blur(8px); color:white; font-size:0.72rem; font-weight:600; padding:0.3rem 0.75rem; border-radius:20px; border:1px solid rgba(255,255,255,0.28); letter-spacing:0.04em; }

    .cg-shell{max-width:1024px;margin:0 auto;padding:2rem 1.5rem}
    .cg-grid{display:grid;grid-template-columns:1fr 320px;gap:1.75rem;align-items:start}
    .cg-actions{display:flex;gap:.65rem}
    @media (max-width:980px){
        .cg-grid{grid-template-columns:1fr}
        .cg-preview{position:static !important;order:-1}
    }
    @media (max-width:640px){
        .cg-shell{padding:1rem .85rem 1.8rem}
        .glass-panel{padding:1.2rem;border-radius:16px}
        .cg-actions{flex-direction:column}
    }
`;

export default function CreateGrupo() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '', descripcion: '', imagen: null, color: 'violet', orden: 0, activo: true,
    });

    const [preview, setPreview] = useState(null);

    const handleImagen = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('imagen', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/categorias', { forceFormData: true });
    };

    const gradient = GRADIENTS[data.color] || GRADIENTS.violet;

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="pg-bg">
                <div className="pg-header">
                    <div style={{ maxWidth:'1024px', margin:'0 auto', padding:'1.5rem' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
                            <Link href="/categorias" className="btn-back">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize:'1.45rem', fontWeight:'300', color:'#2d1a08', letterSpacing:'-0.03em' }}>Nueva Categoría</h1>
                                <p style={{ fontSize:'0.8rem', color:'rgba(150,80,20,0.6)', marginTop:'0.2rem' }}>Crea una categoría principal como Dama, Caballero, Niños, etc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cg-shell">
                    <div className="cg-grid">
                        {/* ── Form ── */}
                        <form onSubmit={submit} encType="multipart/form-data" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

                            {/* Info */}
                            <div className="glass-panel">
                                <p className="panel-title">Información</p>
                                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                                    <div>
                                        <label className="form-label">Nombre <span style={{ color:'rgba(185,28,28,0.8)' }}>*</span></label>
                                        <input type="text" value={data.nombre} onChange={e => setData('nombre', e.target.value)}
                                               placeholder="Ej: Dama, Caballero, Niños, Sport..." className="glass-input"
                                               style={{ fontSize:'1rem', fontWeight:'500' }} />
                                        {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="form-label">Descripción <span style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.45)', textTransform:'none', letterSpacing:0 }}>(opcional)</span></label>
                                        <input type="text" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)}
                                               placeholder="Breve descripción..." className="glass-input" />
                                    </div>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="glass-panel">
                                <p className="panel-title">Color de fondo</p>
                                <p className="panel-sub">Si subes una imagen, esta se usará como fondo en lugar del color</p>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'0.5rem' }}>
                                    {COLORES.map(c => (
                                        <button key={c.value} type="button" onClick={() => setData('color', c.value)}
                                                className={`color-swatch${data.color === c.value ? ' active' : ''}`}
                                                style={{ background: c.grad }} title={c.label}>
                                            {data.color === c.value && (
                                                <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                                    <svg width="16" height="16" fill="white" viewBox="0 0 20 20" style={{ filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Imagen */}
                            <div className="glass-panel">
                                <p className="panel-title">Imagen de portada</p>
                                <p className="panel-sub">Se mostrará como fondo de la tarjeta (reemplaza el color)</p>
                                <label style={{ display:'block' }}>
                                    {preview ? (
                                        <div style={{ position:'relative' }}>
                                            <img src={preview} alt="Preview"
                                                 style={{ width:'100%', height:'160px', objectFit:'cover', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.55)' }} />
                                            <button type="button"
                                                    onClick={e => { e.preventDefault(); setPreview(null); setData('imagen', null); }}
                                                    style={{ position:'absolute', top:'0.5rem', right:'0.5rem', width:'28px', height:'28px', background:'rgba(185,28,28,0.9)', border:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'white', fontSize:'0.75rem' }}>
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="upload-area">
                                            <svg width="28" height="28" fill="none" stroke="rgba(180,100,30,0.35)" viewBox="0 0 24 24" style={{ margin:'0 auto 0.4rem', display:'block' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p style={{ fontSize:'0.82rem', color:'rgba(150,80,20,0.6)', marginBottom:'0.15rem' }}>Clic para subir imagen</p>
                                            <p style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.4)' }}>JPG, PNG, WEBP hasta 4MB</p>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImagen} style={{ display:'none' }} />
                                </label>
                                {errors.imagen && <p className="error-text">{errors.imagen}</p>}
                            </div>

                            {/* Buttons */}
                            <div className="cg-actions">
                                <Link href="/categorias" className="btn-ghost">Cancelar</Link>
                                <button type="submit" disabled={processing} className="btn-primary-violet">
                                    {processing ? 'Creando...' : 'Crear Categoría'}
                                </button>
                            </div>
                        </form>

                        {/* ── Preview ── */}
                        <div className="cg-preview" style={{ position:'sticky', top:'5rem' }}>
                            <p style={{ fontSize:'0.78rem', fontWeight:'600', color:'rgba(150,80,20,0.55)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.85rem' }}>
                                Vista previa
                            </p>
                            <div className="preview-card">
                                {preview ? (
                                    <img src={preview} alt="preview"
                                         style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                                ) : (
                                    <div style={{ position:'absolute', inset:0, background: gradient }} />
                                )}
                                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.26)' }} />
                                <div style={{ position:'absolute', inset:0, opacity:0.08, backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'32px 32px' }} />

                                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'2rem', zIndex:5 }}>
                                    <div style={{ position:'absolute', top:'1.25rem', left:'1.25rem' }}>
                                        <span className="preview-label-badge">Categoría Principal</span>
                                    </div>
                                    <h2 style={{ fontSize:'2.8rem', fontWeight:'900', color:'white', textTransform:'capitalize', letterSpacing:'-0.04em', lineHeight:1, marginBottom:'0.4rem', textShadow:'0 2px 12px rgba(0,0,0,0.28)' }}>
                                        {data.nombre || 'Nombre'}
                                    </h2>
                                    <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.8rem' }}>
                                        {data.descripcion || '0 subcategorías · 0 productos'}
                                    </p>
                                    <div style={{ position:'absolute', bottom:'1.25rem', right:'1.25rem', width:'38px', height:'38px', background:'rgba(255,255,255,0.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.3)' }}>
                                        <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <p style={{ fontSize:'0.7rem', color:'rgba(150,80,20,0.4)', textAlign:'center', marginTop:'0.65rem' }}>
                                Así se verá la tarjeta en la lista
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
