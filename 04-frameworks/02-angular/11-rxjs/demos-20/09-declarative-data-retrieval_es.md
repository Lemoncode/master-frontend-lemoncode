# Demo: Patrón de Recupercación de Datos 

Transformemos el código que recupera películas de un enfoque procedimental a uno declarativo.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
+
+ readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
+   tap(() => console.log('In http.get pipeline')),
+   catchError((err) => this.handleError(err))
+ );
+
- getMovies(): Observable<Movie[]> {
-   return this.http.get<Movie[]>(this.moviesUrl).pipe(
-     tap(() => console.log('In http.get pipeline')),
-     catchError((err) => this.handleError(err))
-   );
- }

```

Primero, declaramos una variable. Lo llamamos `movies$` y le agregamos un signo de dólar para dejar claro que es un observable.

A continuación, copie el `http.get`, incluido el `pipe`, y asígnelo a la declaración de variable. Podemos eliminar nuestro método. Ahora tenemos una variable que representa nuestro observable. No queremos que ningún otro código modifique esta variable, así que agreguemos `readonly` al principio.

Ahora a esta variable se le asigna el observable devuelto por http.get y nunca se modifica. ¿Qué pasa con este método "getMovie"?

> `getMovie` **later**


¿Cómo pasamos un parámetro cuando usamos el enfoque declarativo? El manejo de parámetros requiere algunas técnicas más que cubriremos un poco más adelante, por lo que transformaremos el método `getMovie` a un enfoque declarativo más adelante.

Abrir `movies/src/app/movies/movie-list/movie-list.component.ts`

Al observar el componente `movie‑list.component`, ahora tenemos errores de sintaxis. Ya no tenemos un método `getMovies`. Eliminemos la llamada al método y en su lugar hagamos referencia a nuestra propiedad, `movies$`.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  ngOnInit(): void {
    this.sub = this.movieService
-   .getMovies()
+   .movies$
      .pipe(
        tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
      )
      .subscribe((movies) => {
        this.movies = movies;
      });
  }
```

Dado que la variable es observable, aún podemos canalizar los resultados a través de un conjunto de operadores y suscribirnos para activar `http.get`. ¿Seguirá funcionando?

```bash
npm start
```

Inicie el proyecto usando Ejecutar, Iniciar depuración. Haga clic en Lista de productos y veremos la lista de productos. Todavía funciona. Volviendo al código, hagamos que el componente también sea declarativo.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component,
- OnDestroy,
- OnInit,
  inject
} from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, MovieDetailComponent],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
// export class MovieListComponent implements OnInit, OnDestroy {
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = '';
- sub!: Subscription;

  private movieService = inject(MovieService);
+ readonly movies$ = this.movieService.movies$.pipe(
+   tap(() => console.log('In component pipeline')),
+       catchError((err) => {
+         this.errorMessage = err;
+         return EMPTY;
+       })
+ );
+
  // Movies
- movies: Movie[] = [];

  // Selected movie id to highlight the entry
  selectedMovieId: number = 0;
-
- ngOnInit(): void {
-   this.sub = this.movieService
-   .movies$
-     .pipe(
-       tap(() => console.log('In component pipeline')),
-       catchError((err) => {
-         this.errorMessage = err;
-         return EMPTY;
-       })
-     )
-     .subscribe((movies) => {
-       this.movies = movies;
-     });
- }
-
- ngOnDestroy(): void {
-   this.sub.unsubscribe();
- }
-
  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
  }
}

```

Con un enfoque declarativo, comenzamos declarando una variable. Lo llamamos `movies$`, luego asignamos la referencia a `movieService.movies$`, incluida la canalización. No necesitamos suscribirnos. Nuevamente agregaremos `readonly` al frente para garantizar que esta variable nunca se modifique.

Ahora podemos eliminar `ngOnInit` y, dado que ya no nos estamos suscribiendo, no necesitamos `unseubscribe`, por lo que también podemos eliminar `ngOnDestroy`.

Este código ahora utiliza un enfoque declarativo, trabajando con nuestro observable directamente desde el servicio. Ya no necesitamos gestionar nuestro estado en variables locales.

No necesitamos la variable `subscription` y no necesitamos nuestra variable de películas local. El observable emitirá la serie de películas por nosotros. También limpiamos las declaraciones de importación.

Pero mirando el navegador, nuestro código ya no funciona. Nuestra plantilla utiliza la variable de *movies* que acabamos de eliminar.

```console
✘ [ERROR] NG1: Property 'movies' does not exist on type 'MovieListComponent'. Did you mean 'movies$'? [plugin angular-compiler]

    src/app/movies/movie-list/movie-list.component.html:13:35:
      13 │               *ngFor="let movie of movies"
         ╵                                    ~~~~~~
```

En su lugar, cambiaremos la plantilla para acceder al valor emitido desde nuestro observable. Para eso, necesitamos la tubería `async`.

## `async` pipe

Queremos mostrar los datos recuperados trabajando directamente con los datos emitidos desde el observable usando la *pipe* `async`.

Abrir `movies/src/app/movies/movie-list/movie-list.component.html`

> Si henos instalado la extensión de VS Code podemos ver los errores en el *template*

Este `ngIf` comprueba si hay películas en la colección.

```html
<div class="card-body" *ngIf="movies.length"></div>
```

Si es así, muestra este elemento div y sus elementos secundarios. `ngFor` recorre la colección de películas y muestra el nombre de cada película en un botón.

```html
<div class="card-body" *ngIf="movies.length">
  <div class="list-group">
    <button
      type="button"
      class="list-group-item"
      *ngFor="let movie of movies"
      [ngClass]="{ active: movie.id === selectedMovieId }"
      (click)="onSelected(movie.id)"
    >
      {{ movie.movieName }}
    </button>
  </div>
</div>
```

Looking back at the `movie‑list.component`, we no longer have a movies property. We now have the `movies$` observable that references the observable from the movieService. Let's use the _async pipe_ to work with this observable in our template. 

Volviendo al componente `movie‑list.component`, ya no tenemos la propiedad de películas. Ahora tenemos el observable `movies$` que hace referencia al observable del movieService. Usemos la _async pipe_ para trabajar con este observable en nuestra *template*.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-   <div class="card-body" *ngIf="movies.length">
+   <div class="card-body" *ngIf="movies$ | async">
    <div class="list-group">
    <button
        type="button"
        class="list-group-item"
        *ngFor="let movie of movies"
        [ngClass]="{ active: movie.id === selectedMovieId }"
        (click)="onSelected(movie.id)"
    >
        {{ movie.movieName }}
    </button>
    </div>
</div>
```

Ahora solo muestra este elemento div cuando el observable emite algo. Pero recibimos un error de sintaxis cuando intentamos utilizar la canalización `async`. ¿Alguna idea de por qué? He aquí una pista. Estamos utilizando componentes independientes.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
-import { NgClass, NgFor, NgIf } from '@angular/common';
+import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, 
  inject 
} from '@angular/core';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieService } from '../movie.service';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
- imports: [NgIf, NgClass, NgFor, MovieDetailComponent],
+ imports: [NgIf, NgClass, NgFor, MovieDetailComponent, AsyncPipe],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
```

Cuando utilizamos componentes independientes, debemos importar todo lo que la plantilla necesita como parte de los metadatos del componente. Hacemos eso aquí en la matriz de importaciones. La plantilla quiere usar la tubería asíncrona, por lo que agregamos `AsyncPipe` a la colección de importaciones.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
<div class="card-body" *ngIf="movies$ | async">
    <div class="list-group">
    <button
        type="button"
        class="list-group-item"
-       *ngFor="let movie of movies"
+       *ngFor="let movie of movies$ | async"
        [ngClass]="{ active: movie.id === selectedMovieId }"
        (click)="onSelected(movie.id)"
    >
        {{ movie.movieName }}
    </button>
    </div>
</div>
```

Back in the template, we have now told Angular that we're using the async pipe in this component, so it no longer has a syntax error. 

De vuelta en la *template*, le hemos dicho a Angular que estamos usando la *async pipe* en este componente, por lo que ya no tiene un error de sintaxis.

Comprobémoslo en el navegador y aparecerá nuestra lista de películas. Ahora estamos mostrando la matriz directamente tal como se emite desde el observable.

Pero puede haber un problema aquí. _Abramos las herramientas de desarrollador_.

> Tenemos dos conjuntos de mensajes de nuestra pipeline.

Why is that? Going back to the code, here in the template, each async pipe subscribes to the `movies$` observable. **Two async pipes for the same observable means we are subscribing twice and issuing the HTTP get request twice**. That's not good. We should instead use the `as` clause.

¿Porqué es eso? Volviendo al código, aquí en la *template*, cada `async pipe` se suscribe al observable `movies$`. **Dos `async pipes` para el mismo observable significan que nos suscribimos dos veces y emitimos la solicitud de obtención HTTP dos veces**. Eso no es bueno. En su lugar, deberíamos utilizar la cláusula `as`.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-<div class="card-body" *ngIf="movies$ | async">
+<div class="card-body" *ngIf="movies$ | async as movies">
    <div class="list-group">
    <button
        type="button"
        class="list-group-item"
-       *ngFor="let movie of movies$ | async"
+       *ngFor="let movie of movies"
        [ngClass]="{ active: movie.id === selectedMovieId }"
        (click)="onSelected(movie.id)"
    >
        {{ movie.movieName }}
    </button>
    </div>
</div>
```

Aquí en `ngIf`, lo agregaremos como películas. El elemento emitido se retiene en la variable de plantilla definida llamada películas. Podemos acceder a esa variable en cualquier lugar dentro del elemento HTML que tenga la directiva `ngIf` y cualquiera de sus hijos. Entonces, en `ngFor`, en lugar de otra tubería `async`, usamos la variable de plantilla de películas.

> Ahora tenemos una sola `async pipe`, y por tanto una sola subscripción.

Abra el navegador, todavía vemos la lista de películas y solo vemos un mensaje de cada una de nuestras dos *pipelines*.

En esta demostración, usamos la *asyc pipe* para acceder directamente al valor emitido desde nuestro observable, y usamos la cláusula `as` para contener ese valor para que pueda usarse en otro lugar dentro del elemento HTML.

