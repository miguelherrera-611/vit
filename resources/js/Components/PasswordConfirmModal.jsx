import { useState } from 'react';

/**
 * Modal de confirmación con contraseña.
 *
 * Props:
 *  - open         boolean
 *  - onClose      () => void
 *  - onConfirm    (password: string) => void
 *  - title        string
 *  - description  string | ReactNode
 *  - danger       boolean   (rojo si true, azul si false)
 *  - confirmLabel string    (texto del botón confirmar)
 *  - processing   boolean
 *  - error        string | null   (mensaje de error del servidor)
 */
export default function PasswordConfirmModal({
                                                 open,
                                                 onClose,
                                                 onConfirm,
                                                 title        = '¿Confirmar acción?',
                                                 description  = 'Esta acción requiere tu contraseña.',
                                                 danger       = true,
                                                 confirmLabel = 'Confirmar',
                                                 processing   = false,
                                                 error        = null,
                                             }) {
    const [password, setPassword] = useState('');
    const [show, setShow]         = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        onConfirm(password);
    };

    const handleClose = () => {
        setPassword('');
        setShow(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in fade-in zoom-in-95 duration-200">

                {/* Icono */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${
                    danger ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                    {danger ? (
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ) : (
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )}
                </div>

                {/* Textos */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
                <div className="text-sm text-gray-500 text-center mb-6">{description}</div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={show ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                autoFocus
                                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition text-sm ${
                                    error
                                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                        : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                tabIndex={-1}
                            >
                                {show ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-1.5 text-xs text-red-600 flex items-center space-x-1">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-3 pt-1">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !password.trim()}
                            className={`flex-1 py-3 rounded-xl text-white font-medium transition text-sm disabled:opacity-50 ${
                                danger
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    <span>Verificando...</span>
                                </span>
                            ) : confirmLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
