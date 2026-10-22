import type { Room, SiteContent } from "./types";
import { defaultPageCopy } from "./copy";

const makeRoom = (number: number): Room => ({
  id: `habitacion-${number}`,
  slug: `habitacion-${number}`,
  name: `Habitación ${number}`,
  description:
    "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
  tag: "Tu pausa en Santiago",
  features: ["WiFi gratis", "Consulta disponibilidad"],
  photos: [
    { url: "", alt: `Vista principal de la habitación ${number} de Hostal Piffre` },
    { url: "", alt: `Segunda vista de la habitación ${number} de Hostal Piffre` },
    { url: "", alt: `Detalle de la habitación ${number} de Hostal Piffre` },
  ],
  bookingUrl: number === 1 ? "https://www.booking.com/hotel/cl/piffre-de-vauban.es.html" : "",
  airbnbUrl: "",
  published: true,
  whatsappUrl: "",
});

export const defaultContent: SiteContent = {
  site: {
    name: "Hostal Piffre",
    tagline: "Tu hogar lejos de casa",
    description: "Alojamiento acogedor en Providencia, Santiago de Chile.",
  },
  hero: {
    eyebrow: "ALOJAMIENTO EN PROVIDENCIA · SANTIAGO",
    title: "Tu hogar,",
    titleAccent: "lejos de casa.",
    description:
      "Espacios para descansar, un barrio por descubrir y la calidez de sentirte en casa. Bienvenido a Hostal Piffre.",
  },
  contact: {
    whatsapp: "56954933261",
    whatsappMessage: "Hola, quisiera consultar disponibilidad en Hostal Piffre.",
    email: "alojamientospiffre@gmail.com",
    address: "Los Capitanes 1253, Providencia",
    city: "Santiago",
    region: "Región Metropolitana",
    country: "Chile",
    instagram: "",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile",
  },
  seo: {
    title: "Hostal Piffre | Alojamiento en Providencia, Santiago",
    description:
      "Conoce Hostal Piffre, un alojamiento acogedor en Providencia, Santiago. Habitaciones, WiFi y atención cercana. Consulta disponibilidad por WhatsApp.",
    keywords: ["alojamiento en Providencia", "hostal en Providencia", "alojamiento Santiago", "Hostal Piffre"],
    siteUrl: "https://alojamientospiffre.cl",
    ogImage: "/og-image.png",
    robotsIndex: true,
    googleSiteVerification: "Ya29cIRkxvPSmxNZ2ZOyXpgVFEqfyL6K-qN05uiAON0",
    gtmId: "GTM-5LW4VNRP",
  },
  copy: { ...defaultPageCopy },
  rooms: [makeRoom(1), makeRoom(2), makeRoom(3)],
  about: {
    title: "Más que una estadía, una bienvenida.",
    text:
      "En Hostal Piffre nos gusta lo simple: recibirte bien, ayudarte con lo que necesitas y ofrecerte un lugar donde descansar. Somos un alojamiento en Providencia, con atención cercana y un barrio lleno de vida a tu alrededor.",
  },
  amenities: [
    { title: "WiFi gratis", description: "Mantente conectado durante tu estadía." },
    { title: "Atención cercana", description: "Conversa directamente con tu anfitrión." },
    { title: "Terraza", description: "Un espacio para disfrutar una pausa." },
    { title: "Barrio conectado", description: "Restaurantes, comercio y transporte en Providencia." },
  ],
  location: {
    title: "Providencia, a tu ritmo.",
    description:
      "Nos encuentras en Los Capitanes 1253, Providencia, Santiago. Un barrio con restaurantes, comercio de cercanía y acceso al transporte público para descubrir la ciudad.",
    highlights: ["Restaurantes y cafeterías", "Comercio de barrio", "Transporte público", "Cerca de Barrio Italia"],
  },
  faq: [
    { question: "¿Cómo puedo reservar una habitación?", answer: "Escríbenos por WhatsApp con tus fechas y la cantidad de huéspedes. También puedes consultar los enlaces a las plataformas de reserva disponibles en cada habitación." },
    { question: "¿Dónde está Hostal Piffre?", answer: "Estamos en Los Capitanes 1253, Providencia, Santiago de Chile." },
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
