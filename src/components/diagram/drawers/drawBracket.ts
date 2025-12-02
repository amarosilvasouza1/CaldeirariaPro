import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawBracket = ({ ctx, canvas, data, baseFontSize, colors }: DrawerProps) => {
    const { textMain, textMuted, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = 60;

    const base = Number(data.base) || 0;
    const height = Number(data.height) || 0;
    const thickness = Number(data.thickness) || 0;
    const holeDiameter = Number(data.holeDiameter) || 0;

    const maxDim = Math.max(base, height);
    const scale = Math.min(
        (canvas.width - padding * 2) / maxDim,
        (canvas.height - padding * 2) / maxDim
    );

    if (base <= 0 || height <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const w = base * scale;
    const h = height * scale;
    const t = thickness * scale;
    const holeR = (holeDiameter / 2) * scale;

    const startX = cx - w / 2;
    const startY = cy + h / 2;

    // Draw L-Shape (Side View)
    ctx.beginPath();
    ctx.moveTo(startX, startY - h); // Top Left (Top of vertical leg)
    ctx.lineTo(startX + t, startY - h); // Right side of vertical leg top
    ctx.lineTo(startX + t, startY - t); // Inner corner
    ctx.lineTo(startX + w, startY - t); // Right end of horizontal leg top
    ctx.lineTo(startX + w, startY); // Bottom Right
    ctx.lineTo(startX, startY); // Bottom Left (Corner)
    ctx.closePath();

    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Hole (if present) - Represented as dashed lines on the horizontal leg
    if (holeDiameter > 0) {
        const holeCenterX = startX + w / 2; // Assumed centered
        
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = textMuted;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(holeCenterX - holeR, startY - t);
        ctx.lineTo(holeCenterX - holeR, startY);
        ctx.moveTo(holeCenterX + holeR, startY - t);
        ctx.lineTo(holeCenterX + holeR, startY);
        ctx.stroke();
        
        ctx.setLineDash([]);

        // Center line
        ctx.beginPath();
        ctx.moveTo(holeCenterX, startY - t - 10);
        ctx.lineTo(holeCenterX, startY + 10);
        ctx.setLineDash([10, 5, 2, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Dimensions
    // Height
    drawArrow(ctx, startX - 20, startY, startX - 20, startY - h, `H: ${height}`, dim, false);
    
    // Base
    drawArrow(ctx, startX, startY + 20, startX + w, startY + 20, `B: ${base}`, dim, false);

    // Thickness
    drawArrow(ctx, startX + w + 10, startY - t, startX + w + 10, startY, `e: ${thickness}`, dim, false);

    // Title
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize + 2}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText('Mão Francesa (Perfil L)', cx, startY + 60);
};
