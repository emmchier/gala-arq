import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";

/** La memoria del proyecto. Solo parrafos: el schema no habilita estilos. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-body text-quiet">{children}</p>,
  },
};

export function ProjectDescription({
  value,
}: {
  value: PortableTextBlock[] | null;
}) {
  if (!value?.length) return null;
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}
