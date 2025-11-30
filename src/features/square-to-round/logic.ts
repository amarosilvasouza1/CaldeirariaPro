import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateSquareToRound = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const width = Number(data.width) || 0;
    const diameter = Number(data.diameter) || 0;
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    // Volume Calculation (Prismoid Formula Approximation)
    // V = h/3 * (A_base + A_top + sqrt(A_base * A_top))
    const areaBase = width * width;
    const areaTop = Math.PI * Math.pow(diameter / 2, 2);
    const volumeMm3 = (height / 3) * (areaBase + areaTop + Math.sqrt(areaBase * areaTop));
    const volumeLiters = volumeMm3 / 1000000;

    // Surface Area Calculation (Refined)
    // 4 Triangular Faces + 4 Conical Corner Segments
    // Area of 4 triangles = 4 * (1/2 * base * height) -> Base is width? No, base is width, top is tangent to circle?
    // Actually, simpler approximation for surface area of transition:
    // Average Perimeter * Slant Height (approx)
    const perimSq = width * 4;
    const perimCirc = Math.PI * diameter;
    const slantHeightAvg = Math.sqrt(Math.pow(height, 2) + Math.pow((width - diameter) / 2, 2));
    const areaMm2 = ((perimSq + perimCirc) / 2) * slantHeightAvg;
    const areaM2 = areaMm2 / 1000000;

    const weight = (areaMm2 * thickness * density) / 1000000;

    return {
        metrics: {
            'Altura Vertical': `${height} mm`,
            'Base Quadrada': `${width} x ${width} mm`,
            'Topo Redondo': `Ø ${diameter} mm`,
            'Área Superficial': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `PREPARAÇÃO: Selecione a chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm.`,
            `TRAÇAGEM: Divida o círculo superior (na vista de planta) em 12 partes iguais (quadrantes de 3 divisões).`,
            `TRIANGULAÇÃO: Ligue cada ponto do círculo aos cantos da base quadrada. Isso formará triângulos planos nas faces e cones parciais nos cantos.`,
            `VERDADEIRA GRANDEZA: Construa o diagrama de verdadeiras grandezas usando a altura da peça e as projeções horizontais das linhas de triangulação.`,
            `DESENVOLVIMENTO: Transfira as medidas reais para a chapa, começando por uma linha de centro ou emenda, montando a peça triângulo por triângulo.`,
            `CONFORMAÇÃO: Dobre as linhas de quina da base quadrada levemente e calandre/curve as seções cônicas dos cantos.`,
            `FECHAMENTO: Confira o esquadro da base e o nivelamento do topo antes de soldar.`
        ],
        calculated: { width, diameter, height }
    };
};
