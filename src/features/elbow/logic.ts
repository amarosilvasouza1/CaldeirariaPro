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
            `PREPARAÇÃO: Selecione o tubo ou chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm.`,
            `CÁLCULO: A curva será dividida em ${segments} gomos (2 pontas de ${cutAngle.toFixed(2)}° e ${segments - 2} gomos centrais de ${jointAngle.toFixed(2)}°).`,
            `TRAÇAGEM: Trace uma linha base com o perímetro de ${pipeCircumference.toFixed(1)} mm. Divida em 12 partes iguais para gerar a senóide de corte.`,
            `GABARITO: Desenhe a curva senoidal usando as alturas calculadas (Máx: ${h_long_full.toFixed(1)} mm, Mín: ${h_short_full.toFixed(1)} mm) para criar um gabarito de corte.`,
            `CORTE: Envolva o gabarito no tubo, marque e corte. Repita para todos os gomos.`,
            `MONTAGEM: Alinhe os gomos rotacionando-os 180° um em relação ao outro para formar a curva.`,
            `SOLDAGEM: Ponteie as juntas garantindo o alinhamento interno e solde o perímetro.`
        ],
        calculated: { 
            diameter, radius, segments, angle, cutAngle, 
            h_long_half, h_short_half, h_long_full, h_short_full,
            pipeCircumference
        }
    };
};
