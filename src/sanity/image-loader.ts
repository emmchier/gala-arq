import type { ImageLoaderProps } from "next/image";

/**
 * Loader global de imagenes (configurado en next.config.ts).
 *
 * Por que un loader propio y no el optimizador de Next: Sanity ya entrega la
 * imagen optimizada y del tamano pedido, y el optimizador de Next sobre
 * Workers es el punto debil del stack (spec §18.2). Con esto, `next/image`
 * sigue dando srcset, lazy loading y placeholder, pero **los bytes salen del
 * CDN de Sanity y no gastan CPU del Worker**.
 *
 * Va como archivo aparte porque un `loader` pasado por prop no puede cruzar
 * de Server Component a Client Component, y `next/image` es cliente.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);

  // Si la URL base traia alto, se escala junto con el ancho para no perder
  // la proporcion ni el recorte por hotspot.
  const baseW = Number(url.searchParams.get("w"));
  const baseH = Number(url.searchParams.get("h"));
  if (baseW > 0 && baseH > 0) {
    url.searchParams.set("h", String(Math.round(width * (baseH / baseW))));
  }

  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 85));
  if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
  return url.toString();
}
