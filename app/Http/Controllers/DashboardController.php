<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Producto;
use App\Models\Venta;

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
            ],
        ]);
    }

    public function empleado(): Response
    {
        return Inertia::render('Dashboard/Empleado');
    }
}
