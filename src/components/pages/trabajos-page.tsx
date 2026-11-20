import Link from "next/link";
import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid } from "@/components/layout/project-grid";
import { SanityImage } from "@/components/sanity-image";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { getConfiguracion } from "@/sanity/queries";
import { TRABAJOS_LISTADO_QUERY } from "@/sanity/queries/trabajo";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaHome, rutaTrabajo, rutaTrabajos } from "@/lib/routes";

/** Listado de trabajos (spec §5.3). Grilla plana, sin categorias ni filtros. */
export async function TrabajosPage({ idioma }: { idioma: Idioma }) {
  const [trabajos, config] = await Promise.all([
    sanityFetch({
      query: TRABAJOS_LISTADO_QUERY,
      params: { idioma },
      tags: [TAGS.trabajo],
    }),
    getConfiguracion(),
  ]);

  const m = t(idioma);

  return (
    <PageFrame
      variant="inner"
      idioma={idioma}
      destinos={{ es: rutaTrabajos("es"), en: rutaTrabajos("en") }}
      config={config ?? { nombreEstudio: null }}
      sidebarTop={
        <Breadcrumb
          idioma={idioma}
          backHref={rutaHome(idioma)}
          current={m.nav.trabajos}
        />
      }
    >
      <div className="hidden lg:block">
        <h1 className="sr-only">{m.nav.trabajos}</h1>
      </div>

      <div className="w-full">
        <ProjectGrid>
          {trabajos.map((trabajo, i) => (
            <article key={trabajo._id} className="flex flex-col gap-[3.5px]">
              <Link
                href={rutaTrabajo(idioma, trabajo.slug ?? "")}
                className="group block"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-secondary)]">
                  <SanityImage
                    image={trabajo.portada}
                    aspect={1}
                    priority={i < 3}
                    sizes="(min-width: 1024px) 17vw, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-opacity duration-base ease-site group-hover:opacity-80"
                  />
                </div>
                <div className="pb-2 pt-[3.5px]">
                  <h2 className="text-body text-ink">{trabajo.titulo}</h2>
                  <time className="text-meta text-quiet">{trabajo.anio}</time>
                </div>
              </Link>
            </article>
          ))}
        </ProjectGrid>
      </div>
    </PageFrame>
  );
}
