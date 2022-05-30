# Basic sample

Let's start with a very basic sample, just add an html plus a simple console log. This is what you can find in the getting started tutorial.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Navigate to the folder where you want to create the project folder (don't create it yet! Vite will create it for us).

- Execute `vite create vite@latest my-app`:

```bash
vite create vite@latest hello-vite
```

An interactive terminal interface will be presented to select a framework / template. Choose `vanilla` by pressing enter, then `vanilla` again.

The folder `hello-vite` will be created with next structure:

```
hello-vite
├── favicon.svg
├── index.html
├── main.js
├── package.json
└── style.css
```

Note all files are at the root folder. This is because Vite's dev server uses the concept of "root directory" from other web servers like Apache or Nginx where `index.html` is at root directory. This can be changed via config file.

In `package.json` you can see we have `vite` dependency and some scripts:

- `dev` is used to start development server
- `build` is used to create the production bundle
- `preview` is used to start production server that uses the bundle created by `build` script

It also created `main.js` as the entrypoint of the project. This `main.js` already uses ES modules syntax and is already referenced in `index.html`:

```html
<script type="module" src="/main.js"></script>
```

Notice the script path in `index.html` starts with absolute value `/`. Let's change the contents for `index.html`:

```diff
- import './style.css'
-
- document.querySelector('#app').innerHTML = `
-   <h1>Hello Vite!</h1>
-   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
- `
+ const user = "John Doe";
+
+ console.log(`Hello ${user}!`);
```

- Let's install the dependencies with:

```bash
npm install
```

- And let's run the build to create our first production build:

```bash
npm run build
```

A new folder, _[/dist](./dist)_, is generated. It contains the production-ready bundled solution:

```
dist
├── assets
│   ├── favicon.17e50649.svg
│   └── index.2e9bd398.js
└── index.html
```

Notice `index.html` is at the root folder and all static files are in `assets` folder. If we take a look at `index.html` you will see all files are correctly referenced in `<head>`:

```html
<meta charset="UTF-8" />
<link rel="icon" type="image/svg+xml" href="/assets/favicon.17e50649.svg" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Vite App</title>
<script type="module" crossorigin src="/assets/index.2e9bd398.js"></script>
```

All assets are automatically hashed and our `main.js` is automatically converted into `index.js`. This bundle is created using Rollup.

One pros of using Vite is that it cleans `dist` folder automatically on every production build so we don't need to install tools like `rimraf` or `prebuild` hooks.

- Let's start our _production server_ that uses our new generated bundle:

```bash
npm run preview
```

We can access to [http://localhost:4173](http://localhost:4173) and check the console to see our `console.log` call.
