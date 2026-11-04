import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

export const CruiseOrderSimulator = ({ onHighlightSvgNode }) => {
  const [activeTab, setActiveTab] = useState('r5');
  const [selectedPlato, setSelectedPlato] = useState(mockPlatosCrucero[0].id);

  // Estados para R5 (Aviso)
  const [r5Listo, setR5Listo] = useState(true);
  const [r5CambioPendiente, setR5CambioPendiente] = useState(false);
  const [r5AvisoEnviado, setR5AvisoEnviado] = useState(false);
  const [r5FallaSatelital, setR5FallaSatelital] = useState(false);

  // Estados para R6 (Modificación)
  const [r6AprobacionCocina, setR6AprobacionCocina] = useState(true);
  const [r6ConfirmaPasajero, setR6ConfirmaPasajero] = useState(true);
  const [r6PlatoEnSalidaExpress, setR6PlatoEnSalidaExpress] = useState(false);

  // Plato actual
  const platoActual = mockPlatosCrucero.find(p => p.id === selectedPlato) || mockPlatosCrucero[0];

  // Cálculo de resultado para R5
  const getR5Result = () => {
    if (!r5Listo) {
      return {
        nodoSvg: 'r5-decision',
        estadoBadge: 'Cocina en Proceso',
        badgeColor: 'warning',
        mensaje: 'La comanda sigue en elaboración en cocina. El agente mantiene en espera el aviso.',
        ticketStatus: 'PREPARANDO',
        accion: 'Ninguna (esperando evento de cocina).'
      };
    }
    if (r5CambioPendiente) {
      return {
        nodoSvg: 'r5-action-hold',
        estadoBadge: 'Aviso Retenido (Pausa)',
        badgeColor: 'warning',
        mensaje: 'Hay una modificación en trámite sobre el plato. El agente congela los avisos para evitar falsas alertas.',
        ticketStatus: 'MODIFICACIÓN PENDIENTE',
        accion: 'Retención preventiva en base de datos.'
      };
    }
    if (r5AvisoEnviado) {
      return {
        nodoSvg: 'r5-end-hold',
        estadoBadge: 'Aviso ya Enviado',
        badgeColor: 'warning',
        mensaje: 'El aviso ya fue emitido o está en curso. El agente bloquea duplicados para no molestar al huésped.',
        ticketStatus: 'YA NOTIFICADO',
        accion: 'Bloqueo de idempotencia (cero spam).'
      };
    }
    if (r5FallaSatelital) {
      return {
        nodoSvg: 'r5-exception',
        estadoBadge: 'Timeout de Red Satelital',
        badgeColor: 'danger',
        mensaje: 'El gateway marítimo no respondió tras 2 reintentos. El agente alertó a la tablet del Cabin Host.',
        ticketStatus: 'ESCALADO PRESENCIAL',
        accion: 'Cabin Host acude al camarote para aviso verbal en mano.'
      };
    }
    return {
      nodoSvg: 'r5-end-success',
      estadoBadge: 'Aviso Enviado con Éxito',
      badgeColor: 'success',
      mensaje: `Notificación enviada a la pantalla de ${platoActual.sector}. Se recibió confirmación de recepción (ACK 200).`,
      ticketStatus: 'NOTIFICADO Y CONFIRMADO',
      accion: "Aviso registrado formalmente como 'ENVIADO'."
    };
  };

  // Cálculo de resultado para R6
  const getR6Result = () => {
    if (r6PlatoEnSalidaExpress) {
      return {
        nodoSvg: 'r6-exception',
        estadoBadge: 'Conflicto en Carrito de Salida',
        badgeColor: 'danger',
        mensaje: 'El huésped pidió cambio pero el plato ya salía en el carrito del camarero. Alarma sonora de HOLD.',
        ticketStatus: 'HOLD EXPRESS',
        accion: 'Intervención presencial del Sous Chef para autorizar cambio o compensar.'
      };
    }
    if (r6AprobacionCocina && r6ConfirmaPasajero) {
      return {
        nodoSvg: 'r6-end-success',
        estadoBadge: 'Versión Vn+1 Creada',
        badgeColor: 'success',
        mensaje: 'Cocina dio el visto bueno y el pasajero aceptó el tiempo extra. Se creó formalmente la nueva versión.',
        ticketStatus: 'VERSIÓN Vn+1 ACTIVA',
        accion: 'Exige nueva confirmación de cocina antes de volver a marcar lista.'
      };
    }
    return {
      nodoSvg: 'r6-action-cancel',
      estadoBadge: 'Modificación Cancelada',
      badgeColor: 'warning',
      mensaje: !r6AprobacionCocina 
        ? 'Cocina dictaminó NO FACTIBLE (plato horneado). Se mantiene la versión original.' 
        : 'El pasajero no confirmó los nuevos tiempos. Se continúa con la versión original.',
      ticketStatus: 'VERSIÓN ORIGINAL Vn',
      accion: 'Despausa avisos normales y despacha la versión original Vn.'
    };
  };

  const resultadoActual = activeTab === 'r5' ? getR5Result() : getR6Result();

  // Presets rápidos de 1 clic
  const aplicarPresetR5 = (caso) => {
    if (caso === 'exito') {
      setR5Listo(true);
      setR5CambioPendiente(false);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-end-success');
    } else if (caso === 'cambio') {
      setR5Listo(true);
      setR5CambioPendiente(true);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-action-hold');
    } else if (caso === 'timeout') {
      setR5Listo(true);
      setR5CambioPendiente(false);
      setR5AvisoEnviado(false);
      setR5FallaSatelital(true);
      if (onHighlightSvgNode) onHighlightSvgNode('r5-exception');
    }
  };

  const aplicarPresetR6 = (caso) => {
    if (caso === 'consenso') {
      setR6AprobacionCocina(true);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-end-success');
    } else if (caso === 'rechazo') {
      setR6AprobacionCocina(false);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(false);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-action-cancel');
    } else if (caso === 'salida') {
      setR6AprobacionCocina(true);
      setR6ConfirmaPasajero(true);
      setR6PlatoEnSalidaExpress(true);
      if (onHighlightSvgNode) onHighlightSvgNode('r6-exception');
    }
  };

  return (
    <div className="cruise-simulator-card">
      <div className="sim-top-nav">
        <div className="sim-brand-title">
          <Ship size={18} className="text-accent" aria-hidden="true" />
          <span>Consola Agéntica Tap2Order · Cruceros</span>
        </div>

        <div className="sim-mode-tabs" role="tablist">
          <button 
            type="button" 
            role="tab"
            aria-selected={activeTab === 'r5'}
            className={`sim-tab-pill ${activeTab === 'r5' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('r5');
              if (onHighlightSvgNode) onHighlightSvgNode('r5-decision');
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
              if (onHighlightSvgNode) onHighlightSvgNode('r6-decision-dual');
            }}
          >
            Flujo R6: Modificación
          </button>
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
                      setR5Listo(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode('r5-decision');
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Modificación PENDIENTE?</span>
                  <input 
                    type="checkbox" 
                    checked={r5CambioPendiente} 
                    onChange={e => {
                      setR5CambioPendiente(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode(e.target.checked ? 'r5-action-hold' : 'r5-decision');
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Aviso ya emitido o en curso?</span>
                  <input 
                    type="checkbox" 
                    checked={r5AvisoEnviado} 
                    onChange={e => {
                      setR5AvisoEnviado(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode(e.target.checked ? 'r5-end-hold' : 'r5-decision');
                    }}
                  />
                </label>

                <label className="compact-toggle-row alert-toggle">
                  <span style={{ color: 'var(--accent-danger)' }}>⚠️ Falla Red Satelital (&gt;15s)</span>
                  <input 
                    type="checkbox" 
                    checked={r5FallaSatelital} 
                    onChange={e => {
                      setR5FallaSatelital(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode(e.target.checked ? 'r5-exception' : 'r5-decision');
                    }}
                  />
                </label>

                <div className="preset-chips-row">
                  <span className="preset-label">Probar Caso Rápido:</span>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('exito')}>
                    ✅ Condición Cumplida
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('cambio')}>
                    ⏸️ Retención por Cambio
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR5('timeout')}>
                    🚨 Timeout Satelital
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="compact-toggle-row">
                  <span>¿Cocina aprueba el cambio?</span>
                  <input 
                    type="checkbox" 
                    checked={r6AprobacionCocina} 
                    onChange={e => {
                      setR6AprobacionCocina(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode('r6-decision-dual');
                    }}
                  />
                </label>

                <label className="compact-toggle-row">
                  <span>¿Pasajero confirma nuevos tiempos?</span>
                  <input 
                    type="checkbox" 
                    checked={r6ConfirmaPasajero} 
                    onChange={e => {
                      setR6ConfirmaPasajero(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode('r6-decision-dual');
                    }}
                  />
                </label>

                <label className="compact-toggle-row alert-toggle">
                  <span style={{ color: 'var(--accent-danger)' }}>⚠️ Plato en bandeja express</span>
                  <input 
                    type="checkbox" 
                    checked={r6PlatoEnSalidaExpress} 
                    onChange={e => {
                      setR6PlatoEnSalidaExpress(e.target.checked);
                      if (onHighlightSvgNode) onHighlightSvgNode(e.target.checked ? 'r6-exception' : 'r6-decision-dual');
                    }}
                  />
                </label>

                <div className="preset-chips-row">
                  <span className="preset-label">Probar Caso Rápido:</span>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('consenso')}>
                    ✅ Consenso Dual (Vn+1)
                  </button>
                  <button type="button" className="preset-chip" onClick={() => aplicarPresetR6('rechazo')}>
                    ❌ Rechazo Cocina (Vn)
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
                  if (onHighlightSvgNode) onHighlightSvgNode(resultadoActual.nodoSvg);
                }}
              >
                <RefreshCw size={13} aria-hidden="true" />
                Resaltar Paso en el Diagrama SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
