<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Ruta dashboard general (por si acaso)
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas de dashboards por rol
Route::middleware(['auth', 'verified'])->group(function () {
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
});

// Rutas de perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
