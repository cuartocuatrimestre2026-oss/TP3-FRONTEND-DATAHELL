import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Info, CheckCircle2, AlertTriangle, ShieldAlert, CornerDownRight, Sliders, ArrowDown, GitCommit } from 'lucide-react';

export const InteractiveSvgFlow = ({ activeFlow = 'r5', onSelectNode, selectedNodeId, onReturnToSimulator }) => {
  const [internalSelected, setInternalSelected] = useState('r5-decision');
  const explainerRef = useRef(null);
  const prevSelectedRef = useRef(selectedNodeId);

  const currentNode = selectedNodeId || internalSelected;

  // Reinicia el destello visual en el mismo nodo DOM sin desmontarlo (evita saltos de layout/scroll)
  const triggerFlash = () => {
    const el = explainerRef.current;
    if (!el) return;
    el.classList.remove('explainer-flash');
    void el.offsetWidth;
    el.classList.add('explainer-flash');
  };

  useEffect(() => {
    if (selectedNodeId && selectedNodeId !== prevSelectedRef.current) {
      prevSelectedRef.current = selectedNodeId;
      triggerFlash();
    }
  }, [selectedNodeId]);

  const handleNodeClick = (nodeId) => {
    prevSelectedRef.current = nodeId;
    setInternalSelected(nodeId);
    if (onSelectNode) onSelectNode(nodeId);
    triggerFlash();
  };

  const getNodeProps = (nodeId, ariaLabel) => ({
    className: getNodeClass(nodeId),
    onClick: () => handleNodeClick(nodeId),
    onMouseDown: (e) => e.preventDefault(),
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNodeClick(nodeId);
      }
    },
    tabIndex: 0,
    role: 'button',
    'aria-label': ariaLabel
  });

  // Mapeo de la ruta de ejecución agéntica para cada estado activo
  const activePathMap = {
    // FLUJO R5
    'r5-start': ['r5-start'],
    'r5-decision': ['r5-start', 'r5-decision'],
    'r5-action-send': ['r5-start', 'r5-decision', 'r5-action-send'],
    'r5-end-success': ['r5-start', 'r5-decision', 'r5-action-send', 'r5-end-success'],
    'r5-action-hold': ['r5-start', 'r5-decision', 'r5-action-hold'],
    'r5-end-hold': ['r5-start', 'r5-decision', 'r5-action-hold', 'r5-end-hold'],
    'r5-exception': ['r5-start', 'r5-decision', 'r5-action-send', 'r5-exception'],

    // FLUJO R6
    'r6-start': ['r6-start'],
    'r6-action-freeze': ['r6-start', 'r6-action-freeze'],
    'r6-decision-dual': ['r6-start', 'r6-action-freeze', 'r6-decision-dual'],
    'r6-action-create': ['r6-start', 'r6-action-freeze', 'r6-decision-dual', 'r6-action-create'],
    'r6-end-success': ['r6-start', 'r6-action-freeze', 'r6-decision-dual', 'r6-action-create', 'r6-end-success'],
    'r6-action-cancel': ['r6-start', 'r6-action-freeze', 'r6-decision-dual', 'r6-action-cancel'],
    'r6-end-original': ['r6-start', 'r6-action-freeze', 'r6-decision-dual', 'r6-action-cancel', 'r6-end-original'],
    'r6-exception': ['r6-start', 'r6-action-freeze', 'r6-exception']
  };

  const currentPath = activePathMap[currentNode] || [currentNode];

  const getNodeClass = (nodeId) => {
    const isSelected = currentNode === nodeId;
    const isInPath = currentPath.includes(nodeId);
    return `svg-node-group ${isSelected ? 'selected' : ''} ${isInPath ? 'in-path' : 'dimmed'}`;
  };

  // Helper para renderizar el badge sobre el nodo activo (limpio, sin puntos parpadeantes)
  const renderActiveBadge = (x, y, width, badgeText, isDanger = false, isSuccess = false, isWarning = false) => {
    const badgeWidth = Math.min(width - 16, Math.max(130, badgeText.length * 8.2 + 20));
    const badgeX = x + (width - badgeWidth) / 2;
    const badgeY = y - 13;
    
    let rectClass = 'badge-rect-active';
    if (isDanger) {
      rectClass = 'badge-rect-danger';
    } else if (isSuccess) {
      rectClass = 'badge-rect-success';
    } else if (isWarning) {
      rectClass = 'badge-rect-warning';
    }

    return (
      <g className="svg-active-badge-group">
        <rect 
          x={badgeX} 
          y={badgeY} 
          width={badgeWidth} 
          height="22" 
          rx="11" 
          className={rectClass} 
        />
        <text 
          x={badgeX + badgeWidth / 2} 
          y={badgeY + 15} 
          textAnchor="middle"
          className="badge-text-active"
        >
          {badgeText}
        </text>
      </g>
    );
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
      titulo: '3B. Retención o Bloqueo Preventivo de Aviso',
      actor: 'Agente Tap2Order',
      desc: 'Condición NO CUMPLIDA (NO): El pedido aún sigue en elaboración, registra una modificación pendiente o el aviso ya fue emitido. Se frena el despacho.',
      tipo: 'warning'
    },
    'r5-end-hold': {
      titulo: '4B. Fin: Sin Nueva Emisión (Idempotencia / Espera)',
      actor: 'Monitor de Servicio',
      desc: 'El sistema evita alertas falsas o duplicadas: aguarda a que concluya la cocción/modificación o descarta el envío repetido si ya fue notificado.',
      tipo: 'warning'
    },
    'r5-exception': {
      titulo: '⚠️ Caso Límite: Timeout Satelital en Alta Mar (>15s)',
      actor: 'Cabin Host (Tripulante Humano)',
      desc: 'El gateway marítimo agotó reintentos (>15s sin acuse de recibo de red). El agente no asume enviado, cancela la retransmisión automática y alerta a la tablet del Cabin Host para aviso presencial directo en camarote.',
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
      titulo: '⚠️ Caso Límite: Plato en Bandeja de Salida Rápida',
      actor: 'Sous Chef (Jefe de Cocina)',
      desc: 'El huésped solicitó cambio pero el plato ya estaba emplatado en el carrito de salida. El agente emite alarma sonora de HOLD en cocina y tablet del mozo, y deriva al Sous Chef para arbitrar cortesía o rehacer.',
      tipo: 'human'
    }
  };

  const activeInfo = nodeDetails[currentNode] || nodeDetails['r5-decision'];

  // Generación dinámica del Breadcrumb Pipeline (ruta de ejecución paso a paso)
  const getBreadcrumbSteps = () => {
    if (activeFlow === 'r5') {
      switch (currentNode) {
        case 'r5-start':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'active' },
            { id: 'r5-decision', label: '2. Evaluación Agente', status: 'pending' },
            { id: 'r5-action-send', label: '3. Disparo / Retención', status: 'pending' },
            { id: 'r5-end-success', label: '4. Fin del Flujo', status: 'pending' }
          ];
        case 'r5-decision':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación Agente', status: 'active' },
            { id: 'r5-action-send', label: '3. Decisión SÍ / NO', status: 'pending' },
            { id: 'r5-end-success', label: '4. Fin del Flujo', status: 'pending' }
          ];
        case 'r5-action-send':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación (SÍ)', status: 'completed' },
            { id: 'r5-action-send', label: '3A. Solicitar Notificación (EN_CURSO)', status: 'active' },
            { id: 'r5-end-success', label: '4A. Espera ACK de Red', status: 'pending' }
          ];
        case 'r5-end-success':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación (SÍ)', status: 'completed' },
            { id: 'r5-action-send', label: '3A. Solicitar Notificación', status: 'completed' },
            { id: 'r5-end-success', label: '4A. Aviso ENVIADO (ACK 200) ✅', status: 'active', isSuccess: true }
          ];
        case 'r5-action-hold':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación (NO)', status: 'completed' },
            { id: 'r5-action-hold', label: '3B. Retención / Bloqueo Preventivo ⏸️', status: 'active', isWarning: true },
            { id: 'r5-end-hold', label: '4B. Sin Nueva Emisión', status: 'pending' }
          ];
        case 'r5-end-hold':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación (NO)', status: 'completed' },
            { id: 'r5-action-hold', label: '3B. Retención / Bloqueo', status: 'completed' },
            { id: 'r5-end-hold', label: '4B. Fin: Sin Nueva Emisión (Idempotencia) 🚫', status: 'active', isWarning: true }
          ];
        case 'r5-exception':
          return [
            { id: 'r5-start', label: '1. Entrada Cocina', status: 'completed' },
            { id: 'r5-decision', label: '2. Evaluación (SÍ)', status: 'completed' },
            { id: 'r5-action-send', label: '3A. Solicitar Notificación (EN_CURSO)', status: 'completed' },
            { id: 'r5-exception', label: '🚨 CASO LÍMITE: Timeout Satelital (>15s) ➔ Cabin Host', status: 'active', isDanger: true }
          ];
        default:
          return [];
      }
    } else {
      // R6
      switch (currentNode) {
        case 'r6-start':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'active' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos + Vn', status: 'pending' },
            { id: 'r6-decision-dual', label: '3. Consenso Dual', status: 'pending' },
            { id: 'r6-end-success', label: '4. Resolución', status: 'pending' }
          ];
        case 'r6-action-freeze':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos + Consulta KDS', status: 'active' },
            { id: 'r6-decision-dual', label: '3. Consenso Dual', status: 'pending' },
            { id: 'r6-end-success', label: '4. Resolución', status: 'pending' }
          ];
        case 'r6-decision-dual':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos + Vn', status: 'completed' },
            { id: 'r6-decision-dual', label: '3. Evaluación Consenso Dual', status: 'active' },
            { id: 'r6-end-success', label: '4. Decisión Final', status: 'pending' }
          ];
        case 'r6-action-create':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos', status: 'completed' },
            { id: 'r6-decision-dual', label: '3. Consenso Dual (SÍ)', status: 'completed' },
            { id: 'r6-action-create', label: '4A. Creando Versión Vn+1', status: 'active' },
            { id: 'r6-end-success', label: '5A. Confirmar Cocina', status: 'pending' }
          ];
        case 'r6-end-success':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos', status: 'completed' },
            { id: 'r6-decision-dual', label: '3. Consenso Dual (SÍ)', status: 'completed' },
            { id: 'r6-action-create', label: '4A. Versión Vn+1 Inmutable', status: 'completed' },
            { id: 'r6-end-success', label: '5A. Exige Confirmar Cocina ✅', status: 'active', isSuccess: true }
          ];
        case 'r6-action-cancel':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos', status: 'completed' },
            { id: 'r6-decision-dual', label: '3. Rechazo Cocina o Huésped (NO)', status: 'completed' },
            { id: 'r6-action-cancel', label: '4B. Desestimación del Cambio ❌', status: 'active', isWarning: true },
            { id: 'r6-end-original', label: '5B. Despacho Vn', status: 'pending' }
          ];
        case 'r6-end-original':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Pausa Avisos', status: 'completed' },
            { id: 'r6-decision-dual', label: '3. Rechazo (NO)', status: 'completed' },
            { id: 'r6-action-cancel', label: '4B. Desestimación', status: 'completed' },
            { id: 'r6-end-original', label: '5B. Despacho Versión Original Vn 📦', status: 'active', isWarning: true }
          ];
        case 'r6-exception':
          return [
            { id: 'r6-start', label: '1. Solicitud Pasajero', status: 'completed' },
            { id: 'r6-action-freeze', label: '2. Intento de Bloqueo', status: 'completed' },
            { id: 'r6-exception', label: '🚨 CASO LÍMITE: Plato en Salida Rápida ➔ Alarma HOLD + Sous Chef', status: 'active', isDanger: true }
          ];
        default:
          return [];
      }
    }
  };

  const breadcrumbSteps = getBreadcrumbSteps();

  return (
    <div className="svg-flow-wrapper">
      <div className="svg-flow-container" role="region" aria-label="Diagrama interactivo en SVG">
        {activeFlow === 'r5' ? (
          /* SVG FLUJO R5 - DISEÑO SIN SUPERPOSICIONES Y ALTURA COMPACTA */
          <svg viewBox="0 -12 820 330" className={`interactive-flow-svg ${currentNode ? 'has-selection' : ''}`}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" />
              </marker>
              <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-primary)" />
              </marker>
              <marker id="arrowhead-danger" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-danger)" />
              </marker>
            </defs>

            {/* LÍNEAS DE CONEXIÓN */}
            {/* 1 -> 2 */}
            <path 
              d="M220 60 L270 60" 
              className={`svg-flow-line ${currentNode !== 'r5-start' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode !== 'r5-start' ? '#arrowhead-active' : '#arrowhead'})`} 
            />
            {/* 2 -> 3A (Camino SÍ) */}
            <path 
              d="M500 60 L560 60" 
              className={`svg-flow-line ${currentNode === 'r5-action-send' || currentNode === 'r5-end-success' || currentNode === 'r5-exception' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r5-action-send' || currentNode === 'r5-end-success' || currentNode === 'r5-exception' ? '#arrowhead-active' : '#arrowhead'})`} 
            />
            {/* 3A -> 4A (Confirmación ACK) */}
            <path 
              d="M675 95 L675 135" 
              className={`svg-flow-line ${currentNode === 'r5-end-success' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r5-end-success' ? '#arrowhead-active' : '#arrowhead'})`} 
            />
            {/* 2 -> 3B (Camino NO) */}
            <path 
              d="M385 100 L385 118 L250 118 L250 135" 
              className={`svg-flow-line ${currentNode === 'r5-action-hold' || currentNode === 'r5-end-hold' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r5-action-hold' || currentNode === 'r5-end-hold' ? '#arrowhead-active' : '#arrowhead'})`} 
            />
            {/* 3B -> 4B (Fin Retenido) */}
            <path 
              d="M350 170 L385 170" 
              className={`svg-flow-line ${currentNode === 'r5-end-hold' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r5-end-hold' ? '#arrowhead-active' : '#arrowhead'})`} 
            />
            {/* 3A -> Excepción (Timeout satelital directo desde EN_CURSO sin pasar por ENVIADO) */}
            <path 
              d="M560 78 L536 78 L536 264 L510 264" 
              className={`svg-flow-line ${currentNode === 'r5-exception' ? 'active line-danger' : ''}`} 
              markerEnd={`url(${currentNode === 'r5-exception' ? '#arrowhead-danger' : '#arrowhead'})`} 
            />

            {/* RÓTULOS SÍ / NO / ACK / TIMEOUT */}
            <text x="520" y="52" className={`svg-path-label yes ${currentNode === 'r5-action-send' || currentNode === 'r5-end-success' || currentNode === 'r5-exception' ? '' : 'dimmed'}`}>SÍ</text>
            <text x="685" y="119" className={`svg-path-label yes ${currentNode === 'r5-end-success' ? '' : 'dimmed'}`}>ACK 200</text>
            <text x="395" y="114" className={`svg-path-label no ${currentNode === 'r5-action-hold' || currentNode === 'r5-end-hold' ? '' : 'dimmed'}`}>NO</text>
            <text x="545" y="254" className={`svg-path-label no ${currentNode === 'r5-exception' ? '' : 'dimmed'}`} style={{ fill: '#ef4444', fontSize: '10px' }}>TIMEOUT &gt; 15s</text>

            {/* NODOS INTERACTIVOS R5 */}
            {/* 1. Inicio */}
            <g {...getNodeProps('r5-start', 'Nodo Inicio: Pedido listo en cocina')}>
              <rect x="20" y="25" width="200" height="70" rx="10" className="svg-node-rect rect-start" />
              <text x="35" y="50" className="svg-node-tag">1. ENTRADA</text>
              <text x="35" y="72" className="svg-node-title">Pedido Listo en Cocina</text>
              {currentNode === 'r5-start' && renderActiveBadge(20, 25, 200, 'PASO ACTIVO')}
            </g>

            {/* 2. Decisión Central */}
            <g {...getNodeProps('r5-decision', 'Nodo Decisión: ¿Condición cumplida?')}>
              <rect x="270" y="20" width="230" height="80" rx="10" className="svg-node-rect rect-decision" />
              <text x="288" y="44" className="svg-node-tag text-warning">2. EVALUACIÓN AGENTE</text>
              <text x="288" y="64" className="svg-node-title">¿Listo Y Sin Cambios</text>
              <text x="288" y="83" className="svg-node-title">Y Aviso No Enviado?</text>
              {currentNode === 'r5-decision' && renderActiveBadge(270, 20, 230, 'EVALUANDO AHORA')}
            </g>

            {/* 3A. Acción SÍ */}
            <g {...getNodeProps('r5-action-send', 'Nodo Acción: Solicitar Notificación')}>
              <rect x="560" y="25" width="230" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="575" y="48" className="svg-node-tag text-accent">3A. ACCIÓN AGENTE</text>
              <text x="575" y="68" className="svg-node-title">Solicitar Notificación</text>
              <text x="575" y="84" className="svg-node-sub">Estado: 'EN_CURSO'</text>
              {currentNode === 'r5-action-send' && renderActiveBadge(560, 25, 230, 'DISPARO EN CURSO')}
            </g>

            {/* 4A. Resultado Exitoso */}
            <g {...getNodeProps('r5-end-success', 'Nodo Éxito: Aviso Registrado Enviado')}>
              <rect x="560" y="135" width="230" height="70" rx="10" className="svg-node-rect rect-success" />
              <text x="575" y="158" className="svg-node-tag text-success">4A. RESULTADO FINAL</text>
              <text x="575" y="178" className="svg-node-title">Aviso: 'ENVIADO'</text>
              <text x="575" y="194" className="svg-node-sub">Tras ACK de red exitoso</text>
              {currentNode === 'r5-end-success' && renderActiveBadge(560, 135, 230, '✅ AVISO CONFIRMADO', false, true)}
            </g>

            {/* 3B. Acción NO (Retención) */}
            <g {...getNodeProps('r5-action-hold', 'Nodo Retención: Pausar o bloquear aviso')}>
              <rect x="130" y="135" width="220" height="70" rx="10" className="svg-node-rect rect-warning" />
              <text x="145" y="158" className="svg-node-tag text-warning">3B. RETENCIÓN / BLOQUEO</text>
              <text x="145" y="178" className="svg-node-title">Frenar Notificación</text>
              <text x="145" y="194" className="svg-node-sub">En cocción, cambio o ya enviado</text>
              {currentNode === 'r5-action-hold' && renderActiveBadge(130, 135, 220, '⏸️ RETENCIÓN ACTIVA', false, false, true)}
            </g>

            {/* 4B. Fin Retenido */}
            <g {...getNodeProps('r5-end-hold', 'Nodo Fin: Sin emisión')}>
              <rect x="385" y="145" width="125" height="50" rx="8" className="svg-node-rect" style={{ fill: 'var(--bg-card-elevated)' }} />
              <text x="398" y="175" className="svg-node-title" style={{ fontSize: '0.82rem' }}>Fin: Sin Envío</text>
              {currentNode === 'r5-end-hold' && renderActiveBadge(385, 145, 125, 'FIN: SIN ENVÍO', false, false, true)}
            </g>

            {/* Excepción / Intervención Humana */}
            <g {...getNodeProps('r5-exception', 'Nodo Excepción: Timeout satelital y Cabin Host')}>
              <rect x="190" y="235" width="320" height="58" rx="10" className="svg-node-rect rect-human" />
              <text x="205" y="256" className="svg-node-tag text-danger">⚠️ CASO LÍMITE (TIMEOUT &gt; 15s)</text>
              <text x="205" y="278" className="svg-node-title">Alerta a Cabin Host (Presencial)</text>
              {currentNode === 'r5-exception' && renderActiveBadge(190, 235, 320, '🚨 CASO LÍMITE ACTIVO', true)}
            </g>
          </svg>
        ) : (
          /* SVG FLUJO R6 */
          <svg viewBox="0 -12 840 445" className={`interactive-flow-svg ${currentNode ? 'has-selection' : ''}`}>
            <defs>
              <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" />
              </marker>
              <marker id="arrowhead2-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-primary)" />
              </marker>
              <marker id="arrowhead2-danger" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="var(--accent-danger)" />
              </marker>
            </defs>

            {/* LÍNEAS DE CONEXIÓN */}
            {/* 1 -> 2 */}
            <path 
              d="M210 70 L270 70" 
              className={`svg-flow-line ${currentNode !== 'r6-start' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode !== 'r6-start' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* 2 -> 3 */}
            <path 
              d="M470 70 L530 70" 
              className={`svg-flow-line ${currentNode !== 'r6-start' && currentNode !== 'r6-action-freeze' && currentNode !== 'r6-exception' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode !== 'r6-start' && currentNode !== 'r6-action-freeze' && currentNode !== 'r6-exception' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* Camino SÍ: 3 -> 4A */}
            <path 
              d="M640 115 L640 160" 
              className={`svg-flow-line ${currentNode === 'r6-action-create' || currentNode === 'r6-end-success' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r6-action-create' || currentNode === 'r6-end-success' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* 4A -> 5A */}
            <path 
              d="M640 230 L640 270" 
              className={`svg-flow-line ${currentNode === 'r6-end-success' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r6-end-success' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* Camino NO: 3 -> 4B (Sale desde la base inferior de 3 sin chocar con la flecha de entrada) */}
            <path 
              d="M575 115 L575 180 L350 180" 
              className={`svg-flow-line ${currentNode === 'r6-action-cancel' || currentNode === 'r6-end-original' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r6-action-cancel' || currentNode === 'r6-end-original' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* 4B -> 5B */}
            <path 
              d="M240 215 L240 270" 
              className={`svg-flow-line ${currentNode === 'r6-end-original' ? 'active' : ''}`} 
              markerEnd={`url(${currentNode === 'r6-end-original' ? '#arrowhead2-active' : '#arrowhead2'})`} 
            />
            {/* Excepción Caso Límite: Carrito / Bandeja Salida */}
            <path 
              d="M370 105 L370 387 L412 387" 
              className={`svg-flow-line ${currentNode === 'r6-exception' ? 'active line-danger' : ''}`} 
              markerEnd={`url(${currentNode === 'r6-exception' ? '#arrowhead2-danger' : '#arrowhead2'})`} 
            />
            {/* Rótulos SÍ y NO */}
            <text x="650" y="140" className={`svg-path-label yes ${currentNode === 'r6-action-create' || currentNode === 'r6-end-success' ? '' : 'dimmed'}`}>SÍ (AMBAS)</text>
            <text x="410" y="170" className={`svg-path-label no ${currentNode === 'r6-action-cancel' || currentNode === 'r6-end-original' ? '' : 'dimmed'}`}>NO / RECHAZO</text>
            <text x="245" y="340" className={`svg-path-label no ${currentNode === 'r6-exception' ? '' : 'dimmed'}`} style={{ fill: '#ef4444', fontSize: '10px' }}>⚠️ PLATO YA EN SALIDA</text>

            {/* NODOS INTERACTIVOS R6 */}
            {/* 1. Inicio */}
            <g {...getNodeProps('r6-start', 'Nodo Inicio: Pasajero pide modificación')}>
              <rect x="20" y="35" width="190" height="70" rx="10" className="svg-node-rect rect-start" />
              <text x="35" y="60" className="svg-node-tag">1. SOLICITUD</text>
              <text x="35" y="82" className="svg-node-title">Pasajero Pide Cambio</text>
              {currentNode === 'r6-start' && renderActiveBadge(20, 35, 190, 'PASO ACTIVO')}
            </g>

            {/* 2. Bloqueo Inmediato */}
            <g {...getNodeProps('r6-action-freeze', 'Nodo Bloqueo: Cambio pendiente y pausa de avisos')}>
              <rect x="270" y="35" width="200" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="285" y="58" className="svg-node-tag text-accent">2. ACCIÓN INMEDIATA</text>
              <text x="285" y="78" className="svg-node-title">Pausa Avisos + Vn</text>
              <text x="285" y="94" className="svg-node-sub">Consulta a KDS Cocina</text>
              {currentNode === 'r6-action-freeze' && renderActiveBadge(270, 35, 200, 'PAUSA DE AVISOS')}
            </g>

            {/* 3. Decisión Consenso Dual */}
            <g {...getNodeProps('r6-decision-dual', 'Nodo Decisión: ¿Cocina aprueba Y Pasajero confirma?')}>
              <rect x="530" y="30" width="220" height="85" rx="10" className="svg-node-rect rect-decision" />
              <text x="545" y="55" className="svg-node-tag text-warning">3. CONSENSO DUAL</text>
              <text x="545" y="75" className="svg-node-title">¿Cocina Aprueba Y</text>
              <text x="545" y="95" className="svg-node-title">Pasajero Confirma?</text>
              {currentNode === 'r6-decision-dual' && renderActiveBadge(530, 30, 220, 'EVALUANDO CONSENSO')}
            </g>

            {/* 4A. Crear Versión Vn+1 */}
            <g {...getNodeProps('r6-action-create', 'Nodo Acción: Crear Versión Vn+1')}>
              <rect x="530" y="160" width="220" height="70" rx="10" className="svg-node-rect rect-action" />
              <text x="545" y="183" className="svg-node-tag text-accent">4A. NUEVA VERSIÓN</text>
              <text x="545" y="203" className="svg-node-title">Crea Versión Vn+1</text>
              <text x="545" y="219" className="svg-node-sub">Registro inmutable</text>
              {currentNode === 'r6-action-create' && renderActiveBadge(530, 160, 220, 'CREANDO VERSIÓN Vn+1')}
            </g>

            {/* 5A. Exigir Nueva Confirmación Cocina */}
            <g {...getNodeProps('r6-end-success', 'Nodo Fin: Exige nueva confirmación de cocina')}>
              <rect x="530" y="270" width="220" height="75" rx="10" className="svg-node-rect rect-success" />
              <text x="545" y="293" className="svg-node-tag text-success">5A. CONDICIÓN FINAL</text>
              <text x="545" y="313" className="svg-node-title">Exige Confirmar Cocina</text>
              <text x="545" y="329" className="svg-node-sub">Antes de marcar como lista</text>
              {currentNode === 'r6-end-success' && renderActiveBadge(530, 270, 220, '✅ VERSIÓN Vn+1 ACTIVA', false, true)}
            </g>

            {/* 4B. Desestimar Cambio */}
            <g {...getNodeProps('r6-action-cancel', 'Nodo Desestimación: Mantener original')}>
              <rect x="130" y="145" width="220" height="70" rx="10" className="svg-node-rect rect-warning" />
              <text x="145" y="168" className="svg-node-tag text-warning">4B. DESESTIMACIÓN</text>
              <text x="145" y="188" className="svg-node-title">Descarta Modificación</text>
              <text x="145" y="204" className="svg-node-sub">Despausa avisos normales</text>
              {currentNode === 'r6-action-cancel' && renderActiveBadge(130, 145, 220, '❌ CAMBIO CANCELADO', false, false, true)}
            </g>

            {/* 5B. Servir Versión Original */}
            <g {...getNodeProps('r6-end-original', 'Nodo Fin: Despacho original')}>
              <rect x="130" y="270" width="220" height="65" rx="10" className="svg-node-rect" style={{ fill: 'var(--bg-card-elevated)', stroke: 'var(--border-color)' }} />
              <text x="145" y="295" className="svg-node-tag">5B. RESULTADO</text>
              <text x="145" y="318" className="svg-node-title">Despacha Versión Vn</text>
              {currentNode === 'r6-end-original' && renderActiveBadge(130, 270, 220, '📦 SERVIR ORIGINAL Vn', false, false, true)}
            </g>

            {/* Excepción R6 */}
            <g {...getNodeProps('r6-exception', 'Nodo Excepción: Plato en bandeja rápida y Sous Chef')}>
              <rect x="420" y="360" width="330" height="55" rx="8" className="svg-node-rect rect-human" />
              <text x="435" y="380" className="svg-node-tag text-danger">⚠️ CASO LÍMITE: PLATO EN BANDEJA SALIDA</text>
              <text x="435" y="400" className="svg-node-title">Alarma HOLD al Mozo ➔ Arbitraje Sous Chef</text>
              {currentNode === 'r6-exception' && renderActiveBadge(420, 360, 330, '🚨 CASO LÍMITE ACTIVO', true)}
            </g>
          </svg>
        )}
      </div>

      {/* RUTA DE PROGRESIÓN AGÉNTICA (BREADCRUMB PIPELINE) */}
      <div className="flow-breadcrumb-container" aria-label="Ruta de decisión agéntica">
        <div className="breadcrumb-label-row">
          <span className="breadcrumb-label-tag">
            <GitCommit size={14} aria-hidden="true" />
            Ruta de Ejecución del Flujo:
          </span>
          <span className="breadcrumb-step-count">
            Paso: <strong>{breadcrumbSteps.findIndex(s => s.status === 'active') + 1} de {breadcrumbSteps.length}</strong>
          </span>
        </div>

        <div className="breadcrumb-steps-track">
          {breadcrumbSteps.map((step, idx) => (
            <React.Fragment key={step.id || idx}>
              <button
                type="button"
                className={`breadcrumb-step-pill ${step.status} ${step.isDanger ? 'step-danger' : ''} ${step.isSuccess ? 'step-success' : ''} ${step.isWarning ? 'step-warning' : ''}`}
                onClick={() => handleNodeClick(step.id)}
                title={`Hacer clic para enfocar ${step.label}`}
              >
                {step.status === 'completed' && <span className="step-icon">✓</span>}
                {step.status === 'pending' && <span className="step-num">{idx + 1}</span>}
                <span className="step-text">{step.label}</span>
                {step.status === 'active' && <span className="step-now-badge">ACTIVO</span>}
              </button>
              {idx < breadcrumbSteps.length - 1 && (
                <span className={`breadcrumb-arrow ${step.status === 'completed' ? 'completed-arrow' : ''}`}>➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* TARJETA INTERACTIVA DE EXPLICACIÓN DEL PASO SELECCIONADO */}
      <div 
        ref={explainerRef}
        className="svg-selected-explainer" 
        aria-live="polite"
      >
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
        
        <div className="explainer-action-row">
          <span className="explainer-hint">
            💡 Tocá cualquier caja para ver la decisión agéntica, o indicá el estado en la consola para probarlo en vivo.
          </span>
          {onReturnToSimulator && (
            <button
              type="button"
              className="btn-down-to-sim"
              onClick={() => onReturnToSimulator(currentNode)}
              title="Bajar a la consola para indicar y probar este estado en vivo"
            >
              <Sliders size={14} aria-hidden="true" />
              <span>Indicar Estado en la Consola</span>
              <ArrowDown size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
