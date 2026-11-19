import Link from "next/link";

type Vecino = { titulo: string | null; slug: string | null } | null;

/**
 * PREV · NEXT al pie de la columna fija (spec §5.4).
 * Navega el ORDEN CURADO, no la fecha.
 */
export function ProjectPagination({
  anterior,
  siguiente,
}: {
  anterior: Vecino;
  siguiente: Vecino;
}) {
  if (!anterior && !siguiente) return null;

  const item = (t: Vecino, label: string) =>
    t?.slug ? (
      <Link
        href={`/trabajos/${t.slug}`}
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
      aria-label="Navegación entre trabajos"
      className="flex items-center gap-2"
    >
      {item(anterior, "Prev")}
      <span aria-hidden className="text-label text-quiet">
        &middot;
      </span>
      {item(siguiente, "Next")}
    </nav>
  );
}
