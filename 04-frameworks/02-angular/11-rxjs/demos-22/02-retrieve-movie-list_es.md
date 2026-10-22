# Demo: Retrieve an Array of Items in a Service

- Recuperando datos
  - Recuperar todos los productos (servicio)

El *provider* `HttpClient` es `provideHttpClient` y soporta los *stand alone components*.

- Actualizar `movies/src/app/app.config.ts`

```diff
import { routes } from './app.routes';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppData } from './app-data';
+import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
+   provideHttpClient(),
    importProvidersFrom(InMemoryWebApiModule.forRoot(AppData, { delay: 1000 })),
    provideRouter(routes),
  ],
};

```

Una nota importante aquí, para que `InMemoryWebApiModule` funcione correctamenet, `provideHttpClient` debe de estar declarado antes que `importProvidersFrom` en el array de *providers*

- Actualizar `movies/src/app/movies/movie.service.ts`

```diff
+import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

+ constructor(private http: HttpClient) {}
}

```

Dos opciones para ralaizar la DI, via constructor o usar la función `inject`.

- Dependency injection
  - Constructor-based
  - `inject()` function (v14+)

```diff
import { HttpClient } from '@angular/common/http';
-import { Injectable } from '@angular/core';
+import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

- constructor(private http: HttpClient) {}
+ private http = inject(HttpClient);
}
```

Podemos implentar ahora `getMovies`

```ts
import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Movie } from "./movie";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  private moviesUrl = "api/movies";

  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesUrl);
  }
}
```

For last we add a debugging feature

```diff
-import { Observable } from 'rxjs';
+import { Observable, tap } from 'rxjs';
import { Moviee } from './movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.moviesUrl)
+     .pipe(tap(() => console.log('In http.get pipeline')));
  }
}
```
