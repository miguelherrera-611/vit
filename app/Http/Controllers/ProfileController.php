<?php
// app/Http/Controllers/ProfileController.php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Mail\EmailChangeMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ProfileController extends Controller
{
    // ── VER PERFIL ────────────────────────────────────────────────

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            // Enviamos los campos explícitamente para que pending_email llegue al frontend
            'user'   => [
                'name'              => $user->name,
                'email'             => $user->email,
                'pending_email'     => $user->pending_email,      // correo nuevo pendiente de verificar
                'email_verified_at' => $user->email_verified_at, // para saber si el correo está verificado
            ],
            'status' => session('status'),
        ]);
    }

    // ── ACTUALIZAR NOMBRE (sin tocar el correo) ───────────────────

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user      = $request->user();
        $validated = $request->validated();

        // Si el correo cambió → no lo guardamos todavía, iniciamos flujo 2FA
        if (isset($validated['email']) && $validated['email'] !== $user->email) {
            // Verificar que el nuevo correo no esté en uso
            $existe = \App\Models\User::where('email', $validated['email'])
                ->where('id', '!=', $user->id)
                ->exists();

            if ($existe) {
                return back()->withErrors(['email' => 'Este correo ya está en uso por otra cuenta.']);
            }

            $code = random_int(100000, 999999);

            $user->pending_email            = $validated['email'];
            $user->email_change_code        = (string) $code;
            $user->email_change_expires_at  = Carbon::now()->addMinutes(10);
            $user->name                     = $validated['name'];
            $user->save();

            Mail::to($validated['email'])->send(new EmailChangeMail($code, $validated['email']));

            return Redirect::route('profile.edit')->with('status', 'email-code-sent');
        }

        // Si solo cambia el nombre → guardar normalmente
        $user->name = $validated['name'];
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    // ── VERIFICAR CÓDIGO DE CAMBIO DE CORREO ─────────────────────

    public function verifyEmailChange(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();

        if (!$user->pending_email || !$user->email_change_code) {
            return back()->withErrors(['code' => 'No hay un cambio de correo pendiente.']);
        }

        if (Carbon::now()->greaterThan($user->email_change_expires_at)) {
            $user->pending_email           = null;
            $user->email_change_code       = null;
            $user->email_change_expires_at = null;
            $user->save();

            return back()->withErrors(['code' => 'El código ha expirado. Vuelve a intentarlo.']);
        }

        if ((string) $request->code !== (string) $user->email_change_code) {
            return back()->withErrors(['code' => 'Código incorrecto.']);
        }

        // Código válido → aplicar el nuevo correo
        $user->email                   = $user->pending_email;
        $user->email_verified_at       = now();
        $user->pending_email           = null;
        $user->email_change_code       = null;
        $user->email_change_expires_at = null;
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'email-updated');
    }

    // ── CANCELAR CAMBIO DE CORREO PENDIENTE ───────────────────────

    public function cancelEmailChange(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->pending_email           = null;
        $user->email_change_code       = null;
        $user->email_change_expires_at = null;
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'email-change-cancelled');
    }

    // ── ELIMINAR CUENTA ───────────────────────────────────────────

    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
