import type { DrawerProps } from './types';

export const drawSquareToRound = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const width = Number(data.width) || 0;
    const diameter = Number(data.diameter) || 0;
    const height = Number(data.height) || 0;
    const thickness = inputs ? Number(inputs.thickness) : 0;

    // Layout: Top View (Left) and Side View (Right)
    const viewGap = 50;
    const topViewSize = Math.max(width, diameter);
    const sideViewWidth = Math.max(width, diameter);
    const sideViewHeight = height;

    const totalWidth = topViewSize + viewGap + sideViewWidth;
    const totalHeight = Math.max(topViewSize, sideViewHeight);

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
    const centerY = cy;

    // --- TOP VIEW ---
    const topViewX = startX + (topViewSize * scale) / 2;
    const w_scaled = width * scale;
    const d_scaled = diameter * scale;

    // Square
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.strokeRect(topViewX - w_scaled / 2, centerY - w_scaled / 2, w_scaled, w_scaled);

    // Circle
    ctx.beginPath();
    ctx.arc(topViewX, centerY, d_scaled / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Triangulation Lines (Top View)
    ctx.strokeStyle = aux;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    const corners = [
        { x: topViewX - w_scaled / 2, y: centerY - w_scaled / 2 },
        { x: topViewX + w_scaled / 2, y: centerY - w_scaled / 2 },
        { x: topViewX + w_scaled / 2, y: centerY + w_scaled / 2 },
        { x: topViewX - w_scaled / 2, y: centerY + w_scaled / 2 }
    ];

    // Draw lines from corners to circle quadrants
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30) * Math.PI / 180;
        const px = topViewX + Math.cos(angle) * d_scaled / 2;
        const py = centerY + Math.sin(angle) * d_scaled / 2;
        
        // Find nearest corner
        let nearest = corners[0];
        let minDist = Infinity;
        corners.forEach(c => {
            const dist = Math.hypot(c.x - px, c.y - py);
            if (dist < minDist) {
                minDist = dist;
                nearest = c;
            }
        });
        
        ctx.beginPath();
        ctx.moveTo(nearest.x, nearest.y);
        ctx.lineTo(px, py);
        ctx.stroke();
    }
    ctx.setLineDash([]);

    // Labels Top View
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("VISTA DE TOPO", topViewX, centerY + topViewSize * scale / 2 + 30);


    // --- SIDE VIEW ---
    const sideViewX = startX + (topViewSize * scale) + (viewGap * scale) + (sideViewWidth * scale) / 2;
    const h_scaled = height * scale;

    // Trapezoid
    const halfBase = w_scaled / 2;
    const halfTop = d_scaled / 2;
    
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sideViewX - halfBase, centerY + h_scaled / 2); // Bottom Left
    ctx.lineTo(sideViewX + halfBase, centerY + h_scaled / 2); // Bottom Right
    ctx.lineTo(sideViewX + halfTop, centerY - h_scaled / 2); // Top Right
    ctx.lineTo(sideViewX - halfTop, centerY - h_scaled / 2); // Top Left
    ctx.closePath();
    ctx.stroke();

    // Centerline
    ctx.strokeStyle = aux;
    ctx.setLineDash([10, 5, 2, 5]);
    ctx.beginPath();
    ctx.moveTo(sideViewX, centerY - h_scaled / 2 - 20);
    ctx.lineTo(sideViewX, centerY + h_scaled / 2 + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dimensions Side View
    ctx.fillStyle = dim;
    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.font = `${isMobile ? 10 : 12}px Inter`;

    // Height
    const dimX = sideViewX + Math.max(halfBase, halfTop) + 20;
    ctx.beginPath();
    ctx.moveTo(dimX, centerY - h_scaled / 2);
    ctx.lineTo(dimX, centerY + h_scaled / 2);
    ctx.stroke();
    // Ticks
    ctx.moveTo(dimX - 5, centerY - h_scaled / 2);
    ctx.lineTo(dimX + 5, centerY - h_scaled / 2);
    ctx.moveTo(dimX - 5, centerY + h_scaled / 2);
    ctx.lineTo(dimX + 5, centerY + h_scaled / 2);
    ctx.stroke();
    
    ctx.save();
    ctx.translate(dimX + 15, centerY);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`H = ${height}`, 0, 0);
    ctx.restore();

    // Base
    ctx.fillText(`Base = ${width}`, sideViewX, centerY + h_scaled / 2 + 20);
    
    // Top
    ctx.fillText(`Topo Ø = ${diameter}`, sideViewX, centerY - h_scaled / 2 - 20);

    // Label Side View
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.fillText("VISTA LATERAL", sideViewX, centerY + h_scaled / 2 + 50);

    // Extra Info
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = aux;
    ctx.fillText(`DADOS: Base ${width}x${width} | Topo Ø${diameter} | Altura ${height} | Esp ${thickness}mm`, cx, canvas.height - 20);

    // Enriched Info
    const weight = Number(data.weight) || 0;
    const vol = Number(data.volumeLiters) || 0;
    const area = Number(data.areaM2) || 0;

    ctx.fillText(`Peso: ${weight.toFixed(2)} kg | Vol: ${vol.toFixed(1)} L | Área: ${area.toFixed(2)} m²`, cx, canvas.height - 5);
};
