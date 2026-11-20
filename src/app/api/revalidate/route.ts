import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { TAGS } from "@/sanity/fetch";

/**
 * Webhook de revalidacion (spec §7.1, paso 3.1).
 *
 * Gala publica en el Studio, Sanity llama acá, y el sitio se actualiza en
 * segundos **sin rebuild**. Es la pieza que hace que la revalidacion sea
 * on-demand y no por tiempo: sin esto habria que elegir entre buildear a
 * mano o revalidar cada N minutos, que gasta cómputo para nada.
 *
 * Es el UNICO endpoint del sitio que invoca al Worker en runtime. Todo lo
 * demas se sirve como static assets.
 */

type Payload = { _type?: string; _id?: string };

/** De qué tipo de documento depende cada etiqueta. */
function etiquetasPara(tipo: string): string[] {
  // Un cambio en el documento de traduccion mueve el switcher de idioma,
  // que vive dentro de las paginas de trabajo.
  if (tipo === "translation.metadata") return [TAGS.trabajo];
  if (tipo === TAGS.trabajo) return [TAGS.trabajo];
  if (tipo === TAGS.configuracion) return [TAGS.configuracion];
  return [];
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    // Sin secreto no se valida nada: mejor fallar fuerte que revalidar a ciegas.
    return new Response("Falta SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  let firmaValida: boolean | null = false;
  let body: Payload | null = null;
  try {
    const parsed = await parseBody<Payload>(req, secret);
    firmaValida = parsed.isValidSignature;
    body = parsed.body;
  } catch {
    return new Response("No se pudo leer el cuerpo", { status: 400 });
  }

  if (firmaValida !== true) {
    return new Response("Firma inválida", { status: 401 });
  }
  if (!body?._type) {
    return new Response("Falta _type", { status: 400 });
  }

  const etiquetas = etiquetasPara(body._type);
  if (etiquetas.length === 0) {
    // Un tipo que no afecta al sitio publico. No es un error.
    return Response.json({ revalidado: false, tipo: body._type });
  }

  // `expire: 0` = expiracion inmediata. Es lo que corresponde a un webhook de
  // publicacion: Gala publica y el contenido viejo deja de servirse ya, no
  // despues de una ventana de gracia.
  for (const etiqueta of etiquetas) revalidateTag(etiqueta, { expire: 0 });

  return Response.json({
    revalidado: true,
    tipo: body._type,
    etiquetas,
    cuando: new Date().toISOString(),
  });
}
