import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

export default function ProveedoresIndex({ proveedores = [] }) {
    const [searchTerm, setSearchTerm]     = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [currentPage, setCurrentPage]   = useState(1);
    const [delProcessing, setDelProcessing] = useState(false);
    const [delError, setDelError]         = useState(null);

    const PER_PAGE = 15;

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const stats = useMemo(() => {
        const activos = proveedores.filter(p => p.activo);
        return { total: proveedores.length, activos: activos.length };
    }, [proveedores]);

    const proveedoresFiltrados = useMemo(() => {
        const q = normalizeText(searchTerm);
        return proveedores.filter(p =>
            normalizeText(p.nombre).includes(q) ||
            normalizeText(p.empresa).includes(q) ||
            normalizeText(p.email).includes(q) ||
            normalizeText(p.telefono).includes(q)
        );
    }, [proveedores, searchTerm]);

    const proveedoresPaginados = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        return proveedoresFiltrados.slice(start, start + PER_PAGE);
    }, [proveedoresFiltrados, currentPage]);

    const handleDelete = (password) => {
        if (!confirmDelete) return;
        setDelProcessing(true);
        router.delete(`/proveedores/${confirmDelete.id}`, {
            data: { password },
            onSuccess: () => { setConfirmDelete(null); setDelProcessing(false); setDelError(null); },
            onError: (errs) => { setDelError(errs.password || 'Error al eliminar.'); setDelProcessing(false); },
        });
    };

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

                .pv-wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1.25rem 4rem; font-family: 'Inter', sans-serif; }

                .pv-header { margin-bottom: 1.75rem; animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
                .pv-header-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }

                .pv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.75rem; }
                .pv-stat {
                    padding: 1.25rem 1.35rem;
                    background: rgba(255,255,255,0.5);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }

                .pv-search-wrap {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px;
                    padding: 1.1rem 1.25rem;
                    margin-bottom: 1rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.05s both;
                }
                .pv-search-inner { position: relative; }
                .pv-search-input {
                    width: 100%; padding: 0.72rem 0.875rem 0.72rem 2.5rem;
                    background: rgba(255,255,255,0.55);
                    border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 10px; font-size: 0.84rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none; transition: all 0.15s;
                    letter-spacing: -0.01em;
                }
                .pv-search-input::placeholder { color: rgba(180,100,30,0.3); }
                .pv-search-input:focus { background: rgba(255,255,255,0.8); border-color: rgba(200,140,80,0.38); box-shadow: 0 0 0 3px rgba(200,140,80,0.06); }
                .pv-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); pointer-events: none; }

                .pv-table-wrap {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; overflow: hidden;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                }
                .pv-table { width: 100%; border-collapse: collapse; }
                .pv-thead th {
                    padding: 0.75rem 1.1rem;
                    text-align: left; font-size: 0.65rem; font-weight: 500;
                    color: rgba(150,80,20,0.5); text-transform: uppercase;
                    letter-spacing: 0.07em;
                    background: rgba(255,255,255,0.3);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                }
                .pv-thead th:last-child { text-align: right; }
                .pv-tr { transition: background 0.13s; border-bottom: 1px solid rgba(200,140,80,0.07); }
                .pv-tr:last-child { border-bottom: none; }
                .pv-tr:hover { background: rgba(255,255,255,0.35); }
                .pv-td { padding: 0.9rem 1.1rem; font-size: 0.82rem; color: #2d1a08; vertical-align: middle; }
                .pv-td-right { padding: 0.9rem 1.1rem; vertical-align: middle; text-align: right; }

                .pv-avatar {
                    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.15);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.78rem; font-weight: 500; color: rgba(185,28,28,0.8);
                    letter-spacing: -0.01em; text-decoration: none; transition: all 0.13s;
                }
                .pv-avatar:hover { background: rgba(185,28,28,0.13); }

                .badge-active   { padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500; background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2); color: rgba(4,120,87,0.85); white-space: nowrap; }
                .badge-inactive { padding: 0.16rem 0.55rem; border-radius: 5px; font-size: 0.69rem; font-weight: 500; background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.18); color: rgba(185,28,28,0.85); white-space: nowrap; }

                .btn-primary {
                    padding: 0.68rem 1.25rem; border-radius: 10px; border: 1px solid rgba(185,28,28,0.22);
                    background: rgba(185,28,28,0.08); color: rgba(185,28,28,0.9);
                    font-family: 'Inter', sans-serif; font-size: 0.83rem; font-weight: 500;
                    cursor: pointer; transition: all 0.15s; text-decoration: none;
                    display: inline-flex; align-items: center; gap: 0.45rem; letter-spacing: -0.01em;
                    white-space: nowrap;
                }
                .btn-primary:hover { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }

                .act-link { font-size: 0.78rem; font-weight: 500; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; padding: 0; transition: opacity 0.13s; text-decoration: none; }
                .act-link:hover { opacity: 0.65; }
                .act-view   { color: rgba(150,80,20,0.6); }
                .act-edit   { color: rgba(29,78,216,0.8); }
                .act-delete { color: rgba(185,28,28,0.8); }

                .pv-pagination { padding: 0.9rem 1.1rem; border-top: 1px solid rgba(200,140,80,0.08); }

                .pv-empty {
                    background: rgba(255,255,255,0.45); border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; padding: 4rem 2rem; text-align: center;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                }

                @media (max-width: 900px) {
                    .pv-stats { grid-template-columns: repeat(2, 1fr); }
                    .pv-col-empresa, .pv-col-empresa-h { display: none; }
                }
                @media (max-width: 640px) {
                    .pv-wrap { padding: 1.5rem 1rem 3rem; }
                    .pv-stats { grid-template-columns: repeat(2, 1fr); gap: 0.6rem; }
                    .pv-stat { padding: 1rem; }
                    .pv-col-contacto, .pv-col-contacto-h { display: none; }
                    .pv-td, .pv-td-right, .pv-thead th { padding: 0.8rem 0.875rem; }
                }
                @media (max-width: 420px) {
                    .pv-stats { grid-template-columns: 1fr 1fr; }
                }
            `}</style>

            <div className="pv-wrap">

                {/* Header */}
                <div className="pv-header">
                    <div className="pv-header-row">
                        <div>
                            <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.35rem'}}>
                                Administración
                            </p>
                            <h1 style={{fontSize:'clamp(1.4rem,3vw,1.75rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.2rem'}}>
                                Proveedores
                            </h1>
                            <p style={{fontSize:'0.8rem',color:'rgba(150,80,20,0.5)'}}>
                                {stats.total} proveedor{stats.total !== 1 ? 'es' : ''} registrado{stats.total !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Link href="/proveedores/crear" className="btn-primary">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                            </svg>
                            Nuevo proveedor
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="pv-stats">
                    {[
                        { label: 'Total',    value: stats.total,                    delay: '0.05s' },
                        { label: 'Activos',  value: stats.activos,                  delay: '0.08s' },
                        { label: 'Inactivos',value: stats.total - stats.activos,    delay: '0.11s' },
                        { label: 'Surtidos', value: 0,                              delay: '0.14s' },
                    ].map((s) => (
                        <div key={s.label} className="pv-stat" style={{animationDelay: s.delay}}>
                            <p style={{fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 0.25rem'}}>
                                {s.value}
                            </p>
                            <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Buscador */}
                {proveedores.length > 0 && (
                    <div className="pv-search-wrap">
                        <div className="pv-search-inner">
                            <svg className="pv-search-icon" width="15" height="15" fill="none" stroke="rgba(150,80,20,0.38)" strokeWidth="1.8" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input
                                type="text"
                                className="pv-search-input"
                                placeholder="Buscar por nombre, empresa, email o teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {searchTerm && (
                            <p style={{marginTop:'0.5rem',fontSize:'0.75rem',color:'rgba(150,80,20,0.5)'}}>
                                <span style={{fontWeight:'500',color:'#2d1a08'}}>{proveedoresFiltrados.length}</span> resultado{proveedoresFiltrados.length !== 1 ? 's' : ''} para «{searchTerm}»
                            </p>
                        )}
                    </div>
                )}

                {/* Tabla / Empty */}
                {proveedoresFiltrados.length > 0 ? (
                    <div className="pv-table-wrap">
                        <div style={{overflowX:'auto'}}>
                            <table className="pv-table">
                                <thead className="pv-thead">
                                <tr>
                                    <th>Proveedor</th>
                                    <th className="pv-col-empresa-h">Empresa</th>
                                    <th className="pv-col-contacto-h">Contacto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {proveedoresPaginados.map((proveedor) => (
                                    <tr key={proveedor.id} className="pv-tr">
                                        <td className="pv-td">
                                            <div style={{display:'flex',alignItems:'center',gap:'0.65rem'}}>
                                                <Link href={`/proveedores/${proveedor.id}`} className="pv-avatar">
                                                    {proveedor.nombre.charAt(0).toUpperCase()}
                                                </Link>
                                                <div>
                                                    <Link href={`/proveedores/${proveedor.id}`} style={{fontSize:'0.83rem',fontWeight:'500',color:'#2d1a08',textDecoration:'none',letterSpacing:'-0.01em',transition:'color 0.13s'}}>
                                                        {proveedor.nombre}
                                                    </Link>
                                                    <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.45)',margin:'0.06rem 0 0'}}>
                                                        {proveedor.documento || 'Sin documento'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pv-td pv-col-empresa">
                                            <p style={{margin:'0 0 0.06rem',color:'#2d1a08'}}>{proveedor.empresa || '—'}</p>
                                            {proveedor.sitio_web && (
                                                <a href={proveedor.sitio_web} target="_blank" rel="noopener noreferrer"
                                                   style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',textDecoration:'none'}}>
                                                    {proveedor.sitio_web}
                                                </a>
                                            )}
                                        </td>
                                        <td className="pv-td pv-col-contacto">
                                            <p style={{margin:'0 0 0.06rem',color:'#2d1a08'}}>{proveedor.email || 'Sin email'}</p>
                                            <p style={{margin:0,color:'rgba(150,80,20,0.5)',fontSize:'0.75rem'}}>{proveedor.telefono || 'Sin teléfono'}</p>
                                        </td>
                                        <td className="pv-td">
                                                <span className={proveedor.activo ? 'badge-active' : 'badge-inactive'}>
                                                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                        </td>
                                        <td className="pv-td-right">
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'1rem'}}>
                                                <Link href={`/proveedores/${proveedor.id}`} className="act-link act-view">Ver</Link>
                                                <Link href={`/proveedores/${proveedor.id}/edit`} className="act-link act-edit">Editar</Link>
                                                <button onClick={() => { setConfirmDelete(proveedor); setDelError(null); }} className="act-link act-delete">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pv-pagination">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={proveedoresFiltrados.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="indigo"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="pv-empty">
                        <div style={{width:'44px',height:'44px',borderRadius:'12px',margin:'0 auto 1.25rem',
                            background:'rgba(200,140,80,0.06)',border:'1px solid rgba(200,140,80,0.15)',
                            display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <svg width="20" height="20" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                        </div>
                        <p style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.4rem',letterSpacing:'-0.01em'}}>
                            {searchTerm ? 'Sin resultados' : 'No hay proveedores aún'}
                        </p>
                        <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.5)',marginBottom:'1.25rem'}}>
                            {searchTerm ? `Ningún proveedor coincide con «${searchTerm}»` : 'Comienza registrando tu primer proveedor.'}
                        </p>
                        {!searchTerm && (
                            <Link href="/proveedores/crear" className="btn-primary" style={{display:'inline-flex'}}>
                                Agregar proveedor
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <PasswordConfirmModal
                open={!!confirmDelete}
                onClose={() => { setConfirmDelete(null); setDelError(null); }}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`Eliminar "${confirmDelete?.nombre}"`}
                description="El proveedor se moverá a la papelera y podrá ser restaurado posteriormente. Esta acción requiere tu contraseña para continuar."
                confirmLabel="Eliminar proveedor"
            />
        </AppLayout>
    );
}
