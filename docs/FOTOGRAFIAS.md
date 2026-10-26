# Fotografías del alojamiento

Se prepararon 48 fotografías entregadas por el cliente en formato WebP. Los archivos originales permanecen intactos en las carpetas de origen. Las copias web eliminan metadatos, conservan la proporción original y limitan el lado mayor a 1600 px. El conjunto ocupa aproximadamente 4,47 MB; las galerías deben cargarse bajo demanda.

La habitación 2 tiene cuatro fotos. Los departamentos 1, 2 y 3 tienen 13, 10 y 12 fotos respectivamente. Las primeras tres de cada propiedad se eligieron para presentar dormitorio, estar y cocina o una segunda vista representativa. Su orden y el resto de la galería se pueden modificar en el panel. Las fotografías de áreas comunes están vinculadas a cada ubicación, con descripciones que distinguen los espacios del edificio de los interiores privados.

Las imágenes de piscina que el cliente incluyó en la carpeta del departamento 1 se mantienen en su galería; no se promete disponibilidad, temporada ni condiciones de uso en la ficha del inmueble.

## Restauración con IA

Se utilizó la herramienta integrada **ImageGen**, sin CLI ni API key, para restaurar las tres portadas del departamento 2, cuyos originales tenían 512 × 683 px. Se compararon los resultados con las fotografías originales antes de seleccionarlos. Los demás archivos sólo recibieron preparación para la web.

Archivos finales:

- `public/media/depto-2/01.webp`: dormitorio.
- `public/media/depto-2/02.webp`: estar y balcón.
- `public/media/depto-2/03.webp`: cocina y comedor.

Prompt aplicado por separado a cada fotografía original:

> Restore this actual property photograph for its accommodation website. This is a faithful image-quality restoration, not a redesign or virtual staging. Increase usable resolution and gently recover clarity lost to WhatsApp JPEG compression; modestly reduce compression noise and balance exposure while preserving realistic natural colors. Preserve the exact vertical 3:4 framing, camera position, perspective, room geometry, visible objects, furniture, upholstery/bed linens patterns, appliance positions, wall decor, lighting fixtures, window/balcony details and outside view. Do not add or remove furniture, decoration, amenities, windows, doors, extra space or architectural detail. Do not change time of day or make the apartment look newer, larger or more luxurious. Keep the real imperfections. No text, borders, collage, watermark or artificial HDR. Return a single conservative, photorealistic restored version of the attached photograph.

`src/lib/photo-seed.json` guarda únicamente las rutas públicas y descripciones alternativas; no contiene rutas privadas del computador ni datos EXIF.
