import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import VentaDetalleModal from '@/Components/VentaDetalleModal';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;

export default function VentasIndex({ ventas = [] }) {
    const [searchTerm, setSearchTerm]               = useState('');
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [modalOpen, setModalOpen]                 = useState(false);
    const [currentPage, setCurrentPage]             = useState(1);

    const normalizeText = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const stats = useMemo(() => {
        const hoy = new Date().toISOString().split('T')[0];
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

    const formatCurrency = (v) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

    const formatDate = (s) =>
        new Date(s).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Gestión de Ventas</h1>
                                <p className="mt-1 text-sm text-gray-500">Registra y consulta todas las ventas</p>
                            </div>
                            <Link href="/ventas/crear"
                                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                                + Nueva Venta
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{stats.ventasHoy}</p>
                            <p className="text-sm text-gray-500 mt-1">Ventas Hoy</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalHoy)}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Hoy</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.promedio)}</p>
                            <p className="text-sm text-gray-500 mt-1">Promedio por venta</p>
                        </div>
                    </div>

                    {/* Search */}
                    {ventas.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="relative">
                                <input type="text" placeholder="Buscar por número de venta, cliente o estado..."
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100 transition" />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <p className="mt-2 text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{ventasFiltradas.length}</span> resultado{ventasFiltradas.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    {ventasFiltradas.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Venta</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método Pago</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {ventasPaginadas.map((venta) => (
                                        <tr key={venta.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.numero_venta}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.cliente?.nombre || 'Cliente General'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(venta.created_at)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(venta.total)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{venta.metodo_pago}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                                        venta.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                                                            venta.estado === 'Pendiente'  ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>{venta.estado}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => { setVentaSeleccionada(venta); setModalOpen(true); }}
                                                        className="text-blue-600 hover:text-blue-900 transition">
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 pb-6">
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
                        <EmptyState />
                    )}
                </div>
            </div>

            <VentaDetalleModal venta={ventaSeleccionada} open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay ventas registradas</h3>
            <p className="text-gray-500 mb-6">Comienza registrando tu primera venta del día</p>
            <Link href="/ventas/crear"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                Nueva Venta
            </Link>
        </div>
    );
}
