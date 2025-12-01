import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculatePlateWeight = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const width = Number(data.width) || 0;
    const length = Number(data.length) || 0;
    const thickness = Number(data.thickness) || 0;
    const quantity = Number(data.quantity) || 1;

    if (width <= 0 || length <= 0 || thickness <= 0) {
        return {
            metrics: {},
            steps: ['Insira as dimensões para calcular.'],
            calculated: {}
        };
    }

    const density = DENSITIES[material] || 7.85; // g/cm³ or kg/dm³
    
    // Weight = Volume * Density
    // Volume in mm³ = width * length * thickness
    const volumeMm3 = width * length * thickness;
    const volumeDm3 = volumeMm3 / 1000000;
    const weightKg = volumeDm3 * density;
    
    // Totals
    const totalWeightKg = weightKg * quantity;
    const areaM2 = (width * length) / 1000000;
    const totalAreaM2 = areaM2 * quantity;

    return {
        metrics: {
            'Peso Unitário': `${weightKg.toFixed(2)} kg`,
            'Peso Total': `${totalWeightKg.toFixed(2)} kg`,
            'Quantidade': `${quantity} pçs`,
            'Área Unitária': `${areaM2.toFixed(2)} m²`,
            'Área Total': `${totalAreaM2.toFixed(2)} m²`,
            'Volume Unitário': `${volumeDm3.toFixed(4)} dm³`
        },
        steps: [
            `1. IDENTIFICAÇÃO DO MATERIAL:\n   - Dimensões: ${width} mm (Largura) x ${length} mm (Comprimento) x ${thickness} mm (Espessura).\n   - Quantidade: ${quantity} peças.\n   - Material: ${material === 'steel' ? 'Aço Carbono' : material === 'stainless' ? 'Aço Inox' : material === 'aluminum' ? 'Alumínio' : material}.`,
            
            `2. CÁLCULO DO VOLUME:\n   - Volume Unitário = Largura x Comprimento x Espessura.\n   - V = ${width} x ${length} x ${thickness} = ${volumeMm3.toFixed(0)} mm³ (${volumeDm3.toFixed(4)} dm³).`,
            
            `3. CÁLCULO DO PESO:\n   - Densidade considerada: ${density} kg/dm³.\n   - Peso Unitário = Volume (dm³) x Densidade.\n   - P = ${volumeDm3.toFixed(4)} x ${density} = ${weightKg.toFixed(2)} kg.`,
            
            `4. TOTAIS:\n   - Peso Total do Lote: ${quantity} x ${weightKg.toFixed(2)} = ${totalWeightKg.toFixed(2)} kg.\n   - Área Total de Pintura/Superfície: ${totalAreaM2.toFixed(2)} m².`,
            
            `5. DICA DE COMPRA:\n   - Ao comprar, considere sempre uma margem de erro ou perda de corte (retalhos) se for cortar de uma chapa maior.`
        ],
        calculated: {
            width,
            length,
            thickness,
            weightKg,
            totalWeightKg,
            totalAreaM2,
            volumeDm3
        }
    };
};
