<?php

namespace App\Http\Controllers;

use App\Models\Registro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\DeleteConfirmationMail;
use Inertia\Inertia;
use Carbon\Carbon;

class RegistroController extends Controller
{
    public function index(Request $request)
    {
        $query = Registro::query()->orderByDesc('created_at');

        if ($request->filled('usuario')) {
            $query->where('user_name', 'like', '%' . $request->usuario . '%');
        }
        if ($request->filled('modulo')) {
            $query->where('modulo', $request->modulo);
        }
        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }
        if ($request->filled('desde')) {
            $query->whereDate('created_at', '>=', $request->desde);
        }
        if ($request->filled('hasta')) {
            $query->whereDate('created_at', '<=', $request->hasta);
        }

        $registros = $query->paginate(20)->withQueryString();

        $registros->getCollection()->transform(function ($r) {
            // Leer datos JSON directamente del raw para evitar doble decode
            $r->datos_anteriores = $r->getRawOriginal('datos_anteriores')
                ? json_decode($r->getRawOriginal('datos_anteriores'), true)
                : null;
            $r->datos_nuevos = $r->getRawOriginal('datos_nuevos')
                ? json_decode($r->getRawOriginal('datos_nuevos'), true)
                : null;

            // Formatear fecha usando createFromFormat — el raw de MySQL siempre es 'Y-m-d H:i:s'
            $rawDate = $r->getRawOriginal('created_at');
            if ($rawDate) {
                try {
                    $r->created_at = Carbon::createFromFormat('Y-m-d H:i:s', $rawDate)
                        ->format('d/m/Y H:i:s');
                } catch (\Exception $e) {
                    $r->created_at = $rawDate;
                }
            } else {
                $r->created_at = null;
            }

            return $r;
        });

        return Inertia::render('Registros/Index', [
            'registros'    => $registros,
            'modulos'      => Registro::distinct()->pluck('modulo')->sort()->values(),
            'acciones'     => Registro::distinct()->pluck('accion')->sort()->values(),
            'filtros'      => [
                'usuario' => $request->usuario ?? '',
                'modulo'  => $request->modulo  ?? '',
                'accion'  => $request->accion  ?? '',
                'desde'   => $request->desde   ?? '',
                'hasta'   => $request->hasta   ?? '',
            ],
            'esperando2FA' => session()->has('delete_registros_ids'),
            'delete_count' => session('delete_registros_count', 0),
        ]);
    }

    /**
     * Paso 1: Verificar contraseña y enviar código 2FA por correo.
     */
    public function solicitarEliminacion(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
            'ids'      => 'required|array|min:1',
            'ids.*'    => 'integer|exists:registros,id',
        ]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $ids      = $request->ids;
        $cantidad = count($ids);

        $code = rand(100000, 999999);

        // Guardar como string 'Y-m-d H:i:s' — evita el bug de Carbon al deserializar desde sesión DB
        $expiresAt = Carbon::now()->addMinutes(10)->toDateTimeString();

        session([
            'delete_registros_code'       => (string) $code,
            'delete_registros_expires_at' => $expiresAt,
            'delete_registros_ids'        => $ids,
            'delete_registros_count'      => $cantidad,
        ]);

        // También guardar en la tabla para que sea visible en phpMyAdmin
        Registro::whereIn('id', $ids)->update([
            'delete_code'            => (string) $code,
            'delete_code_expires_at' => $expiresAt,
        ]);

        Mail::to(Auth::user()->email)->send(new DeleteConfirmationMail($code, $cantidad));

        return redirect()->back()
            ->with('delete_code_sent', true)
            ->with('delete_count', $cantidad);
    }

    /**
     * Paso 2: Verificar código y eliminar registros.
     */
    public function confirmarEliminacion(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $storedCode = session('delete_registros_code');
        $expiresAt  = session('delete_registros_expires_at'); // es string 'Y-m-d H:i:s'
        $ids        = session('delete_registros_ids', []);

        if (!$storedCode || !$expiresAt) {
            return back()->withErrors(['code' => 'El código ha expirado. Inicia el proceso nuevamente.']);
        }

        // Parsear con createFromFormat para evitar el bug de Carbon
        try {
            $expiracion = Carbon::createFromFormat('Y-m-d H:i:s', $expiresAt);
        } catch (\Exception $e) {
            return back()->withErrors(['code' => 'El código ha expirado. Inicia el proceso nuevamente.']);
        }

        if (Carbon::now()->isAfter($expiracion)) {
            return back()->withErrors(['code' => 'El código ha expirado. Inicia el proceso nuevamente.']);
        }

        if ((string) $request->code !== (string) $storedCode) {
            return back()->withErrors(['code' => 'Código incorrecto.']);
        }

        Registro::whereIn('id', $ids)->delete();

        session()->forget([
            'delete_registros_code',
            'delete_registros_expires_at',
            'delete_registros_ids',
            'delete_registros_count',
        ]);

        return redirect()->route('registros.index')
            ->with('success', 'Registros eliminados correctamente.');
    }

    /**
     * Cancelar el proceso y limpiar el código de la tabla.
     */
    public function cancelarEliminacion(Request $request)
    {
        $ids = session('delete_registros_ids', []);

        if (!empty($ids)) {
            Registro::whereIn('id', $ids)->update([
                'delete_code'            => null,
                'delete_code_expires_at' => null,
            ]);
        }

        session()->forget([
            'delete_registros_code',
            'delete_registros_expires_at',
            'delete_registros_ids',
            'delete_registros_count',
        ]);

        return redirect()->route('registros.index');
    }
}
