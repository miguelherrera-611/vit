import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

export default function ProveedoresIndex({ proveedores = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [delProcessing, setDelProcessing] = useState(false);
    const [delError, setDelError] = useState(null);

    const PER_PAGE = 15;

    // Normaliza texto quitando tildes
    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    // Resetear página cuando cambia búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Stats
    const stats = useMemo(() => {
        const activos = proveedores.filter(p => p.activo);
        return {
            total: proveedores.length,
            activos: activos.length
        };
    }, [proveedores]);

    // Filtro
    const proveedoresFiltrados = useMemo(() => {
        const q = normalizeText(searchTerm);
        return proveedores.filter(p =>
            normalizeText(p.nombre).includes(q) ||
            normalizeText(p.empresa).includes(q) ||
            normalizeText(p.email).includes(q) ||
            normalizeText(p.telefono).includes(q)
        );
    }, [proveedores, searchTerm]);

    // Paginación
    const proveedoresPaginados = useMemo(() => {
        const start = (currentPage - 1) * PER_PAGE;
        const end = start + PER_PAGE;
        return proveedoresFiltrados.slice(start, end);
    }, [proveedoresFiltrados, currentPage]);

    // Eliminar
    const handleDelete = (password) => {
        if (!confirmDelete) return;

        setDelProcessing(true);

        router.delete(`/proveedores/${confirmDelete.id}`, {
            data: { password },
            onSuccess: () => {
                setConfirmDelete(null);
                setDelProcessing(false);
                setDelError(null);
            },
            onError: (errs) => {
                setDelError(errs.password || 'Error al eliminar.');
                setDelProcessing(false);
            },
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* HEADER */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900">
                                Gestión de Proveedores
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Administra tus proveedores y contactos
                            </p>
                        </div>

                        <Link
                            href="/proveedores/crear"
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
                        >
                            + Nuevo Proveedor
                        </Link>
                    </div>
                </div>

                {/* CONTENIDO */}
                <div className="max-w-7xl mx-auto px-6 py-12">

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard color="indigo" value={stats.total}   label="Total Proveedores" />
                        <StatCard color="green"  value={stats.activos} label="Activos" />
                        <StatCard color="blue"   value="0"             label="Productos surtidos" />
                        <StatCard color="purple" value="$0"            label="Compras este mes" />
                    </div>

                    {/* BUSCADOR */}
                    {proveedores.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar proveedores por nombre, empresa, email o teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchTerm && (
                                <p className="mt-2 text-sm text-gray-500">
                                    <span className="font-medium text-gray-700">{proveedoresFiltrados.length}</span> resultado{proveedoresFiltrados.length !== 1 ? 's' : ''} para "<em>{searchTerm}</em>"
                                </p>
                            )}
                        </div>
                    )}

                    {/* TABLA */}
                    {proveedoresFiltrados.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Proveedor
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Empresa
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contacto
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
                                    {proveedoresPaginados.map((proveedor) => (
                                        <tr key={proveedor.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-white font-semibold text-sm">
                                                            {proveedor.nombre.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{proveedor.nombre}</div>
                                                        <div className="text-sm text-gray-500">{proveedor.documento || 'Sin documento'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{proveedor.empresa || '—'}</div>
                                                {proveedor.sitio_web && (
                                                    <a
                                                        href={proveedor.sitio_web}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-indigo-600 hover:underline"
                                                    >
                                                        {proveedor.sitio_web}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{proveedor.email || 'Sin email'}</div>
                                                <div className="text-sm text-gray-500">{proveedor.telefono || 'Sin teléfono'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${proveedor.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={`/proveedores/${proveedor.id}/edit`}
                                                        className="text-indigo-600 hover:text-indigo-900 transition font-medium text-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => { setConfirmDelete(proveedor); setDelError(null); }}
                                                        className="text-red-600 hover:text-red-900 transition font-medium text-sm"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PAGINACIÓN */}
                            <div className="px-6 py-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={proveedoresFiltrados.length}
                                    perPage={PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor="indigo"
                                />
                            </div>

                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* MODAL ELIMINAR */}
            <PasswordConfirmModal
                open={!!confirmDelete}
                onClose={() => {
                    setConfirmDelete(null);
                    setDelError(null);
                }}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar a "${confirmDelete?.nombre}"?`}
                description="El proveedor se moverá a la papelera y podrá ser restaurado posteriormente. Esta acción requiere tu contraseña para continuar."
                confirmLabel="Eliminar Proveedor"
            />
        </AppLayout>
    );
}

/* COMPONENTES AUXILIARES */

function StatCard({ color, value, label }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay proveedores registrados
            </h3>
            <p className="text-gray-500 mb-6">
                Comienza agregando tus proveedores al sistema
            </p>
            <Link
                href="/proveedores/crear"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Proveedor
            </Link>
        </div>
    );
}
