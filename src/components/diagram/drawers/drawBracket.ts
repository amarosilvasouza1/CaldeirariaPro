import type { DrawerProps } from './types';
import { drawArrow } from './utils';

export const drawBracket = ({ ctx, canvas, data, baseFontSize, colors }: DrawerProps) => {
    const { textMain, textMuted, line, dim } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = 80;

    const base = Number(data.base) || 0; // W
    const height = Number(data.height) || 0; // H
    const thickness = Number(data.thickness) || 40; // Post/Beam thickness

    // Formulas from sketch
    const valA = height > 0 ? height / 5 : 0;
    const valB = base > 0 ? base / 7 : 0;
    const hypotenuse = Math.sqrt(Math.pow(base, 2) + Math.pow(height, 2));

    const maxDim = Math.max(base + thickness, height + thickness);
    const scale = Math.min(
        (canvas.width - padding * 2) / maxDim,
        (canvas.height - padding * 2) / maxDim
    );

    if (base <= 0 || height <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    // Scaled values
    const sBase = base * scale;
    const sHeight = height * scale;
    const sThickness = thickness * scale;
    const sValA = valA * scale;
    const sValB = valB * scale;

    // Origin (Corner of Post/Beam intersection)
    // We want to center the whole assembly (Post + Beam + Brace)
    // The assembly spans from -Thickness to Base horizontally
    // And from -Thickness to Height vertically
    const totalW = sBase + sThickness;
    const totalH = sHeight + sThickness;
    
    const originX = cx - totalW / 2 + sThickness;
    const originY = cy - totalH / 2 + sThickness;

    // Colors from sketch - Updated for better contrast
    const colorPost = '#FF7F50'; // Coral (Brighter than Sienna)
    const colorBeam = '#FFD700'; // Gold (Brighter than GoldenRod)
    const colorBrace = '#1E90FF'; // DodgerBlue (Brighter than DarkSlateGray)

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. Draw Vertical Post
    ctx.fillStyle = colorPost;
    ctx.strokeStyle = line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(originX - sThickness, originY - sThickness, sThickness, sHeight + sThickness + 40); // Extend a bit down
    ctx.fill();
    ctx.stroke();

    // 2. Draw Horizontal Beam
    ctx.fillStyle = colorBeam;
    ctx.beginPath();
    ctx.rect(originX, originY - sThickness, sBase + 40, sThickness); // Extend a bit right
    ctx.fill();
    ctx.stroke();

    // 3. Draw Brace
    // Outer points
    const p1 = { x: originX, y: originY + sHeight }; // Bottom point on Post
    const p2 = { x: originX + sBase, y: originY };   // Right point on Beam

    // Calculate Inner points based on tapered width (A at bottom, B at top)
    // Vector along outer edge (P1 -> P2)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;

    // Normal vector pointing inwards (towards top-left)
    // P1 is (0, H), P2 is (W, 0). Vector is (W, -H).
    // Normal (-H, -W) points up-left.
    const nx = -uy;
    const ny = ux;

    // Inner line points (unclipped)
    const p1_inner = { x: p1.x + nx * sValA, y: p1.y + ny * sValA };
    const p2_inner = { x: p2.x + nx * sValB, y: p2.y + ny * sValB };

    // Intersect inner line with x=originX (Post face) and y=originY (Beam face)
    // Inner line equation: P = P1_inner + t * (P2_inner - P1_inner)
    const idx = p2_inner.x - p1_inner.x;
    const idy = p2_inner.y - p1_inner.y;

    // Intersect with x = originX
    // originX = p1_inner.x + t * idx => t = (originX - p1_inner.x) / idx
    const t_post = idx !== 0 ? (originX - p1_inner.x) / idx : 0;
    const p_post_intersect = { x: originX, y: p1_inner.y + t_post * idy };

    // Intersect with y = originY
    // originY = p1_inner.y + t * idy => t = (originY - p1_inner.y) / idy
    const t_beam = idy !== 0 ? (originY - p1_inner.y) / idy : 0;
    const p_beam_intersect = { x: p1_inner.x + t_beam * idx, y: originY };

    ctx.fillStyle = colorBrace;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p_beam_intersect.x, p_beam_intersect.y);
    ctx.lineTo(p_post_intersect.x, p_post_intersect.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dimensions

    // Height (Left)
    drawArrow(
        ctx, 
        originX - sThickness - 20, originY, 
        originX - sThickness - 20, originY + sHeight, 
        `${height} mm`, 
        dim, 
        false
    );

    // Base (Top)
    drawArrow(
        ctx, 
        originX, originY - sThickness - 20, 
        originX + sBase, originY - sThickness - 20, 
        `${base} mm`, 
        dim, 
        false
    );

    // Hypotenuse (X)
    // Draw parallel to the outer edge
    const offset = 40;
    drawArrow(
        ctx,
        p1.x + nx * -offset, p1.y + ny * -offset,
        p2.x + nx * -offset, p2.y + ny * -offset,
        `X = ${hypotenuse.toFixed(2)} mm`,
        '#FF1493', // DeepPink as in sketch
        false
    );

    // Cut A (Bottom)
    // Draw arrow across the width at bottom
    drawArrow(
        ctx,
        p1.x + ux * 20, p1.y + uy * 20, // Start a bit up the brace
        p1.x + ux * 20 + nx * sValA, p1.y + uy * 20 + ny * sValA,
        `A = ${valA.toFixed(2)}`,
        '#00FF00', // Lime
        false
    );

    // Cut B (Top)
    // Draw arrow across the width at top
    drawArrow(
        ctx,
        p2.x - ux * 20, p2.y - uy * 20, // Start a bit down the brace
        p2.x - ux * 20 + nx * sValB, p2.y - uy * 20 + ny * sValB,
        `B = ${valB.toFixed(2)}`,
        '#FFD700', // Gold
        false
    );

    // Title
    ctx.fillStyle = textMain;
    ctx.font = `bold ${baseFontSize + 2}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText('Mão Francesa', cx, originY + sHeight + 60);
};
