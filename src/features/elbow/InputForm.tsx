import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ElbowInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="diameter">Diâmetro do Tubo (mm)</label>
                <input type="number" name="diameter" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="radius">Raio da Curva (mm)</label>
                <input type="number" name="radius" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
            <div className="form-group">
                <label htmlFor="angle">Ângulo da Curva (°)</label>
                <input type="number" name="angle" step="0.1" onChange={handleChange} placeholder="90" defaultValue="90" />
            </div>
            <div className="form-group">
                <label htmlFor="segments">Número de Gomos</label>
                <input type="number" name="segments" step="1" onChange={handleChange} placeholder="3" defaultValue="3" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura (mm)</label>
                <input type="number" name="thickness" step="0.1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
