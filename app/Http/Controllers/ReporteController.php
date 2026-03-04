<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ReporteController extends Controller
{
    /* ─────────────────────────────────────────────────────────────
     |  INDEX — Hub central de reportes
     ─────────────────────────────────────────────────────────────*/
    public function index(): Response
    {
        $hoy   = Carbon::today();
        $mes   = Carbon::now()->startOfMonth();
        $ayer  = Carbon::yesterday();

        // KPIs rápidos para el hub
        $kpis = [
            'ventas_hoy'       => Venta::whereDate('created_at', $hoy)->sum('total'),
            'ventas_mes'       => Venta::where('created_at', '>=', $mes)->sum('total'),
            'total_productos'  => Producto::whereNull('deleted_at')->where('activo', 1)->count(),
            'bajo_stock'       => Producto::whereNull('deleted_at')->whereRaw('stock <= stock_minimo')->count(),
            'clientes_activos' => Cliente::whereNull('deleted_at')->where('activo', 1)->count(),
            'saldo_pendiente'  => Venta::where('estado', 'Pendiente')->sum('saldo_pendiente'),
            'num_ventas_mes'   => Venta::where('created_at', '>=', $mes)->count(),
            'ticket_promedio'  => Venta::where('created_at', '>=', $mes)->avg('total') ?? 0,
        ];

        return Inertia::render('Reportes/Index', compact('kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  VENTAS — Reporte completo de ventas
     ─────────────────────────────────────────────────────────────*/
    public function ventas(Request $request): Response
    {
        $desde  = $request->get('desde', Carbon::now()->startOfMonth()->toDateString());
        $hasta  = $request->get('hasta', Carbon::today()->toDateString());
        $estado = $request->get('estado', '');

        $query = Venta::with(['cliente', 'detalles.producto'])
            ->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]);

        if ($estado) {
            $query->where('estado', $estado);
        }

        $ventas = $query->orderBy('created_at', 'desc')->get();

        // KPIs del período
        $totalIngresos    = $ventas->sum('total');
        $totalDescuentos  = $ventas->sum('descuento');
        $totalPendiente   = $ventas->where('estado', 'Pendiente')->sum('saldo_pendiente');
        $ticketPromedio   = $ventas->count() ? $ventas->avg('total') : 0;

        // Ventas por día (para gráfica de línea)
        $ventasPorDia = $ventas->groupBy(fn($v) => Carbon::parse($v->created_at)->toDateString())
            ->map(fn($grupo) => [
                'fecha'  => Carbon::parse($grupo->first()->created_at)->format('d/m'),
                'total'  => $grupo->sum('total'),
                'count'  => $grupo->count(),
            ])->values();

        // Ventas por método de pago (para gráfica dona)
        $porMetodoPago = $ventas->groupBy('metodo_pago')
            ->map(fn($g) => ['metodo' => $g->first()->metodo_pago, 'total' => $g->sum('total'), 'count' => $g->count()])
            ->values();

        // Ventas por estado
        $porEstado = $ventas->groupBy('estado')
            ->map(fn($g) => ['estado' => $g->first()->estado, 'total' => $g->sum('total'), 'count' => $g->count()])
            ->values();

        // Top 10 productos más vendidos en el período
        $productosTop = VentaDetalle::with('producto')
            ->whereHas('venta', fn($q) => $q->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]))
            ->select('producto_id', DB::raw('SUM(cantidad) as total_cantidad'), DB::raw('SUM(subtotal) as total_ingresos'))
            ->groupBy('producto_id')
            ->orderByDesc('total_cantidad')
            ->limit(10)
            ->get()
            ->map(fn($d) => [
                'nombre'          => $d->producto->nombre ?? 'Eliminado',
                'categoria'       => $d->producto->categoria ?? '-',
                'total_cantidad'  => $d->total_cantidad,
                'total_ingresos'  => $d->total_ingresos,
            ]);

        return Inertia::render('Reportes/Ventas', [
            'ventas'          => $ventas,
            'ventasPorDia'    => $ventasPorDia,
            'porMetodoPago'   => $porMetodoPago,
            'porEstado'       => $porEstado,
            'productosTop'    => $productosTop,
            'kpis'            => [
                'total_ingresos'   => $totalIngresos,
                'total_descuentos' => $totalDescuentos,
                'total_pendiente'  => $totalPendiente,
                'ticket_promedio'  => $ticketPromedio,
                'num_ventas'       => $ventas->count(),
            ],
            'filtros'         => ['desde' => $desde, 'hasta' => $hasta, 'estado' => $estado],
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     |  INVENTARIO — Reporte de stock con precio compra y venta
     ─────────────────────────────────────────────────────────────*/
    public function inventario(): Response
    {
        $productos = Producto::whereNull('deleted_at')->orderBy('categoria')->orderBy('nombre')->get();

        // KPIs
        $kpis = [
            'total_productos'        => $productos->where('activo', 1)->count(),
            'valor_inventario_venta' => $productos->sum(fn($p) => $p->precio * $p->stock),
            'valor_inventario_compra'=> $productos->sum(fn($p) => ($p->precio_compra ?? 0) * $p->stock),
            'ganancia_potencial'     => $productos->sum(fn($p) => (($p->precio - ($p->precio_compra ?? 0)) * $p->stock)),
            'bajo_stock'             => $productos->filter(fn($p) => $p->stock > 0 && $p->stock <= $p->stock_minimo)->count(),
            'agotados'               => $productos->where('stock', 0)->count(),
            'en_stock'               => $productos->filter(fn($p) => $p->stock > $p->stock_minimo)->count(),
        ];

        // Por categoría
        $porCategoria = $productos->groupBy('categoria')
            ->map(fn($g) => [
                'categoria'              => $g->first()->categoria,
                'total_productos'        => $g->count(),
                'total_stock'            => $g->sum('stock'),
                'valor_venta'            => $g->sum(fn($p) => $p->precio * $p->stock),
                'valor_compra'           => $g->sum(fn($p) => ($p->precio_compra ?? 0) * $p->stock),
                'ganancia_potencial'     => $g->sum(fn($p) => (($p->precio - ($p->precio_compra ?? 0)) * $p->stock)),
                'bajo_stock'             => $g->filter(fn($p) => $p->stock > 0 && $p->stock <= $p->stock_minimo)->count(),
                'agotados'               => $g->where('stock', 0)->count(),
            ])->values();

        // Productos críticos (agotados o bajo stock)
        $criticos = $productos->filter(fn($p) => $p->stock <= $p->stock_minimo)
            ->sortBy('stock')
            ->values();

        return Inertia::render('Reportes/Inventario', compact('productos', 'porCategoria', 'criticos', 'kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  CLIENTES — Reporte de comportamiento de clientes
     ─────────────────────────────────────────────────────────────*/
    public function clientes(): Response
    {
        $clientes = Cliente::whereNull('deleted_at')
            ->with(['ventas'])
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'nombre'          => $c->nombre,
                'email'           => $c->email,
                'telefono'        => $c->telefono,
                'activo'          => $c->activo,
                'saldo_total'     => $c->saldo_total ?? 0,
                'total_compras'   => $c->ventas->sum('total'),
                'num_compras'     => $c->ventas->count(),
                'ultima_compra'   => $c->ventas->sortByDesc('created_at')->first()?->created_at,
                'ticket_promedio' => $c->ventas->count() ? $c->ventas->avg('total') : 0,
            ])
            ->sortByDesc('total_compras')
            ->values();

        $kpis = [
            'total_clientes'    => $clientes->count(),
            'clientes_activos'  => $clientes->where('activo', 1)->count(),
            'con_deuda'         => $clientes->where('saldo_total', '>', 0)->count(),
            'total_deuda'       => $clientes->sum('saldo_total'),
            'mejor_cliente'     => $clientes->first()['nombre'] ?? '-',
            'ingreso_total'     => $clientes->sum('total_compras'),
        ];

        // Frecuencia de compra
        $frecuencia = [
            ['label' => '1 compra',    'count' => $clientes->where('num_compras', 1)->count()],
            ['label' => '2-5 compras', 'count' => $clientes->whereBetween('num_compras', [2, 5])->count()],
            ['label' => '6+ compras',  'count' => $clientes->where('num_compras', '>=', 6)->count()],
        ];

        return Inertia::render('Reportes/Clientes', compact('clientes', 'kpis', 'frecuencia'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  FINANCIERO — Ingresos, descuentos, métodos de pago
     ─────────────────────────────────────────────────────────────*/
    public function financiero(): Response
    {
        // Últimos 6 meses
        $meses = collect(range(5, 0))->map(fn($i) => Carbon::now()->subMonths($i));

        $porMes = $meses->map(fn($mes) => [
            'mes'      => $mes->format('M Y'),
            'ingresos' => Venta::whereYear('created_at', $mes->year)
                ->whereMonth('created_at', $mes->month)
                ->sum('total'),
            'descuentos' => Venta::whereYear('created_at', $mes->year)
                ->whereMonth('created_at', $mes->month)
                ->sum('descuento'),
            'num_ventas' => Venta::whereYear('created_at', $mes->year)
                ->whereMonth('created_at', $mes->month)
                ->count(),
        ]);

        $mesActual = Carbon::now()->startOfMonth();
        $mesAnterior = Carbon::now()->subMonth()->startOfMonth();
        $finMesAnterior = Carbon::now()->subMonth()->endOfMonth();

        $ingresosMesActual   = Venta::where('created_at', '>=', $mesActual)->sum('total');
        $ingresosMesAnterior = Venta::whereBetween('created_at', [$mesAnterior, $finMesAnterior])->sum('total');
        $crecimiento = $ingresosMesAnterior > 0
            ? (($ingresosMesActual - $ingresosMesAnterior) / $ingresosMesAnterior) * 100
            : 0;

        // Distribución métodos de pago (todos los tiempos)
        $metodosPago = Venta::select('metodo_pago', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('metodo_pago')
            ->get();

        $kpis = [
            'ingresos_mes'       => $ingresosMesActual,
            'ingresos_mes_ant'   => $ingresosMesAnterior,
            'crecimiento'        => round($crecimiento, 1),
            'total_descuentos'   => Venta::where('created_at', '>=', $mesActual)->sum('descuento'),
            'total_pendiente'    => Venta::where('estado', 'Pendiente')->sum('saldo_pendiente'),
            'ingresos_totales'   => Venta::sum('total'),
        ];

        return Inertia::render('Reportes/Financiero', compact('porMes', 'metodosPago', 'kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  EJECUTIVO — Dashboard gerencial
     ─────────────────────────────────────────────────────────────*/
    public function ejecutivo(): Response
    {
        $hoy     = Carbon::today();
        $mes     = Carbon::now()->startOfMonth();
        $semana  = Carbon::now()->startOfWeek();

        // Ventas por día últimos 30 días
        $ultimos30 = collect(range(29, 0))->map(fn($i) => [
            'fecha'  => Carbon::now()->subDays($i)->format('d/m'),
            'total'  => Venta::whereDate('created_at', Carbon::now()->subDays($i))->sum('total'),
            'count'  => Venta::whereDate('created_at', Carbon::now()->subDays($i))->count(),
        ]);

        // Top 5 productos del mes
        $topProductos = VentaDetalle::with('producto')
            ->whereHas('venta', fn($q) => $q->where('created_at', '>=', $mes))
            ->select('producto_id', DB::raw('SUM(cantidad) as qty'), DB::raw('SUM(subtotal) as revenue'))
            ->groupBy('producto_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn($d) => [
                'nombre'    => $d->producto->nombre ?? '-',
                'categoria' => $d->producto->categoria ?? '-',
                'qty'       => $d->qty,
                'revenue'   => $d->revenue,
            ]);

        // Top 5 clientes del mes
        $topClientes = Venta::with('cliente')
            ->where('created_at', '>=', $mes)
            ->select('cliente_id', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('cliente_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(fn($v) => [
                'nombre' => $v->cliente->nombre ?? 'Cliente General',
                'total'  => $v->total,
                'count'  => $v->count,
            ]);

        $kpis = [
            'ventas_hoy'       => Venta::whereDate('created_at', $hoy)->sum('total'),
            'ventas_semana'    => Venta::where('created_at', '>=', $semana)->sum('total'),
            'ventas_mes'       => Venta::where('created_at', '>=', $mes)->sum('total'),
            'num_ventas_hoy'   => Venta::whereDate('created_at', $hoy)->count(),
            'num_ventas_mes'   => Venta::where('created_at', '>=', $mes)->count(),
            'ticket_promedio'  => Venta::where('created_at', '>=', $mes)->avg('total') ?? 0,
            'bajo_stock'       => Producto::whereNull('deleted_at')->whereRaw('stock <= stock_minimo')->count(),
            'agotados'         => Producto::whereNull('deleted_at')->where('stock', 0)->count(),
            'clientes_activos' => Cliente::whereNull('deleted_at')->where('activo', 1)->count(),
            'saldo_pendiente'  => Venta::where('estado', 'Pendiente')->sum('saldo_pendiente'),
        ];

        return Inertia::render('Reportes/Ejecutivo', compact('ultimos30', 'topProductos', 'topClientes', 'kpis'));
    }
    /* ─────────────────────────────────────────────────────────────
     |  RENTABILIDAD — RF-06.4
     ─────────────────────────────────────────────────────────────*/
    public function rentabilidad(Request $request): Response
    {
        $desde = $request->get('desde', Carbon::now()->startOfMonth()->toDateString());
        $hasta = $request->get('hasta', Carbon::today()->toDateString());

        $detalles = VentaDetalle::with('producto')
            ->whereHas('venta', fn($q) => $q->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]))
            ->select(
                'producto_id',
                DB::raw('SUM(cantidad) as unidades_vendidas'),
                DB::raw('SUM(subtotal) as ingreso_total')
            )
            ->groupBy('producto_id')
            ->get()
            ->map(function ($d) {
                $p              = $d->producto;
                $costo_unit     = $p ? ($p->precio_compra ?? 0) : 0;
                $costo_total    = $costo_unit * $d->unidades_vendidas;
                $ganancia_bruta = $d->ingreso_total - $costo_total;
                $margen         = $d->ingreso_total > 0 ? ($ganancia_bruta / $d->ingreso_total) * 100 : 0;

                return [
                    'id'                => $d->producto_id,
                    'nombre'            => $p->nombre ?? 'Producto eliminado',
                    'categoria'         => $p->categoria ?? '—',
                    'precio_compra'     => $costo_unit,
                    'precio_venta'      => $p ? $p->precio : 0,
                    'unidades_vendidas' => (int) $d->unidades_vendidas,
                    'ingreso_total'     => (float) $d->ingreso_total,
                    'costo_total'       => $costo_total,
                    'ganancia_bruta'    => $ganancia_bruta,
                    'margen'            => round($margen, 1),
                ];
            })
            ->sortByDesc('ganancia_bruta')
            ->values();

        $porCategoria = $detalles->groupBy('categoria')
            ->map(fn($g) => [
                'categoria'       => $g->first()['categoria'],
                'unidades'        => $g->sum('unidades_vendidas'),
                'ingresos'        => $g->sum('ingreso_total'),
                'costos'          => $g->sum('costo_total'),
                'ganancia'        => $g->sum('ganancia_bruta'),
                'margen_promedio' => round($g->avg('margen'), 1),
            ])
            ->sortByDesc('ganancia')
            ->values();

        $kpis = [
            'ingreso_total'   => $detalles->sum('ingreso_total'),
            'costo_total'     => $detalles->sum('costo_total'),
            'ganancia_total'  => $detalles->sum('ganancia_bruta'),
            'margen_promedio' => round($detalles->avg('margen') ?? 0, 1),
            'productos_count' => $detalles->count(),
        ];

        return Inertia::render('Reportes/Rentabilidad', [
            'productos'    => $detalles,
            'porCategoria' => $porCategoria,
            'kpis'         => $kpis,
            'filtros'      => ['desde' => $desde, 'hasta' => $hasta],
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     |  VENTAS POR CATEGORÍA — RF-06.6
     ─────────────────────────────────────────────────────────────*/
    public function ventasCategoria(Request $request): Response
    {
        $desde = $request->get('desde', Carbon::now()->startOfMonth()->toDateString());
        $hasta = $request->get('hasta', Carbon::today()->toDateString());

        $detalles = VentaDetalle::with('producto')
            ->whereHas('venta', fn($q) => $q->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]))
            ->select('producto_id', DB::raw('SUM(cantidad) as unidades'), DB::raw('SUM(subtotal) as ingresos'))
            ->groupBy('producto_id')
            ->get();

        $porCategoria = $detalles->groupBy(fn($d) => $d->producto?->categoria ?? 'Sin categoría')
            ->map(fn($g, $cat) => [
                'categoria' => $cat,
                'unidades'  => (int) $g->sum('unidades'),
                'ingresos'  => (float) $g->sum('ingresos'),
                'productos' => $g->count(),
                'grupo'     => str_starts_with($cat, 'Dama') ? 'Dama' : (str_starts_with($cat, 'Caballero') ? 'Caballero' : 'Otro'),
            ])
            ->sortByDesc('ingresos')
            ->values();

        $dama      = $porCategoria->where('grupo', 'Dama');
        $caballero = $porCategoria->where('grupo', 'Caballero');

        $comparativa = [
            ['grupo' => 'Dama',      'unidades' => $dama->sum('unidades'),      'ingresos' => $dama->sum('ingresos')],
            ['grupo' => 'Caballero', 'unidades' => $caballero->sum('unidades'), 'ingresos' => $caballero->sum('ingresos')],
        ];

        $kpis = [
            'total_ingresos'     => $porCategoria->sum('ingresos'),
            'total_unidades'     => $porCategoria->sum('unidades'),
            'categoria_top'      => $porCategoria->first()['categoria'] ?? '—',
            'ingresos_dama'      => $dama->sum('ingresos'),
            'ingresos_caballero' => $caballero->sum('ingresos'),
        ];

        return Inertia::render('Reportes/VentasCategoria', [
            'porCategoria' => $porCategoria,
            'comparativa'  => $comparativa,
            'kpis'         => $kpis,
            'filtros'      => ['desde' => $desde, 'hasta' => $hasta],
        ]);
    }
}
