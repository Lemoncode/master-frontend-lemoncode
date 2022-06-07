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

- Now if we introduce a type error, Vite won't complain. Vite uses `esbuild` under the hood and `esbuild` just removes type annotation like babel so we won't have compilation errors. We have to do _tsc_ by our selves,let's got for that:

_./src/index.ts_

```diff
- const numberA: number = 2;
+ const numberA: string = 2;
```

- Let's install _npm-run-all_ a package that will let us execute to this tasks in parallel from the script command section in our package.json.

```bash
npm install npm-run-all --save-dev
```

- Now let's ellaborate a bit more our package section, we will create a new command just to transpile our babel:

```diff
  "scripts": {
-   "start": "vite",
+   "start": "run-p -l type-check:watch start:dev",
+   "start:dev": "vite",
+   "type-check": "tsc --noEmit",
+   "type-check:watch": "npm run type-check -- --noEmit --watch",
    "build": "vite build",
    "preview": "vite preview"
  },
```

- Now if we start the project, the error will be spotted.

```bash
npm start
```

- Let's do a production build:

```bash
npm run build
```

Notice even if we introduce compilation error the bundling process succeeded. We can impose to not generate the project if TSC fails. Let's update `package.json`:

_./package.json_

```diff
  "scripts": {
    "start": "vite",
    "start": "run-p -l type-check:watch start:dev",
    "start:dev": "vite",
    "type-check": "tsc --noEmit",
    "type-check:watch": "npm run type-check -- --noEmit --watch",
+   "prebuild": "npm run type-check",
    "build": "vite build",
    "preview": "vite preview"
  },
```

- Let's fix the compilation error:

_./src/index.ts_

```diff
  const numberA: number = 2;
- const numberB: string = 3;
+ const numberB: number = 3;
```

- If we do a production build now it runs smoothly.
