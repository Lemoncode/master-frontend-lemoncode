# Typescript

It's time to test how `vite` behaves when using Typescript. This is an interesting and realistic exercise as most of the front-end projects nowadays are written in Typescript.

📌 We start from sample `05-images`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `05-images`. Just copy the project and install:

  ```bash
  npm install
  ```

- Now let's install `typescript` locally as a **_dev_** dependency:

  ```bash
  npm install typescript --save-dev
  ```

- We'll switch to `"type": "module"` in `package.json`.:

  _package.json_

  ```diff
  {
    "name": "hello-vite",
    "private": true,
  + "type": "module",
    "version": "0.0.0",
  ```

  This is for plugins to load dependencies as ESModules. [See this.](https://vite.dev/guide/troubleshooting#vite-cjs-node-api-deprecated)

- We have to setup `typescript`, so let's add a `tsconfig.json` file and populate it with a basic starting configuration:

  _tsconfig.json_

  ```json
  {
    "compilerOptions": {
      "esModuleInterop": true,
      "isolatedModules": true,
      "lib": ["ESNext", "DOM"],
      "module": "ESNext",
      "moduleResolution": "bundler",
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

  ⚡ Our compilation target and module format is gonna be ES6, remember `vite` uses native modules (ESM) for development.

  ⚡ In the development flow, `vite` only perform transpilation on TS files. It relies on `esbuild` for such a task (20-30x faster than `tsc`) and once transpiled, it expose them as ES modules. **It does not perform type checking**, it is up to you to take care of that in the build process or rely on you IDE.

  ⚡ `esbuild` transformer requires a couple of specific [compiler options](https://vitejs.dev/guide/features.html#typescript-compiler-options) to be turned on:

  - **isolatedModules**: `esbuild` performs transpilation in isolated mode, this is, on a single file at a time. Therefore, it cannot transform code that depend on understanding the full type system. This flag turned on ensures we are warned against certain code that can't be correctly interpreted by a single-file transpilation process.
  - **useDefineForClassFields**: ensures EMCA compliant class fields.

  The rest is just a starting boilerplate configuration you can tweak based on your needs.

- Let's simplify our `index.html` file just to focus on TS:

  _index.html_

  ```diff
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  -     <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
        <title>Vite App</title>
      </head>

  -   <body class="m-3">
  -     <h1>Check the console log</h1>
  -     <div id="imgContainer"></div>
  -     <img src="/src/content/logo_2.png" alt="logo lemoncode" />
  -     <div class="card" style="width: 18rem">
  -       <div class="card-body">
  -         <h5 class="card-title">Card title</h5>
  -         <p class="card-text">
  -           Some quick example text to build on the card title and make up the bulk of the card's content.
  -         </p>
  -         <a href="#" class="btn btn-primary">Go somewhere</a>
  -       </div>
  -     </div>
  -     <div class="red-background">RedBackground stuff</div>
  -     <script type="module" src="/src/index.js"></script>
  +   <body>
  +     <script type="module" src="/src/index.ts"></script>
      </body>
    </html>
  ```

- **Don't forget to rename** our `index.js` file extension to `index.ts`:

  _index.js_

  ```bash
  RENAME index.js -> index.ts
  ```

- And now let's add some TS implementation in our `index.ts`, a simple test code like this one:

  _src/index.ts_

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
  ```

  🔎 Notice we didn't need to add module syntax like `export {}` because TS already understands it's a module since we added `"type": "module"` in `package.json` file.

- Time to start the project!

  ```bash
  npm start
  ```

  👍🏼 `vite` offers built-in support for TypeScript!

  🔎 You can check the new `index.ts` request in the `network` tab and preview the transpiled content

- 💥 What if we introduce a type error? Like this one:

  _src/index.ts_

  ```diff
  - const numberB: number = 3;
  + const numberB: string = 3;
  ```

  🔎 Check the server logs, `vite` won't complain! Only `VSCode` warns us.

  ⚡ As we already know, `vite` transpiles TS code via `esbuild` by just removing all type annotations, the same way as `babel` does, so we won't have type checking while transpiling. We won't see TS errors in our dev-server terminal.

  In order get compilation errors we may run `tsc` by ourselves. It would require to install some development tools like `npm-run-all` and extra scripts setup in `package.json`.

  👍🏼 Why don't we take advantage of the [plugin ecosystem](https://github.com/vitejs/awesome-vite#plugins) for `vite`? We'll use a plugin called `vite-plugin-checker`.

- Let's first **stop the server** and install the plugin then:

  ```bash
  npm install vite-plugin-checker --save-dev
  ```

- Now, let's create a `vite` config file at the root folder for the first time. It must be called `vite.config.ts`:

  _vite.config.ts_

  ```ts
  import { defineConfig } from "vite";
  import checker from "vite-plugin-checker";

  export default defineConfig({
    plugins: [checker({ typescript: true })],
  });
  ```

  👍🏼 This plugin **runs background checks** like TS type checking or ESLint parsing in a **concurrent** worker thread, thus, not slowing down `vite` state-of-the-art performance and speeding up the whole process.

- Let's start the app with:

  ```bash
  npm start
  ```

  🔎 Now you can check how we obtain compilation errors in console:

  ```text
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

  🔎 If we take a look at the browser at [http://localhost:5173](http://localhost:5173) you'll notice the overlay with the compilation error too.

- Production flow relies on `rollup` where TS is also supported out-of-the-box and type check is performed to proceed with a green build. Leave the error in the code and try to build for production:

  ```bash
  npm run build
  ```

  🔎 Check how we also get error feedback in the console.

- We can see thank to `vite-plugin-checker` it is preventing us from generating the production bundle, with errors.

  ```text
  vite v7.0.4 building for production...
  ✓ 2 modules transformed.
  src/index.ts:2:7 - error TS2322: Type 'number' is not assignable to type 'string'.

  2 const numberB: string = 3;
          ~~~~~~~


  Found 1 error in src/index.ts:2
  ```

- So, we can only fix the issue to continue:

  _src/index.ts_

  ```diff
    const numberA: number = 2;
  - const numberB: string = 3;
  + const numberB: number = 3;
  ```

  🔎 Run now a production build and check how it goes smoothly.
