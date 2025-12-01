import type { DrawerProps } from './types';

export const drawPlateWeight = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const width = Number(data.width) || 0;
    const length = Number(data.length) || 0;
    const thickness = Number(data.thickness) || 0;
    
    const scaleX = (canvas.width - padding * 2) / width;
    const scaleY = (canvas.height - padding * 2) / length; 
    const scale = Math.min(scaleX, scaleY);
    
    if (width <= 0 || length <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const w = width * scale;
    const h = length * scale;
    
    ctx.fillStyle = textMuted + '20';
    ctx.fillRect(cx - w/2, cy - h/2, w, h);
    
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - w/2, cy - h/2, w, h);
    
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    
    ctx.fillText(`L: ${width}mm`, cx, cy - h/2 - 10);
    
    ctx.save();
    ctx.translate(cx + w/2 + 15, cy);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`C: ${length}mm`, 0, 0);
    ctx.restore();
    
    ctx.fillText(`E: ${thickness}mm`, cx, cy);
    
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = textMuted;
    const qty = inputs ? inputs.quantity : 1;
    ctx.fillText(`Qtd: ${qty} | Peso Total: ${(Number(data.totalWeight) || 0).toFixed(2)} kg`, cx, canvas.height - 35); // Adjusted Y

    // Enriched Info
    const totalWeight = Number(data.totalWeightKg) || 0;
    const totalArea = Number(data.totalAreaM2) || 0;
    const vol = Number(data.volumeDm3) || 0;

    ctx.fillStyle = aux;
    ctx.fillText(`Peso Total: ${totalWeight.toFixed(2)} kg`, cx, canvas.height - 20);
    ctx.fillText(`Área Total: ${totalArea.toFixed(2)} m² | Vol: ${vol.toFixed(2)} dm³`, cx, canvas.height - 5);
};
