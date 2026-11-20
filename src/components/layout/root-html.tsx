import type { ReactNode } from "react";
import { Manrope, Josefin_Sans } from "next/font/google";
import type { Idioma } from "@/sanity/i18n";

// spec §4.2 — Manrope para todo el sitio, Josefin Sans solo para el logo.
// El peso base es 400 (regular): el 300 del Figma se veia demasiado fragil.
// El 300 queda para el idioma inactivo del switcher.
// latin-ext hace falta por los acentos del espanol.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  display: "swap",
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "500"],
  display: "swap",
});

/**
 * `<html>` del sitio. Hay un layout raiz POR IDIOMA (spec §9.3), para que
 * `lang` sea el correcto sin necesidad de middleware.
 */
export function RootHtml({
  idioma,
  children,
}: {
  idioma: Idioma;
  children: ReactNode;
}) {
  return (
    <html
      lang={idioma}
      className={`${manrope.variable} ${josefinSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
