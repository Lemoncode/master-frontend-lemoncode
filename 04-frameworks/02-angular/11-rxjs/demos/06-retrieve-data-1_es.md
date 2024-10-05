# Demo: Recuperar Datos Relacionados 1

En esta demostración, recuperamos datos relacionados. Obtendremos la película y luego obtendremos las críticas de esa película. Comencemos ejecutando la aplicación.

```bash
npm start
```

En el navegador, seleccionamos *Movie List*, luego elija una película de la lista de la izquierda y aparecerán los detalles de la película. Aquí dice que no hay reseñas para esta película. Esto se debe a que todavía no hemos escrito código para recuperarlos.

Voviendo al código, vamos a mirar `review.service`. Abrimos `movies/src/app/reviews/review.service.ts`

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewsUrl = 'api/reviews';

  getReviewUrl(movieId: number): string {
    return `${this.reviewsUrl}?movieId=^${movieId}$`;
  }
}

```

Este servicio tiene un método que crea el *URL endpoint* correcto dado el `movieId`. Utiliza la URL base y agrega un parámetro de consulta. Esto utiliza los caracteres de `^` y `$` para obtener una coincidencia exacta del `movieId`. Llamaremos a este método para crear una URL al recuperar las reseñas de películas. A continuación, veamos la interfaz de la película.

Abrimos `movies/src/app/movies/movie.ts`

```ts
import { Review } from '../reviews/review';

/* Defines the product entity */
export interface Movie {
  id: number;
  movieName: string;
  movieCode: string;
  description: string;
  price: number;
  likes?: number;
  hasReviews?: boolean;
  reviews?: Review[];
}

```

La interfaz tiene una propiedad booleana que indica si esta película tiene reseñas y tiene un array para esas reseñas. Pero esas reseñas no se devuelven cuando obtenemos los datos de la película, tienen su propio *endpoint HTTP*, por lo que tenemos que emitir otra petición HTTP para obtener estos datos relacionados y asignar esta propiedad a la respuesta.

Nuestro plan es leer la propiedad `hasReviews` de la película. Si esa propiedad es verdadera, emitimos una petición HTTP para obtener las reseñas de esa película. Luego agregamos las reseñas recuperadas a esta propiedad de reseñas para mostrarlas en la plantilla. Creemos un método para hacer precisamente eso.

Actualizar `movies/src/app/movies/movie.service.ts`

En movie.service, comenzamos inyectando reviewService para que podamos llamar a su método y obtener una URL con el formato correcto.

```diff
# ....
+import { ReviewService } from '../reviews/review.service';
+import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private moviesUrl = 'api/movies';

  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
+ private reviewService = inject(ReviewService);
```

Usaremos `privado` para que la instancia inyectada solo pueda ser utilizada por este servicio. A continuación, desplazándonos hacia abajo, definimos un nuevo método. Haré que el método sea privado y lo llamaré `getMovieWithReviews`.

```ts
class MovieService {
  private getMoviesWithReviews(movie: Movie): Observable<Movie> {
    if (movie.hasReviews) {
      this.http.get<Review[]>(this.reviewService.getReviewUrl(movie.id));
    }
    return EMPTY;
  }
}
```

Toma una película, la utiliza para recuperar las reseñas y las agrega a la propiedad de reseñas de la película. Este método devuelve un observable que emite la película actualizada con sus reseñas.

Comenzamos comprobando la propiedad `movie.hasReviews`. Si la propiedad está configurada, emitimos la petición HTTP. Lo llamamos `this.http.get`. Puede haber varias revisiones, por lo que esperamos obtener una colección de revisiones.


Para la URL, pasamos `this.reviewService.getReviewUrl` y pasamos `movie.id`. Como vimos, este método crea la URL correcta para recuperar reseñas de un movieId específico. Si todo está bien, esto devuelve la serie de reseñas. Lo asignamos a la propiedad reviews del objeto de la película.

Agregue el método `pipe` y use el operador `map`. Cuando se suscribe, el get HTTP emite la colección de revisiones, por lo que eso es lo que se emite en el `map`. Luego creamos una copia de la película pasada utilizando el operador `spread` y agregamos la propiedad de reseñas.

Tipamos el resultado como `Movie` y agregamos paréntesis, porque de lo contrario la *fat arrow funtion* piensa que se trata del cuerpo de un método en lugar de un objeto.

Entonces, dada una película, si la película tiene reseñas, este método obtiene esas reseñas. Copia la película para crear una nueva película. Luego establece las reseñas recuperadas en la propiedad de reseñas y luego devuelve un observable que emite la nueva película.

Si la propiedad `hasReviews` es falsa, no necesitamos obtener reseñas, por lo que devolvemos la película original. Pero aquí vemos un error de sintaxis. Esto se debe a que este método devuelve un observable de la película, así que agreguemos la función de creación `of` para crear un observable que emita la película y agreguemos la importación. Ahora nuestros tipos de datos se ven bien. Eso fue divertido.

```diff
-import { EMPTY, Observable, catchError, tap, throwError } from 'rxjs';
+import { EMPTY, Observable, catchError, map, of, tap, throwError } from 'rxjs';
```

```ts
class MovieService {
  // .....
  private getMoviesWithReviews(movie: Movie): Observable<Movie> {
    if (movie.hasReviews) {
      this.http
      .get<Review[]>(this.reviewService.getReviewUrl(movie.id))
      .pipe(
        map(
          (reviews) => ({
            ...movie,
            reviews
          } as Movie)
        )
      )
      ;
    }
    return of(movie);
  }
}
```

Ahora sólo necesitamos llamar a este método desde algún lugar. Para una excelente experiencia de usuario, queremos recibir las reseñas de la película cuando la recibamos.

De esa manera podemos mostrar ambos en la plantilla. Aquí, en el proceso `getMovie`, usamos un operador para llamar a `getMovieWithReviews`, pero ¿cuál?

¿Deberíamos utilizar el operador `tap`? Bueno, el método `getMovieWithReviews` cambia la película, a una nueva película con las reseñas. `tap` solo debe usarse para procesos que no cambian el valor emitido, por lo que `tap` no es la opción correcta en este caso. ¿Qué tal `map`? Intentémoslo. En el proceso `getMovie`, agregue un operador `map` después de `tap`.

```diff
  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline')),
+       map((p) => this.getMoviesWithReviews(p)),
+       catchError(this.handleError)
      );
  }
```



Dado que el método `getMovieWithReviews` emite una petición HTTP que podría generar un error, lo queremos encima de `catchError`.

Recuerde que el resultado de cada operador se emite al siguiente operador en la tubería. La película de la respuesta se emite sin cambios a través del operador `tap`. Esa película se emite a este operador `map`. Pasamos ese producto a nuestro método `getMovieWithReviews`.

Pero aquí tenemos un problema que no es obvio de ver. Además del error de sintaxis que podemos ver, this.http.get dentro del método `getMovieWithReviews` no se ejecutará.

¿Alguna idea de por qué? Si dijiste **nos falta la suscripción, estás en lo cierto**. Nuestro componente se suscribe al Observable devuelto por `getMovie`, suscribiéndose efectivamente al Observable devuelto por this.http.get, pero **nada se suscribe al Observable devuelto por el método getMovieWithReviews**. Y vemos un error en la declaración de devolución.

Al pasar el cursor sobre el error, este método espera devolver un Observable que emite un producto, pero devuelve un `Observable<Observable<Product>`. ¿Qué?

Una práctica recomendada es utilizar un `tap` para ayudar a depurar problemas con nuestra *pipeline*. Agreguemos otro `tap` después del `map` para ver qué emite el `map`. Digamos simplemente x => console.log(x).

```diff
  getProduct(id: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log('In http.get by id pipeline')),
      map((p) => this.getProductsWithReviews(p)),
+     tap((x) => console.log(x)),
      catchError((err) => this.handleError(err))
    );
  }
```

Pase el cursor sobre movie y veremos que efectivamente estamos emitiendo una Movie en el operador `map`. Pase el cursor sobre x y veremos que el operador del `map` emite un `Observable<Movie>`. El `map` simplemente emite el resultado de la función proporcionada. `getMoieWithReviews` devuelve un `Observable<Movie>`, por lo que eso es lo que emite el `map`, no la película en sí.

No podemos registrar un Observable de manera útil y nuestra plantilla no sabrá cómo mostrar este resultado. Necesitamos alguna forma para que este operador `map` se suscriba al Observable devuelto por `getMovieWithReviews`, y necesitamos alguna forma para que desvuelva el Observable y emita la `Movie`, no un `Observable<Movie>`. De esa manera, nuestra declaración de devolución devolverá un `Observable<Movie>`, no un `Observable<Observable<Movie>`.

How do we do all of that? That's where higher order mapping operators come in. Let's leave our problematic code for now and introduce higher order mapping operators, but first, a tip. 

¿Cómo hacemos todo eso? Ahí es donde entran los *high order mapers*. Dejemos nuestro código problemático por ahora e introduzcamos *high order mapers*, pero primero, un consejo.

Usa la función del cursor para depurar el tipado. En esta captura de pantalla, pasamos el cursor sobre la x para ver que es una `Observable<Movie>` para saber que nuestro `map` no emite el tipo de datos que esperábamos. ¿Por qué es esto útil? La mayoría de los editores, como VS Code, proporcionan información sobre herramientas. Esta información sobre herramientas muestra el tipo de datos de cualquier variable o función sobre la que pasamos el cursor. Al depurar una *pipeline*, coloque el cursor sobre el valor emitido al siguiente operador. Ver el tipo de valor emitido puede proporcionar pistas sobre qué está mal dentro del operador anterior.