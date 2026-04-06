// resources/js/Pages/Reportes/Inventario.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const normalize = (s) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const CAT_POR_PAG      = 8;
const PROD_POR_PAG     = 12;
const OPCIONES_POR_PAG = 7;

function EstadoBadge({ stock, minimo }) {
    if (stock === 0)     return <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.22rem 0.65rem', borderRadius: '20px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: 'rgba(185,28,28,0.85)' }}>Agotado</span>;
    if (stock <= minimo) return <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.22rem 0.65rem', borderRadius: '20px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(146,64,14,0.9)' }}>Bajo stock</span>;
    return                      <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.22rem 0.65rem', borderRadius: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: 'rgba(4,120,87,0.85)' }}>En stock</span>;
}

function Paginador({ pagina, total, porPagina, onChange }) {
    const totalPags = Math.ceil(total / porPagina);
    if (totalPags <= 1) return null;
    const desde = (pagina - 1) * porPagina + 1;
    const hasta  = Math.min(pagina * porPagina, total);

    const rango = () => {
        if (totalPags <= 5) return Array.from({ length: totalPags }, (_, i) => i + 1);
        if (pagina <= 3)    return [1, 2, 3, 4, '...', totalPags];
        if (pagina >= totalPags - 2) return [1, '...', totalPags - 3, totalPags - 2, totalPags - 1, totalPags];
        return [1, '...', pagina - 1, pagina, pagina + 1, '...', totalPags];
    };

    const btnBase = {
        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '10px', fontSize: '0.78rem', fontWeight: '600', border: 'none',
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
    };

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.03)',
            flexWrap: 'wrap', gap: '0.5rem',
        }}>
            <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.55)' }}>
                Mostrando <strong style={{ color: '#2d1a08' }}>{desde}–{hasta}</strong> de{' '}
                <strong style={{ color: '#2d1a08' }}>{total}</strong> registros
            </p>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button onClick={() => onChange(pagina - 1)} disabled={pagina === 1}
                        style={{ ...btnBase, background: 'rgba(255,255,255,0.1)', color: 'rgba(150,80,20,0.6)', opacity: pagina === 1 ? 0.3 : 1 }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                {rango().map((n, i) => n === '...'
                    ? <span key={`e${i}`} style={{ width: '32px', textAlign: 'center', fontSize: '0.78rem', color: 'rgba(150,80,20,0.4)' }}>…</span>
                    : <button key={n} onClick={() => onChange(n)}
                              style={{
                                  ...btnBase,
                                  background: n === pagina ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.08)',
                                  color: n === pagina ? 'rgba(185,28,28,0.9)' : 'rgba(150,80,20,0.65)',
                                  border: n === pagina ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.4)',
                              }}>
                        {n}
                    </button>
                )}
                <button onClick={() => onChange(pagina + 1)} disabled={pagina === totalPags}
                        style={{ ...btnBase, background: 'rgba(255,255,255,0.1)', color: 'rgba(150,80,20,0.6)', opacity: pagina === totalPags ? 0.3 : 1 }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function EstadoDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref             = useRef(null);

    const options = [
        { value: '',        label: 'Todos los estados' },
        { value: 'ok',      label: 'En stock',   dot: 'rgba(16,185,129,0.8)'  },
        { value: 'bajo',    label: 'Bajo stock', dot: 'rgba(245,158,11,0.8)'  },
        { value: 'agotado', label: 'Agotados',   dot: 'rgba(220,38,38,0.8)'   },
    ];

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const selected = options.find(o => o.value === value);
    const isActive = value !== '';

    // Detectar si estamos cerca del borde derecho para abrir hacia la izquierda
    const [openLeft, setOpenLeft] = useState(false);
    const btnRef = useRef(null);
    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setOpenLeft(rect.right + 200 > window.innerWidth);
        }
        setOpen(o => !o);
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button ref={btnRef} type="button" onClick={handleOpen} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                background: isActive ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.08)',
                border: isActive ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.55)',
                borderRadius: '12px',
                fontSize: '0.82rem', fontWeight: '500',
                color: isActive ? 'rgba(185,28,28,0.85)' : 'rgba(120,60,10,0.75)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.18s',
            }}>
                {isActive && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(220,38,38,0.7)', flexShrink: 0 }} />}
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.55, flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{isActive ? selected?.label : 'Estado'}</span>
                <svg style={{ width: '12px', height: '12px', opacity: 0.45, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    // Abre hacia la izquierda si no hay espacio a la derecha
                    ...(openLeft ? { right: 0 } : { left: 0 }),
                    minWidth: '190px',
                    background: 'rgba(255,250,245,0.97)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.72)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(180,90,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                    overflow: 'hidden', zIndex: 200,
                    animation: 'invDropIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    {options.map((opt, i) => {
                        const sel = opt.value === value;
                        return (
                            <button key={opt.value} type="button"
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        gap: '0.75rem', padding: '0.65rem 1rem',
                                        fontSize: '0.83rem', fontWeight: sel ? '600' : '500',
                                        color: sel ? 'rgba(185,28,28,0.9)' : 'rgba(120,55,10,0.78)',
                                        background: sel ? 'rgba(220,38,38,0.05)' : 'none',
                                        border: 'none',
                                        borderBottom: i < options.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                                        cursor: 'pointer', textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif', transition: 'background 0.12s',
                                    }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {opt.dot && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />}
                                    {opt.label}
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
                </div>
            )}
        </div>
    );
}

function CategoriaDropdown({ value, onChange, categorias }) {
    const [open,     setOpen]     = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [pagina,   setPagina]   = useState(1);
    const ref                     = useRef(null);
    const inputRef                = useRef(null);
    const [openLeft, setOpenLeft] = useState(false);
    const btnRef                  = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (open) { setPagina(1); setTimeout(() => inputRef.current?.focus(), 60); }
        else setBusqueda('');
    }, [open]);

    useEffect(() => { setPagina(1); }, [busqueda]);

    const handleOpen = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            // El panel mide ~240px; si no cabe a la derecha, abre a la izquierda
            setOpenLeft(rect.left + 240 > window.innerWidth - 8);
        }
        setOpen(o => !o);
    };

    const filtradas  = useMemo(() => {
        const q = normalize(busqueda);
        return q ? categorias.filter(c => normalize(c).includes(q)) : categorias;
    }, [categorias, busqueda]);

    const totalPags = Math.ceil(filtradas.length / OPCIONES_POR_PAG);
    const paginadas = filtradas.slice((pagina - 1) * OPCIONES_POR_PAG, pagina * OPCIONES_POR_PAG);
    const isActive  = value !== '';

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button ref={btnRef} type="button" onClick={handleOpen} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                background: isActive ? 'rgba(220,38,38,0.06)' : 'rgba(255,255,255,0.08)',
                border: isActive ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.55)',
                borderRadius: '12px',
                fontSize: '0.82rem', fontWeight: '500',
                color: isActive ? 'rgba(185,28,28,0.85)' : 'rgba(120,60,10,0.75)',
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.18s',
                maxWidth: '180px',
            }}>
                {isActive && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(220,38,38,0.7)', flexShrink: 0 }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{isActive ? value : 'Categoría'}</span>
                <svg style={{ width: '12px', height: '12px', opacity: 0.45, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    // Posición inteligente: si no hay espacio a la derecha, abre hacia la izquierda
                    ...(openLeft ? { right: 0 } : { left: 0 }),
                    width: '240px',
                    // En móvil muy pequeño, no sobrepasar el viewport
                    maxWidth: 'calc(100vw - 16px)',
                    background: 'rgba(255,250,245,0.97)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.72)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(180,90,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                    overflow: 'hidden', zIndex: 200,
                    animation: 'invDropIn 0.18s cubic-bezier(0.16,1,0.3,1)',
                }}>
                    {/* Buscador */}
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                 width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input ref={inputRef} type="text" value={busqueda}
                                   onChange={e => setBusqueda(e.target.value)}
                                   placeholder="Buscar categoría..."
                                   style={{
                                       width: '100%', paddingLeft: '1.8rem', paddingRight: busqueda ? '1.8rem' : '0.5rem',
                                       paddingTop: '0.4rem', paddingBottom: '0.4rem',
                                       fontSize: '0.78rem', outline: 'none',
                                       background: 'rgba(255,255,255,0.7)',
                                       border: '1px solid rgba(200,140,80,0.18)', borderRadius: '9px',
                                       fontFamily: 'Inter, sans-serif', color: '#2d1a08',
                                       boxSizing: 'border-box',
                                   }} />
                            {busqueda && (
                                <button type="button" onClick={() => setBusqueda('')}
                                        style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                    <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.3rem' }}>
                            {filtradas.length} categoría{filtradas.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Opción "Todas" */}
                    {!busqueda && (
                        <button type="button" onClick={() => { onChange(''); setOpen(false); }}
                                style={{
                                    width: '100%', padding: '0.6rem 1rem', textAlign: 'left',
                                    fontSize: '0.83rem', fontWeight: !value ? '600' : '500',
                                    color: !value ? 'rgba(185,28,28,0.9)' : 'rgba(120,55,10,0.78)',
                                    background: !value ? 'rgba(220,38,38,0.05)' : 'none',
                                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.5)',
                                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                }}>
                            Todas las categorías
                        </button>
                    )}

                    {/* Lista */}
                    {paginadas.length === 0 ? (
                        <div style={{ padding: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'rgba(150,80,20,0.5)' }}>
                            Sin resultados para "{busqueda}"
                        </div>
                    ) : paginadas.map((cat, i) => {
                        const sel = cat === value;
                        return (
                            <button key={cat} type="button" onClick={() => { onChange(cat); setOpen(false); }}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.6rem 1rem', textAlign: 'left',
                                        fontSize: '0.83rem', fontWeight: sel ? '600' : '500',
                                        color: sel ? 'rgba(185,28,28,0.9)' : 'rgba(120,55,10,0.78)',
                                        background: sel ? 'rgba(220,38,38,0.05)' : 'none',
                                        border: 'none',
                                        borderBottom: i < paginadas.length - 1 ? '1px solid rgba(255,255,255,0.5)' : 'none',
                                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    }}>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
                                {sel && (
                                    <svg style={{ width: '13px', height: '13px', color: 'rgba(185,28,28,0.8)', flexShrink: 0, marginLeft: '0.5rem' }}
                                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}

                    {/* Paginación interna */}
                    {totalPags > 1 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '0.5rem 0.75rem',
                            borderTop: '1px solid rgba(255,255,255,0.5)',
                            background: 'rgba(255,255,255,0.4)',
                        }}>
                            <button type="button" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                                    style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(120,60,10,0.7)', background: 'none', border: 'none', cursor: 'pointer', opacity: pagina === 1 ? 0.35 : 1, fontFamily: 'Inter, sans-serif' }}>
                                Ant.
                            </button>
                            <div style={{ display: 'flex', gap: '3px' }}>
                                {Array.from({ length: totalPags }, (_, i) => i + 1).map(n => (
                                    <button key={n} type="button" onClick={() => setPagina(n)}
                                            style={{
                                                width: '22px', height: '22px', borderRadius: '6px',
                                                fontSize: '0.72rem', fontWeight: '600',
                                                background: n === pagina ? 'rgba(220,38,38,0.12)' : 'none',
                                                color: n === pagina ? 'rgba(185,28,28,0.9)' : 'rgba(150,80,20,0.6)',
                                                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                            }}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                            <button type="button" onClick={() => setPagina(p => Math.min(totalPags, p + 1))} disabled={pagina === totalPags}
                                    style={{ fontSize: '0.72rem', fontWeight: '600', color: 'rgba(120,60,10,0.7)', background: 'none', border: 'none', cursor: 'pointer', opacity: pagina === totalPags ? 0.35 : 1, fontFamily: 'Inter, sans-serif' }}>
                                Sig.
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ReporteInventario({ productos = [], porCategoria = [], criticos = [], kpis = {} }) {
    const [vistaProductos, setVistaProductos] = useState('criticos');
    const [busqueda,        setBusqueda]       = useState('');
    const [filtroCat,       setFiltroCat]      = useState('');
    const [filtroEstado,    setFiltroEstado]   = useState('');
    const [paginaCat,       setPaginaCat]      = useState(1);
    const [paginaProd,      setPaginaProd]     = useState(1);

    const cambiarBusqueda = (v) => { setBusqueda(v);     setPaginaProd(1); };
    const cambiarCat      = (v) => { setFiltroCat(v);    setPaginaProd(1); };
    const cambiarEstado   = (v) => { setFiltroEstado(v); setPaginaProd(1); };
    const cambiarVista    = (v) => { setVistaProductos(v); setPaginaProd(1); setBusqueda(''); setFiltroCat(''); setFiltroEstado(''); };

    const catPaginadas = useMemo(
        () => porCategoria.slice((paginaCat - 1) * CAT_POR_PAG, paginaCat * CAT_POR_PAG),
        [porCategoria, paginaCat]
    );
    const maxStock = Math.max(...porCategoria.map(c => c.total_stock || 0), 1);

    const productosFiltrados = useMemo(() => {
        const q = normalize(busqueda);
        let lista = vistaProductos === 'criticos' ? criticos : productos;
        if (q)                          lista = lista.filter(p => normalize(p.nombre).includes(q) || normalize(p.categoria).includes(q));
        if (filtroCat)                  lista = lista.filter(p => p.categoria === filtroCat);
        if (filtroEstado === 'agotado') lista = lista.filter(p => p.stock === 0);
        if (filtroEstado === 'bajo')    lista = lista.filter(p => p.stock > 0 && p.stock <= p.stock_minimo);
        if (filtroEstado === 'ok')      lista = lista.filter(p => p.stock > p.stock_minimo);
        return lista;
    }, [productos, criticos, vistaProductos, busqueda, filtroCat, filtroEstado]);

    const prodPaginados = useMemo(
        () => productosFiltrados.slice((paginaProd - 1) * PROD_POR_PAG, paginaProd * PROD_POR_PAG),
        [productosFiltrados, paginaProd]
    );

    const categorias = useMemo(
        () => [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort(),
        [productos]
    );

    const hayFiltros = busqueda || filtroCat || filtroEstado;

    const GLASS_BG = `
        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
        radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
        radial-gradient(ellipse 50% 45% at 15% 85%, rgba(255,205,155,0.17) 0%, transparent 55%),
        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
    `;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                .inv-bg {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: ${GLASS_BG};
                }
                @keyframes staggerUp {
                    from { opacity:0; transform:translateY(16px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes invDropIn {
                    from { opacity:0; transform:translateY(-6px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                .inv-a1 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .inv-a2 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .inv-a3 { animation: staggerUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.19s both; }

                .inv-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px;
                    border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.1), 0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    position: relative; overflow: hidden;
                }
                .inv-glass::before {
                    content: '';
                    position: absolute; top: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.95) 70%, transparent);
                    pointer-events: none; z-index: 1;
                }
                .inv-header {
                    background: rgba(255,255,255,0.08);
                    backdrop-filter: blur(40px) saturate(180%);
                    -webkit-backdrop-filter: blur(40px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.68);
                    box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
                    position: relative; z-index: 2;
                }
                .inv-table-row { transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.3); }
                .inv-table-row:hover { background: rgba(255,255,255,0.12); }
                .inv-table-row:last-child { border-bottom: none; }
                .inv-tab-btn { border: none; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.18s; }

                .inv-search {
                    padding: 0.5rem 0.9rem 0.5rem 2.4rem;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.55);
                    border-radius: 12px;
                    font-size: 0.82rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none;
                    flex: 1; min-width: 0;
                    transition: all 0.18s;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
                }
                .inv-search::placeholder { color: rgba(180,100,30,0.38); }
                .inv-search:focus {
                    border-color: rgba(220,38,38,0.4);
                    box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.8);
                    background: rgba(255,255,255,0.1);
                }

                /* ── Filtros responsive ── */
                .inv-filtros-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.65rem;
                    align-items: center;
                }

                .inv-filtros-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-shrink: 0;
                    align-items: center;
                }

                /* En móvil el buscador ocupa toda la fila, dropdowns en fila */
                @media (max-width: 600px) {
                    .inv-filtros-row { gap: 0.5rem; }
                    .inv-search-wrap { width: 100%; }
                    .inv-search { width: 100%; box-sizing: border-box; }

                    .inv-filtros-actions {
                        width: 100%;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                    }

                    .inv-btn-limpiar {
                        order: 2;
                        width: 100%;
                        justify-content: center;
                        margin-top: 0.15rem;
                    }
                }

                /* Responsive KPIs */
                .inv-kpi-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
                @media (max-width: 1100px) { .inv-kpi-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (max-width: 700px)  { .inv-kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } }

                /* Tabs en móvil */
                @media (max-width: 480px) {
                    .inv-tab-btn { font-size: 0.75rem !important; padding: 0.45rem 0.65rem !important; }
                }
            `}</style>

            <div className="inv-bg">

                {/* ── Header ── */}
                <div className="inv-header">
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/reportes" style={{
                                width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.65)',
                                borderRadius: '10px', color: 'rgba(150,80,20,0.6)',
                                textDecoration: 'none', transition: 'all 0.18s',
                            }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.2rem,4vw,1.65rem)', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    Reporte de Inventario
                                </h1>
                                <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: 'rgba(150,80,20,0.6)' }}>
                                    Estado actual del stock — {productos.length} productos · {porCategoria.length} categorías
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem 3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* ── KPIs ── */}
                    <div className="inv-kpi-grid inv-a1">
                        {[
                            { label: 'Productos activos',      value: kpis.total_productos,              accent: 'rgba(120,60,10,0.8)',   accentBg: 'rgba(120,60,10,0.07)',   accentBorder: 'rgba(120,60,10,0.18)',  tip: null },
                            { label: 'Valor total en venta',   value: fmt(kpis.valor_inventario_venta),  accent: 'rgba(16,185,129,0.9)',  accentBg: 'rgba(16,185,129,0.07)',  accentBorder: 'rgba(16,185,129,0.2)',  tip: 'Precio venta × stock' },
                            { label: 'Valor total en compra',  value: fmt(kpis.valor_inventario_compra), accent: 'rgba(59,130,246,0.9)',  accentBg: 'rgba(59,130,246,0.07)',  accentBorder: 'rgba(59,130,246,0.2)',  tip: 'Costo compra × stock' },
                            { label: 'Ganancia potencial',     value: fmt(kpis.ganancia_potencial),      accent: 'rgba(139,92,246,0.9)', accentBg: 'rgba(139,92,246,0.07)',  accentBorder: 'rgba(139,92,246,0.2)', tip: 'Venta − compra' },
                            { label: 'Bajo stock',             value: kpis.bajo_stock,                   accent: 'rgba(245,158,11,0.9)', accentBg: 'rgba(245,158,11,0.07)',  accentBorder: 'rgba(245,158,11,0.2)', tip: 'Stock ≤ mínimo' },
                            { label: 'Agotados',               value: kpis.agotados,                     accent: 'rgba(220,38,38,0.9)',  accentBg: 'rgba(220,38,38,0.07)',   accentBorder: 'rgba(220,38,38,0.2)',  tip: 'Stock = 0' },
                        ].map(({ label, value, accent, accentBg, accentBorder, tip }) => (
                            <div key={label} className="inv-glass" style={{ padding: '1.25rem', position: 'relative' }}>
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    background: accentBg, border: `1px solid ${accentBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '0.75rem',
                                }}>
                                    <svg width="16" height="16" fill="none" stroke={accent} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <p style={{ fontSize: '1.45rem', fontWeight: '600', color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
                                <p style={{ fontSize: '0.78rem', fontWeight: '500', color: '#2d1a08', marginTop: '0.25rem' }}>{label}</p>
                                {tip && <p style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.1rem' }}>{tip}</p>}
                            </div>
                        ))}
                    </div>

                    {/* ── Resumen por categoría ── */}
                    <div className="inv-glass inv-a2" style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.38)' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>Resumen por categoría</h2>
                            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.2rem' }}>
                                Distribución de unidades, costos y ganancias agrupadas
                            </p>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['Categoría', 'Productos', 'Unidades', 'Valor en venta', 'Costo compra', 'Ganancia potencial', 'Bajo stock', 'Agotados'].map(h => (
                                        <th key={h} style={{
                                            padding: '0.7rem 1.1rem', textAlign: 'left',
                                            fontSize: '0.67rem', fontWeight: '600',
                                            color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {catPaginadas.map(cat => (
                                    <tr key={cat.categoria} className="inv-table-row">
                                        <td style={{ padding: '0.85rem 1.1rem' }}>
                                            <p style={{ fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>{cat.categoria}</p>
                                            <div style={{ marginTop: '0.3rem', width: '80px', background: 'rgba(180,90,20,0.1)', borderRadius: '99px', height: '4px' }}>
                                                <div style={{ width: `${Math.min(100, (cat.total_stock / maxStock) * 100)}%`, height: '4px', borderRadius: '99px', background: 'rgba(245,158,11,0.7)' }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.85rem', color: 'rgba(120,60,10,0.7)' }}>{cat.total_productos}</td>
                                        <td style={{ padding: '0.85rem 1.1rem' }}>
                                            <span style={{ fontSize: '0.87rem', fontWeight: '700', color: '#2d1a08' }}>{cat.total_stock}</span>
                                            <span style={{ fontSize: '0.72rem', color: 'rgba(150,80,20,0.45)', marginLeft: '4px' }}>uds</span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(16,185,129,0.85)' }}>{fmt(cat.valor_venta)}</td>
                                        <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.85rem', color: 'rgba(59,130,246,0.8)' }}>
                                            {cat.valor_compra > 0 ? fmt(cat.valor_compra) : <span style={{ color: 'rgba(180,90,20,0.25)' }}>—</span>}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.87rem', fontWeight: '700', color: 'rgba(139,92,246,0.85)' }}>
                                            {cat.ganancia_potencial > 0 ? fmt(cat.ganancia_potencial) : <span style={{ color: 'rgba(180,90,20,0.25)' }}>—</span>}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.1rem', textAlign: 'center' }}>
                                            {cat.bajo_stock > 0
                                                ? <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.55rem', borderRadius: '20px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'rgba(146,64,14,0.9)' }}>{cat.bajo_stock}</span>
                                                : <span style={{ color: 'rgba(180,90,20,0.25)', fontSize: '0.78rem' }}>—</span>}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.1rem', textAlign: 'center' }}>
                                            {cat.agotados > 0
                                                ? <span style={{ fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.55rem', borderRadius: '20px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: 'rgba(185,28,28,0.85)' }}>{cat.agotados}</span>
                                                : <span style={{ color: 'rgba(180,90,20,0.25)', fontSize: '0.78rem' }}>—</span>}
                                        </td>
                                    </tr>
                                ))}
                                {porCategoria.length === 0 && (
                                    <tr><td colSpan="8" style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(150,80,20,0.4)', fontSize: '0.87rem' }}>No hay categorías registradas</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <Paginador pagina={paginaCat} total={porCategoria.length} porPagina={CAT_POR_PAG} onChange={setPaginaCat} />
                    </div>

                    {/* ── Tabla de productos ── */}
                    <div className="inv-glass inv-a3" style={{ overflow: 'hidden' }}>

                        {/* Tabs */}
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.38)' }}>
                            <div style={{ display: 'flex', gap: '4px', padding: '1rem 1.5rem 0' }}>
                                {[
                                    { key: 'criticos', label: 'Productos críticos', count: criticos.length, warn: criticos.length > 0 },
                                    { key: 'todos',    label: 'Todos los productos', count: productos.length },
                                ].map(({ key, label, count, warn }) => (
                                    <button key={key} className="inv-tab-btn"
                                            onClick={() => cambiarVista(key)}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '10px 10px 0 0',
                                                fontSize: '0.83rem', fontWeight: '500',
                                                background: vistaProductos === key ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.04)',
                                                color: vistaProductos === key ? 'rgba(185,28,28,0.9)' : 'rgba(120,60,10,0.65)',
                                                borderBottom: vistaProductos === key ? '2px solid rgba(220,38,38,0.5)' : '2px solid transparent',
                                            }}>
                                        {label}
                                        {count > 0 && (
                                            <span style={{
                                                marginLeft: '0.5rem', fontSize: '0.68rem', fontWeight: '700',
                                                padding: '0.1rem 0.45rem', borderRadius: '20px',
                                                background: warn ? 'rgba(245,158,11,0.15)' : 'rgba(180,90,20,0.1)',
                                                color: warn ? 'rgba(146,64,14,0.9)' : 'rgba(150,80,20,0.55)',
                                                border: warn ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(180,90,20,0.15)',
                                            }}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p style={{ padding: '0.4rem 1.5rem 0.85rem', fontSize: '0.76rem', color: 'rgba(150,80,20,0.5)' }}>
                                {vistaProductos === 'criticos'
                                    ? 'Productos con stock agotado o por debajo del mínimo. Requieren atención inmediata.'
                                    : 'Listado completo del inventario. Usa los filtros para encontrar productos específicos.'}
                            </p>
                        </div>

                        {/* Filtros — solo en "todos" */}
                        {vistaProductos === 'todos' && (
                            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.38)', background: 'rgba(255,255,255,0.03)' }}>
                                <div className="inv-filtros-row">
                                    {/* Buscador — ocupa toda la fila en móvil */}
                                    <div className="inv-search-wrap" style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
                                        <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,100,30,0.4)', pointerEvents: 'none' }}
                                             width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input type="text" placeholder="Buscar por nombre o categoría..."
                                               value={busqueda} onChange={e => cambiarBusqueda(e.target.value)}
                                               className="inv-search" style={{ width: '100%', boxSizing: 'border-box' }} />
                                        {busqueda && (
                                            <button onClick={() => cambiarBusqueda('')} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(150,80,20,0.5)', padding: 0 }}>
                                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdowns en fila */}
                                    <div className="inv-filtros-actions">
                                        <CategoriaDropdown value={filtroCat} onChange={cambiarCat} categorias={categorias} />
                                        <EstadoDropdown value={filtroEstado} onChange={cambiarEstado} />
                                        {hayFiltros && (
                                            <button
                                                onClick={() => { cambiarBusqueda(''); cambiarCat(''); cambiarEstado(''); }}
                                                className="inv-btn-limpiar"
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                    padding: '0.5rem 0.75rem',
                                                    fontSize: '0.78rem', fontWeight: '500',
                                                    background: 'none', border: '1px solid rgba(220,38,38,0.2)',
                                                    borderRadius: '10px', cursor: 'pointer',
                                                    color: 'rgba(185,28,28,0.7)', fontFamily: 'Inter, sans-serif',
                                                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                                                }}>
                                                <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {hayFiltros && (
                                    <p style={{ fontSize: '0.75rem', color: 'rgba(150,80,20,0.55)', marginTop: '0.5rem' }}>
                                        <strong style={{ color: '#2d1a08' }}>{productosFiltrados.length}</strong> de {productos.length} productos
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Tabla */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid rgba(180,90,20,0.12)' }}>
                                    {['Producto', 'Categoría', 'Stock actual', 'Stock mínimo', 'P. compra', 'P. venta', 'Margen', 'Estado'].map(h => (
                                        <th key={h} style={{
                                            padding: '0.7rem 1.1rem', textAlign: 'left',
                                            fontSize: '0.67rem', fontWeight: '600',
                                            color: 'rgba(150,80,20,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {prodPaginados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '3.5rem', textAlign: 'center' }}>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'rgba(150,80,20,0.55)', margin: 0 }}>
                                                {vistaProductos === 'criticos' ? 'No hay productos críticos' : 'Sin resultados'}
                                            </p>
                                            <p style={{ fontSize: '0.78rem', color: 'rgba(150,80,20,0.38)', marginTop: '0.3rem' }}>
                                                {vistaProductos === 'criticos' ? 'Todos los productos tienen stock suficiente' : 'Prueba ajustando los filtros'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : prodPaginados.map(p => {
                                    const margen = p.precio_compra > 0 ? p.precio - p.precio_compra : null;
                                    return (
                                        <tr key={p.id} className="inv-table-row"
                                            style={{ background: p.stock === 0 ? 'rgba(220,38,38,0.03)' : p.stock <= p.stock_minimo ? 'rgba(245,158,11,0.03)' : undefined }}>
                                            <td style={{ padding: '0.85rem 1.1rem' }}>
                                                <p style={{ fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08', margin: 0 }}>{p.nombre}</p>
                                                {p.codigo_barras && <p style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.45)', marginTop: '0.1rem' }}>{p.codigo_barras}</p>}
                                            </td>
                                            <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.82rem', color: 'rgba(120,60,10,0.65)' }}>{p.categoria}</td>
                                            <td style={{ padding: '0.85rem 1.1rem' }}>
                                                <span style={{ fontSize: '0.87rem', fontWeight: '700', color: '#2d1a08' }}>{p.stock}</span>
                                                <span style={{ fontSize: '0.68rem', color: 'rgba(150,80,20,0.4)', marginLeft: '3px' }}>uds</span>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.82rem', color: 'rgba(150,80,20,0.5)' }}>{p.stock_minimo} uds</td>
                                            <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.82rem', color: 'rgba(59,130,246,0.8)' }}>
                                                {p.precio_compra > 0 ? fmt(p.precio_compra) : <span style={{ color: 'rgba(180,90,20,0.25)', fontSize: '0.72rem' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.87rem', fontWeight: '600', color: '#2d1a08' }}>{fmt(p.precio)}</td>
                                            <td style={{ padding: '0.85rem 1.1rem', fontSize: '0.85rem' }}>
                                                {margen !== null
                                                    ? <span style={{ fontWeight: '700', color: margen >= 0 ? 'rgba(16,185,129,0.85)' : 'rgba(220,38,38,0.85)' }}>
                                                        {margen >= 0 ? '+' : ''}{fmt(margen)}
                                                      </span>
                                                    : <span style={{ color: 'rgba(180,90,20,0.25)' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '0.85rem 1.1rem' }}>
                                                <EstadoBadge stock={p.stock} minimo={p.stock_minimo} />
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                        <Paginador pagina={paginaProd} total={productosFiltrados.length} porPagina={PROD_POR_PAG} onChange={setPaginaProd} />
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
