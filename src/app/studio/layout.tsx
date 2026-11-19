import type { Metadata, Viewport } from "next";

/**
 * El Studio queda FUERA del layout publico (spec §10): sin header, sin
 * footer, sin la grilla del sitio, y excluido de la indexacion.
 *
 * Tambien resetea el peso 300 que el sitio fija en el <html> (spec §4.8):
 * el Studio trae su propia tipografia y no tiene por que heredar la nuestra.
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
  return <div className="font-normal [font-weight:normal]">{children}</div>;
}
