import { defineQuery } from "next-sanity";
import { IMAGEN } from "./fragments";

/** Singleton con los datos del sitio (spec §8.2). Se consume en el layout. */
export const CONFIGURACION_QUERY = defineQuery(`
  *[_type == "configuracion"][0]
  {
    nombreEstudio,
    textoEstudio,
    retrato ${IMAGEN},
    email,
    telefono,
    direccion,
    instagram,
    behance,
    cv,
    textoLegal
  }
`);
