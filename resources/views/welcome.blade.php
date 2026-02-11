<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VitaliStore - Sistema de Gestión</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        .gradient-bg {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }
    </style>
</head>
<body class="gradient-bg">
<div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="py-6 px-8 border-b border-gray-100">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </div>
                <span class="text-2xl font-light text-gray-900">VitaliStore</span>
            </div>

            @if (Route::has('login'))
                <nav class="flex items-center space-x-4">
                    @auth
                        <a href="{{ url('/dashboard') }}" class="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition duration-200">
                            Dashboard
                        </a>
                    @else
                        <a href="{{ route('login') }}" class="px-6 py-2 text-gray-700 hover:text-gray-900 transition">
                            Iniciar Sesión
                        </a>
                    @endauth
                </nav>
            @endif
        </div>
    </header>

    <!-- Hero Section -->
    <main class="flex-1 flex items-center justify-center px-8 py-20">
        <div class="max-w-4xl text-center">
            <div class="mb-8">
                <div class="inline-block mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl flex items-center justify-center shadow-2xl">
                        <svg class="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <h1 class="text-6xl font-light text-gray-900 mb-6">
                VitaliStore
            </h1>

            <p class="text-xl text-gray-600 mb-12 font-light leading-relaxed">
                Sistema integral de gestión para control de inventario,<br>
                ventas y administración de tu negocio.
            </p>

            <div class="flex items-center justify-center space-x-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200">
                        Ir al Dashboard
                    </a>
                @else
                    <a href="{{ route('login') }}" class="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200">
                        Iniciar Sesión
                    </a>
                @endauth
            </div>

            <!-- Features -->
            <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="p-6">
                    <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Seguro</h3>
                    <p class="text-gray-600 text-sm">Autenticación 2FA para máxima seguridad</p>
                </div>

                <div class="p-6">
                    <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Rápido</h3>
                    <p class="text-gray-600 text-sm">Gestión eficiente de tu negocio</p>
                </div>

                <div class="p-6">
                    <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Completo</h3>
                    <p class="text-gray-600 text-sm">Control total de inventario y ventas</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 px-8 border-t border-gray-100">
        <div class="max-w-7xl mx-auto text-center">
            <p class="text-sm text-gray-500">
                © {{ date('Y') }} VitaliStore. Todos los derechos reservados.
            </p>
        </div>
    </footer>
</div>
</body>
</html>
