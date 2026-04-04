import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const roles = auth.user?.roles ?? [];
    const dashboardHref = roles.includes('admin')
        ? '/dashboard/admin'
        : roles.includes('empleado')
            ? '/dashboard/empleado'
            : '/dashboard';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowingNavigationDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

                .app-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(255,255,255,0.55);
                    backdrop-filter: blur(32px) saturate(180%);
                    -webkit-backdrop-filter: blur(32px) saturate(180%);
                    border-bottom: 1px solid rgba(255,255,255,0.72);
                    box-shadow:
                        0 4px 24px rgba(180,90,20,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                }

                .nav-logo-icon {
                    width: 38px; height: 38px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 14px rgba(220,38,38,0.28), inset 0 1px 0 rgba(255,255,255,0.22);
                    position: relative; overflow: hidden;
                    flex-shrink: 0;
                }
                .nav-logo-icon::after {
                    content: '';
                    position: absolute; inset: 0; border-radius: 12px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 60%);
                }

                .nav-brand {
                    font-size: 1.15rem; font-weight: 300; color: #2d1a08;
                    letter-spacing: -0.02em; text-decoration: none;
                }

                .nav-link {
                    font-size: 0.85rem; font-weight: 500;
                    color: rgba(150,80,20,0.65);
                    text-decoration: none;
                    padding: 0.35rem 0.75rem;
                    border-radius: 10px;
                    transition: all 0.18s ease;
                    white-space: nowrap;
                }
                .nav-link:hover {
                    color: rgba(120,50,10,0.9);
                    background: rgba(255,255,255,0.35);
                }

                .user-pill {
                    display: flex; align-items: center; gap: 0.6rem;
                    padding: 0.35rem 0.85rem 0.35rem 0.4rem;
                    background: rgba(255,255,255,0.18);
                    border: 1px solid rgba(255,255,255,0.65);
                    border-radius: 40px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.75);
                    position: relative;
                    max-width: 100%;
                }
                .user-pill:hover {
                    background: rgba(255,255,255,0.3);
                    border-color: rgba(255,255,255,0.85);
                    box-shadow: 0 4px 14px rgba(180,90,20,0.08), inset 0 1px 0 rgba(255,255,255,0.85);
                }
                .user-avatar {
                    width: 28px; height: 28px;
                    background: linear-gradient(145deg, #ef4444 0%, #b91c1c 100%);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 600; color: white;
                    flex-shrink: 0;
                    box-shadow: 0 2px 6px rgba(220,38,38,0.25);
                }
                .user-name {
                    font-size: 0.85rem; font-weight: 500;
                    color: rgba(120,55,10,0.85);
                    letter-spacing: -0.01em;
                    /* Truncar nombre largo en móvil */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 120px;
                }

                .nav-dropdown {
                    position: absolute; top: calc(100% + 10px); right: 0;
                    min-width: 180px;
                    background: rgba(255,250,245,0.92);
                    backdrop-filter: blur(32px) saturate(180%);
                    -webkit-backdrop-filter: blur(32px) saturate(180%);
                    border: 1px solid rgba(255,255,255,0.72);
                    border-radius: 18px;
                    box-shadow:
                        0 16px 48px rgba(180,90,20,0.12),
                        0 4px 14px rgba(180,90,20,0.06),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow: hidden;
                    z-index: 100;
                    animation: dropIn 0.18s cubic-bezier(0.16,1,0.3,1);
                }
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .nav-dropdown a, .nav-dropdown button {
                    display: block; width: 100%;
                    padding: 0.7rem 1.1rem;
                    font-size: 0.85rem; font-weight: 500;
                    color: rgba(120,55,10,0.82);
                    text-decoration: none; text-align: left;
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    transition: background 0.15s, color 0.15s;
                }
                .nav-dropdown a:hover, .nav-dropdown button:hover {
                    background: rgba(255,255,255,0.55);
                    color: rgba(90,35,5,0.95);
                }
                .nav-dropdown-divider {
                    height: 1px;
                    background: rgba(200,140,80,0.12);
                    margin: 0.2rem 0.8rem;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 640px) {
                    .nav-inner {
                        padding: 0 0.875rem !important;
                        height: auto !important;
                        min-height: 56px;
                        flex-wrap: nowrap;
                        gap: 0.5rem;
                    }

                    /* Logo icon un poco más pequeño */
                    .nav-logo-icon {
                        width: 32px;
                        height: 32px;
                        border-radius: 9px;
                    }

                    /* Ocultar el texto "VitaliStore" en pantallas muy pequeñas,
                       solo mostrar el ícono */
                    .nav-brand-text {
                        display: none;
                    }

                    /* Ocultar el enlace Dashboard en móvil (ya están en el dropdown) */
                    .nav-dashboard-link {
                        display: none;
                    }

                    /* Pill más compacto */
                    .user-pill {
                        padding: 0.28rem 0.5rem 0.28rem 0.32rem;
                        gap: 0.4rem;
                    }
                    .user-name {
                        font-size: 0.78rem;
                        max-width: 90px;
                    }

                    /* Dropdown pegado al borde derecho */
                    .nav-dropdown {
                        right: 0;
                        min-width: 160px;
                    }
                }

                @media (max-width: 380px) {
                    .user-name { max-width: 70px; }
                }
            `}</style>

            <nav className="app-nav">
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div
                        className="nav-inner"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '64px',
                            padding: '0 1.5rem',
                        }}
                    >
                        {/* Left: logo + links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 0 }}>
                            <Link href={dashboardHref} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', flexShrink: 0 }}>
                                <div className="nav-logo-icon">
                                    <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <span className="nav-brand nav-brand-text">VitaliStore</span>
                            </Link>

                            <div className="nav-dashboard-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Link href={dashboardHref} className="nav-link">Dashboard</Link>
                            </div>
                        </div>

                        {/* Right: user pill */}
                        <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                            <div
                                className="user-pill"
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            >
                                <div className="user-avatar">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="user-name">{auth.user.name}</span>
                                <svg
                                    width="14" height="14" fill="none" stroke="rgba(150,80,20,0.55)" strokeWidth="2" viewBox="0 0 24 24"
                                    style={{ transition: 'transform 0.2s', transform: showingNavigationDropdown ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {showingNavigationDropdown && (
                                <div className="nav-dropdown">
                                    <Link href={dashboardHref}>Dashboard</Link>
                                    <Link href="/profile">Perfil</Link>
                                    <div className="nav-dropdown-divider" />
                                    <Link href="/logout" method="post" as="button">
                                        Cerrar Sesión
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
