# Correcciones del 28 de octubre de 2026

## Ajustes del 29 de octubre

Los pagos ahora se muestran todos juntos, sin carrusel ni flechas: Webpay, Visa, Mastercard, Mercado Pago, PayPal y Wise. En móvil se ordenan en una cuadrícula de tres columnas. La lista y su orden se mantienen editables.

El enlace de cada ubicación está dentro del recuadro, debajo de la dirección, con el texto editable «Ver más información» y una flecha vertical. El nombre de la ubicación forma parte del nombre accesible del enlace. Todos los accesos a ubicaciones usan navegación nativa hacia `#contenido`, para empezar desde arriba también cuando se entra desde una sección avanzada de Inicio. El canonical sigue apuntando a la URL sin fragmento.

Se revisaron los metadatos de las cinco páginas y se precisaron las descripciones de ambas ubicaciones con su dirección, WiFi y lavandería. Los servicios configurados en cada propiedad también se incluyen en sus datos estructurados. No se añaden valoraciones, precios ni servicios sin confirmar. Referencias: [enlaces rastreables y texto descriptivo](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) y [BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## Galerías, navegación y pagos

La Habitación 2 y el Departamento 3 heredaban `align-items: start` de la presentación lateral de escritorio. En móvil sus galerías, compuestas de imágenes posicionadas absolutamente, quedaban sin ancho ni alto. Las galerías ahora tienen ancho explícito, no se encogen en flex y las tarjetas móviles estiran sus hijos.

Las etiquetas accesibles de los pagos y las banderas ahora se posicionan dentro de cada elemento. Antes podían contribuir al ancho del documento fuera del carrusel, también cuando el sistema solicitaba movimiento reducido y se retiraba la transformación de las banderas. El documento limita el desborde horizontal, mientras las galerías y el carrusel conservan navegación propia.

El carrusel muestra tres medios en escritorio y dos en móvil. Las flechas avanzan por tarjeta y vuelven al comienzo o al final. El desplazamiento se limita al contenido existente; no hay tarjetas vacías ni separadores de relleno. Con movimiento reducido, los cambios son inmediatos. Sin desborde, las flechas quedan deshabilitadas.

En móvil se distinguen los dos grupos de alojamientos con fondos suaves y bordes. Las páginas de ubicación tienen una ruta de navegación y una portada diferenciada; la franja de banderas queda en Inicio. Instagram aparece en el encabezado. En el pie, WhatsApp e Instagram tienen botones circulares con nombres accesibles. Se mantiene WhatsApp flotante y se retira la invitación «Haz espacio para una pausa».

Los enlaces a secciones de Inicio usan navegación nativa del navegador. Esto evita que el router acumule fragmentos como `#habitaciones#contenido` al regresar desde una ubicación. Las páginas de ubicación conservan la navegación de Next.js.

## Imagen para compartir

`/imagen-social/v2` genera una imagen PNG de 1200 × 630 con el logo oficial, frase de marca y las dos ubicaciones publicadas. Usa las direcciones del contenido editable y una caché de una hora. Las páginas heredan la imagen general; cada página mantiene su opción de imagen propia en el panel. La URL nueva ayuda a separar esta imagen de la anterior en las cachés de redes sociales; una vista previa ya guardada por WhatsApp puede tardar en actualizarse.

## Correspondencia de Airbnb

Se compararon visualmente los anuncios proporcionados con las fotografías del cliente. No se cambiaron el orden de fotos, los nombres ni la publicación de las propiedades.

| Propiedad | Anuncio |
| --- | --- |
| Habitación 1, oculta | [1582706820971910479](https://www.airbnb.cl/rooms/1582706820971910479) |
| Habitación 2 | [1642394729236543022](https://www.airbnb.cl/rooms/1642394729236543022) |
| Departamento 1 | [1803933934369494949](https://www.airbnb.cl/rooms/1803933934369494949) |
| Departamento 1, segundo anuncio del mismo espacio | [1760307243286615072](https://www.airbnb.cl/rooms/1760307243286615072) |
| Departamento 2 | [1352459415299032010](https://www.airbnb.cl/rooms/1352459415299032010) |
| Departamento 3 | [1781198657363884435](https://www.airbnb.cl/rooms/1781198657363884435) |

La Habitación 3 continúa oculta y sin anuncio asignado. El segundo anuncio de Airbnb se edita desde Propiedades y su texto desde Textos de la página. El campo es opcional y compatible con contenido anterior. Ambos enlaces se validan contra los dominios oficiales de Airbnb y usan la medición de reservas existente.

## Validación

TypeScript, 24 pruebas de autorización, validación de enlaces, migración de contenido y SEO, y compilación de producción. La comprobación visual incluye galerías, flechas y regreso del carrusel, menú móvil, ambas páginas de ubicación y la imagen social. Las capturas y mediciones de la sesión se conservan en `output/`, fuera de Git.
