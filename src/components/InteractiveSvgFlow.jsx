import React, { useState } from 'react';
import { Sparkles, Info, CheckCircle2, AlertTriangle, ShieldAlert, CornerDownRight } from 'lucide-react';

export const InteractiveSvgFlow = ({ activeFlow = 'r5', onSelectNode, selectedNodeId }) => {
  const [internalSelected, setInternalSelected] = useState('r5-decision');
  const currentNode = selectedNodeId || internalSelected;

  const handleNodeClick = (nodeId) => {
    setInternalSelected(nodeId);
    if (onSelectNode) onSelectNode(nodeId);
  };

  // Nodos y detalles explicativos
  const nodeDetails = {
    // FLUJO R5
    'r5-start': {
      titulo: '1. Información de Entrada (Cocina)',
      actor: 'Sistema de Cocina / KDS',
      desc: 'La brigada de cocina finaliza la preparación y marca el pedido como LISTO en su pantalla.',
      tipo: 'info'
    },
    'r5-decision': {
      titulo: '2. Evaluación Agéntica Central',
      actor: 'Agente Tap2Order',
      desc: 'El agente verifica: ¿La versión está lista Y NO hay modificaciones pendientes Y el aviso NO fue enviado ni está en curso?',
      tipo: 'decision'
    },
    'r5-action-send': {
      titulo: '3A. Disparo de Aviso & Candado',
      actor: 'CruiseMessagingGateway',
      desc: 'Condición CUMPLIDA (SÍ): Se despacha la solicitud a la app del pasajero y se fija el estado transitorio "EN_CURSO" para evitar duplicados.',
      tipo: 'action'
    },
    'r5-end-success': {
      titulo: '4A. Registro Final como ENVIADO',
      actor: 'OrderVersionDB',
      desc: 'El servicio a bordo confirma recepción exitosa (ACK 200). Se persiste formalmente como ENVIADO. Fin del flujo.',
      tipo: 'success'
    },
    'r5-action-hold': {
      titulo: '3B. Retención Preventiva de Aviso',
      actor: 'Agente Tap2Order',
      desc: 'Condición NO CUMPLIDA (NO): Hay cambio pendiente o aviso ya emitido. Se pausa el aviso para no desinformar al huésped.',
      tipo: 'warning'
    },
    'r5-end-hold': {
      titulo: '4B. Fin: Aviso Pausado',
      actor: 'Monitor de Servicio',
      desc: 'El aviso no se emite hasta resolver la modificación pendiente o se descarta por ya haber sido entregado.',
      tipo: 'warning'
    },
    'r5-exception': {
      titulo: 'Excepción: Timeout Satelital en Alta Mar',
      actor: 'Cabin Host (Tripulante Humano)',
      desc: 'Tras 2 reintentos sin acuse de recibo de red, el agente alerta al asistente de cabina para entregar aviso verbal en el camarote.',
      tipo: 'human'
    },

    // FLUJO R6
    'r6-start': {
      titulo: '1. Solicitud de Modificación',
      actor: 'Pasajero en Camarote / Cubierta',
      desc: 'El huésped pide cambiar un plato o ingrediente de un pedido que ya había sido enviado a cocina.',
      tipo: 'info'
    },
    'r6-action-freeze': {
      titulo: '2. Bloqueo Inmediato y Consulta',
      actor: 'Agente Tap2Order',
      desc: 'Marca el cambio como PENDIENTE, congela avisos de listo, resguarda versión Vn y consulta a cocina y al pasajero.',
      tipo: 'action'
    },
    'r6-decision-dual': {
      titulo: '3. Evaluación de Consenso Dual',
      actor: 'Cocina KDS + App Pasajero',
      desc: '¿Constan TANTO la aprobación de cocina (viabilidad técnica) COMO la confirmación del pasajero (nuevos tiempos)?',
      tipo: 'decision'
    },
    'r6-action-create': {
      titulo: '4A. Creación de Versión Vn+1',
      actor: 'VersionHistoryStore',
      desc: 'AMBOS APRUEBAN (SÍ): Se genera formalmente la nueva versión Vn+1 del pedido en base inmutable.',
      tipo: 'action'
    },
    'r6-end-success': {
      titulo: '5A. Exigir Nueva Confirmación de Cocina',
      actor: 'Cocina Central',
      desc: 'La nueva versión Vn+1 exige una NUEVA confirmación de cocina antes de poder marcarse como lista. Fin.',
      tipo: 'success'
    },
    'r6-action-cancel': {
      titulo: '4B. Desestimación del Cambio',
      actor: 'Agente Tap2Order',
      desc: 'FALTA ALGUNO O COCINA RECHAZA (NO): Se descarta la modificación y se despausan los avisos normales.',
      tipo: 'warning'
    },
    'r6-end-original': {
      titulo: '5B. Despacho Seguro de Versión Vn',
      actor: 'Servicio de Entrega',
      desc: 'Se mantiene y sirve la versión original Vn previamente cocinada. Fin.',
      tipo: 'warning'
    },
    'r6-exception': {
      titulo: 'Excepción: Plato en Bandeja de Salida Rápida',
      actor: 'Sous Chef (Jefe de Cocina)',
      desc: 'El pedido ya estaba en el carrito de entrega. Alarma HOLD en la tablet del mozo e intervención del Chef para arbitrar cortesía.',
      tipo: 'human'
    }
  };

  const activeInfo = nodeDetails[currentNode] || nodeDetails['r5-decision'];

  return (
    <div className="svg-flow-wrapper">
      <div className="svg-flow-container" role="region" aria-label="Diagrama interactivo en SVG">
        {activeFlow === 'r5' ? (
          /* SVG FLUJO R5 - DISEÑO SIN SUPERPOSICIONES Y ALTURA COMPACTA */
          <svg viewBox="0 0 820 315" className="interactive-flow-svg">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" />
              </marker>
              <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-primary)" />
              </marker>
            </defs>

            {/* LÍNEAS DE CONEXIÓN */}
            {/* 1 -> 2 */}
            <path d="M220 60 L270 60" className={`svg-flow-line ${currentNode === 'r5-start' || currentNode === 'r5-decision' ? 'active' : ''}`} markerEnd="url(#arrowhead)" />
            {/* 2 -> 3A (Camino SÍ) */}
            <path d="M500 60 L560 60" className={`svg-flow-line ${currentNode === 'r5-decision' || currentNode === 'r5-action-send' ? 'active' : ''}`} markerEnd="url(#arrowhead)" />
            {/* 3A -> 4A (Confirmación ACK) */}
            <path d="M675 95 L675 135" className={`svg-flow-line ${currentNode === 'r5-action-send' || currentNode === 'r5-end-success' ? 'active' : ''}`} markerEnd="url(#arrowhead)" />
            {/* 2 -> 3B (Camino NO) */}
            <path d="M385 100 L385 118 L250 118 L250 135" className={`svg-flow-line ${currentNode === 'r5-decision' || currentNode === 'r5-action-hold' ? 'active' : ''}`} markerEnd="url(#arrowhead)" />
            {/* 3B -> 4B (Fin Retenido) */}
            <path d="M360 170 L395 170" className={`svg-flow-line ${currentNode === 'r5-action-hold' || currentNode === 'r5-end-hold' ? 'active' : ''}`} markerEnd="url(#arrowhead)" />
            {/* 4A -> Excepción (Timeout satelital) */}
            <path d="M675 205 L675 264 L580 264" className={`svg-flow-line ${currentNode === 'r5-exception' ? 'active' : ''}`} strokeDasharray="4 4" markerEnd="url(#arrowhead)" />

            {/* RÓTULOS SÍ / NO / TIMEOUT */}
            <text x="520" y="52" className="svg-path-label yes">SÍ</text>
            <text x="395" y="114" className="svg-path-label no">NO</text>
            <text x="600" y="254" className="svg-node-tag text-danger" style={{ fontSize: '8.5px' }}>TIMEOUT &gt; 15s</text>

            {/* NODOS INTERACTIVOS R5 */}
            {/* 1. Inicio */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-start' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-start')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Inicio: Pedido listo en cocina"
            >
              <rect x="20" y="25" width="200" height="70" rx="10" className="svg-node-rect rect-start" />
              <text x="35" y="50" className="svg-node-tag">1. ENTRADA</text>
              <text x="35" y="72" className="svg-node-title">Pedido Listo en Cocina</text>
            </g>

            {/* 2. Decisión Central */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-decision' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-decision')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Decisión: ¿Condición cumplida?"
            >
              <rect x="270" y="20" width="230" height="80" rx="10" className="svg-node-rect rect-decision" />
              <text x="288" y="44" className="svg-node-tag text-warning">2. EVALUACIÓN AGENTE</text>
              <text x="288" y="64" className="svg-node-title">¿Listo Y Sin Cambios</text>
              <text x="288" y="83" className="svg-node-title">Y Aviso No Enviado?</text>
            </g>

            {/* 3A. Acción SÍ */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-action-send' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-action-send')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Acción: Solicitar Notificación"
            >
              <rect x="560" y="25" width="230" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="575" y="48" className="svg-node-tag text-accent">3A. ACCIÓN AGENTE</text>
              <text x="575" y="68" className="svg-node-title">Solicitar Notificación</text>
              <text x="575" y="84" className="svg-node-sub">Estado: 'EN_CURSO'</text>
            </g>

            {/* 4A. Resultado Exitoso */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-end-success' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-end-success')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Éxito: Aviso Registrado Enviado"
            >
              <rect x="560" y="135" width="230" height="70" rx="10" className="svg-node-rect rect-success" />
              <text x="575" y="158" className="svg-node-tag text-success">4A. RESULTADO FINAL</text>
              <text x="575" y="178" className="svg-node-title">Aviso: 'ENVIADO'</text>
              <text x="575" y="194" className="svg-node-sub">Tras ACK de red exitoso</text>
            </g>

            {/* 3B. Acción NO (Retención) */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-action-hold' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-action-hold')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Retención: Pausar aviso"
            >
              <rect x="140" y="135" width="220" height="70" rx="10" className="svg-node-rect rect-warning" />
              <text x="155" y="158" className="svg-node-tag text-warning">3B. RETENCIÓN</text>
              <text x="155" y="178" className="svg-node-title">Pausar Notificación</text>
              <text x="155" y="194" className="svg-node-sub">Evitar alertas falsas</text>
            </g>

            {/* 4B. Fin Retenido */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-end-hold' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-end-hold')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Fin: Sin emisión"
            >
              <rect x="395" y="145" width="125" height="50" rx="8" className="svg-node-rect" style={{ fill: 'var(--bg-card-elevated)' }} />
              <text x="412" y="175" className="svg-node-title" style={{ fontSize: '0.85rem' }}>Fin: Pausa</text>
            </g>

            {/* Excepción / Intervención Humana */}
            <g 
              className={`svg-node-group ${currentNode === 'r5-exception' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r5-exception')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Excepción: Timeout satelital y Cabin Host"
            >
              <rect x="260" y="235" width="320" height="58" rx="10" className="svg-node-rect rect-human" />
              <text x="275" y="256" className="svg-node-tag text-danger">⚠️ CASO LÍMITE (TIMEOUT &gt; 15s)</text>
              <text x="275" y="278" className="svg-node-title">Alerta a Cabin Host (Presencial)</text>
            </g>
          </svg>
        ) : (
          /* SVG FLUJO R6 */
          <svg viewBox="0 0 840 420" className="interactive-flow-svg">
            <defs>
              <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" />
              </marker>
            </defs>

            {/* LÍNEAS DE CONEXIÓN */}
            <path d="M210 70 L270 70" className={`svg-flow-line ${currentNode === 'r6-start' || currentNode === 'r6-action-freeze' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            <path d="M470 70 L530 70" className={`svg-flow-line ${currentNode === 'r6-action-freeze' || currentNode === 'r6-decision-dual' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            {/* Camino SÍ */}
            <path d="M640 115 L640 160" className={`svg-flow-line ${currentNode === 'r6-decision-dual' || currentNode === 'r6-action-create' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            <path d="M640 230 L640 270" className={`svg-flow-line ${currentNode === 'r6-action-create' || currentNode === 'r6-end-success' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            {/* Camino NO */}
            <path d="M530 70 L480 180 L350 180" className={`svg-flow-line ${currentNode === 'r6-decision-dual' || currentNode === 'r6-action-cancel' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            <path d="M240 215 L240 270" className={`svg-flow-line ${currentNode === 'r6-action-cancel' || currentNode === 'r6-end-original' ? 'active' : ''}`} markerEnd="url(#arrowhead2)" />
            {/* Excepción */}
            <path d="M370 70 L370 330 L450 330" className={`svg-flow-line ${currentNode === 'r6-exception' ? 'active' : ''}`} strokeDasharray="4 4" markerEnd="url(#arrowhead2)" />

            {/* NODOS INTERACTIVOS R6 */}
            {/* 1. Inicio */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-start' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-start')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Inicio: Pasajero pide modificación"
            >
              <rect x="20" y="35" width="190" height="70" rx="10" className="svg-node-rect rect-start" />
              <text x="35" y="60" className="svg-node-tag">1. SOLICITUD</text>
              <text x="35" y="82" className="svg-node-title">Pasajero Pide Cambio</text>
            </g>

            {/* 2. Bloqueo Inmediato */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-action-freeze' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-action-freeze')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Bloqueo: Cambio pendiente y pausa de avisos"
            >
              <rect x="270" y="35" width="200" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="285" y="58" className="svg-node-tag text-accent">2. ACCIÓN INMEDIATA</text>
              <text x="285" y="78" className="svg-node-title">Pausa Avisos + Vn</text>
              <text x="285" y="94" className="svg-node-sub">Consulta a KDS Cocina</text>
            </g>

            {/* 3. Decisión Consenso Dual */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-decision-dual' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-decision-dual')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Decisión: ¿Cocina aprueba Y Pasajero confirma?"
            >
              <rect x="530" y="30" width="220" height="85" rx="10" className="svg-node-rect rect-decision" />
              <text x="545" y="55" className="svg-node-tag text-warning">3. CONSENSO DUAL</text>
              <text x="545" y="75" className="svg-node-title">¿Cocina Aprueba Y</text>
              <text x="545" y="95" className="svg-node-title">Pasajero Confirma?</text>
            </g>

            {/* Rótulos SÍ y NO */}
            <text x="650" y="140" className="svg-path-label yes">SÍ (AMBAS)</text>
            <text x="410" y="170" className="svg-path-label no">NO / RECHAZO</text>

            {/* 4A. Crear Versión Vn+1 */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-action-create' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-action-create')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Acción: Crear Versión Vn+1"
            >
              <rect x="530" y="160" width="220" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="545" y="183" className="svg-node-tag text-accent">4A. NUEVA VERSIÓN</text>
              <text x="545" y="203" className="svg-node-title">Crea Versión Vn+1</text>
              <text x="545" y="219" className="svg-node-sub">Registro inmutable</text>
            </g>

            {/* 5A. Exigir Nueva Confirmación Cocina */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-end-success' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-end-success')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Fin: Exige nueva confirmación de cocina"
            >
              <rect x="530" y="270" width="220" height="75" rx="10" className="svg-node-rect rect-success" />
              <text x="545" y="293" className="svg-node-tag text-success">5A. CONDICIÓN FINAL</text>
              <text x="545" y="313" className="svg-node-title">Exige Confirmar Cocina</text>
              <text x="545" y="329" className="svg-node-sub">Antes de marcar como lista</text>
            </g>

            {/* 4B. Desestimar Cambio */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-action-cancel' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-action-cancel')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Desestimación: Mantener original"
            >
              <rect x="130" y="145" width="220" height="70" rx="10" className="svg-node-rect rect-warning" />
              <text x="145" y="168" className="svg-node-tag text-warning">4B. DESESTIMACIÓN</text>
              <text x="145" y="188" className="svg-node-title">Descarta Modificación</text>
              <text x="145" y="204" className="svg-node-sub">Despausa avisos normales</text>
            </g>

            {/* 5B. Servir Versión Original */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-end-original' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-end-original')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Fin: Despacho original"
            >
              <rect x="130" y="270" width="220" height="65" rx="10" className="svg-node-rect" style={{ fill: 'var(--bg-card-elevated)', stroke: 'var(--border-color)' }} />
              <text x="145" y="295" className="svg-node-tag">5B. RESULTADO</text>
              <text x="145" y="318" className="svg-node-title">Despacha Versión Vn</text>
            </g>

            {/* Excepción R6 */}
            <g 
              className={`svg-node-group ${currentNode === 'r6-exception' ? 'selected' : ''}`}
              onClick={() => handleNodeClick('r6-exception')}
              tabIndex={0}
              role="button"
              aria-label="Nodo Excepción: Plato en bandeja rápida y Sous Chef"
            >
              <rect x="420" y="360" width="330" height="55" rx="8" className="svg-node-rect rect-human" />
              <text x="435" y="380" className="svg-node-tag text-danger">⚠️ CASO LÍMITE: PLATO EN BANDEJA SALIDA</text>
              <text x="435" y="400" className="svg-node-title">Alarma HOLD al Mozo ➔ Arbitraje Sous Chef</text>
            </g>
          </svg>
        )}
      </div>

      {/* TARJETA INTERACTIVA DE EXPLICACIÓN DEL PASO SELECCIONADO */}
      <div className="svg-selected-explainer" aria-live="polite">
        <div className="explainer-header">
          <span className="badge badge-primary">
            <Info size={14} aria-hidden="true" />
            Paso Seleccionado en el Diagrama
          </span>
          <span className="explainer-actor">
            Actor Responsable: <strong>{activeInfo.actor}</strong>
          </span>
        </div>
        <h4 className="explainer-title">{activeInfo.titulo}</h4>
        <p className="explainer-desc">{activeInfo.desc}</p>
        <span className="explainer-hint">
          💡 Tocá o hacé clic en cualquier caja del diagrama para explorar la decisión del agente.
        </span>
      </div>
    </div>
  );
};
