En este ejemplo, usaremos la configuración dist predeterminada de webpack  y copiaremos nuestra página HTML principal en esa ruta de distribución.

> Nota que webpack utiliza la carpeta dist como configuración predeterminada.

Empezaremos con el ejemplo _04 Server_,

Pasos resumidos:

- Redirigir la salida (``main.js)`` a la carpeta "dist".
- Incluir en el proceso de compilación: copiar el archivo ``index.html`` a la carpeta "dist"
- Deja que webpack incluya el script ``main.js`` en el archivo ``index.html``.
- Agrega compatibilidad para permitir que los archivos ES6 se depuren directamente en el navegador.
- Genera una versión reducida de ``main.js``.

### Pasos para construirlo

Necesitamos copiar también el HTML a la carpeta dist, y... ¿no sería bueno que webpack pudiera inyectar automáticamente el script en la copia dist del archivo HTML? Hay un complemento que lo hará por ti html-webpack-plugin, comencemos por instalarlo.

```bash
$ npm install html-webpack-plugin --save-dev
```

- Eliminemos de nuestro index.html base la etiqueta de script:

*./index.html*

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack by sample</title>
  </head>
  <body>
    Hello Webpack!
-   <script src="./main.js"></script>
  </body>
</html>
```

Este complemento (html-webpack-plugin) tomará como entrada de plantilla nuestro **``index.html``**, y señalaremos un destino de salida (index.html en la carpeta dist). El complemento copiará index.html en el destino e inyectará la etiqueta de secuencia de comandos que incluye una etiqueta hash para evitar el almacenamiento en caché del navegador cuando se implementen nuevas versiones. Una vez que lo hayamos instalado, debemos solicitarlo en la parte superior de nuestro archivo webpack.config.js:

```diff
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./students.js'],
  output: {
    filename: 'bundle.js',
  },
```

Para configurarlo tenemos que agregar la siguiente sección en nuestro **``webpack.config.js``** (justo después de la definición de los módulos).

*/webpack.config.js*

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
+     template: 'index.html', //Name of template in ./src
+     scriptLoading:'blocking', // Load the scripts correctly
+    }),
+ ],
```
Ya no necesitamos la configuración de devServer para indicarle la ubicación del **``index.html``**.

```diff
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
      scriptLoading: "blocking", // Load the scripts correctly
    }),
  ],
  devServer: {
-    static: path.join(__dirname, "./"),
    port: 8080,
  },
};
```
Ahora, si ejecutamos webpack, nos daremos cuenta de que `index.html` se copia en la carpeta dist y la etiqueta del script se genera automáticamente. Solo hay una advertencia ... no estamos obteniendo ningún parámetro hash adicional para evitar el almacenamiento en caché del navegador, podemos hacerlo configurando la opción hash en verdadero:

```bash
$ npm run build
```

- Agreguemos un parámetro adicional que agregará un valor hash a la entrada de secuencia de comandos generada en el HTML.

```diff
 plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
      scriptLoading:'blocking',
+     hash:true,
    }),
  ],
```

- Ejecutemos la compilación y verifiquemos que ahora obtenemos un hash en nuestro script.

Si abrimos un navegador podemos apuntar la url a [http://localhost:8080](http://localhost:8080/) y navegaremos a nuestra aplicación web.