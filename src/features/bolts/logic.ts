import type { ShapeData, CalcResult } from '../../types';
import { BOLT_DATA, BOLT_CLASSES } from '../../utils/constants';

export const calculateBolts = (data: ShapeData, _material: string = 'steel'): CalcResult => {
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
            `IDENTIFICAÇÃO: Parafuso ${diameterStr} Classe ${boltClassStr} (${count} unidades).`,
            `RESISTÊNCIA: Cada parafuso suporta ${yieldLoad.toFixed(1)} kN no escoamento e ${tensileLoad.toFixed(1)} kN na ruptura.`,
            `CAPACIDADE: O conjunto suporta até ${totalYieldLoad.toFixed(1)} kN (Escoamento).`,
            `ANÁLISE: Carga aplicada de ${loadkN.toFixed(2)} kN. Utilização de ${utilization.toFixed(1)}%. Status: ${status}.`,
            `MONTAGEM: Aplique torque de ${torque.toFixed(1)} N.m (seco) para garantir pré-carga correta.`
        ],
        calculated: { diameterStr, boltClassStr, pitch: boltInfo.pitch, diameterMm }
    };
};
