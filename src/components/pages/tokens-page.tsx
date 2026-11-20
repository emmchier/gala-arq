import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokens · Gala Arq",
  robots: { index: false, follow: false },
};

// Los colores de los dots se consumen como utilidades, no con var() en runtime:
// @theme inline no emite las variables como custom properties. El indice elige
// de una lista literal de clases (spec §4.4).
const DOT_DEFAULT = [
  "bg-dot-1",
  "bg-dot-2",
  "bg-dot-3",
  "bg-dot-4",
  "bg-dot-5",
] as const;
const DOT_ACTIVE = [
  "bg-dot-1-on",
  "bg-dot-2-on",
  "bg-dot-3-on",
  "bg-dot-4-on",
  "bg-dot-5-on",
] as const;

function Row({
  rol,
  specs,
  children,
}: {
  rol: string;
  specs: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_180px_1fr] items-baseline gap-6 border-b border-border py-5">
      <code className="text-fine text-quiet">{rol}</code>
      <code className="text-fine text-quiet">{specs}</code>
      <div>{children}</div>
    </div>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto w-full max-w-[1238px] px-[var(--page-gutter)] py-16">
      <h1 className="text-display text-ink">Tokens</h1>
      <p className="text-body text-quiet mt-6">
        Referencia viva del sistema de diseno. Spec §4.
      </p>

      <h2 className="text-label text-ink uppercase mt-16 mb-2">
        Escala tipografica
      </h2>

      <Row rol="text-display" specs="24 / 20 / .16em / ink">
        <span className="text-display text-ink">Casa Elen</span>
      </Row>
      <Row rol="text-body" specs="16 / 20 / .16em / ink">
        <span className="text-body text-ink">Casa Elen</span>
      </Row>
      <Row rol="text-body" specs="16 / 20 / .16em / quiet">
        <span className="text-body text-quiet">City Bell</span>
      </Row>
      <Row rol="text-body" specs="parrafo largo">
        <p className="text-body text-quiet max-w-[288px]">
          Located in the leafy surroundings of City Bell, this residence draws
          deeply on the poetry and discipline of simplicity.
        </p>
      </Row>
      <Row rol="text-label" specs="14 / 20 / .16em / quiet">
        <span className="text-label text-quiet uppercase">Trabajos</span>
      </Row>
      <Row rol="text-label" specs="14 / 20 / .16em / ink">
        <span className="text-label text-ink uppercase">&larr; Volver / Trabajos</span>
      </Row>
      <Row rol="text-ui" specs="14 / 20 / sin tracking">
        <span className="text-ui text-ink">EN</span>
        <span className="text-ui text-quiet"> &middot; </span>
        <span className="text-ui text-quiet font-light">ES</span>
      </Row>
      <Row rol="text-social" specs="14 / 16 / sin tracking">
        <span className="text-social text-quiet">Instagram</span>
      </Row>
      <Row rol="text-meta" specs="10 / 14 / .16em / quiet">
        <span className="text-meta text-quiet">2026</span>
      </Row>
      <Row rol="text-fine" specs="10 / 14 / sin tracking">
        <span className="text-fine text-quiet">
          2026 &copy; Gala Arq &middot; Legales &middot; Powered by emmchier
        </span>
      </Row>
      <Row rol="text-brand" specs="16 / Josefin Sans">
        <span className="text-brand font-brand text-ink">
          <span className="font-light">gala</span>{" "}
          <span className="font-medium">arq</span>
        </span>
      </Row>

      <h2 className="text-label text-ink uppercase mt-16 mb-6">
        Dots del carrusel
      </h2>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          {DOT_DEFAULT.map((c) => (
            <span key={c} className={`size-2 rounded-full ${c}`} />
          ))}
          <code className="text-fine text-quiet ml-4">default</code>
        </div>
        <div className="flex items-center gap-2">
          {DOT_ACTIVE.map((c) => (
            <span key={c} className={`size-2 rounded-full ${c}`} />
          ))}
          <code className="text-fine text-quiet ml-4">active</code>
        </div>
      </div>

      <h2 className="text-label text-ink uppercase mt-16 mb-6">Movimiento</h2>
      <div className="flex gap-10">
        {(["fast", "base", "slow"] as const).map((d) => (
          <div key={d} className="flex flex-col gap-2">
            <span
              className="size-16 bg-ink opacity-100 transition-opacity ease-site hover:opacity-10"
              style={{ transitionDuration: `var(--duration-${d})` }}
            />
            <code className="text-fine text-quiet">duration-{d}</code>
          </div>
        ))}
      </div>
    </main>
  );
}
