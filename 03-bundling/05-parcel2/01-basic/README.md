# Basic sample

Let's start with a very basic sample, just add an html plus a simple console log (E5). This is what you can find in the getting started tutorial.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min v8.9) if they are not already installed on your computer.

> Verify that you are running at least node v8.x.x and npm 5.x.x by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some questions about the project. Once you have successfully answered, a **[package.json](./package.json)** file we will generated.

```bash
npm init -y
```

> Ensure your parent folder does not include any space or uppercase (if that's the case you can just run `npm init` and change the project name).

- Let's install parcel

```bash
npm install parcel --save-dev
```

- Let's create a basic [/src/index.js](./src/index.js) file (es5 friendly):

_[/src/index.js](./src/index.js)_

```javascript
const user = "John Doe";

console.log(`Hello ${user}!`);
```

- Let's create a dummy [/src/index.html](./src/index.html) file

_[/src/index.html](./src/index.html)_

```html
<html>
  <body>
    <h1>Check the console log</h1>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

- Now let's add the following command to our [package.json](./package.json)

_[package.json](./package.json)_

```diff
  "scripts": {
+   "build": "parcel ./src/index.html"
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Let's run the build

```bash
npm run build
```

> A new folder, _[/dist](./dist)_, is generated. It contains the bundled solution.

- What if we need a production ready version? let's add the following command in our [package.json](./package.json):

_[package.json](./package.json)_

```diff
  "scripts": {
-   "build": "parcel ./src/index.html"
+   "build": "parcel ./src/index.html",
+   "build:prod": "parcel build ./src/index.html"
  },
```

```bash
npm run build:prod
```

What did we do wrong, if the command line we used is apparently OK?

```
  🚨 Build failed.
@parcel/namer-default: Target "main" declares an output file path of "index.js" which does not match the compiled bundle type "html".
  C:\Users\gatop\OneDrive\Escritorio\prueba\package.json:5:11
    4 |   "description": "",
  > 5 |   "main": "index.js",
```

Our _package.json_ contains a _main_ field, which gives us the entry point to our application. But _Parcel_ uses our application as a library and treats that _main_ field as an exit point. When we create the _bundle_, it gives us an error and shows us _Did you mean index.html?_. So the solution is to remove it and save us errors.

```diff
-  "main": "index.js",
  "scripts": {
    "build": "parcel ./src/index.html",
```

> [Parcel en producción](https://parceljs.org/features/production/)

- When we run the compile command.

```bash
npm run build:prod
```

But if we open the generated _javascript_ file we see that our code is in _es6_ and has not been transpiled.

```javascript
console.log("Hello John Doe!");
//# sourceMappingURL=index.ce3782bb.js.map
```

Why does this happen? We have to tell _Parcel_ to transpile the code for us. And how do we solve it? We go to _package.json_ and add another command line called browserslist.

> [Browserslist documentation for more settings](https://github.com/browserslist/browserslist)

_[./package.json](./package.json)_

```diff
{
  "name": "parcel",
  "version": "1.0.0",
  "description": "",
+    "browserslist": [
+    "defaults"
+  ],
  "main": "index.js",
  "scripts": {
    "build": "parcel ./src/index.html"
  },
```

- Let's re-generate the _bundle_ and see that our code has now been transpiled.

```bash
npm run build:prod
```

- We get a minified and transpiled version of our code.

```javascript
var user = "John Doe";
console.log("Hello ".concat(user, "!"));
//# sourceMappingURL=index.c90810f0.js.map
```

- There's a gotcha old files do not get erased, let's add the **rim-raf** plugin to ensure we are clearing up _[/dist](./dist)_ folder before we generate the bundle.

> [rim-raf documentation](https://www.npmjs.com/package/rimraf)

```bash
npm install rimraf --save-dev
```

- Let's add an extra step to the build process:

_[package.json](./package.json)_

```diff
  "scripts": {
-   "build": "parcel ./src/index.html",
+   "build": "rimraf dist && parcel ./src/index.html",
-   "build:prod": "parcel build ./src/index.html"
+   "build:prod": "rimraf dist && parcel build ./src/index.html"
  },
```

- We added our **script** to launch our application, **start**, inside [package.json](./package.json):

_[package.json](./package.json)_

```diff
  "scripts": {
+   "start": "rimraf dist && parcel ./src/index.html --open",
-   "build": "rimraf dist && parcel ./src/index.html",
+   "build": "rimraf dist && parcel build ./src/index.html"
-   "build:prod": "rimraf dist && parcel build ./src/index.html"
  },
```

- We can simplify our _scripts_ by adding _source_, where we enter the input to our application.

```diff
{
  "name": "parcel",
  "version": "1.0.0",
  "description": "",
  "browserslist": "> 0.5%, last 2 versions, not dead",
+ "source": "src/index.html",
  "scripts": {
-   "start": "rimraf dist && parcel ./src/index.html --open",
+   "start": "rimraf dist && parcel --open",
-   "build": "rimraf dist && parcel build ./src/index.html"
+   "build": "rimraf dist && parcel build"
  },
```

Now we launch the command `npm start` in the console and verify the results.
