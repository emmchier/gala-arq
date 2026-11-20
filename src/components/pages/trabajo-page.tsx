import { notFound } from "next/navigation";
import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid } from "@/components/layout/project-grid";
import { SanityImage } from "@/components/sanity-image";
import { ProjectCredits } from "@/components/trabajo/project-credits";
import { ProjectDescription } from "@/components/trabajo/project-description";
import { ProjectPagination } from "@/components/trabajo/project-pagination";
import { getConfiguracion, getTrabajo } from "@/sanity/queries";
import { IDS_IDIOMA, type Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaTrabajo, rutaTrabajos } from "@/lib/routes";

/**
 * Ficha de trabajo (spec §5.4). Variante 07: la galeria es una cuadricula.
 */
export async function TrabajoPage({
  idioma,
  slug,
}: {
  idioma: Idioma;
  slug: string;
}) {
  const [trabajo, config] = await Promise.all([
    getTrabajo(slug, idioma),
    getConfiguracion(),
  ]);

  if (!trabajo) notFound();

  const m = t(idioma);

  // El switcher necesita el slug del OTRO idioma, que no es el mismo.
  // Si esa traduccion no existe, el idioma queda deshabilitado.
  const destinos = Object.fromEntries(
    IDS_IDIOMA.map((id) => {
      if (id === idioma) return [id, rutaTrabajo(id, slug)];
      const tr = trabajo.traducciones?.find((x) => x?.idioma === id);
      return [id, tr?.slug ? rutaTrabajo(id, tr.slug) : null];
    }),
  ) as Partial<Record<Idioma, string | null>>;

  return (
    <PageFrame
      variant="inner"
      idioma={idioma}
      destinos={destinos}
      config={config ?? { nombreEstudio: null }}
      sidebarTop={
        <Breadcrumb
          idioma={idioma}
          backHref={rutaTrabajos(idioma)}
          current={m.nav.trabajos}
        />
      }
      sidebarBottom={
        <ProjectPagination
          idioma={idioma}
          anterior={trabajo.anterior}
          siguiente={trabajo.siguiente}
        />
      }
    >
      {/* 30%: la ficha. Padding solo a la derecha (spec §4.5). */}
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
