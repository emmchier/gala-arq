import { PageFrame } from "@/components/layout/page-frame";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProjectGrid, GridCell } from "@/components/layout/project-grid";

const DEMO = Array.from({ length: 12 }, (_, i) => i);

export default function TrabajosPage() {
  return (
    <PageFrame
      variant="inner"
      sidebarTop={<Breadcrumb backHref="/" current="Trabajos" />}
    >
      {/* segundo 25%: en el listado queda vacio (spec §5.3) */}
      <div className="hidden shrink-0 lg:block lg:w-[calc(var(--col-info)/0.75)]">
        <h1 className="sr-only">Trabajos</h1>
      </div>

      {/* ultimo 50% */}
      <div className="w-full lg:w-[calc(var(--col-media)/0.75)] lg:shrink-0">
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
