// resources/js/Pages/Admin/Pedidos.jsx
// VERSIÓN COMPLETA — todas las funcionalidades nuevas implementadas
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
        router.patch('/admin/pedidos/contacto', { ...contactoForm }, {
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
                .pedido-row {
                    display:grid;gap:0.5rem;padding:0.875rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.08);cursor:pointer;
                    transition:background 0.15s;
                    grid-template-columns:1fr 1.2fr 1fr auto auto auto;align-items:center;
                }
                .pedido-row:hover { background:rgba(255,255,255,0.05); }
                .pedido-row:last-child { border-bottom:none; }

                .modal-overlay {
                    position:fixed; inset:0; z-index:200; background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
                    display:flex; align-items:flex-start; justify-content:flex-end; animation:fadeIn 0.2s both;
                }
                .detalle-panel {
                    width:min(500px,100vw); height:100%; overflow-y:auto;
                    background:rgba(255,250,245,0.97); backdrop-filter:blur(40px);
                    -webkit-backdrop-filter:blur(40px); border-left:1px solid rgba(255,255,255,0.75);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12);
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif;
                }

                .modal-center-overlay {
                    position:fixed; inset:0; z-index:300; background:rgba(30,10,0,0.35);
                    backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
                    display:flex; align-items:center; justify-content:center; padding:1rem; animation:fadeIn 0.2s both;
                }
                .modal-card {
                    width:100%; max-width:440px; max-height:calc(100vh - 2rem); overflow-y:auto;
                    background:rgba(255,250,245,0.97); backdrop-filter:blur(40px);
                    border:1px solid rgba(255,255,255,0.8); border-radius:28px; padding:2rem;
                    box-shadow:0 24px 64px rgba(180,90,20,0.18);
                    animation:staggerUp 0.25s cubic-bezier(0.16,1,0.3,1) both;
                }

                /* Nuevo: variante compacta para el modal de pago */
                .modal-card.pago-compacto{
                    max-height: min(64vh, 560px);
                    overflow-y: auto;
                    padding: 1.2rem;
                    border-radius: 18px;
                }

                @media (max-width: 768px){
                    .modal-card{
                        max-width:100%;
                        border-radius:18px;
                        padding:1.1rem;
                        max-height:calc(100vh - 1rem);
                    }

                    /* Compacto aún más en móvil */
                    .modal-card.pago-compacto{
                        max-height: min(58vh, 460px);
                        padding: .95rem;
                        border-radius: 14px;
                    }

                    .detalle-panel{
                        width:100vw;
                        border-left:none;
                        box-shadow:none;
                    }
                }

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

                .tabla-scroll {
                    width: 100%;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling: touch;
                }

                .tabla-inner {
                    min-width: 980px; /* fuerza horizontal en móvil */
                }

                .pedido-row {
                    display:grid;gap:0.5rem;padding:0.875rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.08);cursor:pointer;
                    transition:background 0.15s;
                    grid-template-columns:1fr 1.2fr 1fr auto auto auto;align-items:center;
                }

                @media (max-width: 768px){
                    .tabla-inner { min-width: 980px; }
                    .pedido-row { grid-template-columns:1fr 1.2fr 1fr auto auto auto; } /* mantener tabla */
                }

                .pager-wrap{
                    display:flex;justify-content:center;gap:0.4rem;margin-top:1.5rem;flex-wrap:wrap;
                }
                .pager-btn{
                    padding:0.4rem 0.75rem;border-radius:10px;
                    font-family:'Inter',sans-serif;font-size:0.8rem;font-weight:600;
                    border:1px solid rgba(200,140,80,0.2);
                    background:rgba(255,255,255,0.05);
                    color:rgba(120,60,10,0.65);
                    cursor:pointer;
                }
                .pager-btn.active{
                    background:rgba(220,38,38,0.12);
                    color:rgba(185,28,28,0.9);
                    border:1px solid rgba(220,38,38,0.35);
                }
                .pager-btn:disabled{ opacity:0.4; cursor:default; }

                .pager-placeholder{
                    display:flex;justify-content:center;gap:0.4rem;margin-top:1.5rem;flex-wrap:wrap;
                }
                .pager-ph-btn{
                    min-width:34px;height:32px;padding:0 0.6rem;border-radius:10px;
                    border:1px solid rgba(180,180,180,0.28);
                    background:rgba(220,220,220,0.22);
                    color:rgba(130,130,130,0.75);
                    font-family:'Inter',sans-serif;font-size:0.78rem;font-weight:600;
                    display:flex;align-items:center;justify-content:center;
                    user-select:none;
                }

                .qr-upload-row{
                    display:flex; align-items:center; gap:.55rem; flex-wrap:wrap;
                }
                .qr-upload-btn{
                    display:inline-flex; align-items:center; gap:.45rem;
                    padding:.55rem .8rem; border-radius:10px;
                    border:1px solid rgba(200,140,80,0.3);
                    background:rgba(255,255,255,0.08);
                    color:rgba(120,60,10,0.78);
                    font-family:'Inter',sans-serif; font-size:.78rem; font-weight:500;
                    cursor:pointer; transition:all .15s;
                    white-space:nowrap;
                }
                .qr-upload-btn:hover{
                    background:rgba(255,255,255,0.16);
                    border-color:rgba(200,140,80,0.45);
                }
                .qr-file-name{
                    flex:1 1 220px;
                    min-width:0;
                    max-width:100%;
                    padding:.52rem .68rem;
                    border-radius:9px;
                    border:1px solid rgba(200,140,80,0.2);
                    background:rgba(255,255,255,0.06);
                    color:rgba(120,60,10,0.68);
                    font-size:.74rem;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }

                .glass-check{
                    display:inline-flex; align-items:center; justify-content:center;
                    width:16px; height:16px; flex-shrink:0; border-radius:5px; cursor:'pointer';
                    transition:all .15s ease;
                    background:rgba(255,255,255,0.7);
                    border:1.5px solid rgba(200,130,60,0.35);
                    box-shadow:inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .glass-check.checked{
                    background:rgba(185,28,28,0.12);
                    border-color:rgba(185,28,28,0.45);
                    box-shadow:0 0 0 3px rgba(185,28,28,0.07), inset 0 1px 0 rgba(255,255,255,0.5);
                }
                .glass-check-mark{
                    width:9px; height:9px; display:block;
                }

                .qr-remove-row{
                    display:flex; align-items:center; gap:.45rem;
                    margin-top:.45rem;
                    color:rgba(185,28,28,0.82);
                    font-size:.78rem;
                    user-select:none;
                    cursor:pointer;
                }

                @media (max-width: 768px){
                    .qr-upload-row{ gap:.45rem; }
                    .qr-file-name{ flex:1 1 100%; }
                }
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
                        <div className="tabla-scroll">
                            <div className="tabla-inner">
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr 1fr auto auto auto',
                                    gap:'0.5rem',padding:'0.75rem 1.25rem',
                                    borderBottom:'1px solid rgba(200,140,80,0.12)',background:'rgba(255,255,255,0.02)'}}>
                                    {['Pedido','Cliente','Fecha / Método','Estado','Total',''].map((h,i) => (
                                        <p key={i} style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',margin:0,whiteSpace:'nowrap'}}>{h}</p>
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
                        </div>
                    </div>

                    {/* Paginación */}
                    {Array.isArray(pedidos.links) && pedidos.links.length > 3 ? (
                        <div className="pager-wrap">
                            {pedidos.links.map((link, i) => (
                                <button
                                    key={i}
                                    className={`pager-btn${link.active ? ' active' : ''}`}
                                    disabled={!link.url || link.active}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="pager-placeholder" aria-hidden="true">
                            <span className="pager-ph-btn">«</span>
                            <span className="pager-ph-btn">1</span>
                            <span className="pager-ph-btn">2</span>
                            <span className="pager-ph-btn">»</span>
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
                    >
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
                                            <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                                {item.talla && <span style={{fontWeight:'500'}}>Talla {item.talla} · </span>}
                                                {item.cantidad} × {formatCOP(item.precio_unitario)}
                                            </p>
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
                <div
                    className="modal-center-overlay"
                    onClick={() => setModalEstado(null)}
                    style={{ top: `${navOffset}px`, height: `calc(100vh - ${navOffset}px)` }}
                >
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
                <div
                    className="modal-center-overlay"
                    onClick={() => { setModalPago(false); setPagoEditing(null); }}
                    style={{
                        top: `${Math.max(navOffset - 10, 48)}px`,
                        height: `calc(100vh - ${Math.max(navOffset - 10, 48)}px)`,
                        padding: '0.45rem',
                    }}
                >
                    <div
                        className="modal-card pago-compacto"
                        style={{ maxWidth:'520px' }}
                        onClick={e => e.stopPropagation()}
                    >
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
                                            <div style={{display:'flex',alignItems:'flex-start',gap:'0.55rem',marginBottom:'0.55rem'}}>
                                                <img src={m.qr_url} alt="QR actual" style={{width:'50px',height:'50px',borderRadius:'8px',objectFit:'cover',flexShrink:0}} />
                                                <div style={{minWidth:0,flex:1}}>
                                                    <div
                                                        className="qr-remove-row"
                                                        onClick={() => setPagoEliminarQr((v) => !v)}
                                                    >
                                                        <span className={`glass-check${pagoEliminarQr ? ' checked' : ''}`}>
                                                            {pagoEliminarQr && (
                                                                <svg className="glass-check-mark" fill="none" viewBox="0 0 10 10">
                                                                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="rgba(185,28,28,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            )}
                                                        </span>
                                                        <span>Eliminar QR actual</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="qr-upload-row">
                                            <label htmlFor={`qr-input-${m.id}`} className="qr-upload-btn">
                                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>
                                                </svg>
                                                Seleccionar archivo
                                            </label>
                                            <input
                                                id={`qr-input-${m.id}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setPagoQrFile(e.target.files?.[0] || null)}
                                                style={{display:'none'}}
                                            />
                                            <div className="qr-file-name" title={pagoQrFile?.name || 'Sin archivo seleccionado'}>
                                                {pagoQrFile?.name || 'Sin archivo seleccionado'}
                                            </div>
                                        </div>

                                        {/* ✅ Botones de acción visibles nuevamente */}
                                        <div style={{display:'flex',gap:'0.55rem',marginTop:'0.85rem'}}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPagoEditing(null);
                                                    setPagoNumero('');
                                                    setPagoQrFile(null);
                                                    setPagoEliminarQr(false);
                                                }}
                                                style={{
                                                    flex:1,padding:'0.68rem',borderRadius:'10px',
                                                    border:'1px solid rgba(200,140,80,0.26)',
                                                    background:'rgba(255,255,255,0.06)',
                                                    color:'rgba(120,60,10,0.75)',
                                                    fontFamily:'Inter,sans-serif',fontSize:'0.8rem',fontWeight:'500',cursor:'pointer'
                                                }}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={guardarPago}
                                                disabled={pagoProcessing}
                                                style={{
                                                    flex:1,padding:'0.68rem',borderRadius:'10px',
                                                    border:'1px solid rgba(16,185,129,0.30)',
                                                    background:'rgba(16,185,129,0.10)',
                                                    color:'rgba(4,120,87,0.92)',
                                                    fontFamily:'Inter,sans-serif',fontSize:'0.8rem',fontWeight:'600',cursor:'pointer',
                                                    opacity:pagoProcessing?0.5:1
                                                }}
                                            >
                                                {pagoProcessing ? 'Guardando...' : 'Guardar cambios'}
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
                <div
                    className="modal-center-overlay"
                    onClick={() => setModalContacto(false)}
                    style={{ top: `${navOffset}px`, height: `calc(100vh - ${navOffset}px)` }}
                >
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
                <div
                    className="modal-center-overlay"
                    onClick={() => setModalHistorial(false)}
                    style={{ top: `${navOffset}px`, height: `calc(100vh - ${navOffset}px)` }}
                >
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
