import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawCone = ({ ctx, canvas, data, inputs, baseFontSize, colors }: DrawerProps) => {
    const { textMain, textMuted, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = 80; // Fixed large padding for consistent rendering

    const labelOffset = 20;

    const R_dev = Number(data.R_dev) || 0;
    const r_dev = Number(data.r_dev) || 0;
    const theta = Number(data.theta) || 0;
    const d1 = inputs ? Number(inputs.d1) : 0;
    const d2 = inputs ? Number(inputs.d2) : 0;
    const h_input = inputs ? Number(inputs.height) : 0;
    
    // Calculate Chord (Corda)
    const corda = 2 * R_dev * Math.sin((theta * Math.PI / 180) / 2);

    // Calculate Bounding Box for the Sector
    const startAngle = (Math.PI * 1.5) - (theta * Math.PI / 180) / 2;
    const endAngle = startAngle + (theta * Math.PI / 180);
    
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    const addPoint = (x: number, y: number) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    };

    // Include Apex (0,0) in bounding box to ensure it's visible
    addPoint(0, 0);

    // Corners
    addPoint(Math.cos(startAngle) * R_dev, Math.sin(startAngle) * R_dev);
    addPoint(Math.cos(endAngle) * R_dev, Math.sin(endAngle) * R_dev);
    addPoint(Math.cos(startAngle) * r_dev, Math.sin(startAngle) * r_dev);
    addPoint(Math.cos(endAngle) * r_dev, Math.sin(endAngle) * r_dev);

    const checkAngle = (angle: number) => {
        let nStart = startAngle % (2 * Math.PI);
        if (nStart < 0) nStart += 2 * Math.PI;
        let nEnd = endAngle % (2 * Math.PI);
        if (nEnd < 0) nEnd += 2 * Math.PI;
        let nAngle = angle % (2 * Math.PI);
        if (nAngle < 0) nAngle += 2 * Math.PI;

        let inside = false;
        if (nStart < nEnd) {
            inside = nAngle >= nStart && nAngle <= nEnd;
        } else {
            inside = nAngle >= nStart || nAngle <= nEnd;
        }

        if (inside) {
            addPoint(Math.cos(angle) * R_dev, Math.sin(angle) * R_dev);
        }
    };

    checkAngle(0);
    checkAngle(Math.PI / 2);
    checkAngle(Math.PI);
    checkAngle(Math.PI * 1.5);

    const bboxW = maxX - minX;
    const bboxH = maxY - minY;
    
    const scaleX = (canvas.width - padding * 2) / bboxW;
    const scaleY = (canvas.height - padding * 2) / bboxH;
    const scale = Math.min(scaleX, scaleY);

    if (bboxW <= 0 || bboxH <= 0 || !Number.isFinite(scale) || R_dev <= 0 || r_dev < 0) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const bboxCenterX = (minX + maxX) / 2;
    const bboxCenterY = (minY + maxY) / 2;
    
    const apexX = cx - bboxCenterX * scale;
    const apexY = cy - bboxCenterY * scale;

    // Draw Filled Shape (Subtle Gradient on Dark)
    const gradient = ctx.createLinearGradient(minX * scale + cx, minY * scale + cy, maxX * scale + cx, maxY * scale + cy);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)'); 
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)'); 
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

    ctx.beginPath();
    // Outer Arc
    ctx.arc(apexX, apexY, R_dev * scale, startAngle, endAngle, false);
    // Inner Arc (Anticlockwise)
    ctx.arc(apexX, apexY, r_dev * scale, endAngle, startAngle, true);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();



    // Draw Total Length Line (Compass Point to End of Plate) - Left Side
    // Draw a parallel dimension line offset from the start edge
    const offsetDist = 20; // Fixed 20px offset
    
    // Vector perpendicular to startAngle
    const perpAngle = startAngle - Math.PI / 2;
    const offsetX = Math.cos(perpAngle) * offsetDist;
    const offsetY = Math.sin(perpAngle) * offsetDist;

    // Start and End points of the dimension line (parallel to radius)
    // Start slightly away from apex to avoid touching it
    const startGap = 20; 
    const lineStartX = apexX + offsetX + Math.cos(startAngle) * startGap;
    const lineStartY = apexY + offsetY + Math.sin(startAngle) * startGap;
    
    const lineEndX = apexX + offsetX + Math.cos(startAngle) * R_dev * scale;
    const lineEndY = apexY + offsetY + Math.sin(startAngle) * R_dev * scale;

    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    // ctx.setLineDash([5, 5]); // Removed dashed line as per request
    ctx.stroke();
    // ctx.setLineDash([]);

    // Draw start marker (tick)
    const markerLen = 10;
    ctx.beginPath();
    ctx.moveTo(
        lineStartX + Math.cos(perpAngle) * markerLen/2, 
        lineStartY + Math.sin(perpAngle) * markerLen/2
    );
    ctx.lineTo(
        lineStartX - Math.cos(perpAngle) * markerLen/2, 
        lineStartY - Math.sin(perpAngle) * markerLen/2
    );
    ctx.stroke();

    // Draw end marker (tick)
    ctx.beginPath();
    ctx.moveTo(
        lineEndX + Math.cos(perpAngle) * markerLen/2, 
        lineEndY + Math.sin(perpAngle) * markerLen/2
    );
    ctx.lineTo(
        lineEndX - Math.cos(perpAngle) * markerLen/2, 
        lineEndY - Math.sin(perpAngle) * markerLen/2
    );
    ctx.stroke();

    // Label for Total Length (Side Line)
    const midX = (lineStartX + lineEndX) / 2;
    const midY = (lineStartY + lineEndY) / 2;
    
    // Position label further out from the line
    const labelOffsetDist = 15;
    const labelX = midX + Math.cos(perpAngle) * labelOffsetDist;
    const labelY = midY + Math.sin(perpAngle) * labelOffsetDist;

    ctx.fillStyle = dim;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'right';
    ctx.fillText(`R: ${R_dev.toFixed(1)}`, labelX, labelY);

    // Curved Major Radius Line (Dashed Arc)
    // Concentric with the outer arc, slightly offset
    const curveOffset = 20; // Fixed 20px offset
    const curveRadius = R_dev * scale + curveOffset;
    
    ctx.beginPath();
    ctx.arc(apexX, apexY, curveRadius, startAngle, endAngle, false);
    ctx.strokeStyle = textMain;
    ctx.lineWidth = 1;
    // ctx.setLineDash([5, 5]); // Removed dashed line
    ctx.stroke();
    // ctx.setLineDash([]);

    // Label for Curved Line
    // Position at the midpoint of the arc
    const midCurveAngle = (startAngle + endAngle) / 2;
    const labelCurveRadius = curveRadius + 15; // Slightly further out for text
    const labelCurveX = apexX + Math.cos(midCurveAngle) * labelCurveRadius;
    const labelCurveY = apexY + Math.sin(midCurveAngle) * labelCurveRadius;

    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize + 2}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Rotate text to align with the curve tangent?
    // For simplicity and readability, let's keep it horizontal but positioned correctly.
    // Or rotate it to be perpendicular to the radius (tangent to the arc).
    ctx.save();
    ctx.translate(labelCurveX, labelCurveY);
    ctx.rotate(midCurveAngle + Math.PI/2); // Rotate to align with tangent
    ctx.fillText(`Maior (R) = ${R_dev.toFixed(1)}`, 0, 0);
    ctx.restore();

    ctx.strokeStyle = line;
    ctx.lineWidth = 3; 
    ctx.stroke();

    // Draw Chord Line (Dashed)
    const x1_out = apexX + Math.cos(startAngle) * R_dev * scale;
    const y1_out = apexY + Math.sin(startAngle) * R_dev * scale;
    const x2_out = apexX + Math.cos(endAngle) * R_dev * scale;
    const y2_out = apexY + Math.sin(endAngle) * R_dev * scale;

    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = aux;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1_out, y1_out);
    ctx.lineTo(x2_out, y2_out);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Apex Point (Compass Pivot) - Prominent Crosshair
    ctx.strokeStyle = dim;
    ctx.lineWidth = 2;
    const crossSize = 10;
    ctx.beginPath();
    ctx.moveTo(apexX - crossSize, apexY);
    ctx.lineTo(apexX + crossSize, apexY);
    ctx.moveTo(apexX, apexY - crossSize);
    ctx.lineTo(apexX, apexY + crossSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(apexX, apexY, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Label for Apex
    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Ponto do Compasso', apexX, apexY + labelOffset);

    // 1. R1 (Inner Radius) & R2 (Outer Radius)
    const R1 = r_dev;
    const R2 = R_dev;
    


    // Draw R1 (Inner Radius) - If exists
    const midAngle = (startAngle + endAngle) / 2;
    
    if (R1 > 0) {
        // Curved Minor Radius Line (Dashed Arc)
        // Concentric with the inner arc, slightly offset inwards
        const curveOffsetInner = 20; 
        const curveRadiusInner = Math.max(0, R1 * scale - curveOffsetInner);
        
        ctx.beginPath();
        ctx.arc(apexX, apexY, curveRadiusInner, startAngle, endAngle, false);
        ctx.strokeStyle = textMain;
        ctx.lineWidth = 1;
        // ctx.setLineDash([5, 5]); // Removed dashed line
        ctx.stroke();
        // ctx.setLineDash([]);

        // Label for Curved Inner Line
        const labelCurveRadiusInner = Math.max(0, curveRadiusInner - 15);
        const labelCurveXInner = apexX + Math.cos(midAngle) * labelCurveRadiusInner;
        const labelCurveYInner = apexY + Math.sin(midAngle) * labelCurveRadiusInner;

        ctx.save();
        ctx.translate(labelCurveXInner, labelCurveYInner);
        ctx.rotate(midAngle + Math.PI/2); 
        ctx.fillStyle = dim;
        ctx.font = `bold ${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Menor (r) = ${R1.toFixed(1)}`, 0, 0);
        ctx.restore();
    }

    // 2. L (Geratriz / Slant Height)
    // Draw L on the side (endAngle side)
    const l_start_x = apexX + Math.cos(endAngle) * R1 * scale;
    const l_start_y = apexY + Math.sin(endAngle) * R1 * scale;
    const l_end_x = apexX + Math.cos(endAngle) * R2 * scale;
    const l_end_y = apexY + Math.sin(endAngle) * R2 * scale;
    
    // Draw parallel dimension line for L
    const offsetL = 45; // Fixed offset for PC style
    const l_p1_x = l_start_x + Math.cos(endAngle + Math.PI/2) * offsetL;
    const l_p1_y = l_start_y + Math.sin(endAngle + Math.PI/2) * offsetL;
    const l_p2_x = l_end_x + Math.cos(endAngle + Math.PI/2) * offsetL;
    const l_p2_y = l_end_y + Math.sin(endAngle + Math.PI/2) * offsetL;

    // Extension lines
    ctx.strokeStyle = aux;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(l_start_x, l_start_y);
    ctx.lineTo(l_p1_x, l_p1_y);
    ctx.moveTo(l_end_x, l_end_y);
    ctx.lineTo(l_p2_x, l_p2_y);
    ctx.stroke();

    // Dimension line
    drawArrow(ctx, l_p1_x, l_p1_y, l_p2_x, l_p2_y, "", dim, false);
    
    // Label L
    const L_val = R2 - R1;
    ctx.save();
    ctx.translate((l_p1_x + l_p2_x) / 2, (l_p1_y + l_p2_y) / 2);
    ctx.rotate(endAngle + Math.PI/2);
    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Geratriz (L) = ${L_val.toFixed(1)}`, 0, -5);
    ctx.restore();


    // 3. Angle Label (alpha)
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize + 2}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Move angle label closer to apex to avoid middle clutter
    const angleLabelRadius = R1 * scale + (R2 - R1) * scale * 0.25; 
    const angleLabelX = apexX + Math.cos(midAngle) * angleLabelRadius;
    const angleLabelY = apexY + Math.sin(midAngle) * angleLabelRadius;
    ctx.fillText(`α = ${theta.toFixed(1)}°`, angleLabelX, angleLabelY);


    // 4. C (Outer Chord) & A (Inner Chord)
    // Outer Chord C
    const c_mid_x = (x1_out + x2_out) / 2;
    const c_mid_y = (y1_out + y2_out) / 2;
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Corda (C) = ${corda.toFixed(1)}`, c_mid_x, c_mid_y - 5); 

    // Inner Chord A (if R1 > 0)
    if (R1 > 0) {
        const x1_in = apexX + Math.cos(startAngle) * R1 * scale;
        const y1_in = apexY + Math.sin(startAngle) * R1 * scale;
        const x2_in = apexX + Math.cos(endAngle) * R1 * scale;
        const y2_in = apexY + Math.sin(endAngle) * R1 * scale;
        
        // Draw Inner Chord Line (Dashed)
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = aux;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1_in, y1_in);
        ctx.lineTo(x2_in, y2_in);
        ctx.stroke();
        ctx.setLineDash([]);

        const a_mid_x = (x1_in + x2_in) / 2;
        const a_mid_y = (y1_in + y2_in) / 2;
        const chordA = 2 * R1 * Math.sin((theta * Math.PI / 180) / 2);
        
        ctx.fillStyle = textMain;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`Corda Int. (A) = ${chordA.toFixed(1)}`, a_mid_x, a_mid_y + 5); 
    }

    // 5. h1 (Inner Sagitta) & h2 (Outer Sagitta)
    // h2 (Outer Sagitta)
    const sagitta2 = R2 - Math.sqrt(Math.pow(R2, 2) - Math.pow(corda / 2, 2));
    const h2_end_x = apexX + Math.cos(midAngle) * R2 * scale;
    const h2_end_y = apexY + Math.sin(midAngle) * R2 * scale;
    
    ctx.fillStyle = textMain;
    ctx.textAlign = 'left'; 
    // Push h2 label further out
    ctx.fillText(`Flecha (h2) = ${sagitta2.toFixed(1)}`, h2_end_x + 15, h2_end_y + 15);

    // h1 (Inner Sagitta)
    if (R1 > 0) {
        const chordA = 2 * R1 * Math.sin((theta * Math.PI / 180) / 2);
        const sagitta1 = R1 - Math.sqrt(Math.pow(R1, 2) - Math.pow(chordA / 2, 2));
        
        const h1_end_x = apexX + Math.cos(midAngle) * R1 * scale;
        const h1_end_y = apexY + Math.sin(midAngle) * R1 * scale;

        ctx.fillStyle = textMain;
        ctx.textAlign = 'right';
        // Push h1 label further in
        ctx.fillText(`Flecha Int. (h1) = ${sagitta1.toFixed(1)}`, h1_end_x - 15, h1_end_y - 15);
    }

    // 6. Arc Lengths (Perímetros) - Move to Top Left to declutter
    const arcLenOuter = (theta / 360) * 2 * Math.PI * R_dev;
    const arcLenInner = (theta / 360) * 2 * Math.PI * r_dev;

    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.textAlign = 'left';
    // Position at top left of canvas
    let infoY = 40;
    const infoLineHeight = 20;
    ctx.fillText(`Perímetro Externo: ${arcLenOuter.toFixed(1)} mm`, 20, infoY);
    if (r_dev > 0) {
        infoY += infoLineHeight;
        ctx.fillText(`Perímetro Interno: ${arcLenInner.toFixed(1)} mm`, 20, infoY);
    }

    // 7. Extra Info (Base info)
    const g_val = R_dev - r_dev;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.fillStyle = aux;
    ctx.textAlign = 'center';
    ctx.fillText(`DADOS: Base Ø${d1} | Topo Ø${d2} | Altura ${h_input} | Geratriz ${g_val.toFixed(1)}`, cx, canvas.height - 10);
};
