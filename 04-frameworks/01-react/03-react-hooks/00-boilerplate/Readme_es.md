# 02 Vite boiler plate - React

## Resumen

Boiler plate extraído de _02-base/02-vite-react_.

A continuación, puntos principales. Para más info, acudir a repo original o módulo de vite.

- Instalación de `typeScript` como dependencia de desarrollo local.
- Instalación de `@vitejs/plugin-react` como dependencia de desarrollo local (soporte `jsx` y `tsx`)
- Instalación de `react` y `react-dom` como dependencias.
- Instalación de los tipos de `@types/react` y `@types/react-dom` como dependencia de desarrollo local.
- Se cambió el proyecto para usar ES Modules `package.json`.
- Se creó un `tsconfig.json` con una configuración mínima, preparada para soportar formato `jsx`.
- Vite utiliza esbuild para la transpilación (rápido, sin comprobación de tipos).
- Se habilitó `isolatedModules` y `useDefineForClassFields` para que sea compatible con `esbuild`.
