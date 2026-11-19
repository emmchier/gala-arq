import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Cliente de lectura para el sitio publico.
 *
 * `useCdn: true` porque el sitio es estatico por defecto (spec §7.1): las
 * queries las hace el build, no el visitante, y la invalidacion llega por el
 * webhook de revalidacion (paso 3.1). Sin token: el dataset es publico.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
