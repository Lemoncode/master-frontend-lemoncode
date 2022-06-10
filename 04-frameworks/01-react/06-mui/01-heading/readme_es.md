# Mui - AppBar

## Resumen

Vamos ahora a utilizar una Appbar para el componente de la barra de navegación.

Puedes encontrar más info en estos enlaces:

- Mui documentación oficial: https://mui.com/material-ui/react-app-bar/
- Codesandbox: https://codesandbox.io/s/j4q9l0?file=/demo.js

## Pasos

Tenemos un layout de aplicación podemos colocar aquí nuestra _appBar_ de
Mui, y si en el futuro vemos que se hace más compleja, podemos encapsularla
en un fichero propio o promocionarlo a la carpeta común o core.

Nos basasmos en este ejemplo: https://codesandbox.io/s/j4q9l0?file=/demo.js

- Vamos a instalar la librerías de iconos de mui:

```bash
npm install @mui/icons-material --save
```

- Y vamos a implementar la appbar

_./src/layouts/app.layout.tsx_

```diff
import React from "react";
import { ProfileContext } from "@/core/profile";
+ import AppBar from '@mui/material/AppBar';
+ import Box from '@mui/material/Box';
+ import Toolbar from '@mui/material/Toolbar';
+ import Typography from '@mui/material/Typography';
+ import Button from '@mui/material/Button';
+ import IconButton from '@mui/material/IconButton';
+ import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  children: React.ReactNode;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const { userName } = React.useContext(ProfileContext);

  return (
-    <div className="layout-app-container">
-      <div className="layout-app-header">{userName}</div>
-      {children}
-    </div>
+    <>
+    <Box sx={{ flexGrow: 1 }}>
+      <AppBar position="static">
+        <Toolbar>
+          <IconButton
+            size="large"
+            edge="start"
+            color="inherit"
+            aria-label="menu"
+            sx={{ mr: 2 }}
+          >
+            <MenuIcon />
+          </IconButton>
+          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
+            My App
+          </Typography>
+            <Typography variant="h6" component="div">
+              user: {userName}
+            </Typography>
+         </Toolbar>
+      </AppBar>
+    </Box>
+    {children}
+    </>
  );
};
```
