import Link from "next/link";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaSeccion } from "@/lib/routes";

const SECCIONES = ["trabajos", "estudio", "noticias", "contacto"] as const;

/** Navegacion principal. En el diseno solo existe en la Home (spec §5.1). */
export function MainNav({
  idioma,
  className,
}: {
  idioma: Idioma;
  className?: string;
}) {
  const m = t(idioma);
  return (
    <nav aria-label={m.navegacion} className={className}>
      <ul className="flex flex-col">
        {SECCIONES.map((s) => (
          <li key={s}>
            <Link
              href={rutaSeccion(idioma, s)}
              className="text-label text-quiet uppercase transition-colors duration-fast ease-site hover:text-ink"
            >
              {m.nav[s]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
