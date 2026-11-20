import { PageFrame } from "@/components/layout/page-frame";
import { MainNav } from "@/components/layout/main-nav";
import { SocialLinks } from "@/components/layout/social-links";
import { FeaturedCarousel } from "@/components/home/featured-carousel";
import { sanityFetch, TAGS } from "@/sanity/fetch";
import { TRABAJOS_DESTACADOS_QUERY } from "@/sanity/queries/trabajo";
import { getConfiguracion } from "@/sanity/queries";

export default async function HomePage() {
  const [destacados, config] = await Promise.all([
    sanityFetch({ query: TRABAJOS_DESTACADOS_QUERY, tags: [TAGS.trabajo] }),
    getConfiguracion(),
  ]);

  return (
    <PageFrame
      variant="home"
      config={config ?? { nombreEstudio: null }}
      sidebarTop={<MainNav />}
      sidebarBottom={
        <SocialLinks instagram={config?.instagram} behance={config?.behance} />
      }
    >
      <FeaturedCarousel trabajos={destacados} />
    </PageFrame>
  );
}
