/**
 * Studio embebido (spec §12). Ruta catch-all: el Studio maneja su propio
 * routing interno a partir de `basePath` en sanity.config.ts.
 *
 * Es estatico: el Studio es una SPA que habla con la API de Sanity desde el
 * navegador, asi que no hace falta runtime del lado del Worker.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
