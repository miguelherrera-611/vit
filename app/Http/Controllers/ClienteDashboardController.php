<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Inertia\Inertia;
use Inertia\Response;

class ClienteDashboardController extends Controller
{
    public function index(): Response
    {
        $usuario = auth()->user();

        $stats = [
            'total_pedidos'    => Pedido::where('user_id', $usuario->id)->count(),
            'en_revision'      => Pedido::where('user_id', $usuario->id)->where('estado', 'revision')->count(),
            'en_camino'        => Pedido::where('user_id', $usuario->id)->where('estado', 'envio_curso')->count(),
            'entregados'       => Pedido::where('user_id', $usuario->id)->where('estado', 'entregado')->count(),
        ];

        $ultimosPedidos = Pedido::with('items')
            ->where('user_id', $usuario->id)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'numero_pedido' => $p->numero_pedido,
                'estado'        => $p->estado,
                'estado_label'  => $p->estado_label,
                'estado_color'  => $p->estado_color,
                'total'         => $p->total,
                'created_at'    => $p->created_at->format('d/m/Y'),
                'items_count'   => $p->items->count(),
            ]);

        return Inertia::render('Cliente/Dashboard', [
            'stats'          => $stats,
            'ultimosPedidos' => $ultimosPedidos,
        ]);
    }
}
