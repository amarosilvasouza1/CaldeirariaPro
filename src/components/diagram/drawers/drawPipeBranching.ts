import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawPipeBranching = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const headerDiameter = Number(data.headerDiameter) || 0;
    const branchDiameter = Number(data.branchDiameter) || 0;
    const angleDeg = Number(data.angleDeg) || 90;
    const points = ((data.points as unknown) as { angle: number; height: number }[]) || [];
    const material = inputs?.material ? String(inputs.material) : 'steel';

    // Layout: 3D View (Left) and Pattern (Right)
    const viewGap = 50;
    const view3DWidth = headerDiameter * 2.5; // More space for 3D
    const patternWidth = Number(data.branchCircumference) || (branchDiameter * Math.PI);
    const maxCutHeight = Math.max(...points.map(p => p.height), 0);
    const patternHeight = maxCutHeight * 1.5 + 100;

    const totalWidth = view3DWidth + viewGap + patternWidth;
    const totalHeight = Math.max(headerDiameter * 2, patternHeight);

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

    // --- MATERIAL GRADIENT HELPER ---
    const createPipeGradient = (x: number, y: number, width: number, angle: number, length: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        const grad = ctx.createLinearGradient(0, -width/2, 0, width/2);
        
        const addStops = (stops: [number, string][]) => {
            stops.forEach(([pos, color]) => grad.addColorStop(pos, color));
        };

        switch (material) {
            case 'stainless':
                addStops([[0, '#99a'], [0.2, '#dde'], [0.5, '#fff'], [0.8, '#dde'], [1, '#99a']]); break;
            case 'aluminum':
                addStops([[0, '#ccc'], [0.3, '#eee'], [0.6, '#ddd'], [1, '#ccc']]); break;
            case 'copper':
                addStops([[0, '#b87333'], [0.3, '#ffa07a'], [0.5, '#ffc896'], [0.7, '#b87333'], [1, '#8b4513']]); break;
            case 'brass':
                addStops([[0, '#b5a642'], [0.3, '#fff064'], [0.5, '#ffffb4'], [0.7, '#b5a642'], [1, '#b8860b']]); break;
            case 'galvanized':
                addStops([[0, '#ccc'], [0.2, '#eef'], [0.4, '#bbb'], [0.6, '#dde'], [0.8, '#bbb'], [1, '#ccc']]); break;
            case 'nylon':
                addStops([[0, '#f5f5eb'], [0.5, '#fffffa'], [1, '#f0f0e6']]); break;
            case 'cast_iron':
                addStops([[0, '#3c3c3c'], [0.5, '#646464'], [1, '#323232']]); break;
            default: // steel
                addStops([[0, '#555'], [0.2, '#999'], [0.5, '#eee'], [0.8, '#999'], [1, '#555']]); break;
        }
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, -width/2, length, width);
        
        // Border
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -width/2, length, width);
        
        ctx.restore();
    };

    // --- 3D VIEW ---
    const view3DX = startX + (view3DWidth * scale) / 2;
    const R = (headerDiameter / 2) * scale;
    const r = (branchDiameter / 2) * scale;
    
    // Header Pipe (Horizontal)
    // Draw it as a cylinder
    const headerLen = headerDiameter * 2.5 * scale;
    createPipeGradient(view3DX - headerLen/2, centerY, R*2, 0, headerLen);
    
    // Branch Pipe
    const branchH = R * 2.5; // Length of branch stub
    const angleRad = (angleDeg * Math.PI) / 180;
    
    // Calculate intersection point on top of header
    // Ideally we draw the branch "behind" or "on top" depending on perspective.
    // Let's draw it "on top" (coming out of the page or just intersecting).
    // For a side view (2D projection of 3D), the intersection is complex.
    // Simplified: Draw branch coming from the center-ish.
    
    const branchBaseX = view3DX; 
    const branchBaseY = centerY - R * 0.8; // Slightly embedded

    // We need to rotate the branch by (90 - angle) relative to vertical?
    // angleDeg is usually the angle between axes.
    // If angle is 90, it's vertical.
    // Rotation for createPipeGradient is in radians. 0 is horizontal right.
    // So 90 deg (vertical up) is -PI/2.
    // The input angle is likely the angle between the pipe axes.
    // If angle is 90, branch is perpendicular.
    // If angle is 45, branch is tilted.
    
    // Let's assume angle is from the header axis (0 deg).
    // So 90 is vertical.
    // const drawAngle = -angleRad; // Negative for canvas Y up
    
    // We need to draw the branch *after* the header if it's "in front", or handle intersection.
    // Simple painter's algorithm: Header first, then Branch (looks like it's welded on top).
    
    // Draw Branch
    // We want the cut end to conform to the header.
    // This is hard to mask perfectly in 2D canvas without clipping.
    // We will draw the branch cylinder, and then redraw the header part that overlaps?
    // Or just draw the branch and let it overlap (welded on top).
    
    // Branch start point (the cut end)
    // We'll draw it from the intersection point outwards.
    
    createPipeGradient(branchBaseX, branchBaseY, r*2, Math.PI - angleRad, branchH);

    // Draw Weld Bead at intersection
    ctx.beginPath();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    // Ellipse-ish shape at the base of the branch
    // This is a rough approximation of the saddle
    const weldX = branchBaseX + Math.cos(Math.PI - angleRad) * 5;
    const weldY = branchBaseY + Math.sin(Math.PI - angleRad) * 5;
    
    ctx.save();
    ctx.translate(weldX, weldY);
    ctx.rotate(Math.PI - angleRad);
    ctx.scale(1, 0.5); // Flatten circle to look like ellipse
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.restore();
    ctx.stroke();

    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("VISTA 3D", view3DX, centerY + R + 40);


    // --- PATTERN VIEW (GABARITO) ---
    const patternX = startX + (view3DWidth * scale) + (viewGap * scale);
    const patternY = centerY - (patternHeight * scale) / 2;
    const w_pat = patternWidth * scale;
    
    // Draw Grid Background
    ctx.strokeStyle = line + '40'; // Transparent line
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    const stepX = w_pat / (points.length - 1);
    points.forEach((_, i) => {
        const px = patternX + i * stepX;
        ctx.beginPath();
        ctx.moveTo(px, patternY);
        ctx.lineTo(px, patternY + maxCutHeight * scale + 40);
        ctx.stroke();
    });

    // Draw Baseline
    const baselineY = patternY + maxCutHeight * scale + 20;
    ctx.strokeStyle = textMain;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(patternX, baselineY);
    ctx.lineTo(patternX + w_pat, baselineY);
    ctx.stroke();

    // Draw Curve
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    points.forEach((p, i) => {
        const px = patternX + i * stepX;
        const py = baselineY - p.height * scale; // Height is up from baseline
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        
        // Draw points
        ctx.fillStyle = accent;
        ctx.fillRect(px - 2, py - 2, 4, 4);
        
        // Labels for key points (every 3rd)
        if (i % 3 === 0 || i === points.length - 1) {
            ctx.fillStyle = dim;
            ctx.font = `${baseFontSize - 2}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(p.height.toFixed(1), px, py - 10);
            
            // Angle label at bottom
            ctx.fillStyle = textMuted;
            ctx.fillText(`${p.angle.toFixed(0)}°`, px, baselineY + 15);
        }
    });
    
    ctx.stroke();

    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("GABARITO DE CORTE (DESENVOLVIMENTO)", patternX + w_pat / 2, baselineY + 50);

    // Dimensions for Pattern
    // Total Length
    drawArrow(ctx, patternX, baselineY + 30, patternX + w_pat, baselineY + 30, `Perímetro: ${patternWidth.toFixed(1)} mm`, dim, isMobile);

    // Enriched Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = aux;
    ctx.textAlign = 'center';
    ctx.fillText(`DADOS: Principal Ø${headerDiameter} | Derivação Ø${branchDiameter} | Ângulo ${angleDeg}°`, cx, canvas.height - 10);
};
