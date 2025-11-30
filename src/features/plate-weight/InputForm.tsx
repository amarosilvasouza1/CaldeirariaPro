import React from 'react';

interface PlateWeightInputProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const PlateWeightInput: React.FC<PlateWeightInputProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="width">Largura (mm)</label>
                <input type="number" name="width" id="width" onChange={handleChange} placeholder="Ex: 1000" />
            </div>
            <div className="form-group">
                <label htmlFor="length">Comprimento (mm)</label>
                <input type="number" name="length" id="length" onChange={handleChange} placeholder="Ex: 2000" />
            </div>
            <div className="form-group">
                <label htmlFor="thickness">Espessura (mm)</label>
                <input type="number" name="thickness" id="thickness" onChange={handleChange} placeholder="Ex: 6.35" />
            </div>
            <div className="form-group">
                <label htmlFor="quantity">Quantidade (pçs)</label>
                <input type="number" name="quantity" id="quantity" onChange={handleChange} placeholder="1" defaultValue="1" />
            </div>
        </>
    );
};
