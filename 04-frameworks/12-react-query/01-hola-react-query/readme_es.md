# Hola React Query

Vamos a iniciarnos con React Query y que mejor manera que migrar el ejemplo anterior a React Query, vamos a ver que nos aporta.

# Paso a paso

Partimos del ejemplo anterior de este curso e instalamos la dependencias.

```bash
npm install
```

## Paso a paso

## Instalación y fontanería

Instalamos React Query y sus devtools

```bash
npm install @tanstack/react-query --save
```

```bash
npm install @tanstack/react-query-devtools --save-dev
```

¿Todos instalado? Perfecto

A nivel de aplicación en tenemos que definir un provider, pero antes nos hace falta instancia una instancia de QueryClient que será la que se usara en toda la aplicación:

./src/core/react-query/query.ts

```tsx
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
```

creamos un barrel:

./src/core/react-query/index.ts

```tsx
export * from "./query";
```

Si queremos podemos definir una serie de opciones globales que aplicarían a todas las consultas:

_./src/core/react-query/query-client_

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
+       gcTime: 1000 * 60 * 5,
+       refetchInterval: 1000 * 60 * 5,
+     },
+   },
+ });
```

¿Que quieren decir estos valores?

- refetchOnWindowFocus: Esto es para que no se refresque la página cuando se cambia de pestaña.

- refetchOnMount: Esto es para que se refresque la página cuando se carga.

- retry: Esto es para que no se reintenten las peticiones.

- staleTime: Aquí te dicen si los datos están obsoletos:

  - Si no están obsoletos los sirve tal cual y no hace la petición.
  - Si los datos están obsoletos:
    - En caso de que estén en cache te los muestra de primeras.
    - En paralelo te hace un petición a servidor para actualizar los datos.

- gcTime: Es el tiempo en el que mantiene los datos en caché, en cuanto caduca los deja listo para que el recolector de basura se pase a hacer limpia (esto se llamaba antes _cacheTime_).

- interval: Esto es para que cada 5 minutos se refresque la información.

Y lo más interesante, el grado de granularidad que tenemos, además de poder tocar estos settings a nivel global, nos podemos bajar a nivel de consulta y definirlo para una en concreto.

Siguiente paso, a nivel de aplicación vamos a definir un provider para poder usar react-query:

_./src/App.tsx_

```diff
import "./App.css";
import { Router } from "@/core/routing";
+ import { QueryClientProvider } from "@tanstack/react-query";
+ import { queryClient } from "@/core/react-query";

export const App = () => {
  return (
    <>
+    <QueryClientProvider client={queryClient}>
       <Router />
+    </QueryClientProvider>
    </>
  );
};
```

Y ahora vamos a habilitar las devtools de react-query:

```diff
+ import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// (...)

export const App = () => {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Router />
+      <ReactQueryDevtools/>
    </QueryClientProvider>
    </>
  );
};
```

Esto nos permitirá ir viendo el estado de las diferentes queries que estemos trackeando con react-query, en producción directamente no sale.

## Lista de miembros de Github

Vamos ahora a tirar nuestra primera consulta con `React Query``, fíjate que nos cargamos el _useEffect_ que teníamos antes:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import React from "react";
import { getGithubMembersCollection } from "./github-collection.repository";
- import { GithubMemberVm } from "./github-collection.vm";
import { GithubCollectionComponent } from "./github-collection.component";
+ import { useQuery } from "@tanstack/react-query";

export const GithubCollectionPod: React.FC = () => {
   const [filter, setFilter] = React.useState("");
-  const [githubMembers, setGithubMembers] = React.useState<GithubMemberVm[]>(
-    []
-  );
-
-  const loadGithubMembers = async (filter: string) => {
-    if (filter) {
-      const membersCollection = await getGithubMembersCollection(filter);
-      setGithubMembers(membersCollection);
-    }
-  };
-
-  React.useEffect(() => {
-    loadGithubMembers(filter);
-  }, [filter]);
+
+  const { data: githubMembers = [] } = useQuery({
+    queryKey: ["githubMembers", filter],
+    queryFn: () => getGithubMembersCollection(filter),
+  });

  return (
```

Probamos y a ver que paso (IMPORTANTE ABRIR DEV TOOLS CONSOLA):

```bash
npm run dev
```

Si ejecutamos esto, y abrimos las devtools vemos que da un error, esto es porque se lanza la consulta con el filtro vació, vamos a ver como deshabilitarla si el filtro no está vacio:

```diff
export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
+   enabled: !!filter,
  });
```

> Esto tambíen me puede ser útil si tengo que lanzar queries dependientes (ojo que esto suele ser un mal olor, a veces es mejor que un endpoint del server te de esos datos)

> También me puede servir si muestro datos y quiero entrar en modo edición (aunque aquí lo suyo es sacar a otro objeto y no tocar el original)

Otro detalle: si pinchamos y volvemos se pierde el filtro vamos a añadir un contexto para que lo guarde (esto no tiene que ver co React Query)

Vamos a crear en el pod de github-collection un provider para el fitro:

creamos su contexto:

_./src/github-collection/providers/organization-filter.context.ts_

```tsx
import { createContext, useContext } from "react";

interface ContextProps {
  filter: string;
  setFilter: (filter: string) => void;
}

// asignamos un objeto por si el filtro crece en un futuro
export const OrganizationFilterContext = createContext<ContextProps | null>(
  null
);

export const useOrganizationFilterContext = (): ContextProps => {
  const context = useContext(OrganizationFilterContext);
  if (!context) {
    throw new Error(
      "useOrganizationFilterContext must be used within a OrganizationFilterProvider"
    );
  }
  return context;
};
```

su provider

_./src/github-collection/providers/organization-filter.provider.tsx_

```tsx
import React from "react";
import { OrganizationFilterContext } from "./organization-filter.context";

interface Props {
  children: React.ReactNode;
}

export const OrganizationFilterProvider: React.FC<Props> = ({ children }) => {
  const [filter, setFilter] = React.useState("");
  return (
    <OrganizationFilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </OrganizationFilterContext.Provider>
  );
};
```

Vamos a exponerlo todo con un barrel:

_./src/github-collection/providers/index.ts_

```tsx
export * from "./organization-filter.context";
export * from "./organization-filter.provider";
```

Vamos a instanciarlo a nivel de aplicación (queremos que viva por encima del router):

_./src/App.tsx_

```diff
import "./App.css";
import { Router } from "@/core/routing";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
+ import { OrganizationFilterProvider } from "@/pods/github-collection/providers";
```

```diff
function App() {
  return (
    <QueryClientProvider client={queryClient}>
+     <OrganizationFilterProvider>
       <Router />
+    </OrganizationFilterProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

Vamos a darle use en el pod:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
import { GithubCollectionComponent } from "./github-collection.component";
import { FilterComponent } from "./components";
import { getGithubMembersCollection } from "./github-collection.repository";
import { useQuery } from "@tanstack/react-query";
+ import { useOrganizationFilterContext } from "./providers";
```

```diff
export const GithubCollectionPod: React.FC = () => {
-  const [filter, setFilter] = React.useState("");
+  const { filter, setFilter } = useOrganizationFilterContext();

  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: !!filter,
  });

  return (
    <div>
      <FilterComponent
        initialValue={filter}
        onSearch={(value) => setFilter(value)}
      />
      <GithubCollectionComponent githubMembers={githubMembers} />
    </div>
  );
};

```

Vemos que funciona

```bash
npm run dev
```

Si ahora ponemos un slow 3G (y en tab network DISABLE CACHE CHECKBOX) podrás ver que los datos están allí aunque hagamos un refetch, si ponemos para esta consulta un gcTime de 0 mira la diferencia.

**_ Eliminar esto después _**

```diff
  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
+    staleTime: 0,
+    gcTime: 0,
  });
```

Prueba a quitar y poner verás que interesante el cambio.

También es interesante este caso: corta la conexión a internet (network tab de dev tools, acuerdate habilitar cache navegador) y ver que consultas que ya hemos hecho se nos sirven, esto puede ser interesante para una aplicación que se use en un sitio con mala cobertura y que trabaje con un conjunto reducido de datos.

Otra cosa que puedes hacer es incluso evitar que se llegue a lanzar la consulta, tanto de forma indefinida (_infinity_), como por un tiempo, esto lo puedes hacer con _staleTime_

```diff
  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
+    staleTime: Infinity,
+    gcTime: Infinity
  });
```

¿Para que puede servir esto? Aplicaciones tipo cuadro de mandos donde hay una serie de datos que son de solo lectura y cambian por ejemplo una vez a la semana, un caso muy útil puede ser el de mapas donde conformes haces zoom in / out, pan... vas cargando más o menos datos de detalle, que mejor que tenerlo todo en memoria.

Y aquí podemos jugar con un montón de casos, fijate que la cache se desactiva pasado un tiempo sin observadores, en las devtools en la parte derecha de una consulta, el valor _observers_ cuando deja de valer 1... el tiempo de _gcTime_ empieza a rodar.

> En una aplicación normal con los valores por defecto vamos sobrados, pero es bueno saber que tenemos esto.

Vamos a eliminar esos valores

```diff
  const { data: githubMembers = [] } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
-    staleTime: Infinity,
-    gcTime: 0,
  });
```

### Aristas

Vamos a cubrir algunas aristas (después avanzaremos e iremos a por más)

¿Qué pasa si me hace falta ejecutar alguna acción justo cuando se han cargado los datos? Si estás en esa escenario piensa si puede ser un mal olor, si no hay más remedio, aquí va una solución, utilizando useEffect:

```diff
-  const { data: githubMembers = [] } = useQuery({
+  const { data: githubMembers = [], isSuccess } = useQuery({

    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
  });

+  React.useEffect(() => {
+    if (isSuccess) {
+      console.log("Aquí puedes hacer lo que quieras");
+    }
+  }, [githubMembers, isSuccess]);
```

> Si quiero manejar errores también tengo un _isError_

> Esto tambíen me puede ser útil si tengo que lanzar queries dependientes (ojo que esto suele ser un mal olor, a veces es mejor que un endpoint del server te de esos datos)

### Disables y refetch

Y si... ¿Quiero que la consulta deje de refrescarse de forma automática? Puede jugar con el _enabled_ y ponerlo a false bajo alguna condición.

> También me puede servir si muestro datos y quiero entrar en modo edición (aunque aquí lo suyo es sacar a otro objeto y no tocar el original)


¿Y al contrario? Quiero que el usuario pueda hacer un refresh manual, para eso tengo el _refetch_.

```diff
  const {
    data: githubMembers = [],
    isSuccess
+   refetch
  } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });
```

Y podemos añadir un botón

```diff
return (
  <div>
+    <button onClick={() => refetch()}>Refrescar</button>
    <FilterComponent
      initialValue={filter}
      onSearch={(value) => setFilter(value)}
    />
    <GithubCollectionComponent githubMembers={githubMembers} />
  </div>
);
```

### Refactor custom hook

En el GithubCollectionPod, hay algo de lógica en el componente (la veo aceptable), pero si por ejempo gestionaramos control de errores u otras queries podría convertirse en un código poco mantenible, podemos refactorizarlo a un custom hook:

_./src/pods/github-collection/github-collection-query.hook.tsx_

```tsx
import { useQuery } from "@tanstack/react-query";
import { getGithubMembersCollection } from "./github-collection.repository";

export const useGithubCollectionQuery = (filter: string) => {
  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["githubMembers", filter],
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });

  return { githubMembers, isSuccess, refetch };
};
```

Y _vaciamos el cangrejo_ en el pod:

_./src/pods/github-collection.pod.ts_

```diff
import React from "react";
- import { getGithubMembersCollection } from "./github-collection.repository";
import { GithubCollectionComponent } from "./github-collection.component";
- import { useQuery } from "@tanstack/react-query";
import { FilterComponent } from "./components";
+ import { useGithubCollectionQuery } from "./github-collection-query.hook";

export const GithubCollectionPod: React.FC = () => {
  const { filter, setFilter } = useOrganizationFilterContext();

-  const {
-    data: githubMembers = [],
-    isSuccess,
-    refetch,
-  } = useQuery({
-    queryKey: ["githubMembers", filter],
-    queryFn: () => getGithubMembersCollection(filter),
-    enabled: filter !== "",
-  });
+ const { githubMembers, isSuccess, refetch } = useGithubCollectionQuery(filter);

  React.useEffect(() => {

```

## Detalle

Ya tenemos la página de listado, completa.

Vamos a por la de detalle

Pasos:

- Nos vamos al pod de _github-member_.
- Creamos un use query, aquí para la clave:
  - Primer parámetro, podemos usar "githubMember" (ya aprenderemos como eliminar estos harcodeos).
  - Segundo parámetro, el id del usuario que nos viene por parámetro.
- Eliminamos en _useEffect_
- Nos podemos plantear crear un custom hook para encapsular la lógica de la query.

** Solución **

_./src/pods/github-member/github-member.pod.tsx_

```diff
import React from "react";
+ import { useQuery } from "@tanstack/react-query";
import { getGithubMemberDetail } from "./github-member.repository";
import { createDefaultMemberDetail } from "./github-member.vm";
import { GithubMemberComponent } from "./github-member.component";

interface Props {
  id: string;
}

export const GithubMemberPod: React.FC<Props> = (props) => {
  const { id } = props;
-  const [member, setMember] = React.useState(createDefaultMemberDetail());

-  React.useEffect(() => {
-    const loadGithubMember = async () => {
-      const member = await getGithubMemberDetail(id);
-      setMember(member);
-    };
-    loadGithubMember();
-  }, []);

+   const {
+    data: member = createDefaultMemberDetail(),
+  } = useQuery({
+    queryKey: ["githubMember", id],
+    queryFn: () => getGithubMemberDetail(id),
+  });
```

## Mejora estructura keys

Toca el momento de arreglar el hardcodeo de las "keys"... eso de ir metiendo strings mágicos por todos sitios no es buena idea ¿Los podemos meter en un fichero de constantes? Si... pero podemos hacer algo mejor... ¿ Y si creamos una jerarquía de objetos? Imaginate que ya tienes el módulo de Github y el de lista de Tareas, ¿Y si hay un cambio de BBDD grande y enviamos una señal al cliente para que invalide todo lo qu tiene en cache? Sería un rollo ir _key_ por _key_ podríamos agruparlo y decir... pues mirar todo lo que sea "github" ya no vale, o todo lo que sea "task"...

Vamos a crearnos la siguiente estructura en _core_:

_./src/core/react-query/query-keys.ts_

```ts
export const githubKeys = {
  all: ["github"] as const,
  members: (org: string) => [...githubKeys.all, "members", org] as const,
  member: (id: string) => [...githubKeys.all, "member", id] as const,
};
```

Vamos a hacer refactor en las queries:

_./src/pods/github-member/github-collection-query.hook.tsx_

```diff
import { useQuery } from "@tanstack/react-query";
import { getGithubMembersCollection } from "./github-collection.repository";
+ import { githubKeys } from "@/core/react-query/query-keys";

export const useGithubCollectionQuery = (filter: string) => {
  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
-    queryKey: ["githubMembers", filter],
+    queryKey: githubKeys.members(filter),
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
  });

  return { githubMembers, isSuccess, refetch };
};
```

Y en el pod de detalle:

_./src/pods/github-member/github-member.pod.tsx_

```diff
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getGithubMemberDetail } from "./github-member.repository";
import { createDefaultMemberDetail } from "./github-member.vm";
import { GithubMemberComponent } from "./github-member.component";
+ import { githubKeys } from "@/core/react-query/query-keys";

interface Props {
  id: string;
}

export const GithubMemberPod: React.FC<Props> = (props) => {
  const { id } = props;

  const { data: member = createDefaultMemberDetail() } = useQuery({
-    queryKey: ["githubMember", id],
+    queryKey: githubKeys.member(id),
    queryFn: () => getGithubMemberDetail(id),
  });
```

Y vamos a añadir un botón para invalidar la cache en todas las consultas de github:

_./src/pods/github-collection/github-collection.pod.tsx_

```diff
+ import { queryClient } from "@/core/react-query";
+ import { githubKeys } from "@/core/react-query/query-keys";

// (...)

export const GithubCollectionPod: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const { githubMembers, isSuccess, refetch } =
    useGithubCollectionQuery(filter);

  React.useEffect(() => {
    if (isSuccess) {
      console.log("Aquí puedes hacer lo que quieras");
    }
  }, [githubMembers, isSuccess]);

  return (
    <div>
+     <button onClick={() => queryClient.invalidateQueries({ queryKey: githubKeys.all })}>Invalidar todas las consultas de github</button>
      <button onClick={() => refetch()}>Refrescar</button>
      <FilterComponent
```

Para ver esto en acción vamos a meterle un staleTime de 5 minutos y un gcTime de 10 minutos:

```diff
export const useGithubCollectionQuery = (filter: string) => {
  const {
    data: githubMembers = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: githubKeys.members(filter),
    queryFn: () => getGithubMembersCollection(filter),
    enabled: filter !== "",
+    staleTime: 1000 * 60 * 5,
+    gcTime: 1000 * 60 * 10,
  });

  return { githubMembers, isSuccess, refetch };
};
```


Abrimos las dev tools y vemos como funciona:

```bash
npm run dev
```

También existe una librería que te ayuda a crear este fichero: [@lukemorales/query-key-factory](https://github.com/lukemorales/query-key-factory)

¿Listo para el siguiente paso? Edición...

# Para saber más

https://tkdodo.eu/blog/practical-react-query

Dependant queries:

https://tanstack.com/query/latest/docs/react/guides/dependent-queries
