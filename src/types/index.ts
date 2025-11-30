export interface ShapeData {
    [key: string]: number | string;
}

export type InputData = { [key: string]: string | number };

export interface CalcResult {
    metrics: { [key: string]: string };
    steps: string[];
    calculated: Record<string, number | string>; // For internal diagram use
}
