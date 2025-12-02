import type { ShapeData, CalcResult } from '../../types';

export const getVolumesTheory = () => {
    return [
        {
            title: 'Volume de Prismas',
            content: 'Para caixas e tanques retangulares, o volume é simplesmente:\n\nV = Comprimento × Largura × Altura'
        },
        {
            title: 'Volume de Cilindros',
            content: 'Para tanques cilíndricos:\n\nV = Área da Base (πr²) × Altura'
        },
        {
            title: 'Conversão para Litros',
            content: '1 metro cúbico (m³) equivale a 1000 litros. 1 decímetro cúbico (dm³) equivale a 1 litro.'
        }
    ];
};

export const calculateVolumes = (data: ShapeData): CalcResult => {
    const type = data.type || 'box'; // box, cylinder, sphere
    const width = Number(data.width) || 0;
    const length = Number(data.length) || 0;
    const height = Number(data.height) || 0;
    const diameter = Number(data.diameter) || 0;

    let volumeMm3 = 0;
    let formula = '';

    if (type === 'box') {
        volumeMm3 = width * length * height;
        formula = 'V = C x L x A';
    } else if (type === 'cylinder') {
        const r = diameter / 2;
        volumeMm3 = Math.PI * Math.pow(r, 2) * height;
        formula = 'V = π x r² x h';
    } else if (type === 'sphere') {
        const r = diameter / 2;
        volumeMm3 = (4/3) * Math.PI * Math.pow(r, 3);
        formula = 'V = (4/3) x π x r³';
    }

    const volumeLiters = volumeMm3 / 1000000;
    const volumeM3 = volumeMm3 / 1000000000;

    return {
        metrics: {
            'Tipo': type === 'box' ? 'Caixa/Retangular' : (type === 'cylinder' ? 'Cilíndrico' : 'Esférico'),
            'Volume (Litros)': `${volumeLiters.toFixed(2)} L`,
            'Volume (m³)': `${volumeM3.toFixed(4)} m³`,
            'Capacidade de Água': `${volumeLiters.toFixed(0)} kg (aprox)`
        },
        steps: [
            `1. IDENTIFICAÇÃO DA FORMA:\n   - Forma selecionada: ${type === 'box' ? 'Prisma Retangular' : (type === 'cylinder' ? 'Cilindro' : 'Esfera')}.`,
            `2. FÓRMULA:\n   - ${formula}.`,
            `3. CÁLCULO:\n   - Volume calculado: ${volumeLiters.toFixed(2)} Litros.`
        ],
        calculated: {
            volumeLiters, volumeM3
        }
    };
};
