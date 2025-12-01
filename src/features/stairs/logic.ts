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
            calculated: { 
                height, base, width: 0, diagonal: 0, angleDeg: 0, topAngleDeg: 0,
                weight: 0,
                forceKg: 0,
                stressMPa: 0,
                status: 'Aguardando dados',
                maxLoadKg: 0
            }
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

    // Placeholder for new derived metrics (assuming they would be calculated here)
    const weightKg = weight; // Renaming for clarity as per instruction
    const totalWeightKg = weightKg; // Assuming total weight is the same as estimated weight for now
    const totalAreaM2 = totalAreaMm2 / 1_000_000; // Convert mm2 to m2
    const volumeDm3 = (totalAreaMm2 * thickness) / 1_000_000; // Assuming thickness is in mm, volume in dm3 (liters)

    // Placeholder for other new metrics



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
            `1. LEVANTAMENTO DE MEDIDAS:\n   - Altura Total (Desnível): ${height} mm.\n   - Espaço Disponível (Base): ${base} mm.\n   - Verifique se o piso inferior e a laje superior estão nivelados.`,
            
            `2. CÁLCULO E CONFERÊNCIA:\n   - A escada terá ${numSteps} degraus.\n   - Espelho (Altura do degrau): ${rise.toFixed(1)} mm.\n   - Piso (Profundidade do degrau): ${run.toFixed(1)} mm.\n   - Regra de Blondel (2E + P): ${blondel.toFixed(1)} mm. (Ideal: 630-650mm).`,
            
            `3. CORTE DOS BANZOS (VIGAS LATERAIS):\n   - Material: Perfil U ou I, comprimento ${stringerLength.toFixed(1)} mm.\n   - Corte as extremidades no ângulo de ${angleDeg.toFixed(1)}° para que o banzo apoie totalmente no chão e na laje.\n   - DICA: Corte os dois banzos juntos (espelhados) para garantir simetria.`,
            
            `4. MARCAÇÃO DOS DEGRAUS:\n   - Use um esquadro de carpinteiro ou gabarito.\n   - Marque a altura (${rise.toFixed(1)}) e a pisada (${run.toFixed(1)}) repetidamente ao longo do banzo.\n   - Use um nível de bolha para garantir que os degraus ficarão horizontais quando a escada estiver inclinada.`,
            
            `5. MONTAGEM E INSTALAÇÃO:\n   - Fixe os suportes de degrau ou solde os degraus diretamente nos banzos.\n   - Posicione a escada no local. Fixe primeiro a parte superior (laje) e confira o nível antes de fixar a base.\n   - Instale o corrimão (obrigatório para segurança) a 900mm de altura.`
        ],
        calculated: { 
            height, base, numSteps, rise, run, stringerLength,
            weightKg,
            totalWeightKg,
            totalAreaM2,
            volumeDm3,
            angleDeg,
            totalStringerLength,
            totalStepLength
        }
    };
};
