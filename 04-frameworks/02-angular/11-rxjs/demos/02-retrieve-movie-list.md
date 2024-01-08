# Demo: Retrieve an Array of Items in a Service

- Retrieving data
  - Retrieve all products (service)

The provider for `HttpClient` is `provideHttpClient` and supports stand alone components.

- Update `movies/src/app/app.config.ts`

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

An important note here, for the `InMemoryWebApiModule` to work properly, the `provideHttpClient` must be ahead of `importProvidersFrom` in the providers array.

- Update `LCS/src/app/movies/movie.service.ts`

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

Two options for DI, as above via constructor or using the `inject` function.

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

We now can implement the `getMovies`

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from './movie';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

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