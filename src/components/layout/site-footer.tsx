/**
 * Footer (spec §5.1). 48px, 10px quiet.
 * En la Home va partido entre los dos extremos; en Listado y Ficha, todo
 * junto a la izquierda.
 */
export function SiteFooter({
  nombreEstudio,
  split = false,
}: {
  nombreEstudio: string;
  split?: boolean;
}) {
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
        {new Date().getFullYear()} &copy; {nombreEstudio}
      </small>
      <div className="flex items-center gap-x-2">
        {split ? null : dot}
        <a href="/legales" className="text-fine text-quiet">
          Legales
        </a>
        {dot}
        <a
          href="https://emmchier.com"
          target="_blank"
          rel="noreferrer noopener"
          className="text-fine text-quiet"
        >
          Powered by emmchier
        </a>
      </div>
    </footer>
  );
}
