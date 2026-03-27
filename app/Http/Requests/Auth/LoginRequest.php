<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Verifica credenciales SIN iniciar sesión (Auth::validate, no Auth::attempt).
     * El login real ocurre en verifyCode() después del 2FA.
     *
     * Además del RateLimiter de Laravel, registra intentos fallidos
     * en DB para bloqueo persistente.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = $this->only('email', 'password');

        // Buscar usuario para verificar bloqueo en DB antes de intentar
        $user = User::where('email', $this->email)->first();

        // Si el usuario existe y está bloqueado en DB, rechazar directamente
        if ($user && $user->estaBloqueado()) {
            $minutos = $user->minutosRestantesBloqueo();
            throw ValidationException::withMessages([
                'email' => "Tu cuenta está bloqueada por intentos fallidos. "
                    . "Intenta de nuevo en {$minutos} minuto(s) o contacta al administrador.",
            ]);
        }

        // CORRECCIÓN: usar Auth::validate() — solo verifica credenciales,
        // NO inicia sesión. El login real ocurre en verifyCode() tras el 2FA.
        if (! Auth::validate($credentials)) {
            RateLimiter::hit($this->throttleKey());

            // Si el usuario existe, registrar intento fallido en DB
            if ($user) {
                $user->registrarIntentoFallido();

                if ($user->estaBloqueado()) {
                    throw ValidationException::withMessages([
                        'email' => 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 30 minutos.',
                    ]);
                }

                $restantes = max(0, 5 - $user->intentos_fallidos);
                throw ValidationException::withMessages([
                    'email' => "Credenciales incorrectas. "
                        . ($restantes > 0
                            ? "Te quedan {$restantes} intento(s) antes de bloquear la cuenta."
                            : "Tu cuenta ha sido bloqueada."),
                ]);
            }

            // Email no existe — mensaje genérico
            throw ValidationException::withMessages([
                'email' => 'Las credenciales proporcionadas son incorrectas.',
            ]);
        }

        // Credenciales correctas: limpiar intentos fallidos y RateLimiter
        if ($user) {
            $user->limpiarIntentosFallidos();
        }

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
