import { defineField, defineType } from "sanity";

/**
 * Una linea del bloque de creditos de la ficha (spec §5.4, §8.1).
 *
 * Se renderiza como `{rol} {valor}`, una linea por item, omitiendo el rol si
 * esta vacio. Asi sale "Obra finalizada" sola, como en el Figma.
 *
 * Es un array de objetos y no texto libre porque se ve exactamente igual
 * pero permite validar que el credito de fotografia este, y linkear los
 * handles de Instagram.
 */
export const credito = defineType({
  name: "credito",
  title: "Crédito",
  type: "object",
  fields: [
    defineField({
      name: "rol",
      title: "Rol",
      type: "string",
      description:
        'Opcional. Por ejemplo "Idea creativa". Dejalo vacío para una línea suelta como "Obra finalizada".',
    }),
    defineField({
      name: "valor",
      title: "Valor",
      type: "string",
      description: 'Nombre o handle. Si empieza con @, se linkea a Instagram.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { rol: "rol", valor: "valor" },
    prepare: ({ rol, valor }) => ({
      title: [rol, valor].filter(Boolean).join(" "),
    }),
  },
});
