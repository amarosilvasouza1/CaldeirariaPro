import type { CalcResult, ShapeData } from '../../types';

export const getArcTheory = () => {
    return [
        {
            title: 'Relação Corda-Flecha',
            content: 'Um arco é definido por três elementos principais: Raio (R), Corda (C) e Flecha (h). Conhecendo dois, achamos o terceiro.'
        },
        {
            title: 'Cálculo do Raio',
            content: 'Se você tem a Corda e a Flecha, o Raio é:\n\nR = (C² / 8h) + (h / 2)'
        },
        {
            title: 'Comprimento do Arco',
            content: 'O comprimento do material necessário para fazer o arco depende do ângulo central (θ) e do raio:\n\nL = (θ × π × R) / 180'
        }
    ];
};

export const calculateArc = (inputs: ShapeData): CalcResult => {
    const chord = Number(inputs.chord) || 0; // Corda
    const sagitta = Number(inputs.sagitta) || 0; // Flecha (altura)
    const radiusInput = Number(inputs.radius) || 0; // Raio (opcional)

    if ((chord <= 0 || sagitta <= 0) && (radiusInput <= 0)) {
        return {
            metrics: {},
            steps: [],
            calculated: {}
        };
    }

    let R = 0;
    const C = chord;
    let h = sagitta;

    // Case 1: Given Chord and Sagitta (most common)
    if (C > 0 && h > 0) {
        R = (Math.pow(C, 2) / (8 * h)) + (h / 2);
    } 
    // Case 2: Given Radius and Chord
    else if (radiusInput > 0 && C > 0) {
        R = radiusInput;
        // h = R - sqrt(R^2 - (C/2)^2)
        if (R >= C/2) {
            h = R - Math.sqrt(Math.pow(R, 2) - Math.pow(C/2, 2));
        } else {
            // Impossible geometry
            return { metrics: { 'Erro': 'Geometria impossível (Corda > Diâmetro)' }, steps: [], calculated: {} };
        }
    }

    // Arc Length
    // Theta (central angle) = 2 * arcsin(C / 2R)
    const thetaRad = 2 * Math.asin(C / (2 * R));
    const thetaDeg = (thetaRad * 180) / Math.PI;
    const arcLength = R * thetaRad;

    return {
        metrics: {
            'Raio Calculado': `${R.toFixed(1)} mm`,
            'Corda (Largura)': `${C.toFixed(1)} mm`,
            'Flecha (Altura)': `${h.toFixed(1)} mm`,
            'Comprimento do Arco': `${arcLength.toFixed(1)} mm`,
            'Ângulo Central': `${thetaDeg.toFixed(1)}°`
        },
        steps: [
            `1. CÁLCULO DO RAIO:\n   - Com base na Corda (${C} mm) e Flecha (${h} mm), o raio de curvatura é ${R.toFixed(1)} mm.`,
            `2. COMPRIMENTO DO MATERIAL:\n   - Para formar este arco, você precisará de uma chapa/perfil com comprimento linear de ${arcLength.toFixed(1)} mm.`,
            `3. TRAÇAGEM:\n   - Marque a corda e a flecha no chão ou bancada.\n   - Use um compasso de vara ou gabarito com o raio de ${R.toFixed(1)} mm para traçar a curva.`
        ],
        calculated: {
            radius: R,
            chord: C,
            sagitta: h,
            arcLength,
            angle: thetaDeg
        }
    };
};
