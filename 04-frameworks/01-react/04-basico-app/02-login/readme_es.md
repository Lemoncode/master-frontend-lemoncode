# 02 Login

## Resumen

Este ejemplo toma como punto de partida el ejemplo _01-routing_.

Vamos a montar una formulario de login, en el que el usuario introduce
su id y clave y al pulsar el botón de login se valida, si introduce
la combinación "admin" "test" puede pasar a la ventana de listado.

El objetivo de este ejemplo es cubrir un escenario muy básico que te
permita ver como funciona react manejando informacíon como esta.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a maquetar un formulario simple de login:

_./src/login.tsx_

```diff
import React from "react";
import { Link, useHistory } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const history = useHistory();

  const handleNavigation = () => {
    history.push("/list");
  };

  return (
    <>
      <h2>Hello from login page</h2>
+      <div>
+        <div>
+          <label>Username: </label>
+          <input value="" />
+        </div>
+        <div>
+          <label>Password: </label>
+          <input type="password" value="" />
+        </div>
+      </div>
      <button onClick={handleNavigation}>Login</button>
    </>
  );
};
```

- Ahora vamos a guardar en el estado el valor de username y de la clave

_./src/login.tsx_

```diff
export const LoginPage: React.FC = () => {
  const history = useHistory();
+ const [username, setUsername] = React.useState('');
+ const [password, setPassword] = React.useState('');

  const handleNavigation = () => {
    history.push("/list");
  };

  return (
    <>
      <h2>Hello from login page</h2>
      <div>
        <div>
          <label>Username: </label>
-          <input value="" />
+          <input value={username} onChange={e => setUsername(e.target.value)} />

        </div>
        <div>
          <label>Password: </label>
          <input type="password" value="" />
+         <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>
```

- Y ahora vamos al click de login, cuando se pulsa comprobamos si el usuario
  y la clave son (admin / test) si es correcto navegamos a listado, si no
  mostramos un mensaje.

_./src/login.tsx_

```diff
export const LoginPage: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleNavigation = () => {
+   if(username === 'admin' && password === 'test') {
      history.push("/list");
+   } else {
+     alert("User / password not valid, psst... admin / test")
+   }
  };
```

- Para terminar vamos a hace run refactor con el formulario de login,
  vamos a meterlo dentro de un formulario, ¿ Por qué, así lo hacemos
  más accesible y por ejeemplo el botón de envío se ejecuta al pulsar enter.

```diff
  return (
-    <>
+    <form onSubmit={handleNavigation}>
      <h2>Hello from login page</h2>
      <div>
        <div>
          <label>Username: </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

-      <button onClick={handleNavigation}>Login</button>
+      <button type="submit">login</button>
-    </>
+    </form>
```

- Esto parece que funciona... pero si nos fijamos el submit del
  formulario está haciendo un post a servidor, tenemos decirle
  que no realizar ese coportamiento por defecto.

```diff
-  const handleNavigation = () => {
+  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
+    e.preventDefault();

    if (username === "admin" && password === "test") {
      history.push("/list");
    } else {
      alert("User / password not valid, psst... admin / test");
    }
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
