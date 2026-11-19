/**
 * Navegacion del sitio.
 *
 * Esto NO sale de Sanity a proposito: las rutas son parte del codigo, no
 * contenido editorial, y Gala no tiene por que poder romperlas (spec §9.4).
 * Las etiquetas pasan a archivos de mensajes en la fase 2, con el bilingue.
 *
 * Todo lo demas (nombre, mail, redes, direccion) sale del singleton
 * `configuracion` (spec §8.2).
 */
export const NAV = [
  { label: "Trabajos", href: "/trabajos" },
  { label: "Estudio", href: "/estudio" },
  { label: "Noticias", href: "/noticias" },
  { label: "Contacto", href: "/contacto" },
] as const;
