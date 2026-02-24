<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PapeleraController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Ruta de bienvenida
Route::get('/', function () {
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
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');


Route::middleware(['auth', 'verified'])->group(function () {

    // -------------------------------------------------------------------------
    // Dashboards
    // -------------------------------------------------------------------------

    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole('super_admin')) return redirect()->route('dashboard.superadmin');
        if ($user->hasRole('admin'))       return redirect()->route('dashboard.admin');
        if ($user->hasRole('empleado'))    return redirect()->route('dashboard.empleado');
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/dashboard/superadmin', [DashboardController::class, 'superAdmin'])
        ->middleware('role:super_admin')->name('dashboard.superadmin');

    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])
        ->middleware('role:admin')->name('dashboard.admin');

    Route::get('/dashboard/empleado', [DashboardController::class, 'empleado'])
        ->middleware('role:empleado')->name('dashboard.empleado');

    // -------------------------------------------------------------------------
    // Perfil
    // -------------------------------------------------------------------------

    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // -------------------------------------------------------------------------
    // Productos
    // REGLA: rutas estáticas SIEMPRE antes que /{param}
    // -------------------------------------------------------------------------

    Route::middleware('role:admin|super_admin')
        ->prefix('productos')->name('productos.')
        ->group(function () {
            Route::get('/',        [ProductoController::class, 'index'])->name('index');

            // estáticas primero ↓
            Route::get('/create',  [ProductoController::class, 'create'])->name('create');
            Route::get('/crear',   [ProductoController::class, 'create']);   // alias ES
            Route::post('/',       [ProductoController::class, 'store'])->name('store');

            // dinámicas después ↓
            Route::get('/{producto}/edit',   [ProductoController::class, 'edit'])->name('edit');
            Route::put('/{producto}',        [ProductoController::class, 'update'])->name('update');
            Route::patch('/{producto}',      [ProductoController::class, 'update']);
            Route::delete('/{producto}',     [ProductoController::class, 'destroy'])->name('destroy');
            Route::get('/{producto}',        [ProductoController::class, 'show'])->name('show');
        });

    // -------------------------------------------------------------------------
    // Proveedores
    // -------------------------------------------------------------------------

    Route::middleware('role:admin|super_admin')
        ->prefix('proveedores')->name('proveedores.')
        ->group(function () {
            Route::get('/',        [ProveedorController::class, 'index'])->name('index');

            // estáticas primero ↓
            Route::get('/create',  [ProveedorController::class, 'create'])->name('create');
            Route::get('/crear',   [ProveedorController::class, 'create']);  // alias ES
            Route::post('/',       [ProveedorController::class, 'store'])->name('store');

            // dinámicas después ↓
            Route::get('/{proveedor}/edit',  [ProveedorController::class, 'edit'])->name('edit');
            Route::put('/{proveedor}',       [ProveedorController::class, 'update'])->name('update');
            Route::delete('/{proveedor}',    [ProveedorController::class, 'destroy'])->name('destroy');
        });

    // -------------------------------------------------------------------------
    // Clientes
    // -------------------------------------------------------------------------

    Route::middleware('role:admin|super_admin')
        ->prefix('clientes')->name('clientes.')
        ->group(function () {
            Route::get('/',        [ClienteController::class, 'index'])->name('index');

            // estáticas primero ↓
            Route::get('/create',  [ClienteController::class, 'create'])->name('create');
            Route::get('/crear',   [ClienteController::class, 'create']);   // alias ES
            Route::post('/',       [ClienteController::class, 'store'])->name('store');

            // dinámicas después ↓
            Route::get('/{cliente}/edit',    [ClienteController::class, 'edit'])->name('edit');
            Route::put('/{cliente}',         [ClienteController::class, 'update'])->name('update');
            Route::delete('/{cliente}',      [ClienteController::class, 'destroy'])->name('destroy');
            Route::get('/{cliente}',         [ClienteController::class, 'show'])->name('show');
        });

    // -------------------------------------------------------------------------
    // Ventas
    // -------------------------------------------------------------------------

    Route::prefix('ventas')->name('ventas.')
        ->group(function () {
            Route::get('/',        [VentaController::class, 'index'])->name('index');

            // estáticas primero ↓
            Route::get('/create',  [VentaController::class, 'create'])->name('create');
            Route::get('/crear',   [VentaController::class, 'create']);     // alias ES
            Route::post('/',       [VentaController::class, 'store'])->name('store');
        });

    // -------------------------------------------------------------------------
    // Inventario
    // -------------------------------------------------------------------------

    Route::middleware('role:admin|super_admin')
        ->prefix('inventario')->name('inventario.')
        ->group(function () {
            Route::get('/',          [InventarioController::class, 'index'])->name('index');
            Route::get('/ajustar',   [InventarioController::class, 'ajustar'])->name('ajustar');
            Route::post('/ajustar',  [InventarioController::class, 'procesarAjuste'])->name('procesarAjuste');
        });

    // -------------------------------------------------------------------------
    // Reportes
    // -------------------------------------------------------------------------

    Route::middleware('role:admin|super_admin')
        ->prefix('reportes')->name('reportes.')
        ->group(function () {
            Route::get('/',           fn () => Inertia::render('Reportes/Index'))->name('index');
            Route::get('/ventas',     fn () => Inertia::render('Reportes/Ventas'))->name('ventas');
            Route::get('/inventario', fn () => Inertia::render('Reportes/Inventario'))->name('inventario');
        });
});


// -------------------------------------------------------------------------
// Categorías
// -------------------------------------------------------------------------

Route::middleware('role:admin|super_admin')
    ->prefix('categorias')->name('categorias.')
    ->group(function () {
        Route::get('/',        [CategoriaController::class, 'index'])->name('index');

        // estáticas primero ↓
        Route::get('/create',  [CategoriaController::class, 'create'])->name('create');
        Route::get('/crear',   [CategoriaController::class, 'create']);
        Route::post('/',       [CategoriaController::class, 'store'])->name('store');

        // dinámicas ↓
        Route::get('/{categoria}/edit',  [CategoriaController::class, 'edit'])->name('edit');
        Route::put('/{categoria}',       [CategoriaController::class, 'update'])->name('update');
        Route::delete('/{categoria}',    [CategoriaController::class, 'destroy'])->name('destroy');
        Route::get('/{categoria}',       [CategoriaController::class, 'show'])->name('show');
    });

// -------------------------------------------------------------------------
// Papelera (Trash)
// -------------------------------------------------------------------------

Route::middleware('role:admin|super_admin')
    ->prefix('papelera')->name('papelera.')
    ->group(function () {
        Route::get('/',                    [PapeleraController::class, 'index'])->name('index');
        Route::post('/vaciar',             [PapeleraController::class, 'vaciar'])->name('vaciar');
        Route::post('/{item}/restore',     [PapeleraController::class, 'restore'])->name('restore');
        Route::delete('/{item}',           [PapeleraController::class, 'forceDelete'])->name('forceDelete');
    });


require __DIR__.'/auth.php';
