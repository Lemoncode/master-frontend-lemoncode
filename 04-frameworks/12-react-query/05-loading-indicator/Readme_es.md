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
