# Introducción

Vamos a ver que pasa si queremos mostrar un solo elemento de una lista, en una página separada.

# Pasos

- Vamos a empezar a crear la página de detalle de un item, para ello vamos a crear un nuevo componente:

_./src/pages/todo-item/todo-item.page.tsx_

```tsx
import * as React from "react";

export const TodoItemPage = () => {
  return <h1>Todo item page</h1>;
};
```

Lo añadimos a nuestro index:

_./src/pages/index.ts_

```diff
export * from "./todo/todo.page";
export * from "./pageb/list.page";
+ export * from "./todo-item/todo-item.page";
```

- Vamos a añadir una nueva ruta en nuestro router:

_./src/app.tsx_

```diff
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
- import { TodoPage, ListPage } from "./pages";
+ import { TodoPage, ListPage, TodoItemPage } from "./pages";
import { queryClient } from "./core/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<TodoPage />} />
            <Route path="/pageb" element={<ListPage />} />
+          <Route path="/todo-item/:id" element={<TodoItemPage />} />
          </Routes>
        </HashRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
};
```

En TODO page vamos a añadir un enlace en cada item para poder navegar al detalle:

_./src/pages/todo/components/todo-item-display.component.tsx_

```diff
import React from "react";
+ import { Link } from "react-router-dom";
import { TodoItem } from "../todo.model";
```

```diff
- <div>{item.description}</div>
+ <div><Link to={`/todo-item/${item.id}`}>{item.description}</Link></div>
```

En la página de detalle vamos a leer el parámetro que nos viene de la url:

_./src/pages/todo-item/todo-item.page.tsx_

```diff
import * as React from "react";
+ import { useParams } from "react-router-dom";

export const TodoItemPage = () => {
+ const { id } = useParams();

-  return <h1>Todo item page: </h1>;
+  return (<div>
+            <h2>Todo Id: {id}</h2>
+            <h2>Done: </h2>
+            <h2>Description: </h2>
+          </div>)
};
```

Como estamos separando en silos, vamos a crear un modelo repetido para nuestra API (en una aplicación sería muy normal, tener una API para el listado que tiene menos elementos, y el de detalle que tiene más).

_./src/pages/todo-item/todo.model.ts_

```ts
export interface TodoItem {
  id: string;
  description: string;
  done: boolean;
}
```

Vamos a crear un fichero de API para carga un sólo item de la lista usando axios y then:

_./src/pages/todo-item/todo-item.api.ts_

```ts
import axios from "axios";
import { TodoItem } from "./todo.model";

const url = "http://localhost:3001";

export const getTodoItem = (id: string): Promise<TodoItem> => {
  return axios
    .get<TodoItem>(`${url}/todos/${id}`)
    .then((response) => response.data);
};
```

Esta feo eso de tener la constante de la url repetida en dos sitio, lo ideal sería pasarlo como una variable de entorno, de momento nos vamos a crear una carpeta core y lo movemos allí.

_./src/core/constants.ts_

```ts
export const url = "http://localhost:3000";
```

Y refactorizamos (aquí podemos echar de menos los alias para los paths):

_./src/pages/todo-item/todo-item.api.ts_

```diff
import axios from "axios";
import { TodoItem } from "../todo.model";
+ import { url } from "../../core/constants";

- const url = "http://localhost:3001";

export const getTodoItem = (id: string) => {
  return axios.get<TodoItem>(`${url}/todos/${id}`).then((response) => response.data);
};
```

> Habría que realizar este cambio en la lista de todos también

Ahora vamos a definir una consulta con react-query para cargar un sólo item, pero nos encontramos con un problema y es que las keys para todo las tenemos definidas a nivel de todos así que vamos moverlas a _core_ y compartirlas.

Las eliminamos de la lista de TODO, y la movemos a core

_./src/core/query/query-keys.ts_

```ts
export const todoKeys = {
  all: ["todo"] as const,
  todoList: () => [...todoKeys.all, "todoList"] as const,
};
```

Vamos añadir un _todoItem_:

_./src/core/query/query-keys.ts_

```diff
export const todoKeys = {
  all: ["todo"] as const,
  todoList: () => [...todoKeys.all, "todoList"] as const,
+  todoItem: () => [...todoKeys.all, "todoItem"] as const,
};
```

Y arreglamos el import en _todo.page.tsx_

_./src/pages/todo/todo.page.tsx_

```diff
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoAppendComponent, TodoItemComponent } from "./components";
- import { todoKeys } from "./todo-key-queries";
+ import { todoKeys } from "../../core/query/query-keys";
```

Vamos ahora a integrarlo con React Query:

_./src/pages/todo-item/todo-item.page.tsx_

```diff
import * as React from "react";
import { useParams } from "react-router-dom";
+ import { todoKeys } from "../../core/query/query-keys";
+ import { useQuery, useQueryClient } from "@tanstack/react-query";
+ import { getTodoItem } from "./todo-item.api";

+ const useTodoQueries = () => {
+  const queryClient = useQueryClient();
+
+  const loadTodoItem = (id: string, disableQuery: boolean) => {
+    return useQuery(
+      [...todoKeys.todoItem(), id],
+      () => {
+        return getTodoItem(id);
+      },
+      {
+        enabled: disableQuery,
+        retry: false,
+      }
+    );
+  };
+
+  return { loadTodoItem };
+};


export const TodoItemPage = () => {
  const { id } = useParams();

+ const { loadTodoItem } = useTodoQueries();
+ // TODO: dejamos el isError de momento
+ const { data  } = loadTodoItem(false);

  return (
    <div>
      <h2>Todo Id: {id}</h2>
-        <h2>Done: </h2>
-        <h2>Description: </h2>
+      { data &&
+         <>
+         <h2>Done: {(data.IsDone) ? 'Done' : 'Pending'}</h2>
+         <h2>Description: {data.description}</h2>
+         </>
+      }
    </div>
  );
};

```
