import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid, GridCell } from "@/components/layout/project-grid";

const DEMO = Array.from({ length: 9 }, (_, i) => i);

export default function TrabajosPage() {
  return (
    <PageFrame variant="inner" sidebarTop={<Breadcrumb backHref="/" current="Trabajos" />}>
      {/* columna de texto */}
      <div className="hidden shrink-0 lg:block lg:w-[var(--col-text)]">
        <h1 className="sr-only">Trabajos</h1>
      </div>

      {/* grilla de medios */}
      <div className="w-full lg:w-[var(--col-media)] lg:shrink-0">
        <ProjectGrid>
          {DEMO.map((i) => (
            <article key={i} className="flex flex-col gap-[3.5px]">
              <GridCell />
              <div className="pb-2">
                <h2 className="text-body text-ink">Casa Elen</h2>
                <time className="text-meta text-quiet">2026</time>
              </div>
            </article>
          ))}
        </ProjectGrid>
      </div>
    </PageFrame>
  );
}
