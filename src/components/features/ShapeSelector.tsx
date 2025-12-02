import React from 'react';
import { ShapeIcon } from '../icons/ShapeIcons';

interface ShapeSelectorProps {
    currentShape: string | null;
    onSelect: (shape: string) => void;
}

const shapes = [
    { id: 'cylinder', label: 'Cilindro', desc: 'Planificação de tubos e virolas cilíndricas.' },
    { id: 'cone', label: 'Cone', desc: 'Traçado de cones, reduções e funis.' },
    { id: 'square-to-round', label: 'Quadrado p/ Redondo', desc: 'Transição entre perfis quadrados e circulares.' },
    { id: 'elbow', label: 'Cotovelo Segmentado', desc: 'Curvas de gomos para tubulações industriais.' },
    { id: 'offset', label: 'Deslocamento', desc: 'Cálculo de desvios e "bayonetas" em tubos.' },
    { id: 'stairs', label: 'Escada Industrial', desc: 'Dimensionamento de degraus e inclinação.' },
    { id: 'bracket', label: 'Mão Francesa', desc: 'Suportes triangulares e reforços estruturais.' },
    { id: 'bolts', label: 'Parafusos', desc: 'Tabela de resistência e cargas de ruptura.' },
    { id: 'plate-weight', label: 'Peso de Chapas', desc: 'Calculadora de peso por material e dimensões.' },
    { id: 'volumes', label: 'Volumes e Áreas', desc: 'Cálculo de tanques, caixas e esferas.' },
    { id: 'pipe-branching', label: 'Boca de Lobo', desc: 'Traçagem de corte para derivação de tubos.' },
    { id: 'arc-calculator', label: 'Calc. de Arco', desc: 'Cálculo de raio, corda e flecha para calandragem.' },
];

const ShapeSelector: React.FC<ShapeSelectorProps> = ({ currentShape, onSelect }) => {
    return (
        <div className="shape-grid">
            {shapes.map((shape, index) => (
                <div 
                    key={shape.id}
                    className={`shape-card animate-fade-in ${currentShape === shape.id ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => onSelect(shape.id)}
                >
                    <div className="shape-icon-wrapper">
                        <ShapeIcon shapeId={shape.id} />
                    </div>
                    <div className="shape-content">
                        <div className="shape-title">{shape.label}</div>
                        <div className="shape-desc">{shape.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShapeSelector;
