## Servidor web desarrollo

Cuando estás programando una aplicación web no es idea el estar directamente pinchando ficheros _html_ desde el explorador para cargarlos en el navegador, cómo desarrollador es normal que queramos levantar un servidor web ligero en local para poder ir probando nuestro desarrollo. En este ejemplo veremos cómo hacer esto.

### Pasos

- Vamos a instalar **`webpack-dev-server`**, el cual nos montará un servidor web ligero, donde correrá nuestra aplicación.

```bash
npm install webpack-dev-server --save-dev
```

- Vamos a reconfigurar nuestro **`package.json`** añadiendo el comando **`start`** donde vamos a lanzar nuestra aplicación en modo desarrollo.

./package.json

```diff
  "scripts": {
+   "start": "webpack serve --mode development",
    "build": "webpack --mode development"
  },
```

- Antes de ejecutar el proyecto, tenemos que tener en cuenta de que éste servidor se ejecuta en memoria (así es muy rápido) y no
  perderá tiempo en volcar la información en la carpeta _dist_, así pues, para referenciar al archivo _main.js_ que está en la memoria de
  _webpack dev server_ tenemos que hacer un cambio de ruta en el tag script del _index.html_, más adelante
  aprenderemos una forma más limpia de hacer esto (utilizando _HTMLWebpackPlugin_)

_./src/index.html_

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
-    <script src="../dist/main.js"></script>
+    <script src="./main.js"></script>
  </body>
</html>
```

- Otra cosa que tenemos que hacer es modificar nuestro **`webpack.config.js`** porque por defecto **`webpack dev server`** busca el _index.html_ en la carpeta _public_ y tenemos que decirle que mire dentro de la carpeta _src_ de nuestra aplicación.

Para ello:

- Por un lado nos traemos una utilidad de _node_ que nos permite concatenar rutas (path).
- Por otro utilizamos la variable **dirname** que nos da la ruta del proyecto.
- Por último, obtenemos una ruta resultado de concatenar **dirname** con la ruta _src_,
  esta será la que usemos en la sección _devServer_ para indicarle a _webpack_dev_server_
  donde tiene que apuntar.

[Documentación](https://webpack.js.org/configuration/dev-server/)

_./webpack.config.js_

```diff
+ import path from "path";
+ import url from "url";

+ const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

module.exports = {
  entry: ["./src/students.js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
+  devServer: {
+    static: path.join(__dirname, "./src"),
+  },
};
```

- Ahora si escribimos el comando desde la terminal de nuestro sistema.

```bash
npm start
```

<img src="./content/html-webpluging3.PNG" alt="html-webpluging3" style="zoom:67%;" />

- Si abrimos un navegador, podemos apuntar la _url_ a [http://localhost:8080](http://localhost:8080/), esto nos llevará a nuestra aplicación.
- Una característica interesante que incluye éste servidor de desarrollo es **live reloading**, así cualquier cambio introducido en algún archivo JavaScript será automáticamente detectado y _webpack dev server_ lanzará el proceso de _build_ en memoria y una vez terminado refrescará automáticamente la página que se muestra en el navegador (por ejemplo podemos cambiar el texto del _main_ y ver como automáticamente se lanza un _build_ y se refresca el contenido en el navegador).
- Si queremos ejecutar la _build_ de _webpack_, solo necesitamos escribir los comandos desde la terminal de nuestro sistema:

```bash
npm run build
```

- Finalmente, si el puerto por defecto en el que corre _webpack-dev-server_ no nos cuadra, podemos
  cambiarlo, tocando la entrada _devServer/port_ en el **`webpack.config.js`**:

_./webpack.config.js_

```diff
export default {
  entry: ["./src/students.js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "./src"),
+   port: 8081,
  },
};
```

- Ahora, se está ejecutando en el puerto 8081.

```bash
npm start
```

<img src="./content/webpack-dev-server.png" alt="webpack-dev-server" style="zoom:67%;" />

- De cara a tener este ejemplo listo para siguientes pasos, vamos a volver a indicarle
  que utilice el puerto por defecto:

_./webpack.config.js_

```diff
export default {
  entry: ["./src/students.js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, "./src"),
-   port: 8081,
+   port: 8080,
  },
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
