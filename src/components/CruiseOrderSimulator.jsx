import React, { useState, useEffect } from 'react';
import { mockPlatosCrucero } from '../data/tap2order_data';
import { 
  Ship, 
  Utensils, 
  Send, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Cpu,
  RefreshCw,
  ArrowUp
} from 'lucide-react';

export const CruiseOrderSimulator = ({ 
  onHighlightSvgNode, 
  onScrollToDiagram,
  currentFlow = 'r5',
  syncNodeId = null,
  isHighlighted = false
}) => {
  const [activeTab, setActiveTab] = useState(currentFlow);
  const [selectedPlato, setSelectedPlato] = useState(mockPlatosCrucero[0].id);

  // Sincronizar si cambia desde afuera
  useEffect(() => {
    if (currentFlow) {
      setActiveTab(currentFlow);
    }
  }, [currentFlow]);

  // Estados para R5 (Aviso)
  const [r5Listo, setR5Listo] = useState(true);
  const [r5CambioPendiente, setR5CambioPendiente] = useState(false);
  const [r5AvisoEnviado, setR5AvisoEnviado] = useState(false);
  const [r5FallaSatelital, setR5FallaSatelital] = useState(false);

  // Estados para R6 (Modificación)
  const [r6EnEspera, setR6EnEspera] = useState(false);
  const [r6AprobacionCocina, setR6AprobacionCocina] = useState(true);
  const [r6ConfirmaPasajero, setR6ConfirmaPasajero] = useState(true);
  const [r6PlatoEnSalidaExpress, setR6PlatoEnSalidaExpress] = useState(false);

  // Sincronizar variables al presionar "Indicar Estado en la Consola" desde el diagrama
  useEffect(() => {
    if (!syncNodeId) return;
    if (syncNodeId.startsWith('r5')) {
      setActiveTab('r5');
      if (syncNodeId === 'r5-start') {
        setR5Listo(false);
        setR5CambioPendiente(false);
        setR5AvisoEnviado(false);
        setR5FallaSatelital(false);
      } else if (syncNodeId === 'r5-decision' || syncNodeId === 'r5-action-send' || syncNodeId === 'r5-end-success') {
        setR5Listo(true);
        setR5CambioPendiente(false);
        setR5AvisoEnviado(false);
        setR5FallaSatelital(false);
      } else if (syncNodeId === 'r5-action-hold') {
        setR5Listo(true);
        setR5CambioPendiente(true);
        setR5AvisoEnviado(false);
        setR5FallaSatelital(false);
      } else if (syncNodeId === 'r5-end-hold') {
        setR5Listo(true);
        setR5CambioPendiente(false);
        setR5AvisoEnviado(true);
        setR5FallaSatelital(false);
      } else if (syncNodeId === 'r5-exception') {
        setR5Listo(true);
        setR5CambioPendiente(false);
        setR5AvisoEnviado(false);
        setR5FallaSatelital(true);
      }
    } else if (syncNodeId.startsWith('r6')) {
      setActiveTab('r6');
      if (syncNodeId === 'r6-start' || syncNodeId === 'r6-action-freeze' || syncNodeId === 'r6-decision-dual') {
        setR6EnEspera(true);
        setR6AprobacionCocina(false);
        setR6ConfirmaPasajero(false);
        setR6PlatoEnSalidaExpress(false);
      } else if (syncNodeId === 'r6-action-create' || syncNodeId === 'r6-end-success') {
        setR6EnEspera(false);
        setR6AprobacionCocina(true);
        setR6ConfirmaPasajero(true);
        setR6PlatoEnSalidaExpress(false);
      } else if (syncNodeId === 'r6-action-cancel') {
        setR6EnEspera(false);
        setR6AprobacionCocina(false);
        setR6ConfirmaPasajero(true);
        setR6PlatoEnSalidaExpress(false);
      } else if (syncNodeId === 'r6-end-original') {
        setR6EnEspera(false);
        setR6AprobacionCocina(true);
        setR6ConfirmaPasajero(false);
        setR6PlatoEnSalidaExpress(false);
      } else if (syncNodeId === 'r6-exception') {
        setR6EnEspera(false);
        setR6AprobacionCocina(true);
        setR6ConfirmaPasajero(true);
        setR6PlatoEnSalidaExpress(true);
      }
    }
  }, [syncNodeId]);

  // Plato actual
  const platoActual = mockPlatosCrucero.find(p => p.id === selectedPlato) || mockPlatosCrucero[0];

  // Cálculo de resultado para R5
  const getR5Result = () => {
    // 1. CASO LÍMITE R5: Falla de Red Satelital en Alta Mar (Prioridad Excepción)
    if (r5FallaSatelital) {
      return {
        nodoSvg: 'r5-exception',
        estadoBadge: '🚨 Timeout Satelital (>15s)',
        badgeColor: 'danger',
        mensaje: 'Sin acuse de recibo del gateway satelital tras 2 reintentos (>15s) desde el estado EN_CURSO. El agente NO registra enviado y deriva a la tablet del Cabin Host.',
        ticketStatus: 'TIMEOUT SATELITAL · CABIN HOST',
        accion: 'Cabin Host acude al camarote para notificación verbal presencial.'
      };
    }
    // 2. Cocina en proceso (Condición NO cumplida -> rama 3B Retención)
    if (!r5Listo) {
      return {
        nodoSvg: 'r5-action-hold',
        estadoBadge: 'Cocina en Proceso (Retenido)',
        badgeColor: 'warning',
        mensaje: 'Condición NO cumplida: la comanda sigue en elaboración en cocina. El agente frena el aviso hasta que el plato esté listo.',
        ticketStatus: 'EN PREPARACIÓN · SIN AVISO',
        accion: 'Retención preventiva: no emitir alerta prematura.'
      };
    }
    // 3. Modificación pendiente (Condición NO cumplida -> rama 3B Retención)
    if (r5CambioPendiente) {
      return {
        nodoSvg: 'r5-action-hold',
        estadoBadge: 'Aviso Retenido (Pausa)',
        badgeColor: 'warning',
        mensaje: 'Condición NO cumplida: hay una modificación en trámite sobre el plato. El agente congela los avisos para evitar falsas alertas.',
        ticketStatus: 'MODIFICACIÓN PENDIENTE',
        accion: 'Retención preventiva hasta resolver el cambio.'
      };
    }
    // 4. Aviso ya enviado (Condición NO cumplida -> rama 4B Fin sin nuevo envío)
    if (r5AvisoEnviado) {
      return {
        nodoSvg: 'r5-end-hold',
        estadoBadge: 'Aviso ya Despachado',
        badgeColor: 'warning',
        mensaje: 'Condición NO cumplida: el aviso ya fue emitido o está en curso. El agente bloquea duplicados por idempotencia.',
        ticketStatus: 'YA NOTIFICADO (SIN REENVÍO)',
        accion: 'Fin sin nueva emisión: bloqueo de idempotencia (cero spam).'
      };
    }
    // 5. Flujo normal exitoso
    return {
      nodoSvg: 'r5-end-success',
      estadoBadge: 'Aviso Enviado con Éxito',
      badgeColor: 'success',
      mensaje: `Notificación enviada a la pantalla de ${platoActual.sector}. Se recibió confirmación de recepción exitosa (ACK 200).`,
      ticketStatus: 'NOTIFICADO Y CONFIRMADO',
      accion: "Aviso registrado formalmente como 'ENVIADO' tras ACK 200."
    };
  };

  // Cálculo de resultado para R6
  const getR6Result = () => {
    // 1. CASO LÍMITE R6: Plato en bandeja de salida express (Sous Chef)
    if (r6PlatoEnSalidaExpress) {
      return {
        nodoSvg: 'r6-exception',
        estadoBadge: '🚨 Conflicto en Bandeja de Salida',
        badgeColor: 'danger',
        mensaje: 'El huésped solicitó cambio pero el plato ya estaba en la bandeja de salida del mozo. El agente dispara alarma sonora de HOLD en cocina y pase.',
        ticketStatus: 'HOLD EXPRESS · ARBITRAJE CHEF',
        accion: 'Sous Chef interviene presencialmente para autorizar cambio o compensar.'
      };
    }
    // 2. Estado intermedio: Cambio pendiente esperando respuesta (conserva Vn y pausa avisos)
    if (r6EnEspera) {
      return {
        nodoSvg: 'r6-action-freeze',
        estadoBadge: '⏸️ En Espera (Avisos en Pausa)',
        badgeColor: 'warning',
        mensaje: 'El pasajero solicitó modificar el pedido: el agente registra el cambio como PENDIENTE, conserva la versión original Vn y pausa los nuevos avisos de listo mientras consulta a cocina y pasajero.',
        ticketStatus: 'CAMBIO PENDIENTE · PAUSA AVISOS',
        accion: 'Conserva versión Vn y congela avisos hasta recibir ambas confirmaciones.'
      };
    }
    // 3. Consenso dual (Ambas constan -> Vn+1)
    if (r6AprobacionCocina && r6ConfirmaPasajero) {
      return {
        nodoSvg: 'r6-end-success',
        estadoBadge: 'Versión Vn+1 Creada',
        badgeColor: 'success',
        mensaje: 'Cocina dio el visto bueno y el pasajero aceptó el nuevo tiempo estimado. Se creó formalmente la nueva versión Vn+1.',
        ticketStatus: 'VERSIÓN Vn+1 ACTIVA',
        accion: 'Exige nueva confirmación de cocina antes de volver a marcarla como lista.'
      };
    }
    // 4. Cocina rechaza el cambio (4B: Desestimación)
    if (!r6AprobacionCocina) {
      return {
        nodoSvg: 'r6-action-cancel',
        estadoBadge: 'Modificación Desestimada',
        badgeColor: 'warning',
        mensaje: 'Cocina dictaminó NO FACTIBLE (cocción avanzada). Se descarta la modificación solicitada y se despausan los avisos normales.',
        ticketStatus: 'CAMBIO DESCARTADO (4B)',
        accion: 'Desestima el cambio y despausa avisos de la versión original Vn.'
      };
    }
    // 5. Pasajero no confirma nuevos tiempos (5B: Despacha versión original Vn)
    return {
      nodoSvg: 'r6-end-original',
      estadoBadge: 'Despacho Versión Original Vn',
      badgeColor: 'warning',
      mensaje: 'El pasajero desistió de los nuevos tiempos de espera. Se conserva y despacha la versión original Vn.',
      ticketStatus: 'SERVIR ORIGINAL Vn (5B)',
      accion: 'Mantiene y despacha la versión original Vn sin cambios.'
    };
  };

  const resultadoActual = activeTab === 'r5' ? getR5Result() : getR6Result();

  // Presets rápidos de 1 clic (actualizan la consola sin scroll forzado)
  const aplicarPresetR5 = (caso) => {
    if (caso === 'exito') {
      setR5Listo(true);
      setR5CambioPendiente(false);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-end-success', false);
    } else if (caso === 'cambio') {
      setR5Listo(true);
      setR5CambioPendiente(true);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-action-hold', false);
    } else if (caso === 'duplicado') {
      setR5Listo(true);
      setR5CambioPendiente(false);
      setR5AvisoEnviado(true);
      setR5FallaSatelital(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-end-hold', false);
    } else if (caso === 'timeout') {
      setR5Listo(true);
      setR5CambioPendiente(false);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(true);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-exception', false);
    }
  };

  const aplicarPresetR6 = (caso) => {
    if (caso === 'espera') {
      setR6EnEspera(true);
      setR6AprobacionCocina(false);
      setR6ConfirmaPasajero(false);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-action-freeze', false);
    } else if (caso === 'consenso') {
      setR6EnEspera(false);
      setR6AprobacionCocina(true);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-end-success', false);
    } else if (caso === 'rechazo') {
      setR6EnEspera(false);
      setR6AprobacionCocina(false);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-action-cancel', false);
    } else if (caso === 'original') {
      setR6EnEspera(false);
      setR6AprobacionCocina(true);
      setR6ConfirmaPasajero(false);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-end-original', false);
    } else if (caso === 'salida') {
      setR6EnEspera(false);
      setR6AprobacionCocina(true);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(true);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-exception', false);
    }
  };

  return (
    <div id="simulador-card-anchor" className={`cruise-simulator-card ${isHighlighted ? 'highlight-focus' : ''}`}>
      <div className="sim-top-nav">
        <div className="sim-brand-title">
          <Ship size={18} className="text-accent" aria-hidden="true" />
          <span>Consola Agéntica Tap2Order · Cruceros</span>
        </div>

        <div className="sim-nav-actions">
          <div className="sim-mode-tabs" role="tablist">
            <button 
              type="button" 
              role="tab"
              aria-selected={activeTab === 'r5'}
              className={`sim-tab-pill ${activeTab === 'r5' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('r5');
                if (onHighlightSvgNode) onHighlightSvgNode('r5-decision', false);
              }}
            >
              Flujo R5: Aviso de Listo
            </button>
            <button 
              type="button" 
              role="tab"
              aria-selected={activeTab === 'r6'}
              className={`sim-tab-pill ${activeTab === 'r6' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('r6');
                if (onHighlightSvgNode) onHighlightSvgNode('r6-decision-dual', false);
              }}
            >
              Flujo R6: Modificación
            </button>
          </div>

          {onScrollToDiagram && (
            <button
              type="button"
              className="btn-sim-to-flow"
              onClick={() => onScrollToDiagram()}
              title="Subir al Diagrama de Flujo"
              aria-label="Subir al Diagrama de Flujo"
            >
              <ArrowUp size={14} aria-hidden="true" />
              <span>Subir al Flujo</span>
            </button>
          )}
        </div>
      </div>

      <div className="sim-body-grid">
        {/* PANEL IZQUIERDO: SELECCIÓN Y CONTROLES */}
        <div className="sim-inputs-col">
          <div className="form-group-compact">
            <label htmlFor="select-plato" className="compact-label">
              <Utensils size={14} aria-hidden="true" />
              Comanda Activa a Bordo:
            </label>
            <select 
              id="select-plato"
              className="compact-select"
              value={selectedPlato} 
              onChange={e => setSelectedPlato(e.target.value)}
            >
              {mockPlatosCrucero.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} · {p.sector}</option>
              ))}
            </select>
          </div>

          <div className="toggles-box">
            <span className="box-title">Variables Evaluadas por el Agente:</span>

            {activeTab === 'r5' ? (
              <>
                <label className="compact-toggle-row">
                  <span>¿Pedido LISTO en cocina?</span>
                  <input 
                    type="checkbox" 
                    checked={r5Listo} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR5Listo(val);
                      if (onHighlightSvgNode) {
                        if (r5FallaSatelital) onHighlightSvgNode('r5-exception', false);
                        else if (!val || r5CambioPendiente) onHighlightSvgNode('r5-action-hold', false);
                        else if (r5AvisoEnviado) onHighlightSvgNode('r5-end-hold', false);
                        else onHighlightSvgNode('r5-end-success', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Modificación PENDIENTE?</span>
                  <input 
                    type="checkbox" 
                    checked={r5CambioPendiente} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR5CambioPendiente(val);
                      if (onHighlightSvgNode) {
                        if (r5FallaSatelital) onHighlightSvgNode('r5-exception', false);
                        else if (val || !r5Listo) onHighlightSvgNode('r5-action-hold', false);
                        else if (r5AvisoEnviado) onHighlightSvgNode('r5-end-hold', false);
                        else onHighlightSvgNode('r5-end-success', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Aviso ya emitido o en curso?</span>
                  <input 
                    type="checkbox" 
                    checked={r5AvisoEnviado} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR5AvisoEnviado(val);
                      if (onHighlightSvgNode) {
                        if (r5FallaSatelital) onHighlightSvgNode('r5-exception', false);
                        else if (!r5Listo || r5CambioPendiente) onHighlightSvgNode('r5-action-hold', false);
                        else if (val) onHighlightSvgNode('r5-end-hold', false);
                        else onHighlightSvgNode('r5-end-success', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row alert-toggle">
                  <span style={{ color: 'var(--accent-danger)' }}>⚠️ Falla Red Satelital (&gt;15s)</span>
                  <input 
                    type="checkbox" 
                    checked={r5FallaSatelital} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR5FallaSatelital(val);
                      if (onHighlightSvgNode) {
                        if (val) onHighlightSvgNode('r5-exception', false);
                        else if (!r5Listo || r5CambioPendiente) onHighlightSvgNode('r5-action-hold', false);
                        else if (r5AvisoEnviado) onHighlightSvgNode('r5-end-hold', false);
                        else onHighlightSvgNode('r5-end-success', false);
                      }
                    }}
                  />
                </label>

                <div className="preset-chips-row">
                  <span className="preset-label">Probar Caso Rápido:</span>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('exito')}>
                    ✅ Condición Cumplida (4A)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('cambio')}>
                    ⏸️ Retención Cambio (3B)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('duplicado')}>
                    🚫 Ya Emitido (4B)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('timeout')}>
                    🚨 Timeout Satelital
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="compact-toggle-row">
                  <span>¿Consulta en espera de respuesta? (Pausa avisos)</span>
                  <input 
                    type="checkbox" 
                    checked={r6EnEspera} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR6EnEspera(val);
                      if (onHighlightSvgNode) {
                        if (r6PlatoEnSalidaExpress) onHighlightSvgNode('r6-exception', false);
                        else if (val) onHighlightSvgNode('r6-action-freeze', false);
                        else if (r6AprobacionCocina && r6ConfirmaPasajero) onHighlightSvgNode('r6-end-success', false);
                        else if (!r6AprobacionCocina) onHighlightSvgNode('r6-action-cancel', false);
                        else onHighlightSvgNode('r6-end-original', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Cocina aprueba el cambio?</span>
                  <input 
                    type="checkbox" 
                    checked={r6AprobacionCocina} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR6EnEspera(false);
                      setR6AprobacionCocina(val);
                      if (onHighlightSvgNode) {
                        if (r6PlatoEnSalidaExpress) onHighlightSvgNode('r6-exception', false);
                        else if (val && r6ConfirmaPasajero) onHighlightSvgNode('r6-end-success', false);
                        else if (!val) onHighlightSvgNode('r6-action-cancel', false);
                        else onHighlightSvgNode('r6-end-original', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Pasajero confirma nuevos tiempos?</span>
                  <input 
                    type="checkbox" 
                    checked={r6ConfirmaPasajero} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR6EnEspera(false);
                      setR6ConfirmaPasajero(val);
                      if (onHighlightSvgNode) {
                        if (r6PlatoEnSalidaExpress) onHighlightSvgNode('r6-exception', false);
                        else if (r6AprobacionCocina && val) onHighlightSvgNode('r6-end-success', false);
                        else if (!r6AprobacionCocina) onHighlightSvgNode('r6-action-cancel', false);
                        else onHighlightSvgNode('r6-end-original', false);
                      }
                    }}
                  />
                </label>

                <label className="compact-toggle-row alert-toggle">
                  <span style={{ color: 'var(--accent-danger)' }}>⚠️ Plato en bandeja express</span>
                  <input 
                    type="checkbox" 
                    checked={r6PlatoEnSalidaExpress} 
                    onChange={e => {
                      const val = e.target.checked;
                      setR6PlatoEnSalidaExpress(val);
                      if (onHighlightSvgNode) {
                        if (val) onHighlightSvgNode('r6-exception', false);
                        else if (r6EnEspera) onHighlightSvgNode('r6-action-freeze', false);
                        else if (r6AprobacionCocina && r6ConfirmaPasajero) onHighlightSvgNode('r6-end-success', false);
                        else if (!r6AprobacionCocina) onHighlightSvgNode('r6-action-cancel', false);
                        else onHighlightSvgNode('r6-end-original', false);
                      }
                    }}
                  />
                </label>

                <div className="preset-chips-row">
                  <span className="preset-label">Probar Caso Rápido:</span>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('espera')}>
                    ⏸️ En Espera (Pausa + Vn)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('consenso')}>
                    ✅ Consenso Dual (Vn+1)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('rechazo')}>
                    ❌ Rechazo Cocina (4B)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('original')}>
                    📦 Servir Original Vn (5B)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('salida')}>
                    👨‍🍳 Salida Rápida (Chef)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: TICKET DIGITAL DE CRUCERO */}
        <div className="sim-ticket-col">
          <div className="cruise-digital-ticket">
            <div className="ticket-header">
              <div>
                <span className="ticket-brand">Tap2Order Cruise Systems</span>
                <span className="ticket-order-id">ORD-7749 · {platoActual.sector}</span>
              </div>
              <span className={`ticket-status-pill ${resultadoActual.badgeColor}`}>
                {resultadoActual.ticketStatus}
              </span>
            </div>

            <div className="ticket-body">
              <span className="ticket-dish-name">{platoActual.nombre}</span>
              <div className="ticket-meta-tags">
                <span className="tag-chip">Tiempo: {platoActual.tiempo}</span>
                <span className="tag-chip">Servicio: Cruceros</span>
                <span className="tag-chip">Agente: Tap2Order AI</span>
              </div>

              <div className="ticket-decision-alert">
                <span className="alert-badge-label">
                  <Cpu size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '4px' }} />
                  Diagnóstico del Agente:
                </span>
                <p className="alert-message-text">{resultadoActual.mensaje}</p>
              </div>

              <div className="ticket-action-row">
                <span className="action-key">Acción Ejecutada:</span>
                <span className="action-val">{resultadoActual.accion}</span>
              </div>
            </div>

            <div className="ticket-footer">
              <button 
                type="button" 
                className="btn-sync-svg"
                onClick={() => {
                  if (onHighlightSvgNode) onHighlightSvgNode(resultadoActual.nodoSvg, true);
                }}
                title="Subir al diagrama para resaltar este paso exacto"
              >
                <RefreshCw size={13} aria-hidden="true" />
                <span>Resaltar Paso en Diagrama</span>
              </button>

              {onScrollToDiagram && (
                <button 
                  type="button" 
                  className="btn-switch-flow-up"
                  onClick={() => {
                    const otroFlujo = activeTab === 'r5' ? 'r6' : 'r5';
                    onScrollToDiagram(otroFlujo);
                  }}
                  title={`Subir al diagrama y elegir Flujo ${activeTab === 'r5' ? 'R6 (Modificación)' : 'R5 (Aviso de Listo)'}`}
                >
                  <ArrowUp size={14} aria-hidden="true" />
                  <span>Subir y Elegir {activeTab === 'r5' ? 'Flujo R6 (Modificación)' : 'Flujo R5 (Aviso)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
