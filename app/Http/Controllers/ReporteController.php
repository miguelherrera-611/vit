<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Proveedor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Reportes/Index');
    }

    public function ventas(): Response
    {
        // Stats generales
        $ventasHoy = Venta::completadas()->hoy()->sum('total');
        $ventasEsteMes = Venta::completadas()->esteMes()->sum('total');
        $totalVentas = Venta::completadas()->count();

        // Ventas por día (últimos 30 días)
        $ventasPorDia = Venta::completadas()
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->select(DB::raw('DATE(created_at) as fecha'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as cantidad'))
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get();

        // Productos más vendidos
        $productosMasVendidos = DB::table('venta_detalles')
            ->join('productos', 'venta_detalles.producto_id', '=', 'productos.id')
            ->join('ventas', 'venta_detalles.venta_id', '=', 'ventas.id')
            ->where('ventas.estado', 'Completada')
            ->select('productos.nombre', DB::raw('SUM(venta_detalles.cantidad) as total_vendido'), DB::raw('SUM(venta_detalles.subtotal) as ingresos'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderBy('total_vendido', 'desc')
            ->limit(10)
            ->get();

        // Ventas por método de pago
        $ventasPorMetodo = Venta::completadas()
            ->select('metodo_pago', DB::raw('COUNT(*) as cantidad'), DB::raw('SUM(total) as total'))
            ->groupBy('metodo_pago')
            ->get();

        return Inertia::render('Reportes/Ventas', [
            'stats' => [
                'ventasHoy' => $ventasHoy,
                'ventasEsteMes' => $ventasEsteMes,
                'totalVentas' => $totalVentas,
                'promedioVenta' => $totalVentas > 0 ? ($ventasEsteMes / $totalVentas) : 0,
            ],
            'ventasPorDia' => $ventasPorDia,
            'productosMasVendidos' => $productosMasVendidos,
            'ventasPorMetodo' => $ventasPorMetodo,
        ]);
    }

    public function inventario(): Response
    {
        $productosActivos = Producto::activos()->count();
        $productosBajoStock = Producto::bajoStock()->count();
        $productosAgotados = Producto::agotados()->count();
        $valorInventario = Producto::sum(DB::raw('precio * stock'));

        // Productos por categoría
        $productosPorCategoria = Producto::select('categoria', DB::raw('COUNT(*) as cantidad'), DB::raw('SUM(stock) as stock_total'))
            ->groupBy('categoria')
            ->get();

        // Productos con bajo stock
        $productosBajoStockDetalle = Producto::bajoStock()
            ->select('nombre', 'categoria', 'stock', 'stock_minimo')
            ->orderBy('stock')
            ->get();

        return Inertia::render('Reportes/Inventario', [
            'stats' => [
                'productosActivos' => $productosActivos,
                'productosBajoStock' => $productosBajoStock,
                'productosAgotados' => $productosAgotados,
                'valorInventario' => $valorInventario,
            ],
            'productosPorCategoria' => $productosPorCategoria,
            'productosBajoStock' => $productosBajoStockDetalle,
        ]);
    }

    public function clientes(): Response
    {
        $totalClientes = Cliente::count();
        $clientesActivos = Cliente::activos()->count();
        $clientesVIP = Cliente::VIP()->count();

        // Clientes con más compras
        $clientesTopCompras = DB::table('clientes')
            ->join('ventas', 'clientes.id', '=', 'ventas.cliente_id')
            ->where('ventas.estado', 'Completada')
            ->select('clientes.nombre', 'clientes.tipo', DB::raw('COUNT(*) as total_compras'), DB::raw('SUM(ventas.total) as total_gastado'))
            ->groupBy('clientes.id', 'clientes.nombre', 'clientes.tipo')
            ->orderBy('total_compras', 'desc')
            ->limit(10)
            ->get();

        // Clientes por tipo
        $clientesPorTipo = Cliente::select('tipo', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('tipo')
            ->get();

        return Inertia::render('Reportes/Clientes', [
            'stats' => [
                'totalClientes' => $totalClientes,
                'clientesActivos' => $clientesActivos,
                'clientesVIP' => $clientesVIP,
            ],
            'clientesTopCompras' => $clientesTopCompras,
            'clientesPorTipo' => $clientesPorTipo,
        ]);
    }

    public function proveedores(): Response
    {
        $totalProveedores = Proveedor::count();
        $proveedoresActivos = Proveedor::activos()->count();

        $proveedores = Proveedor::select('nombre', 'empresa', 'email', 'telefono', 'activo')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Reportes/Proveedores', [
            'stats' => [
                'totalProveedores' => $totalProveedores,
                'proveedoresActivos' => $proveedoresActivos,
            ],
            'proveedores' => $proveedores,
        ]);
    }

    public function ejecutivo(): Response
    {
        // Dashboard ejecutivo con KPIs principales
        $ventasHoy = Venta::completadas()->hoy()->sum('total');
        $ventasEsteMes = Venta::completadas()->esteMes()->sum('total');
        $totalProductos = Producto::count();
        $totalClientes = Cliente::count();
        $productosBajoStock = Producto::bajoStock()->count();

        return Inertia::render('Reportes/Ejecutivo', [
            'kpis' => [
                'ventasHoy' => $ventasHoy,
                'ventasEsteMes' => $ventasEsteMes,
                'totalProductos' => $totalProductos,
                'totalClientes' => $totalClientes,
                'productosBajoStock' => $productosBajoStock,
            ],
        ]);
    }
}
