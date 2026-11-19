# Gala Arq — Estudio de arquitectura · Especificaciones del proyecto

> **Archivo de contexto maestro.** Claude lee este archivo al inicio de **cada** sesión, antes de
> escribir código o investigar nada. El orden de lectura es: §0 (dónde estamos) → §1 (el plan) →
> la sección del paso que toca.
> Última actualización: 2026-11-19 · Versión: **0.3** (diseño de Figma incorporado + plan maestro)

---

# ▶ §0. EMPEZAR ACÁ

## Cómo se retoma este proyecto

Sesión nueva de Claude, decís **"Gala"** y nada más. Claude:

1. Abre este archivo desde el repo **https://github.com/emmchier/gala-arq**.
2. Lee el **NEXT STEP** de acá abajo.
3. Lee **§1 (Plan maestro)** para entender dónde cae ese paso.
4. Ejecuta **solo ese paso**, no se adelanta.
5. Al terminar: marca el paso como hecho en §1.7, mueve el NEXT STEP al siguiente, y commitea.

> **No importa lo que se haya trabajado en otro chat.** La verdad está en el repo y en este
> bloque. Si el código del repo no coincide con lo que dice acá, **manda el repo**: Claude
> actualiza este archivo antes de seguir.

## 🔴 NEXT STEP

> ### Paso `0.1` — Scaffold del proyecto
>
> **Estado:** no empezado. **Nada de código todavía en el repo.**
>
> **Qué hay que hacer:** crear el proyecto Next.js con el adaptador de Cloudflare, sumarle
> shadcn/ui y dejar el repo compilando y corriendo en local. Detalle completo en §1.2.
>
> **Antes de arrancar, el usuario tiene que haber hecho:**
> - [ ] Nada. Este paso no depende de ninguna cuenta ni de ningún servicio externo.
>
> **Criterio de terminado:** `pnpm dev` levanta, `pnpm build` pasa, y el commit está pusheado.
>
> **Cuando termine:** marcar `0.1` ✅ en §1.7 y mover este bloque a `0.2`.

## Lo que ya está resuelto

- **Diseño:** Figma leído y bajado a especificación. Sistema de diseño en §4, las tres pantallas
  en §5. Home, Listado y Ficha están definidas al pixel.
- **Arquitectura, stack y modelo de contenido:** §6, §7, §8.
- **Estrategia bilingüe:** §9.
- **El plan completo de ejecución:** §1.

## Lo que falta de parte del usuario (no bloquea el paso 0.1)

- [ ] Diseñar en Figma las pantallas de **Estudio**, **Noticias** y **Contacto** (§5.5).
- [ ] Crear el proyecto de **Sanity** (hace falta recién en el paso 1.1).
- [ ] Definir el **dominio** y la cuenta de **Cloudflare** (hace falta en el paso 3.3).
- [ ] Juntar el contenido real de Gala (hace falta en el paso 5.1).

---

# §1. PLAN MAESTRO

## 1.1 Cómo está pensado este plan

El plan tiene **6 fases** y cada fase tiene pasos numerados. Se ejecutan **en orden**, de a un
paso por vez. Cada paso tiene un criterio de terminado verificable: o se cumple o no se cumple,
no hay "casi".

**Las cuatro decisiones de orden que sostienen todo el plan.** No son arbitrarias:

1. **Los tokens van antes que los componentes.** Si se escribe un componente antes de tener la
   tipografía y la escala definidas en el CSS, los valores se hardcodean y después hay que tocar
   veinte archivos. El diseño es extremadamente consistente (una sola escala, dos colores, un
   tracking) así que definirlo primero cuesta una hora y ahorra días.

2. **El layout va antes que los datos.** Primero el esqueleto de las tres pantallas con contenido
   falso, después Sanity. Así, cuando llegan los datos reales, se enchufan en una estructura que
   ya se verificó contra el Figma. Al revés, se debuggea diseño y datos al mismo tiempo y no se
   sabe cuál de los dos está mal.

3. **El deploy va temprano, no al final.** Correr Next.js en Cloudflare Workers es **lo más
   riesgoso de todo el stack** (§13.2): adaptador, `WORKER_SELF_REFERENCE`, KV para el cache.
   Por eso el primer deploy es el paso `0.4`, con el sitio todavía vacío. Si algo de eso explota,
   explota cuando no hay nada que perder, no la semana que Gala quiere mostrar el sitio.

4. **El bilingüe va después de que un idioma funcione de punta a punta.** Sumar i18n a tres
   pantallas que ya andan es mecánico. Construir las dos versiones en paralelo duplica la
   superficie de debugging desde el día uno, y cualquier error de layout aparece dos veces.

**Lo que queda deliberadamente para el final:** Estudio, Noticias y Contacto (fase 4), porque
todavía no están diseñadas, y la carga de obra real (fase 5), porque depende de que Gala entregue
material. Ninguna de las dos bloquea nada de las fases 0 a 3.

## 1.2 Fase 0 — Fundaciones y primer deploy

> **Objetivo:** el esqueleto de las tres pantallas, con contenido falso, publicado en Cloudflare.
> **Por qué primero:** fija el sistema de diseño y descarta el riesgo de infraestructura.

| Paso | Qué | Criterio de terminado |
|---|---|---|
| **0.1** | **Scaffold.** `pnpm create cloudflare@latest` con Next.js + Workers. Sumar shadcn/ui (⚠️ verificar que escriba theme de Tailwind **v4**, §6.3) y Zustand. Configurar `tsconfig`, ESLint, Prettier. | `pnpm dev` levanta y `pnpm build` pasa |
| **0.2** | **Tokens del Figma.** Bajar §4 a `@theme` en el CSS global: colores, escala tipográfica, tracking, espaciado, grilla. Cargar **Manrope** y **Josefin Sans** por `next/font`. | Una página de prueba muestra los 9 estilos de texto de §4.3 iguales al Figma |
| **0.3** | **Layout base.** `SiteHeader`, `SiteFooter`, `PageContainer`, la grilla de 3 columnas (§4.5) y el `Sidebar`. Todo con texto hardcodeado. | El header y el footer coinciden con el Figma a 1366px |
| **0.4** | **Primer deploy a Cloudflare Workers.** Adaptador OpenNext, KV para ISR, `WORKER_SELF_REFERENCE`. Sin dominio propio: alcanza la URL `workers.dev`. | La URL de `workers.dev` muestra el layout |

**Al terminar la fase 0** hay un sitio real, online, con el sistema de diseño correcto y cero
contenido. Todo lo demás es llenarlo.

## 1.3 Fase 1 — Sanity y las tres pantallas

> **Objetivo:** Home, Listado y Ficha funcionando con datos reales, en producción, en español.
> **Por qué acá:** es el corazón del producto. Si esto anda, el proyecto está hecho en un 70%.

| Paso | Qué | Criterio de terminado |
|---|---|---|
| **1.1** | **Proyecto de Sanity** + Studio embebido en `/studio`. El usuario crea el proyecto y pasa `projectId`. | Gala puede entrar a `/studio` y ver el Studio vacío |
| **1.2** | **Schemas** `proyecto` y `configuracion` (§8), con el orden por drag-and-drop y el singleton. | Se puede cargar un proyecto completo desde el Studio |
| **1.3** | **Queries GROQ + typegen** (§8.5). Centralizadas, tipadas, sin inline. | `pnpm typegen` genera tipos y el build pasa en strict |
| **1.4** | **Listado** `/trabajos` (§5.3). Es la pantalla más simple de las tres: grilla + card. | El listado muestra los proyectos reales de Sanity |
| **1.5** | **Ficha** `/trabajos/[slug]` (§5.4). Columna de texto + grilla de galería + lightbox + PREV/NEXT. | Una obra real renderiza completa, con lightbox andando |
| **1.6** | **Home** `/` (§5.2). El carrusel de destacados. Va última de las tres **porque es la única con estado de cliente** y conviene hacerla cuando el resto ya está probado. | El carrusel anda con teclado, con los dots y con el botón |

**Al terminar la fase 1** el portfolio está usable en español. Gala ya puede cargar obra.

## 1.4 Fase 2 — Bilingüe

> **Objetivo:** las tres pantallas en español e inglés.
> **Por qué acá y no antes:** ver la decisión 4 de §1.1.

| Paso | Qué | Criterio de terminado |
|---|---|---|
| **2.1** | **i18n en Sanity** (§9.2): `@sanity/document-internationalization` para `proyecto`, `@sanity/internationalized-array` para `configuracion`. | Gala crea la versión EN de una obra desde el Studio |
| **2.2** | **i18n en Next** (§9.3): routing, `[locale]`, `generateStaticParams` por idioma. | `/trabajos/casa-elen` y `/en/works/casa-elen` renderizan |
| **2.3** | **Switcher EN · ES** (§5.1) + `hreflang` + `lang` correcto en el `<html>`. | El switcher cambia de idioma manteniendo la página |

## 1.5 Fase 3 — Producción de verdad

> **Objetivo:** el sitio en su dominio, actualizable por Gala sin intervención nuestra.

| Paso | Qué | Criterio de terminado |
|---|---|---|
| **3.1** | **Webhook de revalidación** (§7.1): Sanity → `/api/revalidate` → `revalidateTag`. | Gala publica un cambio y el sitio lo muestra en segundos |
| **3.2** | **SEO**: `generateMetadata`, Open Graph con la portada, `sitemap.ts`, `robots.ts`, datos estructurados. | El sitemap lista las dos versiones de idioma |
| **3.3** | **Dominio** en Cloudflare (§17.4) + HTTPS + redirects. | El sitio responde en su dominio propio |
| **3.4** | **Accesibilidad y performance**: skip link, foco visible, teclado en el lightbox, `sizes` correctos, Lighthouse. | Lighthouse ≥ 95 en Performance y Accessibility |

## 1.6 Fase 4 — Las tres pantallas que faltan

> **Bloqueada por diseño.** Se ejecuta cuando el usuario suba a Figma Estudio, Noticias y
> Contacto. Al llegar el diseño, **primero se actualiza §5.5 de este spec** y recién después se
> escribe código.

| Paso | Qué |
|---|---|
| **4.1** | **Estudio** `/estudio` — texto del estudio, retrato, CV |
| **4.2** | **Noticias** `/noticias` — lista de fechas de eventos (§8.3) |
| **4.3** | **Contacto** `/contacto` — mail, Instagram, Behance, dirección |

## 1.7 Tablero de avance

Claude actualiza esta tabla al cerrar cada paso. **Es la fuente de verdad del progreso.**

| | Paso | Estado |
|---|---|---|
| **Fase 0** | 0.1 Scaffold | 🔴 **NEXT** |
| | 0.2 Tokens del Figma | ⬜ |
| | 0.3 Layout base | ⬜ |
| | 0.4 Primer deploy | ⬜ |
| **Fase 1** | 1.1 Proyecto de Sanity + Studio | ⬜ |
| | 1.2 Schemas | ⬜ |
| | 1.3 Queries + typegen | ⬜ |
| | 1.4 Listado | ⬜ |
| | 1.5 Ficha | ⬜ |
| | 1.6 Home | ⬜ |
| **Fase 2** | 2.1 i18n en Sanity | ⬜ |
| | 2.2 i18n en Next | ⬜ |
| | 2.3 Switcher + hreflang | ⬜ |
| **Fase 3** | 3.1 Webhook de revalidación | ⬜ |
| | 3.2 SEO | ⬜ |
| | 3.3 Dominio | ⬜ |
| | 3.4 Accesibilidad y performance | ⬜ |
| **Fase 4** | 4.1 Estudio | ⬜ bloqueada por diseño |
| | 4.2 Noticias | ⬜ bloqueada por diseño |
| | 4.3 Contacto | ⬜ bloqueada por diseño |
| **Fase 5** | 5.1 Carga de obra real | ⬜ bloqueada por contenido |

Referencias: 🔴 next · 🟡 en curso · ✅ hecho · ⬜ pendiente

---

# §2. Estado de la infraestructura

| | |
|---|---|
| Repo | **https://github.com/emmchier/gala-arq** |
| Carpeta local | `~/Documents/proyectos/gala-arq` |
| **Figma** | **https://www.figma.com/design/emDsp7Xtbz8TVk8TU7suuC/Gala-Arq** |
| `fileKey` de Figma | `emDsp7Xtbz8TVk8TU7suuC` |
| Página de Figma a usar | **`High Fidelity`** (`33:4819`) — ver §4.1 |
| Proyecto de Sanity | no creado todavía — anotar `projectId` acá |
| Dataset | a definir (`production`) |
| Hosting | Cloudflare Workers — no creado todavía |
| Dominio | a definir (§17.4) |
| Idiomas | **`es` (default) + `en`** (§9) |

---

# §3. Contexto

- **Clienta:** **Ana Gallela ("Gala")** — arquitecta, amiga del usuario. Estudio de arquitectura.
- **Producto:** portfolio público **súper minimalista** + dashboard administrativo.
- **Objetivo:** mostrar la obra con la mayor sobriedad posible. En arquitectura el sitio no
  decora: ordena. La foto y el texto del proyecto son el contenido; todo lo demás se saca.
- **Secciones:** Home · Trabajos · Estudio · Noticias · Contacto.
- **Idiomas:** español por defecto, inglés como segundo idioma.
- **Premisa de trabajo:** economía de tokens. Claude escribe código y arquitectura; el usuario
  hace lo manual (crear cuentas, apretar botones en paneles). Ver §15.

> ⚠️ **El diseño ya existe y es la fuente de verdad visual.** Este spec manda en arquitectura,
> datos y decisiones técnicas. **En todo lo visual manda el Figma.** No se inventan layouts,
> tipografías, escalas ni espaciados: se leen de §4 y §5, que salieron de leer el archivo.

---

# §4. Sistema de diseño

> Extraído del Figma el 19/11/2026, de la página **`High Fidelity`**.
> ⚠️ El archivo **no usa Variables de Figma**: los valores están crudos en las capas. Por eso esta
> sección es la única fuente de tokens. **Si cambia el Figma, se actualiza acá primero.**

## 4.1 Qué página mirar

El archivo tiene tres páginas. **Solo una sirve para construir:**

| Página | `nodeId` | Qué es |
|---|---|---|
| `Explorations` | `0:1` | bocetos. **Ignorar.** |
| `Handoff` | `33:3764` | 4 variantes de Home y 8 de Ficha. **Material de exploración, no de build.** |
| **`High Fidelity`** | **`33:4819`** | **las versiones elegidas. Construir desde acá.** |

Dentro de `High Fidelity`, la sección `Gala Arq portfolio` (`33:5887`) tiene las tres pantallas:

| Pantalla | Frame | `nodeId` |
|---|---|---|
| Home | `div.home · galería ampliada` | `33:4946` |
| Listado | `div.trabajos · listado de proyectos` | `33:4986` |
| Ficha | `div.project-detail · 07 · ficha y cuadrícula compacta` | `33:5562` |

> 💡 Las capas están nombradas con **semántica HTML** (`header.site-header`, `main#contenido`,
> `article.project-card`, `nav.breadcrumb`). **Respetar esos nombres al escribir el markup**: el
> diseño ya define la semántica y es correcta. Es un regalo, no lo desperdiciemos.

## 4.2 Tipografías

Dos familias, y cada una tiene un solo trabajo:

| Familia | Pesos | Dónde |
|---|---|---|
| **Josefin Sans** | Light (300), Medium (500) | **solo el logo** `gala arq` |
| **Manrope** | ExtraLight (200), Light (300) | **todo el resto del sitio** |

- El logo es `gala` en Light + `arq` en Medium, 16px, mismo color.
- **Todo el resto del sitio es Manrope Light (300).** ExtraLight (200) aparece **una sola vez**:
  el idioma inactivo del switcher.
- Cargar ambas por **`next/font/google`**, self-hosted. Solo los pesos listados, y solo los
  subsets `latin` y `latin-ext` (hace falta `latin-ext` por los acentos del español).

## 4.3 Escala tipográfica

**El tracking es la firma del diseño: `0.16em` en casi todo.** Es lo que le da el aire. Si se
pierde el tracking, se pierde el diseño.

| Rol | Tamaño | Line height | Tracking | Color | Transform |
|---|---|---|---|---|---|
| `project-title` (ficha, h1) | 24px | 20px | 3.84px = **0.16em** | `#1e1e1e` | — |
| `project-title` (card, h2) | 16px | 20px | 2.56px = **0.16em** | `#1e1e1e` | — |
| `project-location` | 16px | 20px | 2.56px = **0.16em** | `#6f7579` | — |
| `project-year` (ficha) | 16px | 20px | 2.56px = **0.16em** | `#6f7579` | — |
| `project-description` | 16px | 20px | 2.56px = **0.16em** | `#6f7579` | — |
| `project-credits` | 16px | 20px | 2.56px = **0.16em** | `#6f7579` | — |
| `nav-label` (sidebar) | 14px | 20px | 2.24px = **0.16em** | `#6f7579` | **uppercase** |
| `breadcrumb` | 14px | 20px | 2.24px = **0.16em** | `#1e1e1e` | **uppercase** |
| `pagination-label` (PREV/NEXT) | 14px | 20px | 2.24px = **0.16em** | `#1e1e1e` | **uppercase** |
| `language` activo | 14px | 20px | — | `#1e1e1e` | — |
| `language` inactivo | 14px | 20px | — | `#6f7579` | — (peso **200**) |
| `social-link` | 14px | 16px | — | `#6f7579` | — |
| `project-year` (card) | 10px | 14px | 1.6px = **0.16em** | `#6f7579` | — |
| `footer` | 10px | 14px | — | `#6f7579` | — |
| `brand` | 16px | normal | — | `#1e1e1e` | — (Josefin Sans) |

**Observaciones que importan al implementar:**
- **El line-height es menor que el font-size en varios casos** (24px de texto con 20px de línea).
  Es intencional y es parte del look. No "corregirlo".
- **Sin tracking:** el switcher de idioma, los links sociales y el footer. Todo lo demás lo lleva.
- Solo hay **tres tamaños reales** en el cuerpo del sitio: 24 / 16 / 14, más 10 para metadatos.

## 4.4 Colores

La paleta es **monocromática salvo los dots del carrusel**.

| Token | Valor | Uso |
|---|---|---|
| `ink` | `#1e1e1e` | títulos, breadcrumb, idioma activo, logo |
| `muted` | `#6f7579` | **todo el texto de cuerpo**, nav, metadatos, footer |
| `bg` | `#ffffff` | fondo |

**Dots del carrusel** (§5.2) — el único color del sitio:

| Dot | Valor |
|---|---|
| activo | `#819b4d` (verde oliva, saturado) |
| pastel 1 | `#efdfd6` |
| pastel 2 | `#daebaf` |
| pastel 3 | `#cff1f1` |
| pastel 4 | `#e8c6c2` |

> ⚠️ **Pregunta abierta (§16):** los 4 dots inactivos son **4 colores distintos**, no un gris
> compartido. Eso sugiere que **cada proyecto lleva su propio color de acento**, mostrado pastel
> cuando está inactivo y saturado cuando está activo. Si es así, `color` es un campo de
> `proyecto` (§8.1). **Confirmar con el usuario antes de modelarlo.** Mientras tanto el schema lo
> incluye como opcional.

## 4.5 Grilla y layout

Todo el sitio vive en una grilla de columnas fijas. Medidas tomadas a **1366px** de ancho:

```
|← 64 →|                        page-container = 1238                        |← 64 →|
```

**Listado y Ficha** comparten exactamente la misma grilla de tres columnas:

```
| sidebar 177 | gap 72 | columna de texto 288 | gap 72 | grilla de medios 629 |
└──────────────────────── main#contenido = 1238 ────────────────────────┘
```

**Home** usa dos columnas:

```
| sidebar 90 | gap 327 | sección de destacados 821 |
```

| Medida | Valor |
|---|---|
| Ancho de canvas | 1366 px |
| `page-container` | 1238 px (margen lateral 64) |
| `header.site-header` | 80 px de alto |
| Separación header → `main` | 64 px (el main arranca en y=144) |
| `footer.site-footer` | 48 px de alto |
| Sidebar (Listado y Ficha) | 177 px |
| Sidebar (Home) | 90 px |
| Columna de texto | 288 px |
| Grilla de medios | 629 px |
| Gap entre columnas | 72 px |
| **Celda de la grilla de medios** | **204 × 204 px** |
| Gap de la grilla de medios | 8 px |
| Columnas de la grilla de medios | **3** |

> `629 = 3 × 204 + 2 × 8`. La grilla de medios es la misma en Listado y en Ficha: **3 columnas,
> celda cuadrada, gap de 8**. Un solo componente sirve para las dos pantallas.

**Cómo implementarla:** CSS Grid con áreas nombradas en el `main`, no flex con anchos fijos. Los
valores de arriba son los de 1366px; a partir de ahí el responsive es decisión nuestra, porque
**el Figma solo tiene desktop** (§16).

## 4.6 Reglas de craft

- **Sin animaciones decorativas.** A lo sumo fades de 150–200 ms en navegación e imágenes.
- **Sin sombras, sin gradientes, sin bordes redondeados** salvo donde el Figma los tenga.
- El **lightbox** necesita foco atrapado, `Escape` y flechas.
- **Skip link** "Saltar al contenido" al principio del layout.
- **Un solo `h1` por página.** En la ficha es el título del proyecto; en el listado, el heading
  de sección (hoy vacío en el diseño, ver §5.3).

---

# §5. Las pantallas

## 5.1 Elementos comunes a las tres

### `header.site-header` (80px)
- Izquierda: `a.brand` → el logo `gala arq`, linkea a `/`.
- Derecha: `nav.language-switcher` → `EN · ES`. El idioma **activo** va en `ink` peso 300; el
  **inactivo** en `muted` peso 200. El separador es un `·`.

### `div.sidebar`
Cambia según la pantalla:
- **Home:** `nav.navbar` con los 4 links (`TRABAJOS`, `ESTUDIO`, `NOTICIAS`, `CONTACTO`) arriba, y
  `nav.social-links` (`Instagram`, `Behance`) **abajo del todo**, alineado al pie del main.
- **Listado y Ficha:** `nav.breadcrumb` arriba (`← VOLVER / TRABAJOS`). En la Ficha, además,
  `nav.project-pagination` (`PREV · NEXT`) **abajo del todo**.

> **La navegación principal solo está en la Home.** En Listado y Ficha, el sidebar lo ocupa el
> breadcrumb. Es una decisión fuerte del diseño: se navega volviendo, no saltando.
> ⚠️ Esto deja a Estudio/Noticias/Contacto sin forma de acceso desde el Listado y la Ficha.
> **Pendiente de resolver cuando se diseñen esas tres pantallas (§5.5).**

### `footer.site-footer` (48px)
- `2026 © Gala Arq · Legales · Powered by emmchier`, en 10px `muted`.
- En la Home va partido: copyright a la izquierda, `Legales · Powered by emmchier` a la derecha.
- En Listado y Ficha va todo junto a la izquierda.

## 5.2 Home — `/`

> Frame `33:4946`. Variante elegida: **"galería ampliada"**.

```
┌─ header ──────────────────────────────── gala arq ········· EN · ES ─┐
│                                                                      │
│  TRABAJOS          ●  ○  ○  ○  ○     ← carousel-pagination           │
│  ESTUDIO          ┌──────────────────────────────────────┐           │
│  NOTICIAS         │                                      │           │
│  CONTACTO         │        img.project-image        [→]  │           │
│                   │                                      │           │
│                   └──────────────────────────────────────┘           │
│  Instagram                                                           │
│  Behance                                                             │
└─ footer ── 2026 © Gala Arq ········· Legales · Powered by emmchier ──┘
```

**`section#proyectos-destacados`** (821 × 544):
- `div.carousel-toolbar` arriba: los **5 dots** (10.4px de diámetro, gap 10.4px).
- `figure.project-media`: la imagen, 821 × 513.
- `button.carousel-next`: botón circular de 42px con flecha, **superpuesto sobre el borde derecho
  de la imagen**, centrado verticalmente.

**Comportamiento:**
- Es el **único componente con estado de cliente de todo el sitio** (§7.3). Por eso se construye
  último en la fase 1.
- Teclado: flechas izquierda/derecha. Los dots son `button` con `aria-label`.
- Sin autoplay (no está en el diseño y es hostil en un portfolio).
- `priority` en la primera imagen; el resto lazy.

> **Qué muestra:** los proyectos marcados como destacados, en el orden curado. El diseño tiene 5.

## 5.3 Listado — `/trabajos`

> Frame `33:4986`.

```
┌─ header ─────────────────────────────────────────────────────────────┐
│                                                                      │
│  ← VOLVER / TRABAJOS   [heading]   ┌─────┐ ┌─────┐ ┌─────┐           │
│                                    │ img │ │ img │ │ img │           │
│                                    └─────┘ └─────┘ └─────┘           │
│                                    Casa Elen  Casa Elen  Casa Elen   │
│                                    2026       2026       2026        │
│                                     ... (grilla de 3 columnas)       │
└─ footer ─────────────────────────────────────────────────────────────┘
```

**`article.project-card`** (204 de ancho):
- `figure.project-media` → imagen **cuadrada** 204 × 204, recorte `cover`.
- `div.project-info` (gap 3.5px respecto de la imagen, padding inferior 8px):
  - `h2.project-title` → nombre, 16px `ink`
  - `time.project-year` → año, 10px `muted`
- `a.project-link` → flecha que aparece **en hover**, posicionada sobre la imagen.
- La card entera es el área clickeable, no solo la flecha.

**`div.section-heading`** (288 de ancho): existe en el diseño pero está **vacío**
(`div.heading-placeholder`). Hay lugar reservado para un título de sección que todavía no se
diseñó. ⚠️ **Pendiente (§16):** definir si lleva un `h1` ("Trabajos") o queda vacío. Por
accesibilidad conviene que tenga un `h1`, aunque sea visualmente oculto.

> ⚠️ **No hay categorías ni filtros.** El diseño muestra una sola grilla plana de todos los
> proyectos. Esto **cambia respecto de la versión 0.2 de este spec**, que había copiado el esquema
> de 3 categorías del sitio de referencia. **Manda el Figma:** el listado es plano (§10).

## 5.4 Ficha de proyecto — `/trabajos/[slug]`

> Frame `33:5562`. Variante elegida: **"07 · ficha y cuadrícula compacta"**.

```
┌─ header ─────────────────────────────────────────────────────────────┐
│                                                                      │
│  ← VOLVER /      Casa Elen          ┌─────┐ ┌─────┐ ┌─────┐          │
│    TRABAJOS      City Bell          │ img │ │ img │ │ img │          │
│                  2026               └─────┘ └─────┘ └─────┘          │
│                                     ┌─────┐ ┌─────┐ ┌─────┐          │
│                  Located in the     │ img │ │ img │ │ img │          │
│                  leafy surroun-     └─────┘ └─────┘ └─────┘          │
│                  dings of City                                       │
│                  Bell, this ...      ... (grilla de 3 columnas)      │
│                                                                      │
│                  Obra finalizada                                     │
│                  arqs Gala ...                                       │
│                  Modelo @maru.fali                                   │
│                                                                      │
│  PREV · NEXT                                                         │
└─ footer ─────────────────────────────────────────────────────────────┘
```

**`section.project-overview`** (288 de ancho, gap 24px entre bloques):
1. `header.project-heading` (gap 8px): `h1.project-title` (24px `ink`) · `p.project-location`
   (16px `muted`) · `time.project-year` (16px `muted`).
2. `p.project-description` → la memoria del proyecto.
3. `p.project-credits` → los créditos, **una línea por crédito**. En el diseño:
   ```
   Obra finalizada
   arqs Gala Carolina Esnaola
   Modelo @maru.fali
   Idea creativa @gala_arq_
   Colaboración creativa @juancorvalanalcuaz
   Colaboración en cámara @mat.fotoart
   ```

**`section.project-gallery`** (629 de ancho): la misma grilla de 3 columnas del listado.
Cada `figure.gallery-item` tiene un `button.gallery-open` que abre el lightbox.

**`nav.project-pagination`**: `PREV · NEXT` al pie del sidebar, navegando en el **orden curado**
(§8.1), no por fecha.

> 📌 **Decisión de implementación:** la columna de texto queda **sticky** mientras la galería
> scrollea. En el Figma la columna es más corta que la galería (724 vs 1691), así que si no es
> sticky queda un hueco enorme de blanco. **Confirmar con el usuario (§16).**

## 5.5 Pantallas pendientes de diseño

**Estudio, Noticias y Contacto todavía no están en Figma.** El usuario confirmó que van a seguir
los mismos patrones con pequeñas variaciones.

**Cuando lleguen, el procedimiento es:**
1. Leer el Figma y **actualizar esta sección** con la estructura de cada pantalla.
2. Actualizar §8 si aparecen campos de contenido nuevos.
3. Recién entonces ejecutar la fase 4 (§1.6).

**Lo que ya se puede anticipar** (no construir todavía):
- Las tres heredan `header`, `footer`, grilla y tokens de §4.
- Las tres van a necesitar **resolver el acceso a la navegación principal**, que hoy solo existe
  en la Home (§5.1).
- **Noticias** es una lista de fechas de eventos, no un blog (§8.3).

---

# §6. Stack

## 6.1 Lo que usamos

| Capa | Herramienta | Versión al 19/11/2026 |
|---|---|---|
| Framework | **Next.js** (App Router, RSC) | 16.4.6 |
| Lenguaje | **TypeScript** | ⚠️ ver §6.2 |
| Estilos | **Tailwind CSS** v4 (CSS-first, `@theme`) | 4.3.5 |
| Componentes | **shadcn/ui** | 4.23.0 |
| Estado de cliente | **Zustand** | 5.1.0 |
| CMS + dashboard | **Sanity** + `next-sanity` | 6.24.0 / 13.5.1 |
| i18n (Sanity) | `@sanity/document-internationalization` + `@sanity/internationalized-array` | §9.2 |
| Hosting | **Cloudflare Workers** | adaptador en §6.4 |
| Dominio / DNS | **Cloudflare** (Registrar + DNS) | — |

Convenciones: App Router, **Server Components por defecto**, `"use client"` solo donde hace falta
interacción. Package manager **pnpm**. Node LTS.

## 6.2 TypeScript — verificar antes de fijar

El `latest` de npm es **7.0.2** (el compilador nativo). **Confirmar que Next.js 16.4 lo soporta
sin fricción** antes de fijarlo. Si hay cualquier problema, quedarse en la **5.x más reciente**,
que es la combinación probada. No pelear con el compilador en el paso 0.1.

## 6.3 shadcn/ui con criterio

Este sitio necesita **muy pocos** componentes de librería. Previstos:

| Componente | Para qué |
|---|---|
| `dialog` | el lightbox de la galería |
| `sheet` | el menú mobile (cuando se diseñe) |
| `carousel` | la Home — **evaluar**: puede salir más limpio a mano |

**No instalar el set completo.** Cada componente que entra hay que re-estilarlo entero para que
no parezca una app de dashboard: los defaults de shadcn (radios, sombras, pesos) son lo contrario
de este diseño.

> ⚠️ **Trampa conocida de shadcn + Tailwind v4:** el CLI tiende a generar config de **v3**. En v4
> el theme va en el CSS con `@theme` y `tailwind.config.ts` **se ignora**. Además
> `tailwindcss-animate` está deprecado en v4. **Verificar esto en el paso 0.1**, no después de
> escribir 20 componentes.

## 6.4 Hosting: con qué adaptador

| Camino | Estado | Cuándo |
|---|---|---|
| **`@opennextjs/cloudflare`** 1.20.17 | maduro, en producción en muchos sitios | **default nuestro** |
| `vinext` | **beta**, pero es lo que **Cloudflare recomienda** | reevaluar en 0.4 |

**Decisión: arrancar con `@opennextjs/cloudflare`.** Soporta lo que el proyecto necesita (ISR,
route handlers para el webhook). `vinext` promete builds más rápidos y menos JS, pero estando en
beta no se le pone encima el sitio de una clienta.

**Limitaciones del adaptador, a tener presentes en el paso 0.4:**
- No soporta **Turbopack** para el build de producción.
- No soporta el runtime `edge`: nada de `export const runtime = "edge"`.
- Hace falta el service binding **`WORKER_SELF_REFERENCE`**. Si falta: **500 en `workers.dev`**.
- El cache de ISR necesita un **KV namespace** en `wrangler`.

## 6.5 Qué NO se usa

- **Wix** en ninguna de sus formas. Descartado el 19/11/2026.
- **Vercel** como hosting: el dominio y el hosting van en Cloudflare.
- Base de datos propia: el contenido vive en Sanity. Sin Postgres, sin ORM.
- Auth propia: el acceso al dashboard lo resuelve Sanity (§12.1).
- Librería de animación.

---

# §7. Arquitectura

## 7.1 Estratégia de renderizado

Un portfolio es contenido que cambia poco y se lee mucho. Entonces:

- **Todo el sitio público es estático** (SSG): `generateStaticParams()` en las rutas dinámicas y
  Server Components que consultan Sanity en build.
- **Revalidación on-demand, no por tiempo:** un webhook de Sanity pega en `/api/revalidate`, que
  llama `revalidateTag()`. Gala publica y el sitio se actualiza en segundos, sin rebuild manual y
  sin pagar cómputo por visita.
- Las queries se etiquetan con `next: { tags: [...] }` para invalidar por tipo de documento.
- **Nada de `force-dynamic`** en páginas públicas.

**Consecuencia económica:** las visitas pegan a **static assets**, que en Cloudflare son gratis e
ilimitados y **no cuentan contra el billing de Workers**. El Worker solo se invoca en el webhook.
Por eso el sitio entra cómodo en el plan free (§17.3).

## 7.2 Rutas

El diseño define una jerarquía plana (§5.3):

```
/                        → Home (carrusel de destacados)
/trabajos                → listado, grilla de 3 columnas
/trabajos/[slug]         → ficha de obra
```

Con el prefijo de idioma para inglés (§9.3).

## 7.3 Dónde vive el estado (y por qué casi no hay)

Con RSC, la mayoría del sitio **no tiene estado de cliente**. Zustand entra solo para:
- el **carrusel** de la Home (índice activo),
- el **lightbox** de la galería (foto abierta, abierto/cerrado),
- el **menú mobile** (cuando se diseñe).

**No meter el contenido de Sanity en Zustand.** Viaja por props desde el servidor. Un store que
espeja datos del servidor es un bug esperando a pasar.

---

# §8. Modelo de contenido (Sanity)

> ⚠️ **Este modelo salió de leer el Figma, no de suponer.** La versión 0.2 de este spec tenía una
> ficha técnica estructurada (superficie, programa, comitente, distinción...) copiada del sitio de
> referencia. **El diseño real no la tiene.** Se eliminó.

## 8.1 Documento `proyecto`

| Campo | Tipo | Dónde se ve | Notas |
|---|---|---|---|
| `titulo` | `string` | card, ficha (h1) | **obligatorio** |
| `slug` | `slug` | URL | source: `titulo`, **obligatorio** |
| `ubicacion` | `string` | ficha | "City Bell" |
| `anio` | `number` | card, ficha | **obligatorio** |
| `descripcion` | `array[block]` | ficha | la memoria del proyecto |
| `creditos` | `array[credito]` | ficha | ver abajo |
| `portada` | `image` (hotspot) | card, carrusel | **obligatoria** |
| `galeria` | `array[image]` (hotspot) | ficha | cada una con `alt` **obligatorio** |
| `destacado` | `boolean` | Home | aparece en el carrusel |
| `color` | `color` / `string` | dots del carrusel | ⚠️ **a confirmar** (§4.4) |
| `orderRank` | `string` | orden curado | drag-and-drop en el Studio |
| `seoTitle`, `seoDescription` | `string` | `<head>` | opcionales, con fallback |

**Objeto `credito`** — modela cada línea del bloque de créditos (§5.4):

| Campo | Tipo | Ejemplo |
|---|---|---|
| `rol` | `string` (opcional) | `"Idea creativa"` |
| `valor` | `string` | `"@gala_arq_"` |

Se renderiza como `{rol} {valor}`, una línea por ítem, omitiendo el rol si está vacío (así sale
`Obra finalizada` sola, como en el diseño). Si `valor` empieza con `@`, se linkea a Instagram.

> **Por qué un array y no texto libre:** se ve exactamente igual que en el Figma, pero permite
> validar que el crédito de fotografía esté presente y linkear los handles. El riesgo legal de
> publicar fotos de arquitectura sin crédito es real (§14.7).

**Dos simplificaciones que regala Sanity:**

1. **No hay campo `publicado`.** Sanity tiene **draft/published nativo**: un borrador no es
   visible sin token. Un booleano sería una segunda fuente de verdad que tarde o temprano se
   desincroniza.
2. **No hay campo `orden` numérico.** Se usa **`@sanity/orderable-document-list`**, que da
   drag-and-drop real. Reordenar con enteros obliga a renumerar vecinos a mano.

> ⚠️ **No hay `categoria`.** El diseño no tiene categorías ni filtros (§5.3). Si más adelante Gala
> las pide, se agrega el campo **y** se rediseña el listado. **No agregarlo "por las dudas".**

## 8.2 Documento `configuracion` (singleton)

Para que Gala edite los datos del sitio sin tocar código: `nombreEstudio`, `textoEstudio`,
`retrato`, `email`, `telefono`, `instagram`, `behance`, `direccion`, `cv`, `textoLegal`.

Singleton: un documento con `_id` fijo, oculto de "crear nuevo" y fijado en la estructura del
Studio. Se consulta una vez y se pasa al layout (header, sidebar, footer).

## 8.3 Documento `noticia` — fase 4

**Lista de fechas de eventos**, no un blog.

| Campo | Tipo | Notas |
|---|---|---|
| `titulo` | `string` | |
| `fecha` | `date` | **el dato que ordena y que se ve** |
| `fechaFin` | `date` | opcional, para rangos |
| `tipo` | `string` | exposicion · conferencia · premio · publicacion · concurso · otro |
| `lugar` | `string` | "Museo Castagnino, Rosario" |
| `bajada` | `text` | una o dos líneas |
| `linkExterno` | `url` | nota de prensa, inscripción |

Lista cronológica descendente, agrupada por año, formato `es-AR`. **Sin página de detalle** en la
primera versión. Si no hay al menos 3 o 4 eventos para cargar, **la sección no se publica**: una
sección de noticias vacía queda peor que no tenerla.

## 8.4 Consultas de contacto

- **A (MVP):** sin formulario. Mail, Instagram, Behance y dirección. Cero backend, cero spam.
- **B (si Gala lo pide):** route handler en `/api/contacto` que valida en servidor y manda el mail
  por un proveedor, con rate limiting. **No guardar las consultas en Sanity**: no son contenido.

Arrancar con A, y decidir cuando se diseñe la pantalla de Contacto.

## 8.5 Queries

- **GROQ**, centralizadas en `src/sanity/queries/`, **nunca inline** en componentes.
- Tipos con **`sanity typegen`** a partir del schema y las queries. Nada de tipar a mano.
- Cada query pide **solo los campos que usa**: el listado no trae `galeria` ni `descripcion`.

---

# §9. Estrategia bilingüe

## 9.1 Qué se traduce y qué no

| Contenido | ¿Se traduce? |
|---|---|
| `titulo`, `ubicacion`, `descripcion`, `creditos`, SEO | **sí** |
| `portada`, `galeria`, `anio`, `color`, `orderRank` | **no** — son los mismos en los dos idiomas |
| Textos de interfaz (`TRABAJOS`, `VOLVER`, `PREV`...) | **sí**, pero viven en el código, no en Sanity |

## 9.2 En Sanity: enfoque híbrido

Sanity tiene dos estrategias y **la recomendación oficial depende del tipo de contenido**:

| Documento | Estrategia | Plugin | Por qué |
|---|---|---|---|
| `proyecto`, `noticia` | **document-level** | `@sanity/document-internationalization` | tienen **URL propia** (slug por idioma) y **Portable Text**. Sanity desaconseja field-level con Portable Text porque se chocan los límites de atributos. Además permite publicar cada idioma por separado. |
| `configuracion` | **field-level** | `@sanity/internationalized-array` | son strings cortos, no tienen URL. Duplicar el documento entero sería absurdo. |

**El costo de document-level, dicho claro:** cada idioma es un documento aparte, así que la
galería queda duplicada. Al crear la traducción el plugin **copia el documento entero**, imágenes
incluidas (son referencias al mismo asset, no ocupan storage doble). Gala traduce solo el texto.
⚠️ **Pero si más adelante agrega una foto, tiene que agregarla en los dos idiomas.** Es el precio
de tener slugs y publicación por idioma. Si se vuelve molesto, la alternativa es mover
`galeria`/`portada` a un documento base compartido y referenciarlo (más schema, menos fricción
editorial). **No lo hagamos de entrada: resolvamos el problema si aparece.**

## 9.3 En Next: routing

- **`es` es el idioma por defecto y va sin prefijo.** `en` va prefijado.
- Estructura: `app/[locale]/...` con `localePrefix: 'as-needed'`.

```
/trabajos                  → listado en español
/trabajos/casa-elen        → ficha en español
/en/works                  → listado en inglés
/en/works/casa-elen        → ficha en inglés
```

- ⚠️ **Decisión abierta (§16):** si los **segmentos de ruta** también se traducen
  (`/trabajos` ↔ `/en/works`) o quedan iguales (`/en/trabajos`). Traducirlos es mejor para SEO y
  es lo que hace el sitio de referencia, pero agrega un mapa de rutas por idioma.
- `generateStaticParams()` devuelve **el producto de idiomas × slugs**.
- `hreflang` recíproco en las dos versiones, más `x-default` apuntando a español.
- El `<html lang>` tiene que cambiar por idioma.
- El switcher (§5.1) **mantiene la página**: desde la ficha en español va a la ficha en inglés,
  no a la home. Si esa obra no tiene traducción, el idioma se muestra deshabilitado.

## 9.4 Textos de interfaz

Las etiquetas fijas (`TRABAJOS`, `ESTUDIO`, `VOLVER`, `PREV`, `NEXT`, `Legales`...) **no van en
Sanity**: van en archivos de mensajes del proyecto. Son parte del diseño, no contenido editorial,
y Gala no tiene por qué poder romperlas.

---

# §10. Mapa de rutas

| Ruta | Archivo | Contenido |
|---|---|---|
| `/` | `app/[locale]/page.tsx` | Home: carrusel de destacados |
| `/trabajos` | `app/[locale]/trabajos/page.tsx` | listado, grilla de 3 columnas |
| `/trabajos/[slug]` | `app/[locale]/trabajos/[slug]/page.tsx` | **ficha de obra** |
| `/estudio` | fase 4 | pendiente de diseño |
| `/noticias` | fase 4 | pendiente de diseño |
| `/contacto` | fase 4 | pendiente de diseño |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | **el dashboard** |
| `/api/revalidate` | route handler | webhook de Sanity |
| 404 | `app/[locale]/not-found.tsx` | con link a Trabajos |
| `sitemap.xml`, `robots.txt` | `app/sitemap.ts`, `app/robots.ts` | generados desde Sanity |

- `generateStaticParams()` en los dos niveles dinámicos (idioma y slug).
- `generateMetadata()` por ficha, con fallback a `titulo` y `descripcion`, y **Open Graph con la
  portada**.
- El `/studio` queda **fuera del `[locale]`** y fuera del layout público, con su propio
  `layout.tsx` sin header ni footer, y **excluido del sitemap y de la indexación**.

---

# §11. Componentes

| Componente | Props clave | Dónde | Tipo |
|---|---|---|---|
| `SiteHeader` | locale, `configuracion` | layout | server |
| `LanguageSwitcher` | locale actual, ruta equivalente | header | **client** |
| `SiteFooter` | `configuracion` | layout | server |
| `Sidebar` | variante: `nav` \| `breadcrumb` | layout | server |
| `MainNav` | — | Home | server |
| `Breadcrumb` | label actual, href de vuelta | Listado, Ficha | server |
| `SocialLinks` | instagram, behance | Home | server |
| `FeaturedCarousel` | proyectos destacados[] | Home | **client** |
| `ProjectGrid` | items[] | Listado, Ficha | server |
| `ProjectCard` | titulo, anio, portada, href | Listado | server |
| `ProjectOverview` | titulo, ubicacion, anio, descripcion, creditos | Ficha | server |
| `ProjectCredits` | creditos[] | Ficha | server |
| `ProjectGallery` | galeria[] | Ficha | **client** (lightbox) |
| `ProjectPagination` | prev, next | Ficha | server |
| `SanityImage` | wrapper de `next/image` + `@sanity/image-url` | todos | server |

> **`ProjectGrid` es el mismo componente en el Listado y en la Ficha** (§4.5): 3 columnas, celda
> cuadrada de 204, gap 8. Cambia solo qué se renderiza adentro de cada celda.

---

# §12. Dashboard

El dashboard es el **Studio de Sanity**, embebido en `/studio`.

## 12.1 Login y permisos — no se programa

- El acceso lo resuelve Sanity: Gala se invita como miembro del proyecto por email.
- Rol recomendado: **Editor**. Crea, edita y publica contenido; no toca facturación ni miembros.
- El Studio no muestra nada sin sesión válida. **No hay auth propia, ni sesiones, ni tabla de
  usuarios, ni gate que mantener.**
- Activar **2FA** en la cuenta de Gala.
- El plan free incluye **20 asientos**: sobra.

## 12.2 Qué trae resuelto sin escribir código

El Studio ya hace alta, edición, borrado, draft/publish, historial y rollback. Sobre eso
**configuramos** (configuración, no desarrollo):

1. Lista de obras **ordenable con drag-and-drop**.
2. Formulario de obra = el schema de §8.1, con `fieldsets` y preview (portada + título + año).
3. `configuracion` como **singleton** fijado en la estructura.
4. Noticias ordenadas por fecha descendente (fase 4).
5. Preview de la obra apuntando a la URL real del sitio.
6. El selector de idioma del plugin de i18n (§9.2).

## 12.3 Lo único que sí es desarrollo

- `sanity.config.ts` con el `structure` custom y los plugins.
- Los schemas (§8).
- El webhook de revalidación (paso 3.1).
- **Visual Editing / Presentation**: fase 2 opcional. Es lindo, no es necesario.

---

# §13. Riesgos y cosas a vigilar

1. **El Figma solo tiene desktop (1366px).** No hay diseño mobile ni tablet. El responsive va a
   ser **decisión nuestra** y hay que validarlo con el usuario antes de darlo por bueno (§16).
2. **Correr Next.js en Cloudflare Workers es lo más riesgoso del stack.** Por eso el deploy es el
   paso 0.4 y no el último. Los dos errores clásicos: `WORKER_SELF_REFERENCE` faltante (500 en
   `workers.dev`) y el KV del cache de ISR sin configurar.
3. **shadcn + Tailwind v4:** el CLI tiende a escribir config de v3 (§6.3). Verificar en 0.1.
4. **TypeScript 7** (§6.2): verificar compatibilidad con Next 16 antes de fijarla.
5. **El tracking de `0.16em` es el diseño.** Si se pierde en la traducción a Tailwind, el sitio
   deja de parecerse al Figma aunque todo lo demás esté bien.
6. **Performance:** las fotos de arquitectura en alta son el riesgo técnico número uno. Pipeline
   de §18 + `next/image` con `sizes` correctos.
7. **Créditos de fotografía — riesgo legal real.** Las fotos de arquitectura casi siempre son de
   un fotógrafo con licencia limitada. Hay que confirmar con Gala que tiene permiso para publicar
   cada set.
8. **El bilingüe duplica el trabajo editorial de Gala** (§9.2). Hay que explicárselo antes de que
   cargue 50 obras, no después.
9. **SEO y accesibilidad son responsabilidad nuestra:** un solo `h1`, `alt` obligatorio, skip
   link, foco visible, `hreflang` recíproco.
10. **El repo es público.** Nunca commitear tokens de Sanity, credenciales de Cloudflare ni datos
    personales de la clienta. Todo por `.env.local`, que está en `.gitignore`. **Evaluar pasarlo
    a privado.**

---

# §14. Protocolo de trabajo

**El usuario, a mano:** crear cuentas (Sanity, Cloudflare), comprar o conectar el dominio, invitar
a Gala, pegar variables de entorno, diseñar las pantallas que faltan.

**Claude, en sesión:** arquitectura, schemas, queries, componentes, configuración del Studio,
deploy, revisiones y debugging. **Todo el código vive en el repo.**

## Reglas

1. **Claude lee este archivo al inicio de cada sesión** y arranca por el NEXT STEP de §0.
2. **Un paso por vez.** No adelantarse al siguiente aunque parezca fácil.
3. **Al cerrar cada paso:** marcar ✅ en §1.7, mover el NEXT STEP, commitear y pushear. **El
   estado del plan se actualiza en el mismo commit que el código del paso.**
4. **El repo es la fuente de verdad del código.** Si el repo y este archivo se contradicen, manda
   el repo y se corrige el archivo.
5. **Diseño:** leer el Figma por el MCP con el `fileKey` de §2 antes de pedir capturas. Si algo
   visual no está en §4 ni §5, **se lee del Figma y se baja acá**, no se inventa.
6. **Verificación visual obligatoria:** levantar el dev server y comparar contra el frame de
   Figma. No dar por bueno un componente sin verlo renderizado.
7. Toda decisión nueva se registra en §16 en la misma sesión en que se toma.
8. Secretos solo en `.env.local`.

---

# §15. Decisiones pendientes

Ordenadas por cuándo bloquean:

| # | Pregunta | Bloquea |
|---|---|---|
| 1 | **¿Cada proyecto tiene su color de acento?** Los 4 dots inactivos son 4 colores distintos (§4.4). | paso 1.2 (schema) |
| 2 | **¿La columna de texto de la ficha es sticky?** Si no, queda un hueco grande de blanco (§5.4). | paso 1.5 |
| 3 | **¿El listado lleva un `h1` visible?** Hay un placeholder vacío en el diseño (§5.3). | paso 1.4 |
| 4 | **¿Se traducen los segmentos de ruta?** `/en/works` vs `/en/trabajos` (§9.3). | paso 2.2 |
| 5 | **Responsive:** no hay diseño mobile. ¿Lo diseña el usuario o lo proponemos nosotros? | paso 0.3 |
| 6 | **¿Cómo se llega a Estudio/Noticias/Contacto** desde el Listado y la Ficha? (§5.1) | fase 4 |
| 7 | **Dominio:** ¿lo tiene Gala? ¿`galaarq.com`? ¿`.com.ar`? | paso 3.3 |
| 8 | ¿Las cuentas de Sanity y Cloudflare van a nombre del usuario o de Gala? | paso 1.1 |
| 9 | ¿Formulario de contacto o solo mail? (§8.4) | fase 4 |
| 10 | ¿Cuántas obras tiene para cargar al inicio? Define si hace falta carga masiva. | fase 5 |

---

# §16. Changelog de decisiones

| Fecha | Decisión |
|---|---|
| 2026-11-17 | Orden de las obras curado a mano, con drag-and-drop en el dashboard. |
| 2026-11-17 | El crédito de fotografía es obligatorio. |
| 2026-11-17 | `configuracion` singleton para los datos editables por Gala. |
| 2026-11-19 | **Se descarta Wix por completo** (Studio Two, ERC, su CMS, su dashboard y sus planes). |
| 2026-11-19 | **Stack: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + Zustand.** |
| 2026-11-19 | **Contenido y dashboard: Sanity**, Studio embebido en `/studio`. Sin auth propia. |
| 2026-11-19 | **Hosting y dominio: Cloudflare.** Adaptador `@opennextjs/cloudflare`. |
| 2026-11-19 | Estático por defecto + revalidación on-demand por webhook. |
| 2026-11-19 | Se eliminan `publicado` y `orden`: los reemplazan draft/publish nativo y `orderRank`. |
| **2026-11-19** | **Figma leído y bajado a especificación (§4, §5).** El diseño es la fuente de verdad visual. |
| **2026-11-19** | **Se elimina el anidado por categoría.** El diseño tiene un listado plano, sin categorías ni filtros. Se descarta el esquema de 3 categorías que venía del sitio de referencia. |
| **2026-11-19** | **Se elimina la ficha técnica estructurada** (superficie, programa, comitente, distinción). El diseño tiene título, ubicación, año, descripción y créditos. |
| **2026-11-19** | **Los créditos se modelan como array de `{rol, valor}`**, no texto libre: se ve igual y permite validar y linkear. |
| **2026-11-19** | **El listado lleva miniaturas**, no es texto solo. Corrige el supuesto que venía de la referencia. |
| **2026-11-19** | **Bilingüe híbrido:** document-level para `proyecto`/`noticia`, field-level para `configuracion`. `es` por defecto sin prefijo. |
| **2026-11-19** | **Plan maestro de 6 fases (§1)**, con deploy temprano (0.4) y bilingüe después de que un idioma funcione. |
| **2026-11-19** | La Home se construye **última** de las tres pantallas: es la única con estado de cliente. |

---

# §17. Costos

En el plan anterior (Wix) el sitio no se podía publicar con dominio propio sin un plan pago de
~US$19/mes, que con impuestos argentinos daba del orden de **$435.000 ARS al año**. Con este stack
el costo recurrente de plataforma **arranca en $0** y lo único que se paga es el dominio, del
orden de **US$15/año** con impuestos.

| Concepto | Costo |
|---|---|
| Next.js, Tailwind, shadcn, Zustand, TypeScript | **$0** — open source |
| Sanity (contenido, dashboard, CDN de imágenes) | **$0** en el plan Free |
| Cloudflare Workers (hosting) | **$0** en el plan Free |
| Acceso de Gala al dashboard | **$0** — el Free incluye 20 asientos |
| **Dominio** | **único costo recurrente** |

## 17.1 Sanity — plan Free

Verificado contra varias fuentes en nov-2026. **Confirmar en `sanity.io/pricing` al crear el
proyecto (paso 1.1).**

| | Free |
|---|---|
| Asientos | 20 |
| Documentos | 10.000 |
| Datasets | 2 (públicos) |
| Requests a la API CDN | 1.000.000 / mes |
| Bandwidth | 100 GB / mes |
| Assets | 100 GB |

- El Free **no tiene pay-as-you-go**: si se pasa un límite **se corta la API** (402), no se
  factura. Con el sitio estático el riesgo es bajo: los requests los hace el **build**, no el
  visitante.
- ⚠️ Los **datasets del Free son públicos**: el contenido es legible por cualquiera que sepa el
  `projectId`. Para un portfolio público es irrelevante, pero **no se guarda nada sensible ahí**.
- ⚠️ **El bilingüe con document-level duplica la cantidad de documentos.** Con 10.000 de límite y
  un portfolio de 50 obras, sigue sobrando muchísimo.

## 17.2 Cloudflare Workers — plan Free

| | Free | Paid |
|---|---|---|
| Precio | **$0** | US$5/mes mínimo |
| Requests al Worker | 100.000 / día | 10.000.000 / mes |
| **Static assets** | **gratis e ilimitados** | idem |

Los **static assets no cuentan** contra el billing. Como el sitio es estático por defecto, casi
todas las visitas se sirven como assets. Un portfolio no se acerca a los 100.000 requests diarios.

## 17.3 Dominio

- **Cloudflare Registrar vende a precio de costo**, sin markup ni "promo del primer año". Un
  `.com` ronda los **US$10–12/año**.
- **`.com.ar` no se compra en Cloudflare**: se registra en **NIC.ar** (en pesos, sin impuestos de
  exterior) y se usa Cloudflare solo como DNS.
- Conectar dominio propio a Workers **no requiere plan pago**.

## 17.4 Impuestos argentinos

Solo sobre lo que se pague en USD (hoy, el dominio):
- **IVA servicios digitales 21%** (RG 4240): se paga siempre.
- **Percepción 30% a cuenta de Ganancias** (RG 5617): **se evita pagando con dólares propios**.
  El Impuesto PAÍS ya no se aplica (terminó en dic-2024).
- **Percepción provincial de IIBB**, según la provincia.

---

# §18. Pipeline de imágenes

## 18.1 Lo que Sanity resuelve solo

- **Entrega:** el CDN de imágenes transforma al vuelo por querystring (`w`, `h`, `q`, `fit`,
  `auto=format`). Se guarda un archivo y el sitio pide la medida de cada breakpoint.
- **`hotspot` / `crop`:** Gala define el punto focal de cada foto. **Esto importa especialmente
  acá**, porque la grilla recorta todo a **cuadrado** (§4.5) y una foto de arquitectura mal
  recortada pierde el edificio.
- **Metadata:** Sanity extrae dimensiones y **LQIP**, que se usa como `blurDataURL`.
- **El uploader nativo del Studio alcanza.** No se construye uploader custom.

## 18.2 Cómo se consume desde Next

Un componente `SanityImage` envuelve `next/image` con `@sanity/image-url` y **siempre** recibe
`sizes` explícito. Sin `sizes` correcto, `next/image` sirve imágenes de más y se pierde todo.

`placeholder="blur"` con el LQIP. `priority` **solo** en la primera imagen del carrusel y en la
primera de la galería.

> ⚠️ **A verificar en el paso 0.4:** `next/image` con el optimizador de Next sobre Workers es un
> punto débil. Como Sanity ya entrega la imagen optimizada y del tamaño pedido, lo más robusto es
> **desactivar el optimizador de Next** (`images: { unoptimized: true }`) y dejar que Sanity haga
> el trabajo. Decidirlo midiendo.

## 18.3 Parámetros

Una foto de arquitectura mal comprimida se nota en **cielos (banding)** y en **texturas de
material**. Conservadores a propósito.

| Uso | Lado largo | Calidad |
|---|---|---|
| Celda de la grilla (204px @2x) | 448 px | `q=85` |
| Imagen del carrusel (821px @2x) | 1680 px | `q=88` |
| Lightbox | 2560 px | `q=90` |

**Nunca bajar de `q=82`.** Revisar la primera tanda al 100% de zoom, mirando cielos y hormigón.

## 18.4 Qué sube Gala

- **Regla:** subir **JPEG de lado largo ≤ 3000 px**. No TIFF, no RAW, no PSD, no el export de
  80 MB del fotógrafo. Ella conserva sus masters.
- **Carga inicial masiva:** si entrega una carpeta, Claude corre un script local en Node con
  `sharp` y se importa con la CLI de Sanity. Lo corremos nosotros, no Gala.
- **Nunca subir video a Sanity.** Va a Vimeo o YouTube y se guarda la URL; el iframe carga **solo
  al click**.

---

# §19. Fuentes

**Diseño**
- Figma — https://www.figma.com/design/emDsp7Xtbz8TVk8TU7suuC/Gala-Arq

**Next.js**
- https://nextjs.org/docs · https://www.npmjs.com/package/next

**Cloudflare**
- Next.js en Workers — https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext — https://opennext.js.org/cloudflare
- Compatibilidad de vinext — https://vinext.dev/compatibility
- Registrar — https://developers.cloudflare.com/registrar/

**Sanity**
- Sanity + Next.js — https://www.sanity.io/docs/nextjs
- Embeber el Studio — https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs
- **Localización** — https://www.sanity.io/docs/studio/localization
- `@sanity/document-internationalization` — https://www.npmjs.com/package/@sanity/document-internationalization
- Image URLs — https://www.sanity.io/docs/image-urls
- Pricing — https://www.sanity.io/pricing

**Tailwind y shadcn**
- https://tailwindcss.com/docs · https://ui.shadcn.com/docs/tailwind-v4 · https://ui.shadcn.com/cli

**Zustand**
- https://zustand.docs.pmnd.rs/

**Referencia de estructura (no de diseño)**
- https://diegoarraigada.com/es/
