# Demo: Retrieve Related Data 2

En esta demostración, volvemos a nuestra aplicación y obtenemos los datos relacionados que necesitamos. En nuestro caso, se trata de un conjunto de reseñas de una película. Obtendremos una película, luego usaremos la información de la película y un operador de mapeo de orden superior apropiado para obtener los datos relacionados.

Abrir `movies/src/app/movies/movie.service.ts`

Estamos viendo `movie.service` exactamnete como lo dejamos anteriormenet. Recordemos que estamos enfrentado múltiples *issues*.

```ts
class MovieService {
  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http.get<Movie>(movieUrl).pipe(
      tap(() => console.log("In http.get by id pipeline")),
      map((p) => this.getProductsWithReviews(p)),
      tap((x) => console.log(x)),
      catchError((err) => this.handleError(err))
    );
  }
}
```

No nos suscribimos a este observable interno. El `map` emite un `Observable<Movie>` en lugar de una `Movie`, y nuestro tipo de retorno espera devolver un `Observable<Movie>`, no un `Observable<Observable<Movie>`.

Podemos resolver estos problemas usando un *high-order mapping operator*, ¿pero cuál queremos?

Dado que el usuario está seleccionando una película y nosotros reaccionamos a esa selección del usuario, usemos un `switchMap`. De esa manera, si el usuario cambia de opinión, cancelará la solicitud HTTP original para las revisiones y emitirá la nueva solicitud.

Actualizar `movies/src/app/movies/movie.service.ts`

```diff
  getMovie(id: number): Observable<Movie> {
    const movieUrl = `${this.moviesUrl}/${id}`;
    return this.http
      .get<Movie>(movieUrl)
      .pipe(
        tap(() => console.log('In http.get by id pipeline')),
-       map((p) => this.getMoviesWithReviews(p)),
+       switchMap((m) => this.getMoviesWithReviews(m)),
-       tap((x) => console.log(x)),
        catchError(this.handleError)
      );
  }
```

Aquí cambiamos el `map` a `switchMap`. Este operador se suscribe y cancela automáticamente de nuestro Observable interno. Al pasar el cursor sobre x desde nuestro operador `tap`, vemos que `switchMap` emite correctamente el producto y no tenemos más errores de sintaxis.
 
No necesitamos tampoco este extra tap, así que borresmolo. ¿Vemos si funciona?

```bash
npm start
```

Arrancamos el navegador, seleccionamos un producto, y vemos las reviews. ¡Si!

Volviendo al servicio, podríamos haber puesto todo este código dentro de `switchMap` como una *arrow function* de varias líneas, pero eso haría que el código fuera más difícil de leer.

Esto nos lleva a nuestra siguiente mejor práctica. Siempre que sea posible, minimice la cantidad de código en sus *pipelines*. ¿Por qué? Las *pipelines* más pequeñas hacen que el código sea más fácil de leer, mantener, depurar y probar. También pueden mejorar el rendimiento.

¿Cómo minimizamos el código en nuestras *pipelines*? Divida el código de la *pipeline* en métodos separados cuando sea posible, luego llame a los métodos en la *pipeline* tal como lo hicimos en este ejemplo.
