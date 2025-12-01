import React, { useEffect } from 'react';
import type { ShapeData } from '../../types';

interface DiagramCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    shape: string;
    data: ShapeData | undefined;
    inputs?: ShapeData | null;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ canvasRef, shape, data, inputs }) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {

        // Resize canvas to parent
        const wrapper = canvas.parentElement;
        if (wrapper) {
            const newWidth = wrapper.clientWidth;
            const newHeight = 400; // Fixed height for consistency
            if (canvas.width !== newWidth || canvas.height !== newHeight) {
                canvas.width = newWidth;
                canvas.height = newHeight;
            }
        }

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get colors from CSS variables if possible, or fallback
        const style = getComputedStyle(document.body);
        const strokeColor = style.getPropertyValue('--accent').trim() || '#3b82f6';
        const fillColor = style.getPropertyValue('--text-muted').trim() + '20' || '#64748b20'; // 20 for transparency

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.fillStyle = fillColor;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const padding = 40; // Reduced padding for better zoom

        if (shape === 'cylinder') {
            const width = Number(data.width) || 0;
            const height = Number(data.height) || 0;
            const diameter = inputs ? Number(inputs.diameter) : 0;
            const thickness = inputs ? Number(inputs.thickness) : 0;
            
            // Calculate scale to fit
            const scaleX = (canvas.width - padding * 2) / width;
            const scaleY = (canvas.height - padding * 2) / height;
            const scale = Math.min(scaleX, scaleY);

            const w = width * scale;
            const h = height * scale;

            if (width <= 0 || height <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }
            
            ctx.beginPath();
            ctx.rect(cx - w/2, cy - h/2, w, h);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.stroke();

            // Dimensions logic
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Width Dimension (L)
            ctx.beginPath();
            ctx.moveTo(cx - w/2, cy - h/2 - 15);
            ctx.lineTo(cx + w/2, cy - h/2 - 15);
            ctx.stroke();
            // Ticks
            ctx.moveTo(cx - w/2, cy - h/2 - 10);
            ctx.lineTo(cx - w/2, cy - h/2 - 20);
            ctx.moveTo(cx + w/2, cy - h/2 - 10);
            ctx.lineTo(cx + w/2, cy - h/2 - 20);
            ctx.stroke();
            // Text
            ctx.fillText(`L = ${width.toFixed(1)} mm`, cx, cy - h/2 - 25);

            // Height Dimension (H)
            ctx.beginPath();
            ctx.moveTo(cx + w/2 + 15, cy - h/2);
            ctx.lineTo(cx + w/2 + 15, cy + h/2);
            ctx.stroke();
            // Ticks
            ctx.moveTo(cx + w/2 + 10, cy - h/2);
            ctx.lineTo(cx + w/2 + 20, cy - h/2);
            ctx.moveTo(cx + w/2 + 10, cy + h/2);
            ctx.lineTo(cx + w/2 + 20, cy + h/2);
            ctx.stroke();
            // Text
            ctx.save();
            ctx.translate(cx + w/2 + 30, cy);
            ctx.rotate(Math.PI / 2);
            ctx.fillText(`H = ${height} mm`, 0, 0);
            ctx.restore();

            // Extra Info
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const circ = (Math.PI * (diameter + thickness)).toFixed(1);
            ctx.fillText(`Ø Int: ${diameter}mm | Esp: ${thickness}mm | Circ: ${circ}mm`, cx, cy + h/2 + 20);
        } else if (shape === 'cone') {
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
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const bboxCenterX = (minX + maxX) / 2;
            const bboxCenterY = (minY + maxY) / 2;
            
            const apexX = cx - bboxCenterX * scale;
            const apexY = cy - bboxCenterY * scale;

            // Draw
            ctx.beginPath();
            ctx.arc(apexX, apexY, R_dev * scale, startAngle, endAngle);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(apexX, apexY, r_dev * scale, startAngle, endAngle);
            ctx.stroke();

            ctx.beginPath();
            const x1_out = apexX + Math.cos(startAngle) * R_dev * scale;
            const y1_out = apexY + Math.sin(startAngle) * R_dev * scale;
            const x1_in = apexX + Math.cos(startAngle) * r_dev * scale;
            const y1_in = apexY + Math.sin(startAngle) * r_dev * scale;
            ctx.moveTo(x1_in, y1_in);
            ctx.lineTo(x1_out, y1_out);
            ctx.stroke();

            const x2_out = apexX + Math.cos(endAngle) * R_dev * scale;
            const y2_out = apexY + Math.sin(endAngle) * R_dev * scale;
            const x2_in = apexX + Math.cos(endAngle) * r_dev * scale;
            const y2_in = apexY + Math.sin(endAngle) * r_dev * scale;
            ctx.moveTo(x2_in, y2_in);
            ctx.lineTo(x2_out, y2_out);
            ctx.stroke();

            // Chord Line (Dashed)
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '60';
            ctx.beginPath();
            ctx.moveTo(x1_out, y1_out);
            ctx.lineTo(x2_out, y2_out);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = strokeColor;

            // Dimensions
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(`R Maior = ${R_dev.toFixed(1)}`, x2_out + 10, y2_out);
            
            if (r_dev > 0) {
                ctx.fillText(`r Menor = ${r_dev.toFixed(1)}`, x2_in + 10, y2_in);
            }

            // Geratriz (g) Dimension
            const midAngle = (startAngle + endAngle) / 2;
            const g_val = R_dev - r_dev;
            const g_x1 = apexX + Math.cos(midAngle) * r_dev * scale;
            const g_y1 = apexY + Math.sin(midAngle) * r_dev * scale;
            const g_x2 = apexX + Math.cos(midAngle) * R_dev * scale;
            const g_y2 = apexY + Math.sin(midAngle) * R_dev * scale;

            // Draw arrow/line for g
            ctx.beginPath();
            ctx.moveTo(g_x1, g_y1);
            ctx.lineTo(g_x2, g_y2);
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            ctx.stroke();

            // Label g
            ctx.save();
            ctx.translate((g_x1 + g_x2) / 2, (g_y1 + g_y2) / 2);
            ctx.rotate(midAngle + Math.PI / 2); // Rotate to align with radius (perpendicular)
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`g = ${g_val.toFixed(1)}`, 0, -5);
            ctx.restore();


            ctx.textAlign = 'center';
            ctx.textBaseline = 'alphabetic'; // Reset baseline
            ctx.fillText(`${theta.toFixed(1)}°`, apexX, apexY + (R_dev * scale + 20));

            // Chord Text
            const chordMidX = (x1_out + x2_out) / 2;
            const chordMidY = (y1_out + y2_out) / 2;
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            ctx.fillText(`Corda: ${corda.toFixed(1)}`, chordMidX, chordMidY + 15);

            // Extra Info
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            ctx.fillText(`Base: Ø${d1} | Topo: Ø${d2} | H: ${h_input} | g: ${g_val.toFixed(1)}`, cx, canvas.height - 10);

        } else if (shape === 'square-to-round') {
            const width = Number(data.width) || 0;
            const diameter = Number(data.diameter) || 0;
            const height = Number(data.height) || 0;
            
            const size = Math.max(width, diameter);
            
            const scale = Math.min(
                (canvas.width - padding * 2) / size,
                (canvas.height - padding * 2) / size
            );

            if (size <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const w = width * scale;
            const d = diameter * scale;

            // Draw Square
            ctx.beginPath();
            ctx.rect(cx - w/2, cy - w/2, w, w);
            ctx.stroke();

            // Draw Circle
            ctx.beginPath();
            ctx.arc(cx, cy, d/2, 0, Math.PI * 2);
            ctx.stroke();

            // Draw triangulation lines (schematic)
            const corners = [
                {x: cx - w/2, y: cy - w/2},
                {x: cx + w/2, y: cy - w/2},
                {x: cx + w/2, y: cy + w/2},
                {x: cx - w/2, y: cy + w/2}
            ];
            
            for (let i = 0; i < 12; i++) {
                const angle = (i * 30) * Math.PI / 180;
                const px = cx + Math.cos(angle) * d/2;
                const py = cy + Math.sin(angle) * d/2;
                
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
                ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
                ctx.stroke();
            }
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            
            ctx.fillText(`Base: ${width}x${width}`, cx, cy + w/2 + 20);
            ctx.fillText(`Topo: Ø${diameter}`, cx, cy - w/2 - 10);
            ctx.fillText(`H: ${height}`, cx + w/2 + 20, cy);
            
            // Extra Info
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const thickness = inputs ? Number(inputs.thickness) : 0;
            ctx.fillText(`Base: ${width}x${width} | Topo: Ø${diameter} | H: ${height} | Esp: ${thickness}mm`, cx, canvas.height - 10);

        } else if (shape === 'elbow') {
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
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
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

            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
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
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            
            ctx.fillText(`R = ${radius}`, curvatureCx + 10, curvatureCy - 10);
            ctx.fillText(`${angle}°`, curvatureCx + r_outer + 10, curvatureCy - r_outer/2);
            ctx.fillText(`Ø ${diameter}`, curvatureCx + r_outer + 10, curvatureCy);
            
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const thickness = inputs ? Number(inputs.thickness) : 0;
            ctx.fillText(`Gomos: ${segments} | Raio: ${radius}mm | Ø: ${diameter}mm | Esp: ${thickness}mm`, cx, canvas.height - 10);

        } else if (shape === 'offset') {
            const diameter = Number(data.diameter) || 0;
            const offset = Number(data.offset) || 0;
            const run = Number(data.run) || 0;
            const travel = Number(data.travel) || 0;
            const angleDeg = Number(data.angleDeg) || 0;
            
            const w_total = run + diameter * 2; 
            const h_total = offset + diameter * 2;
            
            const scale = Math.min(
                (canvas.width - padding * 2) / w_total,
                (canvas.height - padding * 2) / h_total
            );

            if (w_total <= 0 || h_total <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const startX = cx - (run * scale) / 2;
            const startY = cy + (offset * scale) / 2; 
            
            const d = diameter * scale;
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY); 
            ctx.lineTo(startX + run * scale, startY); 
            ctx.lineTo(startX + run * scale, startY - offset * scale); 
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + run * scale, startY - offset * scale);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            ctx.lineWidth = 2;
            
            const stub = 40;
            ctx.beginPath();
            ctx.moveTo(startX - stub, startY - d/2);
            ctx.lineTo(startX, startY - d/2); 
            ctx.moveTo(startX - stub, startY + d/2);
            ctx.lineTo(startX, startY + d/2); 
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + run * scale, startY - offset * scale - d/2);
            ctx.lineTo(startX + run * scale + stub, startY - offset * scale - d/2);
            ctx.moveTo(startX + run * scale, startY - offset * scale + d/2);
            ctx.lineTo(startX + run * scale + stub, startY - offset * scale + d/2);
            ctx.stroke();

            const angleRad = (angleDeg * Math.PI) / 180;
            const dx = Math.sin(angleRad) * (d/2);
            const dy = Math.cos(angleRad) * (d/2);
            
            ctx.beginPath();
            ctx.moveTo(startX - dx, startY - dy); 
            ctx.lineTo(startX + run * scale - dx, startY - offset * scale - dy);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(startX + dx, startY + dy);
            ctx.lineTo(startX + run * scale + dx, startY - offset * scale + dy);
            ctx.stroke();
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            
            ctx.fillText(`Run: ${run}`, cx, startY + 20);
            ctx.fillText(`Set: ${offset}`, startX + run * scale + 10, cy);
            ctx.fillText(`Travel: ${travel.toFixed(1)}`, cx - 20, cy - 20);
            ctx.fillText(`${angleDeg.toFixed(1)}°`, startX + 30, startY - 10);

            // Extra Info
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const thickness = inputs ? Number(inputs.thickness) : 0;
            ctx.fillText(`Ø: ${diameter}mm | Esp: ${thickness}mm`, cx, canvas.height - 10);

        } else if (shape === 'stairs') {
            const height = Number(data.height) || 0;
            const base = Number(data.base) || 0;
            const numSteps = Number(data.numSteps) || 0;
            const rise = Number(data.rise) || 0;
            const run = Number(data.run) || 0;
            
            const scaleX = (canvas.width - padding * 2) / base;
            const scaleY = (canvas.height - padding * 2) / height;
            const scale = Math.min(scaleX, scaleY);
            
            if (base <= 0 || height <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const startX = cx - (base * scale) / 2;
            const startY = cy + (height * scale) / 2;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            
            let currentX = startX;
            let currentY = startY;
            
            for (let i = 0; i < numSteps; i++) {
                currentY -= rise * scale;
                ctx.lineTo(currentX, currentY);
                currentX += run * scale;
                ctx.lineTo(currentX, currentY);
            }
            
            ctx.stroke();
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + base * scale, startY - height * scale);
            ctx.stroke();
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            
            ctx.fillText(`H: ${height}`, cx - (base * scale)/2 - 30, cy);
            ctx.fillText(`Base: ${base}`, cx, startY + 20);
            ctx.fillText(`${numSteps} Degraus`, cx, cy - 20);

            // Visual Dimensions for First Step
            if (numSteps > 0) {
                const firstStepX = startX;
                const firstStepY = startY;
                const nextStepX = startX + run * scale;
                const nextStepY = startY - rise * scale;

                // Rise Label
                ctx.beginPath();
                ctx.moveTo(firstStepX - 10, firstStepY);
                ctx.lineTo(firstStepX - 10, nextStepY);
                ctx.stroke();
                // Ticks
                ctx.moveTo(firstStepX - 5, firstStepY);
                ctx.lineTo(firstStepX - 15, firstStepY);
                ctx.moveTo(firstStepX - 5, nextStepY);
                ctx.lineTo(firstStepX - 15, nextStepY);
                ctx.stroke();
                
                ctx.textAlign = 'right';
                ctx.fillText(`E: ${rise.toFixed(1)}`, firstStepX - 20, (firstStepY + nextStepY) / 2);

                // Run Label
                ctx.beginPath();
                ctx.moveTo(firstStepX, nextStepY - 10);
                ctx.lineTo(nextStepX, nextStepY - 10);
                ctx.stroke();
                // Ticks
                ctx.moveTo(firstStepX, nextStepY - 5);
                ctx.lineTo(firstStepX, nextStepY - 15);
                ctx.moveTo(nextStepX, nextStepY - 5);
                ctx.lineTo(nextStepX, nextStepY - 15);
                ctx.stroke();

                ctx.textAlign = 'center';
                ctx.fillText(`P: ${run.toFixed(1)}`, (firstStepX + nextStepX) / 2, nextStepY - 20);
            }
            
            ctx.textAlign = 'center';
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            ctx.fillText(`Espelho (E): ${rise.toFixed(1)}mm | Piso (P): ${run.toFixed(1)}mm`, cx, canvas.height - 10);

        } else if (shape === 'bracket') {
            const height = Number(data.height) || 0;
            const base = Number(data.base) || 0;
            // width removed as unused
            const diagonal = Number(data.diagonal) || 0;
            const angleDeg = Number(data.angleDeg) || 0;
            const topAngleDeg = Number(data.topAngleDeg) || 0;
            
            const scaleX = (canvas.width - padding * 2) / base;
            const scaleY = (canvas.height - padding * 2) / height;
            const scale = Math.min(scaleX, scaleY);
            
            if (base <= 0 || height <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const w = base * scale;
            const h = height * scale;
            
            const originX = cx - w / 2;
            const originY = cy - h / 2; 
            
            ctx.beginPath();
            ctx.moveTo(originX, originY - 20);
            ctx.lineTo(originX, originY + h + 20);
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(originX, originY); 
            ctx.lineTo(originX + w, originY); 
            ctx.lineTo(originX, originY + h); 
            ctx.closePath(); 
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(originX + w, originY);
            ctx.lineTo(originX, originY + h);
            ctx.stroke();
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            
            ctx.fillText(`H: ${height}`, originX - 30, cy);
            ctx.fillText(`B: ${base}`, cx, originY - 10);
            
            if (diagonal !== undefined) {
                ctx.fillText(`D: ${diagonal.toFixed(1)}`, cx + 10, cy + 10);
            }
            
            if (topAngleDeg !== undefined) {
                ctx.fillText(`${topAngleDeg.toFixed(1)}°`, originX + w - 30, originY + 20);
            }
            if (angleDeg !== undefined) {
                ctx.fillText(`${angleDeg.toFixed(1)}°`, originX + 10, originY + h - 10);
            }

        } else if (shape === 'bolts') {
            const diameterMm = Number(data.diameterMm) || 0;
            const pitch = Number(data.pitch) || 0;
            
            const length = diameterMm * 4;
            const headHeight = diameterMm * 0.7;
            const headWidth = diameterMm * 1.6; 
            
            const totalWidth = length + headHeight;
            const totalHeight = headWidth;
            
            const scale = Math.min(
                (canvas.width - padding * 2) / totalWidth,
                (canvas.height - padding * 2) / totalHeight
            );

            if (totalWidth <= 0 || totalHeight <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }
            
            const d = diameterMm * scale;
            const l = length * scale;
            const hh = headHeight * scale;
            const hw = headWidth * scale;
            
            const startX = cx - (l + hh) / 2;

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
            ctx.fillRect(startX, cy - hw/2, hh, hw);
            ctx.strokeRect(startX, cy - hw/2, hh, hw);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '20';
            ctx.fillRect(startX + hh, cy - d/2, l, d);
            ctx.strokeRect(startX + hh, cy - d/2, l, d);
            
            ctx.beginPath();
            const threadStart = startX + hh + l * 0.3; 
            const threadPitch = pitch * scale; 
            const visualPitch = Math.max(threadPitch, 5);
            
            for (let x = threadStart; x < startX + hh + l; x += visualPitch) {
                ctx.moveTo(x, cy - d/2);
                ctx.lineTo(x, cy + d/2);
            }
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '60';
            ctx.stroke();
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            
            ctx.fillText(`Ø${diameterMm}`, cx + hh/2, cy - d/2 - 10);
            ctx.fillText(`Passo: ${pitch}mm`, cx + hh/2, cy + d/2 + 20);
            
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const boltClass = inputs ? inputs.boltClass : '';
            ctx.fillText(`Classe: ${boltClass} | Comp: ${length}mm (aprox)`, cx, canvas.height - 10);
        } else if (shape === 'plate-weight') {
            const width = Number(data.width) || 0;
            const length = Number(data.length) || 0;
            const thickness = Number(data.thickness) || 0;
            
            // Draw a simple rectangle representing the plate
            // We'll use width and length for aspect ratio
            
            const scaleX = (canvas.width - padding * 2) / width;
            const scaleY = (canvas.height - padding * 2) / length; // Using length as height on canvas
            const scale = Math.min(scaleX, scaleY);
            
            if (width <= 0 || length <= 0 || !Number.isFinite(scale)) {
                ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                ctx.font = '14px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('Dimensões Inválidas', cx, cy);
                return;
            }

            const w = width * scale;
            const h = length * scale;
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '20';
            ctx.fillRect(cx - w/2, cy - h/2, w, h);
            
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
            ctx.lineWidth = 2;
            ctx.strokeRect(cx - w/2, cy - h/2, w, h);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            
            ctx.fillText(`L: ${width}mm`, cx, cy - h/2 - 10);
            
            ctx.save();
            ctx.translate(cx + w/2 + 15, cy);
            ctx.rotate(Math.PI / 2);
            ctx.fillText(`C: ${length}mm`, 0, 0);
            ctx.restore();
            
            ctx.fillText(`E: ${thickness}mm`, cx, cy);
            
            ctx.font = '11px Inter';
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            const qty = inputs ? inputs.quantity : 1;
            ctx.fillText(`Qtd: ${qty} | Peso Total: ${(Number(data.totalWeight) || 0).toFixed(2)} kg`, cx, canvas.height - 10);
        } else if (shape === 'volumes') {
            const subShape = String(data.subShape || 'cylinder');
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';

            if (subShape === 'cylinder') {
                const diameter = Number(data.diameter) || 0;
                const height = Number(data.height) || 0;
                
                const scaleX = (canvas.width - padding * 2) / diameter;
                const scaleY = (canvas.height - padding * 2) / height;
                const scale = Math.min(scaleX, scaleY);
                
                if (diameter <= 0 || height <= 0 || !Number.isFinite(scale)) {
                    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                    ctx.font = '14px Inter';
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
                    // We need to fit the bounding box of the 3D shape
                    // Total width approx: w + l * 0.5
                    // Total height approx: h + l * 0.5
                    
                    const totalW = width + length * 0.5;
                    const totalH = height + length * 0.5;
                    
                    const scaleX = (canvas.width - padding * 2) / totalW;
                    const scaleY = (canvas.height - padding * 2) / totalH;
                    const scale = Math.min(scaleX, scaleY);
                    
                    if (totalW <= 0 || totalH <= 0 || !Number.isFinite(scale)) {
                        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                        ctx.font = '14px Inter';
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
                    
                    // Center the shape
                    // The shape spans from x to x + w + dx
                    // And y - dy to y + h
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
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
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
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();

                    ctx.fillText(`${length}x${width}x${height}`, cx, cy + totalVisualH/2 + 20);
                }

            } else if (subShape === 'sphere') {
                const diameter = Number(data.diameter) || 0;
                
                if (diameter > 0) {
                    const scale = (canvas.width - padding * 2) / diameter;

                    if (!Number.isFinite(scale)) {
                        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
                        ctx.font = '14px Inter';
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
                    
                    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
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
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
                    ctx.beginPath();
                    ctx.moveTo(cx, cy - h/2);
                    ctx.lineTo(cx, cy + h/2);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
                    
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
                    // Front-Left: startX, startY
                    // Front-Right: startX + w, startY
                    // Back-Right: startX + w + dx, startY - dy
                    // Back-Left: startX + dx, startY - dy
                    
                    // Visible Base Lines
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(startX + w, startY);
                    ctx.lineTo(startX + w + dx, startY - dy);
                    ctx.stroke();
                    
                    // Hidden Base Lines
                    ctx.setLineDash([5, 5]);
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
                    ctx.beginPath();
                    ctx.moveTo(startX + w + dx, startY - dy);
                    ctx.lineTo(startX + dx, startY - dy);
                    ctx.lineTo(startX, startY);
                    ctx.stroke();
                    
                    // Edges to Apex
                    ctx.setLineDash([]);
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
                    
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
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() + '40';
                    ctx.beginPath();
                    ctx.moveTo(startX + dx, startY - dy);
                    ctx.lineTo(apexX, apexY);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
                    
                    ctx.fillText(`Base: ${length}x${width}`, cx, startY + 20);
                    ctx.fillText(`H: ${height}`, apexX + 10, cy - h/2);
                }
            }
        }
        } catch (error) {
            console.error("Error drawing diagram:", error);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim();
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Erro no Diagrama', canvas.width / 2, canvas.height / 2);
        }
    }, [canvasRef, shape, data, inputs]);

    return null; 
};

export default DiagramCanvas;
