import React, { useState, useRef } from 'react';
import ShapeSelector from './components/features/ShapeSelector';
import InputPanel from './components/features/InputPanel';
import ResultsPanel from './components/features/ResultsPanel';
import DiagramCanvas from './components/diagram/DiagramCanvas';
import Header from './components/layout/Header';

import { calculateCylinder } from './features/cylinder/logic';
import { calculateCone } from './features/cone/logic';
import { calculateSquareToRound } from './features/square-to-round/logic';
import { calculateElbow } from './features/elbow/logic';
import { calculateOffset } from './features/offset/logic';
import { calculateStairs } from './features/stairs/logic';
import { calculateBracket } from './features/bracket/logic';
import { calculateBolts } from './features/bolts/logic';
import { calculatePlateWeight } from './features/plate-weight/logic';
import { calculateVolumes } from './features/volumes/logic';
import { InfoPopover } from './components/common/InfoPopover';

import type { ShapeData, CalcResult, InputData } from './types';

const App: React.FC = () => {
    const [currentShape, setCurrentShape] = useState<string | null>(null);
    const [results, setResults] = useState<CalcResult | null>(null);
    const [inputs, setInputs] = useState<InputData | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleShapeSelect = (shape: string) => {
        setCurrentShape(shape);
        setResults(null);
        setInputs(null);
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
                res = calculateBolts(data, material);
                break;
            case 'plate-weight':
                res = calculatePlateWeight(data, material);
                break;
            case 'volumes':
                res = calculateVolumes(data);
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
                                {!['cylinder', 'cone', 'square-to-round', 'elbow', 'offset', 'stairs', 'bracket', 'bolts', 'plate-weight', 'volumes'].includes(currentShape) && 'Módulo em Desenvolvimento'}
                            </span>
                            
                            <InfoPopover shapeId={currentShape} />
                        </h2>

                        {['cylinder', 'cone', 'square-to-round', 'elbow', 'offset', 'stairs', 'bracket', 'bolts', 'plate-weight', 'volumes'].includes(currentShape) ? (
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
