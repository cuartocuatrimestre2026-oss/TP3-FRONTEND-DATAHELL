import React from 'react';
import { 
  GitFork, 
  ArrowDown, 
  CheckCircle2, 
  AlertOctagon, 
  UserCog, 
  ShieldAlert, 
  Info,
  CornerDownRight,
  ArrowRight
} from 'lucide-react';

export const AgenticFlowDiagram = ({ solucion, decisiones }) => {
  const { diagramaRecorrido } = solucion;

  return (
    <article className="diagram-block-wrapper" aria-labelledby={`diagram-title-${solucion.id}`}>
      {/* Cabecera del Diagrama */}
      <div className="diagram-header-bar">
        <div className="diagram-title-group">
          <GitFork size={22} className="text-accent" aria-hidden="true" />
          <h3 id={`diagram-title-${solucion.id}`} className="diagram-title">
            Recorrido Gráfico del Flujo Agéntico · {solucion.codigo}
          </h3>
        </div>

        <div className="diagram-legend" aria-label="Leyenda de nodos del diagrama">
          <span className="legend-item"><span className="legend-dot start" /> Entrada</span>
          <span className="legend-item"><span className="legend-dot decision" /> Decisión</span>
          <span className="legend-item"><span className="legend-dot success" /> SÍ (Resultado)</span>
          <span className="legend-item"><span className="legend-dot human" /> NO (Alternativa / Humano)</span>
        </div>
      </div>

      {/* Canvas del Diagrama (Estructura de la guía de la cátedra: Entrada -> Decisión -> SÍ/NO -> Fin) */}
      <div className="flow-canvas-container" tabIndex={0} role="region" aria-label={`Diagrama de flujo visual para ${solucion.codigo}`}>
        <div className="flow-chart-track">
          
          {/* NODO 1: Información de Entrada */}
          <div className="flow-node start">
            <div className="node-meta-line">
              <span className="node-actor-badge">1. Información de Entrada</span>
              <span className="node-order-pill">Inicio</span>
            </div>
            <h4 className="node-title">{diagramaRecorrido.inicio}</h4>
            <p className="node-desc">{diagramaRecorrido.consultaAgente}</p>
          </div>

          <div className="flow-arrow-down" aria-hidden="true">
            <div className="arrow-line" />
            <ArrowDown size={18} />
          </div>

          {/* NODO 2: ¿Se Cumple la Condición? (Decisión Central) */}
          <div className="flow-node decision" style={{ textAlign: 'center', borderColor: 'var(--accent-warning)', borderLeftWidth: '6px' }}>
            <div className="node-meta-line">
              <span className="node-actor-badge" style={{ color: 'var(--accent-warning)' }}>
                2. Evaluación Agéntica
              </span>
              <span className="node-order-pill">¿Condición?</span>
            </div>
            <h4 className="node-title" style={{ fontSize: '1.15rem' }}>
              {diagramaRecorrido.decision}
            </h4>
          </div>

          <div className="flow-arrow-down" aria-hidden="true">
            <div className="arrow-line" />
            <ArrowDown size={18} />
          </div>

          {/* BIFURCACIÓN DE CAMINOS: SÍ (Acción y resultado) vs NO (Alternativa o intervención humana) */}
          <div className="flow-fork-row">
            
            {/* CAMINO SÍ */}
            <div className="branch-column">
              <span className="branch-path-badge yes">
                SÍ (Condición Cumplida)
              </span>

              <div className="flow-node action">
                <div className="node-meta-line">
                  <span className="node-actor-badge">Acción del Agente</span>
                  <span className="node-order-pill">Paso SÍ-1</span>
                </div>
                <h4 className="node-title">Solicitar Acción & Bloqueo</h4>
                <p className="node-desc">{diagramaRecorrido.caminoSi.accion1}</p>
              </div>

              <div className="flow-arrow-down" aria-hidden="true">
                <div className="arrow-line" />
                <ArrowDown size={18} />
              </div>

              <div className="flow-node success">
                <div className="node-meta-line">
                  <span className="node-actor-badge">Resultado Final</span>
                  <span className="node-order-pill">Fin</span>
                </div>
                <h4 className="node-title">
                  <CheckCircle2 size={16} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
                  {diagramaRecorrido.caminoSi.resultadoExito}
                </h4>
                <p className="node-desc">
                  {solucion.id === 'r5'
                    ? 'Aviso registrado como enviado tras confirmación del servicio de mensajería.'
                    : 'Nueva versión creada. Se exige nueva confirmación de cocina antes de marcar lista.'}
                </p>
              </div>
            </div>

            {/* CAMINO NO */}
            <div className="branch-column">
              <span className="branch-path-badge no">
                NO (Condición No Cumplida)
              </span>

              <div className="flow-node human">
                <div className="node-meta-line">
                  <span className="node-actor-badge">Alternativa Agéntica</span>
                  <span className="node-order-pill">Paso NO-1</span>
                </div>
                <h4 className="node-title">Retención o Pausa</h4>
                <p className="node-desc">{diagramaRecorrido.caminoNo.accion1}</p>
              </div>

              <div className="flow-arrow-down" aria-hidden="true">
                <div className="arrow-line" />
                <ArrowDown size={18} />
              </div>

              <div className="flow-node" style={{ borderLeft: '4px solid var(--accent-warning)', background: 'var(--accent-warning-soft)' }}>
                <div className="node-meta-line">
                  <span className="node-actor-badge">Resultado Alternativo</span>
                  <span className="node-order-pill">Fin</span>
                </div>
                <h4 className="node-title">
                  {solucion.id === 'r5' ? 'Aviso Retenido (Sin Emisión)' : 'Modificación Desestimada'}
                </h4>
                <p className="node-desc">{diagramaRecorrido.caminoNo.resultado}</p>
              </div>
            </div>
          </div>

          {/* EXCEPCIÓN / CASO LÍMITE E INTERVENCIÓN HUMANA */}
          <div className="flow-arrow-down" aria-hidden="true">
            <div className="arrow-line" />
            <ArrowDown size={18} />
          </div>

          <div className="flow-node human" style={{ maxWidth: '680px' }}>
            <div className="node-meta-line">
              <span className="node-actor-badge" style={{ color: 'var(--accent-danger)' }}>
                <ShieldAlert size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '4px' }} />
                Caso Límite & Excepción Resuelta
              </span>
              <span className="branch-path-badge alert">Intervención Humana a Bordo</span>
            </div>
            <h4 className="node-title">{solucion.casoLimite.titulo}</h4>
            <p className="node-desc">
              <strong>Escenario imprevisto:</strong> {solucion.casoLimite.descripcion}
            </p>
            <p className="node-desc" style={{ marginTop: '6px' }}>
              <strong>Resolución Agéntica & Humana:</strong> {solucion.casoLimite.resolucion} (Responsable: <em>{solucion.intervencionHumana.quien}</em>).
            </p>
          </div>

        </div>
      </div>

      {/* Supuestos Agregados por el Grupo DataHell */}
      <div className="diagram-assumptions-box">
        <Info size={18} className="assumptions-icon" aria-hidden="true" />
        <div className="assumptions-text-group">
          <span className="assumptions-title">Supuesto de Diseño Agregado por el Equipo DataHell:</span>
          <p>
            {solucion.id === 'r5'
              ? 'La sentencia exige que el aviso no esté en curso y se confirme con éxito. Como decisión de diseño, el equipo agrega un estado transitorio "EN_CURSO" con cerrojo de 30 segundos y 2 reintentos con escalado al Cabin Host si la red satelital se corta en alta mar.'
              : 'La sentencia no detalla el tiempo máximo de espera de cocina ni el caso en que el plato ya esté saliendo en el carrito. El equipo diseñó una señal sonora de HOLD preventiva en la tablet del mozo y arbitraje presencial del Sous Chef.'}
          </p>
        </div>
      </div>
    </article>
  );
};
