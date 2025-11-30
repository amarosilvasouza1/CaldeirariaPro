import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="main-header">
            <div className="logo-container">
                <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
