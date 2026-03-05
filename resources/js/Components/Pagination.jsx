/**
 * Pagination.jsx — Componente reutilizable de paginación para VitaliStore
 * Glassmorphism water-drop style
 *
 * Props:
 *   currentPage  : número de página actual (1-based)
 *   totalItems   : total de items
 *   perPage      : items por página
 *   onPageChange : (page: number) => void
 *   accentColor  : 'blue'|'pink'|'green'|'indigo'|'orange'|'violet'|'red'
 */

const ACCENT_MAP = {
    blue:   { border: 'rgba(59,130,246,0.6)',  bg: 'rgba(59,130,246,0.1)',  text: 'rgba(29,78,216,0.9)',  shadow: 'rgba(59,130,246,0.18)'  },
    pink:   { border: 'rgba(236,72,153,0.6)',  bg: 'rgba(236,72,153,0.1)',  text: 'rgba(190,24,93,0.9)',  shadow: 'rgba(236,72,153,0.18)'  },
    green:  { border: 'rgba(16,185,129,0.6)',  bg: 'rgba(16,185,129,0.1)',  text: 'rgba(4,120,87,0.9)',   shadow: 'rgba(16,185,129,0.18)'  },
    indigo: { border: 'rgba(99,102,241,0.6)',  bg: 'rgba(99,102,241,0.1)',  text: 'rgba(67,56,202,0.9)',  shadow: 'rgba(99,102,241,0.18)'  },
    orange: { border: 'rgba(249,115,22,0.6)',  bg: 'rgba(249,115,22,0.1)',  text: 'rgba(194,65,12,0.9)',  shadow: 'rgba(249,115,22,0.18)'  },
    violet: { border: 'rgba(139,92,246,0.6)',  bg: 'rgba(139,92,246,0.1)',  text: 'rgba(109,40,217,0.9)', shadow: 'rgba(139,92,246,0.18)'  },
    red:    { border: 'rgba(220,38,38,0.6)',   bg: 'rgba(220,38,38,0.1)',   text: 'rgba(185,28,28,0.9)',  shadow: 'rgba(220,38,38,0.18)'   },
};

export default function Pagination({ currentPage, totalItems, perPage, onPageChange, accentColor = 'blue' }) {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, totalItems);
    const ac   = ACCENT_MAP[accentColor] || ACCENT_MAP.blue;

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

    const btnBase = {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '36px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.62)',
        borderRadius: '12px',
        fontSize: '0.82rem', fontWeight: '500',
        color: 'rgba(150,80,20,0.7)',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(180,90,20,0.05), inset 0 1px 0 rgba(255,255,255,0.72)',
        fontFamily: "'Inter', sans-serif",
    };

    const btnHover = {
        background: 'rgba(255,255,255,0.14)',
        borderColor: 'rgba(255,255,255,0.82)',
        color: 'rgba(120,50,10,0.9)',
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem', padding: '0 0.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(150,80,20,0.55)' }}>
                Mostrando{' '}
                <span style={{ fontWeight: '600', color: 'rgba(120,55,10,0.8)' }}>{from}–{to}</span>{' '}
                de{' '}
                <span style={{ fontWeight: '600', color: 'rgba(120,55,10,0.8)' }}>{totalItems}</span>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                {/* Anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        ...btnBase,
                        padding: '0 0.85rem',
                        gap: '0.3rem',
                        opacity: currentPage === 1 ? 0.35 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span style={{ display: 'none' }}>Anterior</span>
                </button>

                {getPages().map((page, i) =>
                    page === '...' ? (
                        <span key={`e${i}`} style={{ width: '36px', textAlign: 'center', color: 'rgba(150,80,20,0.4)', fontSize: '0.82rem' }}>···</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            style={{
                                ...btnBase,
                                width: '36px',
                                ...(page === currentPage ? {
                                    background: ac.bg,
                                    border: `1px solid ${ac.border}`,
                                    color: ac.text,
                                    boxShadow: `0 4px 14px ${ac.shadow}, inset 0 1px 0 rgba(255,255,255,0.5)`,
                                    fontWeight: '600',
                                } : {}),
                            }}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                        ...btnBase,
                        padding: '0 0.85rem',
                        gap: '0.3rem',
                        opacity: currentPage === totalPages ? 0.35 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                >
                    <span style={{ display: 'none' }}>Siguiente</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
