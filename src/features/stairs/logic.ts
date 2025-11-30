import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateStairs = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const height = Number(data.height) || 0; // Altura total
    const width = Number(data.width) || 0; // Largura da escada
    const length = Number(data.length) || 0; // Comprimento total (opcional, se não fornecido, calcula pelo ângulo ou passo)
    
    const base = Number(data.base) || length; // Base length
    
    if (height <= 0) {
         return {
            metrics: { 'Aviso': 'Insira a altura.' },
            steps: ['Aguardando dados...'],
            calculated: { height, base }
        };
    }

    // 1. Calculate Angle
    const angleRad = Math.atan2(height, base);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    // 2. Estimate Steps
    // Ideal Rise (E) is usually 170-180mm.
    const idealRise = 175;
    const numSteps = Math.round(height / idealRise) || 1;
    
    // Recalculate exact Rise
    const rise = height / numSteps;
    
    // Calculate Run (Piso)
    const run = base > 0 ? base / numSteps : 280; // Default run if base is 0 (to help user?)
    
    // Check Blondel
    const blondel = 2 * rise + run;
    const isBlondelOk = blondel >= 630 && blondel <= 650;
    const blondelStatus = isBlondelOk ? 'Ideal' : 'Fora do Ideal (630-650)';

    // Stringer Length (Banzo)
    const stringerLength = Math.sqrt(Math.pow(height, 2) + Math.pow(base, 2));
    const totalStringerLength = stringerLength * 2; // 2 banzos

    // Material List
    const totalStepLength = numSteps * width;
    
    // Weight (Approximate)
    // Assuming standard C-channel for stringers (~20kg/m) and checker plate for steps (~30kg/m2) if no thickness provided
    // If thickness provided, calculate based on volume of steel
    const stringerAreaMm2 = stringerLength * 200 * 2; // Approx area for 2 stringers (200mm height)
    const stepAreaMm2 = numSteps * width * (run + rise); // Approx developed area of steps
    const totalAreaMm2 = stringerAreaMm2 + stepAreaMm2;
    
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;
    
    // If thickness is 0, use a rough estimation based on linear weight
    let weight = 0;
    if (thickness > 0) {
        weight = (totalAreaMm2 * thickness * density) / 1000000;
    } else {
        // Fallback estimation
        weight = (totalStringerLength / 1000 * 15) + (totalStepLength / 1000 * run / 1000 * 40); // Very rough
    }

    return {
        metrics: {
            'Altura Total': `${height} mm`,
            'Base Total': `${base} mm`,
            'Número de Degraus': `${numSteps}`,
            'Espelho (Rise)': `${rise.toFixed(1)} mm`,
            'Piso (Run)': `${run.toFixed(1)} mm`,
            'Blondel (2E+P)': `${blondel.toFixed(1)} mm (${blondelStatus})`,
            'Ângulo de Inclinação': `${angleDeg.toFixed(1)}°`,
            'Comp. Total Banzos': `${(totalStringerLength / 1000).toFixed(2)} m`,
            'Comp. Total Degraus': `${(totalStepLength / 1000).toFixed(2)} m`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `PREPARAÇÃO: Verifique o desnível de ${height} mm e o espaço disponível na base de ${base} mm.`,
            `CÁLCULO: A escada terá ${numSteps} degraus com espelho de ${rise.toFixed(1)} mm e piso de ${run.toFixed(1)} mm.`,
            `VALIDAÇÃO: A regra de Blondel resultou em ${blondel.toFixed(1)} mm. O ângulo é de ${angleDeg.toFixed(1)}°.`,
            `CORTE DOS BANZOS: Corte 2 perfis (U ou I) com comprimento de ${stringerLength.toFixed(1)} mm. Corte as extremidades no ângulo de ${angleDeg.toFixed(1)}° para apoio no chão e na laje.`,
            `MARCAÇÃO: Marque a posição dos degraus nos banzos usando um esquadro ou gabarito com as medidas de espelho e piso.`,
            `FIXAÇÃO: Solde ou aparafuse os suportes dos degraus ou os próprios degraus nos banzos.`,
            `INSTALAÇÃO: Posicione a escada, nivele e fixe firmemente no chão e na estrutura superior.`
        ],
        calculated: { height, base, numSteps, rise, run, stringerLength }
    };
};
