import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="main-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="logo-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '40px', height: '40px', color: 'var(--accent)', filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.4))' }}>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 style={{ fontSize: '2.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Caldeiraria<span style={{ color: 'var(--accent)' }}>Pro</span>
                </h1>
            </div>
            <p className="subtitle" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '1px' }}>
                Ferramenta de Precisão para Desenvolvimento Industrial
            </p>
        </header>
    );
};

export default Header;
