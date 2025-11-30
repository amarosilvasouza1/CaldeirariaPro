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
        <div className="info-popover-container" ref={popoverRef}>
            <button 
                className="info-trigger"
                onClick={toggleOpen}
                title="Informações do Projeto"
            >
                ⓘ
            </button>

            {isOpen && (
                <>
                    <div className="info-overlay" onClick={() => setIsOpen(false)} />
                    <div className="info-content">
                        <h4>{info.title}</h4>
                        <p className="info-description">
                            {info.description}
                        </p>
                        
                        <div className="info-section">
                            <strong>Aplicação:</strong>
                            <p>{info.application}</p>
                        </div>

                        <div className="info-section">
                            <strong>Parâmetros Essenciais:</strong>
                            <ul>
                                {info.keyParams.map((param, idx) => (
                                    <li key={idx}>{param}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="info-arrow"></div>
                    </div>
                </>
            )}
        </div>
    );
};
