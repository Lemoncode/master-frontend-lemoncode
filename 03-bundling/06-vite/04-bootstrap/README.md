# Import bootstrap

In this demo, we will install and configure vite to import the well known [Bootstrap](https://getbootstrap.com/) CSS library.

📌 We start from sample `03-sass`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (14.18+ / 16+) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `03-sass`. Just copy the project and install:

  ```cmd
  npm install
  ```

- Let's install bootstrap dependency:

  ```bash
  npm install bootstrap --save
  ```

- And now update our `index.js` to include a link to bootstrap CSS file:

  _src/index.js_

  ```diff
  + import "bootstrap/dist/css/bootstrap.css";
    import "./mystyles.scss";

    const user = "John Doe";
  ```

- Let's modify our `index.html` and include some specific `bootstrap` component:

  _index.html_

  ```diff
  ...
  + <body class="m-3">
      <h1>Check the console log</h1>
  +   <div class="card" style="width: 18rem">
  +     <div class="card-body">
  +       <h5 class="card-title">Card title</h5>
  +       <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  +       <a href="#" class="btn btn-primary">Go somewhere</a>
  +     </div>
  +   </div>
      <div class="red-background">RedBackground stuff</div>
      <script type="module" src="/src/index.js"></script>
    </body>
  ```

- Let's start the project then:

  ```bash
  npm start
  ```

  🔎 Verify `bootstrap` styles work properly and you see the new component.

  > Important: we have not added a depencency (in vite context) yet, even if the css is comming from `node_modules` and it won't change frequently. CSS files are not pre-bundled but treated as source modules, unless we adjust under-the-hood `esbuild` options and add a plugin for bundling css. See [this issue](https://github.com/vitejs/vite/issues/7719).

- ⚙ As an alternative, we could also import bootstrap from `index.html`. Let's first remove the `import` clause from `index.js`:

  _src/index.js_

  ```diff
  - import "bootstrap/dist/css/bootstrap.css";
    import "./mystyles.scss";

    const user = "John Doe";
  ```

  And link the library in the `index.html` entrypoint:

  _index.html_

  ```diff
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  +   <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
      <title>Vite App</title>
    </head>
  ```

  🔎 Check in the browser everything keeps unchanged.

- Let's do a production build now:

  ```bash
  npm run build
  ```

  Notice in `dist/assets/index.<hash>.css` Bootstrap's CSS is included.
