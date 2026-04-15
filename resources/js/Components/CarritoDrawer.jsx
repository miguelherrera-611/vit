// resources/js/Components/CarritoDrawer.jsx
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const imgSrc = (imagen) => {
    if (!imagen) return null;
    if (imagen.startsWith('http')) return imagen;
    return `/storage/${imagen}`;
};

const PER_PAGE = 4;

export default function CarritoDrawer({ open, onClose, carrito, setCarrito, auth }) {
    const [pagina, setPagina] = useState(1);

    const total         = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const totalItems    = carrito.reduce((sum, i) => sum + i.cantidad, 0);
    const totalPags     = Math.ceil(carrito.length / PER_PAGE) || 1;
    const itemsVisibles = carrito.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    const match = (i, id, talla) => i.id === id && (i.talla ?? null) === (talla ?? null);

    const cambiarCantidad = (id, talla, delta) => {
        setCarrito(prev => prev.map(i =>
            !match(i, id, talla) ? i : { ...i, cantidad: Math.max(1, Math.min(i.stock, i.cantidad + delta)) }
        ));
    };

    const eliminar = (id, talla) => {
        setCarrito(prev => {
            const nuevo = prev.filter(i => !match(i, id, talla));
            const np    = Math.ceil(nuevo.length / PER_PAGE) || 1;
            if (pagina > np) setPagina(np);
            return nuevo;
        });
    };

    const irAlCheckout = () => {
        if (!auth?.user) {
            sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
            router.visit('/login');
            return;
        }
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
        router.visit('/cliente/checkout');
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <style>{`
                @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes dropDown { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

                .c-overlay {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(20,8,0,0.18);
                    backdrop-filter: blur(3px);
                    animation: fadeIn 0.16s ease;
                }

                /* Ventana flotante — siempre en la esquina superior derecha */
                .c-modal {
                    position: fixed;
                    top: 64px;   /* justo debajo del nav */
                    right: 1rem;
                    z-index: 201;
                    background: rgba(253,248,244,0.98);
                    border: 1px solid rgba(200,140,80,0.16);
                    border-radius: 16px;
                    box-shadow: 0 16px 48px rgba(180,90,20,0.14), 0 4px 12px rgba(180,90,20,0.08);
                    width: 360px;
                    max-width: calc(100vw - 1.5rem);
                    max-height: calc(100vh - 80px);
                    display: flex; flex-direction: column;
                    overflow: hidden;
                    font-family: 'Inter',-apple-system,sans-serif;
                    animation: dropDown 0.22s cubic-bezier(0.16,1,0.3,1);
                }

                .c-header {
                    padding: 0.875rem 1.1rem 0.75rem;
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: space-between;
                    flex-shrink: 0;
                }
                .c-close {
                    width: 28px; height: 28px; border-radius: 6px;
                    background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: rgba(185,28,28,0.65); transition: all 0.15s;
                }
                .c-close:hover { background: rgba(220,38,38,0.14); border-color: rgba(220,38,38,0.4); color: rgba(185,28,28,0.95); }

                .c-list {
                    flex: 1; overflow-y: auto;
                    padding: 0.2rem 1.1rem;
                    min-height: 0;
                }
                .c-list::-webkit-scrollbar { width: 3px; }
                .c-list::-webkit-scrollbar-thumb { background: rgba(200,140,80,0.2); border-radius: 3px; }

                .c-item {
                    display: flex; gap: 0.6rem;
                    padding: 0.6rem 0;
                    border-bottom: 1px solid rgba(200,140,80,0.07);
                    align-items: flex-start;
                }
                .c-item:last-child { border-bottom: none; }

                .c-img {
                    width: 50px; height: 50px; border-radius: 7px; object-fit: cover;
                    flex-shrink: 0; border: 1px solid rgba(200,140,80,0.1);
                }
                .c-placeholder {
                    width: 50px; height: 50px; border-radius: 7px; flex-shrink: 0;
                    background: rgba(200,140,80,0.05); border: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: center;
                    color: rgba(150,80,20,0.25);
                }
                .c-qty-btn {
                    width: 20px; height: 20px; border-radius: 5px; cursor: pointer;
                    background: rgba(200,140,80,0.07); border: 1px solid rgba(200,140,80,0.15);
                    display: flex; align-items: center; justify-content: center;
                    color: rgba(120,60,10,0.7); font-size: 0.76rem;
                    transition: background 0.1s; font-family: inherit; flex-shrink: 0;
                }
                .c-qty-btn:hover { background: rgba(200,140,80,0.14); }
                .c-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                .c-rm {
                    background: rgba(220,38,38,0.07); border: 1px solid rgba(220,38,38,0.2);
                    cursor: pointer; padding: 0.3rem; border-radius: 6px;
                    color: rgba(185,28,28,0.65); transition: all 0.15s; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                }
                .c-rm:hover { background: rgba(220,38,38,0.14); border-color: rgba(220,38,38,0.4); color: rgba(185,28,28,0.95); }

                .c-pag {
                    display: flex; align-items: center; justify-content: center; gap: 0.25rem;
                    padding: 0.4rem 1.1rem;
                    border-top: 1px solid rgba(200,140,80,0.08);
                    flex-shrink: 0;
                }
                .c-pb {
                    width: 24px; height: 24px; border-radius: 5px; cursor: pointer;
                    border: 1px solid rgba(200,140,80,0.15); background: rgba(255,255,255,0.45);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.7rem; font-weight: 500; color: rgba(120,60,10,0.6);
                    transition: all 0.1s; font-family: inherit;
                }
                .c-pb:hover:not(:disabled) { background: rgba(255,255,255,0.75); }
                .c-pb:disabled { opacity: 0.3; cursor: not-allowed; }
                .c-pb.on { background: rgba(185,28,28,0.07); border-color: rgba(185,28,28,0.2); color: rgba(185,28,28,0.85); font-weight: 600; }

                .c-footer {
                    padding: 0.7rem 1.1rem 0.9rem;
                    border-top: 1px solid rgba(200,140,80,0.1);
                    flex-shrink: 0;
                }
                .c-total-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 0.45rem 0; margin-bottom: 0.55rem;
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                }
                .c-checkout {
                    width: 100%; padding: 0.72rem; border-radius: 9px;
                    font-family: inherit; font-size: 0.83rem; font-weight: 500;
                    cursor: pointer; transition: all 0.13s;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); letter-spacing: -0.01em;
                }
                .c-checkout:hover { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }

                /* Móvil: ajustar posición para que siga desde arriba */
                @media (max-width: 500px) {
                    .c-modal {
                        top: 60px;
                        right: 0.75rem;
                        left: 0.75rem;
                        width: auto;
                        max-width: 100%;
                        max-height: calc(100vh - 72px);
                        border-radius: 14px;
                    }
                }
            `}</style>

            {/* Overlay — cierra al clic fuera */}
            <div className="c-overlay" onClick={onClose}/>

            {/* Ventana */}
            <div className="c-modal">

                {/* Header */}
                <div className="c-header">
                    <div>
                        <p style={{fontSize:'0.84rem',fontWeight:'500',color:'#2d1a08',margin:0,letterSpacing:'-0.02em'}}>Carrito</p>
                        <p style={{fontSize:'0.69rem',color:'rgba(150,80,20,0.48)',margin:'0.05rem 0 0'}}>
                            {totalItems} {totalItems===1?'artículo':'artículos'}
                            {carrito.length > PER_PAGE && ` · pág. ${pagina}/${totalPags}`}
                        </p>
                    </div>
                    <button className="c-close" onClick={onClose} title="Cerrar carrito">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Lista */}
                <div className="c-list">
                    {carrito.length === 0 ? (
                        <div style={{textAlign:'center',padding:'1.75rem 0'}}>
                            <div style={{width:'36px',height:'36px',margin:'0 auto 0.75rem',borderRadius:'9px',
                                background:'rgba(200,140,80,0.06)',border:'1px solid rgba(200,140,80,0.12)',
                                display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                                </svg>
                            </div>
                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.42)',marginBottom:'0.75rem'}}>Tu carrito está vacío</p>
                            <button onClick={onClose} style={{
                                padding:'0.42rem 0.85rem',borderRadius:'7px',
                                border:'1px solid rgba(185,28,28,0.18)',background:'rgba(185,28,28,0.05)',
                                color:'rgba(185,28,28,0.75)',fontSize:'0.74rem',fontWeight:'500',
                                cursor:'pointer',fontFamily:'inherit',
                            }}>
                                Seguir comprando
                            </button>
                        </div>
                    ) : itemsVisibles.map(item => (
                        <div key={`${item.id}-${item.talla ?? 'sin'}`} className="c-item">
                            {imgSrc(item.imagen)
                                ? <img src={imgSrc(item.imagen)} alt={item.nombre} className="c-img"/>
                                : <div className="c-placeholder">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <rect x="3" y="3" width="18" height="18" rx="3"/><path strokeLinecap="round" d="M3 9h18"/>
                                    </svg>
                                </div>
                            }
                            <div style={{flex:1,minWidth:0}}>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.18rem'}}>
                                    <h4 style={{fontSize:'0.78rem',fontWeight:'500',color:'#2d1a08',margin:0,
                                        overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                                        maxWidth:'170px',letterSpacing:'-0.01em'}}>
                                        {item.nombre}
                                    </h4>
                                    <button className="c-rm" onClick={() => eliminar(item.id, item.talla)} title="Quitar producto">
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Talla — solo si el producto la tiene */}
                                {item.talla && (
                                    <span style={{
                                        display:'inline-block', marginBottom:'0.28rem',
                                        padding:'0.1rem 0.42rem', borderRadius:'5px',
                                        fontSize:'0.62rem', fontWeight:'600', letterSpacing:'0.03em',
                                        background:'rgba(185,28,28,0.07)', border:'1px solid rgba(185,28,28,0.18)',
                                        color:'rgba(185,28,28,0.8)',
                                    }}>
                                        Talla {item.talla}
                                    </span>
                                )}

                                <p style={{fontSize:'0.84rem',fontWeight:'600',color:'#2d1a08',margin:'0 0 0.35rem',letterSpacing:'-0.02em'}}>
                                    {formatCOP(item.precio * item.cantidad)}
                                </p>
                                <div style={{display:'flex',alignItems:'center',gap:'0.32rem'}}>
                                    <button className="c-qty-btn" onClick={()=>cambiarCantidad(item.id,item.talla,-1)} disabled={item.cantidad<=1}>−</button>
                                    <span style={{fontSize:'0.75rem',fontWeight:'500',color:'rgba(120,55,10,0.8)',minWidth:'14px',textAlign:'center'}}>
                                        {item.cantidad}
                                    </span>
                                    <button className="c-qty-btn" onClick={()=>cambiarCantidad(item.id,item.talla,+1)} disabled={item.cantidad>=item.stock}>+</button>
                                    <span style={{fontSize:'0.66rem',color:'rgba(150,80,20,0.38)',marginLeft:'0.1rem'}}>
                                        {formatCOP(item.precio)} c/u
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginación */}
                {carrito.length > PER_PAGE && (
                    <div className="c-pag">
                        <button className="c-pb" onClick={()=>setPagina(p=>p-1)} disabled={pagina===1}>
                            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        {Array.from({length:totalPags},(_,i)=>i+1).map(p=>(
                            <button key={p} className={`c-pb${p===pagina?' on':''}`} onClick={()=>setPagina(p)}>{p}</button>
                        ))}
                        <button className="c-pb" onClick={()=>setPagina(p=>p+1)} disabled={pagina===totalPags}>
                            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                )}

                {/* Footer */}
                {carrito.length > 0 && (
                    <div className="c-footer">
                        <div className="c-total-row">
                            <span style={{fontSize:'0.78rem',color:'rgba(120,60,10,0.6)'}}>Total</span>
                            <span style={{fontSize:'1.1rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.03em'}}>
                                {formatCOP(total)}
                            </span>
                        </div>
                        <p style={{fontSize:'0.68rem',color:'rgba(150,80,20,0.4)',textAlign:'center',marginBottom:'0.55rem',lineHeight:'1.5'}}>
                            Envío a todo Colombia · Pago por transferencia
                        </p>
                        <button className="c-checkout" onClick={irAlCheckout}>
                            {auth?.user ? 'Proceder al pago' : 'Iniciar sesión para comprar'}
                        </button>
                        {!auth?.user && (
                            <p style={{fontSize:'0.68rem',color:'rgba(150,80,20,0.4)',textAlign:'center',marginTop:'0.42rem'}}>
                                ¿Sin cuenta?{' '}
                                <Link href="/registro" style={{color:'rgba(185,28,28,0.65)',fontWeight:'500',textDecoration:'none'}}>
                                    Crear una gratis
                                </Link>
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
