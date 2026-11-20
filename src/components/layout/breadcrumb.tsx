import Link from "next/link";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";

export type Miga = {
  label: string;
  /** `null` = es la pagina actual y NO es clickeable. */
  href: string | null;
};

/**
 * Breadcrumb del sidebar (spec §5.1).
 *
 * Sigue el orden de navegacion: `INICIO / TRABAJOS`. El ultimo item es
 * clickeable **solo si no es la pagina actual**: en el listado, "Trabajos" es
 * el current y queda sin link; en la ficha, lleva de vuelta al listado.
 *
 * La flecha apunta al ultimo item que SI es navegable, que es el "volver"
 * real de esa pantalla.
 */
export function Breadcrumb({
  idioma,
  migas,
  className,
}: {
  idioma: Idioma;
  migas: Miga[];
  className?: string;
}) {
  const navegables = migas.filter((m) => m.href);
  const volver = navegables.at(-1)?.href ?? null;

  return (
    <nav aria-label={t(idioma).migaDePan} className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-label text-ink uppercase">
        {volver ? (
          <li className="flex items-center">
            <Link
              href={volver}
              aria-hidden
              tabIndex={-1}
              className="group flex items-center pr-1"
            >
              <svg
                viewBox="0 0 14 11"
                className="h-[10px] w-[14px] shrink-0 transition-transform duration-fast ease-site group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M5.5 1 1 5.5 5.5 10M1 5.5h13" />
              </svg>
            </Link>
          </li>
        ) : null}

        {migas.map((miga, i) => (
          <li key={miga.label} className="flex items-center gap-1">
            {i > 0 ? (
              <span aria-hidden className="text-quiet">
                /
              </span>
            ) : null}
            {miga.href ? (
              <Link
                href={miga.href}
                className="transition-colors duration-fast ease-site hover:text-quiet"
              >
                {miga.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-quiet">
                {miga.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
