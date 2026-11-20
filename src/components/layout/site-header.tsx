import type { Idioma } from "@/sanity/i18n";
import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

/**
 * Header (spec §5.1). 80px en desktop, 56 en mobile.
 * `withMenu` solo en las paginas internas, donde en mobile no hay otra via
 * de acceso a la navegacion (spec §5.5).
 */
export function SiteHeader({
  idioma,
  destinos,
  withMenu = false,
  instagram,
  behance,
}: {
  idioma: Idioma;
  destinos: Partial<Record<Idioma, string | null>>;
  withMenu?: boolean;
  instagram?: string | null;
  behance?: string | null;
}) {
  return (
    <header className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
      <Brand idioma={idioma} />
      <div className="flex items-center gap-5">
        {withMenu ? (
          <MobileMenu
            idioma={idioma}
            instagram={instagram}
            behance={behance}
          />
        ) : null}
        <LanguageSwitcher idioma={idioma} destinos={destinos} />
      </div>
    </header>
  );
}
