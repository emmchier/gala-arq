/**
 * Fragmentos reusables de GROQ.
 *
 * `IMAGEN` trae lo minimo que `SanityImage` necesita para no causar layout
 * shift ni flashes: las dimensiones reales y el LQIP, que es el placeholder
 * borroso que Sanity genera solo (spec §18.1).
 */
export const IMAGEN = `{
  ...,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height, aspectRatio } }
  }
}`;
