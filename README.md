# Hostal Piffre

Sitio y panel de administración para Alojamientos Piffre, Providencia, Santiago de Chile.

Sitio en español con Next.js App Router, Manrope local, animaciones con movimiento reducido, SEO renderizado en servidor, sitemap, robots, Open Graph y datos estructurados. Incluye un panel privado en `/admin` con acceso mediante Vercel.

## Desarrollo

Requiere Node.js 24. Ejecutar `npm ci`, copiar `.env.example` a `.env.local` y completar las variables. Luego `npm run dev`.

`npm run check`, `npm test` y `npm run build` verifican tipos, validación y compilación de producción. Las credenciales nunca se guardan en Git ni se envían al navegador.

## Contenido y fotografías

En Supabase, ejecutar `supabase/schema.sql` en el SQL Editor del proyecto y luego `supabase/verify.sql`. El esquema conserva el contenido existente al volver a ejecutarlo. La tabla `site_content` tiene lectura pública y escritura exclusiva desde el servidor autorizado. El bucket `room-images` sirve fotografías públicas y rechaza escrituras de visitantes.

El panel permite gestionar entre 1 y 30 propiedades, asignarlas a Providencia o Santiago Centro, reordenar, ocultar y publicar. Las nuevas empiezan ocultas. Cada galería admite hasta 40 fotos: las tres primeras son portadas y el resto se ve en la galería completa. Booking, Airbnb, Vrbo y WhatsApp tienen enlaces individuales editables; las plataformas sin enlace permanecen visibles y desactivadas. Sin enlace propio de WhatsApp se genera un mensaje con el nombre de la propiedad. Las fotografías JPG/PNG/WebP de hasta 4 MB se validan, optimizan a WebP y se les retiran metadatos EXIF antes de subirlas.

También permite editar 100 textos de la página agrupados y buscables, hasta 20 preguntas frecuentes, hasta 12 servicios, destacados de ubicación, WhatsApp, Instagram, dirección, SEO y páginas legales. Las preguntas y los servicios se pueden agregar, editar, reordenar y quitar. Las variables indicadas en los textos muestran automáticamente datos como el número de propiedades publicadas. Los cambios de todas las secciones se guardan juntos; antes de guardar se pueden deshacer las retiradas o descartar la edición completa.

Para una base existente, ejecutar `supabase/upgrade-dynamic-content.sql` antes de guardar propiedades dinámicas. La migración conserva el contenido anterior y amplía la restricción de la tabla a 1–30 propiedades. El lector completa los campos nuevos de contenido y SEO de versiones anteriores.

Las dos páginas de ubicación tienen textos, fotografías, dirección, mapa, lugares cercanos, servicios y SEO editables. También se gestionan los países de la franja de bienvenida y los medios de pago. Se incorporaron 48 fotografías WebP del cliente; tres portadas del departamento 2 se restauraron con IA conservando su contenido ([registro](docs/FOTOGRAFIAS.md)). Los enlaces que faltan se completan desde el panel. El sitio consulta disponibilidad por WhatsApp; no procesa pagos ni confirma reservas automáticamente.

## Publicación

Repositorio: [gprecabarren/hostal-piffre](https://github.com/gprecabarren/hostal-piffre). Proyecto de Vercel `hostal-piffre`, propiedad de la cuenta `alojamientospiffre@gmail.com`. Supabase: proyecto `wmurdttdynejgwjrwcwb`. Dominio de producción: [alojamientospiffre.cl](https://alojamientospiffre.cl).

Los pushes a `main` activan la integración de Git de Vercel. Configurar las variables privadas del servidor en Production. Los previews no deben recibir las claves privadas de producción.

## Acceso y operación

La aplicación de Vercel usa Authorization Code con PKCE, state y nonce y los scopes `openid email profile`. La cuenta debe pertenecer al equipo y aparecer en `ADMIN_EMAILS`. Se verifica el token de identidad mediante JWKS; las operaciones de edición validan sesión y origen.

Callback de producción: `https://alojamientospiffre.cl/api/auth/callback/vercel`. Callback de desarrollo: `http://localhost:3000/api/auth/callback/vercel`. La configuración de la aplicación se encuentra en Team Settings → Apps → Hostal Piffre Administracion.

Google Tag Manager está configurado con el contenedor `GTM-5LW4VNRP` y el destino de Google Analytics 4 `G-ZKPRJH1Z3T`. GTM carga únicamente en producción, en páginas públicas y después de aceptar analítica. Rechazar mantiene el contenedor sin cargar; la elección se puede cambiar desde las preferencias de privacidad. La validación en producción confirmó solicitudes HTTP 204 de page_view y contact_click al destino correcto, con canal e identificación de la propiedad. El token de Search Console, el identificador GTM y los textos del aviso se pueden editar desde el panel.

Search Console tiene el dominio verificado. El 26 de octubre se envió y procesó [sitemap.xml](https://alojamientospiffre.cl/sitemap.xml): estado **Correcto**, con cinco páginas descubiertas, incluidas las dos ubicaciones. La inspección previa de la portada confirmó «La URL está en Google» y «La página está indexada», con HTTPS correcto. La indexación de cada URL adicional y las posiciones en resultados dependen de Google.

Los textos legales son editables y requieren confirmar la identidad del responsable y las condiciones comerciales reales antes de considerarlos definitivos. La política debe reflejar las herramientas de medición utilizadas. Referencia de privacidad: [Ley 19.628, Biblioteca del Congreso Nacional](https://www.bcn.cl/leychile/navegar?idNorma=141599).

Logo recreado en alta resolución con la herramienta integrada ImageGen. Prompt: extracción fiel del emblema y el nombre Hostal Piffre, fondo marfil, sin panel inferior ni frase promocional. Archivo de sitio `public/brand/logo.webp`; versión de alta resolución `public/brand/logo-hd.png`.
