import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="main-header">
            <div className="logo-container">
                <svg className="logo-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 4L4 16L32 28L60 16L32 4Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16V40L32 52V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 16V40L32 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M32 60V52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="32" cy="28" r="4" fill="currentColor" fillOpacity="0.2"/>
                </svg>
                <h1>
                    Caldeiraria<span>Pro</span>
                </h1>
            </div>
            <p className="subtitle">
                Ferramenta de Precisão para Desenvolvimento Industrial
            </p>
        </header>
    );
};

export default Header;
