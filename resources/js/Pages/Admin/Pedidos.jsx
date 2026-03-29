// resources/js/Pages/Admin/Pedidos/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const ESTADOS = {
    revision:    { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  color: 'rgba(146,64,14,0.9)',  label: 'En Revisión',   emoji: '🕐' },
    aprobado:    { bg: 'rgba(59,130,246,0.09)', border: 'rgba(59,130,246,0.28)', color: 'rgba(29,78,216,0.9)',  label: 'Aprobado',      emoji: '✅' },
    envio_curso: { bg: 'rgba(139,92,246,0.09)', border: 'rgba(139,92,246,0.28)', color: 'rgba(109,40,217,0.9)', label: 'Envío en Curso', emoji: '🚚' },
    entregado:   { bg: 'rgba(16,185,129,0.09)', border: 'rgba(16,185,129,0.28)', color: 'rgba(4,120,87,0.9)',   label: 'Entregado',     emoji: '📦' },
    rechazado:   { bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.25)',  color: 'rgba(185,28,28,0.9)',  label: 'Rechazado',     emoji: '❌' },
};

const TRANSICIONES = {
    revision:    ['aprobado', 'rechazado'],
    aprobado:    ['envio_curso', 'rechazado'],
    envio_curso: ['entregado'],
    entregado:   [],
    rechazado:   [],
    cancelado:   [],
};

const ACCIONES_LABEL = {
    aprobado:    { label: '✅ Aprobar pedido',   bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: 'rgba(4,120,87,0.9)'    },
    envio_curso: { label: '🚚 Marcar enviado',   bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.35)',  color: 'rgba(109,40,217,0.9)'  },
    entregado:   { label: '📦 Marcar entregado', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  color: 'rgba(4,120,87,0.9)'    },
    rechazado:   { label: '❌ Rechazar',         bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.3)',    color: 'rgba(185,28,28,0.9)'   },
};

export default function AdminPedidos({ pedidos, conteos, filtro }) {
    const { flash } = usePage().props;
    const [detalle, setDetalle]           = useState(null);
    const [notas, setNotas]               = useState('');
    const [processing, setProcessing]     = useState(false);
    const [filtroActivo, setFiltroActivo] = useState(filtro || '');

    const filtrarPor = (estado) => {
        const nuevo = filtroActivo === estado ? '' : estado;
        setFiltroActivo(nuevo);
        router.get('/admin/pedidos', nuevo ? { estado: nuevo } : {}, { preserveState: true });
    };

    const cambiarEstado = (pedidoId, estado) => {
        setProcessing(true);
        router.patch(
            `/admin/pedidos/${pedidoId}/estado`,
            { estado, notas_admin: notas },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setNotas('');
                    if (detalle && detalle.id === pedidoId) {
                        setDetalle((prev) => prev ? { ...prev, estado } : prev);
                    }
                },
                onError: () => setProcessing(false),
            }
        );
    };

    const pedidosFiltrados = filtroActivo
        ? pedidos.filter((p) => p.estado === filtroActivo)
        : pedidos;

    return (
        <AppLayout>
            <Head title="Pedidos — Admin VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }

                .adm-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 20px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 12px 40px rgba(180,90,20,0.07), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                }
                .adm-glass::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none;
                }

                .tab-btn {
                    padding:0.5rem 1rem; border-radius:20px; border:none; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.78rem; font-weight:600;
                    transition:all 0.2s ease; white-space:nowrap;
                }

                .pedido-row {
                    display:grid; gap:0.5rem; padding:1rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.08);
                    cursor:pointer; transition:background 0.15s;
                    grid-template-columns: 1fr 1.2fr 1fr auto auto auto;
                    align-items:center;
                }
                .pedido-row:hover { background:rgba(255,255,255,0.05); }
                .pedido-row:last-child { border-bottom:none; }

                .modal-overlay {
                    position:fixed; inset:0; z-index:200;
                    background:rgba(30,10,0,0.28);
                    backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
                    display:flex; align-items:flex-start; justify-content:flex-end;
                }
                .detalle-panel {
                    width:min(500px,100vw); height:100vh; overflow-y:auto;
                    background:rgba(255,250,245,0.97);
                    backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px);
                    border-left:1px solid rgba(255,255,255,0.75);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12);
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',sans-serif;
                }
                .detalle-panel::-webkit-scrollbar { width:4px; }
                .detalle-panel::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }

                .btn-estado {
                    padding:0.65rem 1rem; border-radius:12px; border:none; cursor:pointer;
                    font-family:'Inter',sans-serif; font-size:0.82rem; font-weight:600;
                    transition:all 0.2s ease; flex:1; text-align:center;
                }
                .btn-estado:hover:not(:disabled) { filter:brightness(1.05); transform:translateY(-1px); }
                .btn-estado:disabled { opacity:0.5; cursor:not-allowed; }

                .alert-success {
                    padding:0.875rem 1rem; border-radius:14px; margin-bottom:1.5rem;
                    background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25);
                    font-size:0.84rem; color:rgba(4,120,87,0.9); font-weight:500;
                }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: `radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
                    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)`,
                fontFamily: 'Inter,sans-serif',
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            Administración
                        </p>
                        <h1 style={{ fontSize: '1.9rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>
                            Pedidos de clientes
                        </h1>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                            Gestiona y verifica los pedidos recibidos
                        </p>
                    </div>

                    {flash?.success && <div className="alert-success">{flash.success}</div>}

                    {/* Filtros por estado */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                        <button
                            className="tab-btn"
                            style={{
                                background: !filtroActivo ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.06)',
                                border: !filtroActivo ? '1px solid rgba(220,38,38,0.35)' : '1px solid rgba(200,140,80,0.25)',
                                color: !filtroActivo ? 'rgba(185,28,28,0.9)' : 'rgba(120,60,10,0.7)',
                            }}
                            onClick={() => filtrarPor('')}
                        >
                            Todos ({pedidos.length})
                        </button>
                        {Object.entries(ESTADOS).map(([key, st]) => (
                            <button
                                key={key}
                                className="tab-btn"
                                style={{
                                    background: filtroActivo === key ? st.bg : 'rgba(255,255,255,0.06)',
                                    border: filtroActivo === key ? `1px solid ${st.border}` : '1px solid rgba(200,140,80,0.2)',
                                    color: filtroActivo === key ? st.color : 'rgba(120,60,10,0.6)',
                                }}
                                onClick={() => filtrarPor(key)}
                            >
                                {st.emoji} {st.label} ({conteos[key] || 0})
                            </button>
                        ))}
                    </div>

                    {/* Tabla */}
                    <div className="adm-glass anim-1">
                        {/* Cabecera */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr auto auto auto',
                            gap: '0.5rem', padding: '0.875rem 1.25rem',
                            borderBottom: '1px solid rgba(200,140,80,0.12)',
                            background: 'rgba(255,255,255,0.02)',
                        }}>
                            {['Pedido', 'Cliente', 'Fecha / Método', 'Estado', 'Total', ''].map((h, i) => (
                                <p key={i} style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                    {h}
                                </p>
                            ))}
                        </div>

                        {pedidosFiltrados.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(150,80,20,0.5)' }}>
                                    No hay pedidos {filtroActivo ? `con estado "${ESTADOS[filtroActivo]?.label}"` : ''}.
                                </p>
                            </div>
                        ) : (
                            pedidosFiltrados.map((p) => {
                                const st = ESTADOS[p.estado] || ESTADOS.revision;
                                return (
                                    <div key={p.id} className="pedido-row" onClick={() => setDetalle(p)}>
                                        <div>
                                            <p style={{ fontSize: '0.88rem', fontWeight: '700', color: '#2d1a08', margin: '0 0 0.15rem' }}>{p.numero_pedido}</p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>{p.items.length} artículo{p.items.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2d1a08', margin: '0 0 0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre_cliente}</p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email_cliente}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.78rem', color: 'rgba(120,55,10,0.7)', margin: '0 0 0.15rem' }}>{p.created_at}</p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>{p.metodo_pago}</p>
                                        </div>
                                        <div style={{ padding: '0.3rem 0.65rem', borderRadius: '20px', background: st.bg, border: `1px solid ${st.border}`, whiteSpace: 'nowrap' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: st.color }}>{st.emoji} {st.label}</span>
                                        </div>
                                        <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#2d1a08', margin: 0, whiteSpace: 'nowrap' }}>
                                            {formatCOP(p.total)}
                                        </p>
                                        <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Panel lateral de detalle */}
            {detalle && (
                <div className="modal-overlay" onClick={() => setDetalle(null)}>
                    <div className="detalle-panel" onClick={(e) => e.stopPropagation()}>

                        {/* Header del panel */}
                        <div style={{
                            padding: '1.5rem', borderBottom: '1px solid rgba(200,140,80,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            position: 'sticky', top: 0, background: 'rgba(255,250,245,0.97)', zIndex: 1,
                            backdropFilter: 'blur(20px)',
                        }}>
                            <div>
                                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#2d1a08', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
                                    {detalle.numero_pedido}
                                </h2>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '0.2rem 0.65rem', borderRadius: '20px',
                                    background: ESTADOS[detalle.estado]?.bg || ESTADOS.revision.bg,
                                    border: `1px solid ${ESTADOS[detalle.estado]?.border || ESTADOS.revision.border}`,
                                }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: ESTADOS[detalle.estado]?.color || ESTADOS.revision.color }}>
                                        {ESTADOS[detalle.estado]?.emoji} {ESTADOS[detalle.estado]?.label}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setDetalle(null)} style={{
                                width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(200,140,80,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(120,60,10,0.6)',
                            }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            {/* Cliente */}
                            <Section title="Cliente">
                                <Row label="Nombre"   value={detalle.nombre_cliente} />
                                <Row label="Email"    value={detalle.email_cliente || '—'} />
                                <Row label="Teléfono" value={detalle.telefono} />
                            </Section>

                            {/* Envío */}
                            <Section title="Envío">
                                <Row label="Ciudad"    value={detalle.ciudad} />
                                <Row label="Dirección" value={detalle.direccion} />
                                {detalle.indicaciones && <Row label="Indicaciones" value={detalle.indicaciones} />}
                            </Section>

                            {/* Pago */}
                            <Section title="Pago">
                                <Row label="Método" value={detalle.metodo_pago} />
                                <Row label="Total"  value={formatCOP(detalle.total)} highlight />
                                <Row label="Fecha"  value={detalle.created_at} />
                            </Section>

                            {/* Comprobante */}
                            {detalle.comprobante && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                                        Comprobante de pago
                                    </p>
                                    <a href={detalle.comprobante} target="_blank" rel="noopener noreferrer"
                                       style={{ display: 'block', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(200,140,80,0.2)' }}>
                                        {detalle.comprobante.endsWith('.pdf') ? (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.04)', color: 'rgba(185,28,28,0.8)', fontSize: '0.88rem', fontWeight: '600' }}>
                                                📄 Ver comprobante PDF →
                                            </div>
                                        ) : (
                                            <img src={detalle.comprobante} alt="Comprobante"
                                                 style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block', background: 'rgba(255,255,255,0.06)' }} />
                                        )}
                                    </a>
                                    <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', textAlign: 'center', marginTop: '0.4rem' }}>
                                        Clic para ver en tamaño completo
                                    </p>
                                </div>
                            )}

                            {/* Productos */}
                            <Section title={`Productos (${detalle.items.length})`}>
                                {detalle.items.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem 0.875rem',
                                        borderBottom: i < detalle.items.length - 1 ? '1px solid rgba(200,140,80,0.08)' : 'none',
                                    }}>
                                        {item.imagen
                                            ? <img src={`/storage/${item.imagen}`} alt={item.nombre}
                                                   style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                            : <div style={{
                                                width: '44px', height: '44px', borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.06)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', flexShrink: 0,
                                            }}>👔</div>
                                        }
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.84rem', fontWeight: '600', color: '#2d1a08', margin: '0 0 0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.nombre}
                                            </p>
                                            <p style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.55)', margin: 0 }}>
                                                {item.cantidad} × {formatCOP(item.precio_unitario)}
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2d1a08', flexShrink: 0 }}>
                                            {formatCOP(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </Section>

                            {/* Notas admin */}
                            {detalle.notas_admin && (
                                <div style={{
                                    marginBottom: '1.5rem', padding: '0.875rem 1rem', borderRadius: '12px',
                                    background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)',
                                }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'rgba(29,78,216,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.3rem' }}>
                                        Notas internas
                                    </p>
                                    <p style={{ fontSize: '0.84rem', color: 'rgba(29,78,216,0.8)', margin: 0 }}>{detalle.notas_admin}</p>
                                </div>
                            )}

                            {/* Cambiar estado */}
                            {TRANSICIONES[detalle.estado] && TRANSICIONES[detalle.estado].length > 0 && (
                                <div style={{ borderTop: '1px solid rgba(200,140,80,0.1)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                                    <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
                                        Cambiar estado
                                    </p>

                                    <textarea
                                        value={notas}
                                        onChange={(e) => setNotas(e.target.value)}
                                        placeholder="Notas internas (opcional)..."
                                        rows={2}
                                        style={{
                                            width: '100%', padding: '0.75rem 0.875rem', boxSizing: 'border-box',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.3)',
                                            borderRadius: '12px', fontSize: '0.84rem', color: '#2d1a08',
                                            fontFamily: 'Inter,sans-serif', outline: 'none', resize: 'vertical',
                                            marginBottom: '0.875rem',
                                        }}
                                    />

                                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                                        {TRANSICIONES[detalle.estado].map((nuevoEstado) => {
                                            const accion = ACCIONES_LABEL[nuevoEstado] || {
                                                label: ESTADOS[nuevoEstado]?.label || nuevoEstado,
                                                bg:    ESTADOS[nuevoEstado]?.bg    || 'rgba(200,140,80,0.1)',
                                                border:ESTADOS[nuevoEstado]?.border|| 'rgba(200,140,80,0.3)',
                                                color: ESTADOS[nuevoEstado]?.color || 'rgba(120,60,10,0.8)',
                                            };
                                            return (
                                                <button
                                                    key={nuevoEstado}
                                                    className="btn-estado"
                                                    style={{ background: accion.bg, border: `1px solid ${accion.border}`, color: accion.color }}
                                                    disabled={processing}
                                                    onClick={() => cambiarEstado(detalle.id, nuevoEstado)}
                                                >
                                                    {processing ? 'Guardando...' : accion.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Estado final */}
                            {TRANSICIONES[detalle.estado] && TRANSICIONES[detalle.estado].length === 0 && (
                                <div style={{
                                    padding: '1rem', borderRadius: '14px', textAlign: 'center',
                                    background: ESTADOS[detalle.estado]?.bg || 'rgba(200,140,80,0.07)',
                                    border: `1px solid ${ESTADOS[detalle.estado]?.border || 'rgba(200,140,80,0.2)'}`,
                                }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '600', color: ESTADOS[detalle.estado]?.color || 'rgba(120,60,10,0.7)', margin: 0 }}>
                                        {ESTADOS[detalle.estado]?.emoji} Pedido en estado final: {ESTADOS[detalle.estado]?.label}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                {title}
            </p>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(200,140,80,0.1)', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
}

function Row({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.875rem', borderBottom: '1px solid rgba(200,140,80,0.07)' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.55)', fontWeight: '500' }}>{label}</span>
            <span style={{ fontSize: '0.84rem', fontWeight: highlight ? '700' : '600', color: highlight ? 'rgba(185,28,28,0.85)' : '#2d1a08', textAlign: 'right', maxWidth: '60%' }}>
                {value}
            </span>
        </div>
    );
}
