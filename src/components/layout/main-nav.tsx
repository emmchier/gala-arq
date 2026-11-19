import Link from "next/link";
import { NAV } from "@/lib/site";

/** Navegacion principal. En el diseno solo existe en la Home (spec §5.1). */
export function MainNav({ className }: { className?: string }) {
  return (
    <nav aria-label="Principal" className={className}>
      <ul className="flex flex-col">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-label text-quiet uppercase transition-colors duration-fast ease-site hover:text-ink"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
