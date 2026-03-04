import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

const fmtPct = (v) => `${Number(v ?? 0).toFixed(1)}%`;

function MargenBadge({ margen }) {
    if (margen >= 40) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{fmtPct(margen)}</span>;
    if (margen >= 20) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{fmtPct(margen)}</span>;
    if (margen > 0)   return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{fmtPct(margen)}</span>;
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{fmtPct(margen)}</span>;
}

export default function Rentabilidad({ productos = [], porCategoria = [], kpis = {}, filtros = {} }) {
    const [desde, setDesde]         = useState(filtros.desde ?? '');
    const [hasta, setHasta]         = useState(filtros.hasta ?? '');
    const [busqueda, setBusqueda]   = useState('');
    const [orden, setOrden]         = useState('ganancia_bruta');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 20;

    const aplicar = () => {
        setCurrentPage(1);
        router.get('/reportes/rentabilidad', { desde, hasta }, { preserveState: true });
    };

    const productosFiltrados = useMemo(() => {
        const q = busqueda.toLowerCase();
        return productos
            .filter(p => !q || p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q))
            .sort((a, b) => (b[orden] ?? 0) - (a[orden] ?? 0));
    }, [productos, busqueda, orden]);

    useEffect(() => setCurrentPage(1), [busqueda, orden]);

    const productosPaginados = useMemo(
        () => productosFiltrados.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
        [productosFiltrados, currentPage]
    );

    const maxGanancia = Math.max(...porCategoria.map(c => c.ganancia || 0), 1);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center gap-4">
                            <Link href="/reportes" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">Reporte de Rentabilidad</h1>
                                <p className="mt-1 text-sm text-gray-500">Análisis de ganancias por producto y categoría</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* Filtro de fechas */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Desde</label>
                                <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Hasta</label>
                                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div className="flex items-end">
                                <button onClick={aplicar}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition">
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Ingreso total',     value: fmt(kpis.ingreso_total),   color: 'text-blue-600'    },
                            { label: 'Costo total',       value: fmt(kpis.costo_total),     color: 'text-gray-600'    },
                            { label: 'Ganancia bruta',    value: fmt(kpis.ganancia_total),  color: 'text-emerald-600' },
                            { label: 'Margen promedio',   value: fmtPct(kpis.margen_promedio), color: 'text-violet-600' },
                            { label: 'Productos vendidos',value: kpis.productos_count ?? 0, color: 'text-gray-900'    },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`text-xl font-bold mt-2 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Por categoría */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Rentabilidad por categoría</h2>
                        <p className="text-xs text-gray-400 mb-6">Ganancia bruta acumulada por línea de producto</p>
                        <div className="space-y-4">
                            {porCategoria.map(cat => {
                                const pct = maxGanancia > 0 ? (cat.ganancia / maxGanancia) * 100 : 0;
                                return (
                                    <div key={cat.categoria}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">{cat.categoria}</span>
                                                <span className="ml-2 text-xs text-gray-400">{cat.unidades} uds · margen {fmtPct(cat.margen_promedio)}</span>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">{fmt(cat.ganancia)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                                            <div className="h-2.5 bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                            <span>Ingresos: {fmt(cat.ingresos)}</span>
                                            <span>Costos: {fmt(cat.costos)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {porCategoria.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Sin datos para el período</p>}
                        </div>
                    </div>

                    {/* Tabla de productos */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <h2 className="text-base font-semibold text-gray-900">
                                Detalle por producto
                                <span className="ml-2 text-sm font-normal text-gray-400">({productosFiltrados.length})</span>
                            </h2>
                            <div className="flex gap-3">
                                <input type="text" placeholder="Buscar…" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                                       className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-400 w-44" />
                                <select value={orden} onChange={e => setOrden(e.target.value)}
                                        className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none">
                                    <option value="ganancia_bruta">Ordenar: Ganancia</option>
                                    <option value="ingreso_total">Ordenar: Ingresos</option>
                                    <option value="margen">Ordenar: Margen %</option>
                                    <option value="unidades_vendidas">Ordenar: Unidades</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Producto', 'Categoría', 'P. Compra', 'P. Venta', 'Uds', 'Ingresos', 'Costos', 'Ganancia', 'Margen'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {productosPaginados.map((p, i) => (
                                    <tr key={p.id ?? i} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">{p.nombre}</td>
                                        <td className="px-5 py-3 text-xs text-gray-500">{p.categoria}</td>
                                        <td className="px-5 py-3 text-sm text-gray-500">
                                            {p.precio_compra > 0 ? fmt(p.precio_compra) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-700">{fmt(p.precio_venta)}</td>
                                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">{p.unidades_vendidas}</td>
                                        <td className="px-5 py-3 text-sm font-semibold text-blue-600">{fmt(p.ingreso_total)}</td>
                                        <td className="px-5 py-3 text-sm text-gray-500">
                                            {p.precio_compra > 0 ? fmt(p.costo_total) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3 text-sm font-bold text-emerald-600">
                                            {p.precio_compra > 0 ? fmt(p.ganancia_bruta) : <span className="text-gray-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            {p.precio_compra > 0
                                                ? <MargenBadge margen={p.margen} />
                                                : <span className="text-xs text-gray-300">Sin costo</span>}
                                        </td>
                                    </tr>
                                ))}
                                {productosFiltrados.length === 0 && (
                                    <tr><td colSpan="9" className="px-6 py-10 text-center text-gray-400">Sin datos para el período o búsqueda</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 pb-6">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={productosFiltrados.length}
                                perPage={PER_PAGE}
                                onPageChange={setCurrentPage}
                                accentColor="green"
                            />
                        </div>
                    </div>

                    {/* Aviso si faltan precios de compra */}
                    {productos.some(p => !p.precio_compra || p.precio_compra === 0) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-amber-800">Algunos productos no tienen precio de compra</p>
                                <p className="text-xs text-amber-600 mt-0.5">Los productos sin precio de compra muestran "—" en costos y ganancia. Edítalos en el módulo de Productos para ver datos completos.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
