import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/**
 * Cascaron de pagina (spec §5.1).
 *
 * El contenido vive dentro de margenes laterales de 64px (20 en mobile), y
 * adentro la grilla es FLUIDA: 20 / 30 / 50 (spec §4.5).
 *
 * - "inner" usa **CSS Grid de tres columnas**, con los porcentajes literales
 *   de la spec. Antes era flex anidado y cada columna se calculaba como una
 *   fraccion del resto (`calc(var(--col-info)/0.75)`): esa cuenta se rompia
 *   sola cada vez que cambiaba el ancho de la navegacion. Con grid, los
 *   numeros del codigo son los mismos que los de la spec.
 *   La primera columna queda FIJA mientras el resto scrollea.
 * - "home" ocupa 100dvh exactas, sin scroll: la navegacion toma el primer
 *   20% y el carrusel el 70% alineado a la derecha.
 */
export function PageFrame({
  variant,
  config,
  sidebarTop,
  sidebarBottom,
  children,
}: {
  variant: "home" | "inner";
  config: {
    nombreEstudio: string | null;
    instagram?: string | null;
    behance?: string | null;
  };
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

      <SiteHeader
        withMenu={!isHome}
        instagram={config.instagram}
        behance={config.behance}
      />

      <main
        id="contenido"
        className={
          isHome
            ? "my-[var(--header-gap)] flex min-h-0 flex-1 flex-col gap-8 lg:flex-row"
            : "my-[var(--header-gap)] flex flex-1 flex-col gap-8 lg:grid lg:grid-cols-[var(--col-nav)_var(--col-info)_var(--col-media)] lg:items-start lg:gap-0"
        }
      >
        {(sidebarTop || sidebarBottom) && (
          <div
            className={`flex shrink-0 flex-col justify-between gap-8 lg:gap-0 ${
              isHome
                ? "order-2 lg:order-1 lg:w-[var(--col-nav)]"
                : // columna fija: se queda quieta mientras la derecha scrollea.
                  // Sin `order`: en grid tambien reordena, y mandaria la
                  // navegacion a la ultima columna.
                  "lg:sticky lg:top-[var(--header-gap)] lg:h-[calc(100dvh-var(--header-h)-var(--header-gap)*2-var(--footer-h))]"
            }`}
          >
            {sidebarTop ?? <span />}
            {sidebarBottom ?? null}
          </div>
        )}

        {isHome ? (
          <div className="order-1 flex min-h-0 w-full flex-1 flex-col lg:order-2 lg:ml-auto lg:w-[var(--col-featured)] lg:flex-none">
            {children}
          </div>
        ) : (
          children
        )}
      </main>

      <SiteFooter
        split={isHome}
        nombreEstudio={config.nombreEstudio ?? "Gala Arq"}
      />
    </div>
  );
}
