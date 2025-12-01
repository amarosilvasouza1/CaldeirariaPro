import type { DrawerProps } from './types';

export const drawElbow = ({ ctx, canvas, data, inputs, baseFontSize, isMobile, colors }: DrawerProps) => {
    const { textMain, textMuted, accent, aux } = colors;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const padding = isMobile ? 40 : 80;

    const radius = Number(data.radius) || 0;
    const angle = Number(data.angle) || 0;
    const diameter = Number(data.diameter) || 0;
    const segments = Number(data.segments) || 0;
    
    const maxExtent = radius + diameter;
    const scale = Math.min(
        (canvas.width - padding * 2) / maxExtent,
        (canvas.height - padding * 2) / maxExtent
    );

    if (maxExtent <= 0 || !Number.isFinite(scale)) {
        ctx.fillStyle = textMuted;
        ctx.font = `${baseFontSize}px Inter`;
        ctx.textAlign = 'center';
        ctx.fillText('Dimensões Inválidas', cx, cy);
        return;
    }

    const curvatureCx = cx - (radius * scale) / 2;
    const curvatureCy = cy + (radius * scale) / 2;

    const r_outer = (radius + diameter/2) * scale;
    let r_inner = (radius - diameter/2) * scale;
    
    if (r_inner < 0) r_inner = 0;
    
    const startRad = 0; 
    const endRad = - (angle * Math.PI) / 180; 

    ctx.beginPath();
    ctx.arc(curvatureCx, curvatureCy, r_outer, startRad, endRad, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(curvatureCx, curvatureCy, r_inner, startRad, endRad, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(curvatureCx + r_inner, curvatureCy);
    ctx.lineTo(curvatureCx + r_outer, curvatureCy);
    ctx.stroke();

    const endX_inner = curvatureCx + Math.cos(endRad) * r_inner;
    const endY_inner = curvatureCy + Math.sin(endRad) * r_inner;
    const endX_outer = curvatureCx + Math.cos(endRad) * r_outer;
    const endY_outer = curvatureCy + Math.sin(endRad) * r_outer;

    ctx.beginPath();
    ctx.moveTo(endX_inner, endY_inner);
    ctx.lineTo(endX_outer, endY_outer);
    ctx.stroke();

    const numJoints = segments - 1;
    const jointStep = endRad / numJoints;

    ctx.strokeStyle = textMuted + '40';
    ctx.setLineDash([5, 5]);

    for (let i = 1; i < numJoints; i++) {
        const jointAngle = i * jointStep;
        const jx_inner = curvatureCx + Math.cos(jointAngle) * r_inner;
        const jy_inner = curvatureCy + Math.sin(jointAngle) * r_inner;
        const jx_outer = curvatureCx + Math.cos(jointAngle) * r_outer;
        const jy_outer = curvatureCy + Math.sin(jointAngle) * r_outer;

        ctx.beginPath();
        ctx.moveTo(jx_inner, jy_inner);
        ctx.lineTo(jx_outer, jy_outer);
        ctx.stroke();
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = accent;

    ctx.fillStyle = textMain;
    ctx.font = `${baseFontSize}px Inter`;
    
    ctx.fillText(`R = ${radius}`, curvatureCx + 10, curvatureCy - 10);
    ctx.fillText(`${angle}°`, curvatureCx + r_outer + 10, curvatureCy - r_outer/2);
    ctx.fillText(`Ø ${diameter}`, curvatureCx + r_outer + 10, curvatureCy);
    
    ctx.font = `${baseFontSize - 1}px Inter`;
    ctx.fillStyle = textMuted;
    const thickness = inputs ? Number(inputs.thickness) : 0;
    ctx.fillText(`Gomos: ${segments} | Raio: ${radius}mm | Ø: ${diameter}mm | Esp: ${thickness}mm`, cx, canvas.height - 35); // Adjusted Y to make room for enriched info

    // Enriched Info
    const weight = Number(data.weight) || 0;
    const vol = Number(data.volumeLiters) || 0;
    const area = Number(data.areaM2) || 0;
    const arcLen = Number(data.totalArcLength) || 0;

    ctx.fillStyle = aux;
    ctx.fillText(`Peso: ${weight.toFixed(2)} kg | Vol: ${vol.toFixed(1)} L`, cx, canvas.height - 20);
    ctx.fillText(`Área: ${area.toFixed(2)} m² | Comp. Arco: ${arcLen.toFixed(1)} mm`, cx, canvas.height - 5);
};
