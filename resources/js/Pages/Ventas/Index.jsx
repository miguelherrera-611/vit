import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import VentaDetalleModal from '@/Components/VentaDetalleModal';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;

const formatCurrency = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const formatDate = (s) =>
    new Date(s).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const normalizeText = (t) =>
    (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function VentasIndex({ ventas = [] }) {
    const [searchTerm, setSearchTerm]               = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [modalOpen, setModalOpen]                 = useState(false);
    const [currentPage, setCurrentPage]             = useState(1);

    const stats = useMemo(() => {
        const hoy       = new Date().toISOString().split('T')[0];
        const ventasHoy = ventas.filter(v => v.created_at.startsWith(hoy));
        const totalHoy  = ventasHoy.reduce((s, v) => s + parseFloat(v.total), 0);
        const promedio  = ventas.length ? ventas.reduce((s, v) => s + parseFloat(v.total), 0) / ventas.length : 0;
        return { ventasHoy: ventasHoy.length, totalHoy, promedio };
    }, [ventas]);

    const ventasFiltradas = useMemo(() => {
        const q = normalizeText(searchTerm);
        return ventas.filter(v =>
            !q ||
            normalizeText(v.numero_venta).includes(q) ||
            normalizeText(v.cliente?.nombre).includes(q) ||
            normalizeText(v.estado).includes(q)
        );
    }, [ventas, searchTerm]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const ventasPaginadas = useMemo(
        () => ventasFiltradas.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [ventasFiltradas, currentPage]
    );

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }

                .vi-root {
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                    background:
                        radial-gradient(ellipse 75% 55% at 0% 0%, rgba(255,210,170,0.18) 0%, transparent 55%),
                        radial-gradient(ellipse 55% 50% at 100% 100%, rgba(255,195,145,0.12) 0%, transparent 55%),
                        linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 40%, #fef5ef 70%, #fef8f4 100%);
                }

                /* Header */
                .vi-header {
                    background: rgba(253,246,240,0.75);
                    backdrop-filter: blur(32px) saturate(160%);
                    border-bottom: 1px solid rgba(200,140,80,0.12);
                    box-shadow: 0 1px 0 rgba(255,255,255,0.8);
                    position: sticky; top: 0; z-index: 50;
                }
                .vi-header-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 1.25rem 1.5rem;
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 1rem; flex-wrap: wrap;
                }

                .vi-content {
                    max-width: 1280px; margin: 0 auto;
                    padding: 2rem 1.5rem 3rem;
                }

                /* Glass card */
                .vi-card {
                    background: rgba(255,255,255,0.45);
                    backdrop-filter: blur(20px) saturate(150%);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(180,90,20,0.05), inset 0 1px 0 rgba(255,255,255,0.9);
                }

                /* Stats */
                .vi-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0.875rem;
                    margin-bottom: 1.75rem;
                }
                .vi-stat {
                    padding: 1.25rem 1.35rem;
                    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
                }

                /* Search */
                .vi-search-wrap {
                    padding: 1rem 1.25rem;
                    margin-bottom: 1rem;
                    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both;
                }
                .vi-search-input {
                    width: 100%;
                    padding: 0.7rem 0.875rem 0.7rem 2.5rem;
                    background: rgba(255,255,255,0.55);
                    border: 1px solid rgba(200,140,80,0.18);
                    border-radius: 10px;
                    font-size: 0.84rem;
                    color: #2d1a08;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: all 0.15s;
                }
                .vi-search-input::placeholder { color: rgba(180,100,30,0.35); }
                .vi-search-input:focus {
                    background: rgba(255,255,255,0.8);
                    border-color: rgba(200,140,80,0.35);
                    box-shadow: 0 0 0 3px rgba(200,140,80,0.06);
                }

                /* Table */
                .vi-table-wrap {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.12s both;
                    /* Scroll shadow hint en los bordes */
                    background:
                        linear-gradient(to right, rgba(253,246,240,1) 0%, transparent 5%),
                        linear-gradient(to left,  rgba(253,246,240,1) 0%, transparent 5%),
                        linear-gradient(to right, rgba(200,140,80,0.1) 0%, transparent 5%),
                        linear-gradient(to left,  rgba(200,140,80,0.1) 0%, transparent 5%);
                    background-attachment: local, local, scroll, scroll;
                    border-radius: 0 0 16px 16px;
                }
                .vi-table {
                    width: 100%;
                    min-width: 620px; /* fuerza scroll en pantallas pequeñas */
                    border-collapse: collapse;
                }
                .vi-table thead tr {
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                }
                .vi-table th {
                    padding: 0.75rem 1.1rem;
                    text-align: left;
                    font-size: 0.66rem;
                    font-weight: 600;
                    color: rgba(150,80,20,0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    white-space: nowrap;
                    position: sticky;
                    background: rgba(255,255,255,0.35);
                }
                .vi-table td {
                    padding: 0.875rem 1.1rem;
                    font-size: 0.83rem;
                    color: #2d1a08;
                    border-bottom: 1px solid rgba(200,140,80,0.07);
                    vertical-align: middle;
                    white-space: nowrap;
                }
                .vi-table tbody tr {
                    transition: background 0.12s;
                }
                .vi-table tbody tr:hover {
                    background: rgba(255,255,255,0.45);
                }
                .vi-table tbody tr:last-child td {
                    border-bottom: none;
                }

                /* Hint de scroll en móvil */
                .vi-scroll-hint {
                    display: none;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.45rem 1.1rem 0;
                    font-size: 0.66rem;
                    color: rgba(150,80,20,0.4);
                    letter-spacing: 0.02em;
                }

                /* Badges */
                .badge {
                    display: inline-flex;
                    padding: 0.2rem 0.6rem;
                    border-radius: 5px;
                    font-size: 0.7rem;
                    font-weight: 500;
                    white-space: nowrap;
                    letter-spacing: 0.01em;
                }
                .badge-green  { background: rgba(16,185,129,0.08);  border: 1px solid rgba(16,185,129,0.22);  color: rgba(4,120,87,0.85);   }
                .badge-yellow { background: rgba(245,158,11,0.08);  border: 1px solid rgba(245,158,11,0.22);  color: rgba(146,64,14,0.85);  }
                .badge-red    { background: rgba(220,38,38,0.06);   border: 1px solid rgba(220,38,38,0.18);   color: rgba(185,28,28,0.85);  }
                .badge-blue   { background: rgba(59,130,246,0.07);  border: 1px solid rgba(59,130,246,0.18);  color: rgba(29,78,216,0.85);  }

                /* Btn */
                .vi-btn-primary {
                    padding: 0.6rem 1.25rem;
                    background: rgba(185,28,28,0.07);
                    border: 1px solid rgba(185,28,28,0.22);
                    border-radius: 9px;
                    color: rgba(185,28,28,0.9);
                    font-size: 0.82rem;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: all 0.15s;
                    letter-spacing: -0.01em;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .vi-btn-primary:hover {
                    background: rgba(185,28,28,0.12);
                    border-color: rgba(185,28,28,0.32);
                }

                .vi-btn-ghost {
                    padding: 0.55rem 0.9rem;
                    background: rgba(255,255,255,0.4);
                    border: 1px solid rgba(200,140,80,0.18);
                    border-radius: 8px;
                    color: rgba(185,28,28,0.8);
                    font-size: 0.78rem;
                    font-weight: 500;
                    font-family: 'Inter', sans-serif;
                    text-decoration: none;
                    transition: all 0.13s;
                    cursor: pointer;
                    letter-spacing: -0.01em;
                }
                .vi-btn-ghost:hover {
                    background: rgba(255,255,255,0.7);
                    color: rgba(185,28,28,0.95);
                }

                /* Icon box */
                .vi-icon-box {
                    width: 36px; height: 36px;
                    border-radius: 9px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    margin-bottom: 0.875rem;
                }

                /* Section label */
                .vi-section-label {
                    font-size: 0.66rem;
                    font-weight: 600;
                    color: rgba(150,80,20,0.45);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 0.875rem;
                }

                /* Empty */
                .vi-empty {
                    padding: 4rem 1.5rem;
                    text-align: center;
                }

                /* Responsive */
                @media (max-width: 900px) {
                    .vi-stats { grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
                }
                @media (max-width: 640px) {
                    .vi-content { padding: 1.25rem 1rem 3rem; }
                    .vi-header-inner { padding: 1rem; }
                    .vi-stats { grid-template-columns: 1fr 1fr; gap: 0.65rem; }
                    .vi-stat:last-child { grid-column: 1 / -1; }
                    .vi-stat { padding: 1rem 1.1rem; }
                    .vi-search-wrap { padding: 0.875rem 1rem; }
                    .vi-scroll-hint { display: flex; }
                    .vi-table th, .vi-table td { padding: 0.75rem 0.875rem; }
                }
                @media (max-width: 400px) {
                    .vi-stats { grid-template-columns: 1fr; }
                    .vi-stat:last-child { grid-column: unset; }
                }
            `}</style>

            <div className="vi-root">

                {/* Header */}
                <div className="vi-header">
                    <div className="vi-header-inner">
                        <div>
                            <p style={{fontSize:'0.66rem',fontWeight:'600',color:'rgba(150,80,20,0.45)',letterSpacing:'0.1em',textTransform:'uppercase',margin:'0 0 0.2rem'}}>
                                Módulo
                            </p>
                            <h1 style={{fontSize:'clamp(1.1rem,3vw,1.45rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.03em',margin:0,lineHeight:1.1}}>
                                Gestión de Ventas
                            </h1>
                        </div>
                        <Link href="/ventas/crear" className="vi-btn-primary">
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva venta
                        </Link>
                    </div>
                </div>

                <div className="vi-content">

                    {/* Stats */}
                    <p className="vi-section-label">Resumen</p>
                    <div className="vi-stats">
                        {[
                            { label: 'Ventas hoy',        value: stats.ventasHoy,               mono: false, delay: '0.04s', accent: 'rgba(16,185,129,0.75)'  },
                            { label: 'Recaudado hoy',     value: formatCurrency(stats.totalHoy), mono: true,  delay: '0.08s', accent: 'rgba(59,130,246,0.75)'  },
                            { label: 'Promedio por venta',value: formatCurrency(stats.promedio),  mono: true,  delay: '0.12s', accent: 'rgba(185,28,28,0.75)'   },
                        ].map((s) => (
                            <div key={s.label} className="vi-card vi-stat" style={{animationDelay: s.delay}}>
                                <div className="vi-icon-box" style={{
                                    background: s.accent.replace(/[\d.]+\)$/, '0.08)'),
                                    border: `1px solid ${s.accent.replace(/[\d.]+\)$/, '0.18)')}`,
                                }}>
                                    <div style={{width:'10px',height:'10px',borderRadius:'2px',background:s.accent.replace(/[\d.]+\)$/, '0.7)')}}/>
                                </div>
                                <p style={{fontSize:'clamp(1.3rem,3vw,1.65rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:1,margin:'0 0 0.25rem'}}>
                                    {s.value}
                                </p>
                                <p style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.55)',margin:0}}>
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    {ventas.length > 0 && (
                        <div className="vi-card vi-search-wrap">
                            <div style={{position:'relative'}}>
                                <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.35)" strokeWidth="1.8" viewBox="0 0 24 24"
                                     style={{position:'absolute',left:'0.7rem',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
                                    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar por número, cliente o estado..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="vi-search-input"
                                />
                            </div>
                            {searchTerm && (
                                <p style={{fontSize:'0.73rem',color:'rgba(150,80,20,0.5)',marginTop:'0.5rem',paddingLeft:'0.1rem'}}>
                                    <span style={{fontWeight:'500',color:'rgba(120,60,10,0.7)'}}>{ventasFiltradas.length}</span> resultado{ventasFiltradas.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Table / List */}
                    {ventasFiltradas.length > 0 ? (
                        <div className="vi-card vi-table-wrap">
                            {/* Hint deslizar — solo visible en móvil */}
                            <div className="vi-scroll-hint">
                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"/>
                                </svg>
                                Desliza para ver más
                            </div>

                            {/* Tabla única — deslizable en móvil */}
                            <table className="vi-table">
                                <thead>
                                <tr>
                                    <th>N.º Venta</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Método</th>
                                    <th>Estado</th>
                                    <th style={{textAlign:'right'}}>Detalle</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ventasPaginadas.map((venta) => (
                                    <tr key={venta.id}>
                                        <td>
                                            <span style={{fontWeight:'500',letterSpacing:'-0.01em'}}>{venta.numero_venta}</span>
                                        </td>
                                        <td style={{color:'rgba(80,40,10,0.8)'}}>
                                            {venta.cliente?.nombre || 'Cliente general'}
                                        </td>
                                        <td style={{color:'rgba(150,80,20,0.55)'}}>
                                            {formatDate(venta.created_at)}
                                        </td>
                                        <td style={{fontWeight:'600',letterSpacing:'-0.02em'}}>
                                            {formatCurrency(venta.total)}
                                        </td>
                                        <td>
                                            <span className="badge badge-blue">{venta.metodo_pago}</span>
                                        </td>
                                        <td>
                                                <span className={`badge ${
                                                    venta.estado === 'Completada' ? 'badge-green' :
                                                        venta.estado === 'Pendiente'  ? 'badge-yellow' : 'badge-red'
                                                }`}>
                                                    {venta.estado}
                                                </span>
                                        </td>
                                        <td style={{textAlign:'right'}}>
                                            <button
                                                className="vi-btn-ghost"
                                                onClick={() => { setVentaSeleccionada(venta); setModalOpen(true); }}
                                            >
                                                Ver detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div style={{padding:'0.875rem 1.1rem',borderTop:'1px solid rgba(200,140,80,0.08)'}}>
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={ventasFiltradas.length}
                                    perPage={PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor="green"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="vi-card vi-empty">
                            <div style={{
                                width:'44px',height:'44px',borderRadius:'11px',margin:'0 auto 1.25rem',
                                background:'rgba(16,185,129,0.07)',border:'1px solid rgba(16,185,129,0.2)',
                                display:'flex',alignItems:'center',justifyContent:'center',
                            }}>
                                <svg width="18" height="18" fill="none" stroke="rgba(4,120,87,0.65)" strokeWidth="1.6" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                            </div>
                            <p style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',marginBottom:'0.4rem',letterSpacing:'-0.01em'}}>
                                Sin ventas registradas
                            </p>
                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.5)',marginBottom:'1.35rem'}}>
                                Comienza registrando la primera venta del día
                            </p>
                            <Link href="/ventas/crear" className="vi-btn-primary">
                                Nueva venta
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <VentaDetalleModal venta={ventaSeleccionada} open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}
