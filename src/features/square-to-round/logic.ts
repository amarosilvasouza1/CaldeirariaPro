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
            `1. PREPARAÇÃO E TRAÇAGEM DA BASE:\n   - Selecione a chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm.\n   - Desenhe a vista de planta em tamanho real ou escala: um quadrado de ${width}x${width} mm com um círculo de Ø${diameter} mm centralizado (ou deslocado, se for excêntrico).`,
            
            `2. DIVISÃO E TRIANGULAÇÃO:\n   - Divida o círculo em 12 partes iguais (3 por quadrante).\n   - Ligue cada ponto do círculo aos dois cantos mais próximos da base quadrada.\n   - Isso cria uma série de triângulos que mapeiam a transição da forma quadrada para a redonda.`,
            
            `3. VERDADEIRA GRANDEZA (VG):\n   - As linhas traçadas na planta não são o comprimento real. Construa um diagrama de VG (Triângulo Retângulo):\n     • Cateto Vertical = Altura da peça (${height} mm)\n     • Cateto Horizontal = Comprimento da linha na planta\n     • Hipotenusa = Comprimento Real da linha na chapa.`,
            
            `4. DESENVOLVIMENTO NA CHAPA:\n   - Comece traçando a linha de emenda (geralmente o centro de um lado do quadrado).\n   - Transfira as medidas reais (Hipotenusas) triângulo por triângulo, usando compasso para marcar os arcos das distâncias.\n   - Marque as linhas de dobra (quinas) da base quadrada.`,
            
            `5. CONFORMAÇÃO (DOBRA E CALANDRA):\n   - Faça uma dobra leve (vinco) nas 4 linhas que correspondem aos cantos da base quadrada.\n   - As seções triangulares planas permanecem retas.\n   - As seções cônicas (nos cantos) devem ser conformadas manualmente ou na calandra, curvando progressivamente.`,
            
            `6. FECHAMENTO:\n   - Junte as extremidades. Verifique se a base está perfeitamente quadrada e o topo redondo e nivelado.\n   - Solde a emenda vertical e, se necessário, solde colarinhos ou flanges nas extremidades.`
        ],
        calculated: { width, diameter, height }
    };
};
