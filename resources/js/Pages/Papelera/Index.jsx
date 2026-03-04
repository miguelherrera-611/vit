import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import PasswordConfirmModal from '@/Components/PasswordConfirmModal';

// ── Config de tipos ──────────────────────────────────────────────────────────
const TIPOS = {
    producto:  { label: 'Productos',   color: 'blue',   emoji: '📦' },
    cliente:   { label: 'Clientes',    color: 'rose',   emoji: '👤' },
    proveedor: { label: 'Proveedores', color: 'indigo', emoji: '🏭' },
    venta:     { label: 'Ventas',      color: 'green',  emoji: '🧾' },
    categoria: { label: 'Categorías',  color: 'violet', emoji: '🏷️' },
};

const URGENCIA = (dias) => {
    if (dias <= 3)  return { bg: 'bg-red-100',    text: 'text-red-700',    label: `${dias}d — urgente` };
    if (dias <= 10) return { bg: 'bg-orange-100', text: 'text-orange-700', label: `${dias} días` };
    return              { bg: 'bg-gray-100',    text: 'text-gray-600',   label: `${dias} días` };
};

// ── Componente principal ─────────────────────────────────────────────────────
export default function PapeleraIndex({ items, conteos, filtro }) {
    const [modal, setModal]         = useState(null); // { tipo: 'restore'|'delete'|'vaciar', item? }
    const [processing, setProcessing] = useState(false);
    const [pwdError, setPwdError]   = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 15;

    const openModal = (tipo, item = null) => {
        setModal({ tipo, item });
        setPwdError(null);
    };

    const handleConfirm = (password) => {
        if (!modal) return;
        setProcessing(true);

        const onSuccess = () => { setModal(null); setProcessing(false); setPwdError(null); };
        const onError   = (errs) => { setPwdError(errs.password || 'Error.'); setProcessing(false); };

        if (modal.tipo === 'restore') {
            router.post(`/papelera/${modal.item.id}/restore`, { password }, { onSuccess, onError });
        } else if (modal.tipo === 'delete') {
            router.delete(`/papelera/${modal.item.id}`, { data: { password }, onSuccess, onError });
        } else if (modal.tipo === 'vaciar') {
            router.post('/papelera/vaciar', { password }, { onSuccess, onError });
        }
    };

    const setFiltro = (tipo) => {
        router.get('/papelera', tipo ? { tipo } : {}, { preserveState: true, replace: true });
    };

    const datos = items.data || [];

    // Reset page when filter changes
    useEffect(() => { setCurrentPage(1); }, [filtro]);

    const datosPaginados = useMemo(
        () => datos.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [datos, currentPage]
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

                {/* ── Header ── */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Link href="/productos"
                                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-light text-gray-900 flex items-center space-x-3">
                                        <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Papelera</span>
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Los elementos se eliminan automáticamente después de 30 días
                                    </p>
                                </div>
                            </div>

                            {conteos.total > 0 && (
                                <button
                                    onClick={() => openModal('vaciar')}
                                    className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Vaciar papelera</span>
                                </button>
                            )}
                        </div>

                        {/* Filtros por tipo */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => setFiltro('')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                    !filtro
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Todos ({conteos.total})
                            </button>
                            {Object.entries(TIPOS).map(([key, cfg]) => (
                                conteos[key] > 0 && (
                                    <button
                                        key={key}
                                        onClick={() => setFiltro(key)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-1.5 ${
                                            filtro === key
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <span>{cfg.emoji}</span>
                                        <span>{cfg.label} ({conteos[key]})</span>
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {datos.length === 0 ? (
                        // Papelera vacía
                        <div className="bg-white rounded-2xl shadow-sm p-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">La papelera está vacía</h2>
                            <p className="text-gray-400 text-sm">
                                Los elementos eliminados aparecerán aquí durante 30 días antes de borrarse definitivamente.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {datosPaginados.map((item) => {
                                    const cfg      = TIPOS[item.tipo] || { label: item.tipo, emoji: '📄' };
                                    const urgencia = URGENCIA(item.dias_restantes);

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between gap-4"
                                        >
                                            {/* Tipo + nombre */}
                                            <div className="flex items-center space-x-4 min-w-0">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                                    {cfg.emoji}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{item.nombre_display}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {cfg.label} · Eliminado el {item.eliminado_at}
                                                        {item.eliminado_por && ` por ${item.eliminado_por}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Días restantes + acciones */}
                                            <div className="flex items-center space-x-3 flex-shrink-0">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${urgencia.bg} ${urgencia.text}`}>
                                                {urgencia.label}
                                            </span>

                                                {/* Restaurar */}
                                                <button
                                                    onClick={() => openModal('restore', item)}
                                                    className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition"
                                                    title="Restaurar"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    <span>Restaurar</span>
                                                </button>

                                                {/* Eliminar permanente */}
                                                <button
                                                    onClick={() => openModal('delete', item)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                                    title="Eliminar permanentemente"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={datos.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="violet"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* ── Modal contraseña ── */}
            <PasswordConfirmModal
                open={!!modal}
                onClose={() => setModal(null)}
                onConfirm={handleConfirm}
                processing={processing}
                error={pwdError}
                danger={modal?.tipo !== 'restore'}
                title={
                    modal?.tipo === 'restore' ? `¿Restaurar "${modal?.item?.nombre_display}"?` :
                        modal?.tipo === 'vaciar'  ? '¿Vaciar toda la papelera?' :
                            `¿Eliminar permanentemente "${modal?.item?.nombre_display}"?`
                }
                description={
                    modal?.tipo === 'restore' ? 'El elemento volverá a estar disponible en el sistema.' :
                        modal?.tipo === 'vaciar'  ? 'Se eliminarán TODOS los elementos definitivamente. Esta acción no se puede deshacer.' :
                            'Este elemento se eliminará definitivamente. No podrás recuperarlo.'
                }
                confirmLabel={
                    modal?.tipo === 'restore' ? 'Restaurar' :
                        modal?.tipo === 'vaciar'  ? 'Vaciar todo' :
                            'Eliminar definitivamente'
                }
            />
        </AppLayout>
    );
}
