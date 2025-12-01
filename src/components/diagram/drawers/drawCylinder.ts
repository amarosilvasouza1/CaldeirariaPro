import type { DrawerProps } from './types';

export const drawCylinder = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const diameter = inputs ? Number(inputs.diameter) : 0;
    const height = inputs ? Number(inputs.height) : 0;
    const thickness = inputs ? Number(inputs.thickness) : 0;
    const circumference = diameter * Math.PI;

    // Layout: 3D Cylinder on Left, Unrolled Pattern on Right
    const ellipseFactor = 0.3; 
    const cylWidth = diameter;
    const cylHeight = height;
    
    const patternWidth = circumference;
    const patternHeight = height;

    const gap = diameter * 0.5; 
    const totalWidth = cylWidth + gap + patternWidth;
    const totalHeight = Math.max(cylHeight + cylWidth * ellipseFactor, patternHeight);

    const scale = Math.min(
        (canvas.width - padding * 2) / totalWidth,
        (canvas.height - padding * 2) / totalHeight
    );

    if (totalWidth <= 0 || totalHeight <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = aux;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const startX = cx - (totalWidth * scale) / 2;
    const cylX = startX + (cylWidth * scale) / 2;
    const patternX = startX + (cylWidth * scale) + (gap * scale) + (patternWidth * scale) / 2;
    const centerY = cy;

    // --- DRAW 3D CYLINDER ---
    const r_cyl = (cylWidth * scale) / 2;
    const h_cyl = cylHeight * scale;
    const ellipseH = r_cyl * ellipseFactor;

    // Top Ellipse
    ctx.beginPath();
    ctx.ellipse(cylX, centerY - h_cyl / 2, r_cyl, ellipseH, 0, 0, 2 * Math.PI);
    ctx.fillStyle = textMuted + '20';
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bottom Ellipse (Half visible)
    ctx.beginPath();
    ctx.ellipse(cylX, centerY + h_cyl / 2, r_cyl, ellipseH, 0, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cylX, centerY + h_cyl / 2, r_cyl, ellipseH, 0, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = aux; 
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = line;

    // Sides
    ctx.beginPath();
    ctx.moveTo(cylX - r_cyl, centerY - h_cyl / 2);
    ctx.lineTo(cylX - r_cyl, centerY + h_cyl / 2);
    ctx.moveTo(cylX + r_cyl, centerY - h_cyl / 2);
    ctx.lineTo(cylX + r_cyl, centerY + h_cyl / 2);
    ctx.stroke();

    // Dimensions for Cylinder
    ctx.fillStyle = dim;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.font = `${isMobile ? 10 : 12}px Inter`;
    ctx.textAlign = 'center';

    // Height (H)
    const dimX = cylX + r_cyl + 20;
    ctx.beginPath();
    ctx.moveTo(dimX, centerY - h_cyl / 2);
    ctx.lineTo(dimX, centerY + h_cyl / 2);
    ctx.stroke();
    // Ticks
    ctx.moveTo(dimX - 5, centerY - h_cyl / 2);
    ctx.lineTo(dimX + 5, centerY - h_cyl / 2);
    ctx.moveTo(dimX - 5, centerY + h_cyl / 2);
    ctx.lineTo(dimX + 5, centerY + h_cyl / 2);
    ctx.stroke();
    // Text
    ctx.save();
    ctx.translate(dimX + 15, centerY);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`H = ${height}`, 0, 0);
    ctx.restore();

    // Diameter (Ø)
    ctx.beginPath();
    ctx.moveTo(cylX - r_cyl, centerY - h_cyl / 2 - ellipseH - 20);
    ctx.lineTo(cylX + r_cyl, centerY - h_cyl / 2 - ellipseH - 20);
    ctx.stroke();
    ctx.moveTo(cylX - r_cyl, centerY - h_cyl / 2 - ellipseH - 15);
    ctx.lineTo(cylX - r_cyl, centerY - h_cyl / 2 - ellipseH - 25);
    ctx.moveTo(cylX + r_cyl, centerY - h_cyl / 2 - ellipseH - 15);
    ctx.lineTo(cylX + r_cyl, centerY - h_cyl / 2 - ellipseH - 25);
    ctx.stroke();
    ctx.fillText(`Ø Int = ${diameter}`, cylX, centerY - h_cyl / 2 - ellipseH - 30);

    // --- DRAW UNROLLED PATTERN ---
    const w_pat = patternWidth * scale;
    const h_pat = patternHeight * scale;
    const pX = patternX - w_pat / 2;
    const pY = centerY - h_pat / 2;

    ctx.fillStyle = textMuted + '20';
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(pX, pY, w_pat, h_pat);
    ctx.fill();
    ctx.stroke();

    // Dimensions for Pattern
    ctx.fillStyle = dim;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;

    // Circumference (L)
    ctx.beginPath();
    ctx.moveTo(pX, pY - 15);
    ctx.lineTo(pX + w_pat, pY - 15);
    ctx.stroke();
    ctx.moveTo(pX, pY - 10);
    ctx.lineTo(pX, pY - 20);
    ctx.moveTo(pX + w_pat, pY - 10);
    ctx.lineTo(pX + w_pat, pY - 20);
    ctx.stroke();
    ctx.fillText(`Perímetro (L) = ${circumference.toFixed(1)}`, patternX, pY - 25);

    // Diagonal Check (Esquadro)
    const diagonal = Math.sqrt(Math.pow(circumference, 2) + Math.pow(height, 2));
    ctx.strokeStyle = aux;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pX, pY + h_pat);
    ctx.lineTo(pX + w_pat, pY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Diagonal Label
    ctx.fillStyle = aux;
    ctx.save();
    ctx.translate(patternX, centerY);
    const angle = Math.atan2(-h_pat, w_pat);
    ctx.rotate(angle);
    ctx.fillText(`Diagonal (Esquadro) = ${diagonal.toFixed(1)}`, 0, -5);
    ctx.restore();

    // Labels
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.fillText("VISTA 3D", cylX, centerY + h_cyl / 2 + 40);
    ctx.fillText("PADRÃO PLANIFICADO", patternX, centerY + h_pat / 2 + 40);

    // Extra Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = aux;
    ctx.fillText(`DADOS: Ø Int ${diameter}mm | Esp ${thickness}mm | Ø Médio ${diameter + thickness}mm`, cx, canvas.height - 20);

    // Enriched Info
    const weight = Number(data.weight) || 0;
    const vol = Number(data.internalVolumeLiters) || 0;
    const area = Number(data.totalAreaM2) || 0;

    ctx.fillText(`Peso: ${weight.toFixed(2)} kg | Vol: ${vol.toFixed(1)} L | Área: ${area.toFixed(2)} m²`, cx, canvas.height - 5);
};
