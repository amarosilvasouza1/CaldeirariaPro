import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawElbow = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux, background } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 30 : 60;

    const radius = Number(data.radius) || 0;
    const angle = Number(data.angle) || 0;
    const diameter = Number(data.diameter) || 0;
    const segments = Number(data.segments) || 0;
    const cutAngle = Number(data.cutAngle) || 0;
    const backLength = Number(data.backLength) || 0;
    const bellyLength = Number(data.bellyLength) || 0;
    const circumference = Number(data.circumference) || 0;
    
    // Layout: Split canvas into Top (3D View) and Bottom (Pattern)
    const viewHeight = canvas.height * 0.6;
    const patternHeight = canvas.height * 0.4;
    const patternYStart = viewHeight + 20;

    // --- 3D VIEW (Top) ---
    
    // Calculate scale to fit the elbow in the top section
    const maxExtent = radius + diameter;
    const scale = Math.min(
        (canvas.width - padding * 2) / maxExtent,
        (viewHeight - padding * 2) / maxExtent
    );

    if (maxExtent <= 0 || !Number.isFinite(scale) || segments < 2) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const curvatureCx = padding + (radius * scale) * 0.2; // Offset from left
    const curvatureCy = viewHeight - padding - (diameter/2 * scale); // Offset from bottom of view

    const r_center = radius * scale;
    const r_outer = (radius + diameter/2) * scale;
    const r_inner = (radius - diameter/2) * scale;

    // Draw Segments
    let currentAngle = 0; // Starting angle (Horizontal Right = 0)
    
    // Loop through segments
    for (let i = 0; i < segments; i++) {
        const isEndSegment = (i === 0 || i === segments - 1);
        const segAngle = isEndSegment ? cutAngle : (cutAngle * 2);
        
        // Joint 1 (Start of segment)
        const angle1 = currentAngle;
        const angle1Rad = (angle1 * Math.PI) / 180;
        
        // Joint 2 (End of segment)
        const angle2 = currentAngle - segAngle;
        const angle2Rad = (angle2 * Math.PI) / 180;
        
        // Coordinates of corners at Joint 1
        const p1_inner_x = curvatureCx + Math.cos(angle1Rad) * r_inner;
        const p1_inner_y = curvatureCy + Math.sin(angle1Rad) * r_inner;
        const p1_outer_x = curvatureCx + Math.cos(angle1Rad) * r_outer;
        const p1_outer_y = curvatureCy + Math.sin(angle1Rad) * r_outer;
        
        // Coordinates of corners at Joint 2
        const p2_inner_x = curvatureCx + Math.cos(angle2Rad) * r_inner;
        const p2_inner_y = curvatureCy + Math.sin(angle2Rad) * r_inner;
        const p2_outer_x = curvatureCx + Math.cos(angle2Rad) * r_outer;
        const p2_outer_y = curvatureCy + Math.sin(angle2Rad) * r_outer;
        
        // Draw Segment Shape
        ctx.beginPath();
        ctx.moveTo(p1_inner_x, p1_inner_y);
        ctx.lineTo(p1_outer_x, p1_outer_y);
        ctx.lineTo(p2_outer_x, p2_outer_y);
        ctx.lineTo(p2_inner_x, p2_inner_y);
        ctx.closePath();
        
        // Gradient for 3D effect
        const grad = ctx.createLinearGradient(p1_inner_x, p1_inner_y, p1_outer_x, p1_outer_y);
        grad.addColorStop(0, '#334155'); // Darker edge
        grad.addColorStop(0.2, '#64748b'); // Highlight
        grad.addColorStop(0.5, '#94a3b8'); // Center shine
        grad.addColorStop(0.8, '#64748b'); // Shadow
        grad.addColorStop(1, '#334155'); // Darker edge
        
        ctx.fillStyle = grad;
        ctx.fill();
        
        // Stroke
        ctx.strokeStyle = textMain;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Weld Lines (Dashed) if not first/last line
        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(p1_inner_x, p1_inner_y);
            ctx.lineTo(p1_outer_x, p1_outer_y);
            ctx.strokeStyle = accent;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        currentAngle -= segAngle;
    }

    // Dimensions for 3D View
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    
    // Radius Label
    drawArrow(ctx, curvatureCx, curvatureCy, curvatureCx + r_center, curvatureCy, "", textMuted, isMobile);
    ctx.fillText(`R ${radius}`, curvatureCx + r_center / 2, curvatureCy + 15);
    
    // Angle Label
    ctx.fillText(`${angle}°`, curvatureCx + r_outer + 20, curvatureCy - r_outer/2);

    // --- PATTERN VIEW (Bottom) ---
    // Draw the development of a MIDDLE SEGMENT (Gomo Inteiro)
    
    const patX = padding;
    const patY = patternYStart + 40;
    const patW = canvas.width - padding * 2;
    const patH = patternHeight - 60;
    
    // Scale for pattern
    const scalePatX = patW / circumference;
    const finalScalePatY = Math.min(scalePatX, patH / backLength);
    
    const drawPatW = circumference * scalePatX;
    const drawPatH = backLength * finalScalePatY; // Max height (Costas)
    const drawBellyH = bellyLength * finalScalePatY; // Min height (Ventre)
    
    // Draw Rectangle Background
    ctx.fillStyle = background; // Darker bg for pattern
    ctx.fillRect(patX, patY, drawPatW, drawPatH + 20); // +20 for margin
    
    // Draw Centerline (Axis)
    ctx.beginPath();
    ctx.moveTo(patX, patY + drawPatH/2);
    ctx.lineTo(patX + drawPatW, patY + drawPatH/2);
    ctx.strokeStyle = textMuted + '40';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw Sine Wave (The Cut)
    ctx.beginPath();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    
    // Top Curve
    for (let i = 0; i <= 360; i+=5) {
        const x = patX + (i / 360) * drawPatW;
        const rad = (i * Math.PI) / 180;
        const h_at_angle = drawBellyH + (drawPatH - drawBellyH) * ((1 - Math.cos(rad)) / 2);
        
        if (i===0) ctx.moveTo(x, patY + (drawPatH - h_at_angle)/2);
        else ctx.lineTo(x, patY + (drawPatH - h_at_angle)/2);
    }
    ctx.stroke();
    
    // Bottom Curve
    ctx.beginPath();
    for (let i = 0; i <= 360; i+=5) {
        const x = patX + (i / 360) * drawPatW;
        const rad = (i * Math.PI) / 180;
        const h_at_angle = drawBellyH + (drawPatH - drawBellyH) * ((1 - Math.cos(rad)) / 2);
        
        if (i===0) ctx.moveTo(x, patY + drawPatH - (drawPatH - h_at_angle)/2);
        else ctx.lineTo(x, patY + drawPatH - (drawPatH - h_at_angle)/2);
    }
    ctx.stroke();
    
    // Connect ends
    ctx.beginPath();
    ctx.moveTo(patX, patY + (drawPatH - drawBellyH)/2);
    ctx.lineTo(patX, patY + drawPatH - (drawPatH - drawBellyH)/2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(patX + drawPatW, patY + (drawPatH - drawBellyH)/2);
    ctx.lineTo(patX + drawPatW, patY + drawPatH - (drawPatH - drawBellyH)/2);
    ctx.stroke();

    // Labels for Pattern
    ctx.fillStyle = textMain;
    ctx.textAlign = 'left';
    ctx.fillText('Gabarito (Gomo Inteiro)', patX, patY - 10);
    
    ctx.textAlign = 'center';
    ctx.fillStyle = aux;
    ctx.fillText(`Costas: ${backLength.toFixed(1)}`, patX + drawPatW/2, patY + drawPatH + 15);
    ctx.fillText(`Ventre: ${bellyLength.toFixed(1)}`, patX, patY + drawPatH + 15);
    ctx.fillText(`Perímetro: ${circumference.toFixed(1)}`, patX + drawPatW/2, patY + drawPatH + 35);
    
    // Grid lines (12 divisions)
    ctx.strokeStyle = textMuted + '20';
    ctx.lineWidth = 1;
    for (let i = 1; i < 12; i++) {
        const x = patX + (i / 12) * drawPatW;
        ctx.beginPath();
        ctx.moveTo(x, patY);
        ctx.lineTo(x, patY + drawPatH);
        ctx.stroke();
    }
};
