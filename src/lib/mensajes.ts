import type { Idioma } from "@/sanity/i18n";

/**
 * Textos de interfaz (spec §9.4).
 *
 * NO salen de Sanity: son parte del diseno, no contenido editorial, y Gala no
 * tiene por que poder romperlos.
 */
export const MENSAJES = {
  es: {
    nav: {
      trabajos: "Trabajos",
      estudio: "Estudio",
      noticias: "Noticias",
      contacto: "Contacto",
    },
    saltarAlContenido: "Saltar al contenido",
    menu: "Menú",
    navegacion: "Navegación",
    verCaso: "Ver caso",
    prev: "Prev",
    next: "Next",
    legales: "Legales",
    idioma: "Idioma",
    migaDePan: "Miga de pan",
    inicio: "Inicio",
    redes: "Redes",
    trabajosDestacados: "Trabajos destacados",
    navegacionEntreTrabajos: "Navegación entre trabajos",
    irA: (titulo: string) => `Ir a ${titulo}`,
    siguienteTrabajo: "Siguiente trabajo",
    pausar: "Pausar el carrusel",
    reanudar: "Reanudar el carrusel",
    irAlInicio: "Gala Arq, ir al inicio",
  },
  en: {
    nav: {
      trabajos: "Works",
      estudio: "Studio",
      noticias: "News",
      contacto: "Contact",
    },
    saltarAlContenido: "Skip to content",
    menu: "Menu",
    navegacion: "Navigation",
    verCaso: "View case",
    prev: "Prev",
    next: "Next",
    legales: "Legal",
    idioma: "Language",
    migaDePan: "Breadcrumb",
    inicio: "Home",
    redes: "Social",
    trabajosDestacados: "Featured works",
    navegacionEntreTrabajos: "Work navigation",
    irA: (titulo: string) => `Go to ${titulo}`,
    siguienteTrabajo: "Next work",
    pausar: "Pause carousel",
    reanudar: "Resume carousel",
    irAlInicio: "Gala Arq, go to home",
  },
} as const satisfies Record<Idioma, unknown>;

export const t = (idioma: Idioma) => MENSAJES[idioma];
