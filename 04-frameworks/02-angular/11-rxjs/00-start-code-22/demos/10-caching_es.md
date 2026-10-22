# Caching

## ¿Por qué el caching es útil?

Aquí en `movie.service`, cambiemos nuestro operador `tap` para mostrar la colección de películas recuperadas.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
-   tap(() => console.log('In http.get pipeline')),
+   tap((m) => console.log(JSON.stringify(m))),
    catchError((err) => this.handleError(err))
  );
```

Usamos `JSON.stringify` para mostrar la colección en un formato JSON. En el componente `movie‑list.component`, eliminemos el operador `tap`.

Actualizar `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  private movieService = inject(MovieService);
  readonly movies$ = this.movieService.movies$.pipe(
-      tap(() => console.log('In component pipeline')),
        catchError((err) => {
          this.errorMessage = err;
          return EMPTY;
        })
  );
```

Eso minimiza la información adicional que se muestra en la consola. Ahora abra el navegador y **abra las herramientas de desarrollador**.

Comience en la página de inicio y actualice la aplicación. Luego haga clic en la opción Lista de películas. Observe el retraso a medida que se recupera la lista de películas.


Cuando el observable `movies$` emite la siguiente notificación con nuestros datos, nuestro operador `tap` registra esos datos en la consola.

Ahora haga clic en Inicio y haga clic en Lista de películas nuevamente. Observe el retraso nuevamente mientras recupera los datos de la película.

Cada vez que el usuario accede a la página Lista de películas, el componente se inicializa y se ejecuta la solicitud de obtención HTTP. Cuando el usuario regresa a la página de inicio, el componente y nuestro observable se destruyen. La próxima vez que el usuario acceda nuevamente a la Lista de películas, el componente se inicializará nuevamente y los datos se recuperarán nuevamente. 

Si está creando una aplicación basada en gran medida en transacciones, como reservas de vuelos o entradas de cine, es posible que desee obtener siempre datos actualizados, pero a menudo los datos no cambian con tanta frecuencia y algunos datos, como los estados de EE.UU. o las opciones de envío de nuestra empresa, cambian aún menos. . 

En nuestra aplicación de muestra, nuestra lista de películas no cambia muy a menudo, así que consideremos almacenar en caché los datos de las películas en nuestro servicio. De esa manera podemos recuperarlo una vez, almacenarlo en caché y usar los valores almacenados en caché del servicio a medida que el usuario avanza por nuestra aplicación.

## Caching Retrieved Data

Almacenaremos en caché los datos en tiempo de ejecución usando `shareReplay`. Estamos mirando el `product.service`. Guardemos en caché nuestra lista de películas.

Abrir `movies/src/app/movies/movie.service.ts`

```ts
class MovieService {
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    catchError((err) => this.handleError(err))
  );
}
```

Aquí recuperamos la lista de películas y las canalizamos a través de un conjunto de operadores. Agreguemos `shareReplay` encima de `catchError` en esta canalización.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
import {
  Observable,
  catchError,
  map,
  of,
+ shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Movie } from './movie';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
+   shareReplay(1),
    catchError((err) => this.handleError(err))
  );
```

Especificaremos un tamaño de búfer de 1. Dado que una solicitud HTTP es una y está lista, solo necesitamos reproducir el elemento emitido, que es nuestra colección de películas.

Arrancar el navegador, y refrescar.

```bash
npm start
```

Observe el retraso en la visualización de las películas. Ahora haga clic en Inicio y Lista de películas nuevamente. ¿Viste lo rápido que apareció esa página? Y sin registros adicionales.

Nuestro canal observable reprodujo los datos que ya recuperó, mejorando el rendimiento de nuestra aplicación.

Entonces, incluso cuando se destruye la página Lista de películas, el observable compartido permanece y se reproduce según sea necesario.

Volviendo al código, la ubicación de `shareReplay` en el proceso es importante. Agreguemos un toque después de `shareReplay`.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
+   tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );
```

Ignoraré el parámetro y usaré console.log para mostrar un mensaje. Mirando el navegador, actualice y vea la consola. Vemos las películas registradas y nuestro mensaje. Haga clic en Inicio y haga clic en Lista de películas nuevamente.

> Nuestras películas no son recuperadas otra vez, pero nuestro mensaje se vuelve a mostrar.

Volviendo al código, los operadores encima de `shareReplay` se ejecutan antes de que los datos se almacenen en caché. No se vuelven a ejecutar en la siguiente suscripción. Los operadores después de `shareReplay` no afectan el almacenamiento en caché. Se vuelven a ejecutar en cada suscripción. 

Eliminemos nuestro operador de grifo adicional. Utilice `shareReplay` según sea necesario para almacenar en caché las emisiones observables y preste atención a la ubicación de `shareReplay` en la tubería.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
  readonly movies$ = this.http.get<Movie[]>(this.moviesUrl).pipe(
    tap((m) => console.log(JSON.stringify(m))),
    shareReplay(1),
-   tap(() => console.log('After shareReplay')),
    catchError((err) => this.handleError(err))
  );
```
