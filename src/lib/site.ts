// Contenido hardcodeado del cascaron (paso 0.3).
// En la fase 1 todo esto sale del documento `configuracion` de Sanity (spec §8.2).
// Nada de esto debe quedar hardcodeado para el lanzamiento.

export const NAV = [
  { label: "Trabajos", href: "/trabajos" },
  { label: "Estudio", href: "/estudio" },
  { label: "Noticias", href: "/noticias" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Behance", href: "https://behance.net/" },
] as const;

export const SITE = {
  name: "Gala Arq",
  year: 2026,
} as const;
