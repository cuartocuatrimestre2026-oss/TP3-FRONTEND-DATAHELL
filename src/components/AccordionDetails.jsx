import React from 'react';
import { sentenciasData } from '../data/tap2order_data';
import { ChevronDown, Cpu, HelpCircle, Layers, Check, ShieldAlert } from 'lucide-react';

export const AccordionDetails = () => {
  return (
    <section id="detalles" className="accordion-section" aria-labelledby="desplegables-heading">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-tag">
            <Layers size={14} aria-hidden="true" />
            Desplegables Técnicos
          </span>
          <h2 id="desplegables-heading" className="section-heading">
            Los Detalles de Cada Solución
          </h2>
          <p className="section-desc">
            Consultá la especificación técnica en desplegables ágiles para no recargar la lectura. Se abren con un clic o con teclado (tecla Enter / Espacio).
          </p>
        </div>

        <div className="accordion-list-wrap">
          {sentenciasData.map((s) => (
            <details key={s.id} className="accessible-details-card">
              <summary className="details-summary-btn" aria-label={`Ver detalles de ${s.codigo}`}>
                <div className="summary-left-group">
                  <span className="summary-code-pill">{s.codigo}</span>
                  <span className="summary-title-text">{s.titulo}</span>
                </div>
                <ChevronDown size={20} className="summary-icon-toggle" aria-hidden="true" />
              </summary>

              <div className="details-expanded-body">
                <div className="expanded-meta-grid">
                  <div className="expanded-data-box">
                    <span className="expanded-box-label">
                      <Cpu size={14} aria-hidden="true" />
                      1. ¿Qué datos entran?
                    </span>
                    <p className="expanded-box-text">
                      {s.tagsEntrada.map(t => `${t.label}: ${t.val}`).join(' · ')}
                    </p>
                  </div>

                  <div className="expanded-data-box">
                    <span className="expanded-box-label">
                      <HelpCircle size={14} aria-hidden="true" />
                      2. ¿Qué se decide?
                    </span>
                    <p className="expanded-box-text">
                      <code>{s.formulaLogica}</code>
                    </p>
                  </div>

                  <div className="expanded-data-box">
                    <span className="expanded-box-label">
                      <Layers size={14} aria-hidden="true" />
                      3. ¿Qué acción se propone?
                    </span>
                    <p className="expanded-box-text">
                      {s.queAgregaLaPropuesta}
                    </p>
                  </div>

                  <div className="expanded-data-box">
                    <span className="expanded-box-label">
                      <Check size={14} aria-hidden="true" />
                      4. ¿Cuál es el resultado esperado?
                    </span>
                    <p className="expanded-box-text">
                      {s.beneficioClave}
                    </p>
                  </div>
                </div>

                <div className="expanded-exception-callout" role="region" aria-label="Excepciones y caso límite">
                  <span className="exception-title">
                    <ShieldAlert size={16} aria-hidden="true" />
                    5. Caso Límite & Intervención Humana (Nivel Propone)
                  </span>
                  <p className="exception-desc">
                    <strong>Escenario:</strong> {s.casoLimite}
                    <br />
                    <strong>Tripulante Responsable:</strong> {s.intervencionHumana}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
