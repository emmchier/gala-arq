import { defineArrayMember, defineField, defineType } from "sanity";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";

/**
 * Un trabajo (spec §8.1).
 *
 * Lo que NO lleva, y es deliberado:
 * - `categoria`: el diseno no tiene categorias ni filtros (spec §5.3).
 * - `color`: el color del dot sale de la posicion en el carrusel (spec §4.4).
 * - `publicado`: lo resuelve el draft/publish nativo de Sanity.
 * - `orden`: lo resuelve `orderRank` con drag-and-drop.
 */
export const trabajo = defineType({
  name: "trabajo",
  title: "Trabajo",
  type: "document",
  orderings: [orderRankOrdering],
  groups: [
    { name: "ficha", title: "Ficha", default: true },
    { name: "medios", title: "Imágenes" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "ficha",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "ficha",
      options: { source: "titulo", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ubicacion",
      title: "Ubicación",
      type: "string",
      group: "ficha",
      description: 'Por ejemplo "City Bell".',
    }),
    defineField({
      name: "anio",
      title: "Año",
      type: "number",
      group: "ficha",
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "array",
      group: "ficha",
      of: [defineArrayMember({ type: "block", styles: [], lists: [] })],
      description: "La memoria del proyecto.",
    }),
    defineField({
      name: "creditos",
      title: "Créditos",
      type: "array",
      group: "ficha",
      of: [defineArrayMember({ type: "credito" })],
      description:
        "Una línea por crédito. El crédito de fotografía es obligatorio por licencia de uso.",
    }),

    defineField({
      name: "portada",
      title: "Portada",
      type: "image",
      group: "medios",
      options: { hotspot: true },
      description:
        "La del listado y el carrusel. La grilla recorta a cuadrado: usá el hotspot para elegir el encuadre.",
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "galeria",
      title: "Galería",
      type: "array",
      group: "medios",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "destacado",
      title: "Destacado en la Home",
      type: "boolean",
      group: "ficha",
      initialValue: false,
    }),

    defineField({
      name: "seoTitle",
      title: "Título SEO",
      type: "string",
      group: "seo",
      description: "Opcional. Si está vacío se usa el título de la obra.",
    }),
    defineField({
      name: "seoDescription",
      title: "Descripción SEO",
      type: "text",
      rows: 3,
      group: "seo",
    }),

    orderRankField({ type: "trabajo" }),

    // Lo escribe y lo lee el plugin de traduccion por documento (spec §9.2).
    // Oculto: Gala cambia de idioma con el selector del Studio, no editando
    // este campo a mano.
    defineField({
      name: "idioma",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "anio",
      media: "portada",
      destacado: "destacado",
      idioma: "idioma",
    },
    prepare: ({ title, subtitle, media, destacado, idioma }) => ({
      title: destacado ? `★ ${title}` : title,
      subtitle: [idioma?.toUpperCase(), subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
