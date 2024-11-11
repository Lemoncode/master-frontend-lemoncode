# Reacting to Actions

## Reacting to Actions and Getting Data

En esta demostración, reaccionamos a una notificación y recuperamos datos.

Abrir `movies/src/app/movies/movie.service.ts`

```ts
class MovieService {
  // ....
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
    // tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );

  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http.get<Movie>(movieUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      switchMap((m) => this.getMoviesWithReviews(m)),
      catchError(this.handleError)
    );
  }
  // ....
}
```


Recuerde que antes cambiamos esta recuperación para utilizar un enfoque declarativo. Al suscribirse, nuestro servicio recupera toda la información de la película. Pero no cambiamos el código que recupera una sola película a un enfoque declarativo. No pudimos en ese momento porque requiere una identificación de película para usar en la URL.

Ahora que nuestro `BehaviorSubject` emite la identificación de la película, podemos cambiar este código a un enfoque declarativo. Comience declarando una variable, `movie$` singular. Establézcalo en `this.movieSelected$` y agreguemos `readonly` al frente para asegurarnos de que no cambie.

```diff
# ...
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
    // tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );
+
+ readonly movie$ = this.movieSelected$;
```

Pero espera, este observable emite una identificación de película o indefinida, no la película en sí. Para obtener la película, canalizamos la identificación a través de un conjunto de operadores y usamos algún tipo de mapa para transformar la identificación en un observable. 

Ese observable emite los datos de la película. ¿Recuerda lo que vi antes cómo lo hacemos? Sí, utilizamos un operador de mapeo de orden superior. El usuario puede seleccionar una película y luego seleccionar rápidamente otra. Solo queremos los datos de la selección más reciente, por lo que usaremos un `switchMap`.

`movieSelected$` emite la identificación de la película en este operador. Queremos que la función `switchMap` realice dos operaciones, establezca la URL adecuada y llame a http.get, por lo que definimos una función de flecha de varias líneas usando llaves.

Copiemos este código y péguelo aquí entre llaves.

```ts
class MovieService {
  readonly movieSelected$ = this.movieSelectedSubject.asObservable();

  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
    // tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );

  /*diff*/
  readonly movie$ = this.movieSelected$.pipe(
    switchMap((id) => {
      const movieUrl = `${this.moviesUrl}/${id}`;
      return this.http.get<Movie>(movieUrl).pipe(
        tap(() => console.log('In http.get by id pipeline')),
        switchMap((m) => this.getMoviesWithReviews(m)),
        catchError(this.handleError)
      );
    })
  );
  /*diff*/

  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http.get<Movie>(movieUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      switchMap((m) => this.getMoviesWithReviews(m)),
      catchError(this.handleError)
    );
  }
```

El observable `movieSelected` emite la identificación de la película. Tomamos esa identificación y la usamos para construir la URL adecuada. Luego emitimos una solicitud http.get, pasando esa URL. Canalizamos el resultado a través de otro conjunto de operadores para obtener las revisiones relacionadas. Eliminemos este operador de grifo. 

Al pasar el cursor sobre `movie$`, vemos que efectivamente es un Observable que emite una Película. Al pasar el cursor sobre `movieSelected$`, puede emitir un número o un valor indefinido. 

No queremos obtener una película si el _id_ no está definida. Usemos un pequeño truco y filtremos cualquier valor `null` o `undefined` usando el operador de filtro.

```diff
readonly movie$ = this.movieSelected$.pipe(
+   filter(Boolean),
    switchMap((id) => {
      const movieUrl = `${this.moviesUrl}/${id}`;
      return this.http.get<Movie>(movieUrl).pipe(
-       tap(() => console.log('In http.get by id pipeline')),
        switchMap((m) => this.getMoviesWithReviews(m)),
        catchError(this.handleError)
      );
    })
  );
```

Aprovechamos la técnica de la "función booleana" para verificar si hay valores indefinidos o nulos. La "función booleana" devuelve verdadero cuando existe un elemento y falso cuando el elemento es falso, indefinido o nulo. 

Este código ahora recupera una película utilizando la identificación de la película emitida por nuestro `BehaviorSubject`. Luego responde a la pregunta que hicimos anteriormente: ¿cómo pasamos un parámetro cuando usamos el enfoque declarativo? Usamos un `Subject` o `BehaviorSubject`. Accedemos a su observable de `readonly` y reaccionamos a sus emisiones. Usamos el valor emitido para el parámetro de consulta. 

¿Qué pasa si queremos más de un parámetro? Podríamos crear un objeto con una propiedad para cada parámetro requerido y emitir ese objeto, o podríamos combinar múltiples observables, como veremos en un momento. 

## Reaccionando a Acciones y Mostrando Datos

En esta demostración, reaccionamos cuando se recupera la película y mostramos los detalles de la película. Ahora que tenemos este observable declarativo, eliminemos el método getMovie.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
readonly movie$ = this.movieSelected$.pipe(
    filter(Boolean),
    switchMap((id) => {
      const movieUrl = `${this.moviesUrl}/${id}`;
      return this.http.get<Movie>(movieUrl).pipe(
        tap(() => console.log('In http.get by id pipeline')),
        switchMap((m) => this.getMoviesWithReviews(m)),
        catchError(this.handleError)
      );
    })
  );
-
- getMovie(id: number): Observable<Movie> {
-   const movieUrl = `${this.moviesUrl}/${id}`;
-   return this.http.get<Movie>(movieUrl).pipe(
-     tap(() => console.log('In http.get by id pipeline')),
-     switchMap((m) => this.getMoviesWithReviews(m)),
-     catchError(this.handleError)
-   );
- }
```

Recuerde que el componente movie‑detail.component llamó al método getMovie que acabamos de eliminar, por lo que necesitaremos actualizarlo. En el componente movie‑detail., declare una variable que haga referencia al observable del servicio.

Actualizar `movies/src/app/movies/movie-detail/movie-detail.component.ts`

```diff
export class MovieDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input() movieId: number = 0;
  errorMessage = '';
  /*diff*/
  sub!: Subscription;
  /*diff*/

  // Movie to display
  movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie ? `Movie Detail for: ${this.movie.movieName}` : 'Movie Detail';

  /*diff*/
  private movieService = inject(MovieService);
+ movie$ = this.movieService.movie$;
# ....
```


Lo llamaré `movie$` y lo estableceré en `this.movieService.movie$`. ¿Recuerdas por qué hacemos esto? No queremos que nuestra plantilla de componente se vincule a nuestro observable directamente en el servicio, por lo que hacemos referencia a la variable de servicio en el código de nuestro componente. Y queremos agregar manejo de errores aquí. 

Si la petición HTTP generó un error, ese error se volverá a generar en nuestro componente. Copiemos la tubería desde aquí y pegémosla aquí.

```diff
# .....  
  private movieService = inject(MovieService);
+ movie$ = this.movieService.movie$.pipe(
+   catchError((err) => {
+     this.errorMessage = err;
+     return EMPTY;
+   })
+ );
```

Ya no necesitamos nada de este otro código porque nuestro componente ahora reacciona al observable proporcionado por nuestro `BehaviorSubject`. Comenzaré desde arriba y eliminaré los implementos, la propiedad de Entrada y la Suscripción. Eliminaré la variable del producto local y, al desplazarme hacia abajo, eliminaré ngOnChanges y ngOnDestroy. Desplácese hacia arriba y elimine las importaciones no utilizadas.

```diff
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { 
  Component, 
- Input, 
- OnChanges, 
- OnDestroy, 
- SimpleChanges, 
  inject 
  } from '@angular/core';
import { Movie } from '../movie';
import { 
  EMPTY, 
- Subscription, 
  catchError 
} from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
-export class MovieDetailComponent implements OnChanges, OnDestroy {
+export class MovieDetailComponent {
- // Just enough here for the template to compile
- @Input() movieId: number = 0;
  errorMessage = '';
- sub!: Subscription;
-
- // Movie to display
- movie: Movie | null = null;

  // Set the page title
  pageTitle = this.movie ? `Movie Detail for: ${this.movie.movieName}` : 'Movie Detail';

  private movieService = inject(MovieService);
  movie$ = this.movieService.movie$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  
- ngOnChanges(changes: SimpleChanges): void {
-   const id = changes["movieId"].currentValue;
-   if (id > 0) {
-     this.sub = this.movieService
-       .getMovie(id)
-       .subscribe((movie) => (this.movie = movie));
-   }
- }
-
- ngOnDestroy(): void {
-   if (this.sub) {
-     this.sub.unsubscribe();
-   }
- }

  addToCart(movie: Movie) {
  }
}

```

¿Recuerda que dijimos anteriormente que usar este enfoque puede reducir la cantidad de código que tenemos? Aquí está nuestra prueba. 

Este código es mucho más corto y cabe todo en una sola página. ¿Qué pasa con el `pageTitle`? ¿Podemos arreglar eso? Sí, pero tenemos una solución mejor con señales un poco más adelante, así que por ahora, comentemos esto y codifiquemos el título.

```ts
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { 
  Component, 
  inject } from '@angular/core';
import { Movie } from '../movie';
import { 
  EMPTY, 
  catchError 
} from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
export class MovieDetailComponent {
  errorMessage = '';
  pageTitle = 'Movie Detail';

  private movieService = inject(MovieService);
  movie$ = this.movieService.movie$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );
  
  addToCart(movie: Movie) {
  }
}

```

Hay una cosa que nos falta. ¿Alguna idea de qué? No nos estamos suscribiendo a `movie$` en ningún lado. Agreguemos una _async pipe_ a nuestra plantilla de detalles de película.

Actualizar `movies/src/app/movies/movie-detail/movie-detail.component.html`

```diff
-<div class="card" *ngIf="movie">
+<div class="card" *ngIf="movie$ | async as movie">
```


Aquí, en la parte superior, cambiamos película a movie$ y agregamos una _async pipe_. Utilice la cláusula as para emitir la película en una variable que llamaremos película. Al usar la cláusula as, no tenemos que cambiar ninguno de nuestros otros enlaces aquí, ya que hacen referencia a la película. 

Pero observe que estamos viendo un error de sintaxis. ¿Recuerdas por qué? Estamos utilizando componentes independientes, por lo que nuestro componente ahora debe importar la _async pipe_.

Actualizar `movies/src/app/movies/movie-detail/movie-detail.component.ts`

```diff
-import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
+import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { 
  Component, 
  inject } from '@angular/core';
import { Movie } from '../movie';
import { 
  EMPTY, 
  catchError 
} from 'rxjs';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
- imports: [NgIf, NgFor, CurrencyPipe],
+ imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe],
  templateUrl: './movie-detail.component.html',
  styles: ``
})
```

Volviendo al componente, agregamos AsyncPipe a la colección de importaciones. 

Pero espera, hay más. Hay una cosa más que podemos simplificar. En la plantilla movie‑list.component, ya no necesitamos pasar el movieId. En cambio, reaccionamos a la identificación emitida por el servicio, por lo que podemos eliminar la propiedad de entrada aquí. Desaparecido.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-<app-movie-detail [movieId]="(selectedMovieId$ | async) ?? 0" />
+<app-movie-detail />
```

Bueno, ha sido muy divertido eliminar tanto código a lo largo de esta demostración. ¿Estamos listos para intentarlo? Abramos el navegador.

```bash
npm start
```

Seleccione una película. Nuestro código resalta la entrada seleccionada en azul y aparece el detalle. ¡Hurra! Pero observe lo lento que muestra los detalles.

> Observe lo lento que muestra los detalles.

¿Qué pasa si encontramos la película seleccionada en el conjunto de películas ya recuperadas en lugar de volver a obtenerla? Eso podría mejorar el rendimiento. Para hacer eso, combinaremos observables a continuación.