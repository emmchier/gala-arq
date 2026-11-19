import { PageFrame } from "@/components/layout/page-frame";
import { MainNav } from "@/components/layout/main-nav";
import { SocialLinks } from "@/components/layout/social-links";

const DOTS = [
  "bg-dot-1-on",
  "bg-dot-2",
  "bg-dot-3",
  "bg-dot-4",
  "bg-dot-5",
] as const;

export default function HomePage() {
  return (
    <PageFrame
      variant="home"
      sidebarTop={<MainNav />}
      sidebarBottom={<SocialLinks />}
    >
      {/* Paso 0.3: solo el hueco del carrusel. Se construye en el paso 1.6.
          La Home entra en 100dvh, asi que la imagen toma el alto que sobra. */}
      <section
        aria-label="Proyectos destacados"
        className="flex min-h-0 flex-1 flex-col gap-5"
      >
        <div className="flex shrink-0 items-center gap-[10px]">
          {DOTS.map((c) => (
            <span key={c} className={`size-[10px] rounded-full ${c}`} />
          ))}
        </div>
        <div className="min-h-0 w-full flex-1 bg-[color:var(--color-secondary)]" />
      </section>
    </PageFrame>
  );
}
