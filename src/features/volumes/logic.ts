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
                `1. GEOMETRIA (CILINDRO):\n   - Forma de prisma circular reto.\n   - Base: Círculo de raio r = ${radius} mm.\n   - Altura: h = ${height} mm.`,
                `2. CÁLCULO DA ÁREA DA BASE:\n   - A_base = π * r²\n   - A_base = 3.1416 * ${radius}² = ${(Math.PI * Math.pow(radius, 2)).toFixed(0)} mm².`,
                `3. CÁLCULO DO VOLUME:\n   - Volume = Área da Base * Altura\n   - V = ${(Math.PI * Math.pow(radius, 2)).toFixed(0)} * ${height} = ${volume.toFixed(0)} mm³.`,
                `4. CÁLCULO DA ÁREA SUPERFICIAL:\n   - Área Lateral = 2 * π * r * h\n   - Área Total = 2 * Área Base + Área Lateral = ${area.toFixed(0)} mm².`,
                `5. CONVERSÃO PARA LITROS:\n   - 1 Litro = 1.000.000 mm³ (ou 1 dm³).\n   - V = ${volume.toFixed(0)} / 1.000.000 = ${(volume/1000000).toFixed(2)} Litros.`
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
                `1. GEOMETRIA (CONE):\n   - Sólido de revolução com base circular e vértice.\n   - Raio da Base (r): ${radius} mm.\n   - Altura (h): ${height} mm.`,
                `2. CÁLCULO DA GERATRIZ (g):\n   - Hipotenusa do triângulo retângulo formado por r e h.\n   - g = √(r² + h²) = ${g.toFixed(1)} mm.`,
                `3. CÁLCULO DO VOLUME:\n   - O volume de um cone é 1/3 do volume de um cilindro com mesma base e altura.\n   - V = (π * r² * h) / 3 = ${volume.toFixed(0)} mm³.`,
                `4. ÁREA SUPERFICIAL:\n   - Área Lateral = π * r * g\n   - Área Total = Área Base + Área Lateral = ${area.toFixed(0)} mm².`,
                `5. CONVERSÃO:\n   - Capacidade: ${(volume/1000000).toFixed(2)} Litros.`
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
                `1. GEOMETRIA (PRISMA RETANGULAR):\n   - Caixa com lados ortogonais.\n   - Dimensões: Comprimento ${length} mm, Largura ${width} mm, Altura ${height} mm.`,
                `2. CÁLCULO DO VOLUME:\n   - Multiplicação direta das três dimensões.\n   - V = C * L * A = ${volume.toFixed(0)} mm³.`,
                `3. ÁREA SUPERFICIAL:\n   - Soma das áreas das 6 faces (3 pares de faces iguais).\n   - Área = 2*(CL) + 2*(CA) + 2*(LA) = ${area.toFixed(0)} mm².`,
                `4. CONVERSÃO:\n   - Capacidade: ${(volume/1000000).toFixed(2)} Litros.`
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
                `1. GEOMETRIA (PIRÂMIDE RETANGULAR):\n   - Base retangular e vértice central.\n   - Base: ${length}x${width} mm. Altura: ${height} mm.`,
                `2. CÁLCULO DO VOLUME:\n   - Similar ao cone, é 1/3 do volume do prisma correspondente.\n   - V = (Base * Altura) / 3 = ${volume.toFixed(0)} mm³.`,
                `3. ÁREA LATERAL:\n   - Soma das áreas dos 4 triângulos laterais.\n   - Requer cálculo das alturas inclinadas (apótemas) das faces laterais.\n   - Área Lateral Total = ${lateralArea.toFixed(0)} mm².`,
                `4. CONVERSÃO:\n   - Capacidade: ${(volume/1000000).toFixed(2)} Litros.`
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
                `1. GEOMETRIA (ESFERA):\n   - Sólido perfeitamente redondo.\n   - Diâmetro: ${diameter} mm (Raio r = ${radius} mm).`,
                `2. CÁLCULO DO VOLUME:\n   - Fórmula: V = 4/3 * π * r³\n   - V = 1.333 * 3.1416 * ${Math.pow(radius, 3).toFixed(0)} = ${volume.toFixed(0)} mm³.`,
                `3. ÁREA SUPERFICIAL:\n   - Fórmula: A = 4 * π * r²\n   - A = 4 * 3.1416 * ${Math.pow(radius, 2).toFixed(0)} = ${area.toFixed(0)} mm².`,
                `4. CONVERSÃO:\n   - Capacidade: ${(volume/1000000).toFixed(2)} Litros.`
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
