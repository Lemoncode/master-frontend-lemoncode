# Typescript

It's time to test how parcel behaves when using Typescript.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _05-images_. Just copy the project and execute _npm install_

```bash
npm install
```

- Let's install typescript locally:

```bash
npm install typescript --save-dev
```

- Let's add a _tsconfig_ configuration file:

_tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src/"
  }
}
```

- Let's rename our _index.js_ file to _index.ts_.

- Let's update _index.html_ file:

```diff
- <head>
-    <link
-      rel="stylesheet"
-      href="../node_modules/bootstrap/dist/css/bootstrap.css"
-    />
-  </head>
  <body>
-    <div id="imgContainer"></div>
-    <div class="red-background">RedBackground stuff</div>
-    <div class="card" style="width: 18rem">
-      <img src="./content/logo_2.png" class="card-img-top" alt="logo lemoncode" />
-      <div class="card-body">
-        <h5 class="card-title">Card title</h5>
-        <p class="card-text">
-          Some quick example text to build on the card title and make up the
-          bulk of the card's content.
-        </p>
-        <a href="#" class="btn btn-primary">Go somewhere</a>
-      </div>
-    </div>
-    <script type="module" src="./index.js"></script>
+    <script type="module" src="./index.ts"></script>
  </body>
</html>
```

- Let's replace our _index.ts_ with some test code.

_index.ts_

```diff
- import logoImg from 'url:./content/logo_1.png';

- const user = "John Doe";

- console.log(`Hello ${user}!`);

- const img = document.createElement('img');
- img.src = logoImg;

- document.getElementById('imgContainer').appendChild(img);

+ const numberA: number = 2;
+ const numberB: number = 3;

+ console.log(numberA + numberB);
```

> It would be a good idea to add a
> proper _tsconfig_ file

- And start the project:

```bash
npm start
```

- Now if we introduce a type error, parcel
  won't complain, we have to do _tsc_ by our selves,let's got for that:

_./src/index.ts_

```diff
- const numberA: number = 2;
+ const numberA: string = 2;
```

- Let's install _npm-run-all_ a package that will let us execute to this tasks
  in parallel from the script command section in our package.json.

```bash
npm install npm-run-all --save-dev
```

- Now let's ellaborate a bit more our package section, we will create a new
  command just to transpile our babel:

```diff
  "scripts": {
-   "start:": "rimraf dist && parcel --open",
+   "start": "run-p -l type-check:watch start:dev",
+   "start:dev": "rimraf dist && parcel --open",
    "build:prod": "rimraf dist && parcel build ./src/index.html",
+    "type-check": "tsc --noEmit",
+    "type-check:watch": "npm run type-check -- --watch",
  },
```

- Now if we start the project, the error
will be spotted.

```bash
npm start
```
