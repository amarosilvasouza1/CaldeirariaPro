import type { ShapeData, InputData } from '../../../types';

export interface DrawerProps {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    data: ShapeData;
    inputs: InputData | undefined;
    baseFontSize: number;
    isMobile: boolean;
    colors: {
        textMain: string;
        textMuted: string;
        accent: string;
        aux: string;
        line: string;
        dim: string;
        background: string;
    };
}
