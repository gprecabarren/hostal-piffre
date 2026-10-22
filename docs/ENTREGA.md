# Alojamientos Piffre

- Sitio: [alojamientospiffre.cl](https://alojamientospiffre.cl)
- Panel: [Administración](https://alojamientospiffre.cl/admin)
- Repositorio: [gprecabarren/hostal-piffre](https://github.com/gprecabarren/hostal-piffre)
- Vercel: proyecto `hostal-piffre` del equipo de `alojamientospiffre@gmail.com`.
- Supabase: proyecto `wmurdttdynejgwjrwcwb`, organización `piffre's Org`.

## Para actualizar el sitio

1. Entrar a `/admin` y elegir **Continuar con Vercel** con el correo autorizado del alojamiento.
2. En **Propiedades**, agregar, seleccionar o reordenar espacios. Se pueden mantener entre 1 y 30 propiedades; las nuevas empiezan ocultas y se muestran cuando se activa su visibilidad y se guarda. También se puede retirar una propiedad, con confirmación y opción de deshacer durante la edición.
3. Cada propiedad conserva tres espacios de fotografías JPG, PNG o WebP de hasta 4 MB por archivo. Completar nombre, descripción, características y enlaces específicos de Booking y Airbnb. El enlace de WhatsApp propio es opcional: en blanco usa el número general con un mensaje que incluye el nombre de la propiedad. Los botones de plataformas sin enlace se ocultan.
4. Pulsar **Guardar y publicar**. Las actualizaciones quedan en Supabase y aparecen en el sitio sin modificar código ni desplegar de nuevo.
5. **Textos de la página** permite editar menú, títulos, botones, franja animada, textos de las propiedades, mapa, contacto, pie de página, avisos de privacidad y textos auxiliares legales. Los campos son texto simple; para títulos y párrafos se pueden usar saltos de línea. La variable `{habitaciones}` muestra la cantidad de propiedades publicadas; otros campos indicados admiten `{habitacion}`, `{sitio}`, `{anio}`, `{foto}` o `{total}`.
6. **Preguntas frecuentes** permite agregar, editar, reordenar y quitar preguntas y respuestas. También se pueden gestionar los servicios y los destacados de ubicación desde sus secciones.
7. **Contacto y redes** permite cambiar el número general de WhatsApp, mensaje, Instagram, correo y ubicación. **Visibilidad en Google** permite editar título, descripción, imagen social, palabras clave, indexación, token de Search Console e identificador de Google Tag Manager. **Textos legales** contiene privacidad, condiciones y fecha de actualización editables.

## Privacidad y medición

- Contenedor de Google Tag Manager configurado: `GTM-5LW4VNRP`.
- El código carga GTM en producción y en páginas públicas después de aceptar analítica. Rechazar mantiene el contenedor sin cargar; el visitante puede cambiar su elección desde **Preferencias de privacidad**.
- Los eventos de contacto distinguen WhatsApp, Booking y Airbnb e identifican la propiedad. No incluyen el teléfono, mensaje ni URL de destino.
- Las etiquetas y destinos de Google Analytics se administran en el contenedor de Tag Manager. Su publicación y recepción de datos deben comprobarse en la vista previa del contenedor y en los informes de Analytics; tener un identificador GTM no prueba por sí solo que se estén recibiendo visitas.
- Antes de activar la medición en producción, actualizar desde el panel el párrafo de cookies de la política de privacidad para reflejar las herramientas realmente utilizadas.

## Search Console

- Propiedad del dominio verificada mediante DNS.
- Token de verificación configurado también como metadato editable del sitio.
- Sitemap inicial enviado: [sitemap.xml](https://alojamientospiffre.cl/sitemap.xml). La primera lectura de Google mostró un error de obtención; queda pendiente revisar su estado después de la actualización de producción.
- La verificación del dominio y el envío del sitemap no confirman indexación ni posiciones en los resultados.

## Actualización de la base de datos

Para una instalación existente, ejecutar `supabase/upgrade-dynamic-content.sql` en el SQL Editor antes de guardar un número de propiedades diferente de tres. Cambia la restricción a 1–30 y conserva el contenido. El sitio completa en memoria los campos nuevos del contenido anterior; quedan almacenados al guardar desde el panel. Para una instalación nueva, `supabase/schema.sql` incluye la estructura, permisos, bucket y contenido inicial completos.

## Verificado

- Compilación de producción de Next.js en Vercel y conexión automática a `main`.
- Inicio de sesión real con Vercel y guardado persistente desde el panel.
- Subida de imagen a Supabase, conversión a WebP, guardado y posterior retiro de la imagen de prueba de la galería.
- Base inicial de tres habitaciones con tres espacios de fotografías cada una, sin fotografías ficticias presentadas como reales; la nueva versión permite ampliar y ordenar las propiedades.
- Vista de escritorio y tamaños móviles de 390 y 320 px; menú, carrusel y preguntas frecuentes.
- Páginas públicas, privacidad, términos, robots y sitemap con respuesta HTTP 200.
- Edición sin sesión rechazada con HTTP 401.
- SEO renderizado en servidor, canonical, metadatos sociales y datos estructurados de alojamiento, sitio y preguntas frecuentes.
- Dominio raíz de producción y redirección permanente de `www` al dominio raíz. Certificados HTTPS administrados automáticamente por Vercel.
- Lectura pública y escritura privada del contenido; claves del servidor fuera de Git y del navegador.
- En la ampliación del panel: TypeScript y 11 pruebas automatizadas de autorización, validación, migración del contenido anterior, propiedades dinámicas, enlaces de contacto y exclusión de rutas de analítica.

## Contenido pendiente del anfitrión

- Nombres definitivos de las habitaciones, capacidades, camas y servicios particulares.
- Nueve fotografías reales y confirmación de los enlaces de cada habitación. Hay un enlace de Booking tomado de la información entregada; faltan los restantes.
- Perfil oficial de Instagram.
- Confirmación de horarios, mascotas, pagos, cancelaciones y datos legales del responsable. Las condiciones publicadas son una base editable.

La revisión del contenido comercial y legal sigue a cargo del anfitrión. Publicar una propiedad solo cuando su información esté lista para mostrarse.
