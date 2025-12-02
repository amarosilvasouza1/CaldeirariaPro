import React, { useEffect } from 'react';
import type { ShapeData } from '../../types';
import { drawCylinder } from './drawers/drawCylinder';
import { drawCone } from './drawers/drawCone';
import { drawSquareToRound } from './drawers/drawSquareToRound';
import { drawElbow } from './drawers/drawElbow';
import { drawOffset } from './drawers/drawOffset';
import { drawStairs } from './drawers/drawStairs';
import { drawBracket } from './drawers/drawBracket';
import { drawBolts } from './drawers/drawBolts';
import { drawPlateWeight } from './drawers/drawPlateWeight';
import { drawVolumes } from './drawers/drawVolumes';
import { drawPipeBranching } from './drawers/drawPipeBranching';
import { drawArcCalculator } from './drawers/drawArcCalculator';
import type { DrawerProps } from './drawers/types';

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



        // Set fixed high resolution for consistent "PC-like" rendering
        // The canvas will be scaled down by CSS on smaller screens
        const fixedWidth = 1200;
        // Increase height on mobile to give more vertical space (square aspect ratio)
        const isSmallScreen = window.innerWidth < 600;
        const fixedHeight = isSmallScreen ? 1200 : 800;
        
        if (canvas.width !== fixedWidth || canvas.height !== fixedHeight) {
            canvas.width = fixedWidth;
            canvas.height = fixedHeight;
        }

        // Ensure CSS scales it to fit container
        canvas.style.width = '100%';
        canvas.style.height = 'auto';

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get colors from CSS variables if possible, or fallback
        const style = getComputedStyle(document.body);
        const strokeColor = style.getPropertyValue('--accent').trim() || '#3b82f6';
        const fillColor = style.getPropertyValue('--text-muted').trim() + '20' || '#64748b20'; // 20 for transparency

        try {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.fillStyle = fillColor;

            // High Contrast Colors for Dark Theme
            const colors = {
                line: '#ffffff', // White for main lines
                dim: '#FFD700',  // Gold for dimensions
                textMain: '#ffffff', // White for text
                textMuted: getComputedStyle(document.body).getPropertyValue('--text-muted').trim(),
                aux: '#94a3b8',  // Gray for aux info
                accent: strokeColor
            };

            const isMobile = canvas.width < 600;
            const baseFontSize = isMobile ? 10 : 14;

            const drawerProps: DrawerProps = {
                ctx,
                canvas,
                data,
                inputs: inputs || undefined,
                baseFontSize,
                isMobile,
                colors
            };

            if (shape === 'cylinder') {
                drawCylinder(drawerProps);
            } else if (shape === 'cone') {
                drawCone(drawerProps);
            } else if (shape === 'square-to-round') {
                drawSquareToRound(drawerProps);
            } else if (shape === 'elbow') {
                drawElbow(drawerProps);
            } else if (shape === 'offset') {
                drawOffset(drawerProps);
            } else if (shape === 'stairs') {
                drawStairs(drawerProps);
            } else if (shape === 'bracket') {
                drawBracket(drawerProps);
            } else if (shape === 'bolts') {
                drawBolts(drawerProps);
            } else if (shape === 'plate-weight') {
                drawPlateWeight(drawerProps);
            } else if (shape === 'volumes') {
                drawVolumes(drawerProps);
            } else if (shape === 'pipe-branching') {
                drawPipeBranching(drawerProps);
            } else if (shape === 'arc-calculator') {
                drawArcCalculator(drawerProps);
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
