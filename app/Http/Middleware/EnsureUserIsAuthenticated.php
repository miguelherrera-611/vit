<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        // Si el usuario no está autenticado
        if (!Auth::check()) {
            // Si es una petición AJAX/API
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'No autenticado. Por favor, inicia sesión.',
                    'redirect' => route('login')
                ], 401);
            }

            // Si es una petición web normal
            return redirect()->route('login')
                ->with('error', 'Debes iniciar sesión para acceder a esta página.');
        }

        return $next($request);
    }
}
