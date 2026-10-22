# Manejo de errores

## Manejo de errores HTTP erros en un Servicio

- Manejo de error HTTP
  - Caching del error en un servicio

Primero veamos que ocurre cuando tenemos un error, y no lo manejamos.

- Actualizar `movies/src/app/movies/movie.service.ts`

```diff
export class MovieService {
- private moviesUrl = 'api/movies';
+ private moviesUrl = 'api/moviess';
```

```bash
npm start
```

No se muestran datos, y tenemos una excepción no controlada, que podemos ver en consola. Vamos a comenzar por *atrapar* el error:

```diff
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
-import { Observable, tap } from 'rxjs';
+import { Observable, catchError, of, tap } from 'rxjs';
import { Movie } from './movie';
import { MovieData } from './movie-data';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/moviess';
  private http = inject(HttpClient);

  getMovies(): Observable<Movie[]> {
    return this.http
      .get<Movie[]>(this.moviesUrl)
      .pipe(tap(() => console.log('In http.get pipeline')),
+     catchError((err) => {
+       console.error(err);
+       return of(MovieData.movies)
+     })
      );
  }

  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(tap(() => console.log("In http.get by id pipeline")));
  }
}

```

Si volvemos al navegador, seguimos viendo el error, porque lo registramos en consola com un error. Podemos ver la list *hard coded* de elementos. Si seleccionamos un elemento, obtenemos una excepción no manejada, todavía no hemos añadido código para solucionar esto.

Vamos a usar una aproximación diferente.

```diff
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
-import { Observable, catchError, of, tap } from 'rxjs';
+import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Movie } from './movie';
import { MovieData } from './movie-data';
+import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/moviess';

  private http = inject(HttpClient);
+ private errorService = inject(HttpErrorService);
# ....
```

```ts
export class MovieService {
  private moviesUrl = 'api/moviess';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesUrl).pipe(
      tap(() => console.log('In http.get pipeline')),
      catchError((err) => {
        console.error(err);
        return of(MovieData.movies);
      })
    );
  }

  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(tap(() => console.log('In http.get by id pipeline')));
  }
  /*diff*/
  private handleError(err: HttpErrorResponse): Observable<never> {
    const formatted = this.errorService.formatError(err);
    return throwError(() => formatted);
  }
  /*diff*/
}
```

Podemos también usar la función `throw` de javascript, ambos funcionarían:

```ts
class MovieService {
  private handleError(err: HttpErrorResponse): Observable<never> {
    const formatted = this.errorService.formatError(err);
    throw formatted;
  }
}
```

Nos quedamos con `throwError`.

```diff
  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.moviesUrl).pipe(
      tap(() => console.log('In http.get pipeline')),
-     catchError((err) => {
-       console.error(err);
-       return of(MovieData.movies);
-     })
+     catchError((err) => this.handleError(err))
    );
  }
```

Si volvemos al navegador y abrimos la consola, podemos ver el error formateado.

## Manejando errores HTTP en un Componente

- Manejo de error HTTP
  - Atrapando el error en un componente

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

Podemos manejar el error de dos formas, usando el `observer` o en el `pipeline`. Usando el observer sería de esta forma:

```ts
ngOnInit(): void {
    this.sub = this.movieService
      .getMovies()
      .pipe(tap(() => console.log('In component pipeline')))
      .subscribe({
        next: (movies) => {
          this.movies = movies;
          console.log(this.movies);
        },
        error: (err) => {
          this.errorMessage = err;
        },
      });
  }
```

Si abrimos el navegador, veremos que la vista renderiza ahora un mensaje con los detalles del error. Vamos a cambiar el código para utilizar *observer functions* en lugar de utilizar *callbacks*.

```diff
-import { Subscription, tap } from 'rxjs';
+import { EMPTY, Subscription, catchError, tap } from 'rxjs';
# ....
  ngOnInit(): void {
    this.sub = this.movieService
      .getMovies()
      .pipe(
        tap(() => console.log('In component pipeline')),
+       catchError((err) => {
+         this.errorMessage = err;
+         return EMPTY;
+       })
      )
-     .subscribe({
-       next: (movies) => {
-         this.movies = movies;
-         console.log(this.movies);
-       },
-       error: (err) => {
-         this.errorMessage = err;
-       },
-     });
+     .subscribe((movies) => {this.movies = movies;});
  }
```

Si abrimos el navegador encontraremos el mensaje de error.

Actualizamos `LCS/src/app/movies/movie.service.ts`

```diff
export class MovieService {
- private moviesUrl = 'api/moviess';
+ private moviesUrl = 'api/movies';
```

Si abrimos el navegador veremos la lista de artícuslos.

## Ejercicio

Implementar el manejo de errores para `getMovie` en `movies/src/app/movies/movie.service.ts` e implemenatr el manejo de errores en `movies/src/app/movies/movie-detail/movie-detail.component.ts`
