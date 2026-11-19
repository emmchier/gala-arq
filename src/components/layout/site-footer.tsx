import { SITE } from "@/lib/site";

/**
 * Footer (spec §5.1). 48px, 10px quiet.
 * En la Home va partido entre los dos extremos; en Listado y Ficha, todo
 * junto a la izquierda.
 */
export function SiteFooter({ split = false }: { split?: boolean }) {
  const legal = (
    <a href="/legales" className="text-fine text-quiet">
      Legales
    </a>
  );
  const credit = (
    <a
      href="https://emmchier.com"
      target="_blank"
      rel="noreferrer noopener"
      className="text-fine text-quiet"
    >
      Powered by emmchier
    </a>
  );
  const dot = (
    <span aria-hidden className="text-fine text-quiet">
      &middot;
    </span>
  );

  return (
    <footer
      className={`flex h-[var(--footer-h)] shrink-0 flex-wrap items-center gap-x-2 ${
        split ? "justify-between" : "justify-start"
      }`}
    >
      <small className="text-fine text-quiet">
        {SITE.year} &copy; {SITE.name}
      </small>
      <div className="flex items-center gap-x-2">
        {split ? null : dot}
        {legal}
        {dot}
        {credit}
      </div>
    </footer>
  );
}
