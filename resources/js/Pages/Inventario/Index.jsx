import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;

export default function InventarioIndex({ productos = [] }) {
    const [searchTerm, setSearchTerm]       = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage]     = useState(1);

    const stats = useMemo(() => {
        const activos = productos.filter(p => p.activo);
        return {
            total:     activos.length,
            enStock:   activos.filter(p => p.stock > p.stock_minimo).length,
            bajoStock: productos.filter(p => p.stock <= p.stock_minimo && p.stock > 0).length,
            agotados:  productos.filter(p => p.stock === 0).length,
        };
    }, [productos]);

    const categorias = useMemo(() => [...new Set(productos.map(p => p.categoria))].sort(), [productos]);

    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            const q = searchTerm.toLowerCase();
            return (
                (!q || p.nombre.toLowerCase().includes(q) || (p.codigo_barras || '').toLowerCase().includes(q)) &&
                (!selectedCategory || p.categoria === selectedCategory)
            );
        });
    }, [productos, searchTerm, selectedCategory]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

    const productosPaginados = useMemo(
        () => productosFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [productosFiltrados, currentPage]
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Control de Inventario</h1>
                                <p className="mt-1 text-sm text-gray-500">Monitorea y ajusta el stock de tus productos</p>
                            </div>
                            <Link href="/inventario/ajustar"
                                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                                Ajustar Stock
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Productos totales', value: stats.total,     color: 'blue',   icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
                            { label: 'En stock',          value: stats.enStock,   color: 'green',  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Stock bajo',        value: stats.bajoStock, color: 'yellow', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                            { label: 'Agotados',          value: stats.agotados,  color: 'red',    icon: 'M6 18L18 6M6 6l12 12' },
                        ].map(({ label, value, color, icon }) => (
                            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className={`w-12 h-12 bg-${color}-50 rounded-xl flex items-center justify-center mb-4`}>
                                    <svg className={`w-6 h-6 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                                    </svg>
                                </div>
                                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                                <p className="text-sm text-gray-500 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Search & Filters */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input type="text" placeholder="Buscar productos en inventario..."
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-3 focus:ring-orange-100 transition" />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition">
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        {(searchTerm || selectedCategory) && (
                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{productosFiltrados.length}</span> producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Table */}
                    {productosFiltrados.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {productosPaginados.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                                                        <span className="text-white font-semibold text-lg">{producto.nombre.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                                                        <div className="text-sm text-gray-500">{producto.codigo_barras || 'Sin código'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                        {producto.categoria}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {producto.stock} unidades
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {producto.stock_minimo} unidades
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {producto.stock > producto.stock_minimo ? (
                                                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">En stock</span>
                                                ) : producto.stock > 0 ? (
                                                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Bajo stock</span>
                                                ) : (
                                                    <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">Agotado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 pb-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={productosFiltrados.length}
                                    perPage={PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor="orange"
                                />
                            </div>
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6">
                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos en inventario</h3>
            <p className="text-gray-500 mb-6">Primero agrega productos desde el módulo de Productos</p>
            <Link href="/productos/crear"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                Ir a Productos
            </Link>
        </div>
    );
}
