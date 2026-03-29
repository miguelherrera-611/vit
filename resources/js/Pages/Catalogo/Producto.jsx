// resources/js/Pages/Catalogo/Producto.jsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import CarritoDrawer from '@/Components/CarritoDrawer';

const formatCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

export default function CatalogoProducto({ producto }) {
    const { auth } = usePage().props;
    const [carrito, setCarrito]           = useState([]);
    const [carritoAbierto, setCarritoAbierto] = useState(false);
    const [cantidad, setCantidad]         = useState(1);
    const [agregado, setAgregado]         = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem('vitali_carrito');
        if (saved) setCarrito(JSON.parse(saved));
    }, []);
    useEffect(() => {
        sessionStorage.setItem('vitali_carrito', JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = () => {
        if (!producto.disponible) return;
        setCarrito(prev => {
            const existe = prev.find(i => i.id === producto.id);
            if (existe) {
                return prev.map(i => i.id === producto.id
                    ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
                    : i
                );
            }
            return [...prev, {
                id: producto.id, nombre: producto.nombre,
                precio: producto.precio, imagen: producto.imagen,
                cantidad, stock: producto.stock,
            }];
        });
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2000);
        setCarritoAbierto(true);
    };

    return (
        <ClienteLayout carrito={carrito} onAbrirCarrito={() => setCarritoAbierto(true)}>
            <Head title={`${producto.nombre} — VitaliStore`} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
                @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes checkIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }

                .prod-glass {
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(22px) saturate(150%);
                    -webkit-backdrop-filter: blur(22px) saturate(150%);
                    border-radius: 28px; border: 1px solid rgba(255,255,255,0.65);
                    box-shadow: 0 16px 48px rgba(180,90,20,0.08), 0 4px 14px rgba(180,90,20,0.04),
                        inset 0 1.5px 0 rgba(255,255,255,0.88), inset 0 -1px 0 rgba(180,90,20,0.04);
                    animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
                    position: relative; overflow: hidden;
                }
                .prod-glass::before {
                    content:''; position:absolute; top:0; left:0; right:0; height:1px;
                    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.95) 25%,rgba(255,255,255,0.95) 75%,transparent);
                    pointer-events:none; z-index:1;
                }

                .qty-btn {
                    width:36px; height:36px; border-radius:10px; border:none; cursor:pointer;
                    background:rgba(255,255,255,0.1); border:1px solid rgba(200,140,80,0.3);
                    display:flex; align-items:center; justify-content:center;
                    color:rgba(120,60,10,0.8); font-size:1.1rem; font-weight:600;
                    transition:all 0.15s; font-family:'Inter',sans-serif;
                }
                .qty-btn:hover:not(:disabled) { background:rgba(255,255,255,0.2); border-color:rgba(200,140,80,0.5); }
                .qty-btn:disabled { opacity:0.35; cursor:not-allowed; }

                .btn-agregar {
                    width:100%; padding:1rem; border-radius:16px;
                    font-family:'Inter',sans-serif; font-size:0.95rem; font-weight:600;
                    cursor:pointer; transition:all 0.25s ease;
                    position:relative; overflow:hidden; border:none;
                }
                .btn-agregar.activo {
                    background:rgba(220,38,38,0.09); border:1px solid rgba(220,38,38,0.35);
                    color:rgba(185,28,28,0.95);
                    box-shadow:0 8px 24px rgba(220,38,38,0.12),inset 0 1px 0 rgba(255,120,120,0.25);
                }
                .btn-agregar.activo:hover {
                    background:rgba(220,38,38,0.15); transform:translateY(-2px);
                    box-shadow:0 14px 36px rgba(220,38,38,0.16);
                }
                .btn-agregar.success {
                    background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.35);
                    color:rgba(4,120,87,0.95);
                    box-shadow:0 8px 24px rgba(16,185,129,0.12);
                }
                .btn-agregar.agotado {
                    background:rgba(200,140,80,0.05); border:1px solid rgba(200,140,80,0.15);
                    color:rgba(150,80,20,0.35); cursor:not-allowed;
                }

                .breadcrumb-link {
                    display:inline-flex; align-items:center; gap:0.3rem;
                    font-size:0.82rem; color:rgba(150,80,20,0.65); text-decoration:none;
                    padding:0.3rem 0.6rem; border-radius:8px; transition:all 0.15s;
                }
                .breadcrumb-link:hover { color:rgba(120,50,10,0.9); background:rgba(255,255,255,0.2); }
            `}</style>

            <div style={{maxWidth:'1280px',margin:'0 auto',padding:'2.5rem 1.5rem 4rem'}}>

                {/* Breadcrumb */}
                <div style={{display:'flex',alignItems:'center',gap:'0.25rem',marginBottom:'2.5rem',flexWrap:'wrap'}}>
                    <Link href="/catalogo" className="breadcrumb-link">Catálogo</Link>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.8rem'}}>›</span>
                    <span style={{fontSize:'0.82rem',color:'rgba(120,55,10,0.7)'}}>{producto.categoria}</span>
                    <span style={{color:'rgba(150,80,20,0.3)',fontSize:'0.8rem'}}>›</span>
                    <span style={{fontSize:'0.82rem',fontWeight:'600',color:'rgba(120,55,10,0.85)'}}>{producto.nombre}</span>
                </div>

                {/* Card del producto */}
                <div className="prod-glass">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0'}}>

                        {/* Imagen izquierda */}
                        <div style={{overflow:'hidden',borderRadius:'28px 0 0 28px',position:'relative',minHeight:'500px'}}>
                            {producto.imagen ? (
                                <img
                                    src={`/storage/${producto.imagen}`}
                                    alt={producto.nombre}
                                    style={{width:'100%',height:'100%',objectFit:'cover'}}
                                />
                            ) : (
                                <div style={{
                                    width:'100%',height:'100%',minHeight:'500px',
                                    display:'flex',alignItems:'center',justifyContent:'center',
                                    fontSize:'6rem',background:'rgba(255,255,255,0.04)',
                                }}>
                                    👔
                                </div>
                            )}
                            {!producto.disponible && (
                                <div style={{
                                    position:'absolute',inset:0,
                                    background:'rgba(0,0,0,0.32)',backdropFilter:'blur(2px)',
                                    display:'flex',alignItems:'center',justifyContent:'center',
                                }}>
                                    <span style={{
                                        padding:'0.5rem 1.5rem',background:'rgba(0,0,0,0.65)',
                                        borderRadius:'30px',fontSize:'0.9rem',fontWeight:'700',color:'white',
                                    }}>Agotado</span>
                                </div>
                            )}
                        </div>

                        {/* Info derecha */}
                        <div style={{padding:'3rem'}}>
                            <p style={{fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>
                                {producto.categoria}
                            </p>
                            <h1 style={{fontSize:'1.9rem',fontWeight:'300',color:'#2d1a08',letterSpacing:'-0.04em',lineHeight:'1.2',marginBottom:'1rem'}}>
                                {producto.nombre}
                            </h1>

                            {/* Precio */}
                            <div style={{marginBottom:'1.5rem'}}>
                                <span style={{fontSize:'2.2rem',fontWeight:'700',color:'#2d1a08',letterSpacing:'-0.03em'}}>
                                    {formatCOP(producto.precio)}
                                </span>
                            </div>

                            {/* Disponibilidad */}
                            <div style={{
                                display:'inline-flex',alignItems:'center',gap:'0.4rem',
                                padding:'0.4rem 0.9rem',borderRadius:'20px',marginBottom:'1.75rem',
                                background: producto.disponible ? 'rgba(16,185,129,0.08)' : 'rgba(200,140,80,0.08)',
                                border: producto.disponible ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(200,140,80,0.2)',
                            }}>
                                <div style={{
                                    width:'8px',height:'8px',borderRadius:'50%',
                                    background: producto.disponible ? 'rgba(16,185,129,0.8)' : 'rgba(200,140,80,0.6)',
                                }} />
                                <span style={{
                                    fontSize:'0.8rem',fontWeight:'600',
                                    color: producto.disponible ? 'rgba(4,120,87,0.85)' : 'rgba(150,80,20,0.65)',
                                }}>
                                    {producto.disponible ? `${producto.stock} unidades disponibles` : 'Sin stock'}
                                </span>
                            </div>

                            {/* Descripción */}
                            {producto.descripcion && (
                                <div style={{
                                    padding:'1.25rem',borderRadius:'16px',marginBottom:'2rem',
                                    background:'rgba(255,255,255,0.04)',border:'1px solid rgba(200,140,80,0.12)',
                                }}>
                                    <p style={{fontSize:'0.88rem',color:'rgba(120,60,10,0.75)',lineHeight:'1.7',margin:0}}>
                                        {producto.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Cantidad */}
                            {producto.disponible && (
                                <div style={{marginBottom:'1.5rem'}}>
                                    <label style={{display:'block',fontSize:'0.72rem',fontWeight:'700',color:'rgba(150,80,20,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.6rem'}}>
                                        Cantidad
                                    </label>
                                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                                        <button className="qty-btn" onClick={() => setCantidad(c => Math.max(1, c - 1))} disabled={cantidad <= 1}>−</button>
                                        <span style={{
                                            minWidth:'40px',textAlign:'center',
                                            fontSize:'1rem',fontWeight:'600',color:'#2d1a08',
                                        }}>
                                            {cantidad}
                                        </span>
                                        <button className="qty-btn" onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))} disabled={cantidad >= producto.stock}>+</button>
                                    </div>
                                </div>
                            )}

                            {/* Botón agregar */}
                            <button
                                className={`btn-agregar ${!producto.disponible ? 'agotado' : agregado ? 'success' : 'activo'}`}
                                onClick={agregarAlCarrito}
                                disabled={!producto.disponible}
                            >
                                {agregado ? (
                                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',animation:'checkIn 0.3s ease'}}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                        ¡Agregado al carrito!
                                    </span>
                                ) : producto.disponible ? (
                                    <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        </svg>
                                        Agregar al carrito
                                    </span>
                                ) : 'Producto agotado'}
                            </button>

                            {/* Garantías */}
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginTop:'1.75rem'}}>
                                {[
                                    { icon:'🚚', label:'Envío a todo Colombia' },
                                    { icon:'💳', label:'Pago por transferencia' },
                                    { icon:'✅', label:'Comprobante requerido' },
                                    { icon:'📦', label:'Seguimiento de pedido' },
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        display:'flex',alignItems:'center',gap:'0.5rem',
                                        padding:'0.6rem 0.75rem',borderRadius:'12px',
                                        background:'rgba(255,255,255,0.04)',
                                        border:'1px solid rgba(200,140,80,0.1)',
                                    }}>
                                        <span style={{fontSize:'1rem'}}>{item.icon}</span>
                                        <span style={{fontSize:'0.72rem',color:'rgba(150,80,20,0.65)',fontWeight:'500',lineHeight:'1.3'}}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
