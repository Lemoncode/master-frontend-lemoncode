# 04 Details

## Resumen

Este ejemplo toma como punto de partida el ejemplo _04-detail_.

Vamos a instalar la librería material ui y darle un poco de diseño a nuestra aplicación.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Es hora de maquetar un diálogo de login, vamos a usar _material-ui_
  para tener una aspecto profesional, lo instalamos así como su colección iconos:

```bash
npm install @material-ui/core @material-ui/icons --save
```

- Para estilar usaremos Emotion (CSS in JS), vamos a instalarlo:

```bash
npm install @emotion/css --save
```

- Montemos el diálgo básico de login, de momento no nos centramos
  demasiado en estilado (material-ui trae un montón de ejemplos en vivo, por
  ejemplo los del componente card: https://material-ui.com/components/cards/), ya que estamos a la espera del diseño
  final del creativo:

_./src/login.tsx_

```diff
import React from "react";
import { Link, useHistory } from "react-router-dom";
+ import Card from '@material-ui/core/Card';
+ import CardHeader from '@material-ui/core/CardHeader';
+ import CardContent from '@material-ui/core/CardContent';
+ import TextField from '@material-ui/core/TextField';
+ import Button from '@material-ui/core/Button';
```

_./src/login.tsx_

```diff
+  <Card>
+      <CardHeader title="Login" />
+      <CardContent>
          <form onSubmit={handleNavigation}>
-            <h2>Hello from login page</h2>
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
            <button type="submit">login</button>
          </form>
+      </CardContent>
+  </Card>
```

- Esto empieza a tener buena pinta, vamos a cambiar los inputs y labels por algo con un poco más de estilo.

_./src/login.tsx_

```diff
        <form onSubmit={handleNavigation}>
+          <div style={{display: 'flex',flexDirection: 'column', justifyContent:'center',}}>
+            <TextField label="Name" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
+            <TextField label="Password" type="password" margin="normal" value={password}
+                onChange={(e) => setPassword(e.target.value)} />
+            <Button type="submit" variant="contained" color="primary">
+              Login
+            </Button>
+          </div>
-          <div>
-            <div>
-              <label>Username: </label>
-              <input
-                value={username}
-                onChange={(e) => setUsername(e.target.value)}
-              />
-            </div>
-            <div>
-              <label>Password: </label>
-              <input
-                type="password"
-                value={password}
-                onChange={(e) => setPassword(e.target.value)}
-              />
-            </div>
-          </div>
-
-          <button type="submit">login</button>
        </form>
```

- No esta mal el aspecto, pero se ve raro pegado a la izquierda, ¿ No podríamos
  centrarlo? Correcto vamos a centrar el contenido del cart:

_./src/layouts/login.styles.tsx_

```ts
import { css } from "@emotion/css";

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  margin-top: 2rem;
  @media (min-width: 800px) {
    justify-items: center;
  }
`;
```

- Vamos ahora a aplicarlo a nuestro Card.

_./src/layouts/login.tsx_

```diff
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
+ import * as classes from "./login.styles";
```

_./src/layouts/login.tsx_

```diff
+    <div className={classes.root}>
      <Card>
```

```diff
        </CardContent>
      </Card>
+    </div>
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
