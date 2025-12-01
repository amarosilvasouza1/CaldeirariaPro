import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateElbow = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const diameter = Number(data.diameter) || 0;
    const radius = Number(data.radius) || 0; // Raio da curva
    const segments = Number(data.segments) || 3; // Número de gomos
    const angle = Number(data.angle) || 90; // Ângulo da curva
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Validation
    if (segments < 2) return { metrics: { 'Erro': 'Mínimo de 2 gomos.' }, steps: ['Insira pelo menos 2 gomos para calcular.'], calculated: { diameter, radius, segments, angle } };

    // Calculations
    const numJoints = segments - 1;
    const jointAngle = angle / numJoints;
    const cutAngle = jointAngle / 2; // Alpha
    const cutAngleRad = (cutAngle * Math.PI) / 180;

    // Segment Dimensions (Middle Segment)
    const tanAlpha = Math.tan(cutAngleRad);
    
    const r_outer = radius + diameter/2;
    const r_inner = radius - diameter/2;
    
    const h_long_half = r_outer * tanAlpha;
    const h_short_half = r_inner * tanAlpha;
    
    // Full segment lengths (double the half)
    const h_long_full = h_long_half * 2;
    const h_short_full = h_short_half * 2;

    // Weight & Area
    const totalArcLength = (Math.PI * radius * angle) / 180;
    const pipeCircumference = Math.PI * diameter;
    const areaMm2 = pipeCircumference * totalArcLength;
    const areaM2 = areaMm2 / 1000000;
    const weight = (areaMm2 * thickness * density) / 1000000;

    // Volume Interno
    // V = Area_cross * Length
    const radiusPipe = diameter / 2;
    const areaCrossMm2 = Math.PI * Math.pow(radiusPipe, 2);
    const volumeMm3 = areaCrossMm2 * totalArcLength;
    const volumeLiters = volumeMm3 / 1000000;

    return {
        metrics: {
            'Raio da Curva': `${radius} mm`,
            'Ângulo Total': `${angle}°`,
            'Número de Gomos': `${segments}`,
            'Ângulo por Segmento': `${jointAngle.toFixed(2)}°`,
            'Ângulo de Corte': `${cutAngle.toFixed(2)}°`,
            'Comprimento de Corte': `${pipeCircumference.toFixed(1)} mm`,
            'Comprimento Total (Arco)': `${totalArcLength.toFixed(1)} mm`,
            'Altura Maior (Gomo)': `${h_long_full.toFixed(1)} mm`,
            'Altura Menor (Gomo)': `${h_short_full.toFixed(1)} mm`,
            'Área Superficial': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `1. PREPARAÇÃO E CÁLCULO:\n   - Material: Tubo ou chapa de ${material === 'steel' ? 'Aço' : material}, espessura ${thickness} mm.\n   - A curva de ${angle}° será dividida em ${segments} gomos.\n   - Ângulo de corte de cada gomo (Alpha): ${cutAngle.toFixed(2)}°.`,
            
            `2. TRAÇAGEM DO GABARITO (DESENVOLVIMENTO):\n   - Trace uma linha reta com o comprimento do perímetro: ${pipeCircumference.toFixed(1)} mm.\n   - Divida essa linha em 12 partes iguais (pontos 0 a 12).\n   - Em cada ponto, marque a altura correspondente da curva senoidal (usando as alturas Máx: ${h_long_full.toFixed(1)} mm e Mín: ${h_short_full.toFixed(1)} mm calculadas).\n   - Ligue os pontos com uma régua flexível para formar a onda suave.`,
            
            `3. CORTE DOS GOMOS:\n   - Envolva o gabarito no tubo (ou trace na chapa plana antes de calandrar).\n   - Marque a linha de corte e a linha de centro (costas da curva).\n   - Corte os ${segments} gomos. As pontas (primeiro e último) são metade de um gomo central.`,
            
            `4. MONTAGEM E ALINHAMENTO:\n   - Posicione o primeiro gomo.\n   - Encoste o segundo gomo girado 180° em relação ao primeiro. As partes mais longas devem se encontrar com as mais curtas do vizinho.\n   - Verifique se o ângulo formado entre os eixos é de ${jointAngle.toFixed(2)}°.`,
            
            `5. SOLDAGEM:\n   - Ponteie em 4 pontos (cruz) cada junta.\n   - Confira o ângulo total da curva (${angle}°) e o raio (${radius} mm) antes de soldar definitivamente.\n   - Solde o perímetro de cada junta, controlando o calor para não deformar.`
        ],
        calculated: { 
            diameter, radius, segments, angle, cutAngle, 
            h_long_half, h_short_half, h_long_full, h_short_full,
            pipeCircumference
        }
    };
};
