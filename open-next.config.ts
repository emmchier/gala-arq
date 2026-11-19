import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Cache de ISR en KV, no en R2.
// La plantilla oficial del adaptador usa R2, pero R2 hay que habilitarlo a
// mano en el dashboard y pide medio de pago. KV viene con el plan free de
// Workers y alcanza de sobra para un portfolio (spec §6.4).
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
