## 02 Web Boiler plate

## Resumen

En este ejemplo desarrollamos un boilerplate de Vite configurado con soporte para TypeScript, justo en el paso previo
a añadir soporte para React.

Está basado en los ejemplos de Vite.

Este ejemplo es el único que no tiene una guía paso a paso (si necesitas orientación, puedes consultar los
ejemplos de Vite que encontrarás en este repositorio).

Puntos destacados:

- Se agregó TypeScript como dependencia de desarrollo local.
- Se cambió el proyecto para usar ES Modules `package.json`.
- Se creó un `tsconfig.json` con una configuración mínima.
- Vite utiliza esbuild para la transpilación (rápido, sin comprobación de tipos).
- Se habilitó `isolatedModules` y `useDefineForClassFields` para que sea compatible con `esbuild`.

En el siguiente ejemplo tomaremos este como punto de partida y, paso a paso, añadiremos
soporte para React.
