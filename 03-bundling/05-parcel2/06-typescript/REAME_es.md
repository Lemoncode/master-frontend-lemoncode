# Typescript

Es hora de probar cómo se comporta _parcel_ cuando se utiliza Typescript.

# Pasos para contruirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Partimos de _05-images_. Sólo hay que copiar el proyecto y ejecutar _npm install_

```bash
npm install
```

- Instalemos _typescript_ localmente:

```bash
npm install typescript --save-dev
```

- Vamos a añadir un archivo de configuración _tsconfig_:

_tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react-jsx",
    "noLib": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src/"
  }
}
```

- Renombramos _index.js_ a _index.ts_.

- Actualizamos _index.html_

```diff
- <head>
-    <link
-      rel="stylesheet"
-      href="../node_modules/bootstrap/dist/css/bootstrap.css"
-    />
-  </head>
  <body>
    <h1>Check the console log</h1>
-    <div id="imgContainer"></div>
-    <div class="red-background">RedBackground stuff</div>
-    <div class="card" style="width: 18rem">
-      <img src="./content/logo_2.png" class="card-img-top" alt="logo lemoncode" />
-      <div class="card-body">
-        <h5 class="card-title">Card title</h5>
-        <p class="card-text">
-          Some quick example text to build on the card title and make up the
-          bulk of the card's content.
-        </p>
-        <a href="#" class="btn btn-primary">Go somewhere</a>
-      </div>
-    </div>
-    <script type="module" src="./index.js"></script>
+    <script type="module" src="./index.ts"></script>
  </body>
</html>
```

- Reemplazamos nuestro _index.ts_ con algún código de prueba.

_index.ts_

```diff
- import logoImg from 'url:./content/logo_1.png';

- const user = "John Doe";

- console.log(`Hello ${user}!`);

- const img = document.createElement('img');
- img.src = logoImg;

- document.getElementById('imgContainer').appendChild(img);

+ const numberA: number = 2;
+ const numberB: number = 3;

+ console.log(numberA + numberB);
```

> Sería una buena idea añadir un
> archivo _tsconfig_ adecuado

- E inicamos el proyecto:

```bash
npm start
```

- Ahora bien, si introducimos un error de tipo, _parcel_
  no se quejará, el error nos lo muestra _Visual Studio Code_ pero lo más correcto es introducir _typescript_ por nosotros mismos y no fiarnos de nuestro _IDE_ vamos a por ello:

_./src/index.ts_

```diff
- const numberA: number = 2;
+ const numberA: string = 2;
```

- Vamos a instalar _npm-run-all_ un paquete que nos permitirá ejecutar tareas
  en paralelo desde la sección de comandos del _script_ en nuestro _package.json_.

```bash
npm install npm-run-all --save-dev
```

- Ahora vamos a elaborar un poco más nuestro _package.json_, vamos a crear un _script_ nuevo
  para transpilar nuestro babel:

```diff
  "scripts": {
-   "start:": "rimraf dist && parcel --open",
+   "start": "run-p -l type-check:watch start:dev",
+   "start:dev": "rimraf dist && parcel --open",
    "build:prod": "rimraf dist && parcel build",
+    "type-check": "tsc --noEmit",
+    "type-check:watch": "npm run type-check -- --watch",
  },
```

- Ahora, si iniciamos el proyecto, el error
será detectado.

```bash
npm start
```
