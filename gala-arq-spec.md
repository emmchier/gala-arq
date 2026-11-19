# Gala Arq — Estudio de arquitectura · Especificaciones del proyecto

> **Archivo de contexto maestro.** Claude debe leer este archivo al inicio de cada sesión de
> trabajo sobre este proyecto, antes de escribir código o investigar documentación.
> Última actualización: 2026-11-19 · Versión: **0.2** (cambio de stack: se descarta Wix)

---

# ▶ RETOMAR ACÁ — Estado al 19/11/2026

> **Cómo retomar este proyecto.** Decí **"Gala"** y nada más.
> El repo es **https://github.com/emmchier/gala-arq** y la carpeta local es
> `~/Documents/proyectos/gala-arq`. Claude trae el contexto desde ahí, igual que en los
> otros proyectos. Si la sesión arranca sin acceso al repo, adjuntar este archivo.

### Dónde estamos
Proyecto en arranque, **sin código todavía**. Lo que sí está definido:

- **Stack cerrado** (§2) y decisión de arquitectura escrita (§3).
- **Modelo de contenido** propuesto para Sanity (§4).
- **Mapa de rutas** (§5) e inventario de componentes (§6).
- **Referencia de estructura** analizada (§1.2).
- **Pipeline de imágenes** definido (§13), ahora mucho más simple que en la versión anterior.

> ⚠️ **Cambio de rumbo del 19/11/2026:** se descartó por completo Wix Studio Two. Todo lo que
> este spec decía sobre ERC, CMS de Wix, Data Sources, dashboard de Wix y planes de Wix quedó
> eliminado. El proyecto pasa a stack propio: Next.js + Sanity + Cloudflare.

### Lo que falta para poder empezar a programar
- [ ] **T1.** **Link del archivo de Figma.** El diseño ya existe y es la fuente de verdad del
      layout y la tipografía (§1.1). Sin eso no se escribe UI.
- [ ] **T2.** Crear el proyecto de **Sanity** y anotar `projectId` y `dataset` en §0.
- [ ] **T3.** Definir el **dominio** y confirmar que la cuenta de Cloudflare existe (§12.4).
- [ ] **T4.** Scaffold del proyecto Next.js en el repo (§2.3).
- [ ] **T5.** Definir los **schemas de Sanity** de §4 y levantar el Studio en `/studio`.
- [ ] **T6.** Pedirle a Gala: 8–12 obras con fotos en alta, ficha técnica de cada una,
      **créditos de fotografía**, texto del estudio, CV y el listado de novedades/eventos.
- [ ] **T7.** Decidir idioma: solo `es`, o `es` + `en` (§10).

### Plan de la primera sesión de trabajo (en orden)
1. Leer el Figma y extraer los **tokens** reales: tipografía, escala, grilla, espaciado, color.
   Dejarlos escritos en §6.1 antes de escribir componentes.
2. Scaffold: Next.js + TypeScript + Tailwind + shadcn + Sanity embebido (§2.3).
3. Schemas de Sanity (`proyecto`, `noticia`, `configuracion`) y Studio corriendo en `/studio`.
4. Cargar **una obra de prueba** completa y renderizar su ficha `/trabajos/[categoria]/[slug]`
   de punta a punta. **Ese paso prueba la arquitectura entera** (Sanity → query → RSC → imagen).
5. Seguir con el índice de trabajos y las páginas de categoría.
6. Deploy temprano a Cloudflare, aunque sea con una sola obra: el deploy no se deja para el final.
7. Actualizar §11 y este bloque al cerrar la sesión.

### Criterio de "listo" de la fase 1
La ficha de una obra renderiza desde Sanity con el diseño del Figma, en desktop y mobile, con la
galería y la ficha técnica completas, publicada en Cloudflare y editable por Gala desde el Studio.

---

## 0. Estado de la infraestructura

| | |
|---|---|
| Repo | **https://github.com/emmchier/gala-arq** |
| Carpeta local | `~/Documents/proyectos/gala-arq` |
| Proyecto de Sanity | **no creado todavía** — anotar `projectId` acá |
| Dataset | a definir (`production`) |
| Hosting | Cloudflare Workers — **no creado todavía** |
| Dominio | a definir (§12.4) |
| Figma | **link pendiente (T1)** — anotar acá |
| Idioma | a definir: `es`, o `es` + `en` (§10) |

---

## 1. Contexto

- **Clienta:** **Ana Gallela ("Gala")** — arquitecta, amiga del usuario. Estudio de arquitectura.
- **Producto:** portfolio público **súper minimalista** + dashboard administrativo.
- **Objetivo:** mostrar la obra con la mayor sobriedad posible. En arquitectura el sitio no
  decora: ordena. La foto y la ficha técnica son el contenido; todo lo demás se saca.
- **Secciones:** **Proyectos** (la obra), **Noticias** (lista de fechas de eventos),
  **Contacto**, más **Estudio**.
- **Plataforma:** stack propio — **Next.js + Sanity + Cloudflare** (§2, fundamento en §3).
- **Premisa de trabajo:** economía de tokens. Claude escribe código y arquitectura; el usuario
  hace lo manual (crear cuentas, apretar botones en paneles). Ver §9.

### 1.1 El diseño ya existe: Figma es la fuente de verdad
El usuario **ya diseñó el sitio en Figma**. Eso cambia el orden de trabajo respecto de un
proyecto sin diseño:

- **No se inventa layout, tipografía, escala ni grilla.** Se leen del Figma.
- El **primer paso técnico** de la fase 1 es extraer los tokens del Figma y fijarlos **una vez**
  en el theme de Tailwind v4 (`@theme` en el CSS global). Ver §6.1.
- Si el Figma y lo que dice este spec se contradicen en algo visual, **manda el Figma**. Este
  spec manda en arquitectura, datos y decisiones técnicas.
- 🚧 **Pendiente T1:** falta el link del archivo. Con el link, Claude puede leer frames, variables
  y tokens directamente por el MCP de Figma, sin pedir capturas.

### 1.2 Referencia de estructura: `https://diegoarraigada.com/es/`
**Referencia de estructura y de sobriedad, no de diseño gráfico** (el diseño es el del Figma).
Lo verificado de ese sitio (17/11/2026):

- **Navegación de 4 ítems**, nada más: **Estudio · Trabajos · Noticias · Contacto**.
  Instagram en header y footer. Switcher de idioma **ES/EN** (`/es/` ↔ `/en/`).
  El footer repite el mismo menú, los links de idioma e Instagram, y "Todos los derechos
  reservados". Hay un skip link "Saltar al contenido" (accesibilidad).
- **Trabajos se divide en 3 categorías**, expuestas como links del menú, más un **"Ver todos"**:
  **Construidos · Efímeros · Proyectos**. Cada categoría es su propia URL, no un filtro JS.
- El índice lista **53 proyectos**. Cada entrada muestra **solo nombre del proyecto + categoría**.
  Sin fechas, sin ubicación, sin descripción.
- **Sin controles de filtro, orden ni encabezados de grupo.** El orden no es alfabético ni
  cronológico: es **curado a mano**.
- Las URLs de obra viven bajo `/trabajos/<categoria>/<slug>`.
- El **epígrafe de un proyecto sigue un patrón fijo**:
  `nombre, ubicación, año. distinción (con colaborador)`.
  Ejemplo real: "Concurso Museo Nacional de Bellas Artes, Neuquén, Argentina. 2024.
  Tercer premio (con Leonardo Rota)."
- La home muestra **una obra destacada** con su epígrafe. Nada más.
- El markup es deliberadamente escueto: sin contenido decorativo.

**Lo que esto implica para nuestro build:**
1. **Las categorías son rutas, no filtros** → segmentos reales del App Router, buenos para SEO.
2. **El orden es manual** → ordenamiento curado, con drag-and-drop en el Studio (§4.1).
3. **El epígrafe es un componente en sí mismo** (`ProjectCaption`), con el patrón fijo de arriba,
   usado en home, índice y ficha.
4. **Restricción editorial**: en el índice no se muestran más datos que nombre y categoría.
   Toda la ficha técnica vive en la página de la obra.
5. **Noticias entra en fase 1** (pedido explícito del usuario), como **lista de fechas de
   eventos**. Ver §4.3.

> ⚠️ No se replican textos, fotos ni el diseño gráfico del estudio de referencia.

### 1.3 Alcance en dos fases
1. **Sitio público:** Home, Estudio, Trabajos (índice + 3 categorías), ficha dinámica de cada
   obra, **Noticias**, Contacto.
2. **Dashboard (Sanity Studio)** para Gala: crear, editar, eliminar, publicar/despublicar,
   destacar y **reordenar** obras; cargar fotos; administrar noticias; y editar los datos del
   estudio, que se reflejan en el sitio público.

> A diferencia del plan anterior, la fase 2 **no se programa casi**: el Studio de Sanity ya es el
> dashboard. Ver §7.

---

## 2. Stack

### 2.1 Lo que usamos
| Capa | Herramienta | Versión al 19/11/2026 |
|---|---|---|
| Framework | **Next.js** (App Router, React Server Components) | **16.4.6** |
| Lenguaje | **TypeScript** | ⚠️ ver nota abajo |
| Estilos | **Tailwind CSS** (v4, CSS-first con `@theme`) | **4.3.5** |
| Componentes | **shadcn/ui** (CLI) | **4.23.0** |
| Estado de cliente | **Zustand** | **5.1.0** |
| CMS + dashboard | **Sanity** (Studio v6) + `next-sanity` | **6.24.0** / **13.5.1** |
| Hosting | **Cloudflare Workers** | adaptador: ver §2.2 |
| Dominio / DNS | **Cloudflare** (Registrar + DNS) | — |

**Convenciones:** App Router, **Server Components por defecto**, `"use client"` solo donde hace
falta interacción. Package manager: **pnpm**. Node LTS.

> ⚠️ **TypeScript — verificar antes de fijar.** El `latest` de npm es **7.0.2** (el compilador
> nativo). Antes de arrancar hay que **confirmar que Next.js 16.4 lo soporta sin fricción**. Si
> hay cualquier problema, quedarse en la **5.x más reciente**, que es la combinación probada.
> No pelear con el compilador en la primera sesión: no es el valor del proyecto.

### 2.2 Decisión de hosting: Cloudflare Workers, con qué adaptador
Hay dos caminos para correr Next.js en Workers y **hay que elegir con los ojos abiertos**:

| Camino | Estado | Cuándo |
|---|---|---|
| **`@opennextjs/cloudflare`** (v1.20.17) | maduro, en producción en muchos sitios | **default nuestro** |
| **`vinext`** | **beta** — pero es lo que **Cloudflare recomienda** como vía por defecto | evaluar en el kickoff |

**Decisión: arrancar con `@opennextjs/cloudflare`.** Es la opción madura y soporta lo que el
proyecto necesita (ISR, route handlers para el webhook de Sanity). `vinext` promete builds más
rápidos y menos JS, pero estando en beta no se le pone encima un sitio de una clienta.
→ Revisar `https://vinext.dev/compatibility` en el kickoff; si ya salió de beta, se reevalúa.

**Limitaciones heredadas del adaptador OpenNext, a tener presentes:**
- **No soporta Turbopack** para el build de producción.
- **No soporta el runtime `edge`**: nada de `export const runtime = "edge"`.
- Los addons nativos `.node` no cargan.
- Hace falta el service binding **`WORKER_SELF_REFERENCE`** para el routing interno del
  adaptador; si falta, da **500 en `workers.dev`**. Es el error clásico del primer deploy.
- El cache de ISR necesita un **KV namespace** configurado en `wrangler`.

> **Alternativa de escape si Workers molesta:** el sitio es casi todo estático, así que un
> `output: 'export'` servido como static assets también funcionaría. Se pierde ISR on-demand y
> los route handlers. **No es el plan**, pero conviene saber que existe.

### 2.3 Scaffold (el comando del arranque)
```bash
pnpm create cloudflare@latest gala-arq --framework=next --platform=workers
```
Después, dentro del proyecto:
```bash
pnpm dlx shadcn@latest init        # ⚠️ que escriba theme v4 (@theme), no tailwind.config.ts
pnpm create sanity@latest          # detecta Next y scaffoldea el Studio embebido
pnpm add zustand @sanity/image-url next-sanity
```

> ⚠️ **Trampa conocida de shadcn + Tailwind v4:** el CLI y los asistentes tienden a generar
> config de **v3**. En v4 el theme va en el CSS con `@theme`, y `tailwind.config.ts`
> **se ignora**. Además `tailwindcss-animate` está deprecado en v4. Verificar esto en el init,
> no después de escribir 20 componentes.

### 2.4 Qué NO se usa
- **Wix** en ninguna de sus formas (Studio, Studio Two, Headless, ERC, Velo, su CMS, su Media
  Manager, sus planes). Descartado el 19/11/2026.
- **Vercel** como hosting: el dominio y el hosting van en Cloudflare por decisión del usuario.
- Base de datos propia: el contenido vive en Sanity. No hay Postgres, Prisma ni ORM.
- Auth propia: el acceso al dashboard lo resuelve Sanity (§7.1).
- Librería de animación: sin animaciones decorativas (§6.2). A lo sumo transiciones CSS.

---

## 3. Decisión de arquitectura

**Next.js como sitio estático-por-defecto, Sanity como única fuente de contenido, Cloudflare
como borde.**

### 3.1 Estrategia de renderizado
Un portfolio de arquitectura es contenido que cambia poco y se lee mucho. Entonces:

- **Todo el sitio público es estático** (SSG): `generateStaticParams()` en las rutas dinámicas,
  Server Components que consultan Sanity en build.
- **Revalidación on-demand**, no por tiempo: un **webhook de Sanity** pega en un route handler
  (`/api/revalidate`) que llama `revalidateTag()`. Gala publica un cambio y el sitio se actualiza
  en segundos, sin rebuild manual y sin pagar cómputo por visita.
- Las queries se etiquetan con `next: { tags: [...] }` para poder invalidar por tipo de documento.
- **Nada de `force-dynamic`** en páginas públicas. Si una página necesita ser dinámica, es señal
  de que algo está mal modelado.

> Esto es lo que hace que el sitio entre cómodo en el **plan free de Workers**: las visitas
> golpean static assets (gratis e ilimitados), no el Worker.

### 3.2 Las URLs ahora sí pueden ser las de la referencia
La versión anterior de este spec tenía que resignar el anidado por categoría por una limitación
de la plataforma. **Con App Router eso desaparece:**

```
/trabajos                          → índice completo
/trabajos/[categoria]              → construidos · efimeros · proyectos
/trabajos/[categoria]/[slug]       → ficha de obra  ← igual que la referencia
```
Un solo árbol de carpetas, un solo `generateStaticParams` por nivel, cero colecciones duplicadas.
**Se adopta el anidado por categoría**, que era lo que la referencia hacía y nosotros no podíamos.

### 3.3 Dónde vive el estado (y por qué casi no hay)
Con RSC, **la mayoría del sitio no tiene estado de cliente**. Zustand entra solo para:
- el **lightbox** de la galería (índice de la foto abierta, abierto/cerrado),
- el **menú mobile**,
- y nada más por ahora.

> No meter el contenido de Sanity en Zustand. El contenido viaja por props desde el servidor.
> Un store que espeja datos del servidor es un bug esperando a pasar.

### 3.4 Granularidad de los componentes
Componentes chicos y componibles, reusados entre home, índice, categorías y ficha. El epígrafe,
la ficha técnica y la galería son componentes propios, no bloques de una página.

**shadcn/ui con criterio:** un sitio súper minimalista necesita **muy pocos** componentes de
librería. Previstos: `dialog` (lightbox), `sheet` (menú mobile), y los de form si se hace el
formulario de contacto. **No instalar el set completo**: cada componente que entra hay que
re-estilarlo para que no parezca una app de dashboard.

---

## 4. Modelo de contenido (Sanity)

Tres tipos de documento: `proyecto`, `noticia`, `configuracion`.

### 4.1 Documento `proyecto`
En arquitectura **la ficha técnica es contenido de primera clase**, no un extra. Por eso cada
dato es su propio campo, no texto libre.

| Campo | Tipo Sanity | Notas |
|---|---|---|
| `titulo` | `string` | nombre de la obra |
| `slug` | `slug` | source: `titulo` |
| `categoria` | `string` | lista cerrada: `construidos` · `efimeros` · `proyectos` |
| `ubicacion` | `string` | "Rosario, Santa Fe, Argentina" |
| `anio` | `number` | |
| `estado` | `string` | lista: `construido` · `en-obra` · `proyecto` · `concurso` |
| `programa` | `string` | lista: `vivienda` · `vivienda-colectiva` · `institucional` · `comercial` · `interiorismo` · `urbano` · `efimero` |
| `superficie` | `number` | m² |
| `comitente` | `string` | vacío si es concurso o personal |
| `equipo` | `string` | autores del estudio |
| `colaboradores` | `string` | externos ("con Leonardo Rota") |
| `distincion` | `string` | premio o mención ("Tercer premio") |
| `fotografia` | `string` | **crédito fotográfico — obligatorio** (§8.9) |
| `portada` | `image` (hotspot) | la del índice |
| `galeria` | `array[image]` (hotspot) | fotos de la obra, cada una con `alt` |
| `planos` | `array[image]` | plantas, cortes, axonometrías |
| `memoria` | `array[block]` | Portable Text: el texto del proyecto |
| `destacada` | `boolean` | aparece en Home |
| `orderRank` | `string` | **orden curado** — ver abajo |
| `seoTitle`, `seoDescription` | `string` | |

**Dos simplificaciones que nos regala Sanity** (y que en el plan anterior había que programar):

1. **No hay campo `publicado`.** Sanity tiene **draft / published nativo**. Un borrador no es
   visible para nadie sin token. Las queries públicas usan el CDN con perspectiva `published`.
   → Un campo booleano `publicado` sería una segunda fuente de verdad y tarde o temprano se
   desincroniza del estado real del documento. Se elimina.

2. **No hay campo `orden` numérico.** Se usa **`@sanity/orderable-document-list`**, que da
   **drag-and-drop real en el Studio** y guarda un `orderRank`. Reordenar con un número entero
   obliga a renumerar vecinos a mano y se rompe en cuanto hay 20 obras.

**Validaciones obligatorias:** `titulo`, `slug`, `categoria`, `portada`, **`fotografia`**.
Cada imagen de `galeria` exige `alt` (accesibilidad y SEO, §8.7).

**Epígrafe canónico** (lo arma `ProjectCaption` a partir de los campos, nunca se escribe a mano):
`{titulo}, {ubicacion}. {anio}. {distincion} (con {colaboradores})` — las partes vacías se omiten.

### 4.2 Documento `configuracion` (singleton)
Para que Gala edite los datos del estudio desde el Studio, sin tocar código.
Campos: `nombreEstudio`, `claim` (una línea), `textoEstudio` (Portable Text),
`retrato` (`image`), `email`, `telefono`, `instagram`, `linkedin`, `direccion`, `matricula`,
`cv` (`file`), `textoLegal` (Portable Text).

Se declara como **singleton**: un solo documento con `_id` fijo (`configuracion`), oculto de la
lista de "crear nuevo" y fijado en la estructura del Studio. Se consulta una vez y se pasa al
layout (header/footer).

### 4.3 Documento `noticia` — **en fase 1**
El usuario la pidió explícitamente: **lista de fechas de eventos**. No es un blog.

| Campo | Tipo | Notas |
|---|---|---|
| `titulo` | `string` | |
| `slug` | `slug` | solo si hay página de detalle |
| `fecha` | `date` | **el dato que ordena y que se ve** |
| `fechaFin` | `date` | opcional, para eventos con rango ("12–28 de marzo") |
| `tipo` | `string` | lista: `exposicion` · `conferencia` · `premio` · `publicacion` · `concurso` · `otro` |
| `lugar` | `string` | "Museo Castagnino, Rosario" |
| `bajada` | `text` | una o dos líneas |
| `cuerpo` | `array[block]` | opcional |
| `imagen` | `image` | opcional |
| `linkExterno` | `url` | nota de prensa, inscripción, etc. |
| `orderRank` | `string` | solo para empatar fechas |

**Cómo se muestra:** una **lista cronológica descendente** (lo más reciente arriba), agrupada por
año. Cada ítem es `fecha · tipo · título · lugar`. Formato de fecha en español, `es-AR`.

**Decisión de alcance:** en fase 1, **sin página de detalle**. Si tiene `linkExterno`, el ítem
linkea afuera; si tiene `cuerpo`, se expande en la misma lista. Una ruta
`/noticias/[slug]` se agrega después solo si Gala realmente escribe textos largos.
→ Una sección de noticias vacía queda peor que no tenerla: **si Gala no tiene al menos 3 ó 4
eventos para cargar, la sección no se publica** aunque el código esté listo.

### 4.4 Consultas de contacto
- **A (MVP):** sin formulario. **Mail + Instagram + dirección**, como la referencia.
  `mailto:` y listo. Cero backend, cero spam, cero mantenimiento.
- **B (si Gala lo pide):** `ContactForm` (client component, shadcn form + validación) →
  **route handler** en `/api/contacto` que valida en servidor y manda el mail por un proveedor
  (Resend o similar), con rate limiting. **No guardar las consultas en Sanity**: no es contenido.

**Arrancar con A.** Para un estudio de arquitectura, mail + Instagram suele alcanzar.
Si se hace B: el route handler obliga a que la app tenga runtime, lo cual ya está previsto (§3.1),
pero hay que sumar la variable de entorno de la API de mail y un honeypot o captcha.

### 4.5 Queries
- Se escriben en **GROQ**, centralizadas en `src/sanity/queries/` — **nunca inline** en los
  componentes, para poder tipar y reusar.
- Tipos generados con **`sanity typegen`** a partir del schema y las queries. Nada de tipar el
  contenido a mano.
- Cada query pide **solo los campos que usa**. En el índice no se traen `galeria` ni `memoria`.
- La query del índice proyecta `portada` con las dimensiones justas.

---

## 5. Mapa de rutas (App Router)

| Ruta | Archivo | Contenido |
|---|---|---|
| `/` | `app/page.tsx` | una obra destacada con su epígrafe. Nada más |
| `/trabajos` | `app/trabajos/page.tsx` | índice completo: nombre + categoría |
| `/trabajos/[categoria]` | `app/trabajos/[categoria]/page.tsx` | mismo índice, filtrado |
| `/trabajos/[categoria]/[slug]` | `.../[slug]/page.tsx` | **ficha de obra** |
| `/estudio` | `app/estudio/page.tsx` | texto del estudio, retrato, equipo, premios, CV |
| `/noticias` | `app/noticias/page.tsx` | lista de fechas de eventos (§4.3) |
| `/contacto` | `app/contacto/page.tsx` | mail, Instagram, dirección |
| `/studio/[[...tool]]` | `app/studio/[[...tool]]/page.tsx` | **el dashboard** (§7) |
| `/api/revalidate` | route handler | webhook de Sanity (§3.1) |
| 404 | `app/not-found.tsx` | con link a Trabajos |
| `sitemap.xml`, `robots.txt` | `app/sitemap.ts`, `app/robots.ts` | generados desde Sanity |

Notas:
- `[categoria]` valida contra la lista cerrada de §4.1; cualquier otro valor → `notFound()`.
- `generateStaticParams()` en los dos niveles dinámicos.
- `generateMetadata()` por ficha, usando `seoTitle` / `seoDescription` con fallback a
  `titulo` / `memoria`, y **Open Graph con la portada**.
- El **`/studio` queda fuera del layout público** (su propio `layout.tsx`, sin header ni footer)
  y **excluido del sitemap y de la indexación**.

---

## 6. Componentes

| Componente | Props clave | Dónde | Tipo |
|---|---|---|---|
| `ProjectCaption` | titulo, ubicacion, anio, distincion, colaboradores | home, índice, ficha | server |
| `WorkIndex` | items[] | índice y categorías | server |
| `WorkRow` | titulo, categoria, href, portada (hover) | índice | server/client |
| `FeaturedWork` | obra destacada | home | server |
| `ProjectHero` | titulo, portada | ficha | server |
| `ProjectDataSheet` | toda la ficha técnica | ficha | server |
| `ProjectGallery` | galeria[] — lightbox, teclado | ficha | **client** |
| `ProjectPlans` | planos[] — zoom; fondo claro siempre | ficha | **client** |
| `NextProject` | obra siguiente en el orden curado | ficha | server |
| `NewsList` | noticias[] agrupadas por año | noticias | server |
| `StudioText` | de `configuracion` | estudio | server |
| `ContactBlock` | email, instagram, direccion | global | server |
| `SiteHeader` / `SiteFooter` | nav + `configuracion` | layout | server (+ client para el menú) |
| `MobileNav` | — | layout | **client** (Zustand + shadcn `sheet`) |
| `SanityImage` | wrapper de `next/image` + `@sanity/image-url` | todos | server |

### 6.1 Tokens: una sola vez, en el CSS
Del Figma salen tipografía, escala, grilla, espaciado y color. Se definen **una vez** con `@theme`
en el CSS global de Tailwind v4 y **no se repiten** en ningún componente.

- **Una sola familia tipográfica** y una escala corta (3–4 tamaños). El minimalismo se sostiene
  con jerarquía tipográfica y aire, no con elementos.
- Fuentes por **`next/font`** (self-hosted, sin FOUT, sin pedido a Google en runtime).
- 🚧 Los valores concretos se llenan acá **después de leer el Figma** (T1).

### 6.2 Notas de craft
- **El índice es texto, no thumbnails.** Si se quiere imagen, que aparezca en **hover**, no
  permanente. Decidirlo con el Figma antes de escribir `WorkIndex`.
- **Sin animaciones decorativas.** A lo sumo fades de 150–200 ms en navegación e imágenes.
- La ficha técnica es una **lista de definición** (`<dl>`), no una tabla: semántica correcta y más
  fácil de hacer responsive.
- Los **planos siempre sobre fondo claro**, incluso si el sitio tuviera modo oscuro: son line art.
- El **lightbox** necesita foco atrapado, `Escape` y flechas. El `dialog` de shadcn (Radix) ya
  trae foco y Escape; las flechas las agregamos nosotros.
- **Skip link** "Saltar al contenido" en el layout, como la referencia.

---

## 7. Dashboard administrativo (Sanity Studio)

### 7.1 Login y permisos — **no se programa**
- El acceso lo resuelve **Sanity**: Gala se invita como miembro del proyecto por email.
- Rol recomendado: **Editor** (crea, edita y publica contenido; no toca facturación ni miembros).
- El Studio embebido en `/studio` **no muestra nada sin sesión válida de Sanity**. No hay auth
  propia, ni sesiones, ni tabla de usuarios, ni "gate" que mantener.
- Activar **2FA** en la cuenta de Sanity de Gala.
- El **plan free incluye 20 asientos** (§12.2): sobra.

> Esto es una de las ganancias grandes del cambio de stack: en el plan anterior el login y el
> gate de autorización eran código nuestro, con su propio riesgo. Acá no existen.

### 7.2 Qué trae resuelto sin escribir código
El Studio ya hace alta, edición, borrado, **draft/publish**, historial de versiones y rollback.
Sobre eso configuramos (que es configuración, no desarrollo):

1. **Lista de obras ordenable** con drag-and-drop (`@sanity/orderable-document-list`), separada
   por categoría en el `structure`.
2. **Formulario de obra** = el schema de §4.1, con `fieldsets` para agrupar la ficha técnica y
   previews decentes en la lista (portada + título + año).
3. **`configuracion` como singleton** fijado en la estructura, no como lista.
4. **Noticias** ordenadas por fecha descendente.
5. **Preview de la obra** en el Studio apuntando a la URL real del sitio.

### 7.3 Lo único que sí es desarrollo
- El archivo `sanity.config.ts` con el `structure` custom y los plugins.
- Los schemas (§4).
- El **webhook de revalidación** (§3.1) y su route handler.
- **Visual Editing / Presentation** (editar viendo el sitio al lado): queda **fase 2 opcional**.
  Es lindo, no es necesario, y agrega complejidad de draft mode.

---

## 8. Riesgos y cosas a vigilar
1. **El Figma todavía no está leído.** Es el riesgo número uno de planificación: el diseño puede
   pedir cosas (tipografía custom, grilla particular, transiciones) que cambien estimaciones.
   **No escribir UI antes de T1.**
2. **`vinext` vs OpenNext** (§2.2): Cloudflare recomienda el que está en beta. Si se elige mal se
   pierde tiempo migrando. Revisar el compatibility check en el kickoff.
3. **Primer deploy a Workers**: el `WORKER_SELF_REFERENCE` faltante y el KV del cache de ISR son
   los dos errores clásicos. **Deployar temprano**, con una obra, no al final.
4. **shadcn + Tailwind v4**: el CLI tiende a escribir config de v3 (§2.3). Verificar en el init.
5. **TypeScript 7** (§2.1): verificar compatibilidad con Next 16 antes de fijarla.
6. **Performance**: las fotos de arquitectura en alta son el riesgo técnico número uno. Pipeline
   de §13 + `next/image` con `sizes` correctos por breakpoint.
7. **Fidelidad visual**: comprimir de más arruina una foto de arquitectura (cielos con banding,
   detalle de materiales perdido). Los parámetros de §13.3 son conservadores a propósito.
8. **Storage de assets en Sanity**: el free da 100 GB, pero los originales de fotógrafo se los
   comen rápido si se suben sin procesar. Ver §13.
9. **Créditos de fotografía — riesgo legal real.** Las fotos de arquitectura casi siempre son de
   un fotógrafo con licencia de uso limitada. `fotografia` es campo **obligatorio** y hay que
   confirmar con Gala que tiene permiso para publicar cada set.
10. **SEO y accesibilidad son nuestra responsabilidad**: semántica (un solo `h1` por página),
    `alt` descriptivo obligatorio en galería, datos estructurados, skip link, foco visible.
11. **Multi-idioma**: si Gala lo quiere, se decide **antes** de escribir rutas. Agregarlo después
    obliga a reescribir todo el árbol de `app/` y los schemas. Ver §10.
12. ⚠️ **El repo es público.** Hoy `emmchier/gala-arq` es público. Nunca commitear tokens de
    Sanity (`SANITY_API_WRITE_TOKEN`), credenciales de Cloudflare ni datos personales de la
    clienta. Todo por `.env.local`, que está en `.gitignore`. Evaluar pasarlo a privado.

---

## 9. Protocolo de trabajo (economía de tokens)

**División de tareas**
- **El usuario, a mano:** crear las cuentas (Sanity, Cloudflare), comprar/conectar el dominio,
  invitar a Gala, pegar las variables de entorno, y pasarle a Claude el link del Figma.
- **Claude, en sesión:** arquitectura, schemas, queries, componentes, configuración del Studio,
  deploy, revisiones y debugging. **Todo el código vive en el repo**, no se pega a mano en
  ningún panel.

**Reglas**
1. Claude lee este spec al inicio y **no re-investiga** lo que ya está documentado acá.
2. **El repo es la fuente de verdad del código.** Git normal, commits chicos, nada de copy/paste
   a un editor web. (Esto era imposible en el stack anterior y ahora es gratis.)
3. **Diseño:** leer el Figma por el MCP de Figma con el link de §0 antes de pedir capturas.
4. **Verificación visual:** levantar el dev server y mirar la página renderizada, en desktop y
   mobile. No dar por bueno un componente sin verlo.
5. Toda decisión nueva se registra en §11 en la misma sesión en que se toma.
6. **Al cerrar cada sesión**, Claude actualiza el bloque **RETOMAR ACÁ** y commitea el spec.
7. Secretos: solo en `.env.local`. Nunca en el repo (§8.12).

---

## 10. Decisiones pendientes
- [ ] **Link del Figma** (T1). Bloquea toda la UI.
- [ ] **Idioma**: solo `es`, o `es` + `en` como la referencia. **Decidir antes de escribir rutas**
      (§8.11). Si es bilingüe: `next-intl` + campos localizados o dataset por idioma.
- [ ] **Dominio**: ¿lo tiene Gala? ¿`galaarq.com`? ¿`.com.ar`? (§12.4)
- [ ] ¿Quién paga Sanity/Cloudflare si algún día hay que pagar? Hoy el plan es $0 (§12).
- [ ] ¿La cuenta de Sanity y la de Cloudflare van a nombre del usuario o de Gala?
- [ ] **Índice**: texto solo (como la referencia) o con imagen en hover. Lo define el Figma.
- [ ] ¿Noticias con página de detalle o solo lista? (§4.3 propone solo lista)
- [ ] ¿Formulario de contacto o solo mail + Instagram? (§4.4 propone solo mail)
- [ ] ¿Cuántas obras tiene para cargar al inicio? Define si hace falta carga masiva (§13.4).
- [ ] `vinext` u OpenNext (§2.2) — se cierra en el kickoff.

---

## 11. Changelog de decisiones
| Fecha | Decisión |
|---|---|
| 2026-11-17 | Referencia de estructura: `diegoarraigada.com` — estructura y sobriedad, no plantilla. |
| 2026-11-17 | Categorías como rutas, no como filtro client-side. |
| 2026-11-17 | Orden de las obras curado a mano, con drag-and-drop en el dashboard. |
| 2026-11-17 | Ficha técnica como campos estructurados, no texto libre. `ProjectCaption` arma el epígrafe. |
| 2026-11-17 | `fotografia` (crédito) es campo obligatorio. |
| 2026-11-17 | `configuracion` singleton para los datos editables por Gala. |
| **2026-11-19** | **Se descarta Wix por completo** (Studio Two, ERC, su CMS, su dashboard y sus planes). |
| **2026-11-19** | **Stack: Next.js 16 (App Router, RSC) + TypeScript + Tailwind v4 + shadcn/ui + Zustand.** |
| **2026-11-19** | **Contenido y dashboard: Sanity** (Studio v6 embebido en `/studio`). Sin auth propia. |
| **2026-11-19** | **Hosting y dominio: Cloudflare** (Workers + Registrar/DNS). Adaptador `@opennextjs/cloudflare`; `vinext` a reevaluar por estar en beta. |
| **2026-11-19** | **Se adopta el anidado por categoría** `/trabajos/[categoria]/[slug]`, que la plataforma anterior no permitía. |
| **2026-11-19** | **Estático por defecto + revalidación on-demand** por webhook de Sanity. Sin `force-dynamic`. |
| **2026-11-19** | Se eliminan los campos `publicado` y `orden`: los reemplazan el draft/publish nativo de Sanity y `orderRank`. |
| **2026-11-19** | **Noticias entra en fase 1** como lista de fechas de eventos, sin página de detalle. |
| **2026-11-19** | **Se elimina el uploader de imágenes custom**: lo resuelve el Studio + el CDN de imágenes de Sanity. |
| **2026-11-19** | Clienta: **Ana Gallela ("Gala")**. El diseño ya existe en Figma y es la fuente de verdad visual. |

---

## 12. Costos — qué cuesta tener esto online

> **La noticia buena del cambio de stack:** en el plan anterior el sitio no se podía publicar con
> dominio propio sin un plan pago (≈ US$19/mes, ≈ $435.000 ARS al año). **Acá el costo recurrente
> de plataforma arranca en $0** y lo único que hay que pagar es el dominio.

### 12.1 Resumen
| Concepto | Costo |
|---|---|
| Next.js, Tailwind, shadcn, Zustand, TypeScript | **$0** — open source |
| **Sanity** (contenido + dashboard + CDN de imágenes) | **$0** en el plan Free (§12.2) |
| **Cloudflare Workers** (hosting) | **$0** en el plan Free (§12.3) |
| Acceso de Gala al dashboard | **$0** — el Free incluye 20 asientos |
| **Dominio** | **único costo recurrente** (§12.4) |
| Proveedor de mail, solo si se hace el form (§4.4-B) | $0 en el free tier típico |

### 12.2 Sanity — plan Free
Límites del Free (verificados contra varias fuentes en nov-2026, **confirmar en
`sanity.io/pricing` el día que se crea el proyecto**):

| | Free |
|---|---|
| Asientos | **20** |
| Documentos | 10.000 |
| Datasets | 2 (públicos) |
| Requests a la API CDN | 1.000.000 / mes |
| Requests a la API | 250.000 / mes |
| Bandwidth | 100 GB / mes |
| Assets | 100 GB |

Para este proyecto: **de sobra**. Un estudio con 50 obras y 15 fotos cada una son ~750 documentos
de asset y unos pocos cientos de documentos de contenido.
- ⚠️ El Free **no tiene pay-as-you-go**: si se pasa un límite, **se corta la API** (402), no se
  factura. Con el sitio estático (§3.1) las visitas no pegan a Sanity, así que el riesgo real es
  muy bajo: los requests los hace el **build**, no el visitante.
- El siguiente escalón es **Growth, US$15 por asiento/mes**. No hace falta.
- ⚠️ Los **datasets del Free son públicos**: el contenido es legible por cualquiera que sepa el
  `projectId`. Para un portfolio público eso es irrelevante (el contenido va a estar publicado),
  pero **no se guarda nada sensible ahí**.

### 12.3 Cloudflare Workers — plan Free
| | Free | Paid |
|---|---|---|
| Precio | **$0** | US$5/mes mínimo por cuenta |
| Requests al Worker | 100.000 / día | 10.000.000 / mes incluidos |
| CPU por invocación | 10 ms | 30 M CPU-ms incluidos |
| **Static assets** | **gratis e ilimitados**, sin cargo de egress | idem |

**Clave:** los **static assets no cuentan** contra el billing de Workers. Como el sitio es
estático por defecto, casi todas las visitas se sirven como assets y **no consumen invocaciones**.
El Worker solo se invoca en el webhook de revalidación y en los route handlers.
→ Un portfolio de arquitectura **no se acerca** a los 100.000 requests diarios del Free.
Si algún día hace falta, son **US$5/mes**, no US$19.
- En el Free, pasado el límite **los requests fallan**, no se facturan.
- El **KV** del cache de ISR tiene su propio free tier (holgado para este uso).

### 12.4 Dominio
- **Cloudflare Registrar vende los dominios a precio de costo del registro**, sin markup y sin
  "precio promocional del primer año". Suele ser la opción más barata para un `.com`
  (del orden de US$10–12/año, según el TLD).
- **`.com.ar` no se compra en Cloudflare**: se registra en **NIC.ar** (en pesos, sin impuestos de
  exterior) y después se usa Cloudflare solo como **DNS**. Es el camino más barato si se quiere
  `.com.ar`.
- Verificar disponibilidad antes de prometer un nombre.
- Conectar un dominio propio a Workers **no requiere plan pago**: los custom domains funcionan en
  el Free.

### 12.5 Lo que hay que sumarle en Argentina
Solo aplica a lo que se pague en USD (el dominio, y los planes pagos si algún día se usan):
- **IVA servicios digitales 21%** (RG 4240) — se paga siempre, incluso pagando con dólares.
- **Percepción 30% a cuenta de Ganancias** (RG 5617) — **se evita pagando con dólares propios**,
  porque no hay cambio de divisas. El Impuesto PAIS ya no se aplica (terminó en dic-2024).
- **Percepción provincial de IIBB**, según la provincia.

> Con el stack nuevo esto pasa a ser casi anecdótico: un dominio `.com` a ~US$11/año con
> impuestos queda en el orden de **US$15/año**, contra los ~US$280/año del plan anterior.

### 12.6 A confirmar
- [ ] Límites vigentes del Free de Sanity en `sanity.io/pricing` al crear el proyecto.
- [ ] Precio del TLD elegido en Cloudflare Registrar.
- [ ] Disponibilidad del dominio.

---

## 13. Pipeline de imágenes

**Objetivo:** que las fotos de arquitectura se vean impecables y el sitio cargue rápido, sin
guardar originales de 80 MB para siempre.

### 13.1 Lo que Sanity resuelve solo
Esta sección se simplificó muchísimo respecto de la versión anterior del spec, donde había que
**programar un uploader con compresión en el browser** porque la plataforma guardaba el original
tal cual. Con Sanity eso **no hace falta**:

- **Entrega:** el **CDN de imágenes de Sanity** transforma al vuelo por querystring: `w`, `h`,
  `q`, `fit`, `auto=format` (sirve WebP/AVIF según el browser). Se guarda **un** archivo y el
  sitio pide la medida que necesita en cada breakpoint.
- **`hotspot` / `crop`:** Gala define en el Studio el punto focal de cada foto, y los recortes de
  la grilla respetan lo importante de la imagen. Esto es exactamente lo que un portfolio de
  arquitectura necesita y es configuración, no código.
- **Metadata:** Sanity extrae dimensiones y **LQIP** (placeholder borroso) automáticamente, que se
  usa como `blurDataURL` de `next/image`.
- **El uploader nativo del Studio alcanza.** No se construye uploader custom.

### 13.2 Cómo se consume desde Next
```ts
// src/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
export const urlFor = (source) => imageUrlBuilder(client).image(source)
```
- Componente `SanityImage` que envuelve **`next/image`** con el builder, y que **siempre** recibe
  `sizes` explícito. Sin `sizes` correcto, `next/image` sirve imágenes de más y se pierde todo.
- `auto('format')` + `quality()` según la tabla de §13.3.
- `placeholder="blur"` con el LQIP que ya viene en la metadata.
- `priority` **solo** en la imagen del hero de la ficha y en la destacada de la home. En el resto,
  lazy.
- ⚠️ **Optimización de imágenes en Cloudflare:** `next/image` con el optimizador de Next sobre
  Workers es un punto a verificar (§2.2 lo marca como "parcialmente soportado" en `vinext`). Como
  **Sanity ya entrega la imagen optimizada y del tamaño pedido**, lo más simple y robusto es
  **desactivar el optimizador de Next** (`images: { unoptimized: true }`) y dejar que Sanity haga
  el trabajo. Decidirlo en el primer deploy, midiendo.

### 13.3 Parámetros
Una foto de arquitectura mal comprimida se nota en **cielos (banding)** y en **texturas de
material**. Estos números son conservadores a propósito.

| Uso | Lado largo | Calidad | Formato |
|---|---|---|---|
| Portada del índice | 1600 px | `q=85` | `auto=format` |
| Foto de galería | **2560 px** | **`q=90`** | `auto=format` |
| Plano / line art | 2560 px | **`q=95`** | `auto=format` |
| Retrato, imágenes de UI | 1200 px | `q=85` | `auto=format` |

- **Nunca bajar de `q=82`.**
- Revisar a ojo la primera tanda al 100% de zoom antes de fijar los parámetros definitivos,
  mirando especialmente cielos y hormigón.

### 13.4 Qué sube Gala, y la regla de oro
Sanity guarda el original y **cuenta contra los 100 GB de assets**. Con 100 GB hay muchísimo
margen, pero conviene no subir basura:

- **Regla para Gala:** subir **JPEG de lado largo ≤ 3000 px**. No TIFF, no RAW, no PSD, no el
  export de 80 MB del fotógrafo. Ella conserva sus masters en su máquina.
- **Carga inicial masiva:** si Gala entrega una carpeta con todo, **Claude corre un script local
  en Node con `sharp`** que convierte la carpeta entera a JPEG 3000 px, y después se importa con
  la CLI de Sanity. Lo corremos nosotros, no Gala.
- **Una sola vía de carga:** el Studio. No hay otra, así que no hace falta el panel de auditoría
  que el plan anterior necesitaba.

### 13.5 Video y reglas complementarias
- **Nunca subir video a Sanity**: se come el storage y no hay streaming. Si alguna obra tiene
  recorrido 3D o timelapse, va a **Vimeo o YouTube** y se guarda la URL; el componente embebe el
  player y **carga el iframe solo al click** (un embed eager destruye el performance de la ficha).
- Los **planos en PDF**: si se publican para descarga, optimizarlos aparte; los PDF de CAD pesan
  muchísimo.
- Revisar el consumo de assets en el panel de Sanity cada tanto.

---

## 14. Fuentes
**Next.js**
- Next.js — https://nextjs.org/docs
- Next.js 16.3 (blog) — https://nextjs.org/blog/next-16-3
- `next` en npm (versiones) — https://www.npmjs.com/package/next

**Cloudflare**
- Next.js en Cloudflare Workers — https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- OpenNext · Cloudflare — https://opennext.js.org/cloudflare
- Compatibilidad de vinext — https://vinext.dev/compatibility
- Workers — https://developers.cloudflare.com/workers/
- Cloudflare Registrar — https://developers.cloudflare.com/registrar/

**Sanity**
- Sanity + Next.js — https://www.sanity.io/docs/nextjs
- Embeber el Studio en Next.js — https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs
- `next-sanity` — https://www.sanity.io/plugins/next-sanity
- Visual Editing con App Router — https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router
- Image URLs / transformaciones — https://www.sanity.io/docs/image-urls
- Pricing — https://www.sanity.io/pricing

**Tailwind y shadcn**
- Tailwind CSS v4 — https://tailwindcss.com/docs
- shadcn/ui + Tailwind v4 — https://ui.shadcn.com/docs/tailwind-v4
- shadcn CLI — https://ui.shadcn.com/cli

**Zustand**
- Zustand — https://zustand.docs.pmnd.rs/

**Referencia de estructura**
- https://diegoarraigada.com/es/ y https://diegoarraigada.com/es/trabajos/
