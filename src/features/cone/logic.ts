import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateCone = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const d1 = Number(data.d1) || 0;
    const d2 = Number(data.d2) || 0;
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const density = DENSITIES[material] || 7.85;
    
    const R = d1 / 2;
    const r = d2 / 2;
    
    // Slant height (geratriz)
    const g = Math.sqrt(Math.pow(height, 2) + Math.pow(R - r, 2));
    
    // Development radii
    // R_dev / (R_dev - g) = R / r
    // Avoid division by zero if R=r (cylinder case, but handled here for safety)
    let R_dev = 0, r_dev = 0, theta = 0;
    
    if (Math.abs(R - r) < 0.01) {
        // Treat as cylinder-ish or error
        R_dev = 0; 
    } else {
        R_dev = (R * g) / (R - r);
        r_dev = R_dev - g;
        theta = (360 * R) / R_dev;
    }

    // Weight approx (Lateral area * thickness * density)
    // Area = pi * (R + r) * g
    const areaMm2 = Math.PI * (R + r) * g;
    const areaM2 = areaMm2 / 1000000;
    const weight = (areaMm2 * thickness * density) / 1000000;

    // Internal Volume (Frustum of a cone)
    // V = (1/3) * pi * h * (R^2 + r^2 + R*r)
    const volumeMm3 = (1/3) * Math.PI * height * (Math.pow(R, 2) + Math.pow(r, 2) + R * r);
    const volumeLiters = volumeMm3 / 1000000;

    return {
        metrics: {
            'Geratriz (g)': `${g.toFixed(2)} mm`,
            'Raio Maior (R)': `${R_dev.toFixed(2)} mm`,
            'Raio Menor (r)': `${r_dev.toFixed(2)} mm`,
            'Ângulo de Abertura': `${theta.toFixed(2)}°`,
            'Área Lateral': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `PREPARAÇÃO: Selecione uma chapa de ${material === 'steel' ? 'Aço' : material} com espessura de ${thickness} mm.`,
            `TRAÇAGEM: Marque um ponto central na chapa. Trace o arco maior com raio ${R_dev.toFixed(1)} mm e o arco menor com raio ${r_dev.toFixed(1)} mm.`,
            `ANGULAÇÃO: A partir do centro, marque o ângulo de abertura de ${theta.toFixed(1)}°. Use um transferidor ou calcule a corda.`,
            `CORTE: Corte o setor circular definido pelos dois arcos e pelas linhas radiais do ângulo.`,
            `CALANDRAGEM: Inicie a conformação pelas extremidades, forçando o raio menor para formar o cone. Ajuste a pressão dos rolos conforme a conicidade.`,
            `FECHAMENTO: Verifique o alinhamento das bordas (geratriz) e solde.`
        ],
        calculated: { R_dev, r_dev, theta }
    };
};
