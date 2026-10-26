# Alojamientos Piffre

- Sitio: [alojamientospiffre.cl](https://alojamientospiffre.cl)
- Panel: [Administración](https://alojamientospiffre.cl/admin)
- Repositorio: [gprecabarren/hostal-piffre](https://github.com/gprecabarren/hostal-piffre)
- Vercel: proyecto `hostal-piffre` del equipo de `alojamientospiffre@gmail.com`.
- Supabase: proyecto `wmurdttdynejgwjrwcwb`, organización `piffre's Org`.

## Ampliación del 26 de octubre de 2026

La ampliación está publicada en producción: Providencia y Santiago Centro, con seis propiedades configuradas. Se muestran la habitación 2 y los tres departamentos; las habitaciones 1 y 3 se conservan ocultas. Vercel completó el despliegue del cambio principal `d82821c` en 37 segundos. Supabase confirmó seis propiedades y dos ubicaciones. El sitemap actualizado fue enviado y procesado por Google el 26 de octubre: **Correcto**, con cinco páginas descubiertas.

| Propiedad | Ubicación | Visibilidad configurada | Fotografías de su galería |
| --- | --- | --- | --- |
| Habitación 1 | Providencia | Oculta | Conservada para completar después |
| Habitación 2 | Providencia | Visible | 4 |
| Habitación 3 | Providencia | Oculta | Conservada para completar después |
| Departamento 1 | Santiago Centro | Visible | 13 |
| Departamento 2 | Santiago Centro | Visible | 10 |
| Departamento 3 | Santiago Centro | Visible | 12 |

Una propiedad se muestra cuando tanto su publicación como la de su ubicación están activadas. El panel distingue las propiedades ocultas por su ubicación y conserva sus datos y fotografías.

Hay 48 archivos WebP entre fotografías de interiores y de áreas comunes. Las tres portadas del departamento 2 recibieron restauración conservadora con IA; el resto se preparó para la web. El alcance, los archivos y el prompt de restauración se documentan en [FOTOGRAFIAS.md](FOTOGRAFIAS.md).

## Para actualizar el sitio

1. Entrar a `/admin` y elegir **Continuar con Vercel** con el correo autorizado del alojamiento.
2. En **Propiedades**, agregar, seleccionar o reordenar espacios. Se pueden mantener entre 1 y 30 propiedades; las nuevas empiezan ocultas y se muestran cuando se activa su visibilidad y se guarda. También se puede retirar una propiedad, con confirmación y opción de deshacer durante la edición.
3. Elegir la ubicación y el tipo de cada propiedad: habitación o departamento. Su galería admite hasta 40 fotografías; las primeras tres posiciones son las portadas y el resto completa la galería. Se pueden subir varias fotos, reemplazarlas, reordenarlas o quitarlas. Las subidas son secuenciales, completan primero los espacios vacíos y aceptan JPG, PNG o WebP de hasta 4 MB por archivo. Una propiedad activada conserva al menos tres posiciones de portada.
4. Pulsar **Guardar y publicar**. Las actualizaciones quedan en Supabase y aparecen en el sitio sin modificar código ni desplegar de nuevo.
5. Completar los enlaces de Booking, Airbnb, Vrbo y WhatsApp de cada propiedad. Los cuatro botones mantienen sus logos y permanecen visibles; un destino sin URL válida queda desactivado. WhatsApp puede usar un enlace propio o, en blanco, el número general con un mensaje que incluye el nombre de la propiedad.
6. **Ubicaciones** permite editar los nombres, títulos, descripciones, direcciones, mapa, servicios, lugares cercanos y fotografías de Providencia y Santiago Centro. Cada ubicación tiene su título y descripción SEO. La lavandería y cualquier costo adicional se pueden indicar en sus servicios. Las direcciones y los servicios deben corresponder a datos confirmados.
7. **Países y pagos** permite agregar, editar, reordenar o quitar hasta 50 países con su código internacional de dos letras y nombre. También permite gestionar hasta 20 medios de pago, cambiar su orden y habilitar o deshabilitar su aparición. La franja de países es una selección editorial y no un ranking local ni un registro de huéspedes; el criterio y las referencias están en [FUENTES.md](FUENTES.md).
8. **Textos de la página** permite buscar y editar los textos agrupados de menú, títulos, botones, franjas, propiedades, ubicaciones, mapa, contacto, pie de página, avisos de privacidad y textos auxiliares legales. El número de campos se muestra en el propio panel. Los campos son texto simple; para títulos y párrafos se pueden usar saltos de línea. Las variables indicadas admiten valores como `{habitaciones}`, `{habitacion}`, `{sitio}`, `{anio}`, `{foto}` o `{total}` y se reemplazan al mostrar la página.
9. **Preguntas frecuentes** permite agregar, editar, reordenar y quitar hasta 20 preguntas y respuestas. En **Contenido del sitio** se pueden gestionar hasta 12 servicios generales y los textos de presentación.
10. **Contacto y redes** permite cambiar el número general de WhatsApp, mensaje, Instagram, correo y datos generales de contacto. **Visibilidad en Google** permite editar título, descripción, imagen social, palabras clave, indexación, token de Search Console e identificador de Google Tag Manager. **Textos legales** contiene privacidad, condiciones y fecha de actualización editables.

El guardado es global: incluye las modificaciones de todas las secciones. Antes de guardar se pueden deshacer las propiedades retiradas o usar **Descartar cambios** para recuperar la última versión guardada. La hora del último guardado usa el horario de Chile, `America/Santiago`, en formato de 24 horas.

## Privacidad y medición

- Contenedor de Google Tag Manager configurado: `GTM-5LW4VNRP`.
- Destino de Google Analytics 4 configurado: `G-ZKPRJH1Z3T`.
- El código carga GTM en producción y en páginas públicas después de aceptar analítica. Rechazar mantiene el contenedor sin cargar; el visitante puede cambiar su elección desde **Preferencias de privacidad**.
- Los eventos de contacto distinguen WhatsApp, Booking, Airbnb y Vrbo e identifican la propiedad. No incluyen el teléfono, mensaje ni URL de destino.
- Contenedor GTM versión 2 publicado con dos etiquetas, un activador, tres variables de capa de datos y dos ajustes de privacidad. La prueba real confirmó solicitudes HTTP 204 de page_view y contact_click a G-ZKPRJH1Z3T; un clic en Booking informó canal booking, ID habitacion-1 y nombre Habitación 1. Analytics también registró la visita en tiempo real.
- Mantener actualizada desde el panel la política de privacidad para reflejar las herramientas realmente utilizadas y sus opciones de consentimiento.

- En Analytics están registradas las dimensiones de evento contact_channel, room_id y room_name. contact_click se marca como evento clave de consulta; no representa una reserva confirmada. Retención: 14 meses. Google signals y personalización publicitaria desactivados. Search Console vinculado al flujo web.

## Search Console

- Propiedad del dominio verificada mediante DNS.
- Token de verificación configurado también como metadato editable del sitio.
- [sitemap.xml](https://alojamientospiffre.cl/sitemap.xml) enviado y procesado el 26 de octubre: estado **Correcto**, con cinco páginas descubiertas.
- La inspección de la portada confirmó **La URL está en Google** y **La página está indexada**, con HTTPS correcto.
- La indexación de la portada está confirmada. El estado del sitemap no confirma por sí solo la indexación de cada página adicional ni garantiza posiciones en los resultados.
- Las dos páginas de ubicación están publicadas y presentes en el sitemap. Su descubrimiento por Google está confirmado; eso no equivale a confirmar la indexación individual.

## Actualización de la base de datos

Para una instalación existente, `supabase/upgrade-dynamic-content.sql` amplía la restricción a 1–30 propiedades y conserva el contenido. La lectura completa los campos nuevos de ubicaciones, tipo de propiedad, Vrbo, países y medios de pago de contenidos anteriores; quedan almacenados al guardar desde el panel. Para una instalación nueva, `supabase/schema.sql` incluye la estructura, permisos, bucket y contenido inicial completos. Las rutas públicas y descripciones de las fotografías preparadas se conservan en `src/lib/photo-seed.json`.

## Verificado

- Compilación de producción de Next.js en Vercel y conexión automática a `main`.
- Inicio de sesión real con Vercel y guardado persistente desde el panel.
- Subida de imagen a Supabase, conversión a WebP, guardado y posterior retiro de la imagen de prueba de la galería.
- Ampliación publicada con seis propiedades, dos ubicaciones, galerías variables y 48 archivos WebP. Se conservan ocultas las habitaciones 1 y 3.
- Se comprobó HTTP 200 en las siete rutas públicas y los 48 archivos WebP, canonical propio de cada ubicación, cuatro propiedades en la portada y dos entidades de alojamiento en sus datos estructurados.
- Guardado real desde el panel: etiqueta de la habitación 2 actualizada a «Tu pausa en Providencia» y comprobada tras recargar la portada y el administrador. La prueba de crear una séptima propiedad empezó oculta y se descartó sin publicarla.
- Vista de escritorio y tamaños móviles de 390 y 320 px; menú, carrusel y preguntas frecuentes.
- Páginas públicas, privacidad, términos, robots y sitemap con respuesta HTTP 200.
- Edición sin sesión rechazada con HTTP 401.
- SEO renderizado en servidor, canonical, metadatos sociales y datos estructurados de alojamiento, sitio y preguntas frecuentes.
- Dominio raíz de producción y redirección permanente de `www` al dominio raíz. Certificados HTTPS administrados automáticamente por Vercel.
- Lectura pública y escritura privada del contenido; claves del servidor fuera de Git y del navegador.
- En la ampliación: TypeScript y 17 pruebas automatizadas de autorización, validación, migración del contenido anterior, propiedades y ubicaciones, galerías de hasta 40 fotos, enlaces de contacto y exclusión de rutas de analítica.

## Contenido pendiente del anfitrión

- Nombres definitivos de las habitaciones, capacidades, camas y servicios particulares.
- Completar o confirmar los enlaces definitivos de Booking, Airbnb y Vrbo por propiedad. Las fotografías entregadas ya están preparadas; las habitaciones ocultas se pueden completar y publicar más adelante.
- Perfil oficial de Instagram.
- Confirmación de horarios, mascotas, pagos, cancelaciones y datos legales del responsable. Las condiciones publicadas son una base editable.

La revisión del contenido comercial y legal sigue a cargo del anfitrión. Publicar una propiedad solo cuando su información esté lista para mostrarse.
