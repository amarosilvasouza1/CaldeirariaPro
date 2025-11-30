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
            `IDENTIFICAÇÃO: Chapa de ${width}x${length}x${thickness} mm (${quantity} unidades).`,
            `VOLUME: Cada peça tem ${volumeDm3.toFixed(4)} dm³ de volume.`,
            `DENSIDADE: Material (${material}) com densidade de ${density} kg/dm³.`,
            `PESO UNITÁRIO: ${volumeDm3.toFixed(4)} x ${density} = ${weightKg.toFixed(2)} kg.`,
            `PESO TOTAL: ${quantity} x ${weightKg.toFixed(2)} = ${totalWeightKg.toFixed(2)} kg.`
        ],
        calculated: {
            width,
            length,
            thickness,
            weightKg
        }
    };
};
