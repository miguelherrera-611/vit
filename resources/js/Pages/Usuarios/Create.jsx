import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const PERMISOS_INFO = {
    ver_productos:             { desc: 'Ver el catálogo de productos' },
    crear_productos:           { desc: 'Crear nuevos productos' },
    editar_productos:          { desc: 'Editar productos existentes' },
    eliminar_productos:        { desc: 'Eliminar productos' },
    ver_inventario:            { desc: 'Consultar stock actual' },
    ajustar_inventario:        { desc: 'Realizar ajustes de inventario' },
    ver_kardex:                { desc: 'Ver historial de movimientos por producto' },
    ver_ventas:                { desc: 'Ver historial de ventas' },
    crear_ventas:              { desc: 'Registrar nuevas ventas' },
    anular_ventas:             { desc: 'Anular ventas registradas' },
    ver_cartera:               { desc: 'Ver deudas y cartera activa' },
    ver_abonos:                { desc: 'Consultar historial de abonos' },
    crear_abonos:              { desc: 'Registrar abonos y pagos parciales' },
    gestionar_clientes:        { desc: 'Gestionar base de clientes' },
    ver_proveedores:           { desc: 'Ver listado de proveedores' },
    crear_proveedores:         { desc: 'Agregar nuevos proveedores' },
    editar_proveedores:        { desc: 'Editar proveedores existentes' },
    ver_reportes_ventas:       { desc: 'Ver reportes de ventas por período' },
    ver_reportes_inventario:   { desc: 'Ver reportes de inventario y stock' },
    ver_reportes_financieros:  { desc: 'Ver reportes financieros' },
    ver_reportes_clientes:     { desc: 'Ver reportes de clientes' },
    ver_reportes_rentabilidad: { desc: 'Ver márgenes y rentabilidad' },
    ver_reportes_categorias:   { desc: 'Ver ventas por categoría' },
    ver_reportes_ejecutivo:    { desc: 'Ver dashboard gerencial' },
    gestionar_categorias:      { desc: 'Gestionar grupos y subcategorías' },
    gestionar_papelera:        { desc: 'Restaurar elementos eliminados' },
    ver_registros:             { desc: 'Ver registros de auditoría' },
};

const PERMISOS_DEFAULT_EMPLEADO = [
    'ver_productos','ver_inventario','ver_ventas','crear_ventas',
    'gestionar_clientes','ver_abonos','crear_abonos','ver_cartera','ver_reportes_ventas',
];

export default function UsuariosCreate({ permisos_disponibles, permisos_default }) {
    const defaultPermisos = permisos_default ?? PERMISOS_DEFAULT_EMPLEADO;

    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        rol:                   'empleado',
        permisos:              [],
    });

    const togglePermiso       = (key) => setData('permisos', data.permisos.includes(key) ? data.permisos.filter(p => p !== key) : [...data.permisos, key]);
    const aplicarPredeterminados = () => setData('permisos', defaultPermisos);
    const seleccionarTodos    = () => setData('permisos', permisos_disponibles.map(p => p.key));
    const quitarTodos         = () => setData('permisos', []);
    const submit              = (e) => { e.preventDefault(); post('/usuarios'); };
    const esAdmin             = data.rol === 'admin';

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600&family=DM+Serif+Display&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .uf-root {
                    min-height:100vh; font-family:'DM Sans',sans-serif;
                    background:
                        radial-gradient(ellipse 70% 55% at 5% 0%,rgba(255,215,175,0.18) 0%,transparent 55%),
                        radial-gradient(ellipse 55% 50% at 95% 100%,rgba(255,195,145,0.13) 0%,transparent 55%),
                        linear-gradient(150deg,#fdf6f0 0%,#fdf3ec 40%,#fef5ef 70%,#fef8f4 100%);
                }
                .uf-header {
                    background:rgba(253,246,240,0.75); backdrop-filter:blur(28px) saturate(160%);
                    border-bottom:1px solid rgba(200,140,80,0.1); position:sticky; top:0; z-index:40;
                }
                .uf-header-inner { max-width:900px; margin:0 auto; padding:1.25rem 1.5rem; display:flex; align-items:center; gap:1rem; }
                .uf-back {
                    width:32px; height:32px; border-radius:8px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    background:rgba(255,255,255,0.4); border:1px solid rgba(200,140,80,0.15);
                    color:rgba(150,80,20,0.55); text-decoration:none; transition:all 0.14s;
                }
                .uf-back:hover { background:rgba(255,255,255,0.7); }
                .uf-h1 { font-family:'DM Serif Display',serif; font-size:1.5rem; color:#2d1a08; letter-spacing:-0.02em; margin:0; }
                .uf-sub { font-size:0.76rem; color:rgba(150,80,20,0.5); margin:0.1rem 0 0; }

                .uf-content { max-width:900px; margin:0 auto; padding:2rem 1.5rem 3rem; display:flex; flex-direction:column; gap:1rem; }

                .uf-section {
                    background:rgba(255,255,255,0.48); backdrop-filter:blur(20px) saturate(150%);
                    border:1px solid rgba(200,140,80,0.12); border-radius:16px; padding:1.75rem;
                    box-shadow:0 4px 24px rgba(180,90,20,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
                    animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .uf-step-num {
                    width:26px; height:26px; border-radius:7px; flex-shrink:0;
                    display:flex; align-items:center; justify-content:center;
                    font-size:0.72rem; font-weight:600;
                    background:rgba(185,28,28,0.08); border:1px solid rgba(185,28,28,0.18); color:rgba(185,28,28,0.8);
                }
                .uf-section-title { display:flex; align-items:center; gap:0.65rem; font-size:0.9rem; font-weight:500; color:#2d1a08; letter-spacing:-0.01em; margin:0 0 1.4rem; }

                .uf-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
                .uf-field  { display:flex; flex-direction:column; gap:0.35rem; }
                .uf-label  { font-size:0.67rem; font-weight:600; color:rgba(150,80,20,0.45); text-transform:uppercase; letter-spacing:0.07em; }
                .uf-input  {
                    padding:0.72rem 0.9rem; background:rgba(255,255,255,0.55);
                    border:1px solid rgba(200,140,80,0.18); border-radius:9px;
                    font-size:0.84rem; color:#2d1a08; font-family:'DM Sans',sans-serif; outline:none; transition:all 0.14s;
                }
                .uf-input:focus { background:rgba(255,255,255,0.85); border-color:rgba(200,140,80,0.38); box-shadow:0 0 0 3px rgba(200,140,80,0.06); }
                .uf-input::placeholder { color:rgba(180,100,30,0.3); }
                .uf-error { font-size:0.73rem; color:rgba(185,28,28,0.8); margin:0; }

                .uf-roles-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
                .uf-role-card {
                    padding:1.25rem; border-radius:12px; cursor:pointer; text-align:left;
                    border:1.5px solid rgba(200,140,80,0.15); background:rgba(255,255,255,0.35);
                    transition:all 0.16s; font-family:'DM Sans',sans-serif;
                }
                .uf-role-card:hover { background:rgba(255,255,255,0.55); border-color:rgba(200,140,80,0.28); }
                .uf-role-card.admin-sel { background:rgba(185,28,28,0.05); border-color:rgba(185,28,28,0.28); }
                .uf-role-card.emp-sel   { background:rgba(59,130,246,0.05); border-color:rgba(59,130,246,0.25); }
                .uf-role-icon { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:0.85rem; }
                .uf-role-name { font-size:0.88rem; font-weight:500; color:#2d1a08; margin:0 0 0.2rem; letter-spacing:-0.01em; }
                .uf-role-check { font-size:0.69rem; font-weight:500; margin:0 0 0.3rem; }
                .uf-role-desc  { font-size:0.76rem; color:rgba(150,80,20,0.55); margin:0; line-height:1.5; }

                .uf-info-box {
                    padding:1rem 1.1rem; border-radius:10px;
                    background:rgba(185,28,28,0.04); border:1px solid rgba(185,28,28,0.12);
                    display:flex; align-items:flex-start; gap:0.6rem;
                    font-size:0.8rem; color:rgba(150,28,28,0.75); line-height:1.55;
                }

                .uf-perms-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.5rem; }
                .uf-perms-actions { display:flex; gap:0.45rem; flex-wrap:wrap; }
                .uf-perms-desc { font-size:0.77rem; color:rgba(150,80,20,0.55); margin:0 0 1.25rem; line-height:1.55; }

                .uf-perm-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
                .uf-perm-item {
                    display:flex; align-items:flex-start; gap:0.65rem;
                    padding:0.8rem 0.9rem; border-radius:10px; cursor:pointer;
                    border:1.5px solid rgba(200,140,80,0.12); background:rgba(255,255,255,0.3);
                    transition:all 0.14s; text-align:left; font-family:'DM Sans',sans-serif;
                }
                .uf-perm-item:hover { background:rgba(255,255,255,0.55); border-color:rgba(200,140,80,0.22); }
                .uf-perm-item.active { background:rgba(16,185,129,0.05); border-color:rgba(16,185,129,0.22); }
                .uf-perm-check {
                    width:17px; height:17px; border-radius:5px; flex-shrink:0; margin-top:0.08rem;
                    border:1.5px solid rgba(200,140,80,0.28); background:rgba(255,255,255,0.5);
                    display:flex; align-items:center; justify-content:center; transition:all 0.14s;
                }
                .uf-perm-item.active .uf-perm-check { background:rgba(16,185,129,0.12); border-color:rgba(16,185,129,0.35); }
                .uf-perm-label { font-size:0.8rem; font-weight:500; color:#2d1a08; margin:0 0 0.1rem; letter-spacing:-0.01em; }
                .uf-perm-item.active .uf-perm-label { color:rgba(4,120,87,0.85); }
                .uf-perm-desc  { font-size:0.7rem; color:rgba(150,80,20,0.5); margin:0; line-height:1.4; }
                .uf-default-tag {
                    display:inline-block; padding:0.1rem 0.4rem; border-radius:4px; margin-left:0.3rem;
                    font-size:0.61rem; font-weight:600;
                    background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.18); color:rgba(4,120,87,0.7);
                }
                .uf-perm-count {
                    margin-top:0.875rem; padding:0.6rem 0.9rem; border-radius:9px;
                    background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.15);
                    font-size:0.79rem; color:rgba(4,120,87,0.8);
                }

                .uf-tag-btn {
                    padding:0.3rem 0.7rem; border-radius:7px; font-family:'DM Sans',sans-serif;
                    font-size:0.72rem; font-weight:500; cursor:pointer; transition:all 0.14s;
                    border:1px solid; letter-spacing:-0.01em;
                }
                .uf-tag-btn.preset { background:rgba(16,185,129,0.07); border-color:rgba(16,185,129,0.22); color:rgba(4,120,87,0.8); }
                .uf-tag-btn.preset:hover { background:rgba(16,185,129,0.13); }
                .uf-tag-btn.all    { background:rgba(59,130,246,0.06); border-color:rgba(59,130,246,0.18); color:rgba(29,78,216,0.8); }
                .uf-tag-btn.all:hover { background:rgba(59,130,246,0.12); }
                .uf-tag-btn.none   { background:rgba(200,140,80,0.06); border-color:rgba(200,140,80,0.18); color:rgba(120,60,10,0.65); }
                .uf-tag-btn.none:hover { background:rgba(200,140,80,0.12); }

                .uf-actions-row { display:flex; gap:0.75rem; }
                .uf-btn-cancel {
                    flex:1; padding:0.78rem; border-radius:10px; font-family:'DM Sans',sans-serif;
                    font-size:0.84rem; font-weight:500; cursor:pointer; text-align:center;
                    background:rgba(255,255,255,0.45); border:1px solid rgba(200,140,80,0.18);
                    color:rgba(120,60,10,0.7); text-decoration:none; transition:all 0.14s; display:block;
                }
                .uf-btn-cancel:hover { background:rgba(255,255,255,0.75); }
                .uf-btn-submit {
                    flex:1; padding:0.78rem; border-radius:10px; font-family:'DM Sans',sans-serif;
                    font-size:0.84rem; font-weight:500; cursor:pointer;
                    background:rgba(185,28,28,0.08); border:1px solid rgba(185,28,28,0.22);
                    color:rgba(185,28,28,0.9); transition:all 0.14s;
                }
                .uf-btn-submit:hover:not(:disabled) { background:rgba(185,28,28,0.14); border-color:rgba(185,28,28,0.35); }
                .uf-btn-submit:disabled { opacity:0.4; cursor:not-allowed; }

                @media (max-width:700px) {
                    .uf-grid-2 { grid-template-columns:1fr; }
                    .uf-roles-grid { grid-template-columns:1fr; }
                    .uf-perm-grid  { grid-template-columns:1fr; }
                    .uf-content { padding:1.25rem 1rem 2.5rem; }
                    .uf-section { padding:1.25rem; }
                    .uf-h1 { font-size:1.25rem; }
                    .uf-perms-header { flex-direction:column; align-items:flex-start; }
                }
                @media (max-width:400px) {
                    .uf-actions-row { flex-direction:column; }
                }
            `}</style>

            <div className="uf-root">
                <div className="uf-header">
                    <div className="uf-header-inner">
                        <Link href="/usuarios" className="uf-back">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                        </Link>
                        <div>
                            <h1 className="uf-h1">Nuevo usuario</h1>
                            <p className="uf-sub">Completa los datos y configura los permisos</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="uf-content">

                        {/* Paso 1 — Datos */}
                        <div className="uf-section">
                            <h2 className="uf-section-title">
                                <span className="uf-step-num">1</span>
                                Datos del usuario
                            </h2>
                            <div className="uf-grid-2">
                                <div className="uf-field">
                                    <label className="uf-label">Nombre completo</label>
                                    <input className="uf-input" type="text" value={data.name}
                                           onChange={e => setData('name', e.target.value)} placeholder="María González"/>
                                    {errors.name && <p className="uf-error">{errors.name}</p>}
                                </div>
                                <div className="uf-field">
                                    <label className="uf-label">Correo electrónico</label>
                                    <input className="uf-input" type="email" value={data.email}
                                           onChange={e => setData('email', e.target.value)} placeholder="correo@ejemplo.com"/>
                                    {errors.email && <p className="uf-error">{errors.email}</p>}
                                </div>
                                <div className="uf-field">
                                    <label className="uf-label">Contraseña</label>
                                    <input className="uf-input" type="password" value={data.password}
                                           onChange={e => setData('password', e.target.value)} placeholder="Mínimo 8 caracteres"/>
                                    {errors.password && <p className="uf-error">{errors.password}</p>}
                                </div>
                                <div className="uf-field">
                                    <label className="uf-label">Confirmar contraseña</label>
                                    <input className="uf-input" type="password" value={data.password_confirmation}
                                           onChange={e => setData('password_confirmation', e.target.value)} placeholder="Repite la contraseña"/>
                                </div>
                            </div>
                        </div>

                        {/* Paso 2 — Rol */}
                        <div className="uf-section" style={{animationDelay:'0.05s'}}>
                            <h2 className="uf-section-title">
                                <span className="uf-step-num">2</span>
                                Rol del usuario
                            </h2>
                            <div className="uf-roles-grid">
                                <button type="button"
                                        className={`uf-role-card ${data.rol === 'admin' ? 'admin-sel' : ''}`}
                                        onClick={() => { setData('rol', 'admin'); setData('permisos', []); }}>
                                    <div className="uf-role-icon" style={{background:'rgba(185,28,28,0.07)', border:'1px solid rgba(185,28,28,0.16)'}}>
                                        <svg width="16" height="16" fill="none" stroke="rgba(185,28,28,0.75)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    </div>
                                    <p className="uf-role-name">Administrador</p>
                                    {data.rol === 'admin' && <p className="uf-role-check" style={{color:'rgba(185,28,28,0.7)'}}>Seleccionado</p>}
                                    <p className="uf-role-desc">Acceso total al sistema. Gestiona usuarios, inventario, reportes y configuración.</p>
                                </button>
                                <button type="button"
                                        className={`uf-role-card ${data.rol === 'empleado' ? 'emp-sel' : ''}`}
                                        onClick={() => setData('rol', 'empleado')}>
                                    <div className="uf-role-icon" style={{background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.16)'}}>
                                        <svg width="16" height="16" fill="none" stroke="rgba(59,130,246,0.75)" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    </div>
                                    <p className="uf-role-name">Empleado / Vendedor</p>
                                    {data.rol === 'empleado' && <p className="uf-role-check" style={{color:'rgba(59,130,246,0.7)'}}>Seleccionado</p>}
                                    <p className="uf-role-desc">Acceso limitado. Los permisos se configuran a continuación.</p>
                                </button>
                            </div>
                            {errors.rol && <p className="uf-error" style={{marginTop:'0.5rem'}}>{errors.rol}</p>}
                        </div>

                        {/* Paso 3 — Permisos */}
                        {!esAdmin && (
                            <div className="uf-section" style={{animationDelay:'0.1s'}}>
                                <div className="uf-perms-header">
                                    <h2 className="uf-section-title" style={{margin:0}}>
                                        <span className="uf-step-num">3</span>
                                        Permisos del empleado
                                    </h2>
                                    <div className="uf-perms-actions">
                                        <button type="button" className="uf-tag-btn preset" onClick={aplicarPredeterminados}>Predeterminados</button>
                                        <button type="button" className="uf-tag-btn all"    onClick={seleccionarTodos}>Todos</button>
                                        <button type="button" className="uf-tag-btn none"   onClick={quitarTodos}>Ninguno</button>
                                    </div>
                                </div>
                                <p className="uf-perms-desc" style={{marginTop:'0.75rem'}}>
                                    Selecciona qué módulos puede usar este empleado. <strong style={{color:'rgba(4,120,87,0.75)'}}>Predeterminados</strong> aplica los permisos esenciales de un vendedor.
                                </p>
                                <div className="uf-perm-grid">
                                    {permisos_disponibles.map(({ key, label }) => {
                                        const info    = PERMISOS_INFO[key] || { desc: '' };
                                        const activo  = data.permisos.includes(key);
                                        const esDef   = defaultPermisos.includes(key);
                                        return (
                                            <button key={key} type="button"
                                                    className={`uf-perm-item ${activo ? 'active' : ''}`}
                                                    onClick={() => togglePermiso(key)}>
                                                <div className="uf-perm-check">
                                                    {activo && <svg width="10" height="10" fill="none" stroke="rgba(4,120,87,0.75)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                                                </div>
                                                <div>
                                                    <p className="uf-perm-label">
                                                        {label}
                                                        {esDef && <span className="uf-default-tag">base</span>}
                                                    </p>
                                                    <p className="uf-perm-desc">{info.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {data.permisos.length > 0 && (
                                    <div className="uf-perm-count">{data.permisos.length} permiso{data.permisos.length !== 1 ? 's' : ''} seleccionado{data.permisos.length !== 1 ? 's' : ''}</div>
                                )}
                            </div>
                        )}

                        {esAdmin && (
                            <div className="uf-info-box">
                                <svg width="16" height="16" fill="none" stroke="rgba(185,28,28,0.6)" strokeWidth="1.8" viewBox="0 0 24 24" style={{flexShrink:0,marginTop:'0.05rem'}}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span><strong>Administrador:</strong> este rol tiene acceso completo al sistema y no requiere configuración de permisos.</span>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="uf-actions-row">
                            <Link href="/usuarios" className="uf-btn-cancel">Cancelar</Link>
                            <button type="submit" className="uf-btn-submit" disabled={processing}>
                                {processing ? 'Creando...' : 'Crear usuario'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
