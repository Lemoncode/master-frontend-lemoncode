# Typescript

It's time to test how parcel behaves when using Typescript.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _05-images_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's install typescript locally:

```bash
npm install typescript --save-dev
```

- Let's add a _tsconfig.json_ configuration file:

_tsconfig.json_

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "isolatedModules": true,
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Node",
    "noEmit": true,
    "noImplicitAny": false,
    "noImplicitReturns": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "target": "ESNext",
    "useDefineForClassFields": true
  },
  "include": ["src"]
}
```

- Let's update _index.html_ file:

_./index.html_

```diff
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
-     <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
      <title>Vite App</title>
    </head>
    <body>
-     <h1>Check the console log</h1>
-     <div id="imgContainer"></div>
-     <img src="/src/content/logo_2.png" alt="logo lemoncode" />
-     <div class="card" style="width: 18rem">
-       <div class="card-body">
-         <h5 class="card-title">Card title</h5>
-         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
-         <a href="#" class="btn btn-primary">Go somewhere</a>
-       </div>
-     </div>
-     <div class="red-background">RedBackground stuff</div>
-     <script type="module" src="/src/index.js"></script>
+     <script type="module" src="/src/index.ts"></script>
    </body>
  </html>
```

- Let's rename our _index.js_ file to _index.ts_.

- Let's replace our _index.ts_ with some test code.

_./src/index.ts_

```diff
- import "./mystyles.scss";
- import logoImg from "./content/logo_1.png";
-
- const user = "John Doe";
-
- console.log(`Hello ${user}!`);
- console.log("This app is using Vite");
-
- const img = document.createElement("img");
- img.src = logoImg;
-
- document.getElementById("imgContainer").appendChild(img);
-
+ const numberA: number = 2;
+ const numberB: number = 3;
+
+ console.log(numberA + numberB);
+
+ export {}
```

Notice the last `export` line. Our TypeScript configuration has `"isolatedModules": true"` and Vite expects [this flags on](https://vitejs.dev/guide/features.html#typescript-compiler-options). So we need to have at leas one `import` or `export` in the file.

- Start the project:

```bash
npm start
```

- Now if we introduce a type error, Vite won't complain. Vite uses `esbuild` under the hood and `esbuild` just removes type annotation like babel so we won't have compilation errors.

_./src/index.ts_

```diff
- const numberA: number = 2;
+ const numberA: string = 2;
```

In order get compilation errors we'll need to run `tsc` by ourselves. For the dev-server it would require to install some development tools like `npm-run-all` and extra scripts setup in `package.json`. We'll use a Vite plugin called `vite-esbuild-typescript-checker`.

- Let's install the plugin:

```bash
npm install vite-esbuild-typescript-checker --save-dev
```

- Let's create a Vite's config file at the root folder called `vite.config.ts`:

_vite.config.ts_

```ts
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [checker({ typescript: true })],
});
```

- Let's start the app with:

```bash
npm start
```

- Notice now we can see compilation errors in console:

```
 ERROR(TypeScript)  Type 'number' is not assignable to type 'string'.
 FILE  /project/src/index.ts:4:7

    2 |
    3 | const numberA: number = 2;
  > 4 | const numberB: string = 3;
      |       ^^^^^^^
    5 |
    6 | console.log(numberA + numberB);
    7 |

[TypeScript] Found 1 error. Watching for file changes.
```

- If we take a look at the browser at [http://localhost:3000](http://localhost:3000) you'll notice the overlay with the compilation error too.

Now, this unfortunately doesn't prevent generating the production bundle. Let's update the `package.json` to run `tsc` before production build:

```diff
  "scripts": {
    "start": "vite",
+   "type-check": "tsc --noEmit",
+   "prebuild": "npm run type-check",
    "build": "vite build",
    "preview": "vite preview"
  },
```

- Let's do a production build:

```bash
npm run build
```

- Let's fix the compilation error:

_./src/index.ts_

```diff
  const numberA: number = 2;
- const numberB: string = 3;
+ const numberB: number = 3;
```

- If we do a production build now it runs smoothly.
