<?php

namespace App\Http\Controllers;

use App\Models\Papelera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PapeleraController extends Controller
{
    // ── INDEX ────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $this->purgarVencidos();

        $tipo  = $request->get('tipo', '');
        $query = Papelera::orderByDesc('eliminado_at');
        if ($tipo) $query->porTipo($tipo);

        $items = $query->paginate(20)->through(fn ($item) => [
            'id'             => $item->id,
            'tipo'           => $item->tipo,
            'nombre_display' => $item->nombre_display,
            'eliminado_por'  => $item->eliminado_por,
            'eliminado_at'   => $item->eliminado_at->format('d/m/Y H:i'),
            'purgar_at'      => $item->purgar_at->format('d/m/Y'),
            'dias_restantes' => $item->dias_restantes,
            'datos'          => $item->datos,
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

    // ── RESTORE ──────────────────────────────────────────────────

    public function restore(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $item = Papelera::findOrFail($id);

        try {
            $this->restaurarRegistro($item->tipo, $item->modelo_id, $item->datos);
            $item->delete();
            return back()->with('success', "\"{$item->nombre_display}\" restaurado exitosamente.");
        } catch (\Exception $e) {
            return back()->withErrors(['restore' => 'Error al restaurar: ' . $e->getMessage()]);
        }
    }

    // ── FORCE DELETE ─────────────────────────────────────────────

    public function forceDelete(Request $request, string $id)
    {
        $request->validate(['password' => 'required|string']);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $item   = Papelera::findOrFail($id);
        $nombre = $item->nombre_display;
        $item->delete();

        return back()->with('success', "\"{$nombre}\" eliminado permanentemente.");
    }

    // ── VACIAR ───────────────────────────────────────────────────

    public function vaciar(Request $request)
    {
        $request->validate(['password' => 'required|string']);

        if (! Hash::check($request->password, auth()->user()->password)) {
            return back()->withErrors(['password' => 'Contraseña incorrecta.']);
        }

        $total = Papelera::count();
        Papelera::truncate();

        return back()->with('success', "Papelera vaciada. {$total} elemento(s) eliminados permanentemente.");
    }

    // ── HELPERS PRIVADOS ─────────────────────────────────────────

    private function purgarVencidos(): void
    {
        Papelera::vencidos()->delete();
    }

    /**
     * Restaura un registro directamente en su tabla usando UPDATE/INSERT de DB.
     * No usa Eloquent para evitar problemas con fillable y SoftDeletes.
     */
    private function restaurarRegistro(string $tipo, int $modeloId, array $datos): void
    {
        $tabla = match ($tipo) {
            'producto'        => 'productos',
            'cliente'         => 'clientes',
            'proveedor'       => 'proveedores',
            'categoria'       => 'categorias',
            'grupo_categoria' => 'grupos_categoria',
            default           => throw new \Exception("Tipo '{$tipo}' no soporta restauración."),
        };

        // Obtener columnas reales de la tabla para filtrar datos compatibles
        $columnas = $this->columnasDeTabla($tabla);

        $existe = DB::table($tabla)->where('id', $modeloId)->exists();

        if ($existe) {
            // Registro existe (posiblemente con soft-delete): solo limpiar deleted_at
            DB::table($tabla)
                ->where('id', $modeloId)
                ->update(['deleted_at' => null]);
        } else {
            // Registro eliminado permanentemente: recrearlo con datos del snapshot
            $insert = ['id' => $modeloId, 'deleted_at' => null];
            foreach ($datos as $key => $value) {
                if (in_array($key, $columnas) && $key !== 'id' && $key !== 'deleted_at') {
                    // Convertir booleanos a 0/1 para MySQL
                    $insert[$key] = is_bool($value) ? (int) $value : $value;
                }
            }
            DB::table($tabla)->insert($insert);
        }

        // Si es un grupo, también restaurar sus subcategorías que estén soft-deleted
        if ($tipo === 'grupo_categoria') {
            DB::table('categorias')
                ->where('grupo_id', $modeloId)
                ->whereNotNull('deleted_at')
                ->update(['deleted_at' => null]);
        }
    }

    private function columnasDeTabla(string $tabla): array
    {
        return array_column(
            DB::select("SHOW COLUMNS FROM `{$tabla}`"),
            'Field'
        );
    }
}
