import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getCylinderTheory = () => {
    return [
        {
            title: 'Perímetro (Circunferência)',
            content: 'O comprimento da chapa aberta é igual ao perímetro do círculo médio. Usamos a fórmula:\n\nC = π × (Ø + e)\n\nOnde "e" é a espessura da chapa (linha neutra).'
        },
        {
            title: 'Área Lateral',
            content: 'A área de material necessária é o produto do perímetro pela altura:\n\nA = C × h'
        },
        {
            title: 'Volume Interno',
            content: 'O volume é a área da base multiplicada pela altura:\n\nV = (π × r²) × h'
        }
    ];
};

export const calculateCylinder = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const diameter = Number(data.diameter) || 0;
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;

    const meanDiameter = diameter + thickness;
    const externalDiameter = diameter + 2 * thickness;
    const circumference = meanDiameter * Math.PI;
    
    // Weight Calculation
    // Volume of material = Circumference * Height * Thickness
    const materialVolumeMm3 = circumference * height * thickness;
    const weight = (materialVolumeMm3 * density) / 1000000;

    // Internal Volume (Capacity)
    const radius = diameter / 2;
    const internalVolumeMm3 = Math.PI * Math.pow(radius, 2) * height;
    const internalVolumeLiters = internalVolumeMm3 / 1000000;

    // Surface Area (Lateral + 2 * Base) - External
    const extRadius = externalDiameter / 2;
    const lateralArea = 2 * Math.PI * extRadius * height;
    const baseArea = Math.PI * Math.pow(extRadius, 2);
    const totalArea = lateralArea + 2 * baseArea;
    const totalAreaM2 = totalArea / 1000000;

    return {
        metrics: {
            'Dimensões da Chapa': `${circumference.toFixed(1)} x ${height} mm`,
            'Diâmetro Médio': `${meanDiameter.toFixed(2)} mm`,
            'Diâmetro Externo': `${externalDiameter.toFixed(2)} mm`,
            'Perímetro de Corte (L)': `${circumference.toFixed(2)} mm`,
            'Peso Estimado': `${weight.toFixed(2)} kg`,
            'Volume Interno': `${internalVolumeLiters.toFixed(2)} Litros`,
            'Área Superficial': `${totalAreaM2.toFixed(2)} m²`
        },
        steps: [
            `1. PREPARAÇÃO DO MATERIAL:\n   - Selecione uma chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm.\n   - Verifique se a chapa está plana, limpa e livre de oxidação excessiva.\n   - DICA: Para calandragem, prefira que o sentido de laminação da chapa (grão) esteja perpendicular à linha de dobra para evitar trincas.`,
            
            `2. TRAÇAGEM E DIMENSIONAMENTO:\n   - Trace um retângulo com:\n     • Largura (Perímetro) = ${circumference.toFixed(1)} mm\n     • Altura = ${height} mm\n   - CONFERÊNCIA DE ESQUADRO: A diagonal do retângulo deve medir exatos ${Math.sqrt(Math.pow(circumference, 2) + Math.pow(height, 2)).toFixed(1)} mm. Se a medida for diferente, o retângulo não está no esquadro.`,
            
            `3. CORTE E ACABAMENTO:\n   - Realize o corte nas linhas traçadas utilizando Guilhotina, Plasma ou Oxicorte.\n   - IMPORTANTE: Remova todas as rebarbas das arestas com uma lixadeira para garantir um fechamento perfeito e evitar acidentes durante o manuseio.`,
            
            `4. CALANDRAGEM (CONFORMAÇÃO):\n   - Insira a chapa na calandra bem alinhada com os rolos.\n   - Faça passes progressivos, apertando os rolos aos poucos.\n   - Verifique o raio constantemente com um gabarito (molde) do Diâmetro Interno (${diameter} mm) para garantir a circularidade uniforme.`,
            
            `5. FECHAMENTO E SOLDA:\n   - Ajuste as pontas para o fechamento. Se a espessura for maior que 3mm, faça um chanfro (bisel) para garantir penetração da solda.\n   - Ponteie a união em 3 ou 4 pontos e confira o alinhamento e o diâmetro antes de realizar o cordão de solda final.`
        ],
        calculated: { 
            width: circumference, 
            height,
            weight,
            internalVolumeLiters,
            totalAreaM2,
            circumference
        }
    };
};
