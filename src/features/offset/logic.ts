import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateOffset = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const diameter = Number(data.diameter) || 0;
    const offset = Number(data.offset) || 0; // Deslocamento (altura)
    const run = Number(data.run) || 0; // Avanço (comprimento)
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Calculations
    // Travel (Diagonal) = sqrt(offset^2 + run^2)
    const travel = Math.sqrt(Math.pow(offset, 2) + Math.pow(run, 2));
    
    // Angle
    const angleRad = Math.atan2(offset, run);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    // Cut Angle (Mitre) relative to pipe axis
    // The cut angle is half the turn angle.
    // Turn angle = angleDeg.
    const cutAngle = angleDeg / 2;
    const cutAngleRad = (cutAngle * Math.PI) / 180;

    // Cut Back (Recuo)
    // Distance from the center cut line to the edge of the cut
    // Full Cut Back (Toe to Heel)
    const fullCutBack = diameter * Math.tan(cutAngleRad);

    // Weight & Area
    const circumference = Math.PI * diameter;
    const areaMm2 = circumference * travel;
    const areaM2 = areaMm2 / 1000000;
    const weight = (areaMm2 * thickness * density) / 1000000;

    // Volume Interno
    const radius = diameter / 2;
    const areaCrossMm2 = Math.PI * Math.pow(radius, 2);
    const volumeMm3 = areaCrossMm2 * travel;
    const volumeLiters = volumeMm3 / 1000000;

    return {
        metrics: {
            'Deslocamento (Set)': `${offset} mm`,
            'Avanço (Run)': `${run} mm`,
            'Diagonal (Travel)': `${travel.toFixed(1)} mm`,
            'Ângulo de Desvio': `${angleDeg.toFixed(2)}°`,
            'Ângulo de Corte': `${cutAngle.toFixed(2)}°`,
            'Recuo de Corte (Cut Back)': `${fullCutBack.toFixed(1)} mm`,
            'Área Superficial': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `1. PREPARAÇÃO:\n   - Material: Tubo de ${material === 'steel' ? 'Aço' : material}, Ø${diameter} mm, espessura ${thickness} mm.\n   - O objetivo é conectar dois tubos paralelos com um Deslocamento (Set) de ${offset} mm e um Avanço (Run) de ${run} mm.`,
            
            `2. CÁLCULO DA DIAGONAL (TRAVEL):\n   - A peça de conexão terá um comprimento total (ponta a ponta) de ${travel.toFixed(1)} mm.\n   - O ângulo de inclinação será de ${angleDeg.toFixed(2)}°.\n   - O ângulo de corte em cada ponta será de ${((angleDeg)/2).toFixed(2)}° (metade do ângulo de desvio).`,
            
            `3. TRAÇAGEM DO CORTE (CUT BACK):\n   - Marque o comprimento total (${travel.toFixed(1)} mm) no tubo.\n   - Em cada extremidade, você deve marcar o "Recuo de Corte" (Cut Back) de ${fullCutBack.toFixed(1)} mm.\n   - IMPORTANTE: Os cortes devem ser PARALELOS. Marque o recuo em lados opostos do tubo (defasados 180°).`,
            
            `4. CORTE:\n   - Realize o corte seguindo as marcações. Use uma cinta de traçagem (wrap-around) para ligar os pontos do recuo de forma suave.\n   - Remova as rebarbas e faça o chanfro se necessário.`,
            
            `5. MONTAGEM:\n   - Posicione a peça diagonal. Verifique se a altura vertical entre os centros dos tubos é exatamente ${offset} mm.\n   - Verifique se o avanço horizontal é de ${run} mm.\n   - Ponteie, confira o alinhamento e solde.`
        ],
        calculated: { diameter, offset, run, travel, angleDeg }
    };
};
