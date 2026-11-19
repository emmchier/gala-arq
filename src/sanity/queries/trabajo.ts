import { defineQuery } from "next-sanity";

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
    portada
  }
`);

/** Carrusel de la Home: solo las destacadas (spec §5.2). */
export const TRABAJOS_DESTACADOS_QUERY = defineQuery(`
  *[_type == "trabajo" && destacado == true && defined(slug.current)]
  | order(orderRank)
  {
    _id,
    titulo,
    "slug": slug.current,
    portada
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
    portada,
    galeria[]{ _key, ..., },
    seoTitle,
    seoDescription,
    orderRank
  }
`);

/** PREV y NEXT navegan el orden curado, no la fecha (spec §5.4). */
export const TRABAJO_VECINOS_QUERY = defineQuery(`
  {
    "anterior": *[_type == "trabajo" && defined(slug.current) && orderRank < $orderRank]
      | order(orderRank desc)[0]{ titulo, "slug": slug.current },
    "siguiente": *[_type == "trabajo" && defined(slug.current) && orderRank > $orderRank]
      | order(orderRank asc)[0]{ titulo, "slug": slug.current }
  }
`);

/** Para generateStaticParams. */
export const TRABAJOS_SLUGS_QUERY = defineQuery(`
  *[_type == "trabajo" && defined(slug.current)].slug.current
`);
