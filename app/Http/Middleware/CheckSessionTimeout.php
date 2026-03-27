<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckSessionTimeout
{
    // Minutos de inactividad antes de cerrar sesión
    const TIMEOUT_MINUTOS = 30;

    public function handle(Request $request, Closure $next): Response
    {
        // Solo aplica a usuarios autenticados
        if (!Auth::check()) {
            return $next($request);
        }

        $ultimaActividad = session('ultima_actividad');

        // Si existe registro de última actividad y superó el timeout
        if ($ultimaActividad && (time() - $ultimaActividad) > (self::TIMEOUT_MINUTOS * 60)) {
            // Limpiar sesión y cerrar
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // Si es petición Inertia/AJAX redirigir con mensaje
            if ($request->header('X-Inertia')) {
                return redirect()->route('login')
                    ->with('status', 'Tu sesión expiró por inactividad. Inicia sesión nuevamente.');
            }

            return redirect()->route('login')
                ->with('status', 'Tu sesión expiró por inactividad. Inicia sesión nuevamente.');
        }

        // Actualizar timestamp de última actividad en cada request
        session(['ultima_actividad' => time()]);

        return $next($request);
    }
}
