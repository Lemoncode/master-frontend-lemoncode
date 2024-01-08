# Handling Errors

## Handling HTTP erros in a Service

- HTTP error handling
  - Caching the error in a service

Lets see what happens when we have an error, and we don't handle it.

- Update `movies/src/app/movies/movie.service.ts`

```diff
export class MovieService {
- private moviesUrl = 'api/movies';
+ private moviesUrl = 'api/moviess';
```

No data is displayed, and we get an unhandled exception, that we cann see on console. Lets start by catching the error:

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

If we go back to the browser, we keep seeing the error, because we have logged as error. We can also see the hard coded list of items. If we select an item, we get an unhandled exception, we donn't add code yet to solve this.

We're going to use a different approach.

```diff
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
-import { Observable, catchError, of, tap } from 'rxjs';
+import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Movie } from './movie';
import { MovieData } from './movie-data';
import { HttpErrorService } from '../utilities/http-error.service';

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

We can also use javascript `throw`, both will work:

```ts
class MovieService {
  private handleError(err: HttpErrorResponse): Observable<never> {
    const formatted = this.errorService.formatError(err);
    throw formatted;
  }
}
```

We keep with `throwError`.

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

If we back to browser and open the console, we can see the formatted error.

## Handling HTTP erros in a Component

- HTTP error handling
  - Catching the error in a component

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

We can handle the error in two ways, using the `observer` or in the `pipeline`. Uisng the `observer` looks like this:

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

If we open the browser, we will see that the view it's now rendering a message with error details. Lets change the code to instead using callback observer functions use the pipeline.

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

If we open the browser we will find out the message.

Update `LCS/src/app/products/product.service.ts`

```diff
export class MovieService {
- private moviesUrl = 'api/moviess';
+ private moviesUrl = 'api/movies';
```

If we open the browser we will see the list of items.

## Exercise

Implement the error handling for `getMovie` on `movies/src/app/movies/movie.service.ts`  and implement error handling on `movies/src/app/movies/movie-detail/movie-detail.component.ts`
