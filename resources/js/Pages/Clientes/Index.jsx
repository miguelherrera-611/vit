import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import ClienteDetalleModal from '@/Components/ClienteDetalleModal';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

const PER_PAGE = 15;

const STAT_STYLES = {
    pink:  { accent:'rgba(180,90,20,0.8)',  bg:'rgba(180,90,20,0.07)'  },
    green: { accent:'rgba(16,185,129,0.8)', bg:'rgba(16,185,129,0.07)' },
    blue:  { accent:'rgba(59,130,246,0.8)', bg:'rgba(59,130,246,0.07)'  },
    red:   { accent:'rgba(220,38,38,0.8)',  bg:'rgba(220,38,38,0.07)'  },
};

export default function ClientesIndex({ clientes = [] }) {
    const [searchTerm, setSearchTerm]               = useState('');
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [modalOpen, setModalOpen]                 = useState(false);
    const [currentPage, setCurrentPage]             = useState(1);
    const [confirmDelete, setConfirmDelete]         = useState(null);
    const [delProcessing, setDelProcessing]         = useState(false);
    const [delError, setDelError]                   = useState(null);

    const clientesMap = useMemo(
        () => new Map(clientes.map((c) => [String(c.id), c])),
        [clientes]
    );

    const handleOpenCliente = (cliente) => {
        if (!cliente) return;
        setClienteSeleccionado(cliente);
        setModalOpen(true);
    };

    const handleRowClick = (e) => {
        const id = e.currentTarget.dataset.clienteId;
        const cliente = clientesMap.get(String(id));
        handleOpenCliente(cliente);
    };

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

    const handleDelete = (password) => {
        if (!confirmDelete) return;
        setDelProcessing(true);
        router.delete(`/clientes/${confirmDelete.id}`, {
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
            <div className="min-h-screen" style={{background:`radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255,210,170,0.22) 0%, transparent 55%),radial-gradient(ellipse 60% 55% at 100% 100%, rgba(255,195,145,0.18) 0%, transparent 55%),radial-gradient(ellipse 55% 50% at 75% 10%, rgba(255,215,175,0.16) 0%, transparent 55%),linear-gradient(145deg,#fdf6f0 0%,#fdf3ec 35%,#fef5ef 70%,#fef8f4 100%)`}}>
                <div className="border-b" style={{background:'rgba(255,255,255,.08)',backdropFilter:'blur(40px) saturate(180%)',borderColor:'rgba(255,255,255,.68)'}}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Gestión de Clientes</h1>
                                <p className="mt-1 text-sm text-gray-500">Administra tu base de clientes</p>
                            </div>
                            <Link href="/clientes/crear" className="px-5 py-3 rounded-xl font-medium text-center"
                                  style={{background:'rgba(220,38,38,.1)',border:'1px solid rgba(220,38,38,.4)',color:'rgba(185,28,28,.95)'}}>
                                + Nuevo Cliente
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Total Clientes',   value: stats.total,          color: 'pink',  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                            { label: 'Activos',          value: stats.activos,         color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Nuevos este mes',  value: stats.nuevosEsteMes,   color: 'blue',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                            { label: 'Con Deudas',       value: stats.conDeudas,       color: 'red',   icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                        ].map(({ label, value, color, icon }) => {
                            const st = STAT_STYLES[color] || STAT_STYLES.pink;
                            return (
                                <div key={label} className="rounded-2xl p-5" style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(22px) saturate(150%)',border:'1px solid rgba(255,255,255,.65)'}}>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                                         style={{background:st.bg,border:`1px solid ${st.accent.replace(/[\d.]+\)$/, '0.2)')}`}}>
                                        <svg className="w-5 h-5" style={{color:st.accent}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-900">{value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {clientes.length > 0 && (
                        <div className="rounded-2xl p-4 sm:p-6 mb-5" style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(22px) saturate(150%)',border:'1px solid rgba(255,255,255,.65)'}}>
                            <div className="relative">
                                <input type="text" placeholder="Buscar clientes por nombre, email o teléfono..."
                                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                       className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition"
                                       style={{borderColor:'rgba(200,140,80,.4)',background:'rgba(255,255,255,.06)',color:'#2d1a08'}}
                                />
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

                    {clientesFiltrados.length > 0 ? (
                        <div className="rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(22px) saturate(150%)',border:'1px solid rgba(255,255,255,.65)'}}>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px]">
                                    <thead style={{background:'rgba(255,255,255,.12)'}}>
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                    </thead>
                                    <tbody style={{background:'transparent'}}>
                                    {clientesPaginados.map((cliente) => (
                                        <tr
                                            key={cliente.id}
                                            data-cliente-id={cliente.id}
                                            className="transition cursor-pointer"
                                            style={{borderTop:'1px solid rgba(255,255,255,.28)'}}
                                            onClick={handleRowClick}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
                                                         style={{background:'rgba(220,38,38,.09)',border:'1px solid rgba(220,38,38,.2)'}}>
                                                        <span className="font-semibold" style={{color:'rgba(185,28,28,.82)'}}>{cliente.nombre.charAt(0)}</span>
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
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full`}
                                                          style={cliente.activo
                                                              ? {background:'rgba(16,185,129,.08)',border:'1px solid rgba(16,185,129,.25)',color:'rgba(4,120,87,.9)'}
                                                              : {background:'rgba(220,38,38,.08)',border:'1px solid rgba(220,38,38,.25)',color:'rgba(185,28,28,.9)'}}>
                                                        {cliente.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenCliente(cliente);
                                                        }}
                                                        className="transition font-medium"
                                                        style={{color:'rgba(185,28,28,.9)'}}
                                                    >
                                                        Ver Detalle
                                                    </button>
                                                    <Link
                                                        href={`/clientes/${cliente.id}/edit`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="transition font-medium"
                                                        style={{color:'rgba(120,60,10,.75)'}}
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setConfirmDelete(cliente);
                                                            setDelError(null);
                                                        }}
                                                        className="text-red-600 hover:text-red-900 transition font-medium"
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
                            <div className="px-4 sm:px-6 pb-5 sm:pb-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={clientesFiltrados.length}
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

            {/* Render condicional estricto del modal */}
            {modalOpen && !!clienteSeleccionado && (
                <ClienteDetalleModal
                    cliente={clienteSeleccionado}
                    open={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setClienteSeleccionado(null);
                    }}
                />
            )}

            {/* Modal confirmación eliminar */}
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
                description="El cliente se moverá a la papelera y podrá ser restaurado posteriormente. Esta acción requiere tu contraseña para continuar."
                confirmLabel="Eliminar Cliente"
            />
        </AppLayout>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl p-10 sm:p-16 text-center" style={{background:'rgba(255,255,255,.04)',backdropFilter:'blur(22px) saturate(150%)',border:'1px solid rgba(255,255,255,.65)'}}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{background:'rgba(221,213,203,.42)'}}>
                <svg className="w-10 h-10" style={{color:'rgba(98,84,70,.88)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay clientes registrados</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer cliente a la base de datos</p>
            <Link href="/clientes/crear" className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition duration-200"
                  style={{background:'rgba(220,38,38,.1)',border:'1px solid rgba(220,38,38,.4)',color:'rgba(185,28,28,.95)'}}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Cliente
            </Link>
        </div>
    );
}
