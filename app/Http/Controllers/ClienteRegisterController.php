<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Registro PÚBLICO exclusivo para clientes.
 * Los empleados y admins los crea únicamente el admin desde el panel.
 */
class ClienteRegisterController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterCliente');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'telefono' => ['nullable', 'string', 'max:50'],
        ], [
            'email.unique'       => 'Ya existe una cuenta con este correo electrónico.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'name.required'      => 'El nombre es obligatorio.',
            'email.required'     => 'El correo electrónico es obligatorio.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'activo'   => true,
        ]);

        // Asignar rol cliente automáticamente
        $user->assignRole('cliente');

        event(new Registered($user));

        // Redirigir al login con mensaje de éxito
        // (el cliente deberá verificar 2FA igual que los demás)
        return redirect()->route('login')
            ->with('status', '¡Cuenta creada exitosamente! Inicia sesión para continuar.');
    }
}
