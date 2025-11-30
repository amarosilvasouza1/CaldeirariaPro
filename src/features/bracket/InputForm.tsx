import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const BracketInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="height">Altura (Vertical) (mm)</label>
                <input type="number" name="height" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="base">Base (Horizontal) (mm)</label>
                <input type="number" name="base" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="width">Largura do Perfil (mm)</label>
                <input type="number" name="width" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="load">Carga Aplicada (kg)</label>
                <input type="number" name="load" step="1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="safetyFactor">Fator de Segurança</label>
                <input type="number" name="safetyFactor" step="0.1" onChange={handleChange} placeholder="2.0" defaultValue="2.0" />
            </div>
        </>
    );
};
