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
        this.movies.set(movies);
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
  imports: [MovieDetailComponent],
  templateUrl: './movie-list.component.html',
  styles: ``,
})
-export class MovieListComponent implements OnInit, OnDestroy {
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = signal('');
- sub!: Subscription;

  private movieService = inject(MovieService);
+ readonly movies$ = this.movieService.movies$.pipe(
+   tap(() => console.log('In component pipeline')),
+   catchError((err) => {
+     this.errorMessage.set(err);
+     return EMPTY;
+   }),
+ );
+
  // Movies
- movies = signal<Movie[]>([]);
+ movies = toSignal(this.movies$, { initialValue: [] });

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

- https://angular.dev/api/core/rxjs-interop/toSignal#description