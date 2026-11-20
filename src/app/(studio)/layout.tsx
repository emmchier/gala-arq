import type { Metadata, Viewport } from "next";
import "../globals.css";

/**
 * El Studio queda FUERA de los layouts de idioma (spec §10): sin header, sin
 * footer, sin la grilla del sitio, y excluido de la indexacion.
 *
 * Tambien resetea el peso base que el sitio fija en el <html>: el Studio trae
 * su propia tipografia y no tiene por que heredar la nuestra.
 */
export const metadata: Metadata = {
  title: "Gala Arq · Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-normal [font-weight:normal]">{children}</body>
    </html>
  );
}
