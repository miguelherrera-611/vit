<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use App\Models\User;
use App\Mail\VerificationCodeMail;
use Carbon\Carbon;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Validar credenciales sin autenticar aún
        $credentials = $request->only('email', 'password');

        if (!Auth::validate($credentials)) {
            return back()->withErrors([
                'email' => 'Las credenciales proporcionadas son incorrectas.',
            ])->onlyInput('email');
        }

        // Obtener el usuario
        $user = User::where('email', $request->email)->first();

        // Generar código de 6 dígitos
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guardar código y tiempo de expiración (10 minutos)
        $user->verification_code = $code;
        $user->code_expires_at = Carbon::now()->addMinutes(10);
        $user->save();

        // Enviar código por correo
        try {
            Mail::to($user->email)->send(new VerificationCodeMail($code, $user->name));
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'Error al enviar el correo. Intenta nuevamente.',
            ])->onlyInput('email');
        }

        // Guardar email en sesión para la verificación
        session(['verify_email' => $user->email]);

        return redirect()->route('verification.2fa.show');
    }

    /**
     * Mostrar formulario de verificación de código
     */
    public function showVerificationForm(): View
    {
        if (!session('verify_email')) {
            return redirect()->route('login');
        }

        return view('auth.verify-code');
    }

    /**
     * Verificar el código ingresado
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = session('verify_email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            return back()->withErrors(['code' => 'Usuario no encontrado.']);
        }

        // Verificar si el código expiró
        if (Carbon::now()->greaterThan($user->code_expires_at)) {
            return back()->withErrors(['code' => 'El código ha expirado. Solicita uno nuevo.']);
        }

        // Verificar si el código es correcto
        if ($user->verification_code !== $request->code) {
            return back()->withErrors(['code' => 'Código incorrecto.']);
        }

        // Limpiar código usado
        $user->verification_code = null;
        $user->code_expires_at = null;
        $user->save();

        // Autenticar al usuario
        Auth::login($user);
        $request->session()->regenerate();
        session()->forget('verify_email');

        // Redirigir según el rol del usuario
        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.superadmin');
        } elseif ($user->hasRole('admin')) {
            return redirect()->route('dashboard.admin');
        } elseif ($user->hasRole('empleado')) {
            return redirect()->route('dashboard.empleado');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
