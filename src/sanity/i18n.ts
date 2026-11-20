/**
 * Idiomas del sitio (spec §9).
 *
 * `es` es el idioma base y va SIN prefijo en la URL; `en` va prefijado.
 * Esta lista es la unica fuente: la usan los dos plugins de Sanity y, a
 * partir del paso 2.2, el routing de Next.
 */
export const IDIOMAS = [
  { id: "es", title: "Español" },
  { id: "en", title: "English" },
] as const;

export const IDIOMA_BASE = "es" as const;

export type Idioma = (typeof IDIOMAS)[number]["id"];

export const IDS_IDIOMA = IDIOMAS.map((l) => l.id) as readonly Idioma[];
