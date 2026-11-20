import Link from "next/link";
import { IDIOMAS, type Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";

/**
 * Switcher EN · ES (spec §5.1).
 * El idioma activo va en ink peso 400; el inactivo en quiet peso 300.
 *
 * `destinos` lo arma cada pagina, porque **el equivalente depende de la ruta
 * y del slug**: en una ficha, `casa-elen` y `elen-house` son documentos
 * distintos (spec §9.1.b). Si no hay equivalente, el idioma se deshabilita.
 */
export function LanguageSwitcher({
  idioma,
  destinos,
}: {
  idioma: Idioma;
  destinos: Partial<Record<Idioma, string | null>>;
}) {
  return (
    <nav aria-label={t(idioma).idioma} className="flex items-center gap-1.5">
      {IDIOMAS.map((l, i) => {
        const activo = l.id === idioma;
        const href = destinos[l.id];
        const etiqueta = l.id.toUpperCase();

        return (
          <span key={l.id} className="flex items-center gap-1.5">
            {i > 0 ? (
              <span aria-hidden className="text-ui text-quiet">
                &middot;
              </span>
            ) : null}
            {activo || !href ? (
              <span
                aria-current={activo ? "true" : undefined}
                aria-disabled={!activo && !href ? "true" : undefined}
                className={
                  activo
                    ? "text-ui text-ink font-normal"
                    : "text-ui text-quiet font-light opacity-50"
                }
              >
                {etiqueta}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={l.id}
                className="text-ui text-quiet font-light transition-colors duration-fast ease-site hover:text-ink"
              >
                {etiqueta}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
