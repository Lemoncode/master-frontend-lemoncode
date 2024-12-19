# 01 Entrypoints

In this example we are going to create a simple mocked library as an example, and then we'll provide support for Browser (bundlers) and Node.js consumers entrypoints. This way, our lib should be properly linked from different projects using different module formats, like ESM, CJS and UMD. We will mainly configure the `package.json` metadata for that purpose. We will start from scratch, step by step.

Summarized steps:

- Create a basic library exposed in different module flavours: ESM, CJS and UMD.
- Add three playgrounds consuming each format.

# Steps to build it

## Mocked library

Let's start by creating a basic mock library in 3 different module flavours: ESM, CJS and UMD.

Add manually the `package.json` like below. Another common approach is to use `npm init -y`.

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
  if (typeof exports === "object" && typeof module !== "undefined") {
    // CJS
    console.log("[UMD] Serving in format CommonJS");
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    console.log("[UMD] Serving in format AMD");
    define("my-lib", factory);
  } else {
    // Global VAR
    console.log("[UMD] Serving in format global VAR");
    global.MyLib = factory();
  }
})(globalThis || self || global || this, function factory() {
  function myFn() {
    console.log("I am UMD");
  }

  return {
    myFn,
  };
});
```

> ⚡ We are using the UMD format to support AMD (not covered on these demos), CommonJS, and global variable. In short, UMD (Universal Module Definition) can be considered a metaformat instead of a format, cause it's main purpose is not to provide another module system but to adapt itself to the module system from the consumer, at runtime! It is like a switch, and depending of the format of its consumer, it will provide its content in the right way.

## Playgrounds

Now, we will create three playgrounds consuming each format. Let's start with the CJS format:

### CommonJS

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

To run it in a web server, let's add a script in our package.json:

```diff
{
  "name": "cjs-playground",
+ "scripts": {
+   "start:webapp": "npx serve ."
+ },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}

```

Now run it:

```bash
npm run start:webapp
```

✅ **CHECKPOINT**: Open the browser console to see the output.

> 💥 It doesn't work! NOTE: CJS format is not supported natively in browsers, we need to use a bundler like Webpack, Vite, Rollup, etc.

Although not compatible with browsers, we could consume CJS format in a Node.js process, so let's add a `index.js` file:

_./playgrounds/cjs/index.js_

```javascript
const { myFn } = require("my-lib");

myFn();
```

Add a new script in the `package.json` to start it up:

_./playgrounds/cjs/package.json_

```diff
{
  "name": "cjs-playground",
  "scripts": {
    "start:webapp": "npx serve ."
+   "start:nodeapp": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}

```

Let's run it:

```bash
npm run start:nodeapp
```

✅ **CHECKPOINT**: Now it works!

### UMD

Due to the issue seen with CJS, we would recommend to use UMD format for the library to be consumed in a browser without a bundler:

_./playgrounds/umd/package.json_

```json
{
  "name": "umd-playground",
  "scripts": {
    "start:webapp": "npx serve .",
    "start:nodeapp": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install the dependencies:

```bash
npm install
```

Let's add an `index.html` file like before:

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

Run the web application:

```bash
npm run start:webapp
```

✅ **CHECKPOINT**: Open the browser console to see the output. It works in browser!

> ⚡ UMD runtime detected that its consumer was neither AMD nor CJS so it served the content through global variable.

Even, we can use the UMD format in a Node.js process:

_./playgrounds/umd/index.js_

```javascript
const { myFn } = require("my-lib/dist/index.umd.js");

myFn();
```

Let's run it:

```bash
npm start:nodeapp
```

✅ **CHECKPOINT**: It works also in Node!

> ⚡ Note: The UMD format it's using the CJS export behind the scenes.

### ES

Finally, we can use the ES format:

_./playgrounds/es/package.json_

```json
{
  "name": "es-playground",
  "scripts": {
    "start:webapp": "npx serve .",
    "start:nodeapp": "node index.js"
  },
  "dependencies": {
    "my-lib": "file:../../my-lib"
  }
}
```

Let's install the dependencies:

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

> ⚡ Note: ES format is supported natively in browsers ([the compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#javascript.statements.import)).
>
> ⚡ We need to use the `type="module"` attribute to tell the browser that we are using ES modules.
>
> ⚡ We cannot use the module resolution strategy (as in Node.js) natively, we need to use the relative path to the file.

Run in a web server:

```bash
npm run start:webapp
```

✅ **CHECKPOINT**: Open the browser console to see the output. It works!

Even, we can use the ES format in a Node.js process:

_./playgrounds/es/index.js_

```javascript
import { myFn } from "my-lib";

myFn();
```

Let's run it:

```bash
npm run start:nodeapp
```

✅ **CHECKPOINT**: See the console log: 💥 "Cannot use import statement outside a module".

💥 Why is it failing? Because to use the ES format in Node.js we need to change the extension to `.mjs` or update the `package.json` like:

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
npm start:nodeapp
```

✅ **CHECKPOINT**: See the console log again, now it doesn't throw any error. HOWEVER 💥 "I am CommonJS" ... this is not what we expected!.

> ⚡ Note: Why is it using the CommonJs format? Because Node.js is using the `main` field from the `package.json` to resolve the entry point of the library.

> ⚠ The `module` entrypoint that we had defined is only used by bundlers like Webpack, Vite, Rollup, etc.

### Bundler playground

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

Let's install our lib with:

```bash
npm install
```

and then also install `vite` bunler with:

```bash
npm install vite --save-dev
```

Now let's add a `index.html` file:

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

And copy paste the `index.js` file from ES playground:

_./playgrounds/bundler/index.js_

```javascript
import { myFn } from "my-lib";

myFn();
```

Let's run it:

```bash
npm start
```

✅ **CHECKPOINT**: Open the browser console to see the output. It works!

## Improved library with exports notation

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
> ⚠ Rename files to `./dist/index.cjs.cjs` and `./dist/index.umd.cjs`
>
> If we does not declare the lib as a `type: module` we need to use the `mjs` extension. Try to run the playground without it.
>
> We could keep the `main` and `module` fields to support older Node.js versions.

Let's run the ES playground again:

```bash
cd ./playgrounds/es
npm run start:webapp
npm run start:nodeapp

```

Let's run the Bundler playground again:

```bash
cd ./playgrounds/bundler
npm start
```

Let's run the CJS playground again:

```bash
cd ./playgrounds/cjs
npm run start:nodeapp

```

> ⚡ Remember we cannot use CJS in the browser.

Let's update the UMD playground and run it again:

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
npm run start:webapp
npm run start:nodeapp
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
