# 05 List Refactor

## Resumen

Este ejemplo toma como punto de partida el ejemplo _04-list-users_.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Antes de seguir vamos a arreglar un pequeño bug que dejamos en el ejemplo
  anterior, se nos olvido poner la key en el map don de generamos dinámicamente
  la files con los miembros que pertenecen a una organizacion.

_./src/app.tsx_

```diff
{members.map((member) => (
-  <>
+  <React.Fragment key={member.id}>
    <img src={member.avatar_url} />
    <span>{member.id}</span>
    <span>{member.login}</span>
+  </React.Fragment>
- </>
```

- Lo segundo, ahora mismo no estamos tipando la lista de miembros que recibimos de
  github, ¿ No estaría bien tiparla para evitar así cometer fallos tontos al, por ejemplo,
  escribir lo nombres de los campos?, vamos a ello:

_./src/model.ts_

```typescript
export interface MemberEntity {
  avatar_url: string;
  id: string;
  login: string;
}
```

- Vamos ahora a importarlo en nuestro _app.tsx_ y a tipar nuestro estado

_./src/app.tsx_

```diff
import React from "react";
+ import { MemberEntity } from './model';

export const App = () => {
-  const [members, setMembers] = React.useState([]);
+  const [members, setMembers] = React.useState<MemberEntity[]>([]);
```

- Ahora si cometemos una equivocación al escribir uno de los campos en nuestro
  componente fila, el IDE nos lo marcará en rojo.

- La siguiente mejora que vamos a introducir tiene que ver con el JSX que genramos,
  fijate que apenas hemos metido una tabla y ya nos cuesta seguirlo, ¿No podríamos
  simplificar esto? La respuesta si, podemos extraer la parte que pinta un miembro
  en la tabla a un componente, esto lo podemos dejar en el mismo fichero o sacarlo
  a un fichero aparte, vamos a ello:

_./src/member-grid-row.tsx_

```tsx
import React from "react";
import { MemberEntity } from "./model";

interface Props {
  member: MemberEntity;
}

export const MemberTableRow: React.FC<Props> = (props) => {
  const { member } = props;

  return (
    <React.Fragment key={member.id}>
      <img src={member.avatar_url} />
      <span>{member.id}</span>
      <span>{member.login}</span>
    </React.Fragment>
  );
};
```

Fijate que interesante como un componente se queda como una caja negra que expone su interacción con
el exterior vía propiedades.

- Ahora podemos sustituirlo en App:

_./src/app.tsx_

```diff
import React from "react";
import { MemberEntity } from './model';
+ import { MemberTableRow} from './member-grid-row';
```

```diff
  return (
    <div className="user-list-container">
      <span className="header">Avatar</span>
      <span className="header">Id</span>
      <span className="header">Name</span>
      {members.map((member) => (
+          <MemberTableRow key={member.id} member={member}/>
-          <React.Fragment key={member.id}>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <span>{member.login}</span>
-          </React.Fragment>
      ))}
    </div>
  );
```

> Incluso si quisiéramos podríamos crear un subcomponente para las cabecera de la tabla.

- Un último paso, el componente _App_ sigue teniendo demasiado código, debería sólo de instanciar
  el componente principal y punto, vamos a simplificar esto.

- Nos creamos un componente que se llame _member-table.tsx_ y encapsulamos la tabla en dicho componente.

_./src/member-table.tsx_

```tsx
import React from "react";
import { MemberEntity } from "./model";
import { MemberTableRow } from "./member-grid-row";

export const MemberTable = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return (
    <div className="user-list-container">
      <span className="header">Avatar</span>
      <span className="header">Id</span>
      <span className="header">Name</span>
      {members.map((member) => (
        <MemberTableRow key={member.id} member={member} />
      ))}
    </div>
  );
};
```

- Y el componente _App_ se nos queda muy simple:

_./src/app.tsx_

```diff
import React from "react";
- import { MemberEntity } from './model';
+ import {MemberTable} from './member-table';

export const App = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

-  React.useEffect(() => {
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
-  }, []);

  return (
+    <MemberTable/>
-    <>
-      <div className="user-list-container">
-        <span className="header">Avatar</span>
-        <span className="header">Id</span>
-        <span className="header">Name</span>
-        {members.map((member) => (
-          <React.Fragment key={member.id}>
-            <img src={member.avatar_url} />
-            <span>{member.id}</span>
-            <span>{member.login}</span>
-          </React.Fragment>
-        ))}
-      </div>
-    </>
  );
};
```

¿Podemos seguir limpiando este código y montar algo que a futuro se mantenible y escalable? La respuesta es si, lo veremos
más adelante.
