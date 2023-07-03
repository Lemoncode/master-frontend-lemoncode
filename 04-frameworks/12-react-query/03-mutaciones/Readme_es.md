# Introducción

Partimos del ejemplo anterior, vamos a reorganizar el código e implementar una actualización contra el servidor.

# Pasos

Copiamos el ejemplo anterior, y ejecutamos npm install.

```bash
npm install
```

Vamos a crearnos un fichero para encapsular las llamadas a la API:

_todo.api.ts_

```ts
import axios from "axios";
import { TodoItem } from "./todo.model";

export const getTodoList = async (): Promise<TodoItem[]> => {
  return axios.get("http://localhost:3000/todos").then((res) => {
    return res.data;
  });
};
```

Ya que estamos aprovechamos para sacar la URL base (en una aplicación real lo pondríamos en una variable de entorno).

```diff
import { TodoItem } from "./todo.model";

+ const __apiUrlBase = "http://localhost:3000";

export const getTodoList = async (): Promise<TodoItem[]> => {
-    return axios.get("http://localhost:3000/todos").then((res) => {
+    return axios.get(`${__apiUrlBase}/todos`).then((res) => {

      return res.data;
    });
};
```

- Vamos ahora a usarlo en nuestro componente:

_todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
- import axios from "axios";
+ import { getTodoList } from "./todo.api";
import { TodoItem } from "./todo.model";
import { useQuery } from "@tanstack/react-query";
```

```diff
  const { data, isError } = useQuery(
    ["todolist"],
    () => {
+      return getTodoList();
-      return axios.get("http://localhost:3000/todos").then((res) => {
-        return res.data;
-      });
    },
    {
      enabled: !isTodosEndPointDown,
      retry: false,
    }
  );
```

Comprobamos que todo sigue funcionando.

```bash
npm start
```
