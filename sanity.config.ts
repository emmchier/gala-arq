"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "@/sanity/env";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

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
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
