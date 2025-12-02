import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getPlateWeightTheory = () => {
    return [
        {
            title: 'Cálculo de Massa',
            content: 'A massa (peso) é o produto do volume pela densidade do material:\n\nPeso = Volume × Densidade'
        },
        {
            title: 'Volume da Chapa',
            content: 'O volume é calculado multiplicando as dimensões:\n\nV = Comprimento × Largura × Espessura'
        },
        {
            title: 'Densidade (Peso Específico)',
            content: 'Cada material tem uma densidade única. O aço carbono, por exemplo, tem ~7.85 g/cm³ (ou 7850 kg/m³).'
        }
    ];
};

export const calculatePlateWeight = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const width = Number(data.width) || 0;
    const length = Number(data.length) || 0;
    const thickness = Number(data.thickness) || 0;
    const quantity = Number(data.quantity) || 1;
    const density = DENSITIES[material] || 7.85;

    // Calculations
    const volumeMm3 = width * length * thickness;
    const weightPerItem = (volumeMm3 * density) / 1000000;
    const totalWeight = weightPerItem * quantity;
    const areaM2 = (width * length) / 1000000;

    return {
        metrics: {
            'Dimensões': `${length} x ${width} mm`,
            'Espessura': `${thickness} mm`,
            'Quantidade': `${quantity}`,
            'Peso Unitário': `${weightPerItem.toFixed(2)} kg`,
            'Peso Total': `${totalWeight.toFixed(2)} kg`,
            'Área Total': `${(areaM2 * quantity).toFixed(2)} m²`
        },
        steps: [
            `1. CÁLCULO DO VOLUME:\n   - Volume = ${length} x ${width} x ${thickness} = ${volumeMm3.toLocaleString()} mm³.`,
            `2. APLICAÇÃO DA DENSIDADE:\n   - Material: ${material === 'steel' ? 'Aço' : material} (Densidade ~${density} g/cm³).\n   - Peso = Volume x Densidade.`,
            `3. RESULTADO:\n   - Cada peça pesa ${weightPerItem.toFixed(2)} kg.\n   - O lote com ${quantity} peças pesa ${totalWeight.toFixed(2)} kg.`
        ],
        calculated: {
            width, length, thickness, weight: totalWeight
        }
    };
};
