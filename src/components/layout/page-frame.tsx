import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/**
 * Cascaron de pagina (spec §5.1).
 *
 * El contenido vive dentro de margenes laterales de 64px (20 en mobile), y
 * adentro la grilla es FLUIDA: 25 / 25 / 50 (spec §4.5).
 *
 * - "home": ocupa 100dvh exactas, sin scroll. La navegacion toma el primer
 *   25% y el carrusel el 70% alineado a la derecha.
 * - "inner": la columna izquierda queda FIJA mientras el resto scrollea.
 *   Por eso el breadcrumb vive arriba de esa columna y PREV/NEXT abajo.
 */
export function PageFrame({
  variant,
  sidebarTop,
  sidebarBottom,
  children,
}: {
  variant: "home" | "inner";
  sidebarTop?: ReactNode;
  sidebarBottom?: ReactNode;
  children: ReactNode;
}) {
  const isHome = variant === "home";

  return (
    <div
      className={`mx-auto flex w-full max-w-[calc(var(--page-max)+var(--page-gutter)*2)] flex-col px-[var(--page-gutter)] ${
        isHome ? "h-dvh overflow-hidden" : "min-h-dvh"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--page-gutter)] focus:top-2 focus:z-50 focus:bg-paper focus:p-2 focus:text-label focus:text-ink focus:uppercase"
      >
        Saltar al contenido
      </a>

      <SiteHeader withMenu={!isHome} />

      <main
        id="contenido"
        className={`my-[var(--header-gap)] flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:gap-0 ${
          isHome ? "" : "items-start"
        }`}
      >
        {(sidebarTop || sidebarBottom) && (
          <div
            className={`flex shrink-0 flex-col justify-between gap-8 lg:w-[var(--col-nav)] lg:gap-0 ${
              isHome
                ? "order-2 lg:order-1"
                : // columna fija: se queda quieta mientras la derecha scrollea
                  "order-1 lg:sticky lg:top-[var(--header-gap)] lg:h-[calc(100dvh-var(--header-h)-var(--header-gap)*2-var(--footer-h))]"
            }`}
          >
            {sidebarTop ?? <span />}
            {sidebarBottom ?? null}
          </div>
        )}

        <div
          className={
            isHome
              ? "order-1 flex min-h-0 w-full flex-1 flex-col lg:order-2 lg:ml-auto lg:w-[var(--col-featured)] lg:flex-none"
              : "order-2 flex w-full flex-col lg:flex-row"
          }
        >
          {children}
        </div>
      </main>

      <SiteFooter split={isHome} />
    </div>
  );
}
