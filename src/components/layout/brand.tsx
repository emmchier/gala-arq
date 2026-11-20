import Link from "next/link";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaHome } from "@/lib/routes";

/** Logo. Josefin Sans: "gala" en Light, "arq" en Medium (spec §4.2). */
export function Brand({ idioma }: { idioma: Idioma }) {
  return (
    <Link
      href={rutaHome(idioma)}
      className="text-brand font-brand text-ink"
      aria-label={t(idioma).irAlInicio}
    >
      <span className="font-light">gala</span>{" "}
      <span className="font-medium">arq</span>
    </Link>
  );
}
