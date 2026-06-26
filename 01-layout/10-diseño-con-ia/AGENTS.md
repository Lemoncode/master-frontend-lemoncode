# Los agentes

Este repo trae **cuatro agentes** en `.claude/agents/`, que Claude Code carga
automáticamente al abrir la carpeta. Cubren el flujo de diseño de punta a punta:

- Dos **agentes de diseño** — uno para **Figma**, otro para **Pencil**.
- Un **agente de implementación** — de **Figma a código** (HTML/CSS/PostCSS/Vite).
- Un **auditor** — segunda pasada de **accesibilidad** sobre el código generado.

Encadenan así: diseñas con `figma-designer` o `pencil-designer` → implementas con
`figma-to-css-lemon` → revisas con `a11y-auditor`.

Todos usan las skills de `.claude/skills/` (ver `SETUP.md`). Las skills de Figma
(`figma-use`, `figma-generate-design`, etc.) llegan con el plugin `figma`; el
resto va vendorizado en el repo.

Son un ejemplo de lo que se puede llegar a conseguir trabajando con agentes, les queda mucho por mejorar y no son perfectos, pero **ya permiten hacer un flujo de diseño completo**.

---

## 1. `figma-designer` — diseñar en Figma

**Para qué.** Diseñar o actualizar pantallas, componentes, variables y design
systems **dentro de Figma** (vía MCP de Figma), usando la **librería suscrita
como fuente de verdad**.

**Qué hace.** Sigue un orden fijo: entender el encargo (con `grill-me` /
`user-research` / `research-synthesis` si hace falta) → **descubrir el sistema**
antes de crear nada (`get_libraries`, `search_design_system`) → diseñar por
secciones (`figma-generate-design`, `figma-autolayout-system`; `figma-generate-library`
para construir/extender el sistema) → copy (`ux-copy`) → revisar (`design-critique`,
`accessibility-review`) → entregar y documentar (`design-system`, `design-handoff`,
`figma-code-connect`).

**Con qué lo hemos reforzado.**

- **Nunca hardcodear** spacing, color, radii ni tipografía: todo bindeado a variables.
- **Todo texto con el componente tipográfico del sistema** (o, si la librería no
  publica uno, con los _text styles_ publicados), nunca con nodos de texto sueltos;
  y declararlo explícitamente como excepción cuando toque.
- **Auto Layout en cada frame** y validación con `get_screenshot` / `get_metadata`
  tras cada componente.
- **Nunca paralelizar `use_figma`** (el estado de Figma se muta en serie) y no
  inventar IDs de nodo: leerlos siempre de resultados previos.
- **Cargar `figma-use` antes de cualquier `use_figma`** (prerrequisito obligatorio).

**Requisitos.** MCP de Figma conectado (plugin `figma`) y un archivo con una
librería suscrita.

---

## 2. `pencil-designer` — diseñar en Pencil

**Para qué.** Diseñar pantallas y componentes en el canvas de **Pencil** (`.pen`)
y **aterrizarlos en código** (React/Vue/Svelte/HTML). En Pencil el diseño es
_design-as-code_: lo que dibujas se traduce a código en el repo.

**Qué hace.** Entender el encargo → **leer el estado primero**
(`get_editor_state(include_schema: true)` y `get_guidelines`) → diseñar en el
canvas (`batch_design` / `batch_get`), aplicando variables (`get_variables`) y
componentes de los kits integrados (Shadcn, Halo, Lunaris, Nitro) → aterrizar en
código apoyándose en `frontend-design` → copy (`ux-copy`) → revisar
(`design-critique`, `accessibility-review`) → documentar (`design-system`,
`design-handoff`).

**Con qué lo hemos reforzado.** Casi todo el refuerzo gira en torno a un **bug
conocido del sistema de variables temáticas de Pencil** que rompe el render
dejándolo en negro:

- `get_variables()` **primero**, para no redeclarar tokens que ya existen.
- **Nunca enviar a medias el array `value`** de un token: `SetVariables`
  sobrescribe el token completo, así que hay que reenviarlo íntegro (con todas sus
  variantes de tema **y** su entrada por defecto sin `theme`).
- **Toda variable de color debe tener un fallback sin `theme`** (si no, pinta negro).
- Regla de resolución (gana la última entrada cuyo tema se satisface) y aviso de
  que **el editor tiene un tema activo** que puede no coincidir con el del screenshot.
- `replace:true` borra todo token no incluido; nada de hex crudo en instancias.
- No abrir `.pen` con herramientas de texto: **solo vía el MCP de Pencil**.

**Requisitos.** Pencil instalado y un fichero `.pen` **abierto** (el MCP solo
actúa con un archivo activo).

---

## 3. `figma-to-css-lemon` — de Figma a código (el agente de implementación)

**Para qué.** Convertir un diseño de Figma (con frames **mobile + desktop**) en un
**proyecto vanilla HTML + CSS + PostCSS + Vite** siguiendo la arquitectura CSS de
**Lemoncode**: ITCSS, BEM, capa de tokens crudos + semánticos, tipografía fluida
con `clamp()` y dark mode con `:has()`. Sin frameworks JS.

**Qué hace.** Lee el diseño y lo vuelca a un spec (`design-handoff`) → hace
inventario y un **checkpoint de consistencia** → genera tokens (`design-system`) →
hace el scaffold del proyecto → maqueta (HTML semántico + BEM, mobile-first) →
implementa las interacciones en JS → **verifica** (build + captura headless en
mobile/desktop + `accessibility-review`) y reporta el mapa tipográfico.

**Con qué lo hemos reforzado** (en gran parte, a partir de errores reales de
conversiones previas):

- **Algoritmo de tipografía fluida `clamp()`** (interpolando entre 360px y 1440px),
  con su mapa "estilo de Figma → token `--fs-*` → clamp".
- **Política de consistencia tipo _grill_** (sección 5.5): ante hardcodes, valores
  fuera de escala, casi-duplicados o tokens sin usar, **pregunta** con opciones en
  vez de arreglar en silencio.
- **Guardarraíles de errores frecuentes** (sección 5.6): tokens semánticos que
  nunca llevan hex hardcodeado; **interacciones que Figma no dibuja** pero hay que
  implementar (menú responsive mobile↔desktop, sticky header, scroll suave, toggle
  dark mode); transiciones/hover que faltan; cards de dos partes con grid `1fr 1fr`;
  **nunca imágenes en `position:absolute`** (las decorativas como `background-image`);
  y descargar la **resolución/variante correcta** de cada imagen, optimizada.
- **Stack alineado al ejemplo real**: `postcss.config.js` en **ESM**, **sin
  TypeScript**, Vite 6.

**Requisitos.** MCP de Figma conectado (plugin `figma`).

> Su salida de ejemplo está en `Ejemplo-figma-a-postcss/` (sin revisar, ver el
> aviso del README).

---

## 4. `a11y-auditor` — auditoría de accesibilidad independiente

**Para qué.** Hacer una **segunda pasada WCAG 2.1 AA**, con mirada independiente,
sobre el código HTML/CSS ya generado (normalmente por `figma-to-css-lemon`).

**Qué hace.** Invoca la skill `accessibility-review` y sigue su checklist y formato
de salida. Lee el HTML de cada página y el CSS, **resuelve los tokens semánticos
hasta su valor real** para calcular el contraste tanto en **light como en dark
mode**, y verifica jerarquía de headings, landmarks, `alt` / imágenes decorativas,
foco visible, targets ≥ 44×44px, labels, `prefers-reduced-motion` y zoom al 200%.
Entrega un reporte priorizado (Crítico → Mayor → Menor) y, si se le pide, **aplica
los arreglos** respetando la arquitectura.

**Con qué lo hemos reforzado.**

- **No asume que el código es correcto** por haberlo generado otro agente: lo
  revisa de cero.
- Para arreglar el **contraste**, ajusta el **token semántico o su mapeo** al crudo,
  no el componente; si falta un color con mejor contraste, lo crea en la capa de tokens.
- Mantiene **BEM + tokens** en cualquier arreglo y deja constancia de **qué
  criterio WCAG** resolvía cada cambio.

**Requisitos.** Ninguno extra: trabaja sobre el código del propio repo.
