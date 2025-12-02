import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getSquareToRoundTheory = () => {
    return [
        {
            title: 'Triangulação',
            content: 'A transição quadrado para redondo é calculada dividindo a superfície em triângulos. Cada canto do quadrado se conecta a 1/4 do círculo.'
        },
        {
            title: 'Comprimento Verdadeiro',
            content: 'As linhas de traçagem (dobra) não estão em verdadeira grandeza na vista superior. Usamos Pitágoras com a altura (h) para achar o comprimento real:\n\nL_real = √(L_planta² + h²)'
        },
        {
            title: 'Divisão do Círculo',
            content: 'O círculo superior é dividido em partes iguais (geralmente 12 ou 16) para criar os pontos de conexão com a base quadrada.'
        }
    ];
};

export const calculateSquareToRound = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const diameter = Number(data.diameter) || 0;
    const side = Number(data.side) || 0; // Square side
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Basic validation
    if (diameter <= 0 || side <= 0 || height <= 0) {
        return {
            metrics: { 'Erro': 'Dimensões inválidas' },
            steps: [],
            calculated: {}
        };
    }

    // Calculations for development (simplified approximation for metrics)
    // Real development requires complex triangulation points which are handled in the drawer.
    // Here we calculate weights and basic dimensions.
    
    // Approximate Surface Area
    // Area of circle + Area of square (base) + lateral area
    // Lateral area approx: 4 * Area of trapezoid-like shapes? No, it's 4 triangles + 4 cone segments.
    // Simplified: Average perimeter * slant height
    const perimCircle = Math.PI * diameter;
    const perimSquare = 4 * side;
    const avgPerim = (perimCircle + perimSquare) / 2;
    const slantHeight = Math.sqrt(Math.pow(height, 2) + Math.pow((side - diameter)/2, 2)); // Rough approx
    const lateralAreaMm2 = avgPerim * slantHeight;
    
    const weight = (lateralAreaMm2 * thickness * density) / 1000000;
    const areaM2 = lateralAreaMm2 / 1000000;

    // Volume (Frustum-like approximation)
    const areaBase = Math.pow(side, 2);
    const areaTop = Math.PI * Math.pow(diameter / 2, 2);
    const volumeMm3 = (height / 3) * (areaBase + areaTop + Math.sqrt(areaBase * areaTop));
    const volumeLiters = volumeMm3 / 1000000;

    return {
        metrics: {
            'Base Quadrada': `${side} x ${side} mm`,
            'Topo Redondo': `Ø${diameter} mm`,
            'Altura': `${height} mm`,
            'Peso Estimado': `${weight.toFixed(2)} kg`,
            'Área Superficial': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`
        },
        steps: [
            `1. TRAÇAGEM DA BASE:\n   - Desenhe a base quadrada de ${side}x${side} mm.\n   - Marque o centro e desenhe o círculo de Ø${diameter} mm (na vista de planta).`,
            
            `2. DIVISÃO EM TRIÂNGULOS:\n   - Divida o círculo em 12 partes iguais (3 por quadrante).\n   - Ligue os pontos do círculo aos cantos do quadrado. Isso forma a "teia" de triângulos.`,
            
            `3. VERDADEIRA GRANDEZA:\n   - As linhas desenhadas na planta não são o tamanho real.\n   - Use a altura de ${height} mm para calcular a hipotenusa de cada linha (Triangulação).\n   - L_real = √(L_planta² + ${height}²)`,
            
            `4. DESENVOLVIMENTO:\n   - Comece traçando o triângulo plano de um dos lados do quadrado.\n   - Adicione os triângulos adjacentes usando as medidas reais encontradas.\n   - A peça final terá uma forma de "estrela" ou pode ser feita em duas metades para economizar material.`
        ],
        calculated: {
            diameter, side, height, weight, areaM2, volumeLiters
        }
    };
};
