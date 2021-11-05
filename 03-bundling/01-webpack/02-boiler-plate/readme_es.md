# 02 Boilerplate

En esta muestra vamos a establecer un proyecto web que puede ser fácilmente manejado
por webpack.

Prepararemos un proyecto inicial de npm, daremos soporte a ES6, e instalaremos el webpack.
Luego crearemos una muestra de "Helloworld.js".

Pasos de resumen:

- Prerrequisitos: Instalar Node.js
- Iniciar `package.json` (npm init)
- Crear un simple archivo HTML.

# Pasos para construirlo

## Requisitos previos...

Instala [Node.js y npm](https://nodejs.org/en/) (min v8.9) si no están ya instalados en tu ordenador.

> Verifique que está ejecutando al menos el node v8.x.x y npm 5.x.x ejecutando `node -v` y `npm -v` en una ventana de terminal/consola. Las versiones más antiguas pueden producir errores.

## pasos

- Navegue hasta la carpeta donde va a crear el proyecto vacío.

- Ejecuta `npm init`, se te pedirá que respondas a alguna petición de información sobre el proyecto (una vez que hayas completado con éxito un archivo **`package.json`** que generaremos).

```bash
npm init -y
```

> Al usar "y" estamos de acuerdo con los valores por defecto que el programa pide (ten cuidado si tienes
> creado un nombre de carpeta que contenga los caracteres en mayúsculas o bien, espacios en blanco. Se producirán errores).

- Instalar **webpack** y **webpack-cli** localmente, como una dependencia de desarrollo (la razón para instalarlo localmente y no globalmente es para que sea fácil de configurar, por ejemplo, se puede lanzar en una máquina limpia sin tener que instalar nada globalmente excepto nodejs).

```Bash
npm install webpack webpack-cli --save-dev
```

- Para lanzar webpack, modifica el archivo **`package.json`** y añade la siguiente propiedad `"start": "webpack"` bajo el objeto "scripts". Nos permite lanzar el webpack desde la línea de comandos a través de npm escribiendo `npm start`.

> En webpack 5, ahora es obligatorio informar el modo en el que estamos trabajando, en desarrollo, o en producción (minified, etc...), en la línea de comandos donde lo llamamos.

Ahora, nuestro archivo **`package.json`** debería tener un aspecto parecido a esto:

_./package.json_

```diff
{
...
  "scripts": {
+   "start": "webpack --mode development"
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
...
}
```

> Webpack 5 ofrece un punto de entrada de configuración cero, esto significa: si no vas a transpilar tu código
> y tienes un punto de entrada bajo _./src/index.js_ , este funcionará por defecto. Esto es bueno para conseguir
> algún código de prueba rápido en marcha, pero en un proyecto real no es suficiente, iremos por el camino largo
> en esta muestra (crear y configurar el webpack.config.js).

- Escribiremos el código de es6 pero necesitamos transpilarlo a es5, para ello instalaremos `babel-core` más `babel-preset-env` y lo guardaremos como una _dev dependency_  en el fichero **`package.json`** que se ha generado previamente.

Vamos a empezar a trabajar con babel 7

```bash
npm install @babel/cli @babel/core @babel/preset-env --save-dev
```

- Necesitamos instalar un _"loader"_ (más sobre esto en los próximos módulos) para que webpack pueda hacer uso del transpilador "babel-core".

```bash
npm instalar babel-loader --save-dev
```

Nuestro archivo **`package.json`** debería ser algo así:

_./package.json_

```diff
{
...
  "devDependencies": {
+    "@babel/cli": "^7.12.1",
+    "@babel/core": "^7.12.3",
+    "@babel/preset-env": "^7.12.1",
+    "babel-loader": "^8.1.0",
+    "webpack": "^5.3.1",
+    "webpack-cli": "^4.1.0"
  }
}
```

- Ahora crea un archivo JavaScript llamado **`students.js`** que incluirá la sintaxis ES6.

_./students.js_

```javascript
// Usemos algunas características de ES6
const averageScore = "90";
const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);
```

- Ahora es el momento de añadir el archivo de configuración de babel:

_./.babelrc_

```javascript
{
  "presets": ["@babel/preset-env"]
}
```


> Más información sobre esta configuración: https://babeljs.io/docs/en/babel-preset-env
> También puedes establecer este ajuste directamente en el webpack: https://blog.craftlab.hu/all-the-new-things-setting-up-webpack-4-with-babel-7-39a5225b8168

- Podemos continuar con la configuración del webpack. Crear un esqueleto vacío en un archivo llamado **`webpack.config.js`**, e indicar el punto de entrada de js.

_./webpack.config.js_

```javascript
module.exports = {
  entry: ["./students.js"],
};
```

- Ahora añade soporte para es6, pediremos a webpack que maneje todos los archivos js bajo la carpeta de proyectos (excluyendo la subcarpeta `node_modules`) y que los transpile de es6 a es5 (usando  `babel-loader`).

_./webpack.config.js_

```diff
module.exports = {
  entry: ['./students.js'],
+ module: {
+   rules: [
+     {
+       test: /\.js$/,
+       exclude: /node_modules/,
+       loader: 'babel-loader',
+     },
+   ],
+ },
};
```

- Vamos a ejecutar webpack desde la línea de comandos, escribe `npm start` y presiona enter.

```bash
npm start
```

- Podemos comprobar que se ha generado un archivo llamado **`bundle.js`**.

- si abrimos el archivo **`bundle.js`** podemos comprobar que contiene (entre otros códigos de _boiler plate_) la versión transpilada a es5 de **`students.js`**.

_./dist/bundle.js_

```javascript
...
/***/ "./students.js":
/*!*********************!*\
  !*** ./students.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var averageScore = \"90\";\nvar messageToDisplay = \"average score \".concat(averageScore);\ndocument.write(messageToDisplay);\n\n//# sourceURL=webpack:///./students.js?");

/***/ }),
...
```


- Crea ahora un simple archivo HTML, **`index.html`**, e incluye una etiqueta de script que apuntará a nuestro archivo **`bundle.js`** generado.

_./index.html_

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack 5.x by sample</title>
  </head>
  <body>
    Hello Webpack!
    <script src="./dist/main.js"></script>
  </body>
</html>
```

> IMPORTANTE: Esta no es la mejor manera de incluir un archivo HTML y enlazarlo con webpack,
> aprenderemos a hacer esto de una manera apropiada más adelante.

- Ahora podemos hacer clic en el archivo html y ver nuestro pequeño trozo de código en funcionamiento.

> **Nota:** Esta no es la solución óptima, en los próximos pasos generaremos correctamente
> un archivo HTML y usaremos un plugin para inyectar los scripts de arranque.

# Acerca de Basefactor + Lemoncode

Somos un equipo innovador de expertos en Javascript, apasionados por convertir sus ideas en productos robustos.

[Basefactor, consultoría de Lemoncode](http://www.basefactor.com) proporciona servicios de consultoría y entrenamiento.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provee servicios de entrenamiento.

Para la audiencia de LATAM/España estamos haciendo un Master Online en Front End, más información: http://lemoncode.net/master-frontend

