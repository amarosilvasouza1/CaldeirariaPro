import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawArcCalculator = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMuted, accent, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const chord = Number(data.chord) || 0;
    const sagitta = Number(data.sagitta) || 0;
    const radius = Number(data.radius) || 0;
    const angleDeg = Number(data.angleDeg) || 0;

    // We want to draw the arc.
    // Bounding box depends on the arc shape.
    // If angle is small, it's wide and short.
    // If angle is large (>180), it's tall.
    
    // Let's limit the drawing to the arc itself + center point if feasible.
    
    const scaleX = (canvas.width - padding * 2) / (chord * 1.2);
    const scaleY = (canvas.height - padding * 2) / (sagitta * 3); // Give space for radius line
    const scale = Math.min(scaleX, scaleY);

    if (chord <= 0 || sagitta <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const r_scaled = radius * scale;
    const c_scaled = chord * scale;
    const h_scaled = sagitta * scale;
    
    // Center of the circle relative to the chord midpoint
    // The chord is horizontal.
    // Chord midpoint at (cx, cy_chord)
    // Circle center is at (cx, cy_chord + (radius - sagitta)) if drawing arc upwards
    // Let's draw arc upwards like a bridge.
    
    const arcTopY = cy - h_scaled / 2;
    const chordY = arcTopY + h_scaled;
    const circleCenterY = chordY + (r_scaled - h_scaled);
    
    // Draw Arc

    
    // Adjust angles because canvas Y is inverted (down is positive)
    // Top of circle is -PI/2.
    // We want the top segment.
    const centerAngle = -Math.PI / 2;
    const halfAngleRad = (angleDeg * Math.PI / 180) / 2;
    
    ctx.beginPath();
    ctx.arc(cx, circleCenterY, r_scaled, centerAngle - halfAngleRad, centerAngle + halfAngleRad);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw Chord
    const chordStartX = cx - c_scaled / 2;
    const chordEndX = cx + c_scaled / 2;
    
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(chordStartX, chordY);
    ctx.lineTo(chordEndX, chordY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw Sagitta (Height)
    drawArrow(ctx, cx, chordY, cx, arcTopY, "", dim, isMobile);
    ctx.fillStyle = dim;
    ctx.fillText(`h = ${sagitta}`, cx + 10, (chordY + arcTopY) / 2);
    
    // Draw Radius
    ctx.strokeStyle = aux;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(cx, circleCenterY);
    ctx.lineTo(chordEndX, chordY); // To end of chord
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillText(`R = ${radius.toFixed(1)}`, cx + c_scaled/4, circleCenterY - r_scaled/2);

    // Draw Center Point
    ctx.beginPath();
    ctx.arc(cx, circleCenterY, 3, 0, Math.PI*2);
    ctx.fillStyle = dim;
    ctx.fill();

    // Dimensions
    // Chord
    drawArrow(ctx, chordStartX, chordY + 20, chordEndX, chordY + 20, `Corda = ${chord}`, dim, isMobile);

    // Enriched Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = aux;
    ctx.textAlign = 'center';
    ctx.fillText(`Raio: ${radius.toFixed(1)} mm | Perímetro: ${(Number(data.arcLength)||0).toFixed(1)} mm | Ângulo: ${angleDeg.toFixed(1)}°`, cx, canvas.height - 20);
};
