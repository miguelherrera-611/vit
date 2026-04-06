import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';

export default function ProveedoresCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre:    '',
        empresa:   '',
        email:     '',
        telefono:  '',
        documento: '',
        direccion: '',
        sitio_web: '',
        activo:    true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/proveedores');
    };

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

                .pv-form-wrap { max-width: 760px; margin: 0 auto; padding: 2rem 1.25rem 4rem; font-family: 'Inter', sans-serif; }

                .pv-back-row {
                    display: flex; align-items: center; gap: 0.6rem;
                    margin-bottom: 1.75rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }
                .pv-back-btn {
                    width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(200,140,80,0.18);
                    background: rgba(255,255,255,0.45); display: flex; align-items: center; justify-content: center;
                    cursor: pointer; text-decoration: none; transition: all 0.13s; flex-shrink: 0;
                }
                .pv-back-btn:hover { background: rgba(255,255,255,0.7); border-color: rgba(200,140,80,0.3); }

                .pv-section {
                    background: rgba(255,255,255,0.45); border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px; padding: 1.75rem; margin-bottom: 0.875rem;
                    animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
                }

                .pv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; margin-bottom: 0.875rem; }
                .pv-field { margin-bottom: 0.875rem; }
                .pv-field:last-child { margin-bottom: 0; }

                .ck-label {
                    display: block; font-size: 0.68rem; font-weight: 500;
                    color: rgba(150,80,20,0.5); text-transform: uppercase;
                    letter-spacing: 0.07em; margin-bottom: 0.4rem;
                }
                .ck-input {
                    width: 100%; padding: 0.72rem 0.875rem;
                    background: rgba(255,255,255,0.55); border: 1px solid rgba(200,140,80,0.2);
                    border-radius: 10px; font-size: 0.84rem; color: #2d1a08;
                    font-family: 'Inter', sans-serif; outline: none; transition: all 0.15s; letter-spacing: -0.01em;
                }
                .ck-input::placeholder { color: rgba(180,100,30,0.3); }
                .ck-input:focus { background: rgba(255,255,255,0.8); border-color: rgba(200,140,80,0.38); box-shadow: 0 0 0 3px rgba(200,140,80,0.06); }
                .ck-error { margin-top: 0.3rem; font-size: 0.74rem; color: rgba(185,28,28,0.8); }

                .toggle-wrap {
                    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
                }
                .toggle-track {
                    width: 40px; height: 22px; border-radius: 11px; position: relative; cursor: pointer;
                    transition: background 0.18s, border-color 0.18s; flex-shrink: 0; border: 1px solid transparent;
                }
                .toggle-track.on  { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.3); }
                .toggle-track.off { background: rgba(200,140,80,0.07); border-color: rgba(200,140,80,0.2); }
                .toggle-thumb {
                    width: 16px; height: 16px; border-radius: 50%; position: absolute; top: 2px; transition: transform 0.18s, background 0.18s;
                }
                .toggle-thumb.on  { transform: translateX(20px); background: rgba(4,120,87,0.85); }
                .toggle-thumb.off { transform: translateX(2px);  background: rgba(150,80,20,0.35); }

                .btn-row { display: flex; gap: 0.75rem; margin-top: 0.25rem; animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .btn-submit {
                    flex: 1; padding: 0.78rem 1.5rem; border-radius: 10px; cursor: pointer;
                    font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 500;
                    background: rgba(185,28,28,0.08); border: 1px solid rgba(185,28,28,0.22);
                    color: rgba(185,28,28,0.9); transition: all 0.15s; letter-spacing: -0.01em;
                }
                .btn-submit:hover:not(:disabled) { background: rgba(185,28,28,0.13); border-color: rgba(185,28,28,0.35); }
                .btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
                .btn-cancel {
                    padding: 0.75rem 1.35rem; border-radius: 10px;
                    background: rgba(255,255,255,0.4); border: 1px solid rgba(200,140,80,0.18);
                    color: rgba(120,60,10,0.65); font-family: 'Inter', sans-serif; font-size: 0.84rem; font-weight: 400;
                    text-decoration: none; display: inline-flex; align-items: center; justify-content: center;
                    transition: all 0.13s; letter-spacing: -0.01em; cursor: pointer;
                }
                .btn-cancel:hover { background: rgba(255,255,255,0.65); }

                @media (max-width: 560px) {
                    .pv-form-wrap { padding: 1.5rem 1rem 3rem; }
                    .pv-grid-2 { grid-template-columns: 1fr; }
                    .pv-section { padding: 1.25rem; }
                    .btn-row { flex-direction: column-reverse; }
                    .btn-cancel { text-align: center; }
                }
            `}</style>

            <div className="pv-form-wrap">

                {/* Back */}
                <div className="pv-back-row">
                    <Link href="/proveedores" className="pv-back-btn">
                        <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.55)" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </Link>
                    <div>
                        <p style={{fontSize:'0.68rem',fontWeight:'500',color:'rgba(150,80,20,0.45)',letterSpacing:'0.08em',textTransform:'uppercase',margin:0}}>
                            Proveedores
                        </p>
                        <h1 style={{fontSize:'clamp(1.25rem,3vw,1.6rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',margin:'0.1rem 0 0'}}>
                            Nuevo proveedor
                        </h1>
                    </div>
                </div>

                <form onSubmit={submit}>

                    {/* Información personal */}
                    <div className="pv-section">
                        <p style={{fontSize:'0.75rem',fontWeight:'500',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'1.25rem'}}>
                            Información personal
                        </p>

                        <div className="pv-grid-2">
                            <div>
                                <label className="ck-label">Nombre <span style={{color:'rgba(185,28,28,0.7)'}}>*</span></label>
                                <input className="ck-input" type="text" value={data.nombre}
                                       onChange={(e) => setData('nombre', e.target.value)}
                                       placeholder="Nombre completo"/>
                                {errors.nombre && <p className="ck-error">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="ck-label">Empresa</label>
                                <input className="ck-input" type="text" value={data.empresa}
                                       onChange={(e) => setData('empresa', e.target.value)}
                                       placeholder="Nombre de la empresa"/>
                                {errors.empresa && <p className="ck-error">{errors.empresa}</p>}
                            </div>
                            <div>
                                <label className="ck-label">Correo electrónico</label>
                                <input className="ck-input" type="email" value={data.email}
                                       onChange={(e) => setData('email', e.target.value)}
                                       placeholder="correo@empresa.com"/>
                                {errors.email && <p className="ck-error">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="ck-label">Teléfono</label>
                                <input className="ck-input" type="text" value={data.telefono}
                                       onChange={(e) => setData('telefono', e.target.value)}
                                       placeholder="300 000 0000"/>
                                {errors.telefono && <p className="ck-error">{errors.telefono}</p>}
                            </div>
                            <div>
                                <label className="ck-label">NIT / Documento</label>
                                <input className="ck-input" type="text" value={data.documento}
                                       onChange={(e) => setData('documento', e.target.value)}
                                       placeholder="NIT o cédula"/>
                                {errors.documento && <p className="ck-error">{errors.documento}</p>}
                            </div>
                            <div>
                                <label className="ck-label">Sitio web</label>
                                <input className="ck-input" type="url" value={data.sitio_web}
                                       onChange={(e) => setData('sitio_web', e.target.value)}
                                       placeholder="https://empresa.com"/>
                                {errors.sitio_web && <p className="ck-error">{errors.sitio_web}</p>}
                            </div>
                        </div>

                        <div className="pv-field">
                            <label className="ck-label">Dirección</label>
                            <input className="ck-input" type="text" value={data.direccion}
                                   onChange={(e) => setData('direccion', e.target.value)}
                                   placeholder="Dirección completa"/>
                            {errors.direccion && <p className="ck-error">{errors.direccion}</p>}
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="pv-section" style={{animationDelay:'0.05s'}}>
                        <div className="toggle-wrap">
                            <div>
                                <p style={{fontSize:'0.75rem',fontWeight:'500',color:'rgba(150,80,20,0.5)',textTransform:'uppercase',letterSpacing:'0.07em',margin:'0 0 0.2rem'}}>
                                    Estado
                                </p>
                                <p style={{fontSize:'0.8rem',color:'rgba(120,60,10,0.6)',margin:0}}>
                                    {data.activo ? 'El proveedor estará disponible para asociar con productos' : 'El proveedor estará inactivo'}
                                </p>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:'0.6rem',flexShrink:0}}>
                                <span style={{fontSize:'0.78rem',color: data.activo ? 'rgba(4,120,87,0.75)' : 'rgba(150,80,20,0.5)'}}>
                                    {data.activo ? 'Activo' : 'Inactivo'}
                                </span>
                                <div className={`toggle-track ${data.activo ? 'on' : 'off'}`}
                                     onClick={() => setData('activo', !data.activo)}>
                                    <input type="checkbox" checked={data.activo} onChange={() => {}} style={{display:'none'}}/>
                                    <div className={`toggle-thumb ${data.activo ? 'on' : 'off'}`}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="btn-row">
                        <Link href="/proveedores" className="btn-cancel">Cancelar</Link>
                        <button type="submit" className="btn-submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Crear proveedor'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
