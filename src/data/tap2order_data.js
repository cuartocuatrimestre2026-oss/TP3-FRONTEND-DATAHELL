export const startupInfo = {
  nombre: "Tap2Order",
  rubro: "Gastronomía & Turismo en Cruceros",
  subtitulo: "Pedidos a bordo con entrega en camarote o atención en comedor",
  logo: "/img/tap2order-logo.png",
  bloque: "Bloque S14-C · Aviso y modificaciones",
  grupoAsignado: "Grupo 09 · IFTS N°29",
  origenLogica: "Lógica formal por estudiantes del IFTS N°16",
  equipoSolucionador: "Equipo DataHell",
  fechaEntrega: "26/11/2026",
  resumenProblema: "En un crucero de lujo, conectar las cocinas centrales con miles de camarotes en alta mar requiere sincronía absoluta: los avisos de comanda deben ser certeros y cualquier cambio debe frenar la producción a tiempo para evitar desperdicio y platos fríos.",
  descripcionProblema: "En un crucero de lujo internacional, sincronizar las cocinas centrales de alta gama con más de 2.000 camarotes y salones en alta mar presenta un desafío crítico de latencia y coordinación humana. Tap2Order implementa un agente autónomo de orquestación que evalúa condiciones lógicas en tiempo real, congela avisos de forma preventiva ante cambios de último momento y asegura que ninguna alerta se emita sin acuse de recibo confirmado por el servicio a bordo.",
};

export const sentenciasData = [
  {
    id: "r5",
    codigo: "R5",
    titulo: "Aviso de Pedido Listo y Confirmación",
    etiqueta: "Despacho & Idempotencia",
    sentenciaOriginal: "Si la versión vigente del pedido está lista, no hay una modificación pendiente y el aviso no fue enviado ni está en curso, el sistema solicita notificar al pasajero y solo registra el aviso como enviado después de la confirmación exitosa del servicio.",
    beneficioClave: "Cero notificaciones duplicadas o falsas en alta mar: el huésped solo recibe la alerta cuando el plato está servido y el canal de mensajería confirma la entrega.",
    
    tagsEntrada: [
      { label: "Versión vigente", val: "LISTA" },
      { label: "Modificaciones", val: "NINGUNA (0)" },
      { label: "Aviso previo", val: "NO ENVIADO / NO EN CURSO" }
    ],

    formulaLogica: "(Versión Lista) ∧ (Sin Modificación) ∧ (Aviso No Enviado) ∧ (Aviso No En Curso)",
    
    queVieneDeLaSentencia: "Notificar al pasajero únicamente cuando el pedido está listo y sin cambios, registrando 'enviado' solo tras el acuse de recibo del servicio.",
    queAgregaLaPropuesta: "Candado 'EN_CURSO' para evitar rebotes de red en altamar, 2 reintentos automáticos y derivación al Cabin Host si hay timeout satelital.",

    herramientas: ["CruiseMessagingGateway", "OrderVersionDB", "PassengerLocationBeacon"],
    intervencionHumana: "Cabin Host (Asistente de Cubierta) acude al camarote si falla la red marítima tras 2 intentos.",
    casoLimite: "Timeout satelital (>15s) en altamar ➔ El agente NO asume enviado y deriva aviso presencial."
  },

  {
    id: "r6",
    codigo: "R6",
    titulo: "Modificaciones en Caliente con Consenso Dual",
    etiqueta: "Gestión de Cambios & Cocina",
    sentenciaOriginal: "Si el pasajero solicita modificar un pedido ya enviado, el sistema registra el cambio como pendiente y consulta a cocina. Conserva la versión original y pausa los nuevos avisos de listo mientras falta la aprobación de cocina o la confirmación del pasajero; cuando ambas constan, crea la nueva versión y exige una nueva confirmación de cocina antes de marcarla como lista.",
    beneficioClave: "Permite cambiar platos sobre la marcha sin desperdiciar comida ni generar errores de cocina: frena avisos de inmediato y exige acuerdo mutuo antes de producir la nueva versión.",

    tagsEntrada: [
      { label: "Disparador", val: "Pasajero pide cambio" },
      { label: "Estado comanda", val: "ENVIADA A COCINA" },
      { label: "Aprobación", val: "Cocina + Pasajero" }
    ],

    formulaLogica: "Modificación ➔ Pausa Avisos + Conserva Vn ➔ ¿(Cocina Aprueba) ∧ (Pasajero Confirma)?",

    queVieneDeLaSentencia: "Pausar avisos, registrar cambio pendiente, conservar original, consultar a cocina y crear nueva versión solo cuando ambos confirman.",
    queAgregaLaPropuesta: "Historial inmutable de versiones para auditoría de facturación y señal sonora de 'HOLD' en la tablet del mozo si el plato ya estaba en bandeja express.",

    herramientas: ["KitchenDisplaySystem (KDS)", "PassengerDialogApp", "VersionHistoryStore"],
    intervencionHumana: "Sous Chef (Jefe de Cocina) interviene si la cocina no responde en 3 minutos o el plato está saliendo.",
    casoLimite: "Pasajero pide cambio justo cuando el plato sale de cocina ➔ Alarma HOLD y decisión express del Sous Chef."
  }
];

export const mockPlatosCrucero = [
  { id: "p1", nombre: "Salmón Grillé con Vegetales al Vapor", sector: "Camarote 412 (Cubierta 8)", tiempo: "25 min" },
  { id: "p2", nombre: "Risotto de Hongos Silvestres & Trufa", sector: "Salón Comedor Principal (Mesa 14)", tiempo: "30 min" },
  { id: "p3", nombre: "Hamburguesa Wagyu Premium con Papas Rústicas", sector: "Piscina / Solarium (Tumbona 27)", tiempo: "15 min" }
];
