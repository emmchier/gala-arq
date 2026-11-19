import type { Metadata } from "next";
import { Manrope, Josefin_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Gala Arq",
  description: "Estudio de arquitectura",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${josefinSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
