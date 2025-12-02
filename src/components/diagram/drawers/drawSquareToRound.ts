import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawSquareToRound = ({ ctx, canvas, data, inputs, baseFontSize, colors }: DrawerProps) => {
    const { textMain, aux, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = 80; // Fixed large padding

    const width = Number(data.width) || 0;
    const diameter = Number(data.diameter) || 0;
    const height = Number(data.height) || 0;
    const thickness = inputs ? Number(inputs.thickness) : 0;

    // Layout: Top View (Left) and Side View (Right)
    const viewGap = 100; // Increased gap
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

    // --- Material Gradient Logic ---
    const material = inputs?.material ? String(inputs.material) : 'steel';
    
    const createGradient = (x1: number, y1: number, x2: number, y2: number) => {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const addStops = (stops: [number, string][]) => {
            stops.forEach(([pos, color]) => gradient.addColorStop(pos, color));
        };

        switch (material) {
            case 'stainless':
                addStops([
                    [0, 'rgba(200, 210, 225, 0.3)'],
                    [0.3, 'rgba(230, 240, 255, 0.1)'],
                    [0.5, 'rgba(255, 255, 255, 0.8)'],
                    [0.55, 'rgba(200, 210, 225, 0.3)'],
                    [0.8, 'rgba(220, 230, 245, 0.1)'],
                    [1, 'rgba(180, 190, 210, 0.4)']
                ]);
                break;
            case 'aluminum':
                addStops([
                    [0, 'rgba(230, 230, 230, 0.2)'],
                    [0.3, 'rgba(255, 255, 255, 0.4)'],
                    [0.6, 'rgba(220, 220, 220, 0.2)'],
                    [1, 'rgba(240, 240, 240, 0.3)']
                ]);
                break;
            case 'copper':
                addStops([
                    [0, 'rgba(184, 115, 51, 0.4)'],
                    [0.3, 'rgba(255, 160, 122, 0.2)'],
                    [0.5, 'rgba(255, 200, 150, 0.7)'],
                    [0.7, 'rgba(184, 115, 51, 0.4)'],
                    [1, 'rgba(139, 69, 19, 0.5)']
                ]);
                break;
            case 'brass':
            case 'bronze':
                addStops([
                    [0, 'rgba(181, 166, 66, 0.4)'],
                    [0.3, 'rgba(255, 240, 100, 0.2)'],
                    [0.5, 'rgba(255, 255, 180, 0.7)'],
                    [0.7, 'rgba(181, 166, 66, 0.4)'],
                    [1, 'rgba(184, 134, 11, 0.5)']
                ]);
                break;
            case 'nylon':
                addStops([
                    [0, 'rgba(245, 245, 235, 0.6)'],
                    [0.5, 'rgba(255, 255, 250, 0.7)'],
                    [1, 'rgba(240, 240, 230, 0.6)']
                ]);
                break;
            case 'cast_iron':
                addStops([
                    [0, 'rgba(60, 60, 60, 0.4)'],
                    [0.2, 'rgba(80, 80, 80, 0.3)'],
                    [0.5, 'rgba(100, 100, 100, 0.4)'],
                    [0.8, 'rgba(70, 70, 70, 0.3)'],
                    [1, 'rgba(50, 50, 50, 0.5)']
                ]);
                break;
            case 'galvanized':
                addStops([
                    [0, 'rgba(200, 200, 200, 0.3)'],
                    [0.2, 'rgba(240, 240, 255, 0.2)'],
                    [0.4, 'rgba(180, 180, 190, 0.3)'],
                    [0.6, 'rgba(220, 220, 230, 0.2)'],
                    [0.8, 'rgba(190, 190, 200, 0.3)'],
                    [1, 'rgba(210, 210, 220, 0.2)']
                ]);
                break;
            case 'steel':
            default:
                addStops([
                    [0, 'rgba(255, 255, 255, 0.1)'],
                    [0.2, 'rgba(255, 255, 255, 0.2)'],
                    [0.4, 'rgba(255, 255, 255, 0.1)'],
                    [0.6, 'rgba(255, 255, 255, 0.3)'],
                    [0.8, 'rgba(255, 255, 255, 0.1)'],
                    [1, 'rgba(255, 255, 255, 0.2)']
                ]);
                break;
        }
        return gradient;
    };


    // --- TOP VIEW ---
    const topViewX = startX + (topViewSize * scale) / 2;
    const w_scaled = width * scale;
    const d_scaled = diameter * scale;

    // Fill Square (Base)
    ctx.fillStyle = createGradient(topViewX - w_scaled/2, centerY - w_scaled/2, topViewX + w_scaled/2, centerY + w_scaled/2);
    ctx.fillRect(topViewX - w_scaled / 2, centerY - w_scaled / 2, w_scaled, w_scaled);

    // Square Outline
    ctx.strokeStyle = line;
    ctx.lineWidth = 3;
    ctx.strokeRect(topViewX - w_scaled / 2, centerY - w_scaled / 2, w_scaled, w_scaled);

    // Circle Outline
    ctx.beginPath();
    ctx.arc(topViewX, centerY, d_scaled / 2, 0, Math.PI * 2);
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
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

    // Trapezoid Path
    const halfBase = w_scaled / 2;
    const halfTop = d_scaled / 2;
    
    ctx.beginPath();
    ctx.moveTo(sideViewX - halfBase, centerY + h_scaled / 2); // Bottom Left
    ctx.lineTo(sideViewX + halfBase, centerY + h_scaled / 2); // Bottom Right
    ctx.lineTo(sideViewX + halfTop, centerY - h_scaled / 2); // Top Right
    ctx.lineTo(sideViewX - halfTop, centerY - h_scaled / 2); // Top Left
    ctx.closePath();

    // Fill Side View
    ctx.fillStyle = createGradient(sideViewX - halfBase, centerY - h_scaled/2, sideViewX + halfBase, centerY + h_scaled/2);
    ctx.fill();

    // Outline Side View
    ctx.strokeStyle = line;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Centerline
    ctx.strokeStyle = aux;
    ctx.setLineDash([10, 5, 2, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sideViewX, centerY - h_scaled / 2 - 20);
    ctx.lineTo(sideViewX, centerY + h_scaled / 2 + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dimensions Side View
    // Height
    const dimX = sideViewX + Math.max(halfBase, halfTop) + 30;
    drawArrow(ctx, dimX, centerY - h_scaled / 2, dimX, centerY + h_scaled / 2, `H = ${height}`, dim, false);

    // Base Dimension
    drawArrow(ctx, sideViewX - halfBase, centerY + h_scaled / 2 + 20, sideViewX + halfBase, centerY + h_scaled / 2 + 20, `Base = ${width}`, dim, false);
    
    // Top Dimension
    drawArrow(ctx, sideViewX - halfTop, centerY - h_scaled / 2 - 20, sideViewX + halfTop, centerY - h_scaled / 2 - 20, `Topo Ø = ${diameter}`, dim, false);

    // Label Side View
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText("VISTA LATERAL", sideViewX, centerY + h_scaled / 2 + 60);

    // Extra Info (Base info)
    ctx.font = `${baseFontSize}px Inter`;
    ctx.fillStyle = aux;
    ctx.fillText(`DADOS: Base ${width}x${width} | Topo Ø${diameter} | Altura ${height} | Esp ${thickness}mm`, cx, canvas.height - 10);

    // Enriched Info (Bottom Right)
    const weightKg = Number(data.weightKg) || 0;
    const volumeLiters = Number(data.volumeLiters) || 0;
    const areaM2 = Number(data.areaM2) || 0;

    if (areaM2 > 0) {
        ctx.textAlign = 'right';
        ctx.fillStyle = textMain;
        ctx.font = `${baseFontSize}px Inter`;
        
        let propsY = canvas.height - 40;
        const propsLineHeight = 20;
        const propsX = canvas.width - 20;

        ctx.fillText(`Peso: ${weightKg.toFixed(2)} kg`, propsX, propsY);
        propsY -= propsLineHeight;
        ctx.fillText(`Área: ${areaM2.toFixed(2)} m²`, propsX, propsY);
        propsY -= propsLineHeight;
        ctx.fillText(`Vol. Interno: ${volumeLiters.toFixed(1)} L`, propsX, propsY);
    }
};
