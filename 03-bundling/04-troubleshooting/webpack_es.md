# Guía webpack de errores y posibles soluciones

Configurar webpack puede ser un poco duro y durante el proceso no es nada raro que surgan diferentes errores (muchos de ellos tontos) que pueden volvernos locos hasta que damos con la solución de los mismos.

En la siguiente sección encontrarás una lista de errores 'tontos' genéricos que podrían atosigarte durante la configuración de webpack. No está de más tenerlos presentes.

Posteriormente, existe un índice donde aparecen listados los errores seleccionados que contiene este documento. Si recibes un mensaje de error en la consola mientras configuras webpack puedes venir aquí y compararlo con los errores del índice. Si existe una coincidencia haz scroll para encontrar una posible solución a tu problema. Si tu error no aparece en el índice… bueno, en tal caso te deseamos buena suerte, igual la necesitas…

Ten en cuenta que el orden y la numeración de los errores en el índice corresponden al desarrollo cronológico de la configuración de webpack, es decir, los primeros fallos listados están relacionados con los primeros pasos dados para configurar el bundling y así en adelante.

## Errores y conceptos generales que deberías tener en cuenta:

1. Parece obvio, pero si la consola te lanza un error de cualquier tipo o si los estilos no se aplican lo primero es comprobar los nombres de los archivos, dependencias, clases, etc. implicados en el asunto. Entrena tu vista y descarta que el fallo está originado en un despiste ortográfico. Entre los más comunes: escribir un nombre plural en singular, equivocarse en alguna letra, utilizar camelCase en un lugar y olvidarte de las mayúsculas en otro, confundir guiones bajos con guiones normales, introducir un espacio en alguna de las rutas de los ficheros o nombres de los mismos, etc.

2. Cuando estés trabajando en el archivo webpack.config.js, ten especial cuidado en dónde aplicas los loaders. No es raro equivocarse y ubicar en css los que deberían ir en scss y al revés.

3. Aludiendo también al archivo webpack.config.js, ten en cuenta que el código de dicho fichero se lee de abajo arriba, al contrario de lo que suele ser normal. Si te extraña que unos elementos se sitúen encima o abajo de otros acuérdate de esto y verás como el orden de ejecución cobra sentido para ti.

4. Si estás trabajando con un elemento del DOM y te dice que no puedes leer una propiedad de null, es muy probable que pasen algunas de las siguientes cosas: 1) estás seleccionando mal el elemento HTML. Fíjate en que el nombre de la clase o del id coincidan y, por supuesto, si estás seleccionando por clase o por id elige el método apropiado de js para cada uno de ellos; 2) ten en cuenta que si se ejecuta el documento js antes del html, el primero no podrá acceder a los elementos del segundo porque, literalmente, no existirán todavía. Una manera de solucionar esto es colocar el script con el src al documento js justo antes de la etiqueta de cierre del body en el documento html.

5. Asegúrate de que los archivos se encuentran en su lugar correspondiente. Ficheros como 'tsconfig.json', 'package.json', 'package-lock.json', 'webpack.config.js' o '.babelrc' deberían ubicarse en la carpeta fuente del proyecto.

6. ¿Estás aplicando cambios en los estilos, en js o en el html y no se reflejan o no se guardan? Es posible que estés tocando los archivos de la carpeta 'dist'. Recuerda que dicha carpeta es la que utiliza el bundle para sacar los archivos originados en desarrollo. La carpeta en la que debemos situar nuestros ficheros para trabajar y donde deberíamos estar tocando es 'src'.

7. Aunque en la guía que te ofrecemos no se realizan instalaciones globales, ten en cuenta que si quieres hacer una instalación global desde linux o mac siempre debes incluir el término 'sudo' antes del comando de instalación. Esto te garantiza acceder a los permisos para poder instalar el software. Eso sí, lo más probable es que te pida la contraseña de tu sistema al hacerlo:

```bash
sudo npm install xxx -g
```

## Indice de errores

#### ERROR 01 ~ No encuentra el archivo js

```
Module not found: Error: Can't resolve './index' in '/User/Documents/bundling/pack'
  @ multi ./index.js main[0]
```

#### ERROR 02 ~ No encuentra un plugin o un loader concreto

```
  Error: Cannot find module 'xxx'
```

```
  ERROR in Entry: modulet not found: Error: Can't resolve 'xxx' in '/User/Documents/bundling/pack'
```

```
  code: 'MODULE_NOT_FOUND'
```

#### ERROR 03 ~ No encuentra el preset de babel

```
ERROR in ./index.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
Error: Cannot find module '@babel/preset-present-env' from '\User\Documents\bundling\pack'
    at Function.resolveSync [as sync] (\User\Documents\bundling\pack\node_modules\resolve\lib\sync.js:89:15)
    at resolveStandarddizedName (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:101:31)
    at resolvePreset (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:58:10)
    at loadPreset (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:77:28)
    at createDescriptor (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\config-descriptors.js:154:9)
```

#### ERROR 04 ~ Error de configuración en el archivo webpack

```
  - configuration.module.rules should be an array:
    [object {compiler?, enforce?, exclude?, include?, issuer?, loader?, oneOf?, options?, parser?, query?, realResource?, resolve?, resource?, resourceQuery?, rules?, si deEffects?, test?, type?, use? }]
    -> An array of rules applied for modules.
```

#### ERROR 05 ~ No aparecen los archivos en la carpeta dist

La consola no avisa de ningún error. Sin embargo, a pesar de introducir el comando 'npm start' en la consola la carpeta dist permanece vacía.

#### ERROR 06 ~ No encuentra bootstrap

```
  ERROR in multi ./node_modules/bootstrap/dist/css/bootstrap.css
  Module not found: Error: Can't resolve './node_modules/bootstrap/dist/css/bootstrap.css' in '/User/Documents/bundling/pack'
  @ multi ./node_modules/bootstrap/dist/css/bootstrap.css vendorStyles[0]
```

#### ERROR 07 ~ Error al hacer un import de css con typescript

```
  Cannot find module './styles.scss'
```

#### ERROR 08 ~ No reconoce el contenido jsx de React

```
ERROR in ./index.jsx
Module build failed (from ../node_modules/babel-loader/lib/index.js):
SyntaxError: /Users/brauliodiez/Downloads/reactdemo-master/src/index.jsx: Unexpected token (6:2)

  4 |
  5 | ReactDOM.render(
> 6 |   <div>
    |   ^
  7 |     <h1>Hello from React!</h1>
  8 |     <AverageComponent />
  9 |   </div>,
    at Parser._raise (/Users/brauliodiez/Downloads/reactdemo-master/node_modules/@babel/parser/lib/index.js:746:17)
```

# ERROR 01 ~ No encuentra el archivo js

Tengo un error similar al siguiente:

```
Module not found: Error: Can't resolve './index.js' in '/User/Documents/bundling/pack'
  @ multi ./index.js main[0]
```

Por alguna razón no se puede localizar el archivo js indicado.

1. Asegúrate de que el nombre del fichero aparece escrito de la misma forma en todos sus imports.

2. ¿Has comprobado que el nombre del archivo coincide con la ruta de entrada indicada en el archivo webpack.config.js?

_./webpack.config.js_

```js
module.exports = {
  entry: {
    app: "./index.js",
  },
```

# ERROR 02 ~ No encuentra un plugin concreto

Tengo un error similar a los siguientes:

```
  Error: Cannot find module 'xxx'
```

```
  ERROR in Entry: modulet not found: Error: Can't resolve 'xxx' in '/User/Documents/bundling/pack'
```

```
  code: 'MODULE_NOT_FOUND'
```

Cuando no podemos encontrar un plugin o un loader concreto puede ser por diferentes razones.

1. ¿Se encuentra el plugin correctamente instalado en el package.json? Accede a dicho archivo y comprueba que el plugin 'xxx' se encuentre allí. En caso contrario, introduce el comando adecuado en la terminal para instalarlo.

_./package.json_

```js
{
  "devDependencies": {
    "xxx": "^7.10.1",
}
```

2. ¿Se encuentra el archivo webpack.config.js en la carpeta fuente del proyecto? Abre la navegación de archivos de tu editor de código y comprueba que webpack.config.js no está dentro de ninguna subcarpeta o fuera de la carpeta principal de tu proyecto.

3. ¿Se encuentra la carpeta del plugin dentro de node_modules? Entra en esta carpeta y busca el nombre del plugin 'xxx'. En caso de no aparecer dicha carpeta, haz un npm install en la consola. Si sigue sin funcionar, elimina manualmente la carpeta node_modules y dist, así como el archivo package-lock.json y vuelve a hacer un npm install.

# ERROR 03 ~ No encuentra el preset de babel

Tengo un error similar al siguiente:

```
ERROR in ./index.js
Module build failed (from ./node_modules/babel-loader/lib/index.js):
Error: Cannot find module '@babel/preset-present-env' from '\User\Documents\bundling\pack'
    at Function.resolveSync [as sync] (\User\Documents\bundling\pack\node_modules\resolve\lib\sync.js:89:15)
    at resolveStandarddizedName (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:101:31)
    at resolvePreset (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:58:10)
    at loadPreset (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\files\plugins.js:77:28)
    at createDescriptor (User\Documents\bundling\pack\node_modules\@babel\core\lib\config\config-descriptors.js:154:9)
```

En esta ocasión, todo parece indicar que hemos cometido un error añadiendo el preset en el archivo .babelrc

Abre el archivo .babelrc y comprueba que el preset aparece escrito de la siguiente manera:

_./.babelrc_

```js
{
  "presets": ["@babel/preset-env"]
}
```

Ten en cuenta que el código anterior se corresponde con el inicio de la configuración de webpack. Si has llegado hasta el final de la guía el mismo archivo deberá tener el siguiente aspecto:

_./.babelrc_

```js
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}

```

# ERROR 04 ~ Error de configuración en el archivo webpack

Tengo un error similar al siguiente:

```
- configuration.module.rules should be an array:
    [object {compiler?, enforce?, exclude?, include?, issuer?, loader?, oneOf?, options?, parser?, query?, realResource?, resolve?, resource?, resourceQuery?, rules?, si deEffects?, test?, type?, use? }]
    -> An array of rules applied for modules.
```

Tenemos que tener en cuenta que el archivo webpack.config.js puede ser un poco exigente a la hora escribir la configuración del mismo. Si nos equivocamos en un paréntesis, un corchete… bueno, digamos que no le va a gustar. En este caso el error viene dado por no haber incluido el contenido de rules dentro de un objeto y, posteriormente, en un array.

_./.webpack.config.js_

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
};
```

Los errores de este tipo en el archivo webpack pueden ser muy comunes y diversos. Revisa bien cómo se escribe todo el contenido. Aquí tienes un enlace a la [documentación de webpack](https://webpack.js.org/concepts/). No obstante, si sigues correctamente todos los pasos de la guía no deberías tener ningún problema a este respecto.

# ERROR 05 ~ No aparecen los archivos en la carpeta dist

La consola no avisa de ningún error. Sin embargo, a pesar de introducir el comando 'npm start' en la consola la carpeta dist permanece vacía.

La aparición de los archivos del bundler en la carpeta dist dependerá de la configuración de los script del archivo package.json. En las primeras fases de la configuración de webpack es posible que tengas algo similar a lo siguiente:

```json
"scripts": {
    "start": "webpack-dev-server --mode development --open",
    "build": "webpack --mode development"
  },
```

Si es así, como puedes observar, el script 'start' se encuentra vinculado a webpack-dev-server, que funciona en memoria y no genera la carpeta dist. Para generar dicha carpeta hay que llamar a webpack introduciendo el siguiente comando en la consola:

```dash
npm run build
```

Recuerda que todos los scripts custom deben incluir 'run' para poder ser ejecutados. 'npm start' es el único que funciona sin incluir el término 'run'.

# ERROR 06 ~ No encuentra bootstrap

Tengo un error similar al siguiente:

```
  ERROR in multi ./node_modules/bootstrap/dist/css/bootstrap.css
  Module not found: Error: Can't resolve './node_modules/bootstrap/dist/css/bootstrap.css' in '/User/Documents/bundling/pack'
  @ multi ./node_modules/bootstrap/dist/css/bootstrap.css vendorStyles[0]
```

1. ¿Has comprobado que bootstrap se encuentra correctamente instalado en el package.json? Accede al archivo y verifícalo:

_./package.json_

```js
"dependencies": {
  "bootstrap": "^4.4.1"
}
```

2. ¿Se encuentra la carpeta del bootstrap dentro de node_modules? Entra en esta carpeta y busca el nombre del plugin. En caso de no aparecer dicha carpeta, haz un npm install en la consola. Si sigue sin funcionar, elimina manualmente la carpeta node_modules y dist, así como el archivo package-lock.json y vuelve a hacer un npm install.

3. ¿Aparece el plugin correctamente escrito en el archivo webpack.config.js? Ve a dicho archivo y compruebalo:

_./webpack.config.js_

```js
module.exports = {
  entry: {
    vendorStyles: ["./node_modules/bootstrap/dist/css/bootstrap.css"],
  },
};
```

4. ¿Está la ruta correctamente indicada en el archivo webpack.config.js? Si estás utilizando 'path' para cambiar el directorio raiz del proyecto es posible que tengas que subir de carpeta en la ruta de bootstrap:

_./webpack.config.js_

```js
const path = require("path");

const basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  entry: {
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"],
  },
};
```

# ERROR 07 ~ Error al hacer un import de css con typescript

Tengo un error similar al siguiente:

```
  Cannot find module './styles.scss'
```

Es posible que al intentar importar un módulo de css con 'import' teniendo activado typescript te de un error. Para solucionar dicho error, accede al fichero donde se está llevando a cabo el import y sustitúyelo por esta otra forma:

_./main.js_

```diff
- import * as classes from './styles.scss'
+ const classes = require('./styles.scss');
```

# ERROR 08 ~ No reconoce el contenido jsx de React

Tengo un error similar al siguiente:

```
ERROR in ./index.jsx
Module build failed (from ../node_modules/babel-loader/lib/index.js):
SyntaxError: /Users/brauliodiez/Downloads/reactdemo-master/src/index.jsx: Unexpected token (6:2)

  4 |
  5 | ReactDOM.render(
> 6 |   <div>
    |   ^
  7 |     <h1>Hello from React!</h1>
  8 |     <AverageComponent />
  9 |   </div>,
    at Parser._raise (/Users/brauliodiez/Downloads/reactdemo-master/node_modules/@babel/parser/lib/index.js:746:17)
```

Lo que está pasando aquí es que el loader encuentra el fichero, pero no es capaz de parsear el JSX (este JSX es un XML que se convierte a una ristra de código JavaScript).

De donde puede venir el problema:

1. ¿ Has añadido el _@babel/preset-react_ a los presets de _.babelrc_ ?

```bash
npm install @babel/preset-react --save-dev
```

_./.babelrc_

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

2. ¿El fichero ".babelrc" lo has nombrado bien? Si estás con code te tiene que aparece de esta manera en la lista de ficheros de tu proyecto en VSCode:

![babel-icon 6 extension](./content/babel-icon.png)
