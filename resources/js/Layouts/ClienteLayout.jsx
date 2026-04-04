// resources/js/Layouts/ClienteLayout.jsx
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import CarritoDrawer from '@/Components/CarritoDrawer';

export default function ClienteLayout({ children }) {
    const { auth } = usePage().props;
    const [showDropdown,  setShowDropdown]  = useState(false);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [modalAuth,     setModalAuth]     = useState(false); // modal "necesitas sesión"
    const [carrito,       setCarrito]       = useState([]);
    const dropdownRef = useRef(null);

    // ── SEGURIDAD: solo cargar carrito si hay usuario logueado ──────────────
    useEffect(() => {
        if (auth?.user) {
            // Cargar el carrito guardado SOLO si hay sesión activa
            try {
                const key = `vitali_carrito_${auth.user.id}`;
                const s   = sessionStorage.getItem(key);
                setCarrito(s ? JSON.parse(s) : []);
            } catch { setCarrito([]); }
        } else {
            // Sin sesión: limpiar cualquier carrito que haya quedado en storage
            sessionStorage.removeItem('vitali_carrito');
            // Limpiar también claves con ID de otros usuarios
            Object.keys(sessionStorage).forEach(k => {
                if (k.startsWith('vitali_carrito')) sessionStorage.removeItem(k);
            });
            setCarrito([]);
        }
    }, [auth?.user?.id]);

    // ── Sincronizar carrito solo si hay sesión ──────────────────────────────
    useEffect(() => {
        if (!auth?.user) return;
        const key = `vitali_carrito_${auth.user.id}`;
        sessionStorage.setItem(key, JSON.stringify(carrito));
        // Mantener compatibilidad con clave genérica para CatalogoProducto
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
    }, [carrito, auth?.user?.id]);

    // ── Escuchar evento de otras páginas (ej: CatalogoProducto) ────────────
    useEffect(() => {
        const handler = (e) => {
            if (!auth?.user || e.detail?.sinSesion) {
                // Sin sesión: mostrar modal en vez de abrir carrito
                setModalAuth(true);
                return;
            }
            try {
                const nuevo = JSON.parse(sessionStorage.getItem('vitali_carrito') || '[]');
                setCarrito(nuevo);
                if (e.detail?.abrir) setCarritoAbierto(true);
            } catch {}
        };
        window.addEventListener('vitali:carrito-actualizado', handler);
        return () => window.removeEventListener('vitali:carrito-actualizado', handler);
    }, [auth?.user]);

    // ── Abrir carrito con verificación de sesión ───────────────────────────
    const abrirCarrito = () => {
        if (!auth?.user) { setModalAuth(true); return; }
        setCarritoAbierto(true);
    };

    const totalItems = auth?.user ? carrito.reduce((sum, i) => sum + i.cantidad, 0) : 0;

    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);



    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: "'Inter', -apple-system, sans-serif",
            background: `
                radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.14) 0%, transparent 55%),
                linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
            `,
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                * { box-sizing: border-box; }

                .cli-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(253,246,240,0.82);
                    backdrop-filter: blur(32px) saturate(160%);
                    -webkit-backdrop-filter: blur(32px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.12);
                }
                .cli-nav-inner {
                    max-width: 1280px; margin: 0 auto; padding: 0 1.25rem;
                    display: flex; align-items: center; justify-content: space-between;
                    height: 56px; gap: 0.75rem;
                }
                .cli-logo {
                    display: flex; align-items: center; gap: 0.6rem;
                    text-decoration: none; flex-shrink: 0;
                }
                .cli-logo-mark {
                    width: 28px; height: 28px;
                    border: 1.5px solid rgba(185,28,28,0.45);
                    border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .cli-logo-text {
                    font-size: 0.92rem; font-weight: 500;
                    color: #2d1a08; letter-spacing: -0.02em;
                }
                .cli-nav-links {
                    display: flex; align-items: center; gap: 0.1rem;
                    flex: 1; justify-content: center;
                }
                .cli-nav-link {
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,60,10,0.6);
                    text-decoration: none;
                    padding: 0.3rem 0.65rem;
                    border-radius: 7px;
                    transition: all 0.12s ease;
                    white-space: nowrap;
                    letter-spacing: -0.01em;
                }
                .cli-nav-link:hover {
                    color: rgba(120,50,10,0.9);
                    background: rgba(200,140,80,0.08);
                }
                .cli-nav-right {
                    display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;
                }
                .cli-cart-btn {
                    position: relative;
                    display: flex; align-items: center; gap: 0.4rem;
                    padding: 0.35rem 0.75rem;
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 7px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem;
                    color: rgba(120,60,10,0.7);
                    font-weight: 400; white-space: nowrap;
                }
                .cli-cart-btn:hover {
                    background: rgba(255,255,255,0.8);
                    border-color: rgba(200,140,80,0.32);
                }
                .cli-cart-count {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 17px; height: 17px;
                    background: rgba(185,28,28,0.85);
                    border-radius: 50%;
                    font-size: 0.6rem; font-weight: 600; color: white;
                    flex-shrink: 0;
                }
                .cli-user-btn {
                    display: flex; align-items: center; gap: 0.45rem;
                    padding: 0.3rem 0.65rem 0.3rem 0.35rem;
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 7px;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .cli-user-btn:hover { background: rgba(255,255,255,0.8); }
                .cli-avatar {
                    width: 24px; height: 24px;
                    background: rgba(185,28,28,0.08);
                    border: 1px solid rgba(185,28,28,0.18);
                    border-radius: 5px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.68rem; font-weight: 600;
                    color: rgba(185,28,28,0.75); flex-shrink: 0;
                }
                .cli-user-name {
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,55,10,0.8); letter-spacing: -0.01em;
                }
                .cli-dropdown {
                    position: absolute; top: calc(100% + 6px); right: 0;
                    min-width: 168px;
                    background: rgba(253,248,244,0.97);
                    backdrop-filter: blur(32px);
                    border: 1px solid rgba(200,140,80,0.18);
                    border-radius: 11px;
                    box-shadow: 0 8px 28px rgba(180,90,20,0.1);
                    overflow: hidden; z-index: 100;
                    animation: dropIn 0.14s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes dropIn {
                    from { opacity:0; transform:translateY(-4px) scale(0.98); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }
                .cli-dropdown a, .cli-dropdown button {
                    display: block; width: 100%;
                    padding: 0.55rem 0.9rem;
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,55,10,0.8);
                    text-decoration: none; text-align: left;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.1s; letter-spacing: -0.01em;
                }
                .cli-dropdown a:hover, .cli-dropdown button:hover {
                    background: rgba(200,140,80,0.08);
                }
                .cli-dropdown-divider {
                    height: 1px; background: rgba(200,140,80,0.1); margin: 0.2rem 0.7rem;
                }
                .cli-auth-link {
                    font-size: 0.8rem; font-weight: 400;
                    color: rgba(120,60,10,0.65); text-decoration: none;
                    padding: 0.35rem 0.75rem;
                    border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 7px; background: rgba(255,255,255,0.5);
                    transition: all 0.12s; white-space: nowrap;
                }
                .cli-auth-link:hover { background: rgba(255,255,255,0.8); }
                .cli-auth-link-primary {
                    font-size: 0.8rem; font-weight: 500;
                    color: rgba(185,28,28,0.85); text-decoration: none;
                    padding: 0.35rem 0.75rem;
                    border: 1px solid rgba(185,28,28,0.2);
                    border-radius: 7px; background: rgba(185,28,28,0.04);
                    transition: all 0.12s; white-space: nowrap;
                }
                .cli-auth-link-primary:hover { background: rgba(185,28,28,0.08); }

                @media (max-width: 700px) {
                    .cli-nav-links { display: none !important; }
                    .cli-user-name { display: none; }
                    .cli-auth-link { display: none; }
                    .cli-logo-text { font-size: 0.85rem; }
                }
                @media (max-width: 400px) {
                    .cli-cart-btn span.cart-label { display: none; }
                }
            `}</style>

            {/* NAV */}
            <nav className="cli-nav">
                <div className="cli-nav-inner">
                    <Link href="/catalogo" className="cli-logo">
                        <div className="cli-logo-mark">
                            <svg width="13" height="13" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                            </svg>
                        </div>
                        <span className="cli-logo-text">VitaliStore</span>
                    </Link>

                    {/* Links desktop */}
                    <div className="cli-nav-links">
                        <Link href="/catalogo" className="cli-nav-link">Catálogo</Link>
                        {auth?.user && (
                            <>
                                <Link href="/cliente/dashboard" className="cli-nav-link">Mi cuenta</Link>
                                <Link href="/cliente/mis-pedidos" className="cli-nav-link">Pedidos</Link>
                            </>
                        )}
                    </div>

                    {/* Derecha */}
                    <div className="cli-nav-right">
                        <button className="cli-cart-btn" onClick={abrirCarrito}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                            </svg>
                            <span className="cart-label">Carrito</span>
                            {totalItems > 0 && <span className="cli-cart-count">{totalItems}</span>}
                        </button>

                        {auth?.user ? (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <div className="cli-user-btn" onClick={() => setShowDropdown(!showDropdown)}>
                                    <div className="cli-avatar">{auth.user.name.charAt(0).toUpperCase()}</div>
                                    <span className="cli-user-name">{auth.user.name.split(' ')[0]}</span>
                                    <svg width="11" height="11" fill="none" stroke="rgba(150,80,20,0.4)" strokeWidth="1.8" viewBox="0 0 24 24"
                                         style={{transition:'transform 0.18s',transform:showDropdown?'rotate(180deg)':'rotate(0deg)',flexShrink:0}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                                {showDropdown && (
                                    <div className="cli-dropdown">
                                        <Link href="/cliente/dashboard" onClick={() => setShowDropdown(false)}>Mi cuenta</Link>
                                        <Link href="/cliente/mis-pedidos" onClick={() => setShowDropdown(false)}>Mis pedidos</Link>
                                        <Link href="/cliente/servicio-cliente" onClick={() => setShowDropdown(false)}>Soporte</Link>
                                        <div className="cli-dropdown-divider"/>
                                        <Link href="/profile" onClick={() => setShowDropdown(false)}>Perfil</Link>
                                        <div className="cli-dropdown-divider"/>
                                        <Link href="/logout" method="post" as="button">Cerrar sesión</Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{display:'flex',gap:'0.4rem'}}>
                                <Link href="/login" className="cli-auth-link">Iniciar sesión</Link>
                                <Link href="/registro" className="cli-auth-link-primary">Registrarse</Link>
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Modal — necesitas iniciar sesión */}
            {modalAuth && (
                <>
                    <style>{`
                        @keyframes authModalIn { from{opacity:0;transform:translateY(8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
                    `}</style>
                    <div
                        onClick={() => setModalAuth(false)}
                        style={{
                            position:'fixed', inset:0, zIndex:300,
                            background:'rgba(20,8,0,0.22)', backdropFilter:'blur(4px)',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            padding:'1rem',
                        }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{
                                width:'100%', maxWidth:'340px',
                                background:'rgba(253,248,244,0.98)',
                                border:'1px solid rgba(200,140,80,0.16)',
                                borderRadius:'18px',
                                padding:'2rem 1.75rem',
                                boxShadow:'0 16px 48px rgba(180,90,20,0.14)',
                                fontFamily:"'Inter',-apple-system,sans-serif",
                                animation:'authModalIn 0.22s cubic-bezier(0.16,1,0.3,1)',
                                textAlign:'center',
                            }}
                        >
                            {/* Icono */}
                            <div style={{
                                width:'48px', height:'48px', borderRadius:'13px', margin:'0 auto 1.1rem',
                                background:'rgba(185,28,28,0.06)', border:'1px solid rgba(185,28,28,0.16)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                            }}>
                                <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.65)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/>
                                </svg>
                            </div>

                            <h2 style={{fontSize:'0.96rem', fontWeight:'600', color:'#2d1a08', marginBottom:'0.5rem', letterSpacing:'-0.02em'}}>
                                Inicia sesión para continuar
                            </h2>
                            <p style={{fontSize:'0.78rem', color:'rgba(150,80,20,0.58)', lineHeight:'1.6', marginBottom:'1.5rem'}}>
                                Para agregar productos al carrito y realizar compras necesitas tener una cuenta.
                            </p>

                            <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                                <Link
                                    href="/login"
                                    style={{
                                        display:'block', padding:'0.72rem', borderRadius:'10px',
                                        background:'rgba(185,28,28,0.08)', border:'1px solid rgba(185,28,28,0.22)',
                                        color:'rgba(185,28,28,0.9)', fontSize:'0.84rem', fontWeight:'500',
                                        textDecoration:'none', transition:'all 0.14s', letterSpacing:'-0.01em',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background='rgba(185,28,28,0.14)'}
                                    onMouseLeave={e => e.currentTarget.style.background='rgba(185,28,28,0.08)'}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href="/registro"
                                    style={{
                                        display:'block', padding:'0.72rem', borderRadius:'10px',
                                        background:'rgba(255,255,255,0.55)', border:'1px solid rgba(200,140,80,0.2)',
                                        color:'rgba(120,60,10,0.75)', fontSize:'0.84rem', fontWeight:'400',
                                        textDecoration:'none', transition:'all 0.14s', letterSpacing:'-0.01em',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.85)'}
                                    onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.55)'}
                                >
                                    Crear cuenta gratis
                                </Link>
                                <button
                                    onClick={() => setModalAuth(false)}
                                    style={{
                                        background:'none', border:'none', cursor:'pointer',
                                        fontSize:'0.74rem', color:'rgba(150,80,20,0.42)',
                                        padding:'0.3rem', fontFamily:'inherit', marginTop:'0.25rem',
                                    }}
                                >
                                    Seguir explorando
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <CarritoDrawer
                open={carritoAbierto}
                onClose={() => setCarritoAbierto(false)}
                carrito={carrito}
                setCarrito={setCarrito}
                auth={auth}
            />
        </div>
    );
}
