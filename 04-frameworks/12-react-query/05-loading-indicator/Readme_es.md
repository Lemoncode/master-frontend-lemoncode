# Introducción

Esto está muy bien, pero hay ocasiones en las que quiero mostrar un indicador de que estoy cargando datos:

- Igual quiero mostrar un pequeño icono en el que se indique que hay una carga en progreso.
- Igual quiero bloquear el interfaz de usuario o un áreas porque estoy cargando datos críticos.

Por otro lado puede que hayan varias peticiones en marcha a la vez.

# Paso a paso

Vamos a ver que ofrece React Query, en cada consulta nos da un indicador para decirnos si esta cargando o no (es más hay flags para saber si es primera carga).

¿Cómo funcionaría? Vamos a hacer algo básico, _userQuery_ nos devuelve entre otros:
_isLoading_ e _isFetching_, vamos a probarlo:

_./src/pages/todo/todo.page.tsx_

```diff
  const [editingId, setEditingId] = React.useState(-1);
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

-  const { loadTodoList, appendMutation, updateMutation } = useTodoQueries();
+ const { loadTodoList, appendMutation, updateMutation, isLoading, isFetching } = useTodoQueries();

  const { data, isError } = loadTodoList(!isTodosEndPointDown);

+  React.useEffect(() => {
+    if (isFetching) {
+      console.log("Fetching...");
+    } else {
+      console.log("Done Fetching...");
+    }
+  }, [isFetching]);
```

Si abrimos la consola podemos ver que se muestra el mensaje de _Loading..._ y _Done loading..._.

¿Qué diferencia hay entre _isLoading_ e _isFetching_?

- _isLoading_ se ejecuta sólo la primera vez que se cargan los datos.
- _isFetching_ cada vez que se hace un fetch.

Vamos a probarlo, vamos a añadir un botón para forzar la carga de datos (así aprendemos otra forma de forzard que se vuelva a lanzar una consulta):

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

  const { loadTodoList, appendMutation, updateMutation } = useTodoQueries();

-  const { data, isError } = loadTodoList(!isTodosEndPointDown);
+  const { data, isError, refetch } = loadTodoList(!isTodosEndPointDown);
```

```diff
      <TodoAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
        onAppend={handleAppend}
      />
+      <button onClick={() => refetch()}>Force load</button>
      <Link to="/pageb">To Page B</Link>
    </>
```

Y vamos a escuchar a _isLoading_

```diff
  React.useEffect(() => {
    if (isFetching) {
      console.log("Fetching...");
    } else {
      console.log("Done Fetching...");
    }
  }, [isFetching]);
+
+  React.useEffect(() => {
+    if (isLoading) {
+      console.log("Loading...");
+    } else {
+      console.log("Done loading...");
+    }
+  }, [isLoading]);
```

Vamos a ver que tal funciona esto:

```bash
npm start
```

Interesante ¿Verdad? ¿Y si queremos mezclar esto con una librería de tracking de indicador de carga? ¿Por qué hacer esto? Imaginate que por ejemplo quieres llevar el tracking de varias promesas, vamos a hacer una prueba rápida:

- Vamos a instalar la librería react-promise-tracker

```bash
npm install react-promise-tracker --save
```

Y vamos a instalar una librerías de animaciones que muestran spinners:

```bash
npm install react-loader-spinner --save
```

Vamos a crear un componente de UI que muestre un indicador de carga:

¿Qué hacemos aquí? En el hook _usePromiseTracker_ tenemos un flag _promiseInProgress_ que nos indica si hay alguna promesa en progreso, vamos a usarlo para mostrar un indicador de carga.

_./src/common/loading-indicator.component.tsx_

```tsx
import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    promiseInProgress && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThreeDots color="#2BAD60" height="100" width="100" />
      </div>
    )
  );
};
```

Vamos a configurarlo a nivel de aplicación:

_./src/app.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage, TodoItemPage } from "./pages";
import { queryClient } from "./core/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
+ import { LoadingIndicator } from "./common/loading-indicator.component";
```

```diff
export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/pageb" element={<ListPage />} />
            <Route path="/todo-item/:id" element={<TodoItemPage />} />
          </Routes>
        </HashRouter>
        <ReactQueryDevtools />
+        <LoadingIndicator />
      </QueryClientProvider>
    </>
  );
};
```

Y ahora donde lanzamos las consultas vamos a indicarle que haga un _trackPromise_

```diff
+ import { trackPromise } from "react-promise-tracker";
// (...)

  const loadTodoList = (disableQuery: boolean) => {
    return useQuery(
      todoKeys.todoList(),
      () => {
-        return getTodoList();
+        return trackPromise(getTodoList());
      },
      {
        enabled: disableQuery,
        retry: false,
      }
    );
  };
```

Para probarlo podemos cambiar el modo network a 3G (F12)

```bash
npm start
```
