# Diseño con IA — Figma + Claude · Pencil + Claude

Material de clase para **diseñar y maquetar con un agente de IA** (Claude Code).
El repo unifica dos flujos que comparten las mismas *skills* de diseño:

- **Figma + Claude** — diseñar/leer en Figma y convertir el diseño a código.
- **Pencil + Claude** — diseñar en Pencil (*design-as-code*) y aterrizarlo en
  código.

Ambos parten del mismo conjunto de skills (`.claude/skills/`) y de un rol de
agente común. La instalación y conexión de skills y MCPs está en **[`SETUP.md`](SETUP.md)**.

---

## Agentes incluidos (`.claude/agents/`)

Al abrir el repo con Claude Code se cargan estos cuatro agentes:

| Agente | Para qué |
|---|---|
| `figma-designer` | Diseñar/actualizar pantallas, componentes y design systems **en Figma** (vía MCP de Figma), usando la librería como fuente de verdad. |
| `pencil-designer` | Diseñar pantallas y componentes **en Pencil** (`.pen`) y generar código (React/Vue/Svelte/HTML). |
| `figma-to-css-lemon` | **Agente de implementación**: convierte un diseño de Figma en un proyecto vanilla **HTML + CSS + PostCSS + Vite** con la arquitectura CSS de Lemoncode (ITCSS, BEM, tokens crudos/semánticos, tipografía fluida con `clamp()`, dark mode con `:has`). |
| `a11y-auditor` | Segunda pasada independiente de accesibilidad (WCAG 2.1 AA) sobre el código generado por `figma-to-css-lemon`. |

Detalle de cada agente —para qué sirve, qué hace y **con qué lo hemos reforzado**—
en **[`AGENTS.md`](AGENTS.md)**.

---

## Ejemplos de implementación

El repo incluye **dos ejemplos ya generados** con estos flujos, para enseñar el
resultado de punta a punta. Cada uno tiene su propio `README.md` con detalle.

### 1. `Ejemplo-figma-a-postcss/` — de Figma a CSS propio

Sale de un **diseño sencillo de una landing en Figma**, hecho con **nuestro
propio design system y nuestros componentes**. El agente `figma-to-css-lemon` lo
convirtió a **HTML + CSS + PostCSS + Vite** siguiendo la arquitectura CSS de
Lemoncode (sin frameworks JS): capa de tokens, BEM, tipografía fluida con
`clamp()` y dark mode con `:has()`.

### 2. `Pencil-login-centered-minimal/` — de Pencil a React

Sale de un diseño en **Pencil** (`design/Test-app.pen`, frame *Login Variant 1 –
Centered Minimal*) y se aterrizó en código con un stack distinto: **React + Vite
+ shadcn/ui** (Tailwind v4, componentes new-york, lucide-react). El diseño de
origen vive junto al código, en la subcarpeta `design/`.

---

## ⚠️ Importante: el código de salida NO está revisado

En **los dos ejemplos**, el código generado por el agente **no se ha revisado** y
**puede contener errores**. Son la *primera salida* del agente, no un resultado
final pulido. Para usarlos de verdad habría que **seguir iterando** hasta dejar
el código correcto en ambos casos (estructura, fidelidad al diseño,
accesibilidad, detalles de maquetación).

Tómalos como **punto de partida y material didáctico**, no como referencia de
código "bueno por defecto". Iterar y corregir esa salida es justamente parte del
ejercicio.

---

## Cómo arrancar cada ejemplo

```bash
cd "Ejemplo-figma-a-postcss"      # o  "Pencil-login-centered-minimal"
npm install
npm run dev
```

(Las dependencias y los builds no se versionan; se regeneran con `npm install` /
`npm run build`. Ver `.gitignore`.)

---

## Estructura del repo

```
.
├── .claude/
│   ├── agents/        figma-designer · pencil-designer · figma-to-css-lemon · a11y-auditor
│   └── skills/        9 skills de diseño (ver SETUP.md)
├── AGENTS.md          qué hace cada agente y cómo lo hemos reforzado
├── SETUP.md           instalación de skills, plugin figma y MCPs (Figma/Pencil)
├── Ejemplo-figma-a-postcss/        ejemplo 1 (Figma → CSS propio)
└── Pencil-login-centered-minimal/  ejemplo 2 (Pencil → React/shadcn)
    └── design/        origen Pencil: Test-app.pen · shadcn.lib.pen · gauge.js
```

> Licencias de las skills: Anthropic (Apache 2.0) y `grill-me` (MIT, © Matt
> Pocock). Detalle en `.claude/skills/NOTICE.txt` y `LICENSE*.txt`.
