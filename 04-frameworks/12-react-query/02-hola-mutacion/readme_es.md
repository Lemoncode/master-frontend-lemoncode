# Mutaciones

Hasta ahora hemos usado React Query en modo lectura, ¿Pero que pasa con las escrituras? Aquí podemos beneficiarnos de varias ventajas:

- Poder meter en el ciclo de actualizaciones / cache las mutaciones.
- Poder realizar updates optimistas.

En este ejemplo arrancaremos por explorar más escenarios de lectura y después pasaremos a escritura.

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos las dependencias.

```bash
npm install
```

También vamos a levantar un backend de pruebas:

```bash
cd 99-server
```

Vamos a crear el pod de ToDo's:

_./src/todo-collection/todo-collection.pod.tsx_

```tsx
export const TodoCollectionPod: React.FC = () => {
  return (
    <div>
      <h1>Todo Collection POD</h1>
    </div>
  );
};
```

Lo exponemos como barrel bajo la carpeta `pods`:

_./src/modules/tasks/pods/index.ts_

```tsx
export * from "./todo-collection/todo-collection.pod";
```

Y creamos la escena de task-collection:

_./src/scenes/todo.scene.tsx_

```diff
+ import { TodoCollectionPod } from "@/pods";

export const TodoScene: React.FC = () => {
  return (
    <div>
-      <h1>TODOS Scene</h1>
+      <TodoCollectionPod />
    </div>
  );
};
```

Probamos que lo hemos creado bien:

```bash
npm run dev
```

Para acceder la servidor, lo suyo es que la API base la metamos en una variable de entorno (aquí si creamos módulos separados cada módulo tendría la suya) ¿Podría tener esto un problema con los despliegues?

- Lo que es Front End nunca va en el area de variables de entornos que podemos tener en un servidor en la nube, se reemplaza en tiempo de build.
- Si podría ser un problema si queremos que se cambie la URL de base desde la aplicación principal, en ese caso podríamos optar por meter un punto de entrada para que la aplicación decidiera la URL de base (sobreescribiendo la variable de entorno)
- He visto escenario más complejo donde esta configuración la sirve un servicio web externo, de esta manera puedes servir despliegues para diferentes proveedores.

./.env

```diff
VITE_GITHUB_API_BASE_URL=https://api.github.com
+ VITE_TASKS_API_BASE_URL=http://localhost:3000
```

Y vamos a tiparlo:

./src/core/env/index.ts

```diff
interface EnvVariables {
  GITHUB_API_BASE_URL: string;
+ TASKS_API_BASE_URL: string;
}

export const ENV_VARIABLES: EnvVariables = {
  GITHUB_API_BASE_URL: import.meta.env.VITE_GITHUB_API_BASE_URL,
+ TASKS_API_BASE_URL: import.meta.env.VITE_TASKS_API_BASE_URL,
};

```

Ahora queremos cargar una lista de tareas, vamos a simular que vamos a por el pod completo (para esta caso sería un _overkill_):

Instalamos zod:

```bash
npm install zod
```

Vamos a definir el esquema de ZOD y el modelo de datos, tenemos para tarea, los siguientes campos:

- id: numérico.
- description: string.
- isDone: booleano.

_./src//pods/todo-collection/api/api.model.ts_

```ts
import { z } from "zod";

export const taskApiSchema = z.object({
  id: z.number(),
  description: z.string(),
  isDone: z.boolean(),
});

// Y para un array de tasks
export const taskApiCollectionSchema = z.array(taskApiSchema);

export type TaskModel = z.infer<typeof taskApiSchema>;
```

Vamos ahora a definir el fichero de API en el que vamos a leer del endpoint _localhost:3000/tasks_, para ello usaremos axios, y tiraremos de nuestra variable de entorno, también haremos un _safeParse_ con ZOD por si algo cambia en el módelo de la API (de momento lo que hacemos es informar con un console log de que ha habido un cambio en el modelo de la API, aquí podríamos plantearnos logging).

_./src//pods/todo-collection/api/api.ts_

```ts
import axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { taskApiCollectionSchema, TaskModel } from "./api.model";

export const getTodoCollection = async (): Promise<TaskModel[]> => {
  const { data } = await axios.get<TaskModel[]>(
    `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`
  );

  const result = taskApiCollectionSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }

  return data ?? [];
};
```

Vamos ahora a definir el viewModel:

_./src/modules/pods/todo-collection/todo-collection.vm.ts_

```ts
export interface TodoVm {
  id: number;
  description: string;
  isDone: boolean;
}
```

Y vamos a crear el mapper:

_./src/pods/todo-collection/todo-collection.mapper.ts_

```ts
import * as apiModel from "./api/api.model";
import * as vm from "./todo-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TodoVm => ({
  ...task,
});
```

Y vamos a crear una fichero de repositorio para no tener que tratar desde el componente con el modelo de la api.

_./src/pods/todo-collection/todo-collection.repository.ts_

```ts
import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm } from "./todo-collection.mapper";
import * as vm from "./todo-collection.vm";
import { getTodoCollection as getTaskCollecionApi } from "./api/api";

export const getTodoCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};
```

Vamos a darle uso a _React Query_ para cargar la lista de tareas (he implementamos lo mínimo para ver que salen datos):

_./src/pods/todo-collection/todo-collection.pod.tsx_

```diff
+ import { useQuery } from "@tanstack/react-query";
+ import {getTaskCollection} as repository from "./task-collection.repository";

export const TaskCollectionPod: React.FC = () => {

+  // De momento harcodeamos la key
+  const { data: todoCollection = [] } = useQuery({
+    queryKey: ["todoCollection"],
+    queryFn: () => getTaskCollection(),
+  });

  return (
    <div>
      <h1>Task Collection POD</h1>
+      {
+      todoCollection.map((task) => (
+        <div key={task.id}>
+          <span>{task.description}</span>
+        </div>))
      }
    </div>
  );
};
```

Probamos que funciona:

```bash
npm run dev
```

Siguiente paso vamos a organizar las _keys_ que estamos usando para evitar meter harcodeos por todos sitios:

- Aquí podemos optar por varias aproximaciones:
  - Una sería refactorizar gihubKeys a appKeys y meter dos subconjuntos, de github y de todos.
  - Otra es considerar que son conjuntos de keys distintos y crear dos objetos.

Vamos a optar por la segunda opción:

_./src/core/react-query/query-keys.ts_

```diff
+ const githubModule = "github";
+ const todoModule = "todo";

export const githubKeys = {
-  all: ["github"] as const,
+ all: [githubModule] as const,
  members: (org: string) => [...githubKeys.all, "members", org] as const,
  member: (id: string) => [...githubKeys.all, "member", id] as const,
};

+ export const todoKeys = {
+   all: [todoModule] as const,
+  todoCollection: () => [...todoKeys.all, "todoCollection"] as const,
+ }
```

Y vamos a refactorizar la query del pod:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import { todoKeys } from "@/core/react-query";

// (...)
- // De momento harcodeamos la key
 const { data: taskCollection = [] } = useQuery({
-  queryKey: "taskCollection",
+  queryKey: todoKeys.todoCollection(),
  queryFn: () => repository.getTaskCollection()
 });
```

Y ya que estamos lo sacamos a un hook:

_./src//pods/todo-collection/use-todo-collection-query.hook.ts_

> También podríamos llamar el fichero: `use-task-collection.query.ts` ¿Que crees que es mejor?

```ts
import { todoKeys } from "@/core/react-query";
import { getTodoCollection } from "./todo-collection.repository";
import { useQuery } from "@tanstack/react-query";
import { TodoVm } from "./todo-collection.vm";

export const useTodoCollectionQuery = () => {
  const { data: todoCollection = [] } = useQuery<TodoVm[]>({
    queryKey: todoKeys.todoCollection(),
    queryFn: () => getTodoCollection(),
  });

  return {
    todoCollection,
  };
};
```

Refactorizamos el pod:

_./src/pods/todo-collection.pod.tsx_

```diff
- import { useQuery } from "@tanstack/react-query";
- import { queryKeys } from "@tasks/core/react-query";
- import { getTaskCollection } from "./task-collection.repository";
- import { TaskVm } from "./task-collection.vm";
+ import { useTodoCollectionQuery } from "./use-todo-collection-query.hook";

export const TaskCollectionPod: React.FC = () => {
-  const { data: taskCollection = [] } = useQuery<TaskVm[]>({
-    queryKey: queryKeys.taskCollection(),
-    queryFn: () => getTaskCollection(),
-  });
+ const { todoCollection } = useTodoCollectionQuery();
```

Probamos que funciona:

```bash
npm run dev
```

Vamos a empezar a jugar con las opciones que nos ofrece React Query, primero nos fijamos en _refetchOnWindowFocus_.

Está opción está por defecto a true ¿Qué quiere decir esto?

Vamos a abrir side by side fichero de datos json y la aplicación, y vamos a modificar el json, en cuanto pinchamos en la ventana los datos se recargan sólos.

Si ahora ponemos este flag a false...

_./src/pods/todo-collection/use-todo-collection-query.hook.ts_

```diff
export const useTodoCollectionQuery = () => {
  const { data: todoCollection = [] } = useQuery<TodoVm[]>({
    queryKey: todoKeys.todoCollection(),
    queryFn: () => getTodoCollection(),
+    refetchOnWindowFocus: false
  });

  return {
    todoCollection,
  };
};
```

Y volvemos a hacer la operación, verás que no se recarga.

Si nos vamos a las devtool, podemos ver:

- Me dice que consultas tengo.

- Qué estado tienen.

- Puedo incluso relanzarlas.

Bueno, hasta aquí el happy path, vamos a tirar abajo la api rest y ver que pasa:

_Paramos al rest api de todos_

Si ponemos un breakpoint en la API podemos ver que no para de llamarse (abrir pestaña network), ¿No sería mejor avisar al usuario y que este reintentará?

_./src//pods/todo-collection/use-todo-collection-query.hook.ts_

```diff
- export const useTodoCollectionQuery = () => {
+ export const useTodoCollectionQuery = (enabled: boolean) => {
  const {
    data: taskCollection = []
+   isError,
  } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  },
  {
    refetchOnWindowFocus: false,
+    enabled
  });

  return {
    taskCollection,
+   isError
  };
};
```

Y ahora en el pod cubrimos este caso:

_./src/modules/tasks/pods/tasks-collection/task-collection.pod.tsx_

```diff
+ import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";


export const TaskCollectionPod: React.FC = () => {
+ const [connectionLost, setConnectionLost] = React.useState(false);
+
-  const { taskCollection } = useTaskCollectionQuery();
+ const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);

+ React.useEffect(() => {
+   if (isError) {
+     setConnectionLost(true);
+   }
+ }, [isError]);

+ if(isError) {
+   return (<button onClick={() => setConnectionLost(false)}>Reconectar</button>)
+ }

  return (
    <div>
      <h1>Task Collection POD</h1>
      {taskCollection.map((task) => (
        <div key={task.id}>
          <span>{task.description}</span>
        </div>
      ))}
    </div>
  );
};
```

Paramos el servidor que está en localhost:3000

Vale, esto va pero no es inmediato, se tira un rato reintentando ¿Qué está pasando? Que por defecto react-query antes de dar por perdida una llamada, realiza varios reintentos, vamos a desactivarlo:

_./src/modules/tasks/pods/tasks-collection/use-task-collection-query.hook.ts_

```diff
  } = useQuery<TaskVm[]>({
    queryKey: queryKeys.taskCollection(),
    queryFn: () => getTaskCollection(),
  },
  {
    refetchOnWindowFocus: false,
    enabled,
+   retry: false
  });
```

Vamos a probar a ver que tal

```bash
npm run dev
```

Vamos ahora a levantar el server y ver que pasa.

Antes de seguir vamos a darle un estilo mínimo a la lista de tareas:

_./src//pods/todo-collection/todo-collection.pod.module.css_

```css
.todo-list {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 1rem;
  margin: 1rem;
}
```

Y en el markup:

_./src/modules/tasks/pods/tasks-collection/todo-collection.pod.tsx_

```diff
+ import classes from "./todo-collection.pod.module.css";

// (...)

  return (
    <div>
      <h1>Task Collection POD</h1>
+      <div className={classes.todoList}>
      {taskCollection.map((todo) => (
-        <div key={todo.id}>
-          <span>{todo.description}</span>
-        </div>
+          <React.Fragment key={todo.id}>
+            <div>{todo.isDone ? "✅" : "⭕️"}</div>
+            <div>{todo.description}</div>
+          </React.Fragment>
      ))}
+      </div>
    </div>
  );
```

# Mutaciones

Ahora vamos a implementar una funcionalidad para crear un TODO y después implementaremos otra para editar un TODO existente, que nos vamos a plantear:

- Definimos los siguientes estados:
  - Read Only.
  - Append mode
  - Edit mode.
- Crearemos un componente para crear un TODO, este componente consumira un compenente de edición que después aprovecharemos para la edición de uno existente.
- Vamos a crear la entrada de API correspondiente.
- Vamos a enlazarlo todo con React Query.

Vamos a definir los estados:

_./src/modules/tasks/pods/task-collection/task-collection.vm.ts_

```diff
+ export type Mode = "Readonly" | "Append" | "Edit";

export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}
```

Ese estado lo vamos a definir en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
+ import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";

export const TaskCollectionPod: React.FC = () => {
+ const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
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

_./src/modules/tasks/pods/task-collection/components/task-append.component.tsx_

```tsx
import React from "react";
import { Mode, TaskVm } from "../task-collection.vm";

interface Props {
  mode: Mode;
  setAppendMode: () => void;
  onCancel: () => void;
  onAppend: (item: TaskVm) => void;
}

export const TaskAppendComponent: React.FC<Props> = (props: Props) => {
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

_./src/modules/tasks/pods/task-collection/components/index.ts_

```ts
export * from "./task-append.component";
```

Y ahora vamos a usarlo en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
+ import { TaskAppendComponent } from "./components";
```

```diff
  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todoList}>
        {taskCollection.map((task) => (
          <React.Fragment key={task.id}>
            <div>{task.isDone ? "✅" : "⭕️"}</div>
            <div>{task.description}</div>
          </React.Fragment>
        ))}
      </div>
+     <TaskAppendComponent/>
    </div>
  );
```

Por supuesto, nos sale en rojo, tenemos que pasarle propiedades:

- El modo lo tenemos.
- El AppendModel, Cancel y Append, no los tenemos, vamos a implementarlos:

```diff
  <TaskAppendComponent
+        mode={mode}
+        setAppendMode={() => setMode("Append")}
+        onCancel={() => setMode("Readonly")}
+        onAppend={(item) => { console.log("TODO... save", item)}}
  />
```

Vamos a ver que tal se porta esto (ocultar mostrar el area de inserción):

```bash
npm run dev
```

Si pinchamos en el botón cambiamos de modo read only a modo append.

Ahora vamos a implementar el formulario de edición, queremos hacer uno genérico para edición e inserción, ¿Qué debemos de pasarle?

- Un Item (sea uno existente o uno nuevo para insertar).
- Un callback para guardar cambios (el padre es responsable de guardar).
- Un callback para cancelar cambios (el padre decide a que modo va).

_./components/task-item-edit.component.tsx_

```ts
import React from "react";
import { TaskVm } from "../task-collection.vm";

interface Props {
  item: TaskVm;
  onSave: (item: TaskVm) => void;
  onCancel: () => void;
}

export const TaskItemEdit: React.FC<Props> = (props: Props) => {
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

Para el modo append, nos hace falta un método en el VM que cree un tarea en blanco:

_./src/modules/tasks/pods/task-collection/task-collection.vm.ts_

```diff
export type Mode = "Readonly" | "Append" | "Edit";

export interface TaskVm {
  id: number;
  description: string;
  isDone: boolean;
}

+ export const createEmptyTask = (): TaskVm => ({
+   id: 0,
+   description: "",
+   isDone: false,
+ });
```

Vamos a usar esto en nuestro _task-append.component.tsx_:

_./src/modules/tasks/pods/task-collection/components/task-append.component.tsx_

```diff
import React from "react";
- import { Mode, TaskVm } from "../task-collection.vm";
+ import { Mode, TaskVm, createEmptyTask } from "../task-collection.vm";
+ import { TaskItemEdit } from "./task-item-edit.component";
```

```diff
  ) : (
    <div>
-      <h3>Here goes editing thing...</h3>
-      <button onClick={onCancel}>Cancel</button>
+        {/* Recordar onAppend en destructuring props*/}
+         <TaskItemEdit
+           item={createEmptyTodoItem()}
+           onSave={onAppend}
+           onCancel={onCancel}
+         />
    </div>
  )}
```

Podemos probar que funciona (llega a sacar un mensaje por consola)

```bash
npm run dev
```

Ya lo tenemos todo enlazado, vamos ahora a implementar la api que va a conectar para guardar d verdad los datos:

Primero el _post_ con _axios_:

_./src/modules/tasks/pods/task-collection/api/api.ts_

```diff
import axios from "axios";
import { ENV_VARIABLES } from "@/core/env";
import { taskApiCollectionSchema, TaskModel } from "./api.model";

export const getTaskCollection = async (): Promise<TaskModel[]> => {
  const { data } = await axios.get<TaskModel[]>(
    `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`
  );

  const result = taskApiCollectionSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }

  return data ?? [];
};

+ export const insertTask = async (task: TaskModel): Promise<TaskModel> => {
+   const { data } = await axios.post<TaskModel>(
+     `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`,
+     task
+   );
+
+  return data;
+ };
```

Pero lo que tenemos es un _viewModel_ así que vamos a implementar, un mapper para pasar de _viewModel_ a _apiModel_ y crear el método en el repositorio:

_./src/modules/tasks/pods/task-collection/task-collection.mapper.ts_

```diff
import * as apiModel from "./api/api.model";
import * as vm from "./task-collection.vm";

export const mapTaskFromApiToVm = (task: apiModel.TaskModel): vm.TaskVm => ({
  ...task,
});

+ export const mapTaskFromVmToApi = (task: vm.TaskVm): apiModel.TaskModel => ({
+   ...task,
+ });
```

Y creamos la entrada en el repositorio:

_./src/modules/tasks/pods/task-collection/task-collection.repository.ts_

```diff
import * as apiModel from "./api/api.model";
import { mapTaskFromApiToVm,
+        mapTaskFromVmToApi
} from "./task-collection.mapper";
import * as vm from "./task-collection.vm";
import { getTaskCollection as getTaskCollecionApi,
+        insertTask as insertTaskApi
 } from "./api/api";

export const getTaskCollection = async (): Promise<vm.TaskVm[]> => {
  const apiTaskCollection: apiModel.TaskModel[] = await getTaskCollecionApi();
  return apiTaskCollection.map(mapTaskFromApiToVm);
};

+ export const insertTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
+   const apiTask = mapTaskFromVmToApi(task);
+   const insertedTask = await insertTaskApi(apiTask);
+   return mapTaskFromApiToVm(insertedTask);
+ };
```

Toca ahora implementar la mutación con _React Query_, de momento lo hacemos en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { useTaskCollectionQuery } from "./use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent } from "./components";
+ import { useMutation } from "@tanstack/react-query";
+ import { insertTask } from "./task-collection.repository";
```

```diff
export const TaskCollectionPod: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
+ const { mutate: insertTaskMutation } = useMutation({
+    mutationFn: insertTask,
+  });

+ const handleAppend = (item: TaskVm) => {
+   insertTaskMutation(item);
+   setMode("Readonly");
+ };
```

Y lo enlazamos en el JSX

```diff
      <TaskAppendComponent
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

_Nos toca antes del refactor importar queryClient y querykeys_

```diff
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
+    onSuccess: () => {
+      queryClient.invalidateQueries({
+        queryKey: queryKeys.all(),
+      });
+    },
```

Vamos a probar que funciona:

```bash
npm run dev
```

Vamos a hacer un refactor, metemos la mutación en un hook, aquí podemos elegir:

- Si lo metemos en el _use-task-collection-query.hook.ts_.
- O si creamos un nuevo fichero, se podría llamar _use-task-mutation.hook.ts_.

Usamos un hook para el mutation:

_./src/modules/tasks/pods/task-collection/mutations/use-task-mutation.hook.ts_

```ts
import { useMutation } from "@tanstack/react-query";
import { insertTask } from "./task-collection.repository";
import { queryClient, queryKeys } from "@tasks/core/react-query";

export const useTaskMutation = () => {
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },
  });

  return {
    insertTaskMutation,
  };
};
```

Ya aprovechamos y lo metemos y metemos los dos hooks de queries / mutation en una carpeta:

_./src/modules/tasks/pods/task-collection/queries_

Y creamos un barrel:

_./src/modules/tasks/pods/task-collection/queries/index.ts_

```ts
export * from "./use-task-collection-query.hook";
export * from "./use-task-mutation.hook";
```

Y vamos a refactorizar el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
-import { useTaskCollectionQuery } from "./queries/use-task-collection-query.hook";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
import { TaskAppendComponent } from "./components";
- import { insertTask } from "./task-collection.repository";
- import { useMutation } from "@tanstack/react-query";
+ import { useTaskCollectionQuery, useTaskMutation } from "./queries";
import { TaskVm } from "./task-collection.vm";
import { queryClient, queryKeys } from "@tasks/core/react-query";

export const TaskCollectionPod: React.FC = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
+ const { insertTaskMutation } = useTaskMutation();
-  const { mutate: insertTaskMutation } = useMutation({
-    mutationFn: insertTask,
-    onSuccess: () => {
-      queryClient.invalidateQueries({
-        queryKey: queryKeys.taskCollection(),
-      });
-    },
-  });
```

Comprobamos que no hemos roto nada :)

```bash
npm run dev
```

Podemos simplifcar el POD, vamos a crear un hook que almacene el modo y el estado de la conexión (se podría haber roto en dos separados, per ahorramos poco?)

_./src/modules/tasks/pods/task-collection/task-collection.hook.ts_

```diff
+ const usePodQuery = () => {
+  const [mode, setMode] = React.useState<Mode>("Readonly");
+  const [connectionLost, setConnectionLost] = React.useState(false);
+  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
+  const { insertTaskMutation } = useTaskMutation();
+
+  React.useEffect(() => {
+    if (isError) {
+      setConnectionLost(true);
+    }
+  }, [isError]);
+
+  return {
+    mode,
+    setMode,
+    connectionLost,
+    setConnectionLost,
+    taskCollection,
+    insertTaskMutation,
+    isError,
+  };
+ };
+
 export const TaskCollectionPod: React.FC = () => {
-  const [mode, setMode] = React.useState<Mode>("Readonly");
-  const [connectionLost, setConnectionLost] = React.useState(false);
-  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
-  const { insertTaskMutation } = useTaskMutation();
-
-  const handleAppend = (item: TaskVm) => {
-    insertTaskMutation(item);
-    setMode("Readonly");
-  };
-
-  React.useEffect(() => {
-    if (isError) {
-      setConnectionLost(true);
-    }
-  }, [isError]);
+  const {
+    mode,
+    setMode,
+    taskCollection,
+    insertTaskMutation,
+    isError,
+    setConnectionLost,
+  } = usePodQuery();

  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setMode("Readonly");
  };
```

En cuanto a la lista de tareas, vamos a crear un componente para visualizar una tarea, de paso le añadimos un botón para poder editarla:

_./src/modules/tasks/pods/task-collection/components/task-display.component.tsx_

```tsx
import React from "react";
import { TaskVm } from "../task-collection.vm";

interface Props {
  item: TaskVm;
  onEdit: (id: number) => void;
}

export const TaskDisplayComponent: React.FC<Props> = (props: Props) => {
  const { item, onEdit } = props;

  return (
    <>
      <div>{item.isDone ? "✅" : "⭕️"}</div>
      <div>{item.description}</div>
      <button onClick={() => onEdit(item.id)}>Edit</button>
    </>
  );
};
```

Lo añadimos al barrer:

_./src/modules/tasks/pods/task-collection/components/index.ts_

```diff
export * from "./task-append.component";
+ export * from "./task-display.component";
```

Y le damos uso:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import classes from "./task-collection.pod.module.css";
- import { TaskAppendComponent } from "./components";
+ import { TaskAppendComponent, TaskDisplayComponent } from "./components";
```

```diff
  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todoList}>
        {taskCollection.map((task) => (
-          <React.Fragment key={task.id}>
-            <div>{task.isDone ? "✅" : "⭕️"}</div>
-            <div>{task.description}</div>
-          </React.Fragment>
+         <TaskDisplayComponent
+           key={task.id}
+           item={task}
+           onEdit={(id) => console.log("TODO... edit", id)}
+         />
        ))}
      </div>
      <TaskAppendComponent
        mode={mode}
        setAppendMode={() => setMode("Append")}
        onCancel={() => setMode("Readonly")}
        onAppend={handleAppend}
      />
    </div>
  );
};
```

_./src/modules/tasks/pods/task-collection/task-collection.pod.module.css_

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

_./src/modules/tasks/pods/task-collection/task-collection.pod.ts_

```diff
const usePodQuery = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
+ // TODO: Mover ese -1 a una constante
+ const [editingId, setEditingId] = React.useState(-1);
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
  const { insertTaskMutation } = useTaskMutation();

  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  return {
    mode,
    setMode,
+   editingId,
+   setEditingId,
    connectionLost,
    setConnectionLost,
    taskCollection,
    insertTaskMutation,
    isError,
  };
};
```

```diff
export const TaskCollectionPod: React.FC = () => {
  const {
    mode,
    setMode,
+  editingId,
+  setEditingId,
    taskCollection,
    insertTaskMutation,
    isError,
    setConnectionLost,
  } = usePodQuery();

  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setMode("Readonly");
  };

+   const handleEnterEditMode = (id: number) => {
+         console.log("** Enter Edit mode");
+     setMode("Edit");
+   // TODO... más cosas por venir
+    setEditingId(id);
+  };

  if (isError) {
```

```diff
          <TaskDisplayComponent
            key={task.id}
            item={task}
-            onEdit={(item) => console.log("TODO... edit", item)}
+            onEdit={handleEnterEditMode}
          />
```

En solo lectura utilizamos el _task-display-row_ component, vamos a crear un componente _task-edit-row.component_

_./src/modules/tasks/pods/task-collection/components/task-edit-row.component.tsx_

```tsx
import React from "react";
import { TaskVm } from "../task-collection.vm";

interface Props {
  item: TaskVm;
  onSave: (item: TaskVm) => void;
  onCancel: () => void;
}

export const TaskEditRowComponent: React.FC<Props> = (props: Props) => {
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

¿Qué pasa ahora? Pues que ahora tendríamos que irnos al POD y fila por fila ver si esa row está en modo display o append y elegir el componente toque, esto puede quedar muy guarreras... mejor crear un componente intermedio.

Vamos a primero a meter _taskDisplayRow_ y _taskEditRow_ en una subcarpeta _row_ dentro de component

```
mkdir rows
```

Movemos los dos componentes

Y creamos un barrel:

_./src/modules/tasks/pods/task-collection/components/rows/index.ts_

```ts
export * from "./task-display-row.component";
export * from "./task-edit-row.component";
```

Y vamos a crearnos el componente _taskRowComponent_:

_./src/modules/tasks/pods/task-collection/components/task-row.component.tsx_

```tsx
import React from "react";
import { Mode, TaskVm } from "../task-collection.vm";
import { TaskDisplayRowComponent, TaskEditRowComponent } from "./rows";

interface Props {
  editingId: number;
  mode: Mode;
  todo: TaskVm;
  onEnterEditMode: (id: number) => void;
  onUpdate: (item: TaskVm) => void;
  onCancel: () => void;
}

export const TaskRowComponent: React.FC<Props> = (props: Props) => {
  const { todo, editingId, mode, onEnterEditMode, onUpdate, onCancel } = props;

  return (
    <>
      {mode === "Readonly" || todo.id !== editingId ? (
        <TaskDisplayRowComponent
          key={todo.id}
          item={todo}
          onEdit={onEnterEditMode}
        />
      ) : (
        <TaskEditRowComponent
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

_./src/modules/tasks/pods/task-collection/components/index.ts_

```diff
export * from "./task-append.component";
- export * from "./task-display.component";
+ export * from "./task-row.component";
```

Y lo usamos en el POD:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
import React from "react";
import { Mode } from "./task-collection.vm";
import classes from "./task-collection.pod.module.css";
- import { TaskAppendComponent, TaskDisplayRowComponent } from "./components";
+ import { TaskAppendComponent, TaskRowComponent } from "./components";
import { useTaskCollectionQuery, useTaskMutation } from "./queries";
import { TaskVm } from "./task-collection.vm";

```

```diff
export const TaskCollectionPod: React.FC = () => {
  const {
    mode,
    setMode,
+  editingId,
    setEditingId,
    taskCollection,

```

```diff
  return (
    <div>
      <h1>Task Collection POD</h1>
      <div className={classes.todoList}>
        {taskCollection.map((task) => (
-          <TaskDisplayRowComponent
-            key={task.id}
-            item={task}
-            onEdit={handleEnterEditMode}
-          />
+          <TaskRowComponent
+            key={task.id}
+            editingId={editingId}
+            mode={mode}
+            todo={task}
+            onEnterEditMode={handleEnterEditMode}
+            onUpdate={handleUpdate}
+            onCancel={handleCancel}
+          />
        ))}
        ))}
      </div>
```

Nos falta el _handleUpdate_ y el _handleCancel_, vamos a dejar en blanco el update (después lo implementamos) y a implentar el cancel:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
  const handleAppend = (item: TaskVm) => {
    insertTaskMutation(item);
    setMode("Readonly");
  };

+ const handleUpdate = (item: TaskVm) => {
+   console.log("TODO... update", item);
+ };
+
+  const handleCancel = () => {
+    setMode("Readonly");
+    setEditingId(-1);
+  };

  if (isError) {
```

Vamos ahora a por el put, primero en la API:

_./src/modules/tasks/pods/task-collection/api/api.ts_

```diff
export const insertTask = async (task: TaskModel): Promise<TaskModel> => {
  const { data } = await axios.post<TaskModel>(
    `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos`,
    task
  );

  return data;
};

+ export const updateTask = async (task: TaskModel): Promise<TaskModel> => + {
+   const { data } = await axios.put<TaskModel>(
+     `${ENV_VARIABLES.TASKS_API_BASE_URL}/todos/${task.id}`,
+     task
+   );
+
+  return data;
+ };
```

El mapper, ya lo tenemos (lo creamos para el insert).

Implementamos el repositorio:

_./src/modules/tasks/pods/task-collection/task-collection.repository.ts_

```diff
import {
  getTaskCollection as getTaskCollecionApi,
  insertTask as insertTaskApi,
+  updateTask as updateTaskApi,
} from "./api/api";

// (...)

export const insertTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
  const apiTask = mapTaskFromVmToApi(task);
  const insertedTask = await insertTaskApi(apiTask);
  return mapTaskFromApiToVm(insertedTask);
};

+ export const updateTask = async (task: vm.TaskVm): Promise<vm.TaskVm> => {
+   const apiTask = mapTaskFromVmToApi(task);
+   const updatedTask = await updateTaskApi(apiTask);
+   return mapTaskFromApiToVm(updatedTask);
+ };
```

Y ahora vamos a por la query de update, en el hook de mutation

_./src/modules/tasks/pods/task-collection/mutations/use-task-mutation.hook.ts_

```diff
import { useMutation } from "@tanstack/react-query";
- import { insertTask } from "../task-collection.repository";
+ import { insertTask, updateTask } from "../task-collection.repository";
import { queryClient, queryKeys } from "@tasks/core/react-query";

export const useTaskMutation = () => {
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },
  });

+  const { mutate: updateTaskMutation } = useMutation({
+    mutationFn: updateTask,
+    onSuccess: () => {
+      queryClient.invalidateQueries({
+        queryKey: queryKeys.taskCollection(),
+      });
+    },
+  });

  return {
    insertTaskMutation,
+    updateTaskMutation,
  };
  };
};
```

Y nos vamos al pod:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
const usePodQuery = () => {
  const [mode, setMode] = React.useState<Mode>("Readonly");
  // TODO: Mover ese -1 a una constante
  const [editingId, setEditingId] = React.useState(-1);
  const [connectionLost, setConnectionLost] = React.useState(false);
  const { taskCollection, isError } = useTaskCollectionQuery(!connectionLost);
-  const { insertTaskMutation } = useTaskMutation();
+  const { insertTaskMutation, updateTaskMutation } = useTaskMutation();


  React.useEffect(() => {
    if (isError) {
      setConnectionLost(true);
    }
  }, [isError]);

  return {
    mode,
    setMode,
    editingId,
    setEditingId,
    connectionLost,
    setConnectionLost,
    taskCollection,
    insertTaskMutation,
+    updateTaskMutation
    isError,
  };
};
```

```diff
  const handleUpdate = (item: TaskVm) => {
-    console.log("TODO... update", item);
+   updateTaskMutation(item);
+    setMode("Readonly");
+    setEditingId(-1);
  };

  const handleCancel = () => {
    setMode("Readonly");
    setEditingId(-1);
  };
```

Vamos a probar

```bash
npm run dev
```

Un pequeño detaslle, en _handleAppend_, _handleUpdate_ y _handleCancel_ hay dos pasos iguales (volver a modo lectura), vamos a sacar esto en un método:

_./src/modules/tasks/pods/task-collection/task-collection.pod.tsx_

```diff
+ // TODO: esto lo podemos mover al hook usePodQuery
+ const setReadonlyMode = () => {
+  setMode("Readonly");
+  setEditingId(-1);
+ };
+
 const handleAppend = (item: TaskVm) => {
   insertTaskMutation(item);
+   setReadonlyMode();
 };
+
+ const handleUpdate = (item: TaskVm) => {
+   updateTaskMutation(item);
+   setReadonlyMode();
+ };
+
+ const handleCancel = () => {
+   setReadonlyMode();
+ };
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

_./src/modules/tasks/pods/task-collection/queries/use-task-mutation.hook_

```diff
+ import {produce} from "immer";
+ import { TaskVm } from "../task-collection.vm";
import { useMutation } from "@tanstack/react-query";
import { insertTask, updateTask } from "../task-collection.repository";
import { queryClient, queryKeys } from "@tasks/core/react-query";
```

```diff
  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },
+   onMutate: async (newTask : TaskVm) => {
+      // TODO Aquí hay que hacer más cosas, ver este ejemplo
+      // https://tanstack.com/query/latest/docs/react/guides/optimistic-updates
+      queryClient.setQueryData(queryKeys.taskCollection(), (old : TaskVm[]) => {
+        return produce(old, (draft: TaskVm[]) => {
+            const index = draft.findIndex((item) => item.id === newTask.id);
+            if(index !== -1) {
+              draft[index] = newTask;
+            }
+         })
+      });
+   }
  });
```

Para probar que esto funciona vamos a deshabilitar el refresco automático:

_./src/modules/tasks/pods/task-collection/queries/use-task-mutation.hook.ts_

```diff
export const useTaskMutation = () => {
  const { mutate: insertTaskMutation } = useMutation({
    mutationFn: insertTask,
    onSuccess: () => {
-      queryClient.invalidateQueries({
-        queryKey: queryKeys.taskCollection(),
-      });
+   // Comentar esto sólo para la prueba
+   //   queryClient.invalidateQueries({
+   //     queryKey: queryKeys.taskCollection(),
+   //   });


    },
  });

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.taskCollection(),
      });
    },

```

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

- Y haya habido error o no, volvemos a pedir datos de servidor por si acaso (aún así, el usuario ya ha visto el cambio)

¿Por qué tantas vueltas? Para evitar casos aristas:

- Oye justo actualizo caché, pero venían un refresh del servidor antes de que llegara el update y se carga la caché sin mi dato.

- Oye que el server esta caido, y quiero que el usuario se de cuenta de que el update ha ido mal (incluso podría mostrar una tostada de error).

- Que mira, que se ha actualizado todo... pues por si acaso vamos a pedir un refetch y nos traemos un corte limpio.

[Para saber más sobre mutations en React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)
