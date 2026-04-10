import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from '@/Components/Pagination';

export default function UsuariosIndex({ usuarios, filters = {} }) {
    const lista = usuarios?.data ?? [];
    const { flash } = usePage().props;
    const [eliminando, setEliminando]       = useState(null);
    const [password, setPassword]           = useState('');
    const [error, setError]                 = useState('');
    const [desbloqueando, setDesbloqueando] = useState(null);

    const toggleActivo = (id) => router.patch(`/usuarios/${id}/toggle`);

    const ejecutarDesbloquear = () => {
        router.patch(`/usuarios/${desbloqueando.id}/desbloquear`, {}, {
            onSuccess: () => setDesbloqueando(null),
        });
    };

    const confirmarEliminar = (usuario) => { setEliminando(usuario); setPassword(''); setError(''); };

    const ejecutarEliminar = () => {
        router.delete(`/usuarios/${eliminando.id}`, {
            data: { password },
            onError:   (errors) => setError(errors.password || 'Error al eliminar.'),
            onSuccess: () => setEliminando(null),
        });
    };

    const rolMeta = (rol) => {
        if (rol === 'admin')    return { label: 'Administrador', cls: 'u-badge-admin'   };
        if (rol === 'empleado') return { label: 'Empleado',      cls: 'u-badge-emp'    };
        if (rol === 'cliente')  return { label: 'Cliente',       cls: 'u-badge-cliente'};
        return { label: 'Sin rol', cls: 'u-badge-none' };
    };

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=DM+Serif+Display&display=swap');
                *, *::before, *::after { box-sizing: border-box; }

                @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

                .u-root {
                    min-height: 100vh;
                    font-family: 'DM Sans', sans-serif;
                    background:
                        radial-gradient(ellipse 70% 55% at 5% 0%, rgba(255,215,175,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 95% 100%, rgba(255,195,145,0.13) 0%, transparent 55%),
                        linear-gradient(150deg, #fdf6f0 0%, #fdf3ec 40%, #fef5ef 70%, #fef8f4 100%);
                }

                /* ── Header ── */
                .u-header {
                    background: rgba(253,246,240,0.75);
                    backdrop-filter: blur(28px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    position: sticky; top: 0; z-index: 40;
                }
                .u-header-inner {
                    max-width: 1180px; margin: 0 auto;
                    padding: 1.25rem 1.5rem;
                    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
                }
                .u-title { font-family: 'DM Serif Display', serif; font-size: 1.55rem; font-weight: 400; color: #2d1a08; letter-spacing: -0.02em; margin: 0; }
                .u-subtitle { font-size: 0.78rem; color: rgba(150,80,20,0.55); margin: 0.15rem 0 0; }

                /* ── Btn primario ── */
                .u-btn-primary {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.6rem 1.25rem; border-radius: 10px;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); font-size: 0.83rem; font-weight: 500;
                    text-decoration: none; font-family: 'DM Sans', sans-serif;
                    transition: all 0.16s; letter-spacing: -0.01em; cursor: pointer;
                }
                .u-btn-primary:hover { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }

                /* ── Contenido ── */
                .u-content { max-width: 1180px; margin: 0 auto; padding: 2rem 1.5rem 3rem; }

                /* ── Flash ── */
                .u-flash {
                    margin-bottom: 1.25rem; padding: 0.8rem 1rem; border-radius: 10px;
                    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.2);
                    font-size: 0.81rem; color: rgba(4,120,87,0.85);
                    animation: fadeUp 0.4s ease both;
                }

                /* ── Glass card ── */
                .u-glass {
                    background: rgba(255,255,255,0.48);
                    backdrop-filter: blur(20px) saturate(150%);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(180,90,20,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow: hidden;
                    animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
                }

                /* ── Tabla ── */
                .u-table { width: 100%; border-collapse: collapse; }
                .u-thead th {
                    padding: 0.75rem 1.25rem;
                    text-align: left; font-size: 0.67rem; font-weight: 600;
                    color: rgba(150,80,20,0.45); text-transform: uppercase; letter-spacing: 0.08em;
                    background: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(200,140,80,0.08);
                }
                .u-tbody tr {
                    border-bottom: 1px solid rgba(200,140,80,0.06);
                    transition: background 0.12s;
                }
                .u-tbody tr:last-child { border-bottom: none; }
                .u-tbody tr:hover { background: rgba(255,255,255,0.35); }
                .u-tbody tr.locked { background: rgba(220,38,38,0.03); }
                .u-tbody td { padding: 0.9rem 1.25rem; font-size: 0.82rem; color: #2d1a08; vertical-align: middle; }

                /* ── Badges ── */
                .u-badge {
                    display: inline-flex; align-items: center;
                    padding: 0.18rem 0.6rem; border-radius: 5px;
                    font-size: 0.69rem; font-weight: 500; letter-spacing: 0.01em;
                }
                .u-badge-admin   { background: rgba(185,28,28,0.07);  border: 1px solid rgba(185,28,28,0.18);  color: rgba(185,28,28,0.9); }
                .u-badge-emp     { background: rgba(59,130,246,0.07); border: 1px solid rgba(59,130,246,0.18); color: rgba(29,78,216,0.9); }
                .u-badge-cliente { background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.22); color: rgba(4,120,87,0.9); }
                .u-badge-none    { background: rgba(200,140,80,0.06); border: 1px solid rgba(200,140,80,0.15); color: rgba(120,60,10,0.6); }

                .u-badge-locked {
                    display: inline-flex; align-items: center; gap: 0.3rem;
                    margin-top: 0.25rem; padding: 0.15rem 0.5rem; border-radius: 4px;
                    font-size: 0.67rem; font-weight: 500;
                    background: rgba(220,38,38,0.06); border: 1px solid rgba(220,38,38,0.15); color: rgba(185,28,28,0.85);
                }

                /* ── Toggle ── */
                .u-toggle {
                    position: relative; display: inline-flex;
                    width: 40px; height: 22px; border-radius: 11px;
                    transition: background 0.2s; cursor: pointer; border: none;
                }
                .u-toggle.on  { background: rgba(16,185,129,0.75); }
                .u-toggle.off { background: rgba(200,140,80,0.25); }
                .u-toggle-knob {
                    position: absolute; top: 3px;
                    width: 16px; height: 16px; border-radius: 50%; background: white;
                    transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                }
                .u-toggle.on  .u-toggle-knob { left: 21px; }
                .u-toggle.off .u-toggle-knob { left: 3px; }

                /* ── Permiso tags ── */
                .u-perm {
                    display: inline-block; padding: 0.13rem 0.5rem; border-radius: 4px;
                    font-size: 0.67rem; background: rgba(200,140,80,0.07);
                    border: 1px solid rgba(200,140,80,0.15); color: rgba(120,60,10,0.7);
                    margin: 0.1rem 0.1rem 0 0;
                }

                /* ── Acciones ── */
                .u-icon-btn {
                    padding: 0.45rem; border-radius: 8px; border: none; background: transparent;
                    cursor: pointer; color: rgba(150,80,20,0.4); transition: all 0.14s;
                    display: inline-flex; align-items: center; justify-content: center;
                }
                .u-icon-btn:hover.unlock { background: rgba(16,185,129,0.08); color: rgba(4,120,87,0.85); }
                .u-icon-btn:hover.edit   { background: rgba(59,130,246,0.07); color: rgba(29,78,216,0.85); }
                .u-icon-btn:hover.del    { background: rgba(185,28,28,0.07); color: rgba(185,28,28,0.85); }

                /* ── Avatar ── */
                .u-avatar {
                    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.78rem; font-weight: 600; color: white; letter-spacing: -0.01em;
                    background: linear-gradient(135deg, rgba(185,28,28,0.7), rgba(185,28,28,0.5));
                }
                .u-avatar.locked { background: linear-gradient(135deg, rgba(150,80,20,0.35), rgba(150,80,20,0.2)); color: rgba(120,60,10,0.6); }

                /* ── Modal ── */
                .u-modal-overlay {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(20,8,0,0.18); backdrop-filter: blur(6px);
                    display: flex; align-items: center; justify-content: center; padding: 1rem;
                }
                .u-modal {
                    width: 100%; max-width: 380px;
                    background: rgba(253,248,244,0.97);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(200,140,80,0.16);
                    border-radius: 18px; padding: 2rem;
                    box-shadow: 0 20px 60px rgba(180,90,20,0.12);
                }
                .u-modal-icon {
                    width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 1.25rem;
                    display: flex; align-items: center; justify-content: center;
                }
                .u-modal-title {
                    font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: #2d1a08;
                    text-align: center; margin: 0 0 0.5rem; letter-spacing: -0.02em;
                }
                .u-modal-desc { font-size: 0.8rem; color: rgba(150,80,20,0.6); text-align: center; line-height: 1.6; margin: 0 0 1.25rem; }
                .u-modal-sub  { font-size: 0.73rem; color: rgba(150,80,20,0.45); text-align: center; margin: 0 0 1.5rem; }

                .u-modal-input {
                    width: 100%; padding: 0.7rem 0.9rem; margin-bottom: 0.4rem;
                    background: rgba(255,255,255,0.6); border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 9px; font-size: 0.84rem; color: #2d1a08;
                    font-family: 'DM Sans', sans-serif; outline: none;
                    transition: border-color 0.14s;
                }
                .u-modal-input:focus { border-color: rgba(200,140,80,0.38); background: rgba(255,255,255,0.85); }

                .u-modal-error { font-size: 0.74rem; color: rgba(185,28,28,0.8); margin: 0 0 1rem; }

                .u-modal-row { display: flex; gap: 0.6rem; margin-top: 0.5rem; }
                .u-modal-btn {
                    flex: 1; padding: 0.72rem; border-radius: 9px; font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.14s;
                    border: none; letter-spacing: -0.01em;
                }
                .u-modal-btn.cancel {
                    background: rgba(255,255,255,0.5); border: 1px solid rgba(200,140,80,0.18);
                    color: rgba(120,60,10,0.7);
                }
                .u-modal-btn.cancel:hover { background: rgba(255,255,255,0.8); }
                .u-modal-btn.confirm-del {
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9);
                }
                .u-modal-btn.confirm-del:hover { background: rgba(185,28,28,0.14); }
                .u-modal-btn.confirm-ok {
                    background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.22);
                    color: rgba(4,120,87,0.9);
                }
                .u-modal-btn.confirm-ok:hover { background: rgba(16,185,129,0.14); }

                /* ── Empty state ── */
                .u-empty { text-align: center; padding: 3.5rem 0; font-size: 0.84rem; color: rgba(150,80,20,0.45); }

                /* ── Intentos ── */
                .u-attempts { font-size: 0.71rem; color: rgba(180,100,10,0.7); margin-top: 0.25rem; }

                /* ── Scroll horizontal tabla ── */
                .u-table-scroll {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    /* Indicador sutil de que hay más contenido */
                    scrollbar-width: thin;
                    scrollbar-color: rgba(200,140,80,0.25) transparent;
                }
                .u-table-scroll::-webkit-scrollbar { height: 4px; }
                .u-table-scroll::-webkit-scrollbar-track { background: transparent; }
                .u-table-scroll::-webkit-scrollbar-thumb { background: rgba(200,140,80,0.25); border-radius: 2px; }
                .u-table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(200,140,80,0.45); }

                .u-table { min-width: 720px; } /* fuerza scroll antes de comprimir */

                /* ── Responsive ── */
                @media (max-width: 600px) {
                    .u-header-inner { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
                    .u-content { padding: 1.25rem 1rem 2.5rem; }
                    .u-title { font-size: 1.3rem; }
                    .u-thead th { padding: 0.6rem 0.875rem; white-space: nowrap; }
                    .u-tbody td  { padding: 0.75rem 0.875rem; }
                }
            `}</style>

            <div className="u-root">

                <div className="u-header">
                    <div className="u-header-inner">
                        <div>
                            <h1 className="u-title">Usuarios</h1>
                            <p className="u-subtitle">{usuarios?.total ?? 0} usuario{(usuarios?.total ?? 0) !== 1 ? 's' : ''} registrado{(usuarios?.total ?? 0) !== 1 ? 's' : ''}</p>
                        </div>
                        <Link href="/usuarios/create" className="u-btn-primary">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nuevo usuario
                        </Link>
                    </div>
                </div>

                <div className="u-content">
                    {flash?.success && <div className="u-flash">{flash.success}</div>}

                    <div className="u-glass">
                        <div className="u-table-scroll">
                            <table className="u-table">
                                <thead className="u-thead">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Permisos</th>
                                    <th>Estado</th>
                                    <th>Creado</th>
                                    <th style={{textAlign:'right'}}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="u-tbody">
                                {lista.map((u) => {
                                    const rm = rolMeta(u.rol);
                                    return (
                                        <tr key={u.id} className={u.bloqueado ? 'locked' : ''}>
                                            <td>
                                                <div style={{display:'flex', alignItems:'center', gap:'0.65rem'}}>
                                                    <div className={`u-avatar${u.bloqueado ? ' locked' : ''}`}>
                                                        {u.bloqueado
                                                            ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                                            : u.name.charAt(0).toUpperCase()
                                                        }
                                                    </div>
                                                    <div>
                                                        <p style={{margin:0, fontWeight:500, fontSize:'0.84rem', color:'#2d1a08', letterSpacing:'-0.01em'}}>{u.name}</p>
                                                        <p style={{margin:0, fontSize:'0.72rem', color:'rgba(150,80,20,0.5)'}}>{u.email}</p>
                                                        {u.bloqueado && (
                                                            <div className="u-badge-locked">
                                                                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                                                Bloqueado{u.bloqueado_hasta && ` · hasta ${u.bloqueado_hasta}`}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`u-badge ${rm.cls}`}>{rm.label}</span>
                                            </td>
                                            <td>
                                                {u.permisos.length > 0 ? (
                                                    <div>
                                                        {u.permisos.slice(0, 3).map(p => (
                                                            <span key={p} className="u-perm">{p.replace(/_/g, ' ')}</span>
                                                        ))}
                                                        {u.permisos.length > 3 && (
                                                            <span className="u-perm">+{u.permisos.length - 3}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{fontSize:'0.74rem', color:'rgba(150,80,20,0.4)', fontStyle:'italic'}}>
                                                        {u.rol === 'admin' ? 'Acceso total' : 'Sin permisos'}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div>
                                                    <button
                                                        onClick={() => toggleActivo(u.id)}
                                                        className={`u-toggle ${u.activo !== false ? 'on' : 'off'}`}
                                                        title={u.activo !== false ? 'Activo' : 'Inactivo'}
                                                    >
                                                        <span className="u-toggle-knob"/>
                                                    </button>
                                                    {!u.bloqueado && u.intentos_fallidos > 0 && (
                                                        <p className="u-attempts">{u.intentos_fallidos} intento{u.intentos_fallidos !== 1 ? 's' : ''} fallido{u.intentos_fallidos !== 1 ? 's' : ''}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{color:'rgba(120,60,10,0.55)', fontSize:'0.78rem', whiteSpace:'nowrap'}}>{u.created_at}</td>
                                            <td>
                                                <div style={{display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.25rem'}}>
                                                    {u.bloqueado && (
                                                        <button className="u-icon-btn unlock" onClick={() => setDesbloqueando(u)} title="Desbloquear">
                                                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                                                        </button>
                                                    )}
                                                    <Link href={`/usuarios/${u.id}/edit`} className="u-icon-btn edit" title="Editar">
                                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                    </Link>
                                                    <button className="u-icon-btn del" onClick={() => confirmarEliminar(u)} title="Eliminar">
                                                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                            {lista.length === 0 && <div className="u-empty">No hay usuarios registrados.</div>}
                        </div>  {/* u-table-scroll */}
                        {(usuarios?.total ?? 0) > (usuarios?.per_page ?? 20) && (
                            <div style={{padding:'0.875rem 1.25rem',borderTop:'1px solid rgba(200,140,80,0.08)'}}>
                                <Pagination
                                    currentPage={usuarios?.current_page ?? 1}
                                    totalItems={usuarios?.total ?? 0}
                                    perPage={usuarios?.per_page ?? 20}
                                    onPageChange={(page) => router.get('/usuarios', { search: filters.search, page }, { preserveState: true })}
                                    accentColor="blue"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Desbloquear */}
            {desbloqueando && (
                <div className="u-modal-overlay" onClick={() => setDesbloqueando(null)}>
                    <div className="u-modal" onClick={e => e.stopPropagation()}>
                        <div className="u-modal-icon" style={{background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.18)'}}>
                            <svg width="20" height="20" fill="none" stroke="rgba(4,120,87,0.8)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                        </div>
                        <h3 className="u-modal-title">Desbloquear cuenta</h3>
                        <p className="u-modal-desc">
                            La cuenta de <strong style={{color:'#2d1a08'}}>{desbloqueando.name}</strong> está bloqueada
                            por {desbloqueando.intentos_fallidos} intentos fallidos.
                        </p>
                        {desbloqueando.bloqueado_hasta && (
                            <p className="u-modal-sub">Se desbloquearía automáticamente el {desbloqueando.bloqueado_hasta}.</p>
                        )}
                        <div className="u-modal-row">
                            <button className="u-modal-btn cancel" onClick={() => setDesbloqueando(null)}>Cancelar</button>
                            <button className="u-modal-btn confirm-ok" onClick={ejecutarDesbloquear}>Desbloquear</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {eliminando && (
                <div className="u-modal-overlay" onClick={() => setEliminando(null)}>
                    <div className="u-modal" onClick={e => e.stopPropagation()}>
                        <div className="u-modal-icon" style={{background:'rgba(185,28,28,0.07)', border:'1px solid rgba(185,28,28,0.18)'}}>
                            <svg width="20" height="20" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </div>
                        <h3 className="u-modal-title">Eliminar usuario</h3>
                        <p className="u-modal-desc">
                            Vas a eliminar a <strong style={{color:'#2d1a08'}}>{eliminando.name}</strong> de forma permanente. Confirma con tu contraseña de administrador.
                        </p>
                        <input
                            type="password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            className="u-modal-input"
                        />
                        {error && <p className="u-modal-error">{error}</p>}
                        <div className="u-modal-row">
                            <button className="u-modal-btn cancel" onClick={() => setEliminando(null)}>Cancelar</button>
                            <button className="u-modal-btn confirm-del" onClick={ejecutarEliminar}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
