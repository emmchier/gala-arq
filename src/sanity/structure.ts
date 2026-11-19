import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

/**
 * Estructura del Studio (spec §12.2).
 *
 * - Los trabajos se listan con drag-and-drop: ese orden es el que manda en el
 *   sitio, y es curado a mano, no por fecha.
 * - "Datos del estudio" es un singleton fijado: se entra directo al documento,
 *   sin lista intermedia ni boton de crear.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Contenido")
    .items([
      orderableDocumentListDeskItem({
        type: "trabajo",
        title: "Trabajos",
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Datos del estudio")
        .id("configuracion")
        .child(
          S.document()
            .schemaType("configuracion")
            .documentId("configuracion")
            .title("Datos del estudio"),
        ),
    ]);
