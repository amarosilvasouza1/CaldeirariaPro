import React, { useEffect } from 'react';

interface VolumesInputProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const VolumesInput: React.FC<VolumesInputProps> = ({ handleChange }) => {
    // Default to cylinder on mount if not set? 
    // Actually InputPanel handles state, but we need to ensure subShape is set.
    // We can use a useEffect to set default subShape if needed, but let's rely on the user selecting or default in logic.
    
    // We need to handle subShape change to update the UI immediately? 
    // The parent InputPanel updates state on change, so re-render will happen.
    // But we need to know the current subShape to render correct inputs.
    // Since we don't receive formData here, we have to manage local state for the dropdown 
    // OR ask InputPanel to pass formData. 
    // Refactoring InputPanel to pass formData would be best, but for now let's use a local state 
    // that syncs with the parent via handleChange.
    
    const [subShape, setSubShape] = React.useState('cylinder');

    const handleSubShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubShape(e.target.value);
        handleChange(e);
    };

    useEffect(() => {
        // Initialize parent state
        // Create a synthetic event or just call the handler if it accepted a simple object, but it expects an event.
        // We can cast to unknown then to the expected type to satisfy TS.
        const event = {
            target: { name: 'subShape', value: 'cylinder' }
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        
        handleChange(event);
    }, [handleChange]);

    return (
        <>
            <div className="form-group">
                <label htmlFor="subShape">Tipo de Forma</label>
                <select name="subShape" id="subShape" value={subShape} onChange={handleSubShapeChange}>
                    <option value="cylinder">Tanque Cilíndrico</option>
                    <option value="box">Caixa / Retângulo</option>
                    <option value="sphere">Esfera</option>
                    <option value="cone">Cone</option>
                    <option value="pyramid">Pirâmide (Base Retangular)</option>
                </select>
            </div>

            {(subShape === 'cylinder' || subShape === 'cone') && (
                <>
                    <div className="form-group">
                        <label htmlFor="diameter">Diâmetro (mm)</label>
                        <input type="number" name="diameter" id="diameter" onChange={handleChange} placeholder="Ex: 1000" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">Altura (mm)</label>
                        <input type="number" name="height" id="height" onChange={handleChange} placeholder="Ex: 2000" />
                    </div>
                </>
            )}

            {(subShape === 'box' || subShape === 'pyramid') && (
                <>
                    <div className="form-group">
                        <label htmlFor="length">Comprimento (mm)</label>
                        <input type="number" name="length" id="length" onChange={handleChange} placeholder="Ex: 2000" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="width">Largura (mm)</label>
                        <input type="number" name="width" id="width" onChange={handleChange} placeholder="Ex: 1000" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="height">Altura (mm)</label>
                        <input type="number" name="height" id="height" onChange={handleChange} placeholder="Ex: 500" />
                    </div>
                </>
            )}

            {subShape === 'sphere' && (
                <div className="form-group">
                    <label htmlFor="diameter">Diâmetro (mm)</label>
                    <input type="number" name="diameter" id="diameter" onChange={handleChange} placeholder="Ex: 1000" />
                </div>
            )}
        </>
    );
};
