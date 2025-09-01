# 02 Vite React

## Summary

Este ejemplo parte desde el ejemplo _01-vite-boiler_.

Vamos a ir paso a paso, añadiendo la configuración necesaria para integrar **React**.

# Guía paso a paso

- Antes que nada nos instalamos todos los paquetes necesarios del boiler plate ejecutando _npm install_

```bash
npm install
```

- A continuación instalamos `react` y `react-dom` como dependencias:

```bash
npm install react react-dom --save
```

- A continuación instalamos los tipos de las librerías `react` y `react-dom` como dependencias de desarrollo:

```bash
npm install @types/react @types/react-dom -D
```

- Para hacer que TS entienda la notación `jsx` añadimos lo siguiente en el fichero `tsconfig.json`:

  _tsconfig.json_

  ```diff
    "compilerOptions": {
      "esModuleInterop": true,
      "isolatedModules": true,
  +   "jsx": "react-jsx",
      "lib": ["ESNext", "DOM"],
      "module": "ESNext",
  ```

  ⚡ `jsx` es azucar sintáctico que permite escribir HTML-in-JS. Esta sintaxis es la que vamos a usar con los componentes de React.

- Para hacer que `vite` soporte la sintaxis `jsx` (y otras cosas) tenemos que añadir un plugin, sino, `esbuild` no será capaz de transpilar nuestros ficheros de `react`, escritos en formato en `jsx`:

  ```bash
  npm install @vitejs/plugin-react --save-dev
  ```

- Finalmente, modificamos `vite.config.ts` añadiendo nuestro plugin:

  _vite.config.ts_

  ```diff
    import { defineConfig } from "vite";
    import checker from "vite-plugin-checker";
  + import react from "@vitejs/plugin-react";

    export default defineConfig({
  -   plugins: [checker({ typescript: true })],
  +   plugins: [checker({ typescript: true }), react()],
    });

  ```

- Creemos ahora nuestro primer componente

_./src/app.tsx_

```tsx
import React from "react";

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

Actualizamos*./src/index.ts* a _./src/index.tsx_. Ajustamos la extensión también en el fichero _./index.html_.

- Vamos a usar el componente que acabamos de crear. Para poder integrar ese componente (y el resto de la aplicación) en nuestro html, hacemos uso de _createRoot_.

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
```

- Comprobamos que todo funciona

```bash
npm start
```
