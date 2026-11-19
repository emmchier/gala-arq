import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Datos del sitio, editables por Gala (spec §8.2).
 *
 * Es un SINGLETON: un solo documento con `_id` fijo "configuracion". Se fija
 * en la estructura y se saca de "crear nuevo" (ver sanity.config.ts).
 *
 * Todo lo que hoy esta hardcodeado en src/lib/site.ts sale de aca a partir
 * del paso 1.4. Nada de datos de Gala en el codigo (spec §16.4, regla 1).
 */
export const configuracion = defineType({
  name: "configuracion",
  title: "Datos del estudio",
  type: "document",
  groups: [
    { name: "estudio", title: "Estudio", default: true },
    { name: "contacto", title: "Contacto" },
    { name: "legal", title: "Legales" },
  ],
  fields: [
    defineField({
      name: "nombreEstudio",
      title: "Nombre del estudio",
      type: "string",
      group: "estudio",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "textoEstudio",
      title: "Texto del estudio",
      type: "array",
      group: "estudio",
      of: [defineArrayMember({ type: "block", styles: [], lists: [] })],
    }),
    defineField({
      name: "retrato",
      title: "Retrato",
      type: "image",
      group: "estudio",
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
    defineField({
      name: "cv",
      title: "CV",
      type: "file",
      group: "estudio",
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contacto",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "direccion",
      title: "Dirección",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      group: "contacto",
    }),
    defineField({
      name: "behance",
      title: "Behance",
      type: "url",
      group: "contacto",
    }),

    defineField({
      name: "textoLegal",
      title: "Texto legal",
      type: "array",
      group: "legal",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
  preview: {
    select: { title: "nombreEstudio" },
    prepare: ({ title }) => ({ title: title ?? "Datos del estudio" }),
  },
});
