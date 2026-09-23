# Login — Centered Minimal

Implementación en React + Vite + shadcn/ui del frame **"Login Variant 1 - Centered Minimal"** (Pencil, `design/Test-app.pen`).

> El diseño de origen en Pencil vive en `design/`: `Test-app.pen` (pantalla de
> login), `shadcn.lib.pen` (librería shadcn para Pencil) y `gauge.js` (componente
> de ejemplo).

> **Contexto (clase):** ejemplo generado a partir de un **diseño en Pencil**,
> aterrizado en código con **shadcn + React + Vite**.
>
> ⚠️ **El código de salida no se ha revisado y puede tener errores.** Es la
> primera salida del agente; para un resultado real habría que seguir iterando.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **shadcn/ui** (new-york) — componentes `button`, `input`, `label`, `checkbox`, `card`
- **lucide-react** para iconos
- Fuente **Inter** (Google Fonts)

## Tema

Tokens en `src/index.css` ajustados al diseño: primario violeta `#7c3aed`, fondo gris claro `#f9fafb`, card blanca, borde `#e5e7eb`. Incluye variante `.dark`.

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Estructura

- `src/components/login-page.tsx` — la pantalla de login completa
- `src/components/ui/` — componentes de shadcn
- `src/index.css` — tokens del design system y tema
