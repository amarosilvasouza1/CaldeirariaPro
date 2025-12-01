import type { ShapeData, CalcResult } from '../../types';
import { DENSITIES } from '../../utils/constants';

export const calculateBracket = (data: ShapeData, material: string = 'steel'): CalcResult => {
    const height = Number(data.height) || 0; // Altura (Vertical)
    const base = Number(data.base) || 0; // Base (Horizontal)
    const width = Number(data.width) || 0; // Largura do perfil (ex: 50mm)
    const thickness = Number(data.thickness) || 0; // Espessura da chapa/perfil
    const density = DENSITIES[material] || 7.85;

    const load = Number(data.load) || 0; // Carga em kg
    const safetyFactor = Number(data.safetyFactor) || 2.0;
    const yieldStrength = 250; // MPa (A36 Steel approx)

    if (height <= 0 || base <= 0) {
        return {
            metrics: { 'Aviso': 'Insira altura e base.' },
            steps: ['Aguardando dados...'],
            calculated: { height, base, width }
        };
    }

    // 1. Calculate Diagonal (Hypotenuse)
    const diagonal = Math.sqrt(Math.pow(height, 2) + Math.pow(base, 2));

    // 2. Calculate Angles
    // Angle at the bottom (between Base and Diagonal)
    const angleRad = Math.atan2(height, base);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    // Angle at the top (between Height and Diagonal)
    const topAngleDeg = 90 - angleDeg;

    // 3. Structural Analysis
    // Force on Diagonal (Compression/Tension)
    // F_diag = Load / sin(theta)
    const forceKg = load / Math.sin(angleRad);
    const forceN = forceKg * 9.81; // Convert to Newtons

    // Area of cross section (mm2)
    // Assuming rectangular profile: width * thickness
    // If thickness is 0, we can't calculate stress
    let stressMPa = 0;
    let status = 'N/A';
    let maxLoadKg = 0;
    
    const areaMm2 = width * thickness;

    if (areaMm2 > 0) {
        stressMPa = forceN / areaMm2;
        const allowableStress = yieldStrength / safetyFactor;
        
        if (stressMPa > allowableStress) {
            status = 'PERIGO (Tensão Excessiva)';
        } else {
            status = 'SEGURO';
        }

        // Max Load
        // MaxForce = Allowable * Area
        // MaxLoad = MaxForce * sin(theta)
        const maxForceN = allowableStress * areaMm2;
        const maxLoadN = maxForceN * Math.sin(angleRad);
        maxLoadKg = maxLoadN / 9.81;
    }

    // 4. Weight Estimation
    const volume = diagonal * width * thickness; // mm³
    const weight = (volume * density) / 1000000; // kg

    return {
        metrics: {
            'Diagonal (Hipotenusa)': `${diagonal.toFixed(1)} mm`,
            'Ângulo Base': `${angleDeg.toFixed(2)}°`,
            'Ângulo Topo': `${topAngleDeg.toFixed(2)}°`,
            'Comprimento Total': `${(height + base + diagonal).toFixed(1)} mm`,
            'Força na Diagonal': `${forceKg.toFixed(1)} kgf`,
            'Tensão Atuante': `${stressMPa.toFixed(1)} MPa`,
            'Status de Segurança': status,
            'Carga Máx. Teórica': `${maxLoadKg.toFixed(1)} kg`,
            'Peso (Diagonal)': `${weight.toFixed(2)} kg`
        },
        steps: [
            `1. ANÁLISE E PREPARAÇÃO:\n   - Perfil Selecionado: ${width}x${thickness} mm.\n   - Carga de Projeto: ${load} kg.\n   - Fator de Segurança: ${safetyFactor}.\n   - IMPORTANTE: Verifique se a parede ou coluna onde será fixado suporta essa carga.`,
            
            `2. CÁLCULO ESTRUTURAL:\n   - A diagonal (hipotenusa) terá ${diagonal.toFixed(1)} mm.\n   - A força de compressão/tração na diagonal será de ${forceKg.toFixed(1)} kgf.\n   - Tensão Calculada: ${stressMPa.toFixed(1)} MPa. Status: ${status}.`,
            
            `3. CORTE DOS PERFIS:\n   - Corte a peça diagonal com comprimento de ${diagonal.toFixed(1)} mm.\n   - Ângulo de corte inferior (Base): ${angleDeg.toFixed(2)}°.\n   - Ângulo de corte superior (Topo): ${topAngleDeg.toFixed(2)}°.`,
            
            `4. MONTAGEM:\n   - Posicione a peça vertical (H) e a horizontal (B) no esquadro (90°).\n   - Encaixe a diagonal. Se os ângulos estiverem corretos, o fechamento será perfeito.\n   - Ponteie os cantos.`,
            
            `5. SOLDAGEM E ACABAMENTO:\n   - Realize a soldagem completa das juntas. Para cargas altas, use eletrodo 7018 ou MIG/MAG com boa penetração.\n   - Se necessário, adicione uma chapa de reforço (gusset) nos cantos internos para aumentar a rigidez.\n   - Limpe a solda e aplique proteção anticorrosiva.`
        ],
        calculated: { height, base, width, diagonal, angleDeg, topAngleDeg }
    };
};
