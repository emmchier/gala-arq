import { defineField, defineType } from "sanity";

/**
 * Datos del sitio, editables por Gala (spec §8.2).
 *
 * Es un SINGLETON: un solo documento con `_id` fijo "configuracion". Se fija
 * en la estructura y se saca de "crear nuevo" (ver sanity.config.ts).
 *
 * Nada de datos de Gala en el codigo (spec §16.4, regla 1).
 *
 * Traduccion FIELD-LEVEL (spec §9.2): la mayoria de los campos NO se traducen
 * (mail, telefono, redes, direccion), asi que un documento por idioma los
 * duplicaria y tarde o temprano se desincronizan. Solo los textos largos
 * llevan una version por idioma, dentro del mismo documento.
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
    // Traducible: uno por idioma, en el mismo documento (spec §9.2).
    defineField({
      name: "textoEstudio",
      title: "Texto del estudio",
      type: "internationalizedArrayText",
      group: "estudio",
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

    // Traducible.
    defineField({
      name: "textoLegal",
      title: "Texto legal",
      type: "internationalizedArrayText",
      group: "legal",
    }),
  ],
  preview: {
    select: { title: "nombreEstudio" },
    prepare: ({ title }) => ({ title: title ?? "Datos del estudio" }),
  },
});
