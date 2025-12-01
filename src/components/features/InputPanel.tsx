import React, { useState, useEffect } from 'react';
import type { ShapeData } from '../../types';
import { CylinderInput } from '../../features/cylinder/InputForm';
import { ConeInput } from '../../features/cone/InputForm';
import { SquareToRoundInput } from '../../features/square-to-round/InputForm';
import { ElbowInput } from '../../features/elbow/InputForm';
import { OffsetInput } from '../../features/offset/InputForm';
import { StairsInput } from '../../features/stairs/InputForm';
import { BracketInput } from '../../features/bracket/InputForm';
import { BoltsInput } from '../../features/bolts/InputForm';
import { PlateWeightInput } from '../../features/plate-weight/InputForm';
import { VolumesInput } from '../../features/volumes/InputForm';
import { PipeBranchingInput } from '../../features/pipe-branching/InputForm';
import { ArcCalculatorInput } from '../../features/arc-calculator/InputForm';

interface InputPanelProps {
    shape: string;
    onCalculate: (data: ShapeData, material: string) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ shape, onCalculate }) => {
    const [formData, setFormData] = useState<ShapeData>({});
    const [material, setMaterial] = useState('steel');

    // Trigger calculation whenever formData or material changes
    useEffect(() => {
        // Only calculate if we have some data to avoid empty state errors or weird initial states
        if (Object.keys(formData).length > 0) {
            onCalculate(formData, material);
        }
    }, [formData, material, onCalculate]);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // If changing sub-shape (e.g. in Volumes), reset other data to avoid mixing inputs
        if (name === 'subShape') {
            setFormData({ [name]: value });
            return;
        }

        let parsedValue: string | number = value;
        if (name !== 'diameterStr' && name !== 'boltClass' && name !== 'subShape') {
             parsedValue = parseFloat(value) || 0;
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    }, []);

    const renderInputs = () => {
        switch (shape) {
            case 'cylinder':
                return <CylinderInput handleChange={handleChange} />;
            case 'cone':
                return <ConeInput handleChange={handleChange} />;
            case 'square-to-round':
                return <SquareToRoundInput handleChange={handleChange} />;
            case 'elbow':
                return <ElbowInput handleChange={handleChange} />;
            case 'offset':
                return <OffsetInput handleChange={handleChange} />;
            case 'stairs':
                return <StairsInput handleChange={handleChange} />;
            case 'bracket':
                return <BracketInput handleChange={handleChange} />;
            case 'bolts':
                return <BoltsInput handleChange={handleChange} />;
            case 'plate-weight':
                return <PlateWeightInput handleChange={handleChange} />;
            case 'volumes':
                return <VolumesInput handleChange={handleChange} />;
            case 'pipe-branching':
                return <PipeBranchingInput handleChange={handleChange} />;
            case 'arc-calculator':
                return <ArcCalculatorInput handleChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <section className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Parâmetros</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                {renderInputs()}
                
                <div className="form-group">
                    <label htmlFor="material">Material</label>
                    <select name="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
                        <option value="steel">Aço Carbono</option>
                        <option value="galvanized">Aço Galvanizado</option>
                        <option value="stainless">Aço Inox</option>
                        <option value="aluminum">Alumínio</option>
                        <option value="copper">Cobre</option>
                        <option value="brass">Latão</option>
                        <option value="bronze">Bronze</option>
                        <option value="cast_iron">Ferro Fundido</option>
                        <option value="nylon">Nylon</option>
                    </select>
                </div>
            </form>
        </section>
    );
};

export default InputPanel;
