import { PageFrame } from "@/components/layout/page-frame";
import { MainNav } from "@/components/layout/main-nav";
import { SocialLinks } from "@/components/layout/social-links";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { getConfiguracion } from "@/sanity/queries";
import { TRABAJOS_DESTACADOS_QUERY } from "@/sanity/queries/trabajo";
import type { Idioma } from "@/sanity/i18n";
import { rutaHome } from "@/lib/routes";

/** Home compartida por los dos idiomas (spec §5.2). */
export async function HomePage({ idioma }: { idioma: Idioma }) {
  const [destacados, config] = await Promise.all([
    sanityFetch({
      query: TRABAJOS_DESTACADOS_QUERY,
      params: { idioma },
      tags: [TAGS.trabajo],
    }),
    getConfiguracion(),
  ]);

  return (
    <PageFrame
      variant="home"
      idioma={idioma}
      destinos={{ es: rutaHome("es"), en: rutaHome("en") }}
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<MainNav idioma={idioma} />}
      sidebarBottom={
        <SocialLinks
          idioma={idioma}
          instagram={config?.instagram}
          behance={config?.behance}
        />
      }
    >
      <FeaturedCarousel idioma={idioma} trabajos={destacados} />
    </PageFrame>
  );
}
