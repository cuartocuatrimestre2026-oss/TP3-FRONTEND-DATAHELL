import React from 'react';
import { sentenciasData } from '../data/tap2order_data';
import { Bot, CheckCircle2, ArrowRight, Layers, Sparkles, AlertCircle } from 'lucide-react';

export const SentenciasCards = () => {
  return (
    <div className="sentencias-compact-grid">
      {sentenciasData.map((s) => (
        <article key={s.id} className="sentencia-card-compact" aria-labelledby={`title-${s.id}`}>
          <div className="card-top-bar">
            <span className="code-badge">{s.codigo}</span>
            <span className="tag-category">{s.etiqueta}</span>
          </div>

          <div className="quote-compact">
            <span className="quote-eyebrow">
              <Bot size={13} aria-hidden="true" />
              Regla Asignada:
            </span>
            <p className="quote-text">"{s.sentenciaOriginal}"</p>
          </div>

          <h3 id={`title-${s.id}`} className="compact-title">{s.titulo}</h3>
          <p className="compact-benefit">{s.beneficioClave}</p>

          {/* Chips de datos de entrada */}
          <div className="chips-wrapper">
            <span className="chips-title">Datos Evaluados:</span>
            <div className="chips-list">
              {s.tagsEntrada.map((tag, idx) => (
                <span key={idx} className="chip-pill">
                  <strong>{tag.label}:</strong> {tag.val}
                </span>
              ))}
            </div>
          </div>

          {/* Fórmula Lógica */}
          <div className="formula-box">
            <span className="formula-label">Condición:</span>
            <code>{s.formulaLogica}</code>
          </div>

          {/* Comparativa ágil: Qué viene vs Qué agrega */}
          <div className="contrast-micro-grid">
            <div className="micro-box sentence-origin">
              <span className="micro-label">De la Sentencia</span>
              <p>{s.queVieneDeLaSentencia}</p>
            </div>
            <div className="micro-box proposal-add">
              <span className="micro-label">Decisión Agéntica</span>
              <p>{s.queAgregaLaPropuesta}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
