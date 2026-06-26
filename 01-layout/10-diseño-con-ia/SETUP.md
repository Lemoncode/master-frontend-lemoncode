# Setup — Agentes de diseño con IA (Pencil & Figma + Claude)

Este repo trae **cuatro agentes de diseño** listos para usar (en `.claude/agents/`)
más un conjunto de *skills* en `.claude/skills/`, todo lo cual **Claude Code carga
automáticamente** al abrir el repo. Quien lo clone tiene agentes y skills sin
instalar nada.

> **¿Qué hace cada agente y cómo lo hemos reforzado?** Está explicado en
> **[`AGENTS.md`](AGENTS.md)** (`figma-designer`, `pencil-designer`,
> `figma-to-css-lemon` y `a11y-auditor`).

Esta guía cubre los pasos que sí requieren acción por persona: instalar el
plugin `figma` (que aporta las skills de Figma **y** su MCP), y **conectar los
MCP** de Figma y Pencil (cada uno autentica su propia cuenta).

> **¿De dónde sale cada skill?** Tabla completa de repos y enlaces en
> [Fuentes de las skills](#fuentes-de-las-skills), al final.

---

## 1. Las skills incluidas (cero setup)

Al abrir el repo con Claude Code, estas **10 skills** ya están disponibles
(viven en `.claude/skills/`):

| Etapa | Skill | Fuente |
|---|---|---|
| Descubrir / definir | `user-research` | plugin `design` (Anthropic) |
| | `research-synthesis` | plugin `design` (Anthropic) |
| | `grill-me` | `mattpocock/skills` (comunidad) |
| Diseñar en Figma | `figma-autolayout-system` | paquete Cowork/Claude (Anthropic) |
| UI en código | `frontend-design` | repo `anthropics/skills` |
| Escribir copy | `ux-copy` | plugin `design` (Anthropic) |
| Revisar calidad | `design-critique` | plugin `design` (Anthropic) |
| | `accessibility-review` | plugin `design` (Anthropic) |
| Documentar / handoff | `design-system` | plugin `design` (Anthropic) |
| | `design-handoff` | plugin `design` (Anthropic) |

Verifícalas con `/help` o escribiendo `/` en Claude Code dentro del repo.
URLs completas en [Fuentes de las skills](#fuentes-de-las-skills).

> **Licencias** (necesarias al compartir): las 9 de **Anthropic** son Apache 2.0
> (`.claude/skills/LICENSE.txt`); `grill-me` es **MIT** © Matt Pocock
> (`.claude/skills/LICENSE-grill-me.txt`). Resumen en `NOTICE.txt`.

---

## 2. Las skills de Figma (vía plugin `figma`)

Las skills para diseñar en Figma **no se vendorizan**: vienen con el plugin
`figma` (de Figma), que además trae el conector MCP. Instálalo una vez:

```
/plugin marketplace add anthropics/claude-code
/plugin install figma
```

Esto añade las skills `figma-use`, `figma-generate-design`,
`figma-generate-library` y `figma-code-connect` **y** el conector MCP de Figma (paso 3).

> `figma-autolayout-system` **no** forma parte del plugin `figma` (viene del
> paquete de skills de Cowork/Claude), así que **se incluye vendorizada** en
> `.claude/skills/` para que esté disponible sin Cowork. Cárgala junto a
> `figma-use` al diseñar.

---

## 3. Conectar el MCP de Figma (para diseñar en Figma)

Si instalaste el plugin `figma`, el MCP ya viene con él. Si no, añádelo a mano:

```
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Luego, dentro de Claude Code:

```
/mcp        → selecciona figma → Authenticate → Allow Access
```

Cada persona autentica **su propia cuenta** de Figma. Para usar librerías como
fuente de verdad, ten un archivo Figma con una **librería suscrita**.

---

## 4. Conectar el MCP de Pencil (para diseñar en Pencil)

1. Instala **Pencil** (extensión de VS Code/Cursor o app de escritorio): https://www.pencil.dev/
2. Abre un fichero **`.pen`** en el editor (el MCP de Pencil solo actúa con un archivo abierto).
3. Verifica la conexión: en Claude Code, `/mcp` debe listar **pencil**.

> El MCP de Pencil es **local** (corre en tu máquina); el de Figma es **remoto**
> (`mcp.figma.com`). En ambos, el agente lee el diseño y escribe diseño/código
> vía MCP.

---

## 5. El agente: prompt de sistema sugerido

Pega esto como instrucciones del proyecto (o en un `CLAUDE.md`) para fijar el rol:

> Eres un **agente de diseño de producto**. Orden de trabajo:
> 1. **Entender** — research / PRD (`user-research`, `research-synthesis`, `grill-me`).
> 2. **Diseñar** — en Figma o Pencil con el design system (`figma-generate-design`,
>    `figma-autolayout-system`, `figma-generate-library`; en Pencil, vía su MCP).
> 3. **Escribir** — UX copy (`ux-copy`).
> 4. **Revisar** — crítica y accesibilidad (`design-critique`, `accessibility-review`).
> 5. **Entregar** — sistema y handoff a dev (`design-system`, `design-handoff`).
>
> Usa **siempre** componentes y variables de la librería; **nunca** valores
> hardcodeados (spacing, color, radii). Antes de escribir en Figma carga
> `figma-use`. Valida con screenshot tras cada componente.

---

## Fuentes de las skills

De dónde sale cada skill, por si quieres revisar el repo original o instalarla suelta:

| Skill(s) | Origen | Enlace |
|---|---|---|
| `user-research`, `research-synthesis`, `ux-copy`, `design-critique`, `accessibility-review`, `design-system`, `design-handoff` | Plugin **`design`** de Anthropic (Apache 2.0). Suelto: `claude plugins add knowledge-work-plugins/design` | https://github.com/anthropics/knowledge-work-plugins/tree/main/design |
| `frontend-design` | Repo oficial de skills de **Anthropic** (Apache 2.0) | https://github.com/anthropics/skills/tree/main/skills/frontend-design |
| `grill-me` | **Comunidad** — Matt Pocock, "Skills for Real Engineers" | https://github.com/mattpocock/skills |
| `figma-use`, `figma-generate-design`, `figma-generate-library`, `figma-code-connect` | Plugin **`figma`** (de Figma; incluye el MCP) | https://github.com/anthropics/claude-code → plugin `figma` · MCP `https://mcp.figma.com/mcp` |
| `figma-autolayout-system` | Viene en el paquete de skills de la app de **Cowork/Claude** (Anthropic). No localizada en el marketplace público ni con archivo de licencia propio a la vista; licencia asumida Apache 2.0 como el resto de skills de Anthropic. No está en el plugin `figma`, por eso se incluye vendorizada en `.claude/skills/` | — (Anthropic) |

---

## Resumen de costes

- **Pencil:** gratis (early access). Su IA se apoya en **Claude Code**.
- **Figma:** plan gratuito + de pago por asiento. El MCP + Claude Code añade el coste de Claude Code.
- **Claude Code:** 20 $/mes (Pro) · 100 $ (Max 5×) · 200 $ (Max 20×), o API por token.
  *(Verifica precios actuales en claude.com, pencil.dev y figma.com.)*
