import { useState, useEffect } from 'react';

const STYLES = `
    @keyframes modalIn {
        from { opacity:0; transform:translateY(20px) scale(0.96); }
        to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes overlayIn {
        from { opacity:0; }
        to   { opacity:1; }
    }

    .pwd-overlay {
        position: fixed; inset: 0; z-index: 200;
        display: flex; align-items: center; justify-content: center; padding: 1rem;
        background: rgba(30,10,0,0.38);
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        animation: overlayIn 0.2s ease both;
    }

    .pwd-modal {
        width: 100%; max-width: 420px;
        background: rgba(255,250,245,0.88);
        backdrop-filter: blur(40px) saturate(180%); -webkit-backdrop-filter: blur(40px) saturate(180%);
        border: 1px solid rgba(255,255,255,0.82);
        border-radius: 28px;
        padding: 2.25rem 2rem 2rem;
        box-shadow:
            0 24px 64px rgba(180,50,10,0.16),
            0 8px 24px rgba(180,50,10,0.08),
            inset 0 1.5px 0 rgba(255,255,255,0.95),
            inset 0 -1px 0 rgba(180,90,20,0.04);
        position: relative; overflow: hidden;
        animation: modalIn 0.28s cubic-bezier(0.16,1,0.3,1) both;
    }
    .pwd-modal::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.98) 25%, rgba(255,255,255,0.98) 75%, transparent);
        pointer-events: none;
    }

    /* Ícono */
    .pwd-icon-wrap {
        width: 60px; height: 60px; border-radius: 20px;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 1.5rem;
        position: relative;
    }
    .pwd-icon-wrap.danger {
        background: rgba(220,38,38,0.08);
        border: 1px solid rgba(220,38,38,0.2);
        box-shadow: 0 8px 24px rgba(220,38,38,0.10);
    }
    .pwd-icon-wrap.safe {
        background: rgba(16,185,129,0.08);
        border: 1px solid rgba(16,185,129,0.2);
        box-shadow: 0 8px 24px rgba(16,185,129,0.10);
    }

    /* Textos */
    .pwd-title {
        font-size: 1.05rem; font-weight: 600; color: #2d1a08;
        text-align: center; margin-bottom: 0.45rem;
        letter-spacing: -0.02em; line-height: 1.35;
        font-family: 'Inter', sans-serif;
    }
    .pwd-desc {
        font-size: 0.8rem; color: rgba(120,60,10,0.62);
        text-align: center; margin-bottom: 1.75rem; line-height: 1.55;
        font-family: 'Inter', sans-serif;
    }

    /* Label */
    .pwd-label {
        display: block; font-size: 0.7rem; font-weight: 700;
        color: rgba(150,80,20,0.65); text-transform: uppercase;
        letter-spacing: 0.09em; margin-bottom: 0.45rem;
        font-family: 'Inter', sans-serif;
    }

    /* Input */
    .pwd-input-wrap { position: relative; margin-bottom: 0.4rem; }
    .pwd-input {
        width: 100%; padding: 0.8rem 2.8rem 0.8rem 1rem;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(200,140,80,0.38);
        border-radius: 14px;
        font-size: 0.9rem; color: #2d1a08;
        font-family: 'Inter', sans-serif;
        outline: none; transition: all 0.2s;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);
        box-sizing: border-box;
    }
    .pwd-input::placeholder { color: rgba(180,100,30,0.38); }
    .pwd-input:focus {
        background: rgba(255,255,255,0.16);
        border-color: rgba(200,140,80,0.65);
        box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.88);
    }
    .pwd-input.error {
        border-color: rgba(220,38,38,0.45);
        box-shadow: 0 0 0 3px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.78);
    }

    /* Toggle show */
    .pwd-toggle {
        position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
        background: none; border: none; cursor: pointer; padding: 0;
        color: rgba(150,80,20,0.45); transition: color 0.15s;
        display: flex; align-items: center;
    }
    .pwd-toggle:hover { color: rgba(120,50,10,0.8); }

    /* Error msg */
    .pwd-error {
        font-size: 0.74rem; color: rgba(185,28,28,0.88); font-weight: 500;
        margin-top: 0.35rem; margin-bottom: 1rem;
        display: flex; align-items: center; gap: 0.3rem;
        font-family: 'Inter', sans-serif;
    }

    /* Divider */
    .pwd-divider {
        height: 1px; margin: 1.25rem 0 1.5rem;
        background: linear-gradient(90deg, transparent, rgba(200,140,80,0.18) 30%, rgba(200,140,80,0.18) 70%, transparent);
    }

    /* Buttons */
    .pwd-btn-row { display: flex; gap: 0.75rem; }

    .pwd-btn-cancel {
        flex: 1; padding: 0.78rem 1rem; border-radius: 13px;
        font-size: 0.85rem; font-weight: 500;
        background: rgba(255,255,255,0.06); border: 1px solid rgba(200,140,80,0.28);
        color: rgba(120,60,10,0.72); cursor: pointer;
        font-family: 'Inter', sans-serif; transition: all 0.18s;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.65);
    }
    .pwd-btn-cancel:hover:not(:disabled) {
        background: rgba(255,255,255,0.14); color: rgba(90,40,5,0.9);
    }
    .pwd-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

    .pwd-btn-confirm {
        flex: 1; padding: 0.78rem 1rem; border-radius: 13px;
        font-size: 0.85rem; font-weight: 600;
        cursor: pointer; font-family: 'Inter', sans-serif;
        transition: all 0.18s; position: relative; overflow: hidden;
    }
    .pwd-btn-confirm::after {
        content: '';
        position: absolute; top: 0; left: -120%; width: 80%; height: 100%;
        background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%);
        transition: left 0.5s ease; pointer-events: none;
    }
    .pwd-btn-confirm:hover:not(:disabled)::after { left: 130%; }

    .pwd-btn-confirm.danger {
        background: rgba(220,38,38,0.11); border: 1px solid rgba(220,38,38,0.40);
        color: rgba(185,28,28,0.95);
        box-shadow: 0 4px 14px rgba(220,38,38,0.10), inset 0 1px 0 rgba(255,120,120,0.25);
    }
    .pwd-btn-confirm.danger:hover:not(:disabled) {
        background: rgba(220,38,38,0.18); transform: translateY(-1px);
        box-shadow: 0 8px 22px rgba(220,38,38,0.15);
    }
    .pwd-btn-confirm.safe {
        background: rgba(16,185,129,0.09); border: 1px solid rgba(16,185,129,0.35);
        color: rgba(4,120,87,0.95);
        box-shadow: 0 4px 14px rgba(16,185,129,0.08), inset 0 1px 0 rgba(100,220,160,0.25);
    }
    .pwd-btn-confirm.safe:hover:not(:disabled) {
        background: rgba(16,185,129,0.16); transform: translateY(-1px);
    }
    .pwd-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

    .pwd-spinner {
        display: inline-block; width: 14px; height: 14px;
        border: 2px solid rgba(185,28,28,0.25); border-top-color: rgba(185,28,28,0.9);
        border-radius: 50%; animation: spin 0.7s linear infinite;
        vertical-align: middle; margin-right: 6px;
    }
    .pwd-spinner.safe-spin {
        border-color: rgba(4,120,87,0.25); border-top-color: rgba(4,120,87,0.9);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function PasswordConfirmModal({
                                                 open,
                                                 onClose,
                                                 onConfirm,
                                                 title        = '¿Confirmar acción?',
                                                 description  = 'Esta acción requiere tu contraseña.',
                                                 danger       = true,
                                                 confirmLabel = 'Confirmar',
                                                 processing   = false,
                                                 error        = null,
                                             }) {
    const [password, setPassword] = useState('');
    const [show, setShow]         = useState(false);

    // Limpiar al abrir/cerrar
    useEffect(() => {
        if (!open) { setPassword(''); setShow(false); }
    }, [open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password.trim()) return;
        onConfirm(password);
    };

    const handleClose = () => {
        setPassword('');
        setShow(false);
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <style>{STYLES}</style>

            <div className="pwd-overlay" onClick={handleClose}>
                <div className="pwd-modal" onClick={e => e.stopPropagation()}>

                    {/* Ícono */}
                    <div className={`pwd-icon-wrap ${danger ? 'danger' : 'safe'}`}>
                        {danger ? (
                            <svg width="26" height="26" fill="none" stroke="rgba(185,28,28,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            </svg>
                        ) : (
                            <svg width="26" height="26" fill="none" stroke="rgba(4,120,87,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        )}
                    </div>

                    {/* Título y descripción */}
                    <p className="pwd-title">{title}</p>
                    <p className="pwd-desc">{description}</p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit}>
                        <label className="pwd-label">Contraseña</label>
                        <div className="pwd-input-wrap">
                            <input
                                type={show ? 'text' : 'password'}
                                className={`pwd-input${error ? ' error' : ''}`}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                autoFocus
                                autoComplete="current-password"
                            />
                            <button type="button" className="pwd-toggle" tabIndex={-1} onClick={() => setShow(!show)}>
                                {show ? (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && (
                            <p className="pwd-error">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                                </svg>
                                {error}
                            </p>
                        )}

                        <div className="pwd-divider" />

                        <div className="pwd-btn-row">
                            <button type="button" className="pwd-btn-cancel" disabled={processing} onClick={handleClose}>
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`pwd-btn-confirm ${danger ? 'danger' : 'safe'}`}
                                disabled={processing || !password.trim()}
                            >
                                {processing ? (
                                    <>
                                        <span className={`pwd-spinner${!danger ? ' safe-spin' : ''}`} />
                                        Verificando...
                                    </>
                                ) : confirmLabel}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
