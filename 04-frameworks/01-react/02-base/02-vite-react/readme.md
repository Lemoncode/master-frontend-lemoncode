# 02 Vite React

## Summary

This example takes the _01-vite-boiler_ example as a starting point.

We will go step by step adding the necessary configuration so that we integrate
**React** into our build process.

# Step by Step guide

- First we copy the previous example, and do a _npm install_

```bash
npm install
```

- Next, install `react` and `react-dom` dependencies:

```bash
npm install react react-dom --save
```

- No install types for `react` y `react-dom` ad dev dependencies:

```bash
npm install @types/react @types/react-dom -D
```

- Now open `tsconfig.json` file and set following compiler option to support `jsx` notation in our TypeScript files:

  _tsconfig.json_

  ```diff
    "compilerOptions": {
      "esModuleInterop": true,
      "isolatedModules": true,
  +   "jsx": "react-jsx",
      "lib": ["ESNext", "DOM"],
      "module": "ESNext",
  ```

  ⚡ `jsx` is a JavaScript syntax extension that will allow us to write HTML-in-JS and is typically used by React components.

- In order to make `vite` fully support `jsx` syntax (among other things) we will add a plugin, otherwise, `esbuild` won't be able to transpile our `react` source files written in `jsx` syntax:

  ```bash
  npm install @vitejs/plugin-react --save-dev
  ```

- Finally, let's modify `vite.config.ts` to add the newly installed plugin:

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

- Let's create our first React component.

_./src/app.tsx_

```tsx
import React from "react";

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

Lets update our _./src/index.ts_ to _./src/index.tsx_. We also adjust in the _./index.html_ file.

- It's time to instantiate that main component, to be able to integrate it with the browser we have to make use of _createRoot_.

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
```

- Let's check that things are working as expected:

```bash
npm start
```
