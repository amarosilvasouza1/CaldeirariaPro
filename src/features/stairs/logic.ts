import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getStairsTheory = () => {
    return [
        {
            title: 'Fórmula de Blondel',
            content: 'Para uma escada confortável e segura, usamos a relação:\n\n63cm ≤ (2 × Espelho) + Piso ≤ 65cm\n\nIsso garante que o passo seja natural ao subir ou descer.'
        },
        {
            title: 'Cálculo do Banzo (Pitágoras)',
            content: 'O comprimento do banzo (a viga lateral) é a hipotenusa do triângulo formado pela altura total e o comprimento da base:\n\nL = √(Altura² + Base²)'
        },
        {
            title: 'Espelho e Piso',
            content: 'Espelho (E) = Altura Total / Nº Degraus\nPiso (P) = Base Total / (Nº Degraus - 1) (geralmente)'
        }
    ];
};

export const calculateStairs = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const height = Number(data.height) || 0; // Altura Total
    const base = Number(data.base) || 0;     // Comprimento da Base
    const width = Number(data.width) || 800; // Largura da Escada
    const steps = Number(data.steps) || 12;  // Número de Degraus
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Validation
    if (height <= 0 || base <= 0 || steps < 1) {
        return {
            metrics: { 'Erro': 'Dados inválidos' },
            steps: [],
            calculated: {}
        };
    }

    // Calculations
    const rise = height / steps; // Espelho (Height of each step)
    
    // Run (Piso) calculation depends on how the stair is built.
    // Usually, Run = Base / (Steps - 1) if the top step is flush with the floor,
    // or Run = Base / Steps if the top step is one step down.
    // Let's assume standard run = Base / Steps for simplicity in layout, 
    // or Base / (Steps - 1) for "Piso" dimension.
    // Let's use Base / (Steps - 1) as the effective tread depth for calculation if Steps > 1.
    const run = steps > 1 ? base / (steps - 1) : base;

    // Stringer Length (Banzo) - Hypotenuse
    const stringerLength = Math.sqrt(Math.pow(height, 2) + Math.pow(base, 2));
    
    // Angle of inclination
    const angleRad = Math.atan(height / base);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Blondel Check
    // 2*Rise + Run (in cm)
    const blondel = (2 * (rise / 10)) + (run / 10);
    let blondelStatus = 'OK';
    if (blondel < 63) blondelStatus = 'Passo Curto (Aumentar Piso)';
    else if (blondel > 65) blondelStatus = 'Passo Longo (Diminuir Piso)';

    // Weight Estimation
    // 1. Treads (Pisos): Width * Run * Thickness * Steps
    // 2. Stringers (Banzos): 2 * StringerLength * Height(of stringer profile?) * Thickness
    // Let's approximate Stringer weight as a flat bar of e.g. 200mm height? 
    // Or just calculate Treads weight for now if stringer profile is unknown.
    // Let's assume Stringer is a C-channel approx 200mm x 6mm?
    // Let's just calculate the Treads weight accurately based on input thickness.
    
    const treadAreaMm2 = width * run;
    const totalTreadAreaMm2 = treadAreaMm2 * steps;
    const weightTreads = (totalTreadAreaMm2 * thickness * density) / 1000000;
    
    // Let's estimate Stringers assuming a standard profile height relative to the stair size, say 250mm
    const stringerHeight = 250; 
    const stringerAreaMm2 = stringerLength * stringerHeight * 2; // 2 Stringers
    const weightStringers = (stringerAreaMm2 * thickness * density) / 1000000;
    
    const totalWeight = weightTreads + weightStringers;

    return {
        metrics: {
            'Altura Total': `${height} mm`,
            'Base Total': `${base} mm`,
            'Número de Degraus': `${steps}`,
            'Espelho (E)': `${rise.toFixed(1)} mm`,
            'Piso (P)': `${run.toFixed(1)} mm`,
            'Ângulo': `${angleDeg.toFixed(1)}°`,
            'Blondel': `${blondel.toFixed(1)} cm (${blondelStatus})`,
            'Comp. Banzo': `${(stringerLength).toFixed(1)} mm`,
            'Peso Estimado': `${totalWeight.toFixed(2)} kg`
        },
        steps: [
            `1. CÁLCULO DOS DEGRAUS:\n   - Espelho (Altura) = ${height} / ${steps} = ${rise.toFixed(1)} mm.\n   - Piso (Largura) = ${base} / ${steps - 1} = ${run.toFixed(1)} mm.`,
            
            `2. VERIFICAÇÃO BLONDEL:\n   - Fórmula: 2E + P = 63 a 65 cm.\n   - Seu cálculo: 2(${rise.toFixed(1)}) + ${run.toFixed(1)} = ${blondel.toFixed(1)} cm.\n   - Status: ${blondelStatus}.`,
            
            `3. CÁLCULO DO BANZO (VIGA LATERAL):\n   - Usando Pitágoras: √(${height}² + ${base}²) = ${stringerLength.toFixed(1)} mm.\n   - Ângulo de inclinação: ${angleDeg.toFixed(1)}°.`,
            
            `4. MONTAGEM:\n   - Marque os degraus no banzo usando o esquadro com as medidas de Espelho e Piso.\n   - Certifique-se de que os degraus estejam nivelados.`
        ],
        calculated: {
            height, base, width, steps, rise, run, stringerLength, angleDeg, totalWeight
        }
    };
};
