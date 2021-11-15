# 06 Refacctor

## Resumen

Este ejemplo toma como punto de partida el ejemplo _05-mui_.

Vamos a reorganizar un poco y estilar el resto de la aplicación utilizando material ui.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a crear una carpeta que se va a llamar pages y volcar las páginas que hemos creado dentro.

La estructura que debe de quedar

```
src
  pages
    detail.tsx
    list.tsx
    login.styles.ts
    login.tsx
```

Y vamos a crear un index:

_./src/pages/index.ts_

```ts
export * from "./login";
export * from "./list";
export * from "./detail";
```

Vamos a arreglar los imports

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
- import { LoginPage } from "./login";
- import { ListPage } from "./list";
- import { DetailPage } from "./detail";
+ import {LoginPage, ListPage, DetailPage} from './pages';
```

- En la página de lista de usuarios vamos a reemplazar lo que hay por una tabla de MUI:

```diff
+ import Table from '@material-ui/core/Table';
+ import TableBody from '@material-ui/core/TableBody';
+ import TableCell from '@material-ui/core/TableCell';
+ import TableContainer from '@material-ui/core/TableContainer';
+ import TableHead from '@material-ui/core/TableHead';
+ import TableRow from '@material-ui/core/TableRow';
+ import Paper from '@material-ui/core/Paper';


  return (
    <>
-      <h2>Hello from List page</h2>
-      <table className="table">
-        <thead>
-          <tr>
-            <th>Avatar</th>
-            <th>Id</th>
-            <th>Name</th>
-          </tr>
-        </thead>
-        <tbody>
-          {members.map((member) => (
-            <tr key={member.id}>
-              <td>
-                <img src={member.avatar_url} style={{ width: "5rem" }} />
-              </td>
-              <td>
-                <span>{member.id}</span>
-              </td>
-              <td>
-                <Link to={generatePath("/detail/:id", { id: member.login })}>
-                  {member.login}
-                </Link>{" "}
-              </td>
-            </tr>
-          ))}
-        </tbody>
-      </table>
+      <TableContainer component={Paper}>
+        <Table aria-label="list table">
+          <TableHead>
+            <TableRow>
+              <TableCell align="right">Avatar</TableCell>
+              <TableCell align="right">Id</TableCell>
+              <TableCell align="right">Name</TableCell>
+            </TableRow>
+          </TableHead>
+          <TableBody>
+            {members.map((member) => (
+              <TableRow key={member.login}>
+                <TableCell>
+                  <img src={member.avatar_url} style={{ width: "2rem" }} />
+                </TableCell>
+                <TableCell align="right">{member.id}</TableCell>
+                <TableCell align="right">
+                  <Link to={generatePath("/detail/:id", { id: member.login })}>
+                    {member.login}
+                  </Link>{" "}
+                </TableCell>
+              </TableRow>
+            ))}
+          </TableBody>
+        </Table>
+      </TableContainer>
+    </>
+  );
```

- Podemos probar y ver como ha quedado:

```bash
npm start
```

- La ficha de usuarios vamos a reemplazarla por un Card de MUI:

_./src/pages/detail.tsx_

```diff
import React from "react";
import { Link, useParams } from "react-router-dom";
+ import { makeStyles } from '@material-ui/core/styles';
+ import Card from '@material-ui/core/Card';
+ import CardActionArea from '@material-ui/core/CardActionArea';
+ import CardActions from '@material-ui/core/CardActions';
+ import CardContent from '@material-ui/core/CardContent';
+ import CardMedia from '@material-ui/core/CardMedia';
+ import Button from '@material-ui/core/Button';
+ import Typography from '@material-ui/core/Typography';


+ const useStyles = makeStyles({
+  root: {
+    maxWidth: 345,
+  },
+  media: {
+    height: 140,
+  },
+ });

interface MemberDetailEntity {
  id: string;
  login: string;
+ avatar_url:string;
  name: string;
  company: string;
  bio: string;
}

const createDefaultMemberDetail = () => ({
  id: "",
  login: "",
+ avatar_url: "",
  name: "",
  company: "",
  bio: "",
});

export const DetailPage: React.FC = () => {
  const [member, setMember] = React.useState<MemberDetailEntity>(
    createDefaultMemberDetail()
  );
  const { id } = useParams();

+  const classes = useStyles();


  React.useEffect(() => {
    fetch(`https://api.github.com/users/${id}`)
      .then((response) => response.json())
      .then((json) => setMember(json));
  }, []);

  return (
    <>
-      <h2>Hello from Detail page</h2>
-      <p> id: {member.id}</p>
-      <p> login: {member.login}</p>
-      <p> name: {member.name}</p>
-      <p> company: {member.company}</p>
-      <p> bio: {member.bio}</p>
-     <Link to="/list">Back to list page</Link>
+    <Card className={classes.root}>
+      <CardActionArea>
+        <CardMedia
+          className={classes.media}
+          image={member.avatar_url}
+          title="Contemplative Reptile"
+        />
+        <CardContent>
+          <Typography gutterBottom variant="h5" component="h2">
+            {member.name}
+          </Typography>
+          <Typography variant="body2" color="textSecondary" component="p">
+            {member.bio}
+          </Typography>
+        </CardContent>
+      </CardActionArea>
+        <CardActions>
+          <Link to="/list">
+            <Button size="small" color="primary">
+              Back to list page
+            </Button>
+          </Link>
+        </CardActions>
+    </Card>
    </>
  );
};
```

- Vamos a arrancar la aplicación y ver que todo sigue funcionando:

```bash
npm start
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
