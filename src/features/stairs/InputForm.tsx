import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const StairsInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="height">Altura Total (mm)</label>
                <input type="number" name="height" step="1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="base">Comprimento da Base (mm)</label>
                <input type="number" name="base" step="1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="width">Largura da Escada (mm)</label>
                <input type="number" name="width" step="1" onChange={handleChange} placeholder="800" defaultValue="800" />
            </div>
            <div className="form-group">
                <label htmlFor="steps">Número de Degraus</label>
                <input type="number" name="steps" step="1" onChange={handleChange} placeholder="12" defaultValue="12" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura Chapa (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
