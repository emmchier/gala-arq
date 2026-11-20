import type { Metadata } from "next";
import { RootHtml } from "@/components/layout/root-html";
import "../globals.css";

export const metadata: Metadata = {
  title: "Gala Arq",
  description: "Architecture studio",
};

export default function LayoutEn({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootHtml idioma="en">{children}</RootHtml>;
}
