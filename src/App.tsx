import React, { useState, useRef } from 'react';
import ShapeSelector from './components/features/ShapeSelector';
import InputPanel from './components/features/InputPanel';
import ResultsPanel from './components/features/ResultsPanel';
import DiagramCanvas from './components/diagram/DiagramCanvas';
import Header from './components/layout/Header';

import { calculateCylinder } from './features/cylinder/logic';
import { calculateCone, getConeTheory } from './features/cone/logic';
import { calculateSquareToRound } from './features/square-to-round/logic';
import { calculateElbow } from './features/elbow/logic';
import { calculateOffset } from './features/offset/logic';
import { calculateStairs } from './features/stairs/logic';
import { calculateBracket } from './features/bracket/logic';
import { calculateBolts } from './features/bolts/logic';
import { calculatePlateWeight } from './features/plate-weight/logic';
import { calculateVolumes } from './features/volumes/logic';
import { calculatePipeBranching } from './features/pipe-branching/logic';
import { calculateArc } from './features/arc-calculator/logic';
import { InfoPopover } from './components/common/InfoPopover';

import type { ShapeData, CalcResult, InputData } from './types';

const App: React.FC = () => {
    const [currentShape, setCurrentShape] = useState<string | null>(null);
    const [results, setResults] = useState<CalcResult | null>(null);
    const [inputs, setInputs] = useState<InputData | null>(null);
    const [isClassroomMode, setIsClassroomMode] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const classroomPopoverRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (classroomPopoverRef.current && !classroomPopoverRef.current.contains(event.target as Node)) {
                setIsClassroomMode(false);
            }
        };

        if (isClassroomMode) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isClassroomMode]);

    const handleShapeSelect = (shape: string) => {
        setCurrentShape(shape);
        setResults(null);
        setInputs(null);
        setIsClassroomMode(false);
    };

    const handleCalculate = React.useCallback((data: ShapeData, material: string) => {
        if (!currentShape) return;
        
        let res: CalcResult | null = null;
        
        // Add material to inputs for display
        const displayInputs: InputData = { ...data, material };
        setInputs(displayInputs);

        switch (currentShape) {
            case 'cylinder':
                res = calculateCylinder(data, material);
                break;
            case 'cone':
                res = calculateCone(data, material);
                break;
            case 'square-to-round':
                res = calculateSquareToRound(data, material);
                break;
            case 'elbow':
                res = calculateElbow(data, material);
                break;
            case 'offset':
                res = calculateOffset(data, material);
                break;
            case 'stairs':
                res = calculateStairs(data, material);
                break;
            case 'bracket':
                res = calculateBracket(data, material);
                break;
            case 'bolts':
                res = calculateBolts(data);
                break;
            case 'plate-weight':
                res = calculatePlateWeight(data, material);
                break;
            case 'volumes':
                res = calculateVolumes(data);
                break;
            case 'pipe-branching':
                res = calculatePipeBranching(data);
                break;
            case 'arc-calculator':
                res = calculateArc(data);
                break;

            default:
                break;
        }
        setResults(res);
    }, [currentShape]);

    return (
        <div className="app-container">
            <Header />

            <main className="main-content">
                {!currentShape ? (
                    <ShapeSelector currentShape={currentShape} onSelect={handleShapeSelect} />
                ) : (
                    <div className="animate-fade-in">
                        <h2 className="module-header">
                            <button 
                                className="back-button" 
                                onClick={() => {
                                    setCurrentShape(null);
                                    setResults(null);
                                    setInputs({});
                                    setIsClassroomMode(false);
                                }}
                            >
                                ← Voltar
                            </button>

                            <span style={{ flex: 1 }}>
                                {currentShape === 'cylinder' && 'Tanque Cilíndrico'}
                                {currentShape === 'cone' && 'Cone'}
                                {currentShape === 'square-to-round' && 'Quadrado para Redondo'}
                                {currentShape === 'elbow' && 'Curva de Gomo'}
                                {currentShape === 'offset' && 'Desvio (Offset)'}
                                {currentShape === 'stairs' && 'Escada Helicoidal'}
                                {currentShape === 'bracket' && 'Mão Francesa'}
                                {currentShape === 'bolts' && 'Resistência de Parafusos'}
                                {currentShape === 'plate-weight' && 'Calculadora de Peso de Chapas'}
                                {currentShape === 'volumes' && 'Cálculo de Volumes e Áreas'}
                                {currentShape === 'pipe-branching' && 'Boca de Lobo'}
                                {currentShape === 'arc-calculator' && 'Calculadora de Arco'}
                                {!['cylinder', 'cone', 'square-to-round', 'elbow', 'offset', 'stairs', 'bracket', 'bolts', 'plate-weight', 'volumes', 'pipe-branching', 'arc-calculator'].includes(currentShape) && 'Módulo em Desenvolvimento'}
                            </span>

                            {/* Classroom Mode Button - Visible for supported shapes */}
                            {['cone'].includes(currentShape || '') && (
                                <div ref={classroomPopoverRef} style={{ position: 'relative', marginRight: '1rem' }} className="tooltip-container">
                                    <button 
                                        onClick={() => setIsClassroomMode(!isClassroomMode)}
                                        className={`classroom-mode-btn ${isClassroomMode ? 'active' : ''}`}
                                        style={{ 
                                            background: isClassroomMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)', 
                                            border: `1px solid ${isClassroomMode ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`, 
                                            color: isClassroomMode ? '#f59e0b' : '#94a3b8',
                                            width: '42px', 
                                            height: '42px', 
                                            borderRadius: '12px', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            zIndex: 60,
                                            boxShadow: isClassroomMode ? '0 0 15px rgba(245, 158, 11, 0.3)' : 'none',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        title="Modo Aula: Entenda a Matemática"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s ease', transform: isClassroomMode ? 'scale(1.1)' : 'scale(1)' }}>
                                            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                    
                                    {/* Tooltip */}
                                    {!isClassroomMode && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '120%',
                                            right: 0,
                                            marginTop: '0.5rem',
                                            background: 'rgba(15, 23, 42, 0.95)',
                                            color: '#e2e8f0',
                                            padding: '0.6rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            whiteSpace: 'nowrap',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            pointerEvents: 'none',
                                            opacity: 0,
                                            transform: 'translateY(-5px)',
                                            transition: 'all 0.2s',
                                            zIndex: 50,
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            backdropFilter: 'blur(8px)'
                                        }} className="tooltip-text">
                                            Modo Aula
                                        </span>
                                    )}

                                    {/* Popover Content */}
                                    {isClassroomMode && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '130%',
                                            right: '-20px',
                                            width: '380px',
                                            background: 'rgba(30, 41, 59, 0.95)',
                                            border: '1px solid rgba(245, 158, 11, 0.3)',
                                            borderRadius: '16px',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                                            zIndex: 100,
                                            overflow: 'hidden',
                                            animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            backdropFilter: 'blur(12px)'
                                        }}>
                                            <div style={{ 
                                                padding: '1.2rem', 
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                background: 'linear-gradient(to right, rgba(245, 158, 11, 0.1), transparent)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                                    <div style={{ 
                                                        background: 'rgba(245, 158, 11, 0.2)', 
                                                        padding: '0.4rem', 
                                                        borderRadius: '8px',
                                                        color: '#f59e0b',
                                                        display: 'flex'
                                                    }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="currentColor"/>
                                                        </svg>
                                                    </div>
                                                    <h4 style={{ margin: 0, color: '#f1f5f9', fontFamily: "'Orbitron', sans-serif", fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                                                        Matemática Aplicada
                                                    </h4>
                                                </div>
                                                <button 
                                                    onClick={() => setIsClassroomMode(false)}
                                                    style={{ 
                                                        background: 'rgba(255, 255, 255, 0.05)', 
                                                        border: 'none', 
                                                        color: '#94a3b8', 
                                                        cursor: 'pointer', 
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.1rem', 
                                                        padding: 0, 
                                                        lineHeight: 1,
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div style={{ padding: '1.2rem', maxHeight: '60vh', overflowY: 'auto' }} className="custom-scrollbar">
                                                <div style={{ display: 'grid', gap: '1.2rem' }}>
                                                    {(results?.theory || (currentShape === 'cone' ? getConeTheory() : [])).map((item, index) => (
                                                        <div key={index} style={{ 
                                                            background: 'rgba(15, 23, 42, 0.6)', 
                                                            padding: '1rem', 
                                                            borderRadius: '10px', 
                                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            position: 'relative',
                                                            overflow: 'hidden'
                                                        }}>
                                                            <div style={{
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                bottom: 0,
                                                                width: '3px',
                                                                background: '#f59e0b',
                                                                opacity: 0.7
                                                            }} />
                                                            <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '0.6rem', fontSize: '0.9rem', letterSpacing: '0.3px' }}>{item.title}</strong>
                                                            <p style={{ color: '#cbd5e1', margin: 0, whiteSpace: 'pre-line', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6', fontSize: '0.8rem' }}>
                                                                {item.content}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    
                                                    {!results?.theory && currentShape !== 'cone' && (
                                                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 1rem' }}>
                                                            <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>🚧</div>
                                                            <p style={{ marginBottom: '0.5rem', color: '#e2e8f0' }}>Módulo em Desenvolvimento</p>
                                                            <p style={{ fontSize: '0.85rem' }}>A explicação matemática para esta forma estará disponível em breve.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ 
                                                padding: '0.8rem', 
                                                textAlign: 'center', 
                                                borderTop: '1px solid rgba(255,255,255,0.05)', 
                                                background: 'rgba(15, 23, 42, 0.3)',
                                                color: '#64748b', 
                                                fontSize: '0.75rem',
                                                fontFamily: "'Orbitron', sans-serif",
                                                letterSpacing: '1px'
                                            }}>
                                                CALDEIRARIA PRO • EDU
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <InfoPopover shapeId={currentShape} />
                        </h2>

                        {['cylinder', 'cone', 'square-to-round', 'elbow', 'offset', 'stairs', 'bracket', 'bolts', 'plate-weight', 'volumes', 'pipe-branching', 'arc-calculator'].includes(currentShape) ? (
                            <div className="workspace-grid">
                                <div className="sticky-sidebar">
                                    <InputPanel key={currentShape} shape={currentShape} onCalculate={handleCalculate} />
                                </div>
                                <div className="results-area">
                                    <DiagramCanvas canvasRef={canvasRef} shape={currentShape} data={results?.calculated} inputs={inputs} />
                                    <ResultsPanel 
                                        results={results} 
                                        shape={currentShape} 
                                        inputs={inputs} 
                                        canvasRef={canvasRef}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem' }}>
                                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                                    Este módulo está sendo implementado. Aguarde novidades! 🚧
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
