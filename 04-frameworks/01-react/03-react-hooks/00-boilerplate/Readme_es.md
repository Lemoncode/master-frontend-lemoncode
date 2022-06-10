# 03 Webpack React

## Resumen

Este ejemplo toma como punto de partida el ejemplo _02-webpack-boiler_.

Vamos a ir paso a paso añdiendo la configuración necesaria para que integrar
**React** en nuestro proceso de build.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a instalar _react_ y _react-dom_

```bash
npm install react react-dom --save
```

- Vamos a instalarnos los typing de _react_ y _react-dom_

```bash
npm install @types/react @types/react-dom --save-dev
```

Así tenemos la librería de React y los bindings para que se integre con un navegador web.

- En el index.html vamos a meter el _div_ que nos servirá como punto de entrada para instanciar
  nuestra aplicación React.

_./src/index.html_

```diff
  <body>
-    <h1 class="my-text">Hello World !</h1>
+    <div id="root"></div>
  </body>
```

- Vamos a crear nuestro primero componente React.

_./src/app.tsx_

```tsx
import React from "react";

export const App = () => {
  return <h1>Hello React !!</h1>;
};
```

- Es hora de instanciar ese compente principal, para poder integrarlo con el navegador
  tenemos que hacer uso a _ReactDOM.render_

_./src/index.tsx_

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
```

- Vamos por buen camino, pero si intentamos ejecutar esto no va fallar, ya que _babel_ no sabe
  como transformar el _jsx_ (recordemos que esto era un azúcar, que en realidad era un XML) a
  javaScript, para que babel sea capaz de entender esto tenemos que instalar el _preset_
  _@babel/preset-react_

Primero lo instalamos

```bash
npm install @babel/preset-react --save-dev
```

_.babelrc_

```diff
{
  "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript",
+     "@babel/preset-react"
  ]
}
```

> Por cierto, el sufijo _rc_ es bastante habitual en linux, significa "runcom".
> (Sistema CTSS 1962-63) Archivo de script que contiene instrucciones de inicio para un programa de aplicación.
> En otras palabras, "rc" es algo que se quedó atrás en los años sesenta, y se ha utilizado con bastante frecuencia para los archivos de configuración en diferentes tipos de programas desde entonces, incluyendo Node, Babel y muchos, muchos otros.
> Más información [en stackoverflow](https://stackoverflow.com/questions/36212256/what-are-rc-files-in-nodejs).

> Otra curiosidad... qué es un _preset_ ... empecemos por lo que es un plugin de babel: las transformaciones de babel
> se habilitan aplicando plugins, hay un montón de plugins y si tienes que ir añadiendo uno a uno se puede convertir en una pesadilla,
> para hacer esto más fácil, babel ha agrupado conjuntos comunes de plugins en _presets_, por ejemplo @babel-preset-react
> incluye los siguientes plugins:

- @babel/plugin-syntax-jsx
- @babel/plugin-transform-react-jsx
- @babel/plugin-transform-react-display-name

- Es hora de saltar al _webpack.config.js_

- Nos podemos asegurar de que tenemos como extension valida _ts_ y _tsx_
- También que en el loader aceptamos tanto _ts_ como _tsx_
- Y en el app tenemos como punto de entrada _index.tsx_

* Vamos a comprobar que hemos dejado todo funcionando:

```bash
npm start
```
