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
            `1. PREPARAÇÃO E TRAÇAGEM:\n   - Material: Chapa de ${material === 'steel' ? 'Aço' : material}, espessura ${thickness} mm.\n   - Marque um ponto "O" (Centro) próximo à borda da chapa para aproveitar o material.\n   - Com um compasso ou trena fixada no ponto "O", trace dois arcos:\n     • Arco Maior (Externo) com raio = ${R_dev.toFixed(1)} mm\n     • Arco Menor (Interno) com raio = ${r_dev.toFixed(1)} mm`,
            
            `2. DEFINIÇÃO DO ÂNGULO (CORDA):\n   - O ângulo de abertura é de ${theta.toFixed(1)}°.\n   - Para marcar sem transferidor, calcule a Corda do arco maior: C = 2 * ${R_dev.toFixed(1)} * sen(${theta.toFixed(1)}° / 2).\n   - Marque essa medida "C" em linha reta sobre o arco maior a partir do ponto inicial.`,
            
            `3. CORTE:\n   - Corte o perímetro definido pelos dois arcos e pelas linhas laterais que convergem para o centro.\n   - DICA: Deixe uma pequena sobra (10-20mm) em uma das extremidades retas se precisar de área para transpasse ou ajuste na solda.`,
            
            `4. CALANDRAGEM (CONICIDADE):\n   - A calandragem de cones exige técnica: o lado do raio menor deve girar mais devagar que o lado maior.\n   - Se usar calandra de rolos paralelos, freie levemente o lado menor ou use um dispositivo de encosto (batedor) inclinado.\n   - Verifique a curvatura constantemente com gabaritos dos raios maior e menor.`,
            
            `5. FECHAMENTO:\n   - Junte as arestas laterais. Verifique se a altura vertical do cone bate com ${height} mm.\n   - Ponteie, confira o esquadro da base em uma superfície plana e proceda com a soldagem definitiva.`
        ],
        calculated: { R_dev, r_dev, theta }
    };
};
