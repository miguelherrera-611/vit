import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const MOTIVOS = {
    incremento: [
        { value: 'Ingreso mercancía', label: 'Ingreso de mercancía',   icon: '📦' },
        { value: 'Devolución',        label: 'Devolución de cliente',  icon: '↩️' },
        { value: 'Error conteo',      label: 'Error de conteo',        icon: '🔢' },
        { value: 'Otro',              label: 'Otro',                   icon: '📝' },
    ],
    decremento: [
        { value: 'Daño',         label: 'Daño',                   icon: '💔' },
        { value: 'Robo',         label: 'Robo',                   icon: '🚨' },
        { value: 'Devolución',   label: 'Devolución a proveedor', icon: '↩️' },
        { value: 'Error conteo', label: 'Error de conteo',        icon: '🔢' },
        { value: 'Otro',         label: 'Otro',                   icon: '📝' },
    ],
};

const PRODUCTOS_POR_PAGINA = 6;
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%,rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .aj-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .aj-hdr {
        background:rgba(255,255,255,0.08); backdrop-filter:blur(40px) saturate(180%);
        -webkit-backdrop-filter:blur(40px) saturate(180%);
        border-bottom:1px solid rgba(255,255,255,0.68);
        box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85);
        position:relative; z-index:2;
    }
    .aj-glass {
        background:rgba(255,255,255,0.04); backdrop-filter:blur(22px) saturate(150%);
        -webkit-backdrop-filter:blur(22px) saturate(150%);
        border:1px solid rgba(255,255,255,0.65); border-radius:24px;
        box-shadow:0 16px 48px rgba(180,90,20,0.1),0 4px 14px rgba(180,90,20,0.06),
            inset 0 1.5px 0 rgba(255,255,255,0.88);
        position:relative; overflow:hidden; padding:1.75rem;
    }
    .aj-glass::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 30%,rgba(255,255,255,0.95) 70%,transparent);
        pointer-events:none; z-index:1;
    }
    .aj-step-num {
        width:28px; height:28px; border-radius:9px; flex-shrink:0;
        background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.2);
        display:flex; align-items:center; justify-content:center;
        font-size:0.72rem; font-weight:700; color:rgba(185,28,28,0.8);
    }
    .aj-step-title { font-size:0.97rem; font-weight:600; color:#2d1a08; }
    .aj-trigger {
        width:100%; display:flex; align-items:center; justify-content:space-between;
        padding:0.75rem 1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.88rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        cursor:pointer; transition:all 0.2s; backdrop-filter:blur(10px);
        box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75);
        text-align:left;
    }
    .aj-trigger.open  { border-color:rgba(200,140,80,0.65); background:rgba(255,255,255,0.12); }
    .aj-trigger.error { border-color:rgba(220,38,38,0.45); }
    @keyframes ajDrop {
        from { opacity:0; transform:translateY(-6px) scale(0.98); }
        to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .aj-panel {
        position:fixed; z-index:999999;
        background:rgba(255,248,240,0.99);
        backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%);
        border:1px solid rgba(255,255,255,0.72); border-radius:18px;
        box-shadow:0 24px 64px rgba(180,90,20,0.2),0 8px 24px rgba(180,90,20,0.1),
                   inset 0 1px 0 rgba(255,255,255,0.9);
        overflow:hidden; animation:ajDrop 0.17s cubic-bezier(0.16,1,0.3,1);
        font-family:'Inter',-apple-system,sans-serif;
    }
    .aj-search-wrap { padding:0.6rem 0.75rem 0.45rem; border-bottom:1px solid rgba(200,140,80,0.14); }
    .aj-search {
        width:100%; padding:0.5rem 2rem 0.5rem 2.1rem;
        background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.35); border-radius:11px;
        font-size:0.82rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); transition:all 0.17s; box-sizing:border-box;
    }
    .aj-search:focus { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.16); }
    .aj-search::placeholder { color:rgba(180,100,30,0.38); }
    .aj-opt {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.65rem 1rem; cursor:pointer; border:none; background:none;
        width:100%; text-align:left; font-family:'Inter',sans-serif; transition:background 0.12s;
    }
    .aj-opt:hover  { background:rgba(255,255,255,0.55); }
    .aj-opt.active { background:rgba(220,38,38,0.06); }
    .aj-pager {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.45rem 0.75rem; border-top:1px solid rgba(200,140,80,0.12);
    }
    .aj-pager-btn {
        display:flex; align-items:center; gap:0.3rem; padding:0.28rem 0.6rem;
        border-radius:8px; cursor:pointer; font-size:0.73rem; font-weight:500;
        color:rgba(120,60,10,0.7); background:none; border:none;
        font-family:'Inter',sans-serif; transition:background 0.12s;
    }
    .aj-pager-btn:hover:not(:disabled) { background:rgba(255,255,255,0.65); }
    .aj-pager-btn:disabled { opacity:0.28; cursor:not-allowed; }
    .aj-pager-dot {
        width:24px; height:24px; border-radius:7px; cursor:pointer;
        font-size:0.72rem; font-weight:600; border:none; font-family:'Inter',sans-serif; transition:all 0.12s;
    }
    .aj-textarea {
        width:100%; padding:0.8rem 1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.88rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        resize:none; transition:all 0.2s; backdrop-filter:blur(10px);
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.75); box-sizing:border-box;
    }
    .aj-textarea::placeholder { color:rgba(180,100,30,0.38); }
    .aj-textarea:focus { border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),inset 0 1px 0 rgba(255,255,255,0.85); }
    .aj-label {
        display:block; font-size:0.7rem; font-weight:600;
        color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem;
    }
    .aj-error { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .aj-hint  { margin-top:0.3rem; font-size:0.74rem; color:rgba(150,80,20,0.5); }
    .aj-btn-submit {
        flex:1; display:flex; align-items:center; justify-content:center; gap:0.45rem;
        padding:0.85rem 1.5rem;
        background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:16px;
        font-size:0.9rem; font-weight:600; color:rgba(185,28,28,0.95);
        cursor:pointer; transition:all 0.2s; font-family:'Inter',sans-serif;
        box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.25);
    }
    .aj-btn-submit:hover:not(:disabled) { background:rgba(220,38,38,0.16); transform:translateY(-1px); }
    .aj-btn-submit:disabled { opacity:0.4; cursor:not-allowed; }
    .aj-btn-cancel {
        flex:1; display:flex; align-items:center; justify-content:center;
        padding:0.85rem 1.5rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:16px;
        font-size:0.9rem; font-weight:500; color:rgba(120,60,10,0.8);
        text-decoration:none; transition:all 0.18s; font-family:'Inter',sans-serif;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.78);
    }
    .aj-btn-cancel:hover { background:rgba(255,255,255,0.14); }
    @keyframes ajUp {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
    }
    .aj-a1 { animation:ajUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
    .aj-a2 { animation:ajUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
    .aj-a3 { animation:ajUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.19s both; }
    .aj-a4 { animation:ajUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.26s both; }
`;

// ── Hook: mantiene la posición fixed sincronizada con el trigger en todo momento
// Escucha scroll en TODOS los contenedores (capture:true) y resize
function useAnchoredPanel(trigRef, open) {
    const [pos, setPos] = useState({ top: -9999, left: 0, width: 0 });

    useEffect(() => {
        if (!open) return;

        function update() {
            if (!trigRef.current) return;
            const r = trigRef.current.getBoundingClientRect();
            setPos({ top: r.bottom + 6, left: r.left, width: r.width });
        }

        update();
        window.addEventListener('scroll', update, true); // true = capture, atrapa scroll de cualquier padre
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [open]);

    return pos;
}

// ── Dropdown de motivo ────────────────────────────────────────────────────────
function MotivoSelect({ value, onChange, options, placeholder, error }) {
    const [open, setOpen] = useState(false);
    const trigRef         = useRef(null);
    const panelRef        = useRef(null);
    const pos             = useAnchoredPanel(trigRef, open);

    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (!trigRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const selected = options.find(o => o.value === value);

    return (
        <>
            <button type="button" ref={trigRef}
                    onClick={() => setOpen(o => !o)}
                    className={`aj-trigger${open ? ' open' : ''}${error ? ' error' : ''}`}>
                <span style={{ color: selected ? '#2d1a08' : 'rgba(180,100,30,0.38)', fontWeight: selected ? '500' : '400', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selected ? <><span>{selected.icon}</span><span>{selected.label}</span></> : placeholder}
                </span>
                <svg style={{ width: '14px', height: '14px', color: 'rgba(150,80,20,0.45)', flexShrink: 0, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && createPortal(
                <div ref={panelRef} className="aj-panel" style={{ top: pos.top, left: pos.left, width: pos.width }}>
                    {options.map((opt, i) => {
                        const sel = opt.value === value;
                        return (
                            <button key={opt.value} type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`aj-opt${sel ? ' active' : ''}`}
                                    style={{ borderBottom: i < options.length - 1 ? '1px solid rgba(200,140,80,0.1)' : 'none' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ fontSize: '1.1rem' }}>{opt.icon}</span>
                                    <span style={{ fontSize: '0.87rem', fontWeight: '500', color: sel ? 'rgba(185,28,28,0.9)' : 'rgba(80,40,8,0.82)' }}>{opt.label}</span>
                                </span>
                                {sel && (
                                    <svg style={{ width: '13px', height: '13px', color: 'rgba(185,28,28,0.8)', flexShrink: 0 }}
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>,
                document.body
            )}
        </>
    );
}

// ── Dropdown de producto con buscador + paginación ───────────────────────────
function ProductoSelect({ productos, value, onChange, error }) {
    const [open,     setOpen]     = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina,   setPagina]   = useState(1);
    const trigRef                 = useRef(null);
    const panelRef                = useRef(null);
    const inputRef                = useRef(null);
    const pos                     = useAnchoredPanel(trigRef, open);

    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (!trigRef.current?.contains(e.target) && !panelRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    useEffect(() => {
        if (open) {
            setPagina(1);
            setTimeout(() => inputRef.current?.focus(), 60);
        } else {
            setBusqueda('');
        }
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    const filtrados = useMemo(() => {
        const q = normalize(busqueda);
        return q ? productos.filter(p => normalize(p.nombre).includes(q) || normalize(p.categoria).includes(q)) : productos;
    }, [productos, busqueda]);

    const totalPags = Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA);
    const pagActual = filtrados.slice((pagina - 1) * PRODUCTOS_POR_PAGINA, pagina * PRODUCTOS_POR_PAGINA);
    const selected  = productos.find(p => String(p.id) === String(value));

    const stockColor = (stock) => {
        if (stock === 0) return { bg: 'rgba(220,38,38,0.08)', color: 'rgba(185,28,28,0.9)', border: 'rgba(220,38,38,0.2)' };
        if (stock <= 5)  return { bg: 'rgba(245,158,11,0.08)', color: 'rgba(146,64,14,0.9)', border: 'rgba(245,158,11,0.25)' };
        return { bg: 'rgba(16,185,129,0.08)', color: 'rgba(4,120,87,0.9)', border: 'rgba(16,185,129,0.2)' };
    };

    return (
        <>
            <button type="button" ref={trigRef}
                    onClick={() => setOpen(o => !o)}
                    className={`aj-trigger${open ? ' open' : ''}${error ? ' error' : ''}`}>
                {selected ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selected.nombre}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.55rem', borderRadius: '20px', flexShrink: 0, ...stockColor(selected.stock), border: `1px solid ${stockColor(selected.stock).border}` }}>
                            {selected.stock} uds
                        </span>
                    </span>
                ) : (
                    <span style={{ color: 'rgba(180,100,30,0.38)', fontSize: '0.88rem' }}>Selecciona un producto...</span>
                )}
                <svg style={{ width: '14px', height: '14px', color: 'rgba(150,80,20,0.45)', flexShrink: 0, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && createPortal(
                <div ref={panelRef} className="aj-panel" style={{ top: pos.top, left: pos.left, width: pos.width }}>
                    <div className="aj-search-wrap">
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '0.62rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                 width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={e => setBusqueda(e.target.value)}
                                   placeholder="Buscar por nombre o categoría..."
                                   className="aj-search" />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ position: 'absolute', right: '0.62rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.28rem', paddingLeft: '0.2rem' }}>
                            {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''}{busqueda && ` · "${busqueda}"`}
                        </p>
                    </div>

                    <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                        {pagActual.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.84rem', color: 'rgba(150,80,20,0.5)' }}>Sin resultados para <strong>"{busqueda}"</strong></p>
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ marginTop: '0.4rem', fontSize: '0.76rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : pagActual.map((p, i) => {
                            const sel = String(p.id) === String(value);
                            const sc  = stockColor(p.stock);
                            return (
                                <button key={p.id} type="button"
                                        onClick={() => { onChange(String(p.id)); setOpen(false); }}
                                        className={`aj-opt${sel ? ' active' : ''}`}
                                        style={{ borderBottom: i < pagActual.length - 1 ? '1px solid rgba(200,140,80,0.09)' : 'none' }}>
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <p style={{ fontSize: '0.87rem', fontWeight: '600', color: sel ? 'rgba(185,28,28,0.9)' : '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</p>
                                        {p.categoria && <p style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.1rem' }}>{p.categoria}</p>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.75rem', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.55rem', borderRadius: '20px', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                                            {p.stock} uds
                                        </span>
                                        {sel && (
                                            <svg style={{ width: '13px', height: '13px', color: 'rgba(185,28,28,0.8)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {totalPags > 1 && (
                        <div className="aj-pager">
                            <button type="button" className="aj-pager-btn" disabled={pagina === 1} onClick={() => setPagina(p => p - 1)}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Ant.
                            </button>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" className="aj-pager-dot" onClick={() => setPagina(n)}
                                            style={{
                                                background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)',
                                                color:      n === pagina ? 'rgba(185,28,28,0.9)'  : 'rgba(120,60,10,0.6)',
                                                border:     n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(200,140,80,0.2)',
                                            }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="aj-pager-btn" disabled={pagina === totalPags} onClick={() => setPagina(p => p + 1)}>
                                Sig.
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function InventarioAjustar({ productos = [] }) {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        producto_id: '', tipo_ajuste: 'incremento', cantidad: '1', motivo: '', observaciones: '',
    });

    const handleProductoChange = (id) => {
        setData('producto_id', id);
        setProductoSeleccionado(productos.find(p => String(p.id) === id) || null);
    };

    const handleTipoChange = (tipo) => {
        setData(prev => ({ ...prev, tipo_ajuste: tipo, motivo: '' }));
    };

    const submit = (e) => { e.preventDefault(); post('/inventario/ajustar'); };

    const resultado = useMemo(() => {
        if (!productoSeleccionado || !data.cantidad) return null;
        const cant = parseInt(data.cantidad) || 0;
        return data.tipo_ajuste === 'incremento'
            ? productoSeleccionado.stock + cant
            : Math.max(0, productoSeleccionado.stock - cant);
    }, [productoSeleccionado, data.cantidad, data.tipo_ajuste]);

    const esPlusSub = data.tipo_ajuste === 'incremento';

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="aj-bg">

                <div className="aj-hdr">
                    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <Link href="/inventario" style={{
                                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)',
                                borderRadius: '10px', color: 'rgba(150,80,20,0.6)', textDecoration: 'none',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)', flexShrink: 0,
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.45rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em' }}>Ajuste de Stock</h1>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.2rem' }}>Modifica el inventario con justificación obligatoria</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <form onSubmit={submit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Paso 1 */}
                            <div className="aj-glass aj-a1">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                                    <div className="aj-step-num">1</div>
                                    <h2 className="aj-step-title">Producto a Ajustar</h2>
                                </div>
                                <label className="aj-label">Producto <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                <ProductoSelect productos={productos} value={data.producto_id} onChange={handleProductoChange} error={errors.producto_id} />
                                {errors.producto_id && <p className="aj-error">{errors.producto_id}</p>}

                                {productoSeleccionado && (
                                    <div style={{
                                        marginTop: '1rem', padding: '1rem 1.25rem',
                                        background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)',
                                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                                    }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2d1a08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {productoSeleccionado.nombre}
                                            </p>
                                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.15rem' }}>
                                                {productoSeleccionado.categoria || 'Sin categoría'}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'rgba(185,28,28,0.85)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                                {productoSeleccionado.stock}
                                            </p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.1rem' }}>Stock actual</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Paso 2 */}
                            <div className="aj-glass aj-a2">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                                    <div className="aj-step-num">2</div>
                                    <h2 className="aj-step-title">Tipo de Ajuste</h2>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                                    {[
                                        { tipo: 'incremento', label: 'Incremento', sub: 'Aumentar stock', icon: 'M12 4v16m8-8H4', color: { on: 'rgba(16,185,129,0.9)', border: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.07)', iconBg: 'rgba(16,185,129,0.15)' } },
                                        { tipo: 'decremento', label: 'Decremento', sub: 'Reducir stock',   icon: 'M20 12H4',         color: { on: 'rgba(220,38,38,0.9)',  border: 'rgba(220,38,38,0.4)',  bg: 'rgba(220,38,38,0.07)',  iconBg: 'rgba(220,38,38,0.12)' } },
                                    ].map(({ tipo, label, sub, icon, color }) => {
                                        const activo = data.tipo_ajuste === tipo;
                                        return (
                                            <button key={tipo} type="button" onClick={() => handleTipoChange(tipo)}
                                                    style={{
                                                        padding: '1.1rem', borderRadius: '16px', textAlign: 'center',
                                                        border: `1.5px solid ${activo ? color.border : 'rgba(255,255,255,0.55)'}`,
                                                        background: activo ? color.bg : 'rgba(255,255,255,0.04)',
                                                        cursor: 'pointer', transition: 'all 0.18s',
                                                        boxShadow: activo ? `0 4px 16px ${color.border.replace(/[\d.]+\)$/, '0.15)')}` : 'inset 0 1px 0 rgba(255,255,255,0.7)',
                                                    }}>
                                                <div style={{
                                                    width: '42px', height: '42px', borderRadius: '14px', margin: '0 auto 0.65rem',
                                                    background: activo ? color.iconBg : 'rgba(180,90,20,0.08)',
                                                    border: `1px solid ${activo ? color.border : 'rgba(200,140,80,0.2)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <svg width="18" height="18" fill="none" stroke={activo ? color.on : 'rgba(150,80,20,0.5)'} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                                                    </svg>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: activo ? color.on : 'rgba(80,40,8,0.7)' }}>{label}</p>
                                                <p style={{ fontSize: '0.74rem', color: 'rgba(150,80,20,0.5)', marginTop: '0.15rem' }}>{sub}</p>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label className="aj-label">Cantidad <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                        <div style={{
                                            display: 'flex', alignItems: 'center',
                                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,140,80,0.4)',
                                            borderRadius: '14px', overflow: 'hidden', backdropFilter: 'blur(10px)',
                                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.75)',
                                        }}>
                                            <button type="button"
                                                    onClick={() => setData('cantidad', String(Math.max(1, parseInt(data.cantidad || 1) - 1)))}
                                                    style={{ padding: '0.75rem 1rem', fontSize: '1.2rem', fontWeight: '600', color: 'rgba(150,80,20,0.7)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                                                −
                                            </button>
                                            <input type="number" value={data.cantidad}
                                                   onChange={e => setData('cantidad', e.target.value)}
                                                   style={{ flex: 1, textAlign: 'center', padding: '0.75rem 0', background: 'none', border: 'none', outline: 'none', fontSize: '1.1rem', fontWeight: '700', color: '#2d1a08', fontFamily: 'Inter,sans-serif', width: 0 }}
                                                   min="1" />
                                            <button type="button"
                                                    onClick={() => setData('cantidad', String(parseInt(data.cantidad || 0) + 1))}
                                                    style={{ padding: '0.75rem 1rem', fontSize: '1.2rem', fontWeight: '600', color: 'rgba(150,80,20,0.7)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                                                +
                                            </button>
                                        </div>
                                        {errors.cantidad && <p className="aj-error">{errors.cantidad}</p>}
                                    </div>

                                    <div>
                                        <label className="aj-label">Motivo <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                        <MotivoSelect
                                            value={data.motivo}
                                            onChange={v => setData('motivo', v)}
                                            placeholder="Selecciona un motivo..."
                                            error={errors.motivo}
                                            options={MOTIVOS[data.tipo_ajuste]}
                                        />
                                        {errors.motivo && <p className="aj-error">{errors.motivo}</p>}
                                    </div>
                                </div>

                                {productoSeleccionado && resultado !== null && (
                                    <div style={{
                                        marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: esPlusSub ? 'rgba(16,185,129,0.06)' : 'rgba(220,38,38,0.05)',
                                        border: `1px solid ${esPlusSub ? 'rgba(16,185,129,0.2)' : 'rgba(220,38,38,0.18)'}`,
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: esPlusSub ? 'rgba(4,120,87,0.8)' : 'rgba(185,28,28,0.8)' }}>
                                                Stock resultante
                                            </p>
                                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.15rem' }}>Después de aplicar el ajuste</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)' }}>Actual</p>
                                                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgba(120,60,10,0.65)', letterSpacing: '-0.02em' }}>{productoSeleccionado.stock}</p>
                                            </div>
                                            <svg width="18" height="18" fill="none" stroke="rgba(150,80,20,0.35)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)' }}>Nuevo</p>
                                                <p style={{ fontSize: '1.9rem', fontWeight: '700', letterSpacing: '-0.03em', color: esPlusSub ? 'rgba(4,120,87,0.9)' : 'rgba(185,28,28,0.85)' }}>{resultado}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Paso 3 */}
                            <div className="aj-glass aj-a3">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                                    <div className="aj-step-num">3</div>
                                    <h2 className="aj-step-title">Observaciones</h2>
                                </div>
                                <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.55)', marginLeft: '2.35rem', marginBottom: '1rem' }}>
                                    Obligatorio — describe el motivo detallado del ajuste
                                </p>
                                <textarea
                                    value={data.observaciones}
                                    onChange={e => setData('observaciones', e.target.value)}
                                    rows={4} className="aj-textarea"
                                    placeholder="Describe el motivo del ajuste con detalle suficiente..." />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                                    {errors.observaciones
                                        ? <p className="aj-error">{errors.observaciones}</p>
                                        : <p className="aj-hint">Mínimo 5 caracteres</p>}
                                    <span style={{ fontSize: '0.73rem', fontWeight: '600', color: data.observaciones.length >= 5 ? 'rgba(4,120,87,0.8)' : 'rgba(150,80,20,0.4)' }}>
                                        {data.observaciones.length} chars
                                    </span>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="aj-a4" style={{ display: 'flex', gap: '0.85rem' }}>
                                <button type="submit" disabled={processing} className="aj-btn-submit">
                                    {processing ? 'Aplicando...' : 'Aplicar Ajuste'}
                                </button>
                                <Link href="/inventario" className="aj-btn-cancel">Cancelar</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
