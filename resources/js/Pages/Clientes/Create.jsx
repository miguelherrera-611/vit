import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import GlassDateInput from '@/Components/GlassDateInput';

export default function ClientesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento: '',
        direccion: '',
        fecha_nacimiento: '',
        activo: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <AppLayout>
            <style>{`
                .cl-page{
                    min-height:100vh;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),
                        linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%);
                }
                .cl-header{background:rgba(255,255,255,.08);backdrop-filter:blur(40px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.68)}
                .cl-shell{max-width:980px;margin:0 auto;padding:1.5rem 1rem 2.5rem}
                .cl-card{
                    background:rgba(255,255,255,.04);backdrop-filter:blur(22px) saturate(150%);
                    border:1px solid rgba(255,255,255,.65);border-radius:20px;
                    box-shadow:0 16px 48px rgba(180,90,20,.1),0 4px 14px rgba(180,90,20,.06),inset 0 1.5px 0 rgba(255,255,255,.88)
                }
                .cl-input{width:100%;padding:.72rem .9rem;border:1px solid rgba(200,140,80,.4);border-radius:11px;background:rgba(255,255,255,.06);color:#2d1a08}
                .cl-input:focus{outline:none;border-color:rgba(200,140,80,.65);box-shadow:0 0 0 3px rgba(220,38,38,.05)}
                .cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
                .cl-actions{display:flex;gap:.75rem}
                .cl-btn-main{flex:1;padding:.78rem 1rem;border-radius:12px;border:1px solid rgba(220,38,38,.4);background:rgba(220,38,38,.1);color:rgba(185,28,28,.95);font-weight:600}
                .cl-btn-main:hover{background:rgba(220,38,38,.16)}
                .cl-btn-sec{flex:1;text-align:center;padding:.78rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,.65);background:rgba(255,255,255,.06);color:rgba(120,60,10,.8);text-decoration:none;font-weight:600}
                .cl-chip{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.28);color:rgba(185,28,28,.9)}
                @media (max-width:768px){.cl-grid{grid-template-columns:1fr}.cl-actions{flex-direction:column}.cl-shell{padding:1rem .85rem 2rem}}
            `}</style>

            <div className="cl-page">
                <div className="cl-header">
                    <div className="cl-shell" style={{paddingBottom:'1rem'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                            <Link href="/clientes" style={{padding:'0.55rem',borderRadius:'10px',border:'1px solid rgba(255,255,255,.65)',background:'rgba(255,255,255,.1)',color:'rgba(150,80,20,.6)'}}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{fontSize:'clamp(1.35rem,3vw,1.9rem)',fontWeight:'300',color:'#2d1a08'}}>Nuevo Cliente</h1>
                                <p style={{fontSize:'0.82rem',color:'rgba(120,60,10,.58)'}}>Registra la información del cliente</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cl-shell">
                    <form onSubmit={submit}>
                        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                            <div className="cl-card" style={{padding:'1.15rem'}}>
                                <h2 style={{fontSize:'0.95rem',fontWeight:'600',color:'#2d1a08',marginBottom:'1rem'}}>Datos Personales</h2>
                                <div className="cl-grid">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className="cl-input"
                                            placeholder="Nombre"
                                        />
                                        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                                        <input
                                            type="text"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            className="cl-input"
                                            placeholder="Apellido"
                                        />
                                        {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                            className="cl-input"
                                            placeholder="300 000 0000"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">El teléfono debe ser único</p>
                                        {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="cl-input"
                                            placeholder="correo@ejemplo.com"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Documento</label>
                                        <input
                                            type="text"
                                            value={data.documento}
                                            onChange={(e) => setData('documento', e.target.value)}
                                            className="cl-input"
                                            placeholder="Cédula o documento"
                                        />
                                        {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                                        <GlassDateInput
                                            value={data.fecha_nacimiento}
                                            onChange={(val) => setData('fecha_nacimiento', val)}
                                            placeholder="dd/mm/aaaa"
                                        />
                                        {errors.fecha_nacimiento && <p className="mt-1 text-sm text-red-600">{errors.fecha_nacimiento}</p>}
                                    </div>
                                    <div style={{gridColumn:'1 / -1'}}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                                        <input
                                            type="text"
                                            value={data.direccion}
                                            onChange={(e) => setData('direccion', e.target.value)}
                                            className="cl-input"
                                            placeholder="Dirección completa"
                                        />
                                        {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="cl-card" style={{padding:'1rem'}}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">Estado del Cliente</h2>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="sr-only" />
                                            <div className={`w-12 h-6 rounded-full transition-colors ${data.activo ? 'cl-chip' : 'bg-gray-300'}`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow mt-0.5 transition-transform ${data.activo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">{data.activo ? 'Activo' : 'Inactivo'}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="cl-actions">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="cl-btn-main"
                                >
                                    {processing ? 'Guardando...' : 'Crear Cliente'}
                                </button>
                                <Link href="/clientes" className="cl-btn-sec">
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
