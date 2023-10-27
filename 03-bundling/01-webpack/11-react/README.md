## Añadiendo soporte a React

En esta demo añadiremos soporte para **`React`** a nuestra aplicación.

### Pasos

- Comenzamos haciendo una limpieza en nuestro ejemplo inicial:
- Eliminamos todo el contenido del **`body`** en nuestro archivo **`HTML`**.

_./src/index.html_

```diff
.....
  <body>
-    <h1>Hello Webpack</h1>
-    <div class="red-background">Red background stuff</div>

-    <div class="card" style="width: 18rem">
-      <div class="card-body">
-        <img src="./content/logo_2.png" alt="logo_2">
-        <h5 class="card-title">Card title</h5>
-        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
-        <a href="#" class="btn btn-primary">Go somewhere</a>
-      </div>
-    </div>

-    <div id="imgContainer"></div>
  </body>
</html>

```

- **`React`** es una librería de código abierto bastante popular para crear interfaces de usuario. Comencemos instalando la biblioteca que se divide en 2: [react](https://www.npmjs.com/package/react) es la librería principal y [react-dom](https://www.npmjs.com/package/react-dom) es el pegamento entre **`React`** y el **`DOM`**.

```bash
npm install react react-dom --save
```

- Cuando trabajamos con **`frameworks`** es normal tener un **`root`** para que tu aplicación sepa que a partir de donde tiene que ser renderizada, en este caso en particular, **`React`** se va a encargar de toda la capa de visualización.

- En el archivo **`index.html`** agregamos un elemento **`<div>`** que será el punto de entrada para nuestra aplicación.

_./src/index.html_

```diff
.....
  <body>
+   <div id="root"></div>
  </body>
</html>
```

- Creamos nuestro primer componente **`React`** en la carpeta **`src`** llamado **`AverageComponent`**:

_./src/averageComponent.jsx_

```jsx
import React from "react";
import { getAvg } from "./averageService";

export const AverageComponent = () => {
  const [average, setAverage] = React.useState(0);

  React.useEffect(() => {
    const scores = [90, 75, 60, 99, 94, 30];
    setAverage(getAvg(scores));
  }, []);

  return (
    <div>
      <span>Students average: {average}</span>
    </div>
  );
};
```

- Renombramos **`index.js`** a **`index.jsx`** y reemplazamos el contenido que tenías, ahora pasamos a: renderizar nuestro componente importado e inyectarlo en el div con id **`root`** que añadimos en el paso
  previo en nuestro **`HTML`**.

_./src/index.jsx_

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { AverageComponent } from "./averageComponent";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
  </div>
);
```

- Necesitamos otro **`preset`** para que Babel transpile los archivos **`jsx`** de **`React`** a **`js`**, necesitamos instalar [_babel-preset-react_](https://github.com/babel/babel/tree/master/packages/babel-preset-react).

```bash
npm install @babel/preset-react --save-dev
```

- Lo agregamos a la configuración de **`babel`**:

_./.babelrc_

```diff
{
- "presets": ["@babel/preset-env"]
+ "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

- Es hora de actualizar nuestro **`webpack.config.js`**. Comenzamos agregando **`resolve`** para que nos reconozca la extensión **`jsx`**, ya que la única que conoce hasta el momento era **`js`**. Esto nos sirve para cuando tengamos que importar nuestros componentes o archivos no tengamos que especificar si la extensión es **`js`** o **`jsx`**:

_./webpack.config.js_

```diff
  ...
  export default {
    context: path.resolve(__dirname, "./src"),
+   resolve: {
+     extensions: ['.js', '.jsx'],
+   },
    entry: {
-     app: './index.js',
+     app: './index.jsx',
      ...
    },
    ...
  };
```

- A continuación en los **`loaders`** debemos indicarle a **`babel-loader`** que no debe operar sólo en archivos **`js`** sino también en archivos **`jsx`**.

_./webpack.config.js_

```diff
  ...
  export default {
    ...
    module: {
      rules: [
        {
-         test: /\.js$/,
+         test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        ...
      ],
    },
    ...
  };
```

- Finalmente, cuando ejecutamos la aplicación, vemos _React_ en acción.

```bash
npm start
```

- Así lo vemos por nuestro navegador:

<img src="./content/react-image.png" alt="react-image" style="zoom: 80%;" />

## Sumario

1. Instalamos **`React`** como una dependencia local.
2. Actualizamos **`index.js`** a **`index.jsx`** y su contenido en consecuencia.
3. Resolvimos las extensiones **`jsx`** y señalamos que el punto de entrada ha cambiado.
4. Configuramos **`webpack.config.js`** para que admita **`jsx`**.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)