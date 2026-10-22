# Hostal Piffre

Sitio y panel de administración para Alojamientos Piffre, Providencia, Santiago de Chile.

Sitio en español con Next.js App Router, Manrope local, animaciones con movimiento reducido, SEO renderizado en servidor, sitemap, robots, Open Graph y datos estructurados. Incluye un panel privado en `/admin` con acceso mediante Vercel.

## Desarrollo

Requiere Node.js 24. Ejecutar `npm ci`, copiar `.env.example` a `.env.local` y completar las variables. Luego `npm run dev`.

`npm run check`, `npm test` y `npm run build` verifican tipos, validación y compilación de producción. Las credenciales nunca se guardan en Git ni se envían al navegador.

## Contenido y fotografías

En Supabase, ejecutar `supabase/schema.sql` en el SQL Editor del proyecto y luego `supabase/verify.sql`. El esquema conserva el contenido existente al volver a ejecutarlo. La tabla `site_content` tiene lectura pública y escritura exclusiva desde el servidor autorizado. El bucket `room-images` sirve fotografías públicas y rechaza escrituras de visitantes.

El panel permite editar las tres habitaciones, tres fotos por habitación, textos alternativos, enlaces específicos de Booking y Airbnb, textos de portada, servicios, preguntas frecuentes, WhatsApp, Instagram, dirección, SEO y páginas legales. Las fotografías JPG/PNG/WebP de hasta 4 MB se validan, optimizan a WebP y se les retiran metadatos EXIF antes de subirlas.

Las fotografías reales y los enlaces que faltan se completan desde el panel. Las imágenes ilustrativas están identificadas. El sitio consulta disponibilidad por WhatsApp; no procesa pagos ni confirma reservas automáticamente.

## Publicación

Repositorio: https://github.com/gprecabarren/hostal-piffre . Proyecto de Vercel `hostal-piffre`, propiedad de la cuenta `alojamientospiffre@gmail.com`. Supabase: proyecto `wmurdttdynejgwjrwcwb`. Dominio previsto: https://alojamientospiffre.cl .

Los pushes a `main` activan la integración de Git de Vercel. Configurar las variables privadas del servidor en Production. Los previews no deben recibir las claves privadas de producción.

## Acceso y operación

La aplicación de Vercel usa Authorization Code con PKCE, state y nonce y los scopes `openid email profile`. La cuenta debe pertenecer al equipo y aparecer en `ADMIN_EMAILS`. Se verifica el token de identidad mediante JWKS; las operaciones de edición validan sesión y origen.

Callback de producción: `https://alojamientospiffre.cl/api/auth/callback/vercel`. Callback de desarrollo: `http://localhost:3000/api/auth/callback/vercel`. La configuración de la aplicación se encuentra en Team Settings → Apps → Hostal Piffre Administracion.

No se han activado Google Analytics, Tag Manager ni Search Console. Los textos legales iniciales son editables y requieren confirmar la identidad del responsable y las condiciones comerciales reales antes de considerarlos definitivos. Referencia de privacidad: [Ley 19.628, Biblioteca del Congreso Nacional](https://www.bcn.cl/leychile/navegar?idNorma=141599).

Logo recreado en alta resolución con la herramienta integrada ImageGen. Prompt: extracción fiel del emblema y el nombre Hostal Piffre, fondo marfil, sin panel inferior ni frase promocional. Archivo de sitio `public/brand/logo.webp`; versión de alta resolución `public/brand/logo-hd.png`.
