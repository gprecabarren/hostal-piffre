# Carruseles de lugares para descubrir

Implementado el 2 de noviembre de 2026 para las páginas de Providencia y Santiago
Centro. Cada carrusel aparece después del mapa del barrio, antes de los enlaces
a la otra ubicación y del contacto final. No aparece en el Home.

## Edición

En Administración → Ubicaciones, elegir una dirección y abrir **Carrusel ·
Descubre Santiago**. Se puede ocultar la sección, editar su título, introducción,
etiqueta y texto del enlace a las rutas. Cada lugar tiene foto (subida o URL),
descripción alternativa para accesibilidad y SEO, nombre, categoría, texto,
indicaciones y datos de autor/licencia. El orden cambia con los botones subir y
bajar. Se pueden agregar hasta veinte lugares por ubicación y dejar borradores.
Un lugar visible necesita una foto. Se publica con **Guardar y publicar**.

Las fotos subidas utilizan la misma API protegida y el almacenamiento del CMS.
Se validan y convierten a WebP, eliminando metadatos. Al reemplazar la foto de un
lugar se limpian los créditos anteriores para no atribuir una imagen al autor
equivocado. Las atribuciones y licencias se presentan en Términos y condiciones,
accesible desde el footer, sin mostrar un bloque de créditos en los carruseles.
Conservar estos datos mientras se utilicen las fotografías iniciales.

## Contenido inicial

- Providencia: Barrio Italia, Parque Inés de Suárez, Cerro San Cristóbal y
  teleférico, Estadio Nacional, Baquedano, Metro Santa Isabel, Santander Arena
  (ex Movistar Arena) y Barrio Lastarria.
- Santiago Centro: Metro Santa Isabel, Parque Bustamante, Barrio Italia,
  Baquedano, Cerro Santa Lucía, Barrio Lastarria, Cerro San Cristóbal y teleférico,
  Santander Arena (ex Movistar Arena) y Estadio Nacional.

Los destinos de recorrido urbano se distinguen de los paseos del barrio en sus
descripciones. No se prometen tiempos, distancias a pie, horarios ni acceso a
eventos. Los enlaces de Google Maps incorporan como origen la dirección de
cada alojamiento; al cambiar una dirección hay que revisar también las rutas.

Fuentes de contexto:

- [Google Maps: Los Capitanes 1253 a Estadio Nacional](https://www.google.com/maps/dir/Los+Capitanes+1253,+Providencia/Estadio+Nacional,+Santiago)
- [Google Maps: Vicuña Mackenna 625 a Santander Arena](https://www.google.com/maps/dir/Av.+Vicu%C3%B1a+Mackenna+625,+Santiago/Santander+Arena,+Santiago)
- [Teleférico: estación Oasis y acceso Pedro de Valdivia](https://telefericosantiago.cl/linea-pedro-de-valdivia/estacion-oasis/)
- [Chile Travel: Barrio Italia y Bellavista](https://chile.travel/atractivos/barrio-italia-y-bellavista/)
- [Municipalidad: Parque Inés de Suárez](https://providencia.cl/provi/explora/turismo/conocenos/parque-ines-de-suarez)
- [Anuncio oficial del nombre Santander Arena](https://saladecomunicacion.santander.cl/noticias/detalles/santander-arena-marca-un-nuevo-capitulo-para-el-entretenimiento-en-vivo-en-chile)

Las diez fotografías proceden de Wikimedia Commons con licencias CC BY o CC
BY-SA. Los enlaces individuales, autores, licencias y adaptaciones se guardan
en `src/lib/places-seed.json` y en cada lugar editable del CMS. Los archivos
optimizados de 85–377 kB están en `public/images/places/`. Son fotos reales; no
se generaron imágenes de monumentos ni se modificaron sus elementos.

## Compatibilidad y funcionamiento

Los campos nuevos se incorporan al normalizar documentos antiguos. Un carrusel
ya guardado vacío u oculto se respeta y no vuelve a llenarse. Se guardan dentro
del documento JSON de `site_content`; no se necesitan tablas, permisos o claves
nuevos. Las ediciones existentes del resto del sitio se conservan.

El carrusel usa desplazamiento nativo con ajuste por tarjeta: tres tarjetas en
PC, dos en tablet y una con vista parcial de la siguiente en móvil. Tiene
botones con extremos deshabilitados, teclado (flechas, Inicio y Fin), contador,
fotografías de carga diferida y respeto por movimiento reducido. No avanza solo
mientras el huésped está leyendo. El contenido se entrega en el HTML del
servidor para que pueda rastrearse.
