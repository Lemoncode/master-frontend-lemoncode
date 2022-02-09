# CSS Modules

Vamos a comprobar lo fácil que es integrar los módulos css en el _bundle_.

# Pasos para contruirlo

## Prerequisitos

Instala [Node.js and npm](https://nodejs.org/en/) (min v8.9) si aún no está instalado en tu computadora.

> Verifica que estás ejecuatando al menos node v8.x.x and npm 5.x.x ejecutando `node -v` and `npm -v` en una terminal/consola. Las versiones anteriores pueden producir errores.

## Pasos

- Partimos de _07-react_. Sólo hay que copiar el proyecto y ejecutar _npm install_

```bash
npm install
```

- Vamos a intalar _postcss-modules_

```bash
npm install postcss-modules --save-dev
```

- Añadimos el archivo _postcssrc_

_./.postcssrc_

```javascript
{
  "modules": true,
  "plugins": {
    "postcss-modules": {
      "generateScopedName": "_[name]__[local]"
    }
  }
}
```

- Vamos a añadir algunos estilos en el archivo [_mystyles.scss_]

```css

.hello {
  background-color: $blue-color;

  .logo{
    width:150px;
  }
}
```

- Ahora vamos a modificar el componente llamado **HelloComponent** en el archivo [_hello.tsx_]. Vamos a importar el archivo _scss_ y utilizar el módulo de clases.

```javascript
import React from "react";
const logo = require("./content/logo_1.png");
const classes = require("./mystyles.scss");

export const HelloComponent: React.FC = () => {
  return (
    <div className={classes.hello}>
      <img src={logo} className={classes.logo}/>
      <h2>Hello from React</h2>      
    </div>
  );
};
```

> Si recibes una advertencia sobre el uso de _required_, prueba: npm i @types/node --save-dev

- Vamos a ejecutar el ejemplo.

```bash
npm start
```