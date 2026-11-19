import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Ancho de referencia. El loader lo reemplaza en cada entrada del srcset. */
const REF = 2000;

/**
 * URL base de una imagen de Sanity (spec §18.2).
 *
 * Si se pide `aspect`, la URL sale con `w` y `h` de referencia mas
 * `fit=crop&crop=focalpoint`. El loader global despues escala **los dos
 * juntos**, manteniendo la proporcion.
 *
 * ⚠️ El `h` no es opcional: sin el, Sanity devuelve la imagen en su
 * proporcion original y el recorte lo termina haciendo `object-cover` en el
 * browser, **centrado y sin mirar el hotspot**. En una foto de arquitectura
 * eso pierde el edificio (spec §18.1). Verificado el 19/11/2026.
 */
export function imageSrc(image: Image, aspect?: number): string {
  let b = builder.image(image).auto("format");

  if (aspect) {
    b = b
      .width(REF)
      .height(Math.round(REF / aspect))
      .fit("crop")
      .crop("focalpoint");
  }

  return b.url();
}
