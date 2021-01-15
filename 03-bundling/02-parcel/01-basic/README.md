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
npm install parcel-bundler --save-dev
```

- Let's create a basic [/src/index.js](./src/index.js) file (es5 friendly):

_[/src/index.js](./src/index.js)_

```javascript
console.log("hello parcel!");
```

- Let's create a dummy [/src/index.html](./src/index.html) file

_[/src/index.html](./src/index.html)_

```html
<html>
  <body>
    <h1>Check the console log</h1>
    <script src="./index.js"></script>
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

- When you run the build command you get a minified a version plus _NODE_ENV=production_

```bash
npm run build:prod
```

- There's a gotcha old files do not get erased, let's add the **rim-raf** plugin to ensure we are
  clearing up _[/dist](./dist)_ folder before we generate the bundle.

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
    "build": "rimraf dist && parcel ./src/index.html",
-   "build:prod": "rimraf dist && parcel build ./src/index.html"
+   "build:prod": "rimraf dist && parcel build ./src/index.html",
+   "start": "rimraf dist && parcel ./src/index.html --open"
  },
```

Now we launch the command `npm start` in the console and verify the results.
