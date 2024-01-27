# Subjects

Let's create a _Subject_ that provides a notification whenever the user selects a new product.

We want to share the notification with any of our movie components and we don't want to lose any emissions, so let's add a `BehaviorSubject` to the `movie.service`.

Update `movies/src/app/movies/movie.service.ts`

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

Here, by the declarations, we'll declare a variable for our `BehaviorSubject`. Let's call it `movieSelectedSubject`. We set it equal to a new `BehaviorSubject`.

Next we decide what data to pass when our `BehaviorSubject` emits a next notification. Let's pass the id of the selected movie. In our example, the id is a number, so we'll set the generic parameter to number.

`BehaviorSubject` requires an initial value, so what makes sense for an initial value in this case? If the user has not yet selected a movie, there is no selected movie. We could pass in 0 to indicate no movie since 0 isn't a valid movieId, but that gives the 0 some special magical meaning. Let's instead use `undefined`. That makes sense, because until the user selects a movie, the selected movie is in fact undefined.

We're **seeing an error** here. That's because we defined the type of emissions to be a number. We'll change that to number or undefined.

```diff
- movieSelectedSubject = new BehaviorSubject<number>(undefined)
+ movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined)
```

Now we have a `BehaviorSubject` that emits an initial value to any new subscribers. We want to ensure that no code in the application accesses this BehaviorSubject except code within this service, so we'll add the `private` keyword at the front.

```diff
- movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+ private movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
```

But any code in the application should be able to subscribe to the underlying observable, so let's expose that observable as a public property. We'll call it `movieSelected$`. We use the dollar sign to indicate that it is indeed an observable, and we set it equal to `this.movieSelectedSubject.asObservable`. To ensure we don't accidentally overwrite this value, let's add `readonly` as part of the declaration.

```diff
  private movieSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
+ readonly movieSelected$ = this.movieSelectedSubject.asObservable();
```

We now have a `BehaviorSubject` that emits numeric values or undefined to any subscribers, and we have the readonly observable from that Subject that our components and other services can use to subscribe. Every time the user selects a product, we'll use this `BehaviorSubject` and emit a notification with the `movieId`. We'll do that in a method.

Let's add that method, we'll call it `movieSelected`. It takes in the `selectedMovieId`, which is a number, and returns `void`.

> Our movie‑list.component can call this method when it sees that the user selected a new movie.

Inside the method, we call `this.movieSelectedSubject.next`, and emit the `selectedMovieId`.

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

We now have a method that emits a next notification with the `selectedMovietId`. Now let's call this method from somewhere.

Open `movies/src/app/movies/movie-list/movie-list.component.html`

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

Looking at the movie-lsit template, the HTML displays the set of movies. When a user clicks on a movie, event binding calls `onSelected` in the component and passes in the id of the selected movie. In the `movie‑list.component`, we have that method.

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

```diff
  onSelected(movieId: number): void {
    this.selectedMovieId = movieId;
+   this.movieService.movieSelected(movieId);
  }
```

Instead of setting a local variable, let's call our new service method. That way the `BehaviorSubject` will emit this movie id to any component that subscribes, `this.movieService.movieSelected`, and we pass in the `movieId`.

Every time the user selects a movie, we emit a next notification from that Subject to any subscribers. But we don't yet have any subscribers, and once we do, how do they react to this emission?

## Subscribing to Subjects

Our goal is to react to emissions from this `BehaviorSubject` every time the user selects a movie.

In the `movie‑list.component`, we react by highlighting the selected movie. We could subscribe here to the observable exposed by our `BehaviorSubject`, but then we'd have to implement `OnInit` and `OnDestroy`, declare and manage a subscription, and so on.

Open `movies/src/app/movies/movie-list/movie-list.component.html`

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

Let's instead leverage the _async pipe_ to handle our subscription for us. Looking at the movie‑list template, here we bind to `ngClass`. We set the active style when the id of the movie matches the `selectedMovieId` variable from the movie‑list.component. Let's use an async pipe here, but what do we pipe?

Update `movies/src/app/movies/movie-list/movie-list.component.ts`

Going back to the component, create a local variable that references the observable from the service. We'll call it `selectedMovieId$` and set it equal to `this.movieService.movieSelected$`.

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

Why create this local variable? It's good practice to only bind from a template to a component, not from a template to a service, so for any data we want from the service, we create a local component variable that references the service variable, and let's add readonly to the front to ensure we don't overwrite this variable.

```diff
- selectedMovieId$ = this.movieService.movieSelected$;
+ readonly selectedMovieId$ = this.movieService.movieSelected$;
```

Since the variable here references the observable from the service, subscribing to this variable, subscribes to the observable in the service. Now we don't need the `selectedMovieId` variable, so let's delete it.

```diff
- selectedMovieId: number = 0;
  readonly selectedMovieId$ = this.movieService.movieSelected$;

  onSelected(movieId: number): void {
-   this.selectedMovieId = movieId;
    this.movieService.movieSelected(movieId);
  }
```

Update `movies/src/app/movies/movie-list/movie-list.component.html`

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

In the template, we bind to the `selectedMovieId` observable using the _async pipe_. Just add dollar to reference the new local variable, and | async. Add parentheses so the compiler first evaluates the async pipe. 

Scrolling down, we pass the `selectedMovieId` to the child component here. We'll replace this with the observable as well, add a dollar, | async, and add parentheses around the expression. Now we see a syntax error.

```
✘ [ERROR] NG2: Type 'number | null | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'. [plugin angular-compiler]
```

If the `BehaviorSubject` emits its initial value, the value of `selectedMovieId$` could be undefined. We need to handle that value. One option is to use the nullish coalescing operator, which is two question marks. It returns the right side if the left side is `null` or `undefined`. Let's set the movieId to 0 if no movie is yet selected, since 0 isn't a valid movie identifier.

```diff
-<app-movie-detail [movieId]="(selectedMovieId$ | async)" />
+<app-movie-detail [movieId]="(selectedMovieId$ | async) ?? 0" />
```

It's not good practice to have magic numbers like this 0 here, but we'll remove all of this code in a moment. For now, we want to get this to compile without a null reference error. With this code, the movieId is set to 0 if the selected movieId$ hasn't yet emitted.

Notice that we're using a self‑closing tag when referencing the child component. Self‑closing tags are available in Angular starting with version 15.1. Let's see if that works.

```bash
npm start
```

Run the application with Run, Start Debugging. Select Movie List, click on a movie, and the movie button turns blue. And since we are now again passing the selectedMovieId to the movie‑detail component as an input property, the detail appears. Our movie‑list component is now reacting to the product selection and turning the selected row blue.

Going back to the code, instead of passing the selectedMovieId as an input property, can we change the movie‑detail component to react to our BehaviorSubject as well? Yes we can.
