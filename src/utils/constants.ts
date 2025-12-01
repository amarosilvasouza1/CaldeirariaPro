export const DENSITIES: { [key: string]: number } = {
    'steel': 7.85,
    'galvanized': 7.85,
    'stainless': 7.90,
    'aluminum': 2.70,
    'copper': 8.96,
    'brass': 8.73,
    'bronze': 8.80,
    'cast_iron': 7.20,
    'nylon': 1.15
};

// Bolt Data (Metric Coarse)
export const BOLT_DATA: Record<string, { pitch: number, area: number }> = {
    'M6': { pitch: 1.0, area: 20.1 },
    'M8': { pitch: 1.25, area: 36.6 },
    'M10': { pitch: 1.5, area: 58.0 },
    'M12': { pitch: 1.75, area: 84.3 },
    'M16': { pitch: 2.0, area: 157 },
    'M20': { pitch: 2.5, area: 245 },
    'M24': { pitch: 3.0, area: 353 },
    'M30': { pitch: 3.5, area: 561 },
    'M36': { pitch: 4.0, area: 817 },
};

export const BOLT_CLASSES: Record<string, { yield: number, tensile: number }> = {
    '4.6': { yield: 240, tensile: 400 },
    '5.8': { yield: 400, tensile: 500 },
    '8.8': { yield: 640, tensile: 800 }, // MPa
    '10.9': { yield: 900, tensile: 1000 },
    '12.9': { yield: 1100, tensile: 1200 },
};
