import { Link } from '@inertiajs/react';

export default function Welcome({ canLogin }) {
    return (
        <div className="min-h-screen flex flex-col" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
            {/* Header */}
            <header className="py-6 px-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-light text-gray-900">VitaliStore</span>
                    </div>

                    {canLogin && (
                        <nav className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition duration-200"
                            >
                                Iniciar Sesión
                            </Link>
                        </nav>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-8 py-20">
                <div className="max-w-4xl text-center">
                    <div className="mb-8">
                        <div className="inline-block mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center shadow-2xl">
                                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-6xl font-light text-gray-900 mb-6">
                        VitaliStore
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
                        Sistema integral de gestión para control de inventario,<br />
                        ventas y administración de tu negocio.
                    </p>

                    {/* ELIMINAMOS EL BOTÓN DEL MEDIO */}

                    {/* Features */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            }
                            title="Seguro"
                            description="Autenticación 2FA para máxima seguridad"
                            color="red"
                        />
                        <FeatureCard
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            }
                            title="Rápido"
                            description="Gestión eficiente de tu negocio"
                            color="blue"
                        />
                        <FeatureCard
                            icon={
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            }
                            title="Completo"
                            description="Control total de inventario y ventas"
                            color="green"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} VitaliStore. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, color }) {
    const colors = {
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
    };

    return (
        <div className="p-6">
            <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}
