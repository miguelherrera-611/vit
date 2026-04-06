// resources/js/Pages/Cliente/Checkout.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const METODO_ESTILOS = {
    Nequi:       { color: 'rgba(139,92,246,0.85)',  bg: 'rgba(139,92,246,0.06)',  border: 'rgba(139,92,246,0.22)'  },
    Daviplata:   { color: 'rgba(220,38,38,0.85)',   bg: 'rgba(220,38,38,0.05)',   border: 'rgba(220,38,38,0.18)'  },
    Bancolombia: { color: 'rgba(180,120,0,0.9)',    bg: 'rgba(202,138,4,0.05)',   border: 'rgba(202,138,4,0.2)'   },
    Davivienda:  { color: 'rgba(185,28,28,0.85)',   bg: 'rgba(185,28,28,0.05)',   border: 'rgba(185,28,28,0.18)'  },
};

export default function Checkout({ metodosPago = [], contacto = {} }) {
    const { auth } = usePage().props;
    const [carrito, setCarrito]       = useState([]);
    const [paso, setPaso]             = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors]         = useState({});
    const [preview, setPreview]       = useState(null);
    const [isMobile, setIsMobile]     = useState(false);
    const [qrFullscreen, setQrFullscreen] = useState(null);

    const [form, setForm] = useState({
        nombre_receptor:   auth.user?.name ?? '',
        telefono_receptor: '',
        ciudad:            '',
        direccion:         '',
        indicaciones:      '',
        metodo_pago:       '',
        comprobante:       null,
    });

    useEffect(() => {
        const saved = sessionStorage.getItem('vitali_carrito');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length === 0) { router.visit('/catalogo'); return; }
            setCarrito(parsed);
        } else {
            router.visit('/catalogo');
        }
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (!qrFullscreen) return;
        const onKey = (e) => { if (e.key === 'Escape') setQrFullscreen(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [qrFullscreen]);

    const total              = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const metodoSeleccionado = metodosPago.find((m) => m.id === form.metodo_pago);
    const estiloSeleccionado = METODO_ESTILOS[form.metodo_pago] ?? {};
    const telefonos          = [contacto.telefono1, contacto.telefono2].filter(Boolean);
    const correos            = [contacto.correo1,   contacto.correo2].filter(Boolean);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleComprobante = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        set('comprobante', file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const validarPaso1 = () => {
        const e = {};
        if (!form.nombre_receptor.trim())   e.nombre_receptor   = 'El nombre es obligatorio.';
        if (!form.telefono_receptor.trim()) e.telefono_receptor = 'El teléfono es obligatorio.';
        if (!form.ciudad.trim())            e.ciudad            = 'La ciudad es obligatoria.';
        if (!form.direccion.trim())         e.direccion         = 'La dirección es obligatoria.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validarPaso2 = () => {
        const e = {};
        if (!form.metodo_pago) e.metodo_pago = 'Selecciona un método de pago.';
        if (!form.comprobante) e.comprobante = 'Debes adjuntar el comprobante de pago.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = () => {
        if (!validarPaso2()) return;
        setProcessing(true);
        const data = new FormData();
        data.append('nombre_receptor',   form.nombre_receptor);
        data.append('telefono_receptor', form.telefono_receptor);
        data.append('ciudad',            form.ciudad);
        data.append('direccion',         form.direccion);
        data.append('indicaciones',      form.indicaciones ?? '');
        data.append('metodo_pago',       form.metodo_pago);
        data.append('comprobante_pago',  form.comprobante);
        data.append('email_cliente',     auth.user?.email ?? '');
        carrito.forEach((item, idx) => {
            data.append(`items[${idx}][producto_id]`,     item.id);
            data.append(`items[${idx}][cantidad]`,        item.cantidad);
            data.append(`items[${idx}][precio_unitario]`, item.precio);
        });
        router.post('/cliente/pedidos', data, {
            forceFormData: true,
            onSuccess: () => { sessionStorage.removeItem('vitali_carrito'); setProcessing(false); },
            onError:   (errs) => { setErrors(errs); setProcessing(false); },
        });
    };

    const imgSrc = (imagen) => {
        if (!imagen) return null;
        return imagen.startsWith('http') ? imagen : `/storage/${imagen}`;
    };

    if (carrito.length === 0) return null;

    return (
        <ClienteLayout>
            <Head title="Checkout — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

                .ck-label {
                    display:block; font-size:0.68rem; font-weight:500;
                    color:rgba(150,80,20,0.5); text-transform:uppercase;
                    letter-spacing:0.07em; margin-bottom:0.4rem;
                }
                .ck-input {
                    width:100%; padding:0.75rem 0.875rem;
                    background:rgba(255,255,255,0.55); border:1px solid rgba(200,140,80,0.2);
                    border-radius:10px; font-size:0.85rem; color:#2d1a08;
                    font-family:'Inter',sans-serif; outline:none; transition:all 0.15s;
                    box-sizing:border-box; letter-spacing:-0.01em;
                }
                .ck-input::placeholder { color:rgba(180,100,30,0.3); }
                .ck-input:focus {
                    background:rgba(255,255,255,0.8); border-color:rgba(200,140,80,0.38);
                    box-shadow:0 0 0 3px rgba(200,140,80,0.06);
                }
                .ck-error { margin-top:0.3rem; font-size:0.74rem; color:rgba(185,28,28,0.8); }

                .metodo-card {
                    padding:0.875rem 1rem; border-radius:10px; cursor:pointer;
                    transition:all 0.15s; display:flex; align-items:flex-start; gap:0.75rem;
                    background:rgba(255,255,255,0.4); border:1.5px solid rgba(200,140,80,0.12);
                    margin-bottom:0.5rem;
                }
                .metodo-card:hover { background:rgba(255,255,255,0.6); border-color:rgba(200,140,80,0.22); }

                .radio-circle {
                    width:18px; height:18px; border-radius:50%; flex-shrink:0; margin-top:0.14rem;
                    border:1.5px solid rgba(200,140,80,0.3); transition:all 0.15s;
                    display:flex; align-items:center; justify-content:center;
                }
                .radio-dot { width:7px; height:7px; border-radius:50%; background:white; }

                .upload-zone {
                    border:1.5px dashed rgba(200,140,80,0.28); border-radius:12px;
                    padding:1.75rem; text-align:center; cursor:pointer;
                    transition:all 0.15s; background:rgba(255,255,255,0.3);
                }
                .upload-zone:hover { border-color:rgba(185,28,28,0.3); background:rgba(185,28,28,0.02); }
                .upload-zone.has-file { border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.03); }

                .paso-indicator {
                    display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:2.5rem;
                }
                .paso-step { display:flex; align-items:center; }
                .paso-circle {
                    width:28px; height:28px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:0.72rem; font-weight:500; transition:all 0.25s;
                }
                .paso-circle.done    { background:rgba(16,185,129,0.1);  border:1.5px solid rgba(16,185,129,0.35); color:rgba(4,120,87,0.85); }
                .paso-circle.active  { background:rgba(185,28,28,0.08);  border:1.5px solid rgba(185,28,28,0.3);  color:rgba(185,28,28,0.9); }
                .paso-circle.pending { background:rgba(200,140,80,0.05); border:1.5px solid rgba(200,140,80,0.18); color:rgba(150,80,20,0.4); }
                .paso-line      { width:56px; height:1px; background:rgba(200,140,80,0.15); }
                .paso-line.done { background:rgba(16,185,129,0.3); }

                .btn-nav { padding:0.75rem 1.5rem; border-radius:10px; font-family:'Inter',sans-serif; font-size:0.86rem; font-weight:500; cursor:pointer; transition:all 0.18s; border:none; letter-spacing:-0.01em; }
                .btn-next { background:rgba(185,28,28,0.08); border:1px solid rgba(185,28,28,0.22); color:rgba(185,28,28,0.9); }
                .btn-next:hover:not(:disabled) { background:rgba(185,28,28,0.13); border-color:rgba(185,28,28,0.35); }
                .btn-next:disabled { opacity:0.4; cursor:not-allowed; }
                .btn-back { background:rgba(255,255,255,0.4); border:1px solid rgba(200,140,80,0.18); color:rgba(120,60,10,0.65); }
                .btn-back:hover { background:rgba(255,255,255,0.65); }

                .section-card {
                    background:rgba(255,255,255,0.45); border:1px solid rgba(200,140,80,0.12);
                    border-radius:18px; padding:1.75rem;
                    animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .contact-box {
                    margin-top:1.25rem; padding:0.875rem 1rem; border-radius:10px;
                    background:rgba(255,255,255,0.35); border:1px solid rgba(200,140,80,0.12);
                }

                /* QR pequeño en card de método */
                .qr-thumb-img{
                    width: 52px;
                    height: 52px;
                    border-radius: 8px;
                    object-fit: contain;
                    border: 1px solid rgba(200,140,80,0.15);
                    background: rgba(255,255,255,0.55);
                    flex-shrink: 0;
                }

                /* QR grande en bloque inferior seleccionado */
                .qr-preview-img{
                    width: min(92vw, 460px);
                    height: auto;
                    aspect-ratio: 1 / 1;
                    display: block;
                    margin: 0 auto;
                    border-radius: 14px;
                    object-fit: contain;
                    border: 1px solid rgba(200,140,80,0.15);
                    background: rgba(255,255,255,0.55);
                    cursor: zoom-in;
                    transition: transform .16s ease, box-shadow .16s ease;
                }
                .qr-preview-img:hover{
                    transform: scale(1.01);
                    box-shadow: 0 10px 28px rgba(180,90,20,0.16);
                }

                @media (max-width: 767px) {
                    .qr-preview-img{
                        width: min(94vw, 420px);
                    }
                }

                .qr-fullscreen-overlay{
                    position: fixed;
                    inset: 0;
                    z-index: 400;
                    background: rgba(0,0,0,0.88);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn .18s ease both;
                }
                .qr-fullscreen-img{
                    max-width: 92vw;
                    max-height: 88vh;
                    object-fit: contain;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.22);
                    background: rgba(255,255,255,0.04);
                }
                .qr-close-btn{
                    position: fixed;
                    top: 14px;
                    right: 14px;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    background: rgba(255,255,255,0.12);
                    color: #fff;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                }

                @media (max-width: 767px) {
                    .ck-layout {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .ck-resumen {
                        position: static;
                        order: -1;
                        padding: 1rem;
                        border-radius: 14px;
                    }
                    .ck-form-grid-2 {
                        grid-template-columns: 1fr;
                    }
                    .section-card {
                        padding: 1.25rem;
                        border-radius: 14px;
                    }
                    .paso-line {
                        width: 40px;
                    }
                    .btn-nav {
                        padding: 0.75rem 1.1rem;
                        font-size: 0.82rem;
                        flex: 1;
                        text-align: center;
                    }
                    .ck-btn-row {
                        flex-direction: row;
                    }
                }

                @media (max-width: 400px) {
                    .paso-line { width: 28px; }
                }

                .qr-info-box{
                    margin-top:0.75rem;
                    padding:0.9rem;
                    text-align:center;
                    background:rgba(255,255,255,0.42);
                    border:1px solid rgba(200,140,80,0.15);
                    border-radius:0;
                }
            `}</style>

            <div style={{maxWidth:'1060px',margin:'0 auto',padding:'2rem 1rem 4rem'}}>
                <div style={{marginBottom:'1.75rem',animation:'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <h1 style={{fontSize:'1.5rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.25rem'}}>
                        Finalizar compra
                    </h1>
                    <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.55)'}}>Completa tu pedido en dos pasos</p>
                </div>

                {/* Indicador de pasos */}
                <div className="paso-indicator">
                    {['Datos de envío', 'Pago'].map((label, i) => (
                        <div key={i} className="paso-step">
                            {i > 0 && <div className={`paso-line${paso > i ? ' done' : ''}`}/>}
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.3rem'}}>
                                <div className={`paso-circle${paso > i+1 ? ' done' : paso === i+1 ? ' active' : ' pending'}`}>
                                    {paso > i+1
                                        ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        : i+1
                                    }
                                </div>
                                <span style={{fontSize:'0.68rem',fontWeight:'500',letterSpacing:'0.02em',
                                    color:paso===i+1?'rgba(185,28,28,0.8)':'rgba(150,80,20,0.4)'}}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="ck-layout">

                    {/* Panel principal */}
                    <div>

                        {/* ── PASO 1: ENVÍO ── */}
                        {paso === 1 && (
                            <div className="section-card">
                                <h2 style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',marginBottom:'1.5rem',letterSpacing:'-0.01em'}}>
                                    Datos de envío
                                </h2>

                                <div className="ck-form-grid-2">
                                    <div>
                                        <label className="ck-label">Nombre completo</label>
                                        <input className="ck-input" value={form.nombre_receptor}
                                               onChange={(e) => set('nombre_receptor', e.target.value)}
                                               placeholder="¿A nombre de quién?"/>
                                        {errors.nombre_receptor && <p className="ck-error">{errors.nombre_receptor}</p>}
                                    </div>
                                    <div>
                                        <label className="ck-label">Teléfono de contacto</label>
                                        <input className="ck-input" type="tel" value={form.telefono_receptor}
                                               onChange={(e) => set('telefono_receptor', e.target.value)}
                                               placeholder="3001234567"/>
                                        {errors.telefono_receptor && <p className="ck-error">{errors.telefono_receptor}</p>}
                                    </div>
                                </div>

                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Ciudad</label>
                                    <input className="ck-input" value={form.ciudad}
                                           onChange={(e) => set('ciudad', e.target.value)}
                                           placeholder="Bogotá, Medellín, Cali..."/>
                                    {errors.ciudad && <p className="ck-error">{errors.ciudad}</p>}
                                </div>

                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Dirección de entrega</label>
                                    <input className="ck-input" value={form.direccion}
                                           onChange={(e) => set('direccion', e.target.value)}
                                           placeholder="Calle, número, barrio..."/>
                                    {errors.direccion && <p className="ck-error">{errors.direccion}</p>}
                                </div>

                                <div style={{marginBottom:'1.5rem'}}>
                                    <label className="ck-label">
                                        Indicaciones adicionales
                                        <span style={{fontWeight:400,textTransform:'none',letterSpacing:'normal',color:'rgba(150,80,20,0.35)',marginLeft:'0.35rem'}}>
                                            — opcional
                                        </span>
                                    </label>
                                    <textarea className="ck-input" value={form.indicaciones}
                                              onChange={(e) => set('indicaciones', e.target.value)}
                                              placeholder="Apartamento, torre, referencias del lugar..."
                                              rows={3} style={{resize:'vertical',minHeight:'80px'}}/>
                                </div>

                                {(telefonos.length > 0 || correos.length > 0) && (
                                    <div className="contact-box">
                                        <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.4rem'}}>
                                            Dudas o consultas
                                        </p>
                                        {telefonos.map((t) => (
                                            <p key={t} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{t}</p>
                                        ))}
                                        {correos.map((c) => (
                                            <p key={c} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{c}</p>
                                        ))}
                                    </div>
                                )}

                                <div style={{display:'flex',justifyContent:'flex-end',marginTop:'1.5rem'}}>
                                    <button className="btn-nav btn-next"
                                            onClick={() => { if (validarPaso1()) setPaso(2); }}>
                                        Continuar al pago
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── PASO 2: PAGO ── */}
                        {paso === 2 && (
                            <div className="section-card">
                                <h2 style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.01em'}}>
                                    Método de pago
                                </h2>
                                <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.25rem',lineHeight:'1.6'}}>
                                    Selecciona cómo realizarás la transferencia y adjunta el comprobante.
                                </p>

                                <div style={{marginBottom:'1.5rem'}}>
                                    {metodosPago.map((m) => {
                                        const estilo = METODO_ESTILOS[m.id] ?? { color:'rgba(120,60,10,0.8)', bg:'rgba(200,140,80,0.05)', border:'rgba(200,140,80,0.2)' };
                                        const sel    = form.metodo_pago === m.id;
                                        return (
                                            <div key={m.id} className="metodo-card"
                                                 style={sel ? { background:estilo.bg, borderColor:estilo.border } : {}}
                                                 onClick={() => set('metodo_pago', m.id)}>
                                                <div className="radio-circle"
                                                     style={sel ? { borderColor:estilo.color, background:estilo.color } : {}}>
                                                    {sel && <div className="radio-dot"/>}
                                                </div>
                                                <div style={{flex:1}}>
                                                    <p style={{fontSize:'0.84rem',fontWeight:'500',color:sel?estilo.color:'#2d1a08',margin:'0 0 0.15rem',letterSpacing:'-0.01em'}}>
                                                        {m.label}
                                                    </p>
                                                    <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                                        {m.numero || 'Sin número configurado'}
                                                    </p>
                                                </div>
                                                {m.qr_url && (
                                                    <img
                                                        src={m.qr_url}
                                                        alt="QR"
                                                        className="qr-thumb-img"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                    {errors.metodo_pago && <p className="ck-error">{errors.metodo_pago}</p>}
                                </div>

                                {metodoSeleccionado && (
                                    <div style={{
                                        padding:'1rem',borderRadius:'12px',marginBottom:'1.5rem',
                                        background:estiloSeleccionado.bg,border:`1px solid ${estiloSeleccionado.border}`,
                                    }}>
                                        <p style={{fontSize:'0.72rem',fontWeight:'500',color:estiloSeleccionado.color,marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                                            Realiza la transferencia a
                                        </p>
                                        <p style={{fontSize:'0.95rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.2rem',letterSpacing:'-0.02em'}}>
                                            {metodoSeleccionado.numero}
                                        </p>
                                        {metodoSeleccionado.qr_url && (
                                            <div className="qr-info-box">
                                                <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',marginBottom:'0.45rem'}}>
                                                    Código QR de pago
                                                </p>
                                                <img
                                                    src={metodoSeleccionado.qr_url}
                                                    alt="QR"
                                                    className="qr-preview-img"
                                                    onClick={() => setQrFullscreen(metodoSeleccionado.qr_url)}
                                                    title="Clic para ampliar"
                                                />
                                            </div>
                                        )}
                                        <p style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:metodoSeleccionado.qr_url?'0.75rem 0 0':'0'}}>
                                            Monto exacto: <strong style={{fontWeight:'600'}}>{formatCOP(total)}</strong>
                                        </p>
                                    </div>
                                )}

                                {(telefonos.length > 0 || correos.length > 0) && (
                                    <div className="contact-box" style={{marginBottom:'1.5rem'}}>
                                        <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.4rem'}}>
                                            Dudas o consultas
                                        </p>
                                        {telefonos.map((t) => (
                                            <p key={t} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{t}</p>
                                        ))}
                                        {correos.map((c) => (
                                            <p key={c} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{c}</p>
                                        ))}
                                    </div>
                                )}

                                <div style={{marginBottom:'0.4rem'}}>
                                    <label className="ck-label">Comprobante de pago</label>
                                    <div className={`upload-zone${form.comprobante ? ' has-file' : ''}`}
                                         onClick={() => document.getElementById('comprobante-input').click()}>
                                        <input id="comprobante-input" type="file"
                                               accept="image/*,application/pdf"
                                               style={{display:'none'}}
                                               onChange={handleComprobante}/>
                                        {preview ? (
                                            <div>
                                                <img src={preview} alt="Comprobante"
                                                     style={{maxHeight:'140px',borderRadius:'8px',objectFit:'contain',marginBottom:'0.65rem'}}/>
                                                <p style={{fontSize:'0.78rem',color:'rgba(4,120,87,0.8)',fontWeight:'500'}}>
                                                    {form.comprobante.name}
                                                </p>
                                                <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.45)',marginTop:'0.2rem'}}>
                                                    Clic para cambiar
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{width:'40px',height:'40px',borderRadius:'10px',margin:'0 auto 0.875rem',
                                                    background:'rgba(200,140,80,0.07)',border:'1px solid rgba(200,140,80,0.15)',
                                                    display:'flex',alignItems:'center',justifyContent:'center'}}>
                                                    <svg width="18" height="18" fill="none" stroke="rgba(150,80,20,0.45)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                </div>
                                                <p style={{fontSize:'0.84rem',fontWeight:'500',color:'rgba(120,60,10,0.65)',marginBottom:'0.25rem',letterSpacing:'-0.01em'}}>
                                                    Adjuntar comprobante de pago
                                                </p>
                                                <p style={{fontSize:'0.73rem',color:'rgba(150,80,20,0.45)'}}>
                                                    JPG, PNG, WEBP o PDF · máx. 5 MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {errors.comprobante && <p className="ck-error" style={{marginTop:'0.35rem'}}>{errors.comprobante}</p>}
                                </div>

                                <div className="ck-btn-row" style={{display:'flex',justifyContent:'space-between',marginTop:'1.5rem',gap:'0.75rem'}}>
                                    <button className="btn-nav btn-back" onClick={() => { setPaso(1); setErrors({}); }}>
                                        Volver
                                    </button>
                                    <button className="btn-nav btn-next"
                                            onClick={handleSubmit} disabled={processing}>
                                        {processing ? 'Enviando pedido...' : 'Confirmar pedido'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen lateral */}
                    <div className="ck-resumen">
                        <p style={{fontSize:'0.8rem',fontWeight:'500',color:'#2d1a08',marginBottom:'1.1rem',letterSpacing:'-0.01em'}}>
                            Resumen
                        </p>

                        <div style={{maxHeight:'280px',overflowY:'auto',marginBottom:'1rem'}}>
                            {carrito.map((item) => (
                                <div key={item.id} style={{
                                    display:'flex',gap:'0.65rem',padding:'0.65rem 0',
                                    borderBottom:'1px solid rgba(200,140,80,0.08)',
                                }}>
                                    {item.imagen
                                        ? <img src={imgSrc(item.imagen)} alt={item.nombre}
                                               style={{width:'44px',height:'44px',borderRadius:'8px',objectFit:'cover',flexShrink:0}}/>
                                        : <div style={{width:'44px',height:'44px',borderRadius:'8px',
                                            background:'rgba(200,140,80,0.06)',border:'1px solid rgba(200,140,80,0.1)',
                                            display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                                            <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.3)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <rect x="3" y="3" width="18" height="18" rx="3"/><path strokeLinecap="round" d="M3 9h18"/>
                                            </svg>
                                        </div>
                                    }
                                    <div style={{flex:1,minWidth:0}}>
                                        <p style={{fontSize:'0.78rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.15rem',
                                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',letterSpacing:'-0.01em'}}>
                                            {item.nombre}
                                        </p>
                                        <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                            {item.cantidad} × {formatCOP(item.precio)}
                                        </p>
                                    </div>
                                    <p style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',flexShrink:0,letterSpacing:'-0.02em'}}>
                                        {formatCOP(item.precio * item.cantidad)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'0.75rem 0',
                            borderTop:'1px solid rgba(200,140,80,0.1)',borderBottom:'1px solid rgba(200,140,80,0.1)',
                            marginBottom:'1rem',
                        }}>
                            <span style={{fontSize:'0.82rem',color:'rgba(120,60,10,0.65)'}}>Total</span>
                            <span style={{fontSize:'1.2rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.03em'}}>
                                {formatCOP(total)}
                            </span>
                        </div>

                        {paso === 2 && form.nombre_receptor && (
                            <div style={{padding:'0.75rem',borderRadius:'10px',
                                background:'rgba(16,185,129,0.05)',border:'1px solid rgba(16,185,129,0.15)',
                                marginBottom:'0.875rem'}}>
                                <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(4,120,87,0.6)',textTransform:'uppercase',letterSpacing:'0.07em',margin:'0 0 0.3rem'}}>
                                    Envío a
                                </p>
                                <p style={{fontSize:'0.8rem',fontWeight:'500',color:'rgba(4,120,87,0.8)',margin:'0 0 0.12rem',letterSpacing:'-0.01em'}}>
                                    {form.nombre_receptor}
                                </p>
                                <p style={{fontSize:'0.75rem',color:'rgba(4,120,87,0.65)',margin:0,lineHeight:'1.4'}}>
                                    {form.direccion}, {form.ciudad}
                                </p>
                            </div>
                        )}

                        <div style={{display:'flex',flexDirection:'column',gap:'0.3rem'}}>
                            {['Envío a todo Colombia', 'Pago por transferencia', 'Revisión en máx. 24h'].map((t, i) => (
                                <p key={i} style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.45)',margin:0,lineHeight:'1.5',display:'flex',alignItems:'center',gap:'0.4rem'}}>
                                    <span style={{width:'4px',height:'4px',borderRadius:'50%',background:'rgba(150,80,20,0.25)',flexShrink:0,display:'inline-block'}}/>
                                    {t}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {qrFullscreen && (
                    <div className="qr-fullscreen-overlay" onClick={() => setQrFullscreen(null)}>
                        <button
                            type="button"
                            className="qr-close-btn"
                            onClick={(e) => { e.stopPropagation(); setQrFullscreen(null); }}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                        <img
                            src={qrFullscreen}
                            alt="QR ampliado"
                            className="qr-fullscreen-img"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </ClienteLayout>
    );
}
