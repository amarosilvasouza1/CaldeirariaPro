import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

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
            `PREPARAÇÃO: Selecione uma chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm. Verifique se a chapa está plana e livre de defeitos.`,
            `TRAÇAGEM: Trace um retângulo com Largura = ${circumference.toFixed(1)} mm e Altura = ${height} mm. IMPORTANTE: Verifique o esquadro medindo as diagonais (devem ser iguais).`,
            `CORTE: Realize o corte da chapa nas linhas traçadas (Guilhotina, Plasma ou Oxicorte). Remova as rebarbas das arestas.`,
            `CALANDRAGEM: Insira a chapa na calandra alinhada com os rolos. Faça passes progressivos até atingir o Diâmetro Interno de ${diameter} mm. Verifique a circularidade com um gabarito.`,
            `FECHAMENTO: Ajuste as pontas para o soldagem (chanfro se necessário). Ponteie a união e confira o alinhamento antes da solda final.`
        ],
        calculated: { width: circumference, height }
    };
};
