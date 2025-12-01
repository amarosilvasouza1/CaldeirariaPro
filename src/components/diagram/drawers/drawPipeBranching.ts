import type { DrawerProps } from './types';

export const drawPipeBranching = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const headerDiameter = Number(data.headerDiameter) || 0;
    const branchDiameter = Number(data.branchDiameter) || 0;
    const angleDeg = Number(data.angleDeg) || 90;
    const points = ((data.points as unknown) as { angle: number; height: number }[]) || [];

    // Layout: 3D View (Left) and Pattern (Right)
    const viewGap = 50;
    const view3DWidth = headerDiameter * 1.5;
    const patternWidth = Number(data.branchCircumference) || (branchDiameter * Math.PI);
    const maxCutHeight = Math.max(...points.map(p => p.height), 0);
    const patternHeight = maxCutHeight * 1.5 + 50;

    const totalWidth = view3DWidth + viewGap + patternWidth;
    const totalHeight = Math.max(headerDiameter * 1.5, patternHeight);

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

    const startX = cx - (totalWidth * scale) / 2;
    const centerY = cy;

    // --- 3D VIEW (Simplified) ---
    const view3DX = startX + (view3DWidth * scale) / 2;
    const R = (headerDiameter / 2) * scale;
    const r = (branchDiameter / 2) * scale;
    
    // Header Pipe (Horizontal)
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(view3DX, centerY, R/3, R, 0, 0, 2 * Math.PI); // Side profile
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(view3DX, centerY - R);
    ctx.lineTo(view3DX + R * 2, centerY - R);
    ctx.moveTo(view3DX, centerY + R);
    ctx.lineTo(view3DX + R * 2, centerY + R);
    ctx.stroke();

    // Branch Pipe (Vertical-ish)
    const branchH = R * 1.5;
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Calculate start point on header surface (approx)
    const branchBaseX = view3DX + R; 
    const branchBaseY = centerY - R * 0.5; // Simplified intersection point

    const branchEndX = branchBaseX + Math.cos(angleRad - Math.PI/2) * branchH;
    const branchEndY = branchBaseY + Math.sin(angleRad - Math.PI/2) * branchH;

    ctx.strokeStyle = accent;
    ctx.beginPath();
    ctx.moveTo(branchBaseX - r, branchBaseY);
    ctx.lineTo(branchEndX - r, branchEndY);
    ctx.lineTo(branchEndX + r, branchEndY);
    ctx.lineTo(branchBaseX + r, branchBaseY);
    ctx.stroke();
    
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("VISTA 3D", view3DX + R, centerY + R + 30);


    // --- PATTERN VIEW ---
    const patternX = startX + (view3DWidth * scale) + (viewGap * scale);
    const patternY = centerY - (patternHeight * scale) / 2;
    const w_pat = patternWidth * scale;
    
    // Draw Baseline
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(patternX, patternY + maxCutHeight * scale + 20);
    ctx.lineTo(patternX + w_pat, patternY + maxCutHeight * scale + 20);
    ctx.stroke();

    // Draw Curve
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const stepX = w_pat / (points.length - 1);
    
    points.forEach((p, i) => {
        const px = patternX + i * stepX;
        const py = patternY + (maxCutHeight - p.height) * scale; // Invert Y for canvas
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        
        // Vertical lines (ordinates)
        ctx.strokeStyle = aux;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, patternY + maxCutHeight * scale + 20);
        ctx.lineTo(px, py);
        ctx.stroke();
        
        // Labels for key points
        if (i % 3 === 0) {
            ctx.fillStyle = dim;
            ctx.font = `${baseFontSize - 2}px Inter`;
            ctx.fillText(p.height.toFixed(1), px, py - 5);
        }
    });
    
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke(); // Draw the curve

    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("GABARITO DE CORTE", patternX + w_pat / 2, patternY + maxCutHeight * scale + 50);

    // Enriched Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = aux;
    ctx.fillText(`DADOS: Principal Ø${headerDiameter} | Derivação Ø${branchDiameter} | Ângulo ${angleDeg}°`, cx, canvas.height - 20);
};
