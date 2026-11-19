import { defineCliConfig } from "sanity/cli";

/**
 * Config de la CLI de Sanity (`pnpm sanity ...`).
 * Lee las mismas variables que la app, de .env.local.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    // Los tipos salen del schema y de las queries. Nada se tipa a mano.
    path: "./src/**/*.{ts,tsx}",
    schema: "./src/sanity/extract.json",
    generates: "./src/sanity/types.ts",
    overloadClientMethods: true,
  },
});
