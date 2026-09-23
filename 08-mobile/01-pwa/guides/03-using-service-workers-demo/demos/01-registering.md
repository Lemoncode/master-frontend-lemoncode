## Set up Environment

```bash
nvm use 26
```

```bash
npm init -y
```

```bash
npm i serve -D
```

## Set up solution

Create `solution/style.css`

```css
html,
body {
  margin: 0;
  padding: 0;
  font-size: 10px;
  font-family: sans-serif;
}

h1 {
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  height: 250px;
  background-image: url(lord-of-the-rings-logo.jpeg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

section {
  max-width: 640px;
  margin: 0 auto;
}

figure {
  width: 100%;
  margin: 0;
}

img {
  width: 100%;
  box-shadow: 2px 2px 1px black;
}

caption {
  display: block;
  margin: 0 auto 1rem;
  width: 70%;
  font-size: 1.2rem;
  line-height: 1.5;
  padding: 5px;
  background: #ccc;
  box-shadow: 1px 1px 1px black;
}
```

Create `solution/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width" />

    <title>Service worker demo</title>

    <link rel="stylesheet" href="style.css" />
  </head>

  <body>
    <h1>Lego Lord of the Rings gallery</h1>

    <section></section>
  </body>
</html>
```

Update `package.json`

```diff
....
  "scripts": {
+   "serve": "serve solution -p 8080",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
....
```

## Registering your worker

Create `solution/app.js`

```js
const isServiceWorkerAvailable = () => "serviceWorker" in navigator;

const registerInRootScope = async (swURL) => {
  let registration = null;
  try {
    registration = await navigator.serviceWorker.register(swURL, {
      scope: "/",
    });
  } catch (error) {
    console.error(`Registration failed with error: ${error}`);
  } finally {
    return registration;
  }
};

const logRegistrationState = (registration) => {
  if (registration?.installing) {
    console.log("SW installing");
  }

  if (registration?.waiting) {
    console.log("SW installed");
  }

  if (registration?.active) {
    console.log("SW active");
  }
};

const registerServiceWorker = async () => {
  if (isServiceWorkerAvailable()) {
    const registration = await registerInRootScope("/sw.js");
    logRegistrationState(registration);
  }
};

registerServiceWorker();
```

1. `isServiceWorkerAvailable` makes sure service workers are supported
2. We use [`ServiceWorkerContainer.register()`]() to register the service worker for this site. The service worker code is in a JavaScript file residing inside our app (note this is the file's URL relative to the origin, not the JS file that references it.)
3. The `scope` parameter is optional, and can be used to specify the subset of your content that you want the service worker to control. In this case, we have specified `'/'`, which means all content under the app's origin. If you leave it out, it will default to this value anyway, but we specified it here for illustration purposes.

This registers a service worker, which runs in a worker context, and therefore has no DOM access.

A single service worker can control many pages. Each time a page within your scope is loaded, the service worker is installed against that page and operates on it. Bear in mind therefore that you need to be careful with global variables in the service worker script: each page doesn't get its own unique worker.

Update `solution/index.html`

```diff
....
  <body>
    <h1>Lego Star Wars gallery</h1>

    <section></section>

+   <script type="module" src="app.js"></script>
  </body>
....
```

If we run our application we will see an error, a 404, since we do not create the service worker script, this is what we were expecting.

### Why is my service worker failing to register?

A service worker fails to register for one of the following reasons:

- You are not running your application in a secure context (over HTTPS).
- The path of the service worker file is incorrect. The path must be relative to the origin, not an app's root directory. In our example, the worker is at https://bncb2v.csb.app/sw.js, and the app's root is https://bncb2v.csb.app/, so the service worker must be specified as /sw.js.
- The path to your service worker points to a service worker of a different origin to your app.
- The service worker registration contains a scope option broader than permitted by the worker path. The default scope for a service worker is the directory where the worker is located. In other words, if the script sw.js is located in /js/sw.js, it can only control URLs in (or nested within) the /js/ path by default. The scope for a service worker can be broadened (or narrowed) with the Service-Worker-Allowed header.
- Browser-specific settings are enabled, such as blocking all cookies, private browsing mode, automatic cookie deletion on close, etc. See serviceWorker.register() browser compatibility for more information.
