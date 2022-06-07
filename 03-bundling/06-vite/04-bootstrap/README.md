# Import bootstrap

In this demo we will install and configure parcel to import the well known [Bootstrap](https://getbootstrap.com/) CSS library.

We start from sample _03 SASS_.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (min >=12.2.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from _03-sass_. Just copy the project and execute _npm install_

```cmd
npm install
```

- Let's install bootstrap

```bash
npm install bootstrap --save
```

- Let's update our `index.js` to include a link to bootstrap CSS file:

_./index.html_

```diff
+ import "bootstrap/dist/css/bootstrap.css";
  import "./mystyles.scss";

  const user = "John Doe";
```

- Let's modify our _index.html_ and include some specific bootstrap component.

```diff
...
  <body>
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

- Let's start the project and verify Bootstrap styles work properly.

```
npm start
```

We could also import bootstrap from `index.html`. Let's remove the `import` sentence from `index.js`:

_./src/index.js_

```diff
- import "bootstrap/dist/css/bootstrap.css";
  import "./mystyles.scss";

  const user = "John Doe";
```

And link the CSS in `index.html`:

_./index.html_

```diff
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+   <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
    <title>Vite App</title>
  </head>
```

Check in the browser everything keeps unchanged.

- Let's do a production build now:

```bash
npm run build
```

Notice in `dist/assets/index.<hash>.css` Bootstrap's CSS is included.
