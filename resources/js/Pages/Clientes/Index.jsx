import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import ClienteDetalleModal from '@/Components/ClienteDetalleModal';
import Pagination from '@/Components/Pagination';

const PER_PAGE = 15;

export default function ClientesIndex({ clientes = [] }) {
    const [searchTerm, setSearchTerm]               = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [modalOpen, setModalOpen]                 = useState(false);
    const [currentPage, setCurrentPage]             = useState(1);

    const normalizeText = (text) =>
        (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const stats = useMemo(() => {
        const activos = clientes.filter(c => c.activo);
        const conDeudas = clientes.filter(c => (c.saldo_total || 0) > 0);
        const hoy = new Date();
        const esteMes = clientes.filter(c => {
            const f = new Date(c.created_at);
            return f.getMonth() === hoy.getMonth() && f.getFullYear() === hoy.getFullYear();
        });
        return { total: clientes.length, activos: activos.length, nuevosEsteMes: esteMes.length, conDeudas: conDeudas.length };
    }, [clientes]);

    const clientesFiltrados = useMemo(() => {
        const q = normalizeText(searchTerm);
        return clientes.filter(c =>
            !q ||
            normalizeText(c.nombre).includes(q) ||
            normalizeText(c.email).includes(q) ||
            normalizeText(c.telefono).includes(q)
        );
    }, [clientes, searchTerm]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const clientesPaginados = useMemo(
        () => clientesFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [clientesFiltrados, currentPage]
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Gestión de Clientes</h1>
                                <p className="mt-1 text-sm text-gray-500">Administra tu base de clientes</p>
                            </div>
                            <Link href="/clientes/crear"
                                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                                + Nuevo Cliente
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Clientes',   value: stats.total,          color: 'pink',  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { label: 'Activos',          value: stats.activos,         color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Nuevos este mes',  value: stats.nuevosEsteMes,   color: 'blue',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { label: 'Con Deudas',       value: stats.conDeudas,       color: 'red',   icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
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

                    {/* Search */}
                    {clientes.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="relative">
                                <input type="text" placeholder="Buscar clientes por nombre, email o teléfono..."
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                       className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-3 focus:ring-pink-100 transition" />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <p className="mt-2 text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{clientesFiltrados.length}</span> resultado{clientesFiltrados.length !== 1 ? 's' : ''} para "<em>{searchTerm}</em>"
                                </p>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    {clientesFiltrados.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {clientesPaginados.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                                                        <span className="text-white font-semibold">{cliente.nombre.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                                                        <div className="text-sm text-gray-500">{cliente.documento || 'Sin documento'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{cliente.email || 'Sin email'}</div>
                                                <div className="text-sm text-gray-500">{cliente.telefono || 'Sin teléfono'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {cliente.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => { setClienteSeleccionado(cliente); setModalOpen(true); }}
                                                        className="text-pink-600 hover:text-pink-900 transition">
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Paginador */}
                            <div className="px-6 pb-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={clientesFiltrados.length}
                                    perPage={PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor="pink"
                                />
                            </div>
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            <ClienteDetalleModal cliente={clienteSeleccionado} open={modalOpen} onClose={() => setModalOpen(false)} />
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-full mb-6">
                <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay clientes registrados</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer cliente a la base de datos</p>
            <Link href="/clientes/crear"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Cliente
            </Link>
        </div>
    );
}
