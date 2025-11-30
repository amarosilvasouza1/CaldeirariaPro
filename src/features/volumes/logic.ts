import type { ShapeData, CalcResult } from '../../types';

export const calculateVolumes = (data: ShapeData): CalcResult | null => {
    const subShape = String(data.subShape || 'cylinder');
    
    let volume = 0;
    let area = 0;
    let steps: string[] = [];
    let metrics: { [key: string]: string } = {};

    if (subShape === 'cylinder') {
        const diameter = Number(data.diameter) || 0;
        const height = Number(data.height) || 0;
        const radius = diameter / 2;

        if (diameter > 0 && height > 0) {
            // Volume = pi * r^2 * h
            volume = Math.PI * Math.pow(radius, 2) * height;
            // Area = 2 * pi * r * (r + h)
            area = 2 * Math.PI * radius * (radius + height);

            steps = [
                `IDENTIFICAÇÃO: Cilindro Ø${diameter} x ${height} mm.`,
                `ÁREA DA BASE: π * ${radius}² = ${(Math.PI * Math.pow(radius, 2)).toFixed(0)} mm².`,
                `VOLUME: Área Base * Altura = ${volume.toFixed(0)} mm³.`,
                `ÁREA SUPERFICIAL: 2 * π * r * (r + h) = ${area.toFixed(0)} mm².`,
                `CONVERSÃO: ${(volume/1000000).toFixed(2)} Litros.`
            ];
        }
    } else if (subShape === 'cone') {
        const diameter = Number(data.diameter) || 0;
        const height = Number(data.height) || 0;
        const radius = diameter / 2;

        if (diameter > 0 && height > 0) {
            // Volume = (pi * r^2 * h) / 3
            volume = (Math.PI * Math.pow(radius, 2) * height) / 3;
            
            // Slant Height (Geratriz)
            const g = Math.sqrt(Math.pow(radius, 2) + Math.pow(height, 2));
            
            // Area = pi * r * (r + g)
            area = Math.PI * radius * (radius + g);

            steps = [
                `IDENTIFICAÇÃO: Cone Ø${diameter} x ${height} mm.`,
                `GERATRIZ: √(r² + h²) = ${g.toFixed(1)} mm.`,
                `VOLUME: (π * r² * h) / 3 = ${volume.toFixed(0)} mm³.`,
                `ÁREA SUPERFICIAL: π * r * (r + g) = ${area.toFixed(0)} mm².`,
                `CONVERSÃO: ${(volume/1000000).toFixed(2)} Litros.`
            ];
        }
    } else if (subShape === 'box') {
        const width = Number(data.width) || 0;
        const length = Number(data.length) || 0;
        const height = Number(data.height) || 0;

        if (width > 0 && length > 0 && height > 0) {
            // Volume = l * w * h
            volume = width * length * height;
            // Area = 2(lw + lh + wh)
            area = 2 * (length * width + length * height + width * height);

            steps = [
                `IDENTIFICAÇÃO: Caixa ${length}x${width}x${height} mm.`,
                `VOLUME: C * L * A = ${volume.toFixed(0)} mm³.`,
                `ÁREA SUPERFICIAL: 2 * (CL + CA + LA) = ${area.toFixed(0)} mm².`,
                `CONVERSÃO: ${(volume/1000000).toFixed(2)} Litros.`
            ];
        }
    } else if (subShape === 'pyramid') {
        const width = Number(data.width) || 0;
        const length = Number(data.length) || 0;
        const height = Number(data.height) || 0;

        if (width > 0 && length > 0 && height > 0) {
            // Volume = (l * w * h) / 3
            volume = (width * length * height) / 3;
            
            // Slant Heights
            const sh1 = Math.sqrt(Math.pow(height, 2) + Math.pow(length / 2, 2)); // Height for width side triangles
            const sh2 = Math.sqrt(Math.pow(height, 2) + Math.pow(width / 2, 2)); // Height for length side triangles
            
            // Area = Base + Lateral
            // Lateral = 2 * (1/2 * w * sh1) + 2 * (1/2 * l * sh2) = w*sh1 + l*sh2
            
            const lateralArea = (width * sh1) + (length * sh2);
            const baseArea = width * length;
            area = baseArea + lateralArea;

            steps = [
                `IDENTIFICAÇÃO: Pirâmide Base ${length}x${width} x Altura ${height} mm.`,
                `VOLUME: (Base * Altura) / 3 = ${volume.toFixed(0)} mm³.`,
                `ÁREA LATERAL: Soma das faces triangulares = ${lateralArea.toFixed(0)} mm².`,
                `ÁREA TOTAL: Base + Lateral = ${area.toFixed(0)} mm².`,
                `CONVERSÃO: ${(volume/1000000).toFixed(2)} Litros.`
            ];
        }
    } else if (subShape === 'sphere') {
        const diameter = Number(data.diameter) || 0;
        const radius = diameter / 2;

        if (diameter > 0) {
            // Volume = 4/3 * pi * r^3
            volume = (4/3) * Math.PI * Math.pow(radius, 3);
            // Area = 4 * pi * r^2
            area = 4 * Math.PI * Math.pow(radius, 2);

            steps = [
                `IDENTIFICAÇÃO: Esfera Ø${diameter} mm.`,
                `VOLUME: (4/3) * π * r³ = ${volume.toFixed(0)} mm³.`,
                `ÁREA SUPERFICIAL: 4 * π * r² = ${area.toFixed(0)} mm².`,
                `CONVERSÃO: ${(volume/1000000).toFixed(2)} Litros.`
            ];
        }
    }

    // Convert to Liters (dm³) and m²
    const volumeLiters = volume / 1000000;
    const areaM2 = area / 1000000;

    metrics = {
        'Volume (Litros)': `${volumeLiters.toFixed(2)} L`,
        'Volume (m³)': `${(volumeLiters / 1000).toFixed(4)} m³`,
        'Área Superficial': `${areaM2.toFixed(2)} m²`
    };

    return {
        metrics,
        steps,
        calculated: {
            ...data,
            volume,
            area
        }
    };
};
