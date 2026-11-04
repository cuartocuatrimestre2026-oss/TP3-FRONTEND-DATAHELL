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
import { Sparkles, Compass, Sliders, Layers } from 'lucide-react';

export function App() {
  const [activeFlowTab, setActiveFlowTab] = useState('r5');
  const [selectedSvgNode, setSelectedSvgNode] = useState('r5-decision');

  const handleHighlightSvgNode = (nodeId) => {
    if (nodeId.startsWith('r5')) {
      setActiveFlowTab('r5');
    } else if (nodeId.startsWith('r6')) {
      setActiveFlowTab('r6');
    }
    setSelectedSvgNode(nodeId);

    // Scroll suave al diagrama para ver el efecto visual
    const el = document.getElementById('diagramas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
              <div className="flow-tab-selector" role="tablist">
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
              </div>

              <InteractiveSvgFlow
                activeFlow={activeFlowTab}
                selectedNodeId={selectedSvgNode}
                onSelectNode={(nodeId) => setSelectedSvgNode(nodeId)}
              />
            </div>
          </section>

          {/* SECCIÓN 3: Consola / Simulador en Vivo de Cruceros */}
          <section id="simulador" className="section-compact" aria-labelledby="simulador-heading">
            <div className="container">
              <div className="section-title-wrap">
                <span className="section-tag">
                  <Sliders size={14} aria-hidden="true" />
                  Simulación en Vivo · Nivel Supera
                </span>
                <h2 id="simulador-heading" className="section-heading">
                  Consola de Interacción Agéntica Tap2Order
                </h2>
                <p className="section-desc">
                  Probá cómo opera el agente en tiempo real con comandas reales de crucero: activá condiciones y mirá cómo se sincroniza con el diagrama de flujo.
                </p>
              </div>

              <CruiseOrderSimulator onHighlightSvgNode={handleHighlightSvgNode} />
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
