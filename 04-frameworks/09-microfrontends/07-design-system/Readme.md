# Design System

Y ahora viene una parte que tarde o temprano te va a afectar... tendrás host con diferentes aspectos y querras que los diferentes remotes que consumas se vean igual que el host.

Lo mismo, aquí hay muchas soluciones, vamos a ver una basada en varables CSS.

Vamos a crear ebe el remote un fichero global de variables CSS, por ejemplo `design-tokens.css`:

_./remote/src/design-tokens.css_

```css
/* Variables CSS globales - pueden ser sobrescritas por el host */
:root {
  --primary-color: #3498db;
}
```

Vamos a importarla en nuestro componente remote:

_./remote/src/CounterApp.jsx_

```diff
import { useState } from "react";
+ import "./design-tokens.css";
import styles from "./CounterApp.module.css";

const CounterApp = () => {
```

Y ahora vamos a usar la variable CSS en nuestro CSS module:

_./remote/src/CounterApp.module.css_

```diff
.container button {
-  background-color: #3498db;
+  background-color: var(--primary-color);
  color: white;
```

Y nos hace falta modificar el webpack.config para que procese los ficheros CSS globales:

_./remote/webpack.config.js_

```diff
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
+      {
+        // CSS global (archivos que NO terminan en .module.css)
+        test: /(?<!\.module)\.css$/,
+        use: ["style-loader", "css-loader"],
+      },
      {
        // Expresión regular que indica a Webpack
        // qué archivos deben usar esta regla.
        // Solo coincidirá con archivos que terminen en ".module.css"
        test: /\.module\.css$/,
```

Vamos a probarlo y ver que todo funciona.

> OJO PARAR REMOTE Y VOLVER ARRANCARLO PARA QUE WEBPACK PILLE LOS NUEVOS CAMBIOS

De hecho si abrimos las herramientas de desarrollo y nos vamos al botón, podemos cambiar el valor de la variable y cambiarlo todo.

¿Y si ahora que queremos personalizar desde el host el color primario? Pues podemos tirar de "nuestro design system" y sobrescribir la variable CSS en el host.

Dentro de _global.css_ podemos probar a sobrescribir la variable:

Pero si probamos esto no funciona

_./host/src/styles/global.css_

```diff
body {
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

+ :root {
+	--primary-color: #e74c3c; /* Rojo en lugar de azul */
+ }
```

¿Por qué? Porque el remote carga su CSS después del host y por tanto las variables del remote tienen más prioridad.

Podemos verlo en las devtools (F12 y seleccionar el botón):

Aquí podemos aplicar un truco, añadir especificidad al selector del host para que tenga más prioridad:

```diff
body {
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Sobrescribir la variable del remote con mayor especificidad */
- :root {
+ :root:root {
	--primary-color: #e74c3c; /* Rojo en lugar de azul */
}
```

Si ahora ejecutamos podemos ver como queda.

Una opción altenativa sería usar `layers`, pero esto puede que no este en todos los navegadores:

En _./host/src/styles/global.css_

```css
@layer remote, host;

@layer host {
  :root {
    --primary-color: #e74c3c;
  }
}
```

Y en _./remote/src/design-tokens.css_

```css
@layer remote;
@layer remote {
  :root {
    --primary-color: #3498db;
  }
}
```
