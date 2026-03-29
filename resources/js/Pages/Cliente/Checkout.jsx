// resources/js/Pages/Cliente/Checkout.jsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const METODOS_PAGO = [
    { id: 'Nequi',       label: 'Nequi',       emoji: '💜', numero: '310 000 0000',                      color: 'rgba(139,92,246,0.85)',  bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.3)'  },
    { id: 'Daviplata',   label: 'Daviplata',   emoji: '🔴', numero: '310 000 0001',                      color: 'rgba(220,38,38,0.85)',   bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.25)'  },
    { id: 'Bancolombia', label: 'Bancolombia', emoji: '🟡', numero: 'Cuenta de ahorros 123-456789-00',   color: 'rgba(202,138,4,0.9)',    bg: 'rgba(202,138,4,0.07)',   border: 'rgba(202,138,4,0.28)'  },
    { id: 'Davivienda',  label: 'Davivienda',  emoji: '🏠', numero: 'Cuenta de ahorros 987-654321-00',   color: 'rgba(185,28,28,0.85)',   bg: 'rgba(185,28,28,0.07)',   border: 'rgba(185,28,28,0.25)'  },
];

export default function Checkout() {
    const { auth } = usePage().props;
    const [carrito, setCarrito]       = useState([]);
    const [paso, setPaso]             = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors]         = useState({});
    const [preview, setPreview]       = useState(null);

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

    const total              = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const metodoSeleccionado = METODOS_PAGO.find((m) => m.id === form.metodo_pago);

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
            onSuccess: () => {
                sessionStorage.removeItem('vitali_carrito');
                setProcessing(false);
            },
            onError: (errs) => {
                setErrors(errs);
                setProcessing(false);
            },
        });
    };

    if (carrito.length === 0) return null;

    return (
        <ClienteLayout>
            <Head title="Checkout — VitaliStore" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

                .ck-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.08), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                }
                .ck-glass::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }
                .ck-label {
                    display:block; font-size:0.7rem; font-weight:700;
                    color:rgba(150,80,20,0.65); text-transform:uppercase;
                    letter-spacing:0.09em; margin-bottom:0.45rem;
                }
                .ck-input {
                    width:100%; padding:0.8rem 1rem;
                    background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.38);
                    border-radius:14px; font-size:0.9rem; color:#2d1a08;
                    font-family:'Inter',sans-serif; outline:none; transition:all 0.2s;
                    box-shadow:inset 0 1px 0 rgba(255,255,255,0.78); box-sizing:border-box;
                }
                .ck-input::placeholder { color:rgba(180,100,30,0.38); }
                .ck-input:focus {
                    background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65);
                    box-shadow:0 0 0 3px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.88);
                }
                .ck-error { margin-top:0.3rem; font-size:0.74rem; color:rgba(185,28,28,0.88); font-weight:500; }

                .metodo-card {
                    padding:1rem 1.25rem; border-radius:16px; cursor:pointer;
                    transition:all 0.2s ease;
                    display:flex; align-items:flex-start; gap:0.75rem;
                    background:rgba(255,255,255,0.04); border:2px solid rgba(200,140,80,0.15);
                }
                .metodo-card:hover { background:rgba(255,255,255,0.08); border-color:rgba(200,140,80,0.3); }

                .radio-circle {
                    width:20px; height:20px; border-radius:50%; flex-shrink:0; margin-top:0.15rem;
                    border:2px solid rgba(200,140,80,0.4); transition:all 0.2s;
                    display:flex; align-items:center; justify-content:center;
                }
                .radio-dot { width:8px; height:8px; border-radius:50%; background:white; }

                .upload-zone {
                    border:2px dashed rgba(200,140,80,0.35); border-radius:18px;
                    padding:2rem; text-align:center; cursor:pointer;
                    transition:all 0.2s; background:rgba(255,255,255,0.03);
                }
                .upload-zone:hover { border-color:rgba(220,38,38,0.4); background:rgba(220,38,38,0.03); }
                .upload-zone.has-file { border-color:rgba(16,185,129,0.4); background:rgba(16,185,129,0.04); }

                .paso-indicator {
                    display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:2.5rem;
                }
                .paso-step { display:flex; align-items:center; }
                .paso-circle {
                    width:32px; height:32px; border-radius:50%;
                    display:flex; align-items:center; justify-content:center;
                    font-size:0.75rem; font-weight:700; transition:all 0.3s;
                }
                .paso-circle.done    { background:rgba(16,185,129,0.15); border:2px solid rgba(16,185,129,0.5); color:rgba(4,120,87,0.85); }
                .paso-circle.active  { background:rgba(220,38,38,0.1); border:2px solid rgba(220,38,38,0.45); color:rgba(185,28,28,0.9); }
                .paso-circle.pending { background:rgba(200,140,80,0.07); border:2px solid rgba(200,140,80,0.2); color:rgba(150,80,20,0.4); }
                .paso-line      { width:60px; height:2px; background:rgba(200,140,80,0.15); }
                .paso-line.done { background:rgba(16,185,129,0.35); }

                .btn-nav { padding:0.8rem 1.75rem; border-radius:14px; font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600; cursor:pointer; transition:all 0.22s ease; border:none; }
                .btn-next { background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.38); color:rgba(185,28,28,0.95); box-shadow:0 6px 20px rgba(220,38,38,0.12),inset 0 1px 0 rgba(255,120,120,0.2); }
                .btn-next:hover:not(:disabled) { background:rgba(220,38,38,0.16); transform:translateY(-1px); box-shadow:0 10px 28px rgba(220,38,38,0.16); }
                .btn-next:disabled { opacity:0.4; cursor:not-allowed; }
                .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.28); color:rgba(120,60,10,0.7); }
                .btn-back:hover { background:rgba(255,255,255,0.14); color:rgba(90,40,5,0.9); }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.04em', marginBottom: '0.4rem' }}>
                    Finalizar compra
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)', marginBottom: '2.5rem' }}>
                    Completa tu pedido en pocos pasos
                </p>

                {/* Indicador de pasos */}
                <div className="paso-indicator">
                    {['Envío', 'Pago'].map((label, i) => (
                        <div key={i} className="paso-step">
                            {i > 0 && <div className={`paso-line${paso > i ? ' done' : ''}`} />}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                                <div className={`paso-circle${paso > i + 1 ? ' done' : paso === i + 1 ? ' active' : ' pending'}`}>
                                    {paso > i + 1
                                        ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        : i + 1
                                    }
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: paso === i + 1 ? 'rgba(185,28,28,0.8)' : 'rgba(150,80,20,0.45)', letterSpacing: '0.04em' }}>
                                    {label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

                    {/* Panel principal */}
                    <div style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>

                        {/* ── PASO 1: DATOS DE ENVÍO ── */}
                        {paso === 1 && (
                            <div className="ck-glass" style={{ padding: '2rem' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d1a08', marginBottom: '1.75rem', letterSpacing: '-0.02em' }}>
                                    📦 Datos de envío
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label className="ck-label">Nombre completo</label>
                                        <input className="ck-input" value={form.nombre_receptor}
                                               onChange={(e) => set('nombre_receptor', e.target.value)}
                                               placeholder="¿A nombre de quién?" />
                                        {errors.nombre_receptor && <p className="ck-error">{errors.nombre_receptor}</p>}
                                    </div>
                                    <div>
                                        <label className="ck-label">Teléfono de contacto</label>
                                        <input className="ck-input" type="tel" value={form.telefono_receptor}
                                               onChange={(e) => set('telefono_receptor', e.target.value)}
                                               placeholder="3001234567" />
                                        {errors.telefono_receptor && <p className="ck-error">{errors.telefono_receptor}</p>}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label className="ck-label">Ciudad</label>
                                    <input className="ck-input" value={form.ciudad}
                                           onChange={(e) => set('ciudad', e.target.value)}
                                           placeholder="Ej: Bogotá, Medellín, Cali..." />
                                    {errors.ciudad && <p className="ck-error">{errors.ciudad}</p>}
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label className="ck-label">Dirección de entrega</label>
                                    <input className="ck-input" value={form.direccion}
                                           onChange={(e) => set('direccion', e.target.value)}
                                           placeholder="Calle, número, barrio..." />
                                    {errors.direccion && <p className="ck-error">{errors.direccion}</p>}
                                </div>

                                <div>
                                    <label className="ck-label">
                                        Indicaciones adicionales{' '}
                                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', color: 'rgba(150,80,20,0.45)' }}>
                                            — opcional
                                        </span>
                                    </label>
                                    <textarea className="ck-input" value={form.indicaciones}
                                              onChange={(e) => set('indicaciones', e.target.value)}
                                              placeholder="Apartamento, torre, referencias del lugar..."
                                              rows={3} style={{ resize: 'vertical', minHeight: '80px' }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
                                    <button className="btn-nav btn-next"
                                            onClick={() => { if (validarPaso1()) setPaso(2); }}>
                                        Continuar al pago →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── PASO 2: PAGO ── */}
                        {paso === 2 && (
                            <div className="ck-glass" style={{ padding: '2rem' }}>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2d1a08', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                                    💳 Método de pago
                                </h2>
                                <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                    Selecciona cómo realizarás la transferencia y adjunta el comprobante.
                                </p>

                                {/* Métodos de pago */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                    {METODOS_PAGO.map((m) => {
                                        const sel = form.metodo_pago === m.id;
                                        return (
                                            <div
                                                key={m.id}
                                                className="metodo-card"
                                                style={sel ? {
                                                    background: m.bg,
                                                    borderColor: m.border,
                                                } : {}}
                                                onClick={() => set('metodo_pago', m.id)}
                                            >
                                                <div
                                                    className="radio-circle"
                                                    style={sel ? {
                                                        borderColor: m.color,
                                                        background:  m.color,
                                                    } : {}}
                                                >
                                                    {sel && <div className="radio-dot" />}
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                                        <span style={{ fontSize: '1rem' }}>{m.emoji}</span>
                                                        <span style={{ fontSize: '0.88rem', fontWeight: '700', color: sel ? m.color : '#2d1a08' }}>
                                                            {m.label}
                                                        </span>
                                                    </div>
                                                    <p style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.6)', margin: 0, lineHeight: '1.4' }}>
                                                        {m.numero}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {errors.metodo_pago && <p className="ck-error" style={{ marginBottom: '1rem' }}>{errors.metodo_pago}</p>}

                                {/* Info de la cuenta seleccionada */}
                                {metodoSeleccionado && (
                                    <div style={{
                                        padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '1.75rem',
                                        background: metodoSeleccionado.bg,
                                        border: `1px solid ${metodoSeleccionado.border}`,
                                    }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: '600', color: metodoSeleccionado.color, marginBottom: '0.3rem' }}>
                                            {metodoSeleccionado.emoji} Realiza la transferencia a:
                                        </p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2d1a08', margin: '0 0 0.2rem' }}>
                                            {metodoSeleccionado.numero}
                                        </p>
                                        <p style={{ fontSize: '0.78rem', color: 'rgba(120,60,10,0.7)', margin: 0 }}>
                                            Monto exacto: <strong>{formatCOP(total)}</strong>
                                        </p>
                                    </div>
                                )}

                                {/* Upload comprobante */}
                                <label className="ck-label">Comprobante de pago</label>
                                <div
                                    className={`upload-zone${form.comprobante ? ' has-file' : ''}`}
                                    onClick={() => document.getElementById('comprobante-input').click()}
                                >
                                    <input
                                        id="comprobante-input" type="file"
                                        accept="image/*,application/pdf"
                                        style={{ display: 'none' }}
                                        onChange={handleComprobante}
                                    />

                                    {preview ? (
                                        <div>
                                            <img src={preview} alt="Comprobante"
                                                 style={{ maxHeight: '160px', borderRadius: '10px', objectFit: 'contain', marginBottom: '0.75rem' }} />
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(4,120,87,0.8)', fontWeight: '600' }}>
                                                ✓ {form.comprobante.name}
                                            </p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.25rem' }}>
                                                Clic para cambiar
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📸</div>
                                            <p style={{ fontSize: '0.88rem', fontWeight: '600', color: 'rgba(120,60,10,0.75)', marginBottom: '0.3rem' }}>
                                                Adjuntar captura del comprobante
                                            </p>
                                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.5)' }}>
                                                JPG, PNG, WEBP o PDF · máx. 5 MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.comprobante && <p className="ck-error" style={{ marginTop: '0.4rem' }}>{errors.comprobante}</p>}

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem', gap: '0.75rem' }}>
                                    <button className="btn-nav btn-back" onClick={() => { setPaso(1); setErrors({}); }}>
                                        ← Volver
                                    </button>
                                    <button className="btn-nav btn-next"
                                            onClick={handleSubmit}
                                            disabled={processing}>
                                        {processing ? 'Enviando pedido...' : 'Confirmar pedido →'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="ck-glass" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#2d1a08', letterSpacing: '-0.01em', marginBottom: '1.25rem' }}>
                            Resumen del pedido
                        </h3>

                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                            {carrito.map((item) => (
                                <div key={item.id} style={{
                                    display: 'flex', gap: '0.75rem', padding: '0.75rem 0',
                                    borderBottom: '1px solid rgba(200,140,80,0.1)',
                                }}>
                                    {item.imagen
                                        ? <img src={`/storage/${item.imagen}`} alt={item.nombre}
                                               style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                                        : <div style={{
                                            width: '48px', height: '48px', borderRadius: '10px',
                                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(200,140,80,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.2rem', flexShrink: 0,
                                        }}>👔</div>
                                    }
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '0.82rem', fontWeight: '600', color: '#2d1a08', margin: '0 0 0.2rem',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {item.nombre}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.6)', margin: 0 }}>
                                            {item.cantidad} × {formatCOP(item.precio)}
                                        </p>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2d1a08', flexShrink: 0 }}>
                                        {formatCOP(item.precio * item.cantidad)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '1rem', borderRadius: '14px',
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.12)',
                            marginBottom: '1rem',
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(120,60,10,0.8)' }}>Total</span>
                            <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#2d1a08', letterSpacing: '-0.03em' }}>
                                {formatCOP(total)}
                            </span>
                        </div>

                        {/* Datos de envío resumen (paso 2) */}
                        {paso === 2 && form.nombre_receptor && (
                            <div style={{
                                padding: '0.875rem 1rem', borderRadius: '14px',
                                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                            }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: '700', color: 'rgba(4,120,87,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                    Envío a
                                </p>
                                <p style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(4,120,87,0.85)', margin: '0 0 0.15rem' }}>{form.nombre_receptor}</p>
                                <p style={{ fontSize: '0.78rem', color: 'rgba(4,120,87,0.7)', margin: 0, lineHeight: '1.4' }}>
                                    {form.direccion}, {form.ciudad}
                                </p>
                            </div>
                        )}

                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                            {['🚚 Envío a todo Colombia', '📸 Adjunta tu comprobante', '✅ Revisamos en máx. 24h'].map((t, i) => (
                                <p key={i} style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.55)', margin: i < 2 ? '0 0 0.3rem' : 0, lineHeight: '1.5' }}>
                                    {t}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
