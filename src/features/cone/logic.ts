import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const getConeTheory = () => {
    return [
        {
            title: 'Geratriz (Hipotenusa)',
            content: 'A geratriz (g) é a linha inclinada do cone. Calculamos usando Pitágoras no triângulo formado pela altura e a diferença dos raios:\n\ng = √(h² + (R - r)²)'
        },
        {
            title: 'Raio do Desenvolvimento',
            content: 'Para planificar o cone, precisamos do raio do arco maior (R_dev). Ele sai da semelhança de triângulos:\n\nR_dev = (R × g) / (R - r)'
        },
        {
            title: 'Ângulo do Arco',
            content: 'O ângulo de abertura (θ) define o quanto o cone "abraça" o círculo. É proporcional ao perímetro da base:\n\nθ = (360 × R) / R_dev'
        }
    ];
};

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
    let R_dev_raw = 0, r_dev_raw = 0, theta = 0;
    
    if (Math.abs(R - r) < 0.01) {
        // Treat as cylinder-ish or error
        R_dev_raw = 0; 
    } else {
        R_dev_raw = (R * g) / (R - r);
        r_dev_raw = R_dev_raw - g;
        theta = (360 * R) / R_dev_raw;
    }

    // Ensure we work with positive values and identify Max/Min radii
    // This handles cases where d1 < d2 (inverted cone input)
    const val1 = Math.abs(R_dev_raw);
    const val2 = Math.abs(r_dev_raw);
    const R_outer = Math.max(val1, val2);
    const R_inner = Math.min(val1, val2);
    
    // Recalculate theta based on positive geometry if needed, or just use abs
    theta = Math.abs(theta);

    // Weight approx (Lateral area * thickness * density)
    const areaMm2 = Math.PI * (R + r) * g;
    const areaM2 = areaMm2 / 1000000;
    const weight = (areaMm2 * thickness * density) / 1000000;

    // Internal Volume
    const volumeMm3 = (1/3) * Math.PI * height * (Math.pow(R, 2) + Math.pow(r, 2) + R * r);
    const volumeLiters = volumeMm3 / 1000000;

    // Calculate Chords and Sagittas for metrics
    const thetaRad = (theta * Math.PI) / 180;
    
    // Chord C (Outer)
    const corda = 2 * R_outer * Math.sin(thetaRad / 2);
    
    // Chord A (Inner)
    const chordA = R_inner > 0 ? 2 * R_inner * Math.sin(thetaRad / 2) : 0;
    
    // Sagitta h2 (Outer)
    const sagitta2 = R_outer - Math.sqrt(Math.pow(R_outer, 2) - Math.pow(corda / 2, 2));
    
    // Sagitta h1 (Inner)
    const sagitta1 = R_inner > 0 ? R_inner - Math.sqrt(Math.pow(R_inner, 2) - Math.pow(chordA / 2, 2)) : 0;

    return {
        metrics: {
            'Geratriz (L)': `${g.toFixed(2)} mm`,
            'Raio Maior (R2) / Compasso': `${R_outer.toFixed(2)} mm`,
            'Raio Menor (R1)': `${R_inner.toFixed(2)} mm`,
            'Ângulo (α)': `${theta.toFixed(2)}°`,
            'Corda Externa (C)': `${corda.toFixed(2)} mm`,
            'Corda Interna (A)': R_inner > 0 ? `${chordA.toFixed(2)} mm` : '-',
            'Flecha Externa (h2)': `${sagitta2.toFixed(2)} mm`,
            'Flecha Interna (h1)': R_inner > 0 ? `${sagitta1.toFixed(2)} mm` : '-',
            'Área Lateral': `${areaM2.toFixed(2)} m²`,
            'Volume Interno': `${volumeLiters.toFixed(2)} Litros`,
            'Peso Estimado': `${weight.toFixed(2)} kg`
        },
        steps: [
            `1. PREPARAÇÃO E TRAÇAGEM:\n   - Material: Chapa de ${material === 'steel' ? 'Aço' : material}, espessura ${thickness} mm.\n   - Marque um ponto "O" (Centro) próximo à borda da chapa para aproveitar o material.\n   - Com um compasso ou trena fixada no ponto "O", trace dois arcos:\n     • Arco Maior (Externo) com raio = ${R_outer.toFixed(1)} mm\n     • Arco Menor (Interno) com raio = ${R_inner.toFixed(1)} mm`,
            
            `2. DEFINIÇÃO DO ÂNGULO (CORDA):\n   - O ângulo de abertura é de ${theta.toFixed(1)}°.\n   - Para marcar sem transferidor, calcule a Corda do arco maior: C = 2 * ${R_outer.toFixed(1)} * sen(${theta.toFixed(1)}° / 2).\n   - Marque essa medida "C" em linha reta sobre o arco maior a partir do ponto inicial.`,
            
            `3. CORTE:\n   - Corte o perímetro definido pelos dois arcos e pelas linhas laterais que convergem para o centro.\n   - DICA: Deixe uma pequena sobra (10-20mm) em uma das extremidades retas se precisar de área para transpasse ou ajuste na solda.`,
            
            `4. CALANDRAGEM (CONICIDADE):\n   - A calandragem de cones exige técnica: o lado do raio menor deve girar mais devagar que o lado maior.\n   - Se usar calandra de rolos paralelos, freie levemente o lado menor ou use um dispositivo de encosto (batedor) inclinado.\n   - Verifique a curvatura constantemente com gabaritos dos raios maior e menor.`,
            
            `5. FECHAMENTO:\n   - Junte as arestas laterais. Verifique se a altura vertical do cone bate com ${height} mm.\n   - Ponteie, confira o esquadro da base em uma superfície plana e proceda com a soldagem definitiva.`
        ],
        calculated: { 
            R_dev: R_outer, 
            r_dev: R_inner, 
            theta,
            areaM2,
            volumeLiters,
            weightKg: weight
        },
        theory: getConeTheory()
    };
};
