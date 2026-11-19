import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Cache de ISR en R2. El bucket se crea en el paso 0.4, antes del primer deploy.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
