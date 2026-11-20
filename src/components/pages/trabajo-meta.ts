import type { Metadata } from "next";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { getTrabajo } from "@/sanity/queries";
import { TRABAJOS_SLUGS_QUERY } from "@/sanity/queries/trabajo";
import { IDS_IDIOMA, type Idioma } from "@/sanity/i18n";
import { rutaTrabajo } from "@/lib/routes";

/** Slugs de un idioma, para `generateStaticParams`. */
export async function generarSlugs(idioma: Idioma) {
  const slugs = await sanityFetch({
    query: TRABAJOS_SLUGS_QUERY,
    params: { idioma },
    tags: [TAGS.trabajo],
  });
  return slugs.filter(Boolean).map((slug) => ({ slug: slug as string }));
}

/**
 * Metadata de una ficha, con `hreflang` reciproco (spec §9.3).
 * Los slugs no coinciden entre idiomas, asi que cada alternativa se resuelve
 * desde el documento de traduccion.
 */
export async function generarMetadata(
  idioma: Idioma,
  slug: string,
): Promise<Metadata> {
  const trabajo = await getTrabajo(slug, idioma);
  if (!trabajo) return {};

  const languages: Record<string, string> = {};
  for (const id of IDS_IDIOMA) {
    if (id === idioma) {
      languages[id] = rutaTrabajo(id, slug);
      continue;
    }
    const tr = trabajo.traducciones?.find((x) => x?.idioma === id);
    if (tr?.slug) languages[id] = rutaTrabajo(id, tr.slug);
  }

  return {
    title: trabajo.seoTitle ?? trabajo.titulo ?? undefined,
    description: trabajo.seoDescription ?? undefined,
    alternates: {
      canonical: rutaTrabajo(idioma, slug),
      languages: { ...languages, "x-default": rutaTrabajo("es", slug) },
    },
    openGraph: trabajo.portada?.asset?.url
      ? { images: [{ url: trabajo.portada.asset.url }] }
      : undefined,
  };
}
