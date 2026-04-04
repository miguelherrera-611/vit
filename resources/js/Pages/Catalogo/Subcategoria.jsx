// resources/js/Pages/Catalogo/Subcategoria.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function CatalogoSubcategoria({ grupo, subcat, productos }) {
    const { auth } = usePage().props;
    const [animando, setAnimando] = useState(null);

    const agregarAlCarrito = (producto) => {
        if (!producto.disponible) return;

        // Sin sesión: disparar modal de auth en el layout
        if (!auth?.user) {
            window.dispatchEvent(new CustomEvent('vitali:carrito-actualizado', { detail: { abrir: false, sinSesion: true } }));
            return;
        }

        setAnimando(producto.id);
        setTimeout(() => setAnimando(null), 600);

        // Leer carrito con clave por usuario
        const key = `vitali_carrito_${auth.user.id}`;
        let carrito = [];
        try { carrito = JSON.parse(sessionStorage.getItem(key) || '[]'); } catch {}

        const existe = carrito.find(i => i.id === producto.id);
        if (existe) {
            carrito = carrito.map(i => i.id === producto.id
                ? { ...i, cantidad: Math.min(i.cantidad + 1, producto.stock) } : i);
        } else {
            carrito = [...carrito, {
                id: producto.id, nombre: producto.nombre, precio: producto.precio,
                imagen: producto.imagen, cantidad: 1, stock: producto.stock,
            }];
        }

        sessionStorage.setItem(key, JSON.stringify(carrito));
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));

        // Notificar al layout
        window.dispatchEvent(new CustomEvent('vitali:carrito-actualizado', { detail: { abrir: true } }));
    };

    return (
        <ClienteLayout>
            <Head title={`${subcat.nombre} — VitaliStore`}/>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

                .prod-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1rem;
                }
                .prod-card {
                    background: rgba(255,255,255,0.45);
                    border: 1px solid rgba(200,140,80,0.12);
                    border-radius: 14px; overflow: hidden;
                    transition: all 0.22s ease; position: relative;
                }
                .prod-card:hover {
                    background: rgba(255,255,255,0.65);
                    border-color: rgba(200,140,80,0.22);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 28px rgba(180,90,20,0.07);
                }
                .prod-img {
                    width: 100%; height: 220px; object-fit: cover;
                    transition: transform 0.32s ease; display: block;
                }
                .prod-card:hover .prod-img { transform: scale(1.03); }
                .prod-placeholder {
                    width: 100%; height: 220px;
                    background: rgba(200,140,80,0.06);
                    border-bottom: 1px solid rgba(200,140,80,0.1);
                    display: flex; align-items: center; justify-content: center;
                }
                .btn-add {
                    width: 100%; padding: 0.7rem 1rem; border-radius: 9px;
                    font-size: 0.82rem; font-weight: 500; cursor: pointer;
                    font-family: 'Inter', sans-serif; transition: all 0.18s; border: none;
                    letter-spacing: -0.01em;
                }
                .btn-add.disponible {
                    background: rgba(185,28,28,0.07); border: 1px solid rgba(185,28,28,0.2);
                    color: rgba(185,28,28,0.9);
                }
                .btn-add.disponible:hover { background: rgba(185,28,28,0.12); border-color: rgba(185,28,28,0.32); }
                .btn-add.animando { animation: pulse 0.6s ease; }
                .btn-add.agotado {
                    background: rgba(200,140,80,0.04); border: 1px solid rgba(200,140,80,0.12);
                    color: rgba(150,80,20,0.3); cursor: not-allowed;
                }
                .ver-detalle {
                    display: block; text-align: center; padding: 0.4rem;
                    font-size: 0.74rem; color: rgba(150,80,20,0.5);
                    text-decoration: none; transition: color 0.12s; letter-spacing: -0.01em;
                }
                .ver-detalle:hover { color: rgba(120,50,10,0.8); }
                .breadcrumb-link {
                    font-size: 0.78rem; color: rgba(150,80,20,0.55);
                    text-decoration: none; padding: 0.25rem 0.5rem;
                    border-radius: 6px; transition: all 0.12s; letter-spacing: -0.01em;
                }
                .breadcrumb-link:hover { color: rgba(120,50,10,0.85); background: rgba(200,140,80,0.07); }
                .anim-1 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both; }
                .anim-3 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.11s both; }
                .anim-4 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.14s both; }
                .anim-5 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.17s both; }
                .anim-6 { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }

                @media (max-width: 768px) {
                    .prod-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
                    .prod-img { height: 180px; }
                    .prod-placeholder { height: 180px; }
                }
                @media (max-width: 400px) {
                    .prod-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2rem 1.5rem 4rem'}}>

                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:'0.25rem',marginBottom:'2rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="breadcrumb-link">Catálogo</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.75rem'}}>›</span>
                    <Link href={`/catalogo/${grupo.id}`} className="breadcrumb-link">{grupo.nombre}</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.75rem'}}>›</span>
                    <span style={{fontSize:'0.78rem',fontWeight:'500',color:'rgba(120,55,10,0.75)',letterSpacing:'-0.01em'}}>
                        {subcat.nombre}
                    </span>
                </div>

                {/* Header */}
                <div style={{marginBottom:'2rem',animation:'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
                    <h1 style={{fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.35rem'}}>
                        {subcat.nombre}
                    </h1>
                    <p style={{fontSize:'0.82rem',color:'rgba(150,80,20,0.5)'}}>
                        {productos.length} {productos.length === 1 ? 'producto disponible' : 'productos disponibles'}
                    </p>
                </div>

                {/* Grid */}
                {productos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'4rem 0',
                        background:'rgba(255,255,255,0.4)',borderRadius:'14px',
                        border:'1px solid rgba(200,140,80,0.1)'}}>
                        <p style={{fontSize:'0.88rem',color:'rgba(150,80,20,0.5)',marginBottom:'1rem'}}>
                            No hay productos en esta categoría.
                        </p>
                        <Link href={`/catalogo/${grupo.id}`} style={{
                            fontSize:'0.82rem',color:'rgba(185,28,28,0.75)',
                            textDecoration:'none',fontWeight:'500',
                        }}>
                            Ver otras subcategorías
                        </Link>
                    </div>
                ) : (
                    <div className="prod-grid">
                        {productos.map((prod, idx) => (
                            <div key={prod.id} className={`prod-card anim-${Math.min((idx % 6) + 1, 6)}`}>
                                <div style={{overflow:'hidden',position:'relative'}}>
                                    {prod.imagen ? (
                                        <img src={prod.imagen} alt={prod.nombre} className="prod-img"/>
                                    ) : (
                                        <div className="prod-placeholder">
                                            <svg width="28" height="28" fill="none" stroke="rgba(150,80,20,0.2)" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                    )}
                                    {!prod.disponible && (
                                        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.22)',
                                            backdropFilter:'blur(2px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                                            <span style={{padding:'0.3rem 0.875rem',background:'rgba(0,0,0,0.5)',
                                                borderRadius:'20px',fontSize:'0.74rem',fontWeight:'500',color:'rgba(255,255,255,0.9)'}}>
                                                Agotado
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div style={{padding:'1rem'}}>
                                    <Link href={`/catalogo/producto/${prod.id}`} style={{textDecoration:'none'}}>
                                        <h3 style={{fontSize:'0.88rem',fontWeight:'500',color:'#2d1a08',
                                            letterSpacing:'-0.01em',marginBottom:'0.2rem',lineHeight:'1.35'}}>
                                            {prod.nombre}
                                        </h3>
                                    </Link>
                                    {prod.descripcion && (
                                        <p style={{fontSize:'0.74rem',color:'rgba(150,80,20,0.55)',marginBottom:'0.65rem',
                                            lineHeight:'1.4',overflow:'hidden',display:'-webkit-box',
                                            WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                                            {prod.descripcion}
                                        </p>
                                    )}
                                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.75rem'}}>
                                        <span style={{fontSize:'1.05rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.02em'}}>
                                            {formatCOP(prod.precio)}
                                        </span>
                                        <span style={{
                                            fontSize:'0.68rem',fontWeight:'500',padding:'0.18rem 0.5rem',borderRadius:'20px',
                                            background:prod.disponible?'rgba(16,185,129,0.08)':'rgba(200,140,80,0.07)',
                                            color:prod.disponible?'rgba(4,120,87,0.8)':'rgba(150,80,20,0.45)',
                                            border:prod.disponible?'1px solid rgba(16,185,129,0.2)':'1px solid rgba(200,140,80,0.15)',
                                        }}>
                                            {prod.disponible ? `${prod.stock} uds.` : 'Agotado'}
                                        </span>
                                    </div>
                                    <button
                                        className={`btn-add ${prod.disponible ? 'disponible' : 'agotado'} ${animando === prod.id ? 'animando' : ''}`}
                                        onClick={() => agregarAlCarrito(prod)}
                                        disabled={!prod.disponible}
                                    >
                                        {prod.disponible ? 'Agregar al carrito' : 'No disponible'}
                                    </button>
                                    <Link href={`/catalogo/producto/${prod.id}`} className="ver-detalle">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </ClienteLayout>
    );
}
