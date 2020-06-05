# 04 Details

## Resumen

Este ejemplo toma como punto de partida el ejemplo _03-list_.

Vamos a mostrar el detalle de un usuario de Github: para ellos
nos quedamos con el id del usuario que elejimos en la lista,
llamamos a la API de Github para obtener sus detalles, y los
mostramos en un componente.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Si queremos ver que tipo de datos vamos a manejar, podemos abrir el navegador web y ver que devuelve la API Rest de Github.

```bash
https://api.github.com/users/brauliodiez
```

> Con lo que has hecho en ejemplos anteriores sería capaz de montar
> esta página tu sólo, te aconsejo que les des a la pause en este
> ejercicio y lo pruebes.

- Vamos a crearnos un interfaz para tener tipada para mostrar
  los detalles de un miembro.

_./src/detail.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";

+ interface MemberDetailEntity {
+   id : string;
+   login: string;
+   name: string;
+   company: string;
+   bio: string;
+ }
+
+ const createDefaultMemberDetail = () => ({
+   id: '',
+   login: '',
+   name: '',
+   company: '',
+   bio: '',
+ })
+
export const DetailPage: React.FC = () => {
+  const [member, setMember] = React.useState<MemberDetailEntity>(createDefaultMemberDetail());
  const { id } = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
      <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

- Vamos a ahor a hacer la carga de datos:

_./src/detail.tsx_

```diff
export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>();
  const { id } = useParams();

+  React.useEffect(() => {
+    fetch(`https://api.github.com/users/${id}`)
+      .then((response) => response.json())
+      .then((json) => setMember(json));
+  }, []);


  return (
    <>
      <h2>Hello from Detail page</h2>
      <h3>User Id: {id}</h3>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

- Vamos a mostraro los datos:

_./src/detail.tsx_

```diff
export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>();
  const { id } = useParams();

  return (
    <>
      <h2>Hello from Detail page</h2>
-      <h3>User Id: {id}</h3>
+      <span> id: {member.id}</span>
+      <span> login: {member.login}</span>
+      <span> name: {member.name}</span>
+      <span> company: {member.company}</span>
+      <span> bio: {member.bio}</span>
      <Link to="/list">Back to list page</Link>
    </>
  );
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
