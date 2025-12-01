import type { DrawerProps } from './types';

export const drawBolts = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const diameterMm = Number(data.diameterMm) || 0;
    const pitch = Number(data.pitch) || 0;
    
    const length = diameterMm * 4;
    const headHeight = diameterMm * 0.7;
    const headWidth = diameterMm * 1.6; 
    
    const totalWidth = length + headHeight;
    const totalHeight = headWidth;
    
    const scale = Math.min(
        (canvas.width - padding * 2) / totalWidth,
        (canvas.height - padding * 2) / totalHeight
    );

    if (totalWidth <= 0 || totalHeight <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }
    
    const d = diameterMm * scale;
    const l = length * scale;
    const hh = headHeight * scale;
    const hw = headWidth * scale;
    
    const startX = cx - (l + hh) / 2;

    ctx.fillStyle = textMuted + '40';
    ctx.fillRect(startX, cy - hw/2, hh, hw);
    ctx.strokeRect(startX, cy - hw/2, hh, hw);
    
    ctx.fillStyle = textMuted + '20';
    ctx.fillRect(startX + hh, cy - d/2, l, d);
    ctx.strokeRect(startX + hh, cy - d/2, l, d);
    
    ctx.beginPath();
    const threadStart = startX + hh + l * 0.3; 
    const threadPitch = pitch * scale; 
    const visualPitch = Math.max(threadPitch, 5);
    
    for (let x = threadStart; x < startX + hh + l; x += visualPitch) {
        ctx.moveTo(x, cy - d/2);
        ctx.lineTo(x, cy + d/2);
    }
    ctx.strokeStyle = textMuted + '60';
    ctx.stroke();
    
    ctx.strokeStyle = accent;
    
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    
    ctx.fillText(`Ø${diameterMm}`, cx + hh/2, cy - d/2 - 10);
    ctx.fillText(`Passo: ${pitch}mm`, cx + hh/2, cy + d/2 + 20);
    
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = textMuted;
    const boltClass = inputs ? inputs.boltClass : '';
    ctx.fillText(`Classe: ${boltClass} | Comp: ${length}mm (aprox)`, cx, canvas.height - 35); // Adjusted Y

    // Enriched Info
    const yieldLoad = Number(data.totalYieldLoad) || 0;
    const torque = Number(data.torque) || 0;
    const status = data.status || '';
    const util = Number(data.utilization) || 0;

    ctx.fillStyle = aux;
    ctx.fillText(`Carga Escoamento: ${yieldLoad.toFixed(0)} kg | Torque: ${torque.toFixed(1)} Nm`, cx, canvas.height - 20);
    ctx.fillText(`Utilização: ${util.toFixed(1)}%`, cx, canvas.height - 5);

    if (status) {
        ctx.fillStyle = status === 'Seguro' ? '#22c55e' : '#ef4444';
        ctx.fillText(`Status: ${status}`, cx, canvas.height + 10);
    }
};
