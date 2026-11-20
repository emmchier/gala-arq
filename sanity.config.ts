"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { documentInternationalization } from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { IDIOMAS, IDIOMA_BASE } from "@/sanity/i18n";

export default defineConfig({
  basePath: "/studio", // sin esto el router interno del Studio no sabe donde vive
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Los singleton no aparecen en "crear nuevo": se entra por la estructura.
    templates: (prev) =>
      prev.filter((template) => !singletonTypes.has(template.schemaType)),
  },
  document: {
    // Tampoco se pueden duplicar ni borrar desde el menu del documento.
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) =>
            ["publish", "discardChanges", "restore"].includes(action ?? ""),
          )
        : prev,
  },
  plugins: [
    structureTool({ structure }),

    // DOCUMENT-LEVEL para `trabajo` (spec §9.2): tiene URL propia y Portable
    // Text, y permite publicar cada idioma por separado.
    documentInternationalization({
      supportedLanguages: [...IDIOMAS],
      schemaTypes: ["trabajo"],
      languageField: "idioma",
    }),

    // FIELD-LEVEL para `configuracion` (spec §9.2): la mayoria de sus campos
    // NO se traducen (mail, redes, telefono). Document-level los duplicaria y
    // tarde o temprano se desincronizan.
    internationalizedArray({
      languages: [...IDIOMAS],
      defaultLanguages: [IDIOMA_BASE],
      fieldTypes: ["string", "text"],
    }),

    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
