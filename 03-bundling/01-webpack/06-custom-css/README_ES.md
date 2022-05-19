## Integrando CSS en nuestro proceso de bundling

Empecemos a trabajar con estilos.

En este ejemplo, crearemos un archivo CSS personalizado (contendrá una clase CSS simple que configurará un color de fondo en rojo). Instalaremos los paquetes **`style-loader`** y **`css-loader`** y configuraremos webpackconfig.

### Pasos

- Vamos a tomar como punto de partida el ejemplo anterior.
- Instalemos las dependencias

```bash
$ npm install
```

- Ahora creamos un archivo CSS simple que agregará un fondo rojo, lo llamaremos mystyles.css

_./mystyles.css_

```css
.red-background {
  background-color: indianred;
}
```

- Pasamos a utilizar este estilo directamente en nuestro archivo HTML: si probamos usarlo en un tag de HTML veremos cómo estos no se aplican, tenemos que pasar por configurar webpack.

_./index.html_

```diff
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Webpack 5.x by sample</title>
</head>

<body>
+  <h1>Hello Webpack</h1>
+  <div class="red-background"> Red background stuff </div>
</body>
</html>
```

Si hacemos un *npm run build*, ¿ creéis que nuestro archivo mystyles.css formará parte de nuestro código para producción?  Pues la respuesta es **NO**, porque *webpack* actúa como una tela de araña y no estamos referenciando mystyles.css en ningún sitio.

- Agreguemos este estilo a nuestro punto de entrada:

_./webpack.config.js_

```diff
module.exports = {
-  entry: './src/students.js'],
+ entry: ['./src/students.js', './src/mystyles.css'],
.....
```

- Si volviésemos a ejecutar nuestra *build*:

```bash
$ npm run build
```

¿Qué pasaría?, nos daría un error. Diría,.. Ojo que yo soy **`webpack`** pero necesito un **`loader`** para leer los archivos css y otro para que lo introduzca en el HTML.

Para solucionar esto, vamos a instalar dos *loaders*.

- **`css-loader`** este nos permite leer el archivo *.css*.
- **`style-loader`** nos inyecta los estilos en nuestra aplicación.

```bash
$ npm install style-loader css-loader --save-dev
```

- Es hora de configurar nuestro **`webpack.config.js`**. Para configurarlo correctamente, agregamos a **`rules`** una nueva sección en la que haremos uso de nuestros nuevos **`loaders`**. Como hicimos en el apartado anterior usaremos test con una expresión regular para que **`webpack`** maneje los archivos **`css`**, sin entrar en **`node_modules`** y a diferencia de antes utilizaremos **use** para introducir varios **`loaders`**. Éstos actuarán en orden inverso de agregación, es decir, primero usará **`css-loader`** (para que lea el archivo **`css`**), luego el **`style-loader`**(para que nos inyecte el estilo).

_./webpack.config.js_

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
+     {
+       test: /\.css$/,
+       exclude: /node_modules/,
+       use: ['style-loader', 'css-loader'],
+     },
    ],
  },
```

> Recuerda que tienes que detener e iniciar su **`webpack-dev-server`** siempre que realizes cambios en su archivo webpack.config

- Ahora podemos simplemente ejecutar la aplicación y verificar cómo se muestra el fondo rojo en el div que hemos elegido.

```bash
$ npm start
```

- Si ahora construimos de nuevo nuestra *build*:

```bash
$ npm run build
```

- Vemos como resultado que no tenemos ningún archivo *css*.

- Pero nos preguntaremos, sí veo el resultado de aplicar el estilo pero ¿dónde ha ido a parar nuestro css? Para nuestra alegría vemos que **`myStyles.css`** se ha incrustado en el archivo **`main.js`**.

¿Como podríamos decirle a webpack? Créame al menos dos bundles uno para el código de la aplicación y otro para los *css*:

- Crearemos dos grupos principales: *app* y appStyles.

- Cuando tenemos varios entry points los almacenamos en un objeto en vez de un *array*. Y en cada propiedad del objeto referenciamos el nombre y el archivo que hace referencia.

_./webpack.config.js_

```diff
module.exports = {
-  entry: ['./src/students.js', './src/mystyles.css'],
+  entry: {
+    app: './src/students.js',
+    appStyles: './src/mystyles.css',
+  },

  output: {
```

- Sino referenciamos nuestros outputs se llamaran de la misma forma que los nombramos en los *entry points* y desaparecerá nuestro *main.js* en *dist*. Ahora tendremos dos *bundles*:
  - *app* (contendrá nuestra aplicación).
  - *appStyles* (inyectará los estilos).

![output-default](./content/output-default.PNG)

- Pero si lo hacemos de esta forma, **`HtmlWebpackPlugin`** genera un **`hash`** a nuestro index.html para referenciar a nuestros archivos JavaScript.

Esto no está mal, pero es mejor práctica que ese hash este directamente incluido en los nombres de los
ficheros generados, veamos cómo hacer esto:

- Creamos un *output* donde ponemos el nombre de nuestro entry point y le indicamos que nos genere un *hash* aleatorio.

_./webpack.config.js_

```diff
entry: {
    app: "./students.js",
    appStyles: "./mystyles.css",
  },
+ output: {
+   filename: '[name].[chunkhash].js',
+ },
```

- Fíjate que ya no necesitaríamos usar el *flag* **`hash`** de **`HtmlWebpackPlugin`**, ya
  que esto lo hemos resuelto en el paso anterior, y _**`HtmlWebpackPlugin`**_ se integra bien
  con esa aproximación.

_./webpack.config.json_

```diff
...
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
-     hash: true,
    }),
  ],
```

- Creamos nuestra *build* y vemos que los archivos generados en el *dist* intercalan un hash
  en su nombre.

```bash
$ npm run build
```

Ahora nos surge otra problemática: cada vez que modifiquemos un archivo y creemos de nuevo nuestra *build* se irán generando nuevos ficheros con nombres diferentes, gracias al *hash*, y se irán acumulando en nuestra carpeta dist y esto no es buena idea, ya que acabaremos con mucha basura y no sabremos que ficheros son los
que debemos subir a producción y cuales las versiones antiguas. Lo que queremos es que cada vez que creemos nuestro *bundle* se borre la carpeta *dist* y vuelva a crearla con nuestra *build*.

Para solucionarlo podemos tirar de un *plugin* de terceros: [**`clean-webpack-plugin`**](https://www.npmjs.com/package/clean-webpack-plugin) que lo hará por nosotros.

- Instalamos el paquete.

```bash
$ npm install clean-webpack-plugin --save-dev
```

Ahora tenemos que indicar:

- La carpeta de salida de nuestro *bundle*.

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const path = require("path");

module.exports = {
  entry: {
    app: "./src/students.js",
    appStyles: "./src/mystyles.css",
  },
  output: {
    filename: "[name].[chunkhash].js",
+     path: path.resolve(__dirname, "dist"),
  },
.....
```

- Y utilizar el *plugin*

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");
.....
 plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "./src/index.html", //Name of template in ./src
      scriptLoading: "blocking", // Load the scripts correctly
    }),
+   new CleanWebpackPlugin(),
  ],
.....
```

- Ahora vemos que al ejecutar el *build*, se borra previamente el contenido de la carpeta *dist* y
  se genera la *build* limpia.

```bash
$ npm run build
```

> Anexo

Existe una alternativa a **`clean-webpack-plugin`** también muy utilizada que es [**`rimraf`**](https://www.npmjs.com/package/rimraf) pero se instala de una forma diferente que explicamos a continuación.

- Instalamos el paquete.

```bash
$ npm install rimraf --save-dev
```

- Agreguemos el siguiente comando a nuestra *build*:

```diff
  "scripts": {
    "start": "webpack-dev-server --mode development --open",
-    "build": "webpack --mode development"
+    "build": "rimraf dist && webpack --mode development"
  },
```

- Ahora sí ejecutamos la *build* vemos que hace lo mismo que **`clean-webpack-plugin`**.

```bash
$ npm run build
```

Ahora vemos que los estilos están encuentran en un archivo *js*, ¿qué pasa si queremos mantenerlo como un archivo css separado? Haciendo uso de [**`MiniCssExtractPlugin`**](https://webpack.js.org/plugins/mini-css-extract-plugin/) podemos conseguirlo. ¡Vamos al lio!

- Vamos a instalar este plugin

```bash
$ npm install mini-css-extract-plugin --save-dev
```

- Para utilizar de forma correcta esta librería tenemos que hacer uso de un _loader_ y un _plugin_.Vamos a añadimos sustituimos el **`style-loader`** por el **`MiniCSSExtractPlugin.loader`**.

_webpack.config.js_

```diff
const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
```

- Configuramos el *loader* para la extensión *.css*.

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
         exclude: /node_modules/,
-        use: [ 'style-loader', 'css-loader'],
+       use: [
+          MiniCssExtractPlugin.loader,
+         "css-loader"
+        ]
      },
    ],
  },
  .....
```

- Ahora en vez de inyectar los estilos se va a crear un nuevo archivo *css* y *HTMLwebpackplugin* nos lo añade a nuestro *HTML*.

- Finalmente, agregamos el objeto del *plugin* a la sección de *plugins* de nuestro *webpack.config.js*:

```diff
plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
+   new MiniCssExtractPlugin({
+     filename: "[name].css",
+     chunkFilename: "[id].css"
+   }),
new CleanWebpackPlugin(),
  ],
```

- Al ejecutar **`webpack`** nuevamente, se divide en dos archivos **`appStyles.js`** y **`appStyles.css`**

ero ahora nos preguntaremos, ¿por qué se sigue generando el *appStyles.js*? Y es porque tenemos en webpack.config.js como *entry point* a appStyles que hace referencia a *mystyless.css* y nos va a seguir sacando el archivo *JavaScript*.

¿Y si lo quito?

```diff
.....
module.exports = {
  entry: {
    app: "./src/students.js",
-    appStyles: "./src/mystyles.css",
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist"),
  },
.....
```

*Webpack* no sabe llegar a mystyles.css porque no hay ningún sitio que haga referencia a nuestros estilos y no aparecería en el *bundle*. ¿Cómo podríamos solucionar esto?

- En **`students.js`** importamos los estilos y de esta forma tenemos referenciado **`mystyle.css`**.

_./src/students.js_

```diff
import { getAvg } from "./averageService";
+ import "./mystyles.css";

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

```

- Ahora si ejecutamos la *build*, veremos que la carpeta dist se borra y sólo obtenemos el nuevo contenido generado sin *appStyles.js*.

```bash
$ npm run build
```

## Sumario

1. Hemos creado un archivo **`CSS`**.
2. Instalamos **`style-loader`** y **`css-loader`**.
3. Configuramos **`webpackconf.js`**.
4. Vimos como **`clean-webpack-plugin`** nos generaba una nueva carpeta **`dist`** cada vez que generamos una **`build`** o utilizamos **`rimraf`** que nos haría lo mismo.
5. Y por último, usamos **`miniCssExtractPlugin`** si queremos que nuestro *bundle* tenga archivos *css* en vez de los *javascript* resultantes.