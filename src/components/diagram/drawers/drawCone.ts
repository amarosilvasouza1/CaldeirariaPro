import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawCone = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;
    const labelOffset = isMobile ? 10 : 20;

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
    ctx.strokeStyle = line;
    ctx.lineWidth = isMobile ? 2 : 3; 
    ctx.stroke();

    // Draw Chord Line (Dashed)
    const x1_out = apexX + Math.cos(startAngle) * R_dev * scale;
    const y1_out = apexY + Math.sin(startAngle) * R_dev * scale;
    const x2_out = apexX + Math.cos(endAngle) * R_dev * scale;
    const y2_out = apexY + Math.sin(endAngle) * R_dev * scale;

    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = aux;
    ctx.lineWidth = isMobile ? 1.5 : 2;
    ctx.beginPath();
    ctx.moveTo(x1_out, y1_out);
    ctx.lineTo(x2_out, y2_out);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Apex Point (Compass Pivot) - Prominent Crosshair
    ctx.strokeStyle = dim;
    ctx.lineWidth = 2;
    const crossSize = isMobile ? 6 : 10;
    ctx.beginPath();
    ctx.moveTo(apexX - crossSize, apexY);
    ctx.lineTo(apexX + crossSize, apexY);
    ctx.moveTo(apexX, apexY - crossSize);
    ctx.lineTo(apexX, apexY + crossSize);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(apexX, apexY, isMobile ? 3 : 5, 0, Math.PI * 2);
    ctx.stroke();

    // Label for Apex
    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Ponto do Compasso', apexX, apexY - labelOffset);

    // 1. R1 (Inner Radius) & R2 (Outer Radius)
    const R1 = r_dev;
    const R2 = R_dev;
    
    // Draw R2 (Outer Radius) - Make it very explicit "Compass Size"
    const midAngle = (startAngle + endAngle) / 2;
    const r2LineX = apexX + Math.cos(midAngle) * R2 * scale;
    const r2LineY = apexY + Math.sin(midAngle) * R2 * scale;
    
    ctx.setLineDash([4, 4]);
    drawArrow(ctx, apexX, apexY, r2LineX, r2LineY, "", dim, isMobile);
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate((apexX + r2LineX) / 2, (apexY + r2LineY) / 2);
    ctx.rotate(midAngle + Math.PI/2); 
    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    // Explicit label with both terms
    ctx.fillText(`Raio Maior (R2) / Compasso = ${R2.toFixed(1)}`, 0, -5);
    ctx.restore();

    // Draw R1 (Inner Radius) - If exists
    if (R1 > 0) {
        const r1LineX = apexX + Math.cos(startAngle) * R1 * scale;
        const r1LineY = apexY + Math.sin(startAngle) * R1 * scale;
        
        drawArrow(ctx, apexX, apexY, r1LineX, r1LineY, "", dim, isMobile);
        
        ctx.save();
        ctx.translate((apexX + r1LineX) / 2, (apexY + r1LineY) / 2);
        ctx.rotate(startAngle + Math.PI/2);
        ctx.fillStyle = dim;
        ctx.font = `bold ${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`R1 = ${R1.toFixed(1)}`, 0, -5);
        ctx.restore();
    }

    // 2. L (Geratriz / Slant Height)
    // Draw L on the side (endAngle side)
    const l_start_x = apexX + Math.cos(endAngle) * R1 * scale;
    const l_start_y = apexY + Math.sin(endAngle) * R1 * scale;
    const l_end_x = apexX + Math.cos(endAngle) * R2 * scale;
    const l_end_y = apexY + Math.sin(endAngle) * R2 * scale;
    
    // Draw parallel dimension line for L
    const offsetL = isMobile ? 25 : 45; // Reduced offset for mobile
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
    drawArrow(ctx, l_p1_x, l_p1_y, l_p2_x, l_p2_y, "", dim, isMobile);
    
    // Label L
    const L_val = R2 - R1;
    ctx.save();
    ctx.translate((l_p1_x + l_p2_x) / 2, (l_p1_y + l_p2_y) / 2);
    ctx.rotate(endAngle + Math.PI/2);
    ctx.fillStyle = dim;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`L = ${L_val.toFixed(1)}`, 0, -5);
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
    ctx.textBaseline = 'top';
    ctx.fillText(`C = ${corda.toFixed(1)}`, c_mid_x, c_mid_y + labelOffset); 

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
        ctx.fillText(`A = ${chordA.toFixed(1)}`, a_mid_x, a_mid_y - labelOffset - 10); 
    }

    // 5. h1 (Inner Sagitta) & h2 (Outer Sagitta)
    // h2 (Outer Sagitta)
    const sagitta2 = R2 - Math.sqrt(Math.pow(R2, 2) - Math.pow(corda / 2, 2));
    const h2_end_x = apexX + Math.cos(midAngle) * R2 * scale;
    const h2_end_y = apexY + Math.sin(midAngle) * R2 * scale;
    
    ctx.fillStyle = textMain;
    ctx.textAlign = 'left'; 
    // Push h2 label further out
    ctx.fillText(`h2 = ${sagitta2.toFixed(1)}`, h2_end_x + 15, h2_end_y + 15);

    // h1 (Inner Sagitta)
    if (R1 > 0) {
        const chordA = 2 * R1 * Math.sin((theta * Math.PI / 180) / 2);
        const sagitta1 = R1 - Math.sqrt(Math.pow(R1, 2) - Math.pow(chordA / 2, 2));
        
        const h1_end_x = apexX + Math.cos(midAngle) * R1 * scale;
        const h1_end_y = apexY + Math.sin(midAngle) * R1 * scale;

        ctx.fillStyle = textMain;
        ctx.textAlign = 'right';
        // Push h1 label further in
        ctx.fillText(`h1 = ${sagitta1.toFixed(1)}`, h1_end_x - 15, h1_end_y - 15);
    }

    // 6. Arc Lengths (Perímetros) - Move to Top Left to declutter
    const arcLenOuter = (theta / 360) * 2 * Math.PI * R_dev;
    const arcLenInner = (theta / 360) * 2 * Math.PI * r_dev;

    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.textAlign = 'left';
    // Position at top left of canvas
    let infoY = isMobile ? 30 : 40;
    const infoLineHeight = isMobile ? 15 : 20;
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
