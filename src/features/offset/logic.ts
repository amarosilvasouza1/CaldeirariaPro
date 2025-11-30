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
            `PREPARAÇÃO: Selecione um tubo de ${material === 'steel' ? 'Aço' : material} com diâmetro de ${diameter} mm e espessura de ${thickness} mm.`,
            `CÁLCULO: A peça diagonal (Travel) deve ter comprimento total de ${travel.toFixed(1)} mm (ponta a ponta).`,
            `TRAÇAGEM: Marque o comprimento de ${travel.toFixed(1)} mm. Nas extremidades, marque o Recuo de Corte de ${fullCutBack.toFixed(1)} mm em lados opostos (180°).`,
            `CORTE: Realize o corte em ângulo de ${cutAngle.toFixed(2)}° nas duas pontas. Os cortes devem ser paralelos entre si.`,
            `MONTAGEM: Posicione a peça diagonal entre os tubos a serem conectados. O deslocamento deve casar perfeitamente com ${offset} mm de altura e ${run} mm de avanço.`,
            `SOLDAGEM: Ponteie e solde as juntas.`
        ],
        calculated: { diameter, offset, run, travel, angleDeg }
    };
};
