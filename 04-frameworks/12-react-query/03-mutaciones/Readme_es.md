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

Ahora vamos a implementar una funcionalidad para crear un TODO y después implementaremos otra para editar un TODO existente, que nos vamos a plantear:

- Definimos los siguientes estados:
  - Read Only.
  - Append mode
  - Edit mode.
- Crearemos un componente para crear un TODO, este componente consumira un compenente de edición que después aprovecharemos para la edición de uno existente.
- Vamos a crear la entrada de API correspondiente.
- Vamos a enlazarlo todo con React Query.

Vamos a definir los estados:

_todo.model.ts_

```diff
+ export type Mode = "Readonly" | "Append" | "Edit";

export interface TodoItem {
  id: number;
```

Ese estado lo vamos a definir en el todo page:

_todo.page.tsx_

```diff
- import { TodoItem } from "./todo.model";
+ import { TodoItem, Mode } from "./todo.model";

import { useQuery } from "@tanstack/react-query";

export const TodoPage: React.FC = () => {
+ const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
```

¿Qué va a hacer nuestro componente de crear TODO?

- De primera si estamos en modo ReadOnly va a mostrar un botón para cambiar a modo Append.
- Si está en modo Append:
  - Va a mostrar un formulario.
  - Un botón para guardar el TODO.
  - Un botón para cancelar la operación.

¿Qué propiedades le tenemos que pasar?

- En el modo en el que estamos (ReadOnly, Edit, Append).
- Un callback para que el padre cambia a modo Append.
- Un callback para cancelar y que el padre cambie a modo ReadOnly.
- Un callback para notificar que se ha creado un nuevo TODO.

Vamos a definir la firma de este componente:

_./components/todo-append.component.tsx_

```ts
import React from "react";
import { Mode, TodoItem } from "../todo.model";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TodoItem) => void;
}

export const TodoAppendComponent: React.FC<Props> = (props: Props) => {
  const { mode, setAppendMode, onAppend, onCancel } = props;

  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <div>
          <h3>Here goes editing thing...</h3>
          <button onClick={onCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};
```

Para usarlo de una manera más sencilla vamos a crear un barrel:

_./components/index.ts_

```ts
export * from "./todo-append.component";
```

Y ahora vamos a usarlo en nuestro componente:

_todo.page.tsx_

```diff
import React from "react";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
import axios from "axios";
import { TodoItem } from "./todo.model";
import { useQuery } from "@tanstack/react-query";
+ import { TodoAppendComponent } from "./components";
```

```diff
  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>{todo.isDone ? "✅" : "⭕️"}</div>
            <div>{todo.description}</div>
          </React.Fragment>
        ))}
      </div>
+      <TodoAppendComponent/>
      <Link to="/pageb">To Page B</Link>
    </>
  );
```

Por supuesto, nos sale en rojo, tenemos que pasarle propiedades:

- El modo lo tenemos.
- El AppendModel, Cancel y Append, no los tenemos, vamos a implementarlos:

```diff
      </div>
       <TodoAppendComponent
+        mode={mode}
+        setAppendMode={() => setMode("Append")}
+        onCancel={() => setMode("Readonly")}
+        onAppend={(item) => { console.log("TODO... save", item)}}
       />
      <Link to="/pageb">To Page B</Link>
```

Vamos a ver que tal se porta esto:

```bash
npm start
```

Si pinchamos en el botón cambiamos de modo read only a modo append.

Ahora vamos a implementar el formulario de edición, queremos hacer uno genérico para edición e inserción, ¿Qué debemos de pasarle?

- Un Item (sea uno existente o uno nuevo para insertar).
- Un callback para guardar cambios (el padre es responsable de guardar).
- Un callback para cancelar cambios (el padre decide a que modo va).

_./components/todo-item-edit.component.tsx_

```ts
import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
  onSave: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoItemEdit: React.FC<Props> = (props: Props) => {
  const { item, onSave, onCancel } = props;
  const [editItem, setEditItem] = React.useState({ ...item });

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={editItem.isDone}
          onChange={(e) =>
            setEditItem({ ...editItem, isDone: e.target.checked })
          }
        />
        Done
      </label>
      <input
        type="text"
        value={editItem.description}
        onChange={(e) =>
          setEditItem({ ...editItem, description: e.target.value })
        }
      />
      <div>
        <button onClick={() => onSave(editItem)}>Save</button>
        <button onClick={() => onCancel()}>Cancel</button>
      </div>
    </>
  );
};
```

Vamos a usar esto en nuestro _todo-append.component.tsx_:

```diff
import React from "react";
- import { Mode, TodoItem } from "../todo.model";
+ import { Mode, TodoItem, createEmptyTodoItem } from "../todo.model";
+ import { TodoItemEdit } from "./todo-item-edit.component";
```

```diff
  return (
    <div>
      {mode !== "Append" ? (
        <button onClick={setAppendMode}>Enter Insert New TODO Mode</button>
      ) : (
        <div>
-          <h3>Here goes editing thing...</h3>
-          <button onClick={onCancel}>Cancel</button>
+         <TodoItemEdit
+           item={createEmptyTodoItem()}
+           onSave={onAppend}
+           onCancel={onCancel}
+         />
        </div>
      )}
    </div>
  );
```

Ya lo tenemos todo enlazado, vamos ahora a implementar la api que va a conectar para guardar d verdad los datos:

_./api/todo.api.ts_

```diff
import axios from "axios";
import { TodoItem } from "./todo.model";

const __apiUrlBase = "http://localhost:3000";

export const getTodoList = async (): Promise<TodoItem[]> => {
  return axios.get(`${__apiUrlBase}/todos`).then((res) => {
    return res.data;
  });
};

+ export const appendTodoItem = (item: TodoItem): Promise<TodoItem> => {
+   return axios.post(`${__apiUrlBase}/todos`, item).then((res) => {
+     return res.data;
+   });
+ };
```

Y vamos a usarlo en nuestro componente e integrarlo con react-query, para actualizar tiramos de _react-query_

_./pages/todo.page.tsx_

```diff
import { TodoItem, Mode } from "./todo.model";
- import { useQuery } from "@tanstack/react-query";
+ import { useQuery, useMutation } from "@tanstack/react-query";
import { TodoAppendComponent } from "./components";
```

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

  const { data, isError } = useQuery(
    ["todolist"],
    () => {
      return getTodoList();
    },
    {
      enabled: !isTodosEndPointDown,
      retry: false,
    }
  );

+ const handleAppend = (item: TodoItem) => {
+   useMutation(appendTodoItem);
+ }

  React.useEffect(() => {
    if (isError) {
      setIsTodosEndPointDown(true);
    }
  }, [isError]);
```

Con esto grabamos, pero... ¿No se ve en la lista? Qué está pasando?

Pues que como no perdemos foco, y no se recarga el componente, se queda con la query de caché, tendrámos que esperar unos minutos para que se recargara ¿Qué podemos hacer? Pues _useMutation_ tiene un segundo parámetro en el que podemos indicarle un callback al que llamar cuando se haya grabado, y ahí podemos indicarle que query queremos que se recargue:

```diff
  const handleAppend = (item: TodoItem) => {
    useMutation(appendTodoItem, {
+     onSuccess: () => {
+       queryClient.invalidateQueries("todolist");
+     },
    });
  };
```

Si probamos, esto funciona... pero se nos queda una sensación bien mala:

- Strings harcodeados.
- Mucho código en el componente.
- ¿Qué pasa si ese append tiene que impactar a más de una query?

Hora de ponernos los guantes de jardinero y arreglar el huerto :)

1. eliminar harcodes
2. Agrupar mejor
3. REfactor y todo funciona
4. Agrupar en un hook TodosQueries
