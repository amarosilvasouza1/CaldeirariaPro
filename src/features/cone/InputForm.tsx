import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ConeInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="d1">Diâmetro Maior (mm)</label>
                <input type="number" name="d1" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="d2">Diâmetro Menor (mm)</label>
                <input type="number" name="d2" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="height">Altura Vertical (mm)</label>
                <input type="number" name="height" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura da Chapa (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
