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
});
