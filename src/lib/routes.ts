import type { Idioma } from "@/sanity/i18n";

/**
 * Mapa de rutas por idioma (spec §9.3).
 *
 * Los segmentos SE TRADUCEN: `/trabajos` en español y `/en/works` en inglés.
 * Mejor para SEO en cada idioma, y es lo que hace el sitio de referencia.
 *
 * ⚠️ **Sin middleware, a proposito.** La alternativa habitual (`next-intl`
 * con `localePrefix: 'as-needed'`) necesita middleware, y eso haria que
 * **cada visita invoque el Worker**. Hoy las visitas pegan a static assets,
 * que en Cloudflare son gratis e ilimitados (spec §7.1, §17.2). Las rutas se
 * declaran a mano, una carpeta por idioma, y todo sigue siendo estatico.
 */
export const SEGMENTOS = {
  es: {
    trabajos: "trabajos",
    estudio: "estudio",
    noticias: "noticias",
    contacto: "contacto",
  },
  en: {
    trabajos: "works",
    estudio: "studio",
    noticias: "news",
    contacto: "contact",
  },
} as const satisfies Record<Idioma, Record<string, string>>;

/** Prefijo de idioma. `es` es el base y va sin prefijo. */
export const prefijo = (idioma: Idioma) => (idioma === "es" ? "" : `/${idioma}`);

export const rutaHome = (idioma: Idioma) => prefijo(idioma) || "/";

export const rutaTrabajos = (idioma: Idioma) =>
  `${prefijo(idioma)}/${SEGMENTOS[idioma].trabajos}`;

export const rutaTrabajo = (idioma: Idioma, slug: string) =>
  `${rutaTrabajos(idioma)}/${slug}`;

export const rutaSeccion = (
  idioma: Idioma,
  seccion: keyof (typeof SEGMENTOS)["es"],
) => `${prefijo(idioma)}/${SEGMENTOS[idioma][seccion]}`;
