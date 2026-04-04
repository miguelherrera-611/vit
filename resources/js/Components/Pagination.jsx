/**
 * Pagination.jsx — Componente reutilizable de paginación para VitaliStore
 *
 * Props:
 *   currentPage  : número de página actual (1-based)
 *   totalItems   : total de items
 *   perPage      : items por página
 *   onPageChange : (page: number) => void
 *   accentColor  : 'red'|'green'|'blue'|'amber'|'violet'  (opcional, default 'red')
 */

const ACCENT_MAP = {
    red:    { bg:'rgba(185,28,28,0.08)',  border:'rgba(185,28,28,0.25)',  color:'rgba(185,28,28,0.9)'  },
    green:  { bg:'rgba(16,185,129,0.08)', border:'rgba(16,185,129,0.25)', color:'rgba(4,120,87,0.9)'   },
    blue:   { bg:'rgba(59,130,246,0.08)', border:'rgba(59,130,246,0.25)', color:'rgba(29,78,216,0.9)'  },
    amber:  { bg:'rgba(245,158,11,0.08)', border:'rgba(245,158,11,0.28)', color:'rgba(146,64,14,0.9)'  },
    violet: { bg:'rgba(139,92,246,0.08)', border:'rgba(139,92,246,0.25)', color:'rgba(109,40,217,0.9)' },
};

export default function Pagination({ currentPage, totalItems, perPage, onPageChange, accentColor = 'red' }) {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, totalItems);
    const ac   = ACCENT_MAP[accentColor] || ACCENT_MAP.red;

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

    const base = {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '32px',
        background: 'rgba(255,255,255,0.45)',
        border: '1px solid rgba(200,140,80,0.14)',
        borderRadius: '8px',
        fontSize: '0.78rem', fontWeight: '400',
        color: 'rgba(120,60,10,0.65)',
        cursor: 'pointer',
        transition: 'all 0.13s ease',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.01em',
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginTop: '1.5rem',
            padding: '0 0.1rem',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Contador */}
            <p style={{ fontSize: '0.76rem', color: 'rgba(150,80,20,0.48)', margin: 0 }}>
                Mostrando{' '}
                <span style={{ fontWeight: '500', color: 'rgba(120,55,10,0.75)' }}>{from}–{to}</span>
                {' '}de{' '}
                <span style={{ fontWeight: '500', color: 'rgba(120,55,10,0.75)' }}>{totalItems}</span>
            </p>

            {/* Botones */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>

                {/* Anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                        ...base,
                        padding: '0 0.75rem',
                        opacity: currentPage === 1 ? 0.35 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (currentPage !== 1) Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.72)', borderColor:'rgba(200,140,80,0.25)' }); }}
                    onMouseLeave={e => { Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.45)', borderColor:'rgba(200,140,80,0.14)' }); }}
                >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>

                {/* Páginas */}
                {getPages().map((page, i) =>
                    page === '...' ? (
                        <span key={`e${i}`} style={{
                            width: '32px', textAlign: 'center',
                            color: 'rgba(150,80,20,0.35)', fontSize: '0.76rem',
                        }}>
                            ···
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            style={{
                                ...base,
                                width: '32px',
                                fontWeight: page === currentPage ? '600' : '400',
                                ...(page === currentPage ? {
                                    background: ac.bg,
                                    border: `1px solid ${ac.border}`,
                                    color: ac.color,
                                } : {}),
                            }}
                            onMouseEnter={e => { if (page !== currentPage) Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.72)', borderColor:'rgba(200,140,80,0.25)' }); }}
                            onMouseLeave={e => { if (page !== currentPage) Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.45)', borderColor:'rgba(200,140,80,0.14)' }); }}
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
                        ...base,
                        padding: '0 0.75rem',
                        opacity: currentPage === totalPages ? 0.35 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (currentPage !== totalPages) Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.72)', borderColor:'rgba(200,140,80,0.25)' }); }}
                    onMouseLeave={e => { Object.assign(e.currentTarget.style, { background:'rgba(255,255,255,0.45)', borderColor:'rgba(200,140,80,0.14)' }); }}
                >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
