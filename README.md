# Gala Arq — Estudio de arquitectura

Portfolio súper minimalista para **Ana Gallela ("Gala")**, arquitecta. Bilingüe (ES/EN).

## 👉 Empezar acá

**[`gala-arq-spec.md`](./gala-arq-spec.md) es el contexto maestro. Leerlo primero, siempre.**

- **§0** dice en qué paso estamos (el `NEXT STEP`).
- **§1** es el plan maestro de 6 fases.
- **§4 y §5** son el sistema de diseño y las pantallas, bajados del Figma.

Cada sesión de trabajo arranca leyendo §0, ejecuta **un solo paso**, y actualiza el tablero
de §1.7 en el mismo commit.

## Stack

| Capa | Herramienta |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui |
| Estado de cliente | Zustand |
| CMS + dashboard | Sanity (Studio embebido en `/studio`) |
| Hosting y dominio | Cloudflare (Workers + Registrar/DNS) |

## Diseño

[Figma — Gala Arq](https://www.figma.com/design/emDsp7Xtbz8TVk8TU7suuC/Gala-Arq) · página
**High Fidelity**. El Figma es la fuente de verdad visual; el spec, la de arquitectura y datos.

Diseñadas: **Home · Listado de proyectos · Ficha de proyecto**.
Pendientes: Estudio · Noticias · Contacto.

## Estructura

- `gala-arq-spec.md` — especificaciones y plan. **Leer primero.**
- `src/` — código de la app.
- `docs/` — material de apoyo.
