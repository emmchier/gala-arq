"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Idioma } from "@/sanity/i18n";
import { t } from "@/lib/mensajes";
import { rutaSeccion } from "@/lib/routes";

const SECCIONES = ["trabajos", "estudio", "noticias", "contacto"] as const;

/**
 * Menu mobile de las paginas internas (spec §5.5).
 * Boton de texto con el mismo estilo que el switcher de idioma.
 * Nada de icono de hamburguesa: el diseno no tiene iconografia.
 */
export function MobileMenu({
  idioma,
  instagram,
  behance,
}: {
  idioma: Idioma;
  instagram?: string | null;
  behance?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const m = t(idioma);
  const redes = [
    { label: "Instagram", href: instagram },
    { label: "Behance", href: behance },
  ].filter((i): i is { label: string; href: string } => Boolean(i.href));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="text-label text-ink uppercase lg:hidden">
        {m.menu}
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper px-[var(--page-gutter)] py-8">
        <SheetTitle className="text-label text-quiet uppercase">
          {m.navegacion}
        </SheetTitle>
        <ul className="mt-8 flex flex-col gap-1">
          {SECCIONES.map((s) => (
            <li key={s}>
              <Link
                href={rutaSeccion(idioma, s)}
                onClick={() => setOpen(false)}
                className="text-label text-ink uppercase"
              >
                {m.nav[s]}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex flex-col">
          {redes.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-social text-quiet"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
