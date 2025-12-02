import type { CalcResult, ShapeData } from '../../types';

export const getPipeBranchingTheory = () => {
    return [
        {
            title: 'Interseção de Cilindros',
            content: 'A boca de lobo é a curva gerada pela interseção de dois cilindros (tubos). A forma da curva depende dos diâmetros e do ângulo de conexão.'
        },
        {
            title: 'Ordenadas de Corte',
            content: 'Para traçar o corte, dividimos o tubo em partes iguais e calculamos a altura da curva em cada ponto usando trigonometria (seno/cosseno).'
        },
        {
            title: 'Gabarito',
            content: 'O desenvolvimento gera uma "onda" que pode ser impressa e enrolada no tubo para marcar o corte preciso.'
        }
    ];
};

export const calculatePipeBranching = (inputs: ShapeData): CalcResult => {
    const headerDiameter = Number(inputs.headerDiameter) || 0;
    const branchDiameter = Number(inputs.branchDiameter) || 0;
    const angleDeg = Number(inputs.angle) || 90;


    if (headerDiameter <= 0 || branchDiameter <= 0 || angleDeg <= 0) {
        return {
            metrics: {},
            steps: [],
            calculated: {}
        };
    }

    const R = headerDiameter / 2;
    const r = branchDiameter / 2;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Generate development points (12 divisions)
    const divisions = 12;
    const points: { angle: number; height: number }[] = [];
    
    for (let i = 0; i <= divisions; i++) {
        const phi = (i * 360 / divisions) * (Math.PI / 180);
        // Formula for the cut curve (saddle)
        // This is a simplified approximation for the development height
        // h = (sqrt(R^2 - (r*sin(phi))^2) - sqrt(R^2 - r^2)) / sin(theta) + ... 
        // A common practical formula for the ordinate 'y' on the branch development:
        // y = (R - sqrt(R^2 - (r * sin(phi))^2)) / sin(alpha)
        // Note: This gives the "depth" of the cut from the centerline or tangent.
        
        const term = Math.sqrt(Math.pow(R, 2) - Math.pow(r * Math.sin(phi), 2));
        const y = (R - term) / Math.sin(angleRad);
        
        // Adjust for the branch angle itself (if not 90)
        // Additional height due to slope: x / tan(alpha) where x = r * cos(phi)
        const slopeCorrection = (r * Math.cos(phi)) / Math.tan(angleRad);
        
        // Total height from a reference plane (e.g. the shortest point)
        // We usually want coordinates relative to a baseline.
        // Let's store the raw 'y' which is the "cut back" distance.
        
        points.push({ angle: i * (360/divisions), height: y - slopeCorrection });
    }

    // Normalize heights to be positive relative to the lowest point
    const minH = Math.min(...points.map(p => p.height));
    const normalizedPoints = points.map(p => ({
        ...p,
        height: p.height - minH
    }));

    const branchCircumference = branchDiameter * Math.PI;
    const maxCutHeight = Math.max(...normalizedPoints.map(p => p.height));

    return {
        metrics: {
            'Diâmetro Tubo Principal': `${headerDiameter} mm`,
            'Diâmetro Boca de Lobo': `${branchDiameter} mm`,
            'Ângulo': `${angleDeg}°`,
            'Perímetro (Desenvolvimento)': `${branchCircumference.toFixed(1)} mm`,
            'Altura Máxima de Corte': `${maxCutHeight.toFixed(1)} mm`
        },
        steps: [
            `1. TRAÇAGEM:\n   - Trace uma linha reta com o comprimento do perímetro (${branchCircumference.toFixed(1)} mm).`,
            `2. DIVISÃO:\n   - Divida esta linha em ${divisions} partes iguais (espaçamento de ${(branchCircumference/divisions).toFixed(1)} mm).`,
            `3. MARCAÇÃO DAS ALTURAS:\n   - Em cada ponto de divisão, marque a altura correspondente conforme o diagrama ou tabela.`,
            `4. CORTE:\n   - Ligue os pontos com uma curva suave para obter o gabarito de corte.`
        ],
        calculated: {
            headerDiameter,
            branchDiameter,
            angleDeg,
            branchCircumference,
            points: normalizedPoints
        }
    };
};
