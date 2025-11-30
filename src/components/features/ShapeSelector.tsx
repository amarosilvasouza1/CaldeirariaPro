import React from 'react';

interface ShapeSelectorProps {
    currentShape: string | null;
    onSelect: (shape: string) => void;
}

const shapes = [
    { id: 'cylinder', label: 'Cilindro', icon: '🛢️', desc: 'Planificação de tubos e virolas cilíndricas.' },
    { id: 'cone', label: 'Cone', icon: 'A', desc: 'Traçado de cones, reduções e funis.' }, // Using 'A' as cone-like icon or replace with SVG
    { id: 'square-to-round', label: 'Quadrado p/ Redondo', icon: '⏹️', desc: 'Transição entre perfis quadrados e circulares.' },
    { id: 'elbow', label: 'Cotovelo Segmentado', icon: '⤵️', desc: 'Curvas de gomos para tubulações industriais.' },
    { id: 'offset', label: 'Deslocamento', icon: '⚡', desc: 'Cálculo de desvios e "bayonetas" em tubos.' },
    { id: 'stairs', label: 'Escada Industrial', icon: '🪜', desc: 'Dimensionamento de degraus e inclinação.' },
    { id: 'bracket', label: 'Mão Francesa', icon: '📐', desc: 'Suportes triangulares e reforços estruturais.' },
    { id: 'bolts', label: 'Parafusos', icon: '🔩', desc: 'Tabela de resistência e cargas de ruptura.' },
    { id: 'plate-weight', label: 'Peso de Chapas', icon: '⚖️', desc: 'Calculadora de peso por material e dimensões.' },
    { id: 'volumes', label: 'Volumes e Áreas', icon: '🧊', desc: 'Cálculo de tanques, caixas e esferas.' },
];

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ currentShape, onSelect }) => {
    // If a shape is selected, we might want to show a compact version or nothing (handled by App)
    // But for the "Home" view, we show the grid.
    
    return (
        <div className="shape-grid">
            {shapes.map((shape, index) => (
                <div 
                    key={shape.id}
                    className={`shape-card animate-fade-in ${currentShape === shape.id ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => onSelect(shape.id)}
                >
                    <div className="shape-icon">{shape.icon}</div>
                    <div className="shape-title">{shape.label}</div>
                    <div className="shape-desc">{shape.desc}</div>
                </div>
            ))}
        </div>
    );
};

export default ShapeSelector;
