# Mui - List

## Resumen

Vamos a crear una lista, partiremos del ejemplo anterior _01-heading_.

Puedes encontrar más info en estos enlaces:

- Mui documentación oficial: https://mui.com/material-ui/react-list/

## Pasos

Vamos a modificar el componente _ListComponent_ definido en _src/pods/list/list.component.tsx_.

Primero vamos a importar los componentes de MUI que vamos a utilizar para crear la lista:

```diff
import { routes } from "@/core";
import React from "react";
- import { Link } from "react-router-dom";
+ import { useNavigate } from "react-router-dom";
import { MemberEntity } from "./list.vm";
- import css from "./list.styles.css";
- import classNames from "classnames";
+ import List from "@mui/material/List";
+ import ListItem from "@mui/material/ListItem";
+ import Divider from "@mui/material/Divider";
+ import ListItemText from "@mui/material/ListItemText";
+ import ListItemAvatar from "@mui/material/ListItemAvatar";
+ import Avatar from "@mui/material/Avatar";
+ import Typography from "@mui/material/Typography";
+ import ListItemButton from "@mui/material/ListItemButton";
```

Y vamos a utilizarlos para sustitiur los elementos _div_ y _span_ con los que ahora se renderiza la lista. Podemos basarnos en los ejemplos de uso que encontrarás en la página de MUI: https://mui.com/material-ui/react-list/

_pods/list/list.component.tsx_

```diff
export const ListComponent: React.FC<Props> = (props) => {
  const { members } = props;
+  const navigate = useNavigate();

  return (
    <>
      <h2>Hello from List page</h2>
-     <div className={classNames(css.container, css.someAdditionalClass)}>
-       <span className={css.header}>Avatar</span>
-       <span className={css.header}>Id</span>
-       <span className={css.header}>Name</span>
+      <List>
        {members.map((member) => (
          <>
-           <img src={member.avatar_url} />
-             <span>{member.id}</span>
-             <Link to={routes.details(member.login)}>{member.login}</Link>
+           <ListItem key={member.id} disablePadding>
+             <ListItemButton
+               role={undefined}
+               onClick={() => navigate(routes.details(member.login))}
+               dense
+             >
+               <ListItemAvatar>
+                 <Avatar alt={member.login} src={member.avatar_url} />
+               </ListItemAvatar>
+               <ListItemText
+                 primary={member.login}
+                 secondary={<Typography>{member.id}</Typography>}
+               />
+             </ListItemButton>
+           </ListItem>
+           <Divider />
          </>
        ))}
+      </List>
    </>
  );
};
```
