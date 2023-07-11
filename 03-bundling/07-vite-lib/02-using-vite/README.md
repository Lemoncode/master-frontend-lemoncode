# 02 Using Vite

In this example we are going to create a library using Vite.

We will start from scratch.

Summary steps:

- Create library project.
- Add playground project.

# Steps to build it

Let's start by creating the basic library using Vite.

Add manually the `package.json`:

_./common-library/package.json_

```json
{
  "name": "@lemoncode/common-library",
  "version": "1.0.0",
  "description": "Lemoncode common library",
  "author": "Lemoncode",
  "license": "MIT",
  "keywords": ["lemoncode", "common", "library"],
  "type": "module"
}
```

> [scoped-packages](https://docs.npmjs.com/cli/v9/using-npm/scope)

Let's install the necessary dependencies:

```bash
cd common-library
npm install vite typescript --save-dev
```

Add the vite configuration:

_./common-library/vite.config.ts_

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "CommonLibrary",
    },
  },
});
```

> [Vite library mode](https://vitejs.dev/guide/build.html#library-mode)
>
> `name`: is the exposed global variable and is required when formats includes 'umd'.
>
> Default values:
>
> - fileName: takes the name of the package.json `name` field.
>
> - formats: `es` and `umd`.
>
> Auto remove the `dist` folder on each build.

Add a basic `tsconfig.json`:

_./common-library/tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "isolatedModules": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

> [ES targets](https://www.typescriptlang.org/tsconfig#high-level-libraries)
>
> [moduleResolution (bundler)](https://dev.to/ayc0/typescript-50-new-mode-bundler-esm-1jic): designed primarily for bundlers and runtimes that include a range of Node-like resolution features and ESM syntax, but do not enforce the strict resolution rules that accompany ES modules in Node or in the browser.
>
> [More info about bundler](https://github.com/microsoft/TypeScript/pull/51669)

Add some functionality:

_./common-library/src/helpers/array.helpers.ts_

```typescript
export const mapCollection = <Item, MappedItem>(
  collection: Item[],
  mapFn: (item: Item) => MappedItem
): MappedItem[] => (Array.isArray(collection) ? collection.map(mapFn) : []);
```

Add the `barrel` file:

_./common-library/src/helpers/index.ts_

```typescript
export * from "./array.helpers";
```

Add the entry point:

_./common-library/src/index.ts_

```typescript
export * from "./helpers";
```

Let's add the build scripts:

_./common-library/package.json_

```diff
{
  ...
  "keywords": [
    "lemoncode",
    "common",
    "library"
  ],
  "type": "module",
+ "scripts": {
+   "build": "vite build && npm run build:types",
+   "build:types": "tsc --emitDeclarationOnly --declaration"
+ },
  ...
}

```

Now, we could add the entry points:

_./common-library/package.json_

```diff
{
  ...
  "type": "module",
+ "main": "dist/common-library.umd.cjs",
+ "module": "dist/common-library.js",
+ "types": "dist/index.d.ts",
+ "exports": {
+   ".": {
+     "require": "./dist/common-library.umd.cjs",
+     "import": "./dist/common-library.js",
+     "types": "./dist/index.d.ts"
+   }
+ },
  "scripts": {
    "build": "vite build && npm run build:types",
    "build:types": "tsc --emitDeclarationOnly --declaration"
  },
  ...
}
```

Run the build:

```bash
npm run build
```

Let's add the `playground` project:

_./playground/package.json_

```json
{
  "name": "playground",
  "scripts": {
    "start": "vite --open"
  },
  "dependencies": {
    "@lemoncode/common-library": "../common-library"
  }
}
```

Install dependency and vite:

```bash
cd playground
npm install vite typescript --save-dev
```

Add the playground entry point:

_./playground/src/index.ts_

```typescript
import { mapCollection } from "@lemoncode/common-library";

const collection = [1, 2, 3];
const result = mapCollection(collection, (x) => x * 2);
console.log(result);
```

_./playground/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
  </head>
  <body>
    <script type="module" src="src/index.ts"></script>
  </body>
</html>
```

Let's run the project:

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
