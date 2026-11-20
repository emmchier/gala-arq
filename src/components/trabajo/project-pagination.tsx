import Link from "next/link";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaTrabajo } from "@/lib/routes";

type Vecino = { titulo: string | null; slug: string | null } | null;

/**
 * PREV · NEXT al pie de la columna fija (spec §5.4).
 * Navega el ORDEN CURADO, no la fecha.
 */
export function ProjectPagination({
  idioma,
  anterior,
  siguiente,
}: {
  idioma: Idioma;
  anterior: Vecino;
  siguiente: Vecino;
}) {
  if (!anterior && !siguiente) return null;
  const m = t(idioma);

  const item = (t: Vecino, label: string) =>
    t?.slug ? (
      <Link
        href={rutaTrabajo(idioma, t.slug)}
        className="text-label text-ink uppercase transition-colors duration-fast ease-site hover:text-quiet"
        aria-label={`${label}: ${t.titulo ?? ""}`}
      >
        {label}
      </Link>
    ) : (
      <span className="text-label text-quiet uppercase">{label}</span>
    );

  return (
    <nav
      aria-label={m.navegacionEntreTrabajos}
      className="flex items-center gap-2"
    >
      {item(anterior, m.prev)}
      <span aria-hidden className="text-label text-quiet">
        &middot;
      </span>
      {item(siguiente, m.next)}
    </nav>
  );
}
