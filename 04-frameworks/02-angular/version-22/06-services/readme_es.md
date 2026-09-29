# 05 Servicios

## Resumen

Este ejemplo toma como punto de partida el ejemplo 04.

Vamos a crear un servicio que se encargue de conseguir la lista de miembros:

Qué vamos a aprender en este ejemplo:

- Creación de servicios
- Inyección de servicios

Pasos:

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

> NOTA: Podemos usar `npm ci` de esta forma instalaremos las dependencias existentes en `package-lock.json` en vez de regenerarlas.

- Arrancamos la aplicación:

```bash
ng serve
```

- Creamos un servicio con el CLI

```bash
ng generate service services/members --skip-tests
```

Para no estar conumiendo la API real de GitHub, vamos a crear datos `mock`, que serán expuestos por nuestro servicio.

Creamos **src/app/services/mock-data.ts**

```ts
export const members = [
  {
    login: "antonio06",
    id: 14540103,
    node_id: "MDQ6VXNlcjE0NTQwMTAz",
    avatar_url: "https://avatars.githubusercontent.com/u/14540103?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/antonio06",
    html_url: "https://github.com/antonio06",
    followers_url: "https://api.github.com/users/antonio06/followers",
    following_url:
      "https://api.github.com/users/antonio06/following{/other_user}",
    gists_url: "https://api.github.com/users/antonio06/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/antonio06/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/antonio06/subscriptions",
    organizations_url: "https://api.github.com/users/antonio06/orgs",
    repos_url: "https://api.github.com/users/antonio06/repos",
    events_url: "https://api.github.com/users/antonio06/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/antonio06/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "brauliodiez",
    id: 1457912,
    node_id: "MDQ6VXNlcjE0NTc5MTI=",
    avatar_url: "https://avatars.githubusercontent.com/u/1457912?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/brauliodiez",
    html_url: "https://github.com/brauliodiez",
    followers_url: "https://api.github.com/users/brauliodiez/followers",
    following_url:
      "https://api.github.com/users/brauliodiez/following{/other_user}",
    gists_url: "https://api.github.com/users/brauliodiez/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/brauliodiez/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/brauliodiez/subscriptions",
    organizations_url: "https://api.github.com/users/brauliodiez/orgs",
    repos_url: "https://api.github.com/users/brauliodiez/repos",
    events_url: "https://api.github.com/users/brauliodiez/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/brauliodiez/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "chimalm1",
    id: 113333501,
    node_id: "U_kgDOBsFU_Q",
    avatar_url: "https://avatars.githubusercontent.com/u/113333501?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/chimalm1",
    html_url: "https://github.com/chimalm1",
    followers_url: "https://api.github.com/users/chimalm1/followers",
    following_url:
      "https://api.github.com/users/chimalm1/following{/other_user}",
    gists_url: "https://api.github.com/users/chimalm1/gists{/gist_id}",
    starred_url: "https://api.github.com/users/chimalm1/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/chimalm1/subscriptions",
    organizations_url: "https://api.github.com/users/chimalm1/orgs",
    repos_url: "https://api.github.com/users/chimalm1/repos",
    events_url: "https://api.github.com/users/chimalm1/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/chimalm1/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "crsanti",
    id: 13205689,
    node_id: "MDQ6VXNlcjEzMjA1Njg5",
    avatar_url: "https://avatars.githubusercontent.com/u/13205689?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/crsanti",
    html_url: "https://github.com/crsanti",
    followers_url: "https://api.github.com/users/crsanti/followers",
    following_url:
      "https://api.github.com/users/crsanti/following{/other_user}",
    gists_url: "https://api.github.com/users/crsanti/gists{/gist_id}",
    starred_url: "https://api.github.com/users/crsanti/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/crsanti/subscriptions",
    organizations_url: "https://api.github.com/users/crsanti/orgs",
    repos_url: "https://api.github.com/users/crsanti/repos",
    events_url: "https://api.github.com/users/crsanti/events{/privacy}",
    received_events_url: "https://api.github.com/users/crsanti/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "fdejesusmazzoni",
    id: 43171355,
    node_id: "MDQ6VXNlcjQzMTcxMzU1",
    avatar_url: "https://avatars.githubusercontent.com/u/43171355?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/fdejesusmazzoni",
    html_url: "https://github.com/fdejesusmazzoni",
    followers_url: "https://api.github.com/users/fdejesusmazzoni/followers",
    following_url:
      "https://api.github.com/users/fdejesusmazzoni/following{/other_user}",
    gists_url: "https://api.github.com/users/fdejesusmazzoni/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/fdejesusmazzoni/starred{/owner}{/repo}",
    subscriptions_url:
      "https://api.github.com/users/fdejesusmazzoni/subscriptions",
    organizations_url: "https://api.github.com/users/fdejesusmazzoni/orgs",
    repos_url: "https://api.github.com/users/fdejesusmazzoni/repos",
    events_url: "https://api.github.com/users/fdejesusmazzoni/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/fdejesusmazzoni/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "fjcalzado",
    id: 24454225,
    node_id: "MDQ6VXNlcjI0NDU0MjI1",
    avatar_url: "https://avatars.githubusercontent.com/u/24454225?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/fjcalzado",
    html_url: "https://github.com/fjcalzado",
    followers_url: "https://api.github.com/users/fjcalzado/followers",
    following_url:
      "https://api.github.com/users/fjcalzado/following{/other_user}",
    gists_url: "https://api.github.com/users/fjcalzado/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/fjcalzado/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/fjcalzado/subscriptions",
    organizations_url: "https://api.github.com/users/fjcalzado/orgs",
    repos_url: "https://api.github.com/users/fjcalzado/repos",
    events_url: "https://api.github.com/users/fjcalzado/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/fjcalzado/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "JaimeSalas",
    id: 7754966,
    node_id: "MDQ6VXNlcjc3NTQ5NjY=",
    avatar_url: "https://avatars.githubusercontent.com/u/7754966?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/JaimeSalas",
    html_url: "https://github.com/JaimeSalas",
    followers_url: "https://api.github.com/users/JaimeSalas/followers",
    following_url:
      "https://api.github.com/users/JaimeSalas/following{/other_user}",
    gists_url: "https://api.github.com/users/JaimeSalas/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/JaimeSalas/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/JaimeSalas/subscriptions",
    organizations_url: "https://api.github.com/users/JaimeSalas/orgs",
    repos_url: "https://api.github.com/users/JaimeSalas/repos",
    events_url: "https://api.github.com/users/JaimeSalas/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/JaimeSalas/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "JTrillo",
    id: 33926302,
    node_id: "MDQ6VXNlcjMzOTI2MzAy",
    avatar_url: "https://avatars.githubusercontent.com/u/33926302?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/JTrillo",
    html_url: "https://github.com/JTrillo",
    followers_url: "https://api.github.com/users/JTrillo/followers",
    following_url:
      "https://api.github.com/users/JTrillo/following{/other_user}",
    gists_url: "https://api.github.com/users/JTrillo/gists{/gist_id}",
    starred_url: "https://api.github.com/users/JTrillo/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/JTrillo/subscriptions",
    organizations_url: "https://api.github.com/users/JTrillo/orgs",
    repos_url: "https://api.github.com/users/JTrillo/repos",
    events_url: "https://api.github.com/users/JTrillo/events{/privacy}",
    received_events_url: "https://api.github.com/users/JTrillo/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "juanpms2",
    id: 58438522,
    node_id: "MDQ6VXNlcjU4NDM4NTIy",
    avatar_url: "https://avatars.githubusercontent.com/u/58438522?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/juanpms2",
    html_url: "https://github.com/juanpms2",
    followers_url: "https://api.github.com/users/juanpms2/followers",
    following_url:
      "https://api.github.com/users/juanpms2/following{/other_user}",
    gists_url: "https://api.github.com/users/juanpms2/gists{/gist_id}",
    starred_url: "https://api.github.com/users/juanpms2/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/juanpms2/subscriptions",
    organizations_url: "https://api.github.com/users/juanpms2/orgs",
    repos_url: "https://api.github.com/users/juanpms2/repos",
    events_url: "https://api.github.com/users/juanpms2/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/juanpms2/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "manudous",
    id: 67704877,
    node_id: "MDQ6VXNlcjY3NzA0ODc3",
    avatar_url: "https://avatars.githubusercontent.com/u/67704877?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/manudous",
    html_url: "https://github.com/manudous",
    followers_url: "https://api.github.com/users/manudous/followers",
    following_url:
      "https://api.github.com/users/manudous/following{/other_user}",
    gists_url: "https://api.github.com/users/manudous/gists{/gist_id}",
    starred_url: "https://api.github.com/users/manudous/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/manudous/subscriptions",
    organizations_url: "https://api.github.com/users/manudous/orgs",
    repos_url: "https://api.github.com/users/manudous/repos",
    events_url: "https://api.github.com/users/manudous/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/manudous/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "nasdan",
    id: 4374977,
    node_id: "MDQ6VXNlcjQzNzQ5Nzc=",
    avatar_url: "https://avatars.githubusercontent.com/u/4374977?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/nasdan",
    html_url: "https://github.com/nasdan",
    followers_url: "https://api.github.com/users/nasdan/followers",
    following_url: "https://api.github.com/users/nasdan/following{/other_user}",
    gists_url: "https://api.github.com/users/nasdan/gists{/gist_id}",
    starred_url: "https://api.github.com/users/nasdan/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/nasdan/subscriptions",
    organizations_url: "https://api.github.com/users/nasdan/orgs",
    repos_url: "https://api.github.com/users/nasdan/repos",
    events_url: "https://api.github.com/users/nasdan/events{/privacy}",
    received_events_url: "https://api.github.com/users/nasdan/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
  {
    login: "v-borrego",
    id: 43609530,
    node_id: "MDQ6VXNlcjQzNjA5NTMw",
    avatar_url: "https://avatars.githubusercontent.com/u/43609530?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/v-borrego",
    html_url: "https://github.com/v-borrego",
    followers_url: "https://api.github.com/users/v-borrego/followers",
    following_url:
      "https://api.github.com/users/v-borrego/following{/other_user}",
    gists_url: "https://api.github.com/users/v-borrego/gists{/gist_id}",
    starred_url:
      "https://api.github.com/users/v-borrego/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/v-borrego/subscriptions",
    organizations_url: "https://api.github.com/users/v-borrego/orgs",
    repos_url: "https://api.github.com/users/v-borrego/repos",
    events_url: "https://api.github.com/users/v-borrego/events{/privacy}",
    received_events_url:
      "https://api.github.com/users/v-borrego/received_events",
    type: "User",
    user_view_type: "public",
    site_admin: false,
  },
];
```

Actualizamos _src/app/services/members.ts_

```ts
import { Service } from "@angular/core";
import { MemberEntity } from "../model";
import { members } from "./mock-data";

@Service()
export class Members {
  getAll(): Promise<MemberEntity[]> {
    return new Promise((res) => {
      setTimeout(() => {
        res(members as unknown as MemberEntity[]);
      }, 300);
    });
  }
}
```

Algo a tener en cuenta, en Angular 22, el decorador **`@Service`** se introduce como una alternativa simplificada a **`@Injectable`**, diseñada específicamente para declarar servicios _singleton_ globales.

Mientras que `@Injectable` se mantiene para casos de uso avanzados y compatibilidad con código existente, `@Service` optimiza la sintaxis.

### Diferencias principales

- **Registro global por defecto (`providedIn: 'root'`):**
- **`@Injectable`**: Requiere especificar explícitamente el metadata `@Injectable({ providedIn: 'root' })` para registrarlo como singleton global.
- **`@Service`**: Registra la clase en la raíz (`root`) automáticamente por defecto, sin necesidad de pasar metadata adicional en casos comunes.

- **Estilo de inyección de dependencias (DI):**
- **`@Injectable`**: Permite tanto la inyección tradicional basada en constructor (`constructor(private http: HttpClient)`) como la función `inject()`.
- **`@Service`**: **Prohíbe la inyección por constructor.** El compilador de Angular genera un error en tiempo de compilación si detecta parámetros en el constructor, obligando a usar la función `inject()`.

- **Sintaxis y flexibilidad:**
- **`@Injectable`**: Admite configuraciones complejas de proveedores (`useClass`, `useValue`, `useFactory`, `useExisting`) e inyección jerárquica a nivel de componentes o módulos.
- **`@Service`**: Simplifica la firma del decorador eliminando sobrecarga legada, limitando sus opciones a configuraciones directas como `autoProvided` y `factory`.

- **Estado en el framework:**
- **`@Injectable`**: No está deprecado. Sigue siendo indispensable cuando se requieren configuraciones avanzadas de DI o servicios con alcance restringido.
- **`@Service`**: Es la opción recomendada para nuevos servicios declarativos estándar a nivel de aplicación.

- Inyectamos el servicio en el componente

_src/app/user/user-list/user-list.ts_

```diff
# ....
+import { Members } from '../../services/members';

@Component({
  imports: [Highlight, FormsModule, AwesomePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  members = signal<MemberEntity[]>([]);
  newMember!: MemberEntity;

+ private membersService = inject(Members);
# ....
```

- Pedimos los usuarios al servicio en vez de cogerlos directamente en el componente:

_src/app/user/user-list/user-list.ts_

```diff
# ....
  ngOnInit(): void {
- fetch('http-api.github.com/orgs/lemoncode/members')
-   .then((response) => {
-     return response.json();
-   })
-   .then((results) => {
-     console.log(JSON.stringify(results));
-     this.members.set(results);
-   })
-   .catch((err) => {
-     console.error(err);
-   });
+
+   this.membersService.getAll().then((members) => this.members.set(members));
+
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
# ....
```
