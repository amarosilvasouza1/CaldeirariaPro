import React from 'react';

interface Props {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PipeBranchingInput: React.FC<Props> = ({ handleChange }) => {
    return (
        <>
            <div className="form-group">
                <label htmlFor="headerDiameter">Ø Tubo Principal (mm)</label>
                <input type="number" name="headerDiameter" onChange={handleChange} placeholder="Ex: 100" />
            </div>
            <div className="form-group">
                <label htmlFor="branchDiameter">Ø Derivação (mm)</label>
                <input type="number" name="branchDiameter" onChange={handleChange} placeholder="Ex: 50" />
            </div>
            <div className="form-group">
                <label htmlFor="angle">Ângulo (°)</label>
                <input type="number" name="angle" onChange={handleChange} placeholder="Ex: 90" />
            </div>
        </>
    );
};
