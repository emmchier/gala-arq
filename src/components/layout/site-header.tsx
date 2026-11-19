import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

/**
 * Header (spec §5.1). 80px en desktop, 56 en mobile.
 * `withMenu` solo en las paginas internas, donde en mobile no hay otra via
 * de acceso a la navegacion (spec §5.5).
 */
export function SiteHeader({
  withMenu = false,
  instagram,
  behance,
}: {
  withMenu?: boolean;
  instagram?: string | null;
  behance?: string | null;
}) {
  return (
    <header className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
      <Brand />
      <div className="flex items-center gap-5">
        {withMenu ? (
          <MobileMenu instagram={instagram} behance={behance} />
        ) : null}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
