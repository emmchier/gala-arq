import type { Metadata } from "next";
import { TrabajoPage } from "@/components/pages/trabajo-page";
import { generarMetadata, generarSlugs } from "@/components/pages/trabajo-meta";

export const generateStaticParams = () => generarSlugs("es");

export async function generateMetadata({
  params,
}: PageProps<"/trabajos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return generarMetadata("es", slug);
}

export default async function Page({ params }: PageProps<"/trabajos/[slug]">) {
  const { slug } = await params;
  return <TrabajoPage idioma="es" slug={slug} />;
}
