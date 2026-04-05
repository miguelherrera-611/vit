// resources/js/Components/GlassDateInput.jsx
// Calendario glassmorphism pastel.
// - Panel renderizado via Portal (document.body) → se sobrepone a TODO.
// - Fondo completamente sólido — opaco, legible sobre cualquier fondo.
// - Posición calculada dinámicamente con getBoundingClientRect.
// - Totalmente responsive en móvil: se centra en pantalla si no hay espacio.
// - onChange(string "YYYY-MM-DD") — valor directo, NO evento.

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const MESES      = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_CORTO = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];

function parseDate(str) {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
}
function formatDisplay(str) {
    if (!str) return '';
    const [y, m, d] = str.split('-');
    return `${d}/${m}/${y}`;
}
function toStr(date) {
    if (!date) return '';
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

// ── Portal Calendar Panel ─────────────────────────────────────────────────────
function CalendarPortal({ triggerRef, open, onClose, children }) {
    const [pos, setPos] = useState({ top: 0, left: 0, width: 272 });

    const recalc = useCallback(() => {
        if (!triggerRef.current) return;
        const r      = triggerRef.current.getBoundingClientRect();
        const vw     = window.innerWidth;
        const vh     = window.innerHeight;
        const panelW = Math.min(280, vw - 24);
        const panelH = 360;

        // Altura del navbar sticky
        const navEl     = document.querySelector('.app-nav');
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 64;

        let left = r.left;
        let top  = r.bottom + 6 + window.scrollY;

        // Si se sale por la derecha → alinear a la derecha del trigger
        if (left + panelW > vw - 8) left = r.right - panelW;
        // Si se sale por la izquierda → fijar al margen
        if (left < 8) left = 8;

        // Abrir hacia arriba solo si hay espacio Y no tapa el navbar
        const bottomSpace = vh - r.bottom;
        if (bottomSpace < panelH + 12 && r.top > panelH + 12) {
            const topViewportIfUp = r.top - panelH - 6;
            if (topViewportIfUp >= navBottom) {
                top = r.top + window.scrollY - panelH - 6;
            }
            // Si tapara el navbar, se queda abajo
        }

        // Nunca quedar detrás del navbar (por scroll o trigger cercano al top)
        const topViewport = top - window.scrollY;
        if (topViewport < navBottom + 4) {
            top = navBottom + 4 + window.scrollY;
        }

        // En móvil muy pequeño → centrar horizontalmente
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

    // Cerrar al click fuera
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            // el panel mismo no tiene ref aquí, lo chequeamos por data-attr
            const panel = document.querySelector('[data-gcal-panel="true"]');
            if (panel && panel.contains(e.target)) return;
            onClose();
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open, onClose, triggerRef]);

    if (!open) return null;

    return createPortal(
        <div
            data-gcal-panel="true"
            style={{
                position: 'absolute',
                top:  pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 9999, // por debajo del navbar (z-index: 1000)
            }}
        >
            {children}
        </div>,
        document.body
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function GlassDateInput({ label, value, onChange, placeholder = 'dd/mm/aaaa' }) {
    const today  = new Date();
    const parsed = parseDate(value);

    const [open,      setOpen]      = useState(false);
    const [viewYear,  setViewYear]  = useState(parsed?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsed?.getMonth()    ?? today.getMonth());

    const triggerRef = useRef(null);

    const handleToggle = () => {
        if (!open) {
            const p = parseDate(value);
            setViewYear(p?.getFullYear()  ?? today.getFullYear());
            setViewMonth(p?.getMonth()    ?? today.getMonth());
        }
        setOpen(o => !o);
    };

    const close = useCallback(() => setOpen(false), []);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const buildGrid = () => {
        const firstDow = new Date(viewYear, viewMonth, 1).getDay();
        const daysInM  = new Date(viewYear, viewMonth + 1, 0).getDate();
        const prevLast = new Date(viewYear, viewMonth, 0).getDate();
        const cells    = [];
        for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevLast - i, cur: false });
        for (let d = 1; d <= daysInM; d++)       cells.push({ day: d, cur: true });
        while (cells.length < 42)                cells.push({ day: cells.length - firstDow - daysInM + 1, cur: false });
        return cells;
    };

    const cells    = buildGrid();
    const todayStr = toStr(today);

    // ── Estilos globales (solo se inyectan una vez) ──────────────────────────
    useEffect(() => {
        const id = 'gcal-styles';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
            @keyframes gcalIn {
                from { opacity:0; transform:scale(0.96) translateY(-6px); }
                to   { opacity:1; transform:scale(1)    translateY(0); }
            }
            .gcal-day-btn:hover:not(:disabled) {
                background: rgba(200,120,50,0.13) !important;
            }
            .gcal-nav-btn:hover {
                background: rgba(200,120,50,0.16) !important;
            }
        `;
        document.head.appendChild(style);
    }, []);

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

            {/* ── Botón trigger ── */}
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
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    color: value ? '#2d1a08' : 'rgba(170,90,20,0.42)',
                    boxShadow: open
                        ? '0 0 0 3px rgba(185,28,28,0.09), 0 2px 8px rgba(180,80,10,0.1)'
                        : '0 1px 3px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                    gap: '0.4rem',
                    userSelect: 'none',
                }}
            >
                {/* Icono calendario */}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flex: 1, minWidth: 0 }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
                         stroke={open ? 'rgba(185,28,28,0.7)' : 'rgba(160,80,20,0.5)'} style={{ flexShrink: 0 }}>
                        <rect x="3" y="4" width="18" height="18" rx="3" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {value ? formatDisplay(value) : placeholder}
                    </span>
                </span>

                {/* Botón X limpiar */}
                {value && (
                    <span
                        onClick={e => { e.stopPropagation(); onChange(''); }}
                        style={{
                            fontSize: '1.05rem', lineHeight: 1,
                            color: 'rgba(185,28,28,0.45)',
                            cursor: 'pointer', flexShrink: 0,
                            padding: '0 2px',
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

            {/* ── Panel via Portal ── */}
            <CalendarPortal triggerRef={triggerRef} open={open} onClose={close}>
                <div style={{
                    // Fondo 100% sólido — sin transparencia
                    background: '#fef6ee',
                    border: '1.5px solid rgba(210,150,80,0.3)',
                    borderRadius: '18px',
                    boxShadow: [
                        '0 32px 80px rgba(100,45,5,0.28)',
                        '0 12px 32px rgba(130,60,10,0.18)',
                        '0 4px 10px rgba(130,60,10,0.1)',
                        'inset 0 1px 0 rgba(255,255,255,0.95)',
                    ].join(', '),
                    overflow: 'hidden',
                    animation: 'gcalIn 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}>

                    {/* ── Cabecera mes / año ── */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.85rem 1rem 0.7rem',
                        background: '#fdecd8',
                        borderBottom: '1px solid rgba(210,150,70,0.2)',
                    }}>
                        <button type="button" className="gcal-nav-btn" onClick={prevMonth} style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            border: '1px solid rgba(200,130,60,0.3)',
                            background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(140,70,15,0.7)',
                            transition: 'background 0.12s', flexShrink: 0,
                        }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>

                        <div style={{ textAlign: 'center', userSelect: 'none' }}>
                            <p style={{
                                margin: 0, fontSize: '0.9rem', fontWeight: '700',
                                color: '#2d1a08', letterSpacing: '-0.01em',
                                fontFamily: 'Inter, sans-serif',
                            }}>
                                {MESES[viewMonth]}
                            </p>
                            <p style={{
                                margin: 0, fontSize: '0.65rem', fontWeight: '600',
                                color: 'rgba(150,80,20,0.6)', marginTop: '1px',
                                letterSpacing: '0.04em',
                            }}>
                                {viewYear}
                            </p>
                        </div>

                        <button type="button" className="gcal-nav-btn" onClick={nextMonth} style={{
                            width: '30px', height: '30px', borderRadius: '8px',
                            border: '1px solid rgba(200,130,60,0.3)',
                            background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(140,70,15,0.7)',
                            transition: 'background 0.12s', flexShrink: 0,
                        }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                    {/* ── Días de la semana ── */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
                        padding: '0.6rem 0.75rem 0.2rem',
                        background: '#fef0e0',
                    }}>
                        {DIAS_CORTO.map(d => (
                            <div key={d} style={{
                                textAlign: 'center',
                                fontSize: '0.6rem', fontWeight: '700',
                                color: 'rgba(150,80,20,0.45)',
                                letterSpacing: '0.05em',
                                userSelect: 'none',
                                padding: '0.1rem 0',
                                fontFamily: 'Inter, sans-serif',
                            }}>{d}</div>
                        ))}
                    </div>

                    {/* ── Grilla de días ── */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
                        padding: '0.15rem 0.75rem 0.5rem',
                        gap: '2px',
                        background: '#fef6ee',
                    }}>
                        {cells.map((cell, i) => {
                            const ds    = cell.cur ? toStr(new Date(viewYear, viewMonth, cell.day)) : '';
                            const isTod = cell.cur && ds === todayStr;
                            const isSel = cell.cur && ds === value;

                            let bg    = 'transparent';
                            let color = cell.cur ? '#2d1a08' : 'rgba(180,100,30,0.25)';
                            let brd   = '1.5px solid transparent';
                            let fw    = cell.cur ? '450' : '300';
                            let shadow = 'none';

                            if (isSel) {
                                bg     = 'rgba(185,28,28,0.15)';
                                color  = 'rgba(185,28,28,0.95)';
                                brd    = '1.5px solid rgba(185,28,28,0.35)';
                                fw     = '700';
                                shadow = '0 2px 6px rgba(185,28,28,0.15)';
                            } else if (isTod) {
                                brd   = '1.5px solid rgba(185,28,28,0.4)';
                                color = 'rgba(185,28,28,0.8)';
                                fw    = '700';
                            }

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!cell.cur}
                                    onClick={() => {
                                        if (cell.cur) {
                                            onChange(toStr(new Date(viewYear, viewMonth, cell.day)));
                                            close();
                                        }
                                    }}
                                    className={cell.cur && !isSel ? 'gcal-day-btn' : ''}
                                    style={{
                                        height: '32px',
                                        borderRadius: '7px',
                                        border: brd,
                                        background: bg,
                                        boxShadow: shadow,
                                        fontSize: '0.74rem', fontWeight: fw, color,
                                        fontFamily: 'Inter, sans-serif',
                                        cursor: cell.cur ? 'pointer' : 'default',
                                        transition: 'background 0.1s, box-shadow 0.1s',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        userSelect: 'none',
                                    }}
                                >{cell.day}</button>
                            );
                        })}
                    </div>

                    {/* ── Footer ── */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.55rem 1rem',
                        borderTop: '1px solid rgba(210,150,70,0.18)',
                        background: '#fdecd8',
                    }}>
                        <button
                            type="button"
                            onClick={() => { onChange(''); close(); }}
                            style={{
                                fontSize: '0.72rem', fontWeight: '600',
                                color: 'rgba(150,80,20,0.65)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                padding: '0.25rem 0.6rem', borderRadius: '6px',
                                transition: 'background 0.1s, color 0.1s',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(200,120,50,0.14)';
                                e.currentTarget.style.color = 'rgba(140,60,10,0.9)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = 'rgba(150,80,20,0.65)';
                            }}
                        >Limpiar</button>

                        <button
                            type="button"
                            onClick={() => { onChange(todayStr); close(); }}
                            style={{
                                fontSize: '0.72rem', fontWeight: '700',
                                color: 'rgba(185,28,28,0.9)',
                                background: 'rgba(185,28,28,0.1)',
                                border: '1.5px solid rgba(185,28,28,0.25)',
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                padding: '0.25rem 0.85rem', borderRadius: '8px',
                                transition: 'all 0.12s',
                                letterSpacing: '0.01em',
                                boxShadow: '0 1px 3px rgba(185,28,28,0.12)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(185,28,28,0.18)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(185,28,28,0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(185,28,28,0.1)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(185,28,28,0.12)';
                            }}
                        >Hoy</button>
                    </div>
                </div>
            </CalendarPortal>
        </div>
    );
}
