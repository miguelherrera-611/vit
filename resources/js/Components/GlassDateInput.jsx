// resources/js/Components/GlassDateInput.jsx
// Componente reutilizable: input de fecha con estilo glassmorphism
// Uso: <GlassDateInput label="Desde" value={desde} onChange={e => setDesde(e.target.value)} />

export default function GlassDateInput({ label, value, onChange, style = {} }) {
    return (
        <div style={{ flex: 1, minWidth: '130px', ...style }}>
            {label && (
                <label style={{
                    fontSize: '0.72rem', fontWeight: '600',
                    color: 'rgba(150,80,20,0.55)',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    display: 'block', marginBottom: '0.35rem',
                }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <input
                    type="date"
                    value={value}
                    onChange={onChange}
                    style={{
                        width: '100%',
                        padding: '0.6rem 2.2rem 0.6rem 0.9rem',
                        background: 'rgba(255,255,255,0.55)',
                        border: '1px solid rgba(200,140,80,0.22)',
                        borderRadius: '12px',
                        fontSize: '0.82rem',
                        color: value ? '#2d1a08' : 'rgba(180,100,30,0.45)',
                        fontFamily: 'Inter, sans-serif',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        boxShadow: '0 2px 8px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(12px)',
                        transition: 'all 0.18s',
                        // Quita el fondo del botón de calendario en webkit
                        colorScheme: 'light',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = 'rgba(185,28,28,0.35)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(185,28,28,0.07), inset 0 1px 0 rgba(255,255,255,0.8)';
                        e.target.style.background = 'rgba(255,255,255,0.75)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = 'rgba(200,140,80,0.22)';
                        e.target.style.boxShadow = '0 2px 8px rgba(180,90,20,0.06), inset 0 1px 0 rgba(255,255,255,0.75)';
                        e.target.style.background = 'rgba(255,255,255,0.55)';
                    }}
                />
                {/* Ícono de calendario decorativo */}
                <svg
                    style={{
                        position: 'absolute', right: '0.75rem', top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: 'rgba(150,80,20,0.45)',
                    }}
                    width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <rect x="3" y="4" width="18" height="18" rx="3" strokeWidth="1.8" strokeLinecap="round" />
                    <path strokeLinecap="round" strokeWidth="1.8" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
            </div>
        </div>
    );
}
