import React from 'react';
import type { CalcResult, InputData } from '../../types';
import { jsPDF } from 'jspdf';

interface ResultsPanelProps {
    results: CalcResult | null;
    shape: string;
    inputs: InputData | null;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, shape, inputs, canvasRef }) => {
    const [isStepsOpen, setIsStepsOpen] = React.useState(false);
    
    if (!results) {
        return (
            <section className="glass-panel" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                <h2><span style={{ marginRight: '0.5rem' }}>📐</span> Visualização & Resultados</h2>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    <p>Selecione uma forma e insira as dimensões para visualizar o traçado.</p>
                </div>
            </section>
        );
    }

    const handleDownloadPDF = () => {
        if (!canvasRef.current || !inputs) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // --- Header Background ---
        doc.setFillColor(15, 23, 42); // Dark Blue
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // --- Logo / Title ---
        doc.setTextColor(245, 158, 11); // Accent Gold
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('CaldeirariaPro', 20, 20);
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Relatório Técnico de Fabricação', 20, 30);

        // --- Date & Shape Info ---
        doc.setTextColor(148, 163, 184); // Muted text
        doc.text(`Data: ${new Date().toLocaleDateString()}`, pageWidth - 20, 20, { align: 'right' });
        doc.text(`Peça: ${shape.toUpperCase()}`, pageWidth - 20, 30, { align: 'right' });

        let y = 55;

        // --- Section: Parâmetros ---
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 5, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('Parâmetros de Entrada', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        
        let xPos = 20;
        Object.entries(inputs).forEach(([key, value]) => {
            if (key === 'material') return; // Skip material if needed or format it
            const text = `${key}: ${value}`;
            doc.text(text, xPos, y);
            xPos += 60;
            if (xPos > pageWidth - 40) {
                xPos = 20;
                y += 6;
            }
        });
        y += 15;

        // --- Section: Resultados ---
        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 5, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('Resultados Calculados', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        
        Object.entries(results.metrics).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`, 20, y);
            y += 6;
        });
        y += 10;

        // --- Diagram ---
        // Center the image
        const canvasImg = canvasRef.current.toDataURL('image/png');
        const imgProps = doc.getImageProperties(canvasImg);
        const pdfWidth = 120; // Max width for image
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const xImg = (pageWidth - pdfWidth) / 2;

        if (y + pdfHeight > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }

        // Draw dark background for the diagram to ensure visibility of white lines/textures
        doc.setFillColor(20, 20, 30); // Dark background color matching the app theme
        doc.rect(xImg, y, pdfWidth, pdfHeight, 'F');

        doc.addImage(canvasImg, 'PNG', xImg, y, pdfWidth, pdfHeight);
        y += pdfHeight + 15;

        // --- Section: Passo a Passo ---
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }

        doc.setFillColor(240, 240, 240);
        doc.rect(15, y - 5, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text('Passo a Passo de Fabricação', 20, y);
        y += 12;

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');

        results.steps.forEach((step, index) => {
            const stepTitle = `${index + 1}.`;
            const stepContent = step;
            
            const splitContent = doc.splitTextToSize(stepContent, pageWidth - 45);
            
            if (y + (splitContent.length * 5) > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }

            doc.setFont('helvetica', 'bold');
            doc.text(stepTitle, 20, y);
            
            doc.setFont('helvetica', 'normal');
            doc.text(splitContent, 30, y);
            
            y += (splitContent.length * 5) + 4;
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Página ${i} de ${pageCount} - Gerado por CaldeirariaPro`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        doc.save(`caldeiraria-pro-${shape}.pdf`);
    };

    return (
        <section className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2><span style={{ marginRight: '0.5rem' }}>📐</span> Visualização & Resultados</h2>
            </div>
            
            <div style={{ 
                background: 'rgba(0, 0, 0, 0.3)', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '2rem', 
                border: '1px dashed rgba(148, 163, 184, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            }}>
                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} /> 
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {Object.entries(results.metrics).map(([key, value]) => (
                    <div key={key} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem' }}>{key}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", color: '#f8fafc' }}>{value}</span>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <button 
                    onClick={() => setIsStepsOpen(!isStepsOpen)}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        width: '100%',
                        textAlign: 'left',
                        marginBottom: '1rem'
                    }}
                >
                    <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1rem', color: '#f59e0b', margin: 0, flex: 1 }}>
                        Passo a Passo de Fabricação
                    </h3>
                    <span style={{ 
                        color: '#f59e0b', 
                        transform: isStepsOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.3s ease' 
                    }}>
                        ▼
                    </span>
                </button>
                
                <div style={{ 
                    maxHeight: isStepsOpen ? '2000px' : '0',
                    opacity: isStepsOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: isStepsOpen ? '1rem' : '0'
                }}>
                    <ul style={{ listStyle: 'none', counterReset: 'step-counter' }}>
                        {results.steps.map((step, index) => (
                            <li key={index} style={{ position: 'relative', paddingLeft: '2.5rem', marginBottom: '1rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                                <span style={{ position: 'absolute', left: 0, top: 0, width: '1.8rem', height: '1.8rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#f59e0b' }}>
                                    {index + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Classroom Mode Modal */}

            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={handleDownloadPDF} className="secondary-button" style={{ flex: 1 }}>
                    Baixar Relatório PDF
                </button>
                <button 
                    disabled 
                    className="secondary-button" 
                    style={{ 
                        flex: 1, 
                        opacity: 0.5, 
                        cursor: 'not-allowed', 
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Exportar DXF (CAD)
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#f59e0b',
                        color: '#000',
                        fontSize: '0.6rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                    }}>
                        EM BREVE
                    </span>
                </button>
                <button 
                    disabled 
                    className="secondary-button" 
                    style={{ 
                        flex: 1, 
                        opacity: 0.5, 
                        cursor: 'not-allowed', 
                        position: 'relative',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    Otimização (Nesting)
                    <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#f59e0b',
                        color: '#000',
                        fontSize: '0.6rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                    }}>
                        EM BREVE
                    </span>
                </button>
            </div>
        </section>
    );
};

export default ResultsPanel;
