import type { CalcResult, ShapeData } from '../../types';

export const calculateArc = (inputs: ShapeData): CalcResult => {
    const chord = Number(inputs.chord) || 0; // Corda
    const sagitta = Number(inputs.sagitta) || 0; // Flecha (Altura)
    
    // Alternative inputs could be Radius + Angle, but Chord + Sagitta is most common for rolling
    
    if (chord <= 0 || sagitta <= 0) {
        return {
            metrics: {},
            steps: [],
            calculated: {}
        };
    }

    // Calculate Radius
    // R = (c^2 + 4h^2) / 8h
    const radius = (Math.pow(chord, 2) + 4 * Math.pow(sagitta, 2)) / (8 * sagitta);
    
    // Calculate Angle (theta) in radians
    // theta = 2 * arcsin(c / 2R)
    // Clamp value for asin to [-1, 1] to avoid NaN due to float precision
    const asinArg = Math.min(1, Math.max(-1, chord / (2 * radius)));
    const angleRad = 2 * Math.asin(asinArg);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    // Calculate Arc Length (Perimeter)
    const arcLength = radius * angleRad;

    return {
        metrics: {
            'Raio Calculado (R)': `${radius.toFixed(1)} mm`,
            'Perímetro do Arco': `${arcLength.toFixed(1)} mm`,
            'Ângulo de Abertura': `${angleDeg.toFixed(1)}°`,
            'Corda (C)': `${chord} mm`,
            'Flecha (h)': `${sagitta} mm`
        },
        steps: [
            `1. RAIO:\n   - O raio necessário para calandrar esta peça é de ${radius.toFixed(1)} mm.`,
            `2. COMPRIMENTO MATERIAL:\n   - Corte a chapa com o comprimento de ${arcLength.toFixed(1)} mm.`,
            `3. CONFERÊNCIA:\n   - Após calandrar, verifique se a corda mede ${chord} mm e a altura (flecha) mede ${sagitta} mm.`
        ],
        calculated: {
            radius,
            arcLength,
            angleDeg,
            chord,
            sagitta
        }
    };
};
