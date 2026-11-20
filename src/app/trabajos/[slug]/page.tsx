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
import { TRABAJOS_SLUGS_QUERY } from "@/sanity/queries/trabajo";
import { getConfiguracion, getTrabajo } from "@/sanity/queries";

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
  const t = await getTrabajo(slug);
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
    getTrabajo(slug),
    getConfiguracion(),
  ]);

  if (!trabajo) notFound();

  return (
    <PageFrame
      variant="inner"
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<Breadcrumb backHref="/trabajos" current="Trabajos" />}
      sidebarBottom={
        <ProjectPagination
          anterior={trabajo.anterior}
          siguiente={trabajo.siguiente}
        />
      }
    >
      {/* 30%: la ficha. Padding solo a la derecha, que es donde esta la
          grilla de imagenes (spec §4.5). */}
      <div className="flex flex-col gap-6 lg:pr-[var(--page-gutter)]">
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

      {/* 50%: la galería */}
      <div className="w-full">
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
