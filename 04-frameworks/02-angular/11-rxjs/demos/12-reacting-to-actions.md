# Reacting to Actions

## Reacting to Actions and Getting Data

In this demo, we react to a notification and retrieve data. 

Open `movies/src/app/movies/movie.service.ts`

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

Recall from earlier that we changed this retrieve to use a declarative approach. When subscribed, our service retrieves all the movie information. But we didn't change the code that retrieves a single prodmovieuct to a declarative approach. We couldn't at the time, because it requires a movie id for use in the URL.

Now that our `BehaviorSubject` emits the movie id, we can change this code to a declarative approach. Start by declaring a variable, `movie$` singular. Set it equal to `this.movieSelected$`, and let's add `readonly` to the front to ensure it's not changed.

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

But wait, this observable emits a movie id or undefined, not the movie itself. To get the movie, we pipe the id through a set of operators and use some type of map to transform the id into an observable. 

That observable emits the movie data. Recall from earlier how we do that? Yep, we use a higher‑order mapping operator. The user could select one movie, then quickly select another. We only want the data for the most recent selection, so we'll use a `switchMap`.

`movieSelected$` emits the movie id into this operator. We want the `switchMap` function to perform two operations, set the appropriate URL and call http.get, so we define a multi‑line arrow function using curly braces. 

Let's copy this code and paste it here within the curly braces.

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

The `movieSelected` observable emits the movie id. We take that id and use it to construct the appropriate URL. Then we issue an http.get request, passing in that URL. We pipe the result through another set of operators to get the related reviews. Let's delete this tap operator. 

Hovering over `movie$`, we see that it is indeed an Observable that emits a Movie. Hovering over `movieSelected$`, it can emit a number or undefined. 

We don't want to get a movie if the id is undefined. Let's use a little trick and filter out any null or undefined values using the filter operator. 

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

We leverage the Boolean function technique to check for undefined or null. The Boolean function returns true when an item exists and false when the item is false, undefined or null. 

This code now retrieves a movie using the movie id emitted from our `BehaviorSubject`. It then answers the question we asked earlier, how do we pass a parameter in when we use the declarative approach? We use a `Subject` or `BehaviorSubject`. We access its readonly observable and react to its emissions. We use the emitted value for the query parameter. 

What if we want more than one parameter? We could create an object with a property for each required parameter and emit that object, or we could combine multiple observables, as we'll see in a bit. Let's throw up a best practices slide. 

## Reacting to Actions and Displaying Data

In this demo, we react when the movie is retrieved and display the movie details. Now that we have this declarative observable, let's delete the getMovie method. 

Update `movies/src/app/movies/movie.service.ts`

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

Recall that the movie‑detail.component called the getMovie method we just deleted, so we'll need to update that. In the movie‑detail.component, declare a variable that references the observable from the service. 

Update `movies/src/app/movies/movie-detail/movie-detail.component.ts`

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

I'll call it `movie$`, set it equal to `this.movieService.movie$`. Recall why we do this? We don't want our component template to bind to our observable directly in the service, so we reference the service variable in our component code. And we want to add error handling here. 

If the HTTP request generated an error, that error will be re‑thrown to our component. Let's copy the pipe from here and paste it here. 

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

We no longer need any of this other code because our component now reacts to the observable provided by our `BehaviorSubject`. I'll start at the top and delete the implements, the Input property, and the Subscription. I'll delete the local product variable, and scrolling down, delete ngOnChanges and ngOnDestroy. Scrolling up, remove any unused imports. 

```diff
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
- Input,
- OnChanges,
- OnDestroy,
- SimpleChanges,
  inject,
} from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { 
  EMPTY, 
- Subscription, 
  catchError 
} from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styles: ``,
})
-export class ProductDetailComponent implements OnChanges, OnDestroy {
+export class ProductDetailComponent {
- @Input() productId: number = 0;
  errorMessage = '';
- sub!: Subscription;

- Product to display
- product: Product | null = null;

  // Set the page title
  pageTitle = this.product
    ? `Product Detail for: ${this.product.productName}`
    : 'Product Detail';

  private productService = inject(ProductService);
  product$ = this.productService.product$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

- ngOnChanges(changes: SimpleChanges): void {
-   const id = changes['productId'].currentValue;
-   if (id > 0) {
-     this.sub = this.productService
-       .getProduct(id)
-       .pipe(
-         catchError((err) => {
-           this.errorMessage = err;
-           return EMPTY;
-         })
-       )
-       .subscribe((product) => (this.product = product));
-   }
- }
-
- ngOnDestroy(): void {
-   if (this.sub) {
-     this.sub.unsubscribe();
-   }
- }

  addToCart(product: Product) {}
}

```

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


Recall from earlier that we said using this approach can reduce the amount of code we have? Here's our proof. 

This code is so much shorter, it all fits on one page. What about this pageTitle? Can we fix that? Yes, but we have a better solution with signals a bit later, so for now, let's comment this out and instead hard code the title. 

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

There's one thing we're missing. Any idea what? We aren't subscribing to this movie$ anywhere. Let's add an async pipe to our movie‑detail template. 

Update `movies/src/app/movies/movie-detail/movie-detail.component.html`

```diff
-<div class="card" *ngIf="movie">
+<div class="card" *ngIf="movie$ | async as movie">
```

Here at the top, we change movie to movie$ and add an async pipe. Use the as clause to emit the movie into a variable we'll call, movie. By using the as clause, we don't have to change any of our other bindings here, they already reference movie. 

But notice we're seeing a syntax error. Recall why? We are using standalone components, so our component must now import the async pipe. 

Update `movies/src/app/movies/movie-detail/movie-detail.component.ts`

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

Going back to the component, we add AsyncPipe to the imports array. 

But wait, there's more. There's one more thing we can simplify. In the movie‑list.component template, we no longer need to pass in the movieId. Instead, we react to the id emitted from the service, so we can delete the input property here. Gone. 

Update `movies/src/app/movies/movie-list/movie-list.component.html`

```diff
-<app-movie-detail [movieId]="(selectedMovieId$ | async) ?? 0" />
+<app-movie-detail />
```

Well, it's been great fun deleting so much code throughout this demo. Are we ready to give it a try? Let's bring up the browser. 

```bash
npm start
```

Select a movie. Our code highlights the selected entry in blue, and the detail appears. Yay! But notice how slow it is displaying the detail. 

> Notice how slow it is displaying the detail

What if we found the selected movie in the already retrieved array of movies instead of re‑getting it? That could improve performance. To do that, we'll combine observables, next.