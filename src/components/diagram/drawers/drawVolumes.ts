import type { DrawerProps } from './types';

export const drawVolumes = ({ ctx, canvas, data, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const subShape = String(data.subShape || 'cylinder');
    
    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    ctx.textAlign = 'center';

    if (subShape === 'cylinder') {
        const diameter = Number(data.diameter) || 0;
        const height = Number(data.height) || 0;
        
        const scaleX = (canvas.width - padding * 2) / diameter;
        const scaleY = (canvas.height - padding * 2) / height;
        const scale = Math.min(scaleX, scaleY);
        
        if (diameter <= 0 || height <= 0 || !Number.isFinite(scale)) {
            ctx.fillStyle = textMuted;
            ctx.font = `${baseFontSize}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText('Dimensões Inválidas', cx, cy);
            return;
        }

        const w = diameter * scale;
        const h = height * scale;
        
        // Draw Cylinder
        ctx.beginPath();
        ctx.ellipse(cx, cy - h/2, w/2, w/6, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - w/2, cy - h/2);
        ctx.lineTo(cx - w/2, cy + h/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx + w/2, cy - h/2);
        ctx.lineTo(cx + w/2, cy + h/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.ellipse(cx, cy + h/2, w/2, w/6, 0, 0, Math.PI);
        ctx.stroke();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(cx, cy + h/2, w/2, w/6, 0, Math.PI, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillText(`Ø${diameter}`, cx, cy - h/2 - 20);
        ctx.fillText(`H: ${height}`, cx + w/2 + 20, cy);

    } else if (subShape === 'box') {
        const width = Number(data.width) || 0;
        const length = Number(data.length) || 0;
        const height = Number(data.height) || 0;
        
        if (width > 0 && length > 0 && height > 0) {
            // Isometric-like view
            const totalW = width + length * 0.5;
            const totalH = height + length * 0.5;
            
            const scaleX = (canvas.width - padding * 2) / totalW;
            const scaleY = (canvas.height - padding * 2) / totalH;
            const scale = Math.min(scaleX, scaleY);
            
            if (totalW <= 0 || totalH <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = textMuted;
                ctx.font = `${baseFontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const w = width * scale;
            const l = length * scale; // This is the true length scaled
            const h = height * scale;
            
            // Projection offsets for depth (45 degrees approx)
            const dx = l * 0.5; // Horizontal offset for depth
            const dy = l * 0.5; // Vertical offset for depth
            
            const totalVisualW = w + dx;
            const totalVisualH = h + dy;
            
            const startX = cx - totalVisualW / 2;
            const startY = cy - totalVisualH / 2 + dy; // Top-left of front face
            
            // Front Face
            ctx.strokeRect(startX, startY, w, h);
            
            // Back Face (visible lines)
            ctx.beginPath();
            ctx.moveTo(startX + w, startY);
            ctx.lineTo(startX + w + dx, startY - dy);
            ctx.lineTo(startX + dx, startY - dy);
            ctx.lineTo(startX, startY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + w + dx, startY - dy);
            ctx.lineTo(startX + w + dx, startY - dy + h);
            ctx.lineTo(startX + w, startY + h);
            ctx.stroke();
            
            // Hidden lines (dashed)
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = textMuted + '40';
            ctx.beginPath();
            ctx.moveTo(startX, startY + h);
            ctx.lineTo(startX + dx, startY + h - dy);
            ctx.lineTo(startX + dx, startY - dy);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + dx, startY + h - dy);
            ctx.lineTo(startX + w + dx, startY + h - dy);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = accent;

            ctx.fillText(`${length}x${width}x${height}`, cx, cy + totalVisualH/2 + 20);
        }

    } else if (subShape === 'sphere') {
        const diameter = Number(data.diameter) || 0;
        
        if (diameter > 0) {
            const scale = (canvas.width - padding * 2) / diameter;

            if (!Number.isFinite(scale)) {
                ctx.fillStyle = textMuted;
                ctx.font = `${baseFontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const r = (diameter / 2) * scale;
            
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Equator
            ctx.beginPath();
            ctx.ellipse(cx, cy, r, r/3, 0, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Meridian
            ctx.beginPath();
            ctx.ellipse(cx, cy, r/3, r, 0, 0, 2 * Math.PI);
            ctx.stroke();
            
            // Shading/Gradient effect
            const gradient = ctx.createRadialGradient(cx - r/3, cy - r/3, r/10, cx, cy, r);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.fillStyle = textMain;
            ctx.fillText(`Ø${diameter}`, cx, cy - r - 10);
        }
    } else if (subShape === 'cone') {
        const diameter = Number(data.diameter) || 0;
        const height = Number(data.height) || 0;
        
        if (diameter > 0 && height > 0) {
            const scaleX = (canvas.width - padding * 2) / diameter;
            const scaleY = (canvas.height - padding * 2) / height;
            const scale = Math.min(scaleX, scaleY);
            
            const w = diameter * scale;
            const h = height * scale;
            
            // Draw Cone
            // Base Ellipse
            ctx.beginPath();
            ctx.ellipse(cx, cy + h/2, w/2, w/6, 0, 0, Math.PI);
            ctx.stroke();
            
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.ellipse(cx, cy + h/2, w/2, w/6, 0, Math.PI, 2 * Math.PI);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Sides
            ctx.beginPath();
            ctx.moveTo(cx - w/2, cy + h/2);
            ctx.lineTo(cx, cy - h/2);
            ctx.lineTo(cx + w/2, cy + h/2);
            ctx.stroke();
            
            // Height Line
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = textMuted + '40';
            ctx.beginPath();
            ctx.moveTo(cx, cy - h/2);
            ctx.lineTo(cx, cy + h/2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = accent;
            
            ctx.fillText(`Ø${diameter}`, cx, cy + h/2 + 20);
            ctx.fillText(`H: ${height}`, cx + 10, cy);
        }
    } else if (subShape === 'pyramid') {
        const width = Number(data.width) || 0;
        const length = Number(data.length) || 0;
        const height = Number(data.height) || 0;
        
        if (width > 0 && length > 0 && height > 0) {
            // Isometric-ish view
            const totalW = width + length * 0.5;
            const totalH = height + length * 0.5;
            
            const scaleX = (canvas.width - padding * 2) / totalW;
            const scaleY = (canvas.height - padding * 2) / totalH;
            const scale = Math.min(scaleX, scaleY);
            
            const w = width * scale;
            const l = length * scale;
            const h = height * scale;
            
            const dx = l * 0.5;
            const dy = l * 0.5;
            
            const totalVisualW = w + dx;
            const totalVisualH = h + dy;
            
            const startX = cx - totalVisualW / 2;
            const startY = cy + totalVisualH / 2 - dy; // Bottom-left of base
            
            const apexX = startX + w/2 + dx/2;
            const apexY = startY - h;
            
            // Base (Parallelogram)
            
            // Visible Base Lines
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + w, startY);
            ctx.lineTo(startX + w + dx, startY - dy);
            ctx.stroke();
            
            // Hidden Base Lines
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = textMuted + '40';
            ctx.beginPath();
            ctx.moveTo(startX + w + dx, startY - dy);
            ctx.lineTo(startX + dx, startY - dy);
            ctx.lineTo(startX, startY);
            ctx.stroke();
            
            // Edges to Apex
            ctx.setLineDash([]);
            ctx.strokeStyle = accent;
            
            // Visible Edges
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(apexX, apexY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + w, startY);
            ctx.lineTo(apexX, apexY);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + w + dx, startY - dy);
            ctx.lineTo(apexX, apexY);
            ctx.stroke();
            
            // Hidden Edge
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = textMuted + '40';
            ctx.beginPath();
            ctx.moveTo(startX + dx, startY - dy);
            ctx.lineTo(apexX, apexY);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = accent;
            
            ctx.fillText(`Base: ${length}x${width}`, cx, startY + 20);
            ctx.fillText(`H: ${height}`, apexX + 10, cy - h/2);
        }
    }

    // Enriched Info
    const volLiters = Number(data.volumeLiters) || 0;
    const areaM2 = Number(data.areaM2) || 0;

    ctx.fillStyle = aux;
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(`Volume: ${volLiters.toFixed(2)} Litros | ${ (volLiters/1000).toFixed(3) } m³`, cx, canvas.height - 20);
    ctx.fillText(`Área Superficial: ${areaM2.toFixed(2)} m²`, cx, canvas.height - 5);
};
