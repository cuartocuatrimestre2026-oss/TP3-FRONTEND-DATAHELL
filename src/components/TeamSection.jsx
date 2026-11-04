import React from 'react';
import { equipoData } from '../data/equipo_data';
import { Users, CheckSquare, Sparkles, Shield, Briefcase } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';

export const TeamSection = () => {
  return (
    <section id="equipo" className="team-section" aria-labelledby="equipo-heading">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-tag">
            <Users size={14} aria-hidden="true" />
            Identidad de los Proponentes
          </span>
          <h2 id="equipo-heading" className="section-heading">
            Equipo DataHell · IFTS N°29 (Grupo 09)
          </h2>
          <p className="section-desc">
            Presentamos a <strong>DataHell</strong> como la célula técnica que formula, diseña y estructura las propuestas de automatización agéntica para la startup <strong>Tap2Order</strong> en el marco de la cursada 2026.
          </p>
        </div>

        {/* Distinción explícita de las dos identidades según consigna (Página 6) */}
        <div className="hero-attribution-card" style={{ maxWidth: '960px', margin: '0 auto 32px', borderLeftColor: 'var(--accent-cyan)' }}>
          <span className="attribution-label" style={{ color: 'var(--accent-cyan)' }}>
            <Briefcase size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
            Distinción de Identidades: Destinataria vs. Proponentes
          </span>
          <p className="attribution-text">
            <strong>Startup Destinataria:</strong> <em>Tap2Order</em> (Gastronomía y turismo a bordo de cruceros), titular del problema operativo y receptora de la propuesta técnica con su logo original.<br />
            <strong>Equipo Proponente de Soluciones:</strong> <em>DataHell</em> (IFTS N°29 - Grupo 09), autores del diseño agéntico, diagramación y construcción web asistida por IA.
          </p>
        </div>

        {/* Declaración de Revisión entre Pares (Requisito PROPONE Criterio 01) */}
        <div className="hero-attribution-card" style={{ maxWidth: '960px', margin: '0 auto 40px', borderLeftColor: 'var(--accent-primary)' }}>
          <span className="attribution-label" style={{ color: 'var(--accent-primary)' }}>
            <CheckSquare size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
            Criterio 01 (Nivel Propone) · Revisión entre Integrantes y Mejora Concreta
          </span>
          <p className="attribution-text">
            Durante la primera iteración de la Sentencia R5, el agente propuso un flujo directo de notificación sin contemplar la latencia o desconexión satelital propia de un buque en alta mar. En la sesión de revisión interna entre <strong>Johana Navarro</strong> y <strong>Sergio Arenhardt</strong>, se detectó que esto violaba la condición <em>"solo registra el aviso como enviado después de la confirmación exitosa"</em> ante un timeout. Se introdujo como <strong>mejora concreta</strong> el estado transitorio <code>EN_CURSO</code> con candado de concurrencia y el protocolo de escalado presencial al <strong>Cabin Host</strong> tras dos reintentos fallidos.
          </p>
        </div>

        {/* Tarjetas de Integrantes */}
        <div className="team-grid" role="list">
          {equipoData.map((miembro) => (
            <article key={miembro.id} className="member-card" role="listitem" aria-labelledby={`member-name-${miembro.id}`}>
              <div className="member-card-header">
                <div className="member-avatar-wrap">
                  <img 
                    src={miembro.avatar} 
                    alt={`Fotografía de ${miembro.nombre}`} 
                    className="member-avatar-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './img/logo-DataHell.png';
                    }}
                  />
                </div>
                <div className="member-name-block">
                  <h3 id={`member-name-${miembro.id}`} className="member-name">{miembro.nombre}</h3>
                  <span className="member-role">{miembro.rol}</span>
                  <span className="member-location">{miembro.ubicacion}</span>
                </div>
              </div>

              <p className="member-bio-text">{miembro.bio}</p>

              <div className="member-contribution-box">
                <span className="contribution-tag">Aporte Concreto en TP3:</span>
                <p className="contribution-text">{miembro.aporteTP3}</p>
              </div>

              <div className="member-footer-links">
                <a 
                  href={miembro.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="member-link-btn"
                  aria-label={`Ver perfil de GitHub de ${miembro.nombre}`}
                >
                  <GithubIcon size={14} />
                  <span>GitHub</span>
                </a>

                {miembro.linkedin && (
                  <a 
                    href={miembro.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="member-link-btn"
                    aria-label={`Ver perfil de LinkedIn de ${miembro.nombre}`}
                  >
                    <LinkedinIcon size={14} />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
