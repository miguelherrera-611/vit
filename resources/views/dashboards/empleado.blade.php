<x-app-layout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <!-- Header -->
        <div class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-6 py-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-light text-gray-900">Mi Panel</h1>
                        <p class="mt-1 text-sm text-gray-500">Bienvenido, {{ Auth::user()->name }}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-full shadow-sm">
                            Empleado
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-6 py-12">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- Stat Card 1 -->
                <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                    <p class="text-2xl font-semibold text-gray-900">0</p>
                    <p class="text-sm text-gray-500 mt-1">Ventas Realizadas Hoy</p>
                </div>

                <!-- Stat Card 2 -->
                <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                    </div>
                    <p class="text-2xl font-semibold text-gray-900">0</p>
                    <p class="text-sm text-gray-500 mt-1">Productos Disponibles</p>
                </div>

                <!-- Stat Card 3 -->
                <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                    </div>
                    <p class="text-2xl font-semibold text-gray-900">$0</p>
                    <p class="text-sm text-gray-500 mt-1">Total Vendido Hoy</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mb-8">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Nueva Venta -->
                    <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer group">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-200">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                            </div>
                        </div>
                        <h3 class="text-2xl font-semibold text-white mb-2">Nueva Venta</h3>
                        <p class="text-green-100 text-sm">Registrar una nueva venta</p>
                    </div>

                    <!-- Consultar Inventario -->
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-200 cursor-pointer group">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-200">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                        </div>
                        <h3 class="text-2xl font-semibold text-white mb-2">Consultar Productos</h3>
                        <p class="text-blue-100 text-sm">Ver inventario disponible</p>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-2xl p-8 shadow-sm">
                <h2 class="text-xl font-semibold text-gray-900 mb-6">Actividad Reciente</h2>

                <!-- Empty State -->
                <div class="text-center py-12">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
                    <p class="text-gray-500 text-sm">Tus ventas recientes aparecerán aquí</p>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
