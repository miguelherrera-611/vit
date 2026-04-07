<?php
// ============================================================
// app/Http/Controllers/ReclamoController.php
// ============================================================

namespace App\Http\Controllers;

use App\Models\Reclamo;
use App\Models\Papelera;
use App\Models\ConfigContacto;
use App\Mail\ReclamoNuevoAdminMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ReclamoController extends Controller
{
    // ── CLIENTE: formulario de reclamo ───────────────────────────

    public function index(): Response
    {
        $contacto = ConfigContacto::all()->pluck('valor', 'clave');

        return Inertia::render('Cliente/ServicioCliente', [
            'contacto' => $contacto,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipo'              => 'required|string|max:100',
            'descripcion'       => 'nullable|string|max:1000',
            'telefono_contacto' => 'required|string|max:20',
        ]);

        $reclamo = Reclamo::create([
            'user_id'           => auth()->id(),
            'tipo'              => $request->tipo,
            'descripcion'       => $request->descripcion,
            'telefono_contacto' => $request->telefono_contacto,
            'estado'            => 'pendiente',
        ]);

        // Correo inmediato al admin
        $adminEmails = \App\Models\User::role('admin')->pluck('email')->toArray();
        if (!empty($adminEmails)) {
            Mail::to($adminEmails)->send(new ReclamoNuevoAdminMail($reclamo));
        }

        return back()->with('success', 'Reporte enviado. Nos comunicaremos contigo pronto.');
    }

    // ── ADMIN: lista de reclamos ─────────────────────────────────

    public function adminIndex(Request $request): Response
    {
        $query = Reclamo::with('user')->orderByDesc('created_at');

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $reclamos = $query->paginate(20)->through(fn($r) => [
            'id'                => $r->id,
            'tipo'              => $r->tipo,
            'tipo_label'        => $r->tipo_label,
            'descripcion'       => $r->descripcion,
            'telefono_contacto' => $r->telefono_contacto,
            'estado'            => $r->estado,
            'estado_color'      => $r->estado_color,
            'notas_admin'       => $r->notas_admin,
            'cliente'           => $r->user?->name ?? 'Anónimo',
            'email_cliente'     => $r->user?->email,
            'created_at'        => $r->created_at->format('d/m/Y H:i'),
            // Para la validación en frontend: ¿es elegible para eliminar?
            'puede_eliminar'    => $r->estado === 'cerrado'
                && $r->created_at->diffInDays(now()) >= 30,
        ]);

        $conteos = [
            'pendiente'   => Reclamo::where('estado', 'pendiente')->count(),
            'en_revision' => Reclamo::where('estado', 'en_revision')->count(),
            'resuelto'    => Reclamo::where('estado', 'resuelto')->count(),
            'cerrado'     => Reclamo::where('estado', 'cerrado')->count(),
        ];

        return Inertia::render('Admin/Reclamos', [
            'reclamos' => $reclamos,
            'conteos'  => $conteos,
            'filtro'   => $request->estado ?? '',
        ]);
    }

    // ── ADMIN: actualizar estado de reclamo ──────────────────────

    public function actualizar(Request $request, string $reclamoId)
    {
        $request->validate([
            'estado'      => 'required|in:pendiente,en_revision,resuelto,cerrado',
            'notas_admin' => 'nullable|string|max:500',
        ]);

        $reclamo = Reclamo::findOrFail($reclamoId);
        $reclamo->update([
            'estado'      => $request->estado,
            'notas_admin' => $request->notas_admin ?? $reclamo->notas_admin,
        ]);

        return back()->with('success', 'Reclamo actualizado.');
    }

    // ── ADMIN: eliminar reclamos seleccionados → papelera ────────
    //
    // Reglas de negocio:
    //   1. Solo el admin puede acceder a esta ruta (middleware en web.php).
    //   2. Requiere contraseña del admin como segunda confirmación.
    //   3. Solo se eliminan reclamos con estado = 'cerrado'
    //      Y con más de 30 días de antigüedad.
    //   4. Si algún ID no cumple las condiciones se rechaza TODA la solicitud.

    public function eliminar(Request $request)
    {
        $request->validate([
            'ids'      => 'required|array|min:1',
            'ids.*'    => 'integer|exists:reclamos,id',
            'password' => 'required|string',
        ]);

        // Verificar contraseña del admin
        if (!Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $ids      = $request->ids;
        $reclamos = Reclamo::whereIn('id', $ids)->get();

        // Validar que TODOS cumplan las condiciones antes de eliminar cualquiera
        $noElegibles = $reclamos->filter(function ($r) {
            $esCerrado     = $r->estado === 'cerrado';
            $tiene30Dias   = $r->created_at->diffInDays(now()) >= 30;
            return !($esCerrado && $tiene30Dias);
        });

        if ($noElegibles->isNotEmpty()) {
            $detalle = $noElegibles->map(function ($r) {
                $diasRestantes = max(0, 30 - (int) $r->created_at->diffInDays(now()));
                if ($r->estado !== 'cerrado') {
                    return "Reclamo #{$r->id}: debe estar en estado \"Cerrado\" (estado actual: {$r->estado}).";
                }
                return "Reclamo #{$r->id}: faltan {$diasRestantes} día(s) para cumplir los 30 días requeridos.";
            })->implode(' | ');

            return back()->withErrors([
                'ids' => "No se puede eliminar: {$detalle}",
            ]);
        }

        // Mover a papelera
        foreach ($reclamos as $reclamo) {
            $clienteNombre  = $reclamo->user ? $reclamo->user->name : 'Anónimo';
            $nombreDisplay  = "Reclamo #{$reclamo->id} — {$reclamo->tipo_label} ({$clienteNombre})";

            Papelera::archivar(
                'reclamo',
                $reclamo,
                $nombreDisplay,
                auth()->user()->name
            );
            $reclamo->delete();
        }

        $total = $reclamos->count();

        return back()->with('success', "{$total} reclamo(s) movido(s) a la papelera.");
    }
}
