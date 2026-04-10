import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   Glassmorphism water-drop — mismo design system del proyecto
═══════════════════════════════════════════════════════════ */
const GLASS_BG = `
    radial-gradient(ellipse 75% 60% at 0%   0%,   rgba(255,210,170,0.22) 0%, transparent 55%),
    radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),
    radial-gradient(ellipse 55% 50% at 75%  10%,  rgba(255,215,175,0.16) 0%, transparent 55%),
    radial-gradient(ellipse 50% 45% at 15%  85%,  rgba(255,205,155,0.17) 0%, transparent 55%),
    linear-gradient(145deg, #fdf6f0 0%, #fdf3ec 35%, #fef5ef 70%, #fef8f4 100%)
`;

const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    .pg-bg {
        min-height: 100vh;
        font-family: 'Inter', -apple-system, sans-serif;
        background: ${GLASS_BG};
        padding-bottom: 3rem;
    }

    /* ── header sub-página ── */
    .pg-header {
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(32px) saturate(180%);
        -webkit-backdrop-filter: blur(32px) saturate(180%);
        border-bottom: 1px solid rgba(255,255,255,0.68);
        box-shadow: 0 4px 24px rgba(200,100,30,0.07), inset 0 1px 0 rgba(255,255,255,0.88);
    }

    /* ── panel water-drop ── */
    .glass-panel {
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(22px) saturate(155%);
        -webkit-backdrop-filter: blur(22px) saturate(155%);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius: 22px;
        box-shadow:
            0 14px 44px rgba(180,90,20,0.09),
            0 3px 12px rgba(180,90,20,0.05),
            inset 0 1.5px 0 rgba(255,255,255,0.9),
            inset 0 -1px 0 rgba(180,90,20,0.03);
        position: relative;
        overflow: hidden;
    }
    .glass-panel::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.95) 28%,
            rgba(255,255,255,0.95) 72%,
            transparent
        );
        pointer-events: none; z-index: 2;
    }
    .glass-panel::after {
        content: '';
        position: absolute; top: 0; left: 0; width: 52%; height: 52%;
        background: radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.09) 0%, transparent 65%);
        pointer-events: none; z-index: 1;
    }

    /* ── imagen del producto ── */
    .product-img-container {
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.6);
        box-shadow:
            0 12px 40px rgba(180,90,20,0.12),
            inset 0 1px 0 rgba(255,255,255,0.82);
        aspect-ratio: 1 / 1;
        background: rgba(255,255,255,0.07);
        display: flex; align-items: center; justify-content: center;
        position: relative;
    }
    .product-img-container img {
        width: 100%; height: 100%;
        object-fit: cover;
        transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        display: block;
    }
    .product-img-container:hover img { transform: scale(1.05); }

    /* ── NUEVO: navegación galería ── */
    .gallery-nav-btn {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
        background: rgba(255,255,255,0.88); backdrop-filter: blur(8px);
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.12); transition: all 0.18s;
        color: rgba(120,60,10,0.8); z-index: 3;
    }
    .gallery-nav-btn:hover { background: white; box-shadow: 0 4px 16px rgba(0,0,0,0.16); }
    .gallery-nav-btn.left  { left: 10px; }
    .gallery-nav-btn.right { right: 10px; }
    .gallery-counter {
        position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
        background: rgba(0,0,0,0.45); backdrop-filter: blur(6px);
        border-radius: 20px; padding: 3px 10px;
        font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.9);
        pointer-events: none; z-index: 3;
    }
    .gallery-thumbs-pager {
        display:flex;
        align-items:center;
        justify-content:center;
        gap:0.4rem;
        margin-top:0.6rem;
        width:100%;
    }
    .gallery-thumbs-window {
        display:flex;
        gap:0.45rem;
        justify-content:center;
        flex:0 1 auto;
        min-width:0;
        overflow:hidden;
    }
    .gallery-page-btn {
        width:28px; height:28px; border-radius:8px; border:1px solid rgba(200,140,80,0.25);
        background:rgba(255,255,255,0.7); color:rgba(120,60,10,0.75); cursor:pointer;
        display:flex; align-items:center; justify-content:center; transition:all .15s;
        flex-shrink:0;
    }
    .gallery-page-btn:hover:not(:disabled) { background:#fff; border-color:rgba(200,140,80,0.45); }
    .gallery-page-btn:disabled { opacity:.35; cursor:not-allowed; }

    /* ── NUEVO: Lightbox ── */
    .lightbox-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center; padding: 1rem;
        cursor: zoom-out;
    }
    .lightbox-overlay img { max-width: 90vw; max-height: 90vh; border-radius: 14px; object-fit: contain; box-shadow: 0 24px 80px rgba(0,0,0,0.5); cursor: default; }
    .lightbox-close { position: fixed; top: 20px; right: 20px; background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; transition: background 0.15s; z-index: 10000; }
    .lightbox-close:hover { background: rgba(255,255,255,0.25); }
    .lightbox-nav { position: fixed; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: white; transition: background 0.15s; z-index: 10000; }
    .lightbox-nav:hover { background: rgba(255,255,255,0.25); }
    .lightbox-nav.left  { left: 20px; }
    .lightbox-nav.right { right: 20px; }

    /* ── bloque de precio hero ── */
    .price-hero {
        background: rgba(220,38,38,0.065);
        border: 1px solid rgba(220,38,38,0.2);
        border-radius: 20px;
        padding: 1.4rem 1.6rem;
        position: relative;
        overflow: hidden;
    }
    .price-hero::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,130,130,0.55) 45%, rgba(255,130,130,0.55) 55%, transparent);
        pointer-events: none;
    }
    .price-hero::after {
        content: '';
        position: absolute; top: 0; left: 0; width: 55%; height: 55%;
        background: radial-gradient(ellipse at 20% 20%, rgba(255,200,200,0.06) 0%, transparent 60%);
        pointer-events: none;
    }

    /* ── fila de info (etiqueta + valor) ── */
    .info-row {
        display: flex;
        align-items: flex-start;
        gap: 0.9rem;
        padding: 0.95rem 0;
        border-bottom: 1px solid rgba(200,140,80,0.09);
    }
    .info-row:first-child { padding-top: 0.2rem; }
    .info-row:last-child  { border-bottom: none; padding-bottom: 0.2rem; }

    .info-icon {
        width: 36px; height: 36px;
        flex-shrink: 0;
        border-radius: 11px;
        background: rgba(255,255,255,0.13);
        border: 1px solid rgba(255,255,255,0.6);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.82);
        display: flex; align-items: center; justify-content: center;
    }
    .info-label {
        font-size: 0.66rem;
        font-weight: 700;
        color: rgba(150,80,20,0.5);
        text-transform: uppercase;
        letter-spacing: 0.09em;
        margin-bottom: 0.18rem;
    }
    .info-value {
        font-size: 0.93rem;
        font-weight: 500;
        color: #2d1a08;
        line-height: 1.45;
    }

    /* ── chip de estadística ── */
    .stat-chip {
        background: rgba(255,255,255,0.09);
        border: 1px solid rgba(255,255,255,0.58);
        border-radius: 16px;
        padding: 1rem 0.85rem;
        text-align: center;
        box-shadow:
            0 4px 14px rgba(180,90,20,0.06),
            inset 0 1px 0 rgba(255,255,255,0.78);
        position: relative;
        overflow: hidden;
    }
    .stat-chip::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 50%, transparent);
    }

    /* ── barra de stock ── */
    .stock-track {
        height: 7px;
        border-radius: 4px;
        background: rgba(200,140,80,0.12);
        overflow: hidden;
    }
    .stock-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s;
    }

    /* ── mini box precio ── */
    .price-box {
        padding: 0.88rem 1rem;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.55);
        background: rgba(255,255,255,0.07);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.68);
    }
    .price-box.red {
        background: rgba(220,38,38,0.05);
        border-color: rgba(220,38,38,0.18);
    }
    .price-box.green {
        background: rgba(16,185,129,0.05);
        border-color: rgba(16,185,129,0.18);
    }

    /* ── badges ── */
    .badge {
        display: inline-flex; align-items: center; gap: 0.4rem;
        padding: 0.28rem 0.88rem;
        border-radius: 20px;
        font-size: 0.73rem; font-weight: 600;
        white-space: nowrap;
    }
    .badge-green  { background:rgba(16,185,129,0.09);  border:1px solid rgba(16,185,129,0.24);  color:rgba(4,120,87,0.9); }
    .badge-gray   { background:rgba(180,90,20,0.07);   border:1px solid rgba(180,90,20,0.18);   color:rgba(150,80,20,0.75); }
    .badge-red    { background:rgba(220,38,38,0.08);   border:1px solid rgba(220,38,38,0.22);   color:rgba(185,28,28,0.9); }
    .badge-yellow { background:rgba(245,158,11,0.09);  border:1px solid rgba(245,158,11,0.26);  color:rgba(174,95,0,0.9); }

    /* ── proveedor pill en Show ── */
    .prov-pill-show {
        display: inline-flex; align-items: center; gap: 0.35rem;
        padding: 0.22rem 0.7rem;
        border-radius: 20px;
        background: rgba(220,38,38,0.07);
        border: 1px solid rgba(220,38,38,0.18);
        font-size: 0.8rem; font-weight: 500;
        color: rgba(185,28,28,0.82);
        white-space: nowrap;
    }

    /* ── botones ── */
    .btn-back {
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius: 11px;
        cursor: pointer; text-decoration: none;
        color: rgba(150,80,20,0.65);
        transition: all 0.18s ease;
        flex-shrink: 0;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.75);
    }
    .btn-back:hover {
        background: rgba(255,255,255,0.22);
        color: rgba(110,50,5,0.9);
        transform: translateX(-2px);
    }

    .btn-edit {
        display: inline-flex; align-items: center; gap: 0.45rem;
        padding: 0.62rem 1.2rem;
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.65);
        border-radius: 13px;
        font-size: 0.84rem; font-weight: 500;
        color: rgba(120,60,10,0.82);
        text-decoration: none; cursor: pointer;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(180,90,20,0.07), inset 0 1px 0 rgba(255,255,255,0.82);
        font-family: 'Inter', sans-serif;
        white-space: nowrap;
    }
    .btn-edit:hover {
        background: rgba(255,255,255,0.16);
        border-color: rgba(255,255,255,0.88);
        color: rgba(80,35,0,0.95);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(180,90,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
    }

    .section-label {
        font-size: 0.67rem; font-weight: 700;
        color: rgba(150,80,20,0.48);
        text-transform: uppercase; letter-spacing: 0.12em;
        margin-bottom: 1.1rem;
    }

    /* ── animaciones de entrada ── */
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0);    }
    }
    .a1 { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.04s both; }
    .a2 { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.13s both; }
    .a3 { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.21s both; }
    .a4 { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.29s both; }

    @media (max-width: 992px) { .show-grid { grid-template-columns:1fr !important; gap:1.2rem !important; } }
    @media (max-width: 768px) {
        .pg-header > div, .pg-bg > div { padding-left:1rem !important; padding-right:1rem !important; }
        .price-hero { padding:1rem 1.1rem; border-radius:14px; }
        .gallery-thumb { width:48px; height:48px; }

        .gallery-thumbs-pager {
            justify-content:center;
            margin-left:auto;
            margin-right:auto;
        }
        .gallery-thumbs-window {
            justify-content:center;
        }
    }
    @media (max-width: 560px) {
        .btn-edit { width:100%; justify-content:center; }
        .show-grid .glass-panel[style*="padding: 1.5rem"] { padding:1.1rem !important; }
    }
`;

// ── NUEVO: helper URL segura ──
const imgSrc = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `/storage/${ruta}`;
};

export default function ProductosShow({ producto }) {

    /* helpers */
    const fmt = (v) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', minimumFractionDigits: 0,
        }).format(v || 0);

    const dot = (color) => (
        <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: color, display: 'inline-block', flexShrink: 0,
        }} />
    );

    /* ── NUEVO: galería — imagen principal + fotos adicionales ── */
    const todasLasFotos = [
        ...(producto.imagen ? [imgSrc(producto.imagen)] : []),
        ...(producto.fotos || []).map(f => imgSrc(f.ruta)),
    ].filter(Boolean);

    const [fotoActiva, setFotoActiva] = useState(0);
    const [lightbox, setLightbox]     = useState(false);

    const THUMBS_POR_VISTA = 3;
    const thumbPage = Math.floor(fotoActiva / THUMBS_POR_VISTA);
    const totalThumbPages = Math.ceil(todasLasFotos.length / THUMBS_POR_VISTA);
    const thumbStart = thumbPage * THUMBS_POR_VISTA;
    const thumbsVisibles = todasLasFotos.slice(thumbStart, thumbStart + THUMBS_POR_VISTA);

    const fotoAnterior  = () => setFotoActiva(f => (f - 1 + todasLasFotos.length) % todasLasFotos.length);
    const fotoSiguiente = () => setFotoActiva(f => (f + 1) % todasLasFotos.length);

    /* stock logic */
    const minimo  = producto.stock_minimo || 5;
    const agotado = producto.stock === 0;
    const bajo    = !agotado && producto.stock <= minimo;

    const stockMax = Math.max(producto.stock, minimo * 4, 1);
    const stockPct = Math.min(100, Math.round((producto.stock / stockMax) * 100));
    const stockBarColor = agotado
        ? 'rgba(220,38,38,0.55)'
        : bajo
            ? 'linear-gradient(90deg,rgba(245,158,11,0.65),rgba(245,158,11,0.9))'
            : 'linear-gradient(90deg,rgba(16,185,129,0.5),rgba(16,185,129,0.82))';

    /* precio logic */
    const margen    = (producto.precio || 0) - (producto.precio_compra || 0);
    const margenPct = producto.precio_compra > 0
        ? (((producto.precio - producto.precio_compra) / producto.precio_compra) * 100).toFixed(1)
        : null;

    const proveedores = producto.proveedores ?? [];

    return (
        <AppLayout>
            <style>{STYLES}</style>
            <div className="pg-bg">

                {/* ════════════════ HEADER ════════════════ */}
                <div className="pg-header">
                    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.4rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>

                            {/* breadcrumb */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                                <Link href="/productos" className="btn-back" title="Volver a productos">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </Link>
                                <div>
                                    <p style={{ fontSize: '0.68rem', fontWeight: '600', color: 'rgba(150,80,20,0.48)', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                                        Productos
                                    </p>
                                    <h1 style={{ fontSize: '1.35rem', fontWeight: '300', color: '#2d1a08', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                                        {producto.nombre}
                                    </h1>
                                </div>
                            </div>

                            {/* acción editar */}
                            <Link href={`/productos/${producto.id}/edit`} className="btn-edit">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Editar producto
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ════════════════ BODY ════════════════ */}
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                    <div
                        className="show-grid"
                        style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.75rem', alignItems: 'start' }}
                    >

                        {/* ─────────── COLUMNA IZQUIERDA ─────────── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                            {/* ── MODIFICADO: Foto con galería ── */}
                            <div className="a1">
                                <div className="product-img-container"
                                     style={{ cursor: todasLasFotos.length > 0 ? 'zoom-in' : 'default' }}
                                     onClick={() => todasLasFotos.length > 0 && setLightbox(true)}>
                                    {todasLasFotos.length > 0 ? (
                                        <>
                                            <img src={todasLasFotos[fotoActiva]} alt={producto.nombre} />
                                            {todasLasFotos.length > 1 && (
                                                <>
                                                    <button className="gallery-nav-btn left" onClick={e => { e.stopPropagation(); fotoAnterior(); }}>
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                                                    </button>
                                                    <button className="gallery-nav-btn right" onClick={e => { e.stopPropagation(); fotoSiguiente(); }}>
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                                                    </button>
                                                    <span className="gallery-counter">{fotoActiva + 1} / {todasLasFotos.length}</span>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem', padding: '3rem 2rem', opacity: 0.55 }}>
                                            <svg width="54" height="54" fill="none" stroke="rgba(180,100,30,0.4)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2"
                                                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.4)', fontWeight: '500' }}>Sin imagen</p>
                                        </div>
                                    )}
                                </div>

                                {/* ── NUEVO: Thumbnails si hay más de 1 foto ── */}
                                {todasLasFotos.length > 1 && (
                                    <div className="gallery-thumbs-pager">
                                        <button
                                            type="button"
                                            className="gallery-page-btn"
                                            onClick={() => setFotoActiva(Math.max(0, fotoActiva - THUMBS_POR_VISTA))}
                                            disabled={thumbPage === 0}
                                        >
                                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                                            </svg>
                                        </button>

                                        <div className="gallery-thumbs-window">
                                            {thumbsVisibles.map((foto, idx) => {
                                                const realIdx = thumbStart + idx;
                                                return (
                                                    <div
                                                        key={realIdx}
                                                        className={`gallery-thumb${fotoActiva === realIdx ? ' active' : ''}`}
                                                        onClick={() => setFotoActiva(realIdx)}
                                                    >
                                                        <img src={foto} alt={`Foto ${realIdx + 1}`} />
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button
                                            type="button"
                                            className="gallery-page-btn"
                                            onClick={() => setFotoActiva(Math.min(todasLasFotos.length - 1, fotoActiva + THUMBS_POR_VISTA))}
                                            disabled={thumbPage >= totalThumbPages - 1}
                                        >
                                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Badges de estado */}
                            <div className="a2" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {producto.activo
                                    ? <span className="badge badge-green">{dot('rgba(4,120,87,0.85)')} Activo</span>
                                    : <span className="badge badge-gray">{dot('rgba(150,80,20,0.5)')} Inactivo</span>
                                }
                                {agotado && <span className="badge badge-red">{dot('rgba(185,28,28,0.85)')} Agotado</span>}
                                {bajo    && <span className="badge badge-yellow">{dot('rgba(174,95,0,0.85)')} Bajo stock</span>}
                                {!agotado && !bajo && <span className="badge badge-green">{dot('rgba(4,120,87,0.85)')} En stock</span>}
                                {/* ── NUEVO: badge fotos ── */}
                                {todasLasFotos.length > 1 && (
                                    <span className="badge" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.22)', color: 'rgba(29,78,216,0.8)' }}>
                                        {todasLasFotos.length} fotos
                                    </span>
                                )}
                            </div>

                            {/* Chips de stock */}
                            <div className="a2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                                <div className="stat-chip">
                                    <p style={{
                                        fontSize: '1.7rem', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: 1,
                                        color: agotado ? 'rgba(185,28,28,0.85)' : bajo ? 'rgba(174,95,0,0.9)' : '#2d1a08',
                                    }}>
                                        {producto.stock}
                                    </p>
                                    <p style={{ fontSize: '0.67rem', color: 'rgba(150,80,20,0.48)', marginTop: '0.22rem', fontWeight: '500' }}>
                                        Stock actual
                                    </p>
                                </div>
                                <div className="stat-chip">
                                    <p style={{ fontSize: '1.7rem', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: 1, color: '#2d1a08' }}>
                                        {minimo}
                                    </p>
                                    <p style={{ fontSize: '0.67rem', color: 'rgba(150,80,20,0.48)', marginTop: '0.22rem', fontWeight: '500' }}>
                                        Stock mínimo
                                    </p>
                                </div>
                            </div>

                            {/* Barra nivel de inventario */}
                            <div className="a3">
                                <div className="glass-panel" style={{ padding: '1.25rem 1.4rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                                        <p style={{ fontSize: '0.68rem', fontWeight: '700', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                                            Nivel de inventario
                                        </p>
                                        <p style={{
                                            fontSize: '0.8rem', fontWeight: '700',
                                            color: agotado ? 'rgba(185,28,28,0.85)' : bajo ? 'rgba(174,95,0,0.9)' : 'rgba(4,120,87,0.85)',
                                        }}>
                                            {stockPct}%
                                        </p>
                                    </div>
                                    <div className="stock-track">
                                        <div className="stock-fill" style={{
                                            width: `${stockPct}%`,
                                            background: stockBarColor,
                                            boxShadow: agotado ? 'none'
                                                : bajo  ? '0 0 8px rgba(245,158,11,0.35)'
                                                    :         '0 0 10px rgba(16,185,129,0.3)',
                                        }}/>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem' }}>
                                        <p style={{ fontSize: '0.65rem', color: 'rgba(150,80,20,0.38)' }}>0</p>
                                        <p style={{ fontSize: '0.65rem', color: 'rgba(150,80,20,0.38)' }}>{stockMax} uds</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─────────── COLUMNA DERECHA ─────────── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                            {/* Precio hero */}
                            <div className="a1">
                                <div className="price-hero">
                                    <p style={{ fontSize: '0.66rem', fontWeight: '700', color: 'rgba(185,28,28,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                                        Precio de venta
                                    </p>
                                    <p style={{ fontSize: '2.6rem', fontWeight: '700', color: 'rgba(185,28,28,0.88)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                        {fmt(producto.precio)}
                                    </p>

                                    {producto.precio_compra > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.9rem', paddingTop: '0.9rem', borderTop: '1px solid rgba(220,38,38,0.1)', flexWrap: 'wrap' }}>
                                            <div>
                                                <p style={{ fontSize: '0.65rem', color: 'rgba(150,80,20,0.45)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                    Precio de compra
                                                </p>
                                                <p style={{ fontSize: '1rem', fontWeight: '600', color: 'rgba(120,60,10,0.75)' }}>
                                                    {fmt(producto.precio_compra)}
                                                </p>
                                            </div>
                                            <div style={{ width: '1px', height: '34px', background: 'rgba(200,140,80,0.2)', flexShrink: 0 }}/>
                                            <div>
                                                <p style={{ fontSize: '0.65rem', color: 'rgba(150,80,20,0.45)', marginBottom: '0.2rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                    Margen de ganancia
                                                </p>
                                                <p style={{ fontSize: '1rem', fontWeight: '700', color: margen >= 0 ? 'rgba(4,120,87,0.88)' : 'rgba(185,28,28,0.88)' }}>
                                                    {fmt(margen)}{margenPct ? ` · ${margenPct}%` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información general */}
                            <div className="a2">
                                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <p className="section-label">Información del producto</p>

                                    {/* Nombre */}
                                    <div className="info-row">
                                        <div className="info-icon">
                                            <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.52)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p className="info-label">Nombre</p>
                                            <p className="info-value" style={{ fontWeight: '600' }}>{producto.nombre}</p>
                                        </div>
                                    </div>

                                    {/* Categoría */}
                                    <div className="info-row">
                                        <div className="info-icon">
                                            <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.52)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p className="info-label">Categoría</p>
                                            <p className="info-value">{producto.categoria || '—'}</p>
                                        </div>
                                    </div>

                                    {/* ── PROVEEDORES ── */}
                                    <div className="info-row">
                                        <div className="info-icon">
                                            <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.52)" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                            </svg>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p className="info-label">Proveedor{proveedores.length !== 1 ? 'es' : ''}</p>
                                            {proveedores.length === 0 ? (
                                                <p className="info-value" style={{ color: 'rgba(150,80,20,0.4)' }}>—</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                                                    {proveedores.map(p => (
                                                        <span key={p.id} className="prov-pill-show">
                                                            {p.empresa || p.nombre}
                                                            {p.empresa && p.nombre !== p.empresa && (
                                                                <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>· {p.nombre}</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SKU */}
                                    {producto.codigo_barras && (
                                        <div className="info-row">
                                            <div className="info-icon">
                                                <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.52)" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p className="info-label">Código / SKU</p>
                                                <p className="info-value" style={{ fontFamily: 'monospace', letterSpacing: '0.06em', fontSize: '0.96rem' }}>
                                                    {producto.codigo_barras}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Descripción */}
                                    {producto.descripcion && (
                                        <div className="info-row">
                                            <div className="info-icon">
                                                <svg width="15" height="15" fill="none" stroke="rgba(150,80,20,0.52)" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p className="info-label">Descripción</p>
                                                <p className="info-value" style={{ fontWeight: '400', color: 'rgba(70,35,5,0.72)', lineHeight: 1.6 }}>
                                                    {producto.descripcion}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Inventario detallado */}
                            <div className="a3">
                                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <p className="section-label">Inventario</p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.7rem', marginBottom: '1.2rem' }}>
                                        {[
                                            {
                                                label: 'Stock actual',
                                                value: producto.stock,
                                                color: agotado ? 'rgba(185,28,28,0.85)' : bajo ? 'rgba(174,95,0,0.9)' : '#2d1a08',
                                            },
                                            { label: 'Stock mínimo',     value: minimo,                              color: '#2d1a08' },
                                            { label: 'Disponible extra', value: Math.max(0, producto.stock - minimo), color: '#2d1a08' },
                                        ].map(({ label, value, color }) => (
                                            <div key={label} style={{
                                                textAlign: 'center', padding: '0.9rem 0.6rem',
                                                background: 'rgba(255,255,255,0.08)',
                                                border: '1px solid rgba(255,255,255,0.55)',
                                                borderRadius: '14px',
                                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.72)',
                                            }}>
                                                <p style={{ fontSize: '1.55rem', fontWeight: '700', color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                                                    {value}
                                                </p>
                                                <p style={{ fontSize: '0.66rem', color: 'rgba(150,80,20,0.48)', marginTop: '0.22rem', fontWeight: '500' }}>
                                                    {label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* barra */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'rgba(150,80,20,0.48)', fontWeight: '500' }}>
                                                Nivel de stock
                                            </p>
                                            <p style={{ fontSize: '0.7rem', fontWeight: '700', color: agotado ? 'rgba(185,28,28,0.8)' : bajo ? 'rgba(174,95,0,0.85)' : 'rgba(4,120,87,0.8)' }}>
                                                {stockPct}%
                                            </p>
                                        </div>
                                        <div className="stock-track">
                                            <div className="stock-fill" style={{
                                                width: `${stockPct}%`,
                                                background: stockBarColor,
                                                boxShadow: agotado ? 'none' : bajo ? '0 0 8px rgba(245,158,11,0.3)' : '0 0 10px rgba(16,185,129,0.28)',
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tallas */}
                            {producto.maneja_tallas && (
                                <div className="a4">
                                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                        <p className="section-label">Tallas disponibles</p>

                                        {producto.tallas && producto.tallas.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                                {producto.tallas.map(t => {
                                                    const agot  = t.stock === 0;
                                                    const bajo  = !agot && t.stock <= (producto.stock_minimo || 5);
                                                    const color = agot  ? 'rgba(185,28,28,0.85)'
                                                                : bajo  ? 'rgba(174,95,0,0.9)'
                                                                :         'rgba(4,120,87,0.85)';
                                                    const bgBadge = agot  ? 'rgba(220,38,38,0.07)'
                                                                  : bajo  ? 'rgba(245,158,11,0.08)'
                                                                  :         'rgba(16,185,129,0.07)';
                                                    const border  = agot  ? 'rgba(220,38,38,0.2)'
                                                                  : bajo  ? 'rgba(245,158,11,0.22)'
                                                                  :         'rgba(16,185,129,0.22)';
                                                    return (
                                                        <div key={t.id} style={{
                                                            display: 'flex', alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '0.5rem 0.85rem',
                                                            background: 'rgba(255,255,255,0.06)',
                                                            border: '1px solid rgba(200,140,80,0.15)',
                                                            borderRadius: '10px',
                                                        }}>
                                                            <span style={{
                                                                minWidth: '2.6rem', textAlign: 'center',
                                                                padding: '0.18rem 0.55rem', borderRadius: '7px',
                                                                fontSize: '0.78rem', fontWeight: '700',
                                                                background: 'rgba(185,28,28,0.07)',
                                                                border: '1px solid rgba(185,28,28,0.18)',
                                                                color: 'rgba(185,28,28,0.85)',
                                                            }}>
                                                                {t.talla}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '0.78rem', fontWeight: '600',
                                                                color, padding: '0.15rem 0.55rem',
                                                                borderRadius: '7px', background: bgBadge,
                                                                border: `1px solid ${border}`,
                                                            }}>
                                                                {t.stock} uds.
                                                            </span>
                                                        </div>
                                                    );
                                                })}

                                                {/* Total */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginTop: '0.25rem', paddingTop: '0.6rem',
                                                    borderTop: '1px solid rgba(200,140,80,0.12)',
                                                }}>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: '600', color: 'rgba(150,80,20,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                        Total en stock
                                                    </span>
                                                    <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#2d1a08', letterSpacing: '-0.02em' }}>
                                                        {producto.tallas.reduce((s, t) => s + (t.stock || 0), 0)} uds.
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.42)', textAlign: 'center', padding: '0.75rem 0' }}>
                                                Sin tallas registradas
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Resumen de precios */}
                            {producto.precio_compra > 0 && (
                                <div className="a4">
                                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                        <p className="section-label">Resumen de precios</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                                            {[
                                                { label: 'Precio de venta',  value: fmt(producto.precio),          cls: 'price-box red'   },
                                                { label: 'Precio de compra', value: fmt(producto.precio_compra),   cls: 'price-box'       },
                                                margenPct && { label: 'Margen (%)',    value: `${margenPct}%`,     cls: `price-box ${margen >= 0 ? 'green' : 'red'}` },
                                                margenPct && { label: 'Ganancia neta', value: fmt(margen),         cls: `price-box ${margen >= 0 ? 'green' : 'red'}` },
                                            ].filter(Boolean).map(({ label, value, cls }) => (
                                                <div key={label} className={cls}>
                                                    <p style={{ fontSize: '0.66rem', color: 'rgba(150,80,20,0.48)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.28rem' }}>
                                                        {label}
                                                    </p>
                                                    <p style={{ fontSize: '1.05rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#2d1a08' }}>
                                                        {value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>{/* fin columna derecha */}
                    </div>
                </div>

            </div>

            {/* ── NUEVO: Lightbox ── */}
            {lightbox && (
                <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
                    <button className="lightbox-close" onClick={() => setLightbox(false)}>
                        <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    {todasLasFotos.length > 1 && (
                        <>
                            <button className="lightbox-nav left" onClick={e => { e.stopPropagation(); fotoAnterior(); }}>
                                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button className="lightbox-nav right" onClick={e => { e.stopPropagation(); fotoSiguiente(); }}>
                                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </>
                    )}
                    <img src={todasLasFotos[fotoActiva]} alt={producto.nombre} onClick={e => e.stopPropagation()} />
                </div>
            )}
        </AppLayout>
    );
}
