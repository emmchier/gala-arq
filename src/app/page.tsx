import { PageFrame } from "@/components/layout/page-frame";
import { MainNav } from "@/components/layout/main-nav";
import { SocialLinks } from "@/components/layout/social-links";
import { SanityImage } from "@/components/sanity-image";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { TRABAJOS_DESTACADOS_QUERY } from "@/sanity/queries/trabajo";
import { CONFIGURACION_QUERY } from "@/sanity/queries/configuracion";

const DOTS = [
  "bg-dot-1",
  "bg-dot-2",
  "bg-dot-3",
  "bg-dot-4",
  "bg-dot-5",
] as const;
const DOTS_ON = [
  "bg-dot-1-on",
  "bg-dot-2-on",
  "bg-dot-3-on",
  "bg-dot-4-on",
  "bg-dot-5-on",
] as const;

export default async function HomePage() {
  const [destacados, config] = await Promise.all([
    sanityFetch({ query: TRABAJOS_DESTACADOS_QUERY, tags: [TAGS.trabajo] }),
    sanityFetch({ query: CONFIGURACION_QUERY, tags: [TAGS.configuracion] }),
  ]);

  const primero = destacados[0];

  return (
    <PageFrame
      variant="home"
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<MainNav />}
      sidebarBottom={
        <SocialLinks
          instagram={config?.instagram}
          behance={config?.behance}
        />
      }
    >
      {/* Paso 1.4: primera destacada fija. El carrusel llega en el paso 1.6. */}
      <section
        aria-label="Trabajos destacados"
        className="flex min-h-0 flex-1 flex-col gap-5"
      >
        <div className="flex shrink-0 items-center gap-[10px]">
          {destacados.map((t, i) => (
            <span
              key={t._id}
              className={`size-[10px] rounded-full ${
                i === 0 ? DOTS_ON[i % 5] : DOTS[i % 5]
              }`}
            />
          ))}
        </div>
        <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-[color:var(--color-secondary)]">
          {primero ? (
            <SanityImage
              image={primero.portada}
              priority
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </div>
      </section>
    </PageFrame>
  );
}
