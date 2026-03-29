<?php
// app/Http/Controllers/DashboardController.php
// ARCHIVO COMPLETO — igual al original + stat de pedidos en revisión para el admin
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\Pedido;

class DashboardController extends Controller
{
    public function admin(): Response
    {
        return Inertia::render('Dashboard/Admin', [
            'stats' => [
                'productos_activos' => Producto::activos()->count(),
                'ventas_hoy'        => Venta::completadas()->hoy()->count(),
                'stock_bajo'        => Producto::bajoStock()->count(),
                'ventas_mes'        => '$' . number_format(
                        Venta::completadas()->esteMes()->sum('total'), 0, ',', '.'
                    ),
                // NUEVO: pedidos en revisión para el badge de notificación
                'pedidos_revision'  => Pedido::where('estado', 'revision')->count(),
            ],
        ]);
    }

    public function empleado(): Response
    {
        return Inertia::render('Dashboard/Empleado');
    }
}
