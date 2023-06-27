# 00 Ejemplo básico React Query

Vamos instalar React Query y hacer un ejemplo básico de uso.

Acuerdate de tener 99-server levantando también

# Pasos

Vamos a empezar a por instalar react-query

También vamos a instalar las devtools de react-query

```bash

```

¿Todos instalado? Perfecto

A nivel de aplicación en tenemos que definir un provider, pero antes nos hace falta instancia una instancia de _QueryClient_ que será la que se usara en toda la aplicación:

_./src/core/query.ts_

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

Si queremos podemos definir una serie de opciones globales que aplicarían a todas las consultas:

** Poner, explicar, comentar valors por defecto y quitar ***

_./src/core/query.ts_

```diff
import { QueryClient } from "@tanstack/react-query";

- export const queryClient = new QueryClient();
+ export const queryClient = new QueryClient({
+   defaultOptions: {
+     queries: {
+       refetchOnWindowFocus: false, // Esto es para que no se refresque la página cuando se cambia de pestaña
+       retry: 0, // Esto es para que no se reintenten las peticiones
+       staleTime: 1000 * 60 * 5, // Esto es para indicar que después de 5 minutos los datos se pueden considerar obsoletos
+       cacheTime: 1000 * 60 * 5, // Mantiene en cache los datos (aunque algo esté obsoleto primero lee de aquí y después hace la petición)
+     interval: 1000 * 60 * 5, // Esto es para que cada 5 minutos se refresque la información
+     // (...)
+     },
+   },
+ });
```

Explicar valores:

**TODO

Siguente paso, a nivel de aplicación vamos a definir un provider para poder usar react-query:

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
+ import { queryClient } from "./core/query/query-client";

export const App = () => {
  return (
    <>
+    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/pageb" element={<ListPage />} />
        </Routes>
      </HashRouter>
+      </QueryClientProvider>
    </>
  );
};
```

Y ahora vamos a poner las devtools de react-query:


```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
import { queryClient } from "./core/query/query-client";

export const App = () => {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/pageb" element={<ListPage />} />
        </Routes>
      </HashRouter>
+     <ReactQueryDevtools/>      
      </QueryClientProvider>
    </>
  );
};
```

Esto nos permitirá ir viendo el estado de las diferentes queries que estemos trackeando con react-query, en producción directamente no sale.

Vamos ahora a tirar nuestra primera query con React Query, fíjate que nos cargamos el _useEffect_ que teníamos antes:

_./src/pages/todo/todo-page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
import axios from "axios";
import { TodoItem } from "./todo.model";
+ import { useQuery } from "@tanstack/react-query";

export const TodoPage: React.FC = () => {
-  const [data, setData] = React.useState<TodoItem[]>([]);

-  React.useEffect(() => {
-    axios.get("http://localhost:3000/todos").then((res) => {
-      setData(res.data);
-    });
-  }, []);

+  const { data } = useQuery(
+    ["todolist"],
+    () => {
+      return axios.get("http://localhost:3000/todos").then((res) => {
+        return res.data;
+      });
+    },
+    {}
+  );
```

¿Qué hacemos aquí? Tenemos un hook que se llama _useQuery_ que nos permite hacer una petición y nos devuelve el resultado de la misma, tenemos tres parametros:
  - En el primero identificamos la consulta, así react query la identifica y puede devolvernos datos en caché, o directamente hacer una carga, si te fijas es un array, esto nos permite agrupar consultas y por ejemplo obligar a que recarguen todas las consultas que pertenzcan a un tipo (esto lo veremos más adelante).
  - En el segundo tenemos la función que se ejecutará para obtener los datos, en este caso hacemos una petición a nuestro servidor, aquí lo más importante es que este función 