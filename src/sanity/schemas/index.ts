import type { SchemaTypeDefinition } from "sanity";

import { trabajo } from "./documents/trabajo";
import { configuracion } from "./documents/configuracion";
import { credito } from "./objects/credito";

/**
 * Schemas del proyecto (spec §8).
 * `noticia` llega en la fase 4, cuando exista el diseno de esa pantalla.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  trabajo,
  configuracion,
  credito,
];

/** Tipos que son singleton: uno solo, con _id fijo igual al nombre. */
export const singletonTypes = new Set(["configuracion"]);
