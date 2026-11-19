"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV, SOCIAL } from "@/lib/site";

/**
 * Menu mobile de las paginas internas (spec §5.5).
 * Boton de texto "MENU" con el mismo estilo que el switcher de idioma.
 * Nada de icono de hamburguesa: el diseno no tiene iconografia.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="text-label text-ink uppercase lg:hidden">
        Menú
      </SheetTrigger>
      <SheetContent side="right" className="bg-paper px-[var(--page-gutter)] py-8">
        <SheetTitle className="text-label text-quiet uppercase">
          Navegación
        </SheetTitle>
        <ul className="mt-8 flex flex-col gap-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-label text-ink uppercase"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 flex flex-col">
          {SOCIAL.map((item) => (
            <li key={item.href}>
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
