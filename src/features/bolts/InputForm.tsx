import React from 'react';

interface InputFormProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const BoltsInput: React.FC<InputFormProps> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="diameterStr">Diâmetro Nominal</label>
                <select name="diameterStr" onChange={handleChange} defaultValue="M12">
                    <option value="M6">M6</option>
                    <option value="M8">M8</option>
                    <option value="M10">M10</option>
                    <option value="M12">M12</option>
                    <option value="M16">M16</option>
                    <option value="M20">M20</option>
                    <option value="M24">M24</option>
                    <option value="M30">M30</option>
                    <option value="M36">M36</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="boltClass">Classe de Resistência</label>
                <select name="boltClass" onChange={handleChange} defaultValue="8.8">
                    <option value="4.6">4.6 (Aço Baixo Carbono)</option>
                    <option value="5.8">5.8 (Aço Baixo Carbono)</option>
                    <option value="8.8">8.8 (Aço Médio Carbono)</option>
                    <option value="10.9">10.9 (Aço Liga)</option>
                    <option value="12.9">12.9 (Alta Resistência)</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="count">Quantidade de Parafusos</label>
                <input type="number" name="count" step="1" onChange={handleChange} placeholder="1" defaultValue="1" />
            </div>
            <div className="form-group">
                <label htmlFor="load">Carga Total (kg)</label>
                <input type="number" name="load" step="1" onChange={handleChange} placeholder="0" />
            </div>
        </>
    );
};
