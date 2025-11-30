import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const SquareToRoundInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="width">Largura da Base (mm)</label>
                <input type="number" name="width" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="diameter">Diâmetro Topo (mm)</label>
                <input type="number" name="diameter" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="height">Altura (mm)</label>
                <input type="number" name="height" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
