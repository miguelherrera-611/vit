<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GrupoCategoriaController;
use App\Http\Controllers\PapeleraController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\UserController;

// ─────────────────────────────────────────────────────────────────────────────
// Bienvenida
// ─────────────────────────────────────────────────────────────────────────────

Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->hasRole('admin')) {
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

    // ─────────────────────────────────────────────────────────────────────────────
// Gestión de Usuarios (solo admin)
// ─────────────────────────────────────────────────────────────────────────────
    Route::middleware('role:admin')
        ->prefix('usuarios')->name('usuarios.')
        ->group(function () {
            Route::get('/',                    [UserController::class, 'index'])->name('index');
            Route::get('/create',              [UserController::class, 'create'])->name('create');
            Route::post('/',                   [UserController::class, 'store'])->name('store');
            Route::get('/{usuario}/edit',      [UserController::class, 'edit'])->name('edit');
            Route::put('/{usuario}',           [UserController::class, 'update'])->name('update');
            Route::delete('/{usuario}',        [UserController::class, 'destroy'])->name('destroy');
            Route::patch('/{usuario}/toggle',  [UserController::class, 'toggleActivo'])->name('toggle');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Dashboards
    // ─────────────────────────────────────────────────────────────────────────

    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole('admin'))    return redirect()->route('dashboard.admin');
        if ($user->hasRole('empleado')) return redirect()->route('dashboard.empleado');
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])
        ->middleware('role:admin')
        ->name('dashboard.admin');

    Route::get('/dashboard/empleado', [DashboardController::class, 'empleado'])
        ->middleware('role:empleado')
        ->name('dashboard.empleado');

    // ─────────────────────────────────────────────────────────────────────────
    // Perfil
    // ─────────────────────────────────────────────────────────────────────────

    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─────────────────────────────────────────────────────────────────────────
    // Productos
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('productos')->name('productos.')
        ->group(function () {
            Route::get('/',               [ProductoController::class, 'index'])->name('index');
            Route::get('/create',         [ProductoController::class, 'create'])->name('create');
            Route::get('/crear',          [ProductoController::class, 'create']);
            Route::post('/',              [ProductoController::class, 'store'])->name('store');
            Route::get('/{producto}/edit',[ProductoController::class, 'edit'])->name('edit');
            Route::put('/{producto}',     [ProductoController::class, 'update'])->name('update');
            Route::patch('/{producto}',   [ProductoController::class, 'update']);
            Route::delete('/{producto}',  [ProductoController::class, 'destroy'])->name('destroy');
            Route::get('/{producto}',     [ProductoController::class, 'show'])->name('show');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Proveedores
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('proveedores')->name('proveedores.')
        ->group(function () {
            Route::get('/',                  [ProveedorController::class, 'index'])->name('index');
            Route::get('/create',            [ProveedorController::class, 'create'])->name('create');
            Route::get('/crear',             [ProveedorController::class, 'create']);
            Route::post('/',                 [ProveedorController::class, 'store'])->name('store');
            Route::get('/{proveedor}/edit',  [ProveedorController::class, 'edit'])->name('edit');
            Route::put('/{proveedor}',       [ProveedorController::class, 'update'])->name('update');
            Route::delete('/{proveedor}',    [ProveedorController::class, 'destroy'])->name('destroy');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Clientes
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin|empleado')
        ->prefix('clientes')->name('clientes.')
        ->group(function () {
            Route::get('/',               [ClienteController::class, 'index'])->name('index');
            Route::get('/create',         [ClienteController::class, 'create'])->name('create');
            Route::get('/crear',          [ClienteController::class, 'create']);
            Route::post('/',              [ClienteController::class, 'store'])->name('store');
            Route::get('/{cliente}/edit', [ClienteController::class, 'edit'])
                ->middleware('role:admin')->name('edit');
            Route::put('/{cliente}',      [ClienteController::class, 'update'])
                ->middleware('role:admin')->name('update');
            Route::delete('/{cliente}',   [ClienteController::class, 'destroy'])
                ->middleware('role:admin')->name('destroy');
            Route::get('/{cliente}',      [ClienteController::class, 'show'])->name('show');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Ventas
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin|empleado')
        ->prefix('ventas')->name('ventas.')
        ->group(function () {
            Route::get('/',        [VentaController::class, 'index'])->name('index');
            Route::get('/create',  [VentaController::class, 'create'])->name('create');
            Route::get('/crear',   [VentaController::class, 'create']);
            Route::post('/',       [VentaController::class, 'store'])->name('store');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Inventario
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('inventario')->name('inventario.')
        ->group(function () {
            Route::get('/',         [InventarioController::class, 'index'])->name('index');
            Route::get('/ajustar',  [InventarioController::class, 'ajustar'])->name('ajustar');
            Route::post('/ajustar', [InventarioController::class, 'procesarAjuste'])->name('procesarAjuste');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Reportes
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('reportes')->name('reportes.')
        ->group(function () {
            Route::get('/',                 [ReporteController::class, 'index'])->name('index');
            Route::get('/ventas',           [ReporteController::class, 'ventas'])->name('ventas');
            Route::get('/inventario',       [ReporteController::class, 'inventario'])->name('inventario');
            Route::get('/clientes',         [ReporteController::class, 'clientes'])->name('clientes');
            Route::get('/financiero',       [ReporteController::class, 'financiero'])->name('financiero');
            Route::get('/ejecutivo',        [ReporteController::class, 'ejecutivo'])->name('ejecutivo');
            Route::get('/rentabilidad',     [ReporteController::class, 'rentabilidad'])->name('rentabilidad');
            Route::get('/ventas-categoria', [ReporteController::class, 'ventasCategoria'])->name('ventas-categoria');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Categorías
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('categorias')->name('categorias.')
        ->group(function () {
            Route::get('/',        [GrupoCategoriaController::class, 'index'])->name('index');
            Route::get('/crear',   [GrupoCategoriaController::class, 'create'])->name('create');
            Route::get('/create',  [GrupoCategoriaController::class, 'create']);
            Route::post('/',       [GrupoCategoriaController::class, 'store'])->name('store');

            Route::get('/{grupo}/edit',  [GrupoCategoriaController::class, 'edit'])->name('edit');
            Route::put('/{grupo}',       [GrupoCategoriaController::class, 'update'])->name('update');
            Route::delete('/{grupo}',    [GrupoCategoriaController::class, 'destroy'])->name('destroy');

            Route::get('/{grupo}/subcategorias/crear',          [GrupoCategoriaController::class, 'createSubcat'])->name('subcat.create');
            Route::post('/{grupo}/subcategorias',               [GrupoCategoriaController::class, 'storeSubcat'])->name('subcat.store');
            Route::get('/{grupo}/subcategorias/{subcat}/edit',  [GrupoCategoriaController::class, 'editSubcat'])->name('subcat.edit');
            Route::put('/{grupo}/subcategorias/{subcat}',       [GrupoCategoriaController::class, 'updateSubcat'])->name('subcat.update');
            Route::delete('/{grupo}/subcategorias/{subcat}',    [GrupoCategoriaController::class, 'destroySubcat'])->name('subcat.destroy');

            Route::get('/{grupo}', [GrupoCategoriaController::class, 'show'])->name('show');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Papelera
    // ─────────────────────────────────────────────────────────────────────────

    Route::middleware('role:admin')
        ->prefix('papelera')->name('papelera.')
        ->group(function () {
            Route::get('/',                [PapeleraController::class, 'index'])->name('index');
            Route::post('/vaciar',         [PapeleraController::class, 'vaciar'])->name('vaciar');
            Route::post('/{item}/restore', [PapeleraController::class, 'restore'])->name('restore');
            Route::delete('/{item}',       [PapeleraController::class, 'forceDelete'])->name('forceDelete');
        });
});

require __DIR__.'/auth.php';
