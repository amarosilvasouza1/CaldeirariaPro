import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getBracketTheory = () => {
    return [
        {
            title: 'Teorema de Pitágoras',
            content: 'A mão francesa forma um triângulo retângulo. A escora (diagonal) é a hipotenusa:\n\nDiagonal² = Base² + Altura²'
        },
        {
            title: 'Ângulos de Corte',
            content: 'Os ângulos de corte da escora são complementares. Se a base e altura são iguais, os ângulos são 45°. Se não, usamos:\n\nα = arctan(Altura / Base)'
        },
        {
            title: 'Resistência',
            content: 'A mão francesa trabalha principalmente à compressão (na diagonal) e tração/cisalhamento (nos parafusos de fixação).'
        }
    ];
};

export const calculateBracket = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const base = Number(data.base) || 0;
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const width = Number(data.width) || 50; // Largura da barra
    const density = DENSITIES[material] || 7.85;

    // Calculations
    const diagonal = Math.sqrt(Math.pow(base, 2) + Math.pow(height, 2));
    
    // Angles
    const angleBaseRad = Math.atan2(height, base);
    const angleBaseDeg = (angleBaseRad * 180) / Math.PI;
    const angleTopDeg = 90 - angleBaseDeg;

    // Weight (Sum of 3 bars: base, height, diagonal)
    // Assuming simple frame
    const totalLength = base + height + diagonal;
    const volumeMm3 = totalLength * width * thickness;
    const weight = (volumeMm3 * density) / 1000000;

    return {
        metrics: {
            'Base': `${base} mm`,
            'Altura': `${height} mm`,
            'Diagonal (Escora)': `${diagonal.toFixed(1)} mm`,
            'Ângulo Base': `${angleBaseDeg.toFixed(1)}°`,
            'Ângulo Topo': `${angleTopDeg.toFixed(1)}°`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `1. CORTE DA ESCORA (DIAGONAL):\n   - Corte uma barra com comprimento de ${diagonal.toFixed(1)} mm.`,
            `2. ÂNGULOS DE CORTE:\n   - Na extremidade inferior (base), corte em ${angleBaseDeg.toFixed(1)}°.\n   - Na extremidade superior (topo), corte em ${angleTopDeg.toFixed(1)}°.`,
            `3. MONTAGEM:\n   - Solde a escora unindo a ponta da base com a ponta da altura.\n   - Verifique o esquadro (90°) entre a base e a altura antes de soldar a diagonal.`
        ],
        calculated: {
            base, height, diagonal, angleBaseDeg
        }
    };
};
