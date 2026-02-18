<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Ruta de bienvenida
Route::get('/', function () {
    // Si el usuario está autenticado, redirigir a su dashboard
    if (auth()->check()) {
        $user = auth()->user();

        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.superadmin');
        } elseif ($user->hasRole('admin')) {
            return redirect()->route('dashboard.admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->route('dashboard.empleado');
        }

        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// Rutas protegidas con autenticación
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard general (fallback)
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.superadmin');
        } elseif ($user->hasRole('admin')) {
            return redirect()->route('dashboard.admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->route('dashboard.empleado');
        }

        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Dashboards por rol
    Route::get('/dashboard/superadmin', [DashboardController::class, 'superAdmin'])
        ->middleware('role:super_admin')
        ->name('dashboard.superadmin');

    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])
        ->middleware('role:admin')
        ->name('dashboard.admin');

    Route::get('/dashboard/empleado', [DashboardController::class, 'empleado'])
        ->middleware('role:empleado')
        ->name('dashboard.empleado');

    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==========================================
    // MÓDULOS FUNCIONALES
    // ==========================================

    // Gestión de Usuarios (solo super_admin)
    Route::middleware('role:super_admin')->prefix('usuarios')->name('usuarios.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Usuarios/Index', [
                'usuarios' => [],
            ]);
        })->name('index');
    });

    // Gestión de Productos (admin y super_admin)
    Route::middleware('role:admin|super_admin')->prefix('productos')->name('productos.')->group(function () {
        Route::get('/', [ProductoController::class, 'index'])->name('index');
        Route::get('/crear', [ProductoController::class, 'create'])->name('create');
        Route::post('/', [ProductoController::class, 'store'])->name('store');
        Route::get('/{id}', [ProductoController::class, 'show'])->name('show');
        Route::get('/{id}/editar', [ProductoController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ProductoController::class, 'update'])->name('update');
        Route::delete('/{id}', [ProductoController::class, 'destroy'])->name('destroy');
    });

    // ✅ CORREGIDO: Gestión de Ventas (todos los roles autenticados)
    Route::prefix('ventas')->name('ventas.')->group(function () {
        Route::get('/', function () {
            // ✅ Cargar ventas reales con relaciones de cliente y detalles
            $ventas = \App\Models\Venta::with(['cliente', 'detalles.producto'])
                ->orderBy('fecha_venta', 'desc')
                ->get();
            
            return Inertia::render('Ventas/Index', [
                'ventas' => $ventas,
            ]);
        })->name('index');
        
        Route::get('/crear', function () {
            return Inertia::render('Ventas/Create');
        })->name('create');
    });

    // ✅ CORREGIDO: Gestión de Clientes (admin y super_admin)
    Route::middleware('role:admin|super_admin')->prefix('clientes')->name('clientes.')->group(function () {
        Route::get('/', function () {
            // ✅ Cargar clientes reales ordenados por nombre
            $clientes = \App\Models\Cliente::orderBy('nombre')->get();
            
            return Inertia::render('Clientes/Index', [
                'clientes' => $clientes,
            ]);
        })->name('index');
    });

    // ✅ CORREGIDO: Gestión de Inventario (admin y super_admin)
    Route::middleware('role:admin|super_admin')->prefix('inventario')->name('inventario.')->group(function () {
        Route::get('/', function () {
            // ✅ Cargar productos reales ordenados por nombre
            $productos = \App\Models\Producto::orderBy('nombre')->get();
            
            return Inertia::render('Inventario/Index', [
                'productos' => $productos,
            ]);
        })->name('index');
    });

    // ✅ CORREGIDO: Gestión de Proveedores (admin y super_admin)
    Route::middleware('role:admin|super_admin')->prefix('proveedores')->name('proveedores.')->group(function () {
        Route::get('/', function () {
            // ✅ Cargar proveedores reales ordenados por nombre
            $proveedores = \App\Models\Proveedor::orderBy('nombre')->get();
            
            return Inertia::render('Proveedores/Index', [
                'proveedores' => $proveedores,
            ]);
        })->name('index');
    });

    // Reportes (admin y super_admin)
    Route::middleware('role:admin|super_admin')->prefix('reportes')->name('reportes.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Reportes/Index');
        })->name('index');
        
        Route::get('/ventas', function () {
            return Inertia::render('Reportes/Ventas');
        })->name('ventas');
        
        Route::get('/inventario', function () {
            return Inertia::render('Reportes/Inventario');
        })->name('inventario');
    });
});

require __DIR__.'/auth.php';
