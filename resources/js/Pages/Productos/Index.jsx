import AppLayout from '@/Layouts/AppLayout';
import { Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function ProductosIndex({ productos = [] }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [filtroStock, setFiltroStock] = useState('');

    // Función para normalizar texto (remover tildes y convertir a minúsculas)
    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    // Obtener categorías únicas de los productos reales
    const categorias = useMemo(() => {
        const cats = [...new Set(productos.map(p => p.categoria))].sort();
        return cats;
    }, [productos]);

    // Calcular estadísticas
    const stats = useMemo(() => {
        const activos = productos.filter(p => p.activo);
        const bajoStock = productos.filter(p => p.stock <= p.stock_minimo);
        const agotados = productos.filter(p => p.stock === 0);

        return {
            total: productos.length,
            activos: activos.length,
            bajoStock: bajoStock.length,
            agotados: agotados.length
        };
    }, [productos]);

    // Filtrar productos
    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const searchNormalized = normalizeText(searchTerm);
            const matchSearch = searchTerm === '' ||
                normalizeText(producto.nombre).includes(searchNormalized) ||
                normalizeText(producto.codigo_barras).includes(searchNormalized) ||
                normalizeText(producto.categoria).includes(searchNormalized);

            const matchCategoria = categoriaSeleccionada === '' || producto.categoria === categoriaSeleccionada;

            const matchStock = filtroStock === '' ||
                (filtroStock === 'disponible' && producto.stock > 0) ||
                (filtroStock === 'agotado' && producto.stock === 0) ||
                (filtroStock === 'bajo' && producto.stock > 0 && producto.stock <= producto.stock_minimo);

            return matchSearch && matchCategoria && matchStock;
        });
    }, [productos, searchTerm, categoriaSeleccionada, filtroStock]);

    // Formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Gestión de Productos</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Administra tu catálogo e inventario
                                </p>
                            </div>
                            <Link
                                href="/productos/crear"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                            >
                                + Nuevo Producto
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Productos</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.activos}</p>
                            <p className="text-sm text-gray-500 mt-1">Productos Activos</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.bajoStock}</p>
                            <p className="text-sm text-gray-500 mt-1">Stock Bajo</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.agotados}</p>
                            <p className="text-sm text-gray-500 mt-1">Agotados</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar productos por nombre, código o categoría..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition"
                                    />
                                    <svg
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <select
                                value={categoriaSeleccionada}
                                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                className="px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition min-w-[200px]"
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                value={filtroStock}
                                onChange={(e) => setFiltroStock(e.target.value)}
                                className="px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition min-w-[180px]"
                            >
                                <option value="">Stock disponible</option>
                                <option value="disponible">Con stock</option>
                                <option value="bajo">Bajo stock</option>
                                <option value="agotado">Agotados</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Table */}
                    {productosFiltrados.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoría
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {productosFiltrados.map((producto) => (
                                        <tr key={producto.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                                            <span className="text-white font-semibold text-lg">
                                                                {producto.nombre.charAt(0)}
                                                            </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {producto.nombre}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {producto.codigo_barras || 'Sin código'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {producto.categoria}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatCurrency(producto.precio)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {producto.stock} unidades
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {producto.stock > producto.stock_minimo ? (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            En stock
                                                        </span>
                                                ) : producto.stock > 0 ? (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Bajo stock
                                                        </span>
                                                ) : (
                                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Agotado
                                                        </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-3">
                                                    <Link
                                                        href={`/productos/${producto.id}/editar`}
                                                        className="text-blue-600 hover:text-blue-900 transition"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button className="text-red-600 hover:text-red-900 transition">
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <EmptyState searchTerm={searchTerm} categoriaSeleccionada={categoriaSeleccionada} filtroStock={filtroStock} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function EmptyState({ searchTerm, categoriaSeleccionada, filtroStock }) {
    const mensaje = searchTerm || categoriaSeleccionada || filtroStock
        ? "No se encontraron productos con los filtros aplicados"
        : "No hay productos registrados";

    const descripcion = searchTerm || categoriaSeleccionada || filtroStock
        ? "Intenta ajustar los filtros de búsqueda"
        : "Comienza agregando tu primer producto al inventario";

    return (
        <div className="bg-white rounded-2xl shadow-sm p-16">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {mensaje}
                </h3>
                <p className="text-gray-500 mb-6">
                    {descripcion}
                </p>
                {!(searchTerm || categoriaSeleccionada || filtroStock) && (
                    <Link
                        href="/productos/crear"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar Producto
                    </Link>
                )}
            </div>
        </div>
    );
}
