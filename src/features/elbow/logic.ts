import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getElbowTheory = () => {
    return [
        {
            title: 'Raio da Curva',
            content: 'O raio da curva (R) define quão "aberta" ou "fechada" ela é. Geralmente segue padrões como Raio Longo (1.5 × Ø) ou Curto (1.0 × Ø).'
        },
        {
            title: 'Divisão em Gomos',
            content: 'A curva é formada por segmentos (gomos). O ângulo de cada corte depende do número de gomos (N) e do ângulo total da curva (α):\n\nÂngulo de Corte = α / (2 × (N - 1))'
        },
        {
            title: 'Desenvolvimento (Espinha de Peixe)',
            content: 'Para traçar o gomo, usamos a fórmula da senóide aplicada ao perímetro do tubo, variando a altura conforme o ângulo de corte.'
        }
    ];
};

export const calculateElbow = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const diameter = Number(data.diameter) || 0;
    const radius = Number(data.radius) || (diameter * 1.5); // Default Long Radius
    const angle = Number(data.angle) || 90;
    const segments = Number(data.segments) || Number(data.joints) || 3; // Number of segments (gomos)
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Validation
    if (diameter <= 0 || segments < 2) {
        return {
            metrics: { 'Erro': 'Dados inválidos' },
            steps: [],
            calculated: {}
        };
    }

    // Calculations
    // Number of welds = segments - 1
    // Number of divisions = (segments - 1) * 2
    const numberOfDivisions = (segments - 1) * 2;
    const cutAngle = angle / numberOfDivisions; // Angle of the cut plane relative to the pipe axis normal
    const cutAngleRad = (cutAngle * Math.PI) / 180;
    
    // Segment dimensions
    // Back (Costas) - Longest side
    // Belly (Ventre) - Shortest side
    // Centerline length of one full segment (Middle Segment)
    // A full segment covers 2 * cutAngle
    
    // Height of the cut from center (Flecha)
    const cutHeight = Math.tan(cutAngleRad) * (diameter / 2);
    
    // Lengths for a MIDDLE segment (Gomo Inteiro)
    // Centerline length at radius R is not simple arc length for the segment, 
    // but we can approximate the segment as a cylinder cut at both ends.
    // The "max" length (back) and "min" length (belly) for a middle segment:
    // Middle segment spans 2 * cutAngle.
    // The "height" of the segment at the centerline (if it were straight) would be:
    // h_center = 2 * R * tan(cutAngle) -- Wait, this is for miter bend geometry.
    
    // Let's use standard Miter Bend formulas.
    // Radius R is the bend radius.
    // Segment Angle = 2 * cutAngle (for middle segments).
    // End segments have angle = cutAngle.
    
    // The length of the segment along the neutral axis (centerline of pipe)
    // For a middle segment: L_center = 2 * R * tan(cutAngleRad)
    // For an end segment: L_center_end = R * tan(cutAngleRad)
    
    // Back Length (Costas) for Middle Segment:
    // L_back = 2 * (R + diameter/2) * tan(cutAngleRad)
    const backLength = 2 * (radius + diameter/2) * Math.tan(cutAngleRad);
    
    // Belly Length (Ventre) for Middle Segment:
    // L_belly = 2 * (radius - diameter/2) * Math.tan(cutAngleRad);
    const bellyLength = 2 * (radius - diameter/2) * Math.tan(cutAngleRad);
    
    // Arc Length (Total Centerline)
    const arcLength = (angle / 360) * 2 * Math.PI * radius;
    
    // Surface Area (approx cylinder of length arcLength)
    const circumference = Math.PI * diameter;
    const areaMm2 = circumference * arcLength;
    const areaM2 = areaMm2 / 1000000;
    const weight = (areaMm2 * thickness * density) / 1000000;

    // Volume
    const crossSectionArea = Math.PI * Math.pow(diameter / 2, 2);
    const volumeMm3 = crossSectionArea * arcLength;
    const volumeLiters = volumeMm3 / 1000000;

    return {
        metrics: {
            'Raio da Curva': `${radius} mm`,
            'Ângulo Total': `${angle}°`,
            'Número de Gomos': `${segments}`,
            'Ângulo de Corte': `${cutAngle.toFixed(2)}°`,
            'Costas (Gomo Inteiro)': `${backLength.toFixed(1)} mm`,
            'Ventre (Gomo Inteiro)': `${bellyLength.toFixed(1)} mm`,
            'Flecha de Corte': `${cutHeight.toFixed(1)} mm`,
            'Comprimento do Arco': `${arcLength.toFixed(1)} mm`,
            'Área Superficial': `${areaM2.toFixed(2)} m²`,
            'Peso Estimado': `${weight.toFixed(2)} kg`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`
        },
        steps: [
            `1. DEFINIÇÃO DOS GOMOS:\n   - Curva de ${angle}° com ${segments} gomos.\n   - Ângulo de Corte: ${cutAngle.toFixed(2)}°.\n   - Você precisará de: 2 Meios-Gomos (Pontas) e ${segments - 2} Gomos Inteiros (Meio).`,
            
            `2. DIMENSÕES DO GOMO INTEIRO:\n   - Comprimento nas Costas (Maior): ${backLength.toFixed(1)} mm.\n   - Comprimento no Ventre (Menor): ${bellyLength.toFixed(1)} mm.\n   - Altura do Corte (Flecha): ${cutHeight.toFixed(1)} mm.`,
            
            `3. TRAÇAGEM (ESPINHA DE PEIXE):\n   - Trace uma linha com o perímetro (${circumference.toFixed(1)} mm).\n   - Divida em 12 partes.\n   - Use a altura de corte (${cutHeight.toFixed(1)} mm) para traçar a senóide.`,
            
            `4. MONTAGEM:\n   - Monte os gomos invertendo a posição (girando 180°) para formar a curva.\n   - O raio final deve ser conferido com um gabarito.`
        ],
        calculated: {
            diameter, radius, angle, segments, cutAngle, circumference,
            backLength, bellyLength, cutHeight,
            middleSegmentAngle: cutAngle * 2
        }
    };
};
