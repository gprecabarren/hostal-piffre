function field<const K extends string>(key: K, label: string, defaultValue: string, multiline = false) {
  return { key, label, defaultValue, multiline };
}

/** Public text only. These values are rendered as text, never interpreted as HTML. */
export const pageCopyGroups = [
  { id: "brand", label: "Marca y navegación", description: "Nombre visual de la marca, menú y enlaces principales.", fields: [
    field("brandPrefix", "Texto pequeño de la marca", "HOSTAL"),
    field("brandName", "Nombre visual de la marca", "Piffre"),
    field("navRooms", "Menú: habitaciones", "Habitaciones"),
    field("navExperience", "Menú: experiencia", "La experiencia"),
    field("navLocation", "Menú: ubicación", "Ubicación"),
    field("navFaq", "Menú: preguntas", "Preguntas frecuentes"),
    field("navContact", "Botón de contacto del menú", "Hablemos"),
    field("navWhatsapp", "WhatsApp del menú móvil", "Escríbenos por WhatsApp"),
  ] },
  { id: "hero", label: "Bienvenida y portada", description: "Los títulos y descripción principales se editan en Inicio; aquí están los detalles de la portada.", fields: [
    field("heroCoordinates", "Coordenadas decorativas", "33°26′ S · 70°36′ O"),
    field("heroPrimaryCta", "Botón principal", "Encuentra tu habitación"),
    field("heroSecondaryCta", "Segundo botón", "Conversemos"),
    field("heroMetaLine", "Frase breve bajo los botones", "Un lugar sencillo."),
    field("heroMetaStrong", "Segunda línea destacada", "Una bienvenida de verdad."),
    field("heroArtKicker", "Texto sobre la ilustración", "BIENVENIDO A PROVIDENCIA"),
    field("heroArtCaption", "Pie de la ilustración", "Una casa. Muchas historias."),
    field("heroStamp", "Texto del sello circular", "TU HOGAR LEJOS DE CASA · PIFFRE · "),
    field("heroArtNote", "Nota de la ilustración", "Una ilustración para recibirte.\nLas fotografías reales llegarán pronto.", true),
    field("heroScroll", "Invitación a seguir recorriendo", "Haz espacio para una pausa"),
  ] },
  { id: "banner", label: "Franja en movimiento", description: "Las cuatro frases de la franja animada.", fields: [
    field("bannerOne", "Primera frase", "Descansa."),
    field("bannerTwo", "Segunda frase", "Explora."),
    field("bannerThree", "Tercera frase", "Siéntete en casa."),
    field("bannerFour", "Cuarta frase", "Esto es Piffre."),
  ] },
  { id: "rooms", label: "Propiedades y reservas", description: "Usa {habitaciones} para mostrar el número de propiedades publicadas; {habitacion} para el nombre de una propiedad y {sitio} para el nombre del alojamiento.", fields: [
    field("roomsLabel", "Etiqueta de sección", "01 / TU PRÓXIMA ESTADÍA"),
    field("roomsNote", "Nota de sección", "{habitaciones} HABITACIONES, UNA BIENVENIDA"),
    field("roomsTitle", "Título", "Un lugar para", true),
    field("roomsTitleAccent", "Título destacado", "bajar el ritmo.", true),
    field("roomsIntro", "Introducción", "{habitaciones} espacios con el espíritu de Piffre. Elige el tuyo y conversemos sobre tus fechas.", true),
    field("roomsHelpText", "Ayuda para elegir", "¿No sabes cuál elegir? Cuéntanos cómo será tu viaje y te ayudamos a encontrar tu espacio.", true),
    field("roomsHelpLink", "Enlace de ayuda", "Te ayudamos por WhatsApp"),
    field("roomAvailabilityCta", "Botón de disponibilidad", "Consultar disponibilidad"),
    field("roomBookingLabel", "Botón de Booking", "Booking.com"),
    field("roomAirbnbLabel", "Botón de Airbnb", "Airbnb"),
    field("roomWhatsappMessage", "Mensaje de WhatsApp por propiedad", "Hola, me gustaría consultar disponibilidad para {habitacion} en {sitio}.", true),
    field("roomPlaceholder", "Texto cuando falta una foto", "Fotografías próximamente"),
    field("roomsEmpty", "Texto si todas las propiedades están en borrador", "Estamos preparando nuestros espacios. Escríbenos para consultar disponibilidad.", true),
  ] },
  { id: "experience", label: "La experiencia", description: "Las descripciones y los servicios se editan en la sección de experiencia del panel.", fields: [
    field("experienceLabel", "Etiqueta de sección", "02 / LA EXPERIENCIA PIFFRE"),
    field("experienceNote", "Nota de sección", "LO SIMPLE, BIEN HECHO"),
  ] },
  { id: "location", label: "Ubicación y mapa", description: "Textos del barrio, mapa ilustrativo e indicaciones.", fields: [
    field("locationLabel", "Etiqueta de sección", "03 / EL BARRIO TAMBIÉN ES PARTE"),
    field("locationNote", "Nota de sección", "PROVIDENCIA, SANTIAGO DE CHILE"),
    field("locationEyebrow", "Texto sobre el título", "TU PUNTO DE PARTIDA"),
    field("locationDirections", "Botón para llegar", "Cómo llegar"),
    field("locationTagline", "Frase bajo el mapa", "Un barrio para caminar.\nUna casa para volver.", true),
    field("mapOpen", "Abrir mapa", "Abrir en Google Maps"),
    field("mapCaption", "Pie del mapa", "Mapa ilustrativo del barrio"),
    field("mapDistrict", "Mapa: comuna", "PROVIDENCIA"),
    field("mapStreet", "Mapa: calle", "LOS CAPITANES"),
    field("mapNeighborhood", "Mapa: barrio", "BARRIO ITALIA"),
    field("mapAvenue", "Mapa: avenida", "AV. PEDRO DE VALDIVIA"),
    field("mapPin", "Mapa: ubicación del alojamiento", "ESTÁS EN PIFFRE"),
  ] },
  { id: "faq", label: "Preguntas frecuentes", description: "Presentación de las preguntas; cada pregunta y respuesta se edita en su propia sección.", fields: [
    field("faqLabel", "Etiqueta de sección", "04 / ANTES DE HACER LAS MALETAS"),
    field("faqNote", "Nota de sección", "HABLEMOS CON CONFIANZA"),
    field("faqTitle", "Título", "Las pequeñas", true),
    field("faqTitleAccent", "Título destacado", "grandes dudas.", true),
    field("faqIntro", "Introducción", "Lo que necesitas saber antes de llegar. Si te queda alguna pregunta, estamos al otro lado del WhatsApp.", true),
    field("faqCta", "Botón de consulta", "Pregúntanos directamente"),
  ] },
  { id: "contact", label: "Invitación de contacto", description: "La sección que invita a comenzar una conversación.", fields: [
    field("contactEyebrow", "Texto sobre el título", "TU PRÓXIMA HISTORIA EMPIEZA AQUÍ"),
    field("contactTitle", "Título", "Santiago te espera.", true),
    field("contactTitleAccent", "Título destacado", "Nosotros también.", true),
    field("contactDescription", "Descripción", "Cuéntanos tus fechas.\nLa bienvenida la ponemos nosotros.", true),
    field("contactCta", "Botón de WhatsApp", "Hablemos por WhatsApp"),
  ] },
  { id: "footer", label: "Pie de página y botón flotante", description: "En el copyright puedes usar {anio} y {sitio}.", fields: [
    field("footerDiscover", "Título de navegación", "DESCUBRE PIFFRE"),
    field("footerRooms", "Enlace a habitaciones", "Nuestras habitaciones"),
    field("footerExperience", "Enlace a experiencia", "La experiencia"),
    field("footerLocation", "Enlace al barrio", "El barrio"),
    field("footerContact", "Título de contacto", "ESTEMOS EN CONTACTO"),
    field("footerWhatsapp", "Enlace de WhatsApp", "WhatsApp"),
    field("footerInstagram", "Enlace de Instagram", "Instagram"),
    field("footerCopyright", "Copyright", "© {anio} {sitio}. Hecho para recibirte."),
    field("footerPrivacy", "Enlace de privacidad", "Privacidad"),
    field("footerTerms", "Enlace de términos", "Términos y condiciones"),
    field("footerAdmin", "Enlace al panel", "Administración"),
    field("footerCountry", "País del pie de página", "CHILE"),
    field("floatingWhatsapp", "Botón flotante", "¿Hablamos?"),
  ] },
  { id: "accessibility", label: "Accesibilidad", description: "Textos para lectores de pantalla. Variables disponibles: {sitio}, {habitacion}, {foto} y {total}.", fields: [
    field("skipLink", "Saltar al contenido", "Ir al contenido principal"),
    field("brandAria", "Descripción del enlace de marca", "{sitio}, inicio"),
    field("navAria", "Navegación principal", "Navegación principal"),
    field("mobileNavAria", "Navegación móvil", "Navegación móvil"),
    field("openMenu", "Abrir menú", "Abrir menú"),
    field("closeMenu", "Cerrar menú", "Cerrar menú"),
    field("galleryAria", "Descripción de la galería", "Fotografías de {habitacion}"),
    field("carouselAria", "Tipo de galería", "carrusel"),
    field("photoAlt", "Descripción alternativa de fotografía", "{habitacion}, fotografía {foto}"),
    field("photoCount", "Posición de fotografía", "Imagen {foto} de {total}"),
    field("photoPrevious", "Fotografía anterior", "Fotografía anterior de {habitacion}"),
    field("photoNext", "Fotografía siguiente", "Fotografía siguiente de {habitacion}"),
    field("photoSelect", "Seleccionar fotografía", "Seleccionar fotografía de {habitacion}"),
    field("photoView", "Ver fotografía", "Ver fotografía {foto}"),
    field("bannerAria", "Descripción de la franja", "Descansa, explora y siéntete en casa"),
    field("mapAria", "Descripción del mapa", "Ver {sitio} en Google Maps"),
    field("legalNavAria", "Navegación legal", "Información legal"),
    field("whatsappAria", "Descripción del botón flotante", "Hablar con {sitio} por WhatsApp"),
  ] },
  { id: "legal", label: "Páginas legales", description: "Textos auxiliares; el contenido completo se edita en Políticas.", fields: [
    field("legalBack", "Volver al sitio", "Volver a Hostal Piffre"),
    field("legalUpdated", "Etiqueta de actualización", "Última actualización"),
    field("privacyDescription", "Descripción SEO de privacidad", "Política de privacidad de {sitio}. Información sobre datos de contacto y consultas de alojamiento.", true),
    field("termsDescription", "Descripción SEO de términos", "Condiciones de uso y consultas de reservas de {sitio}, alojamiento en Providencia.", true),
  ] },
  { id: "consent", label: "Preferencias de analítica", description: "Aviso y controles para la elección de cookies y herramientas de analítica.", fields: [
    field("consentTitle", "Título del aviso", "Tu privacidad, a tu manera."),
    field("consentMessage", "Mensaje del aviso", "Con tu permiso, usamos herramientas de analítica para entender cómo se visita el sitio y mejorarlo. Puedes aceptar, rechazar o cambiar tu elección cuando quieras.", true),
    field("consentAccept", "Botón de aceptar", "Aceptar analítica"),
    field("consentReject", "Botón de rechazar", "Rechazar"),
    field("consentPreferences", "Enlace de preferencias", "Preferencias de privacidad"),
  ] },
] as const;

export type PageCopyKey = (typeof pageCopyGroups)[number]["fields"][number]["key"];
export type PageCopy = Record<PageCopyKey, string>;
export interface CopyFieldDefinition { key: PageCopyKey; label: string; defaultValue: string; multiline: boolean }
export const pageCopyFields: readonly CopyFieldDefinition[] = pageCopyGroups.flatMap((group) => group.fields as readonly CopyFieldDefinition[]);
export const defaultPageCopy: PageCopy = Object.fromEntries(pageCopyFields.map((item) => [item.key, item.defaultValue])) as PageCopy;

/** Replaces known variables with plain text. Unknown variables are kept for the editor. */
export function formatCopy(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{([a-zA-Z]+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : placeholder);
}
