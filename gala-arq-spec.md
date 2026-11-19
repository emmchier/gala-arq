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

> ### Paso `0.3` — Layout base
>
> **Estado:** no empezado. Los pasos `0.1` y `0.2` quedaron ✅ el 19/11/2026.
>
> **Qué hay que hacer:** construir el cascarón de §5.1 con contenido hardcodeado:
> `SiteHeader`, `SiteFooter`, `PageContainer`, `Sidebar` (variantes nav y breadcrumb) y la
> **grilla de 3 columnas** de §4.5. Desktop y mobile (§5.5).
>
> Los tokens ya están: usar `text-display`, `text-body`, `text-label`, `text-ui`, `text-social`,
> `text-meta`, `text-fine`, `text-brand`, `text-ink`, `text-quiet`, `bg-paper` y las variables de
> layout `--col-sidebar`, `--col-text`, `--col-media`, `--col-gap`, `--cell`, `--cell-gap`.
> **No hardcodear ningún valor que ya sea token.**
>
> **Referencia viva:** `/tokens` muestra toda la escala renderizada.
>
> **Criterio de terminado:** el header y el footer coinciden con el Figma a 1366px, y `pnpm build`
> pasa.
>
> **Cuando termine:** marcar `0.3` ✅ en §1.9 y mover este bloque a `0.4`.

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
| **1.1** | **Proyecto de Sanity** + Studio embebido en `/studio`. ⚠️ **Crearlo dentro de una organización**, no suelto en la cuenta personal: de eso depende que el traspaso a Gala sea simple (§16.5). Dataset `development`. | el Studio abre en `/studio` |
| **1.2** | **Schemas** `proyecto` y `configuracion` (§8), con el orden por drag-and-drop y el singleton. | Se puede cargar un proyecto completo desde el Studio |
| **1.3** | **Queries GROQ + typegen** (§8.5) **+ carga de contenido dummy** en `development` (§18.5). | `pnpm typegen` genera tipos, el build pasa en strict y hay ~10 obras de prueba cargadas |
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
| **3.3** | **Entorno de producción** (§6.5): Worker `gala-arq` + dataset `production` + migrar el contenido. | los dos entornos conviven, develop con `noindex` |
| **3.4** | **Accesibilidad y performance**: skip link, foco visible, teclado en el lightbox, `sizes` correctos, Lighthouse. | Lighthouse ≥ 95 en Performance y Accessibility |
| **3.5** | **Dominio** en Cloudflare (§17.3) + HTTPS + redirects. **Último paso de la fase**: recién cuando el sitio está testeado. | el sitio responde en su dominio propio |

## 1.6 Fase 4 — Las tres pantallas que faltan

> **Bloqueada por diseño.** Se ejecuta cuando el usuario suba a Figma Estudio, Noticias y
> Contacto. Al llegar el diseño, **primero se actualiza §5.5 de este spec** y recién después se
> escribe código.

| Paso | Qué |
|---|---|
| **4.1** | **Estudio** `/estudio` — texto del estudio, retrato, CV |
| **4.2** | **Noticias** `/noticias` — lista de fechas de eventos (§8.3) |
| **4.3** | **Contacto** `/contacto` — mail, Instagram, Behance, dirección |

## 1.7 Fase 5 — Carga de obra real

> **Bloqueada por contenido.** Depende de que Gala entregue fotos, textos y créditos.

Hasta que llegue, **todo se construye con contenido dummy** cargado en Sanity (§18.5).

| Paso | Qué |
|---|---|
| **5.1** | Carga de la obra real, créditos confirmados y revisión visual de las fotos |

## 1.8 Fase 6 — Traspaso a Gala

Cuando el sitio está en producción y funcionando: pasar la propiedad de Sanity, Cloudflare y el
repo, dejando a los dos con acceso.

| Paso | Qué |
|---|---|
| **6.1** | Traspaso de Sanity, Cloudflare, dominio y repo (§16.5) |

> 📌 **Lo que hay que hacer ahora para que esto sea simple después** está en §16.5, y afecta al
> paso 1.1: el proyecto de Sanity se crea **dentro de una organización**.

## 1.9 Tablero de avance

Claude actualiza esta tabla al cerrar cada paso. **Es la fuente de verdad del progreso.**

| | Paso | Estado |
|---|---|---|
| **Fase 0** | 0.1 Scaffold | ✅ 19/11/2026 |
| | 0.2 Tokens del Figma | ✅ 19/11/2026 |
| | 0.3 Layout base | 🔴 **NEXT** |
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
| | 3.3 Entorno de producción | ⬜ |
| | 3.4 Accesibilidad y performance | ⬜ |
| | 3.5 Dominio | ⬜ |
| **Fase 4** | 4.1 Estudio | ⬜ bloqueada por diseño |
| | 4.2 Noticias | ⬜ bloqueada por diseño |
| | 4.3 Contacto | ⬜ bloqueada por diseño |
| **Fase 5** | 5.1 Carga de obra real | ⬜ bloqueada por contenido |
| **Fase 6** | 6.1 Traspaso a Gala (§16.5) | ⬜ |

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
| Proyecto de Sanity | ✅ **Gala Arq** · `projectId` = **`3ibcmrqh`** |
| Organización de Sanity | ✅ **`Gala Arq`** = `ozejyyn9m`. El proyecto ya está transferido a ella (19/11/2026) |
| Código | ✅ paso 0.1: Next 16.4.6 + React 19.3 + Tailwind 4.3 + TS 5.9 + shadcn (radix/nova) + Zustand 5.1 + OpenNext 1.20.17 |
| Dataset de trabajo | `development` (se crea en el paso 1.1). `production` ya existe y queda vacío hasta la fase 3 |
| Cuenta de Cloudflare | ✅ creada. ⚠️ El `account_id` **no se commitea** (repo público): va en `CLOUDFLARE_ACCOUNT_ID` |
| Hosting | Cloudflare Workers — Worker no creado todavía |
| Dominio | a definir (§17.4) |
| Idiomas | **`es` (default) + `en`** (§9) |
| Assets de prueba | `assets/test-image.png` — ver §18.5 |

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

### Paleta de los dots del carrusel

> Frame `Dots` (`45:5891`). **Resuelto el 19/11/2026.**

El único color del sitio. Son **5 colores con dos estados cada uno**, y la secuencia **cicla por
posición**: el dot `n` usa el color `n % 5`.

| # | Default | Active |
|---|---|---|
| 1 | `#c9d1b9` | `#819b4d` |
| 2 | `#efdfd6` | `#bb8c72` |
| 3 | `#daebaf` | `#a2c73e` |
| 4 | `#cff1f1` | `#5eb6b6` |
| 5 | `#e8c6c2` | `#bb6d65` |

> ✅ **Esto cierra la pregunta de si cada proyecto lleva su color.** No lo lleva: el color sale de
> la **posición en el carrusel**, no del contenido. **No hay campo `color` en el schema.**
> Es una función pura del índice:
> ```ts
> const DOTS = [ ... ] as const
> const dot = DOTS[i % DOTS.length]
> ```

Medidas: **8px** de diámetro, **16px** de paso (8 de gap).

> 📌 Los dots existen para el **slider automático de la Home**, que es una idea inicial y puede
> eliminarse más adelante. Para el lanzamiento se mantiene.

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

## 4.6 Movimiento y transiciones

**Solo fades de entrada y salida.** Nada de slides, zooms, parallax, rebotes ni stagger.

| Token | Valor | Para qué |
|---|---|---|
| `--dur-fast` | **200 ms** | hover de la flecha de la card, estados de link |
| `--dur` | **320 ms** | **el default.** Fade de entrada de imágenes y de página |
| `--dur-slow` | **480 ms** | crossfade del carrusel |
| `--ease` | `cubic-bezier(0.4, 0, 0.2, 1)` | **toda** transición del sitio |

Reglas:
- **Una sola curva en todo el sitio.** Dos curvas distintas se notan y ensucian.
- Las imágenes entran con fade **desde el LQIP**, no desde blanco: ya hay un placeholder borroso
  (§18.1), así que la foto resuelve sobre él.
- El carrusel hace **crossfade**, no desplazamiento: las dos imágenes se superponen y una se
  desvanece sobre la otra.
- **Respetar `prefers-reduced-motion`:** con la preferencia activa, las duraciones van a `0ms`.
  No es opcional.
- **Nada anima al hacer scroll.** El contenido está presente desde el primer frame.

## 4.7 Reglas de craft

- **Sin animaciones decorativas.** El movimiento es solo de entrada y salida (§4.7).
- **Sin sombras, sin gradientes, sin bordes redondeados** salvo donde el Figma los tenga.
- El **lightbox** necesita foco atrapado, `Escape` y flechas.
- **Skip link** "Saltar al contenido" al principio del layout.
- **Un solo `h1` por página.** En la ficha es el título del proyecto; en el listado, el heading
  de sección (hoy vacío en el diseño, ver §5.3).

---

## 4.8 Los tokens en código — ✅ implementado en el paso 0.2

Viven en **`src/app/globals.css`**, una sola vez. Hay una **referencia viva renderizada en
`/tokens`**: esa página es la forma de verificar contra el Figma, y se actualiza sola porque usa
los tokens reales.

**Nombres en código.** Difieren del spec en dos casos, para no chocar con shadcn, que ya usa
`muted` como color de fondo:

| Spec | En código |
|---|---|
| `ink` | `text-ink` / `bg-ink` |
| `muted` | **`text-quiet`** |
| `bg` | **`bg-paper`** |

**Escala:** `text-display` (24) · `text-body` (16) · `text-label` (14, mayúsculas) ·
`text-ui` (14, sin tracking) · `text-social` (14/16) · `text-meta` (10) · `text-fine` (10, sin
tracking) · `text-brand` (16, Josefin Sans).

**Movimiento:** `duration-fast` / `duration-base` / `duration-slow` + `ease-site`.

**Layout:** variables en `:root` — `--page-max`, `--page-gutter`, `--header-h`, `--header-gap`,
`--footer-h`, `--col-sidebar`, `--col-sidebar-home`, `--col-text`, `--col-media`, `--col-gap`,
`--cell`, `--cell-gap`. Cambian solas en el breakpoint.

### Tres cosas que hay que saber antes de escribir componentes

1. **El peso 300 es el default del `html`.** No hace falta ponerlo en cada componente, y si ves
   un `font-light` suelto por ahí, sobra.
2. **El tracking del cuerpo es automático.** `text-body` ya baja a `0.08em` abajo de `640px` y
   vuelve a `0.16em` arriba. No hay que pensarlo por componente.
3. ⚠️ **Los colores de los dots se consumen como utilidades** (`bg-dot-1` … `bg-dot-5-on`),
   eligiendo de una **lista literal de clases** por índice:
   ```ts
   const DOTS = ["bg-dot-1", "bg-dot-2", "bg-dot-3", "bg-dot-4", "bg-dot-5"] as const;
   const clase = DOTS[i % DOTS.length];
   ```
   **No sirve `var(--color-dot-N)` en runtime:** el bloque es `@theme inline` y no emite las
   variables como custom properties. Es el bug que apareció al construir `/tokens`.

### shadcn

Se mantiene su contrato de variables para que `dialog` y `sheet` funcionen, pero **apuntando a
nuestra paleta**, con `--radius: 0px` (el diseño no tiene esquinas redondeadas) y **sin modo
oscuro**.

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

## 5.5 Mobile y responsive — **propuesta nuestra, a refinar**

> El Figma solo tiene desktop (1366px). El usuario decidió que **la propuesta mobile la hacemos
> nosotros** y que después él la diseña y refinamos sobre esto.
> **Estado: propuesta. No es diseño aprobado.** Se construye así salvo que el Figma diga otra cosa.

### Breakpoints

| Nombre | Rango | Qué layout |
|---|---|---|
| `base` | < 640px | mobile |
| `md` | 640 – 1023px | tablet |
| `lg` | ≥ 1024px | **el layout del Figma** |

Los valores de §4.5 son los de `lg`. Mobile-first: se escribe el mobile y `lg:` lo lleva al Figma.

| Medida | mobile | desktop |
|---|---|---|
| Margen lateral | **20px** | 64px |
| Header | 56px | 80px |
| Gap header → main | 32px | 64px |

### ⚠️ El problema del tracking en pantallas angostas

**Es el riesgo de craft número uno del mobile.** El `0.16em` que hace respirar al desktop, en una
línea de 335px produce **líneas cortas y muy irregulares**: el texto queda picado.

**Propuesta:**
- **Texto de cuerpo** (descripción, créditos): bajar a **`0.08em`** por debajo de `md`.
- **Etiquetas en mayúscula** (nav, breadcrumb, PREV/NEXT): **mantener `0.16em`**. Son strings
  cortos que no wrapean, y ahí el tracking es la identidad del diseño.

Los tamaños no cambian: 24 / 16 / 14 / 10 se sostienen bien en mobile.

### Navegación: lo único que hay que inventar

El desktop pone la nav **solo en la Home**, y en Listado y Ficha el sidebar lo ocupa el
breadcrumb (§5.1). En mobile eso deja las páginas internas sin salida.

**Propuesta:**
- **Home:** la nav **no necesita menú**. Es el contenido de la página: va como lista vertical
  debajo del carrusel, y los links sociales debajo. Mismo orden que el desktop, apilado.
- **Listado y Ficha:** un botón de texto **`MENÚ`** en el header, con el mismo estilo que el
  switcher de idioma, que abre un **`sheet` de shadcn** con los 4 links. El breadcrumb pasa a una
  franja propia debajo del header, alineado a la izquierda.

> Es la intervención más chica que resuelve el problema sin tocar el lenguaje visual: un botón de
> texto, misma tipografía, mismo peso. Nada de ícono de hamburguesa.

### Las tres pantallas en mobile

**Home.** Header → carrusel a ancho completo → dots → nav vertical → links sociales → footer.
El carrusel suma **swipe**; los dots se mantienen; la flecha se achica y se mete dentro del borde
en lugar de superponerse.

**Listado.** Breadcrumb → grilla de **2 columnas** (3 en `md`). Dos columnas mantienen el
carácter de índice del diseño; una sola columna lo convertiría en un feed, que es otro producto.
La flecha de hover no existe en touch: la card entera es el área clickeable y listo.

**Ficha.** El orden de apilado es la decisión real. Propuesta:

```
título · ubicación · año
galería
descripción
créditos
PREV · NEXT
```

> **Por qué la galería antes del texto:** en desktop las dos columnas conviven y ninguna "va
> primero". En mobile hay que elegir, y quien entra a un proyecto de arquitectura quiere **verlo**.
> El encabezado alcanza para saber qué está mirando; la memoria se lee después.
> ⚠️ Es lo más discutible de esta propuesta: **marcarlo para refinar con el Figma.**

La galería va a **2 columnas**, y el sticky de la columna de texto (§5.4) **no aplica**: en mobile
no hay dos columnas que desincronizar.

### Qué NO cambia en mobile

- Las dos tipografías, los tamaños y los colores.
- El footer, que ya es una línea de 10px.
- Las transiciones (§4.6).
- El recorte **cuadrado** de la grilla.

## 5.6 Pantallas pendientes de diseño

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

> ⚠️ **Verificado en el paso 0.1 (19/11/2026): el CLI de Cloudflare ya NO genera Next.js.**
> `pnpm create cloudflare@latest --framework=next` produce un proyecto **`vinext`**: sin
> dependencia de `next`, con `vite dev` / `vite build` y `vinext-cloudflare deploy`.
> **`vinext` no es Next.js**, es una reimplementación de su API sobre Vite.
>
> El usuario pidió **Next.js**, así que **no se usa ese scaffold**. El camino correcto es:
> `create-next-app` + agregarle `@opennextjs/cloudflare` a mano. Es un paso más de setup y el
> resultado es Next.js de verdad, en su versión estable.
>
> 📌 Si en el futuro se evalúa migrar a `vinext`, tener presente que **es un cambio de framework,
> no de adaptador**.

**Limitaciones del adaptador, a tener presentes en el paso 0.4:**
- ~~No soporta Turbopack para el build de producción.~~ ✅ **Verificado el 19/11/2026: sí lo
  soporta.** Next 16 buildea con Turbopack por defecto y `opennextjs-cloudflare build` lo procesa
  sin problemas. El dato de que no lo soportaba quedó viejo.
- No soporta el runtime `edge`: nada de `export const runtime = "edge"`.
- Hace falta el service binding **`WORKER_SELF_REFERENCE`**. Si falta: **500 en `workers.dev`**.
- El cache de ISR usa **R2**, no KV: es lo que trae la plantilla oficial del adaptador. Hay que
  **crear el bucket antes del primer deploy**:
  `pnpm wrangler r2 bucket create gala-arq-dev-opennext-cache`.

## 6.5 Entornos: develop y production

> **Principio: no se construyen dos entornos antes de que haya algo que proteger.**
> Hasta la fase 3 el sitio no tiene contenido real ni dominio ni visitantes. Un segundo entorno
> en el día uno es configuración que mantener a cambio de nada.

### Cómo se trabaja en cada fase

| Fases | Entornos | Dónde |
|---|---|---|
| **0 → 2** | **uno solo: develop** | Worker `gala-arq-dev` en `*.workers.dev` + dataset `development` |
| **3 en adelante** | **develop + production** | se agrega `gala-arq` con el dominio + dataset `production` |

`*.workers.dev` no está indexado y nadie lo conoce: alcanza como entorno de desarrollo y además
**descarta el riesgo de Workers temprano** (§13.2).

### Cómo queda a partir de la fase 3

| | develop | production |
|---|---|---|
| Worker | `gala-arq-dev` | `gala-arq` |
| URL | `gala-arq-dev.<cuenta>.workers.dev` | el dominio propio |
| Dataset de Sanity | `development` | `production` |
| Studio | `/studio` apuntando a `development` | `/studio` apuntando a `production` |
| Indexación | `robots: noindex` **siempre** | indexable |

**Dos Workers, no dos cuentas.** Se configuran con **environments de wrangler** en
`wrangler.jsonc` (`[env.production]`), y se deploya con `wrangler deploy --env production`.

**Los dos datasets entran justo en el plan free de Sanity**, que incluye exactamente 2 (§17.1).
No queda lugar para un tercero: si alguna vez hace falta, es upgrade.

### Trampas conocidas

- ⚠️ **`vars` no se hereda entre environments de wrangler.** Cada environment declara los suyos,
  completos. Si se asume herencia, producción sale con las variables de develop.
- ⚠️ **`--env` no siempre se respeta a través de `opennextjs-cloudflare deploy`** (hay un issue
  abierto en `workers-sdk`). Si pasa, invocar **`wrangler deploy --env` directamente**.
- ⚠️ **`NEXT_PUBLIC_*` se hornea en build time.** Producción necesita **su propio build**, no se
  puede promover el artefacto de develop.
- Las variables locales van en `.dev.vars`, y `.dev.vars*` al `.gitignore`.

### Branches

Proyecto de un desarrollador: **sin gitflow**. `main` es la verdad; se deploya a develop desde
`main` a mano, y a producción **solo deliberadamente**. CI/CD se evalúa en la fase 3, no antes.

### Verificación local antes de pushear

`next dev` para iterar, pero **antes de deployar** correr el preview de OpenNext, que ejecuta el
build de producción en **workerd**. Es lo único que atrapa lo que rompe específicamente en
Workers y no en Node.

## 6.6 Qué NO se usa

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

> ✅ **No hay `color`.** El color del dot sale de la posición en el carrusel, no del proyecto
> (§4.4).

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
- ⚠️ **Rol: `administrator`.** El `editor` **no sirve en el plan Free**: al terminar el trial los
  roles no-administrador se convierten en `viewer` y Gala no podría editar (§17.0). Como además
  ella va a terminar siendo la dueña (§16.5), administrador es el rol correcto de todos modos.
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

1. **El Figma solo tiene desktop (1366px).** El mobile es **propuesta nuestra** (§5.5) y hay que
   refinarlo cuando el usuario lo diseñe. El riesgo concreto: **el tracking de `0.16em` pica el
   texto en pantallas angostas** (§5.5), y eso no se ve hasta tenerlo renderizado.
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
| 1 | **¿La galería va antes del texto en la ficha mobile?** Lo más discutible de §5.5. | paso 1.5 |
| 2 | **¿El listado lleva un `h1` visible?** Hay un placeholder vacío en el diseño (§5.3). | paso 1.4 |
| 3 | **¿La columna de texto de la ficha es sticky?** Si no, queda un hueco grande de blanco (§5.4). | paso 1.5 |
| 4 | **¿Se traducen los segmentos de ruta?** `/en/works` vs `/en/trabajos` (§9.3). | paso 2.2 |
| 5 | **¿Cómo se llega a Estudio/Noticias/Contacto** desde el Listado y la Ficha? (§5.1) | fase 4 |
| 6 | **¿Formulario de contacto o solo mail?** (§8.4) | fase 4 |
| 7 | **El nombre del dominio.** No se compra hasta saberlo (§17.3). | paso 3.5 |
| 8 | **¿Se mantiene el slider automático de la Home?** El usuario lo marcó como idea inicial, posible de eliminar. Para el lanzamiento se mantiene (§5.2). | fase 5 |

### Resueltas

| Pregunta | Resolución | Cuándo |
|---|---|---|
| ¿Cada proyecto tiene su color de acento? | **No.** El color sale de la posición en el carrusel: paleta de 5 que cicla (§4.4). | 19/11/2026 |
| ¿Las cuentas van a nombre del usuario o de Gala? | **Del usuario**, y se traspasan al final. Sanity se crea **dentro de una organización** para que el traspaso sea simple (§16.5). | 19/11/2026 |
| ¿Cuándo se compra el dominio? | **Cuando se sepa el nombre**, no antes. No hay ventaja de SEO en comprarlo temprano (§17.3). | 19/11/2026 |
| ¿Cómo se manejan develop y production? | Un solo entorno hasta la fase 3; ahí se agrega producción (§6.5). | 19/11/2026 |
| ¿Cómo son las transiciones? | Solo fades, 320 ms, una sola curva (§4.6). | 19/11/2026 |
| ¿Quién diseña el mobile? | **Lo proponemos nosotros** (§5.5) y el usuario lo refina cuando lo diseñe. | 19/11/2026 |

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
| **2026-11-19** | **Los dots son una paleta de 5 que cicla por posición**, con estado default y active. No hay campo `color` en el schema. |
| **2026-11-19** | **Movimiento: solo fades**, 320 ms de default, una sola curva, y `prefers-reduced-motion` respetado. |
| **2026-11-19** | **Un solo entorno hasta la fase 3.** No se construyen dos entornos antes de que haya algo que proteger. |
| **2026-11-19** | **El dominio se compra cuando se sepa el nombre**, no antes: comprarlo temprano no da ventaja de SEO. |
| **2026-11-19** | **El proyecto de Sanity se crea dentro de una organización**, para que el traspaso a Gala sea una transferencia soportada y no una migración a mano. |
| **2026-11-19** | **El contenido dummy vive en Sanity**, no en fixtures locales: prueba el pipeline real y no se tira después. |
| **2026-11-19** | **Propuesta de mobile nuestra (§5.5)**, a refinar cuando el usuario la diseñe. Incluye bajar el tracking del cuerpo a `0.08em` y un botón `MENÚ` en las páginas internas. |
| **2026-11-19** | **Se construye el portfolio de Gala, no un genérico previo** (§16.4). El código ya es neutro por diseño: contenido en Sanity y marca en tokens. El template se extrae con el cliente 2. |

---

# §16.4 Reutilización: este proyecto como base de otros portfolios

El usuario quiere que esto sirva de base para otros portfolios de arquitectura.

> **Decisión: se construye el de Gala, no un genérico del que después se saque el de Gala.**
> La reutilización se consigue por **disciplina**, no por un repo aparte.

## Por qué en ese orden

**El código ya es genérico por diseño.** No hace falta construirlo aparte:

- Todo el contenido vive en **Sanity** (§8). No hay un solo texto de Gala en el código.
- Toda la identidad visual vive en **un archivo de tokens** (§4). Cambiar de marca es cambiar ese
  archivo.
- Sanity y Cloudflare son **por cliente de todos modos**: cada uno necesita su proyecto, su
  dataset, su Worker y su dominio. No hay nada que compartir ahí.

Entonces "el genérico" no es software distinto: **es este mismo repo con otros tokens y otro
`projectId`.** Un segundo repo no agrega capacidad, agrega un repo que mantener sincronizado.

**Y un genérico sacado de un solo caso no es genérico.** Es el diseño de Gala con el nombre
borrado. Las costuras reales de un template aparecen con el **segundo** cliente, que es el que
enseña qué era específico y qué era común. Abstraer antes es adivinar.

## La disciplina que lo mantiene extraíble (cuesta cero)

Vale la pena igual, se extraiga o no:

1. **Ningún dato de Gala en el código.** Nombre, mail, redes, textos legales: todo sale de
   `configuracion` (§8.2). Si aparece un string de Gala en un componente, está mal.
2. **Los tokens en un solo lugar** (§4.2–§4.4), en `@theme`. Nunca repetidos en componentes.
3. **Nombres de schema y de componentes genéricos:** `proyecto`, `ProjectCard`. Nunca
   `galaProyecto` ni `GalaHeader`.
4. **Lo específico de la instancia, en variables de entorno:** `projectId`, `dataset`,
   `account_id`, dominio. Nunca hardcodeado.
5. **Los textos de interfaz en archivos de mensajes** (§9.4), no sueltos en el markup. Eso ya hace
   falta para el bilingüe, así que sale gratis.

## Cuándo se extrae el template

**Cuando aparezca el cliente 2, no antes.** En ese momento el repo de Gala ya es el template: se
marca como *template repository* en GitHub o se saca un repo nuevo a partir de él, y lo que haya
que generalizar se generaliza **con dos casos reales a la vista**.

> ⚠️ **Lo que NO es esto:** un producto multi-tenant, con un deploy sirviendo muchos portfolios.
> Eso es otra arquitectura y mucho más trabajo. Para trabajo de estudio, cliente por cliente, el
> camino es **un deploy y un proyecto de Sanity por cliente**, a partir de un starter común.

---

# §16.5 Traspaso del proyecto a Gala

**Objetivo:** que al final Gala sea la dueña de todo y el usuario pueda desligarse sin dejarla
colgada. Durante la construcción, el usuario trabaja solo, sin depender de logins de Gala.

## La organización de Sanity

**Decisión: una organización por cliente, con el nombre del cliente.** Para Gala: **`Gala Arq`**.

**Por qué no una sola organización del estudio con todos los clientes:** el requisito es que Gala
termine siendo la dueña y el usuario pueda desligarse (§16.4 no lo cambia). Con una organización
por cliente, el traspaso es **hacerla administradora de su organización y salirse**: el proyecto
no se mueve de lugar, no hay transferencia entre organizaciones, no hay letra chica. Con una
organización común habría que sacar el proyecto de ahí, que es justamente el trámite con
gotchas.

Las organizaciones de Sanity son gratis, así que una por cliente no cuesta nada.

### Pasos, una sola vez

1. En `sanity.io/manage`, **dropdown de arriba a la izquierda** (el que dice el nombre de la
   cuenta) → **Create new organization**. Atajo directo: `sanity.io/manage/create-new-team`.
2. Nombre: **`Gala Arq`**.
3. Entrar al proyecto **Gala Arq** → pestaña **Settings** → bajar hasta **Danger zone** →
   **Transfer ownership** → elegir la organización → confirmar.
4. Verificar: el proyecto tiene que aparecer **bajo la organización**, no en los proyectos
   personales.

> No hay invitaciones que aceptar: la misma persona es administradora del proyecto y de la
> organización, así que la transferencia es inmediata.

> ⚠️ **Todavía NO agregar a Gala.** Eso es la fase 6. Sumarla ahora no le sirve de nada y, cuando
> venza el trial, su rol se degradaría a `viewer` igual (§17.0).

## Cómo se arma ahora para que el traspaso sea limpio después

| Servicio | Ahora | Al traspasar |
|---|---|---|
| **Sanity** | el usuario crea el proyecto **dentro de una organización**, no como proyecto personal | se transfiere la organización, o el proyecto a una organización de Gala |
| **Cloudflare** | cuenta del usuario, Worker en `workers.dev` | ver abajo |
| **Dominio** | **no se compra todavía** (§17.3) | lo compra Gala en su cuenta, o se transfiere |
| **GitHub** | repo del usuario | se transfiere el repo o se la agrega como colaboradora |

> 📌 **Lo más importante:** que el proyecto de Sanity **termine dentro de una organización**, no
> suelto en la cuenta personal.
>
> ✅ **No hace falta acertarle en el onboarding.** Un proyecto personal se puede mover después:
> *Settings → Danger zone → Transfer ownership → elegir la organización*. Hace falta ser
> administrador del proyecto y de la organización destino, cosa que se cumple sola si las creó
> la misma persona. Transferir un proyecto **a una
> organización** es el camino soportado y documentado; mover un proyecto entre dos cuentas
> personales es mucho más engorroso. Crear la organización al principio cuesta un minuto y ahorra
> el dolor entero.

## Sanity — cómo se transfiere

*Project Settings → Danger zone → Transfer ownership*, eligiendo la organización destino.

- Hace falta ser **administrador del proyecto y de la organización origen**, y que del lado que
  recibe haya un administrador o billing manager.
- ⚠️ **Las invitaciones pendientes no cuentan**: tienen que estar aceptadas de los dos lados antes
  de intentar la transferencia. Es la causa más común del error 401 al transferir.
- El `projectId`, los tokens y la configuración se preservan, así que **no hay que redeployar**.
- Los dos pueden quedar como miembros: el plan free tiene 20 asientos.

## Cloudflare — cómo se transfiere

Mover un dominio de Registrar entre cuentas **está soportado** (*Manage Domain → Configuration*),
pero tiene letra chica:

- Hay que **desactivar DNSSEC** antes.
- La cuenta origen **pierde toda la configuración de la zona**: los registros DNS hay que
  rehacerlos.
- Queda **bloqueado 30 días** para volver a transferirse.
- El dominio tiene que tener más de 10 días de registrado.

> 💡 **Por eso conviene que el dominio se compre directamente en la cuenta de Gala** cuando llegue
> el momento: evita la transferencia entera. Crear una cuenta de Cloudflare es gratis y lleva dos
> minutos; no hace falta que ella haga nada más que eso y poner la tarjeta.

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

## 17.0 ⚠️ El trial de 30 días y qué pasa cuando termina

Los proyectos nuevos arrancan con un **trial de Growth de 30 días**. Al vencer:

- **Si no se carga tarjeta, pasa solo al plan Free. No se cobra nada.** No hay que hacer nada
  para evitar el cobro.
- El trial **tiene las mismas cuotas que el Free**, así que no hay sorpresa de uso al bajar.

**Dos efectos del downgrade que sí importan:**

1. ⚠️ **Los miembros con roles distintos de administrador pasan a ser `viewer`.** En el plan Free
   los roles granulares no existen. **Consecuencia directa para nosotros: para que Gala pueda
   editar, tiene que ser `administrator`, no `editor`** (§12.1).
2. ⚠️ **Los datasets privados se vuelven públicos, y eso no se revierte.** Volver a Growth
   devuelve la *funcionalidad* de datasets privados, pero **no la visibilidad anterior**: hay que
   volver a marcarlos privados a mano. Para este proyecto es indistinto porque los datasets van a
   ser públicos igual, pero **no conviene marcar nada privado durante el trial** creyendo que se
   queda así.

## 17.1 Sanity — plan Free

Verificado contra `sanity.io/pricing` el 19/11/2026, **límite por límite contra lo que este
proyecto necesita**:

| | Free | Lo que necesitamos | |
|---|---|---|---|
| Asientos | **20** | 2: el usuario y Gala | ✅ |
| Documentos | **10.000** | ~50 obras × 2 idiomas + noticias ≈ 150 | ✅ |
| Datasets | **2 (solo públicos)** | 2: `development` + `production` | ✅ **justo** |
| Webhooks GROQ | **2** | 1: el de revalidación | ✅ |
| Roles | **2: `administrator` y `viewer`** | Gala como `administrator` | ✅ |
| Atributos únicos por dataset | **2.000** | los 3 schemas no llegan a 60 | ✅ |
| Requests a la API CDN | **1.000.000 / mes** | | ✅ |
| Requests a la API | **250.000 / mes** | las hace el **build**, no el visitante | ✅ |
| Bandwidth | 100 GB / mes | | ✅ |
| Assets | 100 GB | | ✅ |

> ✅ **Todo lo que está especificado en este documento entra en el plan Free.** El Studio
> embebido, los schemas custom, los plugins (drag-and-drop e i18n), el draft/publish, el CDN de
> imágenes con `hotspot`, el webhook de revalidación y los dos idiomas: **nada de eso es de pago.**

- El Free **no tiene pay-as-you-go**: si se pasa un límite **se corta la API** (402), no se
  factura. Con el sitio estático el riesgo es bajo: los requests los hace el **build**, no el
  visitante.
- ⚠️ Los **datasets del Free son públicos**: el contenido es legible por cualquiera que sepa el
  `projectId`. Para un portfolio público es irrelevante, pero **no se guarda nada sensible ahí**.
- ⚠️ **El bilingüe con document-level duplica la cantidad de documentos.** Con 10.000 de límite y
  un portfolio de 50 obras, sigue sobrando muchísimo.

### Lo que NO está en el Free, y qué significa para nosotros

| Función de Growth | ¿La usamos? |
|---|---|
| Roles `editor`, `developer`, `contributor` | **No podemos.** Gala va como `administrator` (§12.1) |
| Datasets privados | **No.** Los nuestros son públicos a propósito |
| **Scheduled publishing** (programar una publicación para una fecha) | **No está en el alcance.** ⚠️ Pero es lo más plausible que Gala pida algún día, por la sección de Noticias: "que esto se publique el 12 de marzo". Si lo pide, es upgrade a Growth |
| Comentarios y tareas dentro del Studio | **No.** Hay una sola editora |
| Historial extendido de borradores | **No** para el flujo actual |
| Más de 2 datasets | **No.** Un tercero cuesta US$999 |

⚠️ **Lo único que hay que tener presente al diseñar features nuevas:** si alguna vez aparece la
necesidad de **programar publicaciones por fecha**, eso **no se puede resolver gratis**. No
prometérselo a Gala sin avisar el costo.

## 17.2 Cloudflare Workers — plan Free

| | Free | Paid |
|---|---|---|
| Precio | **$0** | US$5/mes mínimo |
| Requests al Worker | 100.000 / día | 10.000.000 / mes |
| **Static assets** | **gratis e ilimitados** | idem |

Los **static assets no cuentan** contra el billing. Como el sitio es estático por defecto, casi
todas las visitas se sirven como assets. Un portfolio no se acerca a los 100.000 requests diarios.

## 17.3 Dominio

### Cuándo comprarlo

**Cuando se sepa el nombre, no antes.** El razonamiento:

- ⚠️ **Comprarlo temprano no da ventaja de SEO.** La antigüedad del dominio por sí sola no
  posiciona: lo que cuenta es desde cuándo sirve contenido y recibe links. Un dominio estacionado
  seis meses llega igual que uno comprado el día del lanzamiento. **No comprarlo por esta razón.**
- Analytics y Tag Manager se configuran en una tarde el día del lanzamiento. Tampoco son razón.
- Cloudflare Registrar vende **a precio de costo todo el año**: no hay promo de primer año que
  perder esperando.
- **El desarrollo no lo necesita:** `*.workers.dev` alcanza hasta la fase 3 (§6.5).

**La única razón real para apurarse es la disponibilidad del nombre.** Así que en cuanto Gala
decida cómo se llama, conviene comprarlo aunque falten semanas para publicar — no por SEO, sino
para que no se lo lleve otro.

> 💡 **Que lo compre Gala directamente en su cuenta de Cloudflare.** Mover un dominio de Registrar
> entre cuentas se puede, pero pierde la configuración de la zona y queda bloqueado 30 días
> (§16.5). Comprándolo en la cuenta correcta de entrada, ese trámite no existe.

### Precios

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

## 18.5 Contenido de prueba (mientras Gala arma el material)

Gala todavía no seleccionó el material visual, así que **todo el sitio y el dashboard se
construyen con contenido dummy**. Dos reglas:

**1. El contenido dummy vive en Sanity, no en archivos locales.** Nada de fixtures en el repo:
cargarlo en el dataset `development` desde el Studio prueba el pipeline real (Studio → Sanity →
query → RSC → imagen) y no hay que tirar código después. Un fixture local se escribe para
tirarlo.

**2. Para verificar layout, repetir una imagen es mejor que variarlas.** En `assets/` está la
foto de referencia (`Casa Elen`). Repetida en toda la grilla **aísla el layout del contenido**:
si algo se mueve, es el layout. Es exactamente lo que hace el Figma.

Imágenes variadas hacen falta solo para dos chequeos puntuales, y se generan **cuando se llegue a
ellos**, no antes:

- que la grilla sobreviva a fotos de **tonos distintos** (claras y oscuras conviven en la misma
  cuadrícula);
- que el **recorte cuadrado** no arruine fotos de proporciones distintas, que es el riesgo real
  del diseño (§18.1).

✅ El archivo está en `assets/test-image.png`.

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
