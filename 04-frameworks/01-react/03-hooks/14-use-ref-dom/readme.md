# 14 React.useRef DOM

En el ejemplo anterior introdujimos el hook _userRef_, en este ejemplo
vamos a usarlo para acceder a un nodo del dom.

# Steps

- Tomamos como punto de partida _13-async-closure_, copiamos el contenido
  y hacemos un _npm install_.

```bash
npm install
```

- En _demo.js_ pegamos el siguiente código (fijate que aquí definimos
  el _useRef_ y lo asociamos en el _div_ container)

_./src/demo.js_

```jsx
import React from "react";

export const MyComponent = () => {
  const containerElementRef = React.useRef(null);

  return <div className="container" ref={containerElementRef} />;
};
```

- Vamos a darle un estilo a ese div para distinguirlo.

_./styles.css_

```diff
.my-text {
  color: blue;
}

+.container {
+  border: 1px solid steelblue;
+  margin: 15px;
+  padding: 50px;
+}
```

- En este ejemplo vamos a mostrar el ancho actual del contenedor usando el _ref_ asociado
  a este elemento del _dom_

```diff
import React from "react";

export const MyComponent = () => {
  const containerElementRef = React.useRef(null);
+ const [message, setMessage] = React.useState(
+   "Click button to get container width"
+ );

+ const calculateContainerWidth = () => {
+   setMessage(`Container width: ${containerElementRef.current.clientWidth}px`);
+ };

  return (
    <div className="container" ref={containerElementRef}>
+     <h2>{message}</h2>
+     <button onClick={calculateContainerWidth}>
+       Calculate container width
+     </button>
    </div>
  );
};
```

- Si ejecutamos, podemos ver como ahora nos da el resultado actual cuando pulsamos
  en el botón.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
