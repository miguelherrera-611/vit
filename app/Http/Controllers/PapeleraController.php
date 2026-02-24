<?php

namespace App\Http\Controllers;

use App\Models\Papelera;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Proveedor;
use App\Models\Venta;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class PapeleraController extends Controller
{
    // ─────────────────────────────────────────────────────────────
    // INDEX
    // ─────────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        // Purgar automáticamente los que ya vencieron
        $this->purgarVencidos();

        $tipo = $request->get('tipo', '');

        $query = Papelera::orderByDesc('eliminado_at');

        if ($tipo) {
            $query->porTipo($tipo);
        }

        $items = $query->paginate(20)->through(fn ($item) => [
            'id'              => $item->id,
            'tipo'            => $item->tipo,
            'nombre_display'  => $item->nombre_display,
            'eliminado_por'   => $item->eliminado_por,
            'eliminado_at'    => $item->eliminado_at->format('d/m/Y H:i'),
            'purgar_at'       => $item->purgar_at->format('d/m/Y'),
            'dias_restantes'  => $item->dias_restantes,
            'datos'           => $item->datos,
        ]);

        $conteos = [
            'total'     => Papelera::count(),
            'producto'  => Papelera::porTipo('producto')->count(),
            'cliente'   => Papelera::porTipo('cliente')->count(),
            'proveedor' => Papelera::porTipo('proveedor')->count(),
            'venta'     => Papelera::porTipo('venta')->count(),
            'categoria' => Papelera::porTipo('categoria')->count(),
        ];

        return Inertia::render('Papelera/Index', [
            'items'   => $items,
            'conteos' => $conteos,
            'filtro'  => $tipo,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // RESTORE — recuperar un elemento
    // ─────────────────────────────────────────────────────────────

    public function restore(Request $request, string $id)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $item = Papelera::findOrFail($id);

        try {
            $this->restaurarModelo($item);
            $item->delete();

            return back()->with('success', "\"{$item->nombre_display}\" restaurado exitosamente.");
        } catch (\Exception $e) {
            return back()->withErrors(['restore' => 'No se pudo restaurar: ' . $e->getMessage()]);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // FORCE DELETE — eliminar permanentemente (con contraseña)
    // ─────────────────────────────────────────────────────────────

    public function forceDelete(Request $request, string $id)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $item = Papelera::findOrFail($id);
        $nombre = $item->nombre_display;
        $item->delete();

        return back()->with('success', "\"{$nombre}\" eliminado permanentemente.");
    }

    // ─────────────────────────────────────────────────────────────
    // VACIAR PAPELERA — elimina TODO permanentemente (con contraseña)
    // ─────────────────────────────────────────────────────────────

    public function vaciar(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $total = Papelera::count();
        Papelera::truncate();

        return back()->with('success', "Papelera vaciada. {$total} elemento(s) eliminados permanentemente.");
    }

    // ─────────────────────────────────────────────────────────────
    // Helpers privados
    // ─────────────────────────────────────────────────────────────

    private function purgarVencidos(): void
    {
        Papelera::vencidos()->delete();
    }

    private function restaurarModelo(Papelera $item): void
    {
        $datos = $item->datos;

        // Remover campos que no deben insertarse directamente
        unset($datos['id'], $datos['created_at'], $datos['updated_at'], $datos['deleted_at']);

        match ($item->tipo) {
            'producto'  => Producto::withTrashed()->updateOrCreate(
                ['id' => $item->modelo_id],
                array_merge($datos, ['deleted_at' => null])
            ),
            'cliente'   => Cliente::withTrashed()->updateOrCreate(
                ['id' => $item->modelo_id],
                array_merge($datos, ['deleted_at' => null])
            ),
            'proveedor' => Proveedor::withTrashed()->updateOrCreate(
                ['id' => $item->modelo_id],
                array_merge($datos, ['deleted_at' => null])
            ),
            'categoria' => Categoria::withTrashed()->updateOrCreate(
                ['id' => $item->modelo_id],
                array_merge($datos, ['deleted_at' => null])
            ),
            default     => throw new \Exception("Tipo '{$item->tipo}' no soporta restauración automática."),
        };
    }
}
