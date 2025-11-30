import React, { useState, useRef, useEffect } from 'react';
import { SHAPE_INFO } from '../../utils/shapeInfo';

interface InfoPopoverProps {
    shapeId: string;
}

export const InfoPopover: React.FC<InfoPopoverProps> = ({ shapeId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const info = SHAPE_INFO[shapeId];

    const toggleOpen = () => setIsOpen(!isOpen);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!info) return null;

    return (
        <div className="info-popover-container" style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }} ref={popoverRef}>
            <button 
                onClick={toggleOpen}
                style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--accent)',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                    borderRadius: '50%',
                    transition: 'all 0.2s'
                }}
                title="Informações do Projeto"
            >
                ⓘ
            </button>

            {isOpen && (
                <div className="info-content" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    background: 'var(--bg-panel)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    zIndex: 100,
                    marginTop: '10px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{info.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.5' }}>
                        {info.description}
                    </p>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Aplicação:</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{info.application}</p>
                    </div>

                    <div>
                        <strong style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Parâmetros Essenciais:</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                            {info.keyParams.map((param, idx) => (
                                <li key={idx}>{param}</li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(45deg)',
                        width: '12px',
                        height: '12px',
                        background: 'var(--bg-panel)',
                        borderLeft: '1px solid var(--border)',
                        borderTop: '1px solid var(--border)'
                    }}></div>
                </div>
            )}
        </div>
    );
};
