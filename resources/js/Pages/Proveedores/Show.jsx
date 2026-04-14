import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function ProveedoresShow({ proveedor, totalProductos = 0 }) {
    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

                .ps-wrap { max-width: 860px; margin: 0 auto; padding: 2rem 1.25rem 4rem; font-family: 'Inter', sans-serif; }

                .ps-back-row {
                    display: flex; align-items: center; gap: 0.6rem;
                    margin-bottom: 1.75rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .ps-back-btn {
                    width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(200,140,80,0.18);
                    background: rgba(255,255,255,0.45); display: flex; align-items: center; justify-content: center;
                    cursor: pointer; text-decoration: none; transition: all 0.13s; flex-shrink: 0;
                }
                .ps-back-btn:hover { background: rgba(255,255,255,0.7); border-color: rgba(200,140,80,0.3); }

                .ps-card {
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }

                .ps-header-card {
                    padding: 1.5rem 1.5rem 1.25rem;
                    display: flex; align-items: flex-start; justify-content: space-between;
                    gap: 1rem; flex-wrap: wrap;
                    margin-bottom: 0.875rem;
                    animation-delay: 0.02s;
                }

                .ps-avatar {
                    width: 52px; height: 52px; border-radius: 13px; flex-shrink: 0;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.15);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.25rem; font-weight: 500; color: rgba(185,28,28,0.8);
                    letter-spacing: -0.01em;
                }

                .badge-active   { padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500; background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2); color: rgba(4,120,87,0.85); white-space: nowrap; }
                .badge-inactive { padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.18); color: rgba(185,28,28,0.85); white-space: nowrap; }

                .ps-stats {
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;
                    margin-bottom: 0.875rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s both;
                }
                .ps-stat {
                    padding: 1.1rem 1.25rem;
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px;
                }

                .ps-section {
                    padding: 1.4rem 1.5rem;
                    margin-bottom: 0.875rem;
                    animation-delay: 0.08s;
                }
                .ps-section-title {
                    font-size: 0.68rem; font-weight: 500; color: rgba(150,80,20,0.45);
                    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1rem;
                }
                .ps-divider {
                    border: none; border-top: 1px solid rgba(200,140,80,0.1); margin: 1rem 0;
                }

                .ps-field-grid {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem;
                }
                .ps-field { }
                .ps-field-label {
                    font-size: 0.68rem; font-weight: 500; color: rgba(150,80,20,0.45);
                    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.2rem;
                }
                .ps-field-value {
                    font-size: 0.84rem; color: #2d1a08; letter-spacing: -0.01em;
                }
                .ps-field-empty {
                    font-size: 0.84rem; color: rgba(150,80,20,0.3); font-style: italic;
                }
                .ps-field-link {
                    font-size: 0.84rem; color: rgba(150,80,20,0.7); letter-spacing: -0.01em;
                    text-decoration: none; transition: color 0.13s;
                }
                .ps-field-link:hover { color: rgba(120,60,10,0.9); }

                .ps-actions-card {
                    padding: 1.25rem 1.5rem;
                    animation-delay: 0.12s;
                }
                .btn-primary {
                    padding: 0.65rem 1.2rem; border-radius: 10px; border: 1px solid rgba(185,28,28,0.22);
                    background: rgba(185,28,28,0.08); color: rgba(185,28,28,0.9);
                    font-family: 'Inter', sans-serif; font-size: 0.83rem; font-weight: 500;
                    cursor: pointer; transition: all 0.15s; text-decoration: none;
                    display: inline-flex; align-items: center; gap: 0.45rem; letter-spacing: -0.01em;
                }
                .btn-primary:hover { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }

                .btn-soft {
                    padding: 0.65rem 1.2rem; border-radius: 10px; border: 1px solid rgba(200,140,80,0.2);
                    background: rgba(255,255,255,0.45); color: rgba(120,60,10,0.7);
                    font-family: 'Inter', sans-serif; font-size: 0.83rem; font-weight: 500;
                    cursor: pointer; transition: all 0.15s; text-decoration: none;
                    display: inline-flex; align-items: center; gap: 0.45rem; letter-spacing: -0.01em;
                }
                .btn-soft:hover { background: rgba(255,255,255,0.7); border-color: rgba(200,140,80,0.35); }

                @media (max-width: 640px) {
                    .ps-wrap { padding: 1.5rem 1rem 3rem; }
                    .ps-stats { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
                    .ps-field-grid { grid-template-columns: 1fr; }
                    .ps-header-card { padding: 1.25rem; }
                    .ps-section { padding: 1.1rem 1.25rem; }
                }
            `}</style>

            <div className="ps-wrap">

                {/* Volver */}
                <div className="ps-back-row">
                    <Link href="/proveedores" className="ps-back-btn">
                        <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.6)" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <span style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.45)'}}>Proveedores</span>
                    <svg width="12" height="12" fill="none" stroke="rgba(150,80,20,0.3)" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.65)',fontWeight:'500'}}>{proveedor.nombre}</span>
                </div>

                {/* Header del proveedor */}
                <div className="ps-card ps-header-card">
                    <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                        <div className="ps-avatar">
                            {proveedor.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 style={{fontSize:'clamp(1.25rem,3vw,1.6rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',margin:'0 0 0.2rem'}}>
                                {proveedor.nombre}
                            </h1>
                            {proveedor.empresa && (
                                <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.5)',margin:'0 0 0.4rem'}}>
                                    {proveedor.empresa}
                                </p>
                            )}
                            <span className={proveedor.activo ? 'badge-active' : 'badge-inactive'}>
                                {proveedor.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                    <Link href={`/proveedores/${proveedor.id}/edit`} className="btn-primary">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Editar
                    </Link>
                </div>

                {/* Stats rápidas */}
                <div className="ps-stats">
                    {[
                        { label: 'Productos',   value: totalProductos },
                        { label: 'Estado',      value: proveedor.activo ? 'Activo' : 'Inactivo' },
                        { label: 'Registrado',  value: proveedor.created_at ? new Date(proveedor.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                        { label: 'NIT / Doc.',  value: proveedor.documento || '—' },
                    ].map((s) => (
                        <div key={s.label} className="ps-stat">
                            <p style={{fontSize:'clamp(1.1rem,3vw,1.4rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 0.2rem'}}>
                                {s.value}
                            </p>
                            <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Información de contacto */}
                <div className="ps-card ps-section">
                    <p className="ps-section-title">Información de contacto</p>
                    <div className="ps-field-grid">
                        <div className="ps-field">
                            <p className="ps-field-label">Correo electrónico</p>
                            {proveedor.email
                                ? <a href={`mailto:${proveedor.email}`} className="ps-field-link">{proveedor.email}</a>
                                : <p className="ps-field-empty">No especificado</p>
                            }
                        </div>
                        <div className="ps-field">
                            <p className="ps-field-label">Teléfono</p>
                            {proveedor.telefono
                                ? <a href={`tel:${proveedor.telefono}`} className="ps-field-link">{proveedor.telefono}</a>
                                : <p className="ps-field-empty">No especificado</p>
                            }
                        </div>
                        <div className="ps-field">
                            <p className="ps-field-label">Empresa</p>
                            {proveedor.empresa
                                ? <p className="ps-field-value">{proveedor.empresa}</p>
                                : <p className="ps-field-empty">No especificado</p>
                            }
                        </div>
                        <div className="ps-field">
                            <p className="ps-field-label">Sitio web</p>
                            {proveedor.sitio_web
                                ? <a href={proveedor.sitio_web} target="_blank" rel="noopener noreferrer" className="ps-field-link">{proveedor.sitio_web}</a>
                                : <p className="ps-field-empty">No especificado</p>
                            }
                        </div>
                        {proveedor.documento && (
                            <div className="ps-field">
                                <p className="ps-field-label">NIT / Documento</p>
                                <p className="ps-field-value">{proveedor.documento}</p>
                            </div>
                        )}
                        {proveedor.direccion && (
                            <div className="ps-field" style={{gridColumn:'1 / -1'}}>
                                <p className="ps-field-label">Dirección</p>
                                <p className="ps-field-value">{proveedor.direccion}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones */}
                <div className="ps-card ps-actions-card">
                    <p className="ps-section-title">Acciones</p>
                    <div style={{display:'flex',gap:'0.65rem',flexWrap:'wrap'}}>
                        <Link href={`/proveedores/${proveedor.id}/edit`} className="btn-primary">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Editar proveedor
                        </Link>
                        <Link href="/proveedores" className="btn-soft">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                            </svg>
                            Ver todos los proveedores
                        </Link>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
