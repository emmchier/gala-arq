import type { StructureResolver } from "sanity/structure";

/**
 * Estructura del Studio. Por ahora vacia: los schemas llegan en el paso 1.2,
 * y ahi se arma el listado ordenable de obras y el singleton de configuracion
 * (spec §12.2).
 */
export const structure: StructureResolver = (S) =>
  S.list().title("Contenido").items(S.documentTypeListItems());
