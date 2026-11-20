import type { Metadata } from "next";
import { TrabajoPage } from "@/components/pages/trabajo-page";
import { generarMetadata, generarSlugs } from "@/components/pages/trabajo-meta";

export const generateStaticParams = () => generarSlugs("en");

export async function generateMetadata({
  params,
}: PageProps<"/en/works/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return generarMetadata("en", slug);
}

export default async function Page({ params }: PageProps<"/en/works/[slug]">) {
  const { slug } = await params;
  return <TrabajoPage idioma="en" slug={slug} />;
}
