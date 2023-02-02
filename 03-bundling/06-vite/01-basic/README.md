# Basic sample

Let's start with a very basic sample, just add an html plus a simple console log. This is what you can find in the getting started tutorial.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- Navigate to the folder where you are going to create the empty project.

- Execute `npm init`, you will be prompted to answer some questions about the project. Once you have successfully answered, a `package.json` file we will generated.

  ```bash
  npm init -y
  ```

  > Ensure your parent folder does not include any space or uppercase (if that's the case you can just run `npm init` and change the project name).

- Let's install vite

  ```bash
  npm install vite --save-dev
  ```

- Let's create a basic `index.js` file **whithin a `src` folder**:

  _src/index.js_

  ```js
  const user = "John Doe";

  console.log(`Hello ${user}!`);
  ```

- Let's create a dummy `index.html` file **at the root folder**:

  _index.html_

  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
    </head>

    <body>
      <h1>Check the console log</h1>
      <script type="module" src="/src/index.js"></script>
    </body>
  </html>
  ```

- Now let's add the following command to our `package.json`:

  _package.json_

  ```diff
    "scripts": {
  +   "build": "vite build",
  -   "test": "echo \"Error: no test specified\" && exit 1"
    },
  ```

- Let's run the build script

  ```bash
  npm run build
  ```

  > A new folder, `/dist` is generated. It contains the bundled solution:

  ```text
  dist
  ├── assets
  │   └── index.<hash>.js
  └── index.html
  ```

  If we inspect `assets/index.<hash>.js` we can notice the file is production ready because:

  - It's already hashed (cache-busting strategy to bypass the browser cache completely).
  - File is minified.

  This bundle has been created using `rollup` under the hood.

  If we inspect `index.html` we can notice our JavaScript bundled is pointing to the right location in `assets` folder.

  > ⚡ `vite build` command will bundle the solution for production

- Let's test our **production bundle** by adding this to `package.json`:

  _package.json_

  ```diff
    "build": "vite build",
  + "preview": "vite preview"
  ```

  And then run it in the console:

  ```bash
  npm run preview
  ```

  or alternatively, to customize server port:

  ```bash
  npm run preview -- --port 1234
  ```

  > ⚡ `vite preview` command locally previews your production build (whatever is in `dist` folder)

- Now it's time to access to [http://localhost:4173](http://localhost:4173) and check our **production app running** (check console as well).

  ⚙ `vite` uses the concept of "root directory" from other web servers like `apache` or `nginx` where `index.html` is at root directory. This could be changed via some options in config file.

  👍🏼 One advantage of using `vite` is that it cleans `dist` folder automatically on every production build so we don't need to install extra tools like `rimraf` or setting up `prebuild` hooks.

- Finally, let's setup the **development flow**. We can start a **development server** by adding the next command to our `package.json` file:

  ```diff
  + "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  ```

  And then:

  ```bash
  npm start
  ```

  or, for a custom port:

  ```bash
  npm start -- --port 1234
  ```

  > ⚡ `vite` command will start the dev server, you can also use `vite dev` or `vite serve` as alternative commands

- We can access to the dev server at [http://localhost:5173](http://localhost:5173). Notice that, to avoid conflicts, it uses a different port than the production server by default.

  ⚙ The server is started only at `localhost` by default. We could expose our server to the local network by using the `--host` modifier, either in the script:

  _package.json_

  ```diff
  - "start": "vite",
  + "start": "vite --host",
    "build": "vite build",
  ```

  or passed as parameter in the CLI:

  ```bash
  npm start -- --host
  ```

- With the dev server running, let's change the `index.js` content to make sure code updates and "hot reloading" is working:

  _src/index.js_

  ```diff
    console.log(`Hello ${user}!`);
  + console.log("This app is using Vite");
  ```

  Now **save changes** and check console again!

  > ⚡ `vite` dev-server automatically reloads the app on every saved change

- 🔍 Finally, pay attention to the browser `dev tools` to verify the concepts about `vite` we learned in the theory introduction:

  - Go to `Network` tab and refresh (F5) the app to populate the requests panel (if necessary).
  - Check how your browser is dowloading:
    - Module `index.js`, this is your app only module that containes the code.
    - Module `client` which is a `vite` runtime to add an overlay on top of your app to give you error feedback. This module imports another one called `env.mjs` for environment variables.
  - Reload the app again several times (F5). Now check that modules requests are returning `304 Not modified` so `vite` dev server is telling your browser to grab those modules from its cache. No data is transfered over the network apart from the request response. Cache is working for source code!
  - Now make a new modification in `index.js` to trigger a code update and reload:
    _src/index.js_

    ```diff
    - console.log("This app is using Vite");
    + console.log("New code update, it will to defeat cache !!!");
    ```

  - Check again the last request for `index.js`, now the URL changed, cache busting has been applied and a new hash in the form of a query param has been added to the URL with the purpose of defeating browser cache and force a download of this modified module. This hash is just a timestamp in `ms` with the date and time of the change (compilation timestamp).You can convert it back to `Date` to check it out by doing:

    ```js
    console.log(new Date(t));
    ```

    **Status for that request is now 200**.
