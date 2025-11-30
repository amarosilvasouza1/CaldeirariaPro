import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const CylinderInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="diameter">Diâmetro Interno (mm)</label>
                <input type="number" name="diameter" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="height">Altura (mm)</label>
                <input type="number" name="height" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura da Chapa (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
