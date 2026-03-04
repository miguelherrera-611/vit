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

                        <StatCard
                            color="indigo"
                            value={stats.total}
                            label="Total Proveedores"
                        />

                        <StatCard
                            color="green"
                            value={stats.activos}
                            label="Activos"
                        />

                        <StatCard
                            color="blue"
                            value="0"
                            label="Productos surtidos"
                        />

                        <StatCard
                            color="purple"
                            value="$0"
                            label="Compras este mes"
                        />
                    </div>

                    {/* BUSCADOR */}
                    {proveedores.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <input
                                type="text"
                                placeholder="Buscar proveedores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    )}

                    {/* TABLA */}
                    {proveedoresFiltrados.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                            Proveedor
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                            Empresa
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                                            Contacto
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                                            Acciones
                                        </th>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                    {proveedoresPaginados.map((proveedor) => (
                                        <tr key={proveedor.id}>
                                            <td className="px-6 py-4">
                                                {proveedor.nombre}
                                            </td>
                                            <td className="px-6 py-4">
                                                {proveedor.empresa || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {proveedor.email || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/proveedores/${proveedor.id}/edit`}
                                                    className="text-indigo-600 hover:underline mr-4"
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    onClick={() => setConfirmDelete(proveedor)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Eliminar
                                                </button>
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

            {/* MODAL */}
            <PasswordConfirmModal
                open={!!confirmDelete}
                onClose={() => {
                    setConfirmDelete(null);
                    setDelError(null);
                }}
                onConfirm={handleDelete}
                processing={delProcessing}
                error={delError}
                title={`¿Eliminar "${confirmDelete?.nombre}"?`}
                description="El proveedor se moverá a la papelera."
                confirmLabel="Eliminar"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay proveedores registrados
            </h3>
            <p className="text-gray-500 mb-6">
                Comienza agregando tus proveedores
            </p>
            <Link
                href="/proveedores/crear"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
            >
                Agregar Proveedor
            </Link>
        </div>
    );
}
