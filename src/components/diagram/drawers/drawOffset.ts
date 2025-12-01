import type { DrawerProps } from './types';

export const drawOffset = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const diameter = Number(data.diameter) || 0;
    const offset = Number(data.offset) || 0;
    const run = Number(data.run) || 0;
    const travel = Number(data.travel) || 0;
    const angleDeg = Number(data.angleDeg) || 0;
    
    const w_total = run + diameter * 2; 
    const h_total = offset + diameter * 2;
    
    const scale = Math.min(
        (canvas.width - padding * 2) / w_total,
        (canvas.height - padding * 2) / h_total
    );

    if (w_total <= 0 || h_total <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const startX = cx - (run * scale) / 2;
    const startY = cy + (offset * scale) / 2; 
    
    const d = diameter * scale;
    
    ctx.strokeStyle = textMuted + '40';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY); 
    ctx.lineTo(startX + run * scale, startY); 
    ctx.lineTo(startX + run * scale, startY - offset * scale); 
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + run * scale, startY - offset * scale);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    
    const stub = 40;
    ctx.beginPath();
    ctx.moveTo(startX - stub, startY - d/2);
    ctx.lineTo(startX, startY - d/2); 
    ctx.moveTo(startX - stub, startY + d/2);
    ctx.lineTo(startX, startY + d/2); 
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(startX + run * scale, startY - offset * scale - d/2);
    ctx.lineTo(startX + run * scale + stub, startY - offset * scale - d/2);
    ctx.moveTo(startX + run * scale, startY - offset * scale + d/2);
    ctx.lineTo(startX + run * scale + stub, startY - offset * scale + d/2);
    ctx.stroke();

    const angleRad = (angleDeg * Math.PI) / 180;
    const dx = Math.sin(angleRad) * (d/2);
    const dy = Math.cos(angleRad) * (d/2);
    
    ctx.beginPath();
    ctx.moveTo(startX - dx, startY - dy); 
    ctx.lineTo(startX + run * scale - dx, startY - offset * scale - dy);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(startX + dx, startY + dy);
    ctx.lineTo(startX + run * scale + dx, startY - offset * scale + dy);
    ctx.stroke();
    
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    
    ctx.fillText(`Run: ${run}`, cx, startY + 20);
    ctx.fillText(`Set: ${offset}`, startX + run * scale + 10, cy);
    ctx.fillText(`Travel: ${travel.toFixed(1)}`, cx - 20, cy - 20);
    ctx.fillText(`${angleDeg.toFixed(1)}°`, startX + 30, startY - 10);

    // Extra Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = textMuted;
    const thickness = inputs ? Number(inputs.thickness) : 0;
    ctx.fillText(`Ø: ${diameter}mm | Esp: ${thickness}mm`, cx, canvas.height - 20);

    // Enriched Info
    const weight = Number(data.weight) || 0;
    const vol = Number(data.volumeLiters) || 0;
    const cutAng = Number(data.cutAngle) || 0;
    const cutBack = Number(data.fullCutBack) || 0;

    ctx.fillStyle = aux;
    ctx.fillText(`Peso: ${weight.toFixed(2)} kg | Vol: ${vol.toFixed(1)} L | Âng. Corte: ${cutAng.toFixed(1)}°`, cx, canvas.height - 5);
    ctx.fillText(`Recuo (CutBack): ${cutBack.toFixed(1)} mm`, cx, canvas.height + 10);
};
