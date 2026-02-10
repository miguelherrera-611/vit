<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Administrador') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h3 class="text-2xl font-bold mb-4">¡Bienvenido, Administrador!</h3>
                    <p class="mb-4">Usuario: {{ Auth::user()->name }}</p>
                    <p class="mb-4">Rol: <span class="bg-blue-600 text-white px-3 py-1 rounded">Admin</span></p>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-blue-100 p-6 rounded-lg">
                            <h4 class="font-bold text-lg mb-2">Gestión de Productos</h4>
                            <p class="text-sm text-gray-600">Administrar inventario y productos</p>
                        </div>
                        <div class="bg-blue-100 p-6 rounded-lg">
                            <h4 class="font-bold text-lg mb-2">Ventas</h4>
                            <p class="text-sm text-gray-600">Registrar y anular ventas</p>
                        </div>
                        <div class="bg-blue-100 p-6 rounded-lg">
                            <h4 class="font-bold text-lg mb-2">Reportes</h4>
                            <p class="text-sm text-gray-600">Ver reportes de ventas e inventario</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
