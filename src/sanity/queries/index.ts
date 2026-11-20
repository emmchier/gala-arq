import { cache } from "react";
import { sanityFetch, TAGS } from "../fetch";
import { TRABAJO_QUERY } from "./trabajo";
import { IDIOMA_BASE, type Idioma } from "../i18n";
import { CONFIGURACION_QUERY } from "./configuracion";

/**
 * Lecturas memoizadas (spec §8.5).
 *
 * `cache()` de React deduplica dentro de un mismo render. Sin esto, la ficha
 * pedia el mismo trabajo DOS veces: una en `generateMetadata` y otra en el
 * componente. Con 10 trabajos eran 10 idas de mas, por build.
 */
export const getTrabajo = cache((slug: string, idioma: Idioma = IDIOMA_BASE) =>
  sanityFetch({
    query: TRABAJO_QUERY,
    params: { slug, idioma },
    tags: [TAGS.trabajo],
  }),
);

export const getConfiguracion = cache(() =>
  sanityFetch({ query: CONFIGURACION_QUERY, tags: [TAGS.configuracion] }),
);
