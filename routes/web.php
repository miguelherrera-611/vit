<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\AbonoController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\GrupoCategoriaController;
use App\Http\Controllers\PapeleraController;
use App\Http\Controllers\RegistroController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\UserController;
// ── NUEVOS ──────────────────────────────────────────────────────────────────
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ClienteDashboardController;
use App\Http\Controllers\Auth\ClienteRegisterController;
// ── NUEVOS (funcionalidades nuevas) ─────────────────────────────────────────
use App\Http\Controllers\ReclamoController;

// ─────────────────────────────────────────────────────────────────────────────
// Bienvenida
// ─────────────────────────────────────────────────────────────────────────────
Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->hasRole('admin'))    return redirect()->route('dashboard.admin');
        if ($user->hasRole('empleado')) return redirect()->route('dashboard.empleado');
        if ($user->hasRole('cliente'))  return redirect()->route('cliente.dashboard');
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

// ─────────────────────────────────────────────────────────────────────────────
// NUEVO — Registro público solo para clientes (solo guests)
// ─────────────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/registro', [ClienteRegisterController::class, 'create'])->name('registro.cliente');
    Route::post('/registro', [ClienteRegisterController::class, 'store'])->name('registro.cliente.store');
});

// ─────────────────────────────────────────────────────────────────────────────
// NUEVO — Catálogo público (sin autenticación)
// ─────────────────────────────────────────────────────────────────────────────
Route::prefix('catalogo')->name('catalogo.')->group(function () {
    Route::get('/', [CatalogoController::class, 'index'])->name('index');
    Route::get('/producto/{producto}', [CatalogoController::class, 'producto'])->name('producto');
    Route::get('/{grupo}', [CatalogoController::class, 'grupo'])->name('grupo');
    Route::get('/{grupo}/{subcat}', [CatalogoController::class, 'subcategoria'])->name('subcategoria');
});


Route::middleware(['auth', 'verified'])->group(function () {

    // ─────────────────────────────────────────────────────────────────────────
    // Dashboards
    // ─────────────────────────────────────────────────────────────────────────
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole('admin'))    return redirect()->route('dashboard.admin');
        if ($user->hasRole('empleado')) return redirect()->route('dashboard.empleado');
        if ($user->hasRole('cliente'))  return redirect()->route('cliente.dashboard');
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])
        ->middleware('role:admin')
        ->name('dashboard.admin');

    Route::get('/dashboard/empleado', [DashboardController::class, 'empleado'])
        ->middleware('role:empleado')
        ->name('dashboard.empleado');

    // ── NUEVO — Dashboard cliente ────────────────────────────────────────────
    Route::get('/cliente/dashboard', [ClienteDashboardController::class, 'index'])
        ->middleware('role:cliente')
        ->name('cliente.dashboard');

    // ── NUEVO — Pedidos del cliente ──────────────────────────────────────────
    Route::prefix('cliente')->name('cliente.')->middleware('role:cliente')->group(function () {
        Route::get('/mis-pedidos', [PedidoController::class, 'misPedidos'])->name('mis_pedidos');
        Route::get('/checkout', [PedidoController::class, 'checkout'])->name('checkout');
        Route::post('/pedidos', [PedidoController::class, 'store'])->name('pedidos.store');
        Route::get('/pedidos/{pedido}/confirmacion', [PedidoController::class, 'confirmacion'])->name('pedido.confirmacion');
        Route::patch('/pedidos/{pedido}/confirmar-entrega', [PedidoController::class, 'confirmarEntrega'])->name('pedido.confirmar_entrega');
        // ── NUEVAS: servicio al cliente y reclamos ───────────────────────────
        Route::get('/servicio-cliente', [ReclamoController::class, 'index'])->name('servicio_cliente');
        Route::post('/reclamos', [ReclamoController::class, 'store'])->name('reclamos.store');
    });

    // ── NUEVO — Pedidos del admin ────────────────────────────────────────────
    Route::prefix('admin/pedidos')->name('admin.pedidos.')->middleware('role:admin')->group(function () {
        Route::get('/', [PedidoController::class, 'adminIndex'])->name('index');
        Route::patch('/{pedido}/estado', [PedidoController::class, 'adminCambiarEstado'])->name('estado');
        // ── NUEVAS: editar datos de pago, contacto e historial ───────────────
        Route::post('/pago/{pago}', [PedidoController::class, 'actualizarPago'])->name('pago');
        Route::post('/contacto', [PedidoController::class, 'actualizarContacto'])->name('contacto');
        Route::post('/eliminar-historial', [PedidoController::class, 'eliminarHistorial'])->name('historial');
    });

    // ── NUEVAS — Reclamos del admin ──────────────────────────────────────────
    Route::prefix('admin/reclamos')->name('admin.reclamos.')->middleware('role:admin')->group(function () {
        Route::get('/', [ReclamoController::class, 'adminIndex'])->name('index');
        Route::patch('/{reclamo}', [ReclamoController::class, 'actualizar'])->name('actualizar');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Perfil
    // ─────────────────────────────────────────────────────────────────────────
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ─────────────────────────────────────────────────────────────────────────
    // Gestión de Usuarios — solo admin
    // ─────────────────────────────────────────────────────────────────────────
    Route::middleware('role:admin')
        ->prefix('usuarios')->name('usuarios.')
        ->group(function () {
            Route::get('/',                       [UserController::class, 'index'])->name('index');
            Route::get('/create',                 [UserController::class, 'create'])->name('create');
            Route::post('/',                      [UserController::class, 'store'])->name('store');
            Route::get('/{usuario}/edit',         [UserController::class, 'edit'])->name('edit');
            Route::put('/{usuario}',              [UserController::class, 'update'])->name('update');
            Route::delete('/{usuario}',           [UserController::class, 'destroy'])->name('destroy');
            Route::patch('/{usuario}/toggle',     [UserController::class, 'toggleActivo'])->name('toggle');
            // Nueva ruta: desbloquear cuenta bloqueada por intentos fallidos
            Route::patch('/{usuario}/desbloquear',[UserController::class, 'desbloquear'])->name('desbloquear');
        });

    // ─────────────────────────────────────────────────────────────────────────
    // Productos
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('productos')->name('productos.')->group(function () {
        Route::get('/', [ProductoController::class, 'index'])
            ->middleware('role_or_permission:admin|ver_productos')
            ->name('index');

        Route::get('/create', [ProductoController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_productos')
            ->name('create');
        Route::get('/crear', [ProductoController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_productos');
        Route::post('/', [ProductoController::class, 'store'])
            ->middleware('role_or_permission:admin|crear_productos')
            ->name('store');

        Route::get('/{producto}/edit', [ProductoController::class, 'edit'])
            ->middleware('role_or_permission:admin|editar_productos')
            ->name('edit');
        Route::put('/{producto}', [ProductoController::class, 'update'])
            ->middleware('role_or_permission:admin|editar_productos')
            ->name('update');
        Route::patch('/{producto}', [ProductoController::class, 'update'])
            ->middleware('role_or_permission:admin|editar_productos');

        Route::delete('/{producto}', [ProductoController::class, 'destroy'])
            ->middleware('role_or_permission:admin|eliminar_productos')
            ->name('destroy');

        Route::delete('/{producto}/fotos/{foto}', [ProductoController::class, 'eliminarFoto'])
            ->middleware('role_or_permission:admin|editar_productos')
            ->name('fotos.destroy');

        Route::get('/{producto}', [ProductoController::class, 'show'])
            ->middleware('role_or_permission:admin|ver_productos')
            ->name('show');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Proveedores
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('proveedores')->name('proveedores.')->group(function () {
        Route::get('/', [ProveedorController::class, 'index'])
            ->middleware('role_or_permission:admin|ver_proveedores')
            ->name('index');

        Route::get('/create', [ProveedorController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_proveedores')
            ->name('create');
        Route::get('/crear', [ProveedorController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_proveedores');
        Route::post('/', [ProveedorController::class, 'store'])
            ->middleware('role_or_permission:admin|crear_proveedores')
            ->name('store');

        Route::get('/{proveedor}/edit', [ProveedorController::class, 'edit'])
            ->middleware('role_or_permission:admin|editar_proveedores')
            ->name('edit');
        Route::put('/{proveedor}', [ProveedorController::class, 'update'])
            ->middleware('role_or_permission:admin|editar_proveedores')
            ->name('update');

        Route::delete('/{proveedor}', [ProveedorController::class, 'destroy'])
            ->middleware('role:admin')
            ->name('destroy');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Clientes
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('clientes')->name('clientes.')->group(function () {
        Route::get('/', [ClienteController::class, 'index'])
            ->middleware('role_or_permission:admin|gestionar_clientes')
            ->name('index');
        Route::get('/create', [ClienteController::class, 'create'])
            ->middleware('role_or_permission:admin|gestionar_clientes')
            ->name('create');
        Route::get('/crear', [ClienteController::class, 'create'])
            ->middleware('role_or_permission:admin|gestionar_clientes');
        Route::post('/', [ClienteController::class, 'store'])
            ->middleware('role_or_permission:admin|gestionar_clientes')
            ->name('store');
        Route::get('/{cliente}', [ClienteController::class, 'show'])
            ->middleware('role_or_permission:admin|gestionar_clientes')
            ->name('show');

        Route::get('/{cliente}/edit', [ClienteController::class, 'edit'])
            ->middleware('role:admin')->name('edit');
        Route::put('/{cliente}', [ClienteController::class, 'update'])
            ->middleware('role:admin')->name('update');
        Route::delete('/{cliente}', [ClienteController::class, 'destroy'])
            ->middleware('role:admin')->name('destroy');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Ventas
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('ventas')->name('ventas.')->group(function () {
        Route::get('/', [VentaController::class, 'index'])
            ->middleware('role_or_permission:admin|ver_ventas')
            ->name('index');
        Route::get('/create', [VentaController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_ventas')
            ->name('create');
        Route::get('/crear', [VentaController::class, 'create'])
            ->middleware('role_or_permission:admin|crear_ventas');
        Route::post('/', [VentaController::class, 'store'])
            ->middleware('role_or_permission:admin|crear_ventas')
            ->name('store');

        Route::get('/cartera', [VentaController::class, 'cartera'])
            ->middleware('role:admin')
            ->name('cartera');
        Route::post('/{venta}/anular', [VentaController::class, 'anular'])
            ->middleware('role:admin')
            ->name('anular');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Abonos
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('abonos')->name('abonos.')->group(function () {
        Route::get('/', [AbonoController::class, 'index'])
            ->middleware('role_or_permission:admin|crear_ventas')
            ->name('index');
        Route::post('/', [AbonoController::class, 'store'])
            ->middleware('role_or_permission:admin|crear_ventas')
            ->name('store');
        Route::get('/{venta}/historial', [AbonoController::class, 'historial'])
            ->middleware('role_or_permission:admin|ver_ventas')
            ->name('historial');
        Route::patch('/{venta}/extender-plazo', [AbonoController::class, 'extenderPlazo'])
            ->middleware('role:admin')
            ->name('extenderPlazo');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Inventario
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('inventario')->name('inventario.')->group(function () {
        Route::get('/', [InventarioController::class, 'index'])
            ->middleware('role_or_permission:admin|ver_inventario')
            ->name('index');
        Route::get('/ajustar', [InventarioController::class, 'ajustar'])
            ->middleware('role_or_permission:admin|ajustar_inventario')
            ->name('ajustar');
        Route::post('/ajustar', [InventarioController::class, 'procesarAjuste'])
            ->middleware('role_or_permission:admin|ajustar_inventario')
            ->name('procesarAjuste');
        // NUEVO — kardex de un producto
        Route::get('/{producto}/kardex', [InventarioController::class, 'kardex'])
            ->middleware('role_or_permission:admin|ver_inventario')
            ->name('kardex');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Reportes
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('/', [ReporteController::class, 'index'])
            ->middleware('role:admin')
            ->name('index');
        Route::get('/ventas', [ReporteController::class, 'ventas'])
            ->middleware('role_or_permission:admin|ver_reportes_ventas')
            ->name('ventas');
        Route::get('/inventario', [ReporteController::class, 'inventario'])
            ->middleware('role_or_permission:admin|ver_reportes_inventario')
            ->name('inventario');
        Route::get('/financiero', [ReporteController::class, 'financiero'])
            ->middleware('role_or_permission:admin|ver_reportes_financieros')
            ->name('financiero');
        Route::get('/clientes', [ReporteController::class, 'clientes'])
            ->middleware('role:admin')
            ->name('clientes');
        Route::get('/ejecutivo', [ReporteController::class, 'ejecutivo'])
            ->middleware('role:admin')
            ->name('ejecutivo');
        Route::get('/rentabilidad', [ReporteController::class, 'rentabilidad'])
            ->middleware('role:admin')
            ->name('rentabilidad');
        Route::get('/ventas-categoria', [ReporteController::class, 'ventasCategoria'])
            ->middleware('role:admin')
            ->name('ventas-categoria');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Categorías
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('categorias')->name('categorias.')->group(function () {
        Route::get('/', [GrupoCategoriaController::class, 'index'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('index');
        Route::get('/crear', [GrupoCategoriaController::class, 'create'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('create');
        Route::get('/create', [GrupoCategoriaController::class, 'create'])
            ->middleware('role_or_permission:admin|gestionar_categorias');
        Route::post('/', [GrupoCategoriaController::class, 'store'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('store');
        Route::get('/{grupo}/edit', [GrupoCategoriaController::class, 'edit'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('edit');
        Route::put('/{grupo}', [GrupoCategoriaController::class, 'update'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('update');
        Route::delete('/{grupo}', [GrupoCategoriaController::class, 'destroy'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('destroy');
        Route::get('/{grupo}/subcategorias/crear', [GrupoCategoriaController::class, 'createSubcat'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('subcat.create');
        Route::post('/{grupo}/subcategorias', [GrupoCategoriaController::class, 'storeSubcat'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('subcat.store');
        Route::get('/{grupo}/subcategorias/{subcat}/edit', [GrupoCategoriaController::class, 'editSubcat'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('subcat.edit');
        Route::put('/{grupo}/subcategorias/{subcat}', [GrupoCategoriaController::class, 'updateSubcat'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('subcat.update');
        Route::delete('/{grupo}/subcategorias/{subcat}', [GrupoCategoriaController::class, 'destroySubcat'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('subcat.destroy');
        Route::get('/{grupo}', [GrupoCategoriaController::class, 'show'])
            ->middleware('role_or_permission:admin|gestionar_categorias')
            ->name('show');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Papelera
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('papelera')->name('papelera.')->group(function () {
        Route::get('/', [PapeleraController::class, 'index'])
            ->middleware('role_or_permission:admin|gestionar_papelera')
            ->name('index');
        Route::post('/vaciar', [PapeleraController::class, 'vaciar'])
            ->middleware('role:admin')
            ->name('vaciar');
        Route::post('/{item}/restore', [PapeleraController::class, 'restore'])
            ->middleware('role_or_permission:admin|gestionar_papelera')
            ->name('restore');
        Route::delete('/{item}', [PapeleraController::class, 'forceDelete'])
            ->middleware('role:admin')
            ->name('forceDelete');
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Registros de actividad
    // ─────────────────────────────────────────────────────────────────────────
    Route::prefix('registros')->name('registros.')->group(function () {
        Route::get('/', [RegistroController::class, 'index'])
            ->middleware('role_or_permission:admin|ver_registros')
            ->name('index');
        Route::post('/solicitar-eliminacion', [RegistroController::class, 'solicitarEliminacion'])
            ->middleware('role:admin')
            ->name('solicitarEliminacion');
        Route::post('/confirmar-eliminacion', [RegistroController::class, 'confirmarEliminacion'])
            ->middleware('role:admin')
            ->name('confirmarEliminacion');
        Route::post('/cancelar-eliminacion', [RegistroController::class, 'cancelarEliminacion'])
            ->middleware('role:admin')
            ->name('cancelarEliminacion');
    });
});

require __DIR__.'/auth.php';
