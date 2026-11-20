import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";

/** Instagram y Behance, desde `configuracion`. Sin tracking, 14/16 (spec §4.3). */
export function SocialLinks({
  idioma,
  instagram,
  behance,
  className,
}: {
  idioma: Idioma;
  instagram?: string | null;
  behance?: string | null;
  className?: string;
}) {
  const items = [
    { label: "Instagram", href: instagram },
    { label: "Behance", href: behance },
  ].filter((i): i is { label: string; href: string } => Boolean(i.href));

  if (items.length === 0) return null;

  return (
    <nav aria-label={t(idioma).redes} className={className}>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-social text-quiet transition-colors duration-fast ease-site hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
