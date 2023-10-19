## Generando un paquete en producción

Con lo que tenemos ahora si generamos un _npm run build_ tendríamos que copiar manualmente
el fichero index.html a la carpeta _dist_, y además cambiar el _tag script_ del _index.html_,
esto paso manual puede ser una fuente de errores a futuro.

¿No sería bueno que _webpack_ pudiera inyectar automáticamente ese archivo _html_ dentro de la carpeta _dist_?
¿Y si además añadiera el _tag scrip_ con la ruta correcta a nuestro punto de entrada en _JavaScript_? Existe un _plugin_ que lo hará por ti _html-webpack-plugin_, comencemos por instalarlo:

### Pasos

- Instalamos el plugin

```bash
npm install html-webpack-plugin --save-dev
```

- Eliminamos de nuestro _index.html_ base la etiqueta de script:

_./index.html_

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack 5.x by sample</title>
  </head>
  <body>
-   <script src="./main.js"></script>
  </body>
</html>
```

Este _plugin_ (_html-webpack-plugin_) tomará como entrada nuestro **`index.html`**, y señalaremos un punto de salida (_index.html_ en la carpeta _dist_). Una vez que lo hayamos instalado, debemos importarlo en nuestro
fichero de configuración de _webpack_:

_./webpack.config.js_

```diff
import path from "path";
+ import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: ['./students.js'],
  .....
```

Para configurarlo tenemos que agregar la siguiente sección en nuestro **`webpack.config.js`** (justo después de la definición de los módulos).

_/webpack.config.js_

```diff
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
+ plugins: [
+   //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
+   new HtmlWebpackPlugin({
+     filename: 'index.html', //Name of file in ./dist/
+     template: "./src/index.html", //Name of template in ./src
+     scriptLoading:'blocking', // Just use the blocking approach (no modern defer or module)
+    }),
+ ],
```

Aquí le indicamos:

- El nombre del fichero que se generará en la carpeta _dist_.
- El nombre del fichero que se utilizará como plantilla para generar el fichero _index.html_.
- El modo de carga de los scripts, en este caso queremos asegurarnos la compatibilidad con
  navegadores antiguos y elegimos la opción "_blocking_".

Para saber más sobre que opciones tienes disponibles puede ir a la [documentación de este
plugin](https://github.com/jantimon/html-webpack-plugin#options)

Ya no necesitamos la configuración de _devServer_ para indicarle la ubicación del **`index.html`**,
ya que el plugin lo va a copiar a la carpeta _dist_ o servirlo en memoria en el sitio correcto
en el caso del _wepback-dev-server_.

_/webpack.config.js_
```diff
- import path from "path";
- import url from "url";

- const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  .......
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
      scriptLoading: "blocking", // Load the scripts correctly
    }),
  ],
  devServer: {
-    static: path.join(__dirname, "./src"),
    port: 8080,
  },
};
```

Ahora, si creamos la _build_, nos daremos cuenta de que `index.html` se copia en la carpeta _dist_ y la etiqueta del _script_ se genera automáticamente.

```bash
npm run build
```

Solo hay un tema que puede ser problemático... no estamos utilizando ningún parámetro _hash_ adicional para evitar que el _javascript_ acabe en la caché del navegador o _proxy_ y no detecte nuevas versiones
del mismo, podemos evitar esto configurando la opción hash en el plugin:

- Para evitar que nuevas versiones del fichero _js_ no se carguen y se tire por equivocación de la caché del navegador vamos a añadir un parámetro adicional que agregará un valor hash a los tags de _script_ en el _HTML_ que hemos creado (esto es un truco muy común para evitar problemas con versiones cacheadas en navegadores o _proxies_, en este caso sólo tenemos que añadir un _flag_ para activarlo).

_/webpack.config.js_
```diff
 plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
      scriptLoading:'blocking',
+     hash: true,
    }),
  ],
```

- Ejecutamos la compilación y podemos verificar que ahora obtenemos un hash en nuestro script, para ello abrimos

```bash
npm run build
```

Si abrimos un navegador podemos apuntar la url a [http://localhost:8080](http://localhost:8080/) y navegaremos a nuestra aplicación web.

```bash
npm start
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
