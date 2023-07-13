# 01 Entrypoints

In this example we are going to add support for Browser and Node.js process using multiple formats (ESM, CJS, UMD) using the `package.json` metadata.

We will start from scratch.

Summary steps:

- Create a basic library in the three formats (ESM, CJS, UMD).
- Add three playgrounds consuming each format.

# Steps to build it

Let's start by creating the basic library in the three formats (ESM, CJS, UMD).

Add manually the `package.json` (another common approach is to use `npm init -y`):

_./my-lib/package.json_

```json
{
  "name": "my-lib",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js"
}
```

Add the CJS format:

_./my-lib/dist/index.cjs.js_

```javascript
exports.myFn = () => {
  console.log("I am CommonJS");
};
```

Add the ES format:

_./my-lib/dist/index.es.js_

```javascript
export const myFn = () => {
  console.log("I am ES Module");
};
```

Add the UMD format:

_./my-lib/dist/index.umd.js_

```javascript
(function (global, factory) {
  typeof exports == "object" && typeof module < "u"
    ? factory(exports)
    : typeof define == "function" && define.amd
    ? define(["exports"], factory)
    : ((global = typeof globalThis < "u" ? globalThis : global || self),
      factory((global.MyLib = {})));
})(this, function (exports) {
  function myFn() {
    console.log("I am UMD");
  }
  exports.myFn = myFn;
});
```

> Note: We are using the UMD format to support AMD (not covered on these demos), CommonJS, and global variable.

Now, we can create three playgrounds consuming each format, let's start with the CJS format:

_./playgrounds/cjs/package.json_

```json
{
  "name": "cjs-playground",
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install the dependency:

```bash
npm install

```

If we want to use this format in a browser, let's add a `index.html` file:

_./playgrounds/cjs/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>CJS Playground</title>
  </head>
  <body>
    <script src="./node_modules/my-lib/dist/index.cjs.js"></script>
    <script>
      const { myFn } = require("my-lib");
      myFn();
    </script>
  </body>
</html>
```

> Note: CJS format is not supported natively in browsers, we need to use a bundler like Webpack, Vite, Rollup, etc.

Run in a web server:

```bash
npx lite-server
```

> Open the browser console to see the output.

If we want to use this format in a Node.js process, let's add a `index.js` file:

_./playgrounds/cjs/index.js_

```javascript
const { myFn } = require("my-lib");

myFn();
```

Add a `start` script to the `package.json`:

_./playgrounds/cjs/package.json_

```diff
{
  "name": "cjs-playground",
+ "scripts": {
+   "start": "node index.js"
+ },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}

```

Let's run it:

```bash
npm start
```

That's why we will to use the UMD format to use the library in a browser without a bundler:

_./playgrounds/umd/package.json_

```json
{
  "name": "umd-playground",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install the dependency:

```bash
npm install

```

Let's add a `index.html` file:

_./playgrounds/umd/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>UMD Playground</title>
  </head>
  <body>
    <script src="./node_modules/my-lib/dist/index.umd.js"></script>
    <script>
      MyLib.myFn();
    </script>
  </body>
</html>
```

Run in a web server:

```bash
npx lite-server
```

> Open the browser console to see the output.

Even, we can use the UMD format in a Node.js process:

_./playgrounds/umd/index.js_

```javascript
const { myFn } = require("my-lib/dist/index.umd.js");

myFn();
```

Let's run it:

```bash
npm start
```

> Note: The UMD format it's using the CJS export behind the scenes.

Finally, we can use the ES format:

_./playgrounds/es/package.json_

```json
{
  "name": "es-playground",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install the dependency:

```bash
npm install

```

Let's add a `index.html` file:

_./playgrounds/es/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>ES Playground</title>
  </head>
  <body>
    <script type="module">
      import { myFn } from "./node_modules/my-lib/dist/index.es.js";
      myFn();
    </script>
  </body>
</html>
```

> Note: ES format is supported natively in browsers ([the compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#javascript.statements.import)).
>
> We need to use the `type="module"` attribute to tell the browser that we are using ES modules.
>
> We cannot use the module resolution strategy (as in Node.js) natively, we need to use the relative path to the file.

Run in a web server:

```bash
npx lite-server
```

> Open the browser console to see the output.

Even, we can use the ES format in a Node.js process:

_./playgrounds/es/index.js_

```javascript
import { myFn } from "my-lib";

myFn();
```

Let's run it:

```bash
npm start
```

Why is it failing? Because to use the ES format in Node.js we need to change the extension to `.mjs` or update the `package.json` like:

_./playgrounds/es/package.json_

```diff
{
  "name": "es-playground",
+ "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}

```

Let's run it again:

```bash
npm start
```

Wow, why is it using the CommonJs format? Because Node.js is using the `main` field from the `package.json` to resolve the entry point of the library.

The `module` entrypoint that we had defined is only used by bundlers like Webpack, Vite, Rollup, etc.

Let's add another playground to use the `module` entrypoint:

_./playgrounds/bundler/package.json_

```json
{
  "name": "bundler-playground",
  "scripts": {
    "start": "vite --open"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install `vite`:

```bash
npm install vite --save-dev

```

Let's add a `index.html` file:

_./playgrounds/bundler/index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Bundler Playground</title>
  </head>
  <body>
    <script type="module" src="index.js"></script>
  </body>
</html>
```

Let's add a `index.js` file:

_./playgrounds/bundler/index.js_

```javascript
import { myFn } from "my-lib";

myFn();
```

Let's run it:

```bash
npm start
```

> Open the browser console to see the output.

If we want to use ES modules in Node.js we need to use the [`exports` field](https://nodejs.org/dist/latest-v18.x/docs/api/all.html#all_packages_package-entry-points) in the `package.json`:

_./my-lib/package.json_

```diff
{
  "name": "my-lib",
  "version": "1.0.0",
- "main": "dist/index.cjs.js",
- "module": "dist/index.es.js"
+ "type": "module",
+ "exports": {
+   ".": {
+     "import": "./dist/index.es.js",
+     "require": "./dist/index.cjs.cjs"
+   },
+   "./umd": "./dist/index.umd.cjs"
+ }
}

```

> Notes:
>
> `exports`: Added in v12.7.0
>
> Rename files to `./dist/index.cjs.cjs` and `./dist/index.umd.cjs`
>
> If we does not declare the lib as a `type: module` we need to use the `mjs` extension. Try to run the playground without it.
>
> We could keep the `main` and `module` fields to support older Node.js versions.

Let's run the ES playground again:

```bash
cd ./playgrounds/es
npm start
npx lite-server

```

Let's run the Bundler playground again:

```bash
cd ./playgrounds/bundler
npm start

```

Let's run the CJS playground again:

```bash
cd ./playgrounds/cjs
npm start

```

> Remember we cannot use CJS in the browser.

Let's update the UDM playground and run it again:

_./playgrounds/umd/index.js_

```diff
- const { myFn } = require("my-lib/dist/index.umd.js");
+ const { myFn } = require("my-lib/umd");

myFn();

```

_./playgrounds/umd/index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>UMD Playground</title>
  </head>
  <body>
-   <script src="./node_modules/my-lib/dist/index.umd.js"></script>
+   <script src="./node_modules/my-lib/dist/index.umd.cjs"></script>
    <script>
      MyLib.myFn();
    </script>
  </body>
</html>

```

```bash
cd ./playgrounds/umd
npm start
npx lite-server

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
