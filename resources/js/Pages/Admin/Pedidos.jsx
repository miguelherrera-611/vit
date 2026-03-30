// resources/js/Pages/Admin/Pedidos.jsx
// VERSIÓN COMPLETA — todas las funcionalidades nuevas implementadas
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const ESTADOS = {
    revision:    { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  color: 'rgba(146,64,14,0.9)',  label: 'En Revisión',    emoji: '🕐' },
    aprobado:    { bg: 'rgba(59,130,246,0.09)', border: 'rgba(59,130,246,0.28)', color: 'rgba(29,78,216,0.9)',  label: 'Aprobado',       emoji: '✅' },
    envio_curso: { bg: 'rgba(139,92,246,0.09)', border: 'rgba(139,92,246,0.28)', color: 'rgba(109,40,217,0.9)', label: 'Envío en Curso', emoji: '🚚' },
    entregado:   { bg: 'rgba(16,185,129,0.09)', border: 'rgba(16,185,129,0.28)', color: 'rgba(4,120,87,0.9)',   label: 'Entregado',      emoji: '📦' },
    rechazado:   { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)',  color: 'rgba(185,28,28,0.9)',  label: 'Rechazado',      emoji: '❌' },
};

const TRANSICIONES = {
    revision:    ['aprobado', 'rechazado'],
    aprobado:    ['envio_curso', 'rechazado'],
    envio_curso: ['entregado'],
    entregado:   [],
    rechazado:   [],
    cancelado:   [],
};

const MOTIVOS_RECHAZO = [
    'No se recibió la transferencia',
    'El comprobante no es legible',
    'El monto enviado es incorrecto',
    'El número de cuenta es erróneo',
    'Producto sin stock disponible',
    'Datos de envío incompletos',
];

const ACCIONES = {
    aprobado:    { label: '✅ Aprobar pedido',   bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: 'rgba(4,120,87,0.9)'    },
    envio_curso: { label: '🚚 Marcar enviado',   bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.35)',  color: 'rgba(109,40,217,0.9)'  },
    entregado:   { label: '📦 Marcar entregado', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: 'rgba(4,120,87,0.9)'    },
    rechazado:   { label: '❌ Rechazar',         bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.3)',    color: 'rgba(185,28,28,0.9)'   },
};

const METODO_EMOJIS = { Nequi: '💜', Daviplata: '🔴', Bancolombia: '🟡', Davivienda: '🏠' };

// ✅ Helper para imagen — compatible con URL completa o ruta relativa
const imgSrc = (imagen) => {
    if (!imagen) return null;
    return imagen.startsWith('http') ? imagen : `/storage/${imagen}`;
};

export default function AdminPedidos({ pedidos, conteos, filtro, buscar, metodosPago, contacto }) {
    const { flash } = usePage().props;

    const [detalle, setDetalle]     = useState(null);
    const [modalEstado, setModalEstado] = useState(null);
    const [password, setPassword]   = useState('');
    const [notas, setNotas]         = useState('');
    const [motivo, setMotivo]       = useState('');
    const [mensajeLibre, setMensajeLibre] = useState('');
    const [pwError, setPwError]     = useState('');
    const [processing, setProcessing] = useState(false);

    const [modalPago, setModalPago]   = useState(false);
    const [pagoEditing, setPagoEditing] = useState(null);
    const [pagoNumero, setPagoNumero]  = useState('');
    const [pagoQrFile, setPagoQrFile]  = useState(null);
    const [pagoEliminarQr, setPagoEliminarQr] = useState(false);
    const [pagoProcessing, setPagoProcessing]   = useState(false);

    const [modalContacto, setModalContacto] = useState(false);
    const [contactoForm, setContactoForm]   = useState({ ...contacto });
    const [contactoProcessing, setContactoProcessing] = useState(false);

    const [modalHistorial, setModalHistorial] = useState(false);
    const [historialPw, setHistorialPw]         = useState('');
    const [historialProcessing, setHistorialProcessing] = useState(false);

    const [filtroActivo, setFiltroActivo] = useState(filtro || '');
    const [buscarInput, setBuscarInput]   = useState(buscar || '');

    const filtrarPor = (estado) => {
        const nuevo = filtroActivo === estado ? '' : estado;
        setFiltroActivo(nuevo);
        router.get('/admin/pedidos', { ...(nuevo ? { estado: nuevo } : {}), ...(buscarInput ? { buscar: buscarInput } : {}) }, { preserveState: true });
    };

    const handleBuscar = (e) => {
        e.preventDefault();
        router.get('/admin/pedidos', { ...(filtroActivo ? { estado: filtroActivo } : {}), ...(buscarInput ? { buscar: buscarInput } : {}) }, { preserveState: true });
    };

    const abrirModalEstado = (pedidoId, nuevoEstado) => {
        setModalEstado({ pedidoId, nuevoEstado });
        setPassword(''); setPwError(''); setNotas(''); setMotivo(''); setMensajeLibre('');
    };

    const confirmarCambioEstado = () => {
        if (!password) { setPwError('La contraseña es obligatoria.'); return; }
        setProcessing(true);
        setPwError('');
        router.patch(`/admin/pedidos/${modalEstado.pedidoId}/estado`, {
            estado:          modalEstado.nuevoEstado,
            password,
            notas_admin:     notas || undefined,
            motivo_rechazo:  motivo || undefined,
            mensaje_rechazo: mensajeLibre || undefined,
        }, {
            preserveScroll: true,
            onSuccess: () => { setProcessing(false); setModalEstado(null); setDetalle(null); },
            onError: (errs) => { setProcessing(false); if (errs.password) setPwError(errs.password); },
        });
    };

    const guardarPago = () => {
        if (!pagoEditing) return;
        setPagoProcessing(true);
        const data = new FormData();
        if (pagoNumero) data.append('numero', pagoNumero);
        if (pagoQrFile) data.append('qr_imagen', pagoQrFile);
        if (pagoEliminarQr) data.append('eliminar_qr', '1');
        data.append('_method', 'PATCH');
        router.post(`/admin/pedidos/pago/${pagoEditing.id}`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { setPagoProcessing(false); setPagoEditing(null); },
            onError: () => setPagoProcessing(false),
        });
    };

    const guardarContacto = () => {
        setContactoProcessing(true);
        router.post('/admin/pedidos/contacto', { ...contactoForm, _method: 'PATCH' }, {
            preserveScroll: true,
            onSuccess: () => { setContactoProcessing(false); setModalContacto(false); },
            onError: () => setContactoProcessing(false),
        });
    };

    const eliminarHistorial = () => {
        setHistorialProcessing(true);
        router.post('/admin/pedidos/eliminar-historial', { password: historialPw }, {
            preserveScroll: true,
            onSuccess: () => { setHistorialProcessing(false); setModalHistorial(false); setHistorialPw(''); },
            onError: () => setHistorialProcessing(false),
        });
    };

    const pedidosList = pedidos.data || [];

    return (
        <AppLayout>
            <Head title="Pedidos — Admin VitaliStore" />
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
                .tab-btn { padding:0.45rem 0.875rem;border-radius:20px;border:none;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.75rem;font-weight:600;
                    transition:all 0.2s ease;white-space:nowrap; }
                .pedido-row { display:grid;gap:0.5rem;padding:0.875rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.08);cursor:pointer;
                    transition:background 0.15s;
                    grid-template-columns:1fr 1.2fr 1fr auto auto auto;align-items:center; }
                .pedido-row:hover { background:rgba(255,255,255,0.05); }
                .pedido-row:last-child { border-bottom:none; }

                .modal-overlay { position:fixed;inset:0;z-index:200;background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
                    display:flex;align-items:flex-start;justify-content:flex-end;animation:fadeIn 0.2s both; }
                .detalle-panel { width:min(500px,100vw);height:100vh;overflow-y:auto;
                    background:rgba(255,250,245,0.97);backdrop-filter:blur(40px);
                    -webkit-backdrop-filter:blur(40px);border-left:1px solid rgba(255,255,255,0.75);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12);
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif; }
                .detalle-panel::-webkit-scrollbar { width:4px; }
                .detalle-panel::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3);border-radius:4px; }

                .modal-center-overlay { position:fixed;inset:0;z-index:300;background:rgba(30,10,0,0.35);
                    backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
                    display:flex;align-items:center;justify-content:center;padding:1rem;animation:fadeIn 0.2s both; }
                .modal-card { width:100%;max-width:440px;background:rgba(255,250,245,0.97);
                    backdrop-filter:blur(40px);border:1px solid rgba(255,255,255,0.8);
                    border-radius:28px;padding:2rem;
                    box-shadow:0 24px 64px rgba(180,90,20,0.18);
                    animation:staggerUp 0.25s cubic-bezier(0.16,1,0.3,1) both; }

                .ck-input { width:100%;padding:0.75rem 0.875rem;
                    background:rgba(255,255,255,0.06);border:1px solid rgba(200,140,80,0.35);
                    border-radius:12px;font-size:0.85rem;color:#2d1a08;
                    font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;
                    transition:border-color 0.2s; }
                .ck-input:focus { border-color:rgba(200,140,80,0.65);background:rgba(255,255,255,0.12); }
                .ck-label { display:block;font-size:0.68rem;font-weight:700;
                    color:rgba(150,80,20,0.6);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem; }

                .btn-accion { padding:0.6rem 1rem;border-radius:11px;border:none;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.8rem;font-weight:600;
                    transition:all 0.2s ease;flex:1;text-align:center; }
                .btn-accion:hover:not(:disabled) { filter:brightness(1.06);transform:translateY(-1px); }
                .btn-accion:disabled { opacity:0.45;cursor:not-allowed; }

                .motivo-chip { padding:0.4rem 0.75rem;border-radius:20px;cursor:pointer;
                    font-size:0.75rem;font-weight:500;transition:all 0.18s;
                    border:1px solid rgba(200,140,80,0.25);background:rgba(255,255,255,0.05);
                    color:rgba(120,60,10,0.7); }
                .motivo-chip.selected { background:rgba(220,38,38,0.1);border-color:rgba(220,38,38,0.4);color:rgba(185,28,28,0.9); }
                .motivo-chip:hover { border-color:rgba(200,140,80,0.4);background:rgba(255,255,255,0.1); }

                .alert-success { padding:0.75rem 1rem;border-radius:12px;margin-bottom:1.25rem;
                    background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);
                    font-size:0.82rem;color:rgba(4,120,87,0.9);font-weight:500; }

                .pago-card { padding:1rem;border-radius:14px;border:1px solid rgba(200,140,80,0.15);
                    background:rgba(255,255,255,0.04);margin-bottom:0.75rem;cursor:pointer;
                    transition:all 0.2s; }
                .pago-card:hover { background:rgba(255,255,255,0.08);border-color:rgba(200,140,80,0.3); }
                .pago-card.editing { border-color:rgba(220,38,38,0.4);background:rgba(220,38,38,0.03); }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
            `}</style>

            <div style={{
                minHeight:'100vh',
                background:`radial-gradient(ellipse 75% 60% at 0% 0%,rgba(255,210,170,0.22) 0%,transparent 55%),
                    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%,transparent 55%),
                    linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%)`,
                fontFamily:'Inter,sans-serif',
            }}>
                <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                    {/* Header */}
                    <div style={{marginBottom:'1.75rem',display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
                        <div>
                            <p style={{fontSize:'0.7rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.3rem'}}>Administración</p>
                            <h1 style={{fontSize:'1.75rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.3rem'}}>Pedidos de clientes</h1>
                            <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)'}}>Gestiona y verifica los pedidos recibidos</p>
                        </div>
                        <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap',alignItems:'center'}}>
                            <button className="tab-btn" onClick={() => setModalPago(true)}
                                    style={{background:'rgba(59,130,246,0.09)',border:'1px solid rgba(59,130,246,0.28)',color:'rgba(29,78,216,0.9)'}}>
                                💳 Datos de pago
                            </button>
                            <button className="tab-btn" onClick={() => { setContactoForm({...contacto}); setModalContacto(true); }}
                                    style={{background:'rgba(16,185,129,0.09)',border:'1px solid rgba(16,185,129,0.28)',color:'rgba(4,120,87,0.9)'}}>
                                📞 Datos de contacto
                            </button>
                            <button className="tab-btn" onClick={() => setModalHistorial(true)}
                                    style={{background:'rgba(220,38,38,0.07)',border:'1px solid rgba(220,38,38,0.25)',color:'rgba(185,28,28,0.85)'}}>
                                🗑️ Limpiar historial
                            </button>
                        </div>
                    </div>

                    {flash?.success && <div className="alert-success">✓ {flash.success}</div>}

                    {/* Búsqueda */}
                    <form onSubmit={handleBuscar} style={{display:'flex',gap:'0.6rem',marginBottom:'1.25rem'}}>
                        <input className="ck-input" value={buscarInput} onChange={e => setBuscarInput(e.target.value)}
                               placeholder="Buscar por número, nombre o teléfono..."
                               style={{maxWidth:'340px'}} />
                        <button type="submit" className="tab-btn"
                                style={{background:'rgba(200,140,80,0.1)',border:'1px solid rgba(200,140,80,0.3)',color:'rgba(120,60,10,0.8)'}}>
                            Buscar
                        </button>
                        {buscarInput && (
                            <button type="button" className="tab-btn" onClick={() => { setBuscarInput(''); router.get('/admin/pedidos', filtroActivo ? { estado: filtroActivo } : {}); }}
                                    style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(200,140,80,0.2)',color:'rgba(150,80,20,0.6)'}}>
                                ✕
                            </button>
                        )}
                    </form>

                    {/* Filtros */}
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.75rem'}}>
                        <button className="tab-btn"
                                style={{ background:!filtroActivo?'rgba(220,38,38,0.1)':'rgba(255,255,255,0.06)',
                                    border:!filtroActivo?'1px solid rgba(220,38,38,0.35)':'1px solid rgba(200,140,80,0.22)',
                                    color:!filtroActivo?'rgba(185,28,28,0.9)':'rgba(120,60,10,0.6)' }}
                                onClick={() => filtrarPor('')}>
                            Todos ({pedidos.total ?? pedidosList.length})
                        </button>
                        {Object.entries(ESTADOS).map(([key, st]) => (
                            <button key={key} className="tab-btn"
                                    style={{ background:filtroActivo===key?st.bg:'rgba(255,255,255,0.06)',
                                        border:filtroActivo===key?`1px solid ${st.border}`:'1px solid rgba(200,140,80,0.18)',
                                        color:filtroActivo===key?st.color:'rgba(120,60,10,0.6)' }}
                                    onClick={() => filtrarPor(key)}>
                                {st.emoji} {st.label} ({conteos[key] || 0})
                            </button>
                        ))}
                    </div>

                    {/* Tabla */}
                    <div className="adm-glass anim-1">
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr auto auto auto',
                            gap:'0.5rem',padding:'0.75rem 1.25rem',
                            borderBottom:'1px solid rgba(200,140,80,0.12)',background:'rgba(255,255,255,0.02)'}}>
                            {['Pedido','Cliente','Fecha / Método','Estado','Total',''].map((h,i) => (
                                <p key={i} style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>{h}</p>
                            ))}
                        </div>

                        {pedidosList.length === 0 ? (
                            <div style={{textAlign:'center',padding:'3rem 0'}}>
                                <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.5)'}}>No hay pedidos{filtroActivo ? ` con estado "${ESTADOS[filtroActivo]?.label}"` : ''}.</p>
                            </div>
                        ) : (
                            pedidosList.map((p) => {
                                const st = ESTADOS[p.estado] || ESTADOS.revision;
                                return (
                                    <div key={p.id} className="pedido-row" onClick={() => setDetalle(p)}>
                                        <div>
                                            <p style={{fontSize:'0.86rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.12rem'}}>{p.numero_pedido}</p>
                                            <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>{p.items.length} art.</p>
                                        </div>
                                        <div>
                                            <p style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.12rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.nombre_cliente}</p>
                                            <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.telefono}</p>
                                        </div>
                                        <div>
                                            <p style={{fontSize:'0.76rem',color:'rgba(120,55,10,0.7)',margin:'0 0 0.12rem'}}>{p.created_at}</p>
                                            <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>{METODO_EMOJIS[p.metodo_pago]} {p.metodo_pago}</p>
                                        </div>
                                        <div style={{padding:'0.25rem 0.6rem',borderRadius:'20px',background:st.bg,border:`1px solid ${st.border}`,whiteSpace:'nowrap'}}>
                                            <span style={{fontSize:'0.7rem',fontWeight:'700',color:st.color}}>{st.emoji} {st.label}</span>
                                        </div>
                                        <p style={{fontSize:'0.9rem',fontWeight:'700',color:'#2d1a08',margin:0,whiteSpace:'nowrap'}}>{formatCOP(p.total)}</p>
                                        <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Paginación */}
                    {pedidos.links && (
                        <div style={{display:'flex',justifyContent:'center',gap:'0.4rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
                            {pedidos.links.map((link, i) => (
                                <button key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding:'0.4rem 0.75rem',borderRadius:'10px',cursor:link.url?'pointer':'default',
                                            fontFamily:'Inter,sans-serif',fontSize:'0.8rem',fontWeight:'600',
                                            background:link.active?'rgba(220,38,38,0.12)':'rgba(255,255,255,0.05)',
                                            color:link.active?'rgba(185,28,28,0.9)':'rgba(120,60,10,0.65)',
                                            border:link.active?'1px solid rgba(220,38,38,0.35)':'1px solid rgba(200,140,80,0.2)',
                                            opacity:!link.url?0.4:1,
                                        }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Panel lateral detalle */}
            {detalle && (
                <div className="modal-overlay" onClick={() => setDetalle(null)}>
                    <div className="detalle-panel" onClick={e => e.stopPropagation()}>
                        <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(200,140,80,0.12)',
                            display:'flex',alignItems:'center',justifyContent:'space-between',
                            position:'sticky',top:0,background:'rgba(255,250,245,0.97)',zIndex:1,backdropFilter:'blur(20px)'}}>
                            <div>
                                <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.3rem'}}>{detalle.numero_pedido}</h2>
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
                            <Section title="Cliente">
                                <Row label="Nombre"   value={detalle.nombre_cliente} />
                                <Row label="Teléfono" value={detalle.telefono} />
                                {detalle.email_cliente && <Row label="Email" value={detalle.email_cliente} />}
                            </Section>

                            <Section title="Envío">
                                <Row label="Ciudad"    value={detalle.ciudad} />
                                <Row label="Dirección" value={detalle.direccion} />
                                {detalle.indicaciones && <Row label="Indicaciones" value={detalle.indicaciones} />}
                            </Section>

                            <Section title="Pago">
                                <Row label="Método" value={`${METODO_EMOJIS[detalle.metodo_pago]} ${detalle.metodo_pago}`} />
                                <Row label="Total"  value={formatCOP(detalle.total)} highlight />
                                <Row label="Fecha"  value={detalle.created_at} />
                            </Section>

                            {detalle.comprobante && (
                                <div style={{marginBottom:'1.5rem'}}>
                                    <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.65rem'}}>Comprobante</p>
                                    <a href={detalle.comprobante} target="_blank" rel="noopener noreferrer"
                                       style={{display:'block',borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(200,140,80,0.2)'}}>
                                        {detalle.comprobante.endsWith('.pdf') ? (
                                            <div style={{padding:'1.25rem',textAlign:'center',background:'rgba(255,255,255,0.04)',color:'rgba(185,28,28,0.8)',fontSize:'0.85rem',fontWeight:'600'}}>📄 Ver PDF →</div>
                                        ) : (
                                            <img src={detalle.comprobante} alt="Comprobante"
                                                 style={{width:'100%',maxHeight:'260px',objectFit:'contain',display:'block',background:'rgba(255,255,255,0.04)'}} />
                                        )}
                                    </a>
                                </div>
                            )}

                            {detalle.estado === 'rechazado' && detalle.motivo_rechazo && (
                                <div style={{marginBottom:'1.5rem',padding:'0.875rem 1rem',borderRadius:'12px',background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)'}}>
                                    <p style={{fontSize:'0.68rem',fontWeight:'700',color:'rgba(185,28,28,0.65)',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 0.3rem'}}>Motivo de rechazo</p>
                                    <p style={{fontSize:'0.85rem',color:'rgba(185,28,28,0.85)',margin:'0 0 0.3rem',fontWeight:'600'}}>{detalle.motivo_rechazo}</p>
                                    {detalle.mensaje_rechazo && <p style={{fontSize:'0.8rem',color:'rgba(120,60,10,0.7)',margin:0,lineHeight:'1.5'}}>{detalle.mensaje_rechazo}</p>}
                                </div>
                            )}

                            <Section title={`Productos (${detalle.items.length})`}>
                                {detalle.items.map((item, i) => (
                                    <div key={i} style={{display:'flex',alignItems:'center',gap:'0.65rem',padding:'0.65rem 0.875rem',
                                        borderBottom:i<detalle.items.length-1?'1px solid rgba(200,140,80,0.08)':'none'}}>
                                        {/* ✅ CORREGIDO: compatible con URL completa o ruta relativa */}
                                        {item.imagen
                                            ? <img src={imgSrc(item.imagen)} alt={item.nombre} style={{width:'40px',height:'40px',borderRadius:'7px',objectFit:'cover',flexShrink:0}} />
                                            : <div style={{width:'40px',height:'40px',borderRadius:'7px',background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0}}>👔</div>
                                        }
                                        <div style={{flex:1,minWidth:0}}>
                                            <p style={{fontSize:'0.82rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.nombre}</p>
                                            <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>{item.cantidad} × {formatCOP(item.precio_unitario)}</p>
                                        </div>
                                        <p style={{fontSize:'0.84rem',fontWeight:'700',color:'#2d1a08',flexShrink:0}}>{formatCOP(item.subtotal)}</p>
                                    </div>
                                ))}
                            </Section>

                            {TRANSICIONES[detalle.estado]?.length > 0 && (
                                <div style={{borderTop:'1px solid rgba(200,140,80,0.1)',paddingTop:'1.5rem',marginTop:'0.5rem'}}>
                                    <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.75rem'}}>Cambiar estado</p>
                                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                                        {TRANSICIONES[detalle.estado].map(nuevoEstado => {
                                            const ac = ACCIONES[nuevoEstado];
                                            return (
                                                <button key={nuevoEstado} className="btn-accion"
                                                        style={{background:ac.bg,border:`1px solid ${ac.border}`,color:ac.color}}
                                                        onClick={() => abrirModalEstado(detalle.id, nuevoEstado)}>
                                                    {ac.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {TRANSICIONES[detalle.estado]?.length === 0 && (
                                <div style={{padding:'0.875rem',borderRadius:'12px',textAlign:'center',
                                    background:ESTADOS[detalle.estado]?.bg,border:`1px solid ${ESTADOS[detalle.estado]?.border}`}}>
                                    <p style={{fontSize:'0.84rem',fontWeight:'600',color:ESTADOS[detalle.estado]?.color,margin:0}}>
                                        {ESTADOS[detalle.estado]?.emoji} Estado final: {ESTADOS[detalle.estado]?.label}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal cambio de estado */}
            {modalEstado && (
                <div className="modal-center-overlay" onClick={() => setModalEstado(null)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.3rem'}}>
                            {ACCIONES[modalEstado.nuevoEstado]?.label || 'Cambiar estado'}
                        </h3>
                        <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.6)',margin:'0 0 1.25rem',lineHeight:'1.5'}}>
                            Ingresa tu contraseña para confirmar esta acción.
                        </p>

                        <div style={{marginBottom:'0.875rem'}}>
                            <label className="ck-label">Notas internas (opcional)</label>
                            <textarea className="ck-input" value={notas} onChange={e => setNotas(e.target.value)}
                                      placeholder="Notas para registro interno..." rows={2}
                                      style={{resize:'vertical'}} />
                        </div>

                        {modalEstado.nuevoEstado === 'rechazado' && (
                            <>
                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Motivo de rechazo</label>
                                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginBottom:'0.5rem'}}>
                                        {MOTIVOS_RECHAZO.map(m => (
                                            <span key={m} className={`motivo-chip${motivo===m?' selected':''}`}
                                                  onClick={() => setMotivo(motivo===m?'':m)}>{m}</span>
                                        ))}
                                    </div>
                                    <input className="ck-input" value={motivo} onChange={e => setMotivo(e.target.value)}
                                           placeholder="O escribe un motivo personalizado..." style={{marginTop:'0.3rem'}} />
                                </div>
                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Mensaje para el cliente (opcional)</label>
                                    <textarea className="ck-input" value={mensajeLibre} onChange={e => setMensajeLibre(e.target.value)}
                                              placeholder="Ej: Rectifica el número de cuenta y vuelve a realizar la transferencia..." rows={3}
                                              style={{resize:'vertical'}} />
                                </div>
                                <div style={{padding:'0.75rem',borderRadius:'10px',background:'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.18)',marginBottom:'0.875rem'}}>
                                    <p style={{fontSize:'0.76rem',color:'rgba(29,78,216,0.8)',margin:0,lineHeight:'1.5'}}>
                                        ℹ️ Se enviará un correo al cliente con el motivo y datos de contacto.
                                    </p>
                                </div>
                            </>
                        )}

                        <div style={{marginBottom:'1rem'}}>
                            <label className="ck-label">🔒 Contraseña de administrador</label>
                            <input className="ck-input" type="password" value={password}
                                   onChange={e => { setPassword(e.target.value); setPwError(''); }}
                                   placeholder="Tu contraseña de acceso" />
                            {pwError && <p style={{fontSize:'0.74rem',color:'rgba(185,28,28,0.88)',margin:'0.3rem 0 0',fontWeight:'500'}}>{pwError}</p>}
                        </div>

                        <div style={{display:'flex',gap:'0.6rem'}}>
                            <button onClick={() => setModalEstado(null)}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'1px solid rgba(200,140,80,0.28)',
                                        background:'rgba(255,255,255,0.05)',color:'rgba(120,60,10,0.75)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'500',cursor:'pointer'}}>
                                Cancelar
                            </button>
                            <button onClick={confirmarCambioEstado} disabled={processing}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'none',
                                        background:modalEstado.nuevoEstado==='rechazado'?'rgba(220,38,38,0.12)':'rgba(16,185,129,0.12)',
                                        color:modalEstado.nuevoEstado==='rechazado'?'rgba(185,28,28,0.9)':'rgba(4,120,87,0.9)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',opacity:processing?0.5:1}}>
                                {processing ? 'Confirmando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal datos de pago */}
            {modalPago && (
                <div className="modal-center-overlay" onClick={() => { setModalPago(false); setPagoEditing(null); }}>
                    <div className="modal-card" style={{maxWidth:'520px'}} onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                            <h3 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',margin:0}}>💳 Datos de pago</h3>
                            <button onClick={() => { setModalPago(false); setPagoEditing(null); }}
                                    style={{width:'28px',height:'28px',borderRadius:'8px',border:'1px solid rgba(200,140,80,0.25)',
                                        background:'rgba(255,255,255,0.05)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(120,60,10,0.6)'}}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.6)',marginBottom:'1rem',lineHeight:'1.5'}}>
                            Haz clic en un método para editar su número o QR.
                        </p>

                        {metodosPago.map(m => (
                            <div key={m.id} className={`pago-card${pagoEditing?.id===m.id?' editing':''}`}
                                 onClick={() => { if(pagoEditing?.id!==m.id){ setPagoEditing(m); setPagoNumero(m.numero||''); setPagoQrFile(null); setPagoEliminarQr(false); } }}>
                                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                    <span style={{fontSize:'1.3rem'}}>{METODO_EMOJIS[m.metodo]}</span>
                                    <div style={{flex:1}}>
                                        <p style={{fontSize:'0.88rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.15rem'}}>{m.metodo}</p>
                                        <p style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.6)',margin:0}}>{m.numero || 'Sin número configurado'}</p>
                                    </div>
                                    {m.qr_url && <img src={m.qr_url} alt="QR" style={{width:'36px',height:'36px',borderRadius:'6px',objectFit:'cover'}} />}
                                    <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                </div>

                                {pagoEditing?.id === m.id && (
                                    <div style={{marginTop:'0.875rem',paddingTop:'0.875rem',borderTop:'1px solid rgba(200,140,80,0.15)'}}
                                         onClick={e => e.stopPropagation()}>
                                        <label className="ck-label">Número / Cuenta</label>
                                        <input className="ck-input" value={pagoNumero} onChange={e => setPagoNumero(e.target.value)}
                                               placeholder="Ej: 310 123 4567" style={{marginBottom:'0.75rem'}} />

                                        <label className="ck-label">Imagen QR</label>
                                        {m.qr_url && (
                                            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                                                <img src={m.qr_url} alt="QR actual" style={{width:'50px',height:'50px',borderRadius:'8px',objectFit:'cover'}} />
                                                <label style={{display:'flex',alignItems:'center',gap:'0.4rem',cursor:'pointer',fontSize:'0.78rem',color:'rgba(185,28,28,0.8)'}}>
                                                    <input type="checkbox" checked={pagoEliminarQr} onChange={e => setPagoEliminarQr(e.target.checked)} />
                                                    Eliminar QR actual
                                                </label>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={e => setPagoQrFile(e.target.files[0])}
                                               style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.8)',marginBottom:'0.75rem'}} />

                                        <div style={{display:'flex',gap:'0.5rem'}}>
                                            <button onClick={() => setPagoEditing(null)}
                                                    style={{flex:1,padding:'0.6rem',borderRadius:'10px',border:'1px solid rgba(200,140,80,0.28)',
                                                        background:'rgba(255,255,255,0.04)',color:'rgba(120,60,10,0.7)',
                                                        fontFamily:'Inter,sans-serif',fontSize:'0.8rem',cursor:'pointer'}}>
                                                Cancelar
                                            </button>
                                            <button onClick={guardarPago} disabled={pagoProcessing}
                                                    style={{flex:1,padding:'0.6rem',borderRadius:'10px',border:'none',
                                                        background:'rgba(16,185,129,0.12)',color:'rgba(4,120,87,0.9)',
                                                        fontFamily:'Inter,sans-serif',fontSize:'0.8rem',fontWeight:'600',cursor:'pointer',opacity:pagoProcessing?0.5:1}}>
                                                {pagoProcessing?'Guardando...':'Guardar cambios'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal datos de contacto */}
            {modalContacto && (
                <div className="modal-center-overlay" onClick={() => setModalContacto(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <h3 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.3rem'}}>📞 Datos de contacto</h3>
                        <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.6)',margin:'0 0 1.25rem',lineHeight:'1.5'}}>
                            Los campos vacíos no se mostrarán a los clientes.
                        </p>
                        {[
                            { key:'telefono1', label:'Teléfono 1', placeholder:'Ej: 3164385067' },
                            { key:'telefono2', label:'Teléfono 2 (opcional)', placeholder:'Ej: 3157649875' },
                            { key:'correo1',   label:'Correo 1', placeholder:'Ej: tienda@gmail.com' },
                            { key:'correo2',   label:'Correo 2 (opcional)', placeholder:'Ej: soporte@gmail.com' },
                        ].map(f => (
                            <div key={f.key} style={{marginBottom:'0.75rem'}}>
                                <label className="ck-label">{f.label}</label>
                                <input className="ck-input" value={contactoForm[f.key] || ''}
                                       onChange={e => setContactoForm(prev => ({...prev, [f.key]: e.target.value}))}
                                       placeholder={f.placeholder} />
                            </div>
                        ))}
                        <div style={{display:'flex',gap:'0.6rem',marginTop:'0.5rem'}}>
                            <button onClick={() => setModalContacto(false)}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'1px solid rgba(200,140,80,0.28)',
                                        background:'rgba(255,255,255,0.05)',color:'rgba(120,60,10,0.75)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',cursor:'pointer'}}>
                                Cancelar
                            </button>
                            <button onClick={guardarContacto} disabled={contactoProcessing}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'none',
                                        background:'rgba(16,185,129,0.12)',color:'rgba(4,120,87,0.9)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',opacity:contactoProcessing?0.5:1}}>
                                {contactoProcessing?'Guardando...':'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal limpiar historial */}
            {modalHistorial && (
                <div className="modal-center-overlay" onClick={() => setModalHistorial(false)}>
                    <div className="modal-card" onClick={e => e.stopPropagation()}>
                        <div style={{textAlign:'center',marginBottom:'1.25rem'}}>
                            <div style={{width:'56px',height:'56px',borderRadius:'50%',margin:'0 auto 0.875rem',
                                background:'rgba(220,38,38,0.08)',border:'1px solid rgba(220,38,38,0.22)',
                                display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>🗑️</div>
                            <h3 style={{fontSize:'1rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.35rem'}}>Limpiar historial</h3>
                            <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.65)',margin:0,lineHeight:'1.5'}}>
                                Se moverán a la papelera los pedidos <strong>entregados, rechazados o cancelados</strong> con más de 1 mes de antigüedad.
                            </p>
                        </div>
                        <label className="ck-label">🔒 Contraseña de administrador</label>
                        <input className="ck-input" type="password" value={historialPw}
                               onChange={e => setHistorialPw(e.target.value)}
                               placeholder="Tu contraseña de acceso"
                               style={{marginBottom:'1rem'}} />
                        <div style={{display:'flex',gap:'0.6rem'}}>
                            <button onClick={() => setModalHistorial(false)}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'1px solid rgba(200,140,80,0.28)',
                                        background:'rgba(255,255,255,0.05)',color:'rgba(120,60,10,0.75)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',cursor:'pointer'}}>
                                Cancelar
                            </button>
                            <button onClick={eliminarHistorial} disabled={historialProcessing || !historialPw}
                                    style={{flex:1,padding:'0.75rem',borderRadius:'12px',border:'none',
                                        background:'rgba(220,38,38,0.12)',color:'rgba(185,28,28,0.9)',
                                        fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',
                                        opacity:(historialProcessing||!historialPw)?0.45:1}}>
                                {historialProcessing?'Eliminando...':'Confirmar'}
                            </button>
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

function Row({ label, value, highlight }) {
    return (
        <div style={{display:'flex',justifyContent:'space-between',padding:'0.55rem 0.875rem',borderBottom:'1px solid rgba(200,140,80,0.07)'}}>
            <span style={{fontSize:'0.76rem',color:'rgba(150,80,20,0.55)',fontWeight:'500'}}>{label}</span>
            <span style={{fontSize:'0.82rem',fontWeight:highlight?'700':'600',color:highlight?'rgba(185,28,28,0.85)':'#2d1a08',textAlign:'right',maxWidth:'60%'}}>{value}</span>
        </div>
    );
}
