<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// ====================================
// RUTAS PÚBLICAS (Sin autenticación)
// ====================================

Route::get('/', function () {
    // Si ya está autenticado, redirigir al dashboard correspondiente
    if (Auth::check()) {
        $user = Auth::user();

        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.superadmin');
        } elseif ($user->hasRole('admin')) {
            return redirect()->route('dashboard.admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->route('dashboard.empleado');
        }

        return redirect()->route('dashboard');
    }

    return view('welcome');
});

// ====================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ====================================

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard genérico - redirige según rol
    Route::get('/dashboard', function () {
        $user = Auth::user();

        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.superadmin');
        } elseif ($user->hasRole('admin')) {
            return redirect()->route('dashboard.admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->route('dashboard.empleado');
        }

        // Si no tiene rol, mostrar dashboard genérico
        return view('dashboard');
    })->name('dashboard');

    // ====================================
    // DASHBOARDS POR ROL
    // ====================================

    // Dashboard Super Admin
    Route::get('/dashboard/superadmin', [DashboardController::class, 'superadmin'])
        ->name('dashboard.superadmin')
        ->middleware('role:super_admin');

    // Dashboard Admin
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])
        ->name('dashboard.admin')
        ->middleware('role:admin');

    // Dashboard Empleado
    Route::get('/dashboard/empleado', [DashboardController::class, 'empleado'])
        ->name('dashboard.empleado')
        ->middleware('role:empleado');

    // ====================================
    // RUTAS DE PERFIL (Todos los usuarios autenticados)
    // ====================================

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ====================================
    // MÓDULO DE USUARIOS (Solo Super Admin)
    // ====================================

    Route::middleware('role:super_admin')->prefix('usuarios')->name('usuarios.')->group(function () {
        // Aquí irán las rutas de gestión de usuarios (próximamente)
        // Route::get('/', [UserController::class, 'index'])->name('index');
        // Route::get('/crear', [UserController::class, 'create'])->name('create');
        // etc...
    });

    // ====================================
    // MÓDULO DE PRODUCTOS (Admin y Super Admin)
    // ====================================

    Route::middleware('role:admin|super_admin')->prefix('productos')->name('productos.')->group(function () {
        // Aquí irán las rutas de gestión de productos (próximamente)
        // Route::get('/', [ProductController::class, 'index'])->name('index');
        // Route::get('/crear', [ProductController::class, 'create'])->name('create');
        // etc...
    });

    // ====================================
    // MÓDULO DE VENTAS (Todos los usuarios autenticados)
    // ====================================

    Route::prefix('ventas')->name('ventas.')->group(function () {
        // Aquí irán las rutas de ventas (próximamente)
        // Route::get('/', [SaleController::class, 'index'])->name('index');
        // Route::get('/crear', [SaleController::class, 'create'])->name('create');
        // etc...
    });

    // ====================================
    // MÓDULO DE CLIENTES (Admin y Super Admin)
    // ====================================

    Route::middleware('role:admin|super_admin')->prefix('clientes')->name('clientes.')->group(function () {
        // Aquí irán las rutas de gestión de clientes (próximamente)
        // Route::get('/', [ClientController::class, 'index'])->name('index');
        // Route::get('/crear', [ClientController::class, 'create'])->name('create');
        // etc...
    });

    // ====================================
    // MÓDULO DE INVENTARIO (Admin y Super Admin)
    // ====================================

    Route::middleware('role:admin|super_admin')->prefix('inventario')->name('inventario.')->group(function () {
        // Aquí irán las rutas de gestión de inventario (próximamente)
        // Route::get('/', [InventoryController::class, 'index'])->name('index');
        // etc...
    });

    // ====================================
    // MÓDULO DE REPORTES (Admin y Super Admin)
    // ====================================

    Route::middleware('role:admin|super_admin')->prefix('reportes')->name('reportes.')->group(function () {
        // Aquí irán las rutas de reportes (próximamente)
        // Route::get('/ventas', [ReportController::class, 'sales'])->name('ventas');
        // Route::get('/inventario', [ReportController::class, 'inventory'])->name('inventario');
        // etc...
    });
});

// ====================================
// INCLUIR RUTAS DE AUTENTICACIÓN
// ====================================

require __DIR__.'/auth.php';
