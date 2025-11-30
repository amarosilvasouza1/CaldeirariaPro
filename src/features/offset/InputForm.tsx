import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const OffsetInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="diameter">Diâmetro do Tubo (mm)</label>
                <input type="number" name="diameter" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="offset">Deslocamento (Set) (mm)</label>
                <input type="number" name="offset" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="run">Avanço (Run) (mm)</label>
                <input type="number" name="run" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
