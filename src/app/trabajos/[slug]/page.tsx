import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid } from "@/components/layout/project-grid";
import { SanityImage } from "@/components/sanity-image";
import { ProjectCredits } from "@/components/trabajo/project-credits";
import { ProjectDescription } from "@/components/trabajo/project-description";
import { ProjectPagination } from "@/components/trabajo/project-pagination";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import {
  TRABAJO_QUERY,
  TRABAJO_VECINOS_QUERY,
  TRABAJOS_SLUGS_QUERY,
} from "@/sanity/queries/trabajo";
import { CONFIGURACION_QUERY } from "@/sanity/queries/configuracion";

export async function generateStaticParams() {
  const slugs = await sanityFetch({
    query: TRABAJOS_SLUGS_QUERY,
    tags: [TAGS.trabajo],
  });
  return slugs.filter(Boolean).map((slug) => ({ slug: slug as string }));
}

export async function generateMetadata({
  params,
}: PageProps<"/trabajos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await sanityFetch({
    query: TRABAJO_QUERY,
    params: { slug },
    tags: [TAGS.trabajo],
  });
  if (!t) return {};

  return {
    title: t.seoTitle ?? t.titulo ?? undefined,
    description: t.seoDescription ?? undefined,
    openGraph: t.portada?.asset?.url
      ? { images: [{ url: t.portada.asset.url }] }
      : undefined,
  };
}

/** Ficha de trabajo (spec §5.4). Variante 07: la galería es una cuadrícula. */
export default async function TrabajoPage({
  params,
}: PageProps<"/trabajos/[slug]">) {
  const { slug } = await params;

  const [trabajo, config] = await Promise.all([
    sanityFetch({
      query: TRABAJO_QUERY,
      params: { slug },
      tags: [TAGS.trabajo],
    }),
    sanityFetch({ query: CONFIGURACION_QUERY, tags: [TAGS.configuracion] }),
  ]);

  if (!trabajo) notFound();

  const vecinos = await sanityFetch({
    query: TRABAJO_VECINOS_QUERY,
    params: { orderRank: trabajo.orderRank ?? "" },
    tags: [TAGS.trabajo],
  });

  return (
    <PageFrame
      variant="inner"
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<Breadcrumb backHref="/trabajos" current="Trabajos" />}
      sidebarBottom={
        <ProjectPagination
          anterior={vecinos.anterior}
          siguiente={vecinos.siguiente}
        />
      }
    >
      {/* segundo 25%: la ficha.
          64px de padding lateral para que el texto no se pegue ni a la
          columna fija ni a la grilla de imagenes (spec §4.5). */}
      <div className="flex shrink-0 flex-col gap-6 lg:w-[calc(var(--col-info)/0.75)] lg:px-[var(--page-gutter)]">
        <header className="flex flex-col gap-2">
          <h1 className="text-display text-ink">{trabajo.titulo}</h1>
          {trabajo.ubicacion ? (
            <p className="text-body text-quiet">{trabajo.ubicacion}</p>
          ) : null}
          {trabajo.anio ? (
            <time className="text-body text-quiet">{trabajo.anio}</time>
          ) : null}
        </header>

        <ProjectDescription value={trabajo.descripcion} />
        <ProjectCredits creditos={trabajo.creditos} />
      </div>

      {/* ultimo 50%: la galería */}
      <div className="w-full lg:w-[calc(var(--col-media)/0.75)] lg:shrink-0">
        <ProjectGrid>
          {(trabajo.galeria ?? []).map((foto, i) => (
            <figure
              key={foto._key}
              className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-secondary)]"
            >
              <SanityImage
                image={foto}
                aspect={1}
                priority={i < 3}
                sizes="(min-width: 1024px) 17vw, (min-width: 768px) 30vw, 45vw"
                className="object-cover"
              />
            </figure>
          ))}
        </ProjectGrid>
      </div>
    </PageFrame>
  );
}
