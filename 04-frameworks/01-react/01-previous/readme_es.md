# 01 Previo - Hola React

## Resumen

En este ejemplo vamos a crear un _codesandbox_ para entender los primeros conceptos y los motivos principales por los que necesitamos una librería como React.

Para ellos nos vamos a abrir un codesandbox de vanilla javascript. El ejemplo terminado ya lo tenéis aquí.

Vamos a intentar crear una aplicación en javascript, muy sencilla, a la que vamos a ir metiéndole poco a poco conceptos básicos. La idea es que al final nos quede algo parecido a React.

## Paso a paso

- Renombramos _index.mjs_ a _index.js_. Renombramos también en el fichero _index.html_.

- Comentamos todo el contenido de _index.js_.

- En el fichero _index.html_ vamos a renderizar una lista sencilla con datos.

_index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Sandbox</title>
    <meta charset="UTF-8" />
  </head>

  <body>
-    <div id="app"></div>
+    <div id="app">
+      <h4>Lista de usuarios</h4>
+      <div>1955: Rick Sánchez</div>
+      <div>8765: Beth Harmon</div>
+      <div>7562: Farrokh Bulsara</div>
+    </div>
    <script src="./index.js" type="module"></script>
  </body>
</html>
```

Esto funcionará, aunque frameworks como React nos ofrecen un enfoque diferente: permiten manipular o transformar el _index.html_ directamente en el cliente. De esta manera, el servidor no necesita generar un documento completo en cada petición. En su lugar, basta con entregar un _index.html_ básico junto con un archivo JavaScript que, una vez descargado, se encargará de transformar dinámicamente el contenido de la página.

Como primer paso vamos a hacer que el contenido de nuestro _index.html_ lo genere el fichero de javascript. Así, dejamos _index.html_ como estaba:

_index.html_

```diff
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Sandbox</title>
    <meta charset="UTF-8" />
  </head>

  <body>
+    <div id="app"></div>
-    <div id="app">
-      <h4>Lista de usuarios</h4>
-      <div>1955: Rick Sánchez</div>
-      <div>8765: Beth Harmon</div>
-      <div>7562: Farrokh Bulsara</div>
-    </div>
    <script src="./index.js" type="module"></script>
  </body>
</html>
```

Asignamos a la propiedad `innerHTML` el contenido que queremos renderizar, es decir, la lista:

_index.js_

```diff
+   import "./styles.css";

+   document.getElementById("app").innerHTML = `
+     <h4>Lista de usuarios</h4>
+     <div>1955: Rick Sánchez</div>
+     <div>8765: Beth Harmon</div>
+     <div>7562: Farrokh Bulsara</div>
+   `;
```

Comprobamos que es el fichero de JavaScript el que me genera el contenido.

Vamos a ir partiendo nuestra lista en partes. Para ello primero segregamos el título:

```diff
 import "./styles.css";

+   const Header = () => {
+     return ` <h4>Lista de usuarios</h4>`;
+   };
+
    document.getElementById("app").innerHTML = `
-       <h4>Lista de usuarios</h4>
+       ${Header()}
        <div>1955: Rick Sánchez</div>
        <div>8765: Beth Harmon</div>
        <div>7562: Farrokh Bulsara</div>
```

A esta función que acabamos de crear, en React, la vamos a llamar componente. Es decir, **en React los componentes son funciones.** Por el momento este componente nos devuelve un trocito de nuestra aplicación, en este caso el título, que renderiza algo en el DOM.

Vamos a seguir rompiendo o componentizando nuestra aplicación en más trocitos.

Vamos a crear un componente nuevo que nos devuelva la lista únicamente.

```diff
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

+   const List = () => {
+     return `
+       <div>
+         <div>1955: Rick Sánchez</div>
+         <div>8765: Beth Harmon</div>
+         <div>7562: Farrokh Bulsara</div>
+       </div>`;
+   };

document.getElementById("app").innerHTML = `
    ${Header()}
-       <div>1955: Rick Sánchez</div>
-       <div>8765: Beth Harmon</div>
-       <div>7562: Farrokh Bulsara</div>
+       ${List()}
`;
```

Vamos a crear ahora un componente que me renderice en el DOM, cada usuario. Para ello vamos a crear un componente (función) que reciba un objeto usuario con un `id` y un `name`:

```diff
import "./styles.css";

const Header = () => {
  return `<h4>Lista de usuarios</h4>`;
};

+   const User = (props) => {
+     return `<div>${props.id}: ${props.name}</div>`;
+   };

const List = () => {
  return `
    <div>
+         ${User({id: 1955, name 'Rick Sánchez'})}
+         ${User({id: 8765, name 'Beth Harmon'})}
+         ${User({id: 7562, name 'Farrokh Bulsara'})}
-         <div>1955: Rick Sánchez</div>
-         <div>8765: Beth Harmon</div>
-         <div>7562: Farrokh Bulsara</div>
    </div>`;
};

document.getElementById("app").innerHTML = `
    ${Header()}
    ${List()}
`;
```

Esos datos que le estamos pasando a la función se les conoce por el nombre de `props`. En React, la sintaxis para ejecutar un componente es muy distinta a esta, la veremos muy pronto. Sin embargo, es muy importante tener en cuenta de que a pesar de que esta sintaxis sea distinta, al final lo que estamos haciendo es invocar funciones y pasarles parámetros de entrada.
