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
    .pg-header { background:rgba(255,255,255,0.2); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); border-bottom:1px solid rgba(255,255,255,0.68); box-shadow:0 4px 24px rgba(200,100,30,0.07),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-panel { background:rgba(255,255,255,0.06); backdrop-filter:blur(20px) saturate(150%); -webkit-backdrop-filter:blur(20px) saturate(150%); border:1px solid rgba(255,255,255,0.65); border-radius:20px; box-shadow:0 12px 40px rgba(180,90,20,0.08),0 3px 12px rgba(180,90,20,0.05),inset 0 1.5px 0 rgba(255,255,255,0.85); position:relative; overflow:hidden; padding:1.75rem; }
    .glass-panel::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.92) 30%,rgba(255,255,255,0.92) 70%,transparent); pointer-events:none; z-index:1; }
    .panel-title { font-size:0.95rem; font-weight:600; color:#2d1a08; letter-spacing:-0.02em; margin-bottom:1.25rem; }
    .form-label { display:block; font-size:0.7rem; font-weight:600; color:rgba(150,80,20,0.7); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem; }
    .glass-input { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); box-sizing:border-box; }
    .glass-input::placeholder { color:rgba(180,100,30,0.38); }
    .glass-input:focus { background:rgba(255,255,255,0.12); border-color:rgba(200,140,80,0.65); box-shadow:0 0 0 3px rgba(220,38,38,0.05),0 3px 12px rgba(160,80,10,0.08),inset 0 1px 0 rgba(255,255,255,0.85); }
    .glass-textarea { resize:none; }
    .glass-select { width:100%; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:14px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); cursor:pointer; box-sizing:border-box; }
    .glass-select:focus { border-color:rgba(200,140,80,0.65); }
    .prefix-wrap { position:relative; }
    .prefix-symbol { position:absolute; left:1rem; top:50%; transform:translateY(-50%); font-size:0.9rem; font-weight:500; color:rgba(150,80,20,0.55); pointer-events:none; }
    .prefix-input { padding-left:1.75rem !important; }
    .hint-text { margin-top:0.3rem; font-size:0.74rem; color:rgba(150,80,20,0.5); }
    .error-text { margin-top:0.3rem; font-size:0.78rem; color:rgba(185,28,28,0.85); }
    .margin-panel { border-radius:14px; padding:0.7rem 1rem; display:flex; align-items:center; gap:0.65rem; font-size:0.85rem; }
    .margin-panel.positive { background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.2); }
    .margin-panel.negative { background:rgba(220,38,38,0.05); border:1px solid rgba(220,38,38,0.18); }
    .toggle-track { width:46px; height:24px; border-radius:12px; position:relative; transition:background 0.2s; cursor:pointer; flex-shrink:0; border:1px solid rgba(255,255,255,0.5); }
    .toggle-track.on  { background:rgba(220,38,38,0.22); border-color:rgba(220,38,38,0.35); }
    .toggle-track.off { background:rgba(180,90,20,0.1); border-color:rgba(180,90,20,0.2); }
    .toggle-thumb { position:absolute; top:2px; width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 2px 6px rgba(0,0,0,0.15); transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .toggle-track.on .toggle-thumb { transform:translateX(22px); }
    .toggle-track.off .toggle-thumb { transform:translateX(2px); }
    .upload-area { border:1.5px dashed rgba(200,140,80,0.35); border-radius:16px; padding:1.5rem 1rem; text-align:center; cursor:pointer; transition:all 0.2s ease; background:rgba(255,255,255,0.04); }
    .upload-area:hover { border-color:rgba(200,140,80,0.6); background:rgba(255,255,255,0.08); }
    .btn-ghost { display:inline-flex; align-items:center; gap:0.4rem; padding:0.65rem 1.1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.65); border-radius:14px; font-size:0.85rem; font-weight:500; color:rgba(120,60,10,0.8); text-decoration:none; cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 2px 8px rgba(180,90,20,0.06),inset 0 1px 0 rgba(255,255,255,0.78); font-family:'Inter',sans-serif; white-space:nowrap; width:100%; justify-content:center; }
    .btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.85); color:rgba(90,40,5,0.95); }
    .btn-primary { display:inline-flex; align-items:center; gap:0.4rem; justify-content:center; padding:0.75rem 1.25rem; width:100%; background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.45); border-radius:14px; font-size:0.88rem; font-weight:500; color:rgba(185,28,28,0.95); cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.28); font-family:'Inter',sans-serif; position:relative; overflow:hidden; }
    .btn-primary::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,150,150,0.7) 40%,rgba(255,150,150,0.7) 60%,transparent); }
    .btn-primary:hover { background:rgba(220,38,38,0.15); border-color:rgba(220,38,38,0.6); transform:translateY(-1px); }
    .btn-primary:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
    .btn-back { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.65); border-radius:10px; cursor:pointer; text-decoration:none; color:rgba(150,80,20,0.6); transition:all 0.18s; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,0.72); }
    .btn-back:hover { background:rgba(255,255,255,0.2); color:rgba(120,50,10,0.9); }
    .glass-input-readonly { width:100%; padding:0.75rem 1rem; background:rgba(180,90,20,0.04); border:1px solid rgba(200,140,80,0.22); border-radius:14px; font-size:0.9rem; color:rgba(100,55,10,0.45); font-family:'Inter',sans-serif; outline:none; box-shadow:inset 0 1px 0 rgba(255,255,255,0.55); box-sizing:border-box; cursor:not-allowed; }
    .prov-list { display:flex; flex-direction:column; gap:0.5rem; max-height:220px; overflow-y:auto; padding-right:0.25rem; }
    .prov-list::-webkit-scrollbar { width:4px; }
    .prov-list::-webkit-scrollbar-track { background:transparent; }
    .prov-list::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }
    .prov-item { display:flex; align-items:center; gap:0.75rem; padding:0.6rem 0.85rem; border-radius:12px; cursor:pointer; transition:background 0.15s; border:1px solid transparent; }
    .prov-item:hover { background:rgba(255,255,255,0.12); }
    .prov-item.selected { background:rgba(220,38,38,0.05); border-color:rgba(220,38,38,0.2); }
    .prov-checkbox { width:18px; height:18px; border-radius:6px; flex-shrink:0; border:1.5px solid rgba(200,140,80,0.45); background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
    .prov-item.selected .prov-checkbox { background:rgba(220,38,38,0.12); border-color:rgba(220,38,38,0.45); }
    .prov-name { font-size:0.875rem; font-weight:500; color:#2d1a08; }
    .prov-empresa { font-size:0.74rem; color:rgba(150,80,20,0.55); margin-top:0.05rem; }
    .prov-empty { font-size:0.82rem; color:rgba(150,80,20,0.5); text-align:center; padding:1rem 0; }

    /* ── Tallas ── */
    .tallas-toggle-row { display:flex; align-items:center; gap:0.75rem; cursor:pointer; margin-bottom:0; }
    .talla-quick-btns { display:flex; flex-wrap:wrap; gap:0.45rem; margin-bottom:0.85rem; }
    .talla-quick-btn { padding:0.32rem 0.75rem; border-radius:10px; font-size:0.78rem; font-weight:600; border:1px solid rgba(200,140,80,0.35); background:rgba(255,255,255,0.06); color:rgba(120,60,10,0.75); cursor:pointer; transition:all 0.15s; font-family:'Inter',sans-serif; }
    .talla-quick-btn:hover { background:rgba(255,255,255,0.14); border-color:rgba(200,140,80,0.6); color:rgba(80,35,5,0.9); }
    .talla-rows { display:flex; flex-direction:column; gap:0.4rem; margin-top:0.65rem; }
    .talla-row { display:flex; align-items:center; gap:0.55rem; padding:0.42rem 0.65rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.2); border-radius:11px; }
    .talla-badge-pill { flex-shrink:0; min-width:2.5rem; text-align:center; padding:0.18rem 0.5rem; border-radius:8px; font-size:0.74rem; font-weight:700; background:rgba(220,38,38,0.07); border:1px solid rgba(220,38,38,0.2); color:rgba(185,28,28,0.85); }
    .talla-stock-input { flex:1; padding:0.36rem 0.6rem; background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.35); border-radius:9px; font-size:0.84rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; transition:border-color 0.15s; box-sizing:border-box; }
    .talla-stock-input:focus { border-color:rgba(200,140,80,0.65); }
    .talla-del-btn { flex-shrink:0; width:26px; height:26px; border-radius:8px; cursor:pointer; background:rgba(220,38,38,0.06); border:1px solid rgba(220,38,38,0.2); display:flex; align-items:center; justify-content:center; color:rgba(185,28,28,0.7); transition:all 0.15s; }
    .talla-del-btn:hover:not(:disabled) { background:rgba(220,38,38,0.14); color:rgba(185,28,28,0.95); }
    .talla-del-btn:disabled { opacity:0.3; cursor:not-allowed; }
    .talla-saved-badge { font-size:0.62rem; font-weight:600; padding:0.1rem 0.4rem; border-radius:6px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.22); color:rgba(4,120,87,0.8); flex-shrink:0; }
    .talla-total-bar { margin-top:0.65rem; padding:0.5rem 0.85rem; background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.18); border-radius:11px; display:flex; align-items:center; justify-content:space-between; font-size:0.82rem; }
    /* ── Dropdown portal ── */
    .cat-trigger { width:100%; display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; background:rgba(255,255,255,0.06); border:1px solid rgba(200,140,80,0.4); border-radius:12px; font-size:0.9rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; cursor:pointer; transition:all 0.2s ease; backdrop-filter:blur(10px); box-shadow:0 3px 12px rgba(160,80,10,0.07),inset 0 1px 0 rgba(255,255,255,0.75); text-align:left; }
    .cat-trigger.open { border-color:rgba(200,140,80,0.65); background:rgba(255,255,255,0.12); }
    @keyframes catDropIn { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
    .cat-portal-panel { position:fixed; z-index:99999; background:rgba(255,248,240,0.98); backdrop-filter:blur(32px) saturate(180%); border:1px solid rgba(255,255,255,0.72); border-radius:18px; box-shadow:0 24px 64px rgba(180,90,20,0.18),0 8px 24px rgba(180,90,20,0.1),inset 0 1px 0 rgba(255,255,255,0.9); overflow:hidden; animation:catDropIn 0.18s cubic-bezier(0.16,1,0.3,1); font-family:'Inter',-apple-system,sans-serif; }
    .cat-search-wrap { padding:0.65rem 0.75rem 0.5rem; border-bottom:1px solid rgba(200,140,80,0.14); }
    .cat-search { width:100%; padding:0.55rem 2.2rem 0.55rem 2.2rem; background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.35); border-radius:11px; font-size:0.82rem; color:#2d1a08; font-family:'Inter',sans-serif; outline:none; box-shadow:inset 0 1px 0 rgba(255,255,255,0.7); transition:all 0.18s; box-sizing:border-box; }
    .cat-search:focus { border-color:rgba(200,140,80,0.6); }
    .cat-search::placeholder { color:rgba(180,100,30,0.38); }
    .cat-list { max-height:220px; overflow-y:auto; }
    .cat-list::-webkit-scrollbar { width:4px; }
    .cat-list::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }
    .cat-group-label { padding:0.5rem 1rem 0.2rem; font-size:0.64rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(150,80,20,0.42); }
    .cat-option { display:flex; align-items:center; justify-content:space-between; padding:0.6rem 1rem; cursor:pointer; font-size:0.86rem; font-weight:500; color:rgba(80,40,8,0.82); transition:background 0.12s; border:none; background:none; width:100%; text-align:left; font-family:'Inter',sans-serif; }
    .cat-option:hover { background:rgba(255,255,255,0.6); }
    .cat-pager { display:flex; align-items:center; justify-content:space-between; padding:0.45rem 0.75rem; border-top:1px solid rgba(200,140,80,0.12); background:rgba(255,255,255,0.04); }
    .cat-pager-btn { display:flex; align-items:center; gap:0.3rem; padding:0.28rem 0.6rem; border-radius:8px; cursor:pointer; font-size:0.74rem; font-weight:500; color:rgba(120,60,10,0.7); background:none; border:none; font-family:'Inter',sans-serif; transition:background 0.12s; }
    .cat-pager-btn:hover:not(:disabled) { background:rgba(255,255,255,0.65); }
    .cat-pager-btn:disabled { opacity:0.28; cursor:not-allowed; }
    .cat-pager-dot { width:24px; height:24px; border-radius:7px; cursor:pointer; font-size:0.72rem; font-weight:600; border:none; font-family:'Inter',sans-serif; transition:all 0.12s; }

    /* ── Fotos adicionales ── */
    .fotos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.6rem; }
    .foto-thumb-wrap { position:relative; border-radius:11px; overflow:hidden; aspect-ratio:1/1; border:1.5px solid rgba(255,255,255,0.6); box-shadow:0 3px 10px rgba(180,90,20,0.07); }
    .foto-thumb-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
    .foto-thumb-overlay { position:absolute; inset:0; background:rgba(30,10,0,0); display:flex; align-items:center; justify-content:center; transition:background 0.18s; }
    .foto-thumb-wrap:hover .foto-thumb-overlay { background:rgba(30,10,0,0.38); }
    .foto-thumb-del { opacity:0; transform:scale(0.8); transition:all 0.18s; background:rgba(220,38,38,0.92); border:none; border-radius:50%; width:26px; height:26px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    .foto-thumb-wrap:hover .foto-thumb-del { opacity:1; transform:scale(1); }
    .foto-thumb-restore { opacity:0; transform:scale(0.8); transition:all 0.18s; background:rgba(16,185,129,0.92); border:none; border-radius:50%; width:26px; height:26px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    .foto-thumb-wrap:hover .foto-thumb-restore { opacity:1; transform:scale(1); }
    .foto-badge { position:absolute; bottom:4px; left:4px; border-radius:5px; padding:2px 5px; font-size:0.58rem; font-weight:700; pointer-events:none; }
    .foto-badge-saved { background:rgba(0,0,0,0.5); color:rgba(255,255,255,0.85); }
    .foto-badge-new   { background:rgba(16,185,129,0.85); color:white; }
    .foto-badge-del   { background:rgba(220,38,38,0.85); color:white; }
    .foto-marcada-del { opacity:0.35; }
    .foto-add-btn { aspect-ratio:1/1; border-radius:11px; cursor:pointer; border:1.5px dashed rgba(200,140,80,0.38); background:rgba(255,255,255,0.04); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.35rem; transition:all 0.18s; color:rgba(150,80,20,0.5); }
    .foto-add-btn:hover { border-color:rgba(200,140,80,0.62); background:rgba(255,255,255,0.1); color:rgba(120,55,10,0.8); }

    /* ── Layout grid ── */
    .edit-grid { display:grid; grid-template-columns:1fr 300px; gap:1.5rem; align-items:start; }
    .edit-left  { display:flex; flex-direction:column; gap:1.25rem; }
    .edit-right { display:flex; flex-direction:column; gap:1.25rem; }

    @media (max-width:1024px) {
        .edit-grid { grid-template-columns:1fr; }
    }
    @media (max-width:768px) {
        .pg-header > div { padding:1rem !important; }
        .glass-panel { padding:1.25rem; }
    }
    @media (max-width:560px) {
        .fotos-grid { grid-template-columns:repeat(2,1fr); }
    }
`;

const TALLAS_LETRAS  = ['XXXS','XXS','XS','S','M','L','XL','XXL','XXXL','XXXXL','XXXXXL'];
const TALLAS_NUMEROS = Array.from({ length: 25 }, (_, i) => String(12 + i * 2));
const TALLAS_JEANS   = Array.from({ length: 12 }, (_, i) => String(26 + i * 2));
const TODAS_PREDEFINIDAS_E = [
    ...TALLAS_LETRAS.map(t  => ({ talla: t, grupo: 'Letras' })),
    ...TALLAS_NUMEROS.map(t => ({ talla: t, grupo: 'Números' })),
    ...TALLAS_JEANS.map(t   => ({ talla: t, grupo: 'Jeans' })),
    { talla: 'ÚNICA', grupo: 'Especial' },
];

function TallaDropdownEdit({ tallasAgregadas, onAdd }) {
    const [open,     setOpen]    = useState(false);
    const [busqueda, setBusqueda]= useState('');
    const [pagina,   setPagina]  = useState(1);
    const [panelPos, setPanelPos]= useState({ top: 0, left: 0, width: 0 });

    const triggerRef = useRef(null);
    const panelRef   = useRef(null);
    const inputRef   = useRef(null);

    const TALLAS_POR_PAG = 8;
    const agregadasSet = useMemo(() => new Set(tallasAgregadas.map(t => t.talla)), [tallasAgregadas]);

    const disponibles = useMemo(() => {
        const q = busqueda.trim().toUpperCase();
        return TODAS_PREDEFINIDAS_E.filter(t => !agregadasSet.has(t.talla) && (!q || t.talla.includes(q)));
    }, [agregadasSet, busqueda]);

    const totalPags = Math.ceil(disponibles.length / TALLAS_POR_PAG);
    const paginadas = disponibles.slice((pagina - 1) * TALLAS_POR_PAG, pagina * TALLAS_POR_PAG);

    const grupos = useMemo(() => {
        const mapa = {};
        paginadas.forEach(t => { if (!mapa[t.grupo]) mapa[t.grupo] = []; mapa[t.grupo].push(t); });
        return Object.entries(mapa);
    }, [paginadas]);

    const busquedaUpper = busqueda.trim().toUpperCase();
    const esCustom = busquedaUpper && !agregadasSet.has(busquedaUpper) && !TODAS_PREDEFINIDAS_E.some(t => t.talla === busquedaUpper);

    const calcPos = () => {
        if (!triggerRef.current) return;
        const r = triggerRef.current.getBoundingClientRect();
        setPanelPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };

    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target) &&
                panelRef.current   && !panelRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const h = () => calcPos();
        window.addEventListener('scroll', h, true);
        window.addEventListener('resize', h);
        return () => { window.removeEventListener('scroll', h, true); window.removeEventListener('resize', h); };
    }, [open]);

    useEffect(() => {
        if (open) { setPagina(1); setTimeout(() => inputRef.current?.focus(), 60); }
        else setBusqueda('');
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    return (
        <>
            <button ref={triggerRef} type="button"
                    onClick={() => open ? setOpen(false) : (calcPos(), setOpen(true))}
                    className={`cat-trigger${open ? ' open' : ''}`}>
                <span style={{ color: 'rgba(180,100,30,0.38)', fontWeight: '400' }}>+ Agregar talla individual...</span>
                <svg style={{ width: '14px', height: '14px', color: 'rgba(150,80,20,0.45)', flexShrink: 0, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && createPortal(
                <div ref={panelRef} className="cat-portal-panel" style={{ top: panelPos.top, left: panelPos.left, width: panelPos.width }}>
                    <div className="cat-search-wrap">
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                 width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={e => setBusqueda(e.target.value)}
                                   placeholder="Buscar o escribir talla..."
                                   className="cat-search" style={{ textTransform: 'uppercase' }} />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {esCustom && (
                            <button type="button"
                                    onClick={() => { onAdd(busquedaUpper); setBusqueda(''); }}
                                    style={{ marginTop: '0.35rem', width: '100%', padding: '0.4rem 0.75rem', background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.22)', borderRadius: '9px', fontSize: '0.8rem', color: 'rgba(185,28,28,0.85)', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: '500', textAlign: 'left' }}>
                                + Agregar talla personalizada "{busquedaUpper}"
                            </button>
                        )}
                        <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.3rem', paddingLeft: '0.2rem' }}>
                            {disponibles.length} disponible{disponibles.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {paginadas.length === 0 && !esCustom ? (
                        <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.84rem', color: 'rgba(150,80,20,0.5)' }}>
                                {busqueda ? `"${busquedaUpper}" ya fue agregada` : 'Todas las tallas predefinidas ya están en la lista'}
                            </p>
                        </div>
                    ) : paginadas.length > 0 ? (
                        <div className="cat-list">
                            {grupos.map(([grupo, talls]) => (
                                <div key={grupo}>
                                    <p className="cat-group-label">{grupo}</p>
                                    {talls.map(t => (
                                        <button key={t.talla} type="button" onClick={() => onAdd(t.talla)} className="cat-option">
                                            <span>{t.talla}</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {totalPags > 1 && (
                        <div className="cat-pager">
                            <button type="button" className="cat-pager-btn" disabled={pagina === 1} onClick={() => setPagina(p => Math.max(1, p - 1))}>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Ant.
                            </button>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" className="cat-pager-dot" onClick={() => setPagina(n)}
                                            style={{ background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)', color: n === pagina ? 'rgba(185,28,28,0.9)' : 'rgba(120,60,10,0.6)', border: n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(200,140,80,0.2)' }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button" className="cat-pager-btn" disabled={pagina === totalPags} onClick={() => setPagina(p => Math.min(totalPags, p + 1))}>
                                Sig.
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}

export default function ProductosEdit({ producto, categorias = [], proveedores = [] }) {
    const proveedoresIniciales = (producto.proveedores || []).map(p => p.id);
    // ── NUEVO ──
    const fotosExistentes = producto.fotos || [];

    const { data, setData, post, processing, errors } = useForm({
        nombre: producto.nombre || '', descripcion: producto.descripcion || '',
        codigo_barras: producto.codigo_barras || '', categoria: producto.categoria || '',
        precio: producto.precio || '', precio_compra: producto.precio_compra || '',
        stock: producto.stock || '0', stock_minimo: producto.stock_minimo || '5',
        imagen: null, activo: producto.activo ?? true,
        proveedores: proveedoresIniciales,
        _method: 'PUT',
        fotos_eliminar: [],
        fotos: [],
        // ── Tallas ──
        maneja_tallas: producto.maneja_tallas ?? false,
        tallas: (producto.tallas || []).map(t => ({ id: t.id, talla: t.talla, stock: t.stock })),
        tallas_eliminar: [],
    });

    const [buscarProv, setBuscarProv] = useState('');
    // ── NUEVO ──
    const [fotosNuevasPreviews, setFotosNuevasPreviews] = useState([]);
    const fotosInputRef = useRef(null);

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

    // ── NUEVO: marcar/desmarcar foto existente para eliminar ──
    const toggleEliminarFoto = (fotoId) => {
        const actual = data.fotos_eliminar;
        setData('fotos_eliminar', actual.includes(fotoId)
            ? actual.filter(id => id !== fotoId)
            : [...actual, fotoId]
        );
    };

    // ── NUEVO: agregar fotos nuevas ──
    const agregarFotos = (e) => {
        const archivos = Array.from(e.target.files || []);
        if (!archivos.length) return;
        setData('fotos', [...data.fotos, ...archivos]);
        setFotosNuevasPreviews(prev => [...prev, ...archivos.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    // ── NUEVO: quitar foto nueva antes de guardar ──
    const eliminarFotoNueva = (index) => {
        URL.revokeObjectURL(fotosNuevasPreviews[index]);
        setData('fotos', data.fotos.filter((_, i) => i !== index));
        setFotosNuevasPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // ── NUEVO: limpiar object URLs al desmontar ──
    useEffect(() => {
        return () => fotosNuevasPreviews.forEach(url => URL.revokeObjectURL(url));
    }, []);

    // ── NUEVO: URL segura para fotos existentes ──
    const fotoUrl = (ruta) => {
        if (!ruta) return '';
        if (ruta.startsWith('http')) return ruta;
        return `/storage/${ruta}`;
    };

    // ── Tallas helpers ──
    const agregarTallaEdit = (talla) => {
        const t = talla.toUpperCase().trim();
        if (!t || data.tallas.some(x => x.talla === t)) return;
        setData('tallas', [...data.tallas, { talla: t, stock: 0 }]);
    };

    const agregarConjuntoEdit = (tipo) => {
        let set;
        if (tipo === 'letras')       set = TALLAS_LETRAS;
        else if (tipo === 'numeros') set = TALLAS_NUMEROS;
        else if (tipo === 'jeans')   set = TALLAS_JEANS;
        else set = ['ÚNICA'];
        const existentes = new Set(data.tallas.map(t => t.talla));
        const nuevas = set.filter(t => !existentes.has(t)).map(t => ({ talla: t, stock: 0 }));
        if (nuevas.length) setData('tallas', [...data.tallas, ...nuevas]);
    };

    const actualizarStockTallaEdit = (index, valor) => {
        const copia = [...data.tallas];
        copia[index] = { ...copia[index], stock: Math.max(0, parseInt(valor) || 0) };
        setData('tallas', copia);
    };

    const quitarTallaEdit = (index) => {
        const t = data.tallas[index];
        if (t.id && t.stock > 0) return; // no eliminar guardada con stock
        const nuevasTallas = data.tallas.filter((_, i) => i !== index);
        const nuevasEliminar = t.id ? [...data.tallas_eliminar, t.id] : data.tallas_eliminar;
        setData({ ...data, tallas: nuevasTallas, tallas_eliminar: nuevasEliminar });
    };

    const submit = (e) => { e.preventDefault(); post(`/productos/${producto.id}`, { forceFormData: true }); };

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
                                <h1 style={{ fontSize: '1.45rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em' }}>Editar Producto</h1>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.6)', marginTop: '0.2rem' }}>{producto.nombre}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="edit-grid">
                            <div className="edit-left">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div className="glass-panel">
                                        <p className="panel-title">Información Básica</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label className="form-label">Nombre del Producto <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                                <input type="text" value={data.nombre} onChange={(e) => setData('nombre', e.target.value)} className="glass-input" />
                                                {errors.nombre && <p className="error-text">{errors.nombre}</p>}
                                            </div>
                                            <div>
                                                <label className="form-label">Descripción</label>
                                                <textarea value={data.descripcion} onChange={(e) => setData('descripcion', e.target.value)} rows={3} className="glass-input glass-textarea" />
                                            </div>
                                            <div>
                                                <label className="form-label">Categoría <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                                <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className="glass-select">
                                                    <option value="">Selecciona una categoría...</option>
                                                    {categorias.map((grupo) => (
                                                        <optgroup key={grupo.grupo} label={grupo.grupo}>
                                                            {grupo.opciones.map((op) => (
                                                                <option key={op} value={op}>{op.replace(grupo.grupo + ' - ', '')}</option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>
                                                {errors.categoria && <p className="error-text">{errors.categoria}</p>}
                                            </div>
                                            <div>
                                                <label className="form-label">Código / SKU</label>
                                                <input type="text" value={data.codigo_barras} onChange={(e) => setData('codigo_barras', e.target.value)} className="glass-input" />
                                                {errors.codigo_barras && <p className="error-text">{errors.codigo_barras}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-panel">
                                        <p className="panel-title">Precios e Inventario</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label className="form-label">Precio de Compra <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.5)', textTransform: 'none', letterSpacing: 0 }}>(costo)</span></label>
                                                <div className="prefix-wrap">
                                                    <span className="prefix-symbol">$</span>
                                                    <input type="number" value={data.precio_compra} onChange={(e) => setData('precio_compra', e.target.value)} className="glass-input prefix-input" min="0" step="100" />
                                                </div>
                                                {data.precio_compra && <p className="hint-text">{formatCurrency(data.precio_compra)}</p>}
                                                {errors.precio_compra && <p className="error-text">{errors.precio_compra}</p>}
                                            </div>
                                            <div>
                                                <label className="form-label">Precio de Venta <span style={{ color: 'rgba(185,28,28,0.8)' }}>*</span></label>
                                                <div className="prefix-wrap">
                                                    <span className="prefix-symbol">$</span>
                                                    <input type="number" value={data.precio} onChange={(e) => setData('precio', e.target.value)} className="glass-input prefix-input" min="0" step="100" />
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
                                                <label className="form-label">
                                                    {data.maneja_tallas ? 'Stock Total (tallas)' : 'Stock Actual'}
                                                </label>
                                                <input type="number" value={data.maneja_tallas ? (producto.stock_total ?? producto.stock ?? 0) : (producto.stock ?? 0)} readOnly className="glass-input-readonly" />
                                                <p className="hint-text">Para ajustar stock usa el módulo de Inventario</p>
                                            </div>
                                            <div>
                                                <label className="form-label">Stock Mínimo</label>
                                                <input type="number" value={data.stock_minimo} onChange={(e) => setData('stock_minimo', e.target.value)} className="glass-input" min="0" />
                                                {errors.stock_minimo && <p className="error-text">{errors.stock_minimo}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tallas */}
                                    <div className="glass-panel">
                                        <p className="panel-title">Tallas</p>

                                        <label className="tallas-toggle-row" onClick={() => setData('maneja_tallas', !data.maneja_tallas)}>
                                            <div className={`toggle-track ${data.maneja_tallas ? 'on' : 'off'}`}>
                                                <div className="toggle-thumb" />
                                            </div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'rgba(120,60,10,0.78)' }}>
                                                {data.maneja_tallas ? 'Producto maneja tallas' : 'Sin tallas (stock único)'}
                                            </span>
                                        </label>

                                        {data.maneja_tallas && (
                                            <div style={{ marginTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.68rem', fontWeight: '600', color: 'rgba(150,80,20,0.6)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                                        Agregar conjunto
                                                    </p>
                                                    <div className="talla-quick-btns">
                                                        <button type="button" className="talla-quick-btn" onClick={() => agregarConjuntoEdit('letras')}>Letras</button>
                                                        <button type="button" className="talla-quick-btn" onClick={() => agregarConjuntoEdit('numeros')}>Números</button>
                                                        <button type="button" className="talla-quick-btn" onClick={() => agregarConjuntoEdit('jeans')}>Jeans</button>
                                                        <button type="button" className="talla-quick-btn" onClick={() => agregarConjuntoEdit('unica')}>Talla única</button>
                                                    </div>
                                                </div>

                                                <TallaDropdownEdit tallasAgregadas={data.tallas} onAdd={agregarTallaEdit} />

                                                {data.tallas.length > 0 ? (
                                                    <>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <p style={{ fontSize: '0.68rem', fontWeight: '600', color: 'rgba(150,80,20,0.6)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                                                {data.tallas.length} talla{data.tallas.length !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                        <div className="talla-rows">
                                                            {data.tallas.map((t, i) => {
                                                                const esGuardada = !!t.id;
                                                                const sinStock   = (parseInt(t.stock) || 0) === 0;
                                                                return (
                                                                    <div key={t.talla} className="talla-row">
                                                                        <span className="talla-badge-pill">{t.talla}</span>
                                                                        {esGuardada && <span className="talla-saved-badge">Guardada</span>}
                                                                        <input type="number" value={t.stock} min="0"
                                                                               onChange={e => actualizarStockTallaEdit(i, e.target.value)}
                                                                               className="talla-stock-input"
                                                                               placeholder="Stock" />
                                                                        <button type="button" className="talla-del-btn"
                                                                                disabled={esGuardada && !sinStock}
                                                                                title={esGuardada && !sinStock ? 'No se puede eliminar con stock > 0' : 'Eliminar talla'}
                                                                                onClick={() => quitarTallaEdit(i)}>
                                                                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="talla-total-bar">
                                                            <span style={{ color: 'rgba(80,40,8,0.65)' }}>Stock total en tallas</span>
                                                            <span style={{ fontWeight: '600', color: 'rgba(4,120,87,0.85)' }}>
                                                                {data.tallas.reduce((s, t) => s + (parseInt(t.stock) || 0), 0)} uds.
                                                            </span>
                                                        </div>
                                                        {data.tallas_eliminar.length > 0 && (
                                                            <p style={{ fontSize: '0.72rem', color: 'rgba(185,28,28,0.75)', fontWeight: '500', padding: '0.45rem 0.75rem', borderRadius: '9px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)' }}>
                                                                {data.tallas_eliminar.length} talla{data.tallas_eliminar.length !== 1 ? 's' : ''} se eliminarán al guardar.
                                                            </p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.42)', textAlign: 'center', padding: '0.5rem 0' }}>
                                                        Agrega al menos una talla
                                                    </p>
                                                )}
                                            </div>
                                        )}
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
                                                <svg
                                                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                                    width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    value={buscarProv}
                                                    onChange={e => setBuscarProv(e.target.value)}
                                                    className="glass-input"
                                                    style={{ paddingLeft: '2.2rem', paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                                                    placeholder="Buscar proveedor..."
                                                />
                                            </div>
                                        )}

                                        {proveedoresFiltrados.length === 0 ? (
                                            <p className="prov-empty">No hay proveedores registrados</p>
                                        ) : (
                                            <div className="prov-list"
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
                            </div>

                            <div className="edit-right">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                                    <div className="glass-panel">
                                        <p className="panel-title">Imagen</p>
                                        {producto.imagen && !data.imagen && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <img src={`/storage/${producto.imagen}`} alt="Imagen actual"
                                                     style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.55)' }} />
                                                <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', textAlign: 'center', marginTop: '0.4rem' }}>Imagen actual</p>
                                            </div>
                                        )}
                                        <div className="upload-area">
                                            {data.imagen ? (
                                                <div>
                                                    <img src={URL.createObjectURL(data.imagen)} alt="Preview"
                                                         style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', marginBottom: '0.6rem' }} />
                                                    <button type="button" onClick={() => setData('imagen', null)}
                                                            style={{ fontSize: '0.78rem', color: 'rgba(185,28,28,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                        Quitar nueva imagen
                                                    </button>
                                                </div>
                                            ) : (
                                                <label style={{ cursor: 'pointer', display: 'block' }}>
                                                    <p style={{ fontSize: '0.82rem', color: 'rgba(150,80,20,0.6)', marginBottom: '0.2rem' }}>Cambiar imagen</p>
                                                    <p style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.4)' }}>JPG, PNG, WEBP hasta 2MB</p>
                                                    <input type="file" accept="image/*" onChange={(e) => setData('imagen', e.target.files[0])} style={{ display: 'none' }} />
                                                </label>
                                            )}
                                        </div>
                                        {errors.imagen && <p className="error-text">{errors.imagen}</p>}
                                    </div>

                                    {/* ── NUEVO: Fotos adicionales ── */}
                                    <div className="glass-panel">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <p className="panel-title" style={{ margin: 0 }}>Fotos adicionales</p>
                                            {(fotosExistentes.length + fotosNuevasPreviews.length) > 0 && (
                                                <span style={{ fontSize: '0.7rem', fontWeight: '600', padding: '0.12rem 0.5rem', borderRadius: '20px', background: 'rgba(200,140,80,0.1)', border: '1px solid rgba(200,140,80,0.22)', color: 'rgba(150,80,20,0.7)' }}>
                                                    {fotosExistentes.length + fotosNuevasPreviews.length} foto{(fotosExistentes.length + fotosNuevasPreviews.length) !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>

                                        <div className="fotos-grid">
                                            {/* Fotos existentes en BD */}
                                            {fotosExistentes.map((foto) => {
                                                const marcada = data.fotos_eliminar.includes(foto.id);
                                                return (
                                                    <div key={foto.id} className={`foto-thumb-wrap${marcada ? ' foto-marcada-del' : ''}`}>
                                                        <img src={fotoUrl(foto.ruta)} alt="Foto guardada" />
                                                        <span className={`foto-badge ${marcada ? 'foto-badge-del' : 'foto-badge-saved'}`}>
                                                            {marcada ? 'Se eliminará' : 'Guardada'}
                                                        </span>
                                                        <div className="foto-thumb-overlay">
                                                            {marcada ? (
                                                                <button type="button" className="foto-thumb-restore" onClick={() => toggleEliminarFoto(foto.id)} title="Deshacer">
                                                                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                                                                </button>
                                                            ) : (
                                                                <button type="button" className="foto-thumb-del" onClick={() => toggleEliminarFoto(foto.id)} title="Eliminar al guardar">
                                                                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Fotos nuevas aún no guardadas */}
                                            {fotosNuevasPreviews.map((preview, idx) => (
                                                <div key={`nueva-${idx}`} className="foto-thumb-wrap">
                                                    <img src={preview} alt={`Nueva ${idx + 1}`} />
                                                    <span className="foto-badge foto-badge-new">Nueva</span>
                                                    <div className="foto-thumb-overlay">
                                                        <button type="button" className="foto-thumb-del" onClick={() => eliminarFotoNueva(idx)}>
                                                            <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Botón agregar */}
                                            <div className="foto-add-btn" onClick={() => fotosInputRef.current?.click()}>
                                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                                                <span style={{ fontSize: '0.68rem', fontWeight: '500' }}>Agregar</span>
                                            </div>
                                        </div>

                                        <input ref={fotosInputRef} type="file" accept="image/*" multiple onChange={agregarFotos} style={{ display: 'none' }} />

                                        {data.fotos_eliminar.length > 0 && (
                                            <p style={{ fontSize: '0.72rem', color: 'rgba(185,28,28,0.75)', fontWeight: '500', marginTop: '0.65rem', padding: '0.5rem 0.75rem', borderRadius: '9px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)' }}>
                                                {data.fotos_eliminar.length} foto{data.fotos_eliminar.length !== 1 ? 's' : ''} se eliminarán al guardar.
                                            </p>
                                        )}

                                        <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.42)', marginTop: '0.6rem' }}>
                                            Haz clic en una foto guardada para marcarla como eliminar.
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                        <button type="submit" disabled={processing} className="btn-primary">
                                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                        <Link href="/productos" className="btn-ghost">Cancelar</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
