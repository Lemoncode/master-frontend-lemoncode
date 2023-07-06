# 00 Ejemplo básico React Query

Vamos instalar React Query y hacer un ejemplo básico de uso.

Acuerdate de tener 99-server levantando también

# Pasos

Vamos a empezar a por instalar react-query

```bash
npm install @tanstack/react-query --save
```

También vamos a instalar las devtools de react-query

```bash
npm install @tanstack/react-query-devtools --save-dev
```

¿Todos instalado? Perfecto

A nivel de aplicación en tenemos que definir un provider, pero antes nos hace falta instancia una instancia de _QueryClient_ que será la que se usara en toda la aplicación:

_./src/core/query.ts_

```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

Si queremos podemos definir una serie de opciones globales que aplicarían a todas las consultas:

_./src/core/query/query-client_

```diff
import { QueryClient } from "@tanstack/react-query";

- export const queryClient = new QueryClient();
+ export const queryClient = new QueryClient({
+   defaultOptions: {
+     queries: {
+       refetchOnWindowFocus: true,
+       refetchOnMount: true,
+       retry: 0,
+       staleTime: 1000 * 60 * 5,
+       cacheTime: 1000 * 60 * 5,
+             refetchInterval: 1000 * 60 * 5,
+     },
+   },
+ });
```

¿Que quieren decir estos valores?

- refetchOnWindowFocus: Esto es para que no se refresque la página cuando se cambia de pestaña.
- refetchOnMount: Esto es para que se refresque la página cuando se carga.
- retry: Esto es para que no se reintenten las peticiones.
- staleTime: Esto es para indicar que después de 5 minutos los datos se pueden considerar obsoletos.
- cacheTime: Mantiene en cache los datos (aunque algo esté obsoleto primero lee de aquí y después hace la petición).
- interval: Esto es para que cada 5 minutos se refresque la información.

Siguiente paso, a nivel de aplicación vamos a definir un provider para poder usar react-query:

_./src/app.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";
+ import { QueryClientProvider } from "@tanstack/react-query";
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
+      })
+      .catch((err) => {
+         // Esto lo mejoraremos luego
+         alert(`¿Server levantado?`);
+      });
+    },
+    {}
+  );
```

¿Qué hacemos aquí? Tenemos un hook que se llama _useQuery_ que nos permite hacer una petición y nos devuelve el resultado de la misma, tenemos tres parámetros:

- En el primero identificamos la consulta, así react query la identifica y puede devolvernos datos en caché, o directamente hacer una carga, si te fijas es un array, esto nos permite agrupar consultas y por ejemplo obligar a que recarguen todas las consultas que pertenezcan a un tipo (esto lo veremos más adelante).
- En el segundo tenemos la función que se ejecutará para obtener los datos, en este caso hacemos una petición a nuestro servidor, aquí lo más importante es que este función

Vamos ahora a hacer algún cambio en el servidor (abrimos JSON, modificamos y grabamos), si ahora volvemos a la ventana... voila !

Vemos que se ha refrescado la información :) ¿Qué clase de brujería es esta?

Pues resulta que por defecto la opción _refetchOnWindowFocus_ y al volver el foco a la ventana automáticamente recarga los datos, esto lo podemos configurar a tanto a nivel global como de consulta.

Veamos como desactivarlo y ver que pasa:

```diff
  const { data } = useQuery(
    ["todolist"],
    () => {
      return axios.get("http://localhost:3000/todos").then((res) => {
        return res.data;
      });
    },
    {
+     refetchOnWindowFocus: false,
    }
  );
```

¿Interesante verdad? A golpe de comando podemos habilitar / deshabilitar estos flags tanto a nivel global como a nivel de query.

Por otro lado, fíjate en las dev tools:

- Me dice que consultas tengo.
- Qué estado tienen.
- Puedo incluso relanzarlas.

Bueno, hasta aquí el _happy path_, vamos a tirar abajo la api rest y ver que pasa:

_Paramos al rest api de todos_

¿Qué pasa aquí? Pues que se nos queda pillado el alert de algo salió mal, _react-query_ reintentar la query una y otra vez ¿No sería mejor mostrar el mensaje y darle al usuario un botón de reintentar como hace por ejemplo _GMail_? (bueno GMail también reintenta cada X minutos...), vamos a jugar con esto:

Empecemos por tener un flag que nos indique si estamos en modo error o no, y conectémoslo con React Query

```diff
export const TodoPage: React.FC = () => {
+ const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

  const { data } = useQuery(
    ["todolist"],
    () => {
      return axios
        .get("http://localhost:3000/todos")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          alert(`¿Server levantado?`);
        });
    },
    {
+     enabled: !isTodosEndPointDown,
    }
  );

```

Ahora, cuando de error, vamos a deshabilitar la query:

```diff
      return axios
        .get("http://localhost:3000/todos")
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
+        setIsTodosEndPointDown(true);
          alert(`¿Server levantado?`);
        });
```

Vamos a probar a ver que tal.

Oye funciona... ya que estamos, vamos a utilizar la gestíon de errors de _react query_

Añadimos un botón de reconectar que sólo será visible cuando esté desconectado el server, y que ponga la query a enabled (si falla una vez se desactivará), para que sea más cómodo vamos a usar el control de errores de _React Query_:

```diff
-  const { data } = useQuery(
+  const { data, isError} = useQuery(
    ["todolist"],
    () => {
      return axios
        .get("http://localhost:3000/todos")
        .then((res) => {
          return res.data;
        })
-        .catch((err) => {
-          setIsTodosEndPointDown(true);
-          alert(`¿Server levantado?`);
-        });
    },
    {
      enabled: !isTodosEndPointDown,
    }
  );
```

```diff
+ React.useEffect(() => {
+   if (isError) {
+     setIsTodosEndPointDown(true);
+   }
+ }, [isError]);
```

Y vamos añadir un botón para intentar reconectar en caso de error:

```diff
  );

+ if(isError) {
+   return <button onClick={() => setIsTodosEndPointDown(false)}>Reconectar</button>
+ }

  return (
```

Vale, esto va pero al rato ¿Qué está pasando? Que por defecto _react-query_ antes de dar por perdida una llamada, realiza varios reintentos, vamos a desactivarlo:

```diff
    {
      enabled: !isTodosEndPointDown,
+     retry: false,
    }
```

Ahora si que lo tenemos, es más vamos a probar a arrancar y para el servidor a ver que pasa.

> React query también trae [integración con ErrorBoundaries](https://tkdodo.eu/blog/react-query-error-handling)

¿Para que casos adicionales nos puede servir esto?

- Entramos en modo edición y no queremos que se hagan recargas.
- Queremos pausar temporalmente el refetch.
- ...
