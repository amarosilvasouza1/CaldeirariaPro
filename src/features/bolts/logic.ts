import type { ShapeData, CalcResult } from '../../types';
import { BOLT_DATA, BOLT_CLASSES } from '../../utils/constants';

export const getBoltsTheory = () => {
    return [
        {
            title: 'Tensão de Ruptura',
            content: 'A resistência de um parafuso depende da sua classe (ex: 8.8). O primeiro número é a resistência à tração (x100 MPa) e o segundo é o limite de escoamento (x10%).'
        },
        {
            title: 'Área Resistente',
            content: 'A força que o parafuso aguenta é calculada sobre a "área de tensão", que é menor que a área nominal devido aos filetes da rosca.'
        },
        {
            title: 'Cisalhamento',
            content: 'No corte (cisalhamento), a resistência é geralmente considerada 60% da resistência à tração pura.'
        }
    ];
};

export const calculateBolts = (data: ShapeData): CalcResult => {
    const diameterStr = String(data.diameterStr || 'M12'); // e.g., "M12"
    const boltClassStr = String(data.boltClass || '8.8'); // e.g., "8.8"

    const count = Number(data.count) || 1;
    const loadKg = Number(data.load) || 0;
    const loadkN = (loadKg * 9.81) / 1000;

    const boltInfo = BOLT_DATA[diameterStr];
    const classInfo = BOLT_CLASSES[boltClassStr];

    if (!boltInfo || !classInfo) {
        return {
            metrics: { 'Erro': 'Dados não encontrados.' },
            steps: [],
            calculated: {}
        };
    }

    // Calculations
    const yieldLoad = (boltInfo.area * classInfo.yield) / 1000; // kN (Individual)
    const tensileLoad = (boltInfo.area * classInfo.tensile) / 1000; // kN (Individual)
    
    // Group Capacity
    const totalYieldLoad = yieldLoad * count;

    // Utilization
    let utilization = 0;
    let status = 'N/A';
    
    if (loadkN > 0) {
        utilization = (loadkN / totalYieldLoad) * 100;
        if (utilization > 100) {
            status = 'SOBRECARGA (PERIGO)';
        } else if (utilization > 80) {
            status = 'ALERTA (Alta Utilização)';
        } else {
            status = 'SEGURO';
        }
    }
    
    // Torque Estimation (K * D * F)
    // K = 0.2 (generic dry)
    // Preload usually 75% of Proof Load (or Yield)
    const preload = yieldLoad * 0.75; // kN
    const preloadN = preload * 1000; // N
    const diameterMm = parseInt(diameterStr.replace('M', ''));
    const diameterM = diameterMm / 1000;
    
    const torque = 0.2 * diameterM * preloadN; // N.m

    return {
        metrics: {
            'Diâmetro': `${diameterStr} (Passo ${boltInfo.pitch}mm)`,
            'Área Resistente': `${boltInfo.area} mm²`,
            'Classe': boltClassStr,
            'Qtd. Parafusos': `${count}`,
            'Carga de Trabalho': `${(loadkN / count).toFixed(2)} kN/parafuso`,
            'Capacidade Total (Yield)': `${totalYieldLoad.toFixed(1)} kN`,
            'Utilização': `${utilization.toFixed(1)}%`,
            'Status': status,
            'Torque Rec. (Seco)': `${torque.toFixed(1)} N.m`
        },
        steps: [
            `1. IDENTIFICAÇÃO E SELEÇÃO:\n   - Parafuso: ${diameterStr} (Passo ${boltInfo.pitch}mm).\n   - Classe de Resistência: ${boltClassStr} (Primeiro número x 100 = Tensão Ruptura MPa; Segundo número / 10 = Razão Escoamento).\n   - Quantidade: ${count} parafusos.`,
            
            `2. CAPACIDADE INDIVIDUAL:\n   - Área Resistente (Stress Area): ${boltInfo.area} mm².\n   - Carga de Escoamento (Yield): ${yieldLoad.toFixed(1)} kN (ponto onde o parafuso deforma permanentemente).\n   - Carga de Ruptura (Tensile): ${tensileLoad.toFixed(1)} kN.`,
            
            `3. ANÁLISE DO CONJUNTO:\n   - Capacidade Total do Grupo: ${totalYieldLoad.toFixed(1)} kN.\n   - Carga Aplicada: ${loadkN.toFixed(2)} kN.\n   - Taxa de Utilização: ${utilization.toFixed(1)}%. Status: ${status}.`,
            
            `4. MONTAGEM:\n   - Use arruelas planas para distribuir a carga e arruelas de pressão se houver vibração.\n   - Certifique-se de que a rosca esteja limpa e lubrificada (se o torque for calculado para lubrificado) ou seca (se calculado para seco).`,
            
            `5. APERTO (TORQUE):\n   - O aperto correto é fundamental para a resistência à fadiga.\n   - Torque Recomendado (Seco, K=0.2): ${torque.toFixed(1)} N.m.\n   - Use um torquímetro para garantir a pré-carga correta de ${(preload).toFixed(1)} kN por parafuso.`
        ],
        calculated: { 
            diameterStr, boltClassStr, pitch: boltInfo.pitch, diameterMm,
            totalYieldLoad,
            utilization,
            status,
            torque
        }
    };
};
