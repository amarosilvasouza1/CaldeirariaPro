import React from 'react';

interface Props {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ArcCalculatorInput: React.FC<Props> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="chord">Corda (mm)</label>
                <input type="number" name="chord" onChange={handleChange} placeholder="Ex: 1000" />
            </div>
            <div className="form-group">
                <label htmlFor="sagitta">Flecha / Altura (mm)</label>
                <input type="number" name="sagitta" onChange={handleChange} placeholder="Ex: 100" />
            </div>
        </>
    );
};
