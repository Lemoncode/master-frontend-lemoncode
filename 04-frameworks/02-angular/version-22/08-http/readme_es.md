# 07 HTTP

## Resumen

Este ejemplo toma como punto de partida el ejemplo 06.

Vamos a utilizar el Servicio HttpClient de Angular para realizar la petición del listado de miembros

Qué vamos a aprender en este ejemplo:

- Utilizar el servicio HttpClient para hacer peticiones

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

- Importamos el módulo HttpClientModule

_src/app/app.config.ts_

```diff
# ....
+import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
+   provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
```

> NOTA: Por defecto en Angular 22, se usa `fetch`, no hace falta invocar `withFetch`

- Inyectamos el servicio HttpClient en el servicio MembersService

_src/app/services/members.ts_

```diff
# ....
+import { HttpClient } from '@angular/common/http';

@Service()
export class Members {
+ private http = inject(HttpClient);
# ....
```

- Cambiamos la llamada al fetch() por una llamada al get() de HttpClient

_src/app/services/members.service.ts_

```diff
# ....
@Service()
export class Members {
  private http = inject(HttpClient);

  getAll(): Promise<MemberEntity[]> {
    return new Promise((res) => {
      setTimeout(() => {
        res(members as unknown as MemberEntity[]);
      }, 300);
    });
  }
+
+ getAllHttp(): Promise<MemberEntity[]> {
+   return this.http.get(`https://api.github.com/orgs/lemoncode/members`);
+ } 
}
```

Por defecto, los métodos de HttpClient convierten el body de la respuesta en json, por lo que nos ahorramos hacerlo nosotros.

- Tipamos correctamente

Los métodos de HttpClient no devuelven promesas de las respuestas, devuelven Observables de las respuestas.

_src/app/services/members.service.ts_

```diff
# ....
+import { Observable } from 'rxjs';

@Service()
export class Members {
  private http = inject(HttpClient);

# ....

-  getAllHttp(): Promise<MemberEntity[]> {
-    return this.http.get(`https://api.github.com/orgs/lemoncode/members`);
-  }
+  getAllHttp(): Observable<MemberEntity[]> {
+    return this.http.get<MemberEntity[]>(`https://api.github.com/orgs/lemoncode/members`);
+  }
}
```

- Adaptamos la llamada al servicio desde el componente

Ahora el componente UserListComponent no recibe una promesa, sino un observable. Lo correjimos.

_src/app/user/user-list/user.component.ts_

```diff
# ....
  ngOnInit(): void {
-   this.membersService.getAll().then((members) => this.members.set(members));
+   this.membersService.getAllHttp().subscribe((members) => this.members.set(members));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };

    this.createEditForm();
  }
# ....
```
