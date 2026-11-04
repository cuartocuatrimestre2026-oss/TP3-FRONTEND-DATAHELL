import React from 'react';
import { 
  Bot, 
  Wrench, 
  AlertTriangle, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  Database, 
  Radio, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';

export const ProposalCard = ({ propuesta }) => {
  return (
    <article className="proposal-card-block" aria-labelledby={`propuesta-title-${propuesta.id}`}>
      {/* Encabezado con código de sentencia y bloque */}
      <div className="proposal-header">
        <span className="proposal-code-badge">{propuesta.codigo}</span>
        <span className="proposal-category">{propuesta.bloque}</span>
      </div>

      {/* Sentencia Original Textual */}
      <div className="sentence-quote-box">
        <span className="sentence-quote-label">
          <Bot size={15} aria-hidden="true" />
          Sentencia Original Asignada por la Cátedra (Redacción Exacta)
        </span>
        <blockquote className="sentence-quote-text">
          "{propuesta.sentenciaOriginal}"
        </blockquote>
      </div>

      {/* Título de la Solución y Beneficio en 2-3 frases */}
      <div className="proposal-main-content">
        <h3 id={`propuesta-title-${propuesta.id}`} className="proposal-title">
          {propuesta.tituloSolucion}
        </h3>
        <p className="proposal-benefit-p">
          {propuesta.resumenBeneficio}
        </p>
      </div>

      {/* Ficha Breve obligatoria: Sentencia ➔ Datos ➔ Condición ➔ Consecuencia */}
      <section className="logic-breakdown-card" aria-label={`Ficha breve de ${propuesta.codigo}`}>
        <h4 className="logic-card-title">
          <Database size={16} aria-hidden="true" />
          Ficha Breve: Desarme de la Sentencia
        </h4>

        <div className="logic-grid">
          <div className="logic-field-group">
            <span className="logic-field-label">1. Datos Necesarios:</span>
            <div className="logic-condition-box" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
              {propuesta.fichaBreve.datosNecesarios}
            </div>
          </div>

          <div className="logic-field-group">
            <span className="logic-field-label">2. Condición Evaluada:</span>
            <div className="logic-condition-box">
              <code>{propuesta.fichaBreve.condicion}</code>
            </div>
          </div>

          <div className="logic-consequence-row">
            <div className="consequence-box positive" style={{ gridColumn: '1 / -1' }}>
              <span className="consequence-title">
                <CheckCircle size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
                3. Consecuencia que Establece:
              </span>
              <p>{propuesta.fichaBreve.consecuencia}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Análisis Comparativo: Qué viene de la regla vs Qué agrega la propuesta */}
      <section className="logic-breakdown-card" style={{ marginTop: '20px', background: 'var(--bg-card-elevated)' }}>
        <h4 className="logic-card-title">
          <Layers size={16} aria-hidden="true" />
          Análisis de Diseño Agéntico (Decisiones del Grupo)
        </h4>

        <div className="logic-grid" style={{ gap: '16px' }}>
          <div className="expanded-data-box" style={{ borderLeft: '3px solid var(--accent-cyan)' }}>
            <span className="expanded-box-label" style={{ color: 'var(--accent-cyan)' }}>
              ¿Qué viene de la sentencia?
            </span>
            <p className="expanded-box-text">
              {propuesta.analisisPropuesta.queVieneDeLaSentencia}
            </p>
          </div>

          <div className="expanded-data-box" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
            <span className="expanded-box-label" style={{ color: 'var(--accent-primary)' }}>
              ¿Qué agrega la propuesta agéntica? (Decisión de diseño)
            </span>
            <p className="expanded-box-text">
              {propuesta.analisisPropuesta.queAgregaLaPropuesta}
            </p>
          </div>
        </div>

        {/* Cómo Comprobarlo según consigna */}
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span className="logic-field-label" style={{ color: 'var(--text-primary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            <Sparkles size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
            Cómo Comprobarlo (Casos Concretos):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="consequence-box positive" style={{ fontSize: '0.86rem', padding: '10px 14px' }}>
              <strong>Caso que cumple la condición:</strong> {propuesta.analisisPropuesta.comoComprobarlo.casoCumple}
            </div>
            <div className="consequence-box negative" style={{ fontSize: '0.86rem', padding: '10px 14px' }}>
              <strong>Caso que NO cumple la condición:</strong> {propuesta.analisisPropuesta.comoComprobarlo.casoNoCumple}
            </div>
            <div className="expanded-exception-callout" style={{ fontSize: '0.86rem', padding: '10px 14px' }}>
              <strong>Caso Límite / Excepción Marítima:</strong> {propuesta.analisisPropuesta.comoComprobarlo.casoExcepcion}
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas e Intervención Humana */}
      <div className="support-columns" style={{ marginTop: '24px' }}>
        <section className="tools-panel" aria-label="Herramientas que consulta el agente">
          <h4 className="panel-header-title">
            <Wrench size={15} aria-hidden="true" />
            Herramientas que Consultaría el Futuro Agente
          </h4>
          <div className="tools-items-list">
            {propuesta.herramientasAgente.map((herramienta, idx) => (
              <div key={idx} className="tool-item-card">
                <div className="tool-name-line">
                  <span className="tool-title">{herramienta.nombre}</span>
                  <span className="badge badge-cyan">{herramienta.tipo}</span>
                </div>
                <p className="tool-desc">{herramienta.proposito}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="human-panel" aria-label="Intervención humana requerida">
          <h4 className="panel-header-title">
            <UserCheck size={15} aria-hidden="true" />
            ¿Cuándo Pediría Ayuda a una Persona?
          </h4>
          <p className="human-condition-text">
            <strong>Momento de intervención:</strong> {propuesta.intervencionHumana.cuando}
          </p>
          <div className="human-actor-badge">
            <Radio size={14} aria-hidden="true" />
            Rol a bordo: {propuesta.intervencionHumana.quien}
          </div>
          <p className="human-action-desc">
            <strong>Acción humana solicitada:</strong> {propuesta.intervencionHumana.accion}
          </p>
        </section>
      </div>
    </article>
  );
};
