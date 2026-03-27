import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const FORM_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    .pg-bg { min-height:100vh; font-family:'Inter',-apple-system,sans-serif; background:${GLASS_BG}; }
    .pg-header {
        background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%);
        -webkit-backdrop-filter:blur(32px) saturate(180%);
        border-bottom:1px solid rgba(255,255,255,0.68);
        box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85);
    }
    .glass-panel {
        background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(150%);
        -webkit-backdrop-filter:blur(20px) saturate(150%);
        border:1px solid rgba(255,255,255,0.65); border-radius:20px;
        box-shadow:0 12px 40px rgba(180,90,20,0.08),0 3px 12px rgba(180,90,20,0.05),inset 0 1.5px 0 rgba(255,255,255,0.85);
        position:relative; overflow:hidden; padding:1.75rem;
    }
    .glass-panel::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent);
        pointer-events:none; z-index:1;
    }
    .panel-title { font-size:0.95rem; font-weight:600; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:1.25rem; }
    .form-label {
        display:block; font-size:0.7rem; font-weight:600;
        color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem;
    }
    .glass-input {
        width:100%; padding:0.75rem 1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        transition:all 0.2s ease; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75);
        box-sizing:border-box;
    }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus {
        background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65);
        box-shadow:0 0 0 3px rgba(220,38,38,0.05),0 3px 12px rgba(160,80,10,0.08),inset 0 1px 0 rgba(255,255,255,0.85);
    }
    .glass-textarea { resize:none; }
    .prefix-wrap { position:relative; }
    .prefix-symbol {
        position:absolute; left:1rem; top:50%; transform:translateY(-50%);
        font-size:0.9rem; font-weight:500; color:rgba(150,80,20,0.55); pointer-events:none;
    }
    .prefix-input { padding-left:1.75rem !important; }
    .hint-text { margin-top:0.3rem; font-size:0.74rem; color:rgba(150,80,20,0.5); }
    .error-text { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .margin-panel {
        border-radius:14px; padding:0.7rem 1rem;
        display:flex; align-items:center; gap:0.65rem; font-size:0.85rem;
    }
    .margin-panel.positive { background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.2); }
    .margin-panel.negative { background:rgba(220,38,38,0.05); border:1px solid rgba(220,38,38,0.18); }
    .toggle-track {
        width:46px; height:24px; border-radius:12px; position:relative;
        transition:background 0.2s; cursor:pointer; flex-shrink:0; border:1px solid rgba(255,255,255,0.5);
    }
    .toggle-track.on  { background:rgba(220,38,38,0.22); border-color:rgba(220,38,38,0.35); box-shadow:0 0 0 1px rgba(220,38,38,0.15); }
    .toggle-track.off { background:rgba(180,90,20,0.1); border-color:rgba(180,90,20,0.2); }
    .toggle-thumb {
        position:absolute; top:2px; width:18px; height:18px; border-radius:50%; background:white;
        box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    .toggle-track.on .toggle-thumb { transform:translateX(22px); }
    .toggle-track.off .toggle-thumb { transform:translateX(2px); }
    .upload-area {
        border:1.5px dashed rgba(200,140,80,0.35); border-radius:16px;
        padding:1.75rem 1rem; text-align:center; cursor:pointer;
        transition:all 0.2s ease; background:rgba(255,255,255,0.04);
        backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    }
    .upload-area:hover { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.08); }
    .btn-ghost {
        display:inline-flex; align-items:center; gap:0.4rem; padding:0.65rem 1.1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px;
        font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8);
        text-decoration:none; cursor:pointer; transition:all 0.2s ease;
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78);
        font-family:'Inter',sans-serif; white-space:nowrap; width:100%; justify-content:center;
    }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary {
        display:inline-flex; align-items:center; gap:0.4rem; justify-content:center;
        padding:0.75rem 1.25rem; width:100%;
        background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:14px;
        font-size:0.88rem; font-weight:500; color:rgba(185,28,28,0.95);
        cursor:pointer; transition:all 0.2s ease;
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.28);
        font-family:'Inter',sans-serif; position:relative; overflow:hidden;
    }
    .btn-primary::before {
        content:''; position:absolute; top:0; left:0; right:0; height:1px;
        background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent);
    }
    .btn-primary:hover { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.6); transform:translateY(-1px); }
    .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .btn-back {
        width:34px; height:34px; display:flex; align-items:center; justify-content:center;
        background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.65); border-radius:10px;
        cursor:pointer; text-decoration:none; color:rgba(150,80,20,0.6); transition:all 0.18s; flex-shrink:0;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.72);
    }
    .btn-back:hover { background:rgba(255,255,255,0.2); color:rgba(120,50,10,0.9); }
    .glass-input-readonly {
        width:100%; padding:0.75rem 1rem;
        background:rgba(180,90,20,0.04); border:1px solid rgba(200,140,80,0.22); border-radius:14px;
        font-size:0.9rem; color:rgba(100,55,10,0.45); font-family:'Inter',sans-serif; outline:none;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.55); box-sizing:border-box; cursor:not-allowed;
    }
    .prov-list {
        display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto;
        padding-right:0.25rem;
    }
    .prov-list::-webkit-scrollbar { width:4px; }
    .prov-list::-webkit-scrollbar-track { background:transparent; }
    .prov-list::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }
    .prov-item {
        display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem;
        border-radius:12px; cursor:pointer; transition:background 0.15s; border:1px solid transparent;
    }
    .prov-item:hover { background:rgba(255,255,255,0.12); }
    .prov-item.selected { background:rgba(220,38,38,0.05); border-color:rgba(220,38,38,0.2); }
    .prov-checkbox {
        width:18px; height:18px; border-radius:6px; flex-shrink:0;
        border:1.5px solid rgba(200,140,80,0.45); background:rgba(255,255,255,0.06);
        display:flex; align-items:center; justify-content:center; transition:all 0.15s;
    }
    .prov-item.selected .prov-checkbox { background:rgba(220,38,38,0.12); border-color:rgba(220,38,38,0.45); }
    .prov-name { font-size:0.875rem; font-weight:500; color:#2d1a08; }
    .prov-empresa { font-size:0.74rem; color:rgba(150,80,20,0.55); margin-top:0.05rem; }
    .prov-empty { font-size:0.82rem; color:rgba(150,80,20,0.5); text-align:center; padding:1rem 0; }

    /* ── Trigger del dropdown (dentro del panel) ── */
    .cat-trigger {
        width:100%; display:flex; align-items:center; justify-content:space-between;
        padding:0.75rem 1rem;
        background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px;
        font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        cursor:pointer; transition:all 0.2s ease;
        backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
        box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75);
        text-align:left;
    }
    .cat-trigger.open   { border-color:rgba(200,140,80,0.65); background:rgba(255,255,255,0.12); }
    .cat-trigger.has-error { border-color:rgba(220,38,38,0.45); }

    /* ── Panel del dropdown — se renderiza en body via portal ── */
    @keyframes catDropIn {
        from { opacity:0; transform:translateY(-8px) scale(0.97); }
        to   { opacity:1; transform:translateY(0)   scale(1); }
    }
    .cat-portal-panel {
        position:fixed;
        /* z-index altísimo para salir por encima de TODO, incluyendo backdrop-filter */
        z-index:99999;
        background:rgba(255,248,240,0.98);
        backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%);
        border:1px solid rgba(255,255,255,0.72); border-radius:18px;
        box-shadow:0 24px 64px rgba(180,90,20,0.18), 0 8px 24px rgba(180,90,20,0.1),
                   inset 0 1px 0 rgba(255,255,255,0.9);
        overflow:hidden;
        animation:catDropIn 0.18s cubic-bezier(0.16,1,0.3,1);
        font-family:'Inter',-apple-system,sans-serif;
    }
    .cat-search-wrap {
        padding:0.65rem 0.75rem 0.5rem;
        border-bottom:1px solid rgba(200,140,80,0.14);
    }
    .cat-search {
        width:100%; padding:0.55rem 2.2rem 0.55rem 2.2rem;
        background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.35); border-radius:11px;
        font-size:0.82rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none;
        box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); transition:all 0.18s; box-sizing:border-box;
    }
    .cat-search:focus { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.18); }
    .cat-search::placeholder { color:rgba(180,100,30,0.38); }
    .cat-list { max-height:256px; overflow-y:auto; }
    .cat-list::-webkit-scrollbar { width:4px; }
    .cat-list::-webkit-scrollbar-track { background:transparent; }
    .cat-list::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }
    .cat-group-label {
        padding:0.5rem 1rem 0.2rem;
        font-size:0.64rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
        color:rgba(150,80,20,0.42);
    }
    .cat-option {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.6rem 1rem; cursor:pointer;
        font-size:0.86rem; font-weight:500; color:rgba(80,40,8,0.82);
        transition:background 0.12s; border:none; background:none;
        width:100%; text-align:left; font-family:'Inter',sans-serif;
    }
    .cat-option:hover  { background:rgba(255,255,255,0.6); }
    .cat-option.active { background:rgba(220,38,38,0.06); color:rgba(185,28,28,0.9); font-weight:600; }
    .cat-pager {
        display:flex; align-items:center; justify-content:space-between;
        padding:0.45rem 0.75rem;
        border-top:1px solid rgba(200,140,80,0.12);
        background:rgba(255,255,255,0.04);
    }
    .cat-pager-btn {
        display:flex; align-items:center; gap:0.3rem; padding:0.28rem 0.6rem;
        border-radius:8px; cursor:pointer; font-size:0.74rem; font-weight:500;
        color:rgba(120,60,10,0.7); background:none; border:none;
        font-family:'Inter',sans-serif; transition:background 0.12s;
    }
    .cat-pager-btn:hover:not(:disabled) { background:rgba(255,255,255,0.65); }
    .cat-pager-btn:disabled { opacity:0.28; cursor:not-allowed; }
    .cat-pager-dot {
        width:24px; height:24px; border-radius:7px; cursor:pointer;
        font-size:0.72rem; font-weight:600; border:none; font-family:'Inter',sans-serif; transition:all 0.12s;
    }
`;

const OPCIONES_POR_PAG = 7;
const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ── Dropdown de categoría con portal ─────────────────────────────────────────
function CategoriaDropdown({ categorias, value, onChange, error }) {
    const [open,      setOpen]     = useState(false);
    const [busqueda,  setBusqueda] = useState('');
    const [pagina,    setPagina]   = useState(1);
    const [panelPos,  setPanelPos] = useState({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef(null);
    const panelRef   = useRef(null);
    const inputRef   = useRef(null);

    // Aplanar opciones
    const todasOpciones = useMemo(() =>
        categorias.flatMap(g =>
            g.opciones.map(op => ({
                value: op,
                label: op.replace(g.grupo + ' - ', ''),
                grupo: g.grupo,
            }))
        ), [categorias]);

    const filtradas = useMemo(() => {
        const q = normalize(busqueda);
        return q
            ? todasOpciones.filter(o => normalize(o.label).includes(q) || normalize(o.grupo).includes(q))
            : todasOpciones;
    }, [todasOpciones, busqueda]);

    const totalPags = Math.ceil(filtradas.length / OPCIONES_POR_PAG);
    const paginadas = filtradas.slice((pagina - 1) * OPCIONES_POR_PAG, pagina * OPCIONES_POR_PAG);

    const gruposPaginados = useMemo(() => {
        const mapa = {};
        paginadas.forEach(o => {
            if (!mapa[o.grupo]) mapa[o.grupo] = [];
            mapa[o.grupo].push(o);
        });
        return Object.entries(mapa);
    }, [paginadas]);

    // Calcular posición del panel relativa a la ventana (para position:fixed)
    const calcPos = () => {
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        // Siempre despliega hacia abajo
        const top = r.bottom + 6;
        setPanelPos({ top, left: r.left, width: r.width });
    };

    const openDropdown = () => {
        calcPos();
        setOpen(true);
    };

    // Cerrar al hacer click fuera
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target) &&
                panelRef.current   && !panelRef.current.contains(e.target)
            ) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    // Recalcular si el scroll mueve el trigger
    useEffect(() => {
        if (!open) return;
        const h = () => calcPos();
        window.addEventListener('scroll', h, true);
        window.addEventListener('resize', h);
        return () => {
            window.removeEventListener('scroll', h, true);
            window.removeEventListener('resize', h);
        };
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

    const selected = todasOpciones.find(o => o.value === value);

    return (
        <>
            {/* Trigger — dentro del flujo normal del formulario */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => open ? setOpen(false) : openDropdown()}
                className={`cat-trigger${open ? ' open' : ''}${error ? ' has-error' : ''}`}
            >
                <span style={{ color: selected ? '#2d1a08' : 'rgba(180,100,30,0.38)', fontWeight: selected ? '500' : '400', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selected ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.68rem', fontWeight: '600', padding: '0.12rem 0.5rem',
                                background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)',
                                color: 'rgba(185,28,28,0.8)', borderRadius: '20px', flexShrink: 0,
                            }}>{selected.grupo}</span>
                            {selected.label}
                        </span>
                    ) : 'Selecciona una categoría...'}
                </span>
                <svg style={{ width: '14px', height: '14px', color: 'rgba(150,80,20,0.45)', flexShrink: 0, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Panel — renderizado en body para escapar de cualquier stacking context */}
            {open && createPortal(
                <div
                    ref={panelRef}
                    className="cat-portal-panel"
                    style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}
                >
                    {/* Buscador */}
                    <div className="cat-search-wrap">
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                 width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={e => setBusqueda(e.target.value)}
                                   placeholder="Buscar categoría..."
                                   className="cat-search" />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.3rem', paddingLeft: '0.2rem' }}>
                            {filtradas.length} subcategoría{filtradas.length !== 1 ? 's' : ''}
                            {busqueda && ` · "${busqueda}"`}
                        </p>
                    </div>

                    {/* Lista */}
                    {paginadas.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.84rem', color: 'rgba(150,80,20,0.5)' }}>Sin resultados para <strong>"{busqueda}"</strong></p>
                            <button type="button" onClick={() => setBusqueda('')}
                                    style={{ marginTop: '0.4rem', fontSize: '0.76rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                                Limpiar búsqueda
                            </button>
                        </div>
                    ) : (
                        <div className="cat-list">
                            {gruposPaginados.map(([grupo, opciones]) => (
                                <div key={grupo}>
                                    <p className="cat-group-label">{grupo}</p>
                                    {opciones.map(op => {
                                        const isActive = op.value === value;
                                        return (
                                            <button key={op.value} type="button"
                                                    onClick={() => { onChange(op.value); setOpen(false); }}
                                                    className={`cat-option${isActive ? ' active' : ''}`}>
                                                <span>{op.label}</span>
                                                {isActive && (
                                                    <svg style={{ width: '13px', height: '13px', color: 'rgba(185,28,28,0.8)', flexShrink: 0 }}
                                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Paginador */}
                    {totalPags > 1 && (
                        <div className="cat-pager">
                            <button type="button" className="cat-pager-btn"
                                    disabled={pagina === 1}
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Ant.
                            </button>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" className="cat-pager-dot"
                                            onClick={() => setPagina(n)}
                                            style={{
                                                background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)',
                                                color:      n === pagina ? 'rgba(185,28,28,0.9)'  : 'rgba(120,60,10,0.6)',
                                                border:     n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(200,140,80,0.2)',
                                            }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="cat-pager-btn"
                                    disabled={pagina === totalPags}
                                    onClick={() => setPagina(p => Math.min(totalPags, p + 1))}>
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

export default function ProductosCreate({ categorias = [], proveedores = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '', descripcion: '', codigo_barras: '', categoria: '',
        precio: '', precio_compra: '', stock: '0', stock_minimo: '5',
        imagen: null, activo: true, proveedores: [],
    });

    const [buscarProv, setBuscarProv] = useState('');

    const proveedoresFiltrados = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(buscarProv.toLowerCase()) ||
        (p.empresa || '').toLowerCase().includes(buscarProv.toLowerCase())
    );

    const toggleProveedor = (id) => {
        const actual = data.proveedores;
        setData('proveedores', actual.includes(id) ? actual.filter(x => x !== id) : [...actual, id]);
    };

    const formatCurrency = (value) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(num);
    };

    const submit = (e) => { e.preventDefault(); post('/productos', { forceFormData: true }); };

    return (
        <AppLayout>
            <style>{FORM_STYLES}</style>
            <div className="pg-bg">
                <div className="pg-header">
                    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <Link href="/productos" className="btn-back">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: '1.45rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em' }}>Nuevo Producto</h1>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.2rem' }}>Completa la información del producto</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>

                            {/* ── Columna izquierda ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* Info básica */}
                                <div className="glass-panel">
                                    <p className="panel-title">Información Básica</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label className="form-label">Nombre del Producto <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)}
                                                   className="glass-input" placeholder="Ej: Blusa Manga Larga Satín" />
                                            {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Descripción</label>
                                            <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)}
                                                      rows={3} className="glass-input glass-textarea" placeholder="Descripción del producto..." />
                                        </div>

                                        {/* Categoría con dropdown portal */}
                                        <div>
                                            <label className="form-label">Categoría <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <CategoriaDropdown
                                                categorias={categorias}
                                                value={data.categoria}
                                                onChange={(v) => setData('categoria', v)}
                                                error={errors.categoria}
                                            />
                                            {errors.categoria && <p className="error-text">{errors.categoria}</p>}
                                        </div>

                                        <div>
                                            <label className="form-label">Código / SKU</label>
                                            <input type="text" value={data.codigo_barras} onChange={(e) => setData('codigo_barras', e.target.value)}
                                                   className="glass-input" placeholder="Ej: ROD12345 (opcional)" />
                                            {errors.codigo_barras && <p className="error-text">{errors.codigo_barras}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Precios */}
                                <div className="glass-panel">
                                    <p className="panel-title">Precios e Inventario</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label className="form-label">Precio de Compra <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.5)', textTransform: 'none', letterSpacing: 0 }}>(costo)</span></label>
                                            <div className="prefix-wrap">
                                                <span className="prefix-symbol">$</span>
                                                <input type="number" value={data.precio_compra} onChange={(e) => setData('precio_compra', e.target.value)}
                                                       className="glass-input prefix-input" placeholder="0" min="0" step="100" />
                                            </div>
                                            {data.precio_compra && <p className="hint-text">{formatCurrency(data.precio_compra)}</p>}
                                            {errors.precio_compra && <p className="error-text">{errors.precio_compra}</p>}
                                        </div>
                                        <div>
                                            <label className="form-label">Precio de Venta <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <div className="prefix-wrap">
                                                <span className="prefix-symbol">$</span>
                                                <input type="number" value={data.precio} onChange={(e) => setData('precio', e.target.value)}
                                                       className="glass-input prefix-input" placeholder="0" min="0" step="100" />
                                            </div>
                                            {data.precio && <p className="hint-text">{formatCurrency(data.precio)}</p>}
                                            {errors.precio && <p className="error-text">{errors.precio}</p>}
                                        </div>

                                        {data.precio_compra > 0 && data.precio > 0 && (
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <div className={`margin-panel ${(data.precio - data.precio_compra) >= 0 ? 'positive' : 'negative'}`}>
                                                    <svg width="15" height="15" fill="none" stroke="rgba(4,120,87,0.8)" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                    <span style={{ color: 'rgba(4,120,87,0.85)', fontWeight: '500' }}>Margen: </span>
                                                    <span style={{ color: 'rgba(4,120,87,0.8)' }}>
                                                        {formatCurrency(data.precio - data.precio_compra)} ({data.precio_compra > 0 ? (((data.precio - data.precio_compra) / data.precio_compra) * 100).toFixed(1) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="form-label">Stock Inicial</label>
                                            <input type="number" value={0} readOnly className="glass-input-readonly" />
                                            <p className="hint-text">El stock se gestiona desde el módulo de Inventario</p>
                                        </div>
                                        <div>
                                            <label className="form-label">Stock Mínimo <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                            <input type="number" value={data.stock_minimo} onChange={(e) => setData('stock_minimo', e.target.value)} className="glass-input" min="0" />
                                            <p className="hint-text">Alerta cuando el stock llegue a este valor</p>
                                            {errors.stock_minimo && <p className="error-text">{errors.stock_minimo}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Proveedores */}
                                <div className="glass-panel">
                                    <p className="panel-title">
                                        Proveedores <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span>
                                        {data.proveedores.length > 0 && (
                                            <span style={{
                                                marginLeft: '0.6rem', fontSize: '0.72rem', fontWeight: '600',
                                                background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.22)',
                                                color: 'rgba(185,28,28,0.85)', padding: '0.15rem 0.55rem', borderRadius: '20px',
                                            }}>
                                                {data.proveedores.length} seleccionado{data.proveedores.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </p>

                                    {proveedores.length > 5 && (
                                        <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
                                            <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                                 width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input type="text" value={buscarProv} onChange={e => setBuscarProv(e.target.value)}
                                                   className="glass-input" style={{ paddingLeft: '2.2rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                                                   placeholder="Buscar proveedor..." />
                                        </div>
                                    )}

                                    {proveedoresFiltrados.length === 0 ? (
                                        <p className="prov-empty">No hay proveedores registrados</p>
                                    ) : (
                                        <div className={`prov-list`}
                                             style={{ border: errors.proveedores ? '1px solid rgba(220,38,38,0.3)' : 'none', borderRadius: '12px', padding: errors.proveedores ? '0.5rem' : '0' }}>
                                            {proveedoresFiltrados.map(prov => {
                                                const sel = data.proveedores.includes(prov.id);
                                                return (
                                                    <div key={prov.id} className={`prov-item ${sel ? 'selected' : ''}`} onClick={() => toggleProveedor(prov.id)}>
                                                        <div className="prov-checkbox">
                                                            {sel && (
                                                                <svg width="11" height="11" fill="none" stroke="rgba(185,28,28,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                                    <path d="M20 6L9 17l-5-5" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p className="prov-name">{prov.nombre}</p>
                                                            {prov.empresa && <p className="prov-empresa">{prov.empresa}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {errors.proveedores && <p className="error-text">{errors.proveedores}</p>}
                                </div>
                            </div>

                            {/* ── Columna derecha ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {/* Estado */}
                                <div className="glass-panel">
                                    <p className="panel-title">Estado</p>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                                           onClick={() => setData('activo', !data.activo)}>
                                        <div className={`toggle-track ${data.activo ? 'on' : 'off'}`}>
                                            <div className="toggle-thumb" />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'rgba(120,60,10,0.78)' }}>
                                            {data.activo ? 'Producto Activo' : 'Producto Inactivo'}
                                        </span>
                                    </label>
                                </div>

                                {/* Imagen */}
                                <div className="glass-panel">
                                    <p className="panel-title">Imagen</p>
                                    {data.imagen ? (
                                        <div>
                                            <img src={URL.createObjectURL(data.imagen)} alt="Preview"
                                                 style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.55)' }} />
                                            <button type="button" onClick={() => setData('imagen', null)}
                                                    style={{ fontSize: '0.8rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                Eliminar imagen
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-area" style={{ display: 'block' }}>
                                            <svg width="28" height="28" fill="none" stroke="rgba(180,100,30,0.35)" viewBox="0 0 24 24" style={{ margin: '0 auto 0.5rem' }}>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)', marginBottom: '0.2rem' }}>Haz clic para subir</p>
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.4)' }}>JPG, PNG, WEBP hasta 2MB</p>
                                            <input type="file" accept="image/*" onChange={(e) => setData('imagen', e.target.files[0])} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                    {errors.imagen && <p className="error-text">{errors.imagen}</p>}
                                </div>

                                {/* Botones */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                    <button type="submit" disabled={processing} className="btn-primary">
                                        {processing ? 'Guardando...' : 'Crear Producto'}
                                    </button>
                                    <Link href="/productos" className="btn-ghost">Cancelar</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
