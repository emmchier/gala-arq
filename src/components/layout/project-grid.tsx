import type { ReactNode } from "react";

/**
 * Grilla de medios (spec §4.5): 3 columnas con gap de 8, celda cuadrada.
 * Las celdas son FLUIDAS: ocupan un tercio del 50% del contenido, asi que
 * siguen al ancho del navegador. En el Figma miden 204 a 1366px.
 * En mobile baja a 2 columnas (spec §5.5).
 */
export function ProjectGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-2 gap-[var(--cell-gap)] md:grid-cols-3">
      {children}
    </div>
  );
}

/** Celda cuadrada con recorte cover. El hotspot de Sanity decide el encuadre. */
export function GridCell({ children }: { children?: ReactNode }) {
  return (
    <div className="aspect-square w-full overflow-hidden bg-[color:var(--color-secondary)]">
      {children}
    </div>
  );
}
