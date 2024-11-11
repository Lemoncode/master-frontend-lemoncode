# Demo: Retrieve Related Data 2

In this demo, we go back to our sample application and get the related data we need. In our case, it's a set of reviews for a movie. We'll get one movie, then use the movie information and an appropriate higher‑order mapping operator to get the related data.

Open `movies/src/app/movies/movie.service.ts`

We're looking at the `movie.service` exactly how we left it from earlier. Recall that we are facing several issues.

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

We aren't subscribing to this inner observable. The `map` emits an `Observable<Movie>` instead of a `Movie`, and our return type is expecting to return an `Observable<Movie>`, not an `Observable<Observable<Movie>`. 

We can solve these issues by using a higher‑order mapping operator, but which one do we want? 

Since the user is selecting a movie and we react to that user selection, let's use a `switchMap`. That way if the user changes their mind, it will cancel the original HTTP request for the reviews and issue the new request.

Update `movies/src/app/movies/movie.service.ts`

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

We change the `map` to `switchMap` here. This operator automatically subscribes and unsubscribes from our inner Observable. Hovering over x from our tap operator, we see that the `switchMap` correctly emits the product and we have no more syntax errors. Nice. 

We no longer need this extra tap, so let's delete it. Want to see if it works? 

```bash
npm start
```

Bring up the browser, select a product, and we see the set of reviews. Yay! 

Going back to the service, we could have put all of this code within the `switchMap` as a multi‑line arrow function, but that would make the code harder to read. 

This brings us to our next best practice. Whenever possible, minimize the amount of code in your pipelines. Why? Smaller pipelines make the code easier to read, maintain, debug, and test. They can also improve performance. 

How do we minimize the code in our pipelines? Break up pipeline code into separate methods where possible, then call the methods in the pipeline just like we did in this example. Next let's plunge into positive preferable practices, present practical priceless perceptions, and point to polished posts.
