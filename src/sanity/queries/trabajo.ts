import { defineQuery } from "next-sanity";
import { IMAGEN } from "./fragments";

/**
 * Queries de trabajos (spec §8.5).
 *
 * Regla: cada query pide SOLO los campos que usa. El listado no trae
 * `galeria` ni `descripcion`, que son lo pesado del documento.
 *
 * `defineQuery` no hace nada en runtime: marca el string para que
 * `sanity typegen` genere el tipo del resultado.
 */

/** Listado /trabajos: nombre, año y portada. Nada más (spec §5.3). */
export const TRABAJOS_LISTADO_QUERY = defineQuery(`
  *[_type == "trabajo" && defined(slug.current)]
  | order(orderRank)
  {
    _id,
    titulo,
    "slug": slug.current,
    anio,
    portada ${IMAGEN}
  }
`);

/** Carrusel de la Home: solo los destacados (spec §5.2). */
export const TRABAJOS_DESTACADOS_QUERY = defineQuery(`
  *[_type == "trabajo" && destacado == true && defined(slug.current)]
  | order(orderRank)
  {
    _id,
    titulo,
    "slug": slug.current,
    portada ${IMAGEN}
  }
`);

/** Ficha /trabajos/[slug]: el documento completo. */
export const TRABAJO_QUERY = defineQuery(`
  *[_type == "trabajo" && slug.current == $slug][0]
  {
    _id,
    titulo,
    "slug": slug.current,
    ubicacion,
    anio,
    descripcion,
    creditos[]{ _key, rol, valor },
    portada ${IMAGEN},
    galeria[] ${IMAGEN},
    seoTitle,
    seoDescription,
    orderRank,

    // Los vecinos viajan en la MISMA ida (spec §8.5). Antes eran una query
    // aparte por ficha, que duplicaba los requests sin necesidad.
    "anterior": *[_type == "trabajo" && defined(slug.current) && orderRank < ^.orderRank]
      | order(orderRank desc)[0]{ titulo, "slug": slug.current },
    "siguiente": *[_type == "trabajo" && defined(slug.current) && orderRank > ^.orderRank]
      | order(orderRank asc)[0]{ titulo, "slug": slug.current }
  }
`);

/** Para generateStaticParams. */
export const TRABAJOS_SLUGS_QUERY = defineQuery(`
  *[_type == "trabajo" && defined(slug.current)].slug.current
`);
