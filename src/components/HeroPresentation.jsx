import React from 'react';
import { startupInfo } from '../data/tap2order_data';
import { Ship, Bot, Cpu, CheckCircle2, Award, ArrowDownRight } from 'lucide-react';

export const HeroPresentation = () => {
  return (
    <section id="inicio" className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-meta-badges">
              <span className="hero-meta-pill highlight">
                <Ship size={14} aria-hidden="true" />
                {startupInfo.rubro}
              </span>
              <span className="hero-meta-pill">
                {startupInfo.grupoAsignado}
              </span>
            </div>

            <h1 id="hero-title" className="hero-title">
              Dos sentencias. <br />
              <span className="text-gradient">Dos flujos agénticos.</span>
            </h1>

            <p className="hero-tagline">
              Arquitectura de automatización agéntica para la gestión inteligente de comandas y avisos en alta mar.
            </p>

            <p className="hero-description">
              {startupInfo.descripcionProblema}
            </p>

            <div className="hero-attribution-card" role="region" aria-label="Reconocimiento institucional">
              <span className="attribution-label">
                <Award size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
                Continuidad de Proyecto Interinstitucional: IFTS 16 ➔ IFTS 29
              </span>
              <p className="attribution-text">
                Las condiciones de funcionamiento fueron formalizadas en lógica proposicional por estudiantes del <strong>IFTS N°16</strong>.
                El <strong>Equipo DataHell (IFTS N°29)</strong> diseñó y estructuró la solución agéntica, los diagramas de recorrido y esta landing interactiva construida 100% mediante agentes de programación.
              </p>
            </div>
          </div>

          <aside className="hero-card-panel" aria-label="Ficha de la startup asignada">
            <div className="hero-logo-wrapper">
              <img
                src={startupInfo.logo}
                alt="Imagotipo original de Tap2Order - Gastronomía en Cruceros"
                className="hero-logo-img"
              />
            </div>
            <h2 className="hero-startup-name">{startupInfo.nombre}</h2>
            <span className="hero-startup-category">Gastronomía & Turismo</span>

            <div className="hero-quick-specs">
              <div className="spec-item">
                <span className="spec-label">Sorteo Cátedra:</span>
                <span className="spec-value">S14-C</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Entorno:</span>
                <span className="spec-value">Crucero de Lujo</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Servicio:</span>
                <span className="spec-value">Camarote / Comedor</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fecha de Entrega:</span>
                <span className="spec-value">{startupInfo.fechaEntrega}</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="hero-stats-row" role="list" aria-label="Métricas del proyecto TP3">
          <div className="stat-box" role="listitem">
            <span className="stat-number">02</span>
            <span className="stat-title">Sentencias Lógicas</span>
            <span className="stat-desc">Desarmadas en fichas de datos, condiciones y consecuencias.</span>
          </div>

          <div className="stat-box" role="listitem">
            <span className="stat-number">02</span>
            <span className="stat-title">Flujos Agénticos</span>
            <span className="stat-desc">Diagramados con bifurcaciones, herramientas y supervisión humana.</span>
          </div>

          <div className="stat-box" role="listitem">
            <span className="stat-number">100%</span>
            <span className="stat-title">Construcción Agéntica</span>
            <span className="stat-desc">Dirigido por humanos, código generado e iterado por agentes IA.</span>
          </div>

          <div className="stat-box" role="listitem">
            <span className="stat-number">AAA</span>
            <span className="stat-title">Accesibilidad WCAG 2.1</span>
            <span className="stat-desc">Contraste &gt; 7:1, soporte de teclado y semántica nativa.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
