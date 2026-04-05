import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

export default function Cartera({ ventas = [], kpis = {} }) {
    const [filtroTipo, setFiltroTipo]     = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda]         = useState('');

    const ventasFiltradas = useMemo(() => {
        const q = busqueda.toLowerCase();
        return ventas.filter((v) => {
            const matchBusqueda = !q || v.cliente.toLowerCase().includes(q) || v.numero_venta.toLowerCase().includes(q);
            const matchTipo     = !filtroTipo   || v.tipo_venta === filtroTipo;
            const matchEstado   = !filtroEstado || (filtroEstado === 'vencida' ? v.vencida : !v.vencida);
            return matchBusqueda && matchTipo && matchEstado;
        });
    }, [ventas, busqueda, filtroTipo, filtroEstado]);

    const hayFiltros = busqueda || filtroTipo || filtroEstado;

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }
                @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

                .ca-root {
                    min-height:100vh;
                    font-family:'Inter',-apple-system,sans-serif;
                    background:
                        radial-gradient(ellipse 75% 55% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 100% 100%, rgba(255,195,145,0.12) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 40%, #fef5ef 70%, #fef8f4 100%);
                }
                .ca-header {
                    background:rgba(253,246,240,0.75);
                    backdrop-filter:blur(32px) saturate(160%);
                    border-bottom:1px solid rgba(200,140,80,0.12);
                    box-shadow:0 1px 0 rgba(255,255,255,0.8);
                    position:sticky;top:0;z-index:50;
                }
                .ca-header-inner {
                    max-width:1280px;margin:0 auto;padding:1.25rem 1.5rem;
                    display:flex;align-items:center;gap:0.875rem;
                }
                .ca-content { max-width:1280px;margin:0 auto;padding:2rem 1.5rem 3rem; }

                .ca-card {
                    background:rgba(255,255,255,0.45);
                    backdrop-filter:blur(20px) saturate(150%);
                    border:1px solid rgba(200,140,80,0.12);
                    border-radius:16px;
                    box-shadow:0 4px 24px rgba(180,90,20,0.05),inset 0 1px 0 rgba(255,255,255,0.9);
                }

                /* Stats */
                .ca-stats {
                    display:grid;grid-template-columns:repeat(4,1fr);gap:0.875rem;
                    margin-bottom:1.75rem;
                }
                .ca-stat { padding:1.25rem 1.35rem; animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }

                .ca-section-label {
                    font-size:0.66rem;font-weight:600;
                    color:rgba(150,80,20,0.45);letter-spacing:0.1em;text-transform:uppercase;
                    margin:0 0 0.875rem;
                }

                /* Filters */
                .ca-filters { padding:1rem 1.25rem; margin-bottom:1rem; animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
                .ca-filters-grid { display:grid;grid-template-columns:1fr 140px 140px;gap:0.75rem;align-items:center; }
                .ca-input {
                    width:100%;padding:0.65rem 0.875rem;
                    background:rgba(255,255,255,0.55);border:1px solid rgba(200,140,80,0.18);
                    border-radius:9px;font-size:0.82rem;color:#2d1a08;
                    font-family:'Inter',sans-serif;outline:none;transition:all 0.15s;
                    letter-spacing:-0.01em;
                }
                .ca-input::placeholder { color:rgba(180,100,30,0.35); }
                .ca-input:focus { background:rgba(255,255,255,0.8);border-color:rgba(200,140,80,0.35);box-shadow:0 0 0 3px rgba(200,140,80,0.06); }
                .ca-input-icon { position:relative; }
                .ca-input-icon svg { position:absolute;left:0.65rem;top:50%;transform:translateY(-50%);pointer-events:none; }
                .ca-input-icon .ca-input { padding-left:2.1rem; }

                /* Table */
                .ca-table-wrap { overflow-x:auto; animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
                .ca-table { width:100%;border-collapse:collapse; }
                .ca-table thead tr { border-bottom:1px solid rgba(200,140,80,0.1); }
                .ca-table th {
                    padding:0.75rem 1rem;text-align:left;
                    font-size:0.65rem;font-weight:600;color:rgba(150,80,20,0.5);
                    text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;
                }
                .ca-table td {
                    padding:0.875rem 1rem;font-size:0.82rem;color:#2d1a08;
                    border-bottom:1px solid rgba(200,140,80,0.07);vertical-align:middle;
                }
                .ca-table tbody tr { transition:background 0.12s; }
                .ca-table tbody tr:hover { background:rgba(255,255,255,0.45); }
                .ca-table tbody tr.vencida { background:rgba(220,38,38,0.03); }
                .ca-table tbody tr.vencida:hover { background:rgba(220,38,38,0.06); }
                .ca-table tbody tr:last-child td { border-bottom:none; }

                /* Badges */
                .badge {
                    display:inline-flex;padding:0.18rem 0.55rem;border-radius:5px;
                    font-size:0.69rem;font-weight:500;white-space:nowrap;letter-spacing:0.01em;
                }
                .badge-green  { background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.22); color:rgba(4,120,87,0.85); }
                .badge-yellow { background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.22); color:rgba(146,64,14,0.85); }
                .badge-red    { background:rgba(220,38,38,0.06);  border:1px solid rgba(220,38,38,0.18);  color:rgba(185,28,28,0.85); }
                .badge-blue   { background:rgba(59,130,246,0.07); border:1px solid rgba(59,130,246,0.18); color:rgba(29,78,216,0.85); }
                .badge-purple { background:rgba(139,92,246,0.07); border:1px solid rgba(139,92,246,0.18); color:rgba(109,40,217,0.85); }

                .ca-link {
                    font-size:0.76rem;font-weight:500;color:rgba(185,28,28,0.75);
                    text-decoration:none;transition:color 0.13s;
                }
                .ca-link:hover { color:rgba(185,28,28,1); }
                .ca-link-muted { color:rgba(150,80,20,0.55); }
                .ca-link-muted:hover { color:rgba(150,80,20,0.9); }

                /* Footer table */
                .ca-table-footer {
                    display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;
                    padding:0.875rem 1rem;border-top:1px solid rgba(200,140,80,0.08);
                }

                /* Icon box */
                .ca-icon-box {
                    width:34px;height:34px;border-radius:9px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-bottom:0.75rem;
                }

                /* Mobile cards */
                .ca-mobile-list { display:none; }
                .ca-mobile-row {
                    padding:0.875rem 1rem;border-bottom:1px solid rgba(200,140,80,0.08);
                    display:flex;flex-direction:column;gap:0.4rem;
                }
                .ca-mobile-row:last-child { border-bottom:none; }
                .ca-mobile-row.vencida { background:rgba(220,38,38,0.03); }

                /* Empty */
                .ca-empty { padding:4rem 1.5rem;text-align:center; }

                /* Responsive */
                @media (max-width:900px) { .ca-stats { grid-template-columns:repeat(2,1fr); } }
                @media (max-width:640px) {
                    .ca-content { padding:1.25rem 1rem 3rem; }
                    .ca-header-inner { padding:1rem; }
                    .ca-stats { grid-template-columns:1fr 1fr;gap:0.65rem; }
                    .ca-stat { padding:1rem 1.1rem; }
                    .ca-filters-grid { grid-template-columns:1fr;gap:0.5rem; }
                    .ca-filters { padding:0.875rem 1rem; }
                    .ca-table-wrap table { display:none; }
                    .ca-mobile-list { display:flex;flex-direction:column; }
                }
                @media (max-width:400px) {
                    .ca-stats { grid-template-columns:1fr; }
                }
            `}</style>

            <div className="ca-root">

                {/* Header */}
                <div className="ca-header">
                    <div className="ca-header-inner">
                        <Link href="/ventas" style={{
                            width:'32px',height:'32px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',
                            background:'rgba(255,255,255,0.45)',border:'1px solid rgba(200,140,80,0.18)',flexShrink:0,
                            transition:'all 0.13s',textDecoration:'none',
                        }}>
                            <svg width="14" height="14" fill="none" stroke="rgba(150,80,20,0.6)" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </Link>
                        <div>
                            <p style={{fontSize:'0.66rem',fontWeight:'600',color:'rgba(150,80,20,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',margin:'0 0 0.15rem'}}>
                                Ventas
                            </p>
                            <h1 style={{fontSize:'clamp(1rem,2.5vw,1.35rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',margin:0,lineHeight:1.1}}>
                                Cartera de clientes
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="ca-content">

                    {/* Stats */}
                    <p className="ca-section-label">Resumen</p>
                    <div className="ca-stats">
                        {[
                            { label:'Total cartera',    value:fmt(kpis.total_cartera), accent:'rgba(185,28,28,0.75)',  delay:'0.04s' },
                            { label:'Clientes con deuda', value:kpis.clientes_deuda,   accent:'rgba(59,130,246,0.75)', delay:'0.08s' },
                            { label:'Deudas activas',   value:kpis.num_pendientes,     accent:'rgba(245,158,11,0.8)',  delay:'0.12s' },
                            { label:'Deudas vencidas',  value:kpis.deudas_vencidas,    accent:'rgba(220,38,38,0.8)',   delay:'0.16s' },
                        ].map((s) => (
                            <div key={s.label} className="ca-card ca-stat" style={{animationDelay:s.delay}}>
                                <div className="ca-icon-box" style={{
                                    background:s.accent.replace(/[\d.]+\)$/, '0.07)'),
                                    border:`1px solid ${s.accent.replace(/[\d.]+\)$/, '0.18)')}`,
                                }}>
                                    <div style={{width:'9px',height:'9px',borderRadius:'2px',background:s.accent.replace(/[\d.]+\)$/, '0.65)')}}/>
                                </div>
                                <p style={{fontSize:'clamp(1.2rem,3vw,1.65rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 0.25rem'}}>
                                    {s.value}
                                </p>
                                <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Filtros */}
                    <div className="ca-card ca-filters">
                        <div className="ca-filters-grid">
                            <div className="ca-input-icon">
                                <svg width="13" height="13" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                                </svg>
                                <input type="text" className="ca-input" value={busqueda}
                                       onChange={(e) => setBusqueda(e.target.value)}
                                       placeholder="Buscar cliente o N.º venta..."/>
                            </div>
                            <select className="ca-input" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                                <option value="">Todos los tipos</option>
                                <option value="Crédito">Crédito</option>
                                <option value="Separado">Separado</option>
                            </select>
                            <select className="ca-input" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                <option value="">Todas</option>
                                <option value="al_dia">Al día</option>
                                <option value="vencida">Vencidas</option>
                            </select>
                        </div>
                        {hayFiltros && (
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'0.6rem',paddingTop:'0.6rem',borderTop:'1px solid rgba(200,140,80,0.08)'}}>
                                <p style={{fontSize:'0.73rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                    <span style={{fontWeight:'500',color:'rgba(120,60,10,0.7)'}}>{ventasFiltradas.length}</span> resultado{ventasFiltradas.length !== 1 ? 's' : ''}
                                </p>
                                <button onClick={() => { setBusqueda(''); setFiltroTipo(''); setFiltroEstado(''); }}
                                        style={{fontSize:'0.73rem',color:'rgba(185,28,28,0.7)',background:'none',border:'none',cursor:'pointer',fontFamily:'Inter,sans-serif',fontWeight:'500'}}>
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Contenido */}
                    {ventas.length === 0 ? (
                        <div className="ca-card ca-empty">
                            <div style={{width:'44px',height:'44px',borderRadius:'11px',margin:'0 auto 1.25rem',background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <svg width="18" height="18" fill="none" stroke="rgba(4,120,87,0.65)" strokeWidth="1.6" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <p style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.35rem',letterSpacing:'-0.01em'}}>Sin deudas activas</p>
                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.5)',margin:0}}>Todos los clientes están al día.</p>
                        </div>
                    ) : (
                        <div className="ca-card ca-table-wrap">
                            {/* Desktop table */}
                            <table className="ca-table">
                                <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Venta</th>
                                    <th>Tipo</th>
                                    <th>Total</th>
                                    <th>Abonado</th>
                                    <th>Saldo</th>
                                    <th>Fecha límite</th>
                                    <th>Estado</th>
                                    <th style={{textAlign:'right'}}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ventasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{textAlign:'center',padding:'3rem',color:'rgba(150,80,20,0.45)',fontSize:'0.82rem'}}>
                                            Sin resultados para los filtros aplicados
                                        </td>
                                    </tr>
                                ) : ventasFiltradas.map((v) => (
                                    <tr key={v.id} className={v.vencida ? 'vencida' : ''}>
                                        <td>
                                            <p style={{fontWeight:'500',color:'#2d1a08',margin:'0 0 0.1rem',letterSpacing:'-0.01em'}}>{v.cliente}</p>
                                            {v.cliente_tel && <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>{v.cliente_tel}</p>}
                                        </td>
                                        <td style={{color:'rgba(100,50,10,0.7)',whiteSpace:'nowrap'}}>{v.numero_venta}</td>
                                        <td>
                                                <span className={`badge ${v.tipo_venta === 'Crédito' ? 'badge-blue' : 'badge-purple'}`}>
                                                    {v.tipo_venta}
                                                </span>
                                        </td>
                                        <td style={{whiteSpace:'nowrap'}}>{fmt(v.total)}</td>
                                        <td style={{whiteSpace:'nowrap',color:'rgba(4,120,87,0.85)',fontWeight:'500'}}>{fmt(v.pagado)}</td>
                                        <td style={{whiteSpace:'nowrap'}}>
                                                <span style={{fontWeight:'600',fontSize:'0.86rem',color:v.vencida?'rgba(185,28,28,0.9)':'rgba(146,64,14,0.85)'}}>
                                                    {fmt(v.saldo_pendiente)}
                                                </span>
                                        </td>
                                        <td style={{whiteSpace:'nowrap'}}>
                                            {v.fecha_limite ? (
                                                <div>
                                                    <p style={{fontSize:'0.8rem',color:v.vencida?'rgba(185,28,28,0.85)':'rgba(100,50,10,0.7)',margin:'0 0 0.1rem',fontWeight:v.vencida?'500':'400'}}>
                                                        {v.fecha_limite}
                                                    </p>
                                                    {v.vencida && v.dias_mora > 0 && (
                                                        <p style={{fontSize:'0.68rem',color:'rgba(185,28,28,0.65)',margin:0}}>
                                                            {v.dias_mora} día{v.dias_mora !== 1 ? 's' : ''} en mora
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{fontSize:'0.75rem',color:'rgba(150,80,20,0.4)'}}>Sin fecha</span>
                                            )}
                                        </td>
                                        <td>
                                                <span className={`badge ${v.vencida ? 'badge-red' : 'badge-yellow'}`}>
                                                    {v.vencida ? 'Vencida' : 'Al día'}
                                                </span>
                                        </td>
                                        <td style={{textAlign:'right',whiteSpace:'nowrap'}}>
                                            <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'0.75rem'}}>
                                                <a href={`/abonos/${v.id}/historial`} className="ca-link ca-link-muted">
                                                    Ver abonos
                                                </a>
                                                <span style={{color:'rgba(200,140,80,0.3)'}}>|</span>
                                                <a href={`/abonos?cliente=${encodeURIComponent(v.cliente)}`} className="ca-link">
                                                    Abonar
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* Mobile list */}
                            <div className="ca-mobile-list">
                                {ventasFiltradas.length === 0 ? (
                                    <div style={{padding:'2.5rem',textAlign:'center'}}>
                                        <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.45)'}}>Sin resultados</p>
                                    </div>
                                ) : ventasFiltradas.map((v) => (
                                    <div key={v.id} className={`ca-mobile-row${v.vencida ? ' vencida' : ''}`}>
                                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'0.5rem'}}>
                                            <div>
                                                <p style={{fontSize:'0.84rem',fontWeight:'500',color:'#2d1a08',margin:'0 0 0.1rem',letterSpacing:'-0.01em'}}>{v.cliente}</p>
                                                <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.5)',margin:0}}>{v.numero_venta} · {v.tipo_venta}</p>
                                            </div>
                                            <span className={`badge ${v.vencida ? 'badge-red' : 'badge-yellow'}`} style={{flexShrink:0}}>
                                                {v.vencida ? 'Vencida' : 'Al día'}
                                            </span>
                                        </div>
                                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                                            <div>
                                                <p style={{fontSize:'0.7rem',color:'rgba(150,80,20,0.45)',margin:'0 0 0.08rem'}}>Saldo pendiente</p>
                                                <p style={{fontSize:'0.9rem',fontWeight:'600',color:v.vencida?'rgba(185,28,28,0.9)':'rgba(146,64,14,0.85)',margin:0,letterSpacing:'-0.02em'}}>
                                                    {fmt(v.saldo_pendiente)}
                                                </p>
                                            </div>
                                            <div style={{display:'flex',gap:'0.6rem',flexShrink:0}}>
                                                <a href={`/abonos/${v.id}/historial`} className="ca-link ca-link-muted" style={{fontSize:'0.74rem'}}>Abonos</a>
                                                <span style={{color:'rgba(200,140,80,0.3)'}}>|</span>
                                                <a href={`/abonos?cliente=${encodeURIComponent(v.cliente)}`} className="ca-link" style={{fontSize:'0.74rem'}}>Abonar</a>
                                            </div>
                                        </div>
                                        {v.fecha_limite && (
                                            <p style={{fontSize:'0.7rem',color:v.vencida?'rgba(185,28,28,0.7)':'rgba(150,80,20,0.5)',margin:0}}>
                                                Fecha límite: {v.fecha_limite}
                                                {v.vencida && v.dias_mora > 0 && ` · ${v.dias_mora} día${v.dias_mora!==1?'s':''} en mora`}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {ventasFiltradas.length > 0 && (
                                <div className="ca-table-footer">
                                    <p style={{fontSize:'0.73rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                        {ventasFiltradas.length} deuda{ventasFiltradas.length!==1?'s':''} — Pendiente total:{' '}
                                        <span style={{fontWeight:'600',color:'rgba(120,60,10,0.75)'}}>
                                            {fmt(ventasFiltradas.reduce((s, v) => s + parseFloat(v.saldo_pendiente), 0))}
                                        </span>
                                    </p>
                                    <Link href="/abonos" style={{
                                        padding:'0.55rem 1rem',borderRadius:'8px',
                                        background:'rgba(185,28,28,0.07)',border:'1px solid rgba(185,28,28,0.22)',
                                        color:'rgba(185,28,28,0.85)',textDecoration:'none',
                                        fontSize:'0.78rem',fontWeight:'500',letterSpacing:'-0.01em',
                                        transition:'all 0.13s',whiteSpace:'nowrap',
                                    }}>
                                        Gestionar abonos
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
