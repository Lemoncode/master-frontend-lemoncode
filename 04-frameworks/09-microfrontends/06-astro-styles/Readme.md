# Estilado

Vamos con el postre, el estilado... esto abre un melón muy interesante, y hay muchas soluciones a esta problema, en este caso vamos a:

- Ver como afectan estilos globales a los componentes.
- Como usar CSS Modules.
- Como crear un "design system" básico con variables CSS.

# Estilos globales en el host

Podemos tener un fichero de estilos globales en el host, por ejemplo `global.css`:

_./styles/global.css_

```css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

Vamos a importarlo en nuestra página principal:

_./src/pages/index.astro_

```diff
---
+ import '../styles/global.css';
import { RemoteCounterComponent } from '../components/RemoteCounterApp';
---
```

Vamos a ejecutar y ver que pinta tiene todo esto.

> Acuerdate de tener remote y host levantados en terminales diferentes.

Si te fijas los estilos del host los aplica el remote, esto puede ser un señor lío.

¿Y si quiero definir mis estilos en el remote?

Una opción es usar CSS Modules, de esta manera:

- Puedo definir mis clases.
- Al generar el build se crean clases únicas (prefijo, sufijo aleatorio, etc) que evitan colisiones.
- Lo puedo consumir en el host sin miedo a que colisionen los nombres de las clases.

Vamos a por ello.

# Paso 1: Configuración de webpack

Para poder tratar con CSS me hace falta añadir un par de loaders a la configuración de webpack del remote.

```bash
cd remote
```

```bash
npm install style-loader css-loader --save-dev
```

En el webpack.config.js del remote añadimos una regla para los ficheros .css:

```diff
module: {
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
+     // Expresión regular que indica a Webpack
+     // qué archivos deben usar esta regla.
+     // Solo coincidirá con archivos que terminen en ".module.css"
+        test: /\.module\.css$/,
+        // Lista de loaders que se aplicarán a esos archivos
+        // IMPORTANTE: Webpack los ejecuta de derecha a izquierda
+        use: [
+          // style-loader:
+          // Toma el CSS procesado y lo inyecta en el DOM
+          // creando una etiqueta <style> en el <head>.
+          // Esto hace que los estilos "viajen" con el JS del remote.
+          "style-loader",
+          {
+            // css-loader:
+            // Interpreta el CSS como un módulo JavaScript.
+            // Es el responsable de:
+            // - entender @import y url(...)
+            // - habilitar CSS Modules
+            loader: "css-loader",
+            // Opciones específicas para css-loader
+             options: {
+           // Fuerza a css-loader a usar ES Modules
+           // En lugar de CommonJS (module.exports)
+           //
+           // Con esModule: true:
+           //   import styles from "./file.module.css"
+           //
+           // Sin esto (o con false):
+           //   const styles = require("./file.module.css")
+           //
+           // En entornos modernos (React, Vite, MF)
+           // ES Modules es lo correcto y evita edge cases
+              esModule: true,
+              // Formato del nombre de clase generado
+              // [name]  → nombre del archivo CSS
+              // [local] → nombre original de la clase
+              // [hash]  → hash para evitar colisiones
+              //
+              // Ejemplo:
+              // .button en CounterApp.module.css
+              // → CounterApp__button__a1B2c
+              modules: {
+                namedExport: false,
+                localIdentName: "[name]__[local]__[hash:base64:5]",
+              },
+            },
+          },
+        ],
+      },
    ],
  },
```

Creamos un fichero CSS en el remote, por ejemplo CounterApp.module.css:

_./remote/src/CounterApp.module.css_

```css
.container {
  padding: 20px;
  border: 2px solid #3498db;
  border-radius: 8px;
  background-color: #ecf0f1;
  max-width: 300px;
  text-align: center;
}

.container h2 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.container p {
  font-size: 1.2rem;
  color: #34495e;
}

.container button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.container button:hover {
  background-color: #2980b9;
}
```

Y lo usamos en el CounterApp.jsx:

_./remote/src/CounterApp.jsx_

```diff
import React, { useState } from "react";
+ import styles from "./CounterApp.module.css";

const CounterApp = () => {
  const [count, setCount] = useState(0);

  return (
-    <div>
+    <div className={styles.container}>
      <h2>React Counter Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default CounterApp;
```

Vamos a ejecutar el remote y el host para ver el resultado:

En terminal 1:

```bash
cd remote
npm start
```

En terminal 2:

```bash
cd host
npm run dev
```
