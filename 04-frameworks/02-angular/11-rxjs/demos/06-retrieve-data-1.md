## Demo: Retrieve Related Data 1

In this demo, we retrieve related data. We'll get the movie, then get the reviews for that movie. Let's begin by running the application.

```bash
npm start
```

In the browser, select Movie List, then pick a movie from the list on the left, and the movies details appear. Here, it says that there are no reviews for this movie. That's because we have not yet written any code to retrieve them.

Going back to the code, let's look at the `review.service`. Open `movies/src/app/reviews/review.service.ts`

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

This service has a method that builds the correct URL endpoint given the `movieId`. It uses the base URL and appends a query parameter. This uses the caret and dollar regular expression anchor characters for an exact match of the `movieId`. We'll call this method to build a URL when retrieving the product reviews. Next, let's look at the movie interface.

Open `movies/src/app/movies/movie.ts`

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

The interface has a Boolean property indicating whether this movie has reviews, and it has an array for those reviews. But those reviews aren't returned when we get the movie data, they have their own HTTP endpoint, so we have to issue another HTTP request to get this related data and assign this property to the response.

Our plan is to read a products `hasReviews` property. If that property is true, we issue an HTTP get request to get the reviews for that movie. Then we add the retrieved reviews to this reviews property for display in the template. Let's create a method to do just that.

Update `movies/src/app/movies/movie.service.ts`

In the movie.service, begin by injecting the reviewService so we can call its method and get a correctly formatted URL.

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

We'll use private so the injected instance can only be used by this service. Next, scrolling down, we define a new method. I'll make the method private and call it `getMovieWithReviews`.

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

It takes in a movie, it uses that movie to retrieve the reviews, and adds those reviews to the movie's review property. This method returns an observable that emits the updated movie with its reviews. 

We start by checking the `movie.hasReviews` property. If the property is set, we issue the HTTP get request. We call `this.http.get`. There may be multiple reviews, so we expect to get a review array. 

For the URL, we pass in `this.reviewService.getReviewUrl` and pass in the `movie.id`. As we saw, this method creates the correct URL to retrieve reviews for a specific movieId. If all is well, this returns the array of reviews. We map that to the reviews property of the movie object.

Add the pipe method, and use the `map` operator. When subscribed, the HTTP get emits the review array, so that's what's emitted into the `map`. We then create a copy of the passed‑in movie using the spread operator, and add the reviews property. 

We strongly type the result as `Movie`, and we add parentheses, because otherwise the arrow function thinks this is a method body instead of an object. 

So, given a movie, if the movie has reviews, this method gets those reviews. It copies the movie to create a new movie. It then sets the retrieved reviews into the reviews property, then it returns an observable that emits the new movie. 

If the `hasReviews` property is false, we don't need to get reviews, so we return the original movie. But we see a syntax error here. That's because this method returns an observable of movie, so let's add the `of` creation function to create an observable that emits the movie, and add the import. Now our data types look good. That was fun.

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

Now we just need to call this method from somewhere. For a great user experience, we want to get the reviews for the movie when we get the movie. 

That way we can display both in the template. Here in the `getMovie` pipeline, we use an operator to call `getMovieWithReviews`, but which one. 

Should we use the `tap` operator? Well, the `getMovieWithReviews` method changes the passed‑in product to a new movie with the reviews. `tap` should only be used for processes that don't change the emitted value, so `tap` isn't the right choice in this case. How about `map`? Let's give that a try. In the `getMovie` pipeline, add a `map` operator after the `tap`. 

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


Since the `getMovieWithReviews` method issues an HTTP request that could generate an error, we want it above the `catchError`. 

Recall that the result of each operator is emitted to the next operator in the pipeline. The movie from the response is emitted unchanged through the tap operator. That movie is emitted to this `map` operator. We pass that product to our `getMovieWithReviews` method. 

But we have a problem here that isn't obvious to see. In addition to the syntax error we can see, this.http.get inside the `getMovieWithReviews` method won't execute. 

Any idea why? If you said **we're missing the subscribe, you are correct**. Our component subscribes to the Observable returned by `getMovie`, effectively subscribing to the Observable returned by this.http.get, but **nothing subscribes to the Observable returned by the getMovieWithReviews method**. And we see an error on the return statement. 

Hovering over the error, this method is expecting to return an Observable that emits a product, but it's returning an `Observable<Observable<Product>`. What? 

A best practice is to use a `tap` to help debug issues with our pipeline. Let's add another `tap` after the map to see what the map emits. Let's just say x => console.log(x). 

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

Hover over movie, and we see that we are indeed emitting a Movie into the `map` operator. Hover over x, and we see that the map operator emits an `Observable<Movie>`. The `map` simply emits the result of the provided function. The `getMoieWithReviews` returns an `Observable<Movie>`, so that's what the `map` emits, not the movie itself. 

We can't usefully log an Observable and our template won't know how to display this result. We need some way for this `map` operator to subscribe to the Observable returned by `getMovieWithReviews`, and we need some way for it to unwrap the Observable and emit the `Movie`, not an `Observable<Movie>`. That way our return statement will return an `Observable<Movie>`, not an `Observable<Observable<Movie>`. 

How do we do all of that? That's where higher order mapping operators come in. Let's leave our problematic code for now and introduce higher order mapping operators, but first, a tip. 

As we saw in the demo, use the editor hover feature to help debug data typing or other issues. In this screenshot, we hover over the x to see that it is an `Observable<Movie>` so we know that our `map` isn't emitting the type of data we expected. Why is this helpful? Most editors such as VS Code provide tooltips. These tooltips display the data type of any variable or function we hover over. When debugging a pipeline, hover over the value emitted to the following operator. Seeing the type of emitted value can provide hints as to what's wrong inside the prior operator. 
