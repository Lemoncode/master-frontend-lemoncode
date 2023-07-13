# 03 Component library

In this example we are going to add React component to the library.

We will start from `02-using-vite`.

Summary steps:

- Create basic React component.
- Add configuration.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

Let's install all necessary dependencies to create a React component:

```bash
cd common-library
npm install react react-dom @types/react @types/react-dom @vitejs/plugin-react --save-dev
```

> Notice that we are installing `react` and `react-dom` as dev dependencies, this is because we are going to create a library, and we don't want to include React in the bundle, we want to use the React version that the consumer is using.

But we need to add `react` and `react-dom` as peer dependencies:

_./common-library/package.json_

```diff
{
  ...
  "scripts": {
    "build": "vite build && npm run build:types",
    "build:types": "tsc --emitDeclarationOnly --declaration"
  },
  "devDependencies": {
    "@types/react": "^18.2.12",
    "@types/react-dom": "^18.2.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.1.3",
    "vite": "^4.3.9"
  },
+ "peerDependencies": {
+   "react": "18.x",
+   "react-dom": "18.x"
+ }
}
```

> [More info about peerDependencies](https://nodejs.org/en/blog/npm/peer-dependencies)

Update `vite config`:

_./common-library/vite.config.ts_

```diff
import { defineConfig } from "vite";
+ import react from "@vitejs/plugin-react";

export default defineConfig({
+ plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "CommonLibrary",
    },
  },
});

```

Update `tsconfig.json`:

_./common-library/tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "outDir": "dist",
+   "jsx": "react-jsx"
  },
  "include": ["src"]
}

```

> [jsx prop](https://www.typescriptlang.org/tsconfig#jsx)

Add a basic React component:

_./common-library/src/components/button.module.css_

```css
.root {
  padding: 0.5rem 1rem;
  background-color: #00fa9a;
  border-radius: 0.25rem;
  cursor: pointer;
}
```

_./common-library/src/components/button.tsx_

```typescript
import classes from "./button.module.css";

export const Button = () => {
  return <button className={classes.root}>Common button</button>;
};
```

Add `vite default d.ts` config:

_./common-library/src/vite-env.d.ts_

```typescript
/// <reference types="vite/client" />
```

Add `barrel` file:

_./common-library/src/components/index.ts_

```typescript
export * from "./button";
```

Update the entrypoint:

_./common-library/src/index.ts_

```diff
export * from "./helpers";
+ export * from "./components";

```

Let's build the library:

```bash
npm run build
```

If we check the `dist` folder, we can see that we have included `react` and `react-dom` in the bundle, even if we have added them as peer dependencies. We need to add some configuration to avoid this:

_./common-library/vite.config.ts_

```diff
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "CommonLibrary",
    },
+   rollupOptions: {
+     external: ["react", "react-dom", "react/jsx-runtime"],
+     output: {
+       globals: {
+         react: "React",
+         "react-dom": "ReactDOM",
+       },
+     },
+   },
  },
});

```

Let's build again:

```bash
npm run build
```

Now we can see that `react` and `react-dom` are not included in the bundle.

Let's update the playground to use the new component:

```bash
cd playground
npm install react react-dom --save
npm install @types/react @types/react-dom --save-dev

```

Add `tsconfig.json`:

_./playground/tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Update html

_./playground/index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
+   <div id="root"></div>
-   <script type="module" src="src/index.ts"></script>
+   <script type="module" src="src/index.tsx"></script>
  </body>
</html>

```

Rename index.ts -> index.tsx

_./playground/src/index.tsx_

```diff
- import { mapCollection } from "@lemoncode/common-library";

- const collection = [1, 2, 3];
- const result = mapCollection(collection, (x) => x * 2);
- console.log(result);
+ import { createRoot } from "react-dom/client";
+ import { Button } from "@lemoncode/common-library";

+ const root = createRoot(document.getElementById("root")!);
+ root.render(<Button />);

```

Let's run the app:

```bash
npm start
```

Now we can see the button in the browser but where are the styles? By default vite splits the css in a different file, we need to add a new entry point in the exports section of the `package.json`:

_./common-library/package.json_

```diff
{
  ...
  "exports": {
    ".": {
      "require": "./dist/common-library.umd.cjs",
      "import": "./dist/common-library.js",
      "types": "./dist/index.d.ts"
    },
+   "./style.css": "./dist/style.css"
  },
  ...
}
```

Build again:

```bash
npm run build
```

Update the playground:

_./playground/src/index.tsx_

```diff
import { createRoot } from "react-dom/client";
+ import "@lemoncode/common-library/style.css";
import { Button } from "@lemoncode/common-library";

const root = createRoot(document.getElementById("root")!);
root.render(<Button />);

```

> [Discussion auto import styles in library mode](https://github.com/vitejs/vite/issues/1579)
>
> As alternative we can use any `CSS in JS` library.

Let's run the app:

```bash
npm start
```

If we want to work with aliases we need to add some configuration:

```bash
cd common-library
npm install @types/node@18 --save-dev
```

_./common-library/vite.config.ts_

```diff
+ import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
+ resolve: {
+   alias: {
+     "@": fileURLToPath(new URL("./src", import.meta.url)),
+   },
+ },
  build: {
...
```

_./common-library/tsconfig.json_

```diff
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "outDir": "dist",
    "jsx": "react-jsx",
+   "baseUrl": "src",
+   "paths": {
+     "@/*": ["*"]
+   }
  },
  "include": ["src"]
}

```

Update entrypoint:

_./common-library/src/index.ts_

```diff
- export * from "./helpers";
+ export * from "@/helpers";
- export * from "./components";
+ export * from "@/components";

```

Run the build:

```bash
npm run build
```

This time the generated `d.ts` files are not correct because by `tsc` is not able to resolve the aliases we have defined. We will to install a vite plugin to fix this:

```bash
npm install vite-plugin-dts --save-dev
```

Update config:

_./common-library/vite.config.ts_

```diff
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
+ import dts from "vite-plugin-dts";

export default defineConfig({
- plugins: [react()],
+ plugins: [react(), dts()],
...

```

Update the `package.json`

_./common-library/package.json_

```diff
{
  ...
  "scripts": {
-   "build": "vite build && npm run build:types",
+   "build": "vite build"
-   "build:types": "tsc --emitDeclarationOnly --declaration"
  },
  ...
}

```

Run the build:

```bash
npm run build
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
