// resources/js/Components/CarritoDrawer.jsx
import { Link, router } from '@inertiajs/react';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

// ✅ Helper seguro: evita doble prefijo si la imagen ya es URL completa
const imgSrc = (imagen) => {
    if (!imagen) return null;
    if (imagen.startsWith('http')) return imagen;
    return `/storage/${imagen}`;
};

export default function CarritoDrawer({ open, onClose, carrito, setCarrito, auth }) {

    const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

    const cambiarCantidad = (id, delta) => {
        setCarrito(prev => prev.map(i => {
            if (i.id !== id) return i;
            const nueva = Math.max(1, Math.min(i.stock, i.cantidad + delta));
            return { ...i, cantidad: nueva };
        }));
    };

    const eliminar = (id) => {
        setCarrito(prev => prev.filter(i => i.id !== id));
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

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from { transform:translateX(100%); opacity:0; }
                    to   { transform:translateX(0); opacity:1; }
                }
                @keyframes fadeOverlay {
                    from { opacity:0; }
                    to   { opacity:1; }
                }

                .carrito-overlay {
                    position:fixed; inset:0; z-index:200;
                    background:rgba(30,10,0,0.3);
                    backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
                    animation:fadeOverlay 0.2s ease both;
                }
                .carrito-drawer {
                    position:fixed; top:0; right:0; bottom:0; z-index:201;
                    width:min(440px,100vw);
                    background:rgba(255,250,245,0.95);
                    backdrop-filter:blur(40px) saturate(180%); -webkit-backdrop-filter:blur(40px) saturate(180%);
                    border-left:1px solid rgba(255,255,255,0.72);
                    box-shadow:-16px 0 48px rgba(180,90,20,0.12), inset 1px 0 0 rgba(255,255,255,0.9);
                    display:flex; flex-direction:column;
                    animation:slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both;
                    font-family:'Inter',-apple-system,sans-serif;
                }

                .drawer-header {
                    padding:1.5rem 1.5rem 1.25rem;
                    border-bottom:1px solid rgba(200,140,80,0.12);
                    display:flex; align-items:center; justify-content:space-between;
                }
                .drawer-close {
                    width:34px; height:34px; border-radius:10px; border:none; cursor:pointer;
                    background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.25);
                    display:flex; align-items:center; justify-content:center;
                    color:rgba(120,60,10,0.6); transition:all 0.15s;
                }
                .drawer-close:hover { background:rgba(255,255,255,0.25); color:rgba(90,40,5,0.9); }

                .drawer-items { flex:1; overflow-y:auto; padding:1rem 1.5rem; }
                .drawer-items::-webkit-scrollbar { width:4px; }
                .drawer-items::-webkit-scrollbar-track { background:transparent; }
                .drawer-items::-webkit-scrollbar-thumb { background:rgba(200,140,80,0.3); border-radius:4px; }

                .item-card {
                    display:flex; gap:0.875rem; padding:0.875rem;
                    background:rgba(255,255,255,0.06);
                    border:1px solid rgba(255,255,255,0.65);
                    border-radius:18px; margin-bottom:0.75rem;
                    box-shadow:0 4px 14px rgba(180,90,20,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
                }
                .item-img {
                    width:72px; height:72px; border-radius:12px;
                    object-fit:cover; flex-shrink:0;
                    background:rgba(255,255,255,0.1);
                }
                .item-placeholder {
                    width:72px; height:72px; border-radius:12px; flex-shrink:0;
                    background:rgba(255,255,255,0.08); border:1px solid rgba(200,140,80,0.15);
                    display:flex; align-items:center; justify-content:center; font-size:1.6rem;
                }

                .qty-mini-btn {
                    width:26px; height:26px; border-radius:8px; border:none; cursor:pointer;
                    background:rgba(255,255,255,0.15); border:1px solid rgba(200,140,80,0.25);
                    display:flex; align-items:center; justify-content:center;
                    color:rgba(120,60,10,0.75); font-size:0.9rem; font-weight:600;
                    transition:all 0.15s; font-family:'Inter',sans-serif;
                }
                .qty-mini-btn:hover { background:rgba(255,255,255,0.3); }

                .btn-eliminar {
                    background:none; border:none; cursor:pointer; padding:0.25rem;
                    color:rgba(150,80,20,0.35); transition:color 0.15s; border-radius:6px;
                }
                .btn-eliminar:hover { color:rgba(185,28,28,0.7); background:rgba(220,38,38,0.06); }

                .drawer-footer {
                    padding:1.25rem 1.5rem 1.5rem;
                    border-top:1px solid rgba(200,140,80,0.12);
                    background:rgba(255,255,255,0.04);
                }

                .btn-checkout {
                    width:100%; padding:0.95rem; border-radius:16px;
                    font-family:'Inter',sans-serif; font-size:0.95rem; font-weight:600;
                    cursor:pointer; transition:all 0.25s ease;
                    position:relative; overflow:hidden; border:none;
                    background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.38);
                    color:rgba(185,28,28,0.95);
                    box-shadow:0 8px 24px rgba(220,38,38,0.12),inset 0 1.5px 0 rgba(255,120,120,0.3);
                }
                .btn-checkout::after {
                    content:''; position:absolute; top:0; left:-120%; width:80%; height:100%;
                    background:linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.18) 50%,transparent 80%);
                    transition:left 0.55s ease; pointer-events:none;
                }
                .btn-checkout:hover::after { left:130%; }
                .btn-checkout:hover {
                    transform:translateY(-2px); background:rgba(220,38,38,0.15);
                    box-shadow:0 14px 36px rgba(220,38,38,0.16);
                }
                .btn-checkout:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
            `}</style>

            {!open ? null : (
                <>
                    <div className="carrito-overlay" onClick={onClose} />
                    <div className="carrito-drawer">

                        {/* Header */}
                        <div className="drawer-header">
                            <div>
                                <h2 style={{fontSize:'1.05rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em',margin:0}}>
                                    Carrito
                                </h2>
                                <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.55)',margin:'0.15rem 0 0'}}>
                                    {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
                                </p>
                            </div>
                            <button className="drawer-close" onClick={onClose}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="drawer-items">
                            {carrito.length === 0 ? (
                                <div style={{textAlign:'center',paddingTop:'3rem'}}>
                                    <div style={{fontSize:'3.5rem',marginBottom:'1rem'}}>🛒</div>
                                    <p style={{fontSize:'0.9rem',color:'rgba(150,80,20,0.55)',marginBottom:'1.5rem'}}>Tu carrito está vacío</p>
                                    <button onClick={onClose} style={{
                                        padding:'0.6rem 1.25rem',borderRadius:'12px',border:'1px solid rgba(220,38,38,0.3)',
                                        background:'rgba(220,38,38,0.07)',color:'rgba(185,28,28,0.85)',
                                        fontSize:'0.85rem',fontWeight:'500',cursor:'pointer',fontFamily:'Inter,sans-serif',
                                    }}>
                                        Seguir comprando
                                    </button>
                                </div>
                            ) : carrito.map(item => (
                                <div key={item.id} className="item-card">
                                    {/* ✅ imgSrc maneja tanto rutas relativas como URLs completas */}
                                    {imgSrc(item.imagen)
                                        ? <img src={imgSrc(item.imagen)} alt={item.nombre} className="item-img" />
                                        : <div className="item-placeholder">👔</div>
                                    }
                                    <div style={{flex:1,minWidth:0}}>
                                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.25rem'}}>
                                            <h4 style={{fontSize:'0.875rem',fontWeight:'600',color:'#2d1a08',margin:0,letterSpacing:'-0.01em',
                                                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'200px'}}>
                                                {item.nombre}
                                            </h4>
                                            <button className="btn-eliminar" onClick={() => eliminar(item.id)}>
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>

                                        <p style={{fontSize:'0.92rem',fontWeight:'700',color:'#2d1a08',margin:'0 0 0.6rem',letterSpacing:'-0.02em'}}>
                                            {formatCOP(item.precio * item.cantidad)}
                                        </p>

                                        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                            <button className="qty-mini-btn" onClick={() => cambiarCantidad(item.id, -1)} disabled={item.cantidad <= 1}>−</button>
                                            <span style={{fontSize:'0.85rem',fontWeight:'600',color:'rgba(120,55,10,0.85)',minWidth:'20px',textAlign:'center'}}>
                                                {item.cantidad}
                                            </span>
                                            <button className="qty-mini-btn" onClick={() => cambiarCantidad(item.id, +1)} disabled={item.cantidad >= item.stock}>+</button>
                                            <span style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.45)',marginLeft:'0.25rem'}}>
                                                {formatCOP(item.precio)} c/u
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        {carrito.length > 0 && (
                            <div className="drawer-footer">
                                {/* Subtotal */}
                                <div style={{
                                    display:'flex',justifyContent:'space-between',alignItems:'center',
                                    padding:'0.875rem 1rem',borderRadius:'14px',marginBottom:'1rem',
                                    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(200,140,80,0.12)',
                                }}>
                                    <span style={{fontSize:'0.88rem',color:'rgba(120,60,10,0.7)',fontWeight:'500'}}>Total</span>
                                    <span style={{fontSize:'1.25rem',fontWeight:'700',color:'#2d1a08',letterSpacing:'-0.03em'}}>
                                        {formatCOP(total)}
                                    </span>
                                </div>

                                {/* Nota de envío */}
                                <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.5)',textAlign:'center',marginBottom:'0.875rem',lineHeight:'1.5'}}>
                                    🚚 Envío a todo Colombia · Pago por transferencia bancaria
                                </p>

                                <button className="btn-checkout" onClick={irAlCheckout}>
                                    {auth?.user ? 'Proceder al pago →' : 'Iniciar sesión para comprar →'}
                                </button>

                                {!auth?.user && (
                                    <p style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.5)',textAlign:'center',marginTop:'0.6rem'}}>
                                        ¿No tienes cuenta?{' '}
                                        <Link href="/registro" style={{color:'rgba(185,28,28,0.75)',fontWeight:'500',textDecoration:'none'}}>
                                            Crea una gratis
                                        </Link>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
