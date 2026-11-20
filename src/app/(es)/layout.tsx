import type { Metadata } from "next";
import { RootHtml } from "@/components/layout/root-html";
import "../globals.css";

export const metadata: Metadata = {
  title: "Gala Arq",
  description: "Estudio de arquitectura",
};

export default function LayoutEs({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootHtml idioma="es">{children}</RootHtml>;
}
