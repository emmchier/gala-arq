import Link from "next/link";
import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid } from "@/components/layout/project-grid";
import { SanityImage } from "@/components/sanity-image";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { TRABAJOS_LISTADO_QUERY } from "@/sanity/queries/trabajo";
import { CONFIGURACION_QUERY } from "@/sanity/queries/configuracion";

/**
 * Listado de trabajos (spec §5.3).
 * Grilla plana de 3 columnas, sin categorias ni filtros.
 */
export default async function TrabajosPage() {
  const [trabajos, config] = await Promise.all([
    sanityFetch({ query: TRABAJOS_LISTADO_QUERY, tags: [TAGS.trabajo] }),
    sanityFetch({ query: CONFIGURACION_QUERY, tags: [TAGS.configuracion] }),
  ]);

  return (
    <PageFrame
      variant="inner"
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<Breadcrumb backHref="/" current="Trabajos" />}
    >
      {/* segundo 25%: en el listado queda vacio (spec §5.3) */}
      <div className="hidden shrink-0 lg:block lg:w-[calc(var(--col-info)/0.75)]">
        <h1 className="sr-only">Trabajos</h1>
      </div>

      {/* ultimo 50% */}
      <div className="w-full lg:w-[calc(var(--col-media)/0.75)] lg:shrink-0">
        <ProjectGrid>
          {trabajos.map((t, i) => (
            <article key={t._id} className="flex flex-col gap-[3.5px]">
              <Link href={`/trabajos/${t.slug}`} className="group block">
                <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-secondary)]">
                  <SanityImage
                    image={t.portada}
                    aspect={1}
                    priority={i < 3}
                    sizes="(min-width: 1024px) 17vw, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-opacity duration-base ease-site group-hover:opacity-80"
                  />
                </div>
                <div className="pb-2 pt-[3.5px]">
                  <h2 className="text-body text-ink">{t.titulo}</h2>
                  <time className="text-meta text-quiet">{t.anio}</time>
                </div>
              </Link>
            </article>
          ))}
        </ProjectGrid>
      </div>
    </PageFrame>
  );
}
