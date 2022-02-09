# React

Vamos a comprobar lo fácil que es integrar _jsx_ en el _bundle_.

# Pasos para contruirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Partimos de _06-typescript_. Sólo hay que copiar el proyecto y ejecutar _npm install_

```bash
npm install
```

- Vamos a instalar _react_ and _react-dom_

```bash
npm install react react-dom --save
```

- Vamos a instalar las tipificaciones

```bash
npm install @types/react @types/react-dom
```

- Vamos a crear un componente llamado **HelloComponent** en el archivo [_hello.jsx_](src/hello.jsx) (./src/hello.jsx)

_./src/hello.tsx_

```javascript
import React from "react";

export const HelloComponent: React.FC = () => {
  return <h2>Hello from React</h2>;
};
```

- Ahora vamos a crear en el archivo [_index.html_](src/index.html) (./src/index.html) un _div_ contenedor para instanciar nuestra aplicación _react_. Movamos también la etiqueta _script_ a la parte inferior del _body_ (para asegurar que la raíz del _div_ estará disponible cuando el _script_ se ejecute).

_./src/index.html_

```diff
<html>
<body>
+  <div id="root">
+  </div>
   <script type="module" src="./index.ts"></script>
</body>
</html>
```

- Vamos a crear el punto de entrada en el archivo [_index.ts_](src/index.ts) (./src/index.tsx)

_./src/index.tsx_

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { HelloComponent } from './hello';

   ReactDOM.render(
     <HelloComponent />,
     document.getElementById('root')
   );
```

- Actualicemos _index.html_