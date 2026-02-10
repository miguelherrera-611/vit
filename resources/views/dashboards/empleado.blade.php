<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Empleado') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h3 class="text-2xl font-bold mb-4">¡Bienvenido, Empleado!</h3>
                    <p class="mb-4">Usuario: {{ Auth::user()->name }}</p>
                    <p class="mb-4">Rol: <span class="bg-green-600 text-white px-3 py-1 rounded">Empleado</span></p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div class="bg-green-100 p-6 rounded-lg">
                            <h4 class="font-bold text-lg mb-2">Registrar Ventas</h4>
                            <p class="text-sm text-gray-600">Crear nuevas ventas y facturación</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-lg">
                            <h4 class="font-bold text-lg mb-2">Consultar Productos</h4>
                            <p class="text-sm text-gray-600">Ver inventario disponible</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
