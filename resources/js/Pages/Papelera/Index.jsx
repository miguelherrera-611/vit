import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const TIPOS = {
    producto:  { label: 'Productos',   accent: 'rgba(59,130,246,0.8)',  accentBg: 'rgba(59,130,246,0.08)'  },
    cliente:   { label: 'Clientes',    accent: 'rgba(236,72,153,0.8)',  accentBg: 'rgba(236,72,153,0.08)'  },
    proveedor: { label: 'Proveedores', accent: 'rgba(99,102,241,0.8)',  accentBg: 'rgba(99,102,241,0.08)'  },
    venta:     { label: 'Ventas',      accent: 'rgba(16,185,129,0.8)',  accentBg: 'rgba(16,185,129,0.08)'  },
    categoria: { label: 'Categorías',  accent: 'rgba(139,92,246,0.8)',  accentBg: 'rgba(139,92,246,0.08)' },
};

const URGENCIA = (dias) => {
    if (dias <= 3)  return { bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.25)',   color: 'rgba(185,28,28,0.9)',   label: `${dias}d — urgente` };
    if (dias <= 10) return { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.28)',  color: 'rgba(146,64,14,0.9)',  label: `${dias} días` };
    return              { bg: 'rgba(180,90,20,0.06)',   border: 'rgba(200,140,80,0.22)',  color: 'rgba(120,60,10,0.65)', label: `${dias} días` };
};

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes staggerUp {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
    }
    @keyframes floatA {
        0%,100% { transform:translateY(0) translateX(0) rotate(0deg); }
        33%     { transform:translateY(-20px) translateX(12px) rotate(3deg); }
        66%     { transform:translateY(12px) translateX(-8px) rotate(-3deg); }
    }
    @keyframes floatB {
        0%,100% { transform:translateY(0) translateX(0); }
        50%     { transform:translateY(-14px) translateX(8px); }
    }

    .papelera-bg {
        min-height: 100vh;
        font-family: 'Inter', -apple-system, sans-serif;
        position: relative;
    }

    /* Deco shapes */
    .bg-deco {
        position: fixed; pointer-events: none; z-index: 0;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.6);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 6px 24px rgba(200,100,30,0.05), inset 0 1px 0 rgba(255,255,255,0.75);
    }
    .bd1 { width:120px; height:120px; border-radius:28px; top:8%;    right:4%;   animation:floatA 16s ease-in-out infinite 1s;   transform:rotate(14deg); }
    .bd2 { width: 72px; height: 72px; border-radius:50%;  top:55%;   left:1%;    animation:floatB 11s ease-in-out infinite 3s; }
    .bd3 { width:180px; height: 52px; border-radius:40px; bottom:10%;right:3%;   animation:floatA 14s ease-in-out infinite 0.5s; }
    .bd4 { width: 50px; height:140px; border-radius:40px; top:30%;   left:0.5%;  animation:floatB 15s ease-in-out infinite 4s; transform:rotate(-6deg); }

    /* Header glassmorphism */
    .pap-header {
        position: relative; z-index: 10;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%);
        border-bottom: 1px solid rgba(255,255,255,0.65);
        box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.85);
    }

    /* Back button */
    .back-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 12px;
        color: rgba(150,80,20,0.7);
        cursor: pointer; text-decoration: none;
        transition: all 0.2s ease;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
        flex-shrink: 0;
    }
    .back-btn:hover {
        background: rgba(255,255,255,0.18);
        color: rgba(120,50,10,0.95);
        transform: translateX(-2px);
    }

    /* Filtro tabs */
    .filter-tab {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.4rem 1rem; border-radius: 20px;
        font-size: 0.8rem; font-weight: 500;
        cursor: pointer; border: none; font-family: 'Inter', sans-serif;
        transition: all 0.2s ease;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.5);
        color: rgba(150,80,20,0.7);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.65);
    }
    .filter-tab:hover {
        background: rgba(255,255,255,0.14);
        color: rgba(120,50,10,0.9);
    }
    .filter-tab.active {
        background: rgba(45,26,8,0.88);
        border-color: rgba(45,26,8,0.5);
        color: rgba(255,240,220,0.95);
        box-shadow: 0 4px 14px rgba(45,26,8,0.18), inset 0 1px 0 rgba(255,255,255,0.12);
    }

    /* Vaciar button */
    .btn-vaciar {
        display: inline-flex; align-items: center; gap: 0.5rem;
        padding: 0.65rem 1.25rem;
        background: rgba(220,38,38,0.10);
        border: 1px solid rgba(220,38,38,0.38);
        border-radius: 14px;
        font-size: 0.85rem; font-weight: 600;
        color: rgba(185,28,28,0.95);
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: all 0.2s ease;
        box-shadow: 0 4px 14px rgba(220,38,38,0.08), inset 0 1px 0 rgba(255,120,120,0.2);
        position: relative; overflow: hidden;
    }
    .btn-vaciar::after {
        content: '';
        position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
        background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
        transition: left 0.5s ease;
    }
    .btn-vaciar:hover::after { left: 130%; }
    .btn-vaciar:hover {
        background: rgba(220,38,38,0.16);
        transform: translateY(-1px);
        box-shadow: 0 8px 20px rgba(220,38,38,0.14);
    }

    /* Item row card */
    .item-card {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(20px) saturate(150%); -webkit-backdrop-filter: blur(20px) saturate(150%);
        border: 1px solid rgba(255,255,255,0.62);
        border-radius: 18px;
        padding: 1rem 1.25rem;
        display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        position: relative; overflow: hidden;
        transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        box-shadow: 0 4px 20px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
    }
    .item-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.92) 30%, rgba(255,255,255,0.92) 70%, transparent);
        pointer-events: none;
    }
    .item-card:hover {
        background: rgba(255,255,255,0.10);
        border-color: rgba(255,255,255,0.82);
        transform: translateY(-1px);
        box-shadow: 0 8px 32px rgba(180,90,20,0.09), inset 0 1px 0 rgba(255,255,255,0.9);
    }

    /* Urgencia badge */
    .urgencia-badge {
        font-size: 0.72rem; font-weight: 600;
        padding: 0.28rem 0.7rem; border-radius: 20px;
        white-space: nowrap;
        border: 1px solid;
    }

    /* Action buttons */
    .btn-restore {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.45rem 0.85rem; border-radius: 10px;
        font-size: 0.78rem; font-weight: 600;
        background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.28);
        color: rgba(4,120,87,0.9);
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: all 0.18s ease;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
    }
    .btn-restore:hover {
        background: rgba(16,185,129,0.15);
        transform: translateY(-1px);
    }

    .btn-delete-perm {
        display: inline-flex; align-items: center; justify-content: center;
        width: 34px; height: 34px; border-radius: 10px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(200,140,80,0.22);
        color: rgba(150,80,20,0.5);
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: all 0.18s ease;
    }
    .btn-delete-perm:hover {
        background: rgba(220,38,38,0.08);
        border-color: rgba(220,38,38,0.28);
        color: rgba(185,28,28,0.85);
    }

    /* Empty state */
    .empty-card {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.62);
        border-radius: 28px;
        padding: 5rem 2rem;
        text-align: center;
        box-shadow: 0 8px 32px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.82);
    }

    .anim-1 { animation: staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
    .anim-2 { animation: staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
    .anim-3 { animation: staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
    .anim-4 { animation: staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
    .anim-5 { animation: staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }

    .tabla-wrap{
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.62);
        border-radius: 16px;
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(180,90,20,0.06);
    }
    .tabla-scroll{
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
    }
    .pap-table{
        width: 100%;
        min-width: 920px;
        border-collapse: collapse;
    }
    .pap-table thead th{
        text-align: left;
        font-size: .72rem;
        font-weight: 600;
        letter-spacing: .04em;
        text-transform: uppercase;
        color: rgba(120,60,10,0.55);
        padding: .9rem 1rem;
        background: rgba(255,255,255,0.22);
        border-bottom: 1px solid rgba(255,255,255,0.55);
        white-space: nowrap;
    }
    .pap-table tbody td{
        padding: .85rem 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.45);
        vertical-align: middle;
    }
    .pap-table tbody tr:last-child td{ border-bottom: none; }
    .pap-table tbody tr:hover{ background: rgba(255,255,255,0.14); }
    .pap-table tbody tr{ cursor:pointer; transition:background .15s ease; }

    .tipo-dot{
        width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
        display:flex; align-items:center; justify-content:center;
        position: relative;
    }
    .tipo-dot::after{
        content:'';
        width:10px; height:10px; border-radius:50%;
        background: currentColor;
        box-shadow: 0 0 0 3px rgba(255,255,255,0.45);
    }

    .cell-main{
        display:flex; align-items:center; gap:.75rem; min-width: 280px;
    }
    .cell-actions{
        display:flex; align-items:center; gap:.55rem; justify-content:flex-end;
        white-space: nowrap;
    }

    @media (max-width: 768px){
        .pap-table thead th, .pap-table tbody td{ padding: .78rem .85rem; }
    }
`;

export default function PapeleraIndex({ items, conteos, filtro }) {
    const { auth } = usePage().props;
    const [modal, setModal]             = useState(null);
    const [processing, setProcessing]   = useState(false);
    const [pwdError, setPwdError]       = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 15;

    // Dashboard correcto según rol
    const roles = auth.user?.roles ?? [];
    const dashboardHref = roles.includes('admin')
        ? '/dashboard/admin'
        : roles.includes('empleado')
            ? '/dashboard/empleado'
            : '/dashboard';

    const openModal = (tipo, item = null) => { setModal({ tipo, item }); setPwdError(null); };

    const handleConfirm = (password) => {
        if (!modal) return;
        setProcessing(true);
        const onSuccess = () => { setModal(null); setProcessing(false); setPwdError(null); };
        const onError   = (errs) => { setPwdError(errs.password || 'Error.'); setProcessing(false); };

        if (modal.tipo === 'restore')      router.post(`/papelera/${modal.item.id}/restore`, { password }, { onSuccess, onError });
        else if (modal.tipo === 'delete')  router.delete(`/papelera/${modal.item.id}`, { data: { password }, onSuccess, onError });
        else if (modal.tipo === 'vaciar')  router.post('/papelera/vaciar', { password }, { onSuccess, onError });
    };

    const setFiltro = (tipo) => {
        router.get('/papelera', tipo ? { tipo } : {}, { preserveState: true, replace: true });
    };

    const datos = items.data || [];
    useEffect(() => { setCurrentPage(1); }, [filtro]);

    const datosPaginados = useMemo(
        () => datos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [datos, currentPage]
    );

    return (
        <AppLayout>
            <style>{STYLES}</style>

            <div className="papelera-bg">
                {/* Deco shapes */}
                <div className="bg-deco bd1"/><div className="bg-deco bd2"/>
                <div className="bg-deco bd3"/><div className="bg-deco bd4"/>

                {/* ── HEADER ─────────────────────────────────────────── */}
                <div className="pap-header">
                    <div style={{maxWidth:'1280px', margin:'0 auto', padding:'1.5rem'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap'}}>

                            {/* Título + back */}
                            <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                <Link href={dashboardHref} className="back-btn">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </Link>
                                <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                                    <div style={{
                                        width:'44px', height:'44px', borderRadius:'14px',
                                        background:'rgba(220,38,38,0.08)', border:'1px solid rgba(220,38,38,0.18)',
                                        display:'flex', alignItems:'center', justifyContent:'center',
                                    }}>
                                        <svg width="22" height="22" fill="none" stroke="rgba(185,28,28,0.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 style={{fontSize:'1.5rem', fontWeight:'300', color:'#2d1a08', letterSpacing:'-0.03em', lineHeight:1}}>
                                            Papelera
                                        </h1>
                                        <p style={{fontSize:'0.78rem', color:'rgba(150,80,20,0.55)', marginTop:'0.2rem'}}>
                                            Los elementos se eliminan automáticamente después de 30 días
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón vaciar */}
                            {conteos.total > 0 && (
                                <button className="btn-vaciar" onClick={() => openModal('vaciar')}>
                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                    Vaciar papelera
                                </button>
                            )}
                        </div>

                        {/* Filtros */}
                        <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem', marginTop:'1.25rem'}}>
                            <button
                                className={`filter-tab${!filtro ? ' active' : ''}`}
                                onClick={() => setFiltro('')}
                            >
                                Todos ({conteos.total})
                            </button>
                            {Object.entries(TIPOS).map(([key, cfg]) =>
                                    conteos[key] > 0 && (
                                        <button
                                            key={key}
                                            className={`filter-tab${filtro === key ? ' active' : ''}`}
                                            onClick={() => setFiltro(key)}
                                        >
                                            <span>{cfg.label} ({conteos[key]})</span>
                                        </button>
                                    )
                            )}
                        </div>
                    </div>
                </div>

                {/* ── CONTENIDO ──────────────────────────────────────── */}
                <div style={{maxWidth:'1280px', margin:'0 auto', padding:'2rem 1.5rem', position:'relative', zIndex:2}}>

                    {datos.length === 0 ? (
                        <div className="empty-card anim-1">
                            <div style={{
                                width:'72px', height:'72px', borderRadius:'50%',
                                background:'rgba(200,140,80,0.08)', border:'1px solid rgba(200,140,80,0.18)',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                margin:'0 auto 1.5rem',
                            }}>
                                <svg width="32" height="32" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </div>
                            <h2 style={{fontSize:'1.1rem', fontWeight:'500', color:'#2d1a08', marginBottom:'0.5rem'}}>
                                La papelera está vacía
                            </h2>
                            <p style={{fontSize:'0.82rem', color:'rgba(150,80,20,0.5)', lineHeight:1.6, maxWidth:'340px', margin:'0 auto'}}>
                                Los elementos eliminados aparecerán aquí durante 30 días antes de borrarse definitivamente.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="tabla-wrap anim-1">
                                <div className="tabla-scroll">
                                    <table className="pap-table">
                                        <thead>
                                            <tr>
                                                <th>Elemento</th>
                                                <th>Tipo</th>
                                                <th>Eliminado</th>
                                                <th>Vencimiento</th>
                                                <th style={{textAlign:'right'}}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datosPaginados.map((item) => {
                                                const cfg = TIPOS[item.tipo] || { emoji: '🗂️', label: item.tipo, accent: 'rgba(150,80,20,0.7)', accentBg: 'rgba(150,80,20,0.07)' };
                                                const urgencia = URGENCIA(item.dias_restantes);

                                                return (
                                                    <tr key={item.id} onClick={() => router.visit(`/papelera/${item.id}`)}>
                                                        <td>
                                                            <div className="cell-main">
                                                                <div
                                                                    className="tipo-dot"
                                                                    style={{
                                                                        background: cfg.accentBg,
                                                                        border:`1px solid ${cfg.accent.replace(/[\d.]+\)$/, '0.2)')}`,
                                                                        color: cfg.accent,
                                                                        fontSize:'0.95rem',
                                                                    }}
                                                                >
                                                                    <span role="img" aria-label={cfg.label}>{cfg.emoji}</span>
                                                                </div>
                                                                <div style={{minWidth:0}}>
                                                                    <p style={{fontWeight:'600', color:'#2d1a08', fontSize:'0.88rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                                                                        {item.nombre_display}
                                                                    </p>
                                                                    <p style={{fontSize:'0.72rem', color:'rgba(150,80,20,0.5)', marginTop:'0.15rem'}}>
                                                                        {item.eliminado_por ? `por ${item.eliminado_por}` : 'sin usuario'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span style={{fontSize:'0.78rem', color:'rgba(120,60,10,0.72)'}}>{cfg.label}</span>
                                                        </td>
                                                        <td>
                                                            <span style={{fontSize:'0.78rem', color:'rgba(120,60,10,0.72)'}}>{item.eliminado_at}</span>
                                                        </td>
                                                        <td>
                                                            <span className="urgencia-badge" style={{background:urgencia.bg, borderColor:urgencia.border, color:urgencia.color}}>
                                                                {urgencia.label}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="cell-actions">
                                                                <button
                                                                    className="btn-restore"
                                                                    onClick={(e) => { e.stopPropagation(); openModal('restore', item); }}
                                                                >
                                                                    Restaurar
                                                                </button>
                                                                <button
                                                                    className="btn-delete-perm"
                                                                    onClick={(e) => { e.stopPropagation(); openModal('delete', item); }}
                                                                    title="Eliminar permanentemente"
                                                                >
                                                                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalItems={datos.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="violet"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* ── Modal contraseña ── */}
            <PasswordConfirmModal
                open={!!modal}
                onClose={() => setModal(null)}
                onConfirm={handleConfirm}
                processing={processing}
                error={pwdError}
                danger={modal?.tipo !== 'restore'}
                title={
                    modal?.tipo === 'restore' ? `¿Restaurar "${modal?.item?.nombre_display}"?` :
                        modal?.tipo === 'vaciar'  ? '¿Vaciar toda la papelera?' :
                            `¿Eliminar permanentemente "${modal?.item?.nombre_display}"?`
                }
                description={
                    modal?.tipo === 'restore' ? 'El elemento volverá a estar disponible en el sistema.' :
                        modal?.tipo === 'vaciar'  ? 'Se eliminarán TODOS los elementos definitivamente. Esta acción no se puede deshacer.' :
                            'Este elemento se eliminará definitivamente. No podrás recuperarlo.'
                }
                confirmLabel={
                    modal?.tipo === 'restore' ? 'Restaurar' :
                        modal?.tipo === 'vaciar'  ? 'Vaciar todo' :
                            'Eliminar definitivamente'
                }
            />
        </AppLayout>
    );
}
