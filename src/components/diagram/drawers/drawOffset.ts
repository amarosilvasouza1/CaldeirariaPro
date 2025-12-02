import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawOffset = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux, line } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const diameter = Number(data.diameter) || 0;
    const offset = Number(data.offset) || 0;
    const run = Number(data.run) || 0;
    const travel = Number(data.travel) || 0;
    const angleDeg = Number(data.angleDeg) || 0;
    const cutAngle = Number(data.cutAngle) || 0;
    
    // Total bounding box
    // We need space for the run + some inlet/outlet stubs
    const stubLength = diameter * 1.5; // Length of the straight parts
    const w_total = run + stubLength * 2; 
    const h_total = offset + diameter; // Center-to-center offset + diameter for thickness
    
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

    // Coordinates
    // Start point (Left Stub Center)
    const startX = cx - (w_total * scale) / 2 + stubLength * scale;
    const startY = cy + (offset * scale) / 2; 
    
    // End point (Right Stub Center)
    const endX = startX + run * scale;
    const endY = startY - offset * scale;

    const d = diameter * scale;
    // const r = d / 2;

    // Helper to draw a pipe segment
    const drawPipe = (x1: number, y1: number, x2: number, y2: number, width: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx);
        
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(angle);
        
        // Gradient for 3D effect (Top to Bottom relative to pipe rotation)
        const grad = ctx.createLinearGradient(0, -width/2, 0, width/2);
        grad.addColorStop(0, '#555'); // Dark edge
        grad.addColorStop(0.2, '#999'); // Highlight
        grad.addColorStop(0.5, '#eee'); // Center shine
        grad.addColorStop(0.8, '#999'); // Shadow
        grad.addColorStop(1, '#555'); // Dark edge
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, -width/2, len, width);
        
        // Border
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.strokeRect(0, -width/2, len, width);
        
        ctx.restore();
    };

    // 1. Inlet Stub (Horizontal Left)
    // Starts at (startX - stubLength, startY) ends at (startX, startY)
    drawPipe(startX - stubLength * scale, startY, startX, startY, d);

    // 2. Outlet Stub (Horizontal Right)
    // Starts at (endX, endY) ends at (endX + stubLength, endY)
    drawPipe(endX, endY, endX + stubLength * scale, endY, d);

    // 3. Travel Piece (Diagonal)
    // Connects (startX, startY) to (endX, endY)
    // We need to handle the mitre joint visually.
    // For simplicity in 2D, we can draw the diagonal pipe on top or below?
    // A true mitre joint is complex to render perfectly in 2D canvas without clipping paths.
    // Let's draw the diagonal pipe, then draw "weld lines" at the joints.
    
    drawPipe(startX, startY, endX, endY, d);

    // Draw Weld/Mitre Lines
    // Joint 1: at (startX, startY)
    // The cut line bisects the angle.
    // Angle between horizontal (0) and diagonal (angleDeg).
    // Bisector is angleDeg / 2.
    // We need to draw a line (ellipse profile) at the joint.
    
    // const drawJoint = (x: number, y: number) => {
    //     ctx.beginPath();
    //     ctx.fillStyle = accent;
    //     ctx.arc(x, y, 3, 0, Math.PI * 2);
    //     ctx.fill();
    // };
    
    // Draw Centerlines (Dashed)
    ctx.beginPath();
    ctx.strokeStyle = textMuted;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    // Horizontal Bottom
    ctx.moveTo(startX - stubLength * scale, startY);
    ctx.lineTo(endX, startY); // Extension for Run dimension
    // Horizontal Top
    ctx.moveTo(startX, endY); // Extension for Run dimension
    ctx.lineTo(endX + stubLength * scale, endY);
    // Vertical extensions for Set
    ctx.moveTo(endX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dimensions
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'center';

    // Run Dimension
    const dimY = startY + d/2 + 20;
    drawArrow(ctx, startX, dimY, endX, dimY, "", textMuted, isMobile);
    ctx.fillText(`Run ${run}`, (startX + endX)/2, dimY + 20);

    // Set Dimension
    // const dimX = endX + stubLength * scale + 20;
    // Draw arrow from endY to startY at x = dimX
    // Actually let's draw it at the cut point or convenient place.
    // Let's use the space between the pipes if possible, or to the right.
    drawArrow(ctx, endX, startY, endX, endY, "", textMuted, isMobile);
    ctx.fillText(`Set ${offset}`, endX + 10, (startY + endY)/2);

    // Travel Dimension (Parallel to diagonal)
    // Calculate midpoint
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    // Offset perpendicular to diagonal
    const perpAngle = Math.atan2(endY - startY, endX - startX) - Math.PI/2;
    const offsetDist = d/2 + 30;
    const labelX = midX + Math.cos(perpAngle) * offsetDist;
    const labelY = midY + Math.sin(perpAngle) * offsetDist;
    
    ctx.save();
    ctx.translate(labelX, labelY);
    ctx.rotate(Math.atan2(endY - startY, endX - startX));
    ctx.fillText(`Travel ${travel.toFixed(1)}`, 0, 0);
    ctx.restore();

    // Angle Label
    ctx.fillStyle = accent;
    ctx.fillText(`${angleDeg.toFixed(1)}°`, startX + 40, startY - 10);

    // Cut Angle Label
    ctx.fillStyle = aux;
    ctx.font = `${baseFontSize - 2}px Inter`;
    ctx.fillText(`Corte: ${cutAngle.toFixed(1)}°`, startX, startY - d - 10);
    ctx.fillText(`Corte: ${cutAngle.toFixed(1)}°`, endX, endY + d + 20);

    // Bottom Info
    ctx.font = `${baseFontSize}px Inter`;
    ctx.fillStyle = textMuted;
    ctx.textAlign = 'center';
    const weight = Number(data.weight) || 0;
    const vol = Number(data.volumeLiters) || 0;
    const cutBack = Number(data.fullCutBack) || 0;
    
    ctx.fillText(`Ø${diameter} | Peso: ${weight.toFixed(2)}kg | Vol: ${vol.toFixed(1)}L | Recuo: ${cutBack.toFixed(1)}mm`, cx, canvas.height - 10);
};
