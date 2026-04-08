import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import GlassDateInput from '@/Components/GlassDateInput';

const CLIENTES_POR_PAGINA = 6;

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const formatCurrency = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

// ── Portal wrapper para el dropdown de clientes ──────────────────────────────
// Igual al CalendarPortal: se monta en document.body para no quedar
// debajo del navbar ni de otros stacking contexts.
function DropdownPortal({ triggerRef, open, children }) {
    const [pos, setPos] = useState({ top: 0, left: 0, width: 300 });

    const recalc = useCallback(() => {
        if (!triggerRef.current) return;
        const r      = triggerRef.current.getBoundingClientRect();
        const vw     = window.innerWidth;
        const vh     = window.innerHeight;
        const w      = r.width;
        const panelH = 420;

        const navEl     = document.querySelector('.app-nav');
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 64;

        let left = r.left + window.scrollX;
        let top  = r.bottom + 6 + window.scrollY;

        if (r.left + w > vw - 8) left = vw - w - 8 + window.scrollX;
        if (left < 8) left = 8;

        const bottomSpace = vh - r.bottom;
        if (bottomSpace < panelH + 12 && r.top > panelH + 12) {
            const topViewportIfUp = r.top - panelH - 6;
            if (topViewportIfUp >= navBottom) {
                top = r.top + window.scrollY - panelH - 6;
            }
        }

        const topViewport = top - window.scrollY;
        if (topViewport < navBottom + 4) {
            top = navBottom + 4 + window.scrollY;
        }

        if (vw < 360) left = (vw - w) / 2;

        setPos({ top, left, width: w });
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

    if (!open) return null;

    return createPortal(
        <div
            data-cliente-panel="true"
            style={{
                position: 'absolute',
                top:   pos.top,
                left:  pos.left,
                width: pos.width,
                zIndex: 9999,
            }}
        >
            {children}
        </div>,
        document.body
    );
}

// ── Dropdown custom de clientes ──────────────────────────────────────────────
function ClienteSelect({ clientes, value, onChange, error }) {
    const [open, setOpen]         = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina, setPagina]     = useState(1);
    const triggerRef              = useRef(null);
    const inputRef                = useRef(null);

    // Cerrar al click fuera (trigger + panel)
    useEffect(() => {
        const h = (e) => {
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            const panel = document.querySelector('[data-cliente-panel="true"]');
            if (panel && panel.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (open) { setPagina(1); setTimeout(() => inputRef.current?.focus(), 60); }
        else { setBusqueda(''); }
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    const clientesFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        if (!q) return clientes;
        return clientes.filter(c =>
            normalize(c.nombre).includes(q) ||
            normalize(c.telefono).includes(q) ||
            normalize(c.documento).includes(q)
        );
    }, [clientes, busqueda]);

    const totalPaginas = Math.ceil(clientesFiltrados.length / CLIENTES_POR_PAGINA);
    const clientesPag  = clientesFiltrados.slice(
        (pagina - 1) * CLIENTES_POR_PAGINA,
        pagina * CLIENTES_POR_PAGINA
    );

    const seleccionado = value ? clientes.find(c => String(c.id) === String(value)) : null;

    return (
        <div ref={triggerRef} style={{ position: 'relative' }}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.72rem 0.875rem',
                    background: open ? 'rgba(255,248,242,0.98)' : 'rgba(255,252,248,0.82)',
                    border: error
                        ? '1.5px solid rgba(185,28,28,0.4)'
                        : open
                            ? '1.5px solid rgba(185,28,28,0.45)'
                            : '1.5px solid rgba(200,130,60,0.32)',
                    borderRadius: '12px',
                    boxShadow: open
                        ? '0 0 0 3px rgba(185,28,28,0.09), 0 2px 8px rgba(180,80,10,0.1)'
                        : '0 1px 3px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                    fontSize: '0.84rem',
                    color: seleccionado ? '#2d1a08' : 'rgba(180,100,30,0.45)',
                    fontFamily: 'Inter,sans-serif', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s', outline: 'none',
                    gap: '0.4rem',
                    userSelect: 'none',
                }}
            >
                {/* Icono persona */}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <svg width="13" height="13" fill="none"
                         stroke={open ? 'rgba(185,28,28,0.7)' : 'rgba(160,80,20,0.5)'}
                         strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <span style={{
                        fontWeight: seleccionado ? '500' : '400',
                        letterSpacing: '-0.01em',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {seleccionado ? seleccionado.nombre : 'Cliente general (sin cuenta)'}
                    </span>
                </span>
                {/* Chevron */}
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                     stroke="rgba(150,70,15,0.45)"
                     style={{
                         flexShrink: 0,
                         transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                         transition: 'transform 0.2s ease',
                     }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {/* Dropdown via Portal */}
            <DropdownPortal triggerRef={triggerRef} open={open}>
                <div style={{
                    background: '#fef6ee',
                    border: '1.5px solid rgba(210,150,80,0.3)',
                    borderRadius: '16px',
                    boxShadow: [
                        '0 32px 80px rgba(100,45,5,0.22)',
                        '0 12px 32px rgba(130,60,10,0.14)',
                        '0 4px 10px rgba(130,60,10,0.08)',
                        'inset 0 1px 0 rgba(255,255,255,0.95)',
                    ].join(', '),
                    overflow: 'hidden',
                    animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    {/* Buscador */}
                    <div style={{
                        padding: '0.75rem 0.875rem',
                        borderBottom: '1px solid rgba(210,150,70,0.15)',
                        background: '#fdecd8',
                    }}>
                        <div style={{ position: 'relative' }}>
                            <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.4)"
                                 strokeWidth="1.8" viewBox="0 0 24 24"
                                 style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Nombre, teléfono o documento..."
                                style={{
                                    width: '100%', padding: '0.55rem 0.75rem 0.55rem 2rem',
                                    background: 'rgba(255,255,255,0.7)',
                                    border: '1.5px solid rgba(200,130,60,0.28)',
                                    borderRadius: '9px',
                                    fontSize: '0.8rem', color: '#2d1a08',
                                    fontFamily: 'Inter,sans-serif', outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                        <p style={{
                            fontSize: '0.68rem', color: 'rgba(150,80,20,0.45)',
                            marginTop: '0.4rem', paddingLeft: '0.1rem', marginBottom: 0,
                        }}>
                            {busqueda
                                ? `${clientesFiltrados.length} resultado${clientesFiltrados.length !== 1 ? 's' : ''}`
                                : `${clientes.length} clientes registrados`}
                        </p>
                    </div>

                    {/* Opción general */}
                    {!busqueda && (
                        <button type="button"
                                onClick={() => { onChange(''); setOpen(false); }}
                                style={{
                                    width: '100%', padding: '0.7rem 0.875rem', textAlign: 'left',
                                    background: !value ? 'rgba(16,185,129,0.06)' : 'transparent',
                                    border: 'none', borderBottom: '1px solid rgba(210,150,70,0.1)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                                    transition: 'background 0.12s',
                                    fontFamily: 'Inter,sans-serif',
                                }}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%',
                                background: 'rgba(200,140,80,0.08)', border: '1px solid rgba(200,140,80,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.4)"
                                     strokeWidth="1.6" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <span style={{
                                fontSize: '0.82rem', fontWeight: '500',
                                color: !value ? 'rgba(4,120,87,0.85)' : '#2d1a08',
                                letterSpacing: '-0.01em',
                            }}>
                                Cliente general (sin cuenta)
                            </span>
                            {!value && (
                                <svg width="13" height="13" fill="none" stroke="rgba(4,120,87,0.8)"
                                     strokeWidth="2.2" viewBox="0 0 24 24" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Lista */}
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                        {clientesPag.length === 0 ? (
                            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>Sin resultados</p>
                            </div>
                        ) : clientesPag.map((c, i) => {
                            const sel      = String(c.id) === String(value);
                            const iniciales = c.nombre.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                            return (
                                <button key={c.id} type="button"
                                        onClick={() => { onChange(String(c.id)); setOpen(false); }}
                                        style={{
                                            width: '100%', padding: '0.65rem 0.875rem', textAlign: 'left',
                                            background: sel ? 'rgba(16,185,129,0.05)' : 'transparent',
                                            border: 'none',
                                            borderBottom: i < clientesPag.length - 1 ? '1px solid rgba(210,150,70,0.08)' : 'none',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem',
                                            transition: 'background 0.12s',
                                            fontFamily: 'Inter,sans-serif',
                                        }}>
                                    <div style={{
                                        width: '30px', height: '30px', borderRadius: '50%',
                                        background: sel ? 'rgba(16,185,129,0.1)' : 'rgba(180,100,30,0.07)',
                                        border: `1px solid ${sel ? 'rgba(16,185,129,0.25)' : 'rgba(200,140,80,0.18)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, fontSize: '0.65rem', fontWeight: '600',
                                        color: sel ? 'rgba(4,120,87,0.8)' : 'rgba(120,60,10,0.65)',
                                    }}>
                                        {iniciales}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontSize: '0.82rem', fontWeight: '500',
                                            color: sel ? 'rgba(4,120,87,0.85)' : '#2d1a08',
                                            margin: '0 0 0.1rem',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            letterSpacing: '-0.01em',
                                        }}>
                                            {c.nombre}
                                        </p>
                                        {c.telefono && (
                                            <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>
                                                {c.telefono}
                                            </p>
                                        )}
                                    </div>
                                    {sel && (
                                        <svg width="13" height="13" fill="none" stroke="rgba(4,120,87,0.8)"
                                             strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.55rem 0.875rem',
                            borderTop: '1px solid rgba(210,150,70,0.12)',
                            background: 'rgba(253,236,216,0.4)',
                        }}>
                            <button type="button" disabled={pagina === 1}
                                    onClick={() => setPagina(p => Math.max(1, p - 1))}
                                    style={{
                                        fontSize: '0.72rem', color: 'rgba(120,60,10,0.65)',
                                        background: 'none', border: 'none',
                                        cursor: pagina === 1 ? 'not-allowed' : 'pointer',
                                        opacity: pagina === 1 ? 0.4 : 1,
                                        fontFamily: 'Inter,sans-serif', padding: '0.2rem 0.4rem',
                                    }}>
                                Anterior
                            </button>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)' }}>
                                {pagina} / {totalPaginas}
                            </span>
                            <button type="button" disabled={pagina === totalPaginas}
                                    onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                    style={{
                                        fontSize: '0.72rem', color: 'rgba(120,60,10,0.65)',
                                        background: 'none', border: 'none',
                                        cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer',
                                        opacity: pagina === totalPaginas ? 0.4 : 1,
                                        fontFamily: 'Inter,sans-serif', padding: '0.2rem 0.4rem',
                                    }}>
                                Siguiente
                            </button>
                        </div>
                    )}

                    {/* Crear cliente */}
                    <div style={{
                        padding: '0.55rem 0.875rem',
                        borderTop: '1px solid rgba(210,150,70,0.12)',
                        background: '#fdecd8',
                    }}>
                        <Link href="/clientes/crear" style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            fontSize: '0.75rem', color: 'rgba(185,28,28,0.75)',
                            textDecoration: 'none', fontWeight: '500',
                        }}>
                            <svg width="12" height="12" fill="none" stroke="currentColor"
                                 strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Registrar nuevo cliente
                        </Link>
                    </div>
                </div>
            </DropdownPortal>
        </div>
    );
}


const METODOS_PAGO = [
    { value: 'Efectivo',       icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { value: 'Tarjeta',        icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { value: 'Transferencia',  icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { value: 'Mixto',          icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

function MetodoPagoSelect({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const triggerRef      = useRef(null);

    useEffect(() => {
        const h = (e) => {
            if (triggerRef.current?.contains(e.target)) return;
            const panel = document.querySelector('[data-metodo-panel="true"]');
            if (panel?.contains(e.target)) return;
            setOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const seleccionado = METODOS_PAGO.find(m => m.value === value) ?? METODOS_PAGO[0];

    return (
        <div ref={triggerRef} style={{ position: 'relative' }}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.72rem 0.875rem',
                    background: open ? 'rgba(255,248,242,0.98)' : 'rgba(255,252,248,0.82)',
                    border: open ? '1.5px solid rgba(185,28,28,0.45)' : '1.5px solid rgba(200,130,60,0.32)',
                    borderRadius: '12px',
                    boxShadow: open
                        ? '0 0 0 3px rgba(185,28,28,0.09), 0 2px 8px rgba(180,80,10,0.1)'
                        : '0 1px 3px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                    fontSize: '0.84rem', color: '#2d1a08',
                    fontFamily: 'Inter,sans-serif', cursor: 'pointer',
                    transition: 'all 0.15s', outline: 'none', gap: '0.4rem',
                    userSelect: 'none',
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                    <svg width="13" height="13" fill="none"
                         stroke={open ? 'rgba(185,28,28,0.7)' : 'rgba(160,80,20,0.5)'}
                         strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={seleccionado.icon}/>
                    </svg>
                    <span style={{ fontWeight: '500', letterSpacing: '-0.01em' }}>
                        {seleccionado.value}
                    </span>
                </span>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"
                     stroke="rgba(150,70,15,0.45)"
                     style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {/* Dropdown portal */}
            <DropdownPortal triggerRef={triggerRef} open={open}>
                <div
                    data-metodo-panel="true"
                    style={{
                        background: '#fef6ee',
                        border: '1.5px solid rgba(210,150,80,0.3)',
                        borderRadius: '16px',
                        boxShadow: [
                            '0 32px 80px rgba(100,45,5,0.22)',
                            '0 12px 32px rgba(130,60,10,0.14)',
                            '0 4px 10px rgba(130,60,10,0.08)',
                            'inset 0 1px 0 rgba(255,255,255,0.95)',
                        ].join(', '),
                        overflow: 'hidden',
                        animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                    }}
                >
                    {METODOS_PAGO.map((m, i) => {
                        const sel = m.value === value;
                        return (
                            <button
                                key={m.value}
                                type="button"
                                onClick={() => { onChange(m.value); setOpen(false); }}
                                style={{
                                    width: '100%', padding: '0.75rem 0.875rem', textAlign: 'left',
                                    background: sel ? 'rgba(16,185,129,0.05)' : 'transparent',
                                    border: 'none',
                                    borderBottom: i < METODOS_PAGO.length - 1 ? '1px solid rgba(210,150,70,0.1)' : 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    transition: 'background 0.12s', fontFamily: 'Inter,sans-serif',
                                }}
                            >
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                    background: sel ? 'rgba(16,185,129,0.1)' : 'rgba(180,100,30,0.07)',
                                    border: `1px solid ${sel ? 'rgba(16,185,129,0.25)' : 'rgba(200,140,80,0.18)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="14" height="14" fill="none"
                                         stroke={sel ? 'rgba(4,120,87,0.8)' : 'rgba(120,60,10,0.55)'}
                                         strokeWidth="1.8" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={m.icon}/>
                                    </svg>
                                </div>
                                <span style={{
                                    fontSize: '0.84rem', fontWeight: '500',
                                    color: sel ? 'rgba(4,120,87,0.85)' : '#2d1a08',
                                    letterSpacing: '-0.01em', flex: 1,
                                }}>
                                    {m.value}
                                </span>
                                {sel && (
                                    <svg width="13" height="13" fill="none" stroke="rgba(4,120,87,0.8)"
                                         strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </DropdownPortal>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function VentasCreate({ productos = [], clientes = [] }) {
    const [busquedaProducto, setBusquedaProducto]       = useState('');
    const [items, setItems]                             = useState([]);
    const [avisoClienteGeneral, setAvisoClienteGeneral] = useState(false);
    const [ventaExitosa, setVentaExitosa]               = useState(null);
    const pendingMeta                                    = useRef(null);

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        cliente_id:   '',
        tipo_venta:   'Contado',
        metodo_pago:  'Efectivo',
        pagado:       '',
        descuento:    '0',
        notas:        '',
        fecha_limite: '',
        items:        [],
    });

    useEffect(() => { if (errors.items) clearErrors('items'); }, [items]);

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        (p.codigo_barras && p.codigo_barras.toLowerCase().includes(busquedaProducto.toLowerCase()))
    );

    const agregarProducto = (producto) => {
        const existe = items.find(i => i.producto_id === producto.id);
        if (existe) {
            const nuevos = items.map(i => i.producto_id === producto.id
                ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) } : i);
            setItems(nuevos); setData('items', nuevos);
        } else {
            const nuevos = [...items, { producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio, cantidad: 1, stock_max: producto.stock }];
            setItems(nuevos); setData('items', nuevos);
        }
        setBusquedaProducto('');
    };

    const actualizarCantidad = (idx, cantidad) => {
        const nuevos = items.map((item, i) => {
            if (i !== idx) return item;
            const cant = Math.max(1, Math.min(parseInt(cantidad) || 1, item.stock_max));
            return { ...item, cantidad: cant };
        });
        setItems(nuevos); setData('items', nuevos);
    };

    const eliminarItem = (idx) => {
        const nuevos = items.filter((_, i) => i !== idx);
        setItems(nuevos); setData('items', nuevos);
    };

    const cambiarTipoVenta = (tipo) => {
        setAvisoClienteGeneral(false);
        if (tipo === 'Contado') setData(prev => ({ ...prev, tipo_venta: tipo, fecha_limite: '' }));
        else setData(prev => ({ ...prev, tipo_venta: tipo, fecha_limite: fechaSugerida(tipo) }));
    };

    const subtotal       = items.reduce((acc, i) => acc + (i.cantidad * i.precio_unitario), 0);
    const descuento      = parseFloat(data.descuento) || 0;
    const total          = subtotal - descuento;
    const pagado         = parseFloat(data.pagado) || 0;
    const saldoPendiente = Math.max(0, total - pagado);

    const esClienteGeneral   = !data.cliente_id;
    const esContado          = data.tipo_venta === 'Contado';
    const pagoInsuficiente   = data.pagado !== '' && pagado < total && total > 0;
    const mostrarAvisoDeuda  = esClienteGeneral && esContado && pagoInsuficiente && items.length > 0;
    const hayErrorStock      = !!errors.items;
    const submitBloqueado    = mostrarAvisoDeuda || hayErrorStock;
    const esCreditoOSeparado = data.tipo_venta === 'Crédito' || data.tipo_venta === 'Separado';

    const fechaMinima   = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };
    const fechaSugerida = (tipo) => { const d = new Date(); d.setDate(d.getDate() + (tipo === 'Separado' ? 30 : 60)); return d.toISOString().split('T')[0]; };
    const cambiarASeparado = () => { setData(prev => ({ ...prev, tipo_venta: 'Separado', fecha_limite: fechaSugerida('Separado') })); setAvisoClienteGeneral(false); };

    const submit = (e) => {
        e.preventDefault();
        if (esClienteGeneral && esContado && pagado < total && total > 0) {
            setAvisoClienteGeneral(true);
            setTimeout(() => document.getElementById('aviso-cliente-general')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
            return;
        }
        pendingMeta.current = { tipo_venta: data.tipo_venta, total };
        post('/ventas', {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                const meta = pendingMeta.current;
                setItems([]); setBusquedaProducto(''); setAvisoClienteGeneral(false); reset();
                setVentaExitosa(meta);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onError: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                    if (document.getElementById('aviso-stock')) {
                        document.getElementById('aviso-stock')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 120);
            },
        });
    };

    // Config modal éxito
    const modalConfig = {
        Contado:  { accent: 'rgba(16,185,129,0.75)',  label: 'Venta de contado', path: 'M5 13l4 4L19 7' },
        Separado: { accent: 'rgba(245,158,11,0.8)',    label: 'Venta separada',   path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        Credito:  { accent: 'rgba(59,130,246,0.8)',    label: 'Venta a crédito',  path: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    };
    const cfgKey = ventaExitosa?.tipo_venta === 'Crédito' ? 'Credito' : (ventaExitosa?.tipo_venta ?? 'Contado');
    const cfg    = modalConfig[cfgKey] ?? modalConfig.Contado;

    // Shared styles
    const inputStyle = {
        width: '100%', padding: '0.72rem 0.875rem',
        background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(200,140,80,0.2)',
        borderRadius: '10px', fontSize: '0.84rem', color: '#2d1a08',
        fontFamily: 'Inter,sans-serif', outline: 'none', transition: 'all 0.15s',
        letterSpacing: '-0.01em', boxSizing: 'border-box',
    };
    const labelStyle = {
        display: 'block', fontSize: '0.66rem', fontWeight: '600',
        color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase',
        letterSpacing: '0.08em', marginBottom: '0.4rem',
    };

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes dropIn { from{opacity:0;transform:translateY(-6px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
                @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

                .vc-root {
                    min-height:100vh;
                    font-family:'Inter',-apple-system,sans-serif;
                    background:
                        radial-gradient(ellipse 75% 55% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 100% 100%, rgba(255,195,145,0.12) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 40%, #fef5ef 70%, #fef8f4 100%);
                }
                .vc-header {
                    background:rgba(253,246,240,0.75);
                    backdrop-filter:blur(32px) saturate(160%);
                    border-bottom:1px solid rgba(200,140,80,0.12);
                    box-shadow:0 1px 0 rgba(255,255,255,0.8);
                    position:sticky;top:0;z-index:50;
                }
                .vc-header-inner {
                    max-width:1280px;margin:0 auto;padding:1.25rem 1.5rem;
                    display:flex;align-items:center;gap:0.875rem;
                }
                .vc-content {
                    max-width:1280px;margin:0 auto;padding:2rem 1.5rem 3rem;
                }
                .vc-grid {
                    display:grid;grid-template-columns:1fr 340px;gap:1.25rem;align-items:start;
                }
                .vc-card {
                    background:rgba(255,255,255,0.45);
                    backdrop-filter:blur(20px) saturate(150%);
                    border:1px solid rgba(200,140,80,0.12);
                    border-radius:16px;
                    box-shadow:0 4px 24px rgba(180,90,20,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow:visible;
                }
                .vc-card-pad { padding:1.35rem; }
                .vc-section-label {
                    font-size:0.66rem;font-weight:600;
                    color:rgba(150,80,20,0.45);letter-spacing:0.1em;text-transform:uppercase;
                    margin:0 0 0.875rem;
                }
                .vc-divider { border:none;border-top:1px solid rgba(200,140,80,0.1);margin:1rem 0; }

                /* Tipo venta tabs */
                .vc-tabs { display:grid;grid-template-columns:repeat(3,1fr);gap:0.4rem;margin-bottom:1rem; }
                .vc-tab {
                    padding:0.6rem 0.5rem;border-radius:8px;border:1px solid transparent;
                    font-size:0.8rem;font-weight:500;font-family:'Inter',sans-serif;
                    cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;text-align:center;
                }
                .vc-tab-inactive {
                    background:rgba(255,255,255,0.4);border-color:rgba(200,140,80,0.15);
                    color:rgba(120,60,10,0.65);
                }
                .vc-tab-inactive:hover { background:rgba(255,255,255,0.7);border-color:rgba(200,140,80,0.25); }
                .vc-tab-active {
                    background:rgba(185,28,28,0.08);border-color:rgba(185,28,28,0.28);
                    color:rgba(185,28,28,0.9);
                }

                /* Producto search */
                .vc-prod-list {
                    margin-top:0.5rem;
                    background:rgba(253,248,244,0.98);backdrop-filter:blur(20px);
                    border:1px solid rgba(200,140,80,0.18);border-radius:11px;
                    overflow:hidden;max-height:220px;overflow-y:auto;
                    box-shadow:0 8px 24px rgba(180,90,20,0.08);
                }
                .vc-prod-item {
                    width:100%;display:flex;align-items:center;justify-content:space-between;
                    padding:0.7rem 0.9rem;background:none;border:none;border-bottom:1px solid rgba(200,140,80,0.07);
                    cursor:pointer;transition:background 0.12s;text-align:left;
                }
                .vc-prod-item:last-child { border-bottom:none; }
                .vc-prod-item:hover { background:rgba(255,255,255,0.6); }

                /* Items carrito */
                .vc-item-row {
                    display:flex;align-items:center;gap:0.75rem;
                    padding:0.75rem 0;border-bottom:1px solid rgba(200,140,80,0.08);
                }
                .vc-item-row:last-child { border-bottom:none; }
                .vc-qty-btn {
                    width:28px;height:28px;border-radius:7px;
                    background:rgba(255,255,255,0.5);border:1px solid rgba(200,140,80,0.2);
                    display:flex;align-items:center;justify-content:center;
                    cursor:pointer;transition:all 0.12s;flex-shrink:0;
                }
                .vc-qty-btn:hover { background:rgba(255,255,255,0.85);border-color:rgba(200,140,80,0.35); }
                .vc-qty-input {
                    width:40px;text-align:center;
                    padding:0.3rem;background:rgba(255,255,255,0.5);
                    border:1px solid rgba(200,140,80,0.18);border-radius:7px;
                    font-size:0.82rem;color:#2d1a08;font-family:'Inter',sans-serif;outline:none;
                }

                /* Summary row */
                .vc-sum-row { display:flex;justify-content:space-between;align-items:center; font-size:0.82rem; }

                /* Btn primary */
                .vc-btn-submit {
                    width:100%;padding:0.85rem 1rem;
                    background:rgba(185,28,28,0.1);border:1px solid rgba(185,28,28,0.3);
                    border-radius:11px;color:rgba(165,20,20,0.95);
                    font-size:0.86rem;font-weight:600;font-family:'Inter',sans-serif;
                    cursor:pointer;transition:all 0.15s;letter-spacing:-0.01em;
                }
                .vc-btn-submit:hover:not(:disabled) { background:rgba(185,28,28,0.16);border-color:rgba(185,28,28,0.42); }
                .vc-btn-submit:disabled { opacity:1;cursor:not-allowed; }
                .vc-btn-submit.blocked {
                    background:rgba(245,158,11,0.18);
                    border-color:rgba(245,158,11,0.42);
                    color:rgba(120,60,10,0.92);
                    box-shadow:inset 0 1px 0 rgba(255,255,255,0.35);
                }

                /* Alert boxes */
                .vc-alert {
                    border-radius:12px;padding:1rem 1.1rem;
                    animation:fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both;
                }
                .vc-alert-red { background:rgba(220,38,38,0.04);border:1px solid rgba(220,38,38,0.15); }
                .vc-alert-amber { background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2); }
                .vc-alert-green { background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2); }

                /* Aviso option btn */
                .vc-opt-btn {
                    width:100%;display:flex;align-items:center;gap:0.75rem;
                    padding:0.75rem 0.875rem;border-radius:9px;
                    background:rgba(255,255,255,0.45);border:1px solid rgba(200,140,80,0.15);
                    cursor:pointer;transition:all 0.13s;text-align:left;font-family:'Inter',sans-serif;
                    margin-top:0.4rem;
                }
                .vc-opt-btn:hover { background:rgba(255,255,255,0.8);border-color:rgba(200,140,80,0.28); }

                /* Modal éxito */
                .vc-modal-overlay {
                    position:fixed;inset:0;z-index:200;
                    background:rgba(20,8,0,0.25);backdrop-filter:blur(6px);
                    display:flex;align-items:center;justify-content:center;padding:1rem;
                }
                .vc-modal-card {
                    width:100%;max-width:360px;
                    background:rgba(253,248,244,0.98);backdrop-filter:blur(40px);
                    border:1px solid rgba(200,140,80,0.18);border-radius:20px;
                    padding:2rem 1.75rem;text-align:center;
                    box-shadow:0 20px 60px rgba(180,90,20,0.14);
                    animation:scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
                }
                .vc-modal-btn {
                    flex:1;padding:0.72rem;border-radius:9px;font-family:'Inter',sans-serif;
                    font-size:0.82rem;font-weight:500;cursor:pointer;transition:all 0.13s;
                    letter-spacing:-0.01em;border:none;
                }

                /* Responsive */
                @media (max-width:960px) {
                    .vc-grid { grid-template-columns:1fr;gap:1rem; }
                }
                @media (max-width:640px) {
                    .vc-content { padding:1.25rem 1rem 3rem; }
                    .vc-header-inner { padding:1rem; }
                    .vc-card-pad { padding:1.1rem; }
                }
            `}</style>

            <div className="vc-root">

                {/* Header */}
                <div className="vc-header">
                    <div className="vc-header-inner">
                        <Link href="/ventas" style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(200,140,80,0.18)',
                            flexShrink: 0, transition: 'all 0.13s', textDecoration: 'none',
                        }}>
                            <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.6)"
                                 strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </Link>
                        <div>
                            <p style={{
                                fontSize: '0.66rem', fontWeight: '600',
                                color: 'rgba(150,80,20,0.45)', letterSpacing: '0.1em',
                                textTransform: 'uppercase', margin: '0 0 0.15rem',
                            }}>
                                Ventas
                            </p>
                            <h1 style={{
                                fontSize: 'clamp(1rem,2.5vw,1.35rem)', fontWeight: '300',
                                color: '#2d1a08', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1,
                            }}>
                                Nueva venta
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="vc-content">
                    <form onSubmit={submit}>
                        <div className="vc-grid">

                            {/* ── Columna izquierda ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                {/* Buscar producto */}
                                <div className="vc-card vc-card-pad" style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.04s both' }}>
                                    <p className="vc-section-label">Agregar productos</p>
                                    <div style={{ position: 'relative' }}>
                                        <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.35)"
                                             strokeWidth="1.8" viewBox="0 0 24 24"
                                             style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            <circle cx="11" cy="11" r="8"/>
                                            <path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                                        </svg>
                                        <input
                                            type="text"
                                            value={busquedaProducto}
                                            onChange={(e) => setBusquedaProducto(e.target.value)}
                                            placeholder="Buscar por nombre o código de barras..."
                                            style={{ ...inputStyle, paddingLeft: '2.2rem' }}
                                        />
                                    </div>
                                    {busquedaProducto.length > 0 && (
                                        <div className="vc-prod-list">
                                            {productosFiltrados.length === 0 ? (
                                                <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                                                    <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.5)' }}>Sin resultados</p>
                                                </div>
                                            ) : productosFiltrados.map(p => (
                                                <button key={p.id} type="button"
                                                        onClick={() => agregarProducto(p)}
                                                        className="vc-prod-item">
                                                    <div>
                                                        <p style={{ fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.1rem', letterSpacing: '-0.01em' }}>
                                                            {p.nombre}
                                                        </p>
                                                        <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>
                                                            {p.categoria}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                        <p style={{ fontSize: '0.84rem', fontWeight: '600', color: 'rgba(185,28,28,0.85)', margin: '0 0 0.08rem', letterSpacing: '-0.02em' }}>
                                                            {formatCurrency(p.precio)}
                                                        </p>
                                                        <p style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.45)', margin: 0 }}>
                                                            Stock: {p.stock}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Artículos */}
                                <div className="vc-card"
                                     style={{
                                         border: hayErrorStock ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(200,140,80,0.12)',
                                         animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s both',
                                     }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '1rem 1.35rem', borderBottom: '1px solid rgba(200,140,80,0.1)',
                                    }}>
                                        <p className="vc-section-label" style={{ margin: 0 }}>Artículos</p>
                                        <span style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.5)' }}>
                                            {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
                                        </span>
                                    </div>

                                    {items.length === 0 ? (
                                        <div style={{ padding: '2.5rem 1.35rem', textAlign: 'center' }}>
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '10px',
                                                margin: '0 auto 0.875rem',
                                                background: 'rgba(200,140,80,0.05)', border: '1px solid rgba(200,140,80,0.12)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <svg width="16" height="16" fill="none" stroke="rgba(150,80,20,0.28)"
                                                     strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                </svg>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.45)' }}>
                                                Busca y agrega productos a la venta
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '0 1.35rem' }}>
                                            {items.map((item, idx) => (
                                                <div key={idx} className="vc-item-row">
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{
                                                            fontSize: '0.82rem', fontWeight: '500', color: '#2d1a08',
                                                            margin: '0 0 0.12rem',
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            letterSpacing: '-0.01em',
                                                        }}>
                                                            {item.nombre}
                                                        </p>
                                                        <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.5)', margin: 0 }}>
                                                            Stock: {item.stock_max} · {formatCurrency(item.precio_unitario)} c/u
                                                        </p>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                                                        <button type="button" className="vc-qty-btn"
                                                                onClick={() => actualizarCantidad(idx, item.cantidad - 1)}>
                                                            <svg width="10" height="10" fill="none" stroke="rgba(120,60,10,0.6)"
                                                                 strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" d="M20 12H4"/>
                                                            </svg>
                                                        </button>
                                                        <input type="number" value={item.cantidad}
                                                               onChange={(e) => actualizarCantidad(idx, e.target.value)}
                                                               className="vc-qty-input" min="1" max={item.stock_max}/>
                                                        <button type="button" className="vc-qty-btn"
                                                                onClick={() => actualizarCantidad(idx, item.cantidad + 1)}>
                                                            <svg width="10" height="10" fill="none" stroke="rgba(120,60,10,0.6)"
                                                                 strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" d="M12 4v16m8-8H4"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <p style={{
                                                        width: '80px', textAlign: 'right',
                                                        fontSize: '0.86rem', fontWeight: '600', color: '#2d1a08',
                                                        flexShrink: 0, letterSpacing: '-0.02em',
                                                    }}>
                                                        {formatCurrency(item.cantidad * item.precio_unitario)}
                                                    </p>
                                                    <button type="button" onClick={() => eliminarItem(idx)}
                                                            style={{
                                                                background: 'none', border: 'none', cursor: 'pointer',
                                                                padding: '0.25rem', borderRadius: '6px',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                flexShrink: 0, transition: 'all 0.12s',
                                                            }}>
                                                        <svg width="13" height="13" fill="none" stroke="rgba(185,28,28,0.4)"
                                                             strokeWidth="1.8" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Error stock */}
                                {hayErrorStock && (
                                    <div id="aviso-stock" className="vc-alert vc-alert-red">
                                        <p style={{ fontSize: '0.8rem', fontWeight: '500', color: 'rgba(185,28,28,0.9)', margin: '0 0 0.4rem', letterSpacing: '-0.01em' }}>
                                            Stock insuficiente
                                        </p>
                                        {errors.items.split(' | ').map((msg, i) => (
                                            <p key={i} style={{ fontSize: '0.76rem', color: 'rgba(185,28,28,0.75)', margin: '0 0 0.2rem', lineHeight: '1.5' }}>
                                                · {msg}
                                            </p>
                                        ))}
                                        <p style={{ fontSize: '0.7rem', color: 'rgba(185,28,28,0.6)', margin: '0.5rem 0 0' }}>
                                            Reduce las cantidades o elimina los productos afectados.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* ── Columna derecha ── */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                {/* Cliente */}
                                <div className="vc-card vc-card-pad" style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s both' }}>
                                    <p className="vc-section-label">Cliente</p>
                                    <ClienteSelect
                                        clientes={clientes}
                                        value={data.cliente_id}
                                        onChange={(id) => { setData('cliente_id', id); setAvisoClienteGeneral(false); }}
                                        error={errors.cliente_id}
                                    />
                                    {errors.cliente_id && (
                                        <p style={{ marginTop: '0.3rem', fontSize: '0.73rem', color: 'rgba(185,28,28,0.8)' }}>
                                            {errors.cliente_id}
                                        </p>
                                    )}
                                </div>

                                {/* Tipo venta + método pago */}
                                <div className="vc-card vc-card-pad" style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                                    <p className="vc-section-label">Tipo de venta</p>
                                    <div className="vc-tabs">
                                        {['Contado', 'Separado', 'Crédito'].map(tipo => (
                                            <button key={tipo} type="button"
                                                    onClick={() => cambiarTipoVenta(tipo)}
                                                    className={`vc-tab ${data.tipo_venta === tipo ? 'vc-tab-active' : 'vc-tab-inactive'}`}>
                                                {tipo}
                                            </button>
                                        ))}
                                    </div>

                                    {/* ── Fecha límite con GlassDateInput ── */}
                                    {esCreditoOSeparado && (
                                        <div className="vc-alert vc-alert-amber" style={{ marginBottom: '1rem' }}>
                                            {/* GlassDateInput ya tiene su propio label prop */}
                                            <GlassDateInput
                                                label={`Fecha límite — ${data.tipo_venta === 'Separado' ? 'Separado' : 'Crédito'}`}
                                                value={data.fecha_limite}
                                                onChange={(val) => setData('fecha_limite', val)}
                                                placeholder="dd/mm/aaaa"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setData('fecha_limite', fechaSugerida(data.tipo_venta))}
                                                style={{
                                                    fontSize: '0.72rem', color: 'rgba(146,64,14,0.7)',
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    fontFamily: 'Inter,sans-serif',
                                                    padding: '0.3rem 0 0', textDecoration: 'underline',
                                                    display: 'block', marginTop: '0.35rem',
                                                }}
                                            >
                                                {data.tipo_venta === 'Separado' ? 'Sugerir 30 días' : 'Sugerir 60 días'}
                                            </button>
                                            {errors.fecha_limite && (
                                                <p style={{ fontSize: '0.72rem', color: 'rgba(185,28,28,0.8)', margin: '0.3rem 0 0' }}>
                                                    {errors.fecha_limite}
                                                </p>
                                            )}
                                            <p style={{
                                                fontSize: '0.71rem', color: 'rgba(146,64,14,0.65)',
                                                margin: '0.5rem 0 0', lineHeight: '1.5',
                                            }}>
                                                {data.tipo_venta === 'Separado'
                                                    ? 'El producto quedará reservado hasta esta fecha.'
                                                    : 'El producto se entrega ahora; el cliente paga hasta esta fecha.'}
                                            </p>
                                        </div>
                                    )}

                                    <hr className="vc-divider"/>

                                    <label style={labelStyle}>Método de pago</label>
                                    <MetodoPagoSelect
                                        value={data.metodo_pago}
                                        onChange={(val) => setData('metodo_pago', val)}
                                    />
                                </div>

                                {/* Resumen financiero */}
                                <div className="vc-card vc-card-pad" style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.14s both' }}>
                                    <p className="vc-section-label">Resumen</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                                        <div className="vc-sum-row">
                                            <span style={{ color: 'rgba(150,80,20,0.55)' }}>Subtotal</span>
                                            <span style={{ fontWeight: '500', color: '#2d1a08' }}>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="vc-sum-row">
                                            <span style={{ color: 'rgba(150,80,20,0.55)' }}>Descuento</span>
                                            <div style={{ position: 'relative' }}>
                                                <span style={{
                                                    position: 'absolute', left: '0.5rem', top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    fontSize: '0.75rem', color: 'rgba(150,80,20,0.45)',
                                                }}>$</span>
                                                <input type="number" value={data.descuento}
                                                       onChange={(e) => setData('descuento', e.target.value)}
                                                       style={{
                                                           ...inputStyle, width: '110px',
                                                           paddingLeft: '1.25rem',
                                                           paddingTop: '0.45rem', paddingBottom: '0.45rem',
                                                           textAlign: 'right',
                                                       }}
                                                       min="0"/>
                                            </div>
                                        </div>
                                        <hr className="vc-divider" style={{ margin: '0.25rem 0' }}/>
                                        <div className="vc-sum-row">
                                            <span style={{ fontWeight: '500', color: '#2d1a08', fontSize: '0.86rem' }}>Total</span>
                                            <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#2d1a08', letterSpacing: '-0.03em' }}>
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <label style={labelStyle}>
                                        Monto recibido
                                        <span style={{ color: 'rgba(185,28,28,0.7)', marginLeft: '0.25rem' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            position: 'absolute', left: '0.7rem', top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '0.82rem', fontWeight: '500', color: 'rgba(150,80,20,0.45)',
                                        }}>$</span>
                                        <input type="number" value={data.pagado}
                                               onChange={(e) => {
                                                   setData('pagado', e.target.value);
                                                   if (avisoClienteGeneral) setAvisoClienteGeneral(false);
                                               }}
                                               style={{
                                                   ...inputStyle, paddingLeft: '1.5rem',
                                                   fontSize: '1rem', fontWeight: '600',
                                                   border: mostrarAvisoDeuda
                                                       ? '1px solid rgba(185,28,28,0.35)'
                                                       : '1px solid rgba(200,140,80,0.2)',
                                               }}
                                               placeholder="0" min="0"/>
                                    </div>
                                    {errors.pagado && (
                                        <p style={{ fontSize: '0.73rem', color: 'rgba(185,28,28,0.8)', marginBottom: '0.5rem' }}>
                                            {errors.pagado}
                                        </p>
                                    )}

                                    {data.pagado !== '' && pagado >= total && total > 0 && (
                                        <div className="vc-alert vc-alert-green" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.78rem', color: 'rgba(4,120,87,0.8)' }}>Cambio</span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(4,120,87,0.9)' }}>
                                                {formatCurrency(pagado - total)}
                                            </span>
                                        </div>
                                    )}
                                    {data.pagado !== '' && pagado < total && total > 0 && !mostrarAvisoDeuda && (
                                        <div className="vc-alert vc-alert-amber" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.78rem', color: 'rgba(146,64,14,0.8)' }}>Saldo pendiente</span>
                                            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'rgba(146,64,14,0.9)' }}>
                                                {formatCurrency(saldoPendiente)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Aviso cliente general */}
                                {mostrarAvisoDeuda && (
                                    <div id="aviso-cliente-general" className="vc-alert vc-alert-red">
                                        <p style={{ fontSize: '0.8rem', fontWeight: '500', color: 'rgba(185,28,28,0.9)', margin: '0 0 0.25rem', letterSpacing: '-0.01em' }}>
                                            Sin titular de la deuda
                                        </p>
                                        <p style={{ fontSize: '0.76rem', color: 'rgba(185,28,28,0.7)', margin: '0 0 0.875rem', lineHeight: '1.5' }}>
                                            El cliente general no tiene cuenta. El saldo de{' '}
                                            <strong>{formatCurrency(saldoPendiente)}</strong> quedará sin a quién cobrar.
                                        </p>
                                        <p style={{ fontSize: '0.66rem', fontWeight: '600', color: 'rgba(185,28,28,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.4rem' }}>
                                            ¿Qué deseas hacer?
                                        </p>
                                        <button type="button" className="vc-opt-btn"
                                                onClick={() => { setData('pagado', total.toString()); setAvisoClienteGeneral(false); }}>
                                            <svg width="14" height="14" fill="none" stroke="rgba(4,120,87,0.8)"
                                                 strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                            </svg>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.08rem', letterSpacing: '-0.01em' }}>
                                                    Completar el pago ahora
                                                </p>
                                                <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.55)', margin: 0 }}>
                                                    Ajustar a {formatCurrency(total)}
                                                </p>
                                            </div>
                                        </button>
                                        <button type="button" className="vc-opt-btn" onClick={cambiarASeparado}>
                                            <svg width="14" height="14" fill="none" stroke="rgba(146,64,14,0.75)"
                                                 strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.08rem', letterSpacing: '-0.01em' }}>
                                                    Cambiar a Separado
                                                </p>
                                                <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.55)', margin: 0 }}>
                                                    Reserva con abono parcial
                                                </p>
                                            </div>
                                        </button>
                                        <Link href="/clientes/crear" className="vc-opt-btn"
                                              style={{ display: 'flex', textDecoration: 'none', marginTop: '0.4rem' }}>
                                            <svg width="14" height="14" fill="none" stroke="rgba(59,130,246,0.8)"
                                                 strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                            </svg>
                                            <div>
                                                <p style={{ fontSize: '0.8rem', fontWeight: '500', color: '#2d1a08', margin: '0 0 0.08rem', letterSpacing: '-0.01em' }}>
                                                    Registrar al cliente
                                                </p>
                                                <p style={{ fontSize: '0.71rem', color: 'rgba(150,80,20,0.55)', margin: 0 }}>
                                                    Crear cuenta y volver
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* Notas */}
                                <div className="vc-card vc-card-pad" style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.18s both' }}>
                                    <label style={labelStyle}>
                                        Notas{' '}
                                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', color: 'rgba(150,80,20,0.35)' }}>
                                            — opcional
                                        </span>
                                    </label>
                                    <textarea value={data.notas}
                                              onChange={(e) => setData('notas', e.target.value)}
                                              rows={2}
                                              placeholder="Observaciones de la venta..."
                                              style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}/>
                                </div>

                                {/* Submit */}
                                <button type="submit"
                                        disabled={processing || items.length === 0 || submitBloqueado}
                                        className={`vc-btn-submit${submitBloqueado ? ' blocked' : ''}`}>
                                    {processing
                                        ? 'Procesando...'
                                        : items.length === 0
                                            ? 'Agrega al menos un producto'
                                            : `Registrar venta · ${formatCurrency(total)}`}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal éxito */}
            {ventaExitosa && (
                <div className="vc-modal-overlay">
                    <div className="vc-modal-card">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            margin: '0 auto 1.25rem',
                            background: cfg.accent.replace(/[\d.]+\)$/, '0.08)'),
                            border: `1px solid ${cfg.accent.replace(/[\d.]+\)$/, '0.22)')}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="20" height="20" fill="none" stroke={cfg.accent}
                                 strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={cfg.path}/>
                            </svg>
                        </div>
                        <p style={{
                            fontSize: '0.68rem', fontWeight: '600',
                            color: cfg.accent.replace(/[\d.]+\)$/, '0.8)'),
                            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem',
                        }}>
                            {cfg.label}
                        </p>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
                            Venta registrada
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.55)', marginBottom: '1.5rem' }}>
                            La venta fue creada exitosamente.
                        </p>

                        <div style={{
                            background: 'rgba(200,140,80,0.05)', border: '1px solid rgba(200,140,80,0.12)',
                            borderRadius: '10px', padding: '0.875rem', marginBottom: '1.5rem', textAlign: 'left',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.55)' }}>Tipo</span>
                                <span style={{ fontSize: '0.78rem', fontWeight: '500', color: '#2d1a08' }}>{cfg.label}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.55)' }}>Total</span>
                                <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#2d1a08', letterSpacing: '-0.02em' }}>
                                    {formatCurrency(ventaExitosa.total)}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button className="vc-modal-btn" onClick={() => setVentaExitosa(null)}
                                    style={{ background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.22)', color: 'rgba(185,28,28,0.85)' }}>
                                Nueva venta
                            </button>
                            <button className="vc-modal-btn" onClick={() => router.visit('/ventas')}
                                    style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,140,80,0.2)', color: 'rgba(120,60,10,0.7)' }}>
                                Ver ventas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
