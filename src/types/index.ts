export interface ShapeData {
    [key: string]: number | string | unknown;
}

export type InputData = { [key: string]: string | number | unknown };

export interface CalcResult {
    metrics: { [key: string]: string };
    steps: string[];
    calculated: Record<string, number | string | unknown>; // For internal diagram use
    theory?: { title: string; content: string }[]; // Classroom Mode content
}
