// resources/js/Pages/Admin/Reclamos.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const ESTADOS = {
    pendiente:   { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)',  color:'rgba(146,64,14,0.9)',  label:'Pendiente',   emoji:'🕐' },
    en_revision: { bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.28)', color:'rgba(29,78,216,0.9)',  label:'En revisión', emoji:'🔍' },
    resuelto:    { bg:'rgba(16,185,129,0.09)', border:'rgba(16,185,129,0.28)', color:'rgba(4,120,87,0.9)',   label:'Resuelto',    emoji:'✅' },
    cerrado:     { bg:'rgba(200,140,80,0.07)', border:'rgba(200,140,80,0.22)', color:'rgba(150,80,20,0.7)',  label:'Cerrado',     emoji:'🔒' },
};

export default function AdminReclamos({ reclamos, conteos, filtro }) {
    const { flash } = usePage().props;

    const [detalle, setDetalle]       = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState('');
    const [notas, setNotas]           = useState('');
    const [processing, setProcessing] = useState(false);
    const [filtroActivo, setFiltroActivo] = useState(filtro || '');
    const [navOffset, setNavOffset] = useState(64);

    useEffect(() => {
        const recalcNav = () => {
            const nav = document.querySelector('.app-nav');
            const h = nav ? Math.round(nav.getBoundingClientRect().height) : 64;
            setNavOffset(h);
        };
        recalcNav();
        window.addEventListener('resize', recalcNav);
        return () => window.removeEventListener('resize', recalcNav);
    }, []);

    const filtrarPor = (estado) => {
        const nuevo = filtroActivo === estado ? '' : estado;
        setFiltroActivo(nuevo);
        router.get('/admin/reclamos', nuevo ? { estado: nuevo } : {}, { preserveState: true });
    };

    const abrirDetalle = (reclamo) => {
        setDetalle(reclamo);
        setNuevoEstado(reclamo.estado);
        setNotas(reclamo.notas_admin || '');
    };

    const guardar = () => {
        if (!nuevoEstado) return;
        setProcessing(true);
        router.patch(`/admin/reclamos/${detalle.id}`, {
            estado:      nuevoEstado,
            notas_admin: notas,
        }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setDetalle(null); },
            onError:   () => setProcessing(false),
        });
    };

    const reclamosList = reclamos.data || [];

    return (
        <AppLayout>
            <Head title="Reclamos — Admin VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }

                .adm-glass {
                    background:rgba(255,255,255,0.04);backdrop-filter:blur(22px) saturate(150%);
                    -webkit-backdrop-filter:blur(22px) saturate(150%);border-radius:20px;
                    border:1px solid rgba(255,255,255,0.65);
                    box-shadow:0 12px 40px rgba(180,90,20,0.07),0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position:relative;overflow:hidden;
                }
                .adm-glass::before {
                    content:'';position:absolute;top:0;left:0;right:0;height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none;
                }
                .tab-btn { padding:0.45rem 0.875rem;border-radius:20px;border:1px solid transparent;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.75rem;font-weight:600;
                    transition:all 0.2s ease;white-space:nowrap; }
                .reclamo-row {
                    display:grid;gap:0.5rem;padding:0.875rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.08);cursor:pointer;
                    transition:background 0.15s;
                    grid-template-columns:1fr 1.2fr 1fr auto auto;align-items:center;
                }
                .reclamo-row:hover { background:rgba(255,255,255,0.05); }
                .reclamo-row:last-child { border-bottom:none; }

                .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
                    display:flex; align-items:flex-start; justify-content:flex-end; animation:fadeIn 0.2s both; }
                .detalle-panel { width:min(480px,100vw); height:100vh; overflow-y:auto;
                    background:rgba(255,250,245,0.97);backdrop-filter:blur(40px);
                    -webkit-backdrop-filter:blur(40px);border-left:1px solid rgba(255,255,255,0.75);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12);
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif; }
                .detalle-panel::-webkit-scrollbar { width:4px; }
                .detalle-panel::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3);border-radius:4px; }

                .ck-input { width:100%;padding:0.75rem 0.875rem;
                    background:rgba(255,255,255,0.06);border:1px solid rgba(200,140,80,0.35);
                    border-radius:12px;font-size:0.85rem;color:#2d1a08;
                    font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;
                    transition:border-color 0.2s; }
                .ck-input:focus { border-color:rgba(200,140,80,0.65);background:rgba(255,255,255,0.12); }
                .ck-label { display:block;font-size:0.68rem;font-weight:700;
                    color:rgba(150,80,20,0.6);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem; }

                .alert-success { padding:0.75rem 1rem;border-radius:12px;margin-bottom:1.25rem;
                    background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);
                    font-size:0.82rem;color:rgba(4,120,87,0.9);font-weight:500; }

                .wa-btn { display:inline-flex;align-items:center;gap:0.5rem;
                    padding:0.65rem 1.25rem;border-radius:12px;border:none;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:600;
                    background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.35);
                    color:rgba(21,128,61,0.9);text-decoration:none;transition:all 0.2s; }
                .wa-btn:hover { background:rgba(22,163,74,0.2);transform:translateY(-1px); }

                .estado-select { width:100%;padding:0.7rem 0.875rem;border-radius:12px;
                    border:1px solid rgba(200,140,80,0.35);background:rgba(255,255,255,0.06);
                    font-family:'Inter',sans-serif;font-size:0.85rem;color:#2d1a08;
                    outline:none;cursor:pointer; }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }

                .tabla-scroll {
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                }

                .tabla-inner {
                    min-width: 900px; /* activa scroll horizontal en móvil */
                }

                @media (max-width: 768px){
                    .tabla-inner { min-width: 900px; }
                    .reclamo-row { grid-template-columns:1fr 1.2fr 1fr auto auto; } /* mantener tabla */
                }

                @media (max-width:768px){
                    .detalle-panel { width:100vw; max-width:100vw; }
                }
            `}</style>

            <div style={{
                minHeight:'100vh',
                background:`radial-gradient(ellipse 75% 60% at 0% 0%,rgba(255,210,170,0.22) 0%,transparent 55%),
                    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%,transparent 55%),
                    linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%)`,
                fontFamily:'Inter,sans-serif',
            }}>
                <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                    {/* Header */}
                    <div style={{marginBottom:'1.75rem'}}>
                        <p style={{fontSize:'0.7rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.3rem'}}>Administración</p>
                        <h1 style={{fontSize:'1.75rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.3rem'}}>Reclamos de clientes</h1>
                        <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)'}}>Gestiona y resuelve los reclamos recibidos</p>
                    </div>

                    {flash?.success && <div className="alert-success">✓ {flash.success}</div>}

                    {/* Filtros */}
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.75rem'}}>
                        <button className="tab-btn"
                                style={{background:!filtroActivo?'rgba(220,38,38,0.1)':'rgba(255,255,255,0.06)',
                                    borderColor:!filtroActivo?'rgba(220,38,38,0.35)':'rgba(200,140,80,0.22)',
                                    color:!filtroActivo?'rgba(185,28,28,0.9)':'rgba(120,60,10,0.6)'}}
                                onClick={() => filtrarPor('')}>
                            Todos ({(reclamos.total ?? reclamosList.length)})
                        </button>
                        {Object.entries(ESTADOS).map(([key, st]) => (
                            <button key={key} className="tab-btn"
                                    style={{background:filtroActivo===key?st.bg:'rgba(255,255,255,0.06)',
                                        borderColor:filtroActivo===key?st.border:'rgba(200,140,80,0.18)',
                                        color:filtroActivo===key?st.color:'rgba(120,60,10,0.6)'}}
                                    onClick={() => filtrarPor(key)}>
                                {st.emoji} {st.label} ({conteos[key] || 0})
                            </button>
                        ))}
                    </div>

                    {/* Tabla */}
                    <div className="adm-glass anim-1">
                        <div className="tabla-scroll">
                            <div className="tabla-inner">
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr auto auto',
                                    gap:'0.5rem',padding:'0.75rem 1.25rem',
                                    borderBottom:'1px solid rgba(200,140,80,0.12)',background:'rgba(255,255,255,0.02)'}}>
                                    {['Tipo','Cliente','Fecha','Estado',''].map((h, i) => (
                                        <p key={i} style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:0,whiteSpace:'nowrap'}}>{h}</p>
                                    ))}
                                </div>

                                {reclamosList.length === 0 ? (
                                    <div style={{textAlign:'center',padding:'3rem 0'}}>
                                        <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.5)'}}>No hay reclamos{filtroActivo ? ` con estado "${ESTADOS[filtroActivo]?.label}"` : ''}.</p>
                                    </div>
                                ) : (
                                    reclamosList.map((r) => {
                                        const st = ESTADOS[r.estado] || ESTADOS.pendiente;
                                        return (
                                            <div key={r.id} className="reclamo-row" onClick={() => abrirDetalle(r)}>
                                                <div>
                                                    <p style={{fontSize:'0.86rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.12rem'}}>{r.tipo_label}</p>
                                                    <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>#{r.id}</p>
                                                </div>
                                                <div>
                                                    <p style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.12rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.cliente}</p>
                                                    <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>📞 {r.telefono_contacto}</p>
                                                </div>
                                                <p style={{fontSize:'0.76rem',color:'rgba(120,55,10,0.7)',margin:0}}>{r.created_at}</p>
                                                <div style={{padding:'0.25rem 0.6rem',borderRadius:'20px',background:st.bg,border:`1px solid ${st.border}`,whiteSpace:'nowrap'}}>
                                                    <span style={{fontSize:'0.7rem',fontWeight:'700',color:st.color}}>{st.emoji} {st.label}</span>
                                                </div>
                                                <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Paginación */}
                    {reclamos.links && (
                        <div>
                            {/* render de paginación */}
                        </div>
                    )}
                </div>
            </div>

            {/* Panel lateral detalle */}
            {detalle && (
                <div
                    className="modal-overlay"
                    onClick={() => setDetalle(null)}
                    style={{ top: `${navOffset}px`, height: `calc(100vh - ${navOffset}px)` }}
                >
                    <div
                        className="detalle-panel"
                        onClick={e => e.stopPropagation()}
                        style={{ height: `calc(100vh - ${navOffset}px)` }}
                    >

                        {/* Header */}
                        <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(200,140,80,0.12)',
                            display:'flex',alignItems:'center',justifyContent:'space-between',
                            position:'sticky',top:0,background:'rgba(255,250,245,0.97)',zIndex:1,backdropFilter:'blur(20px)'}}>
                            <div>
                                <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.3rem'}}>{detalle.tipo_label}</h2>
                                <div style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',
                                    padding:'0.2rem 0.6rem',borderRadius:'20px',
                                    background:ESTADOS[detalle.estado]?.bg,border:`1px solid ${ESTADOS[detalle.estado]?.border}`}}>
                                    <span style={{fontSize:'0.7rem',fontWeight:'700',color:ESTADOS[detalle.estado]?.color}}>
                                        {ESTADOS[detalle.estado]?.emoji} {ESTADOS[detalle.estado]?.label}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setDetalle(null)} style={{width:'30px',height:'30px',borderRadius:'9px',cursor:'pointer',
                                background:'rgba(255,255,255,0.1)',border:'1px solid rgba(200,140,80,0.2)',
                                display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(120,60,10,0.6)'}}>
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <div style={{padding:'1.5rem'}}>

                            {/* Info cliente */}
                            <Section title="Cliente">
                                <Row label="Nombre"   value={detalle.cliente} />
                                {detalle.email_cliente && <Row label="Email" value={detalle.email_cliente} />}
                                <Row label="Teléfono" value={detalle.telefono_contacto} />
                                <Row label="Fecha"    value={detalle.created_at} />
                            </Section>

                            {/* Descripción */}
                            {detalle.descripcion && (
                                <div style={{marginBottom:'1.5rem'}}>
                                    <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.65rem'}}>Descripción</p>
                                    <div style={{padding:'0.875rem 1rem',borderRadius:'12px',
                                        background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.1)',
                                        fontSize:'0.85rem',color:'#2d1a08',lineHeight:'1.6'}}>
                                        {detalle.descripcion}
                                    </div>
                                </div>
                            )}

                            {/* Botón WhatsApp */}
                            <div style={{marginBottom:'1.5rem'}}>
                                <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.65rem'}}>Contactar cliente</p>
                                <a
                                    href={`https://wa.me/57${detalle.telefono_contacto}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wa-btn"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Abrir WhatsApp
                                </a>
                            </div>

                            {/* Cambiar estado */}
                            <div style={{borderTop:'1px solid rgba(200,140,80,0.1)',paddingTop:'1.5rem'}}>
                                <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.75rem'}}>Gestionar reclamo</p>

                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Estado</label>
                                    <select className="estado-select" value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
                                        <option value="pendiente">🕐 Pendiente</option>
                                        <option value="en_revision">🔍 En revisión</option>
                                        <option value="resuelto">✅ Resuelto</option>
                                        <option value="cerrado">🔒 Cerrado</option>
                                    </select>
                                </div>

                                <div style={{marginBottom:'1rem'}}>
                                    <label className="ck-label">Notas internas</label>
                                    <textarea className="ck-input" value={notas} onChange={e => setNotas(e.target.value)}
                                              placeholder="Notas sobre la gestión del reclamo..."
                                              rows={3} style={{resize:'vertical'}} />
                                </div>

                                <div style={{display:'flex',gap:'0.6rem'}}>
                                    <button onClick={() => setDetalle(null)}
                                            style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'1px solid rgba(200,140,80,0.28)',
                                                background:'rgba(255,255,255,0.05)',color:'rgba(120,60,10,0.75)',
                                                fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'500',cursor:'pointer'}}>
                                        Cancelar
                                    </button>
                                    <button onClick={guardar} disabled={processing}
                                            style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'none',
                                                background:'rgba(16,185,129,0.12)',color:'rgba(4,120,87,0.9)',
                                                fontFamily:'Inter, sans-serif',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',
                                                opacity:processing?0.5:1}}>
                                        {processing ? 'Guardando...' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function Section({ title, children }) {
    return (
        <div style={{marginBottom:'1.5rem'}}>
            <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.65rem'}}>{title}</p>
            <div style={{background:'rgba(255,255,255,0.04)',borderRadius:'13px',border:'1px solid rgba(200,140,80,0.1)',overflow:'hidden'}}>
                {children}
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div style={{display:'flex',justifyContent:'space-between',padding:'0.55rem 0.875rem',borderBottom:'1px solid rgba(200,140,80,0.07)'}}>
            <span style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.55)',fontWeight:'500'}}>{label}</span>
            <span style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',textAlign:'right',maxWidth:'60%'}}>{value}</span>
        </div>
    );
}
