import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (v) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v ?? 0);

/* Gráfica de barras horizontales */
function HBarChart({ data, valueKey, colorFn }) {
    const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
    return (
        <div className="space-y-3">
            {data.map(d => {
                const pct = (d[valueKey] / max) * 100;
                return (
                    <div key={d.categoria}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[55%]">{d.categoria}</span>
                            <span className="text-sm font-bold text-gray-900">{typeof d[valueKey] === 'number' && d[valueKey] > 1000 ? fmt(d[valueKey]) : d[valueKey]}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${colorFn(d)}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                );
            })}
            {data.length === 0 && <p className="text-sm text-gray-400 text-center py-6">Sin datos para el período</p>}
        </div>
    );
}

/* Mini gráfica de dona con SVG */
function DonaChart({ dama, caballero }) {
    const total = (dama || 0) + (caballero || 0);
    if (total === 0) return <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>;

    const pctDama = total > 0 ? (dama / total) * 100 : 0;
    const pctCab  = 100 - pctDama;
    const r = 40, cx = 60, cy = 60, stroke = 24;
    const circ = 2 * Math.PI * r;
    const dashDama = (pctDama / 100) * circ;
    const dashCab  = circ - dashDama;

    return (
        <div className="flex flex-col items-center">
            <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Fondo */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
                {/* Caballero */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366f1" strokeWidth={stroke}
                        strokeDasharray={`${dashCab} ${dashDama}`}
                        strokeDashoffset={-dashDama} transform={`rotate(-90 ${cx} ${cy})`} />
                {/* Dama */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ec4899" strokeWidth={stroke}
                        strokeDasharray={`${dashDama} ${dashCab}`}
                        strokeDashoffset="0" transform={`rotate(-90 ${cx} ${cy})`} />
                <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fontSize="10" fill="#6b7280">Total</text>
                <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">
                    {pctDama.toFixed(0)}% / {pctCab.toFixed(0)}%
                </text>
            </svg>
            <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded bg-pink-400 inline-block"/>Dama</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-600"><span className="w-3 h-3 rounded bg-indigo-400 inline-block"/>Caballero</span>
            </div>
        </div>
    );
}

export default function VentasCategoria({ porCategoria = [], comparativa = [], kpis = {}, filtros = {} }) {
    const [desde, setDesde] = useState(filtros.desde ?? '');
    const [hasta, setHasta] = useState(filtros.hasta ?? '');
    const [vista, setVista] = useState('ingresos'); // 'ingresos' | 'unidades'

    const aplicar = () => router.get('/reportes/ventas-categoria', { desde, hasta }, { preserveState: true });

    const colorFn = (d) => d.grupo === 'Dama' ? 'bg-pink-400' : d.grupo === 'Caballero' ? 'bg-indigo-400' : 'bg-gray-400';

    const dama      = comparativa.find(c => c.grupo === 'Dama') ?? {};
    const caballero = comparativa.find(c => c.grupo === 'Caballero') ?? {};

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
                                <h1 className="text-3xl font-light text-gray-900">Ventas por Categoría</h1>
                                <p className="mt-1 text-sm text-gray-500">Rendimiento por subcategoría y comparativa Dama vs Caballero</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                    {/* Filtros */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Desde</label>
                                <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 block mb-1">Hasta</label>
                                <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
                                       className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400" />
                            </div>
                            <div className="flex items-end">
                                <button onClick={aplicar}
                                        className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition">
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { label: 'Total ingresos',       value: fmt(kpis.total_ingresos),     color: 'text-gray-900'    },
                            { label: 'Unidades vendidas',    value: kpis.total_unidades ?? 0,      color: 'text-blue-600'    },
                            { label: 'Subcategoría top',     value: kpis.categoria_top,            color: 'text-pink-600', small: true },
                            { label: 'Ingresos Dama',        value: fmt(kpis.ingresos_dama),       color: 'text-pink-600'    },
                            { label: 'Ingresos Caballero',   value: fmt(kpis.ingresos_caballero),  color: 'text-indigo-600'  },
                        ].map(({ label, value, color, small }) => (
                            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                                <p className={`${small ? 'text-sm' : 'text-xl'} font-bold mt-2 ${color} truncate`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Gráfica barras + dona */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Barras horizontales */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Ranking de subcategorías</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Ordenado por mayor a menor</p>
                                </div>
                                <div className="flex rounded-lg overflow-hidden border border-gray-200">
                                    {[['ingresos', 'Ingresos'], ['unidades', 'Unidades']].map(([k, l]) => (
                                        <button key={k} onClick={() => setVista(k)}
                                                className={`px-3 py-1.5 text-xs font-medium transition ${vista === k ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <HBarChart data={porCategoria} valueKey={vista} colorFn={colorFn} />
                        </div>

                        {/* Dona Dama vs Caballero */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-1">Dama vs Caballero</h2>
                            <p className="text-xs text-gray-400 mb-5">Distribución de ingresos por género</p>
                            <DonaChart dama={kpis.ingresos_dama} caballero={kpis.ingresos_caballero} />
                            <div className="mt-6 space-y-3">
                                {comparativa.map(c => (
                                    <div key={c.grupo} className={`rounded-xl p-4 ${c.grupo === 'Dama' ? 'bg-pink-50' : 'bg-indigo-50'}`}>
                                        <p className={`text-sm font-semibold ${c.grupo === 'Dama' ? 'text-pink-700' : 'text-indigo-700'}`}>{c.grupo}</p>
                                        <p className={`text-lg font-bold mt-1 ${c.grupo === 'Dama' ? 'text-pink-600' : 'text-indigo-600'}`}>{fmt(c.ingresos)}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{c.unidades} unidades vendidas</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tabla ranking detallada */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold text-gray-900">Tabla completa por subcategoría</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['#', 'Subcategoría', 'Género', 'Productos', 'Unidades', 'Ingresos'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {porCategoria.map((cat, i) => (
                                    <tr key={cat.categoria} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm text-gray-400 font-medium">{i + 1}</td>
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{cat.categoria}</td>
                                        <td className="px-6 py-3">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.grupo === 'Dama' ? 'bg-pink-100 text-pink-700' : cat.grupo === 'Caballero' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {cat.grupo}
                                                </span>
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">{cat.productos}</td>
                                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">{cat.unidades}</td>
                                        <td className="px-6 py-3 text-sm font-bold text-pink-600">{fmt(cat.ingresos)}</td>
                                    </tr>
                                ))}
                                {porCategoria.length === 0 && (
                                    <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Sin ventas en el período seleccionado</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
