import type { DrawerProps } from './types';

export const drawBracket = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const height = Number(data.height) || 0;
    const base = Number(data.base) || 0;
    const diagonal = Number(data.diagonal) || 0;
    const angleDeg = Number(data.angleDeg) || 0;
    const topAngleDeg = Number(data.topAngleDeg) || 0;
    
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

    const w = base * scale;
    const h = height * scale;
    
    const originX = cx - w / 2;
    const originY = cy - h / 2; 
    
    ctx.beginPath();
    ctx.moveTo(originX, originY - 20);
    ctx.lineTo(originX, originY + h + 20);
    ctx.strokeStyle = textMuted + '40';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(originX, originY); 
    ctx.lineTo(originX + w, originY); 
    ctx.lineTo(originX, originY + h); 
    ctx.closePath(); 
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(originX + w, originY);
    ctx.lineTo(originX, originY + h);
    ctx.stroke();
    
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    
    ctx.fillText(`H: ${height}`, originX - 30, cy);
    ctx.fillText(`B: ${base}`, cx, originY - 10);
    
    if (diagonal !== undefined) {
        ctx.fillText(`D: ${diagonal.toFixed(1)}`, cx + 10, cy + 10);
    }
    
    if (topAngleDeg !== undefined) {
        ctx.fillText(`${topAngleDeg.toFixed(1)}°`, originX + w - 30, originY + 20);
    }
    if (angleDeg !== undefined) {
        ctx.fillText(`${angleDeg.toFixed(1)}°`, originX + 10, originY + h - 10);
    }

    // Enriched Info
    const weight = Number(data.weight) || 0;
    const force = Number(data.forceKg) || 0;
    const stress = Number(data.stressMPa) || 0;
    const maxLoad = Number(data.maxLoadKg) || 0;
    const status = data.status || '';

    ctx.fillStyle = aux;
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(`Peso: ${weight.toFixed(2)} kg | Força: ${force.toFixed(1)} kg`, cx, canvas.height - 20);
    ctx.fillText(`Tensão: ${stress.toFixed(1)} MPa | Carga Máx: ${maxLoad.toFixed(1)} kg`, cx, canvas.height - 5);
    
    if (status) {
        ctx.fillStyle = status === 'Seguro' ? '#22c55e' : '#ef4444';
        ctx.fillText(`Status: ${status}`, cx, canvas.height + 10);
    }
};
