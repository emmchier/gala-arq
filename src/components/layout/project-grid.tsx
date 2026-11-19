import type { ReactNode } from "react";

/**
 * Grilla de medios (spec §4.5): 3 columnas, celda cuadrada de 204, gap 8.
 * Es la MISMA en el Listado y en la Ficha: cambia solo que se renderiza
 * adentro de cada celda. En mobile baja a 2 columnas (spec §5.5).
 */
export function ProjectGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-[var(--cell-gap)] md:grid-cols-3">
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
