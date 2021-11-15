# Ejercicio

Vamos a refactorizar este layout, en vez de usar tablas, vamos a usar CSS-Grid.

A tener en cuenta:

Parte de la carpeta _06-list-refactor_.

Podemos usar estilos, lo tenemos preconfigurado en webpack y el fichero del que puedes tirar para añadirlos es _styles.css_.

Como usar estilos en react:

Por ejemplo tenemos en _styles.css_ la siguiente clase:

```css
.my-text {
  color: blue;
}
```

En el JSX debemos usar el atributo _className_ (_class_ es una palabra reservada de XML),
con lo que sería algo así como:

```diff
export const App = () => {
  return (
    <>
+      <h1 className="my-text">prueba</h1>
      <MemberTable />
    </>
  );
};
```

¿Qué pasa si queremos añadir más de un estilo?

por ejemplo en nuestro CSS tenemos, otra clase

```css
.my-font {
  font-family: sans-serif;
}
```

Como quedaría el componente:

```diff
export const App = () => {
  return (
    <>
-      <h1 className="my-text">prueba</h1>
+      <h1 className="my-text my-font">prueba</h1>
      <MemberTable />
    </>
  );
};
```

Más info: https://es.reactjs.org/docs/faq-styling.html

Y cuando terminos, ¿Te animas a hacer una media query para adaptar
el layout a movil (todo en una columna).

# Pistas

Pasos:

- Pongamos en el body una fuente sans-serif para que se vea mejor.
- Crear un contenedor de grid en styles.
- Definir 3 columnas.
- Definir un autorow.
- Definir la primer fila en una fuente bold o lo que sea.
- Añadir el estilo para el resto de filas en las que ponemos foto, id y nombre.

Vamos a cambiar la fuente

_./src/styles_

```css
body {
  font-family: sans-serif;
}
```

Vamos a crear un contenedor de css grid en styles:

_./src/styles_

```css
body {
  font-family: sans-serif;
}

.my-text {
  color: blue;
}

.grid-container {
  display: grid;
  overflow: auto;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: auto;
}
```

Vamos a probar a sacar la cabecera a esta css grid (se verá doble):

_./src/member-table.tsx_

```diff
+ <>
+   <div class="grid-container">
+     <div>Avatar</div>
+     <div>Id</div>
+     <div>Name</div>
+   </div>
    <table className="table">
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <MemberTableRow member={member} />
        ))}
      </tbody>
    </table>
+ </>
```

- Vamos a crearnos un componente: _member-grid-row_

_./member-grid-row.tsx_

```tsx
import React from "react";
import { MemberEntity } from "./model";

interface Props {
  member: MemberEntity;
}

export const MemberGridRow: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <>
      <div>
        <img src={member.avatar_url} style={{ width: "5rem" }} />
      </div>
      <div>
        <span>{member.id}</span>
      </div>
      <div>
        <span>{member.login}</span>
      </div>
    </>
  );
};
```

Y le damos uso en _member-table_

```diff
import { MemberTableRow } from "./member-table-row";
import { MemberGridRow } from "./member-grid-row";

// (...)

  return (
    <>
      <div className="grid-container">
        <div className="header-foto">Avatar</div>
        <div className="header-id ">Id</div>
        <div className="header-nombre">Name</div>
+       <MemberGridRow key={member.id} member={member}>
      </div>
```

Ya podemos borrar el código de member table y el del subcomponente de table row.

Y como haríamos
