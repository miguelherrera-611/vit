// resources/js/Pages/Admin/Reclamos.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ESTADOS = {
    pendiente:   { bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)',  color:'rgba(146,64,14,0.9)',  label:'Pendiente',   emoji:'🕐' },
    en_revision: { bg:'rgba(59,130,246,0.09)', border:'rgba(59,130,246,0.28)', color:'rgba(29,78,216,0.9)',  label:'En revisión', emoji:'🔍' },
    resuelto:    { bg:'rgba(16,185,129,0.09)', border:'rgba(16,185,129,0.28)', color:'rgba(4,120,87,0.9)',   label:'Resuelto',    emoji:'✅' },
    cerrado:     { bg:'rgba(200,140,80,0.07)', border:'rgba(200,140,80,0.22)', color:'rgba(150,80,20,0.7)',  label:'Cerrado',     emoji:'🔒' },
};

// ── Checkbox MUY visible, igual al de Registros ───────────────
function GlassCheck({ checked, onChange, indeterminate = false, disabled = false }) {
    return (
        <span
            onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(); }}
            style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '17px', height: '17px', flexShrink: 0,
                borderRadius: '5px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                background: checked
                    ? 'rgba(185,28,28,0.15)'
                    : 'rgba(255,255,255,0.85)',
                border: checked
                    ? '2px solid rgba(185,28,28,0.7)'
                    : disabled
                        ? '2px solid rgba(150,100,50,0.3)'
                        : '2px solid rgba(120,70,20,0.55)',
                boxShadow: checked
                    ? '0 0 0 3px rgba(185,28,28,0.1), inset 0 1px 0 rgba(255,255,255,0.4)'
                    : '0 1px 3px rgba(100,60,10,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
                opacity: disabled ? 0.35 : 1,
            }}
        >
            {checked && !indeterminate && (
                <svg width="9" height="9" fill="none" viewBox="0 0 10 10">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5"
                          stroke="rgba(185,28,28,0.9)" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
            {indeterminate && (
                <svg width="8" height="2" fill="none" viewBox="0 0 8 2">
                    <path d="M0 1h8" stroke="rgba(185,28,28,0.9)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )}
        </span>
    );
}

export default function AdminReclamos({ reclamos, conteos, filtro }) {
    const { flash } = usePage().props;

    // Panel detalle
    const [detalle, setDetalle]           = useState(null);
    const [nuevoEstado, setNuevoEstado]   = useState('');
    const [notas, setNotas]               = useState('');
    const [processing, setProcessing]     = useState(false);
    const [filtroActivo, setFiltroActivo] = useState(filtro || '');

    // Selección y eliminación
    const [seleccionados, setSeleccionados] = useState([]);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [password, setPassword]           = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [processingDel, setProcessingDel] = useState(false);
    const [errorElegible, setErrorElegible] = useState('');

    const reclamosList = reclamos.data || [];
    const elegibles    = reclamosList.filter(r => r.puede_eliminar);

    const filtrarPor = (estado) => {
        const nuevo = filtroActivo === estado ? '' : estado;
        setFiltroActivo(nuevo);
        setSeleccionados([]);
        router.get('/admin/reclamos', nuevo ? { estado: nuevo } : {}, { preserveState: true });
    };

    const abrirDetalle = (reclamo, e) => {
        e.stopPropagation();
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

    // Toggle de un reclamo — sin validaciones, cualquiera se puede marcar
    const toggleSeleccion = (id) => {
        setErrorElegible('');
        setSeleccionados(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleTodos = () => {
        setErrorElegible('');
        const todosIds = reclamosList.map(r => r.id);
        setSeleccionados(seleccionados.length === todosIds.length ? [] : todosIds);
    };

    const todosSeleccionados = reclamosList.length > 0 && seleccionados.length === reclamosList.length;
    const algunoSeleccionado = seleccionados.length > 0;

    // Botón eliminar: valida ANTES de abrir modal
    const handleClickEliminar = () => {
        if (seleccionados.length === 0) return;

        const noElegibles = seleccionados
            .map(id => reclamosList.find(r => r.id === id))
            .filter(r => r && !r.puede_eliminar);

        if (noElegibles.length > 0) {
            const msgs = noElegibles.map(r => {
                if (r.estado !== 'cerrado')
                    return `#${r.id} (estado: ${ESTADOS[r.estado]?.label ?? r.estado} — debe ser Cerrado)`;
                return `#${r.id} (menos de 30 días de antigüedad)`;
            });
            setErrorElegible(`No se puede eliminar: ${msgs.join(' · ')}`);
            return;
        }

        setErrorElegible('');
        setPassword('');
        setErrorPassword('');
        setModalEliminar(true);
    };

    const enviarEliminacion = (e) => {
        e.preventDefault();
        setProcessingDel(true);
        setErrorPassword('');
        router.post('/admin/reclamos/eliminar', {
            ids:      seleccionados,
            password: password,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessingDel(false);
                setModalEliminar(false);
                setSeleccionados([]);
                setPassword('');
                setErrorElegible('');
            },
            onError: (errs) => {
                setErrorPassword(errs.password || errs.ids || 'Error al procesar.');
                setProcessingDel(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Reclamos — Admin VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
                @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
                @keyframes slideUp      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes spin         { to{transform:rotate(360deg)} }

                .adm-glass {
                    background:rgba(255,255,255,0.55);
                    backdrop-filter:blur(22px) saturate(150%);
                    -webkit-backdrop-filter:blur(22px) saturate(150%);
                    border-radius:20px;
                    border:1px solid rgba(200,140,80,0.2);
                    box-shadow:0 8px 32px rgba(180,90,20,0.08),inset 0 1.5px 0 rgba(255,255,255,0.9);
                    position:relative;overflow:hidden;
                }

                .tab-btn {
                    padding:0.45rem 0.875rem;border-radius:20px;border:1px solid transparent;
                    cursor:pointer;font-family:'Inter',sans-serif;font-size:0.75rem;font-weight:600;
                    transition:all 0.2s ease;white-space:nowrap;background:none;
                }

                /* Tabla — scroll horizontal, NUNCA ocultar columnas */
                .table-scroll { overflow-x:auto;-webkit-overflow-scrolling:touch; }
                .rg-table { width:100%;border-collapse:collapse;min-width:600px; }
                .rg-th {
                    padding:0.7rem 1rem;text-align:left;
                    font-size:0.65rem;font-weight:700;color:rgba(120,60,10,0.6);
                    text-transform:uppercase;letter-spacing:0.07em;
                    background:rgba(240,220,195,0.25);
                    border-bottom:1.5px solid rgba(200,140,80,0.18);
                    white-space:nowrap;
                }
                .rg-td {
                    padding:0.75rem 1rem;
                    border-bottom:1px solid rgba(200,140,80,0.09);
                    font-size:0.81rem;color:#2d1a08;vertical-align:middle;
                }
                .rg-tr { transition:background 0.12s; }
                .rg-tr:hover { background:rgba(255,255,255,0.5); }
                .rg-tr.selected { background:rgba(220,38,38,0.05); }
                .rg-tr:last-child .rg-td { border-bottom:none; }

                /* Panel lateral */
                .modal-overlay {
                    position:fixed;inset:0;z-index:200;background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
                    display:flex;align-items:flex-start;justify-content:flex-end;
                    animation:fadeIn 0.2s both;
                }
                .detalle-panel {
                    width:min(480px,100vw);height:100vh;overflow-y:auto;
                    background:rgba(255,250,245,0.97);backdrop-filter:blur(40px);
                    border-left:1px solid rgba(255,255,255,0.75);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12);
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif;
                }
                .detalle-panel::-webkit-scrollbar { width:4px; }
                .detalle-panel::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3);border-radius:4px; }

                .ck-input {
                    width:100%;padding:0.75rem 0.875rem;
                    background:rgba(255,255,255,0.06);border:1px solid rgba(200,140,80,0.35);
                    border-radius:12px;font-size:0.85rem;color:#2d1a08;
                    font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;transition:border-color 0.2s;
                }
                .ck-input:focus { border-color:rgba(200,140,80,0.65);background:rgba(255,255,255,0.12); }
                .ck-label {
                    display:block;font-size:0.68rem;font-weight:700;
                    color:rgba(150,80,20,0.6);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.35rem;
                }

                .alert-success {
                    padding:0.75rem 1rem;border-radius:12px;margin-bottom:1.25rem;
                    background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);
                    font-size:0.82rem;color:rgba(4,120,87,0.9);font-weight:500;
                    display:flex;align-items:center;gap:0.5rem;
                }
                .alert-error-inline {
                    padding:0.75rem 1rem;border-radius:12px;margin-bottom:1.25rem;
                    background:rgba(220,38,38,0.07);border:1px solid rgba(220,38,38,0.25);
                    font-size:0.82rem;color:rgba(185,28,28,0.9);font-weight:500;
                    display:flex;align-items:flex-start;gap:0.5rem;line-height:1.55;
                }

                .wa-btn {
                    display:inline-flex;align-items:center;gap:0.5rem;padding:0.65rem 1.25rem;
                    border-radius:12px;cursor:pointer;font-family:'Inter',sans-serif;font-size:0.85rem;font-weight:600;
                    background:rgba(22,163,74,0.12);border:1px solid rgba(22,163,74,0.35);
                    color:rgba(21,128,61,0.9);text-decoration:none;transition:all 0.2s;
                }
                .wa-btn:hover { background:rgba(22,163,74,0.2);transform:translateY(-1px); }

                .estado-grid { display:grid;grid-template-columns:1fr 1fr;gap:0.5rem; }
                .estado-card {
                    display:flex;align-items:center;gap:0.55rem;padding:0.65rem 0.875rem;
                    border-radius:14px;border:1.5px solid transparent;cursor:pointer;
                    transition:all 0.18s ease;background:rgba(255,255,255,0.04);
                    font-family:'Inter',sans-serif;text-align:left;position:relative;overflow:hidden;
                }
                .estado-card::before {
                    content:'';position:absolute;inset:0;border-radius:13px;
                    background:linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 60%);pointer-events:none;
                }
                .estado-card:hover { transform:translateY(-1px);box-shadow:0 4px 14px rgba(180,90,20,0.08); }
                .estado-card.active { box-shadow:0 4px 16px rgba(180,90,20,0.1),inset 0 1px 0 rgba(255,255,255,0.6); }
                .estado-card .check-ring {
                    width:18px;height:18px;border-radius:50%;border:2px solid currentColor;
                    display:flex;align-items:center;justify-content:center;
                    flex-shrink:0;transition:all 0.18s;opacity:0.45;
                }
                .estado-card.active .check-ring { opacity:1;background:currentColor;border-color:currentColor; }
                .estado-emoji { font-size:1rem;line-height:1;flex-shrink:0; }
                .estado-card-label { font-size:0.78rem;font-weight:600;line-height:1.2; }

                .btn-danger {
                    display:flex;align-items:center;gap:0.4rem;padding:0.6rem 1.1rem;
                    border-radius:9px;cursor:pointer;font-family:'Inter',sans-serif;
                    font-size:0.8rem;font-weight:500;
                    background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.28);
                    color:rgba(185,28,28,0.9);transition:all 0.15s;white-space:nowrap;
                }
                .btn-danger:hover { background:rgba(220,38,38,0.14);border-color:rgba(220,38,38,0.4); }

                /* Modal confirmación */
                .confirm-overlay {
                    position:fixed;inset:0;z-index:300;background:rgba(20,8,0,0.28);
                    backdrop-filter:blur(5px);display:flex;align-items:center;
                    justify-content:center;padding:1rem;animation:fadeIn 0.18s both;
                }
                .confirm-card {
                    width:100%;max-width:420px;background:rgba(253,248,244,0.97);
                    backdrop-filter:blur(40px);border:1px solid rgba(200,140,80,0.18);
                    border-radius:18px;box-shadow:0 20px 60px rgba(180,90,20,0.14);
                    overflow:hidden;animation:slideUp 0.28s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif;
                }
                .confirm-header {
                    padding:1.35rem 1.5rem 1rem;border-bottom:1px solid rgba(200,140,80,0.1);
                    display:flex;align-items:center;gap:0.75rem;
                }
                .confirm-icon {
                    width:34px;height:34px;border-radius:9px;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    background:rgba(220,38,38,0.07);border:1px solid rgba(220,38,38,0.18);
                }
                .confirm-body { padding:1.25rem 1.5rem 1.5rem; }
                .confirm-warning {
                    padding:0.75rem 0.9rem;border-radius:9px;margin-bottom:1.1rem;
                    background:rgba(220,38,38,0.05);border:1px solid rgba(220,38,38,0.16);
                    font-size:0.79rem;line-height:1.55;color:rgba(185,28,28,0.85);
                }
                .confirm-input {
                    width:100%;padding:0.7rem 0.9rem;background:rgba(255,255,255,0.6);
                    border:1px solid rgba(200,140,80,0.2);border-radius:9px;font-size:0.85rem;
                    color:#2d1a08;font-family:'Inter',sans-serif;outline:none;
                    transition:all 0.13s;box-sizing:border-box;
                }
                .confirm-input:focus {
                    background:rgba(255,255,255,0.9);border-color:rgba(185,28,28,0.3);
                    box-shadow:0 0 0 3px rgba(185,28,28,0.06);
                }
                .confirm-error {
                    margin-top:0.35rem;font-size:0.73rem;color:rgba(185,28,28,0.8);
                    display:flex;align-items:flex-start;gap:0.35rem;line-height:1.5;
                }
                .confirm-actions { display:flex;gap:0.6rem;margin-top:1.1rem; }
                .btn-ghost-sm {
                    flex:1;padding:0.72rem;border-radius:9px;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.84rem;font-weight:500;
                    background:rgba(255,255,255,0.45);border:1px solid rgba(200,140,80,0.2);
                    color:rgba(120,60,10,0.7);transition:all 0.15s;
                }
                .btn-confirm-red {
                    flex:1;padding:0.72rem;border-radius:9px;cursor:pointer;
                    font-family:'Inter',sans-serif;font-size:0.84rem;font-weight:500;
                    background:rgba(185,28,28,0.08);border:1px solid rgba(185,28,28,0.22);
                    color:rgba(185,28,28,0.9);transition:all 0.15s;
                    display:flex;align-items:center;justify-content:center;gap:0.4rem;
                }
                .btn-confirm-red:hover:not(:disabled) { background:rgba(185,28,28,0.14); }
                .btn-confirm-red:disabled { opacity:0.4;cursor:not-allowed; }

                .selection-bar {
                    display:flex;align-items:center;justify-content:space-between;
                    padding:0.6rem 1rem;border-bottom:1px solid rgba(200,140,80,0.1);
                    background:rgba(220,38,38,0.03);flex-wrap:wrap;gap:0.5rem;
                }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
            `}</style>

            <div style={{
                minHeight:'100vh',
                background:`radial-gradient(ellipse 75% 60% at 0% 0%,rgba(255,210,170,0.22) 0%,transparent 55%),
                    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%,transparent 55%),
                    linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%)`,
                fontFamily:'Inter,sans-serif',
            }}>
                <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                    {/* ── HEADER ── */}
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
                        <div>
                            <p style={{fontSize:'0.67rem',fontWeight:'600',color:'rgba(150,80,20,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',margin:'0 0 0.3rem'}}>Administración</p>
                            <h1 style={{fontSize:'1.75rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',margin:'0 0 0.3rem'}}>Reclamos de clientes</h1>
                            <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.6)',margin:0}}>Gestiona y resuelve los reclamos recibidos</p>
                        </div>

                        {/* Botón eliminar — externo a la tabla, arriba a la derecha */}
                        {algunoSeleccionado && (
                            <button className="btn-danger" onClick={handleClickEliminar}>
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Mover a papelera ({seleccionados.length})
                            </button>
                        )}
                    </div>

                    {/* Flash éxito */}
                    {flash?.success && (
                        <div className="alert-success">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Error de elegibilidad — aparece arriba al hacer clic en el botón */}
                    {errorElegible && (
                        <div className="alert-error-inline">
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:'1px'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <span>{errorElegible}</span>
                        </div>
                    )}

                    {/* ── FILTROS ── */}
                    <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.75rem'}}>
                        <button className="tab-btn"
                                style={{background:!filtroActivo?'rgba(220,38,38,0.1)':'rgba(255,255,255,0.06)',
                                    borderColor:!filtroActivo?'rgba(220,38,38,0.35)':'rgba(200,140,80,0.22)',
                                    color:!filtroActivo?'rgba(185,28,28,0.9)':'rgba(120,60,10,0.6)'}}
                                onClick={() => filtrarPor('')}>
                            Todos ({reclamos.total ?? reclamosList.length})
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

                    {/* ── TABLA ── */}
                    <div className="adm-glass anim-1">

                        {/* Barra de selección activa */}
                        {algunoSeleccionado && (
                            <div className="selection-bar">
                                <p style={{fontSize:'0.75rem',fontWeight:'500',color:'rgba(185,28,28,0.8)',margin:0}}>
                                    {seleccionados.length} seleccionado{seleccionados.length !== 1 ? 's' : ''}
                                </p>
                                <button onClick={() => { setSeleccionados([]); setErrorElegible(''); }}
                                        style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.5)',background:'none',border:'none',cursor:'pointer',padding:0,fontFamily:'Inter,sans-serif'}}>
                                    Deseleccionar todo
                                </button>
                            </div>
                        )}

                        {reclamosList.length === 0 ? (
                            <div style={{textAlign:'center',padding:'3.5rem 1rem'}}>
                                <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.45)',margin:0}}>
                                    No hay reclamos{filtroActivo ? ` con estado "${ESTADOS[filtroActivo]?.label}"` : ''}.
                                </p>
                            </div>
                        ) : (
                            /* scroll horizontal — toda la info en móvil */
                            <div className="table-scroll">
                                <table className="rg-table">
                                    <thead>
                                    <tr>
                                        <th className="rg-th" style={{width:'44px',paddingRight:'0.5rem'}}>
                                            <GlassCheck
                                                checked={todosSeleccionados}
                                                indeterminate={algunoSeleccionado && !todosSeleccionados}
                                                onChange={toggleTodos}
                                            />
                                        </th>
                                        <th className="rg-th">Tipo</th>
                                        <th className="rg-th">Cliente</th>
                                        <th className="rg-th">Teléfono</th>
                                        <th className="rg-th">Fecha</th>
                                        <th className="rg-th">Estado</th>
                                        <th className="rg-th" style={{width:'44px'}}></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reclamosList.map((r) => {
                                        const st      = ESTADOS[r.estado] || ESTADOS.pendiente;
                                        const marcado = seleccionados.includes(r.id);

                                        return (
                                            <tr key={r.id} className={`rg-tr${marcado ? ' selected' : ''}`}>

                                                {/* Checkbox — clic normal, sin restricciones */}
                                                <td className="rg-td" style={{paddingRight:'0.5rem'}}>
                                                    <GlassCheck
                                                        checked={marcado}
                                                        onChange={() => toggleSeleccion(r.id)}
                                                    />
                                                </td>

                                                {/* Tipo */}
                                                <td className="rg-td">
                                                    <p style={{fontSize:'0.84rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.1rem',whiteSpace:'nowrap'}}>{r.tipo_label}</p>
                                                    <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>#{r.id}</p>
                                                </td>

                                                {/* Cliente */}
                                                <td className="rg-td">
                                                    <p style={{fontSize:'0.82rem',fontWeight:'500',color:'#2d1a08',margin:0,whiteSpace:'nowrap'}}>{r.cliente}</p>
                                                </td>

                                                {/* Teléfono */}
                                                <td className="rg-td" style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.7)',whiteSpace:'nowrap'}}>
                                                    {r.telefono_contacto}
                                                </td>

                                                {/* Fecha */}
                                                <td className="rg-td" style={{fontSize:'0.76rem',color:'rgba(120,55,10,0.65)',whiteSpace:'nowrap'}}>
                                                    {r.created_at}
                                                </td>

                                                {/* Estado */}
                                                <td className="rg-td">
                                                    <div style={{display:'inline-flex',padding:'0.22rem 0.6rem',borderRadius:'20px',background:st.bg,border:`1px solid ${st.border}`,whiteSpace:'nowrap'}}>
                                                        <span style={{fontSize:'0.7rem',fontWeight:'700',color:st.color}}>{st.emoji} {st.label}</span>
                                                    </div>
                                                </td>

                                                {/* Botón ver detalle */}
                                                <td className="rg-td" style={{textAlign:'center'}}>
                                                    <button onClick={(e) => abrirDetalle(r, e)} style={{
                                                        display:'inline-flex',alignItems:'center',justifyContent:'center',
                                                        width:'28px',height:'28px',borderRadius:'7px',cursor:'pointer',
                                                        background:'rgba(200,140,80,0.1)',border:'1px solid rgba(200,140,80,0.28)',
                                                        transition:'all 0.15s',
                                                    }}>
                                                        <svg width="13" height="13" fill="none" stroke="rgba(120,60,10,0.7)" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ── PAGINACIÓN ── */}
                    {reclamos.links && (
                        <div style={{display:'flex',justifyContent:'center',gap:'0.4rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
                            {reclamos.links.map((link, i) => (
                                <button key={i}
                                        disabled={!link.url || link.active}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        style={{
                                            padding:'0.4rem 0.75rem',borderRadius:'10px',cursor:link.url?'pointer':'default',
                                            fontFamily:'Inter,sans-serif',fontSize:'0.8rem',fontWeight:'600',
                                            background:link.active?'rgba(220,38,38,0.12)':'rgba(255,255,255,0.45)',
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

            {/* ══════════════════════════════════════════════════
                PANEL LATERAL DETALLE
            ══════════════════════════════════════════════════ */}
            {detalle && (
                <div className="modal-overlay" onClick={() => setDetalle(null)}>
                    <div className="detalle-panel" onClick={e => e.stopPropagation()}>

                        <div style={{padding:'1.5rem',borderBottom:'1px solid rgba(200,140,80,0.12)',
                            display:'flex',alignItems:'center',justifyContent:'space-between',
                            position:'sticky',top:0,background:'rgba(255,250,245,0.97)',zIndex:1,backdropFilter:'blur(20px)'}}>
                            <div>
                                <h2 style={{fontSize:'1rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.3rem'}}>{detalle.tipo_label}</h2>
                                <div style={{display:'inline-flex',alignItems:'center',gap:'0.3rem',padding:'0.2rem 0.6rem',borderRadius:'20px',
                                    background:ESTADOS[detalle.estado]?.bg,border:`1px solid ${ESTADOS[detalle.estado]?.border}`}}>
                                    <span style={{fontSize:'0.7rem',fontWeight:'700',color:ESTADOS[detalle.estado]?.color}}>
                                        {ESTADOS[detalle.estado]?.emoji} {ESTADOS[detalle.estado]?.label}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setDetalle(null)} style={{width:'30px',height:'30px',borderRadius:'9px',cursor:'pointer',
                                background:'rgba(255,255,255,0.1)',border:'1px solid rgba(200,140,80,0.2)',
                                display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(120,60,10,0.6)'}}>
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div style={{padding:'1.5rem'}}>
                            <Section title="Cliente">
                                <Row label="Nombre"   value={detalle.cliente} />
                                {detalle.email_cliente && <Row label="Email" value={detalle.email_cliente} />}
                                <Row label="Teléfono" value={detalle.telefono_contacto} />
                                <Row label="Fecha"    value={detalle.created_at} />
                            </Section>

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

                            <div style={{marginBottom:'1.5rem'}}>
                                <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.65rem'}}>Contactar cliente</p>
                                <a href={`https://wa.me/57${detalle.telefono_contacto}`} target="_blank" rel="noopener noreferrer" className="wa-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Abrir WhatsApp
                                </a>
                            </div>

                            <div style={{borderTop:'1px solid rgba(200,140,80,0.1)',paddingTop:'1.5rem'}}>
                                <p style={{fontSize:'0.66rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.75rem'}}>Gestionar reclamo</p>

                                <div style={{marginBottom:'0.875rem'}}>
                                    <label className="ck-label">Estado</label>
                                    <div className="estado-grid">
                                        {Object.entries(ESTADOS).map(([key, st]) => {
                                            const active = nuevoEstado === key;
                                            return (
                                                <button key={key} type="button"
                                                        className={`estado-card${active ? ' active' : ''}`}
                                                        onClick={() => setNuevoEstado(key)}
                                                        style={{
                                                            background:  active ? st.bg     : 'rgba(255,255,255,0.04)',
                                                            borderColor: active ? st.border  : 'rgba(200,140,80,0.18)',
                                                            color:       active ? st.color   : 'rgba(120,60,10,0.55)',
                                                        }}>
                                                    <span className="estado-emoji">{st.emoji}</span>
                                                    <span className="estado-card-label">{st.label}</span>
                                                    <div className="check-ring" style={{color: active ? st.color : 'rgba(150,80,20,0.35)', marginLeft:'auto'}}>
                                                        {active && (
                                                            <svg width="9" height="9" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div style={{marginBottom:'1rem'}}>
                                    <label className="ck-label">Notas internas</label>
                                    <textarea className="ck-input" value={notas} onChange={e => setNotas(e.target.value)}
                                              placeholder="Notas sobre la gestión del reclamo..."
                                              rows={3} style={{resize:'vertical'}} />
                                </div>

                                <div style={{display:'flex',gap:'0.6rem'}}>
                                    <button onClick={() => setDetalle(null)}
                                            style={{flex:1,padding:'0.75rem',borderRadius:'12px',
                                                border:'1px solid rgba(200,140,80,0.28)',background:'rgba(255,255,255,0.05)',
                                                color:'rgba(120,60,10,0.75)',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'500',cursor:'pointer'}}>
                                        Cancelar
                                    </button>
                                    <button onClick={guardar} disabled={processing}
                                            style={{flex:1,padding:'0.75rem',borderRadius:'12px',
                                                background:'rgba(16,185,129,0.12)',color:'rgba(4,120,87,0.9)',
                                                fontFamily:'Inter,sans-serif',fontSize:'0.85rem',fontWeight:'600',cursor:'pointer',
                                                border:'1px solid rgba(16,185,129,0.3)',transition:'all 0.2s',opacity:processing?0.5:1}}>
                                        {processing ? 'Guardando...' : 'Guardar cambios'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                MODAL CONFIRMAR ELIMINACIÓN
            ══════════════════════════════════════════════════ */}
            {modalEliminar && (
                <div className="confirm-overlay" onClick={() => setModalEliminar(false)}>
                    <div className="confirm-card" onClick={e => e.stopPropagation()}>
                        <div className="confirm-header">
                            <div className="confirm-icon">
                                <svg width="15" height="15" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <div>
                                <h2 style={{fontSize:'0.92rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.12rem',letterSpacing:'-0.02em'}}>
                                    Mover a papelera
                                </h2>
                                <p style={{fontSize:'0.71rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                    Confirmar identidad para continuar
                                </p>
                            </div>
                        </div>
                        <form onSubmit={enviarEliminacion} className="confirm-body">
                            <div className="confirm-warning">
                                Estás a punto de mover <strong>{seleccionados.length}</strong> reclamo{seleccionados.length !== 1 ? 's' : ''} a la papelera.
                                Podrás restaurarlos desde la papelera durante 30 días.
                            </div>
                            <div style={{marginBottom:'0.5rem'}}>
                                <label style={{display:'block',fontSize:'0.67rem',fontWeight:'500',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.4rem'}}>
                                    Contraseña actual
                                </label>
                                <input type="password" value={password}
                                       onChange={e => setPassword(e.target.value)}
                                       className="confirm-input"
                                       placeholder="Ingresa tu contraseña"
                                       autoFocus />
                                {errorPassword && (
                                    <p className="confirm-error">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {errorPassword}
                                    </p>
                                )}
                            </div>
                            <div className="confirm-actions">
                                <button type="button" className="btn-ghost-sm"
                                        onClick={() => { setModalEliminar(false); setPassword(''); setErrorPassword(''); }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-confirm-red" disabled={processingDel || !password}>
                                    {processingDel ? (
                                        <>
                                            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" style={{animation:'spin 1s linear infinite'}}>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10"/>
                                            </svg>
                                            Procesando...
                                        </>
                                    ) : 'Confirmar'}
                                </button>
                            </div>
                        </form>
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
