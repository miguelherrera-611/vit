// resources/js/Components/GlassDateInput.jsx
// Calendario glassmorphism pastel.
// - Se ancla al botón con requestAnimationFrame en scroll/resize
// - Fondo opaco para que se vea bien sobre cualquier contenido
// - onChange(string "YYYY-MM-DD") — valor directo, NO evento

import { useState, useRef, useEffect } from 'react';

const MESES      = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_CORTO = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
const PANEL_W    = 260;
const PANEL_H    = 295;

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
    const [pos,       setPos]       = useState({ top: 0, left: 0, width: PANEL_W, openUp: false });

    const wrapRef   = useRef(null);
    const btnRef    = useRef(null);
    const rafRef    = useRef(null);
    const openRef   = useRef(false); // ref para acceder al estado dentro del listener

    // Calcula la posición del panel anclado al botón
    const calcPos = () => {
        if (!btnRef.current || !openRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const vw   = window.innerWidth;
        const vh   = window.innerHeight;
        const w    = Math.min(PANEL_W, vw - 16);

        // Horizontal: alinear izquierda con el botón, sin salirse
        let left = rect.left;
        if (left + w > vw - 8) left = vw - w - 8;
        if (left < 8)          left = 8;

        // Vertical: pegar justo debajo, o arriba si no hay espacio
        const openUp = rect.bottom + PANEL_H + 8 > vh;
        const top    = openUp ? rect.top - PANEL_H - 4 : rect.bottom + 4;

        setPos({ top, left, width: w, openUp });
    };

    // Listener de scroll/resize usando rAF para no hacer trabajo innecesario
    const onScrollOrResize = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(calcPos);
    };

    useEffect(() => {
        openRef.current = open;
        if (!open) return;

        calcPos(); // posición inicial

        // Captura scroll en TODOS los elementos (true = capture phase)
        window.addEventListener('scroll',  onScrollOrResize, { passive: true, capture: true });
        window.addEventListener('resize',  onScrollOrResize, { passive: true });
        document.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });

        return () => {
            window.removeEventListener('scroll',  onScrollOrResize, { capture: true });
            window.removeEventListener('resize',  onScrollOrResize);
            document.removeEventListener('scroll', onScrollOrResize, { capture: true });
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [open]);

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

    const prevMonth = () => { if (viewMonth===0) { setViewMonth(11); setViewYear(y=>y-1); } else setViewMonth(m=>m-1); };
    const nextMonth = () => { if (viewMonth===11){ setViewMonth(0);  setViewYear(y=>y+1); } else setViewMonth(m=>m+1); };

    const buildGrid = () => {
        const firstDow = new Date(viewYear, viewMonth, 1).getDay();
        const daysInM  = new Date(viewYear, viewMonth+1, 0).getDate();
        const prevLast = new Date(viewYear, viewMonth, 0).getDate();
        const cells    = [];
        for (let i = firstDow-1; i >= 0; i--) cells.push({ day: prevLast-i, cur: false });
        for (let d = 1; d <= daysInM; d++)     cells.push({ day: d, cur: true });
        while (cells.length < 42)              cells.push({ day: cells.length - firstDow - daysInM + 1, cur: false });
        return cells;
    };

    const cells    = buildGrid();
    const todayStr = toStr(today);

    return (
        <div ref={wrapRef} style={{ position:'relative', flex:1, minWidth:'100px' }}>

            {/* Label */}
            {label && (
                <label style={{
                    display:'block', marginBottom:'0.3rem',
                    fontSize:'0.68rem', fontWeight:'600',
                    color:'rgba(150,80,20,0.55)',
                    letterSpacing:'0.06em', textTransform:'uppercase',
                }}>
                    {label}
                </label>
            )}

            {/* Botón trigger */}
            <button
                ref={btnRef}
                type="button"
                onClick={handleToggle}
                style={{
                    width:'100%',
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'0.55rem 0.75rem',
                    background: open ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)',
                    border: open
                        ? '1px solid rgba(185,28,28,0.4)'
                        : '1px solid rgba(200,140,80,0.28)',
                    borderRadius:'10px',
                    cursor:'pointer',
                    fontFamily:'Inter, sans-serif',
                    fontSize:'0.8rem',
                    color: value ? '#2d1a08' : 'rgba(180,100,30,0.38)',
                    boxShadow: open
                        ? '0 0 0 3px rgba(185,28,28,0.08)'
                        : '0 1px 4px rgba(180,90,20,0.08), inset 0 1px 0 rgba(255,255,255,0.85)',
                    transition:'all 0.15s',
                    boxSizing:'border-box',
                    gap:'0.4rem',
                    userSelect:'none',
                }}
            >
                <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, textAlign:'left' }}>
                    {value ? formatDisplay(value) : placeholder}
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:'0.2rem', flexShrink:0 }}>
                    {value && (
                        <span
                            onClick={e => { e.stopPropagation(); onChange(''); }}
                            style={{ fontSize:'1rem', lineHeight:1, color:'rgba(180,100,30,0.4)', cursor:'pointer' }}
                        >×</span>
                    )}
                    <svg width="12" height="12" fill="none" stroke="rgba(150,80,20,0.5)" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="3" strokeWidth="2"/>
                        <path strokeLinecap="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                </div>
            </button>

            {/* Panel calendario — position:fixed, se ancla al botón con rAF en scroll */}
            {open && (
                <div style={{
                    position:'fixed',
                    top:   `${pos.top}px`,
                    left:  `${pos.left}px`,
                    width: `${pos.width}px`,
                    zIndex: 99999,
                    // Fondo completamente sólido — sin transparencia para que nada se vea debajo
                    background:'#fdf6f0',
                    border:'1px solid rgba(200,140,80,0.22)',
                    borderRadius:'16px',
                    boxShadow:'0 20px 56px rgba(140,70,10,0.22), 0 6px 16px rgba(140,70,10,0.12), 0 0 0 1px rgba(255,255,255,0.7)',
                    overflow:'hidden',
                    animation:'gcalIn 0.16s cubic-bezier(0.16,1,0.3,1)',
                    fontFamily:'Inter, sans-serif',
                }}>
                    <style>{`
                        @keyframes gcalIn {
                            from { opacity:0; transform:scale(0.97) translateY(-3px); }
                            to   { opacity:1; transform:scale(1) translateY(0); }
                        }
                        .gcal-d:hover { background:rgba(200,140,80,0.14) !important; }
                        .gcal-n:hover { background:rgba(200,140,80,0.2)  !important; }
                    `}</style>

                    {/* ── Cabecera mes / año ── */}
                    <div style={{
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'0.65rem 0.875rem',
                        background:'rgba(255,245,235,0.95)',
                        borderBottom:'1px solid rgba(200,140,80,0.12)',
                    }}>
                        <button type="button" className="gcal-n" onClick={prevMonth} style={{
                            width:'26px', height:'26px', borderRadius:'7px',
                            border:'1px solid rgba(200,140,80,0.22)',
                            background:'white',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', color:'rgba(150,80,20,0.65)',
                            transition:'background 0.12s', flexShrink:0,
                        }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>

                        <div style={{ textAlign:'center', userSelect:'none' }}>
                            <p style={{ margin:0, fontSize:'0.85rem', fontWeight:'600', color:'#2d1a08', letterSpacing:'-0.01em' }}>
                                {MESES[viewMonth]}
                            </p>
                            <p style={{ margin:0, fontSize:'0.64rem', color:'rgba(150,80,20,0.5)', marginTop:'1px' }}>
                                {viewYear}
                            </p>
                        </div>

                        <button type="button" className="gcal-n" onClick={nextMonth} style={{
                            width:'26px', height:'26px', borderRadius:'7px',
                            border:'1px solid rgba(200,140,80,0.22)',
                            background:'white',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            cursor:'pointer', color:'rgba(150,80,20,0.65)',
                            transition:'background 0.12s', flexShrink:0,
                        }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                    {/* ── Días de la semana ── */}
                    <div style={{
                        display:'grid', gridTemplateColumns:'repeat(7,1fr)',
                        padding:'0.4rem 0.5rem 0.06rem',
                        background:'#fdf6f0',
                    }}>
                        {DIAS_CORTO.map(d => (
                            <div key={d} style={{
                                textAlign:'center', fontSize:'0.57rem', fontWeight:'700',
                                color:'rgba(150,80,20,0.38)', letterSpacing:'0.04em',
                                userSelect:'none', padding:'0.08rem 0',
                            }}>{d}</div>
                        ))}
                    </div>

                    {/* ── Grilla de días ── */}
                    <div style={{
                        display:'grid', gridTemplateColumns:'repeat(7,1fr)',
                        padding:'0.04rem 0.5rem 0.4rem',
                        gap:'1px',
                        background:'#fdf6f0',
                    }}>
                        {cells.map((cell, i) => {
                            const ds    = cell.cur ? toStr(new Date(viewYear, viewMonth, cell.day)) : '';
                            const isTod = cell.cur && ds === todayStr;
                            const isSel = cell.cur && ds === value;

                            let bg  = 'transparent';
                            let col = cell.cur ? '#2d1a08' : 'rgba(180,100,30,0.22)';
                            let brd = '1px solid transparent';
                            let fw  = cell.cur ? '400' : '300';

                            if (isSel) {
                                bg='rgba(185,28,28,0.1)'; col='rgba(185,28,28,0.9)';
                                brd='1px solid rgba(185,28,28,0.28)'; fw='700';
                            } else if (isTod) {
                                brd='1.5px solid rgba(185,28,28,0.3)';
                                col='rgba(185,28,28,0.7)'; fw='600';
                            }

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    disabled={!cell.cur}
                                    onClick={() => { if(cell.cur){ onChange(toStr(new Date(viewYear,viewMonth,cell.day))); setOpen(false); } }}
                                    className={cell.cur && !isSel ? 'gcal-d' : ''}
                                    style={{
                                        height:'28px', borderRadius:'6px',
                                        border:brd, background:bg,
                                        fontSize:'0.73rem', fontWeight:fw, color:col,
                                        fontFamily:'Inter, sans-serif',
                                        cursor: cell.cur ? 'pointer' : 'default',
                                        transition:'background 0.1s',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                        userSelect:'none',
                                    }}
                                >{cell.day}</button>
                            );
                        })}
                    </div>

                    {/* ── Footer ── */}
                    <div style={{
                        display:'flex', justifyContent:'space-between', alignItems:'center',
                        padding:'0.4rem 0.875rem',
                        borderTop:'1px solid rgba(200,140,80,0.12)',
                        background:'rgba(255,245,235,0.95)',
                    }}>
                        <button type="button"
                                onClick={() => { onChange(''); setOpen(false); }}
                                style={{
                                    fontSize:'0.69rem', fontWeight:'500', color:'rgba(150,80,20,0.55)',
                                    background:'none', border:'none', cursor:'pointer',
                                    fontFamily:'Inter, sans-serif',
                                    padding:'0.15rem 0.4rem', borderRadius:'5px',
                                    transition:'background 0.1s',
                                }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(200,140,80,0.1)'}
                                onMouseLeave={e=>e.currentTarget.style.background='none'}
                        >Limpiar</button>

                        <button type="button"
                                onClick={() => { onChange(todayStr); setOpen(false); }}
                                style={{
                                    fontSize:'0.69rem', fontWeight:'600', color:'rgba(185,28,28,0.82)',
                                    background:'rgba(185,28,28,0.07)', border:'1px solid rgba(185,28,28,0.18)',
                                    cursor:'pointer', fontFamily:'Inter, sans-serif',
                                    padding:'0.18rem 0.65rem', borderRadius:'6px',
                                    transition:'background 0.1s',
                                }}
                                onMouseEnter={e=>e.currentTarget.style.background='rgba(185,28,28,0.14)'}
                                onMouseLeave={e=>e.currentTarget.style.background='rgba(185,28,28,0.07)'}
                        >Hoy</button>
                    </div>
                </div>
            )}
        </div>
    );
}
