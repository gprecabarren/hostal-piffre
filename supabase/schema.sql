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
    "description": "Alojamiento acogedor en Providencia, Santiago de Chile."
  },
  "hero": {
    "eyebrow": "ALOJAMIENTO EN PROVIDENCIA · SANTIAGO",
    "title": "Tu hogar,",
    "titleAccent": "lejos de casa.",
    "description": "Espacios para descansar, un barrio por descubrir y la calidez de sentirte en casa. Bienvenido a Hostal Piffre."
  },
  "contact": {
    "whatsapp": "56954933261",
    "whatsappMessage": "Hola, quisiera consultar disponibilidad en Hostal Piffre.",
    "email": "alojamientospiffre@gmail.com",
    "address": "Los Capitanes 1253, Providencia",
    "city": "Santiago",
    "region": "Región Metropolitana",
    "country": "Chile",
    "instagram": "",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Los+Capitanes+1253+Providencia+Santiago+Chile"
  },
  "seo": {
    "title": "Hostal Piffre | Alojamiento en Providencia, Santiago",
    "description": "Conoce Hostal Piffre, un alojamiento acogedor en Providencia, Santiago. Habitaciones, WiFi y atención cercana. Consulta disponibilidad por WhatsApp.",
    "keywords": [
      "alojamiento en Providencia",
      "hostal en Providencia",
      "alojamiento Santiago",
      "Hostal Piffre"
    ],
    "siteUrl": "https://alojamientospiffre.cl",
    "ogImage": "/og-image.png",
    "robotsIndex": true,
    "googleSiteVerification": "Ya29cIRkxvPSmxNZ2ZOyXpgVFEqfyL6K-qN05uiAON0",
    "gtmId": "GTM-5LW4VNRP"
  },
  "copy": {
    "brandPrefix": "HOSTAL",
    "brandName": "Piffre",
    "navRooms": "Habitaciones",
    "navExperience": "La experiencia",
    "navLocation": "Ubicación",
    "navFaq": "Preguntas frecuentes",
    "navContact": "Hablemos",
    "navWhatsapp": "Escríbenos por WhatsApp",
    "heroCoordinates": "33°26′ S · 70°36′ O",
    "heroPrimaryCta": "Encuentra tu habitación",
    "heroSecondaryCta": "Conversemos",
    "heroMetaLine": "Un lugar sencillo.",
    "heroMetaStrong": "Una bienvenida de verdad.",
    "heroArtKicker": "BIENVENIDO A PROVIDENCIA",
    "heroArtCaption": "Una casa. Muchas historias.",
    "heroStamp": "TU HOGAR LEJOS DE CASA · PIFFRE · ",
    "heroArtNote": "Una ilustración para recibirte.\nLas fotografías reales llegarán pronto.",
    "heroScroll": "Haz espacio para una pausa",
    "bannerOne": "Descansa.",
    "bannerTwo": "Explora.",
    "bannerThree": "Siéntete en casa.",
    "bannerFour": "Esto es Piffre.",
    "roomsLabel": "01 / TU PRÓXIMA ESTADÍA",
    "roomsNote": "{habitaciones} HABITACIONES, UNA BIENVENIDA",
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
    "locationNote": "PROVIDENCIA, SANTIAGO DE CHILE",
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
    "footerRooms": "Nuestras habitaciones",
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
    "termsDescription": "Condiciones de uso y consultas de reservas de {sitio}, alojamiento en Providencia.",
    "consentTitle": "Tu privacidad, a tu manera.",
    "consentMessage": "Con tu permiso, usamos herramientas de analítica para entender cómo se visita el sitio y mejorarlo. Puedes aceptar, rechazar o cambiar tu elección cuando quieras.",
    "consentAccept": "Aceptar analítica",
    "consentReject": "Rechazar",
    "consentPreferences": "Preferencias de privacidad"
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
        "Consulta disponibilidad"
      ],
      "photos": [
        {
          "url": "",
          "alt": "Vista principal de la habitación 1 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Segunda vista de la habitación 1 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Detalle de la habitación 1 de Hostal Piffre"
        }
      ],
      "bookingUrl": "https://www.booking.com/hotel/cl/piffre-de-vauban.es.html",
      "airbnbUrl": "",
      "published": true,
      "whatsappUrl": ""
    },
    {
      "id": "habitacion-2",
      "slug": "habitacion-2",
      "name": "Habitación 2",
      "description": "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
      "tag": "Tu pausa en Santiago",
      "features": [
        "WiFi gratis",
        "Consulta disponibilidad"
      ],
      "photos": [
        {
          "url": "",
          "alt": "Vista principal de la habitación 2 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Segunda vista de la habitación 2 de Hostal Piffre"
        },
        {
          "url": "",
          "alt": "Detalle de la habitación 2 de Hostal Piffre"
        }
      ],
      "bookingUrl": "",
      "airbnbUrl": "",
      "published": true,
      "whatsappUrl": ""
    },
    {
      "id": "habitacion-3",
      "slug": "habitacion-3",
      "name": "Habitación 3",
      "description": "Un espacio para hacer una pausa y sentirte en casa en Providencia. Escríbenos para conocer sus características y disponibilidad.",
      "tag": "Tu pausa en Santiago",
      "features": [
        "WiFi gratis",
        "Consulta disponibilidad"
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
      "published": true,
      "whatsappUrl": ""
    }
  ],
  "about": {
    "title": "Más que una estadía, una bienvenida.",
    "text": "En Hostal Piffre nos gusta lo simple: recibirte bien, ayudarte con lo que necesitas y ofrecerte un lugar donde descansar. Somos un alojamiento en Providencia, con atención cercana y un barrio lleno de vida a tu alrededor."
  },
  "amenities": [
    {
      "title": "WiFi gratis",
      "description": "Mantente conectado durante tu estadía."
    },
    {
      "title": "Atención cercana",
      "description": "Conversa directamente con tu anfitrión."
    },
    {
      "title": "Terraza",
      "description": "Un espacio para disfrutar una pausa."
    },
    {
      "title": "Barrio conectado",
      "description": "Restaurantes, comercio y transporte en Providencia."
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
      "question": "¿Cómo puedo reservar una habitación?",
      "answer": "Escríbenos por WhatsApp con tus fechas y la cantidad de huéspedes. También puedes consultar los enlaces a las plataformas de reserva disponibles en cada habitación."
    },
    {
      "question": "¿Dónde está Hostal Piffre?",
      "answer": "Estamos en Los Capitanes 1253, Providencia, Santiago de Chile."
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

