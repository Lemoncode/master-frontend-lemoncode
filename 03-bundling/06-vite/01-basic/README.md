# Basic sample

Let's start with a very basic sample, just add an html plus a simple console log. This is what you can find in the getting started tutorial.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some questions about the project. Once you have successfully answered, a **[package.json](./package.json)** file we will generated.

```bash
npm init -y
```

> Ensure your parent folder does not include any space or uppercase (if that's the case you can just run `npm init` and change the project name).

- Let's install parcel

```bash
npm install vite --save-dev
```

- Let's create a basic [index.js](./src/index.js) file:

_[/src/index.js](./src/index.js)_

```js
const user = "John Doe";

console.log(`Hello ${user}!`);
```

- Let's create a dummy [/index.html](./index.html) file **at the root folder**:

_[/index.html](./index.html)_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello Vite</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
```

- Now let's add the following command to our [package.json](./package.json)

_[package.json](./package.json)_

```diff
  "scripts": {
+   "build": "vite build",
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Let's run the build

```bash
npm run build
```

> A new folder, _[/dist](./dist)_, is generated. It contains the bundled solution:

```
dist
├── assets
│   └── index.2e9bd398.js
└── index.html
```

If we inspect `index.2e9bd398.js` we can notice the file is already production ready because:

- It's already hashed.
- File is minified.

This bundle is created using Rollup under the hood.

If we inspect `index.html` we can notice our JavaScript bundled is pointing to the right location in assets folder.

Let's test our production bundle with adding this to `package.json`:

```diff
  "build": "vite build",
+ "preview": "vite preview"
```

And then execute in the console:

```bash
npm run preview
```

We can access to [http://localhost:4173](http://localhost:4173) and check the console to see our `console.log` call.

Vite uses the concept of "root directory" from other web servers like Apache or Nginx where `index.html` is at root directory. This could be changed via some options in config file.

One pros of using Vite is that it cleans `dist` folder automatically on every production build so we don't need to install tools like `rimraf` or `prebuild` hooks.

We can start a development server by adding next command to our package.json file:

```diff
+ "start": "vite",
  "build": "vite build",
  "preview": "vite preview"
```

And the running in the console:

```bash
npm start
```

We can access to the dev server at [http://localhost:3000](http://localhost:3000) (Notice it uses a different port than the production server to avoid conflicts).

By default the server is started only at `localhost`. We could expose our server to the local network by using the `--host`:

```diff
- "start": "vite",
+ "start": "vite --host",
  "build": "vite build",
```

Then stop our local server and start it again with:

```bash
npm start
```

If we inspect the broser's dev tools we can check our `console.log` call is there. Let's change the `index.js` content:

```diff
  console.log(`Hello ${user}!`);
+ console.log("This app is using Vite");
```

After saving you can check in the browser our second `console.log` calls. Vite's dev-server automatically reloads the app on change.
