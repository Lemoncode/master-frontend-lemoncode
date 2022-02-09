# Básico

Vamos a comenzar con una muestra muy básica, solo agregamos un html más un registro simple por consola(_ES5_).

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Navega a la carpeta donde vas a crear tu proyecto vacío.

- Ejecuta `npm init`, te pide que respondas a algunas preguntas sobre el proyecto. Una vez respondido con éxito, se generará **[package.json](./package.json)**.

```bash
npm init -y
```

> Ten en cuenta que el nombre de tu carpeta no contenga ni espacios ni mayúsculas(si es el caso, puedes ejecutar 'npm init' y cambiar el nombre del proyecto).

- Después de a ver retocado nuestro _package.json_ es hora de instalar _parcel_.

```bash
npm install parcel --save-dev
```

- Vamos a crear un archvio básico [/src/index.js](./src/index.js):

_[./src/index.js](./src/index.js)_

```javascript
const user = "John Doe";

console.log(`Hello ${user}!`);
```

- Creamos [/src/index.html](./src/index.html):

_.[/src/index.html](./src/index.html)_

```html
<html>
  <body>
    <h1>Check the console log</h1>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

- Ahora añadimos este comando al [package.json](./package.json):

_[package.json](./package.json)_

```diff
  "scripts": {
+   "build": "parcel ./src/index.html"
-   "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Ejecutamos la _build_

```bash
npm run build
```

> Se generó una nueva carpeta, _[/dist](./dist)_. Qué contiene el bundle.

- ¿Qué pasa si necesitamos una versión lista para producción? Agregamos el siguiente comando a nuestro [package.json](./package.json):

_[./package.json](./package.json)_

```diff
  "scripts": {
-   "build": "parcel ./src/index.html"
+   "build": "parcel ./src/index.html",
+   "build:prod": "parcel build ./src/index.html"
  },
```

- Lo ejecutamos:

```bash
npm run build:prod
```

Y nos aparece un bonito error. ¿Qué hicimos mal?, si aparentemente está bien la línea de comandos que usamos.

```
    5 |   "browserslist": "> 0.5%, last 2 versions, not dead",
  > 6 |   "main": "index.js",
  >   |           ^^^^^^^^^^ Did you mean "index.html"?
    7 |   "scripts": {
    8 |     "build": "parcel ./src/index.html",
```

Nuestro _package.json_ contiene un campo _main_, que nos da el punto de entrada a nuestra aplicación. Pero _Parcel_ usa a nuestra aplicación como una librería y trata ese campo _main_ como punto de salida. Cuando creamos el _bundle_, nos da un error y nos muestra _¿Quiso decir index.html?_. Así que la solución es eliminarlo y nos ahorramos errores.

```diff
"browserslist": "> 0.5%, last 2 versions, not dead",
-  "main": "index.js",
  "scripts": {
    "build": "parcel ./src/index.html",
```

> [Parcel en producción](https://parceljs.org/features/production/)

- Cuando ejecutamos el comando de compilación.

```bash
npm run build:prod
```

Pero si abrimos el archivo _javascript_ generado vemos que nuestro código está en _es6_ y no ha sido transpiado. 

```javascript
const user="John Doe";console.log(`Hello ${user}!`);
//# sourceMappingURL=index.6b00e545.js.map
```

¿Por qué sucede esto? Tenemos que decirle a _Parcel_ que nos transpile el código. ¿Y cómo lo solucionamos? Nos vamos al _package.json_ y agregamos otra línea de comandos llamada browserslist.

> [Documentación de browserslist para más configuraciones](https://github.com/browserslist/browserslist)

_[./package.json](./package.json)_

```diff
{
  "name": "parcel",
  "version": "1.0.0",
  "description": "",
+  "browserslist": "> 0.5%, last 2 versions, not dead",
  "main": "index.js",
  "scripts": {
    "build": "parcel ./src/index.html"
  },
```

- Volvamos a generar el _bundle_ y vemos que ahora nuestro código sí ha sido transpilado.

```bash
npm run build:prod
```

- Obtenemos una versión minificada de nuestro código y transpilada.

```javascript
var user="John Doe";console.log("Hello ".concat(user,"!"));
//# sourceMappingURL=index.c90810f0.js.map
```

- Hay un problema: Los archivos antiguos no se borran, vamos a añadir un plugin, llamado **rim-raf** para asegurarnos de que estamos limpiando la carpeta _[/dist](./dist)_ antes de generar el _bundle_.

> [Documentación rim-raf](https://www.npmjs.com/package/rimraf)

```bash
npm install rimraf --save-dev
```

- Agreguemos un paso adicional al proceso de compilación:

_[package.json](./package.json)_

```diff
  "scripts": {
-   "build": "parcel ./src/index.html",
+   "build": "rimraf dist && parcel ./src/index.html",
-   "build:prod": "parcel build ./src/index.html"
+   "build:prod": "rimraf dist && parcel build ./src/index.html"
  },
```

- Añadimos nuestro **script** para lanzar nuestra aplicación, **start**, dentro de [package.json](./package.json) y añadimos el *flag* *--open* para que se abra en nuestro navegador automáticamente cuando se ejecute:

_[package.json](./package.json)_

```diff
  "scripts": {
+   "start": "rimraf dist && parcel ./src/index.html --open",
-   "build": "rimraf dist && parcel ./src/index.html",
+   "build": "rimraf dist && parcel build ./src/index.html"
-   "build:prod": "rimraf dist && parcel build ./src/index.html"
  },
```

- Podemos simplificar nuestros _scripts_ añadiendo _source_, donde introduciremos la entrada a nuestra aplicación.

```diff
{
  "name": "parcel",
  "version": "1.0.0",
  "description": "",
  "browserslist": "> 0.5%, last 2 versions, not dead",
+ "source": "src/index.html",
  "scripts": {
-   "start": "rimraf dist && parcel ./src/index.html --open",
+   "start": "rimraf dist && parcel --open",
-   "build": "rimraf dist && parcel build ./src/index.html"
+   "build": "rimraf dist && parcel build"
  },
```

Ahora lanzamos el comando `npm start` en la **terminal** y verificamos los resultados.
