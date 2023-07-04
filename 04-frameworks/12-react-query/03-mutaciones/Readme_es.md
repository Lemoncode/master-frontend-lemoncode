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
- import { getTodoList } from "./todo.api";
+ import { getTodoList, appendTodoItem } from "./todo.api";
- import { useQuery } from "@tanstack/react-query";
+ import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoAppendComponent } from "./components";
```

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
+ const queryClient = useQueryClient();
+ const appendMutation = useMutation(appendTodoItem);

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
+   appendMutation.mutate(item);
+   setMode("Readonly");
+ }

  React.useEffect(() => {
    if (isError) {
      setIsTodosEndPointDown(true);
    }
  }, [isError]);
```

Y vamos a usarlo:

```diff
      <TodoAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
-        onAppend={(item) => {
-          console.log("TODO... save", item);
-        }}
+        onAppend={handleAppend}
      />
```

Con esto grabamos, pero... ¿No se ve en la lista? Qué está pasando?

Pues que como no perdemos foco, y no se recarga el componente, se queda con la query de caché, tendrámos que esperar unos minutos para que se recargara ¿Qué podemos hacer? Pues _useMutation_ tiene un segundo parámetro en el que podemos indicarle un callback al que llamar cuando se haya grabado, y ahí podemos indicarle que query queremos que se recargue:

```diff
  const handleAppend = (item: TodoItem) => {
    useMutation(appendTodoItem,
+    {
+     onSuccess: () => {
+       queryClient.invalidateQueries("todolist");
+     },
+    }
);
  };
```

Si probamos, esto funciona... pero se nos queda una sensación bien mala:

- Strings harcodeados.
- Mucho código en el componente.
- ¿Qué pasa si ese append tiene que impactar a más de una query?

Hora de ponernos los guantes de jardinero y arreglar el huerto :)

1. eliminar harcodes
2. Agrupar mejor
3. Refactor y todo funciona
4. Agrupar en un hook TodosQueries

Lo primero que vamos a hacer es eliminar los harcodeos y crear grupos de consultas:

Podríamos probar a hacer algo así:

_todo-key-queries.ts_

```ts
export const todoKeyQueries = {
  todoList: "todolist",
};
```

Esto podría parece algo ok, pero a la hora de invalidar consultas ¿Qué pasa si una mutación implica que varias consultas se invaliden? Es decir modifico la edad de un usuarios de mi portal, y al ser menor de 18 años ciertos productos no puede visualizarlos, tengo que invalidar las consultas de más comprados, busqueda actual, ultimos pédidos...

Mejor agrupar de esta manera

_todo-key-queries.ts_

```ts
export const todoKeys = {
  all: ["todo"] as const,
  todoList: () => [...todoKeys.all, "todoList"] as const,
};
```

¿Qué hacemos aquí?

- En React query definimos un array de strings que son las claves de las consultas que queremos invalidar.
- Si invalidamos una consulta que tiene dependencias, se invalidan las dependencias.

De esta manera si tuviera más consultas dentro de _todo_ _all_ e invalido _all_ el resto de consultas se invalidarían, sin embargo si sólo quiero invalidar _todoList_ no invalidaría el resto.

Vamos a actualizar nuestro código de _todo.page.tsx_

_./src/pages/todo/todo.page.tsx_

```diff
import { TodoAppendComponent } from "./components";
+ import { todoKeys } from "./todo-key-queries";

export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
  const queryClient = useQueryClient();
  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
-      queryClient.invalidateQueries("todolist");
+      queryClient.invalidateQueries(todoKeys.todoList()); // podíamos poner todoKeys.all
    },
    },
  });
```

```diff
  const { data, isError } = useQuery(
-    ["todolist"],
+    todoKeys.todoList()
+
    () => {
      return getTodoList();
    },
    {
      enabled: !isTodosEndPointDown,
      retry: false,
    }
  );
```

Veamos que esto sigue funcionando:

```bash
npm start
```

[Más información acerca de react query keys](https://tkdodo.eu/blog/effective-react-query-keys)

- Siguiente paso, el componente se nos ha quedado lleno de código y es complicado de seguir y saber que es código de consulta y recarga y que es código de componente, si nos descuidamos, y el componente sigue creciendo, esto puede acabar en un _monstruito_, así que vamos a agrupar y sacar fuera funcionalidad, primero tirando de un hook dentro del mismo fichero y después evaluamos si sacarlo a otro fichero o no.

Vamos paso a paso, lo primero _queryClient_ y _appendMutation_ son buenos candidatos para sacarlos fuera
_./src/pages/todo/todo.page.tsx_

```diff
+ const useTodoListQueries {
+   const queryClient = useQueryClient();
+
+    const appendMutation = useMutation(appendTodoItem, {
+      onSuccess: () => {
+        queryClient.invalidateQueries(todoKeys.todoList());
+      },
+    });
+
+    return {queryClient, appendMutation}
+ }

export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
-  const queryClient = useQueryClient();
-  const appendMutation = useMutation(appendTodoItem, {
-    onSuccess: () => {
-      queryClient.invalidateQueries(todoKeys.todoList());
-    },
-  });

+   const {appendMutation} = useTodoQueries();

  const { data, isError } = useQuery(
    todoKeys.todoList(),
    () => {
      return getTodoList();
    },
    {
      enabled: !isTodosEndPointDown,
      retry: false,
    }
  );
```

Aquí es donde nos podemos quedar en este hook y aceptar el código que tenemos, o por contra podemos seguir refactorizando, no hay bala de plata:

- Por un lado ahora tenemos un hook simple que hace una cosa y una sola cosa, pero algo de "lió" en el componente.
- Por otro lado podemos vaciar el componente y mover cosas relacionadas a ese hook o incluso a un hook o funciones aparte (vaciamos componentes, pero corremos riesgo de acabar con un hook monstruito, o con un montón de ficheros separados).

Por ejemplo, vamos a crear un wrapper para carga los _TODO_

_./src/pages/todo/todo.page.tsx_

```diff
const useTodoQueries = () => {
  const queryClient = useQueryClient();

  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(todoKeys.todoList());
    },
  });

+  const loadTodoList = (disableQuery : boolean) => {
+    return useQuery(
+      todoKeys.todoList(),
+      () => {
+        return getTodoList();
+      },
+      {
+        enabled: disableQuery,
+        retry: false,
+      }
+    );
+  }

-  return {queryClient, appendMutation}
+  return {queryClient, appendMutation, loadTodoList}
}
```

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

-  const {appendMutation} = useTodoQueries();
+  const {loadTodoList, appendMutation} = useTodoQueries();

+  const { data, isError } = loadTodoList(!isTodosEndPointDown);
-  const { data, isError } = useQuery(
-    todoKeys.todoList(),
-    () => {
-      return getTodoList();
-    },
-    {
-      enabled: !isTodosEndPointDown,
-      retry: false,
-    }
-  );
```

Comprobamos que todo funciona y analizamos:

```bash
npm start
```

¿Funciona? Bueno...

Esto funciona pero nos acabamos de cargar las reglas de los hooks:

https://legacy.reactjs.org/docs/hooks-rules.html

**Don’t call Hooks inside loops, conditions, or nested functions.**

Así que vamos a arreglar esto:

```diff
- const useTodoQueries = () => {
+ const useTodoQueries = (disableQuery : boolean) => {

  const queryClient = useQueryClient();

  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(todoKeys.todoList());
    },
  });

+ const { data, isError } = useQuery(
+    todoKeys.todoList(),
+    () => {
+      return getTodoList();
+    },
+    {
+      enabled: disableQuery,
+      retry: false,
+    }
+  );

-  const loadTodoList = (disableQuery : boolean) => {
-    return useQuery(
-      todoKeys.todoList(),
-      () => {
-        return getTodoList();
-      },
-      {
-        enabled: disableQuery,
-        retry: false,
-      }
-    );
-  }

-  return {queryClient, appendMutation, loadTodoList}
+  return {queryClient, appendMutation, data, isError}
}
```

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

-  const {loadTodoList, appendMutation} = useTodoQueries();
+  const {appendMutation, data, isError} = useTodoQueries(!isTodosEndPointDown);

-  const { data, isError } = loadTodoList(!isTodosEndPointDown);
```

Ahora es el momento de ver si paramos aquí o seguimos ¿Qué haría en un proyecto real?

- Hacer commit (e incluso push) de lo que he hecho.
- Seguir jugando a refactorizar.
- Parar ver si el refactor tiene sentido o si toca _recoger carrete_ (en este caso hago un discard de los cambios y me quedo con la versión anterior).

De primeras, podríamos estar tentados de:

- Renombrar _useTodoQueries_ a _useTodoState_ (o incluso que _useTodoState_ consumiera _useTodoQueries_).

Mirar de mover a _useTodoState_:

** NO COPIAR ESTE CODIGO **

```ts
const [mode, setMode] = React.useState<Mode>("Readonly");
const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
```

```ts
const handleAppend = (item: TodoItem) => {
  appendMutation.mutate(item);
  setMode("Readonly");
};
```

```ts
React.useEffect(() => {
  if (isError) {
    setIsTodosEndPointDown(true);
  }
}, [isError]);
```

Y exponer el en _return_ del hook todo lo que sea público.

¿Merece la pena hacer este refactor?

Pros

- El componente queda muy limpio.
- Encapsulamos estado y acceso a queries en un solo hook.

Cons

- Nuestro hook hace más de una cosa, se podría resolver rompiendo en dos hooks independientes (queries y estados), pero puede complicar leer el código (en algún caso vamos a tener que saltar hasta tres ficheros).
- El hook es muy específico de este componente, si lo reutilizamos en otro componente, probablemente tengamos que modificarlo (tampoco es un drama).

¿Cual es la solución óptima? Cómo siempre... depende, ¿Cómo va a crecer esta página? ¿Qué va a necesitar? Lo que si es cierto es que gracias a los hooks son refactors fáciles de hacer.

# Actualizar un TODO

Vamos a actualizar un TODO, queremos hacerlo en línea, es decir, puncho en editr un todo y ahí mismo en vez de mostrarse esa fila como de sólo lectura, tienen que aparecer los campos de edición.

Para ello vamos a a arrancar por crear un componente para mostrar los datos en modo sólo lectura y después crearemos otro para pasar a modo edición:

_./src/pages/todo/components/todo-item-display.component.tsx_

```ts
import React from "react";
import { TodoItem } from "../todo.model";

interface Props {
  item: TodoItem;
  onEdit: (id: number) => void;
}

export const TodoItemDisplay: React.FC<Props> = (props: Props) => {
  const { item, onEdit } = props;

  return (
    <React.Fragment key={item.id}>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <div>
        <button onClick={() => onEdit(item.id)}>Edit</button>
      </div>
    </React.Fragment>
  );
};
```

_./src/pages/todo/components/index.ts_

```diff
export * from "./todo-append.component";
+ export * from "./todo-item-display.component";
```

Vamos a darle uso en la página:

_./src/pages/todo/todo.page.tsx_

```diff
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
- import { TodoAppendComponent } from "./components";
+ import { TodoAppendComponent, TodoItemDisplay } from "./components";

import { todoKeys } from "./todo-key-queries";
```

```diff
+ const handleEnterEditMode = (id: number) => {
+  setMode("Edit");
+  // TODO... más cosas por aquí pendientes
+ };
```

```diff
      <div className={classes.todoList}>
        {data?.map((todo) => (
-          <React.Fragment key={todo.id}>
-            <div>{todo.isDone ? "✅" : "⭕️"}</div>
-            <div>{todo.description}</div>
-          </React.Fragment>
+            <TodoItemDisplay
+              key={todo.id}
+              item={todo}
+              onEdit={handleEnterEditMode}
            />
        ))}
      </div>
      <TodoAppendComponent
```

Se descojona el layout, porque en el contenedor esperamos dos filas en vez de tres, vamos a cambiarlo:

_./src/pages/todo/todo.page.css_

```diff
.todo-list {
  display: grid;
-  grid-template-columns: 1fr 3fr;
+  grid-template-columns: 1fr 3fr 1fr;
  grid-gap: 1rem;
  margin: 1rem;
}
```

Si pinchamos en _edit_ vemos que no pasa nada, toca ponerse manos a la obra:

- Por un lado, nos hace falta saber que TODO queremos editar, así que toca guardarlo en el estado.
- Por otro lado nos hace falta un componente para editar el TODO.
- Para rematar, en el _map_ tenemos que ver si estamos en modo edición y ver si usamos el _item display_ o el _item edit_ que acabamos de crear\_ y ya que estamos cuando pulsemos en guardar que almacene esos datos.

Vamos primero a por el estado:

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
+ // TODO: Mover ese -1 a una constante
+ const [editingId, setEditingId] = React.useState(-1);
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);
```

```diff
  const handleEnterEditMode = (id: number) => {
    setMode("Edit");
-    // TODO... más cosas por venir
+    setEditingId(id);
  };
```

Y vamos a crear una _handler_ para el update (después lo conectaremos con _React Query_ y _Axios_):

_./src/pages/todo/todo.page.tsx_

```diff
  const handleAppend = (item: TodoItem) => {
    appendMutation.mutate(item);
    setMode("Readonly");
  };

+ const handleUpdate = (item: TodoItem) => {
+  console.log("TODO: handleUpdate", item);
+  setMode("Readonly");
+ }
```

Vamos ahora a por el _item edit_:

_./src/pages/todo/components/todo-item-edit.component.tsx_

```ts
import React from "react";
import { TodoItem, createEmptyTodoItem } from "../todo.model";

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

¿Que podríamos hacer ahora? Pues directamente llevarnos al _map_ del TODO Page el _item append_ y el _item edit_ y dependiendo de si estoy en modo edición o lectura de cada item poner uno u otro, pero ibamos a _guarrear_ el componente, así que vamos a crear un componente intermedio que se encargue de eso:

_./src/pages/todo/components/todo-item.component.tsx_

```ts
import React from "react";
import { TodoItem, Mode } from "../todo.model";
import { TodoItemEdit } from "./todo-item-edit.component";
import { TodoItemDisplay } from "./todo-item-display.component";

interface Props {
  editingId: number;
  mode: Mode;
  todo: TodoItem;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TodoItem) => void;
  onCancel: () => void;
}

export const TodoItemComponent: React.FC<Props> = (props: Props) => {
  const { todo, editingId, mode, onEnterEditMode, onUpdate, onCancel } = props;

  return (
    <>
      {mode === "Readonly" || todo.id !== editingId ? (
        <TodoItemDisplay key={todo.id} item={todo} onEdit={onEnterEditMode} />
      ) : (
        <TodoItemEdit
          key={todo.id}
          item={todo}
          onSave={onUpdate}
          onCancel={onCancel}
        />
      )}
    </>
  );
};
```

Vamos a exponer el componente en el _index_:

_./src/pages/todo/components/index.ts_

```diff
export * from "./todo-append.component";
- export * from "./todo-item-display.component";
+ export * from "./todo-item.component";
```

Y actualizarlo en la página:

_./src/pages/todo/todo.page.tsx_

```diff
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
- import { TodoAppendComponent, TodoItemDisplay } from "./components";
+ import { TodoAppendComponent,  TodoItemComponent} from "./components";
import { todoKeys } from "./todo-key-queries";
```

```diff
      <div className={classes.todoList}>
        {data?.map((todo) => (
-          <TodoItemDisplay
-            key={todo.id}
-            item={todo}
-            onEdit={handleEnterEditMode}
-          />
+          <TodoItemComponent
+            key={todo.id}
+            mode={mode}
+            editingId={editingId}
+            todo={todo}
+            onEnterEditMode={handleEnterEditMode}
+            onUpdate={handleUpdate}
+            onCancel={() => setMode("Readonly")}
+          />
        ))}
      </div>
      <TodoAppendComponent
```

Probamos

```bash
npm start
```

Ya con esto armado, vamos a centrarnos en que de verdad guarde en servidor.

Actualizamos la API de Axios que hemos creado:

_./src/pages/todo/todo.api.ts_

```diff
export const appendTodoItem = (item: TodoItem): Promise<TodoItem> => {
  return axios.post(`${__apiUrlBase}/todos`, item).then((res) => {
    return res.data;
  });
};

+ export const updateTodoItem = (item: TodoItem): Promise<TodoItem> => {
+   return axios.put(`${__apiUrlBase}/todos/${item.id}`, item).then(res => {
+    return res.data;
+   });
+ };
```

Vamos ahora a por el hook de queries y creamos la mutación para update

_./src/pages/todo/todo.page.tsx_

```diff
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
- import { getTodoList, appendTodoItem } from "./todo.api";
+ import { getTodoList, appendTodoItem, updateTodoItem } from "./todo.api";
```

```diff
const useTodoQueries = () => {
  const queryClient = useQueryClient();

  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(todoKeys.todoList());
    },
  });

+ const updateMutation = useMutation(updateTodoItem, {
+   onSuccess: () => {
+     queryClient.invalidateQueries(todoKeys.todoList());
+   },
+ });

  const loadTodoList = (disableQuery: boolean) => {
    return useQuery(
      todoKeys.todoList(),
      () => {
        return getTodoList();
      },
      {
        enabled: disableQuery,
        retry: false,
      }
    );
  };

-  return { queryClient, appendMutation, loadTodoList };
+ return { queryClient, appendMutation, updateMutation, loadTodoList };
};
```

Una pequeña mejora antes de seguir, el _success_ de _update_ y _append_ son iguales, así que vamos a extraerlo a una función:

```diff
const useTodoQueries = () => {
  const queryClient = useQueryClient();

+  const mutationSucceeded = () => {
+    queryClient.invalidateQueries(todoKeys.todoList());
+  };

  const appendMutation = useMutation(appendTodoItem, {
    onSuccess: () => {
-      queryClient.invalidateQueries(todoKeys.todoList());
+      mutationSucceeded();
    },
  });

 const updateMutation = useMutation(updateTodoItem, {
   onSuccess: () => {
-     queryClient.invalidateQueries(todoKeys.todoList());
+      mutationSucceeded();
   },
 });
```

Lo añadimos en nuestro handle de updates de todo page:

_./src/pages/todo/todo.page.tsx_

```diff
export const TodoPage: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [isTodosEndPointDown, setIsTodosEndPointDown] = React.useState(false);

-  const { loadTodoList, appendMutation } = useTodoQueries();
+  const { loadTodoList, appendMutation, updateMutation } = useTodoQueries();
```

```diff
  const handleUpdate = (item: TodoItem) => {
-    console.log("TODO: handleUpdate", item);
+   updateMutation.mutate(item);
    setMode("Readonly");
  };
```

Y Ya lo tenemos funcionando

```bash
npm start
```

# Optimistic updates

Otro caso interesante son los _optimistic updates_, hay escenarios en lo que sabemos al 99% que un dato se va guardar con éxito, ¿Por qué no asumir que todo va a ir bien, y si ya ha un fallo hacer una recarga? De esta forma podemos ofrecer una mejor experiencia de usuario.

En nuestro caso de TODO y edit, ¿Qué podríamos hacer?

- En el handleUpdate, modifico la caché de de React Query y añado el elemento.
- De esta manera, antes de que reciba la respuesta del servidor, el usuario ya ve el TODO en la lista.

Vamos a tocar la _cache_ de _React Query_, en concreto modificar un elemento, para no liarnos la manta a la cabeza con estructuras inmutables, vamos a ayudarnos de _immer_

```bash
npm install immer
```

_./src/pages/todo/todo.page.tsx_

```diff
import React from "react";
+ import { produce } from "immer";
import { Link } from "react-router-dom";
import classes from "./todo.page.css";
```

```diff
  const updateMutation = useMutation(updateTodoItem, {
+   onMutate: async (newTodo : TodoItem) => {
+      // TODO Aquí hay que hacer más cosas, ver este ejemplo
+      // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
+      queryClient.setQueryData(todoKeys.todoList(), (old) => {
+        return produce(old, (draft: TodoItem[]) => {
+            const index = draft.findIndex((item) => item.id === newTodo.id);
+            if(index !== -1) {
+              draft[index] = newTodo;
+            }
+         })
+      });
+   }
    onSuccess: () => {
      mutationSucceeded();
    },
  });
```

Para probar que esto funciona vamos a deshabilitar el refresco automático:

_./src/pages/todo/todo.page.tsx_

```diff
const useTodoQueries = () => {
  const queryClient = useQueryClient();

  const mutationSucceeded = () => {
-    queryClient.invalidateQueries(todoKeys.todoList());
+   // Comentar esto sólo para la prueba
+   // queryClient.invalidateQueries(todoKeys.todoList());
  };
  };
```

Hacer optimistic updates bien no es fácil, hay varios casos arista, veamos este ejemplo de la documentación:

[Ejemplo optimistic update](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)

¿Qué hacemos aquí?

- Cancelamos cualquier refetch de TODOs que pudiera estar en marcha, así no aseguramos que nuestra caché manda.

- Almacenamos los datos previos por si acaso.

- Hacemos la actualización optimista en la caché.

- Devolvemos los datos viejos por si acaso

- Si hay error, restauramos los datos viejos.

- Y haya habido erro o no, volvemos a pedir datos de servidor por si acaso (aún así, el usuario ya ha visto el cambio)

¿Por qué tantas vueltas? Para evitar casos aristas:

- Oye justo actualizo caché, pero venían un refresh del servidor antes de que llegara el update y se carga la caché sin mi dato.
- Oye que el server esta caido, y quiero que el usuario se de cuenta de que el update ha ido mal (incluso podría mostrar una tostada de error).
- Que mira, que se ha actualizado todo... pues por si acaso vamos a pedir un refetch y nos traemos un corte limpio.

[Para saber más sobre mutations en React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)
