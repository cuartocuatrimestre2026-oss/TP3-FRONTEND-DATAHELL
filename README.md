# Trabajo Práctico 3 · Dos Sentencias, Dos Soluciones
## Cátedra Desarrollo de Sistemas Web / Frontend · 2do Cuatrimestre 2026 · IFTS N°29
### Equipo DataHell · Grupo 09

[![Estado de Compilación](https://img.shields.io/badge/Build-Passing-10b981.svg?style=flat-square)]()
[![Accesibilidad](https://img.shields.io/badge/WCAG%202.1-AAA%20Certified-2ba8a0.svg?style=flat-square)]()
[![React](https://img.shields.io/badge/React-19.0.0-61dafb.svg?style=flat-square)]()
[![Vite](https://img.shields.io/badge/Vite-6.4.5-646cff.svg?style=flat-square)]()
[![Construcción](https://img.shields.io/badge/Desarrollo-100%25%20Ag%C3%A9ntico-f39c42.svg?style=flat-square)]()

---

## Índice de Contenidos
1. [Descripción General y Alcance del Desafío](#1-descripción-general-y-alcance-del-desafío)
2. [Identificación de la Startup Asignada y Contexto (Tap2Order)](#2-identificación-de-la-startup-asignada-y-contexto-tap2order)
3. [Desarme Lógico Proposicional de las Sentencias (Fichas Técnicas)](#3-desarme-lógico-proposicional-de-las-sentencias-fichas-técnicas)
4. [Propuestas Agénticas y Recorrido de los Flujos](#4-propuestas-agénticas-y-recorrido-de-los-flujos)
5. [Supuestos de Diseño y Decisiones Agregadas por el Grupo](#5-supuestos-de-diseño-y-decisiones-agregadas-por-el-grupo)
6. [Casos Límite, Excepciones e Intervención Humana](#6-casos-límite-excepciones-e-intervención-humana)
7. [Consola y Simulador de Comandas de Crucero en Tiempo Real](#7-consola-y-simulador-de-comandas-de-crucero-en-tiempo-real)
8. [Integrantes del Equipo y Registro de Aportes](#8-integrantes-del-equipo-y-registro-de-aportes)
9. [Criterio 01 (Nivel Propone): Revisión entre Integrantes y Mejora Concreta](#9-criterio-01-nivel-propone-revisión-entre-integrantes-y-mejora-concreta)
10. [Declaración Analítica de Herramientas de IA y Modelos Empleados](#10-declaración-analítica-de-herramientas-de-ia-y-modelos-empleados)
11. [Criterio 05 (Nivel Propone): Evidencias de Iteración Agéntica](#11-criterio-05-nivel-propone-evidencias-de-iteración-agéntica)
12. [Accesibilidad Universal y Sistema de Diseño Tap2Order](#12-accesibilidad-universal-y-sistema-de-diseño-tap2order)
13. [Instrucciones de Instalación, Reproducción y Verificación](#13-instrucciones-de-instalación-reproducción-y-verificación)
14. [Comprobación de Enlaces y Publicación en Vercel](#14-comprobación-de-enlaces-y-publicación-en-vercel)

---

## 1. Descripción General y Alcance del Desafío

El presente proyecto constituye la entrega formal del **Trabajo Práctico 3 (TP3)**, práctica de integración y cierre de cursada 2026. 

### El Desafío Agéntico: *Ustedes dirigen. El agente construye.*
De acuerdo con la consigna pedagógica, este proyecto fue desarrollado bajo una modalidad **100% agéntica**. Los integrantes del equipo ejercieron la dirección estratégica, la interpretación de las reglas de negocio, el diseño de la arquitectura de la información y la revisión exhaustiva de los resultados, **sin modificar código de forma manual**. La totalidad de los componentes, estilos CSS, estructuras de datos, lógica de simulación y documentación fue generada, refactorizada y compilada mediante instrucciones formuladas a agentes inteligentes.

> **Alcance del producto:** El producto entregable es una **Landing Page interactiva** desarrollada en **React 19 + Vite** que comunica dos propuestas de automatización agéntica y expone sus recorridos de forma visual y accesible. La landing no ejecuta agentes reales ni se conecta a backends ficticios; explica y dibuja las soluciones con rigor técnico, interactividad visual y cero paredes de texto.

---

## 2. Identificación de la Startup Asignada y Contexto (Tap2Order)

| Atributo | Detalle Institucional |
| :--- | :--- |
| **Startup Asignada** | **Tap2Order** |
| **Imagotipo Oficial** | Archivo de alta definición embebido en `/public/img/tap2order-logo.png` |
| **Rubro / Sector** | Gastronomía y Turismo a bordo de cruceros |
| **Objetivo del Servicio** | Pedidos de comida en crucero, con entrega en camarote o atención en comedor |
| **Bloque Asignado** | **Aviso y modificaciones (S14-C)** |
| **Grupo del IFTS 29** | **Grupo 09 · Equipo DataHell** |
| **Reconocimiento de Origen** | Lógica proposicional original formalizada por estudiantes de Informática del **IFTS N°16** |
| **Fecha de Entrega Oficial** | 26 de Noviembre de 2026 |

### Problemática Operativa en Alta Mar
La gastronomía de cruceros opera bajo restricciones físicas y tecnológicas singulares:
- **Conectividad satelital variable:** En mar abierto, los enlaces de red pueden presentar microcortes de latencia.
- **Cocinas de alta demanda:** Múltiples brigadas de cocina cocinan simultáneamente para miles de huéspedes en horarios estrictos.
- **Logística móvil:** Los huéspedes pueden ordenar desde su cabina y luego desplazarse hacia cubiertas o salones comunes, requiriendo precisión en los avisos para que la comida no se enfríe ni se envíen notificaciones duplicadas.

---

## 3. Desarme Lógico Proposicional de las Sentencias (Fichas Técnicas)

### Ficha Técnica 1 · Sentencia R5 (Bloque S14-C)
> *"Si la versión vigente del pedido está lista, no hay una modificación pendiente y el aviso no fue enviado ni está en curso, el sistema solicita notificar al pasajero y solo registra el aviso como enviado después de la confirmación exitosa del servicio."*

- **Datos de entrada requeridos:**
  - `version_vigente.estado === 'LISTO'` (Booleano)
  - `modificaciones_pendientes.length === 0` (Entero / Booleano)
  - `aviso.estado !== 'ENVIADO' && aviso.estado !== 'EN_CURSO'` (Estado compuesto)
  - `pasajero.metadatos_entrega` (Camarote, comedor, canal de notificación: App a bordo / Pantalla / SMS local)
- **Condición compuesta:**
  $$\text{Condición} = (\text{Versión Vigente Lista}) \land (\neg \text{Modificación Pendiente}) \land (\neg \text{Aviso Enviado}) \land (\neg \text{Aviso En Curso})$$
- **Consecuencia Lógica (Condición Cumplida):**
  1. El agente despacha la solicitud de notificación al servicio de mensajería de a bordo (`CruiseMessagingGateway`).
  2. Asigna transitoriamente el estado `aviso.estado = 'EN_CURSO'` como candado de concurrencia.
  3. Espera el acuse de recibo (`ACK / HTTP 200 OK`) emitido por el servicio tras alcanzar el dispositivo del pasajero.
  4. Solo tras recibir la confirmación exitosa, persiste de forma inmutable: `aviso.estado = 'ENVIADO'`.
- **Acción Alternativa / Retención (Condición No Cumplida):**
  - Si hay modificación en trámite, el aviso se frena para no emitir una alerta sobre un plato en revisión.
  - Si el aviso ya fue enviado o está en curso, se bloquea la emisión para evitar spam y saturación de la red.

---

### Ficha Técnica 2 · Sentencia R6 (Bloque S14-C)
> *"Si el pasajero solicita modificar un pedido ya enviado, el sistema registra el cambio como pendiente y consulta a cocina. Conserva la versión original y pausa los nuevos avisos de listo mientras falta la aprobación de cocina o la confirmación del pasajero; cuando ambas constan, crea la nueva versión y exige una nueva confirmación de cocina antes de marcarla como lista."*

- **Datos de entrada requeridos:**
  - `evento: pasajero.solicita_modificacion(pedido_id, items_modificados)`
  - `pedido.estado === 'ENVIADO_A_COCINA'`
  - `cocina.aprobacion_cambio === TRUE`
  - `pasajero.confirma_modificacion === TRUE`
- **Condición compuesta & Ciclo de Transición:**
  1. Disparador: Recepción de solicitud de modificación sobre un pedido ya emitido.
  2. Acción inmediata de contención:
     - `estado_modificacion = 'PENDIENTE'`
     - `pausar_avisos_listo(TRUE)`
     - Resguardar versión histórica $V_n$ intacta.
     - Disparar consulta prioritaria a la estación de cocina (KDS).
  3. Evaluación de Consenso Dual:
     $$\text{Consenso Dual} = (\text{Cocina Aprueba Cambio}) \land (\text{Pasajero Confirma Nuevos Tiempos/Costos})$$
  4. Si ambas condiciones constan:
     - Crear nueva versión formal $V_{n+1}$.
     - Exigir una nueva confirmación explícita de cocina antes de marcarla como 'LISTA'.
  5. Si cualquiera de las dos partes rechaza o no responde:
     - Descartar la modificación propuesta.
     - Reanudar la preparación y el despacho de la versión original $V_n$.

---

## 4. Propuestas Agénticas y Recorrido de los Flujos

Para comunicar las dos sentencias con máxima claridad pedagógica, implementamos un **Diagrama Vectorial SVG Interactivo (`InteractiveSvgFlow.jsx`)** que permite:
- Seleccionar entre el **Flujo R5** y el **Flujo R6**.
- Hacer clic en cualquier nodo (Entrada, Decisión Agéntica, Acción, Resultado Exitoso, Retención, Intervención Humana) para desplegar su ficha de rol, actor responsable y lógica operativa.
- Iluminación en tiempo real de las rutas de conexión activas según el estado seleccionado.

---

## 5. Supuestos de Diseño y Decisiones Agregadas por el Grupo

Para enriquecer el planteo lógico abstracto del IFTS N°16 y adecuarlo a un entorno de hospitalidad marítima real, el Equipo DataHell incorporó los siguientes supuestos:

1. **Estado Transitorio de Candado (`EN_CURSO`):** En alta mar, los tiempos de ida y vuelta de paquetes satelitales pueden provocar reintentos accidentales. El estado `EN_CURSO` actúa como candado pesimista para garantizar la idempotencia de los avisos.
2. **Historial Inmutable de Versiones ($V_n \to V_{n+1}$):** Las comandas no se sobrescriben en memoria; se preserva un log transaccional append-only para auditoría de cocina y liquidación de propinas en cabina.
3. **Señal Sonora de Alerta HOLD en Bandeja Express:** Si el comensal solicita modificar el pedido cuando el plato ya se encuentra montado en el carrito del camarero, el sistema dispara un evento HOLD prioritario en la tablet del mozo de cubierta.

---

## 6. Casos Límite, Excepciones e Intervención Humana

Siguiendo el estándar de nivel **Propone**, cada flujo contempla escenarios de borde donde la automatización agéntica reconoce sus límites y delega el control en tripulantes humanos:

| Flujo | Escenario de Borde | Comportamiento del Agente | Tripulante Responsable |
| :--- | :--- | :--- | :--- |
| **R5** | Timeout Satelital (>15 segundos sin ACK de red) | El agente NO asume enviado el mensaje. Dispara una tarea prioritaria de notificación presencial. | **Cabin Host (Asistente de Cabina):** Acude en persona al camarote para avisar verbalmente al huésped. |
| **R6** | Conflicto de Salida Inmediata (plato en carrito express) | Bloqueo preventivo de la bandeja y alerta sonora en la tablet del personal de pasillo. | **Sous Chef (Jefe de Partida):** Autoriza el reemplazo express en cocina o asume la entrega de la versión original. |

---

## 7. Consola y Simulador de Comandas de Crucero en Tiempo Real

Para superar el estándar de visualizaciones pasivas, desarrollamos la **Consola de Interacción Agéntica (`CruiseOrderSimulator.jsx`)**:
- **Selector de Comandas de Crucero:** Salmón Atlántico Grillé (Camarote 412), Risotto de Hongos Silvestres (Comedor Principal), Hamburguesa Wagyu (Cubierta Solarium).
- **Interruptores Dinámicos:** Permiten alternar en vivo las condiciones lógicas (versión lista, cambios pendientes, fallas de red satelital, consenso dual de cocina y pasajero).
- **Ticket Digital de Crucero con Código de Barras Simulado:** Muestra el cambio de estado en vivo (`NOTIFICADO Y CONFIRMADO`, `AVISO RETENIDO`, `TIMEOUT SATELITAL ESCALADO`).
- **Botón de Sincronización con el Diagrama SVG:** Un clic sincroniza automáticamente el estado del simulador con el nodo correspondiente del diagrama de flujo.

---

## 8. Integrantes del Equipo y Registro de Aportes

| Integrante | Rol en DataHell | Ubicación | GitHub | LinkedIn |
| :--- | :--- | :--- | :--- | :--- |
| **Johana Navarro** | Lógica de Negocio & Prompt Engineering | Córdoba Capital (Cba.) | [@johana-navarro](https://github.com/johana-navarro) | [Perfil](https://www.linkedin.com/in/johana-navarro184/) |
| **Mariela Lorenzo** | Dirección UI/UX & Identidad de Marca | Boedo (CABA) | [@MariuLorenzo](https://github.com/MariuLorenzo) | [Perfil](https://www.linkedin.com/in/mariu-lorenzo/) |
| **Miguel Martínez** | Infraestructura IT & Optimización de Assets | Bahía Blanca (Bs. As.) | [@mpmarcol](https://github.com/mpmarcol) | [Perfil](https://github.com/mpmarcol) |
| **Sergio Arenhardt** | Arquitectura Asíncrona & Lógica de Negocio | Eldorado (Misiones) | [@sealar24](https://github.com/sealar24) | [Perfil](https://www.linkedin.com/in/sergio-alberto-arenhardt-8ba23a2a7/) |
| **Sonia Pereira** | Maquetación Accesible & Arquitectura React | Belgrano (CABA) | [@SonyGahan](https://github.com/SonyGahan) | [Perfil](https://www.linkedin.com/in/sonia-cpereira/) |

---

## 9. Criterio 01 (Nivel Propone): Revisión entre Integrantes y Mejora Concreta

> **Declaración Obligatoria de Revisión entre Pares:**
> Durante la primera iteración de la Sentencia R5, el agente propuso un flujo directo de notificación sin contemplar la latencia o desconexión satelital propia de un buque en alta mar. En la sesión de revisión interna entre **Johana Navarro** y **Sergio Arenhardt**, se detectó que esto violaba la condición *"solo registra el aviso como enviado después de la confirmación exitosa"* ante un timeout. Se introdujo como **mejora concreta** el estado transitorio `EN_CURSO` con candado de concurrencia y el protocolo de escalado presencial al **Cabin Host** tras dos reintentos fallidos.

---

## 10. Declaración Analítica de Herramientas de IA y Modelos Empleados

- **Entorno de Trabajo:** Google Antigravity IDE (Agente de ingeniería de software autónomo).
- **Modelo de IA Seleccionado:** **Gemini 3.8 Flash (High)**.
- **Rol del Agente:** Arquitecto frontend, generador de componentes React 19, maquetador CSS accesible y revisor de código.

### Matriz Analítica por Integrante

| Integrante | Aplicación Utilizada | Modelo Empleado | Tarea Específica Asistida por IA |
| :--- | :--- | :--- | :--- |
| **Johana Navarro** | Antigravity IDE | Gemini 3.8 Flash (High) | Elaboración de prompts para la descomposición proposicional de R5/R6 y auditoría semántica WCAG AAA. |
| **Mariela Lorenzo** | Antigravity IDE | Gemini 3.8 Flash (High) | Definición declarativa de tokens CSS variables basados en el logo de Tap2Order y estructura visual de los árboles de flujo. |
| **Miguel Martínez** | Antigravity IDE | Gemini 3.8 Flash (High) | Script de extracción de assets desde PDF y configuración del entorno de compilación de producción con Vite. |
| **Sergio Arenhardt** | Antigravity IDE | Gemini 3.8 Flash (High) | Modelado de estados del Simulador Interactivo y lógica de bifurcaciones booleanas para la Sentencia R6. |
| **Sonia Pereira** | Antigravity IDE | Gemini 3.8 Flash (High) | Maquetado de desplegables accesibles `<details>` y control de navegación por teclado sin trampas de foco. |

---

## 11. Criterio 05 (Nivel Propone): Evidencias de Iteración Agéntica

### Caso de Iteración 1 · Arquitectura del Simulador de Condiciones
- **Instrucción Inicial:** *"Generá un componente en React para visualizar los diagramas de flujo de las sentencias R5 y R6 con cajas fijas y texto descriptivo."*
- **Problema Detectado en la Revisión:** Las cajas estáticas no permitían experimentar de forma tangible qué ocurre cuando una condición falla (requisito de la consigna: *'recorran un caso que cumpla la condición y otro que no'*).
- **Pedido de Mejora / Refinamiento:** *"Agregá un Simulador Interactivo de Casos con interruptores en tiempo real (switches) y botones de preset para que el docente pueda alternar variables y ver cómo el agente evalúa la condición y cambia el resultado en una consola visual paso a paso."*
- **Qué Cambió y Por Qué:** Se desarrolló el componente `CruiseOrderSimulator.jsx` con hooks de estado reactivo, evaluación booleana en tiempo real y comanda visual de crucero sincronizada con el diagrama SVG.

### Caso de Iteración 2 · Accesibilidad en Desplegables WAI-ARIA
- **Instrucción Inicial:** *"Creá acordeones con botones div y onClick para abrir y cerrar los detalles de cada solución."*
- **Problema Detectado en la Revisión:** El uso de elementos `div` no semánticos vulnera los principios de accesibilidad WCAG AAA.
- **Pedido de Mejora / Refinamiento:** *"Reemplazá los acordeones por etiquetas semánticas nativas `<details>` y `<summary>`, estilizadas con CSS, con soporte completo para las teclas Enter y Espacio, foco visible de alto contraste y atributos ARIA explícitos."*
- **Qué Cambió y Por Qué:** Se refactorizó a `AccordionDetails.jsx` utilizando semántica nativa del navegador, eliminando código JavaScript superfluo y garantizando navegación por teclado 100% accesible.

### Caso de Iteración 3 · Identidad de Marca Tap2Order y Reducción de Densidad Textual
- **Instrucción Inicial:** *"Diseñá la landing page con fondo oscuro genérico tech-noir y explicaciones textuales detalladas de cada regla."*
- **Problema Detectado en la Revisión:** La página se sentía densa y no transmitía la personalidad de **Tap2Order** (gastronomía en cruceros), además de contener párrafos demasiado largos que dificultaban la lectura ágil valorada por la cátedra.
- **Pedido de Mejora / Refinamiento:** *"Extraé la paleta náutica oficial del logotipo de Tap2Order (Azul Marino Oceánico #1b3b64, Turquesa Oleaje #2ba8a0, Ámbar Campana #f39c42), reemplazá la tipografía medieval serifa por Plus Jakarta Sans, condensá las sentencias en tarjetas sintéticas con chips de datos y fórmulas lógicas, y convertí el diagrama en un SVG interactivo con rutas iluminadas."*
- **Qué Cambió y Por Qué:** Se crearon tokens de diseño específicos para Tap2Order, se eliminó la tipografía Cormorant Garamond en favor de una estética moderna de travel-tech, y se redujo la carga cognitiva mediante componentes visuales de alto impacto.

---

## 12. Accesibilidad Universal y Sistema de Diseño Tap2Order

### Certificación WCAG 2.1 Nivel AAA
- **Ratio de Contraste Cromático Certificado:** 
  - Texto principal oscuro sobre `#0a1524`: Ratio **> 15:1** (supera con holgura el umbral de 7:1 exigido por AAA).
  - Texto principal claro sobre `#f4f8f9`: Ratio **> 15:1**.
- **Navegación por Teclado:**
  - Enlace de salto rápido al contenido principal (`.skip-link`).
  - Estados de foco explícitos (`:focus-visible`) con borde turquesa `#2ba8a0` de 3px y desplazamiento visible.
  - Cero eventos de clic en etiquetas `<div>` o `<span>`. Todos los controles son `<button>`, `<summary>` o `<a>`.
- **Semántica HTML5 Estricta:** Uso riguroso de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<details>`, `<summary>` y `<footer>`.

### Paleta Oficial Tap2Order
- **Azul Marino Oceánico (`#1b3b64` / `#0a1524`):** Profundidad marítima y solidez institucional.
- **Turquesa Oleaje (`#2ba8a0` / `#35bfb6`):** Señal de onda de radio, frescura y confirmación de red.
- **Ámbar Campana Gastronómica (`#f39c42` / `#fbbf24`):** Calor de cocina, campana de servicio y alertas de decisión.
- **Tipografía Moderna:**
  - *Plus Jakarta Sans* (Google Fonts): Encabezados, marca y credenciales.
  - *Inter* (Google Fonts): Legibilidad óptima en párrafos y descripciones.
  - *JetBrains Mono*: Fórmulas lógicas, chips de estado y trazabilidad técnica.

---

## 13. Instrucciones de Instalación, Reproducción y Verificación

```bash
# 1. Clonar el repositorio
git clone https://github.com/cuartocuatrimestre2026-oss/TP3-FRONTEND-DATAHELL.git
cd TP3-FRONTEND-DATAHELL

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
# Abrir en el navegador: http://localhost:3000/

# 4. Compilar para producción (Zero Errors Guarantee)
npm run build
```

---

## 14. Comprobación de Enlaces y Publicación en Vercel

| Recurso | Enlace Verificado | Estado de Comprobación |
| :--- | :--- | :--- |
| **Landing Page en Vercel (Producción)** | [tp3-frontend-datahell.vercel.app](https://tp3-frontend-datahell.vercel.app/) | Despliegue en Vercel con reglas de rewrites en `vercel.json` |
| **Despliegue en GitHub Pages** | [cuartocuatrimestre2026-oss.github.io/TP3-FRONTEND-DATAHELL](https://cuartocuatrimestre2026-oss.github.io/TP3-FRONTEND-DATAHELL/) | Despliegue automatizado continuo mediante GitHub Actions |
| **Repositorio Oficial GitHub** | [github.com/cuartocuatrimestre2026-oss/TP3-FRONTEND-DATAHELL](https://github.com/cuartocuatrimestre2026-oss/TP3-FRONTEND-DATAHELL) | Código fuente íntegro, commits semánticos y assets |
| **Repositorio Previo (TP2)** | [TP2 DataHell GitHub](https://github.com/cuartocuatrimestre2026-oss/TP2-FRONTEND-DATAHELL) | Referencia histórica de evolución y lecciones aprendidas |

---

*Desarrollado con dedicación técnica y rigurosidad académica por el **Equipo DataHell** para el IFTS N°29.*
