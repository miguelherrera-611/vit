import AppLayout from '@/Layouts/AppLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UsuariosIndex({ usuarios }) {
    const { flash } = usePage().props;
    const [eliminando, setEliminando] = useState(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const toggleActivo = (id) => {
        router.patch(`/usuarios/${id}/toggle`);
    };

    const confirmarEliminar = (usuario) => {
        setEliminando(usuario);
        setPassword('');
        setError('');
    };

    const ejecutarEliminar = () => {
        router.delete(`/usuarios/${eliminando.id}`, {
            data: { password },
            onError: (errors) => setError(errors.password || 'Error al eliminar.'),
            onSuccess: () => setEliminando(null),
        });
    };

    const rolBadge = (rol) => {
        if (rol === 'admin') return 'bg-red-100 text-red-700';
        if (rol === 'empleado') return 'bg-blue-100 text-blue-700';
        return 'bg-gray-100 text-gray-600';
    };

    const rolLabel = (rol) => {
        if (rol === 'admin') return 'Administrador';
        if (rol === 'empleado') return 'Empleado';
        return 'Sin rol';
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-light text-gray-900">Gestión de Usuarios</h1>
                            <p className="mt-1 text-sm text-gray-500">{usuarios.length} usuario(s) registrado(s)</p>
                        </div>
                        <Link
                            href="/usuarios/create"
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Nuevo Usuario
                        </Link>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-10">
                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg text-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Tabla */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Permisos</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Creado</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${rolBadge(u.rol)}`}>
                                                {rolLabel(u.rol)}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.permisos.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {u.permisos.slice(0, 3).map(p => (
                                                    <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                            {p.replace(/_/g, ' ')}
                                                        </span>
                                                ))}
                                                {u.permisos.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                                                            +{u.permisos.length - 3}
                                                        </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                    {u.rol === 'admin' ? 'Acceso total' : 'Sin permisos extra'}
                                                </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleActivo(u.id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${u.activo !== false ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${u.activo !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{u.created_at}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/usuarios/${u.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Editar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => confirmarEliminar(u)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Eliminar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {usuarios.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-gray-400 text-sm">No hay usuarios registrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Eliminar */}
            {eliminando && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Eliminar Usuario</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Vas a eliminar a <strong>{eliminando.name}</strong> permanentemente. Confirma con tu contraseña.
                        </p>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 mb-2"
                        />
                        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => setEliminando(null)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
                                Cancelar
                            </button>
                            <button onClick={ejecutarEliminar} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
