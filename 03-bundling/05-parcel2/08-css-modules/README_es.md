# CSS Modules

Vamos a comprobar lo fácil que es integrar los módulos css en el _bundle_.

# Pasos para construirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecutando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Partimos de _07-react_. Sólo hay que copiar el proyecto y ejecutar _npm install_

```bash
npm install
```

Si vamos a la [documentación de parcel](https://parceljs.org/languages/css/), dos dice que par usar _css modules_ sólo tenemos que añadir el sufijo _module_ al nombre del archivo css.

- Vamos a crear un archivo para los estilos _mystyles.css_

_./src/hello.module.css_

```css
.background {
  background-color: indianred;
}
```

- Importamos el archivo _css_ a nuestro _index.tsx_:

_./src/hello.tsx_

```diff
+ import * as classes from "./hello.module.css";
```

- Vamos a crearnos un archivo _declarations.d.ts_ para que el compilador de typescript no nos de error al importar el archivo _css_:

_./src/declarations.d.ts_

```typescript
declare module "*.css";
```

Ahora vemos ya que desaparece el error que teníamos anteriormente.

- Ahora usamos el estilo en nuestro componente _hello_:

_./src/hello.tsx_

```diff
- <h1>Hello from React</h1>
+ <h1 className={classes.background}>Hello from React</h1>
```

- Ejecutamos la aplicación:

```bash
npm start
```

Vemos que se han aplicado los estilos correctamente, pero si ahora generamos el _bundle_:

```bash
npm run build
```

Vemos que al archivo _css_ no ha añadido un hash delante del nombre de la clase, por lo que si tuviésemos dos clases con el mismo nombre en dos archivos diferentes, no se produciría un conflicto.

```typescript
.vL_zLq_background{background-color:#cd5c5c}
```

Si queremos probarlo con dos archivos, vamos a crear un componente nuevo _bye.tsx_:

_./src/bye.tsx_

```tsx
import React from "react";
import * as classes from "./bye.module.css";

export const ByeComponent: React.FC = () => (
  <h1 className={classes.background}>Bye from React</h1>
);
```

Y creamos unos estilos para este componente, con el mismo nombre que el anterior:

_./src/bye.module.css_

```css
.background {
  background-color: lightblue;
}
```

Y lo usamos en el _index.tsx_:

_./src/index.tsx_

```diff
import React from "react";
import { createRoot } from "react-dom/client";
import { HelloComponent } from "./hello.jsx";
+ import { ByeComponent } from "./bye.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <div>
    <HelloComponent />
+   <ByeComponent />
  </div>
);
```

Si ejecutamos la aplicación, vemos que se han aplicado los estilos correctamente, pero si ahora generamos el _bundle_:

```bash
npm run build
```

Vemos que al archivo _css_ no ha añadido un hash delante del nombre de la clase, por lo que si tuviésemos dos clases con el mismo nombre en dos archivos diferentes, no se produciría un conflicto.

```typescript
.vL_zLq_background{background-color:#cd5c5c}.CsNspa_background{background-color:#add8e6}
```
