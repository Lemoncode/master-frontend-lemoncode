# Hello Svelte

Arrancamos desde el ejemplo **00-boilerplate**

Vamos a instalar y configurar **Svelte** para trabajar con **Webpack**. Necesitaremos la librería de **svelte** y el loader **svelte-loader** para **Webpack**:

```bash
npm install svelte svelte-loader --save-dev
```

Tenemos que configurar **Webpack** para añadir una nueva regla con el loader de **Svelte**. Para esto, modificamos nuestro fichero de configuración:

_webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  context: path.resolve(__dirname, "./src"),
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
  },
+  module: {
+    rules: [
+      {
+        test: /\.svelte$/,
+        use: {
+          loader: "svelte-loader",
+          options: {
+            emitCss: false,
+            hotReload: true,
+          },
+        },
+      },
+    ],
+  },
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

Vamos a crear un nuevo fichero **app.svelte** para crear el componente principal _App_ a partir del cual crearemos nuestra aplicación:

_app.svelte_

```js
<script>
	let name = "Svelte";
</script>

<style>
	h1 {
	  color: blue;
	}
</style>

<h1>Hello {name}!</h1>
```

Y por último, modificamos nuestro entrypoint _index.js_ para cargar _Svelte_ con nuestro componente _App_ en el _body_ de nuestro documento:

_index.js_

```js
import App from "./app.svelte";

const app = new App({ target: document.body });

export default app;
```

¡Listo! Ahora podemos correr nuestro primer ejemplo de _Svelte_ con el comando `npm start`.
