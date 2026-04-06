import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';

export default function AbonosHistorial({ venta }) {
    const fmt = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

    const estadoColor = (e) =>
        ({ Completada: 'bg-green-100 text-green-800', Pendiente: 'bg-yellow-100 text-yellow-800', Cancelada: 'bg-red-100 text-red-800' }[e] ?? 'bg-gray-100 text-gray-700');

    // Badge según tipo de movimiento
    const tipoBadge = (abono) => {
        if (abono.es_ajuste) {
            return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Ajuste</span>;
        }
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Abono</span>;
    };

    const porcentajePagado = venta.total > 0 ? Math.min(100, Math.round((venta.pagado / venta.total) * 100)) : 0;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                .ah-bg{
                    min-height:100vh;font-family:'Inter',sans-serif;
                    background:
                        radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.14) 0%, transparent 55%),
                        linear-gradient(145deg,#fdf7f2 0%,#fdf5ef 35%,#fef7f2 70%,#fef9f6 100%);
                }
                .ah-header{
                    background:rgba(255,255,255,.08);
                    backdrop-filter:blur(40px) saturate(180%);
                    border-bottom:1px solid rgba(255,255,255,.68);
                }
                .ah-shell{max-width:980px;margin:0 auto;padding:1.25rem .9rem 2.2rem}
                .ah-card{
                    background:rgba(255,255,255,.04);
                    backdrop-filter:blur(22px) saturate(150%);
                    border:1px solid rgba(255,255,255,.65);
                    border-radius:18px;
                    box-shadow:0 12px 40px rgba(180,90,20,.07), inset 0 1.5px 0 rgba(255,255,255,.88);
                }
                @media (min-width:768px){ .ah-shell{padding:1.8rem 1.3rem 2.8rem} }
                @media (max-width:640px){
                    .ah-head-row{flex-direction:column;align-items:flex-start !important;gap:.6rem}
                    .ah-grid-3{grid-template-columns:1fr !important}
                    .ah-prod-row{padding:.7rem .9rem !important}
                    .ah-mov-row{padding:.75rem .9rem !important}
                    .ah-mov-top{flex-direction:column;align-items:flex-start !important;gap:.45rem}
                }
            `}</style>

            <div className="ah-bg">
                <div className="ah-header">
                    <div className="ah-shell" style={{paddingBottom:'1rem'}}>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link href="/abonos" className="p-2 rounded-lg transition" style={{color:'rgba(120,60,10,.65)',background:'rgba(255,255,255,.18)',border:'1px solid rgba(200,140,80,.18)'}}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 style={{fontSize:'clamp(1.35rem,3vw,1.9rem)',fontWeight:300,color:'#2d1a08'}}>Historial de Abonos</h1>
                                <p style={{fontSize:'.82rem',color:'rgba(150,80,20,.55)'}}>Venta {venta.numero_venta} — {venta.cliente}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ah-shell space-y-4 sm:space-y-6">

                    <div className="ah-card p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4 ah-head-row">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Venta</p>
                                <p className="text-xl font-semibold text-gray-900">{venta.numero_venta}</p>
                                <p className="text-sm text-gray-500 mt-1">{venta.created_at}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={'px-3 py-1 rounded-full text-xs font-medium ' + estadoColor(venta.estado)}>
                                    {venta.estado}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    {venta.tipo_venta}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4 ah-grid-3">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Total venta</p>
                                <p className="text-lg font-semibold text-gray-800">{fmt(venta.total)}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Total abonado</p>
                                <p className="text-lg font-semibold text-green-700">{fmt(venta.pagado)}</p>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Saldo pendiente</p>
                                <p className="text-lg font-semibold text-red-600">{fmt(venta.saldo_pendiente)}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progreso de pago</span>
                                <span>{porcentajePagado}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className={'h-2 rounded-full transition-all ' + (porcentajePagado >= 100 ? 'bg-green-500' : 'bg-blue-500')}
                                    style={{ width: porcentajePagado + '%' }}
                                />
                            </div>
                        </div>

                        {venta.fecha_limite && (
                            <p className="mt-3 text-sm text-gray-500">
                                Fecha límite: <span className="font-medium text-gray-700">{venta.fecha_limite}</span>
                            </p>
                        )}
                    </div>

                    {venta.detalles && venta.detalles.length > 0 && (
                        <div className="ah-card overflow-hidden">
                            <div className="px-4 sm:px-6 py-4 border-b" style={{borderColor:'rgba(200,140,80,.12)'}}>
                                <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
                            </div>
                            <div className="divide-y" style={{borderColor:'rgba(200,140,80,.08)'}}>
                                {venta.detalles.map((d, i) => (
                                    <div key={i} className="px-4 sm:px-6 py-3 flex items-center justify-between ah-prod-row">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{d.nombre}</p>
                                            <p className="text-xs text-gray-400">{d.cantidad} x {fmt(d.precio_unitario)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">{fmt(d.subtotal)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="ah-card overflow-hidden">
                        <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between flex-wrap gap-2" style={{borderColor:'rgba(200,140,80,.12)'}}>
                            <h2 className="text-lg font-semibold text-gray-900">Abonos registrados</h2>
                            <span className="text-sm text-gray-500">{venta.abonos.length} movimiento{venta.abonos.length !== 1 ? 's' : ''}</span>
                        </div>

                        {venta.abonos.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 text-sm">No hay abonos registrados</p>
                            </div>
                        ) : (
                            <div className="divide-y" style={{borderColor:'rgba(200,140,80,.08)'}}>
                                {venta.abonos.map((abono, i) => (
                                    <div key={abono.id} className={'px-4 sm:px-6 py-4 ah-mov-row ' + (abono.es_ajuste ? 'bg-orange-50/40' : '')}>
                                        <div className="flex items-start justify-between ah-mov-top">
                                            <div className="flex items-center gap-3">
                                                {/* Número con color según tipo */}
                                                <div className={'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' + (abono.es_ajuste ? 'bg-orange-100' : 'bg-green-50')}>
                                                    <span className={'text-xs font-semibold ' + (abono.es_ajuste ? 'text-orange-700' : 'text-green-700')}>{i + 1}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-gray-800">{fmt(abono.monto)}</p>
                                                        {/* Badge tipo */}
                                                        {tipoBadge(abono)}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5">{abono.created_at}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {abono.forma_pago}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">{abono.empleado}</p>
                                            </div>
                                        </div>
                                        {abono.observaciones && (
                                            <p className="mt-2 text-xs text-gray-500 rounded-lg px-3 py-2 ml-0 sm:ml-11" style={{background:'rgba(255,255,255,.55)'}}>
                                                {abono.observaciones}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {venta.estado === 'Pendiente' && (
                        <div className="flex justify-end">
                            <Link href="/abonos" className="px-6 py-3 rounded-xl font-medium transition text-sm"
                                  style={{background:'rgba(220,38,38,.1)',border:'1px solid rgba(220,38,38,.35)',color:'rgba(185,28,28,.92)'}}>
                                Registrar nuevo abono
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
