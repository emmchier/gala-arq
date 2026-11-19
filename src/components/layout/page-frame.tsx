import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

/**
 * Cascaron de pagina (spec §5.1).
 *
 *   header (80)  +  gap (64)  +  main (flex-1)  +  gap (64)  +  footer (48)
 *
 * El sidebar cambia de contenido segun la pantalla: navegacion en la Home,
 * breadcrumb en Listado y Ficha. En mobile el sidebar deja de ser columna.
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
    <>
      {/* En el Figma los 1238 son el CONTENIDO, dentro de los margenes de 64.
          Por eso el max-width suma los dos gutters: si no, el contenido queda
          en 1110 y todos los porcentajes salen corridos. */}
      <div className="mx-auto flex min-h-dvh w-full max-w-[calc(var(--page-max)+var(--page-gutter)*2)] flex-col px-[var(--page-gutter)]">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-[var(--page-gutter)] focus:top-2 focus:z-50 focus:bg-paper focus:p-2 focus:text-label focus:text-ink focus:uppercase"
      >
        Saltar al contenido
      </a>

      <SiteHeader withMenu={!isHome} />

      <main
        id="contenido"
        className="my-[var(--header-gap)] flex flex-1 flex-col gap-8 lg:flex-row lg:gap-[var(--col-gap)]"
      >
        {/* Sidebar: columna en desktop, franja apilada en mobile */}
        {(sidebarTop || sidebarBottom) && (
          <div
            className={`flex shrink-0 flex-col justify-between gap-8 lg:gap-0 ${
              isHome
                ? "lg:w-[var(--col-sidebar-home)] order-2 lg:order-1"
                : "lg:w-[var(--col-sidebar)] order-1"
            }`}
          >
            {sidebarTop ?? <span />}
            {sidebarBottom ?? null}
          </div>
        )}

        <div
          className={
            isHome
              ? "order-1 w-full lg:order-2 lg:ml-auto lg:w-[var(--col-featured)]"
              : "order-2 flex w-full flex-col lg:flex-row lg:gap-[var(--col-gap)]"
          }
        >
          {children}
        </div>
      </main>

      <SiteFooter split={isHome} />
      </div>
    </>
  );
}
