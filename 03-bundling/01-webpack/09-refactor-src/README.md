## Refactorizando SRC y punto de entrada

Hasta ahora hemos estado avanzando con pies y manos, pero es hora de pararnos y organizar nuestro proyecto, sino va a acabar convirtiéndose en algo difícil de gestionar. Si nos fijamos, estamos repitiendo la ruta _`./src/`_ en distintas partes de nuestro _`webpack.config.js`_ y esto nos puede traer problemas de mantenibilidad, es mejor indicarle un sólo sitio cual va a ser nuestro directorio de trabajo.

Por otro lado el fichero _`students.js`_ es el punto de entrada de nuestra aplicación, para seguir una aproximación más estándar vamos a renombrarlo a _`index.js`_, que es más conocido y utilizado habitualmente por nosotros, manos a la obra.

### Pasos

- Es hora de refactorizar nuestra solución para que sea más fácil de mantener.
- Le decimos a _webpack_ en que contexto estamos y refactorizamos.

_./webpack.config.js_

```diff
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
+ import path from "path";
+ import url from "url";

+ const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
+  context: path.resolve(__dirname, "./src"),
  entry: {
-    app: "./src/students.js",
+    app: "./students.js",
-    vendorStyles: ["./node_modules/bootstrap/dist/css/bootstrap.css"],
+	 vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"],
  },
.....
 plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
-     template: "./src/index.html", //Name of template in ./src
+	  template: "index.html",
      scriptLoading: "blocking", // Load the scripts correctly
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  .....
```

Fíjate que al establecer como directorio global de trabajo _./src_ para referenciar
_bootstrap_ tenemos que subir un nivel para llegar a **`node_modules`**

- Lo más normal es que nuestro punto de entrada se llame **`index.js`**, refactorizamos:

_./webpack.config.js_

```diff
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default {
  context: path.resolve(__dirname, "./src"),
  entry: {
- 	 app: "./students.js",
+    app: "./index.js",
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"],
  },
.....
```

- Y renombramos de **`students.js`** a **`index.js`**.
- Comprobemos que la aplicación sigue funcionando después de esta refactorización.

```bash
npm start
```

## Sumario

1. Agregamos un contexto y refactorizamos **`webpack.config.json`**.
2. Cambiamos el nombre del **`entry point`** de **`students.js`** a **`index.js`**.
3. Renombramos el archivo **`students.js`** a **`index.js`**.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
