# Criterio de contenido y fuentes

Consulta realizada el 26 de octubre de 2026. Las referencias sirven para escribir el contexto turístico y las descripciones del entorno. Los datos particulares del alojamiento —direcciones, servicios, tarifas, disponibilidad y condiciones— los confirma el anfitrión.

## Países de la franja

El cliente mencionó visitantes de Estados Unidos, Alemania, Francia, Inglaterra, Rusia, Bolivia, Argentina y México. Para el código de país y la bandera de Inglaterra se utiliza `GB`, Reino Unido. Estos antecedentes provienen del cliente y no son una estadística auditada de huéspedes.

Se añadieron Brasil, Perú, Colombia y España como selección editorial informada por el turismo receptivo de Chile. Sernatur informa 6.004.567 llegadas internacionales al país durante 2025 y menciona esos cuatro mercados en su balance anual, publicado el 18 de febrero de 2026. Es un dato nacional: no establece el origen de quienes visitan Santiago, Providencia ni Alojamientos Piffre. [Balance de turismo receptivo 2025 de Sernatur](https://www.sernatur.cl/chile-supera-los-6-millones-de-turistas-extranjeros-en-2025-la-mejor-cifra-desde-2017-y-el-mayor-registro-pospandemia/).

La franja queda como una lista editable de doce países. Su orden visual no representa una clasificación por número de visitantes. El [panel oficial de llegadas internacionales de Sernatur](https://www.sernatur.cl/dataturismo/movimiento-turistico-internacional/) permite consultar la información por nacionalidad y paso fronterizo si se necesita revisar ese contexto.

## Referencias del entorno

- **Barrio Italia:** la ficha de turismo de la Municipalidad de Providencia respalda la referencia al barrio como zona histórica con gastronomía, diseño, comercio y antigüedades. [Barrio Italia, Municipalidad de Providencia](https://www.providencia.cl/provi/explora/turismo/conocenos/barrio-italia).
- **Parque Bustamante:** la ficha municipal describe el parque, su anfiteatro y el Café Literario Municipal, y sitúa el espacio entre las calles Ramón Carnicer y General Bustamante. [Parque Bustamante, Municipalidad de Providencia](https://providencia.cl/provi/explora/turismo/conocenos/parque-bustamante).

Estas referencias describen lugares de interés del entorno urbano. Las distancias y los tiempos de traslado desde una propiedad se deben confirmar con su dirección exacta. Los servicios del edificio, como piscina o lavandería, dependen de la información y las condiciones que confirme el anfitrión.

Las fotografías y la restauración de las tres portadas del departamento 2 se documentan por separado en [FOTOGRAFIAS.md](FOTOGRAFIAS.md).

## Identidad y favicon

El Instagram oficial confirmado por el cliente es [@hostalpiffre](https://www.instagram.com/hostalpiffre/). El favicon utiliza el emblema del logo existente. Se incluyen variantes cuadradas PNG de 48 y 96 px, ICO y Apple Touch Icon, con acceso permitido a los rastreadores. Referencia: [guía de favicons de Google Search Central](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=es-419).

Actualización del 29 de octubre de 2026: el icono principal declarado es un PNG
cuadrado de 192 px, derivado del mismo emblema oficial, con ICO de respaldo de
16 a 256 px y Apple Touch Icon de 180 px. Se conserva la URL de las variantes
anteriores, pero se simplifica la declaración del icono principal para los
rastreadores. Las respuestas HTTP y los archivos estaban disponibles antes del
cambio; la ausencia en resultados no demuestra por sí sola un error del sitio.
Google necesita volver a rastrear y procesar la portada y no garantiza mostrar
un favicon incluso cuando cumple sus requisitos.

El estilo del mapa original se recuperó del commit `e6d7843`. Tras la revisión del
cliente, el dibujo genérico se sustituyó por trazados reales e independientes de
las calles de ambas direcciones, obtenidos de OpenStreetMap el 29 de octubre de
2026. Las posiciones se contrastaron con las fichas de dirección en Google Maps:
Los Capitanes 1253 (`-33.4448902, -70.6150798`) y Av. Vicuña Mackenna 625
(`-33.4493365, -70.6318941`). No se copiaron imágenes ni mosaicos de Google.

Los datos de calles y parques se conservan en `scripts/map-data/`, con licencia
ODbL y atribución a los colaboradores de OpenStreetMap. El generador
`node scripts/create-neighborhood-maps.mjs` crea versiones SVG para escritorio,
móvil y miniaturas. Cada mapa enlaza a la página de atribución y licencia de OSM.
Si se cambia físicamente una dirección, hay que actualizar su centro y geometría
y regenerar los dibujos. Los nombres, direcciones, textos y destinos de Google
Maps continúan usando los campos editables del administrador.

Son mapas estáticos orientativos con calles reales, sin rutas calculadas ni datos
de tráfico. No cargan scripts, iframes, servicios de mapas ni claves de Maps; el
enlace abre Google Maps para navegar. Los mapas principales de PC tienen un
máximo de 840 × 280 px; se conserva el tamaño móvil y de las miniaturas.
