# APIS

Bueno la aplicación va tomando forma :), ahora vamos a profundizar en el concepto de _pod_, nuestro objetivo es tener
un _pod_ rico, pero separando las procesos y teniendo cada archivo con un objetivo claro.

En este ejemplo vamos a extraer el acceso a la _rest API_ del contenedor en un archivo separado, vamos a discutir
dónde colocar esta funcionalidad y cómo distinguir entre el modelo API del servidor y el modelo _View_ del _pod_, y cómo
realizar conversiones entre entidades.

# Pasos

- Así que ahora queremos extraer el código que accede a una _rest API_ del contenedor, nuestro primer instinto podría ser crear
  una carpeta raíz _/api/_, pero ¿qué problemas podríamos tener al usar esto?

- Estamos llevando lejos los _assets_ relacionados, cada vez que queremos tocar el repo y estamos en el contenedor tenemos
  que escarbar en la carpeta _api deep blue sea_.

- Es difícil saber qué _api_ se está usando y dónde, quizás podamos introducir algún cambio por error en una _api_ determinada
  que pueda afectar a otro _pod_.

- Es fácil generar conflictos con otros desarrolladores del equipo ya que estamos actualizando cosas comunes.

- Si queremos extraer la funcionalidad del _pod_ tenemos que conceder algunos archivos del pod, otros de la carpeta api,
  no es sencillo.

Así que vamos a intentar un cambio radical, vamos a almacenar la _api_ dentro del _pod_... pero luego si quieres reutilizarla qué pasa:

- Normalmente la mayoría de las llamadas que vas a hacer a una _api rest_ sólo serán utilizadas por ese pod dado y no por otros pods.
- Si hay una llamada a una _api rest_ que es muy utilizada por otros pods (por ejemplo, búsquedas, etc.), entonces
  podemos promocionar esa _api_ a una carpeta _core/apis_ y usarla en todos los sitios.

- Empecemos a refactorizar la página de login, en este caso iremos un paso más allá:

  - Tenemos que estar preparados para la integración "real", ahora mismo sólo estamos comprobando algún usuario/contraseña ficticio de forma
    manera sincrónica.
  - Por qué no crear una _API_ de cliente que devuelva una promesa con el resultado esperado, siguiendo este enfoque:
    - Una vez que obtenemos la API del servidor real sólo tenemos que actualizar el archivo _api_, el resto de los activos / componentes no
      se verán afectados.
    - Podemos configurar mediante una variable de entorno si queremos utilizar la api real o el cliente simulado (esto nos permitirá
      (esto nos permitirá realizar pruebas _e2e_, o si el servidor está caído seguir avanzando con el _mock_).

- Primero vamos a simular una API de cliente:

_./pods/login/login.api.ts_

```ts
export const doLogin = (
  username: string,
  password: string
): Promise<Boolean> => {
  const promise = new Promise<Boolean>((resolve, reject) => {
    // Simulating Ajax Call
    setTimeout(() => {
      resolve(username === "admin" && password === "test");
    }, 500);
  });
  return promise;
};
```

> Para simplificar estamos usando el manejo de promesas estándar, podríamos usar async await pero necesitaría
> alguna configuración extra (regenerator runtime).

- Y ahora vamos a consumirlo en el contenedor del _login_.

_./src/pods/login/login.container.tsx_

```diff
+ import { doLogin } from './login.api';

// (...)

  const handleLogin = (username: string, password: string) => {
-    if (username === "admin" && password === "test") {
-      setUserProfile({ userName: username });
-      navigate(routes.list);
-    } else {
-      alert("User / password not valid, psst... admin / test");
-    }
+    doLogin(username, password).then(result => {
+      if(result) {
+         setUserProfile({ userName: username });
+         navigate(routes.list);
+      } else {
+        alert("User / password not valid, psst... admin / test");
+     }
+    })
  };
```

- Esto no está relacionado con la api, pero es un buen momento para comprobar lo fácil que es crear un componente personalizado,
  si echamos un vistazo a este contenedor, está empezando a tener algo de código que no está relacionado con lo
  renderizado, podemos pensar en encapsular alguna funcionalidad en un hook personalizado, algo así:

```diff
+ const useLoginHook = () => {
+  const navigate = useNavigate();
+  const { setUserProfile } = React.useContext(ProfileContext);
+
+  const loginSucceededAction = (userName) => {
+        setUserProfile({ userName });
+        navigate(routes.list);
+  }
+
+  const loginFailedAction = () => {
+    alert("User / password not valid, psst... admin / test");
+  }
+  return {loginSucceededAction, loginFailedAction}
+}

export const LoginContainer: React.FC = () => {
-  const navigate = useNavigate();
-  const { setUserProfile } = React.useContext(ProfileContext);
+  const {loginSucceededAction, loginFailedAction} = useLoginHook();

  const handleLogin = (username: string, password: string) => {
    doLogin(username, password).then((result) => {
      if (result) {
-        setUserProfile({ userName: username });
-        navigate(routes.list);
+        loginSucceededAction(username);
      } else {
-        alert("User / password not valid, psst... admin / test");
+        loginFailedAction();
      }
    });
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

Incluso podríamos ir un paso más allá y encapsular _handleLogin_ en el _hook_, ¿quieres probar?
¿Es una buena idea?

- Ahora es el momento de aplicar este _refactor_ al _pod_ de la lista, pero tenemos un escenario más complejo:

  - En este caso nuestra API está devolviendo una lista de entidades (no es un tipo simple).
  - Estas entidades del servidor pueden diferir de las entidades que estamos utilizando en nuestro _pod_, por ejemplo:
    - Es una _api_ de terceros y devuelve una estructura compleja, y nosotros sólo necesitamos algunos campos (por ejemplo
      _open hotel apis_).
    - Es una _api_ de terceros y la forma de nombrar algunos campos no es la misma como estamos
      usando en nuestro dominio.
    - La misma vista está golpeando a varios proveedores de _APIs_ (por ejemplo, se quiere mostrar la disponibilidad de hoteles de
      diferentes proveedores de camas, cada uno de los cuales tiene sus propios contratos).
    - La _api_ de terceros devuelve algunos campos, pero necesitamos aplicar algunas transformaciones:
      - Formateo de fechas.
      - Hacer algunos cálculos (por ejemplo una _API_ nos devuelve una lista de formaciones y sólo queremos mostrar
        una píldora con el número total).

- Para controlar esto introducimos nuevas piezas:
  - El _ViewModel_ son las entidades relacionadas con el _pod UI_.
  - El _ApiModel_ son las entidades que expone la _API_ del servidor (_Rest API_).
  - Un _Mapper_ es el puente entre el _ViewModel_ y la _API_ y viceversa: se trata de funciones que mapean los
    datos en ambos sentidos aplicando las transformaciones necesarias.

Nuestro objetivo principal es preprocesar los datos para que la Vista (_UI_) tenga que centrarse en mostrar la información, después
que adaptarla desde el servidor al cliente.

- Empecemos, primero crearemos la api de la lista:

_./src/pods/list/list.api.ts_

```tsx
import { MemberEntity } from "./list.vm";

export const getMemberCollection = (): Promise<MemberEntity[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`).then((response) =>
    response.json()
  );
```

- Y vamos a consumirlo en el contenedor:

_./src/pods/list/list.container.ts_

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
+ import { getMemberCollection } from './list.api';

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
+    getMemberCollection().then(
+     (memberCollection : MemberEntity[]) => setMembers(memberCollection)
+ );
-    fetch(`https://api.github.com/orgs/lemoncode/members`)
-      .then((response) => response.json())
-      .then((json) => setMembers(json));
  }, []);

  return <ListComponent members={members} />;
};
```

- Eso estaba bien, pero estamos haciendo una suposición peligrosa, en la _api_ estamos devolviendo directamente
  una entidad _viewmodel_, pero la _API_ de _Github_ devuelve muchos más datos, incluso los nombres podrían no ser
  los mismos que estamos utilizando, deberíamos establecer un _api.model_:

Podemos echar un vistazo al resultado real de la api y crear una entidad más precisa:

https://api.github.com/orgs/lemoncode/members

_./src/pods/list/list.api-model.ts_

```ts
export interface MemberEntityApi {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: string;
}
```

Actualicemos nuestra _api_ de la lista para consumir la entidad real del servidor :)

_./src/pods/list.api.ts_

```diff
- import {MemberEntity} from './list.vm'
+ import { MemberEntityApi } from './list.api-model';


- export const getMemberCollection = () : Promise<MemberEntity[]> =>
+ export const getMemberCollection = () : Promise<MemberEntityApi[]> =>
  fetch(`https://api.github.com/orgs/lemoncode/members`)
  .then((response) => response.json())
```

Ahora nos da un error en el contenedor de la lista, ¿podéis decirme qué pasa?

Para solucionar esto vamos a crear una pieza separada que transformará de
_MemberEntityApi_ a _MemberEntity_ (viewModel), a esto lo llamaremos un _mapper_,
cosas a tener en cuenta:

- En este caso la solución es sencilla, normalmente tendremos que manejar
  conversiones de fechas, nombres de campos que no coinciden, información que puede ser anidada,
  o incluso algunos cálculos adicionales que hay que realizar.
- Los mapeadores son un excelente candidato para ser implementados usando _TDD_, debes
  estar preparado para cubrir casos de borde (objeto nulo, indefinido, sin resultados...).
- En una forma de lectura/escritura, mapearemos en ambos sentidos api -> vm y vm -> api
  (recuperación de datos, escritura de datos).

Vamos a crear un mapeador simple, pero no vamos a ver si nuestro código es robusto o no
(podemos hacerlo en el módulo de pruebas).

_./src/pods/list.mapper.ts_

```ts
import * as vm from "./list.vm";
import * as api from "./list.api-model";

export const mapMemberFromApiToVm = (
  member: api.MemberEntityApi
): vm.MemberEntity => ({
  id: member.id.toString(),
  login: member.login,
  avatar_url: member.avatar_url,
});

export const mapMemberCollectionFromApiToVm = (
  memberCollection: api.MemberEntityApi[]
): vm.MemberEntity[] =>
  memberCollection.map((member) => mapMemberFromApiToVm(member));
```

- Ahora podríamos intentar realizar el mapeo directamente en el contenedor, funcionaría, pero...

_./src/pods/list/list.container.tsx_

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
import { getMemberCollection } from "./list.api";
+ import {mapMemberCollectionFromApiToVm} from "./list.mapper";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
-    getMemberCollection().then((memberCollection: MemberEntity[]) =>
+    getMemberCollection().then((memberCollection) =>
-      setMembers(memberCollection)
+      setMembers(mapMemberCollectionFromApiToVm(memberCollection))
    );
  }, []);

  return <ListComponent members={members} />;
};
```

Pero aquí hay algo que no está bien:

- La vista no debe ser consciente de un modelo diferente
  que el _Viewmodel_.

- La vista se está encargando del proceso de transformación, esto debería
  ser transparente para la _UI_.

Vamos a añadir un componente más, el repositorio:

- El objetivo de esta pieza es proporcionar una _API_ que hable _"Viewmodelish"_.
- Nos permitirá desacoplar el modelo _api_ de la vista.

_./src/list/list.repository.ts_

```tsx
import { MemberEntity } from "./list.vm";
import { getMemberCollection as getMemberCollectionApi } from "./list.api";
import { mapMemberCollectionFromApiToVm } from "./list.mapper";

export const getMemberCollection = (): Promise<MemberEntity[]> => {
  return new Promise<MemberEntity[]>((resolve) => {
    getMemberCollectionApi().then((result) => {
      resolve(mapMemberCollectionFromApiToVm(result));
    });
  });
};
```

Y ahora vamos a simplificar nuestro contenedor de la lista:

```diff
import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
- import { getMemberCollection } from "./list.api";
+ import { getMemberCollection } from './list.repository';
- import { mapMemberCollectionFromApiToVm } from "./list.mapper";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    getMemberCollection().then((memberCollection) =>
-      setMembers(mapMemberCollectionFromApiToVm(memberCollection))
+      setMembers(memberCollection)

    );
  }, []);

  return <ListComponent members={members} />;
};
```

Qué beneficios obtenemos al seguir este enfoque (en un escenario real):

- Cada parte hace su propio trabajo.
- En el futuro podría ser bastante fácil promover una api + modelo a común si es necesario, nosotros
  sólo necesitamos crear las entradas del repositorio para adaptarlas al _viewmodel_ en cada _pod_ donde
  se está utilizando.
- Obtenemos partes separadas que hacen una cosa y sólo una cosa.
- Todos los _pods_ tienen una estructura homogénea.
- Incluso podríamos especializar los recursos si fuera necesario.
- Tenemos un punto de entrada simple para un desarrollador, esta es tu tarea, abre este pod, estos 5 archivos
  son los que tienes que tocar (además de algunas cosas comunes).
- Tenemos menos conflictos cuando un equipo trabaja en paralelo (cada miembro puede trabajar en un
  _pod_).
- Podemos industrializar los procesos (menos magia, más pasos deterministas)

** Ejercicio: Hagamos lo mismo con el _pod_ de detalles **

Pasos:

- Crear un modelo de _API_.
- Extraer la _API_.
- Crear un _API mapper_ > _Vm_
- Utilizarlo en el contenedor.

- Podemos obtener el modelo de la _API_ desde

https://api.github.com/users/brauliodiez

- Vamos a construirlo:

_./src/detail/detail.api-model.ts_

```ts
export interface MemberDetailEntityApi {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  hireable: string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gits: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
```

Vamos a extraer la _API_

_./src/pods/detail.api.ts_

```ts
import { MemberDetailEntityApi } from "./detail.api-model";

export const getMemberDetail = (id: string): Promise<MemberDetailEntityApi> =>
  fetch(`https://api.github.com/users/${id}`).then((response) =>
    response.json()
  );
```

Vamos a crear el _mapper_:

_./src/pods/detail.mapper.ts_

```ts
import * as vm from "./detail.vm";
import * as api from "./detail.api-model";

export const mapMemberFromApiToVm = (
  member: api.MemberDetailEntityApi
): vm.MemberDetailEntity => ({
  id: member.id.toString(),
  login: member.login,
  name: member.name,
  company: member.company,
  bio: member.bio,
});
```

Vamos a crear el repositorio:

_./src/pods/detail.repository.ts_

```ts
import { MemberDetailEntity } from "./detail.vm";
import { getMemberDetail as getMemberDetailApi } from "./detail.api";
import { mapMemberFromApiToVm } from "./detail.mapper";

export const getMemberCollection = (
  id: string
): Promise<MemberDetailEntity> => {
  return new Promise<MemberDetailEntity>((resolve) => {
    getMemberDetailApi(id).then((result) => {
      resolve(mapMemberFromApiToVm(result));
    });
  });
};
```

Y por último vamos a consumirlo en el contenedor:

_./src/detail.container.tsx_

```diff
+ import { getMemberCollection } from './detail.repository';
//(...)

  React.useEffect(() => {
-    fetch(`https://api.github.com/users/${id}`)
-      .then((response) => response.json())
-      .then((json) => setMember(json));
+    getMemberCollection(id)
+      .then(memberDetail => setMember(memberDetail));
  }, []);
```


