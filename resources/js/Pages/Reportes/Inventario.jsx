import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

function StockBar({ stock, minimo }) {
    if (stock === 0) return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Agotado</span>;
    if (stock <= minimo) return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Bajo stock</span>;
    return <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">En stock</span>;
}

export default function ReporteInventario({ productos = [], porCategoria = [], criticos = [], kpis = {} }) {
    const [vista, setVista] = useState('resumen'); // 'resumen' | 'criticos' | 'todos'
    const [busqueda, setBusqueda] = useState('');

    const productosFiltrados = useMemo(() => {
        const q = busqueda.toLowerCase();
        return productos.filter(p =>
            !q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
        );
    }, [productos, busqueda]);

    const maxStock = Math.max(...porCategoria.map(c => c.total_stock || 0), 1);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/reportes" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Reporte de Inventario</h1>
                                <p className="mt-1 text-sm text-gray-500">Estado actual del stock por categoría y producto</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* KPI cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {[
                            { label: 'Productos activos',  value: kpis.total_productos,                  color: 'text-gray-900'    },
                            { label: 'Valor en venta',     value: fmt(kpis.valor_inventario_venta),       color: 'text-emerald-600' },
                            { label: 'Valor en compra',    value: fmt(kpis.valor_inventario_compra),      color: 'text-blue-600'    },
                            { label: 'Ganancia potencial', value: fmt(kpis.ganancia_potencial),           color: 'text-violet-600'  },
                            { label: 'Bajo stock',         value: kpis.bajo_stock,                       color: 'text-amber-600'   },
                            { label: 'Agotados',           value: kpis.agotados,                         color: 'text-red-600'     },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`text-xl font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stock por categoría */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Stock por categoría</h2>
                        <p className="text-xs text-gray-400 mb-6">Distribución de unidades y valor por categoría</p>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-100">
                                <tr>
                                    {['Categoría', 'Productos', 'Uds', 'Valor venta', 'Valor compra', 'Ganancia', 'Bajo stock', 'Agotados'].map(h => (
                                        <th key={h} className="pb-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider pr-4">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {porCategoria.map(cat => (
                                    <tr key={cat.categoria} className="hover:bg-gray-50">
                                        <td className="py-3 pr-4">
                                            <p className="text-sm font-medium text-gray-900">{cat.categoria}</p>
                                            <div className="mt-1 w-32 bg-gray-100 rounded-full h-1.5">
                                                <div className="h-1.5 bg-orange-400 rounded-full"
                                                     style={{ width: `${Math.min(100, (cat.total_stock / maxStock) * 100)}%` }} />
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-sm text-gray-600">{cat.total_productos}</td>
                                        <td className="py-3 pr-4 text-sm font-semibold text-gray-900">{cat.total_stock} uds</td>
                                        <td className="py-3 pr-4 text-sm font-semibold text-emerald-600">{fmt(cat.valor_venta)}</td>
                                        <td className="py-3 pr-4 text-sm text-blue-600">{cat.valor_compra > 0 ? fmt(cat.valor_compra) : <span className="text-gray-300">—</span>}</td>
                                        <td className="py-3 pr-4 text-sm font-semibold text-violet-600">{cat.ganancia_potencial > 0 ? fmt(cat.ganancia_potencial) : <span className="text-gray-300">—</span>}</td>
                                        <td className="py-3 pr-4">
                                            {cat.bajo_stock > 0
                                                ? <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{cat.bajo_stock}</span>
                                                : <span className="text-xs text-gray-300">—</span>}
                                        </td>
                                        <td className="py-3">
                                            {cat.agotados > 0
                                                ? <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">{cat.agotados}</span>
                                                : <span className="text-xs text-gray-300">—</span>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Tabs: críticos / todos */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            {[
                                { key: 'criticos', label: `⚠ Críticos (${criticos.length})` },
                                { key: 'todos',    label: `📦 Todos los productos (${productos.length})` },
                            ].map(t => (
                                <button key={t.key} onClick={() => setVista(t.key)}
                                        className={`px-6 py-4 text-sm font-medium transition ${vista === t.key ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {t.label}
                                </button>
                            ))}
                            {vista === 'todos' && (
                                <div className="flex-1 flex items-center justify-end px-4">
                                    <input type="text" placeholder="Buscar producto…" value={busqueda}
                                           onChange={e => setBusqueda(e.target.value)}
                                           className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 w-52" />
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Producto', 'Categoría', 'Stock', 'Stock mín.', 'P. Compra', 'P. Venta', 'Valor compra', 'Valor venta', 'Estado'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {(vista === 'criticos' ? criticos : productosFiltrados).map(p => (
                                    <tr key={p.id} className={`hover:bg-gray-50 ${p.stock === 0 ? 'bg-red-50/40' : p.stock <= p.stock_minimo ? 'bg-amber-50/40' : ''}`}>
                                        <td className="px-6 py-3">
                                            <p className="text-sm font-medium text-gray-900">{p.nombre}</p>
                                            <p className="text-xs text-gray-400">{p.codigo_barras || '—'}</p>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{p.categoria}</td>
                                        <td className="px-6 py-3 text-sm font-bold text-gray-900">{p.stock}</td>
                                        <td className="px-6 py-3 text-sm text-gray-400">{p.stock_minimo}</td>
                                        <td className="px-6 py-3 text-sm text-blue-600">{p.precio_compra > 0 ? fmt(p.precio_compra) : <span className="text-gray-300">—</span>}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-700">{fmt(p.precio)}</td>
                                        <td className="px-6 py-3 text-sm text-blue-600">{p.precio_compra > 0 ? fmt(p.precio_compra * p.stock) : <span className="text-gray-300">—</span>}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-emerald-600">{fmt(p.precio * p.stock)}</td>
                                        <td className="px-6 py-3"><StockBar stock={p.stock} minimo={p.stock_minimo} /></td>
                                    </tr>
                                ))}
                                {(vista === 'criticos' ? criticos : productosFiltrados).length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-10 text-center text-gray-400">
                                            {vista === 'criticos' ? '✅ No hay productos con stock crítico' : 'Sin resultados'}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
