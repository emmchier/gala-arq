import Link from "next/link";

/**
 * Switcher EN · ES (spec §5.1).
 * El idioma activo va en ink peso 300; el inactivo en quiet peso 200.
 * Hardcodeado en el paso 0.3: se conecta al routing real en el paso 2.3.
 */
export function LanguageSwitcher({ active = "es" }: { active?: "es" | "en" }) {
  const item = (code: "es" | "en", href: string) => {
    const isActive = active === code;
    return (
      <Link
        href={href}
        hrefLang={code}
        aria-current={isActive ? "true" : undefined}
        className={
          isActive
            ? "text-ui text-ink font-light"
            : "text-ui text-quiet font-extralight"
        }
      >
        {code.toUpperCase()}
      </Link>
    );
  };

  return (
    <nav aria-label="Idioma" className="flex items-center gap-1.5">
      {item("en", "/en")}
      <span aria-hidden className="text-ui text-quiet">
        &middot;
      </span>
      {item("es", "/")}
    </nav>
  );
}
