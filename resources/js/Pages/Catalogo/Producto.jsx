// resources/js/Pages/Catalogo/Producto.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function CatalogoProducto({ producto }) {
    const { auth } = usePage().props;
    const [cantidad,       setCantidad]       = useState(1);
    const [agregado,       setAgregado]       = useState(false);
    const [esMovil,        setEsMovil]        = useState(false);
    const [modalFoto,      setModalFoto]      = useState(false);

    const fotos = [...(producto.imagen ? [producto.imagen] : []), ...(producto.fotos || [])];
    const [fotoIdx, setFotoIdx] = useState(0);

    /* Detectar ancho real */
    useEffect(() => {
        const check = () => setEsMovil(window.innerWidth < 680);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    /* Teclado en modal */
    useEffect(() => {
        if (!modalFoto) return;
        const h = (e) => {
            if (e.key === 'Escape')     setModalFoto(false);
            if (e.key === 'ArrowLeft')  setFotoIdx(i => (i - 1 + fotos.length) % fotos.length);
            if (e.key === 'ArrowRight') setFotoIdx(i => (i + 1) % fotos.length);
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [modalFoto, fotos.length]);

    const agregar = () => {
        if (!producto.disponible) return;
        // Sin sesión: disparar modal de auth en el layout
        if (!auth?.user) {
            window.dispatchEvent(new CustomEvent('vitali:carrito-actualizado', { detail: { abrir: false, sinSesion: true } }));
            return;
        }
        // Leer carrito actual del sessionStorage (con clave por usuario)
        const key = `vitali_carrito_${auth.user.id}`;
        let carrito = [];
        try { carrito = JSON.parse(sessionStorage.getItem(key) || '[]'); } catch {}
        const ex = carrito.find(i => i.id === producto.id);
        if (ex) {
            carrito = carrito.map(i => i.id === producto.id
                ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) } : i);
        } else {
            carrito = [...carrito, { id: producto.id, nombre: producto.nombre, precio: producto.precio,
                imagen: producto.imagen, cantidad, stock: producto.stock }];
        }
        sessionStorage.setItem(key, JSON.stringify(carrito));
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
        // Notificar al layout para que actualice su estado y abra el drawer
        window.dispatchEvent(new CustomEvent('vitali:carrito-actualizado', { detail: { abrir: true } }));
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2000);
    };

    const prev = () => setFotoIdx(i => (i - 1 + fotos.length) % fotos.length);
    const next = () => setFotoIdx(i => (i + 1) % fotos.length);

    /* ── Estilos base compartidos ── */
    const navBtn = {
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'rgba(253,248,244,0.9)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)', color: 'rgba(120,60,10,0.75)', zIndex: 2,
    };
    const qtyBtn = {
        width: '30px', height: '30px', borderRadius: '7px', cursor: 'pointer',
        background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(200,140,80,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(120,60,10,0.75)', fontSize: '0.9rem', fontFamily: 'inherit',
    };
    const chip = {
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.42rem 0.6rem', borderRadius: '8px',
        background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(200,140,80,0.1)',
    };

    return (
        <ClienteLayout>
            <Head title={`${producto.nombre} — VitaliStore`} />

            {/* Reset de box-sizing global para esta página */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                @keyframes checkIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
                .pv-thumb { width:46px;height:46px;border-radius:7px;object-fit:cover;cursor:pointer;border:1.5px solid transparent;transition:border-color 0.13s;flex-shrink:0; }
                .pv-thumb:hover { border-color: rgba(200,140,80,0.45); }
                .pv-thumb.on   { border-color: rgba(185,28,28,0.5); }
            `}</style>

            {/* ── PÁGINA COMPLETA: padding simétrico y max-width centrado ── */}
            <div style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: esMovil ? '1rem 0.75rem 3rem' : '1.75rem 1.5rem 3rem',
                fontFamily: "'Inter', -apple-system, sans-serif",
            }}>
                {/* Contenedor centrado */}
                <div style={{ maxWidth: '920px', margin: '0 auto' }}>

                    {/* Breadcrumb */}
                    <div style={{ display:'flex', alignItems:'center', gap:'0.2rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                        <Link href="/catalogo" style={{ fontSize:'0.72rem', color:'rgba(150,80,20,0.55)', textDecoration:'none' }}>
                            Catálogo
                        </Link>
                        <span style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.28)' }}>›</span>
                        <span style={{ fontSize:'0.72rem', color:'rgba(120,55,10,0.6)' }}>{producto.categoria}</span>
                        <span style={{ fontSize:'0.68rem', color:'rgba(150,80,20,0.28)' }}>›</span>
                        <span style={{ fontSize:'0.72rem', fontWeight:'500', color:'rgba(120,55,10,0.78)',
                            maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {producto.nombre}
                        </span>
                    </div>

                    {/* ── TARJETA ──
                        Móvil  (esMovil): columna única  — foto arriba, info abajo
                        Desktop:          dos columnas   — foto | info
                    */}
                    <div style={{
                        display: 'flex',
                        flexDirection: esMovil ? 'column' : 'row',
                        background: 'rgba(255,255,255,0.48)',
                        border: '1px solid rgba(200,140,80,0.12)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>

                        {/* ── COLUMNA FOTO ── */}
                        <div style={{
                            width: esMovil ? '100%' : '50%',
                            flexShrink: 0,
                            borderBottom: esMovil ? '1px solid rgba(200,140,80,0.08)' : 'none',
                            borderRight:  esMovil ? 'none' : '1px solid rgba(200,140,80,0.08)',
                            boxSizing: 'border-box',
                        }}>
                            {/* Foto principal con aspect-ratio 1:1 vía padding-top trick */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: '100%',   /* cuadrada, siempre proporcional */
                                overflow: 'hidden',
                                cursor: fotos.length ? 'zoom-in' : 'default',
                                background: 'rgba(200,140,80,0.04)',
                            }} onClick={() => fotos.length && setModalFoto(true)}>

                                {fotos.length > 0 ? (
                                    <img
                                        src={fotos[fotoIdx]}
                                        alt={producto.nombre}
                                        style={{
                                            position: 'absolute', inset: 0,
                                            width: '100%', height: '100%',
                                            objectFit: 'cover', display: 'block',
                                        }}
                                    />
                                ) : (
                                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <svg width="32" height="32" fill="none" stroke="rgba(150,80,20,0.15)" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                )}

                                {/* Overlay agotado */}
                                {!producto.disponible && fotos.length > 0 && (
                                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.18)', backdropFilter:'blur(2px)',
                                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                                        <span style={{ padding:'0.28rem 0.9rem', background:'rgba(0,0,0,0.42)',
                                            borderRadius:'20px', fontSize:'0.74rem', fontWeight:'500', color:'white' }}>
                                            Agotado
                                        </span>
                                    </div>
                                )}

                                {/* Botones anterior / siguiente */}
                                {fotos.length > 1 && (
                                    <>
                                        <button style={{ ...navBtn, left: '8px' }} onClick={e => { e.stopPropagation(); prev(); }}>
                                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                                        </button>
                                        <button style={{ ...navBtn, right: '8px' }} onClick={e => { e.stopPropagation(); next(); }}>
                                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                        </button>
                                        {/* Dots */}
                                        <div style={{ position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)',
                                            display:'flex', gap:'4px', zIndex:2 }}>
                                            {fotos.map((_, i) => (
                                                <div key={i}
                                                     onClick={e => { e.stopPropagation(); setFotoIdx(i); }}
                                                     style={{ height:'5px', borderRadius:'3px', cursor:'pointer',
                                                         background: i === fotoIdx ? 'white' : 'rgba(255,255,255,0.5)',
                                                         width: i === fotoIdx ? '14px' : '5px', transition:'all 0.2s' }}/>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {fotos.length > 1 && (
                                <div style={{ display:'flex', gap:'0.32rem', padding:'0.5rem',
                                    overflowX:'auto', background:'rgba(255,255,255,0.2)',
                                    borderTop:'1px solid rgba(200,140,80,0.08)' }}>
                                    {fotos.map((f, i) => (
                                        <img key={i} src={f} alt={`foto ${i+1}`}
                                             className={`pv-thumb${i === fotoIdx ? ' on' : ''}`}
                                             onClick={() => setFotoIdx(i)}/>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── COLUMNA INFO ── */}
                        <div style={{
                            flex: 1,
                            padding: esMovil ? '1.25rem' : '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.875rem',
                            boxSizing: 'border-box',
                            minWidth: 0,
                        }}>

                            {/* Categoría + Nombre */}
                            <div>
                                <p style={{ fontSize:'0.64rem', fontWeight:'500', color:'rgba(150,80,20,0.42)',
                                    letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.4rem', margin:0 }}>
                                    {producto.categoria}
                                </p>
                                <h1 style={{ fontSize: esMovil ? '1.35rem' : '1.65rem', fontWeight:'300', color:'#2d1a08',
                                    letterSpacing:'-0.04em', lineHeight:'1.2', margin:'0.35rem 0 0' }}>
                                    {producto.nombre}
                                </h1>
                            </div>

                            {/* Precio */}
                            <p style={{ fontSize: esMovil ? '1.5rem' : '1.85rem', fontWeight:'600', color:'#2d1a08',
                                letterSpacing:'-0.03em', margin:0 }}>
                                {formatCOP(producto.precio)}
                            </p>

                            {/* Badge disponibilidad */}
                            <div style={{
                                display:'inline-flex', alignItems:'center', gap:'0.3rem',
                                padding:'0.24rem 0.62rem', borderRadius:'20px', width:'fit-content',
                                background: producto.disponible ? 'rgba(16,185,129,0.07)' : 'rgba(200,140,80,0.07)',
                                border: producto.disponible ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(200,140,80,0.18)',
                            }}>
                                <div style={{ width:'5px', height:'5px', borderRadius:'50%', flexShrink:0,
                                    background: producto.disponible ? 'rgba(16,185,129,0.8)' : 'rgba(200,140,80,0.6)' }}/>
                                <span style={{ fontSize:'0.7rem', fontWeight:'500', letterSpacing:'-0.01em',
                                    color: producto.disponible ? 'rgba(4,120,87,0.8)' : 'rgba(150,80,20,0.6)' }}>
                                    {producto.disponible ? `${producto.stock} disponibles` : 'Sin stock'}
                                </span>
                            </div>

                            {/* Descripción */}
                            {producto.descripcion && (
                                <div style={{ padding:'0.75rem', borderRadius:'9px',
                                    background:'rgba(255,255,255,0.4)', border:'1px solid rgba(200,140,80,0.1)' }}>
                                    <p style={{ fontSize:'0.78rem', color:'rgba(120,60,10,0.7)', lineHeight:'1.7', margin:0 }}>
                                        {producto.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Cantidad */}
                            {producto.disponible && (
                                <div>
                                    <label style={{ display:'block', fontSize:'0.64rem', fontWeight:'500',
                                        color:'rgba(150,80,20,0.44)', textTransform:'uppercase',
                                        letterSpacing:'0.07em', marginBottom:'0.4rem' }}>
                                        Cantidad
                                    </label>
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                                        <button style={qtyBtn} onClick={() => setCantidad(c => Math.max(1, c-1))} disabled={cantidad <= 1}>−</button>
                                        <span style={{ minWidth:'24px', textAlign:'center', fontSize:'0.84rem', fontWeight:'500', color:'#2d1a08' }}>
                                            {cantidad}
                                        </span>
                                        <button style={qtyBtn} onClick={() => setCantidad(c => Math.min(producto.stock, c+1))} disabled={cantidad >= producto.stock}>+</button>
                                    </div>
                                </div>
                            )}

                            {/* Botón agregar */}
                            <button
                                onClick={agregar}
                                disabled={!producto.disponible}
                                style={{
                                    width:'100%', padding:'0.82rem', borderRadius:'10px',
                                    fontFamily:'inherit', fontSize:'0.84rem', fontWeight:'500',
                                    cursor: producto.disponible ? 'pointer' : 'not-allowed',
                                    transition:'all 0.15s', letterSpacing:'-0.01em',
                                    display:'flex', alignItems:'center', justifyContent:'center', gap:'0.38rem',
                                    border: 'none',
                                    ...(agregado
                                            ? { background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.22)', color:'rgba(4,120,87,0.9)' }
                                            : producto.disponible
                                                ? { background:'rgba(185,28,28,0.08)', border:'1px solid rgba(185,28,28,0.22)', color:'rgba(185,28,28,0.9)' }
                                                : { background:'rgba(200,140,80,0.04)', border:'1px solid rgba(200,140,80,0.12)', color:'rgba(150,80,20,0.3)' }
                                    ),
                                }}
                            >
                                {agregado ? (
                                    <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{animation:'checkIn 0.3s ease'}}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Agregado al carrito</>
                                ) : producto.disponible ? (
                                    <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>Agregar al carrito</>
                                ) : 'Producto agotado'}
                            </button>

                            {/* Chips — siempre en columna, sin grid */}
                            <div style={{ display:'flex', flexDirection:'column', gap:'0.3rem' }}>
                                {[
                                    { label:'Envío a todo Colombia',   svg:<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg> },
                                    { label:'Pago por transferencia',  svg:<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M2 10h20"/></svg> },
                                    { label:'Comprobante requerido',   svg:<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
                                    { label:'Seguimiento de pedido',   svg:<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
                                ].map((item, i) => (
                                    <div key={i} style={chip}>
                                        <span style={{ color:'rgba(150,80,20,0.4)', flexShrink:0 }}>{item.svg}</span>
                                        <span style={{ fontSize:'0.66rem', color:'rgba(150,80,20,0.55)', lineHeight:'1.3', letterSpacing:'-0.01em' }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal foto ampliada */}
            {modalFoto && (
                <div
                    onClick={() => setModalFoto(false)}
                    style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.88)',
                        backdropFilter:'blur(10px)', display:'flex', alignItems:'center',
                        justifyContent:'center', animation:'fadeIn 0.16s both', cursor:'zoom-out', padding:'1rem' }}
                >
                    {fotos.length > 1 && (
                        <>
                            <button onClick={e=>{e.stopPropagation();prev();}} style={{ position:'fixed',top:'50%',transform:'translateY(-50%)',left:'10px',
                                width:'38px',height:'38px',borderRadius:'50%',border:'none',cursor:'pointer',
                                background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',zIndex:301 }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button onClick={e=>{e.stopPropagation();next();}} style={{ position:'fixed',top:'50%',transform:'translateY(-50%)',right:'10px',
                                width:'38px',height:'38px',borderRadius:'50%',border:'none',cursor:'pointer',
                                background:'rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',zIndex:301 }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </>
                    )}
                    <img src={fotos[fotoIdx]} alt={producto.nombre} onClick={e=>e.stopPropagation()}
                         style={{ maxWidth:'92vw', maxHeight:'90vh', borderRadius:'12px', objectFit:'contain' }}/>
                    <div style={{ position:'fixed',top:'12px',right:'12px',color:'rgba(255,255,255,0.4)',fontSize:'0.7rem' }}>
                        {fotoIdx+1}/{fotos.length} · ESC para cerrar
                    </div>
                </div>
            )}

        </ClienteLayout>
    );
}
