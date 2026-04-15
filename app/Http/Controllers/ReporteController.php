<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Producto;
use App\Models\Cliente;
use App\Models\Proveedor;
use App\Models\GrupoCategoria;
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

        // Cap: máximo 90 días para evitar cargar miles de registros
        $desdeCarbon = Carbon::parse($desde);
        $hastaCarbon = Carbon::parse($hasta);
        if ($desdeCarbon->diffInDays($hastaCarbon) > 90) {
            $desde = $hastaCarbon->copy()->subDays(90)->toDateString();
        }

        $query = Venta::with(['cliente', 'detalles.producto'])
            ->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]);

        if ($estado) {
            $query->where('estado', $estado);
        }

        $ventas = $query->orderBy('created_at', 'desc')->get();

        // KPIs y agregaciones via DB — evita iterar la colección en PHP
        $baseQuery = fn() => Venta::whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta])
            ->when($estado, fn($q) => $q->where('estado', $estado));

        $totalIngresos   = $baseQuery()->sum('total');
        $totalDescuentos = $baseQuery()->sum('descuento');
        $totalPendiente  = $baseQuery()->where('estado', 'Pendiente')->sum('saldo_pendiente');
        $numVentas       = $baseQuery()->count();
        $ticketPromedio  = $numVentas ? ($totalIngresos / $numVentas) : 0;

        $ventasPorDia = Venta::whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta])
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->select(
                DB::raw('DATE(created_at) as fecha_raw'),
                DB::raw('DATE_FORMAT(created_at, "%d/%m") as fecha'),
                DB::raw('SUM(total) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('fecha_raw', 'fecha')
            ->orderBy('fecha_raw')
            ->get()
            ->map(fn($r) => ['fecha' => $r->fecha, 'total' => (float) $r->total, 'count' => (int) $r->count])
            ->values();

        $porMetodoPago = Venta::whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta])
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->select('metodo_pago', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('metodo_pago')
            ->get()
            ->map(fn($g) => ['metodo' => $g->metodo_pago, 'total' => (float) $g->total, 'count' => (int) $g->count])
            ->values();

        $porEstado = Venta::whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta])
            ->when($estado, fn($q) => $q->where('estado', $estado))
            ->select('estado', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('estado')
            ->get()
            ->map(fn($g) => ['estado' => $g->estado, 'total' => (float) $g->total, 'count' => (int) $g->count])
            ->values();

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
                'num_ventas'       => $numVentas,
            ],
            'filtros'         => ['desde' => $desde, 'hasta' => $hasta, 'estado' => $estado],
        ]);
    }

    /* ─────────────────────────────────────────────────────────────
     |  INVENTARIO
     ─────────────────────────────────────────────────────────────*/
    public function inventario(): Response
    {
        // KPIs: una sola query DB con agregaciones (evita cargar toda la colección en PHP)
        $kpisRaw = DB::table('productos')
            ->whereNull('deleted_at')
            ->selectRaw('
                SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END)                              AS total_productos,
                SUM(precio * stock)                                                       AS valor_inventario_venta,
                SUM(COALESCE(precio_compra, 0) * stock)                                  AS valor_inventario_compra,
                SUM((precio - COALESCE(precio_compra, 0)) * stock)                       AS ganancia_potencial,
                SUM(CASE WHEN stock > 0 AND stock <= stock_minimo THEN 1 ELSE 0 END)     AS bajo_stock,
                SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END)                               AS agotados,
                SUM(CASE WHEN stock > stock_minimo THEN 1 ELSE 0 END)                    AS en_stock
            ')
            ->first();

        $kpis = [
            'total_productos'         => (int)   ($kpisRaw->total_productos         ?? 0),
            'valor_inventario_venta'  => (float) ($kpisRaw->valor_inventario_venta  ?? 0),
            'valor_inventario_compra' => (float) ($kpisRaw->valor_inventario_compra ?? 0),
            'ganancia_potencial'      => (float) ($kpisRaw->ganancia_potencial      ?? 0),
            'bajo_stock'              => (int)   ($kpisRaw->bajo_stock              ?? 0),
            'agotados'                => (int)   ($kpisRaw->agotados                ?? 0),
            'en_stock'                => (int)   ($kpisRaw->en_stock                ?? 0),
        ];

        // Por categoría: GROUP BY en DB (una query en vez de N iteraciones PHP)
        $porCategoria = DB::table('productos')
            ->whereNull('deleted_at')
            ->select('categoria')
            ->selectRaw('
                COUNT(*)                                                                  AS total_productos,
                SUM(stock)                                                                AS total_stock,
                SUM(precio * stock)                                                       AS valor_venta,
                SUM(COALESCE(precio_compra, 0) * stock)                                  AS valor_compra,
                SUM((precio - COALESCE(precio_compra, 0)) * stock)                       AS ganancia_potencial,
                SUM(CASE WHEN stock > 0 AND stock <= stock_minimo THEN 1 ELSE 0 END)     AS bajo_stock,
                SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END)                               AS agotados
            ')
            ->groupBy('categoria')
            ->orderBy('categoria')
            ->get()
            ->map(fn($r) => [
                'categoria'          => $r->categoria,
                'total_productos'    => (int)   $r->total_productos,
                'total_stock'        => (int)   $r->total_stock,
                'valor_venta'        => (float) $r->valor_venta,
                'valor_compra'       => (float) $r->valor_compra,
                'ganancia_potencial' => (float) $r->ganancia_potencial,
                'bajo_stock'         => (int)   $r->bajo_stock,
                'agotados'           => (int)   $r->agotados,
            ])
            ->values();

        // Críticos: query directa filtrada (sin iterar toda la colección)
        $criticos = Producto::whereNull('deleted_at')
            ->whereRaw('stock <= stock_minimo')
            ->orderBy('stock')
            ->get();

        // Lista completa para la tabla del reporte
        $productos = Producto::whereNull('deleted_at')
            ->orderBy('categoria')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Reportes/Inventario', compact('productos', 'porCategoria', 'criticos', 'kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  CLIENTES
     ─────────────────────────────────────────────────────────────*/
    public function clientes(): Response
    {
        $clientes = Cliente::whereNull('clientes.deleted_at')
            ->leftJoin('ventas', 'clientes.id', '=', 'ventas.cliente_id')
            ->select(
                'clientes.id',
                'clientes.nombre',
                'clientes.email',
                'clientes.telefono',
                'clientes.activo',
                'clientes.saldo_total',
                DB::raw('COALESCE(SUM(ventas.total), 0) as total_compras'),
                DB::raw('COUNT(ventas.id) as num_compras'),
                DB::raw('MAX(ventas.created_at) as ultima_compra'),
                DB::raw('CASE WHEN COUNT(ventas.id) > 0 THEN AVG(ventas.total) ELSE 0 END as ticket_promedio')
            )
            ->groupBy('clientes.id', 'clientes.nombre', 'clientes.email', 'clientes.telefono', 'clientes.activo', 'clientes.saldo_total')
            ->orderByDesc('total_compras')
            ->get()
            ->map(fn($c) => [
                'id'              => $c->id,
                'nombre'          => $c->nombre,
                'email'           => $c->email,
                'telefono'        => $c->telefono,
                'activo'          => $c->activo,
                'saldo_total'     => (float) ($c->saldo_total ?? 0),
                'total_compras'   => (float) $c->total_compras,
                'num_compras'     => (int) $c->num_compras,
                'ultima_compra'   => $c->ultima_compra,
                'ticket_promedio' => (float) $c->ticket_promedio,
            ])
            ->values();

        $kpis = [
            'total_clientes'   => $clientes->count(),
            'clientes_activos' => $clientes->where('activo', 1)->count(),
            'con_deuda'        => $clientes->where('saldo_total', '>', 0)->count(),
            'total_deuda'      => $clientes->sum('saldo_total'),
            'mejor_cliente'    => $clientes->first()['nombre'] ?? '-',
            'ingreso_total'    => $clientes->sum('total_compras'),
        ];

        $frecuencia = [
            ['label' => '1 compra',    'count' => $clientes->where('num_compras', 1)->count()],
            ['label' => '2-5 compras', 'count' => $clientes->whereBetween('num_compras', [2, 5])->count()],
            ['label' => '6+ compras',  'count' => $clientes->where('num_compras', '>=', 6)->count()],
        ];

        return Inertia::render('Reportes/Clientes', compact('clientes', 'kpis', 'frecuencia'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  FINANCIERO
     ─────────────────────────────────────────────────────────────*/
    public function financiero(): Response
    {
        $meses = collect(range(5, 0))->map(fn($i) => Carbon::now()->subMonths($i));

        // Una sola query GROUP BY en lugar de 18 queries (3 por mes × 6 meses)
        $inicio6Meses = Carbon::now()->subMonths(5)->startOfMonth();
        $ventasPorMes = Venta::select(
                DB::raw('YEAR(created_at) as anio'),
                DB::raw('MONTH(created_at) as mes_num'),
                DB::raw('SUM(total) as ingresos'),
                DB::raw('SUM(descuento) as descuentos'),
                DB::raw('COUNT(*) as num_ventas')
            )
            ->where('created_at', '>=', $inicio6Meses)
            ->groupBy('anio', 'mes_num')
            ->get()
            ->keyBy(fn($v) => $v->anio . '-' . $v->mes_num);

        $porMes = $meses->map(fn($mes) => [
            'mes'        => $mes->format('M Y'),
            'ingresos'   => (float) ($ventasPorMes->get($mes->year . '-' . $mes->month)?->ingresos   ?? 0),
            'descuentos' => (float) ($ventasPorMes->get($mes->year . '-' . $mes->month)?->descuentos ?? 0),
            'num_ventas' => (int)   ($ventasPorMes->get($mes->year . '-' . $mes->month)?->num_ventas  ?? 0),
        ]);

        $mesActual      = Carbon::now()->startOfMonth();
        $mesAnterior    = Carbon::now()->subMonth()->startOfMonth();
        $finMesAnterior = Carbon::now()->subMonth()->endOfMonth();

        $ingresosMesActual   = Venta::where('created_at', '>=', $mesActual)->sum('total');
        $ingresosMesAnterior = Venta::whereBetween('created_at', [$mesAnterior, $finMesAnterior])->sum('total');
        $crecimiento = $ingresosMesAnterior > 0
            ? (($ingresosMesActual - $ingresosMesAnterior) / $ingresosMesAnterior) * 100
            : 0;

        $metodosPago = Venta::select('metodo_pago', DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('metodo_pago')
            ->get();

        $kpis = [
            'ingresos_mes'     => $ingresosMesActual,
            'ingresos_mes_ant' => $ingresosMesAnterior,
            'crecimiento'      => round($crecimiento, 1),
            'total_descuentos' => Venta::where('created_at', '>=', $mesActual)->sum('descuento'),
            'total_pendiente'  => Venta::where('estado', 'Pendiente')->sum('saldo_pendiente'),
            'ingresos_totales' => Venta::sum('total'),
        ];

        return Inertia::render('Reportes/Financiero', compact('porMes', 'metodosPago', 'kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  EJECUTIVO
     ─────────────────────────────────────────────────────────────*/
    public function ejecutivo(): Response
    {
        $hoy    = Carbon::today();
        $mes    = Carbon::now()->startOfMonth();
        $semana = Carbon::now()->startOfWeek();

        // Una sola query GROUP BY en lugar de 60 queries (2 por día × 30 días)
        $inicio30 = Carbon::now()->subDays(29)->startOfDay();
        $ventas30raw = Venta::select(
                DB::raw('DATE(created_at) as dia'),
                DB::raw('SUM(total) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $inicio30)
            ->groupBy('dia')
            ->get()
            ->keyBy('dia');

        $ultimos30 = collect(range(29, 0))->map(fn($i) => [
            'fecha' => Carbon::now()->subDays($i)->format('d/m'),
            'total' => (float) ($ventas30raw->get(Carbon::now()->subDays($i)->toDateString())?->total ?? 0),
            'count' => (int)   ($ventas30raw->get(Carbon::now()->subDays($i)->toDateString())?->count ?? 0),
        ]);

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
            'ventas_hoy'      => Venta::whereDate('created_at', $hoy)->sum('total'),
            'ventas_semana'   => Venta::where('created_at', '>=', $semana)->sum('total'),
            'ventas_mes'      => Venta::where('created_at', '>=', $mes)->sum('total'),
            'num_ventas_hoy'  => Venta::whereDate('created_at', $hoy)->count(),
            'num_ventas_mes'  => Venta::where('created_at', '>=', $mes)->count(),
            'ticket_promedio' => Venta::where('created_at', '>=', $mes)->avg('total') ?? 0,
            'bajo_stock'      => Producto::whereNull('deleted_at')->whereRaw('stock <= stock_minimo')->count(),
            'agotados'        => Producto::whereNull('deleted_at')->where('stock', 0)->count(),
            'clientes_activos'=> Cliente::whereNull('deleted_at')->where('activo', 1)->count(),
            'saldo_pendiente' => Venta::where('estado', 'Pendiente')->sum('saldo_pendiente'),
        ];

        return Inertia::render('Reportes/Ejecutivo', compact('ultimos30', 'topProductos', 'topClientes', 'kpis'));
    }

    /* ─────────────────────────────────────────────────────────────
     |  RENTABILIDAD
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
                'categoria'      => $g->first()['categoria'],
                'unidades'       => $g->sum('unidades_vendidas'),
                'ingresos'       => $g->sum('ingreso_total'),
                'costos'         => $g->sum('costo_total'),
                'ganancia'       => $g->sum('ganancia_bruta'),
                'margen_promedio'=> round($g->avg('margen'), 1),
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
     |
     |  CORRECCIÓN: ahora agrupa por GRUPO real (GrupoCategoria)
     |  en lugar de detectar "Dama"/"Caballero" por string.
     |  Así cualquier grupo nuevo creado por el admin aparece
     |  automáticamente en la comparativa y en la gráfica.
     ─────────────────────────────────────────────────────────────*/
    public function ventasCategoria(Request $request): Response
    {
        $desde = $request->get('desde', Carbon::now()->startOfMonth()->toDateString());
        $hasta = $request->get('hasta', Carbon::today()->toDateString());

        // ── 1. Obtener todos los grupos de categoría activos ──────
        $grupos = GrupoCategoria::orderBy('orden')->orderBy('nombre')->get();

        // Mapa: "NombreGrupo - NombreSubcat" => "NombreGrupo"
        // Cubre el formato label_completo que usa el campo `categoria` en productos
        $mapaGrupos = [];
        foreach ($grupos as $grupo) {
            foreach ($grupo->subcategorias as $sub) {
                $mapaGrupos[$grupo->nombre . ' - ' . $sub->nombre] = $grupo->nombre;
            }
            // También mapear el nombre del grupo solo (por si hay productos sin subcategoría)
            $mapaGrupos[$grupo->nombre] = $grupo->nombre;
        }

        // ── 2. Obtener detalles de ventas del período ─────────────
        $detalles = VentaDetalle::with('producto')
            ->whereHas('venta', fn($q) => $q->whereBetween(DB::raw('DATE(created_at)'), [$desde, $hasta]))
            ->select('producto_id', DB::raw('SUM(cantidad) as unidades'), DB::raw('SUM(subtotal) as ingresos'))
            ->groupBy('producto_id')
            ->get();

        // ── 3. Agrupar por subcategoría (label_completo) ──────────
        $porCategoria = $detalles
            ->groupBy(fn($d) => $d->producto?->categoria ?? 'Sin categoría')
            ->map(fn($g, $cat) => [
                'categoria' => $cat,
                'unidades'  => (int) $g->sum('unidades'),
                'ingresos'  => (float) $g->sum('ingresos'),
                'productos' => $g->count(),
                // Resolver el grupo al que pertenece esta subcategoría
                'grupo'     => $mapaGrupos[$cat] ?? 'Otro',
            ])
            ->sortByDesc('ingresos')
            ->values();

        // ── 4. Comparativa dinámica: un bloque por cada grupo ─────
        //    (antes solo Dama/Caballero, ahora todos los grupos)
        $comparativa = $porCategoria
            ->groupBy('grupo')
            ->map(fn($g, $nombreGrupo) => [
                'grupo'    => $nombreGrupo,
                'unidades' => $g->sum('unidades'),
                'ingresos' => $g->sum('ingresos'),
            ])
            ->sortByDesc('ingresos')
            ->values();

        // ── 5. KPIs ───────────────────────────────────────────────
        $kpis = [
            'total_ingresos'  => $porCategoria->sum('ingresos'),
            'total_unidades'  => $porCategoria->sum('unidades'),
            'categoria_top'   => $porCategoria->first()['categoria'] ?? '—',
            // Mantener claves legacy para compatibilidad si las usan otros sitios
            'ingresos_dama'      => $comparativa->firstWhere('grupo', 'Dama')['ingresos'] ?? 0,
            'ingresos_caballero' => $comparativa->firstWhere('grupo', 'Caballero')['ingresos'] ?? 0,
            // Nuevo: todos los grupos como array para que el frontend los pueda iterar
            'por_grupo'          => $comparativa->values(),
        ];

        return Inertia::render('Reportes/VentasCategoria', [
            'porCategoria' => $porCategoria,
            'comparativa'  => $comparativa,
            'kpis'         => $kpis,
            'filtros'      => ['desde' => $desde, 'hasta' => $hasta],
        ]);
    }
}
