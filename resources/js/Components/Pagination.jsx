/**
 * Pagination.jsx — Componente reutilizable de paginación para VitaliStore
 *
 * Props:
 *   currentPage  : número de página actual (1-based)
 *   totalItems   : total de items
 *   perPage      : items por página
 *   onPageChange : (page: number) => void
 *   accentColor  : 'blue'|'pink'|'green'|'indigo'|'orange'|'violet'
 */
export default function Pagination({ currentPage, totalItems, perPage, onPageChange, accentColor = 'blue' }) {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, totalItems);

    const getPages = () => {
        const pages = [];
        const delta = 1;
        const left  = Math.max(1, currentPage - delta);
        const right = Math.min(totalPages, currentPage + delta);
        if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }
        return pages;
    };

    const activeClasses = {
        blue:   'bg-blue-600 border-blue-600 text-white shadow-sm',
        pink:   'bg-pink-600 border-pink-600 text-white shadow-sm',
        green:  'bg-green-600 border-green-600 text-white shadow-sm',
        indigo: 'bg-indigo-600 border-indigo-600 text-white shadow-sm',
        orange: 'bg-orange-600 border-orange-600 text-white shadow-sm',
        violet: 'bg-violet-600 border-violet-600 text-white shadow-sm',
    };
    const activeClass = activeClasses[accentColor] || activeClasses.blue;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
                Mostrando{' '}
                <span className="font-semibold text-gray-700">{from}–{to}</span>{' '}
                de{' '}
                <span className="font-semibold text-gray-700">{totalItems}</span>
            </p>

            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl bg-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                {getPages().map((page, i) =>
                    page === '...' ? (
                        <span key={`e${i}`} className="w-9 text-center text-gray-400 text-sm select-none">···</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 text-sm font-medium rounded-xl border transition ${
                                page === currentPage
                                    ? activeClass
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl bg-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
