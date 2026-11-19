// Lectura unica de las variables de Sanity. Nada de process.env suelto por
// los componentes: si falta una variable, el error tiene que ser claro y
// temprano (spec §16.4, regla 4: lo de la instancia va en entorno).

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copiá .env.example a .env.local.`,
    );
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET",
);

/** Fecha fija: subirla es un cambio deliberado, no algo que se mueva solo. */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-11-19";
