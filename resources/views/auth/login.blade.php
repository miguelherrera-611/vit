<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - VitaliStore</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
            font-family: 'Inter', sans-serif;
        }

        .gradient-bg {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        }

        .red-gradient {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
        }

        .input-focus:focus {
            border-color: #dc2626;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .animate-fade-in {
            animation: fadeIn 0.6s ease-in;
        }

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
    </style>
</head>
<body class="gradient-bg min-h-screen flex items-center justify-center px-4 py-12">
<div class="w-full max-w-md animate-fade-in">
    <!-- Logo y Título -->
    <div class="text-center mb-12">
        <div class="inline-block mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </div>
        </div>
        <h1 class="text-4xl font-light text-gray-900 mb-2">VitaliStore</h1>
        <p class="text-gray-500 font-light">Sistema de Gestión</p>
    </div>

    <!-- Formulario de Login -->
    <div class="bg-white rounded-3xl shadow-2xl p-10">
        <h2 class="text-2xl font-light text-gray-900 mb-8 text-center">Iniciar Sesión</h2>

        <!-- Session Status -->
        @if (session('status'))
            <div class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
                {{ session('status') }}
            </div>
        @endif

        <!-- Error Message -->
        @if (session('error'))
            <div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {{ session('error') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" class="space-y-6">
            @csrf

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    required
                    autofocus
                    autocomplete="username"
                    class="input-focus w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none transition duration-200 bg-gray-50"
                    placeholder="tu@email.com"
                >
                @error('email')
                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    class="input-focus w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none transition duration-200 bg-gray-50"
                    placeholder="••••••••"
                >
                @error('password')
                <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Remember Me -->
            <div class="flex items-center justify-between">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        name="remember"
                        class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    >
                    <span class="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>

                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="text-sm text-red-600 hover:text-red-700 transition">
                        ¿Olvidaste tu contraseña?
                    </a>
                @endif
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                class="w-full red-gradient text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
            >
                Iniciar Sesión
            </button>
        </form>
    </div>

    <!-- Footer -->
    <div class="text-center mt-8">
        <p class="text-sm text-gray-500">
            © {{ date('Y') }} VitaliStore. Todos los derechos reservados.
        </p>
    </div>
</div>
</body>
</html>
