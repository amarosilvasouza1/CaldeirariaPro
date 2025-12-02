import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawStairs = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux, line } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const height = Number(data.height) || 0;
    const base = Number(data.base) || 0;
    const steps = Number(data.steps) || 0;
    const rise = Number(data.rise) || 0;
    const run = Number(data.run) || 0;
    
    // Scale calculation
    // We need to fit 'base' width and 'height' height
    const scaleX = (canvas.width - padding * 2) / base;
    const scaleY = (canvas.height - padding * 2) / height;
    const scale = Math.min(scaleX, scaleY);
    
    if (base <= 0 || height <= 0 || steps < 1 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    // Start point (Bottom Left)
    // We draw from Bottom-Left to Top-Right
    const startX = cx - (base * scale) / 2;
    const startY = cy + (height * scale) / 2;
    
    // Draw Stringer (Banzo) - Simplified as a line or thick bar
    ctx.beginPath();
    ctx.strokeStyle = textMuted;
    ctx.lineWidth = 4;
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + base * scale, startY - height * scale);
    ctx.stroke();
    
    // Draw Steps (Zig-Zag)
    ctx.beginPath();
    ctx.strokeStyle = line; // Bright line for steps
    ctx.lineWidth = 2;
    
    let currentX = startX;
    let currentY = startY;
    
    // Draw the profile
    // Start at bottom floor.
    // First riser up? Or first tread?
    // Usually starts with Riser UP, then Tread ACROSS.
    
    ctx.moveTo(startX, startY);
    
    for (let i = 0; i < steps; i++) {
        // Riser UP
        currentY -= rise * scale;
        ctx.lineTo(currentX, currentY);
        
        // Tread ACROSS (except maybe last one if it's the floor level? Logic says run = base/(steps-1))
        // If we have N steps, we have N risers.
        // We have N-1 treads usually if top is flush.
        
        if (i < steps - 1) {
            currentX += run * scale;
            ctx.lineTo(currentX, currentY);
        } else {
            // Last step (landing)
            // Draw a small landing or just end at the top point
            // The logic `base` covers the total horizontal span.
            // If run = base / (steps-1), then (steps-1)*run = base.
            // So we end exactly at startX + base.
        }
    }
    ctx.stroke();
    
    // Draw Dimensions
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    
    // Height Dimension
    const dimX = startX - 40;
    drawArrow(ctx, dimX, startY, dimX, startY - height * scale, "", textMuted, isMobile);
    ctx.fillText(`H ${height}`, dimX - 10, cy);
    
    // Base Dimension
    const dimY = startY + 40;
    drawArrow(ctx, startX, dimY, startX + base * scale, dimY, "", textMuted, isMobile);
    ctx.fillText(`Base ${base}`, cx, dimY + 20);
    
    // Detail Zoom (Magnified Step)
    // Draw a magnified view of a single step to show Rise/Run clearly
    const zoomSize = 120;
    const zoomX = cx + (base * scale) / 2 + 60; // Right side
    const zoomY = cy;
    
    // Only draw if there's space
    if (!isMobile && zoomX + zoomSize < canvas.width) {
        // Circle container
        ctx.beginPath();
        ctx.arc(zoomX, zoomY, zoomSize/2, 0, Math.PI * 2);
        ctx.fillStyle = colors.background; // Clear background
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw one step inside
        const zScale = 0.5; // Arbitrary scale for the icon
        const zRise = 40;
        const zRun = 40;
        
        const zCx = zoomX;
        const zCy = zoomY + 20;
        
        ctx.beginPath();
        ctx.strokeStyle = line;
        ctx.lineWidth = 3;
        ctx.moveTo(zCx - zRun, zCy);
        ctx.lineTo(zCx - zRun, zCy - zRise); // Up
        ctx.lineTo(zCx, zCy - zRise); // Across
        ctx.stroke();
        
        // Labels inside zoom
        ctx.fillStyle = accent;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'right';
        ctx.fillText(`E ${rise.toFixed(1)}`, zCx - zRun - 5, zCy - zRise/2);
        ctx.textAlign = 'center';
        ctx.fillText(`P ${run.toFixed(1)}`, zCx - zRun/2, zCy - zRise - 5);
        
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize-2}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText("Detalhe Degrau", zoomX, zoomY + zoomSize/2 + 15);
    }
    
    // Bottom Info
    ctx.textAlign = 'center';
    ctx.font = `${baseFontSize}px Inter`;
    ctx.fillStyle = aux;
    const weight = Number(data.totalWeight) || 0;
    ctx.fillText(`Peso Est.: ${weight.toFixed(2)} kg | ${steps} Degraus`, cx, canvas.height - 20);
};
