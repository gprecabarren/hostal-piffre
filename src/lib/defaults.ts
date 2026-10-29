import type { Location, Room, RoomPhoto, SiteContent } from "./types";
import { defaultPageCopy, formatCopy } from "./copy";
import { createPageSeo } from "./page-seo";
import photoSeed from "./photo-seed.json";

function seedPhotos(scope: "rooms" | "locations", id: string, fallback: RoomPhoto[] = []): RoomPhoto[] {
  const photographs = (photoSeed[scope] as Record<string, RoomPhoto[]>)[id];
  return photographs ? photographs.map((photo) => ({ ...photo })) : fallback;
}

const makeRoom = (number: number): Room => ({
  id: `habitacion-${number}`,
  slug: `habitacion-${number}`,
  name: `Habitación ${number}`,
  description:
    "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
  tag: "Tu pausa en Santiago",
  features: ["WiFi gratis", "Lavandería"],
  photos: seedPhotos("rooms", `habitacion-${number}`, [
    { url: "", alt: `Vista principal de la habitación ${number} de Hostal Piffre` },
    { url: "", alt: `Segunda vista de la habitación ${number} de Hostal Piffre` },
    { url: "", alt: `Detalle de la habitación ${number} de Hostal Piffre` },
  ]),
  bookingUrl: number === 1 ? "https://www.booking.com/hotel/cl/piffre-de-vauban.es.html" : "",
  airbnbUrl: number === 1 ? "https://www.airbnb.cl/rooms/1582706820971910479" : number === 2 ? "https://www.airbnb.cl/rooms/1642394729236543022" : "",
  published: number === 2,
  whatsappUrl: "",
  vrboUrl: "",
  locationId: "providencia",
  kind: "room",
});

const makeApartment = (number: number): Room => ({
  id: `departamento-${number}`,
  slug: `departamento-${number}`,
  name: `Departamento ${number}`,
  description: [
    "Un espacio con dormitorio, estar y cocina para instalarte en Santiago Centro. Consulta fechas y condiciones directamente con tu anfitrión.",
    "Un departamento con dormitorio, estar y balcón para hacer una pausa entre tus recorridos por Santiago. Consulta disponibilidad y condiciones.",
    "Dormitorio, cocina y estar para vivir Santiago Centro a tu ritmo. Escríbenos para coordinar tu próxima estadía.",
  ][number - 1],
  tag: "Santiago Centro, a tu ritmo",
  features: ["WiFi gratis", "Lavandería", "Santiago Centro"],
  photos: seedPhotos("rooms", `departamento-${number}`, Array.from({ length: 3 }, (_, index) => ({ url: "", alt: `Vista ${index + 1} del departamento ${number} en Santiago Centro` }))),
  bookingUrl: "", airbnbUrl: `https://www.airbnb.cl/rooms/${["1803933934369494949", "1352459415299032010", "1781198657363884435"][number - 1]}`,
  ...(number === 1 ? { airbnbAlternateUrl: "https://www.airbnb.cl/rooms/1760307243286615072" } : {}),
  whatsappUrl: "", vrboUrl: "",
  locationId: "santiago-centro", kind: "apartment", published: true,
});

export const defaultLocations: Location[] = [
  {
    id: "providencia", slug: "providencia", name: "Providencia",
    eyebrow: "HABITACIONES EN PROVIDENCIA",
    title: "Providencia,", titleAccent: "a tu ritmo.",
    description: "Habitaciones en Los Capitanes 1253, Providencia, Santiago. Una ubicación para descansar y descubrir la ciudad con atención cercana.",
    address: "Los Capitanes 1253, Providencia", city: "Santiago", region: "Región Metropolitana", country: "Chile",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile",
    nearby: [
      { title: "Barrio Italia", description: "Un barrio de cafés, diseño y antigüedades para descubrir durante tu estadía." },
      { title: "Parque Inés de Suárez", description: "Un espacio verde de Providencia para pasear y disfrutar del barrio." },
      { title: "Metro Inés de Suárez", description: "Estación de la Línea 6 del Metro de Santiago." },
      { title: "Vida de barrio", description: "Cafés y comercio de barrio para complementar tu visita a Providencia." },
    ], amenities: ["Lavandería", "WiFi"], photos: seedPhotos("locations", "providencia"), published: true,
    seo: createPageSeo("Hostal en Providencia, Santiago | Alojamientos Piffre", "Conoce nuestras habitaciones en Providencia, Santiago. Alojamiento en Los Capitanes 1253 con atención cercana. Consulta disponibilidad por WhatsApp."),
  },
  {
    id: "santiago-centro", slug: "santiago-centro", name: "Santiago Centro",
    eyebrow: "DEPARTAMENTOS EN SANTIAGO CENTRO",
    title: "Santiago Centro,", titleAccent: "tu punto de partida.",
    description: "Departamentos en Avenida Vicuña Mackenna 625, Santiago Centro. Una ubicación para descubrir la ciudad y consultar directamente con tu anfitrión las condiciones de tu estadía.",
    address: "Av. Vicuña Mackenna 625", city: "Santiago", region: "Región Metropolitana", country: "Chile",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Vicu%C3%B1a+Mackenna+625+Santiago+Chile",
    nearby: [
      { title: "Parque Bustamante", description: "Un paseo urbano con áreas verdes para disfrutar de Santiago." },
      { title: "Metro Santa Isabel", description: "Estación de la Línea 5 del Metro de Santiago." },
      { title: "Barrio Italia", description: "Cafés, diseño y antigüedades para recorrer durante tu visita." },
      { title: "Centro histórico", description: "Descubre el centro histórico y los panoramas de Santiago según tus intereses." },
    ], amenities: ["Lavandería"], photos: seedPhotos("locations", "santiago-centro"), published: true,
    seo: createPageSeo("Departamentos en Santiago Centro | Alojamientos Piffre", "Descubre los departamentos de Alojamientos Piffre en Santiago Centro. Revisa nuestros espacios y consulta disponibilidad directamente por WhatsApp."),
  },
];

export const defaultContent: SiteContent = {
  site: {
    name: "Hostal Piffre",
    tagline: "Tu hogar lejos de casa",
    description: "Habitaciones en Providencia y departamentos en Santiago Centro, Chile.",
  },
  hero: {
    eyebrow: "PROVIDENCIA · SANTIAGO CENTRO",
    title: "Tu hogar,",
    titleAccent: "lejos de casa.",
    description:
      "Habitaciones en Providencia y departamentos en Santiago Centro. Dos ubicaciones, atención cercana y la calidez de sentirte en casa.",
  },
  contact: {
    whatsapp: "56954933261",
    whatsappMessage: "Hola, quisiera consultar disponibilidad en Hostal Piffre.",
    email: "alojamientospiffre@gmail.com",
    address: "Los Capitanes 1253, Providencia",
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
    instagram: "https://www.instagram.com/hostalpiffre/",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile",
  },
  seo: {
    ...createPageSeo("Alojamientos Piffre en Providencia y Santiago Centro",
      "Habitaciones de hostal en Providencia y departamentos en Santiago Centro. Conoce las dos ubicaciones de Alojamientos Piffre y consulta disponibilidad por WhatsApp.", {
        keywords: ["alojamiento en Providencia", "hostal en Providencia", "departamentos Santiago Centro", "alojamiento Santiago Centro", "Alojamientos Piffre", "Hostal Piffre"],
        ogImage: "/imagen-social/v2", ogImageAlt: "Hostal Piffre: Los Capitanes 1253, Providencia · Av. Vicuña Mackenna 625, Santiago Centro",
      }),
    siteUrl: "https://alojamientospiffre.cl",
    robotsIndex: true,
    googleSiteVerification: "Ya29cIRkxvPSmxNZ2ZOyXpgVFEqfyL6K-qN05uiAON0",
    gtmId: "GTM-5LW4VNRP",
  },
  legalSeo: {
    privacy: createPageSeo("Política de privacidad | Hostal Piffre", formatCopy(defaultPageCopy.privacyDescription, { sitio: "Hostal Piffre", ciudad: "Santiago" })),
    terms: createPageSeo("Términos y condiciones | Hostal Piffre", formatCopy(defaultPageCopy.termsDescription, { sitio: "Hostal Piffre", ciudad: "Santiago" })),
  },
  copy: { ...defaultPageCopy },
  rooms: [makeRoom(1), makeRoom(2), makeRoom(3), makeApartment(1), makeApartment(2), makeApartment(3)],
  locations: structuredClone(defaultLocations),
  visitorCountries: [
    { code: "AR", name: "Argentina" }, { code: "BR", name: "Brasil" },
    { code: "US", name: "Estados Unidos" }, { code: "BO", name: "Bolivia" },
    { code: "PE", name: "Perú" }, { code: "CO", name: "Colombia" },
    { code: "MX", name: "México" }, { code: "DE", name: "Alemania" },
    { code: "FR", name: "Francia" }, { code: "GB", name: "Reino Unido" },
    { code: "ES", name: "España" }, { code: "RU", name: "Rusia" },
  ],
  paymentMethods: [
    { id: "webpay", label: "Webpay", enabled: true },
    { id: "visa", label: "Visa", enabled: true },
    { id: "mastercard", label: "Mastercard", enabled: true },
    { id: "mercadopago", label: "Mercado Pago", enabled: true },
  ],
  about: {
    title: "Más que una estadía, una bienvenida.",
    text:
      "En Hostal Piffre nos gusta lo simple: recibirte bien, ayudarte con lo que necesitas y ofrecerte un lugar donde descansar. Te recibimos en nuestras habitaciones de Providencia y departamentos de Santiago Centro, con la misma atención cercana.",
  },
  amenities: [
    { title: "Dos ubicaciones", description: "Habitaciones en Providencia y departamentos en Santiago Centro." },
    { title: "Atención cercana", description: "Conversa directamente con tu anfitrión." },
    { title: "Lavandería", description: "Disponible en ambas ubicaciones. Consulta las condiciones de uso." },
    { title: "Santiago a tu ritmo", description: "Descubre los parques, cafés y barrios cercanos a cada ubicación." },
  ],
  location: {
    title: "Providencia, a tu ritmo.",
    description:
      "Nos encuentras en Los Capitanes 1253, Providencia, Santiago. Un barrio con restaurantes, comercio de cercanía y acceso al transporte público para descubrir la ciudad.",
    highlights: ["Restaurantes y cafeterías", "Comercio de barrio", "Transporte público", "Cerca de Barrio Italia"],
  },
  faq: [
    { question: "¿Cómo puedo reservar una habitación o departamento?", answer: "Escríbenos por WhatsApp con tus fechas y la cantidad de huéspedes. También puedes consultar los enlaces de Booking, Airbnb o Vrbo cuando estén habilitados en la ficha del alojamiento." },
    { question: "¿Dónde están los alojamientos?", answer: "El hostal está en Los Capitanes 1253, Providencia. Los departamentos están en Av. Vicuña Mackenna 625, Santiago Centro. Ambos se encuentran en Santiago de Chile." },
    { question: "¿Hay lavandería?", answer: "Sí, hay lavandería en ambas ubicaciones. Consulta con tu anfitrión los horarios, costos y condiciones de uso." },
    { question: "¿Cuáles son los horarios de llegada y salida?", answer: "La llegada se coordina desde las 15:00 y la salida entre las 11:00 y las 12:00. Confirma el horario con tu anfitrión antes de viajar." },
    { question: "¿Puedo consultar por una estadía más larga?", answer: "Sí. Cuéntanos tus fechas por WhatsApp y te informaremos disponibilidad y condiciones para tu estadía." },
  ],
  policies: {
    privacyTitle: "Política de privacidad",
    privacy: `Esta política explica cómo Hostal Piffre trata los datos que nos proporcionas al consultar por una estadía.\n\nResponsable y contacto\nHostal Piffre, Los Capitanes 1253, Providencia, Santiago de Chile. Puedes contactarnos en alojamientospiffre@gmail.com.\n\nDatos y finalidad\nAl escribirnos por WhatsApp o correo podemos recibir tu nombre, datos de contacto, fechas y detalles necesarios para responder tu consulta y gestionar tu estadía. No solicites ni envíes datos sensibles a través del sitio.\n\nProveedores\nEl sitio utiliza Vercel para su alojamiento y Supabase para almacenar su contenido y fotografías. Al abrir WhatsApp, Instagram, Booking.com o Airbnb se aplican las políticas de cada plataforma.\n\nCookies\nEl área de administración utiliza cookies de sesión necesarias para la autenticación. La zona pública del sitio puede utilizar Google Tag Manager y Google Analytics 4 para medir visitas e interacciones con los botones de contacto y reserva, únicamente si aceptas la analítica en el aviso de privacidad. Antes de aceptar, estas herramientas no se cargan. Puedes rechazar o retirar tu elección en «Preferencias de privacidad». No activamos publicidad personalizada y no enviamos el contenido de tus consultas, tu nombre, correo ni mensajes a las herramientas de analítica. La elección se conserva durante un máximo de 180 días. Google puede tratar datos técnicos de navegación y cookies de analítica conforme a sus políticas y las opciones que hayas elegido.\n\nConservación y derechos\nConservamos los datos de las consultas durante el tiempo necesario para atenderlas y cumplir las obligaciones aplicables. Puedes solicitar información, corrección o eliminación de tus datos al correo de contacto.\n\nActualizaciones\nPodemos actualizar esta política para reflejar cambios en el servicio. La fecha de actualización aparece en esta página.`,
    termsTitle: "Términos y condiciones",
    terms: `Estos términos regulan el uso del sitio de Hostal Piffre y las consultas de alojamiento realizadas por sus canales de contacto.\n\nInformación y reservas\nEl sitio es informativo. Una consulta por WhatsApp o correo no confirma una reserva. Disponibilidad, tarifa, ocupación, medios de pago y condiciones deben ser confirmados expresamente por el anfitrión antes de realizar cualquier pago.\n\nPlataformas externas\nLas reservas realizadas en Booking.com o Airbnb se rigen por la información y condiciones informadas en la plataforma elegida. Los enlaces se facilitan para tu comodidad.\n\nLlegada y salida\nLa llegada se coordina desde las 15:00 y la salida entre las 11:00 y las 12:00. Cualquier excepción debe acordarse previamente con el anfitrión.\n\nCancelaciones y cambios\nLas condiciones de cancelación, devolución, anticipos y cambios se informan antes de confirmar cada reserva. Consulta las condiciones de tu tarifa y conserva la confirmación.\n\nConvivencia\nCuida los espacios, respeta el descanso de otras personas y sigue las indicaciones del anfitrión. No se permiten fiestas ni eventos. La admisión de mascotas y cualquier necesidad especial deben consultarse y confirmarse previamente.\n\nContenido del sitio\nLas fotografías y descripciones corresponden a la información publicada por la administración. Consulta los servicios y características de la habitación elegida antes de reservar.\n\nConsultas\nPara dudas sobre estos términos, contáctanos en alojamientospiffre@gmail.com o por WhatsApp al +56 9 5493 3261.`,
    updatedAt: "2026-10-22",
  },
};
