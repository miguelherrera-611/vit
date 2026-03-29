// resources/js/Pages/Catalogo/Subcategoria.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import CarritoDrawer from '@/Components/CarritoDrawer';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function CatalogoSubcategoria({ grupo, subcat, productos }) {
    const { auth } = usePage().props;
    const [carrito, setCarrito] = useState([]);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [animando, setAnimando] = useState(null);

    // Persistir carrito en sessionStorage
    useEffect(() => {
        const saved = sessionStorage.getItem('vitali_carrito');
        if (saved) setCarrito(JSON.parse(saved));
    }, []);
    useEffect(() => {
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        if (!producto.disponible) return;
        setAnimando(producto.id);
        setTimeout(() => setAnimando(null), 600);
        setCarrito(prev => {
            const existe = prev.find(i => i.id === producto.id);
            if (existe) {
                return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
            }
            return [...prev, {
                id: producto.id, nombre: producto.nombre,
                precio: producto.precio, imagen: producto.imagen,
                cantidad: 1, stock: producto.stock,
            }];
        });
    };

    return (
        <ClienteLayout carrito={carrito} onAbrirCarrito={() => setCarritoAbierto(true)}>
            <Head title={`${subcat.nombre} — VitaliStore`} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes staggerUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }

                .prod-card {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 24px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 12px 40px rgba(180,90,20,0.07), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88);
                    overflow: hidden; transition: all 0.32s cubic-bezier(0.16,1,0.3,1);
                    position: relative;
                }
                .prod-card::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }
                .prod-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 24px 60px rgba(180,90,20,0.12), 0 8px 24px rgba(180,90,20,0.07);
                    border-color: rgba(255,255,255,0.85);
                }
                .prod-img { width:100%; height:240px; object-fit:cover; transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); }
                .prod-card:hover .prod-img { transform:scale(1.04); }
                .prod-placeholder { width:100%; height:240px; display:flex; align-items:center; justify-content:center; font-size:4rem; background:rgba(255,255,255,0.04); }

                .btn-add {
                    width:100%; padding:0.75rem 1rem; border-radius:14px;
                    font-size:0.875rem; font-weight:600; cursor:pointer;
                    font-family:'Inter',sans-serif; transition:all 0.2s ease;
                    position:relative; overflow:hidden; border:none;
                }
                .btn-add.disponible {
                    background:rgba(220,38,38,0.09); border:1px solid rgba(220,38,38,0.35);
                    color:rgba(185,28,28,0.95);
                    box-shadow:0 4px 14px rgba(220,38,38,0.1),inset 0 1px 0 rgba(255,120,120,0.2);
                }
                .btn-add.disponible:hover {
                    background:rgba(220,38,38,0.15); transform:translateY(-1px);
                    box-shadow:0 8px 20px rgba(220,38,38,0.15);
                }
                .btn-add.animando { animation:pulse 0.6s ease; }
                .btn-add.agotado {
                    background:rgba(200,140,80,0.05); border:1px solid rgba(200,140,80,0.2);
                    color:rgba(150,80,20,0.35); cursor:not-allowed;
                }
                .ver-detalle {
                    display:block; text-align:center; padding:0.45rem;
                    font-size:0.78rem; color:rgba(150,80,20,0.55);
                    text-decoration:none; transition:color 0.15s;
                }
                .ver-detalle:hover { color:rgba(120,50,10,0.85); }

                .breadcrumb-link {
                    display:inline-flex; align-items:center; gap:0.3rem;
                    font-size:0.82rem; color:rgba(150,80,20,0.65); text-decoration:none;
                    padding:0.3rem 0.6rem; border-radius:8px; transition:all 0.15s;
                }
                .breadcrumb-link:hover { color:rgba(120,50,10,0.9); background:rgba(255,255,255,0.2); }

                .anim-1 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
                .anim-2 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
                .anim-3 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
                .anim-4 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
                .anim-5 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
                .anim-6 { animation:staggerUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
            `}</style>

            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:'0.25rem',marginBottom:'2.5rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="breadcrumb-link">Catálogo</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.8rem'}}>›</span>
                    <Link href={`/catalogo/${grupo.id}`} className="breadcrumb-link">{grupo.nombre}</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.8rem'}}>›</span>
                    <span style={{fontSize:'0.82rem',fontWeight:'600',color:'rgba(120,55,10,0.85)'}}>{subcat.nombre}</span>
                </div>

                {/* Encabezado */}
                <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'2.5rem',flexWrap:'wrap',gap:'1rem'}}>
                    <div>
                        <h1 style={{fontSize:'clamp(1.6rem,3.5vw,2.5rem)',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',marginBottom:'0.4rem'}}>
                            {subcat.nombre}
                        </h1>
                        <p style={{fontSize:'0.85rem',color:'rgba(150,80,20,0.6)'}}>
                            {productos.length} producto{productos.length !== 1 ? 's' : ''} disponible{productos.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Grid de productos */}
                {productos.length === 0 ? (
                    <div style={{textAlign:'center',padding:'5rem 0',background:'rgba(255,255,255,0.04)',borderRadius:'24px',border:'1px solid rgba(255,255,255,0.65)'}}>
                        <div style={{fontSize:'3.5rem',marginBottom:'1rem'}}>🛍️</div>
                        <p style={{fontSize:'1rem',color:'rgba(150,80,20,0.6)',marginBottom:'1.5rem'}}>No hay productos en esta categoría.</p>
                        <Link href={`/catalogo/${grupo.id}`} style={{color:'rgba(185,28,28,0.8)',textDecoration:'none',fontWeight:'500',fontSize:'0.9rem'}}>
                            ← Ver otras subcategorías
                        </Link>
                    </div>
                ) : (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.25rem'}}>
                        {productos.map((prod, idx) => {
                            const animClass = `anim-${Math.min((idx % 6) + 1, 6)}`;
                            return (
                                <div key={prod.id} className={`prod-card ${animClass}`}>
                                    {/* Imagen */}
                                    <div style={{overflow:'hidden',position:'relative'}}>
                                        {prod.imagen ? (
                                            <img src={`/storage/${prod.imagen}`} alt={prod.nombre} className="prod-img" />
                                        ) : (
                                            <div className="prod-placeholder">👔</div>
                                        )}
                                        {!prod.disponible && (
                                            <div style={{
                                                position:'absolute',inset:0,
                                                background:'rgba(0,0,0,0.3)',
                                                backdropFilter:'blur(2px)',
                                                display:'flex',alignItems:'center',justifyContent:'center',
                                            }}>
                                                <span style={{
                                                    padding:'0.4rem 1rem',background:'rgba(0,0,0,0.6)',
                                                    borderRadius:'20px',fontSize:'0.78rem',fontWeight:'600',color:'white',
                                                }}>Agotado</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{padding:'1.25rem'}}>
                                        <Link href={`/catalogo/producto/${prod.id}`} style={{textDecoration:'none'}}>
                                            <h3 style={{fontSize:'0.95rem',fontWeight:'600',color:'#2d1a08',letterSpacing:'-0.01em',marginBottom:'0.25rem',lineHeight:'1.3'}}>
                                                {prod.nombre}
                                            </h3>
                                        </Link>
                                        {prod.descripcion && (
                                            <p style={{fontSize:'0.78rem',color:'rgba(150,80,20,0.6)',marginBottom:'0.75rem',lineHeight:'1.4',
                                                overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                                                {prod.descripcion}
                                            </p>
                                        )}

                                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
                                            <span style={{fontSize:'1.15rem',fontWeight:'700',color:'#2d1a08',letterSpacing:'-0.02em'}}>
                                                {formatCOP(prod.precio)}
                                            </span>
                                            <span style={{
                                                fontSize:'0.7rem',fontWeight:'600',
                                                padding:'0.2rem 0.55rem',borderRadius:'20px',
                                                background: prod.disponible ? 'rgba(16,185,129,0.1)' : 'rgba(200,140,80,0.1)',
                                                color: prod.disponible ? 'rgba(4,120,87,0.85)' : 'rgba(150,80,20,0.5)',
                                                border: prod.disponible ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(200,140,80,0.2)',
                                            }}>
                                                {prod.disponible ? `${prod.stock} disponibles` : 'Agotado'}
                                            </span>
                                        </div>

                                        <button
                                            className={`btn-add ${prod.disponible ? 'disponible' : 'agotado'} ${animando === prod.id ? 'animando' : ''}`}
                                            onClick={() => agregarAlCarrito(prod)}
                                            disabled={!prod.disponible}
                                        >
                                            {prod.disponible ? (
                                                <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.4rem'}}>
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                    </svg>
                                                    Agregar al carrito
                                                </span>
                                            ) : 'No disponible'}
                                        </button>

                                        <Link href={`/catalogo/producto/${prod.id}`} className="ver-detalle">
                                            Ver detalle →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Drawer del carrito */}
            <CarritoDrawer
                open={carritoAbierto}
                onClose={() => setCarritoAbierto(false)}
                carrito={carrito}
                setCarrito={setCarrito}
                auth={auth}
            />
        </ClienteLayout>
    );
}
