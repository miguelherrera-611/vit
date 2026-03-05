import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const FORM_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .pg-header { background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); border-bottom:1px solid rgba(255,255,255,0.68); box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-panel { background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(150%); -webkit-backdrop-filter:blur(20px) saturate(150%); border:1px solid rgba(255,255,255,0.65); border-radius:20px; box-shadow:0 12px 40px rgba(180,90,20,0.08),0 3px 12px rgba(180,90,20,0.05),inset 0 1.5px 0 rgba(255,255,255,0.85); position:relative; overflow:hidden; padding:1.75rem; }
    .glass-panel::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent); pointer-events:none; z-index:1; }
    .panel-title { font-size:0.95rem; font-weight:600; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:1.25rem; }
    .form-label { display:block; font-size:0.7rem; font-weight:600; color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); box-sizing:border-box; }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),0 3px 12px rgba(160,80,10,0.08),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-textarea { resize:none; }
    .glass-select { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); cursor:pointer; box-sizing:border-box; }
    .glass-select:focus { border-color:rgba(200,140,80,0.65); }
    .prefix-wrap { position:relative; }
    .prefix-symbol { position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:0.9rem; font-weight:500; color:rgba(150,80,20,0.55); pointer-events:none; }
    .prefix-input { padding-left:1.75rem !important; }
    .hint-text { margin-top:0.3rem; font-size:0.74rem; color:rgba(150,80,20,0.5); }
    .error-text { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .margin-panel { border-radius:14px; padding:0.7rem 1rem; display:flex; align-items:center; gap:0.65rem; font-size:0.85rem; }
    .margin-panel.positive { background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.2); }
    .margin-panel.negative { background:rgba(220,38,38,0.05); border:1px solid rgba(220,38,38,0.18); }
    .toggle-track { width:46px; height:24px; border-radius:12px; position:relative; transition:background 0.2s; cursor:pointer; flex-shrink:0; border:1px solid rgba(255,255,255,0.5); }
    .toggle-track.on  { background:rgba(220,38,38,0.22); border-color:rgba(220,38,38,0.35); }
    .toggle-track.off { background:rgba(180,90,20,0.1);  border-color:rgba(180,90,20,0.2); }
    .toggle-thumb { position:absolute; top:2px; width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .toggle-track.on .toggle-thumb  { transform:translateX(22px); }
    .toggle-track.off .toggle-thumb { transform:translateX(2px); }
    .upload-area { border:1.5px dashed rgba(200,140,80,0.35); border-radius:16px; padding:1.5rem 1rem; text-align:center; cursor:pointer; transition:all 0.2s ease; background:rgba(255,255,255,0.04); }
    .upload-area:hover { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.08); }
    .btn-ghost { display:inline-flex; align-items:center; gap:0.4rem; padding:0.65rem 1.1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8); text-decoration:none; cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78); font-family:'Inter',sans-serif; white-space:nowrap; width:100%; justify-content:center; }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary { display:inline-flex; align-items:center; gap:0.4rem; justify-content:center; padding:0.75rem 1.25rem; width:100%; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:14px; font-size:0.88rem; font-weight:500; color:rgba(185,28,28,0.95); cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.28); font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
    .btn-primary::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent); }
    .btn-primary:hover { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.6); transform:translateY(-1px); }
    .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .btn-back { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.65); border-radius:10px; cursor:pointer; text-decoration:none; color:rgba(150,80,20,0.6); transition:all 0.18s; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.72); }
    .btn-back:hover { background:rgba(255,255,255,0.2); color:rgba(120,50,10,0.9); }
`;

export default function ProductosEdit({ producto, categorias = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: producto.nombre || '', descripcion: producto.descripcion || '',
        codigo_barras: producto.codigo_barras || '', categoria: producto.categoria || '',
        precio: producto.precio || '', precio_compra: producto.precio_compra || '',
        stock: producto.stock || '0', stock_minimo: producto.stock_minimo || '5',
        imagen: null, activo: producto.activo ?? true, _method: 'PUT',
    });

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num);
    };

    const submit = (e) => { e.preventDefault(); post(`/productos/${producto.id}`, { forceFormData: true }); };

    return (
        <AppLayout>
            <style>{FORM_STYLES}</style>
            <div className="pg-bg">
                <div className="pg-header">
                    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <Link href="/productos" className="btn-back">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.45rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em' }}>Editar Producto</h1>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.2rem' }}>{producto.nombre}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="glass-panel">
                                    <p className="panel-title">Información Básica</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label className="form-label">Nombre del Producto <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="glass-input" />
                                            {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Descripción</label>
                                            <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} rows={3} className="glass-input glass-textarea" />
                                        </div>
                                        <div>
                                            <label className="form-label">Categoría <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="glass-select">
                                                <option value="">Selecciona una categoría...</option>
                                                {categorias.map((grupo) => (
                                                    <optgroup key={grupo.grupo} label={grupo.grupo}>
                                                        {grupo.opciones.map((op) => (
                                                            <option key={op} value={op}>{op.replace(grupo.grupo + ' - ', '')}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            {errors.categoria && <p className="error-text">{errors.categoria}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Código / SKU</label>
                                            <input type="text" value={data.codigo_barras} onChange={(e) => setData('codigo_barras', e.target.value)} className="glass-input" />
                                            {errors.codigo_barras && <p className="error-text">{errors.codigo_barras}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel">
                                    <p className="panel-title">Precios e Inventario</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="form-label">Precio de Compra <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.5)', textTransform: 'none', letterSpacing: 0 }}>(costo)</span></label>
                                            <div className="prefix-wrap">
                                                <span className="prefix-symbol">$</span>
                                                <input type="number" value={data.precio_compra} onChange={(e) => setData('precio_compra', e.target.value)} className="glass-input prefix-input" min="0" step="100" />
                                            </div>
                                            {data.precio_compra && <p className="hint-text">{formatCurrency(data.precio_compra)}</p>}
                                            {errors.precio_compra && <p className="error-text">{errors.precio_compra}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Precio de Venta <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <div className="prefix-wrap">
                                                <span className="prefix-symbol">$</span>
                                                <input type="number" value={data.precio} onChange={(e) => setData('precio', e.target.value)} className="glass-input prefix-input" min="0" step="100" />
                                            </div>
                                            {data.precio && <p className="hint-text">{formatCurrency(data.precio)}</p>}
                                            {errors.precio && <p className="error-text">{errors.precio}</p>}
                                        </div>

                                        {data.precio_compra > 0 && data.precio > 0 && (
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <div className={`margin-panel ${(data.precio - data.precio_compra) >= 0 ? 'positive' : 'negative'}`}>
                                                    <svg width="15" height="15" fill="none" stroke="rgba(4,120,87,0.8)" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                    <span style={{ color: 'rgba(4,120,87,0.85)', fontWeight: '500' }}>Margen: </span>
                                                    <span style={{ color: 'rgba(4,120,87,0.8)' }}>
                                                        {formatCurrency(data.precio - data.precio_compra)} ({data.precio_compra > 0 ? (((data.precio - data.precio_compra) / data.precio_compra) * 100).toFixed(1) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="form-label">Stock Actual</label>
                                            <input type="number" value={data.stock} onChange={(e) => setData('stock', e.target.value)} className="glass-input" min="0" />
                                            <p className="hint-text">Para ajustar stock usa el módulo de Inventario</p>
                                            {errors.stock && <p className="error-text">{errors.stock}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Stock Mínimo</label>
                                            <input type="number" value={data.stock_minimo} onChange={(e) => setData('stock_minimo', e.target.value)} className="glass-input" min="0" />
                                            {errors.stock_minimo && <p className="error-text">{errors.stock_minimo}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="glass-panel">
                                    <p className="panel-title">Estado</p>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                                           onClick={() => setData('activo', !data.activo)}>
                                        <div className={`toggle-track ${data.activo ? 'on' : 'off'}`}>
                                            <div className="toggle-thumb" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'rgba(120,60,10,0.78)' }}>
                                            {data.activo ? 'Producto Activo' : 'Producto Inactivo'}
                                        </span>
                                    </label>
                                </div>

                                <div className="glass-panel">
                                    <p className="panel-title">Imagen</p>
                                    {producto.imagen && !data.imagen && (
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <img src={`/storage/${producto.imagen}`} alt="Imagen actual"
                                                 style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.55)' }} />
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', textAlign: 'center', marginTop: '0.4rem' }}>Imagen actual</p>
                                        </div>
                                    )}
                                    <div className="upload-area">
                                        {data.imagen ? (
                                            <div>
                                                <img src={URL.createObjectURL(data.imagen)} alt="Preview"
                                                     style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.6rem' }} />
                                                <button type="button" onClick={() => setData('imagen', null)}
                                                        style={{ fontSize: '0.78rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                    Quitar nueva imagen
                                                </button>
                                            </div>
                                        ) : (
                                            <label style={{ cursor: 'pointer', display: 'block' }}>
                                                <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)', marginBottom: '0.2rem' }}>Cambiar imagen</p>
                                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.4)' }}>JPG, PNG, WEBP hasta 2MB</p>
                                                <input type="file" accept="image/*" onChange={(e) => setData('imagen', e.target.files[0])} style={{ display: 'none' }} />
                                            </label>
                                        )}
                                    </div>
                                    {errors.imagen && <p className="error-text">{errors.imagen}</p>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    <button type="submit" disabled={processing} className="btn-primary">
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                    <Link href="/productos" className="btn-ghost">Cancelar</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
