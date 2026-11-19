import type { ClientReturn } from "@sanity/client";
import { client } from "./client";

/**
 * Wrapper de lectura (spec §7.1).
 *
 * Dos cosas que hace y que valen la pena:
 *
 * 1. **Obliga a etiquetar.** La revalidacion es ON-DEMAND, no por tiempo: el
 *    webhook de Sanity (paso 3.1) llama `revalidateTag` con estas etiquetas.
 *    Una query sin tag queda congelada hasta el proximo build, y eso no se
 *    nota hasta que Gala publica algo y no aparece.
 *
 * 2. **No pierde el tipo.** `ClientReturn<Q>` resuelve al tipo que genero
 *    `sanity typegen` para esa query, asi que no hay que pasar un generico a
 *    mano y no se puede pasar el equivocado.
 */
export async function sanityFetch<const Q extends string>({
  query,
  params = {},
  tags,
}: {
  query: Q;
  params?: Record<string, unknown>;
  tags: string[];
}): Promise<ClientReturn<Q>> {
  return client.fetch(query, params, { next: { tags } });
}

/** Etiquetas por tipo de documento. */
export const TAGS = {
  trabajo: "trabajo",
  configuracion: "configuracion",
} as const;
