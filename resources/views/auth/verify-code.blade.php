<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación 2FA - VitaliStore</title>
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

        .code-input {
            font-size: 2rem;
            letter-spacing: 1rem;
            text-align: center;
        }

        .code-input:focus {
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
    <!-- Logo -->
    <div class="text-center mb-12">
        <div class="inline-block mb-6">
            <div class="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-xl">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
            </div>
        </div>
        <h1 class="text-4xl font-light text-gray-900 mb-2">Verificación de Seguridad</h1>
        <p class="text-gray-500 font-light">Ingresa el código enviado a tu correo</p>
    </div>

    <!-- Formulario -->
    <div class="bg-white rounded-3xl shadow-2xl p-10">
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            </div>
            <p class="text-sm text-gray-600">
                Revisa tu bandeja de entrada y spam
            </p>
        </div>

        <form method="POST" action="{{ route('verification.2fa.verify') }}">
            @csrf

            <div class="mb-8">
                <label for="code" class="block text-sm font-medium text-gray-700 mb-3 text-center">
                    Código de 6 dígitos
                </label>
                <input
                    id="code"
                    type="text"
                    name="code"
                    required
                    autofocus
                    maxlength="6"
                    pattern="[0-9]{6}"
                    placeholder="000000"
                    class="code-input w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none transition duration-200 bg-gray-50"
                >
                @error('code')
                <p class="mt-3 text-sm text-red-600 text-center">{{ $message }}</p>
                @enderror
            </div>

            <button
                type="submit"
                class="w-full red-gradient text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 mb-4"
            >
                Verificar Código
            </button>

            <a
                href="{{ route('login') }}"
                class="block w-full text-center py-3 px-6 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
            >
                Volver al inicio
            </a>
        </form>
    </div>

    <!-- Info -->
    <div class="mt-6 text-center">
        <p class="text-xs text-gray-500">
            El código expira en 10 minutos
        </p>
    </div>
</div>
</body>
</html>
