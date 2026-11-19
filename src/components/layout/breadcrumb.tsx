import Link from "next/link";

/**
 * "← VOLVER / TRABAJOS" (spec §5.1). Ocupa el sidebar en Listado y Ficha,
 * donde la navegacion principal no existe.
 */
export function Breadcrumb({
  backHref,
  current,
  className,
}: {
  backHref: string;
  current: string;
  className?: string;
}) {
  return (
    <nav aria-label="Miga de pan" className={className}>
      <Link
        href={backHref}
        className="group inline-flex items-center gap-1 text-label text-ink uppercase"
      >
        <svg
          aria-hidden
          viewBox="0 0 14 11"
          className="h-[10px] w-[14px] shrink-0 transition-transform duration-fast ease-site group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M5.5 1 1 5.5 5.5 10M1 5.5h13" />
        </svg>
        <span>Volver</span>
        <span aria-hidden>/</span>
        <span className="text-quiet">{current}</span>
      </Link>
    </nav>
  );
}
