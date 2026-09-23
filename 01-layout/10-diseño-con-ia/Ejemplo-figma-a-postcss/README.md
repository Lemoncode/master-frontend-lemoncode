# NEXUS — Landing

Conversión del diseño de Figma *Clase Layout Soluciones* a **HTML + CSS + PostCSS + Vite** siguiendo la arquitectura CSS de Lemoncode.

> **Contexto (clase):** ejemplo generado con el agente `figma-to-css-lemon` a
> partir de un **diseño sencillo de landing en Figma**, hecho con **nuestro
> propio design system y componentes**.
>
> ⚠️ **El código de salida no se ha revisado y puede tener errores.** Es la
> primera salida del agente; para un resultado real habría que seguir iterando.

## Stack

- **Vite** — bundler y dev server.
- **PostCSS** — `postcss-import`, `postcss-mixins`, `postcss-custom-media`, `postcss-nesting`, `autoprefixer`.
- **Fontsource** — Geologica (títulos/logo) e Inter (cuerpo/UI), self-hosted.

## Arranque

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en /dist
npm run preview  # sirve el build
```

## Arquitectura CSS (ITCSS)

Capas de menor a mayor especificidad (`src/css/index.css` las orquesta):

```
src/css/
├── 01-settings/      tokens crudos · tokens semánticos · @custom-media
├── 02-tools/         mixins (container, focus-ring, button-base)
├── 03-generic/       reset
├── 04-elements/      estilos base de etiquetas
├── 05-layout/        estructuras de página (l-*)
├── 06-components/    bloques BEM (nav, hero, services, card, contact, form, footer, button, theme-toggle)
└── 07-utilities/     helpers de propósito único (u-*)
```

### Claves

- **Tokens en dos capas**: los componentes solo consumen tokens *semánticos* (`--bg-page`, `--text-strong`, …), que mapean a los *crudos* (`--raw-*`).
- **Tipografía fluida** con `clamp()` interpolando entre el frame mobile (393px) y desktop (1440px).
- **Mobile-first** con breakpoints vía `@custom-media` (principal: `--from-lg`, 1024px).
- **Dark mode** con `:has()` sobre el checkbox `#theme-toggle` — sin JavaScript.
- **BEM** en todos los componentes.

## Assets

Imágenes del diseño en `public/images/` (hero ×4, cards ×3, icono de menú).
