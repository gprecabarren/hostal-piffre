-- Hostal Piffre: execute the complete file in the project's SQL Editor.
-- Idempotent: an existing site's content is preserved by ON CONFLICT DO NOTHING.
-- Application authentication is Vercel OIDC. Supabase Auth is not used.
begin;

create table if not exists public.site_content (
  id text primary key default 'main' check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_object check (jsonb_typeof(content) = 'object'),
  constraint site_content_room_count check (
    case when jsonb_typeof(content->'rooms') = 'array' then jsonb_array_length(content->'rooms') between 1 and 30 else false end
  )
);

-- Upgrade existing installations while preserving the JSON and its photo links.
alter table public.site_content drop constraint if exists site_content_three_rooms;
alter table public.site_content drop constraint if exists site_content_room_count;
alter table public.site_content add constraint site_content_room_count check (
  case when jsonb_typeof(content->'rooms') = 'array' then jsonb_array_length(content->'rooms') between 1 and 30 else false end
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from public, anon, authenticated;
grant select on table public.site_content to anon, authenticated;
grant select, insert, update on table public.site_content to service_role;

drop policy if exists "Published site content is public" on public.site_content;
create policy "Published site content is public"
  on public.site_content for select to anon, authenticated using (id = 'main');

-- Restrictive policies also protect this table if permissive policies are added later.
drop policy if exists "No public content inserts" on public.site_content;
create policy "No public content inserts"
  on public.site_content as restrictive for insert to anon, authenticated with check (false);
drop policy if exists "No public content updates" on public.site_content;
create policy "No public content updates"
  on public.site_content as restrictive for update to anon, authenticated using (false) with check (false);
drop policy if exists "No public content deletes" on public.site_content;
create policy "No public content deletes"
  on public.site_content as restrictive for delete to anon, authenticated using (false);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('room-images', 'room-images', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public bucket serves photographs directly. No public listing/write policy is needed.
-- These restrictive policies leave other buckets' policies untouched.
drop policy if exists "Room images server inserts only" on storage.objects;
create policy "Room images server inserts only"
  on storage.objects as restrictive for insert to anon, authenticated
  with check (bucket_id <> 'room-images');
drop policy if exists "Room images server updates only" on storage.objects;
create policy "Room images server updates only"
  on storage.objects as restrictive for update to anon, authenticated
  using (bucket_id <> 'room-images') with check (bucket_id <> 'room-images');
drop policy if exists "Room images server deletes only" on storage.objects;
create policy "Room images server deletes only"
  on storage.objects as restrictive for delete to anon, authenticated
  using (bucket_id <> 'room-images');

-- Complete initial content, mirrored from src/lib/defaults.ts.
insert into public.site_content (id, content)
values ('main', $piffre_seed${
  "site": {
    "name": "Hostal Piffre",
    "tagline": "Tu hogar lejos de casa",
    "description": "Habitaciones en Providencia y departamentos en Santiago Centro, Chile."
  },
  "hero": {
    "eyebrow": "PROVIDENCIA · SANTIAGO CENTRO",
    "title": "Tu hogar,",
    "titleAccent": "lejos de casa.",
    "description": "Habitaciones en Providencia y departamentos en Santiago Centro. Dos ubicaciones, atención cercana y la calidez de sentirte en casa."
  },
  "contact": {
    "whatsapp": "56954933261",
    "whatsappMessage": "Hola, quisiera consultar disponibilidad en Hostal Piffre.",
    "email": "alojamientospiffre@gmail.com",
    "address": "Los Capitanes 1253, Providencia",
    "city": "Santiago",
    "region": "Región Metropolitana",
    "country": "Chile",
    "instagram": "https://www.instagram.com/hostalpiffre/",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile"
  },
  "seo": {
    "title": "Alojamientos Piffre en Providencia y Santiago Centro",
    "description": "Habitaciones de hostal en Providencia y departamentos en Santiago Centro. Conoce las dos ubicaciones de Alojamientos Piffre y consulta disponibilidad por WhatsApp.",
    "keywords": [
      "alojamiento en Providencia",
      "hostal en Providencia",
      "departamentos Santiago Centro",
      "alojamiento Santiago Centro",
      "Alojamientos Piffre",
      "Hostal Piffre"
    ],
    "canonicalUrl": "",
    "ogTitle": "",
    "ogDescription": "",
    "ogImage": "/og-image.png",
    "ogImageAlt": "Hostal Piffre, tu hogar lejos de casa",
    "twitterTitle": "",
    "twitterDescription": "",
    "twitterImage": "",
    "twitterCard": "summary_large_image",
    "index": true,
    "follow": true,
    "siteUrl": "https://alojamientospiffre.cl",
    "robotsIndex": true,
    "googleSiteVerification": "Ya29cIRkxvPSmxNZ2ZOyXpgVFEqfyL6K-qN05uiAON0",
    "gtmId": "GTM-5LW4VNRP"
  },
  "legalSeo": {
    "privacy": {
      "title": "Política de privacidad | Hostal Piffre",
      "description": "Política de privacidad de Hostal Piffre. Información sobre datos de contacto y consultas de alojamiento.",
      "keywords": [],
      "canonicalUrl": "",
      "ogTitle": "",
      "ogDescription": "",
      "ogImage": "",
      "ogImageAlt": "",
      "twitterTitle": "",
      "twitterDescription": "",
      "twitterImage": "",
      "twitterCard": "summary_large_image",
      "index": true,
      "follow": true
    },
    "terms": {
      "title": "Términos y condiciones | Hostal Piffre",
      "description": "Condiciones de uso y consultas de reservas de Hostal Piffre en Providencia y Santiago Centro.",
      "keywords": [],
      "canonicalUrl": "",
      "ogTitle": "",
      "ogDescription": "",
      "ogImage": "",
      "ogImageAlt": "",
      "twitterTitle": "",
      "twitterDescription": "",
      "twitterImage": "",
      "twitterCard": "summary_large_image",
      "index": true,
      "follow": true
    }
  },
  "copy": {
    "brandPrefix": "HOSTAL",
    "brandName": "Piffre",
    "navRooms": "Alojamientos",
    "navExperience": "La experiencia",
    "navLocation": "Ubicación",
    "navFaq": "Preguntas frecuentes",
    "navContact": "Hablemos",
    "navWhatsapp": "Escríbenos por WhatsApp",
    "heroCoordinates": "33°26′ S · 70°36′ O",
    "heroPrimaryCta": "Encuentra tu espacio",
    "heroSecondaryCta": "Conversemos",
    "heroMetaLine": "Un lugar sencillo.",
    "heroMetaStrong": "Una bienvenida de verdad.",
    "heroArtKicker": "BIENVENIDO A SANTIAGO",
    "heroArtCaption": "Dos barrios. Muchas historias.",
    "heroStamp": "TU HOGAR LEJOS DE CASA · PIFFRE · ",
    "heroArtNote": "Descubre nuestros espacios en Providencia y Santiago Centro.",
    "heroScroll": "Haz espacio para una pausa",
    "bannerOne": "Descansa.",
    "bannerTwo": "Explora.",
    "bannerThree": "Siéntete en casa.",
    "bannerFour": "Esto es Piffre.",
    "roomsLabel": "01 / TU PRÓXIMA ESTADÍA",
    "roomsNote": "{habitaciones} ESPACIOS, UNA BIENVENIDA",
    "roomsTitle": "Un lugar para",
    "roomsTitleAccent": "bajar el ritmo.",
    "roomsIntro": "{habitaciones} espacios con el espíritu de Piffre. Elige el tuyo y conversemos sobre tus fechas.",
    "roomsHelpText": "¿No sabes cuál elegir? Cuéntanos cómo será tu viaje y te ayudamos a encontrar tu espacio.",
    "roomsHelpLink": "Te ayudamos por WhatsApp",
    "roomAvailabilityCta": "Consultar disponibilidad",
    "roomBookingLabel": "Booking.com",
    "roomAirbnbLabel": "Airbnb",
    "roomWhatsappMessage": "Hola, me gustaría consultar disponibilidad para {habitacion} en {sitio}.",
    "roomPlaceholder": "Fotografías próximamente",
    "roomsEmpty": "Estamos preparando nuestros espacios. Escríbenos para consultar disponibilidad.",
    "experienceLabel": "02 / LA EXPERIENCIA PIFFRE",
    "experienceNote": "LO SIMPLE, BIEN HECHO",
    "locationLabel": "03 / EL BARRIO TAMBIÉN ES PARTE",
    "locationNote": "PROVIDENCIA · SANTIAGO CENTRO",
    "locationEyebrow": "TU PUNTO DE PARTIDA",
    "locationDirections": "Cómo llegar",
    "locationTagline": "Un barrio para caminar.\nUna casa para volver.",
    "mapOpen": "Abrir en Google Maps",
    "mapCaption": "Mapa ilustrativo del barrio",
    "mapDistrict": "PROVIDENCIA",
    "mapStreet": "LOS CAPITANES",
    "mapNeighborhood": "BARRIO ITALIA",
    "mapAvenue": "AV. PEDRO DE VALDIVIA",
    "mapPin": "ESTÁS EN PIFFRE",
    "faqLabel": "04 / ANTES DE HACER LAS MALETAS",
    "faqNote": "HABLEMOS CON CONFIANZA",
    "faqTitle": "Las pequeñas",
    "faqTitleAccent": "grandes dudas.",
    "faqIntro": "Lo que necesitas saber antes de llegar. Si te queda alguna pregunta, estamos al otro lado del WhatsApp.",
    "faqCta": "Pregúntanos directamente",
    "contactEyebrow": "TU PRÓXIMA HISTORIA EMPIEZA AQUÍ",
    "contactTitle": "Santiago te espera.",
    "contactTitleAccent": "Nosotros también.",
    "contactDescription": "Cuéntanos tus fechas.\nLa bienvenida la ponemos nosotros.",
    "contactCta": "Hablemos por WhatsApp",
    "footerDiscover": "DESCUBRE PIFFRE",
    "footerRooms": "Nuestros alojamientos",
    "footerExperience": "La experiencia",
    "footerLocation": "El barrio",
    "footerContact": "ESTEMOS EN CONTACTO",
    "footerWhatsapp": "WhatsApp",
    "footerInstagram": "Instagram",
    "footerCopyright": "© {anio} {sitio}. Hecho para recibirte.",
    "footerPrivacy": "Privacidad",
    "footerTerms": "Términos y condiciones",
    "footerAdmin": "Administración",
    "footerCountry": "CHILE",
    "floatingWhatsapp": "¿Hablamos?",
    "skipLink": "Ir al contenido principal",
    "brandAria": "{sitio}, inicio",
    "navAria": "Navegación principal",
    "mobileNavAria": "Navegación móvil",
    "openMenu": "Abrir menú",
    "closeMenu": "Cerrar menú",
    "galleryAria": "Fotografías de {habitacion}",
    "carouselAria": "carrusel",
    "photoAlt": "{habitacion}, fotografía {foto}",
    "photoCount": "Imagen {foto} de {total}",
    "photoPrevious": "Fotografía anterior de {habitacion}",
    "photoNext": "Fotografía siguiente de {habitacion}",
    "photoSelect": "Seleccionar fotografía de {habitacion}",
    "photoView": "Ver fotografía {foto}",
    "bannerAria": "Descansa, explora y siéntete en casa",
    "mapAria": "Ver {sitio} en Google Maps",
    "legalNavAria": "Información legal",
    "whatsappAria": "Hablar con {sitio} por WhatsApp",
    "legalBack": "Volver a Hostal Piffre",
    "legalUpdated": "Última actualización",
    "privacyDescription": "Política de privacidad de {sitio}. Información sobre datos de contacto y consultas de alojamiento.",
    "termsDescription": "Condiciones de uso y consultas de reservas de {sitio} en Providencia y Santiago Centro.",
    "consentTitle": "Tu privacidad, a tu manera.",
    "consentMessage": "Con tu permiso, usamos herramientas de analítica para entender cómo se visita el sitio y mejorarlo. Puedes aceptar, rechazar o cambiar tu elección cuando quieras.",
    "consentAccept": "Aceptar analítica",
    "consentReject": "Rechazar",
    "consentPreferences": "Preferencias de privacidad",
    "navLocations": "Ubicaciones",
    "locationsLabel": "DOS FORMAS DE VIVIR SANTIAGO",
    "locationsTitle": "Dos barrios.",
    "locationsTitleAccent": "La misma bienvenida.",
    "locationsIntro": "Habitaciones en Providencia y departamentos en Santiago Centro. Elige dónde comienza tu próxima estadía.",
    "locationCardCta": "Conoce esta ubicación",
    "locationBack": "Volver al inicio",
    "locationPropertiesTitle": "Encuentra tu espacio en {ubicacion}",
    "locationNearbyTitle": "El barrio, a tu alcance.",
    "locationAmenitiesTitle": "Para una estadía a tu ritmo.",
    "locationGalleryTitle": "Conoce nuestros espacios.",
    "locationContactCta": "Consulta por esta ubicación",
    "locationWhatsappMessage": "Hola, quisiera consultar disponibilidad en {ubicacion}, {sitio}.",
    "roomsGroupRooms": "Habitaciones en Providencia",
    "roomsGroupApartments": "Departamentos en Santiago Centro",
    "roomKindRoom": "Habitación",
    "roomKindApartment": "Departamento",
    "roomVrboLabel": "Vrbo",
    "roomGalleryCta": "Ver todas las fotos",
    "roomGalleryTitle": "Conoce {habitacion}",
    "galleryClose": "Cerrar galería",
    "galleryPhotoCount": "{foto} de {total}",
    "locationSeeAll": "Ver todas las ubicaciones",
    "roomPlatformUnavailable": "Enlace próximamente. Consulta disponibilidad por WhatsApp.",
    "galleryEmpty": "Aún no hay fotografías disponibles.",
    "galleryPrevious": "Fotografía anterior",
    "galleryNext": "Fotografía siguiente",
    "galleryThumbnails": "Seleccionar fotografía",
    "visitorCountriesLabel": "Una bienvenida sin fronteras.",
    "visitorCountriesIntro": "Nos encanta recibir viajeros de distintos lugares del mundo.",
    "internationalWelcome": "Welcome to your home away from home.",
    "internationalDescription": "Rooms in Providencia and apartments in Santiago Centro. Message us for availability and a warm welcome.",
    "internationalCta": "Let's plan your stay",
    "visitorPause": "Pausar franja",
    "visitorPlay": "Reanudar franja",
    "paymentMethodsLabel": "Opciones para tu estadía.",
    "paymentMethodsDescription": "Confirma con tu anfitrión los medios de pago, tarifas y condiciones antes de reservar.",
    "paymentPrevious": "Medios de pago anteriores",
    "paymentNext": "Siguientes medios de pago"
  },
  "rooms": [
    {
      "id": "habitacion-1",
      "slug": "habitacion-1",
      "name": "Habitación 1",
      "description": "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
      "tag": "Tu pausa en Santiago",
      "features": [
        "WiFi gratis",
        "Lavandería"
      ],
      "photos": [
        {
          "url": "/media/hostal-1/01.webp",
          "alt": "Habitación 1 del Hostal Piffre en Providencia"
        }
      ],
      "bookingUrl": "https://www.booking.com/hotel/cl/piffre-de-vauban.es.html",
      "airbnbUrl": "",
      "published": false,
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "providencia",
      "kind": "room"
    },
    {
      "id": "habitacion-2",
      "slug": "habitacion-2",
      "name": "Habitación 2",
      "description": "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
      "tag": "Tu pausa en Santiago",
      "features": [
        "WiFi gratis",
        "Lavandería"
      ],
      "photos": [
        {
          "url": "/media/hostal-2/01.webp",
          "alt": "Cama de la habitación 2 del Hostal Piffre en Providencia"
        },
        {
          "url": "/media/hostal-2/02.webp",
          "alt": "Vista de la habitación 2 y su televisión, Hostal Piffre"
        },
        {
          "url": "/media/hostal-2/03.webp",
          "alt": "Ventana y televisión de la habitación 2"
        },
        {
          "url": "/media/hostal-2/04.webp",
          "alt": "Vista nocturna desde la habitación 2 del Hostal Piffre"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "published": true,
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "providencia",
      "kind": "room"
    },
    {
      "id": "habitacion-3",
      "slug": "habitacion-3",
      "name": "Habitación 3",
      "description": "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
      "tag": "Tu pausa en Santiago",
      "features": [
        "WiFi gratis",
        "Lavandería"
      ],
      "photos": [
        {
          "url": "",
          "alt": "Vista principal de la habitación 3 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Segunda vista de la habitación 3 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Detalle de la habitación 3 de Hostal Piffre"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "published": false,
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "providencia",
      "kind": "room"
    },
    {
      "id": "departamento-1",
      "slug": "departamento-1",
      "name": "Departamento 1",
      "description": "Un espacio con dormitorio, estar y cocina para instalarte en Santiago Centro. Consulta fechas y condiciones directamente con tu anfitrión.",
      "tag": "Santiago Centro, a tu ritmo",
      "features": [
        "Lavandería",
        "Santiago Centro"
      ],
      "photos": [
        {
          "url": "/media/depto-1/01.webp",
          "alt": "Vista principal del dormitorio del departamento 1"
        },
        {
          "url": "/media/depto-1/02.webp",
          "alt": "Estar junto a la cocina del departamento 1"
        },
        {
          "url": "/media/depto-1/03.webp",
          "alt": "Televisión, cocina y estar del departamento 1"
        },
        {
          "url": "/media/depto-1/04.webp",
          "alt": "Cocina y comedor del departamento 1"
        },
        {
          "url": "/media/depto-1/05.webp",
          "alt": "Estar y ventanal del departamento 1"
        },
        {
          "url": "/media/depto-1/06.webp",
          "alt": "Sofá y ventanal del departamento 1"
        },
        {
          "url": "/media/depto-1/07.webp",
          "alt": "Comedor junto al ventanal del departamento 1"
        },
        {
          "url": "/media/depto-1/08.webp",
          "alt": "Área de piscina del edificio; consulta condiciones de uso"
        },
        {
          "url": "/media/depto-1/09.webp",
          "alt": "Otra vista del área de piscina del edificio"
        },
        {
          "url": "/media/depto-1/10.webp",
          "alt": "Dormitorio y ventana del departamento 1"
        },
        {
          "url": "/media/depto-1/11.webp",
          "alt": "Dormitorio junto al estar del departamento 1"
        },
        {
          "url": "/media/depto-1/12.webp",
          "alt": "Cama y ventana del departamento 1"
        },
        {
          "url": "/media/depto-1/13.webp",
          "alt": "Televisión y vista hacia el dormitorio del departamento 1"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "santiago-centro",
      "kind": "apartment",
      "published": true
    },
    {
      "id": "departamento-2",
      "slug": "departamento-2",
      "name": "Departamento 2",
      "description": "Un departamento con dormitorio, estar y balcón para hacer una pausa entre tus recorridos por Santiago. Consulta disponibilidad y condiciones.",
      "tag": "Santiago Centro, a tu ritmo",
      "features": [
        "Lavandería",
        "Santiago Centro"
      ],
      "photos": [
        {
          "url": "/media/depto-2/01.webp",
          "alt": "Dormitorio del departamento 2 en Santiago Centro"
        },
        {
          "url": "/media/depto-2/02.webp",
          "alt": "Estar y balcón del departamento 2"
        },
        {
          "url": "/media/depto-2/03.webp",
          "alt": "Cocina y comedor del departamento 2"
        },
        {
          "url": "/media/depto-2/04.webp",
          "alt": "Estar y salida al balcón del departamento 2"
        },
        {
          "url": "/media/depto-2/05.webp",
          "alt": "Dormitorio y televisión del departamento 2"
        },
        {
          "url": "/media/depto-2/06.webp",
          "alt": "Cocina del departamento 2"
        },
        {
          "url": "/media/depto-2/07.webp",
          "alt": "Baño del departamento 2"
        },
        {
          "url": "/media/depto-2/08.webp",
          "alt": "Balcón del departamento 2"
        },
        {
          "url": "/media/depto-2/09.webp",
          "alt": "Otra vista de la cocina y comedor del departamento 2"
        },
        {
          "url": "/media/depto-2/10.webp",
          "alt": "Sofá del estar del departamento 2"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "santiago-centro",
      "kind": "apartment",
      "published": true
    },
    {
      "id": "departamento-3",
      "slug": "departamento-3",
      "name": "Departamento 3",
      "description": "Dormitorio, cocina y estar para vivir Santiago Centro a tu ritmo. Escríbenos para coordinar tu próxima estadía.",
      "tag": "Santiago Centro, a tu ritmo",
      "features": [
        "Lavandería",
        "Santiago Centro"
      ],
      "photos": [
        {
          "url": "/media/depto-3/01.webp",
          "alt": "Vista principal del dormitorio del departamento 3"
        },
        {
          "url": "/media/depto-3/02.webp",
          "alt": "Estar y comedor del departamento 3"
        },
        {
          "url": "/media/depto-3/03.webp",
          "alt": "Vista de la cocina equipada del departamento 3"
        },
        {
          "url": "/media/depto-3/04.webp",
          "alt": "Dormitorio del departamento 3"
        },
        {
          "url": "/media/depto-3/05.webp",
          "alt": "Cocina del departamento 3"
        },
        {
          "url": "/media/depto-3/06.webp",
          "alt": "Baño del departamento 3"
        },
        {
          "url": "/media/depto-3/07.webp",
          "alt": "Estar visto desde la cocina del departamento 3"
        },
        {
          "url": "/media/depto-3/08.webp",
          "alt": "Comedor junto a la cocina del departamento 3"
        },
        {
          "url": "/media/depto-3/09.webp",
          "alt": "Espacio de guardarropa del departamento 3"
        },
        {
          "url": "/media/depto-3/10.webp",
          "alt": "Otra vista del dormitorio y televisión del departamento 3"
        },
        {
          "url": "/media/depto-3/11.webp",
          "alt": "Cocina y mesa del departamento 3"
        },
        {
          "url": "/media/depto-3/12.webp",
          "alt": "Vista general del estar y cocina del departamento 3"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "whatsappUrl": "",
      "vrboUrl": "",
      "locationId": "santiago-centro",
      "kind": "apartment",
      "published": true
    }
  ],
  "locations": [
    {
      "id": "providencia",
      "slug": "providencia",
      "name": "Providencia",
      "eyebrow": "HABITACIONES EN PROVIDENCIA",
      "title": "Providencia,",
      "titleAccent": "a tu ritmo.",
      "description": "Habitaciones en Los Capitanes 1253, Providencia, Santiago. Una ubicación para descansar y descubrir la ciudad con atención cercana.",
      "address": "Los Capitanes 1253, Providencia",
      "city": "Santiago",
      "region": "Región Metropolitana",
      "country": "Chile",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile",
      "nearby": [
        {
          "title": "Barrio Italia",
          "description": "Un barrio de cafés, diseño y antigüedades para descubrir durante tu estadía."
        },
        {
          "title": "Parque Inés de Suárez",
          "description": "Un espacio verde de Providencia para pasear y disfrutar del barrio."
        },
        {
          "title": "Metro Inés de Suárez",
          "description": "Estación de la Línea 6 del Metro de Santiago."
        },
        {
          "title": "Vida de barrio",
          "description": "Cafés y comercio de barrio para complementar tu visita a Providencia."
        }
      ],
      "amenities": [
        "Lavandería",
        "WiFi"
      ],
      "photos": [
        {
          "url": "/media/hostal-2/01.webp",
          "alt": "Cama de la habitación 2 del Hostal Piffre en Providencia"
        },
        {
          "url": "/media/hostal-comunes/01.webp",
          "alt": "Otra vista del baño en las áreas comunes del hostal"
        },
        {
          "url": "/media/hostal-comunes/02.webp",
          "alt": "Baño en las áreas comunes del Hostal Piffre"
        }
      ],
      "published": true,
      "seo": {
        "title": "Hostal en Providencia, Santiago | Alojamientos Piffre",
        "description": "Conoce nuestras habitaciones en Providencia, Santiago. Alojamiento en Los Capitanes 1253 con atención cercana. Consulta disponibilidad por WhatsApp.",
        "keywords": [],
        "canonicalUrl": "",
        "ogTitle": "",
        "ogDescription": "",
        "ogImage": "",
        "ogImageAlt": "",
        "twitterTitle": "",
        "twitterDescription": "",
        "twitterImage": "",
        "twitterCard": "summary_large_image",
        "index": true,
        "follow": true
      }
    },
    {
      "id": "santiago-centro",
      "slug": "santiago-centro",
      "name": "Santiago Centro",
      "eyebrow": "DEPARTAMENTOS EN SANTIAGO CENTRO",
      "title": "Santiago Centro,",
      "titleAccent": "tu punto de partida.",
      "description": "Departamentos en Avenida Vicuña Mackenna 625, Santiago Centro. Una ubicación para descubrir la ciudad y consultar directamente con tu anfitrión las condiciones de tu estadía.",
      "address": "Av. Vicuña Mackenna 625",
      "city": "Santiago",
      "region": "Región Metropolitana",
      "country": "Chile",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Avenida+Vicu%C3%B1a+Mackenna+625+Santiago+Chile",
      "nearby": [
        {
          "title": "Parque Bustamante",
          "description": "Un paseo urbano con áreas verdes para disfrutar de Santiago."
        },
        {
          "title": "Metro Santa Isabel",
          "description": "Estación de la Línea 5 del Metro de Santiago."
        },
        {
          "title": "Barrio Italia",
          "description": "Cafés, diseño y antigüedades para recorrer durante tu visita."
        },
        {
          "title": "Centro histórico",
          "description": "Descubre el centro histórico y los panoramas de Santiago según tus intereses."
        }
      ],
      "amenities": [
        "Lavandería"
      ],
      "photos": [
        {
          "url": "/media/depto-1/02.webp",
          "alt": "Estar junto a la cocina del departamento 1"
        },
        {
          "url": "/media/centro-comunes/01.webp",
          "alt": "Recepción y estar del edificio de Vicuña Mackenna"
        },
        {
          "url": "/media/centro-comunes/02.webp",
          "alt": "Lavandería en el edificio de Vicuña Mackenna 625"
        },
        {
          "url": "/media/centro-comunes/03.webp",
          "alt": "Vista de Santiago desde el edificio"
        },
        {
          "url": "/media/centro-comunes/04.webp",
          "alt": "Patio en las áreas comunes del edificio"
        },
        {
          "url": "/media/centro-comunes/05.webp",
          "alt": "Área de juegos en los espacios comunes"
        },
        {
          "url": "/media/centro-comunes/06.webp",
          "alt": "Ambiente del sector al anochecer"
        }
      ],
      "published": true,
      "seo": {
        "title": "Departamentos en Santiago Centro | Alojamientos Piffre",
        "description": "Descubre los departamentos de Alojamientos Piffre en Santiago Centro. Revisa nuestros espacios y consulta disponibilidad directamente por WhatsApp.",
        "keywords": [],
        "canonicalUrl": "",
        "ogTitle": "",
        "ogDescription": "",
        "ogImage": "",
        "ogImageAlt": "",
        "twitterTitle": "",
        "twitterDescription": "",
        "twitterImage": "",
        "twitterCard": "summary_large_image",
        "index": true,
        "follow": true
      }
    }
  ],
  "visitorCountries": [
    {
      "code": "AR",
      "name": "Argentina"
    },
    {
      "code": "BR",
      "name": "Brasil"
    },
    {
      "code": "US",
      "name": "Estados Unidos"
    },
    {
      "code": "BO",
      "name": "Bolivia"
    },
    {
      "code": "PE",
      "name": "Perú"
    },
    {
      "code": "CO",
      "name": "Colombia"
    },
    {
      "code": "MX",
      "name": "México"
    },
    {
      "code": "DE",
      "name": "Alemania"
    },
    {
      "code": "FR",
      "name": "Francia"
    },
    {
      "code": "GB",
      "name": "Reino Unido"
    },
    {
      "code": "ES",
      "name": "España"
    },
    {
      "code": "RU",
      "name": "Rusia"
    }
  ],
  "paymentMethods": [
    {
      "id": "webpay",
      "label": "Webpay",
      "enabled": true
    },
    {
      "id": "visa",
      "label": "Visa",
      "enabled": true
    },
    {
      "id": "mastercard",
      "label": "Mastercard",
      "enabled": true
    },
    {
      "id": "mercadopago",
      "label": "Mercado Pago",
      "enabled": true
    }
  ],
  "about": {
    "title": "Más que una estadía, una bienvenida.",
    "text": "En Hostal Piffre nos gusta lo simple: recibirte bien, ayudarte con lo que necesitas y ofrecerte un lugar donde descansar. Te recibimos en nuestras habitaciones de Providencia y departamentos de Santiago Centro, con la misma atención cercana."
  },
  "amenities": [
    {
      "title": "Dos ubicaciones",
      "description": "Habitaciones en Providencia y departamentos en Santiago Centro."
    },
    {
      "title": "Atención cercana",
      "description": "Conversa directamente con tu anfitrión."
    },
    {
      "title": "Lavandería",
      "description": "Disponible en ambas ubicaciones. Consulta las condiciones de uso."
    },
    {
      "title": "Santiago a tu ritmo",
      "description": "Descubre los parques, cafés y barrios cercanos a cada ubicación."
    }
  ],
  "location": {
    "title": "Providencia, a tu ritmo.",
    "description": "Nos encuentras en Los Capitanes 1253, Providencia, Santiago. Un barrio con restaurantes, comercio de cercanía y acceso al transporte público para descubrir la ciudad.",
    "highlights": [
      "Restaurantes y cafeterías",
      "Comercio de barrio",
      "Transporte público",
      "Cerca de Barrio Italia"
    ]
  },
  "faq": [
    {
      "question": "¿Cómo puedo reservar una habitación o departamento?",
      "answer": "Escríbenos por WhatsApp con tus fechas y la cantidad de huéspedes. También puedes consultar los enlaces de Booking, Airbnb o Vrbo cuando estén habilitados en la ficha del alojamiento."
    },
    {
      "question": "¿Dónde están los alojamientos?",
      "answer": "El hostal está en Los Capitanes 1253, Providencia. Los departamentos están en Av. Vicuña Mackenna 625, Santiago Centro. Ambos se encuentran en Santiago de Chile."
    },
    {
      "question": "¿Hay lavandería?",
      "answer": "Sí, hay lavandería en ambas ubicaciones. Consulta con tu anfitrión los horarios, costos y condiciones de uso."
    },
    {
      "question": "¿Cuáles son los horarios de llegada y salida?",
      "answer": "La llegada se coordina desde las 15:00 y la salida entre las 11:00 y las 12:00. Confirma el horario con tu anfitrión antes de viajar."
    },
    {
      "question": "¿Puedo consultar por una estadía más larga?",
      "answer": "Sí. Cuéntanos tus fechas por WhatsApp y te informaremos disponibilidad y condiciones para tu estadía."
    }
  ],
  "policies": {
    "privacyTitle": "Política de privacidad",
    "privacy": "Esta política explica cómo Hostal Piffre trata los datos que nos proporcionas al consultar por una estadía.\n\nResponsable y contacto\nHostal Piffre, Los Capitanes 1253, Providencia, Santiago de Chile. Puedes contactarnos en alojamientospiffre@gmail.com.\n\nDatos y finalidad\nAl escribirnos por WhatsApp o correo podemos recibir tu nombre, datos de contacto, fechas y detalles necesarios para responder tu consulta y gestionar tu estadía. No solicites ni envíes datos sensibles a través del sitio.\n\nProveedores\nEl sitio utiliza Vercel para su alojamiento y Supabase para almacenar su contenido y fotografías. Al abrir WhatsApp, Instagram, Booking.com o Airbnb se aplican las políticas de cada plataforma.\n\nCookies\nEl área de administración utiliza cookies de sesión necesarias para la autenticación. La zona pública del sitio puede utilizar Google Tag Manager y Google Analytics 4 para medir visitas e interacciones con los botones de contacto y reserva, únicamente si aceptas la analítica en el aviso de privacidad. Antes de aceptar, estas herramientas no se cargan. Puedes rechazar o retirar tu elección en «Preferencias de privacidad». No activamos publicidad personalizada y no enviamos el contenido de tus consultas, tu nombre, correo ni mensajes a las herramientas de analítica. La elección se conserva durante un máximo de 180 días. Google puede tratar datos técnicos de navegación y cookies de analítica conforme a sus políticas y las opciones que hayas elegido.\n\nConservación y derechos\nConservamos los datos de las consultas durante el tiempo necesario para atenderlas y cumplir las obligaciones aplicables. Puedes solicitar información, corrección o eliminación de tus datos al correo de contacto.\n\nActualizaciones\nPodemos actualizar esta política para reflejar cambios en el servicio. La fecha de actualización aparece en esta página.",
    "termsTitle": "Términos y condiciones",
    "terms": "Estos términos regulan el uso del sitio de Hostal Piffre y las consultas de alojamiento realizadas por sus canales de contacto.\n\nInformación y reservas\nEl sitio es informativo. Una consulta por WhatsApp o correo no confirma una reserva. Disponibilidad, tarifa, ocupación, medios de pago y condiciones deben ser confirmados expresamente por el anfitrión antes de realizar cualquier pago.\n\nPlataformas externas\nLas reservas realizadas en Booking.com o Airbnb se rigen por la información y condiciones informadas en la plataforma elegida. Los enlaces se facilitan para tu comodidad.\n\nLlegada y salida\nLa llegada se coordina desde las 15:00 y la salida entre las 11:00 y las 12:00. Cualquier excepción debe acordarse previamente con el anfitrión.\n\nCancelaciones y cambios\nLas condiciones de cancelación, devolución, anticipos y cambios se informan antes de confirmar cada reserva. Consulta las condiciones de tu tarifa y conserva la confirmación.\n\nConvivencia\nCuida los espacios, respeta el descanso de otras personas y sigue las indicaciones del anfitrión. No se permiten fiestas ni eventos. La admisión de mascotas y cualquier necesidad especial deben consultarse y confirmarse previamente.\n\nContenido del sitio\nLas fotografías y descripciones corresponden a la información publicada por la administración. Consulta los servicios y características de la habitación elegida antes de reservar.\n\nConsultas\nPara dudas sobre estos términos, contáctanos en alojamientospiffre@gmail.com o por WhatsApp al +56 9 5493 3261.",
    "updatedAt": "2026-10-22"
  }
}$piffre_seed$::jsonb)
on conflict (id) do nothing;

commit;

-- Verification (safe to execute separately):
-- select id, jsonb_array_length(content->'rooms') as rooms, updated_at from public.site_content;
-- select grantee, privilege_type from information_schema.role_table_grants
-- where table_schema = 'public' and table_name = 'site_content';
-- select schemaname, tablename, policyname, permissive, roles, cmd from pg_policies
-- where (schemaname = 'public' and tablename = 'site_content')
-- or (schemaname = 'storage' and tablename = 'objects' and policyname like 'Room images%');

