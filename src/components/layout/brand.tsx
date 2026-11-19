import Link from "next/link";

/** Logo. Josefin Sans: "gala" en Light, "arq" en Medium (spec §4.2). */
export function Brand() {
  return (
    <Link
      href="/"
      className="text-brand font-brand text-ink"
      aria-label="Gala Arq, ir al inicio"
    >
      <span className="font-light">gala</span>{" "}
      <span className="font-medium">arq</span>
    </Link>
  );
}
