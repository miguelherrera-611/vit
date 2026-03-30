import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const TIPOS_RECLAMO = [
    { id: 'problema_pago',       label: 'Problema con el pago',      emoji: '💳', desc: 'El pago no fue reconocido o hubo un error.' },
    { id: 'problema_prenda',     label: 'Problema con la prenda',    emoji: '👔', desc: 'Talla incorrecta, defecto o daño.' },
    { id: 'retraso_entrega',     label: 'Retraso en la entrega',     emoji: '🚚', desc: 'Tu pedido tardó más de lo esperado.' },
    { id: 'producto_incorrecto', label: 'Producto incorrecto',       emoji: '📦', desc: 'Recibiste un producto diferente al pedido.' },
    { id: 'otro',                label: 'Otro',                      emoji: '💬', desc: 'Cualquier otra inquietud o reclamo.' },
];

export default function ServicioCliente({ contacto }) {
    const { flash } = usePage().props;
    const [paso, setPaso]       = useState(1); // 1: elegir tipo, 2: teléfono, 3: enviado
    const [tipo, setTipo]       = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [telefono, setTelefono]       = useState('');
    const [errors, setErrors]   = useState({});
    const [processing, setProcessing] = useState(false);

    const contactoFiltrado = {
        telefonos: [contacto.telefono1, contacto.telefono2].filter(Boolean),
        correos:   [contacto.correo1,   contacto.correo2].filter(Boolean),
    };

    const tipoSeleccionado = TIPOS_RECLAMO.find(t => t.id === tipo);

    const handleEnviar = () => {
        const e = {};
        if (!telefono.trim()) e.telefono = 'El teléfono es obligatorio.';
        setErrors(e);
        if (Object.keys(e).length > 0) return;

        setProcessing(true);
        router.post('/cliente/reclamos', { tipo, descripcion, telefono_contacto: telefono }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setPaso(3); },
            onError: (errs) => { setErrors(errs); setProcessing(false); },
        });
    };

    return (
        <ClienteLayout>
            <Head title="Servicio al cliente — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                @keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

                .sc-glass {
                    background:rgba(255,255,255,0.04);backdrop-filter:blur(22px) saturate(150%);
                    -webkit-backdrop-filter:blur(22px) saturate(150%);border-radius:24px;
                    border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 16px 48px rgba(180,90,20,0.08),0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position:relative;overflow:hidden;
                }
                .sc-glass::before {
                    content:'';position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none;
                }
                .tipo-card { padding:1rem 1.25rem;border-radius:16px;cursor:pointer;
                    border:2px solid rgba(200,140,80,0.15);background:rgba(255,255,255,0.04);
                    transition:all 0.2s;display:flex;align-items:flex-start;gap:0.75rem; }
                .tipo-card:hover { border-color:rgba(200,140,80,0.35);background:rgba(255,255,255,0.08); }
                .tipo-card.selected { border-color:rgba(220,38,38,0.45);background:rgba(220,38,38,0.06); }

                .ck-input { width:100%;padding:0.8rem 1rem;
                    background:rgba(255,255,255,0.06);border:1px solid rgba(200,140,80,0.38);
                    border-radius:14px;font-size:0.9rem;color:#2d1a08;
                    font-family:'Inter',sans-serif;outline:none;transition:all 0.2s;box-sizing:border-box; }
                .ck-input:focus { background:rgba(255,255,255,0.12);border-color:rgba(200,140,80,0.65); }
                .ck-label { display:block;font-size:0.7rem;font-weight:700;color:rgba(150,80,20,0.65);
                    text-transform:uppercase;letter-spacing:0.09em;margin-bottom:0.45rem; }
                .ck-error { margin-top:0.3rem;font-size:0.74rem;color:rgba(185,28,28,0.88);font-weight:500; }

                .btn-primary { padding:0.85rem 2rem;border-radius:14px;border:none;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.9rem;font-weight:600;transition:all 0.2s;
                    background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.38);color:rgba(185,28,28,0.95);
                    box-shadow:0 6px 20px rgba(220,38,38,0.12); }
                .btn-primary:hover:not(:disabled) { background:rgba(220,38,38,0.16);transform:translateY(-1px); }
                .btn-primary:disabled { opacity:0.4;cursor:not-allowed; }
                .btn-ghost { padding:0.8rem 1.5rem;border-radius:14px;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.88rem;font-weight:500;
                    background:rgba(255,255,255,0.06);border:1px solid rgba(200,140,80,0.28);
                    color:rgba(120,60,10,0.7);transition:all 0.2s; }
                .btn-ghost:hover { background:rgba(255,255,255,0.14); }
            `}</style>

            <div style={{maxWidth:'680px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>
                <div style={{marginBottom:'2rem'}}>
                    <p style={{fontSize:'0.7rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.3rem'}}>Mi cuenta</p>
                    <h1 style={{fontSize:'1.75rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.35rem'}}>Servicio al cliente</h1>
                    <p style={{fontSize:'0.85rem',color:'rgba(150,80,20,0.6)',lineHeight:'1.6'}}>
                        ¿Tienes algún inconveniente con tu pedido o necesitas ayuda? Cuéntanos y nos comunicaremos contigo lo antes posible.
                    </p>
                </div>

                {/* ── Paso 1: elegir tipo ── */}
                {paso === 1 && (
                    <div className="sc-glass" style={{padding:'2rem',animation:'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both'}}>
                        <h2 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.4rem',letterSpacing:'-0.02em'}}>
                            🛠️ ¿Cuál es el motivo de tu reclamo?
                        </h2>
                        <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.6)',marginBottom:'1.5rem',lineHeight:'1.5'}}>
                            Selecciona la opción que mejor describe tu situación. También puedes acercarte a nuestro <strong>punto físico</strong> si prefieres atención presencial.
                        </p>

                        <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginBottom:'1.5rem'}}>
                            {TIPOS_RECLAMO.map(t => (
                                <div key={t.id} className={`tipo-card${tipo===t.id?' selected':''}`} onClick={() => setTipo(t.id)}>
                                    <div style={{width:'40px',height:'40px',borderRadius:'12px',flexShrink:0,
                                        background:tipo===t.id?'rgba(220,38,38,0.08)':'rgba(255,255,255,0.05)',
                                        border:tipo===t.id?'1px solid rgba(220,38,38,0.2)':'1px solid rgba(200,140,80,0.15)',
                                        display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>
                                        {t.emoji}
                                    </div>
                                    <div>
                                        <p style={{fontSize:'0.88rem',fontWeight:'700',color:tipo===t.id?'rgba(185,28,28,0.9)':'#2d1a08',margin:'0 0 0.18rem'}}>{t.label}</p>
                                        <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.6)',margin:0}}>{t.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {tipo && (
                            <>
                                <div style={{marginBottom:'1rem'}}>
                                    <label className="ck-label">Cuéntanos más (opcional)</label>
                                    <textarea className="ck-input" value={descripcion}
                                              onChange={e => setDescripcion(e.target.value)}
                                              placeholder="Describe brevemente tu situación..."
                                              rows={3} style={{resize:'vertical'}} />
                                </div>
                                <button className="btn-primary" onClick={() => setPaso(2)} style={{width:'100%'}}>
                                    Continuar →
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ── Paso 2: teléfono ── */}
                {paso === 2 && (
                    <div className="sc-glass" style={{padding:'2rem',animation:'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1.25rem'}}>
                            <div style={{width:'40px',height:'40px',borderRadius:'12px',background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>
                                {tipoSeleccionado?.emoji}
                            </div>
                            <div>
                                <p style={{fontSize:'0.88rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.1rem'}}>{tipoSeleccionado?.label}</p>
                                <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',margin:0}}>Tipo de reclamo seleccionado</p>
                            </div>
                        </div>

                        <h2 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',marginBottom:'0.4rem'}}>📱 ¿Cómo te contactamos?</h2>
                        <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.6)',marginBottom:'1.25rem',lineHeight:'1.5'}}>
                            Escribe tu número de WhatsApp para que nuestro equipo pueda comunicarse contigo directamente.
                        </p>

                        <div style={{marginBottom:'1rem'}}>
                            <label className="ck-label">Número de WhatsApp</label>
                            <input className="ck-input" type="tel" value={telefono}
                                   onChange={e => { setTelefono(e.target.value); setErrors({}); }}
                                   placeholder="Ej: 3001234567" />
                            {errors.telefono && <p className="ck-error">{errors.telefono}</p>}
                        </div>

                        <div style={{padding:'0.875rem',borderRadius:'12px',background:'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.18)',marginBottom:'1.25rem'}}>
                            <p style={{fontSize:'0.78rem',color:'rgba(29,78,216,0.8)',margin:0,lineHeight:'1.5'}}>
                                ℹ️ Solo usaremos este número para contactarte sobre tu reclamo. También puedes acercarte a nuestro <strong>punto físico</strong> para resolver el inconveniente en persona.
                            </p>
                        </div>

                        {/* Datos de contacto de la tienda */}
                        {(contactoFiltrado.telefonos.length > 0 || contactoFiltrado.correos.length > 0) && (
                            <div style={{padding:'0.875rem',borderRadius:'12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.15)',marginBottom:'1.25rem'}}>
                                <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.55)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.5rem'}}>También puedes contactarnos en:</p>
                                {contactoFiltrado.telefonos.map(t => <p key={t} style={{fontSize:'0.82rem',color:'#2d1a08',margin:'0 0 0.2rem'}}>📞 {t}</p>)}
                                {contactoFiltrado.correos.map(c => <p key={c} style={{fontSize:'0.82rem',color:'#2d1a08',margin:'0 0 0.2rem'}}>✉️ {c}</p>)}
                            </div>
                        )}

                        <div style={{display:'flex',gap:'0.75rem'}}>
                            <button className="btn-ghost" onClick={() => setPaso(1)}>← Volver</button>
                            <button className="btn-primary" onClick={handleEnviar} disabled={processing} style={{flex:1}}>
                                {processing ? 'Enviando...' : 'Enviar reporte →'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Paso 3: enviado ── */}
                {paso === 3 && (
                    <div className="sc-glass" style={{padding:'3rem 2rem',textAlign:'center',animation:'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both'}}>
                        <div style={{width:'80px',height:'80px',borderRadius:'50%',margin:'0 auto 1.5rem',
                            background:'rgba(16,185,129,0.1)',border:'2px solid rgba(16,185,129,0.3)',
                            display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem',
                            animation:'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                            ✅
                        </div>
                        <h2 style={{fontSize:'1.4rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',marginBottom:'0.5rem'}}>¡Reporte enviado!</h2>
                        <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.65)',lineHeight:'1.7',marginBottom:'0.5rem'}}>
                            Hemos recibido tu reporte. Nos comunicaremos contigo por WhatsApp al número <strong style={{color:'#2d1a08'}}>{telefono}</strong> a la brevedad posible.
                        </p>
                        <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.55)',marginBottom:'2rem',lineHeight:'1.6'}}>
                            También puedes acercarte a nuestro <strong>punto físico</strong> si necesitas atención inmediata.
                        </p>
                        <a href="/catalogo" style={{display:'inline-block',padding:'0.75rem 1.75rem',borderRadius:'14px',
                            background:'rgba(220,38,38,0.09)',border:'1px solid rgba(220,38,38,0.32)',
                            color:'rgba(185,28,28,0.9)',textDecoration:'none',fontSize:'0.88rem',fontWeight:'600'}}>
                            Ir al catálogo →
                        </a>
                    </div>
                )}
            </div>
        </ClienteLayout>
    );
}
