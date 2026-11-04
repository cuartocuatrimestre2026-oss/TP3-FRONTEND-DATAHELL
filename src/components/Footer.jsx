import React from 'react';
import { startupInfo } from '../data/tap2order_data';
import { ExternalLink, Terminal, Shield, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-header">
              <img 
                src="/img/tap2order-logo.png" 
                alt="Logotipo oficial de Tap2Order" 
                className="footer-logo-img" 
              />
              <img 
                src="/img/logo-DataHell.png" 
                alt="Logotipo de DataHell" 
                className="footer-logo-img" 
              />
              <span className="footer-brand-title">Tap2Order × DataHell</span>
            </div>
            <p className="footer-brand-desc">
              Solución agéntica para <strong>Tap2Order</strong> en el marco del Trabajo Práctico N°3 de <em>Desarrollo de Sistemas Web / Frontend</em>. Desarrollado con los más altos estándares de accesibilidad WCAG 2.1 AAA, diseño responsivo y arquitectura modular.
            </p>
          </div>

          <div>
            <h3 className="footer-col-title">Navegación de Secciones</h3>
            <ul className="footer-links-list">
              <li><a href="#inicio">La Startup</a></li>
              <li><a href="#propuestas">Propuestas Lógicas (R5 y R6)</a></li>
              <li><a href="#diagramas">Diagramas de Flujo (SVG)</a></li>
              <li><a href="#simulador">Simulador en Vivo</a></li>
              <li><a href="#detalles">Desplegables Técnicos</a></li>
              <li><a href="#equipo">Equipo de Desarrollo</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-col-title">Académico & Enlaces</h3>
            <ul className="footer-links-list">
              <li>
                <a 
                  href="https://github.com/cuartocuatrimestre2026-oss/TP3-FRONTEND-DATAHELL" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link-active"
                  title="Abrir repositorio en GitHub"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  <span>Repositorio GitHub (TP3)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://ifts29-portada.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link-active"
                  title="Abrir material de cursada en nueva pestaña"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  <span>Material de Cursada · IFTS 29</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://tp2-frontend-datahell.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link-active"
                  title="Abrir proyecto TP2 DataHell en Vercel"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  <span>Proyecto Previo (TP2 DataHell)</span>
                </a>
              </li>
              <li>
                <span className="footer-meta-pill">
                  Bloque: S14-C · Grupo 09
                </span>
              </li>
              <li>
                <span className="footer-date-tag">
                  Entrega: 26/11/2026
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>
            © 2026 <strong>Equipo DataHell</strong>. Construcción 100% Agéntica dirigida por humanos.
          </div>
          <div className="footer-institution-badge">
            Tecnicatura Superior en Desarrollo de Software · IFTS N°29
          </div>
        </div>
      </div>
    </footer>
  );
};
