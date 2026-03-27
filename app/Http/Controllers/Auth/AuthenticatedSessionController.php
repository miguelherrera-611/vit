<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeMail;
use Carbon\Carbon;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status'           => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        // LoginRequest::authenticate() ya maneja:
        // - RateLimiter de Laravel
        // - Bloqueo persistente en DB (intentos_fallidos / bloqueado_hasta)
        // - Incremento de intentos fallidos
        // - Limpieza de intentos al tener éxito
        $request->authenticate();

        $user = User::where('email', $request->email)->first();

        // Verificar si el usuario está activo
        if (!($user->activo ?? true)) {
            return back()->withErrors([
                'email' => 'Tu cuenta está desactivada. Contacta al administrador.',
            ]);
        }

        // Generar y enviar código 2FA
        $code = random_int(100000, 999999);
        $user->verification_code = $code;
        $user->code_expires_at   = Carbon::now()->addMinutes(10);
        $user->save();

        Mail::to($user->email)->send(new VerificationCodeMail($code));

        session(['2fa_email' => $user->email]);

        return redirect()->route('verification.2fa.show');
    }

    public function showVerificationForm(): Response
    {
        $email = session('2fa_email');

        if (!$email) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/VerifyCode', [
            'email' => $email,
        ]);
    }

    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $email = session('2fa_email');
        $user  = User::where('email', $email)->first();

        if (!$user) {
            return back()->withErrors(['code' => 'Usuario no encontrado.']);
        }

        if ($user->verification_code != $request->code) {
            return back()->withErrors(['code' => 'El código ingresado es incorrecto.']);
        }

        if (Carbon::now()->greaterThan($user->code_expires_at)) {
            // Limpiar código expirado de la DB
            $user->verification_code = null;
            $user->code_expires_at   = null;
            $user->save();

            return back()->withErrors(['code' => 'El código ha expirado. Por favor, inicia sesión nuevamente.']);
        }

        // Limpiar código verificado de la DB
        $user->verification_code = null;
        $user->code_expires_at   = null;
        $user->save();

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->forget('2fa_email');

        if ($user->hasRole('admin')) {
            return redirect()->intended('/dashboard/admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->intended('/dashboard/empleado');
        }

        return redirect()->intended('/dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
