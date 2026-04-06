// resources/js/Components/GlassSelect.jsx
// Dropdown glassmorphism pastel — mismo estilo que GlassDateInput.
// - Panel via Portal (document.body), z-index 999 (bajo el navbar z-1000).
// - Posición calculada con getBoundingClientRect, respeta navBottom.
// - Soporte para íconos SVG por opción (opcional).
// - onChange(value) — valor directo, NO evento.

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

function SelectPortal({ triggerRef, open, onClose, children }) {
    const [pos, setPos] = useState({ top: 0, left: 0, width: 200 });

    const recalc = useCallback(() => {
        if (!triggerRef.current) return;
        const r      = triggerRef.current.getBoundingClientRect();
        const vw     = window.innerWidth;
        const vh     = window.innerHeight;
        const panelW = Math.max(r.width, 180);
        const panelH = 280;

        const navEl     = document.querySelector('.app-nav');
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 64;

        let left = r.left;
        let top  = r.bottom + 5 + window.scrollY;

        if (left + panelW > vw - 8) left = r.right - panelW;
        if (left < 8) left = 8;

        const bottomSpace = vh - r.bottom;
        if (bottomSpace < panelH + 10 && r.top > panelH + 10) {
            const topUp = r.top - panelH - 5;
            if (topUp >= navBottom) {
                top = r.top + window.scrollY - panelH - 5;
            }
        }

        // Nunca tapar el navbar
        const topViewport = top - window.scrollY;
        if (topViewport < navBottom + 4) {
            top = navBottom + 4 + window.scrollY;
        }

        if (vw < 360) left = (vw - panelW) / 2;

        setPos({ top, left, width: panelW });
    }, [triggerRef]);

    useEffect(() => {
        if (!open) return;
        recalc();
        window.addEventListener('scroll', recalc, true);
        window.addEventListener('resize', recalc);
        return () => {
            window.removeEventListener('scroll', recalc, true);
            window.removeEventListener('resize', recalc);
        };
    }, [open, recalc]);

    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (triggerRef.current?.contains(e.target)) return;
            const panel = document.querySelector('[data-gsel-panel="true"]');
            if (panel?.contains(e.target)) return;
            onClose();
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open, onClose, triggerRef]);

    if (!open) return null;

    return createPortal(
        <div
            data-gsel-panel="true"
            style={{
                position: 'absolute',
                top:      pos.top,
                left:     pos.left,
                width:    pos.width,
                zIndex:   999,   // por debajo del navbar (z-index: 1000)
            }}
        >
            {children}
        </div>,
        document.body
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GlassSelect({
    label,
    value,
    onChange,
    options = [],        // [{ value, label, icon? }]  — icon es JSX SVG opcional
    placeholder = 'Seleccionar...',
    allLabel = 'Todos',
    searchable = false,
    allValue = '',
}) {
    const [open,   setOpen]   = useState(false);
    const [search, setSearch] = useState('');
    const triggerRef          = useRef(null);
    const searchRef           = useRef(null);

    const close = useCallback(() => { setOpen(false); setSearch(''); }, []);

    const handleToggle = () => {
        setOpen(o => !o);
        setSearch('');
    };

    // Focus en el buscador al abrir
    useEffect(() => {
        if (open && searchable && searchRef.current) {
            setTimeout(() => searchRef.current?.focus(), 50);
        }
    }, [open, searchable]);

    // Inyectar estilos una sola vez
    useEffect(() => {
        const id = 'gsel-styles';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
            @keyframes gselIn {
                from { opacity:0; transform:scale(0.96) translateY(-5px); }
                to   { opacity:1; transform:scale(1) translateY(0); }
            }
            .gsel-option:hover {
                background: rgba(200,120,50,0.10) !important;
                color: #2d1a08 !important;
            }

            .gsel-search-wrap{
                display:flex; align-items:center; gap:0.45rem;
                background: linear-gradient(160deg, rgba(255,255,255,0.94), rgba(255,250,245,0.88));
                border: 1.5px solid rgba(200,130,60,0.24);
                border-radius: 10px;
                padding: 0.42rem 0.62rem;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(130,60,10,0.08);
                transition: all .15s ease;
            }
            .gsel-search-wrap:focus-within{
                border-color: rgba(185,28,28,0.35);
                box-shadow: 0 0 0 3px rgba(185,28,28,0.07), inset 0 1px 0 rgba(255,255,255,0.95);
                background: rgba(255,255,255,0.98);
            }
            .gsel-search-input{
                border:none !important;
                outline:none !important;
                box-shadow:none !important;
                background:transparent;
                width:100%;
                font-size:0.76rem;
                color:#2d1a08;
                font-family:'Inter',sans-serif;
                letter-spacing:-0.01em;
                appearance:none;
                -webkit-appearance:none;
            }
            .gsel-search-input:focus,
            .gsel-search-input:focus-visible{
                outline:none !important;
                box-shadow:none !important;
                border:none !important;
            }
            .gsel-search-input::placeholder{
                color: rgba(170,90,20,0.42);
            }
        `;
        document.head.appendChild(style);
    }, []);

    const normalizeLabel = useCallback((txt = '') => {
        const minorWords = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'o', 'en', 'a', 'por', 'para', 'con']);

        const pretty = String(txt ?? '')
            .replace(/_/g, ' ')
            .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1 $2') // corta camelCase roto
            .replace(/\s+/g, ' ')
            .trim()
            .toLocaleLowerCase('es-ES')
            .split(' ')
            .map((word, idx) => {
                if (!word) return word;
                if (idx > 0 && minorWords.has(word)) return word;
                return word.charAt(0).toLocaleUpperCase('es-ES') + word.slice(1);
            })
            .join(' ');

        // Correcciones frecuentes
        return pretty
            .replace(/\bAccion\b/gi, 'Acción')
            .replace(/\bModulo\b/gi, 'Módulo')
            .replace(/\bDescripcion\b/gi, 'Descripción')
            .replace(/\bNumero\b/gi, 'Número')
            .replace(/\bTelefono\b/gi, 'Teléfono')
            .replace(/\bDireccion\b/gi, 'Dirección');
    }, []);

    const selectedOption = options.find(o => o.value === value);
    const displayLabel   = selectedOption ? normalizeLabel(selectedOption.label ?? selectedOption.value) : null;

    const filtered = searchable && search.trim()
        ? options.filter(o => normalizeLabel(o.label ?? o.value).toLowerCase().includes(search.toLowerCase()))
        : options;

    return (
        <div ref={triggerRef} style={{ position: 'relative', flex: 1, minWidth: '120px' }}>

            {/* ── Label ── */}
            {label && (
                <label style={{
                    display: 'block', marginBottom: '0.3rem',
                    fontSize: '0.68rem', fontWeight: '700',
                    color: 'rgba(140,70,15,0.6)',
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                }}>
                    {label}
                </label>
            )}

            {/* ── Trigger ── */}
            <button
                type="button"
                onClick={handleToggle}
                style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.58rem 0.85rem',
                    background: open
                        ? 'rgba(255,248,242,0.98)'
                        : 'rgba(255,252,248,0.82)',
                    border: open
                        ? '1.5px solid rgba(185,28,28,0.45)'
                        : '1.5px solid rgba(200,130,60,0.32)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontFamily: '"Inter", "Plus Jakarta Sans", "SF Pro Text", system-ui, sans-serif',
                    fontSize: '0.83rem',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    textTransform: 'none',
                    color: value ? '#2d1a08' : 'rgba(170,90,20,0.42)',
                    boxShadow: open
                        ? '0 0 0 3px rgba(185,28,28,0.09), 0 2px 8px rgba(180,80,10,0.1)'
                        : '0 1px 3px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                    transition: 'all 0.15s ease',
                    gap: '0.4rem',
                    userSelect: 'none',
                    boxSizing: 'border-box',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: 1, minWidth: 0 }}>
                    {/* Ícono de la opción seleccionada o ícono genérico */}
                    {selectedOption?.icon
                        ? <span style={{ display: 'flex', flexShrink: 0, opacity: open ? 0.7 : 0.5 }}>{selectedOption.icon}</span>
                        : <DefaultSelectIcon open={open} />
                    }
                    <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize'
                    }}>
                        {displayLabel ?? normalizeLabel(placeholder)}
                    </span>
                </span>

                {/* Limpiar */}
                {value && (
                    <span
                        onClick={e => { e.stopPropagation(); onChange(allValue); }}
                        style={{
                            fontSize: '1.05rem', lineHeight: 1,
                            color: 'rgba(185,28,28,0.45)',
                            cursor: 'pointer', flexShrink: 0, padding: '0 2px',
                            transition: 'color 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(185,28,28,0.8)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(185,28,28,0.45)'}
                    >×</span>
                )}

                {/* Chevron */}
                <svg
                    width="11" height="11" fill="none" viewBox="0 0 24 24"
                    stroke="rgba(150,70,15,0.45)"
                    style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {/* ── Panel ── */}
            <SelectPortal triggerRef={triggerRef} open={open} onClose={close}>
                <div style={{
                    background: '#fef6ee',
                    border: '1.5px solid rgba(210,150,80,0.3)',
                    borderRadius: '14px',
                    boxShadow: [
                        '0 24px 60px rgba(100,45,5,0.22)',
                        '0 8px 24px rgba(130,60,10,0.14)',
                        '0 3px 8px rgba(130,60,10,0.08)',
                        'inset 0 1px 0 rgba(255,255,255,0.95)',
                    ].join(', '),
                    overflow: 'hidden',
                    animation: 'gselIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>

                    {/* Buscador (opcional) */}
                    {searchable && (
                        <div style={{
                            padding: '0.55rem 0.65rem',
                            borderBottom: '1px solid rgba(210,150,70,0.18)',
                            background: '#fdecd8',
                        }}>
                            <div className="gsel-search-wrap">
                                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                                     stroke="rgba(160,80,20,0.45)" style={{ flexShrink: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                </svg>
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Buscar..."
                                    className="gsel-search-input"
                                />
                            </div>
                        </div>
                    )}

                    {/* Lista */}
                    <div style={{
                        padding: '0.3rem 0.4rem',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(200,130,60,0.25) transparent',
                    }}>
                        {/* Opción "Todos" */}
                        {!search.trim() && (
                            <div
                                className="gsel-option"
                                onClick={() => { onChange(allValue); close(); }}
                                style={{
                                    padding: '0.5rem 0.7rem', borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    color: !value ? 'rgba(185,28,28,0.75)' : 'rgba(150,80,20,0.5)',
                                    fontWeight: !value ? '600' : '400',
                                    fontStyle: !value ? 'normal' : 'italic',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontFamily: '"Inter", "Plus Jakarta Sans", "SF Pro Text", system-ui, sans-serif',
                                    letterSpacing: '-0.005em',
                                    transition: 'background 0.1s',
                                    background: !value ? 'rgba(185,28,28,0.07)' : 'transparent',
                                }}
                            >
                                <span style={{ textTransform: 'capitalize' }}>{normalizeLabel(allLabel)}</span>
                                {!value && (
                                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                                         stroke="rgba(185,28,28,0.8)" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                )}
                            </div>
                        )}

                        {/* Separador */}
                        {!search.trim() && filtered.length > 0 && (
                            <div style={{ height: '1px', background: 'rgba(210,150,70,0.12)', margin: '0.2rem 0.3rem' }}/>
                        )}

                        {/* Opciones */}
                        {filtered.map(opt => {
                            const isSelected = opt.value === value;
                            return (
                                <div
                                    key={opt.value}
                                    className={isSelected ? '' : 'gsel-option'}
                                    onClick={() => { onChange(opt.value); close(); }}
                                    style={{
                                        padding: '0.5rem 0.7rem', borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        color: isSelected ? 'rgba(185,28,28,0.95)' : '#2d1a08',
                                        fontWeight: isSelected ? '600' : '400',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        fontFamily: '"Inter", "Plus Jakarta Sans", "SF Pro Text", system-ui, sans-serif',
                                        letterSpacing: '-0.005em',
                                        background: isSelected ? 'rgba(185,28,28,0.08)' : 'transparent',
                                        border: isSelected ? '1px solid rgba(185,28,28,0.15)' : '1px solid transparent',
                                        transition: 'background 0.1s',
                                        marginBottom: '1px',
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                                        {opt.icon && (
                                            <span style={{
                                                display: 'flex', flexShrink: 0,
                                                color: isSelected ? 'rgba(185,28,28,0.7)' : 'rgba(120,60,10,0.5)',
                                            }}>
                                                {opt.icon}
                                            </span>
                                        )}
                                        {normalizeLabel(opt.label ?? opt.value)}
                                    </span>
                                    {isSelected && (
                                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                                             stroke="rgba(185,28,28,0.8)" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                </div>
                            );
                        })}

                        {/* Sin resultados */}
                        {filtered.length === 0 && (
                            <div style={{
                                padding: '1rem', textAlign: 'center',
                                fontSize: '0.76rem', color: 'rgba(150,80,20,0.4)',
                                fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
                            }}>
                                Sin resultados
                            </div>
                        )}
                    </div>
                </div>
            </SelectPortal>
        </div>
    );
}

// Ícono genérico para cuando la opción no tiene ícono propio
function DefaultSelectIcon({ open }) {
    return (
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
             stroke={open ? 'rgba(185,28,28,0.7)' : 'rgba(160,80,20,0.5)'}
             style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
        </svg>
    );
}
