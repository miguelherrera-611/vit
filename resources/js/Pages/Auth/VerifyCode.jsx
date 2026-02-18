import { useForm } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function VerifyCode({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        email: email,
    });

    const codeInputRef = useRef(null);

    useEffect(() => {
        if (codeInputRef.current) {
            codeInputRef.current.focus();
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/verify-2fa');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
            <div className="w-full max-w-md" style={{
                animation: 'fadeIn 0.6s ease-in'
            }}>
                {/* Logo y Título */}
                <div className="text-center mb-12">
                    <div className="inline-block mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-light text-gray-900 mb-2">Verificación 2FA</h1>
                    <p className="text-gray-500 font-light">Ingresa el código de verificación</p>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-3xl shadow-2xl p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Te hemos enviado un código de 6 dígitos a:</p>
                        <p className="text-sm font-medium text-gray-900 mb-4">{email}</p>
                        <p className="text-xs text-gray-500">Revisa tu bandeja de entrada y spam</p>
                    </div>

                    {/* Error Message */}
                    {errors.code && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {errors.code}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                                Código de Verificación
                            </label>
                            <input
                                ref={codeInputRef}
                                id="code"
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength="6"
                                required
                                autoComplete="off"
                                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-red-600 focus:ring-3 focus:ring-red-100 transition duration-200 bg-gray-50 text-center text-2xl tracking-widest font-mono"
                                placeholder="000000"
                                style={{ letterSpacing: '1rem' }}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || data.code.length !== 6}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing ? 'Verificando...' : 'Verificar Código'}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <a href="/Login" className="text-sm text-gray-600 hover:text-gray-900 transition">
                                ← Volver al inicio de sesión
                            </a>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                            El código expira en 10 minutos
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
