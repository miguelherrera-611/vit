// resources/js/Layouts/ClienteLayout.jsx
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function ClienteLayout({ children, carrito = [], onAbrirCarrito }) {
    const { auth } = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

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
                radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
                radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
                radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 50%  50%,  rgba(255,225,190,0.12) 0%, transparent 65%),
                linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
            `,
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

                .cli-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(255,255,255,0.55);
                    backdrop-filter: blur(32px) saturate(180%);
                    -webkit-backdrop-filter: blur(32px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.72);
                    box-shadow: 0 4px 24px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
                }
                .cli-logo-icon {
                    width: 38px; height: 38px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 14px rgba(220,38,38,0.28), inset 0 1px 0 rgba(255,255,255,0.22);
                    position: relative; overflow: hidden; flex-shrink: 0;
                }
                .cli-logo-icon::after {
                    content: ''; position: absolute; inset: 0; border-radius: 12px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 60%);
                }
                .cli-nav-link {
                    font-size: 0.85rem; font-weight: 500;
                    color: rgba(150,80,20,0.65);
                    text-decoration: none;
                    padding: 0.35rem 0.75rem;
                    border-radius: 10px;
                    transition: all 0.18s ease;
                }
                .cli-nav-link:hover {
                    color: rgba(120,50,10,0.9);
                    background: rgba(255,255,255,0.35);
                }
                .cli-cart-btn {
                    position: relative;
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.4rem 0.9rem;
                    background: rgba(220,38,38,0.07);
                    border: 1px solid rgba(220,38,38,0.25);
                    border-radius: 40px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
                    font-family: 'Inter', sans-serif;
                }
                .cli-cart-btn:hover {
                    background: rgba(220,38,38,0.12);
                    border-color: rgba(220,38,38,0.4);
                }
                .cli-cart-badge {
                    position: absolute; top: -6px; right: -6px;
                    width: 20px; height: 20px;
                    background: rgba(220,38,38,0.9);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.65rem; font-weight: 700; color: white;
                    box-shadow: 0 2px 6px rgba(220,38,38,0.35);
                }
                .cli-user-pill {
                    display: flex; align-items: center; gap: 0.6rem;
                    padding: 0.35rem 0.85rem 0.35rem 0.4rem;
                    background: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.65);
                    border-radius: 40px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.75);
                }
                .cli-user-pill:hover {
                    background: rgba(255,255,255,0.3);
                    border-color: rgba(255,255,255,0.85);
                }
                .cli-user-avatar {
                    width: 28px; height: 28px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 600; color: white;
                    flex-shrink: 0;
                    box-shadow: 0 2px 6px rgba(220,38,38,0.25);
                }
                .cli-dropdown {
                    position: absolute; top: calc(100% + 10px); right: 0;
                    min-width: 180px;
                    background: rgba(255,250,245,0.92);
                    backdrop-filter: blur(32px) saturate(180%);
                    -webkit-backdrop-filter: blur(32px) saturate(180%);
                    border: 1px solid rgba(255,255,255,0.72);
                    border-radius: 18px;
                    box-shadow: 0 16px 48px rgba(180,90,20,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow: hidden; z-index: 100;
                    animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .cli-dropdown a, .cli-dropdown button {
                    display: block; width: 100%;
                    padding: 0.7rem 1.1rem;
                    font-size: 0.85rem; font-weight: 500;
                    color: rgba(120,55,10,0.82);
                    text-decoration: none; text-align: left;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.15s, color 0.15s;
                }
                .cli-dropdown a:hover, .cli-dropdown button:hover {
                    background: rgba(255,255,255,0.55);
                    color: rgba(90,35,5,0.95);
                }
                .cli-dropdown-divider {
                    height: 1px;
                    background: rgba(200,140,80,0.12);
                    margin: 0.2rem 0.8rem;
                }
            `}</style>

            {/* NAV */}
            <nav className="cli-nav">
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

                        {/* Logo + links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                            <Link href="/catalogo" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
                                <div className="cli-logo-icon">
                                    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: '1.1rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.02em' }}>
                                    VitaliStore
                                </span>
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Link href="/catalogo" className="cli-nav-link">Catálogo</Link>
                                {auth?.user && (
                                    <>
                                        <Link href="/cliente/dashboard" className="cli-nav-link">Mi cuenta</Link>
                                        <Link href="/cliente/mis-pedidos" className="cli-nav-link">Mis pedidos</Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Derecha: carrito + usuario */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

                            {/* Botón carrito */}
                            {onAbrirCarrito && (
                                <button className="cli-cart-btn" onClick={onAbrirCarrito}>
                                    <svg width="18" height="18" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span style={{ fontSize: '0.82rem', fontWeight: '500', color: 'rgba(185,28,28,0.85)' }}>
                                        Carrito
                                    </span>
                                    {totalItems > 0 && (
                                        <span className="cli-cart-badge">{totalItems}</span>
                                    )}
                                </button>
                            )}

                            {/* Usuario autenticado */}
                            {auth?.user ? (
                                <div ref={dropdownRef} style={{ position: 'relative' }}>
                                    <div className="cli-user-pill" onClick={() => setShowDropdown(!showDropdown)}>
                                        <div className="cli-user-avatar">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'rgba(120,55,10,0.85)' }}>
                                            {auth.user.name.split(' ')[0]}
                                        </span>
                                        <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.55)" strokeWidth="2" viewBox="0 0 24 24"
                                             style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    {showDropdown && (
                                        <div className="cli-dropdown">
                                            <Link href="/cliente/dashboard">Mi cuenta</Link>
                                            <Link href="/cliente/mis-pedidos">Mis pedidos</Link>
                                            <div className="cli-dropdown-divider" />
                                            <Link href="/profile">Perfil</Link>
                                            <div className="cli-dropdown-divider" />
                                            <Link href="/logout" method="post" as="button">Cerrar Sesión</Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Link href="/login" style={{
                                        padding: '0.4rem 1rem', borderRadius: '10px',
                                        fontSize: '0.85rem', fontWeight: '500',
                                        color: 'rgba(150,80,20,0.75)',
                                        textDecoration: 'none',
                                        border: '1px solid rgba(200,140,80,0.3)',
                                        background: 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.18s',
                                    }}>
                                        Iniciar sesión
                                    </Link>
                                    <Link href="/registro" style={{
                                        padding: '0.4rem 1rem', borderRadius: '10px',
                                        fontSize: '0.85rem', fontWeight: '600',
                                        color: 'rgba(185,28,28,0.9)',
                                        textDecoration: 'none',
                                        border: '1px solid rgba(220,38,38,0.35)',
                                        background: 'rgba(220,38,38,0.07)',
                                        transition: 'all 0.18s',
                                    }}>
                                        Crear cuenta
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}
