# Skills del agente de diseño

Estas Skills se cargan **automáticamente** al abrir este repo con Claude Code
(busca skills en `.claude/skills/`). Quien clone el repo las tiene sin instalar
nada.

**Licencias** (necesarias al redistribuir): las 9 de Anthropic son Apache 2.0
(`LICENSE.txt`); `grill-me` es MIT © Matt Pocock (`LICENSE-grill-me.txt`).
Resumen en `NOTICE.txt`.

## Incluidas (10)

| Etapa | Skill | Fuente |
|---|---|---|
| Descubrir / definir | `user-research` | plugin `design` (Anthropic) |
| | `research-synthesis` | plugin `design` (Anthropic) |
| | `grill-me` | `mattpocock/skills` (comunidad) |
| Diseñar en Figma | `figma-autolayout-system` | paquete de skills de Cowork/Claude (Anthropic) |
| UI en código | `frontend-design` | repo `anthropics/skills` |
| Escribir copy | `ux-copy` | plugin `design` (Anthropic) |
| Revisar calidad | `design-critique` | plugin `design` (Anthropic) |
| | `accessibility-review` | plugin `design` (Anthropic) |
| Documentar / handoff | `design-system` | plugin `design` (Anthropic) |
| | `design-handoff` | plugin `design` (Anthropic) |

## Fuentes (repos de origen)

- Plugin **`design`** de Anthropic (7 skills, Apache 2.0) — `claude plugins add knowledge-work-plugins/design`
  https://github.com/anthropics/knowledge-work-plugins/tree/main/design
- **`frontend-design`** — repo oficial de Anthropic (Apache 2.0)
  https://github.com/anthropics/skills/tree/main/skills/frontend-design
- **`figma-autolayout-system`** — viene en el paquete de skills de la app de
  Cowork/Claude (Anthropic). No localizada en el marketplace público ni con archivo
  de licencia propio a la vista; licencia asumida Apache 2.0 como el resto de skills
  de Anthropic. No viene con el plugin `figma`, por eso se incluye aquí.
- **`grill-me`** — comunidad, Matt Pocock
  https://github.com/mattpocock/skills

## Skills de Figma (vía plugin `figma`, no vendored)

`figma-use`, `figma-generate-design`, `figma-generate-library` y
`figma-code-connect` vienen con el plugin `figma` (de Figma), que además aporta
el MCP de Figma. **No** se redistribuyen aquí: se instalan con el plugin (ver
`SETUP.md`). En cambio `figma-autolayout-system` **sí** se incluye arriba porque
no forma parte del plugin.
