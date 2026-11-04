import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido principal (Skip Link)
      </a>

      <header className="site-header" role="banner">
        <div className="container header-container">
          {/* LADO IZQUIERDO: Logo + Marca Principal + IFTS 29 */}
          <a href="#inicio" className="brand-badge" aria-label="Ir al inicio de Tap2Order">
            <img 
              src="./img/tap2order-logo.png" 
              alt="Logotipo oficial de Tap2Order" 
              className="brand-logo-img" 
            />
            <div className="brand-text-block">
              <span className="brand-title">TAP2ORDER</span>
              <span className="brand-subtitle">DATAHELL · IFTS 29</span>
            </div>
          </a>

          {/* LADO DERECHO: Navegación limpia + Píldora destacada + Toggle */}
          <div className="header-right-group">
            <nav className="header-nav" aria-label="Navegación principal">
              <a href="#inicio" className="nav-link">La Startup</a>
              <a href="#diagramas" className="nav-link">Solución Agéntica</a>
              <a href="#simulador" className="nav-link nav-pill-btn">Simulador en Vivo</a>
              <a href="#equipo" className="nav-link">Equipo</a>
            </nav>

            <button
              onClick={toggleTheme}
              className="theme-toggle-icon-btn"
              type="button"
              aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
              title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            >
              {theme === 'dark' ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
