import React, { useState } from 'react';
import { 
  Sliders, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Radio, 
  UserCheck, 
  Clock, 
  Cpu 
} from 'lucide-react';

export const FlowSimulator = () => {
  const [activeTab, setActiveTab] = useState('r5');

  // Estado para Sentencia R5
  const [r5State, setR5State] = useState({
    pedidoListo: true,
    modificacionPendiente: false,
    avisoEnviadoOEnCurso: false,
    fallaConectividadMaritima: false
  });

  // Estado para Sentencia R6
  const [r6State, setR6State] = useState({
    pedidoEnviado: true,
    solicitaModificacion: true,
    aprobacionCocina: true,
    confirmacionPasajero: true,
    platoEnBandejaSalida: false
  });

  // Presets para R5
  const setR5Preset = (type) => {
    if (type === 'success') {
      setR5State({
        pedidoListo: true,
        modificacionPendiente: false,
        avisoEnviadoOEnCurso: false,
        fallaConectividadMaritima: false
      });
    } else if (type === 'retention') {
      setR5State({
        pedidoListo: true,
        modificacionPendiente: true, // hay cambio pendiente
        avisoEnviadoOEnCurso: false,
        fallaConectividadMaritima: false
      });
    } else if (type === 'exception') {
      setR5State({
        pedidoListo: true,
        modificacionPendiente: false,
        avisoEnviadoOEnCurso: false,
        fallaConectividadMaritima: true // falla satelital
      });
    }
  };

  // Presets para R6
  const setR6Preset = (type) => {
    if (type === 'success') {
      setR6State({
        pedidoEnviado: true,
        solicitaModificacion: true,
        aprobacionCocina: true,
        confirmacionPasajero: true,
        platoEnBandejaSalida: false
      });
    } else if (type === 'rejection') {
      setR6State({
        pedidoEnviado: true,
        solicitaModificacion: true,
        aprobacionCocina: false, // cocina rechaza
        confirmacionPasajero: true,
        platoEnBandejaSalida: false
      });
    } else if (type === 'exception') {
      setR6State({
        pedidoEnviado: true,
        solicitaModificacion: true,
        aprobacionCocina: true,
        confirmacionPasajero: true,
        platoEnBandejaSalida: true // plato ya en bandeja express
      });
    }
  };

  // Evaluación lógica dinámica de R5
  const evaluateR5 = () => {
    const { pedidoListo, modificacionPendiente, avisoEnviadoOEnCurso, fallaConectividadMaritima } = r5State;
    const condicionCumplida = pedidoListo && !modificacionPendiente && !avisoEnviadoOEnCurso;

    if (!condicionCumplida) {
      let motivo = '';
      if (!pedidoListo) motivo = 'El pedido aún está en preparación en los fogones.';
      else if (modificacionPendiente) motivo = 'Existe una modificación en trámite; se pausa la notificación para evitar despachos incorrectos.';
      else if (avisoEnviadoOEnCurso) motivo = 'El aviso ya fue despachado previamente o está en curso (bloqueo de duplicidad).';

      return {
        tipo: 'warning',
        titulo: 'AVISO RETENIDO · NO SE EMITE NOTIFICACIÓN',
        detalle: motivo,
        pasos: [
          'Agente detecta evento de pedido.',
          `Verificación de regla: Condición FALSE (${motivo}).`,
          'Acción: Se retiene el aviso preventivamente en el registro.',
          'Resultado: El pasajero no recibe spam ni avisos erróneos.'
        ]
      };
    }

    if (fallaConectividadMaritima) {
      return {
        tipo: 'alert',
        titulo: 'TIMEOUT SATELITAL · ESCALADO A TRIPULACIÓN HUMANA',
        detalle: 'El aviso se disparó pero la red marítima no devolvió acuse de recibo tras 2 reintentos con backoff.',
        pasos: [
          'Agente evalúa: Condición lógica cumplida (TRUE).',
          'Disparo: Se envía solicitud al CruiseMessagingGateway y se marca "EN_CURSO".',
          'Excepción: Timeout satelital en alta mar (>15s). 2 reintentos fallidos.',
          'Intervención Humana: Alerta enviada a Cabin Host para notificación presencial en camarote.'
        ]
      };
    }

    return {
      tipo: 'success',
      titulo: 'AVISO ENVIADO EXITOSAMENTE Y REGISTRADO',
      detalle: 'Todas las condiciones se cumplieron y el servicio de mensajería confirmó la recepción efectiva (ACK 200).',
      pasos: [
        'Agente evalúa: Pedido listo (TRUE), sin cambios (TRUE), sin aviso previo (TRUE).',
        'Disparo: Se envía solicitud al servicio a bordo; estado temporal "EN_CURSO".',
        'Confirmación: Servicio marítimo devuelve ACK exitoso.',
        'Persistencia: Pedido registrado formalmente como "ENVIADO".'
      ]
    };
  };

  // Evaluación lógica dinámica de R6
  const evaluateR6 = () => {
    const { pedidoEnviado, solicitaModificacion, aprobacionCocina, confirmacionPasajero, platoEnBandejaSalida } = r6State;

    if (!solicitaModificacion) {
      return {
        tipo: 'warning',
        titulo: 'SIN SOLICITUD DE CAMBIO',
        detalle: 'El pedido sigue su curso normal de cocina.',
        pasos: ['No se detecta evento de cambio del huésped.']
      };
    }

    if (platoEnBandejaSalida) {
      return {
        tipo: 'alert',
        titulo: 'CONFLICTO CRÍTICO · INTERVENCIÓN INMEDIATA DE SOUS CHEF',
        detalle: 'El huésped solicitó cambio justo cuando el plato estaba emplatado en el carrito de entrega rápida.',
        pasos: [
          'Huésped solicita modificación en la app.',
          'Alerta inmediata: Estado del cambio pasa a PENDIENTE y se pausan avisos.',
          'Excepción detectada: Plato en bandeja de despacho express.',
          'Intervención Humana: Alarma de HOLD en tablet del mozo y arbitraje presencial del Sous Chef.'
        ]
      };
    }

    if (aprobacionCocina && confirmacionPasajero) {
      return {
        tipo: 'success',
        titulo: 'NUEVA VERSIÓN Vn+1 CREADA · EXIGE CONFIRMACIÓN DE COCINA',
        detalle: 'Tanto la cocina aprobó la factibilidad como el pasajero ratificó el cambio y los nuevos tiempos.',
        pasos: [
          'Huésped solicita modificación: se registra PENDIENTE y se congela la versión original Vn.',
          'Agente consulta al Kitchen Display System (KDS) y al Pasajero.',
          'Consenso Dual: Cocina APRUEBA (TRUE) y Pasajero CONFIRMA (TRUE).',
          'Resultado: Se promueve a versión Vn+1. Se exige NUEVA confirmación de cocina antes de volver a marcar lista.'
        ]
      };
    }

    return {
      tipo: 'warning',
      titulo: 'MODIFICACIÓN DESESTIMADA · SE MANTIENE VERSIÓN ORIGINAL Vn',
      detalle: !aprobacionCocina 
        ? 'Cocina rechazó la modificación (plato en cocción avanzada e insumos no reemplazables).' 
        : 'El pasajero desistió del cambio al conocer el tiempo adicional de espera.',
      pasos: [
        'Huésped solicita modificación: se registra PENDIENTE y se pausan avisos.',
        `Evaluación: ${!aprobacionCocina ? 'Cocina dictamina NO FACTIBLE' : 'Pasajero rechaza tiempo de espera'}.`,
        'Acción: El cambio pendiente se cancela y se despausan los avisos.',
        'Resultado: Se continúa con el despacho seguro de la versión original Vn.'
      ]
    };
  };

  const currentResult = activeTab === 'r5' ? evaluateR5() : evaluateR6();

  return (
    <section id="simulador" className="simulator-section" aria-labelledby="simulador-heading">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-tag">
            <Sliders size={14} aria-hidden="true" />
            Supera: Verificación en Vivo
          </span>
          <h2 id="simulador-heading" className="section-heading">
            Simulador de Condiciones & Trazabilidad Agéntica
          </h2>
          <p className="section-desc">
            Probá de manera interactiva cómo el futuro agente evalúa cada combinación de variables lógicas, toma decisiones autónomas y resuelve excepciones marítimas.
          </p>
        </div>

        <div className="simulator-container">
          {/* Selector de Pestaña */}
          <div className="simulator-tabs-bar" role="tablist" aria-label="Seleccionar sentencia para simular">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'r5'}
              onClick={() => setActiveTab('r5')}
              className={`simulator-tab-btn ${activeTab === 'r5' ? 'active' : ''}`}
            >
              <Cpu size={16} aria-hidden="true" />
              Simular Flujo R5 (Aviso de Pedido)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'r6'}
              onClick={() => setActiveTab('r6')}
              className={`simulator-tab-btn ${activeTab === 'r6' ? 'active' : ''}`}
            >
              <Cpu size={16} aria-hidden="true" />
              Simular Flujo R6 (Modificaciones en Caliente)
            </button>
          </div>

          <div className="simulator-workspace-grid">
            {/* Panel de Controles / Interruptores */}
            <aside className="sim-controls-panel" aria-label="Controles de variables lógicas">
              <h3 className="sim-panel-title">
                <Sliders size={16} aria-hidden="true" />
                Variables de Entrada {activeTab === 'r5' ? '(R5)' : '(R6)'}
              </h3>

              {activeTab === 'r5' ? (
                <div className="sim-toggles-list">
                  <div className="sim-toggle-row">
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">Pedido Listo en Cocina</span>
                      <span className="toggle-subtitle">version_vigente.estado === 'LISTO'</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r5State.pedidoListo} 
                        onChange={e => setR5State({ ...r5State, pedidoListo: e.target.checked })}
                        aria-label="Alternar pedido listo"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  <div className="sim-toggle-row">
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">Modificación Pendiente</span>
                      <span className="toggle-subtitle">modificaciones_pendientes &gt; 0</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r5State.modificacionPendiente} 
                        onChange={e => setR5State({ ...r5State, modificacionPendiente: e.target.checked })}
                        aria-label="Alternar modificación pendiente"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  <div className="sim-toggle-row">
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">Aviso Enviado o En Curso</span>
                      <span className="toggle-subtitle">aviso.estado !== 'PENDIENTE'</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r5State.avisoEnviadoOEnCurso} 
                        onChange={e => setR5State({ ...r5State, avisoEnviadoOEnCurso: e.target.checked })}
                        aria-label="Alternar aviso ya enviado"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  <div className="sim-toggle-row" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                    <div className="toggle-label-wrap">
                      <span className="toggle-title" style={{ color: 'var(--accent-danger)' }}>Falla Red Satelital</span>
                      <span className="toggle-subtitle">Timeout gateway &gt; 15s</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r5State.fallaConectividadMaritima} 
                        onChange={e => setR5State({ ...r5State, fallaConectividadMaritima: e.target.checked })}
                        aria-label="Alternar falla de conectividad en alta mar"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  {/* Casos Rápidos Preset */}
                  <div className="preset-buttons-group">
                    <span className="preset-group-title">Casos de Prueba Rápida:</span>
                    <button type="button" className="preset-btn" onClick={() => setR5Preset('success')}>
                      ✅ Caso 1: Condición Cumplida (Éxito)
                    </button>
                    <button type="button" className="preset-btn" onClick={() => setR5Preset('retention')}>
                      ⏸️ Caso 2: Cambio Pendiente (Retención)
                    </button>
                    <button type="button" className="preset-btn" onClick={() => setR5Preset('exception')}>
                      🚨 Caso 3: Timeout Satelital (Cabin Host)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="sim-toggles-list">
                  <div className="sim-toggle-row">
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">Aprobación de Cocina</span>
                      <span className="toggle-subtitle">cocina.aprobacion_cambio === true</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r6State.aprobacionCocina} 
                        onChange={e => setR6State({ ...r6State, aprobacionCocina: e.target.checked })}
                        aria-label="Alternar aprobación de cocina"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  <div className="sim-toggle-row">
                    <div className="toggle-label-wrap">
                      <span className="toggle-title">Confirmación del Pasajero</span>
                      <span className="toggle-subtitle">pasajero.confirma_modificacion === true</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r6State.confirmacionPasajero} 
                        onChange={e => setR6State({ ...r6State, confirmacionPasajero: e.target.checked })}
                        aria-label="Alternar confirmación del pasajero"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  <div className="sim-toggle-row" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                    <div className="toggle-label-wrap">
                      <span className="toggle-title" style={{ color: 'var(--accent-danger)' }}>Plato en Salida Express</span>
                      <span className="toggle-subtitle">Conflicto en carrito de servicio</span>
                    </div>
                    <label className="switch-input">
                      <input 
                        type="checkbox" 
                        checked={r6State.platoEnBandejaSalida} 
                        onChange={e => setR6State({ ...r6State, platoEnBandejaSalida: e.target.checked })}
                        aria-label="Alternar plato ya en bandeja de salida express"
                      />
                      <span className="slider-track" />
                    </label>
                  </div>

                  {/* Casos Rápidos Preset */}
                  <div className="preset-buttons-group">
                    <span className="preset-group-title">Casos de Prueba Rápida:</span>
                    <button type="button" className="preset-btn" onClick={() => setR6Preset('success')}>
                      ✅ Caso 1: Consenso Dual (Versión Vn+1)
                    </button>
                    <button type="button" className="preset-btn" onClick={() => setR6Preset('rejection')}>
                      ❌ Caso 2: Rechazo Cocina (Conserva Vn)
                    </button>
                    <button type="button" className="preset-btn" onClick={() => setR6Preset('exception')}>
                      👨‍🍳 Caso 3: Despacho Rápido (Sous Chef)
                    </button>
                  </div>
                </div>
              )}
            </aside>

            {/* Panel de Salida / Trazabilidad de Ejecución */}
            <main className="sim-results-panel" aria-live="polite">
              <div className={`sim-status-banner ${currentResult.tipo}`}>
                {currentResult.tipo === 'success' && <CheckCircle2 size={24} aria-hidden="true" />}
                {currentResult.tipo === 'warning' && <AlertTriangle size={24} aria-hidden="true" />}
                {currentResult.tipo === 'alert' && <UserCheck size={24} aria-hidden="true" />}
                <div>
                  <h4 className="status-title">{currentResult.titulo}</h4>
                  <p className="status-sub">{currentResult.detalle}</p>
                </div>
              </div>

              <div className="execution-trace-track">
                <span className="preset-group-title">
                  <Play size={12} aria-hidden="true" style={{ display: 'inline', marginRight: '6px' }} />
                  Trazabilidad Agéntica Paso a Paso:
                </span>
                {currentResult.pasos.map((paso, index) => (
                  <div key={index} className="trace-step-item active">
                    <div className="trace-icon-badge">
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="trace-step-content">
                      <span className="trace-step-label">Paso de Ejecución 0{index + 1}</span>
                      <p className="trace-step-desc">{paso}</p>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};
