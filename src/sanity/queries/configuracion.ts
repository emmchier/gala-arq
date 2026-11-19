import { defineQuery } from "next-sanity";

/** Singleton con los datos del sitio (spec §8.2). Se consume en el layout. */
export const CONFIGURACION_QUERY = defineQuery(`
  *[_type == "configuracion"][0]
  {
    nombreEstudio,
    textoEstudio,
    retrato,
    email,
    telefono,
    direccion,
    instagram,
    behance,
    cv,
    textoLegal
  }
`);
