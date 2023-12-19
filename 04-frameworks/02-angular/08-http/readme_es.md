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

- Encendemos la aplicación:

```bash
ng serve
```

- Importamos el módulo HttpClientModule

_src/app/app.config.ts_

```diff
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
+import { provideHttpClient, withFetch } from '@angular/common/http';

// https://stackoverflow.com/questions/77483538/angular-17-http-client-injection
export const appConfig: ApplicationConfig = {
- providers: [provideRouter(routes)],
+ providers: [provideRouter(routes), provideHttpClient(withFetch())],
};
```

- Inyectamos el servicio HttpClient en el servicio MembersService

_src/app/services/members.service.ts_

```diff
import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/MemberEntity';
+import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

-  constructor() { }
+  constructor(private http: HttpClient) { }

  getAll(): Promise<MemberEntity[]> {
    return fetch(`https://api.github.com/orgs/lemoncode/members`)
                .then((response) => response.json());
  }
}
```

- Cambiamos la llamada al fetch() por una llamada al get() de HttpClient

_src/app/services/members.service.ts_

```diff
import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/MemberEntity';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

  getAll(): Promise<MemberEntity[]> {
-    return (`https://api.github.com/orgs/lemoncode/members`)
-                .then((response) => response.json());
+    return this.http.get(`https://api.github.com/orgs/lemoncode/members`);
  }
}
```

Por defecto, los métodos de HttpClient convierten el body de la respuesta en json, por lo que nos ahorramos hacerlo nosotros.

- Tipamos correctamente

Los métodos de HttpClient no devuelven promesas de las respuestas, devuelven Observables de las respuestas.

_src/app/services/members.service.ts_

```diff
import { Injectable } from '@angular/core';
import { MemberEntity } from '../model/MemberEntity';
import { HttpClient } from '@angular/common/http';
+import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

-  getAll(): Promise<MemberEntity[]> {
-    return this.http.get(`https://api.github.com/orgs/lemoncode/members`);
-  }
+  getAll(): Observable<MemberEntity[]> {
+    return this.http.get<MemberEntity[]>(`https://api.github.com/orgs/lemoncode/members`);
+  }
}
```

- Adaptamos la llamada al servicio desde el componente

Ahora el componente UserListComponent no recibe una promesa, sino un observable. Lo correjimos.

_src/app/user/user-list/user-list.component.ts_

```diff
  ngOnInit(): void {
-   this.membersService.getAll().then((members) => (this.members = members));
+   this.membersService
+     .getAll()
+     .subscribe((members) => (this.members = members));
+
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };

    this.createEditForm();
  }
```
