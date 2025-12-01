import type { DrawerProps } from './types';

export const drawStairs = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const height = Number(data.height) || 0;
    const base = Number(data.base) || 0;
    const numSteps = Number(data.numSteps) || 0;
    const rise = Number(data.rise) || 0;
    const run = Number(data.run) || 0;
    
    const scaleX = (canvas.width - padding * 2) / base;
    const scaleY = (canvas.height - padding * 2) / height;
    const scale = Math.min(scaleX, scaleY);
    
    if (base <= 0 || height <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const startX = cx - (base * scale) / 2;
    const startY = cy + (height * scale) / 2;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    let currentX = startX;
    let currentY = startY;
    
    for (let i = 0; i < numSteps; i++) {
        currentY -= rise * scale;
        ctx.lineTo(currentX, currentY);
        currentX += run * scale;
        ctx.lineTo(currentX, currentY);
    }
    
    ctx.stroke();
    
    ctx.strokeStyle = textMuted + '40';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + base * scale, startY - height * scale);
    ctx.stroke();
    ctx.strokeStyle = accent;

    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    
    ctx.fillText(`H: ${height}`, cx - (base * scale)/2 - 30, cy);
    ctx.fillText(`Base: ${base}`, cx, startY + 20);
    ctx.fillText(`${numSteps} Degraus`, cx, cy - 20);

    // Visual Dimensions for First Step
    if (numSteps > 0) {
        const firstStepX = startX;
        const firstStepY = startY;
        const nextStepX = startX + run * scale;
        const nextStepY = startY - rise * scale;

        // Rise Label
        ctx.beginPath();
        ctx.moveTo(firstStepX - 10, firstStepY);
        ctx.lineTo(firstStepX - 10, nextStepY);
        ctx.stroke();
        // Ticks
        ctx.moveTo(firstStepX - 5, firstStepY);
        ctx.lineTo(firstStepX - 15, firstStepY);
        ctx.moveTo(firstStepX - 5, nextStepY);
        ctx.lineTo(firstStepX - 15, nextStepY);
        ctx.stroke();
        
        ctx.textAlign = 'right';
        ctx.fillText(`E: ${rise.toFixed(1)}`, firstStepX - 20, (firstStepY + nextStepY) / 2);

        // Run Label
        ctx.beginPath();
        ctx.moveTo(firstStepX, nextStepY - 10);
        ctx.lineTo(nextStepX, nextStepY - 10);
        ctx.stroke();
        // Ticks
        ctx.moveTo(firstStepX, nextStepY - 5);
        ctx.lineTo(firstStepX, nextStepY - 15);
        ctx.moveTo(nextStepX, nextStepY - 5);
        ctx.lineTo(nextStepX, nextStepY - 15);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillText(`P: ${run.toFixed(1)}`, (firstStepX + nextStepX) / 2, nextStepY - 20);
    }
    
    ctx.textAlign = 'center';
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = textMuted;
    ctx.fillText(`Espelho (E): ${rise.toFixed(1)}mm | Piso (P): ${run.toFixed(1)}mm`, cx, canvas.height - 20);

    // Enriched Info
    const weight = Number(data.weightKg) || 0;
    const area = Number(data.totalAreaM2) || 0;
    const stringerLen = Number(data.totalStringerLength) || 0;

    ctx.fillStyle = aux;
    ctx.fillText(`Peso Est.: ${weight.toFixed(2)} kg | Área Total: ${area.toFixed(2)} m²`, cx, canvas.height - 5);
    ctx.fillText(`Comp. Banzos: ${(stringerLen/1000).toFixed(2)} m`, cx, canvas.height + 10);
};
