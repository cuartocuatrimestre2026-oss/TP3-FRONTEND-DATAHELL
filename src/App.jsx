import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HeroPresentation } from './components/HeroPresentation';
import { SentenciasCards } from './components/SentenciasCards';
import { InteractiveSvgFlow } from './components/InteractiveSvgFlow';
import { CruiseOrderSimulator } from './components/CruiseOrderSimulator';
import { AccordionDetails } from './components/AccordionDetails';
import { TeamSection } from './components/TeamSection';
import { BotonSubir } from './components/BotonSubir';
import { Footer } from './components/Footer';
import { Sparkles, Compass, Sliders, Layers, ArrowDown } from 'lucide-react';

export function App() {
  const [activeFlowTab, setActiveFlowTab] = useState('r5');
  const [selectedSvgNode, setSelectedSvgNode] = useState('r5-decision');
  const [highlightFlowTabs, setHighlightFlowTabs] = useState(false);
  const [highlightSimulator, setHighlightSimulator] = useState(false);
  const [simulatorSyncNode, setSimulatorSyncNode] = useState(null);

  // Scroll suave con offset directo al recuadro del diagrama (Foto 2)
  const scrollToDiagramFlowBox = () => {
    const target = document.getElementById('diagrama-flujo-anchor') || document.getElementById('diagramas');
    if (target) {
      const headerOffset = 76;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Bajar a la consola de interacción agéntica encuadrando la tarjeta completa
  const handleScrollToSimulator = (targetNodeOrEvent) => {
    if (typeof targetNodeOrEvent === 'string') {
      setSimulatorSyncNode(targetNodeOrEvent);
      if (targetNodeOrEvent.startsWith('r5')) setActiveFlowTab('r5');
      else if (targetNodeOrEvent.startsWith('r6')) setActiveFlowTab('r6');
    } else if (targetNodeOrEvent && targetNodeOrEvent.preventDefault) {
      targetNodeOrEvent.preventDefault();
    }

    const target = document.getElementById('simulador-card-anchor') || document.getElementById('simulador');
    if (target) {
      const headerHeight = 72;
      const targetRect = target.getBoundingClientRect();
      const targetHeight = targetRect.height;
      const viewportHeight = window.innerHeight;
      
      let targetTopOffset;
      if (viewportHeight - headerHeight >= targetHeight + 16) {
        // Centrarla con armonía en el espacio disponible debajo del header
        const extraSpace = (viewportHeight - headerHeight - targetHeight) / 2;
        targetTopOffset = headerHeight + extraSpace;
      } else {
        // En pantallas más ajustadas, alinear con margen de 12px debajo del header
        targetTopOffset = headerHeight + 12;
      }
      
      const scrollY = targetRect.top + window.pageYOffset - targetTopOffset;
      window.scrollTo({
        top: Math.max(0, scrollY),
        behavior: 'smooth'
      });
      setHighlightSimulator(true);
      setTimeout(() => setHighlightSimulator(false), 2400);
    }
  };

  // Subir al diagrama de flujo (opcionalmente cambiando al flujo deseado)
  const handleScrollToDiagram = (targetFlow) => {
    if (targetFlow) {
      setActiveFlowTab(targetFlow);
      setSelectedSvgNode(targetFlow === 'r5' ? 'r5-decision' : 'r6-decision-dual');
    }
    scrollToDiagramFlowBox();
    setHighlightFlowTabs(true);
    setTimeout(() => setHighlightFlowTabs(false), 2400);
  };

  const handleHighlightSvgNode = (nodeId, shouldScroll = false) => {
    if (nodeId.startsWith('r5')) {
      setActiveFlowTab('r5');
    } else if (nodeId.startsWith('r6')) {
      setActiveFlowTab('r6');
    }
    setSelectedSvgNode(nodeId);

    // Scroll suave directo al recuadro del diagrama cuando se solicita explícitamente
    if (shouldScroll) {
      scrollToDiagramFlowBox();
    }
  };

  return (
    <ThemeProvider>
      <div className="app-layout">
        <Header />

        <main id="contenido-principal" role="main" tabIndex={-1}>
          <HeroPresentation />

          {/* SECCIÓN 1: Sentencias Asignadas (Tarjetas Compactas sin paredes de texto) */}
          <section id="propuestas" className="section-compact" aria-labelledby="propuestas-heading">
            <div className="container">
              <div className="section-title-wrap">
                <h2 id="propuestas-heading" className="section-heading">
                  Dos Sentencias. Dos Soluciones.
                </h2>
                <p className="section-desc">
                  Desarmamos cada regla de negocio en datos, condiciones y consecuencias agénticas, distinguiendo la lógica formal de las decisiones de diseño.
                </p>
              </div>

              <SentenciasCards />
            </div>
          </section>

          {/* SECCIÓN 2: Diagrama de Recorrido SVG Interactivo */}
          <section id="diagramas" className="section-compact bg-alt" aria-labelledby="diagramas-heading">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">
                  <Compass size={14} aria-hidden="true" />
                  Recorrido Gráfico Interactivo
                </span>
                <h2 id="diagramas-heading" className="section-heading">
                  Diagrama de Flujo Agéntico
                </h2>
                <p className="section-desc">
                  Hacé clic en cualquier nodo para explorar qué hace el agente, qué decide y cuándo interviene una persona.
                </p>
              </div>

              {/* Selector de Flujo */}
              <div 
                id="diagrama-flujo-anchor"
                className={`flow-tab-selector ${highlightFlowTabs ? 'highlight-pulse' : ''}`} 
                role="tablist"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFlowTab === 'r5'}
                  className={`flow-tab-btn ${activeFlowTab === 'r5' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFlowTab('r5');
                    setSelectedSvgNode('r5-decision');
                  }}
                >
                  Flujo R5: Notificación y Confirmación
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFlowTab === 'r6'}
                  className={`flow-tab-btn ${activeFlowTab === 'r6' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFlowTab('r6');
                    setSelectedSvgNode('r6-decision-dual');
                  }}
                >
                  Flujo R6: Modificación en Caliente (Consenso Dual)
                </button>
                <button
                  type="button"
                  className="flow-tab-btn flow-tab-sim-link"
                  onClick={handleScrollToSimulator}
                  title="Bajar directamente a la consola de pedidos"
                  aria-label="Bajar a la Consola de Simulación"
                >
                  <Sliders size={14} aria-hidden="true" />
                  <span>Bajar a Consola</span>
                  <ArrowDown size={13} aria-hidden="true" />
                </button>
              </div>

              <InteractiveSvgFlow
                activeFlow={activeFlowTab}
                selectedNodeId={selectedSvgNode}
                onSelectNode={(nodeId) => setSelectedSvgNode(nodeId)}
                onReturnToSimulator={handleScrollToSimulator}
              />
            </div>
          </section>

          {/* SECCIÓN 3: Consola / Simulador en Vivo de Cruceros */}
          <section id="simulador" className="section-compact" aria-labelledby="simulador-heading">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">
                  <Sliders size={14} aria-hidden="true" />
                  Simulación en Vivo
                </span>
                <h2 id="simulador-heading" className="section-heading">
                  Consola de Interacción Agéntica Tap2Order
                </h2>
                <p className="section-desc">
                  Probá cómo opera el agente en tiempo real con comandas reales de crucero: activá condiciones y mirá cómo se sincroniza con el diagrama de flujo.
                </p>
              </div>

              <CruiseOrderSimulator 
                onHighlightSvgNode={handleHighlightSvgNode} 
                onScrollToDiagram={handleScrollToDiagram}
                currentFlow={activeFlowTab}
                syncNodeId={simulatorSyncNode}
                isHighlighted={highlightSimulator}
              />
            </div>
          </section>

          {/* SECCIÓN 4: Desplegables Técnicos */}
          <AccordionDetails />

          {/* SECCIÓN 5: Equipo de Desarrollo */}
          <TeamSection />
        </main>

        <Footer />
        <BotonSubir />
      </div>
    </ThemeProvider>
  );
}

export default App;
