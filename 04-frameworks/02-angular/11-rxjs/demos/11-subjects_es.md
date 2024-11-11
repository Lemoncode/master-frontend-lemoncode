# Subjects

Creemos un _Subject_ que proporcione una notificación cada vez que el usuario seleccione un nuevo producto.

Queremos compartir la notificación con cualquiera de los componentes de nuestra película y no queremos perder ninguna emisión, así que agreguemos un `BehaviorSubject` al `movie.service`.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
import {
+ BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
# .....

export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);
+
+ movieSelectedSubject = new BehaviorSubject<number>(undefined)
```

Aquí, según las declaraciones, declararemos una variable para nuestro `BehaviorSubject`. Llamémoslo `movieSelectedSubject`. Lo configuramos igual a un nuevo `BehaviorSubject`.

A continuación, decidimos qué datos pasar cuando nuestro `BehaviorSubject` emita la siguiente notificación. Pasemos la identificación de la película seleccionada. En nuestro ejemplo, la identificación es un número, por lo que estableceremos el parámetro genérico en número.

`BehaviorSubject` requiere un valor inicial, entonces, ¿qué tiene sentido para un valor inicial en este caso? Si el usuario aún no ha seleccionado una película, no hay ninguna película seleccionada. Podríamos pasar 0 para indicar que no hay película, ya que 0 no es un movieId válido, pero eso le da al 0 un significado mágico especial. En su lugar, usemos `undefined`. Esto tiene sentido, porque hasta que el usuario selecciona una película, la película seleccionada en realidad no está definida.

Estamos **viendo un error** aquí. Esto se debe a que definimos el tipo de emisiones como un número. Cambiaremos eso a número o indefinido.

```diff
- movieSelectedSubject = new BehaviorSubject<number>(undefined)
+ movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined)
```

Ahora tenemos un `BehaviorSubject` que emite un valor inicial a los nuevos suscriptores. Queremos asegurarnos de que ningún código en la aplicación acceda a este BehaviorSubject excepto el código dentro de este servicio, por lo que agregaremos la palabra clave `private` al principio.

```diff
- movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+ private movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
```

Pero cualquier código en la aplicación debería poder suscribirse al observable subyacente, así que expongamos ese observable como una propiedad pública. Lo llamaremos `movieSelected$`. Usamos el signo de dólar para indicar que efectivamente es un observable y lo igualamos a `this.movieSelectedSubject.asObservable`. Para asegurarnos de no sobrescribir accidentalmente este valor, agreguemos `readonly` como parte de la declaración.

```diff
  private movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+ readonly movieSelected$ = this.movieSelectedSubject.asObservable();
```

Ahora tenemos un `BehaviorSubject` que emite valores numéricos o indefinidos a cualquier suscriptor, y tenemos el observable de solo lectura de ese Asunto que nuestros componentes y otros servicios pueden usar para suscribirse. Cada vez que el usuario selecciona un producto, usaremos este `BehaviorSubject` y emitiremos una notificación con el `movieId`. Lo haremos en un método.

Agreguemos ese método, lo llamaremos `movieSelected`. Toma el `selectedMovieId`, que es un número, y devuelve `void`.

> Nuestro movie‑list.component puede llamar a este método cuando el usuario selecciona una nueva película.

Dentro del método, llamamos a `this.movieSelectedSubject.next` y emitimos el `selectedMovieId`.

```diff
# .....
  private getMoviesWithReviews(movie: Movie): Observable<Movie> {
    if (movie.hasReviews) {
      this.http.get<Review[]>(this.reviewService.getReviewUrl(movie.id)).pipe(
        map(
          (reviews) =>
            ({
              ...movie,
              reviews,
            } as Movie)
        )
      );
    }
    return of(movie);
  }
+
+ movieSelected(selectedMovieId: number): void {
+   this.movieSelectedSubject.next(selectedMovieId);
+ }
+
# .....
```

Ahora tenemos un método que emite una siguiente notificación con `selectedMovietId`. Ahora llamemos a este método desde algún lugar.

Abrir `movies/src/app/movies/movie-list/movie-list.component.html`

```html
<button
  type="button"
  class="list-group-item"
  *ngFor="let movie of movies"
  [ngClass]="{ active: movie.id === selectedMovieId }"
  (click)="onSelected(movie.id)"
>
  {{ movie.movieName }}
</button>
```

Al observar la template movie-lsit, el HTML muestra el conjunto de películas. Cuando un usuario hace clic en una película, el enlace de eventos llama a "onSelected" en el componente y pasa la identificación de la película seleccionada. En `movie‑list.component`, tenemos ese método.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
+   this.movieService.movieSelected(movieId);
  }
```

En lugar de configurar una variable local, llamemos a nuestro nuevo método de servicio. De esa manera, `BehaviorSubject` emitirá esta identificación de película a cualquier componente que se suscriba, `this.movieService.movieSelected`, y le pasaremos el `movieId`.

Cada vez que el usuario selecciona una película, emitimos una siguiente notificación desde ese `Subject` a los suscriptores. Pero todavía no tenemos suscriptores y, una vez que los tengamos, ¿cómo reaccionarán ante esta emisión?

## Subscribing to Subjects

Our goal is to react to emissions from this `BehaviorSubject` every time the user selects a movie.

In the `movie‑list.component`, we react by highlighting the selected movie. We could subscribe here to the observable exposed by our `BehaviorSubject`, but then we'd have to implement `OnInit` and `OnDestroy`, declare and manage a subscription, and so on.

Nuestro objetivo es reaccionar a las emisiones de este `BehaviorSubject` cada vez que el usuario selecciona una película.

En el `movie‑list.component`, reaccionamos resaltando la película seleccionada. Podríamos suscribirnos aquí al observable expuesto por nuestro `BehaviorSubject`, pero luego tendríamos que implementar `OnInit` y `OnDestroy`, declarar y administrar una suscripción, etc.

Abrir `movies/src/app/movies/movie-list/movie-list.component.html`

```html
<button
  type="button"
  class="list-group-item"
  *ngFor="let movie of movies"
  [ngClass]="{ active: movie.id === selectedMovieId }"
  (click)="onSelected(movie.id)"
>
  {{ movie.movieName }}
</button>
```


En su lugar, aprovechemos la _asyn pipc_ para manejar nuestra suscripción por nosotros. Mirando la plantilla de lista de películas, aquí nos vinculamos a `ngClass`. Establecemos el estilo activo cuando la identificación de la película coincide con la variable `selectedMovieId` del movie‑list.component. Usemos una _async pipe_ aquí, pero ¿qué entubamos?

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

Volviendo al componente, cree una variable local que haga referencia al observable del servicio. Lo llamaremos `selectedMovieId$` y lo estableceremos en `this.movieService.movieSelected$`.

```diff
export class MovieListComponent {
  pageTitle = 'Movies';
  errorMessage = '';
  
  private movieService = inject(MovieService);
  readonly movies$ = this.movieService.movies$.pipe(
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
  );

  selectedMovieId: number = 0;
+ selectedMovieId$ = this.movieService.movieSelected$;

  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
    this.movieService.movieSelected(movieId);
  }
}
```

¿Por qué crear esta variable local? Es una buena práctica vincular solo una plantilla a un componente, no una plantilla a un servicio, por lo que para cualquier dato que queramos del servicio, creamos una variable de componente local que hace referencia a la variable de servicio y agregamos `readonly` para asegurarnos de no sobrescribir esta variable.

```diff
- selectedMovieId$ = this.movieService.movieSelected$;
+ readonly selectedMovieId$ = this.movieService.movieSelected$;
```

Dado que la variable aquí hace referencia al observable del servicio, suscribirse a esta variable se suscribe al observable en el servicio. Ahora no necesitamos la variable `selectedMovieId`, así que eliminémosla.

```diff
- selectedMovieId: number = 0;
  readonly selectedMovieId$ = this.movieService.movieSelected$;

  onSelected(movieId: number): void {
-   this.selectedMovieId = movieId;
    this.movieService.movieSelected(movieId);
  }
```

Actualizar `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
<div class="row">
    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          {{ pageTitle }}
        </div>
  
        <div class="card-body" *ngIf="movies$ | async as movies">
          <div class="list-group">
            <button
              type="button"
              class="list-group-item"
              *ngFor="let movie of movies"
-             [ngClass]="{ active: movie.id === selectedMovieId }"
+             [ngClass]="{ active: movie.id === (selectedMovieId$ | async) }"
              (click)="onSelected(movie.id)"
            >
              {{ movie.movieName }}
            </button>
          </div>
        </div>
      </div>
      <div class="alert alert-danger" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  
    <div class="col-md-8">
-     <app-movie-detail [movieId]="selectedMovieId" />
+     <app-movie-detail [movieId]="(selectedMovieId$ | async)" />
    </div>
  </div>
  
```

En la plantilla, nos vinculamos al observable `selectedMovieId` usando la _async pipe_. Simplemente agregue dólar para hacer referencia a la nueva variable local y | asíncrono. Agregue paréntesis para que el compilador evalúe primero la canalización asíncrona. 

Al desplazarnos hacia abajo, pasamos el `selectedMovieId` al componente secundario aquí. También reemplazaremos esto con el observable, agregaremos un dólar, | async y agregue paréntesis alrededor de la expresión. Ahora vemos un error de sintaxis.

```
✘ [ERROR] NG2: Type 'number | null | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'. [plugin angular-compiler]
```

If the `BehaviorSubject` emits its initial value, the value of `selectedMovieId$` could be undefined. We need to handle that value. One option is to use the nullish coalescing operator, which is two question marks. It returns the right side if the left side is `null` or `undefined`. Let's set the movieId to 0 if no movie is yet selected, since 0 isn't a valid movie identifier.

Si `BehaviorSubject` emite su valor inicial, el valor de `selectedMovieId$` podría no estar definido. Necesitamos manejar ese valor. Una opción es utilizar el operador coalescente nulo, que son dos signos de interrogación. Devuelve el lado derecho si el lado izquierdo es `null` o `undefined`. Establezcamos movieId en 0 si aún no hay ninguna película seleccionada, ya que 0 no es un identificador de película válido.

```diff
-<app-movie-detail [movieId]="(selectedMovieId$ | async)" />
+<app-movie-detail [movieId]="(selectedMovieId$ | async) ?? 0" />
```

No es una buena práctica tener números mágicos como este 0 aquí, pero eliminaremos todo este código en un momento. Por ahora, queremos que esto se compile sin un error de referencia nula. Con este código, movieId se establece en 0 si el movieId$ seleccionado aún no se ha emitido.

Observe que estamos usando una etiqueta de cierre automático cuando hacemos referencia al componente secundario. Las etiquetas de cierre automático están disponibles en Angular a partir de la versión 15.1. Veamos si eso funciona.

```bash
npm start
```

Ejecute la aplicación. Seleccione Lista de películas, haga clic en una película y el botón de película se vuelve azul. Y como ahora volvemos a pasar el selectedMovieId al componente de detalle de la película como propiedad de entrada, aparece el detalle. Nuestro componente de lista de películas ahora reacciona a la selección de productos y vuelve azul la fila seleccionada.

Volviendo al código, en lugar de pasar el selectedMovieId como propiedad de entrada, ¿podemos cambiar el componente de detalle de la película para que reaccione también a nuestro BehaviorSubject? Sí podemos.
