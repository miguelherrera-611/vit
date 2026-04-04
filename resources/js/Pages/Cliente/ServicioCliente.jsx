// resources/js/Pages/Cliente/ServicioCliente.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const TIPOS_RECLAMO = [
    { id: 'problema_pago',       label: 'Problema con el pago',      desc: 'El pago no fue reconocido o hubo un error.' },
    { id: 'problema_prenda',     label: 'Problema con la prenda',    desc: 'Talla incorrecta, defecto o daño.' },
    { id: 'retraso_entrega',     label: 'Retraso en la entrega',     desc: 'Tu pedido tardó más de lo esperado.' },
    { id: 'producto_incorrecto', label: 'Producto incorrecto',       desc: 'Recibiste un producto diferente al pedido.' },
    { id: 'otro',                label: 'Otra consulta',             desc: 'Cualquier otra inquietud o reclamo.' },
];

export default function ServicioCliente({ contacto }) {
    const [paso, setPaso]               = useState(1);
    const [tipo, setTipo]               = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [telefono, setTelefono]       = useState('');
    const [errors, setErrors]           = useState({});
    const [processing, setProcessing]   = useState(false);

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
            onError:   (errs) => { setErrors(errs); setProcessing(false); },
        });
    };

    return (
        <ClienteLayout>
            <Head title="Soporte — VitaliStore"/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .sc-wrap { max-width:600px; margin:0 auto; padding:2rem 1.25rem 4rem; }
                .sc-card {
                    background:rgba(255,255,255,0.5); border:1px solid rgba(200,140,80,0.12);
                    border-radius:18px; padding:1.5rem;
                    animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .tipo-item {
                    display:flex; align-items:flex-start; gap:0.75rem;
                    padding:0.8rem 0.9rem; border-radius:9px; cursor:pointer;
                    border:1px solid rgba(200,140,80,0.12); background:rgba(255,255,255,0.35);
                    transition:all 0.13s; margin-bottom:0.45rem;
                }
                .tipo-item:hover { background:rgba(255,255,255,0.6); border-color:rgba(200,140,80,0.22); }
                .tipo-item.selected { background:rgba(185,28,28,0.04); border-color:rgba(185,28,28,0.2); }
                .radio {
                    width:17px; height:17px; border-radius:50%; flex-shrink:0; margin-top:0.14rem;
                    border:1.5px solid rgba(200,140,80,0.3); transition:all 0.13s;
                    display:flex; align-items:center; justify-content:center;
                }
                .radio.checked { border-color:rgba(185,28,28,0.5); background:rgba(185,28,28,0.07); }
                .radio-dot { width:6px; height:6px; border-radius:50%; background:rgba(185,28,28,0.8); }
                .ck-input {
                    width:100%; padding:0.7rem 0.85rem;
                    background:rgba(255,255,255,0.55); border:1px solid rgba(200,140,80,0.2);
                    border-radius:9px; font-size:0.85rem; color:#2d1a08;
                    font-family:'Inter',sans-serif; outline:none; transition:all 0.13s;
                    letter-spacing:-0.01em;
                }
                .ck-input:focus { background:rgba(255,255,255,0.8); border-color:rgba(200,140,80,0.38); }
                .ck-label {
                    display:block; font-size:0.68rem; font-weight:500;
                    color:rgba(150,80,20,0.5); text-transform:uppercase;
                    letter-spacing:0.07em; margin-bottom:0.38rem;
                }
                .ck-error { margin-top:0.28rem; font-size:0.73rem; color:rgba(185,28,28,0.8); }
                .btn-primary {
                    padding:0.78rem 1.5rem; border-radius:9px; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.84rem; font-weight:500;
                    background:rgba(185,28,28,0.08); border:1px solid rgba(185,28,28,0.22);
                    color:rgba(185,28,28,0.9); transition:all 0.13s; letter-spacing:-0.01em;
                }
                .btn-primary:hover:not(:disabled) { background:rgba(185,28,28,0.13); }
                .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
                .btn-ghost {
                    padding:0.75rem 1.1rem; border-radius:9px; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:400;
                    background:rgba(255,255,255,0.45); border:1px solid rgba(200,140,80,0.18);
                    color:rgba(120,60,10,0.7); transition:all 0.13s; letter-spacing:-0.01em;
                }
                .btn-ghost:hover { background:rgba(255,255,255,0.7); }

                @media (max-width:640px) {
                    .sc-wrap { padding:1.5rem 1rem 3rem; }
                    .sc-card { padding:1.25rem; }
                }
            `}</style>

            <div className="sc-wrap">
                <div style={{marginBottom:'1.75rem',animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',
                        letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.35rem'}}>
                        Mi cuenta
                    </p>
                    <h1 style={{fontSize:'clamp(1.4rem,3vw,1.75rem)',fontWeight:'300',color:'#2d1a08',
                        letterSpacing:'-0.04em',marginBottom:'0.25rem'}}>
                        Soporte
                    </h1>
                    <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.55)',lineHeight:'1.6'}}>
                        Cuéntanos tu inconveniente y nos comunicaremos a la brevedad.
                    </p>
                </div>

                {/* Paso 1 */}
                {paso === 1 && (
                    <div className="sc-card">
                        <h2 style={{fontSize:'0.86rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.01em'}}>
                            Motivo del reclamo
                        </h2>
                        <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.1rem',lineHeight:'1.5'}}>
                            Selecciona la opción que mejor describe tu situación.
                        </p>

                        {TIPOS_RECLAMO.map(t => (
                            <div key={t.id} className={`tipo-item${tipo===t.id?' selected':''}`} onClick={() => setTipo(t.id)}>
                                <div className={`radio${tipo===t.id?' checked':''}`}>
                                    {tipo===t.id && <div className="radio-dot"/>}
                                </div>
                                <div>
                                    <p style={{fontSize:'0.82rem',fontWeight:'500',color:tipo===t.id?'rgba(185,28,28,0.9)':'#2d1a08',margin:'0 0 0.12rem',letterSpacing:'-0.01em'}}>
                                        {t.label}
                                    </p>
                                    <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0,lineHeight:'1.4'}}>
                                        {t.desc}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {tipo && (
                            <div style={{marginTop:'1.1rem'}}>
                                <div style={{marginBottom:'0.9rem'}}>
                                    <label className="ck-label">Descripción adicional (opcional)</label>
                                    <textarea className="ck-input" value={descripcion}
                                              onChange={e => setDescripcion(e.target.value)}
                                              placeholder="Describe brevemente tu situación..."
                                              rows={3} style={{resize:'vertical'}}/>
                                </div>
                                <button className="btn-primary" onClick={() => setPaso(2)} style={{width:'100%'}}>
                                    Continuar
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Paso 2 */}
                {paso === 2 && (
                    <div className="sc-card">
                        <div style={{marginBottom:'1.1rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(200,140,80,0.1)'}}>
                            <p style={{fontSize:'0.66rem',fontWeight:'500',color:'rgba(150,80,20,0.42)',textTransform:'uppercase',letterSpacing:'0.07em',margin:'0 0 0.18rem'}}>
                                Tipo seleccionado
                            </p>
                            <p style={{fontSize:'0.83rem',fontWeight:'500',color:'#2d1a08',margin:0,letterSpacing:'-0.01em'}}>
                                {tipoSeleccionado?.label}
                            </p>
                        </div>

                        <h2 style={{fontSize:'0.86rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.3rem',letterSpacing:'-0.01em'}}>
                            Datos de contacto
                        </h2>
                        <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.1rem',lineHeight:'1.5'}}>
                            Escribe tu número de WhatsApp para que podamos contactarte.
                        </p>

                        <div style={{marginBottom:'0.9rem'}}>
                            <label className="ck-label">Número de WhatsApp</label>
                            <input className="ck-input" type="tel" value={telefono}
                                   onChange={e => { setTelefono(e.target.value); setErrors({}); }}
                                   placeholder="Ej: 3001234567"/>
                            {errors.telefono && <p className="ck-error">{errors.telefono}</p>}
                        </div>

                        {(contactoFiltrado.telefonos.length > 0 || contactoFiltrado.correos.length > 0) && (
                            <div style={{padding:'0.8rem',borderRadius:'9px',
                                background:'rgba(255,255,255,0.35)',border:'1px solid rgba(200,140,80,0.1)',marginBottom:'1.1rem'}}>
                                <p style={{fontSize:'0.66rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',textTransform:'uppercase',letterSpacing:'0.07em',margin:'0 0 0.4rem'}}>
                                    También puedes contactarnos en
                                </p>
                                {contactoFiltrado.telefonos.map(t => (
                                    <p key={t} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{t}</p>
                                ))}
                                {contactoFiltrado.correos.map(c => (
                                    <p key={c} style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.65)',margin:'0 0 0.15rem'}}>{c}</p>
                                ))}
                            </div>
                        )}

                        <div style={{display:'flex',gap:'0.6rem'}}>
                            <button className="btn-ghost" onClick={() => setPaso(1)}>Volver</button>
                            <button className="btn-primary" onClick={handleEnviar} disabled={processing} style={{flex:1}}>
                                {processing ? 'Enviando...' : 'Enviar reporte'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 3 */}
                {paso === 3 && (
                    <div className="sc-card" style={{textAlign:'center',padding:'2.5rem 1.5rem'}}>
                        <div style={{width:'44px',height:'44px',borderRadius:'11px',margin:'0 auto 1.25rem',
                            background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.2)',
                            display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <svg width="18" height="18" fill="none" stroke="rgba(4,120,87,0.8)" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h2 style={{fontSize:'1.1rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',marginBottom:'0.45rem'}}>
                            Reporte enviado
                        </h2>
                        <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',lineHeight:'1.7',marginBottom:'0.3rem'}}>
                            Nos comunicaremos al número <strong style={{color:'#2d1a08',fontWeight:'500'}}>{telefono}</strong> a la brevedad.
                        </p>
                        <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.5)',marginBottom:'1.75rem',lineHeight:'1.6'}}>
                            También puedes acercarte a nuestro punto físico si necesitas atención inmediata.
                        </p>
                        <a href="/catalogo" style={{
                            display:'inline-block',padding:'0.7rem 1.4rem',borderRadius:'9px',
                            background:'rgba(185,28,28,0.07)',border:'1px solid rgba(185,28,28,0.18)',
                            color:'rgba(185,28,28,0.85)',textDecoration:'none',fontSize:'0.82rem',
                            fontWeight:'500',letterSpacing:'-0.01em',
                        }}>
                            Ir al catálogo
                        </a>
                    </div>
                )}
            </div>
        </ClienteLayout>
    );
}
