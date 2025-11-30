export interface ShapeInfoData {
    title: string;
    description: string;
    application: string;
    keyParams: string[];
}

export const SHAPE_INFO: Record<string, ShapeInfoData> = {
    cylinder: {
        title: 'Tanque Cilíndrico',
        description: 'Estrutura tubular reta com bases circulares paralelas. É a forma mais comum na caldeiraria devido à sua facilidade de fabricação e resistência à pressão.',
        application: 'Armazenamento de líquidos e gases, vasos de pressão, tubulações industriais e silos.',
        keyParams: ['Diâmetro Interno', 'Altura', 'Espessura da Chapa']
    },
    cone: {
        title: 'Cone',
        description: 'Sólido geométrico que se afunila suavemente de uma base plana circular até um ponto no topo (vértice).',
        application: 'Funis, reduções de tubulação, silos de grãos e ciclones separadores.',
        keyParams: ['Diâmetro Maior', 'Diâmetro Menor', 'Altura Vertical']
    },
    'square-to-round': {
        title: 'Quadrado para Redondo',
        description: 'Peça de transição que conecta uma seção transversal quadrada ou retangular a uma seção circular.',
        application: 'Dutos de ventilação, conexões de exaustores e tremonhas.',
        keyParams: ['Base (Largura x Comp.)', 'Diâmetro Topo', 'Altura']
    },
    elbow: {
        title: 'Curva de Gomo',
        description: 'Segmento de tubulação curvado formado pela união de vários cortes angulares (gomos) de tubo cilíndrico.',
        application: 'Mudança de direção em tubulações de grande diâmetro onde curvas prontas não existem.',
        keyParams: ['Diâmetro', 'Raio da Curva', 'Ângulo', 'Número de Gomos']
    },
    volumes: {
        title: 'Volumes e Áreas',
        description: 'Módulo auxiliar para cálculo rápido de capacidade volumétrica e área superficial de formas básicas.',
        application: 'Estimativa de pintura, revestimento e capacidade de armazenamento.',
        keyParams: ['Tipo de Forma', 'Dimensões Geométricas']
    },
    'plate-weight': {
        title: 'Peso de Chapas',
        description: 'Calculadora dedicada para estimar o peso de chapas planas de diferentes materiais.',
        application: 'Orçamentos, planejamento de transporte e dimensionamento de estruturas.',
        keyParams: ['Largura', 'Comprimento', 'Espessura', 'Material']
    },
    offset: {
        title: 'Desvio (Offset)',
        description: 'Cálculo para fabricação de um desvio em tubulações, conectando dois tubos paralelos desalinhados.',
        application: 'Desviar de obstáculos em tubulações industriais (água, vapor, gás).',
        keyParams: ['Deslocamento (Set)', 'Avanço (Run)', 'Diâmetro']
    },
    stairs: {
        title: 'Escada Industrial',
        description: 'Dimensionamento completo de escadas retas, incluindo degraus, espelhos e banzos, conforme normas de segurança.',
        application: 'Acesso a plataformas, mezaninos e níveis superiores em fábricas.',
        keyParams: ['Altura Total', 'Base Disponível', 'Largura']
    },
    bracket: {
        title: 'Mão Francesa',
        description: 'Suporte triangular utilizado para apoiar prateleiras, bancadas ou reforçar estruturas.',
        application: 'Suportes de carga, reforço estrutural e montagem de bancadas.',
        keyParams: ['Altura', 'Base', 'Carga Aplicada', 'Perfil']
    },
    bolts: {
        title: 'Resistência de Parafusos',
        description: 'Cálculo de capacidade de carga e torque para parafusos estruturais de diferentes classes.',
        application: 'Uniões flangeadas, fixação de máquinas e estruturas metálicas.',
        keyParams: ['Diâmetro', 'Classe', 'Quantidade', 'Carga']
    }
    // Add others as needed
};
