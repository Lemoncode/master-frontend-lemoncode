# 01 Previo - Hola React

## Resumen

En este ejemplo vamos a usar _codesandbox_ para crear nuestro primer proyecto en React.

Puedes encontrar el ejemplo ya implementado en esta URL: https://codesandbox.io/s/intelligent-vaughan-menyg

## Paso a paso

- Codesandbox es una herramienta que nos permite crear proyectos de prueba en React, Angular, Vue,
  o TS / ES6 plano trabajando directamente en nuestro navegador web.

- Si entramos podemos elegir un nuevo proyecto, vamos a seleccionar React + JS.

- Este proyecto se crea usando una plantilla de _create-react-app_, más adelante sabremos más
  sobre este cli, ahora nos vamos a centrar en que estructura tiene una aplicacíon react.

- Primero vamos a abrir el fichero _index.html_ que se encuentra bajo la carpeta public,
  lo más importante que podemos destacar aquí es el siguiente div:

_./public/index.html_

```html
<div id="root"></div>
```

- Ese es el punto de entrada para nuestra aplicación React.

- React es una librería que no está hecha sólo para correr en un navegador web, la podemos
  encontrar también disponible para, por ejemplo, desarrollar aplicaciones móviles con
  _react native_. Nos hace falta una librería intermedia que se encarga de conectar
  React con un navegador web, esta librería es react-dom.

- Es hora de abrirl el fichero que está en _./src/index.js_ aquí vemos como referenciamos
  al div root que hemos creado antes, e invocamos a ReactDom.Render, pasandole:

  - Cómo primer parametros el componente React Raíz que queremos instanciar.
  - Cómo segundo parametro el _div_ donde se va a renderizar (el div id root que creamos anteriormente).

_./public/index.js_

```jsx
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
```

> ¿ Qué es React.StrictMode? Es una ayuda para detectar problemas en tiempo de desarrollo,
> detecta si estamos usando ciclos de vida no seguro de componentes, o apis antiguas,
> más información: https://en.reactjs.org/docs/strict-mode.html

- Ok, acabamos de instanciar un componente que se llama _App_ ¿Donde podemos encontrar esto?
  debajo de _./src/App.js_ en este componente lo que hacemos es mostrar dos textos

```jsx
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```

Si te fijas es un componente de tipo función, que devuelve un elemento con dos hijos (los dos H1)

- Vamos a trabajar un poco más sobre este ejemplo, queremos permitir que el usuario teclee
  un nombre y mostrar este nombre por pantalla.

- Primero nos hace falta guardar el nombre que teclea el usuario en una variable que no
  desaparezca una vez que se ha ejecutado la función, para ello usaremos _react.useState_.

```diff
export default function App() {
+ // React.useState returns an array
+ //   item[0] is the getter (returns the username)
+ //   item[1] is the setter (let us update the state)
+ // That's why we are appliying here destructuring
+ // const [username, setUsername]
+ // const [username, setUsername] = React.useState('No name');
+
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
```

¿Qué diferencia tiene esto con usar una variable? Si usaramos una variable tal cual
esta se detruiría al terminar la función y se volvería a crear cuando volvieramos a ejecutar
la función, al usar _React.useState_ esta función guarda "en un cajón desastre" el valor que
se estaba editando y lo vuelve a inyectar cuando se vuelve a llamar a la función.

- Vamos a mostrar el nombre del usuario que está guardado en ese _state_. Esto lo veremos más en
  detalle luego, pero abramos boca en este ejemplo, en el código que vemos que parece HTML,
  podemos escribir Javascript, ¿Cómo? Encerrandolo entre llaves:

```diff
  return (
    <div className="App">
-      <h1>Hello CodeSandbox</h1>
+      <h1>{username}</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
```

Aquí estamos diciendo en el _h1_, que ejecuta el código javascript que evalua la variable
_username_

- Ahora queremos ir un paso más alla, queremos crear un input que permita al usuario
  editar el nombre del usuario, si ponemos algo así como:

```diff
  return (
    <div className="App">
      <h1>{username}</h1>
-      <h2>Start editing to see some magic happen!</h2>
+      <input value={username}/>
    </div>
  );
```

- Podemos ver como aparece el nombre, pero y si intentamos editar, oye resulta que no se actualiza
  esto ¿Por qué? Tenemos que recordar ahora como funcionaba el flujo undireccional, me llegan los
  datos, el input dispara un rerender (repintado)y vuelve a leer el del valor de la variable.

- El input nos expone un evento, _onChange_ que recibe un parametro estandar del _dom_
  accediente a _e.target.value_ tenemos el nuevo valor.

- Podríamos ahora estar tentados a hacer algo así (OJO esto está mal):

```diff
  return (
    <div className="App">
      <h1>{username}</h1>
      <input value={username}
+        onChange={(e) => username = e.target.value}
      >
    </div>
  );
```

- ¿Qué pasa con esto?

  - Primero que no debemos de mutar la variable _username_, esa variable
    para nosotros es de sólo lectura.

  - Segundo aunque la mutaramos, al volver a repintarse el componente este valor
    se pierde.

- ¿Qué podemos hacer? Utilizar _setUsername_

```diff
  return (
    <div className="App">
      <h1>{username}</h1>
      <input value={username}
-        onChange={(e) => username = e.target.value}
+        onChange={(e) => setUsername(e.target.value)}
      >
    </div>
  );
```

- ¡ Ahora si que funciona! _setUsername_ se encarga de enviar la petición a un sitio que
  seguirá viviendo aunque la función termina, cuando _setState_ se vuelva a invocar
  recupearar la información y tendremos nuestro dato disponible.
