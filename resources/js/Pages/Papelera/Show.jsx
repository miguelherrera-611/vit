import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const TIPOS = {
    producto:  { emoji: '📦', label: 'Producto' },
    cliente:   { emoji: '👤', label: 'Cliente' },
    proveedor: { emoji: '🏪', label: 'Proveedor' },
    venta:     { emoji: '💰', label: 'Venta' },
    categoria: { emoji: '🏷️', label: 'Categoría' },
    pedido:    { emoji: '🗂️', label: 'Pedido' },
};

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box}
    .ps-wrap{max-width:980px;margin:0 auto;padding:1.25rem 1rem 2.2rem;font-family:'Inter',sans-serif}
    .ps-top{display:flex;justify-content:space-between;gap:.65rem;flex-wrap:wrap;margin-bottom:1rem}
    .ps-link{
        display:inline-flex;align-items:center;gap:.4rem;padding:.56rem .9rem;border-radius:10px;text-decoration:none;
        background:rgba(255,255,255,.46);border:1px solid rgba(200,140,80,.18);color:rgba(120,60,10,.72);
        font-size:.8rem;font-weight:500;transition:.15s ease;
    }
    .ps-link:hover{background:rgba(255,255,255,.68)}
    .ps-card{
        background:rgba(255,255,255,.5);border:1px solid rgba(200,140,80,.16);border-radius:16px;padding:1rem;
        backdrop-filter:blur(14px);box-shadow:0 6px 24px rgba(180,90,20,.06);
    }
    .ps-head{display:flex;align-items:center;gap:.75rem;margin-bottom:.9rem}
    .ps-icon{
        width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;
        background:rgba(255,255,255,.6);border:1px solid rgba(200,140,80,.2);font-size:1.05rem;
    }
    .ps-title{font-size:1.12rem;font-weight:600;color:#2d1a08;line-height:1.2}
    .ps-sub{font-size:.76rem;color:rgba(150,80,20,.55);margin-top:.15rem}
    .ps-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin-top:.35rem}
    .ps-item{background:rgba(255,255,255,.42);border:1px solid rgba(200,140,80,.12);border-radius:10px;padding:.65rem .72rem}
    .ps-k{font-size:.65rem;text-transform:uppercase;letter-spacing:.06em;color:rgba(150,80,20,.45);margin-bottom:.15rem}
    .ps-v{font-size:.81rem;font-weight:500;color:#2d1a08;word-break:break-word}
    .ps-actions{display:flex;gap:.55rem;flex-wrap:wrap;margin-top:1rem}
    .btn-main,.btn-danger{
        border:none;cursor:pointer;padding:.65rem .95rem;border-radius:10px;font-size:.8rem;font-weight:600;transition:.15s ease;
    }
    .btn-main{background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.22);color:rgba(4,120,87,.86)}
    .btn-main:hover{background:rgba(16,185,129,.13)}
    .btn-danger{background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2);color:rgba(185,28,28,.9)}
    .btn-danger:hover{background:rgba(220,38,38,.13)}
    .ps-json-box{margin-top:.9rem}
    .ps-toggle{
        background:transparent;border:none;padding:0;color:rgba(120,60,10,.72);font-size:.78rem;font-weight:600;cursor:pointer;
    }
    .ps-pre{
        margin-top:.55rem;background:rgba(255,255,255,.6);border:1px solid rgba(200,140,80,.14);border-radius:10px;
        padding:.8rem;overflow:auto;max-height:340px;font-size:.74rem;line-height:1.5;color:#3a2412;
        font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;
    }
    @media (max-width:640px){ .ps-grid{grid-template-columns:1fr} .ps-title{font-size:1rem} }
`;

export default function PapeleraShow({ item }) {
    const { auth } = usePage().props;
    const [modal, setModal] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [pwdError, setPwdError] = useState(null);
    const [showJson, setShowJson] = useState(false);

    const roles = auth.user?.roles ?? [];
    const dashboardHref = roles.includes('admin')
        ? '/dashboard/admin'
        : roles.includes('empleado') ? '/dashboard/empleado' : '/dashboard';

    const cfg = TIPOS[item.tipo] || { emoji: '🗂️', label: item.tipo };

    const handleConfirm = (password) => {
        if (!modal) return;
        setProcessing(true);
        const onSuccess = () => { setModal(null); setProcessing(false); setPwdError(null); router.visit('/papelera'); };
        const onError = (errs) => { setPwdError(errs.password || 'Error.'); setProcessing(false); };
        if (modal === 'restore') router.post(`/papelera/${item.id}/restore`, { password }, { onSuccess, onError });
        if (modal === 'delete') router.delete(`/papelera/${item.id}`, { data: { password }, onSuccess, onError });
    };

    return (
        <AppLayout>
            <Head title={`Papelera — ${item.nombre_display}`} />
            <style>{STYLES}</style>

            <div className="ps-wrap">
                <div className="ps-top">
                    <Link href={dashboardHref} className="ps-link">Volver</Link>
                    <Link href="/papelera" className="ps-link">Ir a papelera</Link>
                </div>

                <div className="ps-card">
                    <div className="ps-head">
                        <div className="ps-icon">{cfg.emoji}</div>
                        <div>
                            <h1 className="ps-title">{item.nombre_display}</h1>
                            <p className="ps-sub">{cfg.label}</p>
                        </div>
                    </div>

                    <div className="ps-grid">
                        <div className="ps-item"><p className="ps-k">Tipo</p><p className="ps-v">{cfg.label}</p></div>
                        <div className="ps-item"><p className="ps-k">Eliminado por</p><p className="ps-v">{item.eliminado_por || 'Sin usuario'}</p></div>
                        <div className="ps-item"><p className="ps-k">Eliminado el</p><p className="ps-v">{item.eliminado_at}</p></div>
                        <div className="ps-item"><p className="ps-k">Purge automático</p><p className="ps-v">{item.purgar_at} ({item.dias_restantes} días)</p></div>
                    </div>

                    <div className="ps-json-box">
                        <button className="ps-toggle" onClick={() => setShowJson(v => !v)}>
                            {showJson ? 'Ocultar datos técnicos' : 'Ver datos técnicos'}
                        </button>
                        {showJson && <pre className="ps-pre">{JSON.stringify(item.datos, null, 2)}</pre>}
                    </div>

                    <div className="ps-actions">
                        <button className="btn-main" onClick={() => setModal('restore')}>Restaurar</button>
                        <button className="btn-danger" onClick={() => setModal('delete')}>Eliminar definitivamente</button>
                    </div>
                </div>
            </div>

            <PasswordConfirmModal
                open={!!modal}
                onClose={() => setModal(null)}
                onConfirm={handleConfirm}
                processing={processing}
                error={pwdError}
                danger={modal === 'delete'}
                title={modal === 'restore' ? `¿Restaurar "${item.nombre_display}"?` : `¿Eliminar permanentemente "${item.nombre_display}"?`}
                description={modal === 'restore'
                    ? 'El elemento volverá a estar disponible en el sistema.'
                    : 'Este elemento se eliminará definitivamente. No podrás recuperarlo.'}
                confirmLabel={modal === 'restore' ? 'Restaurar' : 'Eliminar definitivamente'}
            />
        </AppLayout>
    );
}

