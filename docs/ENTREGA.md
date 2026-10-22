# Alojamientos Piffre

- Sitio: https://alojamientospiffre.cl
- Panel: https://alojamientospiffre.cl/admin
- Repositorio: https://github.com/gprecabarren/hostal-piffre
- Vercel: proyecto `hostal-piffre` del equipo de `alojamientospiffre@gmail.com`.
- Supabase: proyecto `wmurdttdynejgwjrwcwb`, organización `piffre's Org`.

## Para actualizar el sitio

1. Entrar a `/admin` y elegir **Continuar con Vercel** con el correo autorizado del alojamiento.
2. En **Habitaciones**, elegir una de las tres habitaciones. Subir tres fotografías JPG, PNG o WebP de hasta 4 MB cada una y describir brevemente cada imagen.
3. Completar el nombre, descripción, características y enlaces específicos de Booking y Airbnb. Un enlace vacío se oculta en el sitio; el contacto por WhatsApp sigue disponible.
4. Pulsar **Guardar y publicar**. Las actualizaciones quedan en Supabase y aparecen en el sitio sin modificar código ni desplegar de nuevo.
5. **Contacto y redes** permite cambiar el número de WhatsApp, mensaje, Instagram, correo y ubicación. **Visibilidad en Google** permite editar título, descripción, imagen social, palabras clave y configuración de indexación. **Textos legales** contiene privacidad y condiciones editables.

## Verificado

- Compilación de producción de Next.js en Vercel y conexión automática a `main`.
- Inicio de sesión real con Vercel y guardado persistente desde el panel.
- Subida de imagen a Supabase, conversión a WebP, guardado y posterior retiro de la imagen de prueba de la galería.
- Tres habitaciones con tres espacios de fotografías cada una, sin fotografías ficticias presentadas como reales.
- Vista de escritorio y tamaños móviles de 390 y 320 px; menú, carrusel y preguntas frecuentes.
- Páginas públicas, privacidad, términos, robots y sitemap con respuesta HTTP 200.
- Edición sin sesión rechazada con HTTP 401.
- SEO renderizado en servidor, canonical, metadatos sociales y datos estructurados de alojamiento, sitio y preguntas frecuentes.
- Dominio raíz de producción y redirección permanente de `www` al dominio raíz. Certificados HTTPS administrados automáticamente por Vercel.
- Lectura pública y escritura privada del contenido; claves del servidor fuera de Git y del navegador.

## Contenido pendiente del anfitrión

- Nombres definitivos de las habitaciones, capacidades, camas y servicios particulares.
- Nueve fotografías reales y confirmación de los enlaces de cada habitación. Hay un enlace de Booking tomado de la información entregada; faltan los restantes.
- Perfil oficial de Instagram.
- Confirmación de horarios, mascotas, pagos, cancelaciones y datos legales del responsable. Las condiciones publicadas son una base editable.

Google Search Console, Google Analytics y Google Tag Manager se incorporarán en la siguiente etapa. Actualmente no hay analítica ni publicidad activas.
