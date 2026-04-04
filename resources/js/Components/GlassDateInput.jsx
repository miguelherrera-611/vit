// resources/js/Components/GlassDateInput.jsx
// Calendario glassmorphism pastel.
// - Panel siempre aparece DEBAJO del botón trigger, nunca se desplaza.
// - Posición relativa al contenedor padre (no fixed al viewport).
// - Fondo completamente sólido — opaco, legible sobre cualquier fondo.
// - onChange(string "YYYY-MM-DD") — valor directo, NO evento.

import { useState, useRef, useEffect } from 'react';

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

export default function GlassDateInput({ label, value, onChange, placeholder = 'dd/mm/aaaa' }) {
    const today  = new Date();
    const parsed = parseDate(value);

    const [open,      setOpen]      = useState(false);
    const [viewYear,  setViewYear]  = useState(parsed?.getFullYear() ?? today.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsed?.getMonth()    ?? today.getMonth());

    const wrapRef = useRef(null);

    // Cerrar al click fuera
    useEffect(() => {
        if (!open) return;
        const h = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const handleToggle = () => {
        if (!open) {
            const p = parseDate(value);
            setViewYear(p?.getFullYear() ?? today.getFullYear());
            setViewMonth(p?.getMonth()   ?? today.getMonth());
        }
        setOpen(o => !o);
    };

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

    return (
        <div
            ref={wrapRef}
            style={{ position: 'relative', flex: 1, minWidth: '130px' }}
        >
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
                    backdropFilter: 'blur(8px)',
                }}
            >
                {/* Icono calendario izquierda */}
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

            {/* ── Panel calendario — posición absoluta, siempre debajo del botón ── */}
            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: '272px',
                    zIndex: 99999,
                    // Fondo completamente sólido
                    background: 'linear-gradient(145deg, #fef9f4 0%, #fdf5ed 100%)',
                    border: '1.5px solid rgba(210,150,80,0.25)',
                    borderRadius: '18px',
                    boxShadow: [
                        '0 24px 64px rgba(130,60,10,0.22)',
                        '0 8px 20px rgba(130,60,10,0.14)',
                        '0 2px 6px rgba(130,60,10,0.08)',
                        'inset 0 1px 0 rgba(255,255,255,0.95)',
                    ].join(', '),
                    overflow: 'hidden',
                    animation: 'gcalIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    <style>{`
                        @keyframes gcalIn {
                            from { opacity:0; transform:scale(0.96) translateY(-4px); }
                            to   { opacity:1; transform:scale(1) translateY(0); }
                        }
                        .gcal-day-btn:hover:not(:disabled) {
                            background: rgba(200,120,50,0.13) !important;
                        }
                        .gcal-nav-btn:hover {
                            background: rgba(200,120,50,0.16) !important;
                        }
                    `}</style>

                    {/* ── Cabecera mes / año ── */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.85rem 1rem 0.7rem',
                        background: 'linear-gradient(135deg, rgba(255,240,220,0.95) 0%, rgba(255,232,205,0.9) 100%)',
                        borderBottom: '1px solid rgba(210,150,70,0.15)',
                    }}>
                        <button type="button" className="gcal-nav-btn" onClick={prevMonth} style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            border: '1px solid rgba(200,130,60,0.25)',
                            background: 'rgba(255,255,255,0.7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(140,70,15,0.7)',
                            transition: 'background 0.12s',
                            flexShrink: 0,
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
                                color: 'rgba(150,80,20,0.55)', marginTop: '1px',
                                letterSpacing: '0.04em',
                            }}>
                                {viewYear}
                            </p>
                        </div>

                        <button type="button" className="gcal-nav-btn" onClick={nextMonth} style={{
                            width: '28px', height: '28px', borderRadius: '8px',
                            border: '1px solid rgba(200,130,60,0.25)',
                            background: 'rgba(255,255,255,0.7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(140,70,15,0.7)',
                            transition: 'background 0.12s',
                            flexShrink: 0,
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
                        background: 'rgba(255,248,238,0.7)',
                    }}>
                        {DIAS_CORTO.map(d => (
                            <div key={d} style={{
                                textAlign: 'center',
                                fontSize: '0.6rem', fontWeight: '700',
                                color: 'rgba(150,80,20,0.42)',
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
                        background: 'rgba(254,248,240,0.85)',
                    }}>
                        {cells.map((cell, i) => {
                            const ds    = cell.cur ? toStr(new Date(viewYear, viewMonth, cell.day)) : '';
                            const isTod = cell.cur && ds === todayStr;
                            const isSel = cell.cur && ds === value;

                            let bg    = 'transparent';
                            let color = cell.cur ? '#2d1a08' : 'rgba(180,100,30,0.22)';
                            let brd   = '1.5px solid transparent';
                            let fw    = cell.cur ? '450' : '300';
                            let shadow = 'none';

                            if (isSel) {
                                bg     = 'linear-gradient(135deg, rgba(185,28,28,0.18) 0%, rgba(185,28,28,0.12) 100%)';
                                color  = 'rgba(185,28,28,0.95)';
                                brd    = '1.5px solid rgba(185,28,28,0.35)';
                                fw     = '700';
                                shadow = '0 2px 6px rgba(185,28,28,0.15)';
                            } else if (isTod) {
                                brd   = '1.5px solid rgba(185,28,28,0.38)';
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
                                            setOpen(false);
                                        }
                                    }}
                                    className={cell.cur && !isSel ? 'gcal-day-btn' : ''}
                                    style={{
                                        height: '30px',
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
                        borderTop: '1px solid rgba(210,150,70,0.15)',
                        background: 'linear-gradient(135deg, rgba(255,240,220,0.9) 0%, rgba(255,232,205,0.85) 100%)',
                    }}>
                        <button
                            type="button"
                            onClick={() => { onChange(''); setOpen(false); }}
                            style={{
                                fontSize: '0.72rem', fontWeight: '600',
                                color: 'rgba(150,80,20,0.6)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                padding: '0.2rem 0.5rem', borderRadius: '6px',
                                transition: 'background 0.1s, color 0.1s',
                                letterSpacing: '0.01em',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(200,120,50,0.12)';
                                e.currentTarget.style.color = 'rgba(140,60,10,0.9)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = 'rgba(150,80,20,0.6)';
                            }}
                        >Limpiar</button>

                        <button
                            type="button"
                            onClick={() => { onChange(todayStr); setOpen(false); }}
                            style={{
                                fontSize: '0.72rem', fontWeight: '700',
                                color: 'rgba(185,28,28,0.9)',
                                background: 'rgba(185,28,28,0.09)',
                                border: '1.5px solid rgba(185,28,28,0.22)',
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                padding: '0.22rem 0.75rem', borderRadius: '8px',
                                transition: 'all 0.12s',
                                letterSpacing: '0.01em',
                                boxShadow: '0 1px 3px rgba(185,28,28,0.1)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(185,28,28,0.16)';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(185,28,28,0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(185,28,28,0.09)';
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(185,28,28,0.1)';
                            }}
                        >Hoy</button>
                    </div>
                </div>
            )}
        </div>
    );
}
