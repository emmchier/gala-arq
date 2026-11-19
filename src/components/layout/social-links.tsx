import { SOCIAL } from "@/lib/site";

/** Instagram y Behance. Sin tracking, 14/16 (spec §4.3). */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Redes" className={className}>
      <ul className="flex flex-col">
        {SOCIAL.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-social text-quiet transition-colors duration-fast ease-site hover:text-ink"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
