# Boilerplate

Vamos a arrancar un proyecto con webpack para crear el boilerplate sobre el que comenzaremos a trabajar con **Svelte**.

Primero abrimos con _VS Code_ una nueva carpeta vacía donde crearemos el proyecto. Ejecutamos el siguiente comando de npm:

```bash
npm init -y
```

A continuación instalamos los paquetes de _webpack_ y _webpack-cli_:

```bash
npm install webpack webpack-cli --save-dev
```

Como sabemos, necesitaremos _webpack-dev-server_ para ejecutar nuestra aplicación en desarrollo:

```bash
npm install webpack-dev-server --save-dev
```

Y _html-webpack-plugin_:

```bash
npm install html-webpack-plugin --save-dev
```

Crearemos nuestro fichero _index.html_:

_index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lemoncode Svelte - Boilerplate</title>
  </head>
  <body></body>
</html>
```

Y un fichero _index.js_ como punto de entrada, en el que dejaremos sólo un _console.log_ para verificar que tenemos funcionando nuestro playground:

_index.js_

```js
console.log("Hello boilerplate!");
```

A continuación prepararemos la primera configuración básica de _webpack_ creando un nuevo fichero _webpack.config.js_ con el siguiente contenido:

_webpack.config.js_

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
  devServer: {
    stats: "errors-only",
  },
  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: "blocking",
    }),
  ],
};
```

Por último vamos a añadir dos scripts (_build_ y _start_) a _package.json_:

_package.json_

```diff
{
  "name": "svelte-getting-started",
  "version": "1.0.0",
  "description": "Getting started with Svelte",
  "main": "index.js",
  "scripts": {
+    "build": "webpack --mode production",
+    "start": "webpack serve --mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Victor Borrego Perez",
  "license": "ISC",
  "devDependencies": {
    "html-webpack-plugin": "^5.3.1",
    "webpack": "^5.26.2",
    "webpack-cli": "^4.5.0",
    "webpack-dev-server": "^3.11.2"
  }
}
```

¡Listo! podremos ver que todo está funcionando correctamente ejecutando el proyecto con _npm start_. Debemos ver en la consola del navegador el mensaje _Hello boilerplate!_.
