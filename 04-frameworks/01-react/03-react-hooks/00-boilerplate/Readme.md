# 02 Vite boiler plate - React

## Summary

Boiler plate extracted from _02-base/02-vite-react_.

Below, main points. For more info, check the original repo or the Vite module.

- Installation of `typeScript` as a local development dependency.
- Installation of `@vitejs/plugin-react` as a local development dependency (support for `jsx` and `tsx`).
- Installation of `react` and `react-dom` as dependencies.
- Installation of the types `@types/react` and `@types/react-dom` as local development dependencies.
- The project was changed to use ES Modules `package.json`.
- A `tsconfig.json` was created with a minimal configuration, prepared to support `jsx` format.
- Vite uses esbuild for transpilation (fast, no type checking).
- `isolatedModules` and `useDefineForClassFields` were enabled to be compatible with `esbuild`.
