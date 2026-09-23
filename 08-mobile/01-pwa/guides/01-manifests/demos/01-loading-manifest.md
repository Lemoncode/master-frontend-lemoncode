# Loading Manifest

In this demo we are going to load an application via web, with an install `manifest.json`

```bash
nvm use 26
```

```bash
npm init -y
```

```bash
npm i serve -D
```

Update `package.json`

```diff
# ....
  "scripts": {
+   "serve": "serve solution -p 8090",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
# ....
```

Copy from `resources/icon` to `solution/icon`

## Create `index.html`

Create `solution/index.html`

```html
<!doctype html>
<html lang="es">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />

    <base href="./" target="_blank" />
    <link rel="apple-touch-icon" sizes="76x76" href="apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
    <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="manifest" href="manifest.json" />

    <title>AWP</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Amazing App</h1>
    <!-- <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) =>
              console.log("Service Worker registered successfully:", reg.scope),
            )
            .catch((err) =>
              console.error("Service Worker registration failed:", err),
            );
        });
      }
    </script> -->
  </body>
</html>
```

## Create `solution/sw.js`

Create an empty file just for registration.

## Create `solution/manifest.json`

```json
{
  "id": "/",
  "lang": "en",
  "dir": "ltr",
  "name": "Amazing App",
  "description": "Esta app hace cosas asombrosas",
  "short_name": "Amazing",
  "icons": [{
    "src": "icon/icon370.gif",
    "sizes": "370x370",
    "type": "image/gif"
  },{
    "src": "icon/lowres.png",
    "sizes": "280x280"
  }, {
    "src": "icon/icon512.jpg",
    "sizes": "512x512"
  }],
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "theme_color": "aliceblue",
  "background_color": "red"
}
```

Now we are ready to run the solution

```bash
npm run serve
```

If we open the developer tools we will find out the following errors:

```
Richer PWA Install UI won’t be available on desktop. Please add at least one screenshot with the form_factor set to wide.
Richer PWA Install UI won’t be available on mobile. Please add at least one screenshot for which form_factor is not set or set to a value other than wide.
```

To remove this errors we need to include `screenshots` section on manifest:

```json
{
  "name": "Amazing App",
  "short_name": "Amazing",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    {
      "src": "icon/icon192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon/icon512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  /* diff */
  "screenshots": [
    {
      "src": "screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Desktop view of Amazing App"
    },
    {
      "src": "screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Mobile view of Amazing App"
    }
  ]
  /* diff */
}
```